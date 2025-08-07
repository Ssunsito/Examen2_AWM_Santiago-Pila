import React, { useState } from 'react';
//import './Reservacion.css';

const Reservacion = ({ cancha, onReservaCreada, onCancelar }) => {
    const [formData, setFormData] = useState({
        fecha: '',
        hora_inicio: '',
        hora_fin: '',
        observaciones: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            setError('Debes iniciar sesión para hacer una reserva');
            setLoading(false);
            return;
        }

        // Validar que hora_fin sea posterior a hora_inicio
        if (formData.hora_inicio >= formData.hora_fin) {
            setError('La hora de fin debe ser posterior a la hora de inicio');
            setLoading(false);
            return;
        }

        const reservaData = {
            fecha: formData.fecha,
            hora_inicio: formData.hora_inicio,
            hora_fin: formData.hora_fin,
            cancha_id: cancha.id,
            usuario_id: user.id,
            observaciones: formData.observaciones
        };

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/api/reservas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(reservaData)
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('Reserva creada exitosamente');
                setTimeout(() => {
                    onReservaCreada(data.data);
                }, 1500);
            } else {
                setError(data.message || 'Error al crear la reserva');
            }
        } catch (error) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    if (!cancha) {
        return <div className="error-message">No se seleccionó ninguna cancha</div>;
    }

    return (
        <div className="reservacion-container">
            <div className="reservacion-card">
                <div className="reservacion-header">
                    <h2>Reservar Cancha</h2>
                    <button onClick={onCancelar} className="cancelar-btn">
                        ✕
                    </button>
                </div>

                <div className="cancha-info">
                    <h3>{cancha.nombre}</h3>
                    <p>Tipo: {cancha.tipo}</p>
                    <p>Capacidad: {cancha.capacidad} personas</p>
                </div>

                <form onSubmit={handleSubmit} className="reservacion-form">
                    <div className="form-group">
                        <label htmlFor="fecha">Fecha de reserva</label>
                        <input
                            type="date"
                            id="fecha"
                            name="fecha"
                            value={formData.fecha}
                            onChange={handleChange}
                            min={getMinDate()}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="hora_inicio">Hora de inicio</label>
                        <input
                            type="time"
                            id="hora_inicio"
                            name="hora_inicio"
                            value={formData.hora_inicio}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="hora_fin">Hora de fin</label>
                        <input
                            type="time"
                            id="hora_fin"
                            name="hora_fin"
                            value={formData.hora_fin}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="observaciones">Observaciones (opcional)</label>
                        <textarea
                            id="observaciones"
                            name="observaciones"
                            value={formData.observaciones}
                            onChange={handleChange}
                            placeholder="Agrega alguna observación especial..."
                            rows="3"
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <div className="form-actions">
                        <button 
                            type="button" 
                            onClick={onCancelar}
                            className="cancelar-reserva-btn"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="confirmar-reserva-btn"
                            disabled={loading}
                        >
                            {loading ? 'Creando reserva...' : 'Confirmar Reserva'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Reservacion;
