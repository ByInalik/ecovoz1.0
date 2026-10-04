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
// 👤 GET mi perfil — el usuario ve su propia info
// ============================================
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
// Requiere enviar la contraseña para confirmar
// ============================================
router.delete('/', async (req, res) => {
  try {
    const { password } = req.body;

    // 1. Validar que venga la contraseña
    if (!password) {
      return res.status(400).json({
        error: 'Debes enviar tu contraseña para confirmar la eliminación'
      });
    }

    // 2. Buscar al usuario
    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    // 3. Verificar contraseña
    const valida = await bcrypt.compare(password, usuario.password);
    if (!valida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // 4. No permitir que el último admin se elimine (evitar dejar el sistema sin admins)
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

    // 5. Anonimizar reportes del usuario (SRS CA-3)
    // Los reportes NO se eliminan, pero se desvinculan del usuario
    const reportesAnonimizados = await Reporte.updateMany(
      { creadoPor: usuario._id },
      {
        $set: {
          esAnonimo: true,
          creadoPorOriginal: usuario._id, // guardamos el ID original para auditoría
          creadoPor: null // desvinculamos
        }
      }
    );

    // 6. Anonimizar comentarios
    const comentariosAnonimizados = await Comentario.updateMany(
      { autor: usuario._id },
      {
        $set: {
          autorOriginal: usuario._id,
          autor: null
        }
      }
    );

    // 7. Soft delete: marcar como eliminado (NO borrar de la BD)
    usuario.eliminado = true;
    usuario.eliminadoEn = new Date();
    usuario.estado = false;
    usuario.email = `eliminado_${usuario._id}_${usuario.email}`; // liberar el email para nuevo registro
    usuario.nombre = 'Usuario eliminado';

    await usuario.save();

    // 8. Registrar en auditoría
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