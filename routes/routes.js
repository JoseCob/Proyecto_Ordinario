//Rutas requeridas para routes.js
const express = require('express');
const router = express.Router();
//Middlewares
const authMiddleware = require('../middlewares/authMiddleware'); //Importa el middleware de autenticación para solicitar el inicio de sesión
const uploadMiddleware = require('../middlewares/uploadMiddleware'); //Se importa el middleware del multer
const otherUploadMiddleware = require('../middlewares/otherUploadMiddleware'); //Se importa el middleware del multer para otros formatos de imagenes
//Controllers
const crtCollectionController = require('../controllers/crtCollectionController'); //Controlador para crear la categoría de la colección
const addCollectionController = require('../controllers/addCollectionController'); //Controlador para añadir la coleccion a la categoría

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
const searchCollection = require('./searchCollection');

//Rutas de autenticación (no protegidas) antes de iniciar sesión
router.use('/login', login); //Usa el archivo login.js mediante el parámetro '/login' con la variable login para mostrar el resultado de la vista al usuario
router.use('/register', register); //Usa el archivo register.js mediante el parámetro '/register' con la variable register para mostrar el resultado de la vista al usuario
router.use('/register-user', registerUser); //Usa el archivo register-user.js mediante el parámetro '/register-user' con la variable registerUser para guardar los "registros de usuarios" de la vista register.pug

//Middleware para proteger rutas
//Se debe de añadir antes para que las demas rutas que se van a usar libremente, sean despuesde de autenticar el usuario al iniciar sesión
router.use(authMiddleware.authenticate); //Aplica el middleware de autenticación a todas las rutas siguientes del middleware

//Rutas protegidas por el middleware
router.use('/', index); //Usa el archivo index.js mediante el parámetro '/' con la variable index para mostrar el resultado de la vista al usuario
router.use('/crtCollection', crtCollection); //Usa el archivo crtCollection.js mediante el parámetro '/crtCollection' con la variable crtCollection para mostrar el resultado de la vista al usuario
router.use('/seeCollections', seeCollections); //Usa el archivo seeCollections.js
router.use('/addCollection', addCollection); //Usa el archivo addCollection.js
router.use('/lookCollection', lookCollection); //Usa el archivo lookCollection.js
router.use('/search-Collection', searchCollection);//Usa el archivo searchCollection.js


/*-- Rutas POST --*/
/*Llama al controlador='crtCollectionController' para crear nuevas colecciones con el authMiddleware, la función uploadMiddleware 
y la funcion crtCollection con el fin de obtener los datos , habiendo un usuario autenticado en la sesión y que este pueda crear las colecciones*/
router.post('/create-crtCollection',  authMiddleware.authenticate, uploadMiddleware, crtCollectionController.crtCollection);
//Llama al controlador 'addCollectionController', con la autenticacion, el middleware para formatos de imagenes y para crea las colecciones
router.post('/add-Collection',  authMiddleware.authenticate, otherUploadMiddleware, addCollectionController.createAddCollection);

module.exports = router;