import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { usuario, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Panel Ciudadano 🌱</CardTitle>
            <CardDescription>
              Bienvenido, {usuario?.nombre}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Rol: <strong>{usuario?.rol}</strong>
            </p>
            <p className="text-sm">
              Email: <strong>{usuario?.email}</strong>
            </p>
            <Button onClick={logout} variant="destructive">
              Cerrar sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}