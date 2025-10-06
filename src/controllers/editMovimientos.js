// routes/users.js
import express from 'express';
import pool from '../config/databasePg.js';  // ✅ Con extensión .js

const router = express.Router();

// Obtener todos los fondos de los  usuarios
router.get('/', async (req, res) => {

    try {
        const { id } = req.params;
        const { monto, estate } = req.body;
        const query = `
            UPDATE movimientos_fondos
            SET monto=$1, estate=$2
            WHERE id=$3
            RETURNING *;
            `;
        const values = [monto, estate ?? true, id];
        const response = await pool.query(query, values);
        res.status(201).json(response.rows[0]);
    } catch (e) {
        console.log(e);
        res.status(500).json('Internal Server Error');
    }
});

export default router;