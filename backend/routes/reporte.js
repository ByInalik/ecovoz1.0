const express = require('express');
const router = express.Router();
const Reporte = require('../models/Reporte');
const EstadoReporte = require('../models/EstadoReporte');
const Comentario = require('../models/Comentario');
const Evidencia = require('../models/Evidencia');
const Usuario = require('../models/Usuario');
const verificarToken = require('../middleware/auth');
const verificarAdmin = require('../middleware/admin');
const verificarFuncionario = require('../middleware/funcionario');
const upload = require('../middleware/upload');
const { comprimirImagen } = require('../middleware/upload');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const auditar = require('../middleware/auditoria');
const { validarUbicacion } = require('../utils/validarUbicacion');
const { registrarManual } = require('../middleware/auditoria');
const { generarPDFReporte } = require('../utils/generarPDF');
const { crearNotificacion } = require('../utils/notificaciones');
const {
  enviarEmailCambioEstado,
  enviarEmailModeracion,
  enviarEmailNuevoComentario
} = require('../utils/emailService');

// ============================================
// 🌐 RUTAS PÚBLICAS — GET
// ============================================

// GET todos los reportes — público, con filtros avanzados (RF-018 + RF-019)
/**
 * @swagger
 * /api/reportes:
 *   get:
 *     summary: Listar reportes con filtros y paginación
 *     tags: [Reportes]
 *     parameters:
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         example: Residuos
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *         example: Pendiente
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
 *         name: buscar
 *         schema:
 *           type: string
 *         example: basura
 *       - in: query
 *         name: creadoPor
 *         schema:
 *           type: string
 *       - in: query
 *         name: incluirNoAprobados
 *         schema:
 *           type: boolean
 *         description: Si es true, incluye pendientes y rechazados (solo staff)
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
 *       - in: query
 *         name: orden
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, titulo, estado]
 *           default: createdAt
 *       - in: query
 *         name: dir
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Lista de reportes con metadata de paginación
 */
router.get('/', async (req, res) => {
  try {
    const {
      categoria,
      estado,
      desde,
      hasta,
      buscar,
      creadoPor,
      incluirNoAprobados,
      page = 1,
      limit = 20,
      orden = 'createdAt',
      dir = 'desc'
    } = req.query;

    const filtro = {};

    if (categoria) filtro.categoria = categoria;
    if (estado) filtro.estado = estado;
    if (creadoPor) filtro.creadoPor = creadoPor;

    const incluirTodos = incluirNoAprobados === 'true';
    if (!incluirTodos) {
      filtro.estado = filtro.estado
        ? filtro.estado
        : { $nin: ['Pendiente de moderación', 'Rechazado'] };
    }

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

// GET historial de cambios — público (RF-006)
/**
 * @swagger
 * /api/reportes/{id}/historial:
 *   get:
 *     summary: Ver historial de cambios de estado
 *     tags: [Reportes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Historial de cambios
 */
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

// GET comentarios — requiere token (filtra internos) (RF-022)
/**
 * @swagger
 * /api/reportes/{id}/comentarios:
 *   get:
 *     summary: Ver comentarios de un reporte
 *     tags: [Comentarios]
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
 *         description: Lista de comentarios (filtra internos según rol)
 */
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

// GET evidencias — público (RF-010)
/**
 * @swagger
 * /api/reportes/{id}/evidencias:
 *   get:
 *     summary: Listar evidencias de un reporte
 *     tags: [Evidencias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de evidencias
 */
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
// 📄 EXPORTAR A PDF — RF-017
// (Debe ir ANTES de GET /:id)
// ============================================
/**
 * @swagger
 * /api/reportes/{id}/pdf:
 *   get:
 *     summary: Exportar reporte a PDF
 *     tags: [Reportes]
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
 *         description: PDF del reporte (descarga)
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       403:
 *         description: No autorizado
 */
router.get('/:id/pdf', verificarToken, async (req, res) => {
  try {
    const reporte = await Reporte.findById(req.params.id)
      .populate('creadoPor', 'nombre email');

    if (!reporte) {
      return res.status(404).json({ error: 'Reporte no encontrado' });
    }

    // Validar permisos: autor, funcionario o admin
    const esAutor = reporte.creadoPor?._id?.toString() === req.usuario.id;
    const esStaff = req.usuario.rol === 'funcionario' || req.usuario.rol === 'admin';

    if (!esAutor && !esStaff) {
      return res.status(403).json({
        error: 'Solo el autor, un funcionario o un admin pueden descargar este PDF'
      });
    }

    // Cargar historial y evidencias
    const [historial, evidencias] = await Promise.all([
      EstadoReporte.find({ reporte: reporte._id })
        .populate('cambiadoPor', 'nombre email')
        .sort({ fechaCambio: 1 }),
      Evidencia.find({ reporte: reporte._id }).sort({ createdAt: 1 })
    ]);

    // Configurar headers para descarga
    const fecha = new Date().toISOString().split('T')[0];
    const nombreArchivo = `EcoVoz_Reporte_${reporte._id}_${fecha}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);

    // Generar y enviar el PDF (streaming)
    const doc = generarPDFReporte(reporte, historial, evidencias);
    doc.pipe(res);

    // Registrar en auditoría (sin await para no bloquear el streaming)
    registrarManual({
      req,
      usuario: req.usuario,
      accion: 'exportar_pdf',
      entidad: 'Reporte',
      entidadId: reporte._id,
      exito: true
    }).catch(err => console.error('Error auditando PDF:', err.message));

  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }
    console.error('Error generando PDF:', err);
    res.status(500).json({ error: 'Error generando el PDF' });
  }
});

// ============================================
// 🌐 RUTA GENÉRICA POR ID (al final de los GET)
// ============================================

// GET por ID — público pero filtra por moderación (RF-019)
/**
 * @swagger
 * /api/reportes/{id}:
 *   get:
 *     summary: Ver un reporte por ID
 *     tags: [Reportes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalle del reporte
 *       404:
 *         description: No encontrado (o sin permisos si no está aprobado)
 */
router.get('/:id', async (req, res) => {
  try {
    const item = await Reporte.findById(req.params.id)
      .populate('creadoPor', 'nombre email');

    if (!item) return res.status(404).json({ error: 'No encontrado' });

    const estaAprobado = !['Pendiente de moderación', 'Rechazado'].includes(item.estado);

    if (!estaAprobado) {
      const authHeader = req.headers['authorization'];
      if (!authHeader) {
        return res.status(404).json({ error: 'No encontrado' });
      }

      try {
        const jwt = require('jsonwebtoken');
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const esAutor = item.creadoPor?._id?.toString() === decoded.id;
        const esStaff = decoded.rol === 'funcionario' || decoded.rol === 'admin';

        if (!esAutor && !esStaff) {
          return res.status(404).json({ error: 'No encontrado' });
        }
      } catch (err) {
        return res.status(404).json({ error: 'No encontrado' });
      }
    }

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

// POST crear reporte (RF-003 + RF-025 + RF-019)
/**
 * @swagger
 * /api/reportes:
 *   post:
 *     summary: Crear un nuevo reporte
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titulo, descripcion, categoria, ubicacion, latitud, longitud]
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: Basura en el parque
 *               descripcion:
 *                 type: string
 *                 example: Residuos acumulados en la esquina
 *               categoria:
 *                 type: string
 *                 enum: [Residuos, Agua, Aire, Fauna, Flora, Ruido, Otro]
 *               subcategoria:
 *                 type: string
 *                 example: Basura acumulada
 *               ubicacion:
 *                 type: string
 *                 example: Parque Central, Garzón
 *               latitud:
 *                 type: number
 *                 example: 2.1969
 *               longitud:
 *                 type: number
 *                 example: -75.6269
 *               solicitarExcepcion:
 *                 type: boolean
 *                 description: Si está fuera de Garzón y quieres solicitar excepción
 *     responses:
 *       201:
 *         description: Reporte creado (queda en "Pendiente de moderación")
 *       400:
 *         description: Datos inválidos o ubicación fuera de Garzón
 */
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

    const validacion = validarUbicacion(latitud, longitud);

    if (!validacion.valido && solicitarExcepcion !== true) {
      return res.status(400).json({
        error: validacion.mensaje,
        distancia: validacion.distancia,
        puedeSolicitarExcepcion: true,
        hint: 'Envía "solicitarExcepcion": true si estás seguro de la ubicación'
      });
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
      requiereValidacionManual: !validacion.valido,
      estado: 'Pendiente de moderación'
    });

    res.status(201).json({
      mensaje: 'Reporte creado. Será visible al público después de ser moderado.',
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

// POST crear comentario (RF-022)
/**
 * @swagger
 * /api/reportes/{id}/comentarios:
 *   post:
 *     summary: Crear un comentario en un reporte
 *     tags: [Comentarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [texto]
 *             properties:
 *               texto:
 *                 type: string
 *                 example: Ya estamos trabajando en esto
 *               tipo:
 *                 type: string
 *                 enum: [publico, interno]
 *                 default: publico
 *               respondeA:
 *                 type: string
 *                 description: ID del comentario al que responde (opcional)
 *     responses:
 *       201:
 *         description: Comentario creado
 */
router.post('/:id/comentarios', verificarToken, async (req, res) => {
  try {
    const { texto, tipo, respondeA } = req.body;

    const reporte = await Reporte.findById(req.params.id);
    if (!reporte) return res.status(404).json({ error: 'Reporte no encontrado' });

    if (tipo === 'interno') {
      const esStaff = req.usuario.rol === 'funcionario' || req.usuario.rol === 'admin';
      if (!esStaff) {
        return res.status(403).json({ error: 'Solo funcionarios pueden crear comentarios internos' });
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

    // Notificar al autor del reporte (si no es él mismo quien comenta)
    try {
      if (reporte.creadoPor && reporte.creadoPor.toString() !== req.usuario.id) {
        const autorReporte = await Usuario.findById(reporte.creadoPor);
        const autorComentario = await Usuario.findById(req.usuario.id);

        if (autorReporte && autorReporte.email) {
          await crearNotificacion({
            usuario: autorReporte,
            tipo: 'nuevo_comentario',
            titulo: 'Nuevo comentario en tu reporte',
            mensaje: `${autorComentario.nombre} comentó: "${texto.substring(0, 80)}${texto.length > 80 ? '...' : ''}"`,
            referencia: { tipo: 'Comentario', id: nuevo._id },
            emailFn: () => enviarEmailNuevoComentario({
              usuario: autorReporte,
              reporte,
              autorComentario: autorComentario.nombre,
              textoComentario: texto
            })
          });
        }
      }
    } catch (notifErr) {
      console.error('Error notificando comentario:', notifErr.message);
    }

    res.status(201).json(comentarioConDatos);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST subir evidencia (RF-010 + RF-013)
/**
 * @swagger
 * /api/reportes/{id}/evidencias:
 *   post:
 *     summary: Subir evidencia (foto o video)
 *     tags: [Evidencias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [archivo]
 *             properties:
 *               archivo:
 *                 type: string
 *                 format: binary
 *                 description: Imagen (JPG/PNG máx 10MB) o video (MP4 máx 50MB)
 *     responses:
 *       201:
 *         description: Evidencia subida (imágenes >2MB se comprimen automáticamente)
 *       400:
 *         description: Archivo inválido o límite alcanzado
 */
router.post('/:id/evidencias', verificarToken, upload.single('archivo'), comprimirImagen, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    const reporte = await Reporte.findById(req.params.id);
    if (!reporte) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Reporte no encontrado' });
    }

    const esVideo = req.file.mimetype.startsWith('video/');
    const tipo = esVideo ? 'Video' : 'Imagen';

    const tamañoMB = req.file.size / (1024 * 1024);
    if (tipo === 'Imagen' && tamañoMB > 10) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'La imagen no puede exceder 10 MB' });
    }
    if (tipo === 'Video' && tamañoMB > 50) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'El video no puede exceder 50 MB' });
    }

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

// PUT moderar reporte — funcionario o admin (RF-019)
/**
 * @swagger
 * /api/reportes/{id}/moderar:
 *   put:
 *     summary: Aprobar o rechazar un reporte (funcionario/admin)
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [decision]
 *             properties:
 *               decision:
 *                 type: string
 *                 enum: [aprobar, rechazar]
 *               motivo:
 *                 type: string
 *                 description: Obligatorio si decision=rechazar (mín 50 caracteres)
 *                 example: La imagen no corresponde al incidente reportado, se requiere más información detallada.
 *     responses:
 *       200:
 *         description: Reporte moderado
 *       400:
 *         description: Decisión inválida o motivo faltante
 */
router.put('/:id/moderar', verificarToken, verificarFuncionario, auditar('moderar_reporte', 'Reporte'), async (req, res) => {
  try {
    const { decision, motivo } = req.body;

    if (!decision || !['aprobar', 'rechazar'].includes(decision)) {
      return res.status(400).json({
        error: 'La decisión debe ser "aprobar" o "rechazar"'
      });
    }

    const reporte = await Reporte.findById(req.params.id);
    if (!reporte) return res.status(404).json({ error: 'Reporte no encontrado' });

    if (reporte.estado !== 'Pendiente de moderación') {
      return res.status(400).json({
        error: `Este reporte ya fue moderado (estado actual: "${reporte.estado}")`
      });
    }

    if (decision === 'rechazar') {
      if (!motivo || motivo.trim().length < 50) {
        return res.status(400).json({
          error: 'El motivo de rechazo es obligatorio y debe tener al menos 50 caracteres'
        });
      }
    }

    const estadoAnterior = reporte.estado;

    if (decision === 'aprobar') {
      reporte.estado = 'Pendiente';
      reporte.moderacion = {
        aprobado: true,
        moderadoPor: req.usuario.id,
        fechaModeracion: new Date(),
        motivoRechazo: ''
      };
    } else {
      reporte.estado = 'Rechazado';
      reporte.moderacion = {
        aprobado: false,
        moderadoPor: req.usuario.id,
        fechaModeracion: new Date(),
        motivoRechazo: motivo.trim()
      };
    }

    await reporte.save();

    await EstadoReporte.create({
      reporte: reporte._id,
      estadoAnterior,
      estadoNuevo: reporte.estado,
      comentario: decision === 'aprobar'
        ? 'Reporte aprobado por moderador'
        : `Reporte rechazado: ${motivo.trim()}`,
      cambiadoPor: req.usuario.id
    });

    // Notificar al autor de la decisión
    try {
      const autor = await Usuario.findById(reporte.creadoPor);
      if (autor && autor.email) {
        await crearNotificacion({
          usuario: autor,
          tipo: decision === 'aprobar' ? 'moderacion_aprobado' : 'moderacion_rechazado',
          titulo: decision === 'aprobar' ? 'Tu reporte fue aprobado' : 'Tu reporte fue rechazado',
          mensaje: decision === 'aprobar'
            ? `El reporte "${reporte.titulo}" es visible al público.`
            : `El reporte "${reporte.titulo}" fue rechazado: ${motivo.trim()}`,
          referencia: { tipo: 'Reporte', id: reporte._id },
          emailFn: () => enviarEmailModeracion({
            usuario: autor,
            reporte,
            decision,
            motivo: motivo ? motivo.trim() : ''
          })
        });
      }
    } catch (notifErr) {
      console.error('Error notificando moderación:', notifErr.message);
    }

    res.json({
      mensaje: decision === 'aprobar'
        ? 'Reporte aprobado y visible públicamente'
        : 'Reporte rechazado',
      reporte
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }
    res.status(400).json({ error: err.message });
  }
});

// PUT cambiar estado — funcionario o admin (RF-006)
/**
 * @swagger
 * /api/reportes/{id}/estado:
 *   put:
 *     summary: Cambiar estado de un reporte (funcionario/admin)
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [estado]
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [Pendiente, En revisión, En proceso, Solucionado, Rechazado]
 *               comentario:
 *                 type: string
 *                 example: Asignado al equipo de limpieza
 *     responses:
 *       200:
 *         description: Estado actualizado (envía email al autor)
 */
router.put('/:id/estado', verificarToken, verificarFuncionario, auditar('cambiar_estado', 'Reporte'), async (req, res) => {
  try {
    const { estado, comentario } = req.body;

    if (!estado) {
      return res.status(400).json({ error: 'El campo "estado" es obligatorio' });
    }

    if (estado === 'Pendiente de moderación') {
      return res.status(400).json({
        error: 'No puedes cambiar manualmente al estado "Pendiente de moderación"'
      });
    }

    const reporte = await Reporte.findById(req.params.id);
    if (!reporte) return res.status(404).json({ error: 'Reporte no encontrado' });

    if (reporte.estado === 'Pendiente de moderación') {
      return res.status(400).json({
        error: 'El reporte aún no ha sido moderado. Primero debe aprobarse o rechazarse.'
      });
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

    // Notificar al autor del reporte
    try {
      const autor = await Usuario.findById(reporte.creadoPor);
      if (autor && autor.email && autor._id.toString() !== req.usuario.id) {
        await crearNotificacion({
          usuario: autor,
          tipo: 'cambio_estado',
          titulo: `Tu reporte cambió a "${estado}"`,
          mensaje: `El reporte "${reporte.titulo}" pasó de "${cambio.estadoAnterior}" a "${estado}".`,
          referencia: { tipo: 'Reporte', id: reporte._id },
          emailFn: () => enviarEmailCambioEstado({
            usuario: autor,
            reporte,
            estadoAnterior: cambio.estadoAnterior,
            estadoNuevo: estado,
            comentario
          })
        });
      }
    } catch (notifErr) {
      console.error('Error creando notificación:', notifErr.message);
    }

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
/**
 * @swagger
 * /api/reportes/{id}:
 *   put:
 *     summary: Actualizar cualquier campo de un reporte (solo admin)
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Reporte actualizado
 */
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
/**
 * @swagger
 * /api/reportes/{idReporte}/comentarios/{idComentario}:
 *   delete:
 *     summary: Eliminar comentario (autor o admin)
 *     tags: [Comentarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idReporte
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: idComentario
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comentario eliminado
 *       403:
 *         description: No autorizado
 */
router.delete('/:idReporte/comentarios/:idComentario', verificarToken, async (req, res) => {
  try {
    const comentario = await Comentario.findById(req.params.idComentario);
    if (!comentario) return res.status(404).json({ error: 'Comentario no encontrado' });

    const esAutor = comentario.autor?.toString() === req.usuario.id;
    const esAdmin = req.usuario.rol === 'admin';

    if (!esAutor && !esAdmin) {
      return res.status(403).json({ error: 'Solo el autor o un admin pueden eliminar este comentario' });
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
/**
 * @swagger
 * /api/reportes/{idReporte}/evidencias/{idEvidencia}:
 *   delete:
 *     summary: Eliminar evidencia (autor o admin)
 *     tags: [Evidencias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idReporte
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: idEvidencia
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evidencia eliminada
 */
router.delete('/:idReporte/evidencias/:idEvidencia', verificarToken, async (req, res) => {
  try {
    const evidencia = await Evidencia.findById(req.params.idEvidencia);
    if (!evidencia) return res.status(404).json({ error: 'Evidencia no encontrada' });

    if (evidencia.reporte.toString() !== req.params.idReporte) {
      return res.status(400).json({ error: 'La evidencia no pertenece a este reporte' });
    }

    const esAutor = evidencia.subidoPor?.toString() === req.usuario.id;
    const esAdmin = req.usuario.rol === 'admin';

    if (!esAutor && !esAdmin) {
      return res.status(403).json({ error: 'Solo el autor o un admin pueden eliminar esta evidencia' });
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

// DELETE eliminar reporte — solo admin (cascada)
/**
 * @swagger
 * /api/reportes/{id}:
 *   delete:
 *     summary: Eliminar reporte (solo admin)
 *     tags: [Reportes]
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
 *         description: Reporte eliminado en cascada (historial, comentarios, evidencias)
 */
router.delete('/:id', verificarToken, verificarAdmin, auditar('eliminar_reporte', 'Reporte'), async (req, res) => {
  try {
    const eliminado = await Reporte.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'No encontrado' });

    await EstadoReporte.deleteMany({ reporte: req.params.id });
    await Comentario.deleteMany({ reporte: req.params.id });

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