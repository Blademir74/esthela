import { Shield } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="flex items-center justify-center gap-2 text-white/90">
            <Shield className="w-5 h-5" />
            <span className="text-sm">
              Tus datos están protegidos y solo serán usados para contacto político
            </span>
          </div>
          
          <div className="pt-6 border-t border-white/20">
            <p className="text-sm text-white/80">
              © {currentYear} Esthela Damián Peralta. Todos los derechos reservados.
            </p>
            <p className="text-xs text-white/60 mt-2">
              Estructura política Guerrero 2027
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
