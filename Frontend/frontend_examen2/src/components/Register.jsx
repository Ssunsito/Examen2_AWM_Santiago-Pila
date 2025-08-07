import React, { useState } from 'react';
import './Register.css';

const Register = ({ onRegister, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        correo: '',
        telefono: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Validaciones
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: formData.nombre,
                    apellido: formData.apellido,
                    correo: formData.correo,
                    telefono: formData.telefono,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (data.success) {
                alert('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
                onSwitchToLogin();
            } else {
                setError(data.message || 'Error en el registro');
            }
        } catch (error) {
            setError('Error de conexión. Verifica que el servidor esté funcionando.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>Crear Cuenta</h2>
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                                placeholder="Tu nombre"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="apellido">Apellido</label>
                            <input
                                type="text"
                                id="apellido"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleChange}
                                required
                                placeholder="Tu apellido"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="correo">Correo Electrónico</label>
                        <input
                            type="email"
                            id="correo"
                            name="correo"
                            value={formData.correo}
                            onChange={handleChange}
                            required
                            placeholder="usuario@ejemplo.com"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="telefono">Teléfono</label>
                        <input
                            type="tel"
                            id="telefono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            required
                            placeholder="0987654321"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Mínimo 6 caracteres"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Repite tu contraseña"
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button 
                        type="submit" 
                        className="register-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Registrando...' : 'Crear Cuenta'}
                    </button>
                </form>

                <div className="login-link">
                    <p>¿Ya tienes cuenta? 
                        <button 
                            type="button" 
                            onClick={onSwitchToLogin}
                            className="link-button"
                        >
                            Inicia sesión aquí
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
