const newCollection = require('../Models/addCollectionModel'); //Se importa el Model donde se crea la colección
const sharp = require('sharp'); //Dependencia requerida para la compresión de imágenes
const NodeCache = require('node-cache'); //Dependencia requerida para mejorar el rendimiento y la velocidad de recursos o datos que se utilizan con frecuencia en la memoria
const crypto = require('crypto'); //Requerido para encriptar el hash de las imágenes
const cache = new NodeCache({ stdTTL: 3600 }); //Configuración del TTL, se establece en 1 hora = 3600, para expirar la caché de la solicitud en espera

//Función para generar un identificador único para la imagen basado en su hash
function generateImagehash(imageBuffer) {
    const hash = crypto.createHash('sha256'); //Genera el hash con base en el algoritmo SHA-256 por la dependencia crypto.
    hash.update(imageBuffer); //Actualiza el hash en forma de búfer que contendrá los datos de la imagen
    return hash.digest('hex'); //Finaliza el proceso de hashing y devuelve el hash como resultado en formato hexadecimal
}

//Función que crea la colección mediante la solicitud y respuesta HTTP al objeto = 'req.body'
async function createAddCollection(req, res) {
    //Constante para las propiedades del formulario 'addCollection.pug'
    const {nameCollection, collectionCreator, collectionSponsor, installment, publicationDate, Genre, descriptionCollection } = req.body;
    //Si la fecha de publicación está vacía, asigna null
    let newPublicationDate = publicationDate;
    if (!publicationDate) {
        newPublicationDate = null;
    }
    //Si la Descripción y el género de la colección es vacia, añade por defecto 'S/E' = sin especificar
    let newDescription = descriptionCollection;
    if (!descriptionCollection) {
      newDescription = 'S/E';
    }
    let newGenre = Genre;
    if (!Genre) {
      newGenre = 'S/E';
    }
    const userName = req.session.user.userName; //Constante que obtiene el nombre del usuario que realiza la solicitud
    const categoryId = req.body.categoryId; //Constante que obtiene el id de la categoria en la url
    //Variable que se utilizará para almacenar la imagen y el identificador de imagen de la colección al comprimirse, puede ser nulo o vacío la propiedad
    let imgAddCollection = null;
    let imageIdentifier = null;

    //Verifica si hay errores de validación de archivo en la solicitud mediante el 'otherUploadMiddleware.js' que contiene la validación
    if (req.fileValidationError) {
        //Si existe un error, se renderiza la plantilla addCollection.pug con un mensaje de error.
        return res.render('addCollection', {
            title: 'Agregar Nuevo Elemento a la Colección', //Título de la vista
            errorMessage: req.fileValidationError, //Mensaje de error
            categoryId: req.query.categoryId, //Constante que obtiene el id de la categoria en la consulta del model
            firstName: req.session.user.firstName, //Devuelve el Nombre de pila del usuario
            firstSurname: req.session.user.firstSurname //Devuelve el primer Apellido del usuario
        });
    }

    //Verifica si hay un archivo adjunto en la solicitud y si el tamaño del archivo es mayor a 1M
    if (req.file && req.file.size > 1 * 1024 * 1024) {
        return res.render('addCollection', {
            title: 'Agregar Nuevo Elemento a la Colección',
            errorMessage: 'El archivo excede el límite permitido de 1M.',
            categoryId: req.query.categoryId,
            firstName: req.session.user.firstName,
            firstSurname: req.session.user.firstSurname
        });
    }

    //Verifica si hay un archivo adjunto en la solicitud. Si hay un archivo, este procede a procesarlo, para ser exactos la propia imagen.
    if (req.file) {
        try {
            //Se obtiene el identificador de la imagen en hash generado por del crypto con la llamada de la función generateImagehash con la solicitud 'file.buffer'
            imageIdentifier = generateImagehash(req.file.buffer);

            //Verifica si la imagen ya está en caché
            let cachedImage = cache.get(imageIdentifier);
            if (!cachedImage) {
                //Constante que obtiene la imagen comprimida mediante la dependencia sharp por medio de la solicitud 'file.buffer'
                const compressedImage = await sharp(req.file.buffer)
                    .resize({ width: 800 }) //Modifica el tamaño de la imagen
                    .toBuffer(); //Se almacena en el buffer
                
                    //Verifica si la Imagen comprimida se excede los 64MB por parte del servidor
                if (compressedImage.length > 64 * 1024 * 1024) {
                    return res.render('addCollection', {
                        title: 'Agregar Nuevo Elemento a la Colección',
                        errorMessage: 'El archivo comprimido excede el límite permitido de 64M por parte del servidor.',
                        categoryId: req.query.categoryId,
                        firstName: req.session.user.firstName,
                        firstSurname: req.session.user.firstSurname
                    });
                }
                imgAddCollection = compressedImage; //Devuelve la imagen comprimida en la variable 'imgAddCollection'
                cache.set(imageIdentifier, compressedImage); //Coloca en caché el identificador de la imagen comprimida
            } else {
                imgAddCollection = cachedImage; //Evita tener que volver a procesar la imagen si ya ha sido procesada y almacenada en la caché
            }
        } catch (error) {
            //Si ocurre un error al procesar la imagen, genera un mensaje de error y lo retorna a la vista = 'addCollection.pug'
            console.error('Error al procesar la imagen:', error);
            return res.render('addCollection', {
                //Datos de la vista
                title: 'Agregar Nuevo Elemento a la Colección', // Título de la vista
                errorMessage: 'Error al procesar la imagen.', //Mensaje de error
                categoryId: req.query.categoryId,
                firstName: req.session.user.firstName, //Devuelve el Nombre de pila del usuario
                firstSurname: req.session.user.firstSurname //Devuelve el Primer Apellido del usuario
            });
        }
    }
    
    try {
        req.session.categoryId = categoryId;
        //Insertar la colección en la base de datos
        await newCollection.addCollection(userName, categoryId, nameCollection, collectionCreator, collectionSponsor, installment, imgAddCollection, imageIdentifier, newPublicationDate, newGenre, newDescription);
        res.render('addCollection', {
        title: 'Agregar Nuevo Elemento a la Colección',
        categoryId: req.session.categoryId,
        errorMessage: 'Se creo la colección exitosamente.',
        firstName: req.session.user.firstName,
        firstSurname: req.session.user.firstSurname
    });
        delete req.session.errorMessage;
        console.log('La colección', categoryId, 'y la imagen:', imgAddCollection, 'se guardó en la base de datos, ¡Satisfactoriamente!');
        if (imageIdentifier) {
            console.log('hash de la imagen generado:', imageIdentifier);
        } else {
            console.log('No se adjuntó ninguna imagen.'); //Muestra un mensaje en consola, si no se selecciono o subio una imagen a la base de datos 
        }
    } catch (error) {
        //Muestra un mensaje a la vista del usuario y lo retorna en consola si el servidor detecta el valor máximo permitido en archivos, en este caso en imágenes
        if (error.code === 'ER_NET_PACKET_TOO_LARGE') {
            console.error('Error: El archivo comprimido excede el límite permitido de 64M por parte del servidor.');
            return res.status(500).render('addCollection', {
                title: 'Agregar Nuevo Elemento a la Colección',
                errorMessage: 'El archivo comprimido excede el límite permitido de 64M por parte del servidor.',
                categoryId: req.session.categoryId,
                firstName: req.session.user.firstName,
                firstSurname: req.session.user.firstSurname
            });
        }
        //Si ocurre un error al intentar guardar la imagen, imprime un mensaje de error al usuario y dirígelo a la misma vista = 'crtCollection.pug'
        console.error('Error al crear la colección:', error);
        res.status(500).render('addCollection', {
            title: 'Agregar Nuevo Elemento a la Colección', //Título de la vista
            errorMessage: 'Error al crear la colección.', //Mensaje de error
            categoryId: categoryId, //Devuelve el Id del modelo en caso de algun error inesperado en la pagina
            firstName: req.session.user.firstName, //Devuelve el Nombre de pila del usuario
            firstSurname: req.session.user.firstSurname //Devuelve el Primer Apellido del usuario
        });
    }
}

//Funcion para darle formato a la fecha como 'día/mes/año' al publicationDate de la base de datos
function formatDate(date) {
    const d = new Date(date); //Constante para obtener el día, mes y año
    const day = String(d.getDate()).padStart(2, '0');//constante para obtener el día
    const month = String(d.getMonth() + 1).padStart(2, '0'); //constante para obtener el mes
    const year = d.getFullYear(); //Constante que obtiene el año
    return `${day}/${month}/${year}`; //Devuelve el valor del formato como 'día/mes/año'
}

//Función que obtiene y muestra las colecciones de su respectiva categoria
//Función que obtiene y muestra las colecciones de un usuario
async function lookCollection(req, res) {
    const userName = req.session.user.userName; //Obtiene el nombre del usuario desde la sesión
    try {
        const collections = await newCollection.getCollectionBycategory(userName) || []; //Obtiene las colecciones del usuario y verifica que no sea nulo
        collections.forEach(collection => {
            /*Devuelve el formato de la fecha como 'día/mes/año' en la busqueda del dato registerDate desde 'lookCollection.pug'*/
            collection.registerDateFormatted = formatDate(collection.publicationDate); //Formatea la fecha
        });
        //Renderiza la visa 'lookCollection.pug' con los datos del usuario en sesión y su lista de colecciones
        res.render('lookCollection', {
            title: 'catálogo de la Colección',
            collections: collections,
            firstName: req.session.user.firstName,
            firstSurname: req.session.user.firstSurname
        });
    } catch (error) {
        console.error('Error al obtener las colecciones:', error);
        //Muestra la lista vacía en caso de haber un error al obtener las colecciones
        res.status(500).render('lookCollection', {
            title: 'catálogo de la Colección',
            collections: [], // Asegura que se pasa un array vacío en caso de algún error
            firstName: req.session.user.firstName,
            firstSurname: req.session.user.firstSurname
        });
    }
}

module.exports = {
    createAddCollection,
    lookCollection
};