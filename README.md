# 🌱 EcoVoz - Backend

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-12.x-F69220?logo=pnpm&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue)

API REST para la plataforma **EcoVoz**, un sistema colaborativo de reportes ambientales para el municipio de Garzón, Huila (Colombia). Permite a los ciudadanos reportar incidentes ambientales, a los funcionarios gestionarlos y a los administradores supervisar todo el sistema.

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
- [Ejemplos de uso](#-ejemplos-de-uso)
- [Trabajo futuro](#-trabajo-futuro)
- [Autores](#-autores)

---

## ✨ Características

- 🔐 **Autenticación con JWT** y 3 roles (ciudadano, funcionario, admin)
- 📝 **Gestión de reportes** ambientales con validación geográfica
- 📷 **Evidencias** (hasta 5 fotos o 1 video por reporte)
- 💬 **Comentarios** públicos e internos
- 📊 **Estadísticas** en tiempo real
- 📄 **Exportación a PDF** con logo y datos completos
- 📧 **Notificaciones por email** en 3 eventos clave
- 🔍 **Filtros avanzados** (categoría, estado, fecha, texto)
- 🛡️ **Moderación** de reportes antes de publicar
- 📋 **Auditoría** de todas las acciones del sistema
- 🗑️ **Soft delete** con anonimización de datos
- ✅ **Validación** de coordenadas dentro del municipio de Garzón

---

## 🛠 Tecnologías

- **Runtime:** Node.js 18+
- **Framework:** Express 5.x
- **Base de datos:** MongoDB Atlas (Mongoose 9.x)
- **Autenticación:** JWT + bcrypt
- **Emails:** Nodemailer + Gmail SMTP
- **PDF:** PDFKit
- **Archivos:** Multer
- **Gestor de paquetes:** pnpm

---

## 📦 Requisitos previos

- Node.js 18 o superior
- pnpm 8 o superior
- Cuenta de MongoDB Atlas (o MongoDB local)
- Cuenta de Gmail con App Password (para notificaciones)

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/ByInalik/ecovoz1.0.git
cd ecovoz1.0/backend