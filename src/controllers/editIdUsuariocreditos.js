import express from 'express';
import pool from '../config/databasePg.js';

const router = express.Router();

router.put('/', async (req, res) => {
    try {
        const { id } = req.params;
        const {
        monto_prestamo,
        tasa_interes,
        periodo_prestamos,
        dia_pago,
        estate
        } = req.body;
        const query = `UPDATE creditos
                        SET monto_prestamo = $1,
                            tasa_interes = $2,
                            periodo_prestamos = $3,
                            dia_pago = $4,
                            estate = $5
                        WHERE id = $6
                        RETURNING *`;
        const values = [monto_prestamo, tasa_interes, periodo_prestamos, dia_pago, estate ?? true, id];
        const response = await pool.query(query, values);

        if (result.rows.length === 0){
            return res.status(404).json({ message: 'Crédito no encontrado' });
        }
      
        res.status(200).json(response.rows[0]);
    } catch (e) {
        console.log(e);
        res.status(500).json('Internal Server Error');
    }
   
});
export default router;