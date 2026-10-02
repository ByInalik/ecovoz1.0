const mongoose = require('mongoose');

const ComentarioSchema = new mongoose.Schema({
  reporte: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reporte',
    required: true
  },
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  texto: {
    type: String,
    required: [true, 'El texto del comentario es obligatorio'],
    trim: true,
    minlength: [3, 'El comentario debe tener al menos 3 caracteres'],
    maxlength: [1000, 'El comentario no puede exceder 1000 caracteres']
  },
  tipo: {
    type: String,
    enum: ['publico', 'interno'],
    default: 'publico'
  },
  // Para responder a otro comentario (hilo)
  respondeA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comentario',
    default: null
  }
}, {
  timestamps: true // createdAt, updatedAt
});

module.exports = mongoose.model('Comentario', ComentarioSchema);