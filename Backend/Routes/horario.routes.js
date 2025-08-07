const express = require('express');
const router = express.Router();
const HorarioController = require('../Controllers/horario.controller');

// Rutas para horarios
module.exports = function(app) {
    app.post('/api/horarios', HorarioController.createHorario);
    app.get('/api/horarios', HorarioController.getAllHorarios);
    app.get('/api/horarios/cancha/:cancha_id', HorarioController.getHorariosByCancha);
    app.get('/api/horarios/:id', HorarioController.getHorarioById);
    app.put('/api/horarios/:id', HorarioController.updateHorario);
    app.delete('/api/horarios/:id', HorarioController.deleteHorario);
}
module.exports = router;
