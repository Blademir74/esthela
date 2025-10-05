import image1 from "@/assets/esthela-8.jpg";
import image2 from "@/assets/esthela-4.jpg";
import image3 from "@/assets/esthela-1.jpg";
import image4 from "@/assets/esthela-10.jpg";
import image5 from "@/assets/esthela-12.jpg";
import image6 from "@/assets/esthela-13.jpg";
import image7 from "@/assets/esthela-14.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ImpactGallery = () => {
  const images = [
    { src: image1, alt: "Esthela Damián trabajando por Guerrero" },
    { src: image2, alt: "Esthela Damián con la comunidad" },
    { src: image3, alt: "Esthela Damián en acción" },
    { src: image4, alt: "Esthela Damián sirviendo a Guerrero" },
    { src: image5, alt: "Esthela Damián con ciudadanos" },
    { src: image6, alt: "Esthela Damián comprometida con el cambio" },
    { src: image7, alt: "Esthela Damián trabajando en comunidad" },
  ];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary text-center mb-12">
            Trabajo y Compromiso con Guerrero
          </h2>
          
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="rounded-xl overflow-hidden shadow-elegant">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-80 object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default ImpactGallery;
