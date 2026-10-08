// ============================================
// Tipos globales de EcoVoz
// ============================================

// ============================================
// Usuario y autenticación
// ============================================
export type Rol = 'ciudadano' | 'funcionario' | 'admin';

export interface Usuario {
  _id: string;
  nombre: string;
  email: string;
  rol: Rol;
  estado: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  nombre: string;
  rol: Rol;
}

export interface RegistroRequest {
  nombre: string;
  email: string;
  password: string;
}

export interface RegistroResponse {
  mensaje: string;
  id: string;
  rol: Rol;
}

// ============================================
// Reporte
// ============================================
export type CategoriaReporte =
  | 'Residuos'
  | 'Agua'
  | 'Aire'
  | 'Fauna'
  | 'Flora'
  | 'Ruido'
  | 'Otro';

export type EstadoReporte =
  | 'Pendiente de moderación'
  | 'Pendiente'
  | 'En revisión'
  | 'En proceso'
  | 'Solucionado'
  | 'Rechazado';

export interface Reporte {
  _id: string;
  titulo: string;
  descripcion: string;
  categoria: CategoriaReporte;
  subcategoria?: string;
  ubicacion: string;
  latitud: number;
  longitud: number;
  fotos?: string[];
  esAnonimo: boolean;
  estado: EstadoReporte;
  sincronizado: boolean;
  requiereValidacionManual: boolean;
  creadoPor: Usuario | string | null;
  moderacion?: {
    aprobado: boolean;
    moderadoPor?: string;
    fechaModeracion?: string;
    motivoRechazo?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ReportesResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filtrosAplicados: Record<string, any>;
  reportes: Reporte[];
}

// ============================================
// Comentario
// ============================================
export interface Comentario {
  _id: string;
  reporte: string;
  autor: Usuario | string | null;
  texto: string;
  tipo: 'publico' | 'interno';
  respondeA?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Notificación
// ============================================
export type TipoNotificacion =
  | 'cambio_estado'
  | 'moderacion_aprobado'
  | 'moderacion_rechazado'
  | 'nuevo_comentario'
  | 'bienvenida'
  | 'otro';

export interface Notificacion {
  _id: string;
  usuario: string;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  referencia?: {
    tipo: string;
    id: string;
  };
  leida: boolean;
  emailEnviado: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Error estándar del backend
// ============================================
export interface ApiError {
  error: string;
  distancia?: number;
  puedeSolicitarExcepcion?: boolean;
  hint?: string;
}