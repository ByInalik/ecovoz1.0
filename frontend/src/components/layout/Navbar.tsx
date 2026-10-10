import { Link, useNavigate } from 'react-router-dom';
import { Leaf, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';
import ThemeToggle from '@/components/ui/ThemeToggle';
import MobileMenu from './MobileMenu';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function Navbar() {
  const navigate = useNavigate();
  const { usuario, isAuthenticated, logout } = useAuthStore();
  const esMovil = useMediaQuery('(max-width: 767px)');

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada');
    navigate('/login');
  };

  const iniciales =
    usuario?.nombre
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';

  const dashboardRoute =
    usuario?.rol === 'admin'
      ? '/admin/dashboard'
      : usuario?.rol === 'funcionario'
        ? '/funcionario/dashboard'
        : '/ciudadano/dashboard';

  // 🎯 En móvil: usar StaggeredMenu
  if (esMovil) {
    return <MobileMenu />;
  }

  // 🖥️ En desktop: navbar pill
  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="flex h-16 items-center justify-between gap-4 rounded-full border border-border/50 bg-background/60 backdrop-blur-xl px-4 shadow-lg shadow-black/5">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80 shrink-0"
          >
            <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:block">
              EcoVoz
            </span>
          </Link>

          {/* Navegación central */}
          <nav className="hidden md:flex items-center gap-1">
            {!isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                  render={<Link to="/#caracteristicas" />}
                >
                  Características
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                  render={<Link to="/#como-funciona" />}
                >
                  Cómo funciona
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                  render={<Link to="/#contacto" />}
                >
                  Contacto
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                  render={<Link to={dashboardRoute} />}
                >
                  Panel
                </Button>
                {usuario?.rol === 'ciudadano' && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full"
                      render={<Link to="/ciudadano/reportes/nuevo" />}
                    >
                      Reportar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full"
                      render={<Link to="/ciudadano/mapa" />}
                    >
                      Mapa
                    </Button>
                  </>
                )}
                {usuario?.rol === 'funcionario' && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full"
                      render={<Link to="/funcionario/moderacion" />}
                    >
                      Moderar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full"
                      render={<Link to="/funcionario/estadisticas" />}
                    >
                      Estadísticas
                    </Button>
                  </>
                )}
                {usuario?.rol === 'admin' && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full"
                      render={<Link to="/admin/usuarios" />}
                    >
                      Usuarios
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full"
                      render={<Link to="/admin/auditoria" />}
                    >
                      Auditoría
                    </Button>
                  </>
                )}
              </>
            )}
          </nav>

          {/* Zona de usuario */}
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />

            {!isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full hidden sm:flex"
                  render={<Link to="/login" />}
                >
                  Iniciar sesión
                </Button>
                <Button
                  size="sm"
                  className="rounded-full"
                  render={<Link to="/registro" />}
                >
                  Registrarse
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full p-0"
                  >
                    <Avatar className="h-9 w-9 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                        {iniciales}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{usuario?.nombre}</p>
                      <p className="text-xs text-muted-foreground">
                        {usuario?.email}
                      </p>
                      <p className="text-xs text-primary font-medium capitalize">
                        {usuario?.rol}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    render={<Link to={dashboardRoute} />}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Mi panel
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    render={<Link to="/perfil" />}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Mi perfil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}