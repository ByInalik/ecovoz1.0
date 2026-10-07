import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';

// Páginas temporales
function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="text-6xl">🌱</div>
        <h1 className="text-4xl font-bold text-primary">EcoVoz</h1>
        <p className="text-muted-foreground">Sistema de Reportes Ambientales</p>
        <p className="text-sm text-muted-foreground">Home - en construcción</p>
      </div>
    </div>
  );
}

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground">Login - en construcción</p>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="text-xl text-foreground">Página no encontrada</p>
        <a href="/" className="text-primary underline hover:no-underline">
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
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;