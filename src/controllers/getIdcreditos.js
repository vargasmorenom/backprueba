import express from 'express';
import pool from '../config/databasePg.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { id } = req.query;
        const query = `
                        SELECT c.*, 
                                up.name AS nombre_prestamista, up.lastname AS apellido_prestamista,
                                ur.name AS nombre_prestatario, ur.lastname AS apellido_prestatario
                        FROM creditos c
                        JOIN users up ON c.id_prestamista = up.id
                        JOIN users ur ON c.id_prestatario = ur.id
                        WHERE c.id = $1
                        ORDER BY c.id ASC
                        `;
        const response = await pool.query(query,[id]);
        res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        res.status(500).json('Internal Server Error');
    }
   
});
export default router;