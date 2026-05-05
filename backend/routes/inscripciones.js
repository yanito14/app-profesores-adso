const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /inscripciones — lista todas las inscripciones
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT i.id_alumno,
                    i.id_asignatura,
                    i.fecha_realizacion,
                    i.curso_academico,
                    i.estado_matricula,
                    i.nota_final,
                    i.convocatoria,
                    a.nombre AS alumno,
                    a.correo AS correo_alumno,
                    asig.nombre AS asignatura
             FROM inscripciones i
             JOIN alumnos a ON i.id_alumno = a.id
             JOIN asignaturas asig ON i.id_asignatura = asig.id
             ORDER BY asig.nombre, a.nombre`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener inscripciones' });
    }
});

// GET /inscripciones/:id_alumno/:id_asignatura/:curso — detalle
router.get('/:id_alumno/:id_asignatura/:curso', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT i.*, a.nombre AS alumno, asig.nombre AS asignatura
             FROM inscripciones i
             JOIN alumnos a ON i.id_alumno = a.id
             JOIN asignaturas asig ON i.id_asignatura = asig.id
             WHERE i.id_alumno = $1 AND i.id_asignatura = $2 AND i.curso_academico = $3`,
            [req.params.id_alumno, req.params.id_asignatura, req.params.curso]
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
    const { id_alumno, id_asignatura, curso_academico, convocatoria } = req.body;
    if (!id_alumno || !id_asignatura || !curso_academico) {
        return res.status(400).json({ error: 'id_alumno, id_asignatura y curso_academico son obligatorios' });
    }
    try {
        const result = await pool.query(
            `INSERT INTO inscripciones (id_alumno, id_asignatura, curso_academico, convocatoria)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [id_alumno, id_asignatura, curso_academico, convocatoria || 1]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear inscripcion' });
    }
});

// DELETE /inscripciones/:id_alumno/:id_asignatura/:curso
router.delete('/:id_alumno/:id_asignatura/:curso', async (req, res) => {
    try {
        const result = await pool.query(
            `DELETE FROM inscripciones
             WHERE id_alumno = $1 AND id_asignatura = $2 AND curso_academico = $3
             RETURNING *`,
            [req.params.id_alumno, req.params.id_asignatura, req.params.curso]
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
module.exports = router;
