const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); //Se requiere la autenticacion de usuarios para cargar el login

//Ruta que obtiene la autenticacion de usuarios, si hay usuario autenticado, lo dirige al index.pug y obtiene sus datos
router.get('/', authMiddleware.authenticate, (req, res) => {
    //Verifica si la información del usuario ya está en la sesión
    if (req.session.user) {
        const { firstName, firstSurname } = req.session.user;
        res.render('index', {
            title: '¡Bienvenido a ProdManagement!',
            firstName: firstName, //Obtiene el Nombre de pila
            firstSurname: firstSurname //Obtiene el Primer Apellido
        });
    //En caso de no obtener los datos, lo dirige al index sin los datos previos
    } else {
        res.render('index', { title: '¡Bienvenido a ProdManagement!' });
    }
});

module.exports = router;