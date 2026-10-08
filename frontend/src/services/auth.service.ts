import api from './api';
import type {
  LoginRequest,
  LoginResponse,
  RegistroRequest,
  RegistroResponse,
  Usuario,
} from '@/types';

// ============================================
// Servicio de autenticación
// ============================================

// Iniciar sesión
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/api/auth/login', data);
  return response.data;
}

// Registro de ciudadano
export async function registro(data: RegistroRequest): Promise<RegistroResponse> {
  const response = await api.post<RegistroResponse>('/api/auth/registro', data);
  return response.data;
}

// Obtener mi perfil (requiere token)
export async function getMiPerfil(): Promise<Usuario> {
  const response = await api.get<Usuario>('/api/perfil');
  return response.data;
}

// Cerrar sesión (no hay endpoint, solo limpia el estado local)
export function logout() {
  localStorage.removeItem('ecovoz_token');
  localStorage.removeItem('ecovoz_usuario');
}