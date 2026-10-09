import { useNavigate } from 'react-router-dom';
import StaggeredMenu from '@/components/ui/StaggeredMenu';
import { useAuthStore } from '@/stores/auth.store';
import type { StaggeredMenuItem } from '@/components/ui/StaggeredMenu';

export default function MobileMenu() {
  const navigate = useNavigate();
  const { usuario, isAuthenticated, logout } = useAuthStore();

  // Construir los items del menú según el estado
  const menuItems: StaggeredMenuItem[] = isAuthenticated
    ? [
        {
          label: 'Panel',
          ariaLabel: 'Ir a mi panel',
          link:
            usuario?.rol === 'admin'
              ? '/admin/dashboard'
              : usuario?.rol === 'funcionario'
                ? '/funcionario/dashboard'
                : '/ciudadano/dashboard',
        },
        ...(usuario?.rol === 'ciudadano'
          ? [
              { label: 'Reportar', ariaLabel: 'Crear reporte', link: '/ciudadano/reportes/nuevo' },
              { label: 'Mapa', ariaLabel: 'Ver mapa', link: '/ciudadano/mapa' },
              { label: 'Mis reportes', ariaLabel: 'Mis reportes', link: '/ciudadano/reportes' },
            ]
          : []),
        ...(usuario?.rol === 'funcionario'
          ? [
              { label: 'Moderar', ariaLabel: 'Moderar reportes', link: '/funcionario/moderacion' },
              { label: 'Estadísticas', ariaLabel: 'Estadísticas', link: '/funcionario/estadisticas' },
            ]
          : []),
        ...(usuario?.rol === 'admin'
          ? [
              { label: 'Usuarios', ariaLabel: 'Gestionar usuarios', link: '/admin/usuarios' },
              { label: 'Auditoría', ariaLabel: 'Auditoría', link: '/admin/auditoria' },
            ]
          : []),
        { label: 'Cerrar sesión', ariaLabel: 'Cerrar sesión', link: '#logout' },
      ]
    : [
        { label: 'Inicio', ariaLabel: 'Inicio', link: '/' },
        { label: 'Características', ariaLabel: 'Características', link: '/#caracteristicas' },
        { label: 'Cómo funciona', ariaLabel: 'Cómo funciona', link: '/#como-funciona' },
        { label: 'Iniciar sesión', ariaLabel: 'Iniciar sesión', link: '/login' },
        { label: 'Registrarse', ariaLabel: 'Registrarse', link: '/registro' },
      ];

  // Manejar clicks para interceptar la navegación
  const handleMenuClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a') as HTMLAnchorElement;

    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Manejar logout
    if (href === '#logout') {
      e.preventDefault();
      logout();
      navigate('/login');
      return;
    }

    // Interceptar navegación interna (empieza con /)
    if (href.startsWith('/') && !href.startsWith('//')) {
      e.preventDefault();
      navigate(href);
    }
  };

  return (
    <div onClick={handleMenuClick}>
      <StaggeredMenu
        position="right"
        items={menuItems}
        colors={['#3b82f6', '#2563eb', '#0a0a0a', '#1e3a8a']}
        accentColor="#3b82f6"
        menuButtonColor="#3b82f6"
        openMenuButtonColor="#ffffff"
        isFixed={true}
        displayItemNumbering={false}
        displaySocials={false}
        closeOnClickAway={true}
        logoUrl="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z'/%3E%3Cpath d='M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12'/%3E%3C/svg%3E"
        changeMenuColorOnOpen={true}
      />
    </div>
  );
}