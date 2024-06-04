const express = require('express');
const router = express.Router();
const newCollection = require('../Models/addCollectionModel'); //Se importa el Model donde se crea la colección para buscar la colección de cada categoría

router.get('/', async (req, res) => {
    const query = req.query.search.toLowerCase();
    const collections = await newCollection.getAllCollections();
    const collectionsFiltered = collections.filter(collection =>
        collection.nameCollection.toLowerCase().includes(query) ||
        collection.descriptionCollection.toLowerCase().includes(query) ||
        collection.Genre.toLowerCase().includes(query) ||
        collection.collectionSponsor.toLowerCase().includes(query)
    );
    res.render('lookCollection', { title: 'Resultados de la Búsqueda', collections: collectionsFiltered, user: req.user!= null? `${req.user.userName}` : '' });
});

module.exports = router;
