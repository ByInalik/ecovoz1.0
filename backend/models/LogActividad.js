const mongoose = require('mongoose');

const LogActividadSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: false // puede ser null si el usuario fue eliminado
  },
  usuarioEmail: {
    type: String,
    required: false // guardamos el email por si el usuario se elimina
  },
  accion: {
    type: String,
    required: true
    // ej: 'crear_reporte', 'cambiar_rol', 'login_exitoso', 'eliminar_usuario'
  },
  descripcion: {
    type: String,
    default: '' // ej: "PUT /api/usuarios/123/rol"
  },
  entidad: {
    type: String,
    default: '' // ej: 'Usuario', 'Reporte', 'Auth'
  },
  entidadId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
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
    default: {}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LogActividad', LogActividadSchema);