// backend/routes/auth.js

const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const Usuario  = require('../models/Usuario');
const router   = express.Router();

// POST /api/auth/registro — crear cuenta nueva
router.post('/registro', async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Verificar que el email no exista ya
    const existe = await Usuario.findOne({ email });
    if (existe) return res.status(400).json({ error: 'El email ya está registrado' });

    // Encriptar la contraseña antes de guardar
    const hash = await bcrypt.hash(password, 10);

    // Crear el usuario — si no se envía 'rol', Mongoose asigna 'cliente' por defecto
    const usuario = await Usuario.create({ nombre, email, password: hash, rol });

    res.status(201).json({ mensaje: 'Usuario creado correctamente', id: usuario._id, rol: usuario.rol });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/auth/login — iniciar sesión y recibir token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar el usuario por email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(401).json({ error: 'Email o contraseña incorrectos' });

    // Comparar la contraseña con el hash guardado
    const valida = await bcrypt.compare(password, usuario.password);
    if (!valida) return res.status(401).json({ error: 'Email o contraseña incorrectos' });

    // Crear el token JWT — incluye el rol en el payload
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, nombre: usuario.nombre, rol: usuario.rol });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;