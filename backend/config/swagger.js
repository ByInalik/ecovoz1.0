const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EcoVoz API',
      version: '1.0.0',
      description: `
API REST para **EcoVoz**, sistema colaborativo de reportes ambientales para el municipio de Garzón, Huila (Colombia).

## Roles del sistema
- **Ciudadano**: crear reportes, comentar, ver notificaciones
- **Funcionario**: todo lo anterior + moderar reportes, cambiar estados, ver estadísticas
- **Admin**: todo lo anterior + gestión de usuarios, auditoría, eliminar reportes

## Autenticación
La mayoría de endpoints requieren autenticación mediante JWT. Para probar:
1. Usa \`POST /api/auth/login\` con credenciales válidas
2. Copia el token de la respuesta
3. Haz clic en el botón **Authorize** (arriba a la derecha)
4. Pega el token con el formato: \`Bearer TU_TOKEN_AQUI\`
      `,
      contact: {
        name: 'EcoVoz - Proyecto ADSO',
        email: 'hernandezmaicol106@gmail.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa tu token JWT'
        }
      },
      schemas: {
        Usuario: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '68d1a2b3c4d5e6f7a8b9c0d1' },
            nombre: { type: 'string', example: 'Michael Hernández' },
            email: { type: 'string', example: 'michael@ecovoz.com' },
            rol: { type: 'string', enum: ['ciudadano', 'funcionario', 'admin'] },
            estado: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Reporte: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '68d1a2b3c4d5e6f7a8b9c0d1' },
            titulo: { type: 'string', example: 'Basura en el parque' },
            descripcion: { type: 'string', example: 'Residuos acumulados' },
            categoria: { type: 'string', enum: ['Residuos', 'Agua', 'Aire', 'Fauna', 'Flora', 'Ruido', 'Otro'] },
            subcategoria: { type: 'string', example: 'Basura acumulada' },
            ubicacion: { type: 'string', example: 'Parque Central, Garzón' },
            latitud: { type: 'number', example: 2.1969 },
            longitud: { type: 'number', example: -75.6269 },
            estado: {
              type: 'string',
              enum: ['Pendiente de moderación', 'Pendiente', 'En revisión', 'En proceso', 'Solucionado', 'Rechazado']
            },
            esAnonimo: { type: 'boolean', example: false },
            creadoPor: { type: 'string', example: '68d1a2b3c4d5e6f7a8b9c0d1' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Comentario: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            reporte: { type: 'string' },
            autor: { type: 'string' },
            texto: { type: 'string', example: 'Ya estamos trabajando en esto' },
            tipo: { type: 'string', enum: ['publico', 'interno'] },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Notificacion: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            usuario: { type: 'string' },
            tipo: {
              type: 'string',
              enum: ['cambio_estado', 'moderacion_aprobado', 'moderacion_rechazado', 'nuevo_comentario']
            },
            titulo: { type: 'string' },
            mensaje: { type: 'string' },
            leida: { type: 'boolean', example: false },
            emailEnviado: { type: 'boolean', example: true }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Mensaje de error' }
          }
        }
      }
    },
    tags: [
      { name: 'Auth', description: 'Autenticación y registro' },
      { name: 'Perfil', description: 'Autogestión del usuario' },
      { name: 'Reportes', description: 'CRUD de reportes ambientales' },
      { name: 'Comentarios', description: 'Comentarios en reportes' },
      { name: 'Evidencias', description: 'Fotos y videos' },
      { name: 'Usuarios', description: 'Gestión de usuarios (admin)' },
      { name: 'Estadísticas', description: 'Estadísticas del sistema' },
      { name: 'Notificaciones', description: 'Notificaciones del usuario' },
      { name: 'Auditoría', description: 'Logs de actividad (admin)' }
    ]
  },
  apis: ['./routes/*.js']
};

module.exports = swaggerJsdoc(options);