// routes/users.js
import express from 'express';
import pool from '../config/databasePg.js';  // ✅ Con extensión .js

const router = express.Router();

// Obtener todos los fondos de los  usuarios
router.get('/', async (req, res) => {

    try {
        const { id } = req.query;
        const query =  `
                        SELECT m.*, t.nombre AS tipo_movimiento, f.user_id
                        FROM movimientos_fondos m
                        LEFT JOIN tipos_movimientos t ON m.tipo_movimiento_id = t.id
                        LEFT JOIN fondos_users f ON m.fondo_user_id = $1
                        ORDER BY m.fecha_movimiento DESC;
                        `;
        const response = await pool.query(query, [id]);
        res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        res.status(500).json('Internal Server Error');
    }
});

export default router;