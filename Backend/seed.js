const sequelize = require('./Config/sequelize.config');
const { Usuario, Cancha, Horario } = require('./Models');
const bcrypt = require('bcryptjs');

const seedData = async () => {
    try {
        console.log(' Iniciando seeding de datos...');

        // Limpiar datos existentes
        await sequelize.sync({ force: true });

        // Crear usuarios de prueba
        const hashedPassword = await bcrypt.hash('123456', 10);
        
        const usuarios = await Usuario.bulkCreate([
            {
                nombre: 'Santiago',
                apellido: 'Pila',
                correo: 'santiago.pila@epn.edu.ec',
                telefono: '0987654321',
                password: hashedPassword,
                rol: 'usuario'
            },
            {
                nombre: 'María',
                apellido: 'García',
                correo: 'maria@epn.edu.ec',
                telefono: '0987654322',
                password: hashedPassword,
                rol: 'usuario'
            },
            {
                nombre: 'Admin',
                apellido: 'Sistema',
                correo: 'admin@epn.edu.ec',
                telefono: '0987654323',
                password: hashedPassword,
                rol: 'admin'
            }
        ]);

        console.log('✅ Usuarios creados');

        // Crear canchas de prueba
        const canchas = await Cancha.bulkCreate([
            {
                nombre: 'Cancha 1',
                tipo: 'futbol',
                capacidad: 22,
                estado: 'disponible',
                descripcion: 'Cancha de fútbol profesional con césped sintético',
            },
            {
                nombre: 'Cancha 2',
                tipo: 'futbol',
                capacidad: 22,
                estado: 'disponible',
                descripcion: 'Cancha de fútbol profesional con césped sintético',

            },
            {
                nombre: 'Cancha 3',
                tipo: 'futbol',
                capacidad: 22,
                estado: 'disponible',
                descripcion: 'Cancha de fútbol profesional con césped sintético',
            },
            {
                nombre: 'Cancha 4',
                tipo: 'futbol',
                capacidad: 22,
                estado: 'disponible',
                descripcion: 'Cancha de fútbol profesional con césped sintético',
            }
            
        ]);

        console.log('✅ Canchas creadas');

        // Crear horarios para cada cancha
        for (const cancha of canchas) {
            const horarios = [];
            
            // Horarios de 6:00 AM a 10:00 PM cada 2 horas
            for (let hora = 6; hora <= 22; hora += 2) {
                const horaInicio = `${hora.toString().padStart(2, '0')}:00:00`;
                const horaFin = `${(hora + 2).toString().padStart(2, '0')}:00:00`;
                
                horarios.push({
                    cancha_id: cancha.id,
                    hora_inicio: horaInicio,
                    hora_fin: horaFin,
                    disponible: true
                });
            }
            
            await Horario.bulkCreate(horarios);
        }

        console.log('✅ Horarios creados');

        // Crear algunas reservas de ejemplo
        const { Reserva } = require('./Models');
        
        // Obtener fecha de mañana
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const fechaReserva = tomorrow.toISOString().split('T')[0];

        const reservasEjemplo = await Reserva.bulkCreate([
            {
                fecha: fechaReserva,
                hora_inicio: '08:00',
                hora_fin: '10:00',
                estado: 'confirmada',
                observaciones: 'Partido amistoso',
                usuario_id: usuarios[0].id,
                cancha_id: canchas[0].id
            },
            {
                fecha: fechaReserva,
                hora_inicio: '14:00',
                hora_fin: '16:00',
                estado: 'pendiente',
                observaciones: 'Entrenamiento de tenis',
                usuario_id: usuarios[1].id,
                cancha_id: canchas[2].id
            }
        ]);

        console.log('✅ Reservas de ejemplo creadas');
        console.log('🎉 Seeding completado exitosamente!');
        
        console.log('\n📋 Datos de prueba creados:');

    } catch (error) {
        console.error('❌ Error en seeding:', error);
    } finally {
        await sequelize.close();
        process.exit(0);
    }
};

seedData();
