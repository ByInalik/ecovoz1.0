// backend/utils/emailService.js
const nodemailer = require('nodemailer');

// ============================================
// Configurar transporter SMTP
// ============================================
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true para 465, false para 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verificar conexión al arrancar (opcional, solo informativo)
transporter.verify()
  .then(() => console.log('📧 SMTP listo para enviar emails'))
  .catch(err => console.error('❌ Error SMTP:', err.message));

// ============================================
// Plantilla base HTML
// ============================================
function templateBase({ titulo, contenido }) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${titulo}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f1f5f9; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          
          <!-- Encabezado -->
          <tr>
            <td style="background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 1px;">
                🌱 EcoVoz
              </h1>
              <p style="color: #dcfce7; margin: 8px 0 0 0; font-size: 13px;">
                Sistema de Reportes Ambientales
              </p>
            </td>
          </tr>

          <!-- Contenido -->
          <tr>
            <td style="padding: 40px 30px;">
              ${contenido}
            </td>
          </tr>

          <!-- Pie -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 12px; margin: 0;">
                Este correo fue enviado automáticamente por EcoVoz.<br>
                Por favor, no responder a este mensaje.
              </p>
              <p style="color: #94a3b8; font-size: 11px; margin: 12px 0 0 0;">
                © ${new Date().getFullYear()} EcoVoz - Garzón, Huila
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// ============================================
// Templates específicos por tipo
// ============================================

function templateCambioEstado({ nombreUsuario, reporte, estadoAnterior, estadoNuevo, comentario }) {
  const coloresEstado = {
    'Pendiente': '#f59e0b',
    'En revisión': '#8b5cf6',
    'En proceso': '#3b82f6',
    'Solucionado': '#16a34a',
    'Rechazado': '#ef4444'
  };

  const contenido = `
    <h2 style="color: #0f172a; margin: 0 0 20px 0; font-size: 20px;">
      Hola ${nombreUsuario} 👋
    </h2>
    <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
      Tu reporte ha cambiado de estado:
    </p>

    <!-- Tarjeta del reporte -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
      <tr>
        <td>
          <p style="color: #16a34a; font-size: 12px; font-weight: bold; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">
            Reporte
          </p>
          <p style="color: #0f172a; font-size: 16px; font-weight: bold; margin: 0 0 15px 0;">
            ${reporte.titulo}
          </p>
          <p style="color: #64748b; font-size: 12px; margin: 0 0 5px 0;">
            <strong>Ubicación:</strong> ${reporte.ubicacion}
          </p>
          <p style="color: #64748b; font-size: 12px; margin: 0;">
            <strong>Código:</strong> ${reporte._id}
          </p>
        </td>
      </tr>
    </table>

    <!-- Cambio de estado -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 20px;">
      <tr>
        <td align="center" width="45%">
          <div style="background-color: ${coloresEstado[estadoAnterior] || '#94a3b8'}; color: #fff; padding: 12px; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-size: 11px; opacity: 0.9;">ANTES</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; font-weight: bold;">${estadoAnterior}</p>
          </div>
        </td>
        <td align="center" width="10%" style="font-size: 24px; color: #16a34a;">→</td>
        <td align="center" width="45%">
          <div style="background-color: ${coloresEstado[estadoNuevo] || '#16a34a'}; color: #fff; padding: 12px; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-size: 11px; opacity: 0.9;">AHORA</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; font-weight: bold;">${estadoNuevo}</p>
          </div>
        </td>
      </tr>
    </table>

    ${comentario ? `
    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
      <p style="color: #92400e; font-size: 12px; font-weight: bold; margin: 0 0 5px 0;">📝 Comentario del funcionario:</p>
      <p style="color: #78350f; font-size: 13px; margin: 0; font-style: italic;">"${comentario}"</p>
    </div>
    ` : ''}

    <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
      Puedes ver más detalles ingresando a tu cuenta en <strong>EcoVoz</strong>.
    </p>
  `;

  return templateBase({
    titulo: `Reporte ${estadoNuevo} - EcoVoz`,
    contenido
  });
}

function templateModeracion({ nombreUsuario, reporte, decision, motivo }) {
  const aprobado = decision === 'aprobar';

  const contenido = `
    <h2 style="color: #0f172a; margin: 0 0 20px 0; font-size: 20px;">
      Hola ${nombreUsuario} 👋
    </h2>

    <div style="text-align: center; margin-bottom: 25px;">
      <div style="display: inline-block; background-color: ${aprobado ? '#dcfce7' : '#fee2e2'}; border-radius: 50%; padding: 20px; width: 60px; height: 60px; line-height: 60px;">
        <span style="font-size: 30px;">${aprobado ? '✅' : '❌'}</span>
      </div>
    </div>

    <h3 style="color: ${aprobado ? '#16a34a' : '#dc2626'}; text-align: center; margin: 0 0 20px 0; font-size: 18px;">
      ${aprobado ? '¡Tu reporte fue aprobado!' : 'Tu reporte fue rechazado'}
    </h3>

    <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0; text-align: center;">
      ${aprobado
        ? 'Tu reporte ya es visible al público y será atendido por las autoridades competentes.'
        : 'Lamentablemente tu reporte no cumplió con los criterios de publicación.'}
    </p>

    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
      <tr>
        <td>
          <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0;">
            <strong>Título:</strong>
          </p>
          <p style="color: #0f172a; font-size: 14px; margin: 0 0 15px 0;">
            ${reporte.titulo}
          </p>
          <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0;">
            <strong>Código:</strong>
          </p>
          <p style="color: #0f172a; font-size: 12px; margin: 0; word-break: break-all;">
            ${reporte._id}
          </p>
        </td>
      </tr>
    </table>

    ${!aprobado && motivo ? `
    <div style="background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
      <p style="color: #991b1b; font-size: 12px; font-weight: bold; margin: 0 0 5px 0;">Motivo del rechazo:</p>
      <p style="color: #7f1d1d; font-size: 13px; margin: 0;">${motivo}</p>
    </div>
    ` : ''}
  `;

  return templateBase({
    titulo: aprobado ? 'Reporte aprobado - EcoVoz' : 'Reporte rechazado - EcoVoz',
    contenido
  });
}

function templateNuevoComentario({ nombreUsuario, reporte, autorComentario, textoComentario }) {
  const contenido = `
    <h2 style="color: #0f172a; margin: 0 0 20px 0; font-size: 20px;">
      Hola ${nombreUsuario} 👋
    </h2>
    <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
      Hay un nuevo comentario en tu reporte:
    </p>

    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
      <tr>
        <td>
          <p style="color: #16a34a; font-size: 12px; font-weight: bold; margin: 0 0 8px 0;">
            ${reporte.titulo}
          </p>
          <p style="color: #64748b; font-size: 12px; margin: 0;">
            Reporte #${reporte._id}
          </p>
        </td>
      </tr>
    </table>

    <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
      <p style="color: #1e40af; font-size: 12px; font-weight: bold; margin: 0 0 5px 0;">
        💬 ${autorComentario} comentó:
      </p>
      <p style="color: #1e3a8a; font-size: 13px; margin: 0; font-style: italic;">"${textoComentario}"</p>
    </div>

    <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
      Puedes responder desde tu cuenta en <strong>EcoVoz</strong>.
    </p>
  `;

  return templateBase({
    titulo: 'Nuevo comentario en tu reporte - EcoVoz',
    contenido
  });
}

// ============================================
// Función principal para enviar email
// ============================================
async function enviarEmail({ to, subject, html }) {
  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
    to,
    subject,
    html
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}

// ============================================
// Funciones específicas por tipo de evento
// ============================================

async function enviarEmailCambioEstado({ usuario, reporte, estadoAnterior, estadoNuevo, comentario }) {
  const html = templateCambioEstado({
    nombreUsuario: usuario.nombre,
    reporte,
    estadoAnterior,
    estadoNuevo,
    comentario
  });

  return enviarEmail({
    to: usuario.email,
    subject: `🔄 Tu reporte "${reporte.titulo}" cambió a "${estadoNuevo}"`,
    html
  });
}

async function enviarEmailModeracion({ usuario, reporte, decision, motivo }) {
  const html = templateModeracion({
    nombreUsuario: usuario.nombre,
    reporte,
    decision,
    motivo
  });

  const subject = decision === 'aprobar'
    ? `✅ Tu reporte "${reporte.titulo}" fue aprobado`
    : `❌ Tu reporte "${reporte.titulo}" fue rechazado`;

  return enviarEmail({
    to: usuario.email,
    subject,
    html
  });
}

async function enviarEmailNuevoComentario({ usuario, reporte, autorComentario, textoComentario }) {
  const html = templateNuevoComentario({
    nombreUsuario: usuario.nombre,
    reporte,
    autorComentario,
    textoComentario
  });

  return enviarEmail({
    to: usuario.email,
    subject: `💬 Nuevo comentario en tu reporte "${reporte.titulo}"`,
    html
  });
}

// ============================================
// Template: Restablecer contraseña (RF-015)
// ============================================
function templateResetPassword({ nombreUsuario, enlaceReset }) {
  const contenido = `
    <h2 style="color: #0f172a; margin: 0 0 20px 0; font-size: 20px;">
      Hola ${nombreUsuario} 👋
    </h2>
    <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
      Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>EcoVoz</strong>.
    </p>
    <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 25px 0;">
      Si fuiste tú, haz clic en el siguiente botón para crear una nueva contraseña:
    </p>

    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 25px;">
      <tr>
        <td align="center">
          <a href="${enlaceReset}" style="display: inline-block; background-color: #16a34a; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-weight: bold; font-size: 15px;">
            Restablecer contraseña
          </a>
        </td>
      </tr>
    </table>

    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
      <p style="color: #92400e; font-size: 13px; margin: 0;">
        ⏱️ <strong>Este enlace expira en 1 hora.</strong>
      </p>
    </div>

    <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin: 0 0 10px 0;">
      Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña no cambiará.
    </p>

    <p style="color: #94a3b8; font-size: 11px; margin: 20px 0 0 0; word-break: break-all;">
      Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
      <span style="color: #16a34a;">${enlaceReset}</span>
    </p>
  `;

  return templateBase({
    titulo: 'Restablecer contraseña - EcoVoz',
    contenido
  });
}

// ============================================
// Función: Enviar email de reset password
// ============================================
async function enviarEmailResetPassword({ usuario, token }) {
  // URL base del frontend (o backend para tests)
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const enlaceReset = `${baseUrl}/reset-password?token=${token}`;

  const html = templateResetPassword({
    nombreUsuario: usuario.nombre,
    enlaceReset
  });

  return enviarEmail({
    to: usuario.email,
    subject: '🔑 Restablecer tu contraseña - EcoVoz',
    html
  });
}

module.exports = {
  enviarEmail,
  enviarEmailCambioEstado,
  enviarEmailModeracion,
  enviarEmailNuevoComentario,
  enviarEmailResetPassword,       
  templates: {
    templateCambioEstado,
    templateModeracion,
    templateNuevoComentario,
    templateResetPassword
  }
};