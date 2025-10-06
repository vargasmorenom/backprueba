import express from 'express';
import pool from '../config/databasePg.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        
        const query = 'SELECT * FROM users WHERE  estate = true';
        const response = await pool.query(query);
        res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        res.status(500).json('Internal Server Error');
    }
   
});
export default router;