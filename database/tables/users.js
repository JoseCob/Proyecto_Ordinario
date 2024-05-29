const db = require('../Connection'); //Establece la conexión de la base de datos
let connection; //Variable para llamar la conexión de la base de datos

// Esta función llama la conexión de la base de datos
async function initializeConnection() {
    // se establece la variable connection en espera de la variable db con el método getConnection()
    connection = await db.getConnection();
}

//Función que registra los usuarios
async function register(firstName, firstSurname, secondSurname, userName, email, password) {
    try {
        await connection.query('INSERT INTO users (firstName, firstSurname, secondSurname, userName, email, passwordHash) VALUES (?,?,?,?,?,?)', [firstName, firstSurname, secondSurname, userName, email, password]);
        console.log('Usuario:', userName, '¡registrado satisfactoriamente!');
    } catch (error) {
        console.error('Error al insertar usuario:', error);
        throw error;
    }
}

//Función que obtiene el nombre de usuario
async function getuserName(userName) {
    try {
        const [results] = await connection.query('SELECT * FROM users WHERE userName = ?', [userName]);
        return results[0];
    } catch (error) {
        console.error('Error al obtener el nombre del usuario: ', error);
        throw error;
    }
}

//Función que obtiene el Id del usuario
async function getIdUser(id) {
    try {
        const [results] = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
        console.log('ID del Usuario recuperado de la base de datos:', results[0]);
        return results[0];
    } catch (error) {
        console.error('Error al obtener el ID del usuario: ', error);
        throw error;
    }
}

module.exports = {
    initializeConnection,
    register,
    getuserName,
    getIdUser
};