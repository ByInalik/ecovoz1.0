// backend/middleware/admin.js

function verificarAdmin(req, res, next) {
    // verificarToken debe ejecutarse primero — req.usuario ya tiene el rol
    if (!req.usuario) {
      return res.status(401).json({ error: 'Sin autenticación' });
    }
  
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado — se requiere rol admin' });
    }
  
    next();
  }
  
  module.exports = verificarAdmin;