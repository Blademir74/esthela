import { Facebook, Instagram } from "lucide-react";

const SocialMediaSection = () => {
  const socialLinks = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/estheladamian?locale=es_LA",
      icon: Facebook,
      color: "hover:text-[#1877F2]"
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/estheladamian/?hl=es",
      icon: Instagram,
      color: "hover:text-[#E4405F]"
    },
    {
      name: "X / Twitter",
      url: "https://x.com/esthela_damian",
      icon: () => (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      color: "hover:text-foreground"
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Mantente conectado
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Sígueme en redes sociales y entérate de las últimas noticias
          </p>
          
          <div className="flex justify-center items-center gap-8 flex-wrap">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex flex-col items-center gap-2 transition-smooth ${link.color}`}
                  aria-label={link.name}
                >
                  <div className="w-16 h-16 rounded-full bg-card shadow-lg flex items-center justify-center group-hover:scale-110 transition-smooth">
                    <Icon />
                  </div>
                  <span className="text-sm font-semibold text-foreground/70 group-hover:text-foreground">
                    {link.name}
                  </span>
                </a>
              );
            })}
          </div>

          <div className="mt-12 p-6 bg-card rounded-xl shadow-md">
            <p className="text-base text-foreground/90">
              <strong>¿Dudas o quieres apoyar más?</strong>
              <br />
              Escríbenos y con gusto te atenderemos
              <br />
              <a 
                href="mailto:despiertatupoder74@gmail.com" 
                className="text-primary hover:text-primary/80 font-semibold underline transition-smooth mt-2 inline-block"
              >
                despiertatupoder74@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialMediaSection;
