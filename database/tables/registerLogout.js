const db = require('../Connection'); //Establece la conexión de la base de datos

//Función que registra los inicios de sesión de los usuarios = login
async function registerLogout(userName) {
    try {
        await db.query('INSERT INTO logout (userName) VALUES (?)', [userName]);
        console.log('Registro del cierre de sesión para:', userName, '¡registrado satisfactoriamente!');
    } catch (error) {
        console.error('Error al insertar usuario:', error);
        throw error;
    }
}

module.exports = {
    registerLogout
};