const mongoose = require('mongoose');

const EvidenciaSchema = new mongoose.Schema({
  reporte: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reporte',
    required: true
  },
  tipo: {
    type: String,
    enum: ['Imagen', 'Video'],
    required: true
  },
  url: {
    type: String,
    required: true  // ej: /uploads/foto-123.jpg
  },
  nombreOriginal: {
    type: String,   // el nombre que traía el archivo al subirse
  },
  tamaño: {
    type: Number,   // en bytes
  },
  mimetype: {
    type: String,   // ej: image/jpeg
  },
  subidoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Evidencia', EvidenciaSchema);