const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /inscripciones — lista todas las inscripciones con nombre de alumno y asignatura
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT i.id,
                    a.id AS alumno_id,
                    a.nombre AS alumno,
                    a.correo AS correo_alumno,
                    asig.id AS asignatura_id,
                    asig.nombre AS asignatura
             FROM inscripciones i
             JOIN alumnos a ON i.alumno_id = a.id
             JOIN asignaturas asig ON i.asignatura_id = asig.id
             ORDER BY asig.nombre, a.nombre`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener inscripciones' });
    }
});

// GET /inscripciones/:id — detalle de una inscripcion
router.get('/:id', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT i.id,
                    a.nombre AS alumno,
                    asig.nombre AS asignatura
             FROM inscripciones i
             JOIN alumnos a ON i.alumno_id = a.id
             JOIN asignaturas asig ON i.asignatura_id = asig.id
             WHERE i.id = $1`,
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Inscripcion no encontrada' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener inscripcion' });
    }
});

// POST /inscripciones — crear nueva inscripcion
router.post('/', async (req, res) => {
    const { alumno_id, asignatura_id } = req.body;
    if (!alumno_id || !asignatura_id) {
        return res.status(400).json({ error: 'alumno_id y asignatura_id son obligatorios' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO inscripciones (alumno_id, asignatura_id) VALUES ($1, $2) RETURNING *',
            [alumno_id, asignatura_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear inscripcion' });
    }
});

// DELETE /inscripciones/:id — eliminar inscripcion
router.delete('/:id', async (req, res) => {
    try {
        const result = await pool.query(
            'DELETE FROM inscripciones WHERE id = $1 RETURNING *',
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Inscripcion no encontrada' });
        }
        res.json({ mensaje: 'Inscripcion eliminada correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar inscripcion' });
    }
});

module.exports = router;
