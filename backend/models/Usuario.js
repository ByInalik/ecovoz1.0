// backend/models/Usuario.js

const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre:   { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: {
    type: String,
    enum: ['ciudadano', 'funcionario', 'admin'],
    default: 'ciudadano'
  }
}, { timestamps: true });

const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;