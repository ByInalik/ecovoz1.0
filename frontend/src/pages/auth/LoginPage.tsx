import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Leaf, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { useAuthStore } from '@/stores/auth.store';
import { login as loginService, getMiPerfil } from '@/services/auth.service';
import type { ApiError } from '@/types';

// Esquema de validación con Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('Formato de email inválido'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const loginStore = useAuthStore((s) => s.login);
  const [errorServidor, setErrorServidor] = useState('');
  const [cargando, setCargando] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setCargando(true);
      setErrorServidor('');

      // 1. Login
      const respuesta = await loginService(data);

      // 2. Guardar token temporalmente
      localStorage.setItem('ecovoz_token', respuesta.token);

      // 3. Obtener datos completos del usuario
      const usuario = await getMiPerfil();

      // 4. Guardar en el store
      loginStore(respuesta.token, usuario);

      // 5. Notificación de éxito
      toast.success(`¡Bienvenido, ${usuario.nombre}!`);

      // 6. Redirigir según el rol
      if (usuario.rol === 'admin') {
        navigate('/admin/dashboard');
      } else if (usuario.rol === 'funcionario') {
        navigate('/funcionario/dashboard');
      } else {
        navigate('/ciudadano/dashboard');
      }
    } catch (err: any) {
      const apiError = err.response?.data as ApiError;
      const mensaje = apiError?.error || 'Error al iniciar sesión. Intenta de nuevo.';
      setErrorServidor(mensaje);
      toast.error(mensaje);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/20 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
              <Leaf className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-primary">EcoVoz</CardTitle>
            <CardDescription>Sistema de Reportes Ambientales</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Alerta de error del servidor */}
            {errorServidor && (
              <Alert variant="destructive">
                <AlertDescription>{errorServidor}</AlertDescription>
              </Alert>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tucorreo@ejemplo.com"
                autoComplete="email"
                disabled={cargando}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link
                  to="/olvide-password"
                  className="text-xs text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={cargando}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Botón de submit */}
            <Button type="submit" className="w-full" disabled={cargando}>
              {cargando ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ingresando...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </Button>

            {/* Link a registro */}
            <p className="text-center text-sm text-muted-foreground pt-2">
              ¿No tienes cuenta?{' '}
              <Link to="/registro" className="text-primary font-medium hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}