const newCollection = require('../Models/crtCollectionModel'); //Se importa el Model donde se crea la colección
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

//Función que crea la colección mediante la solicitud y respuesta HTTP = 'req.body'
async function crtCollection(req, res) {
    //Constante que obtiene la categoría de la colección que se está creando.
    const { categoryCollection } = req.body;
    //Constante que obtiene el nombre del usuario que realiza la solicitud
    const userName = req.session.user.userName; //Cambiado de req.user.userName a req.session.user.userName

    //Variable que se utilizará para almacenar la imagen y el identificador de imagen de la colección al comprimirse, puede ser nulo o vacío la propiedad
    let imageCRTCollection = null;
    let imageIdentifier = null;

    //Verifica si hay errores de validación de archivo en la solicitud mediante el 'uploadMiddleware.js' que contiene la validación
    if (req.fileValidationError) {
        //Si existe un error, se renderiza la plantilla crtCollection.pug con un mensaje de error.
        return res.render('crtCollection', {
            title: 'Crear Colección', // Título de la vista
            errorMessage: req.fileValidationError, // Mensaje de error
            firstName: req.session.user.firstName, // Devuelve el Nombre de pila del usuario
            firstSurname: req.session.user.firstSurname // Devuelve el primer Apellido del usuario
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
                imageCRTCollection = compressedImage; //Devuelve la imagen comprimida en la variable 'imageCRTCollection'
                cache.set(imageIdentifier, compressedImage); //Coloca en caché el identificador de la imagen comprimida
            } else {
                imageCRTCollection = cachedImage; //Evita tener que volver a procesar la imagen si ya ha sido procesada y almacenada en la caché
            }
            
        } catch (error) {
            //Si ocurre un error al procesar la imagen, genera un mensaje de error y lo retorna a la vista = 'crtCollection.pug'
            console.error('Error al procesar la imagen:', error);
            return res.render('crtCollection', {
                //Datos de la vista
                title: 'Crear Colección', // Título de la vista
                errorMessage: 'Error al procesar la imagen.', //Mensaje de error
                firstName: req.session.user.firstName, //Devuelve el Nombre de pila del usuario
                firstSurname: req.session.user.firstSurname //Devuelve el Primer Apellido del usuario
            });
        }
    }

    try {
        //Función que entra en espera para crear la colección y enviarlo a la base de datos
        await newCollection.createCollection(userName, categoryCollection, imageCRTCollection, imageIdentifier);
        res.redirect('/seeCollections'); //Si el resultado es exitoso, dirige al usuario a la vista 'seeCollections.pug'
        console.log('La imagen:', imageCRTCollection, 'se guardó en la base de datos, ¡Satisfactoriamente!');
        if (imageIdentifier) {
            console.log('hash de la imagen generado:', imageIdentifier);
        } else {
            console.log('No se adjuntó ninguna imagen.'); //Muestra un mensaje en consola, si no se selecciono o subio una imagen a la base de datos 
        }
    } catch (error) {
        //Si ocurre un error al intentar guardar la imagen, imprime un mensaje de error al usuario y dirígelo a la misma vista = 'crtCollection.pug'
        console.error('Error al crear la colección:', error);
        res.status(500).render('crtCollection', {
            title: 'Crear Colección', //Título de la vista
            errorMessage: 'Error al crear la colección.', //Mensaje de error
            firstName: req.session.user.firstName, //Devuelve el Nombre de pila del usuario
            firstSurname: req.session.user.firstSurname //Devuelve el Primer Apellido del usuario
        });
    }
}

module.exports = {
    crtCollection
};