const LogActividad = require('../models/LogActividad');

/**
 * Middleware de auditoría
 * Registra automáticamente las acciones en la BD.
 * 
 * Uso: router.post('/', verificarToken, auditar('crear_reporte', 'Reporte'), handler)
 */
function auditar(accion, entidad = '') {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = function (body) {
      // Registrar después de responder (fire and forget)
      registrarLog(req, res, accion, entidad, body).catch(err => {
        console.error('❌ Error al guardar log de auditoría:', err.message);
      });

      return originalJson(body);
    };

    next();
  };
}

async function registrarLog(req, res, accion, entidad, respuesta) {
  try {
    const exito = res.statusCode < 400;

    await LogActividad.create({
      usuario: req.usuario?.id || null,
      usuarioEmail: req.usuario?.email || null,
      accion,
      descripcion: `${req.method} ${req.originalUrl}`,
      entidad,
      entidadId: req.params.id || null,
      metodo: req.method,
      ruta: req.originalUrl,
      ip: req.ip || req.headers['x-forwarded-for'] || '',
      userAgent: req.headers['user-agent'] || '',
      exito,
      detalle: {
        statusCode: res.statusCode,
        params: req.params,
        query: req.query,
        error: exito ? undefined : (respuesta?.error || '')
      }
    });
  } catch (err) {
    console.error('❌ No se pudo guardar el log:', err.message);
  }
}

/**
 * Función auxiliar para registrar una acción manualmente.
 * Útil para login (porque el usuario aún no está autenticado cuando se ejecuta).
 * 
 * Uso:
 *   await registrarManual({
 *     req,
 *     usuario,
 *     accion: 'login_exitoso',
 *     entidad: 'Auth',
 *     exito: true
 *   });
 */
async function registrarManual({ req, usuario, accion, entidad = '', entidadId = null, exito = true, detalle = {} }) {
  try {
    await LogActividad.create({
      usuario: usuario?._id || usuario?.id || null,
      usuarioEmail: usuario?.email || null,
      accion,
      descripcion: `${req.method} ${req.originalUrl}`,
      entidad,
      entidadId,
      metodo: req.method,
      ruta: req.originalUrl,
      ip: req.ip || req.headers['x-forwarded-for'] || '',
      userAgent: req.headers['user-agent'] || '',
      exito,
      detalle
    });
  } catch (err) {
    console.error('❌ No se pudo guardar el log manual:', err.message);
  }
}

module.exports = auditar;
module.exports.registrarManual = registrarManual;