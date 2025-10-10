import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-esthela.webp";
import ShareButtons from "@/components/ShareButtons";

interface HeroSectionProps {
  onCtaClick: () => void;
}

const HeroSection = ({ onCtaClick }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-primary/50 to-primary/40 z-10" />
        <img
          src={heroImage}
          alt="Esthela Damián Peralta"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="container relative z-20 mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance animate-in fade-in slide-in-from-bottom-4 duration-700">
            ¡Súmate al cambio real para Guerrero!
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl mb-8 text-white/95 font-light text-balance animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            Forma parte de la estructura que transformará nuestro estado con honestidad, trabajo y resultados.
          </p>
          <Button
            size="lg"
            onClick={onCtaClick}
            className="bg-accent hover:bg-accent/90 text-primary font-bold text-lg px-8 py-6 rounded-full shadow-2xl hover:scale-105 transition-smooth animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300"
          >
            Quiero unirme
          </Button>
          
          {/* Share buttons */}
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <ShareButtons />
          </div>
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-20" />
    </section>
  );
};

export default HeroSection;
