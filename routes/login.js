const express = require('express');
const passport = require('passport');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');//Ruta que contiene la autentificacion hash y token secret en "authMiddleware.js"

// Middleware que contiene la función para validar el input: type='submit' de la vista login.pug
function validateLoginInput(req, res, next) {
    //Constante que obtiene los campos userName y password a verificar la contraseña
    const { userName, password } = req.body;
    if (!userName || !password) {
        req.flash('error', 'No se agregó usuario y contraseña');
        return res.redirect('/login');
    }
    /*Continúa con el siguiente middleware si la validación pasa, la cual seria el de authMiddleware.js 
    donde esta el 'passport.authenticate'(middleware de autenticación)*/
    next();
}

//Ruta que llama el login de la página
router.get('/', (req, res) => {
    const messages = req.flash('error');
    res.render('login', {title: 'Inicia Sesión con tu cuenta', messages: messages});
});

router.post('/', validateLoginInput, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('error', info.message || 'Credenciales inválidas'); //Usa el mensaje de error de la estrategia local
            return res.redirect('/login');
        }
        req.logIn(user, async (err) => {
            if (err) {
                return next(err);
            }
            const token = authMiddleware.generateToken(user.id);
            res.cookie('token', token, { httpOnly: true, secure: false });
            return res.redirect('/');
        });
    })(req, res, next);
});

module.exports = router;