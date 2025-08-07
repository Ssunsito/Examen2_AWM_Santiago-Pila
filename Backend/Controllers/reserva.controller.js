const { Reserva, Usuario, Cancha } = require('../Models');
const { Op } = require('sequelize');

// Crear reserva
const createReserva = async (req, res) => {
    try {
        const { fecha, hora_inicio, hora_fin, estado, observaciones, usuario_id, cancha_id } = req.body;
        
        // Validar campos requeridos
        if (!fecha || !hora_inicio || !hora_fin || !usuario_id || !cancha_id) {
            return res.status(400).json({ 
                success: false, 
                message: "Fecha, hora_inicio, hora_fin, usuario_id y cancha_id son obligatorios" 
            });
        }

        // Validar formato de horas
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(hora_inicio) || !timeRegex.test(hora_fin)) {
            return res.status(400).json({
                success: false,
                message: "Formato de hora inválido. Use HH:MM"
            });
        }

        // Validar que hora_fin sea posterior a hora_inicio
        const [horaInicioHr, horaInicioMin] = hora_inicio.split(':').map(Number);
        const [horaFinHr, horaFinMin] = hora_fin.split(':').map(Number);
        const minutosInicio = horaInicioHr * 60 + horaInicioMin;
        const minutosFin = horaFinHr * 60 + horaFinMin;

        if (minutosFin <= minutosInicio) {
            return res.status(400).json({
                success: false,
                message: "La hora de fin debe ser posterior a la hora de inicio"
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

        // Verificar que la cancha esté disponible
        if (cancha.estado !== 'disponible') {
            return res.status(400).json({
                success: false,
                message: "La cancha no está disponible"
            });
        }

        // Verificar que no haya reservas conflictivas (solapamiento de horarios)
        const reservaConflictiva = await Reserva.findOne({
            where: {
                fecha,
                cancha_id,
                estado: {
                    [Op.notIn]: ['cancelada']
                },
                [Op.or]: [
                    // La nueva reserva empieza durante una existente
                    {
                        hora_inicio: { [Op.lte]: hora_inicio },
                        hora_fin: { [Op.gt]: hora_inicio }
                    },
                    // La nueva reserva termina durante una existente
                    {
                        hora_inicio: { [Op.lt]: hora_fin },
                        hora_fin: { [Op.gte]: hora_fin }
                    },
                    // La nueva reserva envuelve una existente
                    {
                        hora_inicio: { [Op.gte]: hora_inicio },
                        hora_fin: { [Op.lte]: hora_fin }
                    }
                ]
            }
        });

        if (reservaConflictiva) {
            return res.status(400).json({
                success: false,
                message: "Ya existe una reserva que se solapa con el horario solicitado"
            });
        }

        // Crear reserva
        const reserva = await Reserva.create({
            fecha,
            hora_inicio,
            hora_fin,
            estado: estado || 'pendiente',
            observaciones,
            usuario_id,
            cancha_id
        });

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
                    attributes: ['id', 'correo', 'nombre', 'apellido']
                },
                {
                    model: Cancha,
                    attributes: ['id', 'nombre', 'tipo']
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
                    attributes: ['id', 'correo', 'nombre', 'apellido']
                },
                {
                    model: Cancha,
                    attributes: ['id', 'nombre', 'tipo']
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
        const { fecha, hora_inicio, hora_fin, estado, observaciones, cancha_id } = req.body;

        const reserva = await Reserva.findByPk(id);
        if (!reserva) {
            return res.status(404).json({
                success: false,
                message: "Reserva no encontrada"
            });
        }

        // Validar formato de horas si se proporcionan
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (hora_inicio && !timeRegex.test(hora_inicio)) {
            return res.status(400).json({
                success: false,
                message: "Formato de hora de inicio inválido. Use HH:MM"
            });
        }
        
        if (hora_fin && !timeRegex.test(hora_fin)) {
            return res.status(400).json({
                success: false,
                message: "Formato de hora de fin inválido. Use HH:MM"
            });
        }

        // Validar que hora_fin sea posterior a hora_inicio si se proporcionan ambas
        const horaInicioFinal = hora_inicio || reserva.hora_inicio;
        const horaFinFinal = hora_fin || reserva.hora_fin;
        
        const [horaInicioHr, horaInicioMin] = horaInicioFinal.split(':').map(Number);
        const [horaFinHr, horaFinMin] = horaFinFinal.split(':').map(Number);
        const minutosInicio = horaInicioHr * 60 + horaInicioMin;
        const minutosFin = horaFinHr * 60 + horaFinMin;

        if (minutosFin <= minutosInicio) {
            return res.status(400).json({
                success: false,
                message: "La hora de fin debe ser posterior a la hora de inicio"
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
        await reserva.update({
            fecha: fecha || reserva.fecha,
            hora_inicio: hora_inicio || reserva.hora_inicio,
            hora_fin: hora_fin || reserva.hora_fin,
            estado: estado || reserva.estado,
            observaciones: observaciones || reserva.observaciones,
            cancha_id: cancha_id || reserva.cancha_id
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
                    attributes: ['id', 'correo', 'nombre', 'apellido']
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
