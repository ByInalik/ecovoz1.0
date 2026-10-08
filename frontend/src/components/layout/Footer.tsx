import { Link } from 'react-router-dom';
import { Leaf, Mail, MapPin, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Marca */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-primary">EcoVoz</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Sistema colaborativo de reportes ambientales para el municipio de Garzón, Huila.
            </p>
          </div>

          {/* Enlaces */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Proyecto</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
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
                <Link to="/#contacto" className="hover:text-primary transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Recursos</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="http://localhost:3000/api-docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  Documentación API
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/ByInalik/ecovoz1.0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  Repositorio GitHub
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Contacto</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Garzón, Huila, Colombia
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                contacto@ecovoz.com
              </li>
            </ul>
          </div>
        </div>

        {/* Pie inferior */}
        <div className="border-t mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} EcoVoz - Proyecto ADSO SENA
          </p>
          <p className="text-center md:text-right">
            Desarrollado por <span className="text-primary font-medium">Michael Hernández</span> y{' '}
            <span className="text-primary font-medium">Andrés López</span>
          </p>
        </div>
      </div>
    </footer>
  );
}