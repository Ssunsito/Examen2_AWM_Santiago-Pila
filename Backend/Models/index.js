const Usuario = require('./usuario.model');
const Cancha = require('./cancha.model');
const Horario = require('./horario.model');
const Reserva = require('./reserva.model');

// Definir relaciones
Usuario.hasMany(Reserva, { foreignKey: 'usuario_id' });
Reserva.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Cancha.hasMany(Reserva, { foreignKey: 'cancha_id' });
Reserva.belongsTo(Cancha, { foreignKey: 'cancha_id' });

Cancha.hasMany(Horario, { foreignKey: 'cancha_id' });
Horario.belongsTo(Cancha, { foreignKey: 'cancha_id' });

module.exports = {
    Usuario,
    Cancha,
    Horario,
    Reserva
};
