const mongoose = require('mongoose');

const EstadoReporteSchema = new mongoose.Schema({
  reporte: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reporte',
    required: true
  },
  estadoAnterior: {
    type: String,
    required: true
  },
  estadoNuevo: {
    type: String,
    required: true
  },
  comentario: {
    type: String,
    default: '' // Comentario del funcionario explicando el cambio
  },
  cambiadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  fechaCambio: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('EstadoReporte', EstadoReporteSchema);