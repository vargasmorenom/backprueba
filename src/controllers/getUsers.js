import express from 'express';
import pool from '../config/databasePg.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        
        const idNumber = parseInt(req.query.id, 10);
        const query = 'SELECT * FROM users WHERE id = $1 AND estate = true';
        const response = await pool.query(query, [idNumber]);
        res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        res.status(500).json('Internal Server Error');
    }
   
});
export default router;