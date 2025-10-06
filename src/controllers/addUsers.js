// routes/users.js
import express from 'express';
import pool from '../config/databasePg.js';  // ✅ Con extensión .js

const router = express.Router();

// Obtener todos los usuarios
router.post('/', async (req, res) => {
    
  try {
    const { name, lastname, phonenumber, email, estate } = req.body;

    // Validación básica
    if (!name || !lastname || !phonenumber || !email || estate === undefined) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    
    const query = 'INSERT INTO public.users (name, lastname, phonenumber, email, estate)  VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [name, lastname, phonenumber, email, estate];
    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
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