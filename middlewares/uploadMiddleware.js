const multer = require('multer'); //Dependencia que  se utiliza principalmente para el manejo de formularios que incluyen la carga de archivos como: imágenes, videos, archivos de audio, documentos, etc., desde el cliente al servidor.
const path = require('path'); //Dependencia que se necesita para trabajar con rutas de archivos y directorios de una manera que sea independiente del sistema operativo.

// Configuración de multer para almacenar en memoria (buffer)
const storage = multer.memoryStorage();

//Funcion que genera la subida de imagenes en formato png con la ayuda del multer
const upload = multer({
    storage: storage, //Se declara el almacenamiento en memoria (buffer)
    limits: { fileSize: 1 * 1024 * 1024 }, //Limita a 1MB permitido al guardar y renderizar las imagenes
    //Función que genere el filtro para cargar archivos
    fileFilter: function (req, file, cb) { /*Función que contgiene la solicitud HTTP, el objeto de archivo y 
    la función que genera una llamada para indicar si se debe aceptar o rechazar el archivo.*/
        const filetypes = /png/; // Solo permite subir imagenes PNG
        const mimetype = filetypes.test(file.mimetype); //Utiliza la expresión regular y verifica si es el tipo de archivo que se esta subiendo
        /* verifica si la extensión del nombre de archivo original coincide con la expresión regular, por eso se requiere 'path'
        ya que extrae la extensión del nombre de archivo original y luego se convierte a minúsculas para que coincida con la expresión regular*/
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        //Si la expresion regular coincide con el nombre del archivo original en minúsculas 
        if (mimetype && extname) {
            return cb(null, true); //guarda la imagen

            //De lo contrario genera un mnesaje de error si no es el formato de la imagen permitido
        } else {
            console.log('¡La imagen:', file.originalname, 'no se pudo guardar en la base de datos!');
            return cb(new Error('¡Solo se permite subir imágenes con formato PNG!'));
        }
    }
}).single('imageCRTCollection');//indica que solo se espera recibir un archivo en la solicitud HTTP con el nombre del campo imageCRTCollection del formulario 'crtCollection.pug'

module.exports = function (req, res, next) {
    //Exporta la funcion del multer con mensajes de error y mostrarlo en la vista 'crtCollection.pug'
    upload(req, res, function (err) {
        if (err) {
            //Si el mensaje de error genérico del multer es igual a 'File too large', remplaza el mensaje de error por uno personalizado
            if (err instanceof multer.MulterError && err.message === 'File too large') {
                err.message = 'La imagen sobrepasó el tamaño permitido de 1MB';
                console.log('La imagen no se guardo porque excedió el límite de 1MB');
            }
            //Si el mensaje del error en la vista coincide, muestra un mensaje personalizado en consola
            if (err.message === '¡Solo se permite subir imágenes con formato PNG!') {
                console.log('La imagen no es PNG, no se pudo procesar la imagen');
            }
            //Devuelve los mensajes de error a la vista 'crtCollection.pug'
            req.fileValidationError = err.message;
            return res.render('crtCollection', {
                title: 'Crear Colección',
                errorMessage: req.fileValidationError,
                firstName: req.session.user.firstName,
                firstSurname: req.session.user.firstSurname
            });
        }
        next();
    });
};