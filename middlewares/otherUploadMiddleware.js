const multer = require('multer'); //Dependencia que  se utiliza principalmente para el manejo de formularios que incluyen la carga de archivos como: imágenes, videos, archivos de audio, documentos, etc., desde el cliente al servidor.
const path = require('path'); //Dependencia que se necesita para trabajar con rutas de archivos y directorios de una manera que sea independiente del sistema operativo.

// Configuración de multer para almacenar en memoria (buffer)
const storage = multer.memoryStorage();

//Funcion que genera la subida de imagenes en formato png con la ayuda del multer
const upload = multer({
    storage: storage, //Se declara el almacenamiento en memoria (buffer)
    limits: { fileSize: 1 * 1024 * 1024 }, //Limita a 1M permitido, al guardar y renderizar las imagenes con un nuevo tamaño al servidor
    //Función que genere el filtro para cargar archivos
    fileFilter: function (req, file, cb) { /*Función que contgiene la solicitud HTTP, el objeto de archivo y 
    la función que genera una llamada para indicar si se debe aceptar o rechazar el archivo.*/
        const filetypes = /jpeg|jpg|png|webp/; //Formatos de imagenes permitidos
        const mimetype = filetypes.test(file.mimetype); //Utiliza la expresión regular y verifica si es el tipo de archivo que se esta subiendo
        /* verifica si la extensión del nombre de archivo original coincide con la expresión regular, por eso se requiere 'path'
        ya que extrae la extensión del nombre de archivo original y luego se convierte a minúsculas para que coincida con la expresión regular*/
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        //Si la expresion regular coincide con el nombre del archivo original en minúsculas 
        if (mimetype && extname) {
            return cb(null, true); //guarda la imagen

            //De lo contrario genera un mensaje de error si no es el formato de la imagen permitido
        } else {
            console.log('¡La imagen:', file.originalname, 'no se pudo guardar en la base de datos!');
            return cb(new Error('¡Solo se permite subir imágenes con formato jpeg, jpg, png, webp!'));
        }
    }
}).single('imgAddCollection');//indica que solo se espera recibir un archivo en la solicitud HTTP con el nombre del campo imageCRTCollection del formulario 'addCollection.pug'

module.exports = function (req, res, next) {
    //Exporta la funcion del multer con mensajes de error y mostrarlo en la vista 'addCollection.pug'
    upload(req, res, function (err, categoryId) {
        if (err) {
            //Si el mensaje de error genérico del multer es igual a 'File too large', remplaza el mensaje de error por uno personalizado
            if (err instanceof multer.MulterError && err.message === 'File too large') {
                err.message = 'La imagen sobrepasó el tamaño permitido de 1M';
                console.log('La imagen no se guardo porque excedió el límite de 1M');
            }
            //Si el mensaje del error en la vista coincide, muestra un mensaje personalizado en consola
            if (err.message === '¡Solo se permite subir imágenes con formato jpeg, jpg, png, webp!') {
                console.log('La imagen no cumple con los formatos permitidos, no se pudo procesar la imagen');
            }
            //Devuelve los mensajes de error a la vista 'addCollection.pug'
            req.fileValidationError = err.message;
            return res.render('addCollection', {
                title: 'Agregar Nuevo Elemento a la Colección',
                errorMessage: req.fileValidationError,
                firstName: req.session.user.firstName,
                firstSurname: req.session.user.firstSurname
            });
        } else {
            req.session.categoryId = categoryId; // Asignar categoryId a la sesión
            next();
        }
    });
};