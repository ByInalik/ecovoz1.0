import { Link } from 'react-router-dom';
import {
  Leaf,
  MapPin,
  Camera,
  Bell,
  BarChart3,
  ShieldCheck,
  Users,
  ArrowRight,
  AlertTriangle,
  Droplets,
  Wind,
  Trash2,
  Bird,
  Volume2,
  Siren,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';

// 🎨 Componentes de React Bits
import Ferrofluid from '@/components/ui/Ferrofluid';
import CountUp from '@/components/ui/CountUp';
import RotatingText from '@/components/ui/RotatingText';
import AccordionGallery from '@/components/ui/AccordionGallery';

export default function LandingPage() {
  return (
    <Layout>
      {/* ============================================ */}
      {/* HERO — SPLIT LAYOUT CON FERROFLUID */}
      {/* ============================================ */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* 🌊 Fondo Ferrofluid */}
        <div className="absolute inset-0 -z-10">
          <Ferrofluid
            colors={['#3b82f6', '#2563eb', '#60a5fa', '#1e40af']}
            speed={0.3}
            scale={1.5}
            turbulence={1}
            fluidity={0.1}
            glow={2}
            flowDirection="down"
            opacity={0.7}
            mouseInteraction={true}
          />
        </div>

        {/* Overlay oscuro para legibilidad */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/40 via-background/20 to-background" />

        <div className="container relative py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* ==================== */}
            {/* COLUMNA IZQUIERDA */}
            {/* ==================== */}
            <div className="space-y-8">
              {/* Badge con borde animado */}
            <div className="relative inline-flex items-center gap-2.5 p-[1px] rounded-full overflow-hidden">
              {/* Borde con gradiente animado */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/50 to-primary animate-[spin_3s_linear_infinite]" />

              {/* Contenido */}
              <div className="relative inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-background/95 backdrop-blur-xl">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  Plataforma colaborativa ambiental
                </span>
              </div>
            </div>

              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight">
                  Tu{' '}
                  <span className="relative inline-block">
                    voz
                    <svg
                      className="absolute -bottom-2 left-0 w-full text-primary"
                      height="12"
                      viewBox="0 0 200 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M2 9C50 3 100 2 150 5C175 6.5 190 8 198 9"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>{' '}
                  protege
                  <br />
                  <span className="flex items-center flex-wrap gap-3 mt-2">
                    <span className="text-primary">el</span>
                    <RotatingText
                      words={['medio ambiente', 'futuro', 'planeta', 'municipio']}
                      interval={2200}
                      className="text-primary"
                    />
                  </span>
                </h1>
              </div>

              <p className="text-lg text-muted-foreground max-w-xl">
                Reporta incidentes ambientales en Garzón, Huila. Tu participación
                ayuda a construir un municipio más limpio, seguro y sostenible.
              </p>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button
                size="lg"
                asChild
                className="group relative text-base h-12 px-8 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/50 transition-all duration-300 overflow-hidden"
              >
                <Link to="/registro">
                  {/* Brillo animado que cruza el botón */}
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="relative flex items-center gap-2">
                    Comenzar ahora
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-base h-12 px-8 rounded-full bg-background/40 backdrop-blur-md border-primary/30 hover:border-primary/60 hover:bg-background/60 transition-all duration-300"
                >
                <Link to="/login">Iniciar sesión</Link>
              </Button>
              </div>

            </div>

            {/* ==================== */}
            {/* COLUMNA DERECHA — ACCORDION GALLERY */}
            {/* ==================== */}
            <div className="relative">
              <AccordionGallery
                items={[
                  {
                    image:
                      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop',
                    label: 'Residuos',
                    alt: 'Residuos en el parque',
                  },
                  {
                    image:
                      'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&auto=format&fit=crop',
                    label: 'Agua',
                    alt: 'Contaminación del agua',
                  },
                  {
                    image:
                      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop',
                    label: 'Flora',
                    alt: 'Deforestación',
                  },
                  {
                    image:
                      'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&auto=format&fit=crop',
                    label: 'Fauna',
                    alt: 'Protección animal',
                  },
                  {
                    image:
                      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop',
                    label: 'Aire',
                    alt: 'Sostenibilidad',
                  },
                ]}
                defaultIndex={2}
                accentColor="#3b82f6"
                overlayColor="#0a0a0a"
                textColor="#ffffff"
                grayscale={true}
                showLabels={true}
                duration={0.6}
                parallax={0.5}
                tilt={8}
                trigger="hover"
                height={480}
                gap={8}
                radius={16}
                expandRatio={0.5}
                orientation="horizontal"
              />

              {/* Efectos decorativos de fondo */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
{/* CARACTERÍSTICAS — LAYOUT ALTERNADO */}
{/* ============================================ */}
<section id="caracteristicas" className="py-24 relative overflow-hidden">
  {/* Decoración de fondo */}
  <div className="absolute inset-0 -z-10">
    <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
    <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
  </div>

  <div className="container max-w-6xl">
    {/* Encabezado de sección */}
    <div className="max-w-3xl mb-20">
      <Badge
        variant="outline"
        className="mb-6 border-primary/30 text-primary px-3 py-1"
      >
        Características
      </Badge>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground leading-tight">
        Todo lo que necesitas,{' '}
        <span className="text-primary">en un solo lugar</span>
      </h2>
      <p className="text-muted-foreground text-base md:text-lg">
        Una plataforma completa que conecta ciudadanos con las autoridades
        ambientales de Garzón.
      </p>
    </div>

    {/* Filas alternadas */}
    <div className="space-y-20 md:space-y-24">
      {/* ═══ Fila 1: Imagen izquierda, texto derecha ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Visual */}
        <div className="lg:col-span-5 relative">
          <div className="relative aspect-[4/3] rounded-3xl border border-border/50 bg-gradient-to-br from-primary/5 via-background to-primary/10 overflow-hidden group hover:border-primary/30 transition-all duration-500">
            {/* Patrón de grid */}
            <div className="absolute inset-0 opacity-[0.15]">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid1" width="32" height="32" patternUnits="userSpaceOnUse">
                    <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid1)" />
              </svg>
            </div>

            {/* Líneas diagonales */}
            <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
              <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="1" className="text-primary" />
              <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeWidth="1" className="text-primary" />
            </svg>

            {/* Círculo central */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl group-hover:bg-primary/30 transition-all duration-500" />
                <div className="relative h-20 w-20 rounded-full bg-background border border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <MapPin className="h-9 w-9 text-primary" />
                </div>
              </div>
            </div>

            {/* Círculos decorativos */}
            <div className="absolute top-6 right-6 h-12 w-12 rounded-full border border-primary/20" />
            <div className="absolute bottom-6 left-6 h-16 w-16 rounded-full border border-primary/10" />
          </div>
        </div>

        {/* Texto */}
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
            <div className="h-px w-8 bg-primary" />
            <span>01</span>
          </div>
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
            Ubicación precisa
          </h3>
          <p className="text-muted-foreground text-base leading-relaxed max-w-lg">
            Geolocalización GPS con validación dentro del municipio de Garzón.
            Cada reporte queda ubicado en el mapa para que las autoridades
            actúen con precisión.
          </p>
          <ul className="space-y-2.5 pt-2">
            <li className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Coordenadas exactas en tiempo real</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Validación dentro del área municipal</span>
            </li>
          </ul>
        </div>
      </div>

      {/* ═══ Fila 2: Texto izquierda, imagen derecha ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Texto */}
        <div className="lg:col-span-7 lg:order-1 space-y-5">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
            <div className="h-px w-8 bg-primary" />
            <span>02</span>
          </div>
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
            Evidencias visuales
          </h3>
          <p className="text-muted-foreground text-base leading-relaxed max-w-lg">
            Adjunta hasta 5 fotos o 1 video para respaldar cada reporte. Las
            imágenes se comprimen automáticamente para un envío rápido, incluso
            con conexiones limitadas.
          </p>
          <ul className="space-y-2.5 pt-2">
            <li className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Compresión automática de imágenes</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Hasta 5 fotos o 1 video por reporte</span>
            </li>
          </ul>
        </div>

        {/* Visual */}
        <div className="lg:col-span-5 lg:order-2 relative">
          <div className="relative aspect-[4/3] rounded-3xl border border-border/50 bg-gradient-to-br from-primary/10 via-background to-primary/5 overflow-hidden group hover:border-primary/30 transition-all duration-500">
            {/* Patrón de grid */}
            <div className="absolute inset-0 opacity-[0.15]">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid2" width="32" height="32" patternUnits="userSpaceOnUse">
                    <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid2)" />
              </svg>
            </div>

            {/* Líneas diagonales */}
            <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
              <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="1" className="text-primary" />
              <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeWidth="1" className="text-primary" />
            </svg>

            {/* Círculo central */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl group-hover:bg-primary/30 transition-all duration-500" />
                <div className="relative h-20 w-20 rounded-full bg-background border border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Camera className="h-9 w-9 text-primary" />
                </div>
              </div>
            </div>

            <div className="absolute top-6 left-6 h-12 w-12 rounded-full border border-primary/20" />
            <div className="absolute bottom-6 right-6 h-16 w-16 rounded-full border border-primary/10" />
          </div>
        </div>
      </div>

      {/* ═══ Fila 3: Imagen izquierda, texto derecha ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Visual */}
        <div className="lg:col-span-5 relative">
          <div className="relative aspect-[4/3] rounded-3xl border border-border/50 bg-gradient-to-br from-primary/5 via-background to-primary/10 overflow-hidden group hover:border-primary/30 transition-all duration-500">
            {/* Patrón de grid */}
            <div className="absolute inset-0 opacity-[0.15]">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid3" width="32" height="32" patternUnits="userSpaceOnUse">
                    <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid3)" />
              </svg>
            </div>

            {/* Líneas diagonales */}
            <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
              <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="1" className="text-primary" />
              <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeWidth="1" className="text-primary" />
            </svg>

            {/* Círculo central */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl group-hover:bg-primary/30 transition-all duration-500" />
                <div className="relative h-20 w-20 rounded-full bg-background border border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Bell className="h-9 w-9 text-primary" />
                </div>
              </div>
            </div>

            <div className="absolute top-6 right-6 h-12 w-12 rounded-full border border-primary/20" />
            <div className="absolute bottom-6 left-6 h-16 w-16 rounded-full border border-primary/10" />
          </div>
        </div>

        {/* Texto */}
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
            <div className="h-px w-8 bg-primary" />
            <span>03</span>
          </div>
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
            Notificaciones automáticas
          </h3>
          <p className="text-muted-foreground text-base leading-relaxed max-w-lg">
            Recibe alertas por email cuando tu reporte cambie de estado. Nunca
            más te quedarás sin saber qué pasó con tu denuncia ambiental.
          </p>
          <ul className="space-y-2.5 pt-2">
            <li className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Email al cambiar el estado del reporte</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Notificaciones de comentarios nuevos</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* ============================================ */}
      {/* CÓMO FUNCIONA */}
      {/* ============================================ */}
      <section id="como-funciona" className="py-24">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge
              variant="outline"
              className="mb-4 border-primary/30 text-primary"
            >
              Cómo funciona
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Reportar es muy fácil
            </h2>
            <p className="text-muted-foreground text-lg">
              En solo 3 pasos puedes contribuir a la protección del medio ambiente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            {[
              {
                num: 1,
                titulo: 'Regístrate',
                desc: 'Crea tu cuenta gratuita como ciudadano en menos de un minuto.',
              },
              {
                num: 2,
                titulo: 'Reporta',
                desc: 'Describe el incidente, ubícalo en el mapa y adjunta evidencias.',
              },
              {
                num: 3,
                titulo: 'Haz seguimiento',
                desc: 'Recibe notificaciones y observa cómo tu reporte es gestionado.',
              },
            ].map((paso) => (
              <div key={paso.num} className="text-center space-y-4">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center text-3xl font-bold mx-auto shadow-lg shadow-primary/30">
                  {paso.num}
                </div>
                <h3 className="text-2xl font-semibold">{paso.titulo}</h3>
                <p className="text-muted-foreground">{paso.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CATEGORÍAS */}
      {/* ============================================ */}
      <section className="py-24 bg-muted/20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge
              variant="outline"
              className="mb-4 border-primary/30 text-primary"
            >
              Categorías
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              ¿Qué puedes reportar?
            </h2>
            <p className="text-muted-foreground text-lg">
              Múltiples categorías de incidentes ambientales para clasificar tu
              reporte.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { icon: Trash2, nombre: 'Residuos', color: 'text-emerald-400' },
              { icon: Droplets, nombre: 'Agua', color: 'text-blue-400' },
              { icon: Wind, nombre: 'Aire', color: 'text-sky-400' },
              { icon: Bird, nombre: 'Fauna', color: 'text-amber-400' },
              { icon: Leaf, nombre: 'Flora', color: 'text-green-400' },
              { icon: Volume2, nombre: 'Ruido', color: 'text-purple-400' },
              { icon: AlertTriangle, nombre: 'Otro', color: 'text-orange-400' },
              { icon: Siren, nombre: 'Crítico', color: 'text-red-400' },
            ].map((cat) => {
              const Icono = cat.icon;
              return (
                <Card
                  key={cat.nombre}
                  className="text-center bg-card/50 border-border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 cursor-default"
                >
                  <CardContent className="pt-6 pb-4 flex flex-col items-center gap-3">
                    <Icono className={`h-8 w-8 ${cat.color}`} />
                    <p className="text-sm font-medium text-foreground">
                      {cat.nombre}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CTA FINAL */}
      {/* ============================================ */}
      <section className="py-24">
        <div className="container">
          <Card className="bg-gradient-to-br from-primary via-primary to-primary/90 border-0 text-primary-foreground overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

            <CardContent className="relative py-16 text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold">
                ¿Listo para hacer la diferencia?
              </h2>
              <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
                Únete a la comunidad EcoVoz y ayuda a proteger el medio ambiente
                en Garzón, Huila.
              </p>
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="text-base bg-white text-primary hover:bg-white/90 shadow-xl"
              >
                <Link to="/registro">
                  Crear cuenta gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}