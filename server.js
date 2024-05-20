//Variables principales del sistema
const express = require('express');
const app = express();
const path = require('path');

//Rutas o carpetas de la app
//const authmiddleware = require('./middlewares/authentication');
const router = require('./routes/routes');

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal');
});

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.static('assets'));
app.use(express.json());

//Ruta para ejecutar el servidor
app.use('/', router);

//Puerto para la app
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});