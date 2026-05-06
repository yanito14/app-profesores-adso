const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /asignaturas — lista todas las asignaturas
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM asignaturas ORDER BY nombre ASC'
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener asignaturas' });
    }
});

// GET /asignaturas/:id — detalle de una asignatura
router.get('/:id', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM asignaturas WHERE id = $1',
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Asignatura no encontrada' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener asignatura' });
    }
});

// GET /asignaturas/:id/alumnos — alumnos inscritos en una asignatura
router.get('/:id/alumnos', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT a.id, a.nombre, a.correo
             FROM inscripciones i
             JOIN alumnos a ON i.id_alumno = a.id
             WHERE i.id_asignatura = $1
             ORDER BY a.nombre ASC`,
            [req.params.id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener alumnos inscritos' });
    }
});

// POST /asignaturas — crear nueva asignatura
router.post('/', async (req, res) => {
    const { nombre, descripcion, ects, cuatrimestre, curso, departamento } = req.body;
    if (!nombre || !ects) {
        return res.status(400).json({ error: 'nombre y ects son obligatorios' });
    }
    try {
        const result = await pool.query(
            `INSERT INTO asignaturas (nombre, descripcion, ects, cuatrimestre, curso, departamento)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [nombre, descripcion, ects, cuatrimestre, curso, departamento]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear asignatura' });
    }
});

// PUT /asignaturas/:id — actualizar asignatura
router.put('/:id', async (req, res) => {
    const { nombre, descripcion, ects } = req.body;
    try {
        const result = await pool.query(
            `UPDATE asignaturas
             SET nombre = COALESCE($1, nombre),
                 descripcion = COALESCE($2, descripcion),
                 ects = COALESCE($3, ects)
             WHERE id = $4
             RETURNING *`,
            [nombre, descripcion, ects, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Asignatura no encontrada' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar asignatura' });
    }
});

// DELETE /asignaturas/:id — eliminar asignatura
router.delete('/:id', async (req, res) => {
    try {
        const result = await pool.query(
            'DELETE FROM asignaturas WHERE id = $1 RETURNING *',
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Asignatura no encontrada' });
        }
        res.json({ mensaje: 'Asignatura eliminada correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar asignatura' });
    }
});

module.exports = router;
