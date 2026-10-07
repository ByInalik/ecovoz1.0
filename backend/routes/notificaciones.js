const express = require('express');
const router = express.Router();
const Notificacion = require('../models/Notificacion');
const verificarToken = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(verificarToken);

// ============================================
// 📋 GET mis notificaciones
// ============================================
/**
 * @swagger
 * /api/notificaciones:
 *   get:
 *     summary: Ver mis notificaciones
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: leida
 *         schema:
 *           type: boolean
 *         description: Filtrar por leídas (true) o no leídas (false)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Lista de notificaciones con total y no leídas
 */
router.get('/', async (req, res) => {
  try {
    const { leida, page = 1, limit = 20 } = req.query;

    const filtro = { usuario: req.usuario.id };
    if (leida !== undefined) filtro.leida = leida === 'true';

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [notificaciones, total, noLeidas] = await Promise.all([
      Notificacion.find(filtro)
        .populate('referencia.id')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Notificacion.countDocuments(filtro),
      Notificacion.countDocuments({ usuario: req.usuario.id, leida: false })
    ]);

    res.json({
      total,
      noLeidas,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      notificaciones
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// 🔢 GET conteo de no leídas
// ============================================
/**
 * @swagger
 * /api/notificaciones/no-leidas/count:
 *   get:
 *     summary: Contar notificaciones no leídas
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cantidad de notificaciones no leídas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 noLeidas:
 *                   type: integer
 *                   example: 3
 */
router.get('/no-leidas/count', async (req, res) => {
  try {
    const count = await Notificacion.countDocuments({
      usuario: req.usuario.id,
      leida: false
    });
    res.json({ noLeidas: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// ✅ PUT marcar como leída
// ============================================
/**
 * @swagger
 * /api/notificaciones/{id}/leer:
 *   put:
 *     summary: Marcar una notificación como leída
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notificación marcada como leída
 *       404:
 *         description: Notificación no encontrada
 */
router.put('/:id/leer', async (req, res) => {
  try {
    const notificacion = await Notificacion.findOneAndUpdate(
      { _id: req.params.id, usuario: req.usuario.id },
      { leida: true },
      { new: true }
    );

    if (!notificacion) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }

    res.json({ mensaje: 'Marcada como leída', notificacion });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// ✅ PUT marcar TODAS como leídas
// ============================================
/**
 * @swagger
 * /api/notificaciones/leer-todas:
 *   put:
 *     summary: Marcar todas mis notificaciones como leídas
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Todas marcadas como leídas
 */
router.put('/leer-todas', async (req, res) => {
  try {
    const resultado = await Notificacion.updateMany(
      { usuario: req.usuario.id, leida: false },
      { leida: true }
    );
    res.json({
      mensaje: 'Todas marcadas como leídas',
      actualizadas: resultado.modifiedCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// 🗑️ DELETE eliminar notificación
// ============================================
/**
 * @swagger
 * /api/notificaciones/{id}:
 *   delete:
 *     summary: Eliminar una notificación
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notificación eliminada
 *       404:
 *         description: Notificación no encontrada
 */
router.delete('/:id', async (req, res) => {
  try {
    const notificacion = await Notificacion.findOneAndDelete({
      _id: req.params.id,
      usuario: req.usuario.id
    });

    if (!notificacion) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }

    res.json({ mensaje: 'Notificación eliminada' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;