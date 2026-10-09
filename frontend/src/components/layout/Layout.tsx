import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  ocultarFooter?: boolean;
}

export default function Layout({ children, ocultarFooter = false }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24">{children}</main>
      {!ocultarFooter && <Footer />}
    </div>
  );
}