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
    enum: ['Pendiente', 'En revisión', 'En proceso', 'Solucionado'],
    default: 'Pendiente'
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
    default: null  // 🔽 Ya no es required (puede ser null si el usuario se eliminó)
  },
  // 🔽 NUEVO: guarda el ID del usuario original cuando se anonimiza
  creadoPorOriginal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reporte', ReporteSchema);