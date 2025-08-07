const { DataTypes } = require('sequelize');
const sequelize = require('../Config/sequelize.config');

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    correo: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    rol: {
        type: DataTypes.ENUM('admin', 'usuario'),
        defaultValue: 'usuario'
    }
}, {
    timestamps: true,
    tableName: 'usuarios'
});

module.exports = Usuario;
