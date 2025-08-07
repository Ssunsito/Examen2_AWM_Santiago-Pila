import React, { useState } from 'react';
import ListaCanchas from '../ListaCanchas';
import Reservacion from '../Reservacion';
import './CanchasPage.css';

const CanchasPage = () => {
    const [selectedCancha, setSelectedCancha] = useState(null);
    const [showReservacion, setShowReservacion] = useState(false);

    const handleCanchaClick = (cancha) => {
        setSelectedCancha(cancha);
        setShowReservacion(true);
    };

    const handleReservaCreada = (reserva) => {
        setShowReservacion(false);
        setSelectedCancha(null);
        alert('¡Reserva creada exitosamente!');
    };

    const handleCancelarReservacion = () => {
        setShowReservacion(false);
        setSelectedCancha(null);
    };

    return (
        <div className="canchas-page">
            <div className="page-header">
                <h1>🏟️ Canchas Deportivas</h1>
                <p>Explora y reserva las mejores canchas para tu deporte favorito</p>
            </div>

            <ListaCanchas onCanchaClick={handleCanchaClick} />

            {showReservacion && selectedCancha && (
                <Reservacion 
                    cancha={selectedCancha}
                    onReservaCreada={handleReservaCreada}
                    onCancelar={handleCancelarReservacion}
                />
            )}
        </div>
    );
};

export default CanchasPage;
