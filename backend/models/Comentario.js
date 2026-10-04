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
    default: null  // 🔽 ahora puede ser null
  },
  // 🔽 NUEVO: guarda el ID original al anonimizar
  autorOriginal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    default: null
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
  respondeA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comentario',
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Comentario', ComentarioSchema);