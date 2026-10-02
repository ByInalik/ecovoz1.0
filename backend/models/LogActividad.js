const mongoose = require('mongoose');

const LogActividadSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    default: null // null si es acción anónima (ej: login fallido)
  },
  accion: {
    type: String,
    required: true
    // Ejemplos: 'login', 'crear_reporte', 'cambiar_estado', 'eliminar_usuario'
  },
  descripcion: {
    type: String,
    default: ''
  },
  entidad: {
    type: String,
    default: '' // 'Reporte', 'Usuario', 'Comentario', etc.
  },
  entidadId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  metodo: {
    type: String, // GET, POST, PUT, DELETE
    default: ''
  },
  ruta: {
    type: String,
    default: ''
  },
  ip: {
    type: String,
    default: ''
  },
  userAgent: {
    type: String,
    default: ''
  },
  exito: {
    type: Boolean,
    default: true
  },
  detalle: {
    type: mongoose.Schema.Types.Mixed,
    default: {} // Info extra: id afectado, cambios, etc.
  }
}, {
  timestamps: true
});

// Índices para consultas rápidas
LogActividadSchema.index({ usuario: 1, createdAt: -1 });
LogActividadSchema.index({ accion: 1 });
LogActividadSchema.index({ createdAt: -1 });

module.exports = mongoose.model('LogActividad', LogActividadSchema);