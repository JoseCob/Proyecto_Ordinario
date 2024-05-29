const express = require('express');
const router = express.Router();

//Ruta para llamar el inicio de la página
router.get('/', (req, res) => {
    res.render('register', {title: 'Registro'});
});

module.exports = router;