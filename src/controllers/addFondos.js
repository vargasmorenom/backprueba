// routes/users.js
import express from 'express';
import pool from '../config/databasePg.js';  

const router = express.Router();

// Obtener todos los fondos de los  usuarios
router.post('/', async (req, res) => {

    try {
        const { user_id, fondo, estate } = req.body;

        const queryconsulta= `
            SELECT fondo, estate FROM fondos_users 
            WHERE user_id = $1 AND estate = TRUE;
            `;
        const ids = user_id;
        const resultados = await pool.query(queryconsulta, [ids]);
        
        if (resultados.rows.length === 0) {
                const query1 = `
            INSERT INTO fondos_users (user_id, fondo, estate)
            VALUES ($1, $2, $3) RETURNING *;
            `;
            const values = [user_id || null, fondo || 0, estate ?? true];
            const response = await pool.query(query1, values);
            res.status(200).json(response.rows[0]);

        }
        if (resultados.rows.length > 0) {
            const query2 = `
            UPDATE fondos_users 
            SET fondo = fondo + $1
            WHERE user_id = $2 AND estate = TRUE
            RETURNING *;
            `;
            const values2 = [fondo || 0, user_id];
            const response = await pool.query(query2, values2);
            res.status(200).json(response.rows[0]);
        }

     
    
        
    } catch (e) {
        console.log(e);
        res.status(500).json('Internal Server Error');
    }
});

export default router;