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
    required: true 
  },
  ubicacion: { 
    type: String, 
    required: true 
  },
  coordenadas: { 
    type: String 
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
    enum: ['Pendiente', 'En proceso', 'Resuelto'], 
    default: 'Pendiente' 
  },
  creadoPor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario',
    required: true
  }
}, { 
  timestamps: true // Crea automáticamente createdAt y updatedAt
});

module.exports = mongoose.model('Reporte', ReporteSchema);