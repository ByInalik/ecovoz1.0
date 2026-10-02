const LogActividad = require('../models/LogActividad');

/**
 * Middleware de auditoría
 * Registra automáticamente las acciones en la BD.
 * 
 * Uso: router.post('/', verificarToken, auditar('crear_reporte', 'Reporte'), handler)
 */
function auditar(accion, entidad = '') {
  return async (req, res, next) => {
    // Guardar la función original de res.json para interceptar la respuesta
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
      accion,
      descripcion: `${req.method} ${req.originalUrl}`,
      entidad,
      entidadId: req.params.id ? req.params.id : null,
      metodo: req.method,
      ruta: req.originalUrl,
      ip: req.ip || req.headers['x-forwarded-for'] || '',
      userAgent: req.headers['user-agent'] || '',
      exito,
      detalle: {
        statusCode: res.statusCode,
        params: req.params,
        query: req.query,
        // Solo incluir error si falló
        error: exito ? undefined : (respuesta?.error || '')
      }
    });
  } catch (err) {
    console.error('❌ No se pudo guardar el log:', err.message);
  }
}

module.exports = auditar;