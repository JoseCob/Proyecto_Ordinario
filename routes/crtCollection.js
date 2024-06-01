const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); //Se requiere la autenticacion de usuarios para cargar el login

//Ruta GET que obtiene la autenticacion de usuarios, si hay usuario autenticado, lo dirige al crtCollection.pug y obtiene sus datos
router.get('/', authMiddleware.authenticate, (req, res) => {
    //Verifica si la información del usuario ya está en la sesión
    if (req.session.user) {
        const { firstName, firstSurname } = req.session.user; //Obtiene la información del usuario de la sesión
        res.render('crtCollection', {
            title: 'Crear Colección',
            firstName: firstName, //Obtiene el Nombre de pila
            firstSurname: firstSurname //Obtiene el Primer Apellido
        });
    //En caso de no obtener los datos, lo dirige al crtCollection sin los datos previos del usuario
    } else {
        res.render('crtCollection', { title: 'Crear Colección' });
    }
});

module.exports = router;