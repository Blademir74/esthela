import { CheckCircle } from "lucide-react";
import claudiaImage from "@/assets/esthela-claudia.jpg";

const ProposalSection = () => {
  const proposals = [
    "Más de 20 años de servicio, resultados y trabajo con la gente",
    "De la Montaña a la transformación de Guerrero",
    "Experiencia comprobada como diputada local y federal",
    "Comprometida con paz, justicia y crecimiento para nuestro estado"
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Bio */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
                Conoce mi historia
              </h2>
              <p className="text-lg leading-relaxed text-foreground/90">
                Soy orgullosamente guerrerense, forjada desde joven en el trabajo comunitario y con más de 20 años de experiencia transformando realidades.
              </p>
              <p className="text-lg leading-relaxed text-foreground/90">
                He sido diputada local, federal y servidora pública con resultados. Hoy, impulsada por valores y junto al equipo de la Dra. Claudia Sheinbaum, quiero invitarte a sumar tu voz y acciones para que el futuro de Guerrero esté en nuestras manos, con paz, justicia y crecimiento.
              </p>
            </div>

            {/* Proposals */}
            <div className="bg-card rounded-2xl p-8 shadow-elegant">
              <h3 className="text-2xl font-bold text-primary mb-6">Por qué sumarme</h3>
              <ul className="space-y-4">
                {proposals.map((proposal, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-accent shrink-0 mt-1" />
                    <span className="text-foreground/90 leading-relaxed">{proposal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Imagen con la Presidenta Claudia */}
          <div className="mt-12">
            <div className="rounded-2xl overflow-hidden shadow-elegant">
              <img
                src={claudiaImage}
                alt="Esthela Damián con la Presidenta Claudia Sheinbaum"
                className="w-full h-auto"
              />
            </div>
            <p className="text-center text-lg text-foreground/80 mt-4 font-semibold">
              Junto a la Dra. Claudia Sheinbaum, trabajando por el futuro de México y Guerrero
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProposalSection;
