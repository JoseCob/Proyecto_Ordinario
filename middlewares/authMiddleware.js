const jwt = require('jsonwebtoken'); //Dependencia para el token
const bcrypt = require('bcrypt'); //Dependencia para generar contraseñas hash "cifrado Blowfish"
const dotenv = require('dotenv'); //cargar variables de entorno desde un archivo ".env"

//Configura dotenv para cargar las variables de entorno desde un archivo ".env"
dotenv.config();

//Función para la autentificación del token del usuario registrado con temporizador de 1 hora
async function authenticate(req, res, next){
    //constante que verifica si hay un token en las cookies de la solicitud
    const token = req.cookies.token;

    // si no hay token, redirige al usuario al login
    if(!token) {
        return res.redirect('/login');
    }

    try{
        //constante que verifica el token usando la clave secreta = 'ACCESS_TOKEN_SECRET'
        const decoded = jwt.verify(token, process.env.SESSION_SECRET); // esta constante esta codificando el token secreto (clave secreta) con la clave "SESSION_SECRET" del .env

        //Almacena el ID del usuario en la solicitud para su posterior uso
        req.userId = decoded.userId;

        next();

    } catch (err) {
        //si hay un error en la verificación del token, redirige al usuario al login}
        return res.redirect('/login'); 
    }
}
// Función para generar un token JWT
function generateToken(userId) {
    // Crea un token con el ID de usuario y una clave secreta que expira en 1 hora
    return jwt.sign({ userId }, process.env.SESSION_SECRET, { expiresIn: '1h' });
}

//Función para generar la constraseña hash
async function getHash(passwordString) {
    if (!passwordString) {
        throw new Error('No se proporcionó una contraseña para generar el hash.');
    }
    const saltRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS);//Importante tenerlo en el .env para generar el salto de rondas de la contraseña
    if (isNaN(saltRounds)) {
        throw new Error('El número de rondas de sal no está definido correctamente.');
    }
    const passwordHash = await bcrypt.hash(passwordString, saltRounds);
    return passwordHash;
}

//Función que compara la constraseña antes de generar el hash
async function comparePassword(passwordString, dbHash) { /*Función que se encarga de comparar una contraseña proporcionada en texto sin cifrar 
    Tomando 2 argumentos: passwordString que contiene el texto sin cifrar y dbHash que es el hash de la contraseña almacenada en la base de datos. */
    const compareHashes = await bcrypt.compare(passwordString, dbHash); /* Constante 'compareHashes' que compara la contraseña en texto sin cifrar 
    con el hash de contraseña almacenado en la base de datos mediante el argumento dbHash */
    return compareHashes; // Devuelve la comparación de la contraseña, si coinciden o no coinciden 
}

module.exports = {
    authenticate,
    generateToken,
    getHash,
    comparePassword
};