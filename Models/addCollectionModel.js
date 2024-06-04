const db = require('../database/Connection'); // Establece la conexión de la base de datos

// Modelo para interactuar con la base de datos 'addcollection', que crea las colecciones destinado a una categoría por el usuario
async function addCollection(userName, categoryId, nameCollection, collectionCreator, collectionSponsor, installment, imgAddCollection, imageHash, publicationDate, Genre, descriptionCollection) {
    try {
        // Inserta la colección en la tabla addcollection
        await db.query('INSERT INTO addcollection (userName, categoryId, nameCollection, collectionCreator, collectionSponsor, installment, imgAddCollection, imageHash, publicationDate, Genre, descriptionCollection) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [userName, categoryId, nameCollection, collectionCreator, collectionSponsor, installment, imgAddCollection, imageHash, publicationDate, Genre, descriptionCollection]);
        console.log('Se añadió la colección', nameCollection, 'del usuario:', userName, '¡satisfactoriamente!');
    } catch (error) {
        console.error('Error al registrar y añadir la colección:', error);
        throw error;
    }
}

module.exports = {
    addCollection
};
