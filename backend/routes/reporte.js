const express = require('express');
const router = express.Router();
const Reporte = require('../models/Reporte');
const EstadoReporte = require('../models/EstadoReporte');
const verificarToken = require('../middleware/auth');
const verificarAdmin = require('../middleware/admin');
const verificarFuncionario = require('../middleware/funcionario');

// ============================================
// 🌐 RUTAS PÚBLICAS
// ============================================

// GET todos los reportes — público
router.get('/', async (req, res) => {
  try {
    const items = await Reporte.find()
      .populate('creadoPor', 'nombre email')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET por ID — público
router.get('/:id', async (req, res) => {
  try {
    const item = await Reporte.findById(req.params.id)
      .populate('creadoPor', 'nombre email');
    if (!item) return res.status(404).json({ error: 'No encontrado' });
    res.json(item);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }
    res.status(500).json({ error: err.message });
  }
});

// GET historial de cambios de estado — público
router.get('/:id/historial', async (req, res) => {
  try {
    const historial = await EstadoReporte.find({ reporte: req.params.id })
      .populate('cambiadoPor', 'nombre email rol')
      .sort({ fechaCambio: -1 }); // Más reciente primero
    res.json(historial);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// 🔒 RUTAS PROTEGIDAS
// ============================================

// POST crear — cualquier usuario autenticado (RF-003)
router.post('/', verificarToken, async (req, res) => {
  try {
    const nuevo = await Reporte.create({
      ...req.body,
      creadoPor: req.usuario.id
    });
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT cambiar estado — solo funcionario o admin (RF-006)
router.put('/:id/estado', verificarToken, verificarFuncionario, async (req, res) => {
  try {
    const { estado, comentario } = req.body;

    if (!estado) {
      return res.status(400).json({ error: 'El campo "estado" es obligatorio' });
    }

    // 1. Buscar el reporte actual para saber su estado anterior
    const reporte = await Reporte.findById(req.params.id);
    if (!reporte) {
      return res.status(404).json({ error: 'Reporte no encontrado' });
    }

    // 2. Verificar que el estado sea diferente al actual
    if (reporte.estado === estado) {
      return res.status(400).json({
        error: `El reporte ya está en estado "${estado}"`
      });
    }

    // 3. Guardar el historial ANTES de actualizar
    const cambio = await EstadoReporte.create({
      reporte: reporte._id,
      estadoAnterior: reporte.estado,
      estadoNuevo: estado,
      comentario: comentario || '',
      cambiadoPor: req.usuario.id
    });

    // 4. Actualizar el estado del reporte
    reporte.estado = estado;
    await reporte.save();

    // 5. Devolver el reporte actualizado + el cambio registrado
    res.json({
      mensaje: 'Estado actualizado correctamente',
      reporte,
      cambio
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }
    res.status(400).json({ error: err.message });
  }
});

// PUT actualizar todo — solo admin
router.put('/:id', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const actualizado = await Reporte.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!actualizado) return res.status(404).json({ error: 'No encontrado' });
    res.json(actualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE eliminar — solo admin
router.delete('/:id', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const eliminado = await Reporte.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'No encontrado' });

    // También eliminar el historial asociado
    await EstadoReporte.deleteMany({ reporte: req.params.id });

    res.json({ mensaje: 'Reporte e historial eliminados correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;