const express = require('express');
const router = express.Router();
const LogActividad = require('../models/LogActividad');
const verificarToken = require('../middleware/auth');
const verificarAdmin = require('../middleware/admin');

// Solo admin puede ver la auditoría
router.use(verificarToken);
router.use(verificarAdmin);

// ============================================
// 📋 GET listar logs — admin (RF-021)
// ============================================
/**
 * @swagger
 * /api/auditoria:
 *   get:
 *     summary: Listar logs de auditoría (solo admin)
 *     tags: [Auditoría]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: usuario
 *         schema:
 *           type: string
 *         description: Filtrar por ID de usuario
 *       - in: query
 *         name: accion
 *         schema:
 *           type: string
 *         example: login_exitoso
 *       - in: query
 *         name: entidad
 *         schema:
 *           type: string
 *         example: Reporte
 *       - in: query
 *         name: exito
 *         schema:
 *           type: boolean
 *         description: Filtrar por resultado (true=exitoso, false=fallido)
 *       - in: query
 *         name: desde
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-01-01"
 *       - in: query
 *         name: hasta
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-12-31"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: Lista de logs con paginación
 *       403:
 *         description: Solo admin
 */
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
// 📋 GET logs de un usuario específico
// ============================================
/**
 * @swagger
 * /api/auditoria/usuario/{id}:
 *   get:
 *     summary: Ver últimos 100 logs de un usuario (solo admin)
 *     tags: [Auditoría]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Logs del usuario
 *       404:
 *         description: Usuario no encontrado
 */
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
// 📊 GET resumen — admin
// ============================================
/**
 * @swagger
 * /api/auditoria/resumen:
 *   get:
 *     summary: Resumen de actividad (top 10 acciones + por resultado)
 *     tags: [Auditoría]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumen con agregaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 porAccion:
 *                   type: array
 *                   items:
 *                     type: object
 *                 porExito:
 *                   type: array
 *                   items:
 *                     type: object
 */
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
// 🗑️ DELETE limpiar logs antiguos (>90 días) — admin
// ============================================
/**
 * @swagger
 * /api/auditoria/limpiar:
 *   delete:
 *     summary: Eliminar logs con más de 90 días (solo admin)
 *     tags: [Auditoría]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logs eliminados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                 eliminados:
 *                   type: integer
 */
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