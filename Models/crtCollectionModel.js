const db = require('../database/Connection'); //Establece la conexión de la base de datos

//Modelo para interactuar con la base de datos = 'crtcollection', que crea los grupos de la colección del usuario
async function createCollection(userName, categoryCollection, imageCRTCollection ) {
    try {
        await db.query('INSERT INTO crtcollection (userName, categoryCollection, imageCRTCollection) VALUES (?, ?, ?)', [userName, categoryCollection, imageCRTCollection]);
        console.log('Se Registro la categoría', categoryCollection, 'para:', userName, '¡satisfactoriamente!');
    } catch (error) {
        console.error('Error al registrar y almacenar la categoría:', error);
        throw error;
    }
}

module.exports = {
    createCollection
};