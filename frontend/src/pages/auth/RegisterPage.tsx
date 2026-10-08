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

import { registro } from '@/services/auth.service';
import type { ApiError } from '@/types';

const registroSchema = z
  .object({
    nombre: z
      .string()
      .min(3, 'El nombre debe tener al menos 3 caracteres')
      .max(50, 'Máximo 50 caracteres'),
    email: z
      .string()
      .min(1, 'El email es obligatorio')
      .email('Formato de email inválido'),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres'),
    passwordConfirm: z
      .string()
      .min(1, 'Debes confirmar tu contraseña'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Las contraseñas no coinciden',
    path: ['passwordConfirm'],
  });

type RegistroForm = z.infer<typeof registroSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [errorServidor, setErrorServidor] = useState('');
  const [cargando, setCargando] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistroForm>({
    resolver: zodResolver(registroSchema),
  });

  const onSubmit = async (data: RegistroForm) => {
    try {
      setCargando(true);
      setErrorServidor('');

      await registro({
        nombre: data.nombre,
        email: data.email,
        password: data.password,
      });

      toast.success('¡Cuenta creada! Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (err: any) {
      const apiError = err.response?.data as ApiError;
      const mensaje = apiError?.error || 'Error al crear la cuenta. Intenta de nuevo.';
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
            <CardTitle className="text-2xl font-bold text-primary">Crear cuenta</CardTitle>
            <CardDescription>Únete a la comunidad EcoVoz</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errorServidor && (
              <Alert variant="destructive">
                <AlertDescription>{errorServidor}</AlertDescription>
              </Alert>
            )}

            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input
                id="nombre"
                type="text"
                placeholder="Tu nombre"
                autoComplete="name"
                disabled={cargando}
                {...register('nombre')}
              />
              {errors.nombre && (
                <p className="text-sm text-destructive">{errors.nombre.message}</p>
              )}
            </div>

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
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                disabled={cargando}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Confirmar password */}
            <div className="space-y-2">
              <Label htmlFor="passwordConfirm">Confirmar contraseña</Label>
              <Input
                id="passwordConfirm"
                type="password"
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
                disabled={cargando}
                {...register('passwordConfirm')}
              />
              {errors.passwordConfirm && (
                <p className="text-sm text-destructive">{errors.passwordConfirm.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={cargando}>
              {cargando ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                'Crear cuenta'
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground pt-2">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Inicia sesión
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}