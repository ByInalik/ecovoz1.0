// backend/utils/generarPDF.js
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Genera un PDF con toda la información de un reporte.
 * @param {Object} reporte - Documento del reporte (populate creadoPor)
 * @param {Array} historial - Array de cambios de estado
 * @param {Array} evidencias - Array de evidencias (fotos/videos)
 * @param {Object} usuario - Usuario que solicita el PDF
 * @returns {PDFDocument} - Stream del PDF
 */
function generarPDFReporte(reporte, historial = [], evidencias = []) {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    info: {
      Title: `EcoVoz - Reporte ${reporte._id}`,
      Author: 'EcoVoz',
      Subject: 'Reporte Ambiental',
      Creator: 'EcoVoz API'
    }
  });

  // ============================================
  // 🎨 Colores y estilos
  // ============================================
  const COLOR_VERDE = '#16a34a';
  const COLOR_GRIS = '#64748b';
  const COLOR_NEGRO = '#0f172a';
  const COLOR_GRIS_CLARO = '#f1f5f9';

  // ============================================
  // 🏷️ ENCABEZADO
  // ============================================
  doc
    .fillColor(COLOR_VERDE)
    .fontSize(24)
    .font('Helvetica-Bold')
    .text('🌱 EcoVoz', 50, 50);

  doc
    .fillColor(COLOR_NEGRO)
    .fontSize(14)
    .font('Helvetica')
    .text('Reporte Ambiental', 50, 80);

  // Código y fecha (alineado a la derecha)
  doc
    .fillColor(COLOR_GRIS)
    .fontSize(9)
    .text(`Código: ${reporte._id}`, 350, 55, { width: 200, align: 'right' })
    .text(`Generado: ${new Date().toLocaleString('es-CO')}`, 350, 70, { width: 200, align: 'right' });

  // Línea divisoria
  doc
    .strokeColor(COLOR_VERDE)
    .lineWidth(2)
    .moveTo(50, 105)
    .lineTo(545, 105)
    .stroke();

  // ============================================
  // 📋 DATOS PRINCIPALES
  // ============================================
  let y = 125;

  doc
    .fillColor(COLOR_VERDE)
    .fontSize(11)
    .font('Helvetica-Bold')
    .text('INFORMACIÓN DEL REPORTE', 50, y);

  y += 20;

  // Función auxiliar para filas etiqueta-valor
  const escribirCampo = (etiqueta, valor) => {
    doc
      .fillColor(COLOR_GRIS)
      .fontSize(9)
      .font('Helvetica-Bold')
      .text(etiqueta, 50, y, { width: 120 });
    
    doc
      .fillColor(COLOR_NEGRO)
      .fontSize(10)
      .font('Helvetica')
      .text(valor || 'N/A', 170, y, { width: 375 });
    
    y = doc.y + 5;
  };

  escribirCampo('Título:', reporte.titulo);
  escribirCampo('Categoría:', `${reporte.categoria}${reporte.subcategoria ? ' / ' + reporte.subcategoria : ''}`);
  escribirCampo('Estado:', reporte.estado);
  escribirCampo('Ubicación:', reporte.ubicacion);
  escribirCampo('Coordenadas:', `${reporte.latitud}, ${reporte.longitud}`);
  
  const autor = reporte.esAnonimo
    ? 'Anónimo'
    : (reporte.creadoPor?.nombre || 'Usuario eliminado');
  escribirCampo('Reportado por:', autor);

  escribirCampo('Fecha del reporte:', new Date(reporte.createdAt).toLocaleString('es-CO'));

  // ============================================
  // 📝 DESCRIPCIÓN
  // ============================================
  y += 10;

  doc
    .fillColor(COLOR_VERDE)
    .fontSize(11)
    .font('Helvetica-Bold')
    .text('DESCRIPCIÓN', 50, y);

  y += 20;

  // Fondo gris claro
  const alturaDescripcion = Math.max(60, doc.heightOfString(reporte.descripcion, { width: 495 }) + 20);
  doc
    .rect(50, y, 495, alturaDescripcion)
    .fillColor(COLOR_GRIS_CLARO)
    .fill();

  doc
    .fillColor(COLOR_NEGRO)
    .fontSize(10)
    .font('Helvetica')
    .text(reporte.descripcion, 60, y + 10, { width: 475 });

  y += alturaDescripcion + 20;

  // ============================================
  // 📊 HISTORIAL DE ESTADOS
  // ============================================
  // Verificar si cabe en la página actual
  if (y > 650) {
    doc.addPage();
    y = 50;
  }

  doc
    .fillColor(COLOR_VERDE)
    .fontSize(11)
    .font('Helvetica-Bold')
    .text('HISTORIAL DE ESTADOS', 50, y);

  y += 20;

  if (historial.length === 0) {
    doc
      .fillColor(COLOR_GRIS)
      .fontSize(10)
      .font('Helvetica-Oblique')
      .text('Sin cambios de estado registrados.', 50, y);
    y += 20;
  } else {
    // Encabezado de tabla
    doc
      .rect(50, y, 495, 18)
      .fillColor(COLOR_VERDE)
      .fill();

    doc
      .fillColor('#ffffff')
      .fontSize(9)
      .font('Helvetica-Bold')
      .text('Fecha', 55, y + 5, { width: 100 })
      .text('Estado anterior', 160, y + 5, { width: 110 })
      .text('Estado nuevo', 275, y + 5, { width: 110 })
      .text('Por', 390, y + 5, { width: 150 });

    y += 18;

    historial.forEach((h, i) => {
      // Salto de página si es necesario
      if (y > 750) {
        doc.addPage();
        y = 50;
      }

      // Fondo alternado
      if (i % 2 === 0) {
        doc
          .rect(50, y, 495, 20)
          .fillColor('#f8fafc')
          .fill();
      }

      doc
        .fillColor(COLOR_NEGRO)
        .fontSize(8)
        .font('Helvetica')
        .text(new Date(h.fechaCambio).toLocaleDateString('es-CO'), 55, y + 5, { width: 100 })
        .text(h.estadoAnterior, 160, y + 5, { width: 110 })
        .text(h.estadoNuevo, 275, y + 5, { width: 110 })
        .text(h.cambiadoPor?.nombre || 'Sistema', 390, y + 5, { width: 150 });

      y += 20;
    });
  }

  y += 15;

  // ============================================
  // 📎 EVIDENCIAS (FOTOS)
  // ============================================
  const fotos = evidencias.filter(e => e.tipo === 'Imagen');

  if (fotos.length > 0) {
    // Salto de página si no caben
    if (y > 600) {
      doc.addPage();
      y = 50;
    }

    doc
      .fillColor(COLOR_VERDE)
      .fontSize(11)
      .font('Helvetica-Bold')
      .text(`EVIDENCIAS (${fotos.length} foto${fotos.length > 1 ? 's' : ''})`, 50, y);

    y += 20;

    let fotosEnFila = 0;
    const anchoImagen = 240;
    const altoImagen = 180;
    let xImagen = 50;

    for (const foto of fotos) {
      // Ruta física del archivo
      const rutaFisica = path.join(__dirname, '..', foto.url);
      
      if (!fs.existsSync(rutaFisica)) {
        continue; // saltar si no existe la imagen
      }

      // Salto de página si es necesario
      if (y + altoImagen > 750) {
        doc.addPage();
        y = 50;
        xImagen = 50;
        fotosEnFila = 0;
      }

      try {
        doc.image(rutaFisica, xImagen, y, {
          fit: [anchoImagen, altoImagen],
          align: 'center'
        });

        // Nombre del archivo debajo
        doc
          .fillColor(COLOR_GRIS)
          .fontSize(7)
          .font('Helvetica')
          .text(foto.nombreOriginal || 'Foto', xImagen, y + altoImagen + 2, {
            width: anchoImagen,
            align: 'center'
          });
      } catch (err) {
        // Si falla la imagen (formato raro, corrupta), solo escribe el nombre
        doc
          .fillColor(COLOR_GRIS)
          .fontSize(8)
          .text(`[Imagen no disponible: ${foto.nombreOriginal}]`, xImagen, y, {
            width: anchoImagen
          });
      }

      fotosEnFila++;
      if (fotosEnFila === 2) {
        // Segunda foto en la misma fila
        xImagen = 50;
        y += altoImagen + 20;
        fotosEnFila = 0;
      } else {
        // Primera foto, mover a la derecha
        xImagen = 305;
      }
    }

    // Ajustar y al final
    if (fotosEnFila > 0) {
      y += altoImagen + 20;
    }
  }

  // ============================================
  // 📄 PIE DE PÁGINA
  // ============================================
  const paginas = doc.bufferedPageRange();
  
  // Agregar pie a todas las páginas
  for (let i = 0; i < paginas.count; i++) {
    doc.switchToPage(i);
    doc
      .fillColor(COLOR_GRIS)
      .fontSize(8)
      .font('Helvetica')
      .text(
        `EcoVoz - Sistema de Reportes Ambientales | Página ${i + 1} de ${paginas.count}`,
        50,
        800,
        { width: 495, align: 'center' }
      );
  }

  doc.end();
  return doc;
}

module.exports = { generarPDFReporte };