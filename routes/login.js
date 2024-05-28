const express = require('express');
const router = express.Router();

//Ruta para llamar el inicio de la página
router.get('/', (req, res) => {
    res.render('login', {title: 'Inicia Sesión con tu cuenta'});
});

module.exports = router