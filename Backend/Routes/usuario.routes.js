const express = require('express');
const router = express.Router();
const UsuarioController = require('../Controllers/usuario.controller');

// Rutas para usuarios
module.exports = function(app) {
    app.post('/api/usuarios', UsuarioController.createUsuario);
    app.post('/api/usuarios/login', UsuarioController.loginUsuario);
    app.get('/api/usuarios', UsuarioController.getAllUsuarios);
    app.get('/api/usuarios/:id', UsuarioController.getUsuarioById);
    app.put('/api/usuarios/:id', UsuarioController.updateUsuario);
    app.delete('/api/usuarios/:id', UsuarioController.deleteUsuario);
}
module.exports = router;
