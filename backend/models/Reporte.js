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
    type: String // URLs de las imágenes
  }],
  esAnonimo: {
    type: Boolean,
    default: false
  },
  estado: {
    type: String,
    enum: ['Pendiente', 'En revisión', 'En proceso', 'Solucionado'],
    default: 'Pendiente'
  },
  sincronizado: {
    type: Boolean,
    default: true // true = creado online, false = pendiente de sincronizar desde offline
  },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reporte', ReporteSchema);