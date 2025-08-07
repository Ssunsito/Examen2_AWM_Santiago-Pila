const { Cancha } = require('../Models');

// Crear cancha
const createCancha = async (req, res) => {
    try {
        const { nombre, tipo, capacidad, estado, descripcion } = req.body;
        
        // Validar campos requeridos
        if (!nombre || !tipo || !capacidad) {
            return res.status(400).json({ 
                success: false, 
                message: "Nombre, tipo y capacidad son obligatorios" 
            });
        }

        // Crear cancha
        const cancha = await Cancha.create({
            nombre,
            tipo,
            capacidad,
            estado: estado || 'disponible',
            descripcion
        });

        res.status(201).json({
            success: true,
            message: "Cancha creada exitosamente",
            data: cancha
        });

    } catch (error) {
        console.error('Error al crear cancha:', error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

// Obtener todas las canchas
const getAllCanchas = async (req, res) => {
    try {
        const canchas = await Cancha.findAll();

        res.status(200).json({
            success: true,
            data: canchas
        });

    } catch (error) {
        console.error('Error al obtener canchas:', error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

// Obtener cancha por ID
const getCanchaById = async (req, res) => {
    try {
        const { id } = req.params;
        const cancha = await Cancha.findByPk(id);

        if (!cancha) {
            return res.status(404).json({
                success: false,
                message: "Cancha no encontrada"
            });
        }

        res.status(200).json({
            success: true,
            data: cancha
        });

    } catch (error) {
        console.error('Error al obtener cancha:', error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

// Actualizar cancha
const updateCancha = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, tipo, capacidad, estado, descripcion } = req.body;

        const cancha = await Cancha.findByPk(id);
        if (!cancha) {
            return res.status(404).json({
                success: false,
                message: "Cancha no encontrada"
            });
        }

        // Actualizar campos
        await cancha.update({
            nombre: nombre || cancha.nombre,
            tipo: tipo || cancha.tipo,
            capacidad: capacidad || cancha.capacidad,
            estado: estado || cancha.estado,
            descripcion: descripcion || cancha.descripcion
        });

        res.status(200).json({
            success: true,
            message: "Cancha actualizada exitosamente",
            data: cancha
        });

    } catch (error) {
        console.error('Error al actualizar cancha:', error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

// Eliminar cancha
const deleteCancha = async (req, res) => {
    try {
        const { id } = req.params;
        const cancha = await Cancha.findByPk(id);

        if (!cancha) {
            return res.status(404).json({
                success: false,
                message: "Cancha no encontrada"
            });
        }

        await cancha.destroy();

        res.status(200).json({
            success: true,
            message: "Cancha eliminada exitosamente"
        });

    } catch (error) {
        console.error('Error al eliminar cancha:', error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

// Obtener canchas por tipo
const getCanchasByTipo = async (req, res) => {
    try {
        const { tipo } = req.params;
        const canchas = await Cancha.findAll({
            where: { tipo }
        });

        res.status(200).json({
            success: true,
            data: canchas
        });

    } catch (error) {
        console.error('Error al obtener canchas por tipo:', error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

// Obtener canchas disponibles
const getCanchasDisponibles = async (req, res) => {
    try {
        const canchas = await Cancha.findAll({
            where: { estado: 'disponible' }
        });

        res.status(200).json({
            success: true,
            data: canchas
        });

    } catch (error) {
        console.error('Error al obtener canchas disponibles:', error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

module.exports = {
    createCancha,
    getAllCanchas,
    getCanchaById,
    updateCancha,
    deleteCancha,
    getCanchasByTipo,
    getCanchasDisponibles
};

