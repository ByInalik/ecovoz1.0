const express = require('express');
const router = express.Router();
const Reporte = require('../models/Reporte');
const Usuario = require('../models/Usuario');
const verificarToken = require('../middleware/auth');
const verificarFuncionario = require('../middleware/funcionario');

// Todas las rutas de estadísticas requieren ser funcionario o admin
router.use(verificarToken, verificarFuncionario);

// ============================================
// 📊 GET resumen general — RF-008
// ============================================
/**
 * @swagger
 * /api/estadisticas/resumen:
 *   get:
 *     summary: Resumen general de reportes y usuarios
 *     tags: [Estadísticas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Totales generales y por estado
 */
router.get('/resumen', async (req, res) => {
  try {
    const [
      totalReportes,
      totalUsuarios,
      pendientes,
      enRevision,
      enProceso,
      solucionados
    ] = await Promise.all([
      Reporte.countDocuments(),
      Usuario.countDocuments(),
      Reporte.countDocuments({ estado: 'Pendiente' }),
      Reporte.countDocuments({ estado: 'En revisión' }),
      Reporte.countDocuments({ estado: 'En proceso' }),
      Reporte.countDocuments({ estado: 'Solucionado' })
    ]);

    res.json({
      totalReportes,
      totalUsuarios,
      porEstado: {
        pendientes,
        enRevision,
        enProceso,
        solucionados
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// 📊 GET reportes por categoría
// ============================================
/**
 * @swagger
 * /api/estadisticas/por-categoria:
 *   get:
 *     summary: Reportes agrupados por categoría
 *     tags: [Estadísticas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array de categorías con conteo
 */
router.get('/por-categoria', async (req, res) => {
  try {
    const resultado = await Reporte.aggregate([
      { $group: { _id: '$categoria', total: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $project: { _id: 0, categoria: '$_id', total: 1 } }
    ]);
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// 📊 GET reportes por estado
// ============================================
/**
 * @swagger
 * /api/estadisticas/por-estado:
 *   get:
 *     summary: Reportes agrupados por estado
 *     tags: [Estadísticas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array de estados con conteo
 */
router.get('/por-estado', async (req, res) => {
  try {
    const resultado = await Reporte.aggregate([
      { $group: { _id: '$estado', total: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $project: { _id: 0, estado: '$_id', total: 1 } }
    ]);
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// 📊 GET reportes por mes (últimos 12 meses)
// ============================================
/**
 * @swagger
 * /api/estadisticas/por-mes:
 *   get:
 *     summary: Reportes agrupados por mes (últimos 12 meses)
 *     tags: [Estadísticas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array de meses con conteo
 */
router.get('/por-mes', async (req, res) => {
  try {
    const hace12Meses = new Date();
    hace12Meses.setMonth(hace12Meses.getMonth() - 12);

    const resultado = await Reporte.aggregate([
      { $match: { createdAt: { $gte: hace12Meses } } },
      {
        $group: {
          _id: {
            año: { $year: '$createdAt' },
            mes: { $month: '$createdAt' }
          },
          total: { $sum: 1 }
        }
      },
      { $sort: { '_id.año': 1, '_id.mes': 1 } },
      {
        $project: {
          _id: 0,
          año: '$_id.año',
          mes: '$_id.mes',
          total: 1
        }
      }
    ]);

    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// 📊 GET reportes por zona (top 10)
// ============================================
/**
 * @swagger
 * /api/estadisticas/por-zona:
 *   get:
 *     summary: Top 10 zonas con más reportes
 *     tags: [Estadísticas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array de zonas con conteo
 */
router.get('/por-zona', async (req, res) => {
  try {
    const resultado = await Reporte.aggregate([
      { $group: { _id: '$ubicacion', total: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, zona: '$_id', total: 1 } }
    ]);
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;