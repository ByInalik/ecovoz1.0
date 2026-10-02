const express = require('express');
const router = express.Router();
const Reporte = require('../models/Reporte');
const Usuario = require('../models/Usuario');
const Comentario = require('../models/Comentario');
const Evidencia = require('../models/Evidencia');
const verificarToken = require('../middleware/auth');
const verificarFuncionario = require('../middleware/funcionario');

// Todas las estadísticas requieren token de funcionario o admin
router.use(verificarToken);
router.use(verificarFuncionario);

// ============================================
// 📊 ESTADÍSTICAS GENERALES (RF-008)
// ============================================

// GET resumen general
router.get('/resumen', async (req, res) => {
  try {
    const [
      totalReportes,
      totalUsuarios,
      totalComentarios,
      totalEvidencias,
      reportesPendientes,
      reportesEnProceso,
      reportesSolucionados
    ] = await Promise.all([
      Reporte.countDocuments(),
      Usuario.countDocuments(),
      Comentario.countDocuments(),
      Evidencia.countDocuments(),
      Reporte.countDocuments({ estado: 'Pendiente' }),
      Reporte.countDocuments({ estado: 'En proceso' }),
      Reporte.countDocuments({ estado: 'Solucionado' })
    ]);

    res.json({
      totalReportes,
      totalUsuarios,
      totalComentarios,
      totalEvidencias,
      reportesPorEstado: {
        pendientes: reportesPendientes,
        enProceso: reportesEnProceso,
        solucionados: reportesSolucionados
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET reportes por categoría
router.get('/por-categoria', async (req, res) => {
  try {
    const resultado = await Reporte.aggregate([
      {
        $group: {
          _id: '$categoria',
          cantidad: { $sum: 1 }
        }
      },
      {
        $sort: { cantidad: -1 }
      },
      {
        $project: {
          _id: 0,
          categoria: '$_id',
          cantidad: 1
        }
      }
    ]);

    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET reportes por estado
router.get('/por-estado', async (req, res) => {
  try {
    const resultado = await Reporte.aggregate([
      {
        $group: {
          _id: '$estado',
          cantidad: { $sum: 1 }
        }
      },
      {
        $sort: { cantidad: -1 }
      },
      {
        $project: {
          _id: 0,
          estado: '$_id',
          cantidad: 1
        }
      }
    ]);

    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET reportes por mes (últimos 12 meses)
router.get('/por-mes', async (req, res) => {
  try {
    const haceUnAno = new Date();
    haceUnAno.setMonth(haceUnAno.getMonth() - 12);

    const resultado = await Reporte.aggregate([
      {
        $match: { createdAt: { $gte: haceUnAno } }
      },
      {
        $group: {
          _id: {
            anio: { $year: '$createdAt' },
            mes: { $month: '$createdAt' }
          },
          cantidad: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.anio': 1, '_id.mes': 1 }
      },
      {
        $project: {
          _id: 0,
          anio: '$_id.anio',
          mes: '$_id.mes',
          cantidad: 1
        }
      }
    ]);

    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET zonas más afectadas (basado en ubicación de texto)
router.get('/zonas', async (req, res) => {
  try {
    const resultado = await Reporte.aggregate([
      {
        $group: {
          _id: '$ubicacion',
          cantidad: { $sum: 1 }
        }
      },
      {
        $sort: { cantidad: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          _id: 0,
          ubicacion: '$_id',
          cantidad: 1
        }
      }
    ]);

    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;