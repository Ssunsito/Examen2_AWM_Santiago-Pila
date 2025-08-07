# Backend - Reserva de Canchas

API REST para gestión de reservas de canchas deportivas.

## 🚀 Características

- **Gestión de Usuarios**: Registro, login, CRUD completo
- **Gestión de Canchas**: Diferentes tipos de canchas deportivas
- **Sistema de Reservas**: Reserva de canchas con horarios
- **Base de Datos**: MySQL con Sequelize ORM
- **Autenticación**: JWT para seguridad

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- MySQL (v8.0 o superior)
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd Backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar base de datos**
- Crear base de datos MySQL llamada `BDExamen2`
- Modificar credenciales en `Config/sequelize.config.js` si es necesario

4. **Variables de entorno**
Crear archivo `.env` en la raíz del proyecto:
```env
DB_USERNAME=root
DB_PASSWORD=root
DB_NAME=BDExamen2
DB_HOST=localhost
JWT_SECRET=tu_secreto_jwt_aqui
PORT=8000
```

## 🚀 Ejecutar

**Desarrollo:**
```bash
npm run dev
```

**Producción:**
```bash
npm start
```

El servidor estará disponible en `http://localhost:8000`

## 📚 Endpoints

### Usuarios
- `POST /api/usuarios` - Crear usuario
- `POST /api/usuarios/login` - Login de usuario
- `GET /api/usuarios` - Obtener todos los usuarios
- `GET /api/usuarios/:id` - Obtener usuario por ID
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario

### Rutas Protegidas (Requieren Autenticación)
- `GET /api/protected/profile` - Perfil del usuario autenticado
- `GET /api/protected/me` - Datos del usuario autenticado
- `GET /api/protected/admin-only` - Solo para administradores

### Canchas
- `POST /api/canchas` - Crear cancha
- `GET /api/canchas` - Obtener todas las canchas
- `GET /api/canchas/disponibles` - Obtener canchas disponibles
- `GET /api/canchas/tipo/:tipo` - Obtener canchas por tipo
- `GET /api/canchas/:id` - Obtener cancha por ID
- `PUT /api/canchas/:id` - Actualizar cancha
- `DELETE /api/canchas/:id` - Eliminar cancha

### Horarios
- `POST /api/horarios` - Crear horario
- `GET /api/horarios` - Obtener todos los horarios
- `GET /api/horarios/cancha/:cancha_id` - Obtener horarios por cancha
- `GET /api/horarios/:id` - Obtener horario por ID
- `PUT /api/horarios/:id` - Actualizar horario
- `DELETE /api/horarios/:id` - Eliminar horario

### Reservas
- `POST /api/reservas` - Crear reserva
- `GET /api/reservas` - Obtener todas las reservas
- `GET /api/reservas/usuario/:usuario_id` - Obtener reservas por usuario
- `GET /api/reservas/cancha/:cancha_id` - Obtener reservas por cancha
- `GET /api/reservas/:id` - Obtener reserva por ID
- `PUT /api/reservas/:id` - Actualizar reserva
- `DELETE /api/reservas/:id` - Eliminar reserva
- `PUT /api/reservas/:id/cancelar` - Cancelar reserva

## 🗄️ Estructura de Base de Datos

### Tabla: usuarios
- `id` (INT, PK, AUTO_INCREMENT)
- `nombre` (VARCHAR(100))
- `email` (VARCHAR(100), UNIQUE)
- `password` (VARCHAR(255))
- `telefono` (VARCHAR(15))
- `rol` (ENUM: 'admin', 'usuario')
- `activo` (BOOLEAN)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### Tabla: canchas
- `id` (INT, PK, AUTO_INCREMENT)
- `nombre` (VARCHAR(100))
- `tipo` (ENUM: 'futbol', 'tenis', 'basquet', 'voley')
- `superficie` (ENUM: 'cesped', 'cemento', 'sintetico')
- `capacidad` (INT)
- `precio_hora` (DECIMAL(10,2))
- `estado` (ENUM: 'disponible', 'mantenimiento', 'reservada')
- `descripcion` (TEXT)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### Tabla: reservas
- `id` (INT, PK, AUTO_INCREMENT)
- `fecha` (DATE)
- `hora_inicio` (TIME)
- `hora_fin` (TIME)
- `precio_total` (DECIMAL(10,2))
- `estado` (ENUM: 'pendiente', 'confirmada', 'cancelada', 'completada')
- `observaciones` (TEXT)
- `usuario_id` (INT, FK)
- `cancha_id` (INT, FK)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

## 🔧 Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Sequelize** - ORM para MySQL
- **MySQL** - Base de datos
- **bcryptjs** - Encriptación de contraseñas
- **jsonwebtoken** - Autenticación JWT
- **cors** - Middleware para CORS

## 🔐 Autenticación

### Bearer Token
La API utiliza autenticación JWT con Bearer tokens. Para acceder a rutas protegidas:

1. **Login/Registro**: Obtén el token Bearer
2. **Incluir en headers**: `Authorization: Bearer <token>`

### Ejemplo de uso:
```bash
# Login
curl -X POST http://localhost:8000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"correo": "usuario@ejemplo.com", "password": "password123"}'

# Usar token en rutas protegidas
curl -X GET http://localhost:8000/api/protected/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 📝 Licencia

MIT License
