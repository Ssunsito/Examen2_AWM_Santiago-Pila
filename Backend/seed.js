const sequelize = require('./Config/sequelize.config');
const { Usuario, Cancha, Horario } = require('./Models');
const bcrypt = require('bcryptjs');

const seedData = async () => {
    try {
        console.log('🌱 Iniciando seeding de datos...');

        // Limpiar datos existentes
        await sequelize.sync({ force: true });

        // Crear usuarios de prueba
        const hashedPassword = await bcrypt.hash('123456', 10);
        
        const usuarios = await Usuario.bulkCreate([
            {
                nombre: 'Juan',
                apellido: 'Pérez',
                correo: 'juan@test.com',
                telefono: '0987654321',
                password: hashedPassword,
                rol: 'usuario'
            },
            {
                nombre: 'María',
                apellido: 'García',
                correo: 'maria@test.com',
                telefono: '0987654322',
                password: hashedPassword,
                rol: 'usuario'
            },
            {
                nombre: 'Admin',
                apellido: 'Sistema',
                correo: 'admin@test.com',
                telefono: '0987654323',
                password: hashedPassword,
                rol: 'admin'
            }
        ]);

        console.log('✅ Usuarios creados');

        // Crear canchas de prueba
        const canchas = await Cancha.bulkCreate([
            {
                nombre: 'Cancha de Fútbol Norte',
                tipo: 'futbol',
                capacidad: 22,
                estado: 'disponible',
                descripcion: 'Cancha de fútbol profesional con césped sintético',
                precio_hora: 25.00
            },
            {
                nombre: 'Cancha de Fútbol Sur',
                tipo: 'futbol',
                capacidad: 22,
                estado: 'disponible',
                descripcion: 'Cancha de fútbol con césped natural',
                precio_hora: 30.00
            },
            {
                nombre: 'Cancha de Tenis 1',
                tipo: 'tenis',
                capacidad: 4,
                estado: 'disponible',
                descripcion: 'Cancha de tenis con superficie de arcilla',
                precio_hora: 15.00
            },
            {
                nombre: 'Cancha de Tenis 2',
                tipo: 'tenis',
                capacidad: 4,
                estado: 'disponible',
                descripcion: 'Cancha de tenis con superficie dura',
                precio_hora: 15.00
            },
            {
                nombre: 'Cancha de Básquet Central',
                tipo: 'basquet',
                capacidad: 10,
                estado: 'disponible',
                descripcion: 'Cancha de básquet cubierta',
                precio_hora: 20.00
            },
            {
                nombre: 'Cancha de Vóley',
                tipo: 'voley',
                capacidad: 12,
                estado: 'disponible',
                descripcion: 'Cancha de vóley al aire libre',
                precio_hora: 18.00
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
        console.log('🎉 Seeding completado exitosamente!');
        
        console.log('\n📋 Datos de prueba creados:');
        console.log('👤 Usuarios:');
        console.log('   - juan@test.com / 123456');
        console.log('   - maria@test.com / 123456');
        console.log('   - admin@test.com / 123456 (admin)');
        console.log('🏟️ Canchas: 6 canchas de diferentes tipos');
        console.log('⏰ Horarios: De 6:00 AM a 10:00 PM cada 2 horas');

    } catch (error) {
        console.error('❌ Error en seeding:', error);
    } finally {
        await sequelize.close();
        process.exit(0);
    }
};

seedData();
