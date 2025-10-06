// routes/users.js
import express from 'express';
import pool from '../config/databasePg.js';  // ✅ Con extensión .js

const router = express.Router();

// Obtener todos los usuarios
router.put('/', async (req, res) => {

  try {
    const { id } = req.query;
    const { name, lastname, phonenumber, email, estate } = req.body;
    // Validación Id usuario
     if (!id) {
      return res.status(400).json({ success: false, message: 'ID requerido.' });
    }

    // Validación básica
    if (!name || !lastname || !phonenumber || !email || estate === undefined) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
     const query = `
      UPDATE users
      SET name = $1,
          lastname = $2,
          phonenumber = $3,
          email = $4,
          estate = $5
      WHERE id = $6
      RETURNING *;
    `;
    const values = [name, lastname, phonenumber, email, estate, id];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
    }

    res.status(201).json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: result.rows[0]
    });

  } catch (err) {
    console.error('Error al crear usuario:', err.message);
    
    if (err.code === '23505') { // Violación de unique constraint
      res.status(400).json({ error: 'El email ya está registrado' });
    } else {
      res.status(500).json({ error: 'Error al crear usuario' });
    }
  }
});

export default router;