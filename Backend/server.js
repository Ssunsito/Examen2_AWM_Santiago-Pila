const express = require('express');
const app = express();
const cors = require('cors');
const port = 8000;

// Importar configuración de base de datos
require('./Config/sequelize.config');

// Importar modelos para asegurar que se carguen
require('./Models');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar rutas
const usuarioRoutes = require('./Routes/usuario.routes');
const canchaRoutes = require('./Routes/cancha.routes');
const horarioRoutes = require('./Routes/horario.routes');
const reservaRoutes = require('./Routes/reserva.routes');
const protectedRoutes = require('./Routes/protected.routes');

// Definir rutas
usuarioRoutes(app);
canchaRoutes(app);
horarioRoutes(app);
reservaRoutes(app);
protectedRoutes(app);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ 
        message: 'API de Reserva de Canchas funcionando correctamente',
        version: '1.0.0'
    });
});

app.listen(port, function () {
    console.log('Server escuchando en el siguiente puerto: ', port);
});
/*Middleware que parsea el cuerpo de la solicitud
app.get('/restaurantes' , (_, response) =>{
    response.status(200).send({nombre: "Restaurante San José", dirección: "Ladrón de Guevara OE-56"})
});


app.post('/restaurantes/',(request, res)=>{
    console.log("Body:", request.body);
    res.status(201).json({mensaje:"Restaurante recibido correctamente"})
});

//Pruebas en clase
app.get('/api/restaurantes' , (_, response) =>{
    response.status(200).send(restaurantes);
});

app.get('/api/restaurantes/:id',(req,res)=> {
    console.log(req.params.id);
    if(req.params.id>=0 && req.params.id<restaurantes.length){
        res.status(200).send(restaurantes[req.params.id]);
    }
    res.status(404).json({error:"Restaurante no encontrado"});
})
app.post('/api/restaurantes/',(request, res)=>{
    console.log(request.body);
    restaurantes.push(request.body);
    res.status(201).json({mensaje:"OK"})
    res.status(404).json({mensaje:"Error de creación de restaurantes"})
});
app.put('/api/restaurantes/:id',(req,res)=> {
    console.log(req.params.id);
    if(req.params.id>=0 && req.params.id<restaurantes.length){
        const id = req.params.id;
        restaurantes[id] = req.body;
        res.status(200).send({respuesta: "OK"});
    }
    res.status(404).json({error:"Restaurante no encontrado"});
})

app.delete('/api/restaurantes/:id',(req,res)=> {
    console.log(req.params.id);
    if(req.params.id>=0 && req.params.id<restaurantes.length){
        const id = parseInt(req.params.id);
        restaurantes.splice(id, 1);
        res.status(200).send({respuesta: "Restaurante eliminado correctamente"});
    }else{
    res.status(404).json({error:"Restaurante no encontrado"});
    }
})*/
