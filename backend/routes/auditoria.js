const express = require('express');
const router = express.Router();
const LogActividad = require('../models/LogActividad');
const verificarToken = require('../middleware/auth');
const verificarAdmin = require('../middleware/admin');

// Solo admin puede ver la auditoría
router.use(verificarToken);
router.use(verificarAdmin);

// ============================================
// GET listar logs — admin (RF-021)
// ============================================
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
      logs
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// GET logs de un usuario específico
// ============================================
router.get('/usuario/:id', async (req, res) => {
  try {
    const logs = await LogActividad.find({ usuario: req.params.id })
      .populate('usuario', 'nombre email rol')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(logs);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// GET resumen — admin
// ============================================
router.get('/resumen', async (req, res) => {
  try {
    const [porAccion, porExito, total] = await Promise.all([
      LogActividad.aggregate([
        { $group: { _id: '$accion', total: { $sum: 1 } } },
        { $sort: { total: -1 } },
        { $limit: 10 }
      ]),
      LogActividad.aggregate([
        { $group: { _id: '$exito', total: { $sum: 1 } } }
      ]),
      LogActividad.countDocuments()
    ]);

    res.json({
      total,
      porAccion,
      porExito
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// DELETE limpiar logs antiguos (>90 días) — admin
// ============================================
router.delete('/limpiar', async (req, res) => {
  try {
    const hace90Dias = new Date();
    hace90Dias.setDate(hace90Dias.getDate() - 90);

    const resultado = await LogActividad.deleteMany({
      createdAt: { $lt: hace90Dias }
    });

    res.json({
      mensaje: `${resultado.deletedCount} logs antiguos eliminados`,
      eliminados: resultado.deletedCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;