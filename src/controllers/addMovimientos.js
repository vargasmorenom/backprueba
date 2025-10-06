// routes/users.js
import express from 'express';
import pool from '../config/databasePg.js';  // ✅ Con extensión .js

const router = express.Router();

// Obtener todos los fondos de los  usuarios
router.get('/', async (req, res) => {

    try {
        const { fondo_user_id, tipo_movimiento_id, monto, estate } = req.body;
        const query = `
          INSERT INTO movimientos_fondos (fondo_user_id, tipo_movimiento_id, monto, estate)
          VALUES ($1, $2, $3, $4)
          RETURNING *;
        `;
        const values = [fondo_user_id || null, tipo_movimiento_id || null, monto || 0, estate ?? true];
        const response = await pool.query(query, values);
        res.status(201).json(response.rows[0]);
    } catch (e) {
        console.log(e);
        res.status(500).json('Internal Server Error');
    }
});

export default router;