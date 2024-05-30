//Rutas requeridas para routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); // Importa el middleware de autenticación para solicitar el inicio de sesión

//Rutas para navegar en las opciones de la app
const index = require('./index'); //Llama al archivo index.js con la variable index
const login = require('./login'); //Llama al archivo login.js con la variable login
const register = require('./register'); //Llama al archivo register.js con la variable register
const registerUser = require('./register-user'); //Llama al archivo donde estan los usuarios ya registrados
//Vistas de las colecciones
const crtCollection = require('./crtCollection'); //Llama a la vista de Crear Colección(crtCollection.js)
const seeCollections = require('./seeCollections'); //Llama a la vista de ver Colecciones(seeCollections.js)
const addCollection = require('./addCollection'); //Llama a la vista de agregar Colección(addCollection.js)
const lookCollection = require('./lookCollection') //Llama a la vista de mirar Colección(lookCollection.js)

//Rutas de autenticación (no protegidas) antes de iniciar sesión
router.use('/login', login); //Usa el archivo login.js mediante el parámetro '/login' con la variable login para mostrar el resultado de la vista al usuario
router.use('/register', register); //Usa el archivo register.js mediante el parámetro '/register' con la variable register para mostrar el resultado de la vista al usuario
router.use('/register-user', registerUser); //Usa el archivo register-user.js mediante el parámetro '/register-user' con la variable registerUser para guardar los "registros de usuarios" de la vista register.pug

//Middleware para proteger rutas
//Se debe de añadir antes para que todas las demas rutas se puedan usar libremente al iniciar sesión
router.use(authMiddleware.authenticate); //Aplica el middleware de autenticación a todas las rutas siguientes

//Rutas protegidas
router.use('/', index); //Usa el archivo index.js mediante el parámetro '/' con la variable index para mostrar el resultado de la vista al usuario
router.use('/crtCollection', crtCollection); //Usa el archivo crtCollection.js mediante el parámetro '/crtCollection' con la variable crtCollection para mostrar el resultado de la vista al usuario
router.use('/seeCollections', seeCollections); //Usa el archivo seeCollections.js
router.use('/addCollection', addCollection); //Usa el archivo addCollection.js
router.use('/lookCollection', lookCollection); //Usa el archivo lookCollection.js
module.exports = router;