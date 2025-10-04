import { Quote } from "lucide-react";

const TestimonialSection = () => {
  return (
    <section className="py-16 md:py-24 bg-primary text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <Quote className="w-16 h-16 mx-auto mb-6 text-accent" />
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 text-balance">
            Con Esthela, primero Guerrero y su gente
          </blockquote>
          <cite className="text-lg md:text-xl text-white/90 not-italic">
            — Líder campesino de la región Montaña
          </cite>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
