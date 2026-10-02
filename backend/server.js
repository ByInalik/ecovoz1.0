// backend/server.js

// 1. Importar dependencias
require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const path     = require('path');

// 2. Importar rutas
const authRoutes    = require('./routes/auth');
const ReporteRoutes = require('./routes/reporte');
const EstadisticasRoutes = require('./routes/estadisticas');
const UsuariosRoutes = require('./routes/usuarios');

// 3. Crear la aplicación y definir el puerto
const app  = express();
const PORT = process.env.PORT || 3000;

// 4. Activar middlewares globales
app.use(cors());
app.use(express.json());

// 5. Servir archivos estáticos (fotos/videos subidos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 6. Rutas principales de la API
app.use('/api/auth', authRoutes);
app.use('/api/reportes', ReporteRoutes);
app.use('/api/estadisticas', EstadisticasRoutes);
app.use('/api/usuarios', UsuariosRoutes);

// Ruta de prueba base
app.get('/', (req, res) => {
  res.json({ mensaje: 'Servidor Ecovoz ✅' });
});

// 7. Conectar a MongoDB Atlas y encender servidor
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
  })
  .catch(err => console.error('❌ Error de conexión:', err));