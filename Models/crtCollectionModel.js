const db = require('../database/Connection'); //Establece la conexión de la base de datos

//Modelo para interactuar con la base de datos = 'crtcollection', que crea los grupos de la colección del usuario
async function createCollection(userName, categoryId, imageCRTCollection, imageHash) {
    try {
        await db.query('INSERT INTO crtcollection (userName, categoryId, imageCRTCollection, imageHash) VALUES (?, ?, ?, ?)', [userName, categoryId, imageCRTCollection, imageHash]);
        console.log('Se Registro la categoría', categoryId, 'para:', userName, '¡satisfactoriamente!');
    } catch (error) {
        console.error('Error al registrar y almacenar la categoría:', error);
        throw error;
    }
}

//Función verifica el usuario con su categoría, para evitar crear de nuevo la misma categoría que ya creo en la BD anteriormente 
async function getCategoryAndUser(categoryId, userName) {
    try {
        const query = 'SELECT * FROM crtcollection WHERE categoryId = ? AND userName = ?';
        const [rows, fields] = await db.query(query, [categoryId, userName]);
        return rows[0]; // Devuelve la primera fila si existe una categoría, de lo contrario, devuelve null
    } catch (error) {
        throw error; // Lanza cualquier error que ocurra durante la consulta
    }
}

//Se crea una clase con el constructor para obtener la lista de las categorías por usuario y su id, para mostrarlo en la vista 'seeCollections.pug' 
class Collection {
    //Constructor para los datos que se desean obtener y mostrar en la vista
    constructor(id, userName, categoryId, imageCRTCollection, registerDate) {
        this.id = id;
        this.userName = userName;
        this.categoryId = categoryId;
        this.imageCRTCollection = imageCRTCollection;
        this.registerDate = registerDate;
    }
}
  
//función para obtener las categorías de un usuario
async function getCollectionsByUser(userName) {
    try {
      const [rows] = await db.query('SELECT * FROM crtcollection WHERE userName = ?', [userName]);
      //Se obtiene la consulta de la clase Collection
      return rows.map(collection => new Collection(
            collection.id,
            collection.userName,
            collection.categoryId,
            collection.imageCRTCollection,
            collection.registerDate
        ));
    } catch (error) {
      console.error('Error al obtener las colecciones:', error);
      throw error;
    }
}

module.exports = {
    createCollection,
    getCategoryAndUser,
    getCollectionsByUser
};