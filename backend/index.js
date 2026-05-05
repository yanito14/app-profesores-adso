require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

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
