// backend/server.js

// 1. Importar dependencias
require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');

// Importar middlewares (necesarios para proteger rutas)
const { verificarToken, verificarAdmin } = require('./middleware/auth'); // O ajusta la ruta si varían los nombres

// Importar rutas
const authRoutes    = require('./routes/auth');
const ReporteRoutes = require('./routes/reporte.routes');

// 2. Crear la aplicación y definir el puerto
const app  = express();
const PORT = process.env.PORT || 3000;

// 3. Activar middlewares globales
app.use(cors());
app.use(express.json());

// 4. Rutas principales de la API
app.use('/api/auth', authRoutes);
app.use('/api/reportes', ReporteRoutes);

// Ruta de prueba base
app.get('/', (req, res) => {
  res.json({ mensaje: 'Servidor Ecovoz ✅' });
});

// 5. Conectar a MongoDB Atlas y encender servidor
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
  })
  .catch(err => console.error('❌ Error de conexión:', err));