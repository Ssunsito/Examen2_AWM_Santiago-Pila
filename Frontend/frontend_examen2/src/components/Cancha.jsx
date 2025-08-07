import React from 'react';
//import './Cancha.css';

const Cancha = ({ cancha, onClick, isDetail = false }) => {
    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'disponible':
                return 'estado-disponible';
            case 'reservada':
                return 'estado-reservada';
            case 'mantenimiento':
                return 'estado-mantenimiento';
            default:
                return 'estado-desconocido';
        }
    };

    const getTipoIcon = (tipo) => {
        switch (tipo) {
            case 'futbol':
                return '⚽';
            case 'tenis':
                return '🎾';
            case 'basquet':
                return '🏀';
            case 'voley':
                return '🏐';
            default:
                return '🏟️';
        }
    };

    const formatTipo = (tipo) => {
        const tipos = {
            futbol: 'Fútbol',
            tenis: 'Tenis',
            basquet: 'Básquet',
            voley: 'Vóley'
        };
        return tipos[tipo] || tipo;
    };

    if (isDetail) {
        return (
            <div className="cancha-detail">
                <div className="cancha-header">
                    <h2>{cancha.nombre}</h2>
                    <span className={`estado ${getEstadoColor(cancha.estado)}`}>
                        {cancha.estado}
                    </span>
                </div>
                
                <div className="cancha-info">
                    <div className="info-item">
                        <span className="label">Tipo:</span>
                        <span className="value">
                            {getTipoIcon(cancha.tipo)} {formatTipo(cancha.tipo)}
                        </span>
                    </div>
                    
                    <div className="info-item">
                        <span className="label">Capacidad:</span>
                        <span className="value">{cancha.capacidad} personas</span>
                    </div>
                    
                    {cancha.descripcion && (
                        <div className="info-item">
                            <span className="label">Descripción:</span>
                            <span className="value">{cancha.descripcion}</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="cancha-card" onClick={onClick}>
            <div className="cancha-header">
                <div className="cancha-icon">
                    {getTipoIcon(cancha.tipo)}
                </div>
                <span className={`estado ${getEstadoColor(cancha.estado)}`}>
                    {cancha.estado}
                </span>
            </div>
            
            <div className="cancha-content">
                <h3 className="cancha-nombre">{cancha.nombre}</h3>
                <p className="cancha-tipo">{formatTipo(cancha.tipo)}</p>
                <p className="cancha-capacidad">Capacidad: {cancha.capacidad} personas</p>
                
                {cancha.descripcion && (
                    <p className="cancha-descripcion">{cancha.descripcion}</p>
                )}
            </div>
            
            <div className="cancha-footer">
                <button className="ver-detalles-btn">
                    Ver detalles
                </button>
            </div>
        </div>
    );
};

export default Cancha;
