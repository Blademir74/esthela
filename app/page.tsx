"use client";

import Image from "next/image";
import Link from "next/link";
import { Montserrat } from "next/font/google";
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
import { ChangeEvent, FormEvent, useRef, useState } from "react";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["800", "900"],
  variable: "--font-montserrat",
});

const serifStyle = { fontFamily: "var(--font-playfair), Georgia, serif" };

const whatsappHref = "https://chat.whatsapp.com/HSUgjqCm69g8vKujvgkNFN";

const routes = [
  {
    title: "Soberanía y conectividad",
    text: "Pensar caminos, infraestructura y conectividad con criterio público y escuchando a las comunidades.",
    image: "/assets/img/soberania.jpg",
    tag: "Infraestructura",
    tone: "from-[#133B5C] to-[#0D2940]",
  },
  {
    title: "Campo y economía comunitaria",
    text: "Fortalecer el trabajo de la tierra, el valor local y la soberanía alimentaria desde el territorio.",
    image: "/assets/img/campo.png",
    tag: "Producción",
    tone: "from-[#244C3A] to-[#11231D]",
  },
  {
    title: "Mujeres e igualdad sustantiva",
    text: "Abrir espacios de organización y derechos con una imagen de cercanía real en territorio.",
    image: "/assets/img/foto15.jfif",
    tag: "Igualdad",
    tone: "from-[#7A1F2B] to-[#4A0F18]",
  },
  {
    title: "Educación y juventudes",
    text: "Defender la educación pública y las oportunidades para que el futuro se construya desde Guerrero.",
    image: "/assets/img/juventud.jpg",
    tag: "Juventud",
    tone: "from-[#15395C] to-[#10293E]",
  },
  {
    title: "Agua y salud comunitaria",
    text: "Poner el cuidado, la prevención y el acceso al agua en el centro de la conversación pública.",
    image: "/assets/img/agua.jpg",
    tag: "Bienestar",
    tone: "from-[#285B72] to-[#133B5C]",
  },
];

const voices = [
  { name: "Acapulco de Juárez", quote: "Organizarnos es defender lo nuestro. Aquí la transformación late con fuerza popular y cercanía." },
  { name: "Chilpancingo de los Bravo", quote: "Escuchar también transforma. La capital se organiza desde sus barrios con conversación permanente." },
  { name: "Iguala de la Independencia", quote: "El futuro se conversa y se organiza. La historia también nos llama a defender la soberanía nacional." },
  { name: "Zihuatanejo de Azueta", quote: "Desde la costa abrimos camino. La vida del litoral también merece presencia y organización." },
  { name: "Chilapa de Álvarez", quote: "Nuestras raíces sostienen el territorio. La comunidad también es una forma de futuro." },
  { name: "Taxco de Alarcón", quote: "El porvenir se construye caminando y escuchando. La tradición productiva también tiene voz." },
  { name: "Tlapa de Comonfort", quote: "La Montaña habla con dignidad popular. No hay transformación sin pueblos originarios y escucha real." },
  { name: "Coyuca de Benítez", quote: "El campo es la base de la soberanía. La economía comunitaria merece cuidado y continuidad." },
  { name: "Ometepec", quote: "La Costa Chica también organiza su horizonte. Igualdad y comunidad deben caminar juntas." },
  { name: "Tecpan de Galeana", quote: "La soberanía alimentaria nace en la tierra trabajada con respeto y organización local." },
  { name: "Atoyac de Álvarez", quote: "Historia, café y memoria en cada camino serrano. La dignidad no se negocia." },
  { name: "Ayutla de los Libres", quote: "La asamblea decide y el territorio responde. La organización comunitaria es fuerza viva." },
  { name: "Eduardo Neri", quote: "Los recursos y el desarrollo deben pensarse desde el bien común y la voz de su gente." },
  { name: "Teloloapan", quote: "La voz del norte guerrerense es firme. La organización social es motor y resguardo." },
  { name: "Tixtla de Guerrero", quote: "La educación pública y la memoria histórica sostienen el mañana." },
  { name: "San Luis Acatlán", quote: "La justicia comunitaria y la organización territorial son una lección de soberanía cotidiana." },
  { name: "Tecoanapa", quote: "El agua y la salud básica son derechos colectivos, no privilegios." },
  { name: "Petatlán", quote: "Cuidar bosques, ríos y comunidad es defender el futuro ecológico y social de Guerrero." },
  { name: "Huitzuco de los Figueroa", quote: "Cultura, siembra y memoria siguen ordenando la vida del territorio." },
  { name: "San Marcos", quote: "Las juventudes activas organizan el mañana desde el territorio y sus propias ideas." },
];

const gallery = [
  {
    image: "/assets/img/galeria/foto2.jfif",
    title: "Escucha activa",
    desc: "Diálogo directo con la comunidad.",
    className: "md:col-span-6 lg:col-span-5",
    aspect: "aspect-[4/5] md:aspect-[5/6]",
  },
  {
    image: "/assets/img/galeria/foto17.jfif",
    title: "Presencia territorial",
    desc: "Recorrido a pie por los municipios.",
    className: "md:col-span-6 lg:col-span-4",
    aspect: "aspect-[4/5]",
  },
  {
    image: "/assets/img/galeria/foto22.jfif",
    title: "Comunidad organizada",
    desc: "Encuentros directos con la gente.",
    className: "md:col-span-12 lg:col-span-3",
    aspect: "aspect-[16/10] lg:aspect-[4/5]",
  },
  {
    image: "/assets/img/galeria/foto29.jpg",
    title: "Recorrido en territorio",
    desc: "Cercanía, conversación y método.",
    className: "md:col-span-7 lg:col-span-7",
    aspect: "aspect-[16/10]",
  },
  {
    image: "/assets/img/galeria/foto.jpg",
    title: "Guerrero en movimiento",
    desc: "Cada región con su propia causa.",
    className: "md:col-span-5 lg:col-span-5",
    aspect: "aspect-[16/10]",
  },
];

type FormState = {
  name: string;
  phone: string;
  email: string;
  idea: string;
};

const initialForm: FormState = { name: "", phone: "", email: "", idea: "" };

function GalleryPhoto({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="placeholder-guinda flex h-full w-full flex-col items-center justify-center gap-3 text-white">
        <div className="glass-gold relative h-14 w-14 overflow-hidden rounded-full p-1.5">
          <Image src="/assets/img/logo.png" alt="Logo Guerrero es con E" fill className="object-contain p-1" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4A843]">Guerrero es con E</p>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover transition duration-700 group-hover:scale-105"
      sizes="(max-width: 768px) 100vw, 50vw"
      onError={() => setFailed(true)}
    />
  );
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);
  const [activeVoice, setActiveVoice] = useState(voices[0]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setVideoMuted(videoRef.current.muted);
  };

  const onInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSubmitted(false);
    setError("");
    setForm((prev) => ({
      ...prev,
      [name]: name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value,
    }));
  };

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
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

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
    <main className="overflow-x-hidden bg-[#F4EFE6] text-[#1E1E1C] selection:bg-[#7A1F2B] selection:text-white">
      <style jsx global>{`
        .paper-grain{position:relative;isolation:isolate}
        .paper-grain:before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.34;background-image:radial-gradient(rgba(122,31,43,.06) .55px, transparent .65px),radial-gradient(rgba(17,35,29,.04) .45px, transparent .55px),linear-gradient(180deg, rgba(255,255,255,.18), rgba(212,168,67,.05));background-size:12px 12px,18px 18px,100% 100%;mix-blend-mode:multiply}
        .glass-gold{background:rgba(255,255,255,.8);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(212,168,67,.45);box-shadow:0 24px 60px rgba(17,35,29,.16)}
        .placeholder-guinda{background:linear-gradient(155deg,#7A1F2B 0%,#4A0F18 100%)}
        .hero-overlay{background:linear-gradient(90deg,rgba(7,10,11,.92) 0%,rgba(23,12,16,.78) 38%,rgba(8,10,11,.60) 68%,rgba(8,10,11,.66) 100%),linear-gradient(180deg,rgba(0,0,0,.08) 0%,rgba(0,0,0,.58) 100%),radial-gradient(circle at 18% 22%,rgba(212,168,67,.20),transparent 28%)}
        .gold-line{height:3px;width:4rem;border-radius:999px;background:#D4A843}
        .focus-ring:focus-visible{outline:2px solid #D4A843;outline-offset:3px}
        .voice-scroll{scrollbar-width:thin;scrollbar-color:rgba(212,168,67,.55) transparent}
        .voice-scroll::-webkit-scrollbar{width:8px}.voice-scroll::-webkit-scrollbar-thumb{background:rgba(212,168,67,.55);border-radius:999px}
      `}</style>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-[#0d1113]/45 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-5 lg:px-8 lg:py-4">
          <Link href="/" className="focus-ring flex min-w-0 items-center gap-3 text-white">
            <div className="glass-gold relative h-11 w-11 shrink-0 overflow-hidden rounded-full p-1 sm:h-12 sm:w-12">
              <Image src="/assets/img/logo.png" alt="Logo Por los Caminos del Sur" fill className="object-contain p-1.5" priority />
            </div>
            <div className="min-w-0">
              <span className="block truncate text-lg leading-none text-[#FFFDF8] sm:text-xl" style={serifStyle}>
                Esthela Damián
              </span>
              <span className="mt-1 block truncate text-[9px] font-bold uppercase tracking-[0.18em] text-[#D4A843] sm:text-[10px]">
                Por los Caminos del Sur
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-[11px] font-bold uppercase tracking-[0.18em] text-white/90 lg:flex">
            <a href="#manifiesto">Manifiesto</a>
            <a href="#rutas">Rutas</a>
            <a href="#voces">Voces</a>
            <a href="#galeria">Galería</a>
            <a href="#idea">Tu idea</a>
            <Link href="/tarjetas" className="rounded-full bg-[#D4A843] px-5 py-3 text-[#5D1324]">Crea tu póster</Link>
          </nav>

          <button
            type="button"
            aria-label="Abrir menú"
            onClick={() => setMenuOpen((v) => !v)}
            className="glass-gold rounded-full p-2.5 text-[#7A1F2B] lg:hidden"
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
              className="mx-4 mb-4 rounded-[1.5rem] border border-white/10 bg-[#11231D]/95 px-5 py-5 text-white backdrop-blur-xl lg:hidden"
            >
              <nav className="flex flex-col gap-3 text-xs font-bold uppercase tracking-[0.16em]">
                {[
                  ["#manifiesto", "Manifiesto"],
                  ["#rutas", "Rutas"],
                  ["#voces", "Voces"],
                  ["#galeria", "Galería"],
                  ["#idea", "Tu idea"],
                ].map(([href, label]) => (
                  <a key={href} href={href} onClick={() => setMenuOpen(false)} className="border-b border-white/10 py-2">
                    {label}
                  </a>
                ))}
                <Link href="/tarjetas" onClick={() => setMenuOpen(false)} className="mt-2 rounded-full bg-[#D4A843] px-5 py-3 text-center text-[#5D1324]">
                  Crea tu póster
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <section className="relative min-h-[100svh] overflow-hidden bg-[#11231D] pt-24 sm:pt-28 lg:pt-24">
        <Image
          src="/assets/img/foto28.jpg"
          alt="Esthela Damián recorriendo Guerrero"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${heroReady ? "opacity-100" : "opacity-0"}`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/assets/img/foto28.jpg"
          onCanPlay={() => setHeroReady(true)}
        >
          <source src="/assets/img/video1.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F4EFE6] to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-12 sm:px-5 sm:pb-16 lg:px-8 lg:pb-20">
          <div className="grid gap-6 lg:min-h-[calc(100svh-8rem)] lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:gap-10">
            <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D4A843]/35 bg-black/20 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#F4EFE6] backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-[#D4A843]" />
                Guerrero · territorio activo · Aspirante a la Coordinación
              </div>

              <div className="mt-5 max-w-3xl rounded-[1.8rem] border border-white/10 bg-black/16 p-4 backdrop-blur-[2px] sm:p-6 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
                <h1 className={`${montserrat.className} max-w-[13ch] text-[2.5rem] font-extrabold leading-[1.02] text-[#FFFDF8] sm:text-[3.6rem] lg:text-[4.6rem]`}>
                  Forjada desde joven en el trabajo comunitario
                </h1>
                <p className="mt-5 max-w-xl text-sm leading-7 text-[#F4EFE6]/90 sm:text-base sm:leading-8 lg:text-lg" style={serifStyle}>
                  Desde los quince años en territorio guerrerense, cuarenta años de trabajo comunitario respaldan esta etapa como aspirante a la Coordinación de Guerrero.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <a href="#voces" className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-[#D4A843] px-6 py-4 text-sm font-bold text-[#5D1324] transition hover:-translate-y-0.5 hover:bg-[#FFF7E2]">
                    Conoce las voces del Sur <ArrowRight size={16} />
                  </a>
                  <Link href="/tarjetas" className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/10">
                    Crea tu póster social <MessageCircleHeart size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.aside initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12 }} className="lg:pl-10">
              <div className="glass-gold rounded-[1.8rem] p-4 sm:p-5 lg:ml-auto lg:max-w-md">
                <div className="flex items-center justify-between border-b border-[#11231D]/10 pb-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7A1F2B]">Recorrido territorial</p>
                  <button onClick={toggleMute} className="rounded-full bg-[#11231D]/8 p-2 text-[#11231D] transition hover:bg-[#11231D]/16" title={videoMuted ? "Activar audio" : "Silenciar"}>
                    {videoMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#11231D]/78" style={serifStyle}>
                  Acapulco, Chilpancingo y Taxco forman parte del recorrido donde Esthela Damián escucha directamente a las comunidades de Guerrero.
                </p>
                <div className="mt-5 overflow-hidden rounded-[1.4rem] border border-[#D4A843]/35">
                  <div className="relative aspect-[16/10]">
                    <Image
                      src="/assets/img/foto17.jfif"
                      alt="Esthela interactuando con personas en territorio guerrerense"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      <section id="manifiesto" className="paper-grain relative overflow-hidden px-5 py-18 sm:px-5 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
          <div className="relative">
            <div className="rounded-[2rem] border border-[#D7CCBC]/60 bg-white/70 p-2 shadow-[0_24px_60px_rgba(17,35,29,.10)]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem]">
                <Image src="/assets/img/foto29.jpg" alt="Esthela Damián en diálogo con vecinas y vecinos" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 45vw" />
              </div>
            </div>
            <div className="glass-gold absolute -bottom-6 left-4 right-4 rounded-[1.5rem] p-4 text-[#11231D] sm:left-8 sm:right-8 sm:p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7A1F2B]">Organización territorial</p>
              <p className="mt-2 text-sm leading-6">Caminar, escuchar y defender lo nuestro como método político y lenguaje visual.</p>
            </div>
          </div>
          <div className="pt-8 lg:pt-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#7A1F2B]">Manifiesto</p>
            <div className="gold-line my-4" />
            <h2 className={`${montserrat.className} text-4xl font-extrabold leading-tight text-[#11231D] sm:text-5xl lg:text-[3.45rem]`}>
              Caminar Guerrero es escuchar su historia, su fuerza y sus causas.
            </h2>
            <div className="mt-7 space-y-5 text-[15px] leading-7 text-[#1E1E1C]/80 sm:text-base sm:leading-8" style={serifStyle}>
              <p>A los quince años, Esthela Damián comenzó su trabajo comunitario en las calles y comunidades de Guerrero. Continúa hoy, después de cuarenta años de trayectoria.</p>
              <p className="font-semibold text-[#11231D]">Egresada de la Universidad Autónoma de Guerrero, construyó su formación en las aulas públicas y en la defensa de la justicia social.</p>
              <p>De la Costa Grande a la Montaña, de la Costa Chica a Tierra Caliente, su presencia en el territorio guerrerense sostiene una relación directa con la gente y sus causas.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="rutas" className="relative overflow-hidden bg-[#11231D] px-5 py-18 text-white sm:px-5 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4A843]">Rutas del Sur</p>
              <div className="gold-line my-4" />
              <h2 className={`${montserrat.className} text-4xl font-extrabold leading-tight sm:text-5xl`}>Cinco rutas. Un mismo horizonte.</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-white/70" style={serifStyle}>Cinco ejes de trabajo territorial que ordenan la agenda pública de Esthela Damián en Guerrero.</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-12">
            {routes.map((route, index) => (
              <article key={route.title} className={`overflow-hidden rounded-[2rem] border border-[#D4A843]/20 bg-[#0E171B] shadow-[0_20px_50px_rgba(0,0,0,.3)] ${index === 0 ? "lg:col-span-7" : index === 1 ? "lg:col-span-5" : "lg:col-span-4"}`}>
                <div className={`grid h-full ${index === 0 ? "lg:grid-cols-[1.05fr_.95fr]" : ""}`}>
                  <div className="relative min-h-[240px] overflow-hidden">
                    <Image src={route.image} alt={route.title} fill className="object-cover transition duration-700 hover:scale-105" sizes="(max-width: 1024px) 100vw, 50vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  </div>
                  <div className={`bg-gradient-to-br ${route.tone} p-6 sm:p-7 lg:p-8`}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F2CF8B]">Ruta 0{index + 1}</span>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-[9px] uppercase tracking-wider text-white/80">{route.tag}</span>
                    </div>
                    <h3 className={`${montserrat.className} mt-5 text-2xl font-extrabold leading-tight sm:text-3xl`}>{route.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/84" style={serifStyle}>{route.text}</p>
                    <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#D4A843]">Organizar el Sur <MoveRight size={14} /></div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="paper-grain border-y border-[#D7CCBC]/50 px-5 py-18 sm:px-5 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div className="rounded-[2rem] bg-[#11231D] p-7 text-white shadow-[0_28px_70px_rgba(17,35,29,.22)] sm:p-9">
            <div className="flex items-center gap-3 text-[#D4A843]"><Quote size={20} /><span className="text-[10px] font-bold uppercase tracking-[0.2em]">Señal de Recorrido</span></div>
            <h2 className={`${montserrat.className} mt-5 text-3xl font-extrabold leading-tight sm:text-4xl`}>Una política que camina y escucha comunidad.</h2>
            <p className="mt-5 text-sm leading-7 text-white/74" style={serifStyle}>En cada comunidad, el trabajo territorial de Esthela Damián se sostiene en el diálogo directo con la gente y en la defensa de las causas propias de cada región de Guerrero.</p>
            <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5 text-[11px] uppercase tracking-[0.2em] text-[#D4A843]">
              <Shield size={14} /> territorio · comunidad · soberanía
            </div>
          </div>
          <div className="rounded-[2rem] border border-[#D7CCBC]/60 bg-white/80 p-2 shadow-[0_24px_60px_rgba(17,35,29,.10)]">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem]">
              <Image src="/assets/img/foto22.jfif" alt="Esthela conviviendo con la gente en Guerrero" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 45vw" />
            </div>
          </div>
        </div>
      </section>

      <section id="voces" className="relative overflow-hidden bg-[#244C3A] px-5 py-18 text-white sm:px-5 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div className="glass-gold rounded-[2rem] p-4 text-[#11231D] sm:p-6">
            <div className="mb-5 flex items-center justify-between border-b border-[#11231D]/12 pb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7A1F2B]">Mapa de Voces</p>
                <p className="mt-1 text-xs text-[#11231D]/60">20 municipios prioritarios</p>
              </div>
              <span className="rounded-full bg-[#11231D]/8 px-3 py-1 text-[9px] uppercase tracking-wider text-[#11231D]/75">Cartografía viva</span>
            </div>
            <div className="voice-scroll grid max-h-[26rem] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
              {voices.map((item, idx) => (
                <button key={item.name} onMouseEnter={() => setActiveVoice(item)} onClick={() => setActiveVoice(item)} className={`rounded-xl border px-4 py-3 text-left text-xs transition ${activeVoice.name === item.name ? "border-[#D4A843] bg-[#D4A843]/12" : "border-[#11231D]/10 bg-white/40 hover:bg-white/70"}`}>
                  <div className="flex items-center gap-2"><MapPin className={`h-3.5 w-3.5 ${activeVoice.name === item.name ? "text-[#7A1F2B]" : "text-[#11231D]/40"}`} /><span className="font-bold text-[#11231D]">{item.name}</span></div>
                  <div className="mt-2 text-[10px] text-[#11231D]/45">Nodo {String(idx + 1).padStart(2, "0")}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="lg:sticky lg:top-28">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4A843]">Voz seleccionada</p>
            <div className="gold-line my-4" />
            <h2 className={`${montserrat.className} text-4xl font-extrabold leading-tight sm:text-5xl`}>Territorio activo, relato activo.</h2>
            <p className="mt-5 text-sm leading-7 text-white/72" style={serifStyle}>Cada municipio aporta una causa propia a la agenda territorial de Esthela Damián.</p>
            <AnimatePresence mode="wait">
              <motion.div key={activeVoice.name} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} className="glass-gold mt-7 rounded-[2rem] p-6 text-[#11231D] sm:p-8">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#7A1F2B]"><Sparkles size={12} /> Municipio escuchado</div>
                <h3 className={`${montserrat.className} mt-3 text-2xl font-extrabold sm:text-3xl`}>{activeVoice.name}</h3>
                <div className="my-5 h-px w-12 bg-[#11231D]/15" />
                <p className="text-[1.25rem] italic leading-8 text-[#11231D] sm:text-[1.55rem] sm:leading-9" style={serifStyle}>“{activeVoice.quote}”</p>
                <div className="mt-7 flex items-center justify-between gap-3 border-t border-[#11231D]/12 pt-4 text-[10px] uppercase tracking-[0.16em] text-[#11231D]/50">
                  <span className="flex items-center gap-1.5"><Shield size={12} className="text-[#7A1F2B]" /> Nodo territorial activo</span>
                  <span>Por los Caminos del Sur</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section id="galeria" className="paper-grain border-b border-[#D7CCBC]/50 px-5 py-18 sm:px-5 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 border-b border-[#D7CCBC]/60 pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#7A1F2B]">Galería territorial</p>
              <div className="gold-line my-4" />
              <h2 className={`${montserrat.className} text-4xl font-extrabold leading-tight text-[#11231D] sm:text-5xl`}>El sur no se explica desde lejos.</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#1E1E1C]/65" style={serifStyle}>Fotografías del recorrido de Esthela Damián por comunidades de Guerrero.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-12">
            {gallery.map((item) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                className={`overflow-hidden rounded-[2rem] border border-[#D4A843]/30 bg-white/80 p-2 shadow-[0_18px_45px_rgba(17,35,29,.12)] ${item.className}`}
              >
                <div className={`group relative overflow-hidden rounded-[1.5rem] ${item.aspect}`}>
                  <GalleryPhoto src={item.image} alt={item.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/18 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4A843]">{item.title}</p>
                    <p className="mt-1 text-lg leading-tight" style={serifStyle}>{item.desc}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="idea" className="relative overflow-hidden bg-[#133B5C] px-5 py-18 text-white sm:px-5 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className={`${montserrat.className} text-4xl font-extrabold leading-tight sm:text-5xl lg:text-[3.4rem]`}>Tu idea puede transformar Guerrero</h2>
        </div>

        <div className="mx-auto mt-10 max-w-2xl">
          <form onSubmit={onSubmit} className="glass-gold rounded-[2rem] p-5 text-[#11231D] sm:p-7">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-[#7A1F2B]">Nombre</span>
                <input name="name" value={form.name} onChange={onInput} className="focus-ring w-full rounded-2xl border border-[#11231D]/15 bg-white/70 px-4 py-3 text-sm text-[#11231D] placeholder:text-[#11231D]/40" placeholder="Tu nombre" />
              </label>
              <label className="block">
                <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-[#7A1F2B]">Teléfono</span>
                <input name="phone" value={form.phone} onChange={onInput} inputMode="numeric" className="focus-ring w-full rounded-2xl border border-[#11231D]/15 bg-white/70 px-4 py-3 text-sm text-[#11231D] placeholder:text-[#11231D]/40" placeholder="10 dígitos" />
              </label>
              <label className="block">
                <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-[#7A1F2B]">Email</span>
                <input name="email" type="email" value={form.email} onChange={onInput} className="focus-ring w-full rounded-2xl border border-[#11231D]/15 bg-white/70 px-4 py-3 text-sm text-[#11231D] placeholder:text-[#11231D]/40" placeholder="correo@ejemplo.com" />
              </label>
              <label className="block">
                <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-[#7A1F2B]">Documento adjunto</span>
                <label className="focus-ring flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-[#11231D]/25 bg-white/50 px-4 py-3 text-sm text-[#11231D]/85">
                  <FileUp size={18} className="text-[#7A1F2B]" />
                  <span className="truncate">{file ? file.name : "PDF o Word · Máx 8MB"}</span>
                  <input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={onFile} className="hidden" />
                </label>
              </label>
            </div>
            <label className="mt-4 block">
              <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-[#7A1F2B]">Tu propuesta</span>
              <textarea name="idea" value={form.idea} onChange={onInput} rows={6} className="focus-ring w-full rounded-[1.5rem] border border-[#11231D]/15 bg-white/70 px-4 py-3 text-sm leading-7 text-[#11231D] placeholder:text-[#11231D]/40" placeholder="Comparte tu idea para tu comunidad o tu región..." />
            </label>

            {error && <p className="mt-4 rounded-2xl border border-[#D4A843]/30 bg-[#7A1F2B]/12 px-4 py-3 text-sm text-[#7A1F2B]">{error}</p>}
            {submitted && (
              <p className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
                <CheckCircle2 size={18} /> Tu idea se envió correctamente.
              </p>
            )}

            <button type="submit" disabled={submitting} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#D4A843] px-6 py-4 text-sm font-bold text-[#5D1324] transition hover:bg-[#F2CF8B] disabled:opacity-70">
              {submitting ? "Enviando..." : "Enviar propuesta"} <Send size={16} />
            </button>
          </form>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#1A0A0E] px-5 py-18 text-white sm:px-5 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4A843]">Póster social</p>
            <h2 className={`${montserrat.className} mt-4 text-4xl font-extrabold leading-tight sm:text-5xl`}>Una pieza compartible con identidad de alta gama.</h2>
            <p className="mt-5 text-sm leading-7 text-white/72" style={serifStyle}>Sube tu foto, elige una frase y comparte tu propio póster con el universo visual de Esthela Damián.</p>
            <Link href="/tarjetas" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#D4A843] px-6 py-4 text-sm font-bold text-[#5D1324]">
              Ir al generador de póster <ArrowRight size={16} />
            </Link>
          </div>
          <div className="flex justify-center">
            <div className="glass-gold w-full max-w-[380px] rounded-[2.2rem] p-4 shadow-[0_25px_80px_rgba(122,31,43,.25)]">
              <div className="relative flex aspect-square flex-col justify-between overflow-hidden rounded-[1.7rem] border border-[#D4A843]/35 bg-[radial-gradient(circle_at_top_left,rgba(212,168,67,.25),transparent_28%),linear-gradient(180deg,#4C1120_0%,#1A0A0E_100%)] p-5 text-white">
                <div className="absolute inset-3 rounded-[1.4rem] border border-[#D4A843]/20" />
                <div className="relative z-10 flex items-center gap-3">
                  <div className="glass-gold relative h-10 w-10 overflow-hidden rounded-full p-1"><Image src="/assets/img/logo.png" alt="Logo" fill className="object-contain p-1" /></div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F2CF8B]">Por los Caminos del Sur</p>
                    <p className="mt-1 text-[8px] uppercase tracking-[0.18em] text-white/55">Guerrero, México</p>
                  </div>
                </div>
                <div className="relative z-10 grid grid-cols-[.95fr_1.05fr] items-center gap-4">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-[#D4A843]/35">
                    <Image src="/assets/img/foto28.jpg" alt="Retrato editorial" fill className="object-cover" sizes="200px" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#F2CF8B]">Voz ciudadana</p>
                    <h3 className="mt-2 text-xl leading-tight" style={serifStyle}>“Organizarnos es defender lo nuestro.”</h3>
                    <p className="mt-3 text-sm font-semibold">Esthela Damián</p>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/55">Chilpancingo, Gro.</p>
                  </div>
                </div>
                <div className="relative z-10 border-t border-white/10 pt-3 text-center text-[8px] font-bold uppercase tracking-[0.18em] text-[#F2CF8B]">Territorio · comunidad · soberanía</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#11231D] px-5 py-10 text-white sm:px-5 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="glass-gold relative h-14 w-14 shrink-0 overflow-hidden rounded-full p-1"><Image src="/assets/img/logo.png" alt="Logo Por los Caminos del Sur" fill className="object-contain p-1.5" /></div>
            <div>
              <p className="text-2xl text-[#FFFDF8]" style={serifStyle}>Esthela Damián</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-[#D4A843]">Por los Caminos del Sur</p>
              <p className="mt-4 max-w-md text-sm leading-7 text-white/60" style={serifStyle}>Espacio de comunicación, diálogo y organización ciudadana en Guerrero, México.</p>
            </div>
          </div>
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/72">
            <p className="mb-3 text-[10px] text-white/40">Contacto</p>
            <div className="flex flex-wrap gap-x-5 gap-y-3">
              <a href="https://www.facebook.com/PorLosCaminosDelSur" target="_blank" rel="noreferrer">Facebook</a>
              <a href="https://www.instagram.com/porloscamnosdelsur/" target="_blank" rel="noreferrer">Instagram</a>
              <a href={whatsappHref} target="_blank" rel="noreferrer">WhatsApp</a>
              <a href="mailto:Miperfilpoliticogro@proton.me">Contacto</a>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-5 text-[10px] leading-relaxed text-white/40">
          © {new Date().getFullYear()} Por los Caminos del Sur. Guerrero se organiza, su gente lo defiende.
        </div>
      </footer>

      <a href={whatsappHref} target="_blank" rel="noreferrer" className="focus-ring fixed bottom-4 right-4 z-[70] inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-[#102117] shadow-[0_18px_45px_rgba(37,211,102,.35)] transition hover:-translate-y-0.5">
        <MessageCircleHeart size={18} /> Dudas por WhatsApp
      </a>
    </main>
  );
}