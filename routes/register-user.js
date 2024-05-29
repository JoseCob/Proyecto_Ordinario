const express = require('express');
const router = express.Router();
const users = require('../database/tables/users'); //Archivo contenedor de querys para MySQL, que es solicitado en el archivo server.js
const authMiddleware = require('../middlewares/authMiddleware');//Ruta que contiene la autentificacion hash y token secret en "authMiddleware.js"

// Ruta que maneja el registro de los usuarios, los valores se obtienen de la vista, en este caso de "register.pug"
router.post('/', async (req, res) => {
    const { firstName, firstSurname, secondSurname, userName, email, password, confirmPassword } = req.body;

    //verifica si la contraseña y la confirmación de contraseña coinciden
    if ( password !== confirmPassword ) {
        return res.status(400).send('Las contraseñas no coinciden');
    }

    //Conprueba los datos del usuario al registrarse 
    try {
        // Verificar si el usuario ya está registrado por medio del nombre de usuario en la bd
        const userNameExistent = await users.getuserName(userName);
        if(userNameExistent) {
            console.log('El usuario:', userName, '¡Ya existe en la base de datos!'); //Mensaje en la terminal del usuario ya existente
            return res.status(400).send('Nombre de usuario ya registrado');
        }
        
        //hash de la contraseña generado en "authMiddleware.js"
        const hashedPassword = await authMiddleware.getHash(password);

        // Registra el usuario en la base de datos
        await users.register(firstName, firstSurname, secondSurname, userName, email, hashedPassword)
        .catch(error => {
          console.error('Error al registrar usuario:', error);
          res.status(500).send('Error interno del servidor al registrar usuario');
        });

        // Registra el usuario satisfactoriamente y lo dirige al login de la app
        res.redirect('/login');

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;