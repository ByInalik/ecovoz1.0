const express = require('express');
const router = express.Router();
const Reporte = require('../models/Reporte');
const EstadoReporte = require('../models/EstadoReporte');
const Comentario = require('../models/Comentario');
const verificarToken = require('../middleware/auth');
const verificarAdmin = require('../middleware/admin');
const verificarFuncionario = require('../middleware/funcionario');

// ============================================
// 🌐 RUTAS PÚBLICAS
// ============================================

// GET todos los reportes — público, con filtros avanzados (RF-018)
router.get('/', async (req, res) => {
  try {
    const {
      categoria,
      estado,
      desde,
      hasta,
      buscar,
      creadoPor,
      page = 1,
      limit = 20,
      orden = 'createdAt',
      dir = 'desc'
    } = req.query;

    const filtro = {};

    if (categoria) filtro.categoria = categoria;
    if (estado) filtro.estado = estado;
    if (creadoPor) filtro.creadoPor = creadoPor;

    if (desde || hasta) {
      filtro.createdAt = {};
      if (desde) filtro.createdAt.$gte = new Date(desde);
      if (hasta) {
        const fechaHasta = new Date(hasta);
        fechaHasta.setHours(23, 59, 59, 999);
        filtro.createdAt.$lte = fechaHasta;
      }
    }

    if (buscar) {
      filtro.$or = [
        { titulo: { $regex: buscar, $options: 'i' } },
        { descripcion: { $regex: buscar, $options: 'i' } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const camposOrdenables = ['createdAt', 'updatedAt', 'titulo', 'estado'];
    const campoOrden = camposOrdenables.includes(orden) ? orden : 'createdAt';
    const direccion = dir === 'asc' ? 1 : -1;

    const [reportes, total] = await Promise.all([
      Reporte.find(filtro)
        .populate('creadoPor', 'nombre email')
        .sort({ [campoOrden]: direccion })
        .skip(skip)
        .limit(limitNum),
      Reporte.countDocuments(filtro)
    ]);

    res.json({
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      filtrosAplicados: filtro,
      reportes
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// 🔍 RUTAS ESPECÍFICAS (deben ir ANTES que /:id)
// ============================================

// GET historial de cambios de estado — público (RF-006)
router.get('/:id/historial', async (req, res) => {
  try {
    const historial = await EstadoReporte.find({ reporte: req.params.id })
      .populate('cambiadoPor', 'nombre email rol')
      .sort({ fechaCambio: -1 });
    res.json(historial);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }
    res.status(500).json({ error: err.message });
  }
});

// GET comentarios de un reporte — requiere token (filtra internos)
router.get('/:id/comentarios', verificarToken, async (req, res) => {
  try {
    const filtro = { reporte: req.params.id };

    const esStaff = req.usuario.rol === 'funcionario' || req.usuario.rol === 'admin';
    if (!esStaff) {
      filtro.tipo = 'publico';
    }

    const comentarios = await Comentario.find(filtro)
      .populate('autor', 'nombre email rol')
      .populate('respondeA', 'texto autor')
      .sort({ createdAt: 1 });

    res.json(comentarios);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// 🌐 RUTA GENÉRICA POR ID (debe ir AL FINAL de los GET)
// ============================================

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

// POST crear comentario — cualquier usuario autenticado (RF-022)
router.post('/:id/comentarios', verificarToken, async (req, res) => {
  try {
    const { texto, tipo, respondeA } = req.body;

    const reporte = await Reporte.findById(req.params.id);
    if (!reporte) {
      return res.status(404).json({ error: 'Reporte no encontrado' });
    }

    if (tipo === 'interno') {
      const esStaff = req.usuario.rol === 'funcionario' || req.usuario.rol === 'admin';
      if (!esStaff) {
        return res.status(403).json({
          error: 'Solo funcionarios pueden crear comentarios internos'
        });
      }
    }

    if (respondeA) {
      const comentarioPadre = await Comentario.findById(respondeA);
      if (!comentarioPadre || comentarioPadre.reporte.toString() !== req.params.id) {
        return res.status(400).json({ error: 'Comentario padre inválido' });
      }
    }

    const nuevo = await Comentario.create({
      reporte: req.params.id,
      autor: req.usuario.id,
      texto,
      tipo: tipo || 'publico',
      respondeA: respondeA || null
    });

    const comentarioConDatos = await Comentario.findById(nuevo._id)
      .populate('autor', 'nombre email rol')
      .populate('respondeA', 'texto autor');

    res.status(201).json(comentarioConDatos);
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

    const reporte = await Reporte.findById(req.params.id);
    if (!reporte) {
      return res.status(404).json({ error: 'Reporte no encontrado' });
    }

    if (reporte.estado === estado) {
      return res.status(400).json({
        error: `El reporte ya está en estado "${estado}"`
      });
    }

    const cambio = await EstadoReporte.create({
      reporte: reporte._id,
      estadoAnterior: reporte.estado,
      estadoNuevo: estado,
      comentario: comentario || '',
      cambiadoPor: req.usuario.id
    });

    reporte.estado = estado;
    await reporte.save();

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

// DELETE eliminar comentario — autor o admin (RF-022)
router.delete('/:idReporte/comentarios/:idComentario', verificarToken, async (req, res) => {
  try {
    const comentario = await Comentario.findById(req.params.idComentario);
    if (!comentario) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }

    const esAutor = comentario.autor.toString() === req.usuario.id;
    const esAdmin = req.usuario.rol === 'admin';

    if (!esAutor && !esAdmin) {
      return res.status(403).json({
        error: 'Solo el autor o un admin pueden eliminar este comentario'
      });
    }

    await Comentario.findByIdAndDelete(req.params.idComentario);
    res.json({ mensaje: 'Comentario eliminado correctamente' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE eliminar reporte — solo admin (elimina en cascada)
router.delete('/:id', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const eliminado = await Reporte.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'No encontrado' });

    await EstadoReporte.deleteMany({ reporte: req.params.id });
    await Comentario.deleteMany({ reporte: req.params.id });

    res.json({ mensaje: 'Reporte, historial y comentarios eliminados correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;