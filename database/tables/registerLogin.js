const db = require('../Connection'); //Establece la conexión de la base de datos

//Función que registra los inicios de sesión de los usuarios = login
async function registerLogin(userName) {
    try {
        await db.query('INSERT INTO login (userName) VALUES (?)', [userName]);
        console.log('Registro de sesión del usuario:', userName, '¡registrado satisfactoriamente!');
    } catch (error) {
        console.error('Error al insertar usuario:', error);
        throw error;
    }
}

module.exports = {
    registerLogin
};