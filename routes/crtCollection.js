const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); //Se requiere la autenticacion de usuarios para cargar el login

//Ruta que obtiene la autenticacion de usuarios, si hay usuario autenticado, lo dirige al crtCollection.pug y obtiene sus datos
router.get('/', authMiddleware.authenticate, (req, res) => {
    //Verifica los datos del usuario para llamarlo en la vista en cualquier momento
    if (req.user) {
        const { firstName, firstSurname } = req.user;
        res.render('crtCollection', {
            title: 'Crear Colección',
            firstName: firstName, //Obtiene el Nombre de pila
            firstSurname: firstSurname //Obtiene el Primer Apellido
        });
        //En caso de no obtener los datos, lo dirige al index sin los datos previos
    } else {
        res.render('crtCollection', { title: 'Crear Colección' });
    }
});

module.exports = router;