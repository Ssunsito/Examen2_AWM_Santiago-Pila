const ReservaController = require('../Controllers/reserva.controller');

// Rutas para reservas
module.exports = function(app) {
    app.post('/api/reservas', ReservaController.createReserva);
    app.get('/api/reservas', ReservaController.getAllReservas);
    app.get('/api/reservas/usuario/:usuario_id', ReservaController.getReservasByUsuario);
    app.get('/api/reservas/cancha/:cancha_id', ReservaController.getReservasByCancha);
    app.get('/api/reservas/:id', ReservaController.getReservaById);
    app.put('/api/reservas/:id', ReservaController.updateReserva);
    app.delete('/api/reservas/:id', ReservaController.deleteReserva);
    app.put('/api/reservas/:id/cancelar', ReservaController.cancelarReserva);
}
