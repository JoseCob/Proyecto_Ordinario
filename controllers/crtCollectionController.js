const newCategory = require('../Models/crtCollectionModel'); //Se importa el Model donde se crea la colección
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
    const { categoryId } = req.body;
    //Constante que obtiene el nombre del usuario que realiza la solicitud
    const userName = req.session.user.userName; //Se obtiene la sesión del usuario autenticado 
    //Variable que se utilizará para almacenar la imagen y el identificador de imagen de la colección al comprimirse, puede ser nulo o vacío la propiedad
    let imageCRTCollection = null;
    let imageIdentifier = null;

    //Verifica si se ha seleccionado una categoría antes de continuar
    if (categoryId === '0') {
        return res.render('crtCollection', {
            title: 'Crear Colección',
            errorMessage: 'Por favor, seleccione una categoría.',
            firstName: req.session.user.firstName,
            firstSurname: req.session.user.firstSurname
        });
    }

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

    //Verifica si hay un archivo adjunto en la solicitud y si el tamaño del archivo es mayor a 1MB
    if (req.file && req.file.size > 1 * 1024 * 1024) {
        return res.render('crtCollection', {
            title: 'Crear Colección',
            errorMessage: 'El archivo excede el límite permitido de 1 MB.',
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
                    return res.render('crtCollection', {
                        title: 'Crear Colección',
                        errorMessage: 'El archivo comprimido excede el límite permitido de 64MB por parte del servidor.',
                        firstName: req.session.user.firstName,
                        firstSurname: req.session.user.firstSurname
                    });
                }
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

    //Verifica si el usuario ya ha creado la categoría anteriormente
    try {
        const existingCollection = await newCategory.getCategoryAndUser(categoryId, userName);
        if (existingCollection) {
            console.log('La categoría', categoryId ,'¡ya existe en la BD y se intento registrar!')
            return res.render('crtCollection', {
                title: 'Crear Colección',
                errorMessage: 'Ya añadiste esta categoría anteriormente.',
                firstName: req.session.user.firstName,
                firstSurname: req.session.user.firstSurname
            });
        }
    } catch (error) {
        //Devuelve una respuesta de error en caso de que la validación no se efectué correctamente
        console.error('Error al verificar la existencia de la categoría:', error);
        return res.status(500).render('crtCollection', {
            title: 'Crear Colección',
            errorMessage: 'Error al verificar la existencia de la categoría.',
            firstName: req.session.user.firstName,
            firstSurname: req.session.user.firstSurname
        });
    }

    try {
        //Función que entra en espera para crear la colección y enviarlo a la base de datos
        await newCategory.createCollection(userName, categoryId, imageCRTCollection, imageIdentifier);
        res.redirect('/seeCollections'); //Si el resultado es exitoso, dirige al usuario a la vista 'seeCollections.pug'
        console.log('La categoria', categoryId, 'y la imagen:', imageCRTCollection, 'se guardó en la base de datos, ¡Satisfactoriamente!');
        if (imageIdentifier) {
            console.log('hash de la imagen generado:', imageIdentifier);
        } else {
            console.log('No se adjuntó ninguna imagen.'); //Muestra un mensaje en consola, si no se selecciono o subio una imagen a la base de datos 
        }
    } catch (error) {
        //Muestra un mensaje a la vista del usuario y lo retorna en consola si el servidor detecta el valor máximo permitido en archivos, en este caso en imágenes
        if (error.code === 'ER_NET_PACKET_TOO_LARGE') {
            console.error('Error: El archivo comprimido excede el límite permitido de 64MB por parte del servidor.');
            return res.status(500).render('crtCollection', {
                title: 'Crear Colección',
                errorMessage: 'El archivo comprimido excede el límite permitido de 64MB por parte del servidor.',
                firstName: req.session.user.firstName,
                firstSurname: req.session.user.firstSurname
            });
        }
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

//Funcion para darle formato a la fecha como 'día/mes/año' al registerDate de la base de datos
function formatDate(date) {
    const d = new Date(date); //Constante para obtener el día, mes y año
    const day = String(d.getDate()).padStart(2, '0');//constante para obtener el día
    const month = String(d.getMonth() + 1).padStart(2, '0'); //constante para obtener el mes
    const year = d.getFullYear(); //Constante que obtiene el año
    return `${day}/${month}/${year}`; //Devuelve el valor del formato como 'día/mes/año'
}

//Mapeo para mostrar los nombres de las categorías, en vez de números en la sección del título de la vista 'seeCollections.pug'
const categoryMap = {
    1: "Películas",
    2: "Libros",
    3: "VideoJuegos"
};

//Función que obtiene y muestra las colecciones de un usuario
async function seeCollections(req, res) {
    const userName = req.session.user.userName; //Obtiene el nombre del usuario desde la sesión
    try {
        const collections = await newCategory.getCollectionsByUser(userName) || []; //Obtiene las colecciones del usuario y verifica que no sea nulo
        collections.forEach(collection => {
            /*Devuelve el formato de la fecha como 'día/mes/año' en la busqueda del dato registerDate desde 'seeCollections.pug'*/
            collection.registerDateFormatted = formatDate(collection.registerDate); //Formatea la fecha
            collection.categoryName = categoryMap[collection.categoryId]; //Mapea el ID de la categoría a su nombre
        });
        //Renderiza la visa 'seeCollections.pug' con los datos del usuario en sesión y su lista de colecciones
        res.render('seeCollections', {
            title: 'Lista de Colecciones',
            collections: collections,
            firstName: req.session.user.firstName,
            firstSurname: req.session.user.firstSurname
        });
    } catch (error) {
        console.error('Error al obtener las colecciones:', error);
        //Muestra la lista vacía en caso de haber un error al obtener las colecciones
        res.status(500).render('seeCollections', {
            title: 'Lista de Colecciones',
            collections: [], // Asegura que se pasa un array vacío en caso de algún error
            firstName: req.session.user.firstName,
            firstSurname: req.session.user.firstSurname
        });
    }
}

module.exports = {
    crtCollection,
    seeCollections
};