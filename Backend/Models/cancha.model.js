const { DataTypes } = require('sequelize');
const sequelize = require('../Config/sequelize.config');

const Cancha = sequelize.define('Cancha', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    tipo: {
        type: DataTypes.ENUM('futbol', 'tenis', 'basquet', 'voley'),
        allowNull: false
    },
    capacidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('disponible', 'mantenimiento', 'reservada'),
        defaultValue: 'disponible'
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'canchas'
});

module.exports = Cancha;
