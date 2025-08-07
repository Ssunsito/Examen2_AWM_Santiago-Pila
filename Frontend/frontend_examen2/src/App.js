import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './styles/override.css';
import Navigation from './components/Navigation';
import LoginPage from './components/pages/LoginPage';
import CanchasPage from './components/pages/CanchasPage';
import ReservasPage from './components/pages/ReservasPage';

function App() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Verificar si hay un usuario logueado
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (savedUser && token) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    };

    // Componente para rutas protegidas
    const ProtectedRoute = ({ children }) => {
        if (isLoading) {
            return <div className="loading">Cargando...</div>;
        }
        
        if (!user) {
            return <Navigate to="/login" replace />;
        }
        
        return children;
    };

    // Componente para rutas públicas (solo login)
    const PublicRoute = ({ children }) => {
        if (isLoading) {
            return <div className="loading">Cargando...</div>;
        }
        
        if (user) {
            return <Navigate to="/canchas" replace />;
        }
        
        return children;
    };

    if (isLoading) {
        return (
            <div className="app-loading">
                <div className="loading-spinner">🏟️</div>
                <p>Cargando aplicación...</p>
            </div>
        );
    }

    return (
        <Router>
            <div className="App">
                {user && <Navigation onLogout={handleLogout} />}
                
                <main className="app-main">
                    <Routes>
                        {/* Ruta pública */}
                        <Route 
                            path="/login" 
                            element={
                                <PublicRoute>
                                    <LoginPage onLogin={handleLogin} />
                                </PublicRoute>
                            } 
                        />
                        
                        {/* Rutas protegidas */}
                        <Route 
                            path="/canchas" 
                            element={
                                <ProtectedRoute>
                                    <CanchasPage />
                                </ProtectedRoute>
                            } 
                        />
                        
                        <Route 
                            path="/reservas" 
                            element={
                                <ProtectedRoute>
                                    <ReservasPage />
                                </ProtectedRoute>
                            } 
                        />
                        
                        {/* Redirección por defecto */}
                        <Route 
                            path="/" 
                            element={<Navigate to={user ? "/canchas" : "/login"} replace />} 
                        />
                        
                        {/* Ruta 404 */}
                        <Route 
                            path="*" 
                            element={<Navigate to={user ? "/canchas" : "/login"} replace />} 
                        />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
