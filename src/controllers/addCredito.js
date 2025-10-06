// routes/users.js
import express from 'express';
import pool from '../config/databasePg.js';  // ✅ Con extensión .js

const router = express.Router();

// Obtener todos los usuarios
router.post('/', async (req, res) => {

  try {
        const {
        id_prestamista,
        id_prestatario,
        monto_prestamo,
        tasa_interes,
        periodo_prestamos,
        dia_pago
        } = req.body;
   
    // Validación de campos obligatorios
    if (!id_prestamista || !id_prestatario || monto === monto_prestamo || !tasa_interes || !periodo_prestamos || !dia_pago) {
      return res.status(400).json({
        success: false,
        message: 'todos los campos son obligatorios.'
      });
    }

    // Verificar fondos del prestatario
    const prestatarioFondo = await pool.query(
      'SELECT fondo FROM fondos_users WHERE user_id = $1 AND estate = TRUE',
      [id_prestatario]
    );

    if (prestatarioFondo.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El prestatario no tiene un fondo activo.'
      });
    }

    const fondoDisponible = parseFloat(prestatarioFondo.rows[0].fondo);
    const montoSolicitado = parseFloat(monto_prestamo);

    // Validar monto
    if (montoSolicitado > fondoDisponible) {
      return res.status(400).json({
        success: false,
        message: `Fondos insuficientes. El prestatario solo dispone de ${fondoDisponible}.`
      });
    }

    const query = `INSERT INTO creditos (
                id_prestamista, id_prestatario, monto_prestamo, tasa_interes,
                periodo_prestamos, dia_pago
                ) VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *`;
    const values = [id_prestamista, id_prestatario, monto_prestamo, tasa_interes, periodo_prestamos, dia_pago];
    const result = await pool.query(query, values);

    await pool.query(
      'UPDATE fondos_users SET fondo = fondo - $1 WHERE user_id = $2 AND estate = TRUE',
      [montoSolicitado, id_prestatario]
    );

    await pool.query(
    `INSERT INTO movimientos_fondos (fondo_user_id, tipo_movimiento_id, monto)
    VALUES (
        (SELECT id FROM fondos_users WHERE user_id = $1 AND estate = TRUE LIMIT 1),
        2,  -- 2 = tipo "préstamo emitido" o como lo definas
        $2
    )`,
    [id_prestatario, montoSolicitado]
    );


    res.status(201).json({
      success: true,
      message: 'Crédito creado exitosamente',
      data: result.rows[0]
    });

    res.status(201).json({
      success: true,
      message: 'Movimiento creado exitosamente.',
      data: result.rows[0]
    });


  } catch (err) {
        console.error('Error al crear el crédito:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
    
  }
});

export default router;