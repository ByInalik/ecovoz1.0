// backend/middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. Asegurar que la carpeta uploads exista
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Configurar dónde y cómo guardar los archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Nombre único: evidencia-<timestamp>-<random>.<ext>
    const ext = path.extname(file.originalname).toLowerCase();
    const nombreUnico = `evidencia-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, nombreUnico);
  }
});

// 3. Validar formatos permitidos
const fileFilter = (req, file, cb) => {
  const formatosPermitidos = [
    'image/jpeg', 'image/jpg', 'image/png',  // Imágenes
    'video/mp4', 'video/quicktime'           // Videos
  ];

  if (formatosPermitidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato no permitido. Use JPG, PNG o MP4'), false);
  }
};

// 4. Configurar multer con límites del SRS
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50 MB máximo (el SRS pide 10 MB fotos y 50 MB videos, validamos por separado en la ruta)
  }
});

module.exports = upload;