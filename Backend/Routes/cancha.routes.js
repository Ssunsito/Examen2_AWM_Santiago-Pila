const express = require('express');
const router = express.Router();
const CanchaController = require('../Controllers/cancha.controller');

// Rutas para canchas
module.exports = function(app) {
    app.post('/api/canchas', CanchaController.createCancha);
    app.get('/api/canchas', CanchaController.getAllCanchas);
    app.get('/api/canchas/disponibles', CanchaController.getCanchasDisponibles);
    app.get('/api/canchas/tipo/:tipo', CanchaController.getCanchasByTipo);
    app.get('/api/canchas/:id', CanchaController.getCanchaById);
    app.put('/api/canchas/:id', CanchaController.updateCancha);
    app.delete('/api/canchas/:id', CanchaController.deleteCancha);
}
module.exports = router;
