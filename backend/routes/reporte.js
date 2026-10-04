const express = require('express');
const router = express.Router();
const Reporte = require('../models/Reporte');
const EstadoReporte = require('../models/EstadoReporte');
const Comentario = require('../models/Comentario');
const Evidencia = require('../models/Evidencia');
const verificarToken = require('../middleware/auth');
const verificarAdmin = require('../middleware/admin');
const verificarFuncionario = require('../middleware/funcionario');
const upload = require('../middleware/upload');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const auditar = require('../middleware/auditoria');
const { validarUbicacion } = require('../utils/validarUbicacion');

// ============================================
// 🌐 RUTAS PÚBLICAS — GET
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

// GET comentarios de un reporte — requiere token (filtra internos) (RF-022)
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

// GET listar evidencias de un reporte — público (RF-010)
router.get('/:id/evidencias', async (req, res) => {
  try {
    const evidencias = await Evidencia.find({ reporte: req.params.id })
      .populate('subidoPor', 'nombre email')
      .sort({ createdAt: -1 });
    res.json(evidencias);
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
// 🔒 RUTAS PROTEGIDAS — POST
// ============================================

// POST crear reporte — cualquier usuario autenticado (RF-003 + RF-025)
router.post('/', verificarToken, auditar('crear_reporte', 'Reporte'), async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      categoria,
      subcategoria,
      ubicacion,
      latitud,
      longitud,
      fotos,
      esAnonimo,
      solicitarExcepcion
    } = req.body;

    // Validar ubicación en Garzón (RF-025)
    const validacion = validarUbicacion(latitud, longitud);

    if (!validacion.valido) {
      // Si el usuario NO solicita excepción, se rechaza
      if (solicitarExcepcion !== true) {
        return res.status(400).json({
          error: validacion.mensaje,
          distancia: validacion.distancia,
          puedeSolicitarExcepcion: true,
          hint: 'Envía "solicitarExcepcion": true si estás seguro de la ubicación'
        });
      }
      // Si solicita excepción, se guarda pero marcado para validación manual
    }

    const nuevo = await Reporte.create({
      titulo,
      descripcion,
      categoria,
      subcategoria,
      ubicacion,
      latitud,
      longitud,
      fotos,
      esAnonimo,
      creadoPor: req.usuario.id,
      requiereValidacionManual: !validacion.valido // ⬅️ true si está fuera del radio
    });

    res.status(201).json({
      mensaje: validacion.valido
        ? 'Reporte creado correctamente'
        : 'Reporte creado, pero requiere validación manual por estar fuera del área de Garzón',
      reporte: nuevo,
      validacionUbicacion: {
        valido: validacion.valido,
        distancia: validacion.distancia
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST crear comentario — cualquier usuario autenticado (RF-022)
router.post('/:id/comentarios', verificarToken, auditar('crear_comentario', 'Comentario'), async (req, res) => {
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

// POST subir evidencia — cualquier usuario autenticado (RF-010)
router.post('/:id/evidencias', verificarToken, auditar('subir_evidencia', 'Evidencia'), upload.single('archivo'), async (req, res) => {
  try {
    // 1. Verificar que se subió un archivo
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    // 2. Verificar que el reporte existe
    const reporte = await Reporte.findById(req.params.id);
    if (!reporte) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Reporte no encontrado' });
    }

    // 3. Determinar tipo según el mimetype
    const esVideo = req.file.mimetype.startsWith('video/');
    const tipo = esVideo ? 'Video' : 'Imagen';

    // 4. Validar tamaño según tipo
    const tamañoMB = req.file.size / (1024 * 1024);
    if (tipo === 'Imagen' && tamañoMB > 10) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'La imagen no puede exceder 10 MB' });
    }
    if (tipo === 'Video' && tamañoMB > 50) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'El video no puede exceder 50 MB' });
    }

    // 5. Verificar reglas del SRS: max 5 fotos O 1 video
    const evidenciasExistentes = await Evidencia.find({ reporte: req.params.id });
    const fotosActuales = evidenciasExistentes.filter(e => e.tipo === 'Imagen').length;
    const videosActuales = evidenciasExistentes.filter(e => e.tipo === 'Video').length;

    if (tipo === 'Imagen') {
      if (fotosActuales >= 5) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'Máximo 5 fotos por reporte' });
      }
      if (videosActuales > 0) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'Solo puedes adjuntar fotos O video, no ambos' });
      }
    }

    if (tipo === 'Video') {
      if (videosActuales >= 1) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'Solo se permite 1 video por reporte' });
      }
      if (fotosActuales > 0) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'Solo puedes adjuntar fotos O video, no ambos' });
      }
    }

    // 6. Guardar en la BD
    const urlPublica = `/uploads/${req.file.filename}`;
    const evidencia = await Evidencia.create({
      reporte: req.params.id,
      tipo,
      url: urlPublica,
      nombreOriginal: req.file.originalname,
      tamaño: req.file.size,
      mimetype: req.file.mimetype,
      subidoPor: req.usuario.id
    });

    res.status(201).json({
      mensaje: 'Evidencia subida correctamente',
      evidencia
    });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'El archivo es demasiado grande (máx 50 MB)' });
      }
      return res.status(400).json({ error: err.message });
    }

    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }
    res.status(400).json({ error: err.message });
  }
});

// ============================================
// 🔒 RUTAS PROTEGIDAS — PUT
// ============================================

// PUT cambiar estado — solo funcionario o admin (RF-006)
router.put('/:id/estado', verificarToken, verificarFuncionario, auditar('cambiar_estado', 'Reporte'), async (req, res) => {
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
router.put('/:id', verificarToken, verificarAdmin, auditar('actualizar_reporte', 'Reporte'), async (req, res) => {
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

// ============================================
// 🔒 RUTAS PROTEGIDAS — DELETE
// ============================================

// DELETE eliminar comentario — autor o admin (RF-022)
router.delete('/:idReporte/comentarios/:idComentario', verificarToken, auditar('eliminar_comentario', 'Comentario'), async (req, res) => {
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

// DELETE eliminar evidencia — autor o admin (RF-010)
router.delete('/:idReporte/evidencias/:idEvidencia', verificarToken, auditar('eliminar_evidencia', 'Evidencia'), async (req, res) => {
  try {
    const evidencia = await Evidencia.findById(req.params.idEvidencia);
    if (!evidencia) {
      return res.status(404).json({ error: 'Evidencia no encontrada' });
    }

    if (evidencia.reporte.toString() !== req.params.idReporte) {
      return res.status(400).json({ error: 'La evidencia no pertenece a este reporte' });
    }

    const esAutor = evidencia.subidoPor.toString() === req.usuario.id;
    const esAdmin = req.usuario.rol === 'admin';

    if (!esAutor && !esAdmin) {
      return res.status(403).json({
        error: 'Solo el autor o un admin pueden eliminar esta evidencia'
      });
    }

    const rutaArchivo = path.join(__dirname, '..', evidencia.url);
    if (fs.existsSync(rutaArchivo)) {
      fs.unlinkSync(rutaArchivo);
    }

    await Evidencia.findByIdAndDelete(req.params.idEvidencia);

    res.json({ mensaje: 'Evidencia eliminada correctamente' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE eliminar reporte — solo admin (elimina en cascada)
router.delete('/:id', verificarToken, verificarAdmin, auditar('eliminar_reporte', 'Reporte'), async (req, res) => {
  try {
    const eliminado = await Reporte.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'No encontrado' });

    // Eliminar en cascada
    await EstadoReporte.deleteMany({ reporte: req.params.id });
    await Comentario.deleteMany({ reporte: req.params.id });

    // Eliminar evidencias físicas + registros en BD
    const evidencias = await Evidencia.find({ reporte: req.params.id });
    evidencias.forEach(ev => {
      const rutaArchivo = path.join(__dirname, '..', ev.url);
      if (fs.existsSync(rutaArchivo)) {
        fs.unlinkSync(rutaArchivo);
      }
    });
    await Evidencia.deleteMany({ reporte: req.params.id });

    res.json({ mensaje: 'Reporte, historial, comentarios y evidencias eliminados correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;