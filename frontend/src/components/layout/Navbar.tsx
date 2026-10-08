import { Link, useNavigate } from 'react-router-dom';
import { Leaf, LogOut, User, Menu } from 'lucide-react';
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

export default function Navbar() {
  const navigate = useNavigate();
  const { usuario, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada');
    navigate('/login');
  };

  const iniciales = usuario?.nombre
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  // Ruta del dashboard según el rol
  const dashboardRoute = usuario?.rol === 'admin'
    ? '/admin/dashboard'
    : usuario?.rol === 'funcionario'
      ? '/funcionario/dashboard'
      : '/ciudadano/dashboard';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-primary">EcoVoz</span>
        </Link>

        {/* Navegación pública */}
        <nav className="hidden md:flex items-center gap-6">
          {!isAuthenticated ? (
            <>
              <Link
                to="/#caracteristicas"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Características
              </Link>
              <Link
                to="/#como-funciona"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cómo funciona
              </Link>
              <Link
                to="/#contacto"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contacto
              </Link>
            </>
          ) : (
            <>
              <Link
                to={dashboardRoute}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Panel
              </Link>
              {usuario?.rol === 'ciudadano' && (
                <>
                  <Link
                    to="/ciudadano/reportes/nuevo"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Reportar
                  </Link>
                  <Link
                    to="/ciudadano/mapa"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Mapa
                  </Link>
                </>
              )}
              {usuario?.rol === 'funcionario' && (
                <>
                  <Link
                    to="/funcionario/moderacion"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Moderar
                  </Link>
                  <Link
                    to="/funcionario/estadisticas"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Estadísticas
                  </Link>
                </>
              )}
              {usuario?.rol === 'admin' && (
                <>
                  <Link
                    to="/admin/usuarios"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Usuarios
                  </Link>
                  <Link
                    to="/admin/auditoria"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Auditoría
                  </Link>
                </>
              )}
            </>
          )}
        </nav>

        {/* Zona de usuario */}
        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Iniciar sesión</Link>
              </Button>
              <Button asChild>
                <Link to="/registro">Registrarse</Link>
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {iniciales}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{usuario?.nombre}</p>
                    <p className="text-xs text-muted-foreground">{usuario?.email}</p>
                    <p className="text-xs text-primary font-medium capitalize">
                      {usuario?.rol}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={dashboardRoute} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Mi panel
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/perfil" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Mi perfil
                  </Link>
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
    </header>
  );
}