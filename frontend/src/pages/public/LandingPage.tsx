import { Link } from 'react-router-dom';
import {
  Leaf,
  MapPin,
  Camera,
  Bell,
  BarChart3,
  ShieldCheck,
  Users,
  User,
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

// 🎨 Componentes de React Bits / Fancy
import Ferrofluid from '@/components/ui/Ferrofluid';
import CountUp from '@/components/ui/CountUp';
import RotatingText from '@/components/ui/RotatingText';
import AccordionGallery from '@/components/ui/AccordionGallery';
import MagicBento from '@/components/ui/MagicBento';

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
            rimWidth={0.2}
            sharpness={2.5}
            shimmer={1.5}
            glow={2}
            flowDirection="down"
            opacity={0.6}
            mouseInteraction={true}
            mouseStrength={1}
            mouseRadius={0.35}
            mouseDampening={0.15}
          />
        </div>

        {/* Overlay oscuro para legibilidad */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/60 via-background/40 to-background" />

        <div className="container relative py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* ==================== */}
            {/* COLUMNA IZQUIERDA */}
            {/* ==================== */}
            <div className="space-y-8">
              {/* Badge con gradiente animado */}
              <div className="relative inline-flex items-center gap-2.5 p-[1px] rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/50 to-primary animate-[spin_3s_linear_infinite]" />
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
                  render={<Link to="/registro" />}
                  className="group relative text-base h-12 px-8 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/50 transition-all duration-300 overflow-hidden"
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="relative flex items-center gap-2">
                    Comenzar ahora
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  render={<Link to="/login" />}
                  className="text-base h-12 px-8 rounded-full bg-background/40 backdrop-blur-md border-primary/30 hover:border-primary/60 hover:bg-background/60 transition-all duration-300"
                >
                  Iniciar sesión
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
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="container max-w-6xl">
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

          <div className="space-y-20 md:space-y-24">
            {/* Fila 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-[4/3] rounded-3xl border border-border/50 bg-gradient-to-br from-primary/5 via-background to-primary/10 overflow-hidden group hover:border-primary/30 transition-all duration-500">
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

                  <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="1" className="text-primary" />
                    <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeWidth="1" className="text-primary" />
                  </svg>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl group-hover:bg-primary/30 transition-all duration-500" />
                      <div className="relative h-20 w-20 rounded-full bg-background border border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <MapPin className="h-9 w-9 text-primary" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-6 right-6 h-12 w-12 rounded-full border border-primary/20" />
                  <div className="absolute bottom-6 left-6 h-16 w-16 rounded-full border border-primary/10" />
                </div>
              </div>

              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                  <div className="h-px w-8 bg-primary" />
                  <span>01</span>
                </div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                  Ubicación precisa
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed max-w-lg">
                  Geolocalización GPS con validación dentro del municipio de
                  Garzón. Cada reporte queda ubicado en el mapa para que las
                  autoridades actúen con precisión.
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

            {/* Fila 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 lg:order-1 space-y-5">
                <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                  <div className="h-px w-8 bg-primary" />
                  <span>02</span>
                </div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                  Evidencias visuales
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed max-w-lg">
                  Adjunta hasta 5 fotos o 1 video para respaldar cada reporte.
                  Las imágenes se comprimen automáticamente para un envío
                  rápido, incluso con conexiones limitadas.
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

              <div className="lg:col-span-5 lg:order-2 relative">
                <div className="relative aspect-[4/3] rounded-3xl border border-border/50 bg-gradient-to-br from-primary/10 via-background to-primary/5 overflow-hidden group hover:border-primary/30 transition-all duration-500">
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

                  <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="1" className="text-primary" />
                    <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeWidth="1" className="text-primary" />
                  </svg>

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

            {/* Fila 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-[4/3] rounded-3xl border border-border/50 bg-gradient-to-br from-primary/5 via-background to-primary/10 overflow-hidden group hover:border-primary/30 transition-all duration-500">
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

                  <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="1" className="text-primary" />
                    <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeWidth="1" className="text-primary" />
                  </svg>

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

              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                  <div className="h-px w-8 bg-primary" />
                  <span>03</span>
                </div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                  Notificaciones automáticas
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed max-w-lg">
                  Recibe alertas por email cuando tu reporte cambie de estado.
                  Nunca más te quedarás sin saber qué pasó con tu denuncia
                  ambiental.
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
      {/* CÓMO FUNCIONA — CARDS CON BORDES PUNTEADOS */}
      {/* ============================================ */}
      <section id="como-funciona" className="py-24 relative overflow-hidden">
        <div className="container max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              Cómo funciona
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Reportar es muy fácil
            </h2>
            <p className="text-muted-foreground text-lg">
              En solo 3 pasos puedes contribuir a la protección del medio ambiente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                titulo: 'Regístrate',
                desc: 'Crea tu cuenta gratuita como ciudadano en menos de un minuto. Solo necesitas tu nombre, correo y contraseña.',
                icon: User,
              },
              {
                num: '02',
                titulo: 'Reporta',
                desc: 'Describe el incidente, ubícalo en el mapa y adjunta hasta 5 fotos o 1 video como evidencia.',
                icon: Camera,
              },
              {
                num: '03',
                titulo: 'Haz seguimiento',
                desc: 'Recibe notificaciones por email y observa cómo tu reporte es gestionado por las autoridades.',
                icon: Bell,
              },
            ].map((paso) => {
              const Icono = paso.icon;
              return (
                <div
                  key={paso.num}
                  className="group relative bg-transparent border border-dashed border-border/60 hover:border-primary/60 transition-all duration-300 p-8 flex flex-col gap-6 min-h-[320px]"
                >
                  {/* Marcas en las esquinas (estilo blueprint) */}
                  <span className="absolute -top-[5px] -left-[5px] h-[10px] w-[10px] border-l border-t border-border/60" />
                  <span className="absolute -top-[5px] -right-[5px] h-[10px] w-[10px] border-r border-t border-border/60" />
                  <span className="absolute -bottom-[5px] -left-[5px] h-[10px] w-[10px] border-l border-b border-border/60" />
                  <span className="absolute -bottom-[5px] -right-[5px] h-[10px] w-[10px] border-r border-b border-border/60" />

                  {/* Número */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-primary/70 tracking-widest">
                      PASO
                    </span>
                    <span className="text-xs font-bold text-primary">
                      {paso.num}
                    </span>
                  </div>

                  {/* Ícono */}
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icono className="h-6 w-6 text-primary" />
                  </div>

                  {/* Título */}
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {paso.titulo}
                  </h3>

                  {/* Descripción */}
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {paso.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CATEGORÍAS — BENTO GRID */}
      {/* ============================================ */}
      <section className="py-24 bg-muted/20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              Categorías
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              ¿Qué puedes reportar?
            </h2>
            <p className="text-muted-foreground text-lg">
              Múltiples categorías de incidentes ambientales.
            </p>
          </div>

          <MagicBento
            cards={[
              {
                title: 'Residuos',
                description: 'Basura acumulada, vertederos ilegales y manejo inadecuado de desechos.',
                label: '01',
                icon: Trash2,
              },
              {
                title: 'Agua',
                description: 'Contaminación de ríos, quebradas y fuentes hídricas.',
                label: '02',
                icon: Droplets,
              },
              {
                title: 'Aire',
                description: 'Emisiones, humo y calidad del aire.',
                label: '03',
                icon: Wind,
              },
              {
                title: 'Fauna',
                description: 'Maltrato animal y protección de especies.',
                label: '04',
                icon: Bird,
              },
              {
                title: 'Flora',
                description: 'Deforestación y tala ilegal de árboles.',
                label: '05',
                icon: Leaf,
              },
              {
                title: 'Ruido',
                description: 'Contaminación auditiva y ruidos molestos.',
                label: '06',
                icon: Volume2,
              },
              {
                title: 'Otro',
                description: 'Incidentes ambientales no clasificados.',
                label: '07',
                icon: AlertTriangle,
              },
              {
                title: 'Crítico',
                description: 'Emergencias ambientales que requieren atención inmediata.',
                label: '08',
                icon: Siren,
              },
            ]}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            glowColor="59, 130, 246"
            spotlightRadius={400}
            particleCount={12}
            enableTilt={true}
            clickEffect={true}
            enableMagnetism={false}
          />
        </div>
      </section>

      {/* ============================================ */}
      {/* CTA FINAL — CON GRADIENTE Y PATRÓN */}
      {/* ============================================ */}
<section className="py-24 relative overflow-hidden">
  <div className="container">
    <div className="relative rounded-3xl overflow-hidden border border-primary/20">
      {/* 🌊 Fondo con gradiente + Aurora sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary to-primary/90" />

      {/* Patrón de grid sutil */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-grid)" />
        </svg>
      </div>

      {/* Círculos decorativos con blur */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

      {/* Puntos decorativos */}
      <div className="absolute top-8 left-8 h-3 w-3 rounded-full bg-white/40" />
      <div className="absolute top-8 right-8 h-3 w-3 rounded-full bg-white/40" />
      <div className="absolute bottom-8 left-8 h-3 w-3 rounded-full bg-white/40" />
      <div className="absolute bottom-8 right-8 h-3 w-3 rounded-full bg-white/40" />

      {/* Contenido */}
      <div className="relative z-10 px-6 md:px-12 py-20 md:py-24 text-center text-white">
        {/* Badge superior */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="text-xs font-medium uppercase tracking-wider">
            Únete ahora
          </span>
        </div>

        {/* Título */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-3xl mx-auto leading-tight">
          ¿Listo para hacer{' '}
          <span className="relative inline-block">
            la diferencia
            <svg
              className="absolute -bottom-2 left-0 w-full text-white/60"
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
          </span>
          ?
        </h2>

        {/* Descripción */}
        <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-10">
          Únete a la comunidad EcoVoz y ayuda a proteger el medio ambiente en
          Garzón, Huila. Tu voz importa.
        </p>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            render={<Link to="/registro" />}
            className="group relative text-base h-12 px-8 rounded-full bg-white text-primary hover:bg-white/95 shadow-2xl shadow-black/20 hover:shadow-black/30 transition-all duration-300 overflow-hidden font-semibold"
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
            <span className="relative flex items-center gap-2">
              Crear cuenta gratis
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>

          <Button
            size="lg"
            variant="outline"
            render={<Link to="/login" />}
            className="text-base h-12 px-8 rounded-full bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300"
          >
            Iniciar sesión
          </Button>
        </div>

        {/* Footer del CTA */}
        <div className="mt-12 pt-8 border-t border-white/15 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm opacity-80">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span>Privacidad total</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Garzón - Huila</span>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notificaciones en tiempo real</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
    </Layout>
  );
}