// backend/models/Producto.js

const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  id:          { type: Number, required: true },
  icono:       { type: String, required: true },
  nombre:      { type: String, required: true },
  descripcion: { type: String, required: true },
  precio:      { type: String, required: true },
  imagen:      { type: String, required: true }
});

const Producto = mongoose.model('Producto', productoSchema);
module.exports = Producto;