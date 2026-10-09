import { Link } from 'react-router-dom';
import { Leaf, ArrowRight } from 'lucide-react';
import footerLandscape from '@/assets/footer-landscape.png';

export default function Footer() {
  const anio = new Date().getFullYear();

  return (
    <footer className="mt-20 w-full bg-background text-foreground overflow-hidden">
      {/* ============================================
          CONTENIDO PRINCIPAL
      ============================================ */}
      <div className="max-w-6xl mx-auto px-6 md:px-14 pt-16 pb-12 relative z-10">
        {/* ── Grid de 12 columnas ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* ══ Columna 1: Marca + descripción + redes ══ */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {/* Logo + nombre */}
            <Link
              to="/"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
            >
              <span className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                <Leaf className="h-5 w-5" />
              </span>
              <span className="text-xl font-bold tracking-tight text-foreground">
                EcoVoz
              </span>
            </Link>

            {/* Descripción */}
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Conectamos ciudadanos con las autoridades ambientales de Garzón,
              Huila. Reporta, sigue y transforma tu municipio.
            </p>

            {/* Redes sociales */}
            <div className="flex items-center gap-4 text-muted-foreground">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="hover:text-primary transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://github.com/ByInalik/ecovoz1.0"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="hover:text-primary transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.02c-3.2.69-3.87-1.35-3.87-1.35-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 012.87-.39c.97 0 1.96.13 2.87.39 2.18-1.49 3.14-1.18 3.14-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.55C20.22 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-primary transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>

            {/* Indicador de estado */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Servicios en línea</span>
            </div>
          </div>

          {/* ══ Columna 2: Producto ══ */}
          <div className="md:col-span-2 md:pt-2 flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
              Producto
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-foreground">
              <li>
                <Link to="/#caracteristicas" className="hover:text-primary transition-colors">
                  Características
                </Link>
              </li>
              <li>
                <Link to="/#como-funciona" className="hover:text-primary transition-colors">
                  Cómo funciona
                </Link>
              </li>
              <li>
                <a
                  href="http://localhost:3000/api-docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Documentación API
                </a>
              </li>
              <li>
                <Link to="/registro" className="hover:text-primary transition-colors">
                  Registrarse
                </Link>
              </li>
            </ul>
          </div>

          {/* ══ Columna 3: Compañía ══ */}
          <div className="md:col-span-2 md:pt-2 flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
              Compañía
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-foreground">
              <li>
                <Link to="/#nosotros" className="hover:text-primary transition-colors">
                  Sobre EcoVoz
                </Link>
              </li>
              <li>
                <Link to="/#contacto" className="hover:text-primary transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/ByInalik/ecovoz1.0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <Link to="/#faq" className="hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* ══ Columna 4: Legal ══ */}
          <div className="md:col-span-3 md:pt-2 flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
              Legal
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-foreground">
              <li>
                <Link to="/privacidad" className="hover:text-primary transition-colors">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link to="/terminos" className="hover:text-primary transition-colors">
                  Términos de servicio
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-primary transition-colors">
                  Política de cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Barra inferior ── */}
        <div className="mt-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm text-muted-foreground">
          <p>© {anio} EcoVoz. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-primary transition-colors">
              Iniciar sesión
            </Link>
            <Link
              to="/registro"
              className="inline-flex items-center gap-1 font-semibold text-foreground hover:text-primary transition-colors group"
            >
              Crear cuenta
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          IMAGEN DECORATIVA — Full width con degradados
      ═══════════════════════════════════════════ */}
      <div className="relative w-full h-56 md:h-72 lg:h-96">
        <img
          src={footerLandscape}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-bottom"
        />

        {/* Degradado superior: funde con el contenido del footer */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-transparent" />

        {/* Viñeta inferior sutil: da profundidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
    </footer>
  );
}