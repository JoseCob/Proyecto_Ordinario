//Rutas requeridas para routes.js
const express = require('express');
const router = express.Router();

//Rutas para navegar en las opciones de la app
const index = require('./index'); //Llama al archivo index.js con la variable index

router.use('/', index);//Usa el archivo index.js mediante el parametro '/' con la variable index para mostrar el resultado de la vista al usuario


module.exports = router;