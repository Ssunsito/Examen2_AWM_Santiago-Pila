const { DataTypes } = require('sequelize');
const sequelize = require('../Config/sequelize.config');

const Reserva = sequelize.define('Reserva', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'confirmada', 'cancelada', 'completada'),
        defaultValue: 'pendiente'
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id'
        }
    },
    cancha_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'canchas',
            key: 'id'
        }
    },
    horario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'horarios',
            key: 'id'
        }
    }
}, {
    timestamps: true,
    tableName: 'reservas'
});

module.exports = Reserva;
