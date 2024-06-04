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

//Se crea una clase con el constructor para obtener la lista de las categorías por usuario y su id, para mostrarlo en la vista 'seeCollections.pug' 
class Collection {
    //Constructor para los datos que se desean obtener y mostrar en la vista
    constructor(id, userName, categoryId, nameCollection, collectionCreator, collectionSponsor, installment, imgAddCollection, publicationDate, Genre, descriptionCollection) {
        this.id = id;
        this.userName = userName;
        this.categoryId = categoryId;
        this.nameCollection = nameCollection;
        this.collectionCreator = collectionCreator;
        this.collectionSponsor = collectionSponsor;
        this.installment = installment;
        this.imgAddCollection = imgAddCollection;
        this.publicationDate = publicationDate;
        this.Genre = Genre;
        this.descriptionCollection = descriptionCollection
    }
}
  
//función para obtener las colecciones de las categorías de un usuario
async function getCollectionBycategory(userName) {
    try {
      const [rows] = await db.query('SELECT * FROM addcollection WHERE userName = ?', [userName]);
      //Se obtiene la consulta de la clase Collection
      return rows.map(collection => new Collection(
            collection.id,
            collection.userName,
            collection.categoryId,
            collection.nameCollection,
            collection.collectionCreator,
            collection.collectionSponsor,
            collection.installment,
            collection.imgAddCollection,
            collection.publicationDate,
            collection.Genre,
            collection.descriptionCollection
        ));
    } catch (error) {
      console.error('Error al obtener las colecciones:', error);
      throw error;
    }
}

module.exports = {
    addCollection,
    getCollectionBycategory
};
