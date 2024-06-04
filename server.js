//Variables principales del sistema para trabajar con express
const express = require('express');
const app = express();
const path = require('path');

//Dependencias utilizadas por node.js para el proyecto
const dotenv = require('dotenv') //cargar variables de entorno desde un archivo ".env"
const session = require('express-session'); //middleware para la gestión de sesiones en aplicaciones web, para mantener el estado de la sesión del usuario a través de múltiples solicitudes HTTP. 
const passport = require('passport'); //middleware de autenticación.  Proporciona una forma sencilla y flexible de autenticar usuarios en aplicaciones web y servicios API. Permite la autenticación de TOKENS 'JWT' 
const LocalStrategy = require('passport-local').Strategy; //Sirve para autenticar usuarios utilizando un nombre de usuario y una contraseña almacenados localmente en una base de datos. Es una estrategia de autenticación proporcionada por Passport 
const cookieParser = require('cookie-parser'); //middleware que permite acceder fácilmente a las cookies, analiza las cookies de la solicitud y las hace accesibles en req.cookies
const flash = require('connect-flash'); //Sirve para gestión de mensajes flash. Mensajes que se muestran al usuario en una sola solicitud y luego se borran en la siguiente solicitud

//Rutas o carpetas de la app
const authMiddleware = require('./middlewares/authMiddleware'); //Requiere la carpeta middlewares, "middleware personalizado". Ruta que contiene la autentificacion hash y token secret 'JWT' en "authMiddleware.js"
const users = require('./database/tables/users'); //Requiere la carpeta database, donde contiene el archivo contenedor de querys para MySQL, en este caso para registrar usuarios de nuestra bd
const router = require('./routes/routes'); //Requiere la carpeta routes, del archivo routes.js para ejecutar las vistas del usuario
const registerLogin = require('./database/tables/registerLogin'); //Ruta para la consulta del login
const registerLogout = require('./database/tables/registerLogout'); //Ruta para la consulta del logout

//Configuraciones
app.use(cookieParser()); //Configura Cookie Parser. Nos permite acceder fácilmente a las cookies den las peticiones del servidor entrantes. 
dotenv.config(); //Configura dotenv para cargar las variables de entorno desde un archivo ".env"
app.use(flash()); //Configura connect-flash
//Configuración de express-session para manejar sesiones
app.use(session({
    secret: process.env.SESSION_SECRET, //Clave secreta para firmar la cookie de sesión del archivo .env
    resave: false, //Evita la re-grabación de sesiones no modificadas.
    saveUninitialized: false //Evita guardar sesiones vacías en el almacén de sesiones.
}));
//Configuración del passport.js
app.use(passport.initialize()); //Inicializa el proceso de autenticación de Passport
app.use(passport.session()); //Esto permite que Passport recuerde la autenticación del usuario entre diferentes páginas o acciones dentro de la aplicación.

//Llamamos a initializeConnection para establecer la conexión de las consultas de la base de datos de MySQL
users.initializeConnection();
//Configuracion del LocalStrategy de autenticación local
passport.use(new LocalStrategy({
    //Se define los campos userName y password para autenticar los usuarios de la vista login.pug
    usernameField: 'userName',
    passwordField: 'password'
}, authenticateUserName)); //Función que se va a encarga de autenticar a los usuarios.

//función que realiza la autenticación del usuario
async function authenticateUserName(userName, password, done) {
    try {
        const user = await users.getuserName(userName);
        if (!user) {
            return done(null, false, { message: 'El Usuario o la Contraseña Son Incorrectos' });
        }

        const authPassword = await authMiddleware.comparePassword(password, user.passwordHash);
        if (!authPassword) {
            return done(null, false, { message: 'El Usuario o la Contraseña Son Incorrectos' });
        }
        
        // Registra el inicio de sesión del usuario utilizando su nombre de usuario
        await registerLogin.registerLogin(userName);
  
        console.log('El Usuario:', userName, 'Inicio Sesión Exitosamente');
        return done(null, user);

    } catch (err) {
        console.error('Error al autentificar usuarios:', err);
        return done(err);
    }
}

//Serializador y deserialidor de usuarios con Passport.js y 'done'
passport.serializeUser((user, done) => { //Función para convertir el usuario en un identificador para almacenarlo en la sesión cuando se autentica correctamente. 
    done(null, user.id); //Se serializa el usuario utilizando su Id, para transformarlo en id
});

//Se establece el objeto llamdo: 'userCache', que servirá de caché temporal para almacenar usuarios deserializados en representación de id
const userCache = {}; 

//Deserializa el id del usuario almacenado en la sesión, para obtener los datos del usuario almacenados
passport.deserializeUser(async (id, done) => {
    try {
        //Si el usuario está en la caché, retorna o devuelve ese usuario ya registrado
        if (userCache[id]) {
            return done(null, userCache[id]);
        }
        //De lo contrario, realizar la consulta a la base de datos utilizando el id en la serialización
        const user = await users.getIdUser(id);
        //Almacena el usuario en la caché si apenas se registro en la página
        userCache[id] = user;
        //Retorna el usuario encontrado en la página
        return done(null, user);
  
    } catch (error) {
        // Si hay un error, retornar el error
        return done(error, null);
    }
});

//Ruta que informa una página de error al no cargar correctamente el servicio o la solicitud por parte del servidor
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal');
});

//Este middleware se utiliza para analizar los datos enviados mediante formularios HTML. Parsea los datos codificados en 'URL' y los expone en 'req.body'. Ejemplo: 'application/x-www-form-urlencoded)'
app.use(express.urlencoded({ extended: true })); //Se debe de cargar antes de la Ruta raíz o inicio de la página al ejecutar la app

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.static('assets'));
app.use(express.json());

//Ruta para ejecutar el servidor
app.use('/', router);

//Ruta para cerrar sesión desde la Ruta raíz al ejecutar la app
app.get('/logout', authMiddleware.authenticate, async (req, res) => {
    // Verifica si el usuario está autenticado antes de cerrar la sesión
    if (req.isAuthenticated() || req.user) {
        const userName = req.user.userName; // Obtén el nombre de usuario del usuario autenticado
        
        try {
            // Registra el cierre de sesión
            await registerLogout.registerLogout(userName);
            console.log('Cierre de sesión registrado para el usuario:', userName);
        } catch (error) {
            console.error('Error al registrar el cierre de sesión:', error);
        }
    }
    
    // Cierra la sesión del usuario
    req.logout(function(err) {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).send('Error al cerrar sesión');
        }

        // Elimina la sesión y las cookies
        req.session.destroy((err) => {
            if (err) {
                console.error('Error al destruir la sesión:', err);
                return res.status(500).send('Error al cerrar sesión');
            }
            console.log('Sesión finalizada correctamente');
        
            // Redirige al usuario al inicio
            res.clearCookie('token');
            res.redirect('/login');
        });
    });
});

//Puerto para iniciar la app
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});