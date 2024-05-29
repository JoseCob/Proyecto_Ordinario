//database/Connection.js
const mysql2 = require('mysql2'); // requiere Utilizar MySQL2
const dotenv = require('dotenv'); // requiere Utilizar variables de entorno desde un archivo ".env"

//Configura dotenv para cargar las variables de entorno desde un archivo ".env"
dotenv.config();

// /Crea la conexión pool de la base de datos mediante la constante db y mysql2
const db = mysql2.createPool({ //Establece la conexión de la base de datos con el método createPool 
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log('¡Se conecto la base de datos exitosamente!'); // Muestra mensaje que se conecto a la base de datos exitosamente 

module.exports = db.promise(); //Exportamos la constante db con el promise, para permitir funciones con operaciones asíncronas