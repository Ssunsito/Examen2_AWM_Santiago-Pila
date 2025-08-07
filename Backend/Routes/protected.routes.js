const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../Middleware/auth.middleware');

// Ejemplo de rutas protegidas que requieren autenticación
module.exports = function(app) {
    app.get('/api/protected/profile', authenticateToken, (req, res) => {
        res.json({
            success: true,
            message: "Perfil del usuario",
            data: {
                id: req.usuario.id,
                correo: req.usuario.correo,
                rol: req.usuario.rol
            }
        });
    });

    // Ruta que requiere ser admin
    app.get('/api/protected/admin-only', authenticateToken, isAdmin, (req, res) => {
        res.json({
            success: true,
            message: "Acceso a área de administración",
            data: {
                message: "Solo administradores pueden ver esto"
            }
        });
    });

    // Ruta protegida para obtener datos del usuario autenticado
    app.get('/api/protected/me', authenticateToken, (req, res) => {
        res.json({
            success: true,
            message: "Datos del usuario autenticado",
            data: {
                id: req.usuario.id,
                correo: req.usuario.correo,
                rol: req.usuario.rol
            }
        });
    });
}
module.exports = router;
