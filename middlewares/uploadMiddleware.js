const multer = require('multer');
const path = require('path');

// Configuración de multer para almacenar en memoria (buffer)
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 1 * 1024 * 1024 }, // Limita a 1MB al guardar las imagenes
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg| jpg |png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb("Error: la carga de archivos solo admite los siguientes tipos de archivos - " + filetypes);//Muestra un mensaje de error al subir imagenes que no están en la lista permitida
    }
});

module.exports = upload;