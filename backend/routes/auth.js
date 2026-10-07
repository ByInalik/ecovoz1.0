// backend/routes/auth.js

const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const router  = express.Router();
const { registrarManual } = require('../middleware/auditoria');
const crypto = require('crypto');
const { enviarEmailResetPassword } = require('../utils/emailService');

// ============================================
// POST /api/auth/registro — crear cuenta nueva
// ============================================
/**
 * @swagger
 * /api/auth/registro:
 *   post:
 *     summary: Registrar nuevo ciudadano
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, email, password]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Michael Hernández
 *               email:
 *                 type: string
 *                 example: michael@ecovoz.com
 *               password:
 *                 type: string
 *                 example: mipassword123
 *     responses:
 *       201:
 *         description: Usuario creado
 *       400:
 *         description: Email ya registrado o datos inválidos
 */
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

    // Registrar la acción en auditoría
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
/**
 * @swagger
 * /api/auth/registro-funcionario:
 *   post:
 *     summary: Registrar nuevo funcionario (requiere secret)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, email, password, funcionarioSecret]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Funcionario CAM
 *               email:
 *                 type: string
 *                 example: funcionario@ecovoz.com
 *               password:
 *                 type: string
 *                 example: funcionario123
 *               funcionarioSecret:
 *                 type: string
 *                 example: tu_secreto_de_funcionario
 *     responses:
 *       201:
 *         description: Funcionario creado
 *       403:
 *         description: Código de funcionario inválido
 */
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

    // Registrar la acción en auditoría
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
/**
 * @swagger
 * /api/auth/registro-admin:
 *   post:
 *     summary: Registrar nuevo admin (requiere secret)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, email, password, adminSecret]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Admin EcoVoz
 *               email:
 *                 type: string
 *                 example: admin@ecovoz.com
 *               password:
 *                 type: string
 *                 example: admin123
 *               adminSecret:
 *                 type: string
 *                 example: tu_secreto_de_admin
 *     responses:
 *       201:
 *         description: Admin creado
 *       403:
 *         description: Código de admin inválido
 */
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

    // Registrar la acción en auditoría
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
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: michael@ecovoz.com
 *               password:
 *                 type: string
 *                 example: mipassword123
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 nombre:
 *                   type: string
 *                 rol:
 *                   type: string
 *       401:
 *         description: Credenciales inválidas
 *       403:
 *         description: Cuenta desactivada o eliminada
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password son obligatorios' });
    }

    // 1. Buscar el usuario por email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      // Registrar login fallido (usuario no existe)
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
      // Registrar login fallido (password incorrecta)
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

    // 3. Validación de cuenta ELIMINADA (RF-016)
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

    // 4. Validación de cuenta DESACTIVADA
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

    // 6. Registrar login exitoso
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

// ============================================
// RF-015: Restablecer contraseña
// ============================================

// POST /api/auth/olvide-password
// Solicita el enlace de recuperación
/**
 * @swagger
 * /api/auth/olvide-password:
 *   post:
 *     summary: Solicitar restablecimiento de contraseña
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: michael@ecovoz.com
 *     responses:
 *       200:
 *         description: Email enviado (si existe en el sistema)
 */
router.post('/olvide-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'El email es obligatorio' });
    }

    const usuario = await Usuario.findOne({ email });

    // SEGURIDAD: responder igual si existe o no (evita enumeración de emails)
    const respuestaGenerica = {
      mensaje: 'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.'
    };

    if (!usuario) {
      return res.json(respuestaGenerica);
    }

    if (usuario.eliminado) {
      return res.json(respuestaGenerica);
    }

    // Generar token aleatorio (32 bytes = 64 chars hex)
    const token = crypto.randomBytes(32).toString('hex');

    // Guardar en BD con expiración de 1 hora
    usuario.resetPasswordToken = token;
    usuario.resetPasswordExpira = new Date(Date.now() + 60 * 60 * 1000); // +1 hora
    await usuario.save();

    // Enviar email (no bloqueante)
    try {
      await enviarEmailResetPassword({ usuario, token });
    } catch (emailErr) {
      console.error('Error enviando email de reset:', emailErr.message);
      // No fallar la respuesta si el email no se envía
    }

    // Registrar en auditoría
    await registrarManual({
      req,
      usuario,
      accion: 'solicitar_reset_password',
      entidad: 'Auth',
      exito: true
    });

    res.json(respuestaGenerica);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/reset-password/:token
// Cambia la contraseña con el token
/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *   post:
 *     summary: Restablecer contraseña con token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token recibido por email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password, passwordConfirm]
 *             properties:
 *               password:
 *                 type: string
 *                 example: nuevapassword123
 *               passwordConfirm:
 *                 type: string
 *                 example: nuevapassword123
 *     responses:
 *       200:
 *         description: Contraseña actualizada
 *       400:
 *         description: Token inválido o expirado
 */
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password, passwordConfirm } = req.body;

    // Validaciones básicas
    if (!password || !passwordConfirm) {
      return res.status(400).json({ error: 'Password y confirmación son obligatorios' });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
    }

    // Buscar al usuario con ese token
    const usuario = await Usuario.findOne({
      resetPasswordToken: token,
      resetPasswordExpira: { $gt: new Date() } // no expirado
    });

    if (!usuario) {
      return res.status(400).json({
        error: 'Token inválido o expirado. Solicita un nuevo enlace.'
      });
    }

    // Actualizar contraseña
    usuario.password = await bcrypt.hash(password, 10);

    // Limpiar el token (para que no se reutilice)
    usuario.resetPasswordToken = null;
    usuario.resetPasswordExpira = null;

    await usuario.save();

    // Registrar en auditoría
    await registrarManual({
      req,
      usuario,
      accion: 'reset_password_exitoso',
      entidad: 'Auth',
      exito: true
    });

    res.json({
      mensaje: 'Contraseña actualizada correctamente. Ya puedes iniciar sesión.'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;