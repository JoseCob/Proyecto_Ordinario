const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); //Se requiere la autenticacion de usuarios para cargar el login
const newCollection = require('../Models/addCollectionModel'); //Se requiere llamar al model y obtener el parametro de categoryId 

//Ruta que obtiene la autenticacion de usuarios, si hay usuario autenticado, lo dirige al addCollection.pug y obtiene sus datos
router.get('/', authMiddleware.authenticate, (req, res) => {
    const categoryId = req.query.categoryId; //obtiene el parametro categoryId por la consulta del modelo
    console.log('Se obtuvo la categoría:', categoryId); //Mensaje en consola que muestra el id de la categoria seleccionada
    // Verificar si categoryId está definido y tiene un valor
    if (categoryId && categoryId!== '') {
        // Verificar si categoryId es un número válido
        const categoryIdNumber = parseInt(categoryId);
        if (!isNaN(categoryIdNumber)) {
            //Verifica si la información del usuario ya está en la sesión
            if (req.session.user) {
                const { firstName, firstSurname } = req.session.user;
                res.render('addCollection', {
                    title: 'Agregar Nuevo Elemento a la Colección',
                    categoryId: categoryIdNumber, //Obtiene categoryId en forma de número
                    firstName: firstName, //Obtiene el Nombre de pila
                    firstSurname: firstSurname //Obtiene el Primer Apellido
                });
            //En caso de no obtener los datos, lo dirige al addCollection sin los datos previos
            } else {
                res.render('addCollection', { title: 'Agregar Nuevo Elemento a la Colección', categoryId: categoryIdNumber });
            }
        //Si categoryId no es un número válido, redirige el usuario en la página de inicio
        } else {
            res.redirect('/');
        }
    //Si categoryId no está definido o está vacío, redirige el usuario en la página de inicio
    } else {
        res.redirect('/');
    }
});

/*Ruta POST que nos sirve para obtener los datos del formulario 'addCollection.pug' al clickear la url del botón con la clase 
'btn-add'(agregar consulta) de la vista 'seeCollections.pug', su url: href=`/addCollection?categoryId=${collection.categoryId}`
Basicamente llama a las propiedades del formulario como un argumento en 'addCollectionController.js' para registrar los datos mediante 
el controlador y el model. En este caso el Model se encarga de hacer la consulta, con la ayuda de las propiedas declaradas 
en el controlador 'addCollectionController.js'*/
router.post('/', authMiddleware.authenticate, async (req, res) => {
    try {
        //desestructuración que extrae los valores o los datos de las siguientes propiedades del formulario al objeto 'req.body'
        const {
            userName,
            categoryId,
            nameCollection,
            collectionCreator,
            collectionSponsor,
            installment,
            imgAddCollection,
            imageIdentifier,
            publicationDate,
            Genre,
            descriptionCollection
        } = req.body;

        /*Añade un nueva coleccion, llamando la consulta proporcionada por el modelo de 'addCollectionModel.js' con los datos 
        extraidos del desestructuración del objeto req.body*/
        await newCollection.addCollection(
            userName,
            categoryId,
            nameCollection,
            collectionCreator,
            collectionSponsor,
            installment,
            imgAddCollection,
            imageIdentifier,
            publicationDate,
            Genre,
            descriptionCollection
        );

        //Renderiza la vista con el id de la categoria y el usuario al formulario 'addCollection.pug'
        res.render('addCollection', {
            title: 'Agregar Nuevo Elemento a la Colección',
            categoryId: categoryId,
            firstName: req.session.user.firstName,
            firstSurname: req.session.user.firstSurname
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al agregar la colección');
    }
});

module.exports = router;