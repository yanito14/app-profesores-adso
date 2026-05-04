require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/asignaturas', require('./routes/asignaturas'));
app.use('/inscripciones', require('./routes/inscripciones'));

// Health check — el Load Balancer lo usa para verificar que el servidor esta vivo
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        modulo: 'profesores',
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '127.0.0.1', () => {
    console.log(`Servidor profesores escuchando en puerto ${PORT}`);
});
