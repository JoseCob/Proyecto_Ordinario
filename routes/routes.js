//Rutas requeridas para routes.js
const express = require('express');
const router = express.Router();

//Rutas para navegar en las opciones de la app
const index = require('./index'); //Llama al archivo index.js con la variable index
const login = require('./login'); //Llama al archivo login.js con la variable login
const register = require('./register'); //Llama al archivo register.js con la variable register
const registerUser = require('./register-user'); //Llama al archivo donde estan los usuarios ya registrados

router.use('/', index); //Usa el archivo index.js mediante el parametro '/' con la variable index para mostrar el resultado de la vista al usuario
router.use('/login', login); //Usa el archivo login.js mediante el parametro '/login' con la variable login para mostrar el resultado de la vista al usuario
router.use('/register', register); //Usa el archivo register.js mediante el parametro '/register' con la variable register para mostrar el resultado de la vista al usuario
router.use('/register-user', registerUser); //Usa el archivo register-user.js mediante el parametro '/register-user' con la variable registerUser para guardar los "registros de usuarios" de la vista register.pug

module.exports = router;