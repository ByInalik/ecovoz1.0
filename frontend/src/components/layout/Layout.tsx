import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  /** Si es true, oculta el footer (útil para dashboards) */
  ocultarFooter?: boolean;
}

export default function Layout({ children, ocultarFooter = false }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      {!ocultarFooter && <Footer />}
    </div>
  );
}