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
import Aurora from '@/components/ui/Aurora';
import CountUp from '@/components/ui/CountUp';
import RotatingText from '@/components/ui/RotatingText';
import AccordionGallery from '@/components/ui/AccordionGallery';

export default function LandingPage() {
  return (
    <Layout>
      {/* ============================================ */}
      {/* HERO — SPLIT LAYOUT */}
      {/* ============================================ */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Fondo Aurora */}
        <div className="absolute inset-0 -z-10 opacity-30">
          <Aurora
            colorStops={['#3b82f6', '#2563eb', '#60a5fa']}
            amplitude={1.2}
            blend={0.6}
            speed={0.5}
          />
        </div>

        {/* Overlay oscuro */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/70 via-background/50 to-background" />

        <div className="container relative py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* ==================== */}
            {/* COLUMNA IZQUIERDA */}
            {/* ==================== */}
            <div className="space-y-8">
              <Badge
                variant="outline"
                className="px-4 py-1.5 text-sm border-primary/30 bg-primary/5 text-primary"
              >
                🌱 Plataforma colaborativa ambiental
              </Badge>

              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight">
                  Tu voz protege
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
                  className="text-base shadow-lg shadow-primary/30"
                >
                  <Link to="/registro">
                    Comenzar ahora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="text-base bg-background/50 backdrop-blur border-primary/20 hover:border-primary/40"
                >
                  <Link to="/login">Iniciar sesión</Link>
                </Button>
              </div>

              {/* Stats mini */}
              <div className="flex flex-wrap gap-8 pt-6 border-t border-border/50">
                <div>
                  <div className="text-3xl font-bold text-primary">
                    +<CountUp to={150} duration={2} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Reportes</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">
                    +<CountUp to={300} duration={2.2} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Ciudadanos</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">
                    <CountUp to={89} duration={2} />%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Resueltos</p>
                </div>
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
      {/* CARACTERÍSTICAS — GRID */}
      {/* ============================================ */}
      <section
        id="caracteristicas"
        className="py-24 bg-muted/20 relative overflow-hidden"
      >
        {/* Decoración de fondo */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge
              variant="outline"
              className="mb-4 border-primary/30 text-primary"
            >
              Características
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Todo lo que necesitas
            </h2>
            <p className="text-muted-foreground text-lg">
              Una plataforma completa que conecta ciudadanos con las autoridades
              ambientales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: MapPin,
                titulo: 'Ubicación precisa',
                descripcion:
                  'Geolocalización GPS con validación dentro del municipio de Garzón.',
              },
              {
                icon: Camera,
                titulo: 'Evidencias visuales',
                descripcion:
                  'Adjunta hasta 5 fotos o 1 video para respaldar cada reporte.',
              },
              {
                icon: Bell,
                titulo: 'Notificaciones',
                descripcion:
                  'Recibe alertas por email cuando tu reporte cambie de estado.',
              },
              {
                icon: BarChart3,
                titulo: 'Estadísticas',
                descripcion:
                  'Visualiza datos y tendencias ambientales en tiempo real.',
              },
              {
                icon: ShieldCheck,
                titulo: 'Moderación',
                descripcion:
                  'Cada reporte es validado por funcionarios antes de publicarse.',
              },
              {
                icon: Users,
                titulo: 'Comunidad',
                descripcion:
                  'Confirma reportes de otros ciudadanos y suma tu voz a la causa.',
              },
            ].map((feature) => {
              const Icono = feature.icon;
              return (
                <Card
                  key={feature.titulo}
                  className="group relative overflow-hidden bg-card border border-border hover:border-primary/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10"
                >
                  {/* Spotlight gradient al hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-primary/5 group-hover:to-primary/10 transition-all duration-500" />

                  <CardContent className="relative p-6 space-y-4">
                    <div className="h-14 w-14 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3">
                      <Icono className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {feature.titulo}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.descripcion}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
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