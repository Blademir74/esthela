"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Menu,
  MessageCircleHeart,
  Quote,
  X,
  Shield,
  Sparkles,
  Volume2,
  VolumeX,
  Users,
  Wheat,
  TreePine,
  Droplets,
  GraduationCap,
  ChevronRight,
  Star,
} from "lucide-react";
import { useState, useRef } from "react";

/* ══════════════════════════════════════
   DATA
   ══════════════════════════════════════ */

const navLinks = [
  { label: "Aspirantes",         href: "#aspirantes"  },
  { label: "Rutas del Sur",      href: "#rutas"       },
  { label: "Mercado del Sur",    href: "#mercado"     },
  { label: "Mapa de Voces",      href: "#voces"       },
  { label: "Agenda",             href: "#agenda"      },
];

const ticker = [
  { type: "aspirante",  nombre: "Carlos Bello Ramírez",  municipio: "Acapulco",      frase: "El pueblo primero." },
  { type: "productor",  nombre: "Miel Pura de la Montaña", comunidad: "Tlapa",       tag:  "Productor certificado" },
  { type: "aspirante",  nombre: "Rosa Elba Figueroa",    municipio: "Iguala",         frase: "Tierra y dignidad." },
  { type: "sector",     nombre: "Cooperativa Pesquera Costa Chica",                   tag:  "Sector Mar integrado" },
  { type: "aspirante",  nombre: "Lucio Mendoza Cruz",    municipio: "Chilpancingo",   frase: "La sierra nos une." },
  { type: "productor",  nombre: "Mezcal Artesanal del Sur", comunidad: "Chilapa",    tag:  "Productor certificado" },
  { type: "aspirante",  nombre: "Maribel Torres Ávila",  municipio: "Zihuatanejo",   frase: "Costa, mar y acción." },
  { type: "sector",     nombre: "Gremio de Transportistas Norte Guerrero",            tag:  "Sector Logística" },
  { type: "aspirante",  nombre: "Aurelio Guzmán Herrera", municipio: "Taxco",        frase: "Plata, pueblo y trabajo." },
  { type: "productor",  nombre: "Artesanías Textiles de la Montaña", comunidad: "Metlatónoc", tag: "Productor certificado" },
];

const rutas = [
  {
    id:    "soberania",
    num:   "01",
    icon:  Shield,
    title: "Soberanía y conectividad",
    text:  "Infraestructura pública, telecomunicaciones y caminos desde el interés comunitario y la decisión popular.",
    image: "/assets/img/soberania.jpg",
    bg:    "from-[#0F4C81] to-[#061d36]",
    tag:   "Infraestructura",
    size:  "lg:col-span-7",
  },
  {
    id:    "campo",
    num:   "02",
    icon:  Wheat,
    title: "Campo y economía comunitaria",
    text:  "Soberanía alimentaria, trabajo colectivo y apoyo a quienes trabajan la tierra de Guerrero.",
    image: "/assets/img/campo.png",
    bg:    "from-[#2D5A27] to-[#0d1f0b]",
    tag:   "Producción",
    size:  "lg:col-span-5",
  },
  {
    id:    "mujeres",
    num:   "03",
    icon:  Star,
    title: "Mujeres e igualdad sustantiva",
    text:  "Espacios de participación, organización y vida libre de violencias en todo el territorio.",
    image: "/assets/img/mujeres.jfif",
    bg:    "from-[#7A1F2B] to-[#2c0a12]",
    tag:   "Derechos",
    size:  "lg:col-span-4",
  },
  {
    id:    "juventud",
    num:   "04",
    icon:  GraduationCap,
    title: "Educación y juventudes",
    text:  "Defensa de la escuela pública y los sueños de cada generación en cada región de Guerrero.",
    image: "/assets/img/juventud.jpg",
    bg:    "from-[#C85A32] to-[#4A1A0A]",
    tag:   "Juventud",
    size:  "lg:col-span-4",
  },
  {
    id:    "agua",
    num:   "05",
    icon:  Droplets,
    title: "Agua y salud comunitaria",
    text:  "El acceso al agua potable, la prevención y el bienestar como derechos colectivos irrenunciables.",
    image: "/assets/img/agua.jpg",
    bg:    "from-[#0F4C81] to-[#0d1f0b]",
    tag:   "Salud",
    size:  "lg:col-span-4",
  },
];

const municipios = [
  { name: "Acapulco de Juárez",          frase: "La costa organizada es soberanía en pie de lucha." },
  { name: "Chilpancingo de los Bravo",   frase: "La capital se construye desde sus barrios populares." },
  { name: "Iguala de la Independencia",  frase: "La historia nos llama a defender la soberanía nacional." },
  { name: "Zihuatanejo de Azueta",       frase: "Desde el mar, las comunidades pescadoras tienen voz." },
  { name: "Chilapa de Álvarez",          frase: "Raíces y territorio: la fuerza del tianguis comunitario." },
  { name: "Taxco de Alarcón",            frase: "El porvenir se construye con las manos del artesano." },
  { name: "Tlapa de Comonfort",          frase: "La montaña habla: no hay transformación sin pueblos originarios." },
  { name: "Coyuca de Benítez",           frase: "El campo es la base de la soberanía alimentaria." },
  { name: "Ometepec",                    frase: "Costa Chica organizada, igual dignidad para todas y todos." },
  { name: "Tecpan de Galeana",           frase: "La soberanía alimentaria nace de la tierra respetada." },
  { name: "Atoyac de Álvarez",           frase: "Historia, café y lucha: la dignidad no se negocia." },
  { name: "Ayutla de los Libres",        frase: "La asamblea decide, el pueblo manda siempre." },
  { name: "Eduardo Neri",                frase: "Minerales y campo en manos del desarrollo público." },
  { name: "Teloloapan",                  frase: "La voz del norte guerrerense es firme y clara." },
  { name: "Tixtla de Guerrero",          frase: "Semillero de maestros: la educación pública es el futuro." },
  { name: "San Luis Acatlán",            frase: "Justicia comunitaria: ejemplo de autonomía indígena." },
  { name: "Tecoanapa",                   frase: "El agua y la salud son derechos, no mercancías." },
  { name: "Petatlán",                    frase: "Cuidar los bosques y ríos es defender el mañana." },
  { name: "Huitzuco de los Figueroa",    frase: "Cultura, siembra y memoria en tierra revolucionaria." },
  { name: "San Marcos",                  frase: "Juventudes que organizan el sur con ideas claras." },
];

const galeria = [
  { src: "/assets/img/foto2.jfif",  alt: "Esthela dialogando en asamblea",          label: "Escucha activa",         size: "lg:col-span-2 lg:row-span-2" },
  { src: "/assets/img/foto.jpg",    alt: "Caminos del Sur",                          label: "El territorio habla",    size: "" },
  { src: "/assets/img/foto15.jfif", alt: "Mujeres del Sur organizadas",              label: "Mujeres del Sur",        size: "" },
  { src: "/assets/img/foto1.png",   alt: "Campo y soberanía alimentaria",            label: "Economía comunitaria",   size: "lg:col-span-2" },
  { src: "/assets/img/foto17.jfif", alt: "Diálogo casa por casa",                   label: "Diálogo sin postureo",   size: "" },
  { src: "/assets/img/foto22.jfif", alt: "Encuentro de voces",                      label: "Voces de Guerrero",      size: "" },
  { src: "/assets/img/foto20.jfif", alt: "Jóvenes organizándose",                   label: "Juventudes activas",     size: "" },
];

const mercado = [
  { nombre: "Miel 100% Pura de la Sierra",   comunidad: "Tlapa de Comonfort",    img: "/assets/img/foto5.jfif",  wa: "5219511234567", tag: "Apicultura" },
  { nombre: "Mezcal Artesanal del Pueblo",   comunidad: "Chilapa de Álvarez",    img: "/assets/img/foto3.jfif",  wa: "5219511234568", tag: "Destilado Tradicional" },
  { nombre: "Textiles de la Montaña",        comunidad: "Metlatónoc, La Montaña", img: "/assets/img/foto4.jfif", wa: "5219511234569", tag: "Artesanía" },
  { nombre: "Mango Ataulfo de Temporada",    comunidad: "Tecpan de Galeana",     img: "/assets/img/foto6.jfif",  wa: "5219511234570", tag: "Campo" },
  { nombre: "Pesca Artesanal Costa Chica",   comunidad: "Ometepec",              img: "/assets/img/foto7.jfif",  wa: "5219511234571", tag: "Mar" },
  { nombre: "Café de la Sierra de Guerrero", comunidad: "Atoyac de Álvarez",     img: "/assets/img/foto8.jfif",  wa: "5219511234572", tag: "Caficultura" },
];

const agenda = [
  {
    estado:  "Próximamente",
    fecha:   "24 de Octubre",
    lugar:   "Chilpancingo de los Bravo",
    tipo:    "Diálogo Territorial",
    desc:    "Encuentro vecinal de organización barrial y planeación comunitaria.",
  },
  {
    estado:  "Próximamente",
    fecha:   "28 de Octubre",
    lugar:   "Acapulco de Juárez",
    tipo:    "Reunión Comunitaria",
    desc:    "Mesa de escucha sobre infraestructura hidráulica y bienestar social.",
  },
  {
    estado:  "Próximamente",
    fecha:   "04 de Noviembre",
    lugar:   "Iguala de la Independencia",
    tipo:    "Foro de Juventudes",
    desc:    "Formación política, debate y propuestas del relevo generacional.",
  },
];

/* ══════════════════════════════════════
   COMPONENTE TICKER
   ══════════════════════════════════════ */
function TickerCard({ item }: { item: typeof ticker[0] }) {
  if (item.type === "aspirante") {
    return (
      <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 backdrop-blur-sm mx-3 shrink-0 hover:border-[#E5A93C]/40 transition-colors duration-300">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#C85A32] to-[#7A1F2B] flex items-center justify-center text-white text-xs font-black shrink-0">
          {item.nombre![0]}
        </div>
        <div>
          <p className="text-[11px] font-black tracking-wide text-white">{item.nombre}</p>
          <p className="text-[10px] text-[#E5A93C]">{item.municipio} · Aspirante</p>
          <p className="text-[10px] text-white/50 italic mt-0.5">"{item.frase}"</p>
        </div>
      </div>
    );
  }
  if (item.type === "productor") {
    return (
      <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 backdrop-blur-sm mx-3 shrink-0 hover:border-[#2D5A27]/60 transition-colors duration-300">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#2D5A27] to-[#0d1f0b] flex items-center justify-center shrink-0">
          <Wheat className="h-4 w-4 text-[#E5A93C]" />
        </div>
        <div>
          <p className="text-[11px] font-black tracking-wide text-white">{item.nombre}</p>
          <p className="text-[10px] text-[#E5A93C]">{item.comunidad} · {item.tag}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 backdrop-blur-sm mx-3 shrink-0 hover:border-[#0F4C81]/60 transition-colors duration-300">
      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#0F4C81] to-[#061d36] flex items-center justify-center shrink-0">
        <Users className="h-4 w-4 text-[#E5A93C]" />
      </div>
      <div>
        <p className="text-[11px] font-black tracking-wide text-white">{item.nombre}</p>
        <p className="text-[10px] text-[#E5A93C]">{item.tag}</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   COMPONENTE PRINCIPAL
   ══════════════════════════════════════ */
export default function HomePage() {
  const [menuOpen,        setMenuOpen]        = useState(false);
  const [videoReady,      setVideoReady]      = useState(false);
  const [muted,           setMuted]           = useState(true);
  const [activeMunicipio, setActiveMunicipio] = useState(municipios[0]);
  const [activeTab,       setActiveTab]       = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  };

  // duplicar ticker para scroll infinito
  const tickerItems = [...ticker, ...ticker];

  return (
    <main className="overflow-x-hidden bg-[#F4EFE6] text-[#1A1A18] font-sans">

      {/* ════════════════════════════════
          NAVBAR EDITORIAL
          ════════════════════════════════ */}
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          {/* Logotipo / Sello de Marca */}
          <Link href="/" className="group flex items-center gap-3 shrink-0">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-[#E5A93C]/60 bg-black/40 backdrop-blur-md p-1 transition group-hover:border-[#E5A93C] shadow-glow-miel">
              <Image src="/assets/img/logo.png" alt="Por los Caminos del Sur" fill className="object-contain p-1" priority />
            </div>
            <div className="hidden sm:block">
              <span className="block font-editorial text-xl leading-none text-white drop-shadow">Esthela Damián</span>
              <span className="block text-[9px] font-black tracking-[0.28em] uppercase text-[#E5A93C] mt-0.5">Por los Caminos del Sur</span>
            </div>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-7 text-[11px] font-bold tracking-[0.14em] uppercase text-white/85">
            {navLinks.map(l => (
              <a key={l.href} href={l.href}
                className="hover:text-[#E5A93C] transition-colors duration-200 hover:underline underline-offset-4">
                {l.label}
              </a>
            ))}
            <Link href="/tarjetas"
              className="rounded-full bg-[#C85A32] px-6 py-2.5 text-white font-black tracking-wide shadow hover:bg-[#E07A52] hover:-translate-y-0.5 transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#E5A93C]">
              Súmate al Cambio
            </Link>
          </nav>

          {/* Hamburguesa móvil */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden rounded-full border border-white/20 bg-black/30 p-2.5 text-white backdrop-blur">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menú móvil */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="border-t border-white/10 bg-[#1A1A18]/96 px-5 py-6 backdrop-blur lg:hidden">
              <nav className="flex flex-col gap-4 text-[11px] font-black tracking-widest uppercase text-white">
                {navLinks.map(l => (
                  <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                    className="border-b border-white/8 py-2 hover:text-[#E5A93C] transition-colors">
                    {l.label}
                  </a>
                ))}
                <Link href="/tarjetas" onClick={() => setMenuOpen(false)}
                  className="mt-2 rounded-full bg-[#C85A32] py-3 text-center text-white font-black">
                  Súmate al Cambio
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ════════════════════════════════
          HERO CINEMATOGRÁFICO
          ════════════════════════════════ */}
      <section className="relative min-h-[100svh] overflow-hidden bg-[#1A1A18] flex items-center">
        {/* Imagen fallback */}
        <Image src="/assets/img/foto28.jpg" alt="Guerrero, territorio organizado" fill priority className="object-cover object-center" />

        {/* Video */}
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ${videoReady ? "opacity-100" : "opacity-0"}`}
          autoPlay muted loop playsInline preload="metadata"
          poster="/assets/img/foto28.jpg"
          onCanPlay={() => setVideoReady(true)}>
          <source src="/assets/img/video1.mp4" type="video/mp4" />
        </video>

        {/* Overlay cinematográfico */}
        <div className="absolute inset-0 hero-overlay" />

        {/* Degradado inferior hacia el crema */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#F4EFE6] to-transparent" />

        {/* Mute control */}
        <button onClick={toggleMute}
          className="absolute top-24 right-5 z-30 rounded-full border border-white/20 bg-black/30 p-2.5 text-white backdrop-blur hover:bg-white/20 transition lg:right-8">
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        {/* Contenido Hero */}
        <div className="relative z-20 mx-auto w-full max-w-7xl px-5 pb-20 pt-28 lg:px-8 lg:pb-28 lg:pt-36">
          <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">

            {/* Bloque Titular */}
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85 }}>
              {/* Sello de marca en hero */}
              <div className="mb-7 flex items-center gap-3">
                <div className="relative h-11 w-11 overflow-hidden rounded-full border border-[#E5A93C]/50 bg-black/30 backdrop-blur p-1 shadow-glow-miel">
                  <Image src="/assets/img/logo.png" alt="Logo" fill className="object-contain p-1" />
                </div>
                <span className="eyebrow-line text-[#E5A93C]">Por los Caminos del Sur · Guerrero</span>
              </div>

              {/* Badge activo */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E5A93C]/30 bg-black/25 px-4 py-1.5 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C85A32] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C85A32]" />
                </span>
                <span className="text-[10px] font-black tracking-[0.2em] uppercase text-[#F4EFE6]">Guerrero · Territorio Activo</span>
              </div>

              {/* Titular XXL */}
              <h1 className="font-editorial text-balance leading-[0.88] text-[#FFFDF8] text-5xl sm:text-7xl lg:text-[6.5rem]">
                Guerrero<br />
                <span className="text-[#E5A93C] italic">no se rinde.</span>
              </h1>
              <h2 className="mt-4 font-editorial text-2xl sm:text-3xl lg:text-4xl leading-tight text-white/80 max-w-2xl">
                La voz del campo, las costas y la Sierra unidas por la dignidad.
              </h2>

              <p className="mt-7 max-w-xl text-base leading-relaxed text-white/75 lg:text-lg">
                Más que una propuesta política, somos la casa digital donde agricultores, pescadores, transportistas y liderazgos comunitarios construyen el nuevo paradigma junto a Esthela Damián.
              </p>

              {/* CTAs */}
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a href="#voces"
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#C85A32] px-7 py-4 font-black text-sm text-white transition hover:bg-[#E07A52] hover:-translate-y-0.5 hover:shadow-glow focus:outline-none">
                  Conoce las voces del Sur <ArrowRight size={15} />
                </a>
                <Link href="/tarjetas"
                  className="inline-flex items-center justify-center gap-2.5 rounded-full border-2 border-white/40 px-7 py-4 font-black text-sm text-white transition hover:bg-white/10 hover:-translate-y-0.5 focus:outline-none">
                  Crea tu póster <MessageCircleHeart size={15} />
                </Link>
              </div>
            </motion.div>

            {/* Tarjeta flotante editorial */}
            <motion.div
              initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.2 }}
              className="hidden lg:block">
              <div className="ml-auto max-w-sm rounded-3xl border border-white/15 bg-black/25 p-6 backdrop-blur-xl shadow-editorial">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <p className="eyebrow-line text-[#E5A93C]">Señal editorial</p>
                  <div className="relative h-8 w-8 overflow-hidden rounded-full border border-[#E5A93C]/40 bg-black/30 p-0.5">
                    <Image src="/assets/img/logo.png" alt="Logo" fill className="object-contain" />
                  </div>
                </div>
                <p className="mt-5 font-editorial text-2xl leading-snug text-white italic">
                  "Guerrero no se explica desde lejos. Se camina, se escucha, se organiza."
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-[9px] font-black tracking-widest uppercase">
                  <span className="text-white/45">#PorlosCaminosdelSur</span>
                  <span className="text-[#E5A93C]">MORENA · GRO</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contador de municipios */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.4 }}
            className="mt-16 flex flex-wrap gap-8 lg:gap-16">
            {[
              { n: "20+",   l: "Municipios activos" },
              { n: "7",     l: "Regiones de Guerrero" },
              { n: "100+",  l: "Liderazgos comunitarios" },
              { n: "1",     l: "Objetivo: Soberanía" },
            ].map(s => (
              <div key={s.l}>
                <p className="font-editorial text-4xl text-[#E5A93C] leading-none">{s.n}</p>
                <p className="mt-1 text-[10px] font-bold tracking-[0.18em] uppercase text-white/50">{s.l}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════
          TICKER CONTINUO
          ════════════════════════════════ */}
      <section className="bg-[#1A1A18] border-y border-white/8 py-4 overflow-hidden">
        <div className="ticker-track">
          {tickerItems.map((item, i) => (
            <TickerCard key={i} item={item} />
          ))}
        </div>
      </section>

      {/* ════════════════════════════════
          MANIFIESTO
          ════════════════════════════════ */}
      <section id="manifiesto" className="relative overflow-hidden bg-[#F4EFE6] px-5 py-24 paper-grain lg:px-8 lg:py-32">
        <div className="absolute -right-32 top-0 h-[500px] w-[500px] rounded-full bg-[#C85A32]/6 blur-[120px] pointer-events-none" />

        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center">
          {/* Retrato editorial */}
          <div className="relative">
            <div className="overflow-hidden rounded-5xl bg-[#FFFDF8] p-3 shadow-editorial border border-[#E5A93C]/20">
              <div className="relative aspect-[4/5] overflow-hidden rounded-4xl">
                <Image src="/assets/img/foto29.jpg" alt="Esthela Damián en territorio" fill className="object-cover transition duration-700 hover:scale-[1.03]" />
              </div>
            </div>

            {/* Placa editorial flotante */}
            <div className="absolute -bottom-10 left-4 right-4 rounded-3xl bg-[#1A1A18] p-6 text-white shadow-territorial border border-white/8">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="relative h-9 w-9 overflow-hidden rounded-full border border-[#E5A93C]/40 bg-white/10">
                  <Image src="/assets/img/logo.png" alt="Logo" fill className="object-contain p-1.5" />
                </div>
                <div>
                  <p className="eyebrow-line text-[#E5A93C] text-[9px]">Por los Caminos del Sur</p>
                  <p className="text-[8px] text-white/40 mt-0.5">Guerrero · Organización Territorial</p>
                </div>
              </div>
              <p className="mt-4 font-editorial text-lg italic text-white/90 leading-snug">
                "Caminar Guerrero no es una campaña de carteles. Es presencia, escucha y organización real."
              </p>
            </div>
          </div>

          {/* Texto Manifiesto */}
          <div className="pt-14 lg:pt-0">
            <p className="eyebrow-line text-[#C85A32]">Manifiesto del Movimiento</p>
            <div className="mt-5 mb-6 h-0.5 w-16 bg-[#E5A93C] rounded-full" />
            <h2 className="font-editorial text-4xl leading-[1.05] text-[#1A1A18] sm:text-5xl lg:text-[3.2rem]">
              Caminar Guerrero es escuchar su historia, su fuerza y sus causas.
            </h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-[#1A1A18]/75">
              <p>Desde cada barrio, colonia y ejido de Guerrero, la organización territorial es el camino para dialogar, estructurar causas colectivas y defender el bienestar común.</p>
              <p className="font-semibold text-[#1A1A18]">Este espacio no se edifica desde las oficinas ni la distancia mediática. Se construye a pie, compartiendo experiencias con el pueblo trabajador y organizando comités de defensa.</p>
              <p>Con el espíritu de Morena, trabajamos bajo los principios de honestidad y amor al territorio. No buscamos cargos: buscamos defender la transformación de manera organizada y fraterna.</p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                { tag: "Región de Regiones", title: "Cercanía Activa",    desc: "Diálogos reales en las 7 regiones de Guerrero, sin simulaciones." },
                { tag: "Soberanía Nacional", title: "Defensa Colectiva",  desc: "Comités locales de transformación nacional organizados desde la base." },
              ].map(c => (
                <div key={c.title} className="rounded-3xl bg-[#FFFDF8] p-5 border border-[#E5A93C]/20 shadow-sm">
                  <p className="eyebrow-line text-[#C85A32] text-[9px]">{c.tag}</p>
                  <h4 className="mt-2 font-editorial text-xl text-[#1A1A18]">{c.title}</h4>
                  <p className="mt-2 text-xs leading-relaxed text-[#1A1A18]/60">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          RUTAS DEL SUR
          ════════════════════════════════ */}
      <section id="rutas" className="relative bg-[#1A1A18] px-5 py-24 text-white overflow-hidden paper-grain-dark lg:px-8 lg:py-32">
        <div className="absolute left-0 bottom-0 h-96 w-96 rounded-full bg-[#C85A32]/8 blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between border-b border-white/10 pb-10">
            <div className="max-w-2xl">
              <p className="eyebrow-line text-[#E5A93C]">Rutas de Trabajo Territorial</p>
              <div className="mt-5 mb-1 h-0.5 w-16 bg-[#C85A32] rounded-full" />
              <h2 className="font-editorial text-4xl sm:text-5xl leading-tight mt-4">
                Cinco rutas.<br />Un mismo horizonte.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-white/60">
              Cada ruta es un eje de diálogo, propuestas y organización que traza un mapa integral de causas populares.
            </p>
          </div>

          {/* Grid asimétrico editorial */}
          <div className="mt-12 grid gap-5 lg:grid-cols-12">

            {/* Ruta 1 — Grande horizontal */}
            {rutas.slice(0, 1).map(r => (
              <article key={r.id}
                className={`ruta-card group overflow-hidden rounded-4xl border border-white/8 bg-gradient-to-br ${r.bg} ${r.size}`}>
                <div className="grid h-full lg:grid-cols-[1.15fr_0.85fr]">
                  <div className="relative min-h-[280px] overflow-hidden">
                    <Image src={r.image} alt={r.title} fill className="ruta-img object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0F4C81]/80 hidden lg:block" />
                  </div>
                  <div className="flex flex-col justify-between p-8 lg:p-10">
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <span className="eyebrow-line text-[#E5A93C] text-[9px]">Ruta {r.num}</span>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-[9px] font-bold tracking-wider text-white/70">{r.tag}</span>
                      </div>
                      <r.icon className="h-7 w-7 text-[#E5A93C] mb-4" />
                      <h3 className="font-editorial text-3xl leading-tight">{r.title}</h3>
                      <p className="mt-4 text-sm leading-relaxed text-white/75">{r.text}</p>
                    </div>
                    <div className="mt-8 flex items-center gap-2 text-[11px] font-black tracking-wider text-[#E5A93C] uppercase">
                      Explorar ruta <ChevronRight size={14} className="transition group-hover:translate-x-1.5" />
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {/* Ruta 2 — complementaria */}
            {rutas.slice(1, 2).map(r => (
              <article key={r.id}
                className={`ruta-card group overflow-hidden rounded-4xl border border-white/8 bg-gradient-to-br ${r.bg} ${r.size}`}>
                <div className="relative min-h-[200px] overflow-hidden">
                  <Image src={r.image} alt={r.title} fill className="ruta-img object-cover" />
                </div>
                <div className="flex flex-col justify-between p-7">
                  <div className="flex items-center justify-between mb-4">
                    <span className="eyebrow-line text-[#E5A93C] text-[9px]">Ruta {r.num}</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[9px] font-bold tracking-wider text-white/70">{r.tag}</span>
                  </div>
                  <r.icon className="h-6 w-6 text-[#E5A93C] mb-3" />
                  <h3 className="font-editorial text-2xl leading-tight">{r.title}</h3>
                  <p className="mt-3 text-xs leading-relaxed text-white/75">{r.text}</p>
                </div>
              </article>
            ))}

            {/* Rutas 3, 4, 5 — fila de tres */}
            {rutas.slice(2).map(r => (
              <article key={r.id}
                className={`ruta-card group overflow-hidden rounded-4xl border border-white/8 bg-gradient-to-br ${r.bg} ${r.size}`}>
                <div className="relative min-h-[180px] overflow-hidden">
                  <Image src={r.image} alt={r.title} fill className="ruta-img object-cover" />
                </div>
                <div className="flex flex-col justify-between p-7">
                  <div className="flex items-center justify-between mb-4">
                    <span className="eyebrow-line text-[#E5A93C] text-[9px]">Ruta {r.num}</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[9px] font-bold tracking-wider text-white/70">{r.tag}</span>
                  </div>
                  <r.icon className="h-6 w-6 text-[#E5A93C] mb-3" />
                  <h3 className="font-editorial text-xl leading-tight">{r.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-white/70">{r.text}</p>
                </div>
              </article>
            ))}

          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          MAPA DE VOCES
          ════════════════════════════════ */}
      <section id="voces" className="relative bg-[#2D5A27] px-5 py-24 text-white overflow-hidden paper-grain-dark lg:px-8 lg:py-32">
        <div className="absolute right-0 top-0 h-[450px] w-[450px] rounded-full bg-[#E5A93C]/6 blur-[130px] pointer-events-none" />

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-start">

            {/* Panel de nodos — cartografía viva */}
            <div className="rounded-4xl border border-white/10 bg-[#1C3A18]/50 backdrop-blur-md p-6 lg:p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
                <div>
                  <p className="eyebrow-line text-[#E5A93C] text-[9px]">Cartografía de Guerrero</p>
                  <p className="text-xs text-white/50 mt-1">Red Territorial Activa — 20 municipios</p>
                </div>
                <span className="rounded-full border border-[#E5A93C]/30 px-4 py-1.5 text-[9px] font-black tracking-wider text-[#E5A93C]">
                  ACTIVO
                </span>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 max-h-[500px] overflow-y-auto pr-1">
                {municipios.map((m, i) => (
                  <button key={m.name}
                    onMouseEnter={() => setActiveMunicipio(m)}
                    onClick={() => setActiveMunicipio(m)}
                    className={`nodo-muni text-left rounded-2xl border px-4 py-3 focus:outline-none ${
                      activeMunicipio.name === m.name
                        ? "border-[#E5A93C] bg-white/10 active"
                        : "border-white/8 bg-white/[0.03]"
                    }`}>
                    <div className="flex items-center gap-2">
                      <MapPin className={`h-3 w-3 shrink-0 ${activeMunicipio.name === m.name ? "text-[#E5A93C]" : "text-white/30"}`} />
                      <span className="text-[11px] font-bold tracking-wide truncate">{m.name}</span>
                    </div>
                    <p className="text-[9px] text-white/35 mt-1 ml-5">Nodo {String(i+1).padStart(2,"0")}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Panel de voz activa */}
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow-line text-[#E5A93C]">Mapa de Voces</p>
              <div className="mt-5 h-0.5 w-16 bg-[#E5A93C] rounded-full" />
              <h2 className="mt-6 font-editorial text-4xl leading-tight sm:text-5xl lg:text-[3rem]">
                Voces territoriales<br />en movimiento.
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-white/65">
                Selecciona o pasa el cursor por un municipio para escuchar la causa que mueve la organización en ese territorio.
              </p>

              <AnimatePresence mode="wait">
                <motion.div key={activeMunicipio.name}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.32 }}
                  className="mt-8 rounded-4xl border border-[#E5A93C]/25 bg-gradient-to-br from-[#1C3A18] to-[#0d1f0b] p-8 shadow-editorial relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-[0.04]">
                    <Quote size={90} className="text-[#E5A93C]" />
                  </div>
                  <p className="eyebrow-line text-[#E5A93C] text-[9px]">
                    <Sparkles size={10} className="inline mr-1" />
                    Municipio escuchado
                  </p>
                  <h3 className="mt-3 font-editorial text-2xl text-white">{activeMunicipio.name}</h3>
                  <div className="my-5 h-px w-10 bg-white/20" />
                  <p className="font-editorial text-[1.35rem] leading-snug text-[#FFFDF8] italic">
                    "{activeMunicipio.frase}"
                  </p>
                  <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5 text-[9px] tracking-widest uppercase text-white/40">
                    <span className="flex items-center gap-1.5">
                      <Shield size={11} className="text-[#E5A93C]" />Nodo Territorial
                    </span>
                    <span>#PorlosCaminosdelSur</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          GALERÍA FOTORREPORTAJE
          ════════════════════════════════ */}
      <section id="galeria" className="bg-[#F4EFE6] px-5 py-24 paper-grain border-b border-[#1A1A18]/8 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between border-b border-[#1A1A18]/10 pb-10 gap-6 mb-12">
            <div>
              <p className="eyebrow-line text-[#C85A32]">Fotorreportaje Territorial</p>
              <div className="mt-5 h-0.5 w-16 bg-[#C85A32] rounded-full" />
              <h2 className="mt-5 font-editorial text-4xl leading-tight text-[#1A1A18] sm:text-5xl">
                El sur no se explica desde lejos.
              </h2>
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-[#1A1A18]/55">
              Imágenes reales de Esthela recorriendo comunidades, zonas costeras y ejidos serranos.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-[240px]">
            {galeria.map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className={`galeria-item group relative rounded-4xl overflow-hidden bg-[#FFFDF8] border border-[#1A1A18]/8 ${item.size}`}>
                <img src={item.src} alt={item.alt} className="g-img h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-x-0 bottom-0 p-5 transform translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition duration-300">
                  <p className="eyebrow-line text-[#E5A93C] text-[9px]">{item.label}</p>
                  <p className="text-xs text-white/80 mt-1">{item.alt}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          MERCADO DEL SUR
          ════════════════════════════════ */}
      <section id="mercado" className="bg-[#FFFDF8] px-5 py-24 border-b border-[#1A1A18]/8 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <p className="eyebrow-line text-[#2D5A27]">Economía Popular y Comercio Justo</p>
            <div className="mt-5 h-0.5 w-16 bg-[#E5A93C] rounded-full" />
            <h2 className="mt-5 font-editorial text-4xl leading-tight text-[#1A1A18] sm:text-5xl">
              Mercado del Sur.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#1A1A18]/60">
              Productores y artesanos de Guerrero exponen su trabajo. Sin intermediarios, sin comisiones. Contacto directo con quien produce.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {mercado.map((p) => (
              <div key={p.nombre} className="bento-card group border border-[#1A1A18]/10 bg-[#F4EFE6] flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl m-3">
                  <img src={p.img} alt={p.nombre} className="card-img h-full w-full object-cover" />
                  <span className="absolute top-3 left-3 rounded-full bg-[#2D5A27]/90 backdrop-blur px-3 py-1 text-[9px] font-black tracking-wider text-white uppercase">
                    {p.tag}
                  </span>
                </div>
                <div className="flex flex-col flex-1 justify-between p-5 pt-2">
                  <div>
                    <h3 className="font-editorial text-lg leading-tight text-[#1A1A18]">{p.nombre}</h3>
                    <p className="mt-1 text-[11px] text-[#1A1A18]/50">{p.comunidad}</p>
                  </div>
                  <a href={`https://wa.me/${p.wa}?text=Hola%2C%20vi%20tu%20producto%20en%20Por%20los%20Caminos%20del%20Sur`}
                    target="_blank" rel="noreferrer"
                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[#2D5A27] py-2.5 text-[11px] font-black tracking-wide text-white transition hover:bg-[#4A8044] hover:-translate-y-0.5 focus:outline-none">
                    Contactar Productor <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Banner CTA registro */}
          <div className="mt-10 rounded-4xl bg-[#2D5A27] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="eyebrow-line text-[#E5A93C] text-[9px]">¿Eres productor o artesano?</p>
              <h3 className="mt-2 font-editorial text-2xl">Crea tu espacio en el Mercado del Sur — es gratuito.</h3>
            </div>
            <a href="mailto:Miperfilpoliticogro@proton.me?subject=Registro%20Mercado%20del%20Sur"
              className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[#E5A93C] px-6 py-3 text-[11px] font-black text-[#1A1A18] hover:bg-[#F2CF8B] transition hover:-translate-y-0.5 focus:outline-none">
              Registrar mi producto <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          SECTORES EN RESISTENCIA
          ════════════════════════════════ */}
      <section className="bg-[#F4EFE6] px-5 py-24 paper-grain border-b border-[#1A1A18]/8 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow-line text-[#0F4C81]">Sectores Unidos de Guerrero</p>
          <div className="mt-5 h-0.5 w-16 bg-[#C85A32] rounded-full" />
          <h2 className="mt-5 font-editorial text-4xl leading-tight text-[#1A1A18] sm:text-5xl mb-10">
            Gremios que construyen el cambio.
          </h2>

          {/* Tabs sectoriales */}
          <div className="flex flex-wrap gap-3 mb-10">
            {["Campo y Agronomía","Pesca y Mar","Transporte","Turismo y Tradición"].map((tab, i) => (
              <button key={tab} onClick={() => setActiveTab(i)}
                className={`rounded-full px-5 py-2.5 text-[11px] font-black tracking-wide transition ${
                  activeTab === i
                    ? "bg-[#C85A32] text-white shadow"
                    : "border border-[#1A1A18]/15 bg-[#FFFDF8] text-[#1A1A18]/70 hover:bg-[#F4EFE6]"
                }`}>
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {(activeTab % 3 === 0 ? [0,1,2] : activeTab === 1 ? [2,0,1] : activeTab === 2 ? [1,2,0] : [0,2,1]).map(idx => [
                { icon: Wheat,    label: "Agricultores y Caficultores",     img: "/assets/img/foto9.jfif",  desc: "Soberanía alimentaria en montaña, valles y costas." },
                { icon: TreePine, label: "Silvicultores y Comunidades",     img: "/assets/img/foto10.jfif", desc: "Bosques y recursos naturales en manos del pueblo." },
                { icon: Users,    label: "Cooperativas y Colectivos",       img: "/assets/img/foto11.jfif", desc: "Organización gremial con base social comunitaria." },
              ][idx]).map((s, i) => (
                <div key={i} className="bento-card border border-[#1A1A18]/10 bg-[#FFFDF8] flex flex-col">
                  <div className="relative aspect-[3/2] overflow-hidden rounded-3xl m-3">
                    <img src={s.img} alt={s.label} className="card-img h-full w-full object-cover" />
                  </div>
                  <div className="p-5 pt-2">
                    <s.icon className="h-5 w-5 text-[#C85A32] mb-2" />
                    <h3 className="font-editorial text-lg text-[#1A1A18] leading-tight">{s.label}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#1A1A18]/55">{s.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ════════════════════════════════
          AGENDA TERRITORIAL
          ════════════════════════════════ */}
      <section id="agenda" className="relative bg-[#0F4C81] px-5 py-24 text-white overflow-hidden paper-grain-dark lg:px-8 lg:py-32">
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-[#E5A93C]/6 blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="max-w-2xl border-b border-white/10 pb-10 mb-12">
            <div className="flex items-center gap-2">
              <CalendarDays size={14} className="text-[#E5A93C]" />
              <p className="eyebrow-line text-[#E5A93C] text-[9px]">Agenda Territorial Abierta</p>
            </div>
            <div className="mt-5 h-0.5 w-16 bg-[#C85A32] rounded-full" />
            <h2 className="mt-5 font-editorial text-4xl leading-tight sm:text-5xl lg:text-[3rem]">
              Encuentros, asambleas<br />y organización.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-white/60">
              Próximos nodos de escucha organizados por asambleas de base y comités sectoriales en el territorio.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {agenda.map((a, i) => (
              <article key={i} className="bento-card border border-white/10 bg-[#083660]/50 backdrop-blur p-7 flex flex-col justify-between hover:border-[#E5A93C]/40">
                <div>
                  <div className="flex justify-between border-b border-white/8 pb-4">
                    <span className="eyebrow-line text-[#E5A93C] text-[9px]">{a.estado}</span>
                    <span className="text-[10px] font-bold tracking-wider text-white/50">{a.fecha}</span>
                  </div>
                  <h3 className="mt-5 font-editorial text-2xl leading-tight">{a.lugar}</h3>
                  <p className="mt-1 text-[11px] font-black tracking-wider text-[#E5A93C] uppercase">{a.tipo}</p>
                  <p className="mt-4 text-sm leading-relaxed text-white/65">{a.desc}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-white/8 flex justify-between text-[9px] text-white/35 uppercase tracking-widest">
                  <span>Asamblea de Base</span><span>Morena · GRO</span>
                </div>
              </article>
            ))}
          </div>

          {/* CTA solicitar encuentro */}
          <div className="mt-12 rounded-4xl border border-white/10 bg-[#083660]/40 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl">
              <h4 className="font-editorial text-2xl text-white">¿Quieres organizar un diálogo en tu comunidad?</h4>
              <p className="mt-2 text-xs text-white/50">La organización se teje escuchando a cada ejido y colonia. Contáctanos para coordinar un encuentro.</p>
            </div>
            <a href="mailto:Miperfilpoliticogro@proton.me?subject=Solicitud%20de%20encuentro%20territorial"
              className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[#C85A32] px-7 py-3.5 text-[11px] font-black text-white transition hover:bg-[#E07A52] hover:-translate-y-0.5 focus:outline-none">
              Solicitar encuentro <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          PÓSTER SOCIAL — CTA
          ════════════════════════════════ */}
      <section className="bg-[#1A1A18] px-5 py-24 text-white relative overflow-hidden lg:px-8">
        <div className="absolute left-0 bottom-0 h-96 w-96 rounded-full bg-[#C85A32]/10 blur-[130px] pointer-events-none" />
        <div className="mx-auto max-w-7xl grid gap-16 lg:grid-cols-2 lg:items-center relative z-10">
          <div>
            <p className="eyebrow-line text-[#E5A93C]">Identidad Digital Compartible</p>
            <div className="mt-5 h-0.5 w-16 bg-[#C85A32] rounded-full" />
            <h2 className="mt-5 font-editorial text-4xl leading-tight sm:text-5xl lg:text-[3.2rem]">
              El póster social<br />es parte del manifiesto.
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-white/65">
              Nuestra campaña territorial depende de la voz orgánica del pueblo. Hemos diseñado un generador de pósteres premium para que puedas integrar tu foto, tu municipio y tu frase en una pieza editorial inmediatamente compartible.
            </p>
            <div className="mt-8">
              <Link href="/tarjetas"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#C85A32] px-8 py-4 text-sm font-black text-white transition hover:bg-[#E07A52] hover:-translate-y-0.5 hover:shadow-glow focus:outline-none">
                Crear mi póster social <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Preview del póster */}
          <div className="flex justify-center">
            <div className="w-full max-w-[340px] rounded-5xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur shadow-editorial">
              <div className="relative aspect-[4/5] overflow-hidden rounded-4xl poster-guinda p-6 text-white flex flex-col justify-between border border-[#E5A93C]/25">
                <div className="absolute inset-3 border border-[#E5A93C]/15 rounded-[1.6rem] pointer-events-none" />

                {/* Header póster */}
                <div className="relative z-10 flex items-center gap-2.5">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[#E5A93C]/40 bg-black/20 p-1">
                    <Image src="/assets/img/logo.png" alt="Logo" fill className="object-contain" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black tracking-[0.24em] uppercase text-[#F2CF8B] leading-none">Guerrero se organiza.</p>
                    <p className="text-[7px] text-white/40 tracking-widest mt-0.5">#PorlosCaminosdelSur</p>
                  </div>
                </div>

                {/* Grid mini */}
                <div className="relative z-10 grid grid-cols-[1.1fr_0.9fr] gap-3 py-3 items-center">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-[#E5A93C]/30 p-0.5 bg-black/10">
                    <div className="relative h-full overflow-hidden rounded-[0.7rem]">
                      <Image src="/assets/img/foto28.jpg" alt="Foto" fill className="object-cover photo-warm" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-wider text-[#F2CF8B]">Voz Ciudadana</p>
                    <p className="mt-1 font-editorial text-sm leading-tight text-white">"Organizarnos es defender lo nuestro."</p>
                    <div className="my-1.5 h-px w-4 bg-[#E5A93C]/40" />
                    <p className="text-[9px] font-bold text-white">Tu nombre</p>
                    <p className="text-[7px] tracking-wider text-white/45 uppercase">Chilpancingo, Gro.</p>
                  </div>
                </div>

                {/* Footer póster */}
                <div className="relative z-10 border-t border-white/10 pt-2.5 text-center">
                  <p className="text-[7px] font-black tracking-[0.22em] uppercase text-[#F2CF8B]">Defensa de la Soberanía Nacional</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          FORMULARIO DE ADHESIÓN + FOOTER
          ════════════════════════════════ */}
      <footer className="bg-[#1A1A18] border-t border-white/8 px-5 py-16 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Formulario WhatsApp */}
          <div className="mb-14 rounded-4xl bg-[#C85A32]/15 border border-[#C85A32]/30 p-8 flex flex-col md:flex-row items-center gap-6 md:gap-12">
            <div className="max-w-md">
              <p className="eyebrow-line text-[#E5A93C] text-[9px]">Adhesión Ciudadana</p>
              <h3 className="mt-3 font-editorial text-2xl">Deja tu número para recibir noticias de tu municipio.</h3>
              <p className="mt-2 text-xs text-white/50">Te enviaremos actualizaciones, encuentros y organización territorial directamente a WhatsApp.</p>
            </div>
            <form className="flex w-full max-w-sm flex-col gap-3"
              onSubmit={e => { e.preventDefault(); window.open("https://chat.whatsapp.com/HSUgjqCm69g8vKujvgkNFN", "_blank"); }}>
              <input type="tel" placeholder="Tu número de WhatsApp (10 dígitos)"
                className="w-full rounded-2xl border border-white/15 bg-white/8 px-4 py-3 text-sm text-white placeholder-white/35 outline-none focus:border-[#E5A93C] transition" />
              <button type="submit"
                className="rounded-full bg-[#C85A32] py-3 text-sm font-black text-white hover:bg-[#E07A52] transition focus:outline-none">
                Unirme al grupo territorial
              </button>
            </form>
          </div>

          {/* Columnas del footer */}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto]">
            {/* Marca */}
            <div className="flex items-start gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-full border border-[#E5A93C]/30 bg-white/8 shrink-0 p-1">
                <Image src="/assets/img/logo.png" alt="Logo Por los Caminos del Sur" fill className="object-contain p-1.5" />
              </div>
              <div>
                <p className="font-editorial text-2xl text-[#FFFDF8]">Esthela Damián</p>
                <p className="eyebrow-line text-[#E5A93C] text-[9px] mt-1">Por los Caminos del Sur</p>
                <p className="mt-4 max-w-xs text-xs leading-relaxed text-white/50">
                  Iniciativa ciudadana e independiente para la transformación territorial de Guerrero, alineada a los principios de Morena.
                </p>
              </div>
            </div>

            {/* Redes */}
            <div>
              <p className="text-[9px] font-black tracking-[0.2em] uppercase text-white/35 mb-4">Redes Oficiales</p>
              <div className="flex flex-col gap-3 text-xs font-bold text-white/65">
                <a href="https://www.facebook.com/PorLosCaminosDelSur" target="_blank" rel="noreferrer" className="hover:text-[#E5A93C] transition">Facebook</a>
                <a href="https://www.instagram.com/porloscamnosdelsur/" target="_blank" rel="noreferrer" className="hover:text-[#E5A93C] transition">Instagram</a>
                <a href="https://chat.whatsapp.com/HSUgjqCm69g8vKujvgkNFN" target="_blank" rel="noreferrer" className="hover:text-[#E5A93C] transition">WhatsApp</a>
                <a href="mailto:Miperfilpoliticogro@proton.me" className="hover:text-[#E5A93C] transition">Contacto</a>
              </div>
            </div>

            {/* Secciones */}
            <div>
              <p className="text-[9px] font-black tracking-[0.2em] uppercase text-white/35 mb-4">Secciones</p>
              <div className="flex flex-col gap-3 text-xs font-bold text-white/65">
                <a href="#rutas"   className="hover:text-[#E5A93C] transition">Rutas del Sur</a>
                <a href="#mercado" className="hover:text-[#E5A93C] transition">Mercado del Sur</a>
                <a href="#voces"   className="hover:text-[#E5A93C] transition">Mapa de Voces</a>
                <a href="#agenda"  className="hover:text-[#E5A93C] transition">Agenda</a>
                <Link href="/tarjetas" className="hover:text-[#E5A93C] transition">Editor de Póster</Link>
              </div>
            </div>
          </div>

          {/* Línea legal */}
          <div className="mt-12 border-t border-white/8 pt-7 flex flex-col md:flex-row justify-between gap-3 text-[9px] text-white/30 tracking-widest uppercase">
            <p>© {new Date().getFullYear()} Por los Caminos del Sur · #PorlosCaminosdelSur · #GuerreroSeOrganiza</p>
            <p className="italic text-white/20">Comunicación ciudadana · Sin pedir el voto · Alineado a Convocatoria Morena GRO 2026</p>
          </div>
        </div>
      </footer>
    </main>
  );
}