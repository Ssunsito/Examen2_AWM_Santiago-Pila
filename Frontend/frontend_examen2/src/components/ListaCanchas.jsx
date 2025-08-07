import React, { useState, useEffect } from 'react';
import Cancha from './Cancha';
//import './ListaCanchas.css';

const ListaCanchas = ({ onCanchaClick }) => {
    const [canchas, setCanchas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('todos');
    const [soloDisponibles, setSoloDisponibles] = useState(false);

    useEffect(() => {
        fetchCanchas();
    }, []);

    const fetchCanchas = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/api/canchas');
            const data = await response.json();

            if (data.success) {
                setCanchas(data.data);
            } else {
                setError('Error al cargar las canchas');
            }
        } catch (error) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const fetchCanchasDisponibles = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/api/canchas/disponibles');
            const data = await response.json();

            if (data.success) {
                setCanchas(data.data);
            } else {
                setError('Error al cargar las canchas disponibles');
            }
        } catch (error) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const handleFiltroChange = (e) => {
        const tipo = e.target.value;
        setFiltroTipo(tipo);
        
        if (tipo === 'todos') {
            fetchCanchas();
        } else {
            fetchCanchasByTipo(tipo);
        }
    };

    const fetchCanchasByTipo = async (tipo) => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8000/api/canchas/tipo/${tipo}`);
            const data = await response.json();

            if (data.success) {
                setCanchas(data.data);
            } else {
                setError('Error al filtrar las canchas');
            }
        } catch (error) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const handleSoloDisponibles = () => {
        setSoloDisponibles(!soloDisponibles);
        if (!soloDisponibles) {
            fetchCanchasDisponibles();
        } else {
            fetchCanchas();
        }
    };

    const canchasFiltradas = canchas.filter(cancha => {
        if (soloDisponibles && cancha.estado !== 'disponible') {
            return false;
        }
        return true;
    });

    if (loading) {
        return (
            <div className="lista-canchas-container">
                <div className="loading">Cargando canchas...</div>
            </div>
        );
    }

    return (
        <div className="lista-canchas-container">
            <div className="filtros">
                <h2>Canchas Deportivas</h2>
                
                <div className="filtros-controls">
                    <div className="filtro-grupo">
                        <label htmlFor="filtro-tipo">Filtrar por tipo:</label>
                        <select 
                            id="filtro-tipo" 
                            value={filtroTipo} 
                            onChange={handleFiltroChange}
                        >
                            <option value="todos">Todas las canchas</option>
                            <option value="futbol">Fútbol</option>
                            <option value="tenis">Tenis</option>
                            <option value="basquet">Básquet</option>
                            <option value="voley">Vóley</option>
                        </select>
                    </div>

                    <div className="filtro-grupo">
                        <label>
                            <input
                                type="checkbox"
                                checked={soloDisponibles}
                                onChange={handleSoloDisponibles}
                            />
                            Solo disponibles
                        </label>
                    </div>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="canchas-grid">
                {canchasFiltradas.length > 0 ? (
                    canchasFiltradas.map(cancha => (
                        <Cancha 
                            key={cancha.id} 
                            cancha={cancha} 
                            onClick={() => onCanchaClick(cancha)}
                        />
                    ))
                ) : (
                    <div className="no-canchas">
                        <p>No se encontraron canchas con los filtros seleccionados</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListaCanchas;
