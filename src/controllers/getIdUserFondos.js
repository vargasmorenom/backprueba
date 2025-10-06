// routes/users.js
import express from 'express';
import pool from '../config/databasePg.js';  // ✅ Con extensión .js

const router = express.Router();

// Obtener todos los fondos de los  usuarios
router.get('/', async (req, res) => {

    try {
        const { id } = req.query;
        const query = ` SELECT f.*, u.name, u.lastname
                        FROM fondos_users f
                        JOIN users u ON f.user_id = u.id
                        ORDER BY f.id ASC
                        `;
        const response = await pool.query(query, [id]);

    if (response.rows.length === 0) {
      return res.status(404).json({ message: 'Fondo no encontrado' });
    }
        res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        res.status(500).json('Internal Server Error');
    }
});

export default router;