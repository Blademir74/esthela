import { Facebook, Instagram } from "lucide-react";

const SocialMediaSection = () => {
  const socialLinks = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/estheladamian",
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
    },
    {
      name: "WhatsApp",
      url: "https://wa.me/527474795833",
      icon: () => (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      ),
      color: "hover:text-[#25D366]"
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
