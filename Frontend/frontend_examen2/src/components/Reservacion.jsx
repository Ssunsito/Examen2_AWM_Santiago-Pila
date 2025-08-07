import React, { useState, useEffect } from 'react';
//import './Reservacion.css';

const Reservacion = ({ cancha, onReservaCreada, onCancelar }) => {
    const [formData, setFormData] = useState({
        fecha: '',
        horario_id: '',
        observaciones: ''
    });
    const [horarios, setHorarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (cancha) {
            fetchHorarios();
        }
    }, [cancha]);

    const fetchHorarios = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/horarios/cancha/${cancha.id}`);
            const data = await response.json();

            if (data.success) {
                setHorarios(data.data);
            } else {
                setError('Error al cargar los horarios');
            }
        } catch (error) {
            setError('Error de conexión');
        }
    };

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

        const reservaData = {
            fecha: formData.fecha,
            horario_id: parseInt(formData.horario_id),
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

    const formatTime = (time) => {
        return time.substring(0, 5); // Formato HH:MM
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
                        <label htmlFor="horario_id">Horario</label>
                        <select
                            id="horario_id"
                            name="horario_id"
                            value={formData.horario_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecciona un horario</option>
                            {horarios.map(horario => (
                                <option key={horario.id} value={horario.id}>
                                    {formatTime(horario.hora_inicio)} - {formatTime(horario.hora_fin)}
                                </option>
                            ))}
                        </select>
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
