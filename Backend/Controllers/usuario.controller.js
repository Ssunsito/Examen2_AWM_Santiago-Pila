const { Usuario } = require('../Models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generar token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '30d' });
};

// Generar Bearer token
const generateBearerToken = (id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '30d' });
    return `Bearer ${token}`;
};

// Crear usuario
const createUsuario = async (req, res) => {
    try {
        const { correo, password } = req.body;
        
        // Validar campos requeridos
        if (!correo || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Correo y password son obligatorios" 
            });
        }

        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ where: { correo } });
        if (usuarioExistente) {
            return res.status(400).json({ 
                success: false, 
                message: "El correo ya está registrado" 
            });
        }

        // Encriptar password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear usuario
        const usuario = await Usuario.create({
            correo,
            password: hashedPassword
        });

        // Generar Bearer token
        const bearerToken = generateBearerToken(usuario.id);

        res.status(201).json({
            success: true,
            message: "Usuario creado exitosamente",
            data: {
                id: usuario.id,
                correo: usuario.correo,
                rol: usuario.rol,
                token: bearerToken
            }
        });

    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

// Login usuario
const loginUsuario = async (req, res) => {
    try {
        const { correo, password } = req.body;

        // Validar campos requeridos
        if (!correo || !password) {
            return res.status(400).json({
                success: false,
                message: "Correo y password son obligatorios"
            });
        }

        // Buscar usuario
        const usuario = await Usuario.findOne({ where: { correo } });
        if (!usuario) {
            return res.status(400).json({
                success: false,
                message: "Credenciales inválidas"
            });
        }

        // Verificar password
        const isPasswordValid = await bcrypt.compare(password, usuario.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Credenciales inválidas"
            });
        }

        // Generar Bearer token
        const bearerToken = generateBearerToken(usuario.id);

        res.status(200).json({
            success: true,
            message: "Login exitoso",
            data: {
                id: usuario.id,
                correo: usuario.correo,
                rol: usuario.rol,
                token: bearerToken
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

// Obtener todos los usuarios
const getAllUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: { exclude: ['password'] }
        });

        res.status(200).json({
            success: true,
            data: usuarios
        });

    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

// Obtener usuario por ID
const getUsuarioById = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            data: usuario
        });

    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

// Actualizar usuario
const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { correo, rol } = req.body;

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        // Actualizar campos
        await usuario.update({
            correo: correo || usuario.correo,
            rol: rol || usuario.rol
        });

        res.status(200).json({
            success: true,
            message: "Usuario actualizado exitosamente",
            data: {
                id: usuario.id,
                correo: usuario.correo,
                rol: usuario.rol
            }
        });

    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

// Eliminar usuario
const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        await usuario.destroy();

        res.status(200).json({
            success: true,
            message: "Usuario eliminado exitosamente"
        });

    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

module.exports = {
    createUsuario,
    loginUsuario,
    getAllUsuarios,
    getUsuarioById,
    updateUsuario,
    deleteUsuario
};
