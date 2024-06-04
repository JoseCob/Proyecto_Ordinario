const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); //Se requiere la autenticacion de usuarios para cargar el login
const crtCollectionController = require('../controllers/crtCollectionController'); //Controlador para crear las categorias 

// Ruta para ver las colecciones del usuario y su autenticación
router.get('/', authMiddleware.authenticate, crtCollectionController.seeCollections);
router.get('/addCollection', (req, res) => {
    const categoryId = req.query.categoryId;
    res.render('addCollection', { categoryId: categoryId });
});

module.exports = router;