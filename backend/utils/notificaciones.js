// backend/utils/notificaciones.js
// este guarda en la BD y envía el email
const Notificacion = require('../models/Notificacion');
const {
  enviarEmailCambioEstado,
  enviarEmailModeracion,
  enviarEmailNuevoComentario
} = require('./emailService');

/**
 * Crea una notificación en BD y envía email
 * @param {Object} params
 */
async function crearNotificacion({
  usuario,
  tipo,
  titulo,
  mensaje,
  referencia,
  emailFn // función de emailService a ejecutar
}) {
  const notificacion = await Notificacion.create({
    usuario: usuario._id || usuario.id,
    tipo,
    titulo,
    mensaje,
    referencia
  });

  // Enviar email (NO bloqueante)
  if (usuario.email && emailFn) {
    emailFn()
      .then(() => {
        Notificacion.findByIdAndUpdate(notificacion._id, {
          emailEnviado: true
        }).catch(() => {});
      })
      .catch(err => {
        console.error('❌ Error enviando email:', err.message);
        Notificacion.findByIdAndUpdate(notificacion._id, {
          emailEnviado: false,
          emailError: err.message
        }).catch(() => {});
      });
  }

  return notificacion;
}

module.exports = { crearNotificacion };