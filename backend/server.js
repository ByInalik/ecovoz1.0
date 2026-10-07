require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const path     = require('path');
const swaggerUi = require('swagger-ui-express');         // 🆕
const swaggerSpec = require('./config/swagger');          // 🆕

const authRoutes         = require('./routes/auth');
const ReporteRoutes      = require('./routes/reporte');
const EstadisticasRoutes = require('./routes/estadisticas');
const UsuariosRoutes     = require('./routes/usuarios');
const AuditoriaRoutes    = require('./routes/auditoria');
const PerfilRoutes       = require('./routes/perfil');
const NotificacionesRoutes = require('./routes/notificaciones');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🆕 Swagger UI (documentación de la API)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'EcoVoz API - Documentación'
}));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/reportes', ReporteRoutes);
app.use('/api/estadisticas', EstadisticasRoutes);
app.use('/api/usuarios', UsuariosRoutes);
app.use('/api/auditoria', AuditoriaRoutes);
app.use('/api/perfil', PerfilRoutes);
app.use('/api/notificaciones', NotificacionesRoutes);

app.get('/', (req, res) => {
  res.json({
    mensaje: 'Servidor Ecovoz ✅',
    documentacion: 'http://localhost:3000/api-docs'  // 🆕
  });
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    console.log(`📚 Documentación Swagger: http://localhost:${PORT}/api-docs`);  // 🆕
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
  })
  .catch(err => console.error('❌ Error de conexión:', err));