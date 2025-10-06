// routes/users.js
import express from 'express';
import pool from '../config/databasePg.js';  

const router = express.Router();

// Obtener todos los fondos de los  usuarios
router.get('/', async (req, res) => {

    try {
        const query = `
            SELECT 
            u.id,
            u.name,
            u.lastname,
            u.email,
            u.phonenumber,
            COALESCE(f.fondo, 0.00) AS monto_disponible
            FROM 
            users u
            LEFT JOIN 
            fondos_users f ON u.id = f.user_id 
            AND f.estate = true
            WHERE 
            u.estate = true
            ORDER BY 
            u.name, u.lastname
        `;
        const response = await pool.query(query);
        res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        res.status(500).json('Internal Server Error');
    }
});

export default router;