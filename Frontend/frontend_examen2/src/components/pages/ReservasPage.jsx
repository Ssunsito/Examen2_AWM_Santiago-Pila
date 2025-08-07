import React, { useState, useEffect } from 'react';
import Reserva from '../Reserva';
import './ReservasPage.css';

const ReservasPage = () => {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchReservas();
    }, []);

    const fetchReservas = async () => {
        try {
            setLoading(true);
            const user = JSON.parse(localStorage.getItem('user'));
            const token = localStorage.getItem('token');

            if (!user || !token) {
                setError('Debes iniciar sesión para ver tus reservas');
                setLoading(false);
                return;
            }

            const response = await fetch(`http://localhost:8000/api/reservas/usuario/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setReservas(data.data);
            } else {
                setError('Error al cargar las reservas');
            }
        } catch (error) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelarReserva = (reservaId) => {
        setReservas(prev => prev.filter(r => r.id !== reservaId));
    };

    if (loading) {
        return (
            <div className="reservas-page">
                <div className="loading">Cargando tus reservas...</div>
            </div>
        );
    }

    return (
        <div className="reservas-page">
            <div className="page-header">
                <h1>📋 Mis Reservas</h1>
                <p>Gestiona todas tus reservas de canchas deportivas</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="reservas-container">
                {reservas.length > 0 ? (
                    <div className="reservas-list">
                        {reservas.map(reserva => (
                            <Reserva 
                                key={reserva.id} 
                                reserva={reserva}
                                onCancelarReserva={handleCancelarReserva}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="no-reservas">
                        <div className="no-reservas-icon">📋</div>
                        <h3>No tienes reservas aún</h3>
                        <p>Explora las canchas disponibles y haz tu primera reserva</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReservasPage;
