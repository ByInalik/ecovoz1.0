import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';

import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import DashboardCiudadano from '@/pages/ciudadano/DashboardPage';
import DashboardFuncionario from '@/pages/funcionario/DashboardPage';
import DashboardAdmin from '@/pages/admin/DashboardPage';
import { useAuthStore } from '@/stores/auth.store';

// Componente para proteger rutas
function RutaProtegida({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="text-xl text-foreground">Página no encontrada</p>
        <a href="/login" className="text-primary underline hover:no-underline">
          Volver al inicio
        </a>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirigir la raíz al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Autenticación */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />

        {/* Rutas protegidas por rol */}
        <Route
          path="/ciudadano/dashboard"
          element={
            <RutaProtegida>
              <DashboardCiudadano />
            </RutaProtegida>
          }
        />
        <Route
          path="/funcionario/dashboard"
          element={
            <RutaProtegida>
              <DashboardFuncionario />
            </RutaProtegida>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <RutaProtegida>
              <DashboardAdmin />
            </RutaProtegida>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  );
}

export default App;