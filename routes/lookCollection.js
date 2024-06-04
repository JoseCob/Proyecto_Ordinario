const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); //Se requiere la autenticacion de usuarios para cargar el login
const addCollectionController = require('../controllers/addCollectionController'); //Controlador para añadir la coleccion a la categoría

// Ruta para ver las colecciones del usuario y su autenticación
router.get('/', authMiddleware.authenticate, addCollectionController.lookCollection);
router.get('/lookCollection', (req, res) => {
    const categoryId = req.query.categoryId;
    res.render('lookCollection', { categoryId: categoryId });
});


module.exports = router;