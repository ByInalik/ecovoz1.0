// backend/routes/auth.js

const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const router  = express.Router();
const { registrarManual } = require('../middleware/auditoria');

// ============================================
// POST /api/auth/registro — crear cuenta nueva
// ============================================
router.post('/registro', async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Verificar que el email no exista ya
    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Encriptar la contraseña antes de guardar
    const hash = await bcrypt.hash(password, 10);

    // Asignar rol 'ciudadano' por defecto si no se especifica
    const rolAsignado = rol || 'ciudadano';

    const usuario = await Usuario.create({
      nombre,
      email,
      password: hash,
      rol: rolAsignado
    });

    // 🔍 Registrar la acción en auditoría
    await registrarManual({
      req,
      usuario,
      accion: 'registro_usuario',
      entidad: 'Usuario',
      entidadId: usuario._id,
      exito: true,
      detalle: { rol: rolAsignado }
    });

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      id: usuario._id,
      rol: usuario.rol
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================================
// POST /api/auth/registro-funcionario — solo con secret
// ============================================
router.post('/registro-funcionario', async (req, res) => {
  try {
    const { nombre, email, password, funcionarioSecret } = req.body;

    if (funcionarioSecret !== process.env.FUNCIONARIO_SECRET) {
      return res.status(403).json({ error: 'Código de funcionario inválido' });
    }

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y password son obligatorios' });
    }

    const existe = await Usuario.findOne({ email });
    if (existe) return res.status(400).json({ error: 'El email ya está registrado' });

    const hash = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({
      nombre,
      email,
      password: hash,
      rol: 'funcionario'
    });

    // 🔍 Registrar la acción en auditoría
    await registrarManual({
      req,
      usuario,
      accion: 'registro_funcionario',
      entidad: 'Usuario',
      entidadId: usuario._id,
      exito: true
    });

    res.status(201).json({
      msg: 'Funcionario creado',
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================================
// POST /api/auth/registro-admin — solo con secret
// ============================================
router.post('/registro-admin', async (req, res) => {
  try {
    const { nombre, email, password, adminSecret } = req.body;

    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ error: 'Código de admin inválido' });
    }

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y password son obligatorios' });
    }

    const existe = await Usuario.findOne({ email });
    if (existe) return res.status(400).json({ error: 'El email ya está registrado' });

    const hash = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({
      nombre,
      email,
      password: hash,
      rol: 'admin'
    });

    // 🔍 Registrar la acción en auditoría
    await registrarManual({
      req,
      usuario,
      accion: 'registro_admin',
      entidad: 'Usuario',
      entidadId: usuario._id,
      exito: true
    });

    res.status(201).json({
      mensaje: 'Administrador creado correctamente',
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================================
// POST /api/auth/login — iniciar sesión y recibir token
// ============================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password son obligatorios' });
    }

    // 1. Buscar el usuario por email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      // 🔍 Registrar login fallido (usuario no existe)
      await registrarManual({
        req,
        usuario: null,
        accion: 'login_fallido',
        entidad: 'Auth',
        exito: false,
        detalle: { email, razon: 'usuario_no_existe' }
      });
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    // 2. Comparar la contraseña con el hash guardado
    const valida = await bcrypt.compare(password, usuario.password);
    if (!valida) {
      // 🔍 Registrar login fallido (password incorrecta)
      await registrarManual({
        req,
        usuario,
        accion: 'login_fallido',
        entidad: 'Auth',
        exito: false,
        detalle: { razon: 'password_incorrecta' }
      });
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    // 3. 👇 Validación de cuenta ELIMINADA (RF-016)
    if (usuario.eliminado === true) {
      await registrarManual({
        req,
        usuario: null,
        accion: 'login_cuenta_eliminada',
        entidad: 'Auth',
        exito: false,
        detalle: { email }
      });
      return res.status(403).json({
        error: 'Esta cuenta fue eliminada. Contacta al administrador si es un error.'
      });
    }

    // 4. 👇 Validación de cuenta DESACTIVADA
    if (usuario.estado === false) {
      await registrarManual({
        req,
        usuario,
        accion: 'login_cuenta_desactivada',
        entidad: 'Auth',
        exito: false
      });
      return res.status(403).json({
        error: 'Cuenta desactivada. Contacta al administrador.'
      });
    }

    // 5. Crear el token JWT — dura 24 horas
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 6. 🔍 Registrar login exitoso
    await registrarManual({
      req,
      usuario,
      accion: 'login_exitoso',
      entidad: 'Auth',
      exito: true
    });

    res.json({
      token,
      nombre: usuario.nombre,
      rol: usuario.rol
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;