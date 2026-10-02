const express = require('express');
const router = express.Router();
const LogActividad = require('../models/LogActividad');
const verificarToken = require('../middleware/auth');
const verificarAdmin = require('../middleware/admin');

// ============================================
// 📜 AUDITORÍA (RF-021)
// ============================================

// GET mi actividad — cualquier usuario autenticado
// ⚠️ DEBE IR ANTES del router.use(verificarAdmin)
router.get('/mi-actividad', verificarToken, async (req, res) => {
  try {
    const logs = await LogActividad.find({ usuario: req.usuario.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      total: logs.length,
      logs
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// El resto de rutas requieren admin
router.use(verificarToken);
router.use(verificarAdmin);

// GET historial completo — admin
router.get('/', async (req, res) => {
  try {
    const {
      usuario,
      accion,
      entidad,
      exito,
      desde,
      hasta,
      page = 1,
      limit = 50
    } = req.query;

    const filtro = {};

    if (usuario) filtro.usuario = usuario;
    if (accion) filtro.accion = accion;
    if (entidad) filtro.entidad = entidad;
    if (exito !== undefined) filtro.exito = exito === 'true';

    if (desde || hasta) {
      filtro.createdAt = {};
      if (desde) filtro.createdAt.$gte = new Date(desde);
      if (hasta) {
        const fechaHasta = new Date(hasta);
        fechaHasta.setHours(23, 59, 59, 999);
        filtro.createdAt.$lte = fechaHasta;
      }
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(200, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [logs, total] = await Promise.all([
      LogActividad.find(filtro)
        .populate('usuario', 'nombre email rol')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      LogActividad.countDocuments(filtro)
    ]);

    res.json({
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      filtrosAplicados: filtro,
      logs
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET auditoría de un usuario específico — admin
router.get('/usuario/:id', async (req, res) => {
  try {
    const logs = await LogActividad.find({ usuario: req.params.id })
      .populate('usuario', 'nombre email rol')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      total: logs.length,
      logs
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;