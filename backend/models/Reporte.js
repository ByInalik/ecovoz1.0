const mongoose = require('mongoose');

const ReporteSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria']
  },
  categoria: {
    type: String,
    enum: ['Residuos', 'Agua', 'Aire', 'Fauna', 'Flora', 'Ruido', 'Otro'],
    required: [true, 'La categoría es obligatoria']
  },
  subcategoria: {
    type: String,
    default: ''
  },
  ubicacion: {
    type: String,
    required: [true, 'La ubicación es obligatoria']
  },
  latitud: {
    type: Number,
    required: [true, 'La latitud es obligatoria']
  },
  longitud: {
    type: Number,
    required: [true, 'La longitud es obligatoria']
  },
  fotos: [{
    type: String
  }],
  esAnonimo: {
    type: Boolean,
    default: false
  },
  estado: {
    type: String,
    enum: [
      'Pendiente de moderación',   // nace así
      'Pendiente',                 // aprobado, visible públicamente
      'En revisión',               // moderador pide más info
      'En proceso',                // funcionario trabajando
      'Solucionado',               // terminado
      'Rechazado'                  // moderador rechazó
    ],
    default: 'Pendiente de moderación'
  },
  sincronizado: {
    type: Boolean,
    default: true
  },
  requiereValidacionManual: {
    type: Boolean,
    default: false
  },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    default: null
  },
  creadoPorOriginal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    default: null
  },
  // Campos de moderación (RF-019)
  moderacion: {
    aprobado: { type: Boolean, default: false },
    moderadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', default: null },
    fechaModeracion: { type: Date, default: null },
    motivoRechazo: { type: String, default: '' } // solo si rechazado
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reporte', ReporteSchema);