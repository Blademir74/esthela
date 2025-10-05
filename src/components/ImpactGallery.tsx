import image1 from "@/assets/esthela-8.jpg";
import image2 from "@/assets/esthela-4.jpg";
import image3 from "@/assets/esthela-1.jpg";

const ImpactGallery = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary text-center mb-12">
            Trabajo y Compromiso con Guerrero
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-xl overflow-hidden shadow-elegant hover:scale-105 transition-smooth">
              <img
                src={image1}
                alt="Esthela Damián trabajando por Guerrero"
                className="w-full h-80 object-cover"
              />
            </div>
            
            <div className="rounded-xl overflow-hidden shadow-elegant hover:scale-105 transition-smooth">
              <img
                src={image2}
                alt="Esthela Damián con la comunidad"
                className="w-full h-80 object-cover"
              />
            </div>
            
            <div className="rounded-xl overflow-hidden shadow-elegant hover:scale-105 transition-smooth">
              <img
                src={image3}
                alt="Esthela Damián en acción"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactGallery;
