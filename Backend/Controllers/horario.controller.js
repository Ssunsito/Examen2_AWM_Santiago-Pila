const { Horario, Cancha } = require('../Models');

// Crear horario
const createHorario = async (req, res) => {
    try {
        const { hora_inicio, hora_fin, cancha_id } = req.body;
        
        // Validar campos requeridos
        if (!hora_inicio || !hora_fin || !cancha_id) {
            return res.status(400).json({ 
                success: false, 
                message: "Hora inicio, hora fin y cancha_id son obligatorios" 
            });
        }

        // Verificar que la cancha existe
        const cancha = await Cancha.findByPk(cancha_id);
        if (!cancha) {
            return res.status(404).json({
                success: false,
                message: "Cancha no encontrada"
            });
        }

        // Crear horario
        const horario = await Horario.create({
            hora_inicio,
            hora_fin,
            cancha_id
        });

        res.status(201).json({
            success: true,
            message: "Horario creado exitosamente",
            data: horario
        });

    } catch (error) {
        console.error('Error al crear horario:', error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

// Obtener todos los horarios
const getAllHorarios = async (req, res) => {
    try {
        const horarios = await Horario.findAll({
            include: [{
                model: Cancha,
                attributes: ['id', 'nombre', 'tipo']
            }]
        });

        res.status(200).json({
            success: true,
            data: horarios
        });

    } catch (error) {
        console.error('Error al obtener horarios:', error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

// Obtener horario por ID
const getHorarioById = async (req, res) => {
    try {
        const { id } = req.params;
        const horario = await Horario.findByPk(id, {
            include: [{
                model: Cancha,
                attributes: ['id', 'nombre', 'tipo']
            }]
        });

        if (!horario) {
            return res.status(404).json({
                success: false,
                message: "Horario no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            data: horario
        });

    } catch (error) {
        console.error('Error al obtener horario:', error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

// Actualizar horario
const updateHorario = async (req, res) => {
    try {
        const { id } = req.params;
        const { hora_inicio, hora_fin, cancha_id } = req.body;

        const horario = await Horario.findByPk(id);
        if (!horario) {
            return res.status(404).json({
                success: false,
                message: "Horario no encontrado"
            });
        }

        // Verificar que la cancha existe si se va a actualizar
        if (cancha_id) {
            const cancha = await Cancha.findByPk(cancha_id);
            if (!cancha) {
                return res.status(404).json({
                    success: false,
                    message: "Cancha no encontrada"
                });
            }
        }

        // Actualizar campos
        await horario.update({
            hora_inicio: hora_inicio || horario.hora_inicio,
            hora_fin: hora_fin || horario.hora_fin,
            cancha_id: cancha_id || horario.cancha_id
        });

        res.status(200).json({
            success: true,
            message: "Horario actualizado exitosamente",
            data: horario
        });

    } catch (error) {
        console.error('Error al actualizar horario:', error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

// Eliminar horario
const deleteHorario = async (req, res) => {
    try {
        const { id } = req.params;
        const horario = await Horario.findByPk(id);

        if (!horario) {
            return res.status(404).json({
                success: false,
                message: "Horario no encontrado"
            });
        }

        await horario.destroy();

        res.status(200).json({
            success: true,
            message: "Horario eliminado exitosamente"
        });

    } catch (error) {
        console.error('Error al eliminar horario:', error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

// Obtener horarios por cancha
const getHorariosByCancha = async (req, res) => {
    try {
        const { cancha_id } = req.params;
        const horarios = await Horario.findAll({
            where: { cancha_id },
            include: [{
                model: Cancha,
                attributes: ['id', 'nombre', 'tipo']
            }]
        });

        res.status(200).json({
            success: true,
            data: horarios
        });

    } catch (error) {
        console.error('Error al obtener horarios por cancha:', error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

module.exports = {
    createHorario,
    getAllHorarios,
    getHorarioById,
    updateHorario,
    deleteHorario,
    getHorariosByCancha
};
