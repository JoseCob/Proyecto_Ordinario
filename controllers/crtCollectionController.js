/*Este controlador unicamente contiene los elementos a registrar en crear colección = Vista crtCollection.pug*/
//Controlador para almacenar los grupos de la colección en la base de datos con el model = 'crtCollectionModel.js'.
const newCollection = require('../Models/crtCollectionModel');//Se importa el Model donde se crea la colección
const sharp = require('sharp');

async function crtCollection(req, res) {
    const { categoryCollection } = req.body;
    const userName = req.user.userName;

    let imageCRTCollection = null;
    if (req.file) {
        // Comprime la imagen antes de almacenarla
        const compressedImage = await sharp(req.file.buffer)
            .resize({ width: 800 }) // Ajusta el tamaño según sea necesario
            .toBuffer();
        imageCRTCollection = compressedImage;
    }

    try {
        await newCollection.createCollection(userName, categoryCollection, imageCRTCollection);
        res.redirect('/seeCollections');
    } catch (error) {
        console.error('Error al crear la colección:', error);
        res.status(500).send('Error al crear la colección');
    }
}

module.exports = {
    crtCollection
};