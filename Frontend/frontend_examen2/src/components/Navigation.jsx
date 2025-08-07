import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = ({ onLogout }) => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className="navigation">
            <div className="nav-container">
                <div className="nav-brand">
                    <Link to="/canchas" className="brand-link">
                        🏟️ Reserva de Canchas
                    </Link>
                </div>

                <div className="nav-menu">
                    <Link 
                        to="/canchas" 
                        className={`nav-link ${isActive('/canchas') ? 'active' : ''}`}
                    >
                        🏟️ Canchas
                    </Link>
                    
                    <Link 
                        to="/reservas" 
                        className={`nav-link ${isActive('/reservas') ? 'active' : ''}`}
                    >
                        📋 Mis Reservas
                    </Link>
                    
                    <button onClick={onLogout} className="logout-btn">
                        🚪 Cerrar Sesión
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
