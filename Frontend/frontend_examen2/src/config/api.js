// Configuración de la API
const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
    ENDPOINTS: {
        // Usuarios
        USUARIOS: '/api/usuarios',
        LOGIN: '/api/usuarios/login',
        
        // Canchas
        CANCHAS: '/api/canchas',
        CANCHAS_DISPONIBLES: '/api/canchas/disponibles',
        CANCHAS_TIPO: '/api/canchas/tipo',
        
        // Horarios
        HORARIOS: '/api/horarios',
        HORARIOS_CANCHA: '/api/horarios/cancha',
        
        // Reservas
        RESERVAS: '/api/reservas',
        RESERVAS_USUARIO: '/api/reservas/usuario',
        RESERVAS_CANCHA: '/api/reservas/cancha',
        CANCELAR_RESERVA: '/api/reservas'
    }
};

// Helper para construir URLs completas
export const buildURL = (endpoint, params = {}) => {
    let url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    // Reemplazar parámetros en la URL
    Object.keys(params).forEach(key => {
        url = url.replace(`:${key}`, params[key]);
    });
    
    return url;
};

// Helper para obtener headers de autorización
export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

// Helper para hacer requests con manejo de errores
export const apiRequest = async (url, options = {}) => {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...getAuthHeaders(),
                ...options.headers
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Token expirado o inválido
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                throw new Error('Sesión expirada');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Request error:', error);
        throw error;
    }
};

export default API_CONFIG;
