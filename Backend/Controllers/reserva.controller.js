const { Reserva, Usuario, Cancha, Horario } = require('../Models');
const { Op } = require('sequelize');

// Crear reserva
const createReserva = async (req, res) => {
    try {
        const { fecha, estado, observaciones, usuario_id, cancha_id, horario_id } = req.body;
        
        // Validar campos requeridos
        if (!fecha || !usuario_id || !cancha_id || !horario_id) {
            return res.status(400).json({ 
                success: false, 
                message: "Fecha, usuario_id, cancha_id y horario_id son obligatorios" 
            });
        }

        // Verificar que el usuario existe
        const usuario = await Usuario.findByPk(usuario_id);
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
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

        // Verificar que el horario existe
        const horario = await Horario.findByPk(horario_id);
        if (!horario) {
            return res.status(404).json({
                success: false,
                message: "Horario no encontrado"
            });
        }

        // Verificar que la cancha esté disponible
        if (cancha.estado !== 'disponible') {
            return res.status(400).json({
                success: false,
                message: "La cancha no está disponible"
            });
        }

        // Verificar que no haya reservas conflictivas
        const reservaConflictiva = await Reserva.findOne({
            where: {
                fecha,
                cancha_id,
                horario_id,
                estado: {
                    [Op.notIn]: ['cancelada']
                }
            }
        });

        if (reservaConflictiva) {
            return res.status(400).json({
                success: false,
                message: "Ya existe una reserva para esta fecha, cancha y horario"
            });
        }

        // Crear reserva
        const reserva = await Reserva.create({
            fecha,
            estado: estado || 'pendiente',
            observaciones,
            usuario_id,
            cancha_id,
            horario_id
        });

        // Actualizar estado de la cancha
        await cancha.update({ estado: 'reservada' });

        res.status(201).json({
            success: true,
            message: "Reserva creada exitosamente",
            data: reserva
        });

    } catch (error) {
        console.error('Error al crear reserva:', error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

// Obtener todas las reservas
const getAllReservas = async (req, res) => {
    try {
        const reservas = await Reserva.findAll({
            include: [
                {
                    model: Usuario,
                    attributes: ['id', 'correo']
                },
                {
                    model: Cancha,
                    attributes: ['id', 'nombre', 'tipo']
                },
                {
                    model: Horario,
                    attributes: ['id', 'hora_inicio', 'hora_fin']
                }
            ],
            order: [['fecha', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: reservas
        });

    } catch (error) {
        console.error('Error al obtener reservas:', error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

// Obtener reserva por ID
const getReservaById = async (req, res) => {
    try {
        const { id } = req.params;
        const reserva = await Reserva.findByPk(id, {
            include: [
                {
                    model: Usuario,
                    attributes: ['id', 'correo']
                },
                {
                    model: Cancha,
                    attributes: ['id', 'nombre', 'tipo']
                },
                {
                    model: Horario,
                    attributes: ['id', 'hora_inicio', 'hora_fin']
                }
            ]
        });

        if (!reserva) {
            return res.status(404).json({
                success: false,
                message: "Reserva no encontrada"
            });
        }

        res.status(200).json({
            success: true,
            data: reserva
        });

    } catch (error) {
        console.error('Error al obtener reserva:', error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

// Actualizar reserva
const updateReserva = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha, estado, observaciones, cancha_id, horario_id } = req.body;

        const reserva = await Reserva.findByPk(id);
        if (!reserva) {
            return res.status(404).json({
                success: false,
                message: "Reserva no encontrada"
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

        // Verificar que el horario existe si se va a actualizar
        if (horario_id) {
            const horario = await Horario.findByPk(horario_id);
            if (!horario) {
                return res.status(404).json({
                    success: false,
                    message: "Horario no encontrado"
                });
            }
        }

        // Actualizar campos
        await reserva.update({
            fecha: fecha || reserva.fecha,
            estado: estado || reserva.estado,
            observaciones: observaciones || reserva.observaciones,
            cancha_id: cancha_id || reserva.cancha_id,
            horario_id: horario_id || reserva.horario_id
        });

        res.status(200).json({
            success: true,
            message: "Reserva actualizada exitosamente",
            data: reserva
        });

    } catch (error) {
        console.error('Error al actualizar reserva:', error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

// Eliminar reserva
const deleteReserva = async (req, res) => {
    try {
        const { id } = req.params;
        const reserva = await Reserva.findByPk(id);

        if (!reserva) {
            return res.status(404).json({
                success: false,
                message: "Reserva no encontrada"
            });
        }

        // Liberar la cancha si la reserva está activa
        if (reserva.estado !== 'cancelada') {
            const cancha = await Cancha.findByPk(reserva.cancha_id);
            if (cancha) {
                await cancha.update({ estado: 'disponible' });
            }
        }

        await reserva.destroy();

        res.status(200).json({
            success: true,
            message: "Reserva eliminada exitosamente"
        });

    } catch (error) {
        console.error('Error al eliminar reserva:', error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

// Obtener reservas por usuario
const getReservasByUsuario = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        const reservas = await Reserva.findAll({
            where: { usuario_id },
            include: [
                {
                    model: Cancha,
                    attributes: ['id', 'nombre', 'tipo']
                },
                {
                    model: Horario,
                    attributes: ['id', 'hora_inicio', 'hora_fin']
                }
            ],
            order: [['fecha', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: reservas
        });

    } catch (error) {
        console.error('Error al obtener reservas por usuario:', error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

// Obtener reservas por cancha
const getReservasByCancha = async (req, res) => {
    try {
        const { cancha_id } = req.params;
        const reservas = await Reserva.findAll({
            where: { cancha_id },
            include: [
                {
                    model: Usuario,
                    attributes: ['id', 'correo']
                },
                {
                    model: Horario,
                    attributes: ['id', 'hora_inicio', 'hora_fin']
                }
            ],
            order: [['fecha', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: reservas
        });

    } catch (error) {
        console.error('Error al obtener reservas por cancha:', error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

// Cancelar reserva
const cancelarReserva = async (req, res) => {
    try {
        const { id } = req.params;
        const reserva = await Reserva.findByPk(id);

        if (!reserva) {
            return res.status(404).json({
                success: false,
                message: "Reserva no encontrada"
            });
        }

        if (reserva.estado === 'cancelada') {
            return res.status(400).json({
                success: false,
                message: "La reserva ya está cancelada"
            });
        }

        // Actualizar estado de la reserva
        await reserva.update({ estado: 'cancelada' });

        // Liberar la cancha
        const cancha = await Cancha.findByPk(reserva.cancha_id);
        if (cancha) {
            await cancha.update({ estado: 'disponible' });
        }

        res.status(200).json({
            success: true,
            message: "Reserva cancelada exitosamente",
            data: reserva
        });

    } catch (error) {
        console.error('Error al cancelar reserva:', error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

module.exports = {
    createReserva,
    getAllReservas,
    getReservaById,
    updateReserva,
    deleteReserva,
    getReservasByUsuario,
    getReservasByCancha,
    cancelarReserva
};
