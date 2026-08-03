"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  FileUp,
  MapPin,
  Menu,
  MessageCircleHeart,
  MoveRight,
  Quote,
  Send,
  Shield,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { Cormorant_Garamond, Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const whatsappHref = "https://chat.whatsapp.com/HSUgjqCm69g8vKujvgkNFN";

const routeCards = [
  {
    title: "Soberanía y conectividad",
    text: "Pensar caminos, infraestructura y conectividad con criterio público, presencia territorial y escucha comunitaria.",
    image: "/assets/img/soberania.jpg",
    tag: "Infraestructura",
    tone: "from-[#14324D] via-[#10283F] to-[#0B1F32]",
  },
  {
    title: "Campo y economía comunitaria",
    text: "Dar valor a la tierra, al trabajo local y a la soberanía alimentaria como base de la vida cotidiana en Guerrero.",
    image: "/assets/img/campo.png",
    tag: "Producción",
    tone: "from-[#294936] via-[#1D3428] to-[#13261D]",
  },
  {
    title: "Mujeres e igualdad sustantiva",
    text: "Hacer de la participación de las mujeres una fuerza visible en organización, comunidad y justicia social.",
    image: "/assets/img/foto15.jfif",
    tag: "Igualdad",
    tone: "from-[#7A1F2B] via-[#611825] to-[#45111B]",
  },
  {
    title: "Educación y juventudes",
    text: "Abrir oportunidades, fortalecer vocaciones y defender la educación pública como camino de futuro.",
    image: "/assets/img/juventud.jpg",
    tag: "Juventud",
    tone: "from-[#1B4262] via-[#14344C] to-[#102838]",
  },
  {
    title: "Agua y salud comunitaria",
    text: "Poner en el centro el cuidado, la prevención, el acceso al agua y el bienestar comunitario.",
    image: "/assets/img/agua.jpg",
    tag: "Bienestar",
    tone: "from-[#295F76] via-[#19495D] to-[#113447]",
  },
];

const municipalities = [
  { name: "Acapulco de Juárez", quote: "La organización también se construye en los barrios, en los oficios y en la vida diaria del puerto." },
  { name: "Chilpancingo de los Bravo", quote: "La capital exige cercanía, escucha y una voz pública con sentido de justicia social." },
  { name: "Iguala de la Independencia", quote: "La historia de Guerrero también obliga a pensar soberanía, memoria y presencia institucional." },
  { name: "Zihuatanejo de Azueta", quote: "La costa tiene voz propia y merece una agenda que cuide trabajo, comunidad y territorio." },
  { name: "Chilapa de Álvarez", quote: "El tejido social se defiende acompañando a la comunidad y escuchando su realidad concreta." },
  { name: "Taxco de Alarcón", quote: "La tradición productiva, artesanal y cultural también forma parte del futuro del estado." },
  { name: "Tlapa de Comonfort", quote: "No hay visión completa de Guerrero sin la fuerza y dignidad de la Montaña." },
  { name: "Coyuca de Benítez", quote: "El trabajo del campo sostiene comunidades enteras y merece respeto, organización y horizonte." },
  { name: "Ometepec", quote: "La Costa Chica también se organiza desde la diversidad y la vida comunitaria." },
  { name: "Tecpan de Galeana", quote: "El territorio se defiende mejor cuando la comunidad participa y la producción local se fortalece." },
];

const galleryItems = [
  {
    key: "hero-recorrido",
    image: "/assets/img/galeria/hero-recorrido.jpg",
    title: "Recorrido territorial",
    caption: "Presencia pública con cercanía y ritmo de territorio.",
    className: "md:col-span-6 lg:col-span-5",
    aspect: "aspect-[4/5] md:aspect-[5/6]",
  },
  {
    key: "dialogo-mujeres",
    image: "/assets/img/galeria/dialogo-mujeres.jpg",
    title: "Diálogo con mujeres",
    caption: "Escuchar también es ejercer liderazgo.",
    className: "md:col-span-6 lg:col-span-3",
    aspect: "aspect-[4/5]",
  },
  {
    key: "oratoria-retrato",
    image: "/assets/img/galeria/oratoria-retrato.jpg",
    title: "Voz pública",
    caption: "Oratoria cercana, clara y con presencia.",
    className: "md:col-span-12 lg:col-span-4",
    aspect: "aspect-[16/10] lg:aspect-[4/5]",
  },
  {
    key: "territorio-caminata",
    image: "/assets/img/galeria/territorio-caminata.jpg",
    title: "Comunidad en marcha",
    caption: "La imagen del territorio también comunica legitimidad.",
    className: "md:col-span-7 lg:col-span-7",
    aspect: "aspect-[16/10]",
  },
  {
    key: "asamblea-soberania",
    image: "/assets/img/galeria/asamblea-soberania.jpg",
    title: "Asamblea y soberanía",
    caption: "Un liderazgo que escucha antes de enunciar.",
    className: "md:col-span-5 lg:col-span-5",
    aspect: "aspect-[16/10]",
  },
  {
    key: "multitud-comunidad",
    image: "/assets/img/galeria/multitud-comunidad.jpg",
    title: "Fuerza colectiva",
    caption: "La comunidad como centro del relato político.",
    className: "md:col-span-12 lg:col-span-12",
    aspect: "aspect-[16/9]",
  },
];

type FormState = {
  name: string;
  phone: string;
  email: string;
  idea: string;
};

const initialForm: FormState = {
  name: "",
  phone: "",
  email: "",
  idea: "",
};

const placeholderSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#6B1D3A"/>
      <stop offset="100%" stop-color="#2A0F18"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#g)"/>
  <rect x="60" y="60" width="1080" height="780" rx="40" fill="none" stroke="#D4A843" stroke-opacity="0.55" stroke-width="3"/>
  <circle cx="600" cy="340" r="86" fill="rgba(255,255,255,0.08)" stroke="#D4A843" stroke-width="3"/>
  <text x="600" y="360" text-anchor="middle" fill="#F4EFE6" font-size="54" font-family="Montserrat,Arial,sans-serif" font-weight="800">GE</text>
  <text x="600" y="490" text-anchor="middle" fill="#D4A843" font-size="24" font-family="Montserrat,Arial,sans-serif" font-weight="700" letter-spacing="6">GUERRERO ES CON E</text>
  <text x="600" y="540" text-anchor="middle" fill="#F4EFE6" fill-opacity="0.82" font-size="22" font-family="Georgia,serif">Galería en actualización</text>
</svg>
`)}`;

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);
  const [activeMunicipality, setActiveMunicipality] = useState(municipalities[0]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
  const videoRef = useRef<HTMLVideoElement>(null);

  const digitalHighlights = useMemo(
    () => [
      { label: "Territorio", value: "Recorrido permanente" },
      { label: "Escucha", value: "Asambleas y diálogo" },
      { label: "Imagen", value: "Editorial de alto impacto" },
    ],
    []
  );

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setVideoMuted(videoRef.current.muted);
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSubmitted(false);
    setError("");
    setForm((prev) => ({
      ...prev,
      [name]: name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value,
    }));
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setSubmitted(false);
    if (!selected) {
      setFile(null);
      return;
    }
    const validType = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ].includes(selected.type);
    if (!validType) {
      setError("Solo se permiten archivos PDF o Word.");
      e.target.value = "";
      return;
    }
    if (selected.size > 8 * 1024 * 1024) {
      setError("El archivo supera el máximo de 8MB.");
      e.target.value = "";
      return;
    }
    setError("");
    setFile(selected);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSubmitted(false);

    if (!form.name.trim() || !form.email.trim() || !form.idea.trim()) {
      setError("Completa nombre, email y propuesta.");
      return;
    }
    if (form.phone.length !== 10) {
      setError("El teléfono debe tener 10 dígitos.");
      return;
    }

    const data = new FormData();
    data.append("name", form.name);
    data.append("phone", form.phone);
    data.append("email", form.email);
    data.append("idea", form.idea);
    if (file) data.append("file", file);

    setSubmitting(true);
    try {
      const res = await fetch("/api/ideas", { method: "POST", body: data });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "No se pudo enviar la propuesta.");
      setForm(initialForm);
      setFile(null);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar la propuesta.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={`overflow-x-hidden bg-[#F4EFE6] text-[#1C1A18] ${montserrat.className}`}>
      <style jsx global>{`
        :root {
          --guinda: #6B1D3A;
          --guinda-dark: #2d0d19;
          --marfil: #F4EFE6;
          --oro: #D4A843;
          --tinta: #1C1A18;
        }
        body {
          background: var(--marfil);
        }
        .paper-grain {
          position: relative;
          isolation: isolate;
        }
        .paper-grain::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.3;
          background-image:
            radial-gradient(rgba(107, 29, 58, 0.06) 0.55px, transparent 0.7px),
            radial-gradient(rgba(26, 18, 14, 0.04) 0.4px, transparent 0.6px),
            linear-gradient(180deg, rgba(255,255,255,0.18), rgba(212,168,67,0.04));
          background-size: 14px 14px, 22px 22px, 100% 100%;
          mix-blend-mode: multiply;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(212, 168, 67, 0.42);
          box-shadow: 0 24px 80px rgba(23, 16, 18, 0.12);
        }
        .glass-card-dark {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(212, 168, 67, 0.28);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.24);
        }
        .hero-shell {
          background:
            radial-gradient(circle at 18% 18%, rgba(212, 168, 67, 0.18), transparent 24%),
            radial-gradient(circle at 82% 22%, rgba(255, 255, 255, 0.08), transparent 20%),
            linear-gradient(135deg, #2A0F18 0%, #4A1830 38%, #6B1D3A 100%);
        }
        .hero-overlay {
          background:
            linear-gradient(90deg, rgba(27, 12, 18, 0.94) 0%, rgba(27, 12, 18, 0.7) 42%, rgba(27, 12, 18, 0.28) 100%),
            linear-gradient(180deg, rgba(0, 0, 0, 0.14) 0%, rgba(0, 0, 0, 0.42) 100%);
        }
        .section-title {
          font-family: ${cormorant.style.fontFamily};
        }
        .kicker {
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-size: 11px;
          font-weight: 800;
        }
        .focus-ring:focus-visible {
          outline: 2px solid var(--oro);
          outline-offset: 3px;
        }
        .voice-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(212, 168, 67, 0.55) transparent;
        }
        .voice-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .voice-scroll::-webkit-scrollbar-thumb {
          background: rgba(212, 168, 67, 0.55);
          border-radius: 999px;
        }
      `}</style>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#2A0F18]/78 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="focus-ring flex min-w-0 items-center gap-3 text-white">
            <div className="glass-card-dark relative h-12 w-12 shrink-0 overflow-hidden rounded-full p-1">
              <Image src="/assets/img/logo.png" alt="Logo Por los Caminos del Sur" fill className="object-contain p-1.5" priority />
            </div>
            <div className="min-w-0">
              <p className={`${cormorant.className} truncate text-2xl leading-none text-[#FFF9F1]`}>Esthela Damián</p>
              <p className="mt-1 truncate text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#F0C45E]">Centro de mando digital</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/90 lg:flex">
            <a href="#trayectoria">Trayectoria</a>
            <a href="#rutas">Rutas</a>
            <a href="#territorio">Territorio</a>
            <a href="#galeria">Galería</a>
            <a href="#idea">Tu idea</a>
            <Link href="/tarjetas" className="rounded-full bg-[#D4A843] px-5 py-3 text-[#6B1D3A] shadow-[0_12px_30px_rgba(212,168,67,0.28)]">
              Crea tu póster
            </Link>
          </nav>

          <button
            type="button"
            aria-label="Abrir menú"
            onClick={() => setMenuOpen((v) => !v)}
            className="glass-card-dark rounded-full p-2.5 text-white lg:hidden"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-4 mb-4 rounded-[1.5rem] border border-white/10 bg-[#2A0F18]/95 px-5 py-5 text-white backdrop-blur-xl lg:hidden"
            >
              <nav className="flex flex-col gap-3 text-xs font-extrabold uppercase tracking-[0.16em]">
                {[
                  ["#trayectoria", "Trayectoria"],
                  ["#rutas", "Rutas"],
                  ["#territorio", "Territorio"],
                  ["#galeria", "Galería"],
                  ["#idea", "Tu idea"],
                ].map(([href, label]) => (
                  <a key={href} href={href} onClick={() => setMenuOpen(false)} className="border-b border-white/10 py-2">
                    {label}
                  </a>
                ))}
                <Link href="/tarjetas" onClick={() => setMenuOpen(false)} className="mt-2 rounded-full bg-[#D4A843] px-5 py-3 text-center text-[#6B1D3A]">
                  Crea tu póster
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <section className="hero-shell relative overflow-hidden pt-28 text-white lg:pt-32">
        <div className="absolute inset-0">
          <Image
            src="/assets/img/galeria/hero-recorrido.jpg"
            alt="Esthela Damián recorriendo territorio guerrerense"
            fill
            priority
            className="object-cover object-center opacity-48 mix-blend-luminosity"
            sizes="100vw"
          />
          <video
            ref={videoRef}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${heroReady ? "opacity-22" : "opacity-0"}`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/assets/img/galeria/hero-recorrido.jpg"
            onCanPlay={() => setHeroReady(true)}
          >
            <source src="/assets/img/video1.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay absolute inset-0" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-14 lg:px-8 lg:pb-20">
          <div className="grid gap-10 lg:min-h-[calc(100svh-8rem)] lg:grid-cols-[1.04fr_.96fr] lg:items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D4A843]/35 bg-black/20 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#FFF7EC] backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-[#D4A843]" />
                Guerrero · territorio · justicia social
              </div>

              <h1 className={`${cormorant.className} mt-6 max-w-[11ch] text-[3.2rem] leading-[0.88] text-[#FFF9F1] sm:text-[4.6rem] lg:text-[6.4rem]`}>
                Forjada desde joven en el trabajo comunitario
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-[#FFF7EC]/85 sm:text-lg">
                Una landing editorial de nivel gubernatura para proyectar territorio, autoridad visual, organización y cercanía con una narrativa política contemporánea.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#territorio" className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-[#D4A843] px-6 py-4 text-sm font-extrabold text-[#6B1D3A] shadow-[0_14px_34px_rgba(212,168,67,0.28)] transition hover:-translate-y-0.5">
                  Explorar territorio <ArrowRight size={16} />
                </a>
                <Link href="/tarjetas" className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/8 px-6 py-4 text-sm font-extrabold text-white transition hover:bg-white/14">
                  Crea tu póster social <MessageCircleHeart size={16} />
                </Link>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {digitalHighlights.map((item) => (
                  <div key={item.label} className="glass-card-dark rounded-[1.3rem] px-4 py-4">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#F0C45E]">{item.label}</p>
                    <p className={`${cormorant.className} mt-2 text-2xl text-[#FFF8EF]`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12 }} className="lg:pl-8">
              <div className="relative mx-auto max-w-[38rem]">
                <div className="glass-card-dark relative overflow-hidden rounded-[2rem] p-3 sm:p-4">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                    <Image
                      src="/assets/img/galeria/hero-recorrido.jpg"
                      alt="Esthela Damián caminando con liderazgos y ciudadanía"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 42vw"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_35%,rgba(0,0,0,0.34)_100%)]" />
                  </div>
                </div>

                <div className="glass-card absolute -bottom-6 left-4 max-w-[17rem] rounded-[1.4rem] p-4 text-[#1C1A18] sm:left-6 sm:p-5">
                  <p className="kicker text-[#6B1D3A]">Presencia pública</p>
                  <p className={`${cormorant.className} mt-2 text-3xl leading-none text-[#2B171D]`}>Territorio como centro del mensaje</p>
                </div>

                <div className="glass-card-dark absolute -right-2 top-8 hidden w-52 rounded-[1.4rem] p-3 text-white md:block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1rem]">
                    <Image
                      src="/assets/img/galeria/oratoria-retrato.jpg"
                      alt="Retrato de Esthela Damián en oratoria"
                      fill
                      className="object-cover"
                      sizes="220px"
                    />
                  </div>
                  <p className="mt-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#F0C45E]">Voz política</p>
                </div>

                <button
                  onClick={toggleMute}
                  className="glass-card-dark absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-white"
                >
                  {videoMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  {videoMuted ? "Audio off" : "Audio on"}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="trayectoria" className="paper-grain relative px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.92fr_1.08fr] lg:items-center">
          <div className="relative">
            <div className="glass-card overflow-hidden rounded-[2rem] p-3">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem]">
                <Image
                  src="/assets/img/galeria/dialogo-mujeres.jpg"
                  alt="Esthela Damián dialogando con mujeres en territorio"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 44vw"
                />
              </div>
            </div>
            <div className="glass-card absolute -bottom-6 right-4 rounded-[1.4rem] px-5 py-4 text-[#2B171D] sm:right-6">
              <p className="kicker text-[#6B1D3A]">Trayectoria</p>
              <p className={`${cormorant.className} mt-1 text-2xl`}>Justicia social con arraigo territorial</p>
            </div>
          </div>

          <div>
            <p className="kicker text-[#6B1D3A]">Manifiesto</p>
            <div className="mt-4 h-[3px] w-16 rounded-full bg-[#D4A843]" />
            <h2 className={`${cormorant.className} mt-5 text-4xl leading-tight text-[#241A1C] sm:text-5xl lg:text-[3.6rem]`}>
              Una presencia pública construida desde Guerrero y para Guerrero.
            </h2>
            <div className="mt-7 space-y-5 text-[15px] leading-8 text-[#2B2723]/82 sm:text-base">
              <p>
                Originaria de Chilpancingo y formada en Derecho en la Universidad Autónoma de Guerrero, Esthela Damián ha mantenido una trayectoria ligada al trabajo político y social con raíces guerrerenses, con énfasis en cercanía con la gente, presencia territorial y compromiso con las causas públicas.
              </p>
              <p>
                Su narrativa en territorio —asambleas, recorridos, diálogo con mujeres, juventudes y comunidades— proyecta una idea central: la justicia social no debe comunicarse como consigna vacía, sino como presencia, escucha y organización sostenida.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="rutas" className="relative overflow-hidden bg-[#6B1D3A] px-5 py-20 text-white lg:px-8 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,168,67,0.18),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_20%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 border-b border-white/12 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="kicker text-[#F0C45E]">Rutas del Sur</p>
              <div className="mt-4 h-[3px] w-16 rounded-full bg-[#D4A843]" />
              <h2 className={`${cormorant.className} mt-5 text-4xl leading-tight sm:text-5xl`}>Agenda visual con causas concretas.</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-white/72">
              Un sistema de secciones de alto contraste para comunicar prioridades, territorio y liderazgo con una lógica editorial más sólida.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-12">
            {routeCards.map((item, index) => (
              <article key={item.title} className={`overflow-hidden rounded-[2rem] border border-white/10 bg-[#39121F] ${index === 0 ? "lg:col-span-7" : index === 1 ? "lg:col-span-5" : "lg:col-span-4"}`}>
                <div className={`grid h-full ${index === 0 ? "lg:grid-cols-[1.05fr_.95fr]" : ""}`}>
                  <div className="relative min-h-[250px] overflow-hidden">
                    <Image src={item.image} alt={item.title} fill className="object-cover transition duration-700 hover:scale-105" sizes="(max-width: 1024px) 100vw, 50vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  </div>
                  <div className={`bg-gradient-to-br ${item.tone} p-6 sm:p-7 lg:p-8`}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#F2CF8B]">Ruta 0{index + 1}</span>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-[9px] uppercase tracking-wider text-white/80">{item.tag}</span>
                    </div>
                    <h3 className={`${cormorant.className} mt-5 text-3xl leading-tight`}>{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/82">{item.text}</p>
                    <div className="mt-6 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#F0C45E]">
                      Ver causa <MoveRight size={14} />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="territorio" className="paper-grain relative px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.95fr_1.05fr] lg:items-start">
          <div>
            <p className="kicker text-[#6B1D3A]">Centro de mando territorial</p>
            <div className="mt-4 h-[3px] w-16 rounded-full bg-[#D4A843]" />
            <h2 className={`${cormorant.className} mt-5 text-4xl leading-tight text-[#241A1C] sm:text-5xl lg:text-[3.3rem]`}>
              Mapa político, escucha local y presencia pública.
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-8 text-[#2B2723]/80 sm:text-base">
              Esta sección funciona como centro de mando narrativo: concentra municipios clave, lectura de territorio y una interfaz lista para crecer como plataforma política-digital.
            </p>

            <div className="glass-card mt-7 rounded-[1.8rem] p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between border-b border-[#D4A843]/20 pb-4">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#6B1D3A]">Municipios prioritarios</p>
                  <p className="mt-1 text-sm text-[#544D48]">Selección visual de territorios con voz activa</p>
                </div>
                <div className="rounded-full bg-[#6B1D3A] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#F4EFE6]">
                  10 nodos
                </div>
              </div>

              <div className="voice-scroll grid max-h-[27rem] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                {municipalities.map((item) => (
                  <button
                    key={item.name}
                    onMouseEnter={() => setActiveMunicipality(item)}
                    onClick={() => setActiveMunicipality(item)}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${activeMunicipality.name === item.name ? "border-[#D4A843] bg-[#6B1D3A] text-white shadow-[0_18px_40px_rgba(107,29,58,0.18)]" : "border-[#D4A843]/18 bg-white/65 text-[#2B2723] hover:bg-white"}`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className={`h-4 w-4 ${activeMunicipality.name === item.name ? "text-[#F0C45E]" : "text-[#6B1D3A]"}`} />
                      <span className="font-bold">{item.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-28">
            <div className="glass-card rounded-[2rem] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#6B1D3A]">
                <Sparkles size={12} />
                Territorio activo
              </div>
              <h3 className={`${cormorant.className} mt-4 text-4xl leading-tight text-[#25191E] sm:text-[2.8rem]`}>
                {activeMunicipality.name}
              </h3>
              <div className="my-5 h-px w-14 bg-[#D4A843]/45" />
              <p className={`${cormorant.className} text-[1.55rem] italic leading-9 text-[#3B2530] sm:text-[1.8rem]`}>
                “{activeMunicipality.quote}”
              </p>
              <div className="mt-8 rounded-[1.5rem] bg-[#6B1D3A] px-5 py-4 text-[#F4EFE6]">
                <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#F0C45E]">
                  <Shield size={12} />
                  Voz territorial
                </div>
                <p className="mt-2 text-sm leading-7 text-white/82">
                  Interfaz pensada para que el territorio se vea organizado, legible y políticamente vivo, tanto en escritorio como en móvil.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="galeria" className="relative overflow-hidden bg-[#2A0F18] px-5 py-20 text-white lg:px-8 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(212,168,67,0.16),transparent_20%),radial-gradient(circle_at_90%_80%,rgba(255,255,255,0.06),transparent_18%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 border-b border-white/12 pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="kicker text-[#F0C45E]">Galería editorial</p>
              <div className="mt-4 h-[3px] w-16 rounded-full bg-[#D4A843]" />
              <h2 className={`${cormorant.className} mt-5 text-4xl leading-tight sm:text-5xl`}>Imágenes que sostienen el relato político.</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-white/68">
              Carpeta configurada en <span className="font-bold">/assets/img/galeria/</span>. Si falta una imagen, el componente muestra un placeholder editorial elegante.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-12">
            {galleryItems.map((item) => (
              <motion.article
                key={item.key}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                className={`glass-card-dark overflow-hidden rounded-[2rem] p-2 ${item.className}`}
              >
                <div className={`group relative overflow-hidden rounded-[1.55rem] ${item.aspect}`}>
                  <img
                    src={brokenImages[item.key] ? placeholderSvg : item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    onError={() => setBrokenImages((prev) => ({ ...prev, [item.key]: true }))}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/18 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#F0C45E]">{item.title}</p>
                    <p className={`${cormorant.className} mt-1 text-2xl leading-tight text-[#FFF8F1]`}>{item.caption}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="idea" className="paper-grain relative px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="kicker text-[#6B1D3A]">Participación</p>
            <div className="mx-auto mt-4 h-[3px] w-16 rounded-full bg-[#D4A843]" />
            <h2 className={`${cormorant.className} mt-5 text-4xl leading-tight text-[#241A1C] sm:text-5xl`}>
              Tu idea puede transformar Guerrero
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="glass-card mt-10 rounded-[2rem] p-5 sm:p-7 lg:p-8">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#6B1D3A]">Nombre</span>
                <input name="name" value={form.name} onChange={handleInput} className="focus-ring w-full rounded-2xl border border-[#D4A843]/26 bg-white/90 px-4 py-3 text-sm text-[#241A1C] placeholder:text-[#7C746B]" placeholder="Tu nombre" />
              </label>
              <label className="block">
                <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#6B1D3A]">Teléfono</span>
                <input name="phone" value={form.phone} onChange={handleInput} inputMode="numeric" className="focus-ring w-full rounded-2xl border border-[#D4A843]/26 bg-white/90 px-4 py-3 text-sm text-[#241A1C] placeholder:text-[#7C746B]" placeholder="10 dígitos" />
              </label>
              <label className="block">
                <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#6B1D3A]">Email</span>
                <input name="email" type="email" value={form.email} onChange={handleInput} className="focus-ring w-full rounded-2xl border border-[#D4A843]/26 bg-white/90 px-4 py-3 text-sm text-[#241A1C] placeholder:text-[#7C746B]" placeholder="correo@ejemplo.com" />
              </label>
              <label className="block">
                <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#6B1D3A]">Adjuntar PDF o Word</span>
                <label className="focus-ring flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-[#D4A843]/36 bg-white/88 px-4 py-3 text-sm text-[#241A1C]">
                  <FileUp size={18} className="text-[#D4A843]" />
                  <span className="truncate">{file ? file.name : "PDF o Word · Máx 8MB"}</span>
                  <input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFile} className="hidden" />
                </label>
              </label>
            </div>

            <label className="mt-4 block">
              <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#6B1D3A]">Propuesta</span>
              <textarea name="idea" value={form.idea} onChange={handleInput} rows={6} className="focus-ring w-full rounded-[1.6rem] border border-[#D4A843]/26 bg-white/90 px-4 py-4 text-sm leading-7 text-[#241A1C] placeholder:text-[#7C746B]" placeholder="Comparte tu propuesta para tu comunidad, municipio o región" />
            </label>

            {error && <p className="mt-4 rounded-2xl border border-[#D4A843]/30 bg-[#6B1D3A] px-4 py-3 text-sm text-[#FFF5E2]">{error}</p>}
            {submitted && (
              <p className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-300/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800">
                <CheckCircle2 size={18} /> Tu propuesta fue enviada correctamente.
              </p>
            )}

            <button type="submit" disabled={submitting} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#D4A843] px-6 py-4 text-sm font-extrabold text-[#6B1D3A] shadow-[0_12px_30px_rgba(212,168,67,0.22)] transition hover:bg-[#E4BC61] disabled:opacity-70">
              {submitting ? "Enviando..." : "Enviar propuesta"} <Send size={16} />
            </button>
          </form>
        </div>
      </section>

      <footer className="bg-[#2A0F18] px-5 py-10 text-white lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="glass-card-dark relative h-14 w-14 shrink-0 overflow-hidden rounded-full p-1">
              <Image src="/assets/img/logo.png" alt="Logo Por los Caminos del Sur" fill className="object-contain p-1.5" />
            </div>
            <div>
              <p className={`${cormorant.className} text-3xl text-[#FFF8F1]`}>Esthela Damián</p>
              <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#F0C45E]">Por los Caminos del Sur</p>
              <p className="mt-4 max-w-md text-sm leading-7 text-white/62">
                Interfaz editorial pensada como una casa digital de alto impacto para Guerrero: sobria, territorial y memorable.
              </p>
            </div>
          </div>
          <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/74">
            <p className="mb-3 text-[10px] text-white/40">Contacto</p>
            <div className="flex flex-wrap gap-x-5 gap-y-3">
              <a href="https://www.facebook.com/estheladamian/?locale=es_LA" target="_blank" rel="noreferrer">Facebook</a>
              <a href="https://www.instagram.com/estheladamian/?hl=en" target="_blank" rel="noreferrer">Instagram</a>
              <a href={whatsappHref} target="_blank" rel="noreferrer">WhatsApp</a>
              <a href="mailto:Miperfilpoliticogro@proton.me">Contacto</a>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-5 text-[10px] leading-relaxed text-white/42">
          © {new Date().getFullYear()} Por los Caminos del Sur. #PorlosCaminosdelSur · Guerrero · organización territorial · justicia social
        </div>
      </footer>

      <a href={whatsappHref} target="_blank" rel="noreferrer" className="focus-ring fixed bottom-4 right-4 z-[70] inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-extrabold text-[#102117] shadow-[0_18px_45px_rgba(37,211,102,0.35)] transition hover:-translate-y-0.5">
        <MessageCircleHeart size={18} /> Dudas por WhatsApp
      </a>
    </main>
  );
}
