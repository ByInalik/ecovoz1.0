const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const Reporte = require('../models/Reporte');
const Comentario = require('../models/Comentario');
const verificarToken = require('../middleware/auth');
const { registrarManual } = require('../middleware/auditoria');

// Todas las rutas requieren autenticación
router.use(verificarToken);

// ============================================
// 👤 GET mi perfil
// ============================================
/**
 * @swagger
 * /api/perfil:
 *   get:
 *     summary: Ver mi propio perfil
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario autenticado
 */
router.get('/', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id)
      .select('-password -eliminado -eliminadoEn');
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// 🗑️ DELETE eliminar MI cuenta — RF-016
// ============================================
/**
 * @swagger
 * /api/perfil:
 *   delete:
 *     summary: Eliminar mi cuenta (soft delete con anonimización)
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password:
 *                 type: string
 *                 description: Contraseña actual para confirmar
 *                 example: mipassword123
 *     responses:
 *       200:
 *         description: Cuenta eliminada (datos anonimizados)
 *       401:
 *         description: Contraseña incorrecta
 *       400:
 *         description: No puedes eliminar la última cuenta admin activa
 */
router.delete('/', async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        error: 'Debes enviar tu contraseña para confirmar la eliminación'
      });
    }

    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    const valida = await bcrypt.compare(password, usuario.password);
    if (!valida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    if (usuario.rol === 'admin') {
      const adminsActivos = await Usuario.countDocuments({
        rol: 'admin',
        eliminado: false,
        estado: true
      });
      if (adminsActivos <= 1) {
        return res.status(400).json({
          error: 'No puedes eliminar la última cuenta de administrador activa'
        });
      }
    }

    // Anonimizar reportes del usuario
    const reportesAnonimizados = await Reporte.updateMany(
      { creadoPor: usuario._id },
      {
        $set: {
          esAnonimo: true,
          creadoPorOriginal: usuario._id,
          creadoPor: null
        }
      }
    );

    // Anonimizar comentarios
    const comentariosAnonimizados = await Comentario.updateMany(
      { autor: usuario._id },
      {
        $set: {
          autorOriginal: usuario._id,
          autor: null
        }
      }
    );

    // Soft delete
    usuario.eliminado = true;
    usuario.eliminadoEn = new Date();
    usuario.estado = false;
    usuario.email = `eliminado_${usuario._id}_${usuario.email}`;
    usuario.nombre = 'Usuario eliminado';

    await usuario.save();

    await registrarManual({
      req,
      usuario: { id: usuario._id, email: usuario.email },
      accion: 'eliminar_cuenta_propia',
      entidad: 'Usuario',
      entidadId: usuario._id,
      exito: true,
      detalle: {
        reportesAnonimizados: reportesAnonimizados.modifiedCount,
        comentariosAnonimizados: comentariosAnonimizados.modifiedCount
      }
    });

    res.json({
      mensaje: 'Cuenta eliminada correctamente',
      detalles: {
        reportesAnonimizados: reportesAnonimizados.modifiedCount,
        comentariosAnonimizados: comentariosAnonimizados.modifiedCount,
        nota: 'Tus reportes permanecen anonimizados para estadísticas del sistema'
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;