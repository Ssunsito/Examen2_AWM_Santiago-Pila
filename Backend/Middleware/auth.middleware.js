const jwt = require('jsonwebtoken');
const { Usuario } = require('../Models');

// Función helper para generar Bearer token
const generateBearerToken = (id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '30d' });
    return `Bearer ${token}`;
};

// Función helper para extraer token del Bearer
const extractTokenFromBearer = (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7);
};

// Middleware para verificar token JWT
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        
        // Verificar que el header de autorización existe y tiene el formato correcto
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Token de acceso requerido. Formato: Bearer <token>"
            });
        }

        // Extraer el token del header usando la función helper
        const token = extractTokenFromBearer(authHeader);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token de acceso requerido"
            });
        }

        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        
        // Buscar usuario
        const usuario = await Usuario.findByPk(decoded.id);
        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: "Token inválido - Usuario no encontrado"
            });
        }

        // Agregar usuario al request
        req.usuario = usuario;
        next();

    } catch (error) {
        console.error('Error en autenticación:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token expirado"
            });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Token inválido"
            });
        }
        
        return res.status(403).json({
            success: false,
            message: "Error en la autenticación"
        });
    }
};

// Middleware para verificar si es admin (opcional)
const isAdmin = (req, res, next) => {
    if (req.usuario && req.usuario.rol === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: "Acceso denegado. Se requieren permisos de administrador"
        });
    }
};

module.exports = {
    authenticateToken,
    isAdmin,
    generateBearerToken,
    extractTokenFromBearer
};
