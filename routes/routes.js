//Rutas requeridas para routes.js
const express = require('express');
const router = express.Router();

//Rutas para navegar en las opciones de la app
const index = require('./index'); //Llama al archivo index.js con la variable index
const login = require('./login') //Llama al archivo login.js con la variable login
const register = require('./register')

router.use('/', index);//Usa el archivo index.js mediante el parametro '/' con la variable index para mostrar el resultado de la vista al usuario
router.use('/login', login);
router.use('/register', register);

module.exports = router;