const mongoose = require('mongoose');

const NotificacionSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
    index: true
  },
  tipo: {
    type: String,
    enum: [
      'cambio_estado',        // Reporte cambió de estado
      'moderacion_aprobado',  // Reporte aprobado
      'moderacion_rechazado', // Reporte rechazado
      'nuevo_comentario',     // Nuevo comentario en tu reporte
      'bienvenida',           // Al registrarse
      'otro'
    ],
    required: true
  },
  titulo: {
    type: String,
    required: true
  },
  mensaje: {
    type: String,
    required: true
  },
  // Referencia al recurso relacionado (ej: el reporte)
  referencia: {
    tipo: {
      type: String, // 'Reporte' | 'Comentario' | etc
      default: null
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    }
  },
  leida: {
    type: Boolean,
    default: false
  },
  // Estado del envío por email
  emailEnviado: {
    type: Boolean,
    default: false
  },
  emailError: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Índice compuesto para consultas eficientes
NotificacionSchema.index({ usuario: 1, leida: 1, createdAt: -1 });

module.exports = mongoose.model('Notificacion', NotificacionSchema);