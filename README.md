```markdown
# EcoVoz - Backend API

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-12.x-F69220?logo=pnpm&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203.0-85EA2D?logo=swagger&logoColor=black)
![License](https://img.shields.io/badge/License-ISC-blue)

API REST completa para **EcoVoz**, plataforma colaborativa de reportes ambientales para el municipio de Garzón, Huila (Colombia). Permite a los ciudadanos reportar incidentes ambientales, a los funcionarios gestionarlos y a los administradores supervisar todo el sistema.

---

## 📋 Tabla de contenido

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Variables de entorno](#-variables-de-entorno)
- [Scripts disponibles](#-scripts-disponibles)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Roles del sistema](#-roles-del-sistema)
- [Endpoints principales](#-endpoints-principales)
- [Documentación Swagger](#-documentación-swagger)
- [Ejemplos de uso](#-ejemplos-de-uso)
- [Trabajo futuro](#-trabajo-futuro)
- [Autores](#-autores)

---

## ✨ Características

- 🔐 **Autenticación JWT** con 3 roles: ciudadano, funcionario y admin
- 📝 **Gestión completa de reportes** ambientales
- 📍 **Validación geográfica** (solo dentro de Garzón, radio 5 km)
- 🛡️ **Moderación** de reportes antes de publicación
- 📷 **Evidencias** (hasta 5 fotos o 1 video por reporte)
- 🗜️ **Compresión automática** de imágenes grandes
- 💬 **Comentarios** públicos e internos
- 📊 **Estadísticas** en tiempo real
- 📄 **Exportación a PDF** con logo institucional
- 📧 **Notificaciones automáticas por email** (3 disparadores)
- 🔑 **Recuperación de contraseña** por email
- 🔍 **Filtros avanzados** (categoría, estado, fecha, texto)
- 📋 **Auditoría completa** de todas las acciones
- 🗑️ **Soft delete** con anonimización de datos
- 📚 **Documentación Swagger/OpenAPI 3.0** de todos los endpoints

---

## 🛠 Tecnologías

| Componente | Tecnología |
|---|---|
| **Runtime** | Node.js 18+ |
| **Framework** | Express 5.x |
| **Base de datos** | MongoDB Atlas (Mongoose 9.x) |
| **Autenticación** | JWT + bcryptjs |
| **Emails** | Nodemailer + Gmail SMTP |
| **PDF** | PDFKit |
| **Imágenes** | Sharp (compresión) + Multer (upload) |
| **Documentación** | Swagger UI + swagger-jsdoc |
| **Gestor de paquetes** | pnpm |

---

## 📦 Requisitos previos

- **Node.js** 18 o superior
- **pnpm** 8 o superior
- Cuenta de **MongoDB Atlas** (o MongoDB local)
- Cuenta de **Gmail** con contraseña de aplicación (para notificaciones)

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/ByInalik/ecovoz1.0.git
cd ecovoz1.0/backend
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en `backend/` con las variables que se listan en la sección de abajo.

### 4. Arrancar el servidor

```bash
pnpm dev
```

El servidor estará disponible en `http://localhost:3000` y la documentación en `http://localhost:3000/api-docs`.

---

## 🔐 Variables de entorno

Crea el archivo `backend/.env` con estas variables:

```env
# Servidor
PORT=3000

# Base de datos
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/ecovoz

# Autenticación
JWT_SECRET=tu_secreto_jwt_largo_y_aleatorio
ADMIN_SECRET=tu_secreto_admin
FUNCIONARIO_SECRET=tu_secreto_funcionario

# SMTP (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_correo@gmail.com
SMTP_PASS=tu_app_password_de_16_caracteres
SMTP_FROM_NAME=EcoVoz
SMTP_FROM_EMAIL=tu_correo@gmail.com

# URL del frontend (para enlaces en emails)
FRONTEND_URL=http://localhost:5173
```

> ⚠️ **Importante:** el archivo `.env` **NUNCA** debe subirse a Git. Ya está en `.gitignore`.

---

## 📜 Scripts disponibles

| Comando | Descripción |
|---|---|
| `pnpm dev` | Arranca el servidor en modo desarrollo (nodemon) |
| `pnpm start` | Arranca el servidor en modo producción |

---

## 📁 Estructura del proyecto

```
backend/
├── config/
│   └── swagger.js            # Configuración de Swagger/OpenAPI
├── middleware/
│   ├── admin.js              # Verificar rol admin
│   ├── auth.js               # Verificar JWT
│   ├── auditoria.js          # Middleware de auditoría
│   ├── funcionario.js        # Verificar rol funcionario/admin
│   └── upload.js             # Multer + compresión con sharp
├── models/
│   ├── Comentario.js         # Comentarios en reportes
│   ├── EstadoReporte.js      # Historial de cambios de estado
│   ├── Evidencia.js          # Fotos/videos de reportes
│   ├── LogActividad.js       # Logs de auditoría
│   ├── Notificacion.js       # Notificaciones a usuarios
│   ├── Reporte.js            # Reportes ambientales
│   └── Usuario.js            # Usuarios del sistema
├── routes/
│   ├── auth.js               # Registro, login, reset password
│   ├── auditoria.js          # Ver logs (admin)
│   ├── estadisticas.js       # Estadísticas
│   ├── notificaciones.js     # Notificaciones
│   ├── perfil.js             # Autogestión del usuario
│   ├── reporte.js            # CRUD de reportes
│   └── usuarios.js           # Gestión de usuarios (admin)
├── utils/
│   ├── emailService.js       # Envío de emails con templates HTML
│   ├── generarPDF.js         # Generación de PDFs con PDFKit
│   ├── notificaciones.js     # Helper de notificaciones
│   └── validarUbicacion.js   # Validación geográfica (Haversine)
├── assets/
│   └── logo.png              # Logo de EcoVoz
├── uploads/                  # Archivos subidos (gitignored)
├── .env                      # Variables de entorno (gitignored)
├── .gitignore
├── package.json
├── pnpm-lock.yaml
└── server.js                 # Punto de entrada
```

---

## 👥 Roles del sistema

| Rol | Permisos |
|---|---|
| **Ciudadano** | Crear reportes, comentar, ver sus notificaciones, gestionar su perfil |
| **Funcionario** | Todo lo anterior + moderar reportes, cambiar estados, ver estadísticas |
| **Admin** | Todo lo anterior + gestión de usuarios, ver auditoría, eliminar reportes |

---

## 🔌 Endpoints principales

### 🔐 Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| POST | `/registro` | Registro de ciudadano | Público |
| POST | `/registro-funcionario` | Registro de funcionario | Requiere secret |
| POST | `/registro-admin` | Registro de admin | Requiere secret |
| POST | `/login` | Iniciar sesión | Público |
| POST | `/olvide-password` | Solicitar reset de contraseña | Público |
| POST | `/reset-password/:token` | Restablecer contraseña | Público |

### 👤 Perfil (`/api/perfil`)

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/` | Ver mi perfil | Autenticado |
| DELETE | `/` | Eliminar mi cuenta | Autenticado |

### 📝 Reportes (`/api/reportes`)

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/` | Listar reportes (filtros + paginación) | Público |
| GET | `/:id` | Ver reporte | Público |
| POST | `/` | Crear reporte | Autenticado |
| PUT | `/:id/moderar` | Aprobar/rechazar | Funcionario/Admin |
| PUT | `/:id/estado` | Cambiar estado | Funcionario/Admin |
| PUT | `/:id` | Actualizar todo | Admin |
| DELETE | `/:id` | Eliminar reporte | Admin |
| GET | `/:id/historial` | Historial de cambios | Público |
| GET | `/:id/pdf` | Exportar a PDF | Autor/Staff |

### 💬 Comentarios

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/api/reportes/:id/comentarios` | Ver comentarios | Autenticado |
| POST | `/api/reportes/:id/comentarios` | Añadir comentario | Autenticado |
| DELETE | `/api/reportes/:idReporte/comentarios/:idComentario` | Eliminar | Autor/Admin |

### 📷 Evidencias

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/api/reportes/:id/evidencias` | Ver evidencias | Público |
| POST | `/api/reportes/:id/evidencias` | Subir foto/video | Autenticado |
| DELETE | `/api/reportes/:idReporte/evidencias/:idEvidencia` | Eliminar | Autor/Admin |

### 📊 Estadísticas (`/api/estadisticas`)

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/resumen` | Resumen general | Funcionario/Admin |
| GET | `/por-categoria` | Reportes por categoría | Funcionario/Admin |
| GET | `/por-estado` | Reportes por estado | Funcionario/Admin |
| GET | `/por-mes` | Reportes por mes | Funcionario/Admin |
| GET | `/por-zona` | Top 10 zonas | Funcionario/Admin |

### 👥 Usuarios (`/api/usuarios`)

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/` | Listar usuarios | Admin |
| GET | `/:id` | Ver usuario | Admin |
| PUT | `/:id/rol` | Cambiar rol | Admin |
| PUT | `/:id/estado` | Activar/desactivar | Admin |
| DELETE | `/:id` | Eliminar usuario | Admin |

### 🔔 Notificaciones (`/api/notificaciones`)

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/` | Mis notificaciones | Autenticado |
| GET | `/no-leidas/count` | Contar no leídas | Autenticado |
| PUT | `/:id/leer` | Marcar como leída | Autenticado |
| PUT | `/leer-todas` | Marcar todas como leídas | Autenticado |
| DELETE | `/:id` | Eliminar notificación | Autenticado |

### 📋 Auditoría (`/api/auditoria`)

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/` | Listar logs | Admin |
| GET | `/usuario/:id` | Logs de un usuario | Admin |
| GET | `/resumen` | Resumen de actividad | Admin |
| DELETE | `/limpiar` | Limpiar logs antiguos | Admin |

---

## 📚 Documentación Swagger

Una vez arrancado el servidor, accede a:

**http://localhost:3000/api-docs**

Desde ahí podrás:
- Ver todos los **41 endpoints** documentados
- Probar cada endpoint directamente desde el navegador
- Autenticarte con el botón **Authorize** (JWT Bearer)
- Ver esquemas de datos y ejemplos de request/response

---

## 💡 Ejemplos de uso

### Registro de ciudadano

```bash
curl -X POST http://localhost:3000/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "password": "mipassword123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "mipassword123"
  }'
```

### Crear reporte (con token)

```bash
curl -X POST http://localhost:3000/api/reportes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{
    "titulo": "Basura en el parque",
    "descripcion": "Residuos acumulados",
    "categoria": "Residuos",
    "ubicacion": "Parque Central, Garzón",
    "latitud": 2.1969,
    "longitud": -75.6269
  }'
```

### Listar reportes con filtros

```bash
curl "http://localhost:3000/api/reportes?categoria=Residuos&estado=Pendiente&page=1&limit=10"
```

---

## 🚧 Trabajo futuro

Los siguientes RF quedan documentados como **trabajo futuro** (para la fase de frontend o mejoras):

| RF | Descripción | Razón |
|---|---|---|
| RF-004 | Visualización en mapa interactivo | Requiere frontend |
| RF-009 | Actualizaciones en tiempo real (WebSockets) | Feature avanzada |
| RF-011 | Reportes recurrentes/programados | Baja prioridad |
| RF-012 | Sistema avanzado de categorías y etiquetas | Extensión |
| RF-014 | Notificaciones geográficas | Extensión de RF-007 |
| RF-023 | Alertas de incidentes críticos | Extensión de RF-007 |
| RF-024 | Compartir reportes en redes sociales | Opcional |

---

## Autores

- **Michael Ferman Hernández Bermúdez** — [hernandezmaicol106@gmail.com](mailto:hernandezmaicol106@gmail.com)
- **Andrés Steven López Scarpetta** — [al7222820@gmail.com](mailto:al7222820@gmail.com)

**Programa:** Análisis y Desarrollo de Software (ADSO)
**Ficha:** 3229944
**Centro:** Centro Agroempresarial y Desarrollo Pecuario del Huila
**Instructor:** Julián Andrés Trujillo

---

## 📄 Licencia

ISC © 2026 EcoVoz - Proyecto académico SENA
```

---

## 🎯 Pasos a seguir

### 1️⃣ Abre `README.md` en VS Code

`C:\Users\Inalik\Ecovoz1.0\README.md`

### 2️⃣ Selecciona TODO el contenido actual

`Ctrl + A`

### 3️⃣ Bórralo

`Delete` o `Backspace`

### 4️⃣ Pega el contenido completo de arriba

`Ctrl + V`

### 5️⃣ Guarda

`Ctrl + S`

### 6️⃣ Vista previa

`Ctrl + Shift + V` → verás el README completo con badges, tablas y secciones. 🎨

### 7️⃣ Commit + push

```powershell
cd C:\Users\Inalik\Ecovoz1.0
git add README.md
git commit -m "docs: Completar README con todas las secciones"
git push origin master
```

---

## ✅ Verificación rápida

Después de pegar, con `Ctrl+F` busca estas palabras clave:

| Buscar | Debe aparecer |
|---|---|
| `## Autores` | ✅ |
| `## Licencia` | ✅ |
| `## Trabajo futuro` | ✅ |
| `## Documentación Swagger` | ✅ |
