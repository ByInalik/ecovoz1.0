const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const Reporte = require('../models/Reporte');
const Comentario = require('../models/Comentario');
const verificarToken = require('../middleware/auth');
const verificarAdmin = require('../middleware/admin');
const auditar = require('../middleware/auditoria');

// Todas las rutas requieren token de admin
router.use(verificarToken);
router.use(verificarAdmin);

// ============================================
// GESTIÓN DE USUARIOS (RF-020)
// ============================================

// GET listar usuarios — admin
router.get('/', async (req, res) => {
  try {
    const { rol, buscar, page = 1, limit = 20 } = req.query;

    const filtro = {};
    if (rol) filtro.rol = rol;
    if (buscar) {
      filtro.$or = [
        { nombre: { $regex: buscar, $options: 'i' } },
        { email: { $regex: buscar, $options: 'i' } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [usuarios, total] = await Promise.all([
      Usuario.find(filtro)
        .select('-password') // NUNCA devolver el password
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Usuario.countDocuments(filtro)
    ]);

    res.json({
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      usuarios
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET usuario por ID — admin
router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-password');
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Contar reportes creados por este usuario
    const totalReportes = await Reporte.countDocuments({ creadoPor: usuario._id });
    const totalComentarios = await Comentario.countDocuments({ autor: usuario._id });

    res.json({
      usuario,
      estadisticas: {
        totalReportes,
        totalComentarios
      }
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }
    res.status(500).json({ error: err.message });
  }
});

// PUT cambiar rol — admin
router.put('/:id/rol', auditar('cambiar_rol', 'Usuario'), async (req, res) => {
  try {
    const { rol } = req.body;

    if (!rol) {
      return res.status(400).json({ error: 'El campo "rol" es obligatorio' });
    }

    const rolesValidos = ['ciudadano', 'funcionario', 'admin'];
    if (!rolesValidos.includes(rol)) {
      return res.status(400).json({
        error: `Rol inválido. Valores permitidos: ${rolesValidos.join(', ')}`
      });
    }

    // Evitar que un admin se quite a sí mismo el rol
    if (req.params.id === req.usuario.id) {
      return res.status(400).json({
        error: 'No puedes cambiar tu propio rol'
      });
    }

    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { rol },
      { new: true }
    ).select('-password');

    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({
      mensaje: `Rol actualizado a "${rol}" correctamente`,
      usuario
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }
    res.status(400).json({ error: err.message });
  }
});

// PUT activar/desactivar usuario — admin
router.put('/:id/estado', auditar('cambiar_estado_usuario', 'Usuario'), async (req, res) => {
  try {
    const { activo } = req.body;

    if (typeof activo !== 'boolean') {
      return res.status(400).json({ error: 'El campo "activo" debe ser true o false' });
    }

    // Evitar que un admin se desactive a sí mismo
    if (req.params.id === req.usuario.id) {
      return res.status(400).json({
        error: 'No puedes desactivar tu propia cuenta'
      });
    }

    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { estado: activo },
      { new: true }
    ).select('-password');

    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({
      mensaje: `Usuario ${activo ? 'activado' : 'desactivado'} correctamente`,
      usuario
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }
    res.status(400).json({ error: err.message });
  }
});

// DELETE eliminar usuario — admin
router.delete('/:id', auditar('eliminar_usuario', 'Usuario'), async (req, res) => {
  try {
    // Evitar que un admin se elimine a sí mismo
    if (req.params.id === req.usuario.id) {
      return res.status(400).json({
        error: 'No puedes eliminar tu propia cuenta'
      });
    }

    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({
      mensaje: 'Usuario eliminado correctamente',
      usuario: { id: usuario._id, email: usuario.email }
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;