import React from 'react';
//import './Reserva.css';

const Reserva = ({ reserva, onCancelarReserva }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (time) => {
        return time.substring(0, 5); // Formato HH:MM
    };

    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'pendiente':
                return 'estado-pendiente';
            case 'confirmada':
                return 'estado-confirmada';
            case 'cancelada':
                return 'estado-cancelada';
            case 'completada':
                return 'estado-completada';
            default:
                return 'estado-desconocido';
        }
    };

    const getEstadoText = (estado) => {
        const estados = {
            pendiente: 'Pendiente',
            confirmada: 'Confirmada',
            cancelada: 'Cancelada',
            completada: 'Completada'
        };
        return estados[estado] || estado;
    };

    const handleCancelarReserva = async () => {
        if (!window.confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8000/api/reservas/${reserva.id}/cancelar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });

            const data = await response.json();

            if (data.success) {
                onCancelarReserva(reserva.id);
            } else {
                alert('Error al cancelar la reserva: ' + data.message);
            }
        } catch (error) {
            alert('Error de conexión al cancelar la reserva');
        }
    };

    return (
        <div className="reserva-card">
            <div className="reserva-header">
                <div className="reserva-info-principal">
                    <h3 className="reserva-titulo">
                        Reserva #{reserva.id}
                    </h3>
                    <span className={`estado ${getEstadoColor(reserva.estado)}`}>
                        {getEstadoText(reserva.estado)}
                    </span>
                </div>
                
                {reserva.estado !== 'cancelada' && reserva.estado !== 'completada' && (
                    <button 
                        onClick={handleCancelarReserva}
                        className="cancelar-reserva-btn"
                        title="Cancelar reserva"
                    >
                        ✕
                    </button>
                )}
            </div>

            <div className="reserva-content">
                <div className="reserva-detalles">
                    <div className="detalle-item">
                        <span className="label">Cancha:</span>
                        <span className="value">{reserva.Cancha?.nombre || 'N/A'}</span>
                    </div>
                    
                    <div className="detalle-item">
                        <span className="label">Tipo:</span>
                        <span className="value">{reserva.Cancha?.tipo || 'N/A'}</span>
                    </div>
                    
                    <div className="detalle-item">
                        <span className="label">Fecha:</span>
                        <span className="value">{formatDate(reserva.fecha)}</span>
                    </div>
                    
                    <div className="detalle-item">
                        <span className="label">Horario:</span>
                        <span className="value">
                            {reserva.Horario ? 
                                `${formatTime(reserva.Horario.hora_inicio)} - ${formatTime(reserva.Horario.hora_fin)}` : 
                                'N/A'
                            }
                        </span>
                    </div>
                    
                    {reserva.observaciones && (
                        <div className="detalle-item">
                            <span className="label">Observaciones:</span>
                            <span className="value">{reserva.observaciones}</span>
                        </div>
                    )}
                </div>

                <div className="reserva-footer">
                    <div className="reserva-fecha-creacion">
                        <small>
                            Creada el: {new Date(reserva.createdAt).toLocaleDateString('es-ES')}
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reserva;
