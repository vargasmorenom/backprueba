// routes/users.js
import express from 'express';
import pool from '../config/databasePg.js';  // ✅ Con extensión .js

const router = express.Router();

// Obtener todos los usuarios
router.post('/', async (req, res) => {

  try {
    const { fondo_user_id, tipo_movimiento_id, monto, estate } = req.body;
   
    // Validación de campos obligatorios
    if (!fondo_user_id || !tipo_movimiento_id || monto === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Los campos fondo_user_id, tipo_movimiento_id y monto son obligatorios.'
      });
    }

    const query = `
      INSERT INTO movimientos_fondos 
      (fondo_user_id, tipo_movimiento_id, monto, estate)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [fondo_user_id || null, tipo_movimiento_id, monto, estate ?? true];
    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: 'Movimiento creado exitosamente.',
      data: result.rows[0]
    });


  } catch (err) {
    console.error('Error al crear el Movimiento:', err.message);
    
  }
});

export default router;