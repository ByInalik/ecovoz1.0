// backend/middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. Asegurar que la carpeta uploads exista
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Configuración de multer (guarda temporalmente con nombre único)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const nombreUnico = `evidencia-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, nombreUnico);
  }
});

// 3. Validar formatos permitidos
const fileFilter = (req, file, cb) => {
  const formatosPermitidos = [
    'image/jpeg', 'image/jpg', 'image/png',
    'video/mp4', 'video/quicktime'
  ];

  if (formatosPermitidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato no permitido. Use JPG, PNG o MP4'), false);
  }
};

// 4. Configurar multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50 MB máximo
  }
});

// 5. Middleware para comprimir imágenes después de subirlas
async function comprimirImagen(req, res, next) {
  // Solo comprimir si es una imagen
  if (!req.file || !req.file.mimetype.startsWith('image/')) {
    return next(); // si es video, no se comprime
  }

  try {
    const sharp = require('sharp');
    const rutaOriginal = req.file.path;
    const stat = fs.statSync(rutaOriginal);
    const tamañoOriginalMB = stat.size / (1024 * 1024);

    // Obtener metadatos de la imagen
    const metadata = await sharp(rutaOriginal).metadata();
    const anchoOriginal = metadata.width;
    const altoOriginal = metadata.height;

    console.log(`📸 Imagen original: ${anchoOriginal}x${altoOriginal} (${tamañoOriginalMB.toFixed(2)} MB)`);

    // Determinar si hay que comprimir
    const necesitaComprimir = tamañoOriginalMB > 2;
    const necesitaRedimensionar = anchoOriginal > 1920;

    if (!necesitaComprimir && !necesitaRedimensionar) {
      console.log('✅ Imagen ya es pequeña, se conserva original');
      return next();
    }

    // Preparar el pipeline de sharp
    let pipeline = sharp(rutaOriginal);

    // Redimensionar si es necesario
    if (necesitaRedimensionar) {
      pipeline = pipeline.resize(1920, null, {
        withoutEnlargement: true, // no agrandar si es más pequeña
        fit: 'inside'
      });
    }

    // Comprimir según el formato
    if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
      pipeline = pipeline.jpeg({ quality: 80, progressive: true, mozjpeg: true });
    } else if (metadata.format === 'png') {
      pipeline = pipeline.png({ quality: 80, compressionLevel: 8 });
    }

    // Guardar como archivo temporal comprimido
    const rutaComprimida = `${rutaOriginal}.compressed`;
    await pipeline.toFile(rutaComprimida);

    // Reemplazar el archivo original por el comprimido
    fs.unlinkSync(rutaOriginal);
    fs.renameSync(rutaComprimida, rutaOriginal);

    // Actualizar el tamaño en req.file
    const statComprimido = fs.statSync(rutaOriginal);
    const tamañoFinalMB = statComprimido.size / (1024 * 1024);

    req.file.size = statComprimido.size;

    const nuevoMetadata = await sharp(rutaOriginal).metadata();
    console.log(`✅ Imagen comprimida: ${nuevoMetadata.width}x${nuevoMetadata.height} (${tamañoFinalMB.toFixed(2)} MB) — reducción: ${((1 - statComprimido.size / stat.size) * 100).toFixed(1)}%`);

    next();
  } catch (err) {
    console.error('❌ Error comprimiendo imagen:', err.message);
    // No fallar la subida si la compresión falla
    next();
  }
}

module.exports = upload;
module.exports.comprimirImagen = comprimirImagen;