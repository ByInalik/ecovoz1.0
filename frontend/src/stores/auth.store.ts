import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Usuario, Rol } from '@/types';

// ============================================
// Store de autenticación con Zustand
// Persiste el token y el usuario en localStorage
// ============================================

interface AuthState {
  // Estado
  token: string | null;
  usuario: Usuario | null;
  isAuthenticated: boolean;

  // Acciones
  login: (token: string, usuario: Usuario) => void;
  logout: () => void;
  setUsuario: (usuario: Usuario) => void;

  // Helpers
  isRol: (rol: Rol) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      token: null,
      usuario: null,
      isAuthenticated: false,

      // Iniciar sesión
      login: (token, usuario) => {
        // Guardar token en localStorage para el interceptor de Axios
        localStorage.setItem('ecovoz_token', token);
        localStorage.setItem('ecovoz_usuario', JSON.stringify(usuario));

        set({
          token,
          usuario,
          isAuthenticated: true,
        });
      },

      // Cerrar sesión
      logout: () => {
        localStorage.removeItem('ecovoz_token');
        localStorage.removeItem('ecovoz_usuario');

        set({
          token: null,
          usuario: null,
          isAuthenticated: false,
        });
      },

      // Actualizar datos del usuario (ej: al cambiar perfil)
      setUsuario: (usuario) => {
        localStorage.setItem('ecovoz_usuario', JSON.stringify(usuario));
        set({ usuario });
      },

      // Verificar rol
      isRol: (rol) => {
        const { usuario } = get();
        return usuario?.rol === rol;
      },
    }),
    {
      name: 'ecovoz-auth', // clave en localStorage
      partialize: (state) => ({
        token: state.token,
        usuario: state.usuario,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);