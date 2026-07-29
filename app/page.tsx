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
  MoveRight,
  PlayCircle,
  Quote,
  X,
  Shield,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useMemo, useState, useRef } from "react";

const routes = [
  {
    title: "Soberanía y conectividad",
    text: "Pensar los caminos, la infraestructura y el desarrollo desde el interés público y las decisiones de las comunidades.",
    image: "/assets/img/soberania.jpg",
    tone: "from-[#133B5C] to-[#0D2940]",
    num: "01",
    tag: "Infraestructura",
  },
  {
    title: "Campo y economía comunitaria",
    text: "Reconocer a quienes trabajan la tierra y fortalecer el diálogo por la soberanía alimentaria y el trabajo comunitario.",
    image: "/assets/img/campo.png",
    tone: "from-[#244C3A] to-[#11231D]",
    num: "02",
    tag: "Producción",
  },
  {
    title: "Mujeres e igualdad sustantiva",
    text: "Abrir espacios de participación, organización y respeto para una vida con derechos y libre de violencias.",
    image: "/assets/img/mujeres.jfif",
    tone: "from-[#7A1F2B] to-[#4A0F18]",
    num: "03",
    tag: "Derechos",
  },
  {
    title: "Educación y juventudes",
    text: "Defender la educación pública, las oportunidades y las vocaciones que construyen futuro en cada región.",
    image: "/assets/img/juventud.jpg",
    tone: "from-[#15395C] to-[#10293E]",
    num: "04",
    tag: "Juventud",
  },
  {
    title: "Agua y salud comunitaria",
    text: "Poner en el centro el cuidado, la prevención, el acceso al agua y el bienestar de las comunidades.",
    image: "/assets/img/agua.jpg",
    tone: "from-[#285B72] to-[#133B5C]",
    num: "05",
    tag: "Salud",
  },
];

const municipalities = [
  { name: "Acapulco de Juárez", quote: "Organizarnos es defender lo nuestro. Aquí la transformación late con fuerza popular y cercanía." },
  { name: "Chilpancingo de los Bravo", quote: "Escuchar también transforma. La capital se organiza desde sus barrios históricos con asambleas." },
  { name: "Iguala de la Independencia", quote: "El futuro se conversa y se organiza. La historia nos convoca a defender la soberanía nacional." },
  { name: "Zihuatanejo de Azueta", quote: "Desde la costa, abrimos camino. Las comunidades pescadoras y prestadores tienen voz activa." },
  { name: "Chilapa de Álvarez", quote: "Nuestras raíces defienden el territorio. El trabajo comunitario y los tianguis son nuestra fuerza." },
  { name: "Taxco de Alarcón", quote: "El porvenir se construye caminando. La voz de los plateros y artesanos se escucha en alto." },
  { name: "Tlapa de Comonfort", quote: "La montaña habla con dignidad popular. No hay transformación sin los pueblos originarios." },
  { name: "Coyuca de Benítez", quote: "El campo es la base de la soberanía. Fortalecer la economía comunitaria de coco y mango es prioridad." },
  { name: "Ometepec", quote: "Caminos de igualdad para todas y todos en la Costa Chica. El territorio se defiende organizado." },
  { name: "Tecpan de Galeana", quote: "La soberanía alimentaria nace de la tierra trabajada con respeto. Apoyo mutuo en cada huerta." },
  { name: "Atoyac de Álvarez", quote: "Historia, café y lucha en cada camino serrano. La dignidad y la memoria no se negocian." },
  { name: "Ayutla de los Libres", quote: "La asamblea decide, el pueblo manda. La organización autónoma comunitaria florece con fuerza." },
  { name: "Eduardo Neri", quote: "Minerales y campo en desarrollo público. La soberanía de los recursos naturales pertenece al pueblo." },
  { name: "Teloloapan", quote: "La voz del norte guerrerense es firme. La organización social es escudo y motor de cambio." },
  { name: "Tixtla de Guerrero", quote: "Semillero de maestros, próceres y luchadores. La educación pública es la base del futuro." },
  { name: "San Luis Acatlán", quote: "Justicia comunitaria y organización en el corazón indígena de Guerrero. Ejemplo de ley interna." },
  { name: "Tecoanapa", quote: "El acceso al agua potable y la salud básica son derechos colectivos, no mercancías privadas." },
  { name: "Petatlán", quote: "Cuidar nuestros bosques y ríos es defender el futuro ecológico y social de Guerrero." },
  { name: "Huitzuco de los Figueroa", quote: "Cultura, siembra y memoria en cada rincón del territorio. La cuna revolucionaria se defiende." },
  { name: "San Marcos", quote: "Juventudes activas organizando el mañana desde el territorio. El sur se renueva con ideas claras." },
];

const galleryItems = [
  { image: "/assets/img/foto2.jfif", title: "Escucha Activa", desc: "Esthela dialogando en asambleas populares", span: "lg:col-span-2 lg:row-span-2 aspect-[4/5] lg:aspect-auto" },
  { image: "/assets/img/foto.jpg", title: "Caminos del Sur", desc: "El territorio habla a través de su relieve", span: "aspect-[4/3]" },
  { image: "/assets/img/foto15.jfif", title: "Mujeres del Sur", desc: "Tejiendo la red de igualdad sustantiva", span: "aspect-[4/3]" },
  { image: "/assets/img/foto1.png", title: "Organización Agrícola", desc: "La base alimentaria comunitaria en Guerrero", span: "lg:col-span-2 aspect-[16/9]" },
  { image: "/assets/img/foto17.jfif", title: "Diálogo Abierto", desc: "Conversaciones francas casa por casa", span: "aspect-[4/5]" },
  { image: "/assets/img/foto20.jfif", title: "Juventud Consciente", desc: "Foros regionales de educación y vocación", span: "aspect-[1/1]" },
  { image: "/assets/img/foto22.jfif", title: "Soberanía y Unión", desc: "Encuentros por el bienestar popular", span: "aspect-[4/3]" },
];

const agenda = [
  {
    status: "Próximamente",
    place: "Chilpancingo de los Bravo",
    type: "Diálogo Territorial",
    desc: "Encuentro vecinal para la planeación de la conectividad y organización local.",
    date: "24 de Julio",
  },
  {
    status: "Próximamente",
    place: "Acapulco de Juárez",
    type: "Reunión Comunitaria",
    desc: "Mesa de escucha sobre la infraestructura hidráulica y bienestar social.",
    date: "28 de Julio",
  },
  {
    status: "Próximamente",
    place: "Iguala de la Independencia",
    type: "Foro de Juventudes",
    desc: "Espacio de formación política, debate y propuestas para el relevo generacional.",
    date: "02 de Agosto",
  },
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Estado para el municipio activo en el Mapa de Voces
  const [hoveredMunicipio, setHoveredMunicipio] = useState<typeof municipalities[0]>(municipalities[0]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setVideoMuted(videoRef.current.muted);
    }
  };

  return (
    <main className="overflow-x-hidden bg-[#F4EFE6] text-[#1E1E1C] font-sans selection:bg-[#7A1F2B] selection:text-[#FFFDF8]">
      
      {/* HEADER EDITORIAL PREMIUM */}
      <header className="absolute inset-x-0 top-0 z-50 transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 lg:px-8">
          <Link href="/" className="focus-ring flex items-center gap-3.5 text-white">
            <div className="relative h-14 w-14 overflow-hidden rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur transition hover:border-oro/60">
              <Image
                src="/assets/img/logo.png"
                alt="Logo Por los Caminos del Sur"
                fill
                className="object-contain p-2"
                priority
              />
            </div>
            <div>
              <span className="block font-editorial text-2xl leading-none tracking-wide text-[#FFFDF8]">
                Esthela Damián
              </span>
              <span className="mt-1 block text-[10px] font-bold tracking-[0.24em] uppercase text-[#D49A3A]">
                Por los Caminos del Sur
              </span>
            </div>
          </Link>

          {/* Navegación de diario político contemporáneo */}
          <nav className="hidden items-center gap-8 text-xs font-bold uppercase tracking-wider text-[#FFFDF8] lg:flex">
            <a href="#manifiesto" className="transition hover:text-[#D49A3A] hover:underline underline-offset-4">Manifiesto</a>
            <a href="#rutas" className="transition hover:text-[#D49A3A] hover:underline underline-offset-4">Rutas del Sur</a>
            <a href="#voces" className="transition hover:text-[#D49A3A] hover:underline underline-offset-4">Mapa de Voces</a>
            <a href="#galeria" className="transition hover:text-[#D49A3A] hover:underline underline-offset-4">Galería</a>
            <a href="#agenda" className="transition hover:text-[#D49A3A] hover:underline underline-offset-4">Agenda</a>
            
            <Link
              href="/tarjetas"
              className="rounded-full bg-[#D49A3A] px-6 py-3 text-center text-[#1E1E1C] font-bold shadow-md hover:bg-[#FFFDF8] transition duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-oro"
            >
              Crea tu póster
            </Link>
          </nav>

          {/* Hamburguesa móvil */}
          <button
            type="button"
            aria-label="Abrir menú"
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus-ring rounded-full p-2.5 text-white bg-white/10 backdrop-blur lg:hidden border border-white/15"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menú móvil drop */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="border-t border-white/10 bg-[#11231D]/95 px-5 py-6 backdrop-blur lg:hidden"
            >
              <nav className="mx-auto flex max-w-7xl flex-col gap-4 text-xs font-bold uppercase tracking-wider text-white">
                <a href="#manifiesto" onClick={() => setMenuOpen(false)} className="py-2 border-b border-white/5">Manifiesto</a>
                <a href="#rutas" onClick={() => setMenuOpen(false)} className="py-2 border-b border-white/5">Rutas del Sur</a>
                <a href="#voces" onClick={() => setMenuOpen(false)} className="py-2 border-b border-white/5">Mapa de Voces</a>
                <a href="#galeria" onClick={() => setMenuOpen(false)} className="py-2 border-b border-white/5">Galería</a>
                <a href="#agenda" onClick={() => setMenuOpen(false)} className="py-2 border-b border-white/5">Agenda</a>
                <Link
                  href="/tarjetas"
                  onClick={() => setMenuOpen(false)}
                  className="mt-2 block w-full rounded-full bg-[#D49A3A] py-3 text-center text-[#1E1E1C] font-bold"
                >
                  Crea tu póster
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 1. HERO CINEMATOGRÁFICO DE ALTO IMPACTO */}
      <section className="relative min-h-[100svh] overflow-hidden bg-[#11231D] flex items-center">
        {/* Imagen de fallback estática */}
        <Image
          src="/assets/img/foto28.jpg"
          alt="Esthela Damián recorriendo Guerrero"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Video en bucle */}
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            heroReady ? "opacity-100" : "opacity-0"
          }`}
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

        {/* Overlay cinematográfico de globals.css */}
        <div className="absolute inset-0 hero-overlay-cinematic" />
        <div className="absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-[#F4EFE6] to-transparent opacity-80" />

        {/* Contenido tipográfico y sello de marca */}
        <div className="relative z-20 mx-auto w-full max-w-7xl px-5 pb-16 pt-32 lg:px-8 lg:pb-24">
          <div className="grid w-full gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              {/* Badge Identitario */}
              <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[#D49A3A]/40 bg-black/30 px-4.5 py-2 text-[10px] font-bold tracking-[0.2em] text-[#F4EFE6] uppercase backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D49A3A] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D49A3A]"></span>
                </span>
                Guerrero · Territorio Activo
              </div>

              {/* Sello / Marca en Hero */}
              <div className="mb-6 flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/20 bg-white/10 backdrop-blur p-1">
                  <Image
                    src="/assets/img/logo.png"
                    alt="Logo Por los Caminos del Sur"
                    fill
                    className="object-contain p-1.5"
                  />
                </div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D49A3A] brand-seal">
                  Por los Caminos del Sur
                </p>
              </div>

              {/* Titular */}
              <h1 className="font-editorial text-balance text-5xl leading-[0.9] text-[#FFFDF8] sm:text-7xl lg:text-[6.5rem]">
                Guerrero se organiza.
                <span className="block pt-2 text-[#D49A3A] italic font-semibold">Su futuro se defiende.</span>
              </h1>

              {/* Párrafo Narrativo */}
              <p className="mt-8 max-w-2xl text-lg lg:text-xl leading-relaxed text-[#F4EFE6]/90 font-medium">
                Voces, comunidades y caminos para dialogar, consolidar la soberanía popular y organizar el territorio con la dignidad y fuerza que caracterizan al sur de México.
              </p>

              {/* Botones de Acción */}
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#voces"
                  className="focus-ring inline-flex items-center justify-center gap-2.5 rounded-full bg-[#D49A3A] px-7 py-4 font-bold text-[#1E1E1C] transition duration-300 hover:bg-[#FFFDF8] hover:shadow-lg hover:-translate-y-0.5"
                >
                  Conoce las voces del Sur
                  <ArrowRight size={16} />
                </a>
                <Link
                  href="/tarjetas"
                  className="focus-ring inline-flex items-center justify-center gap-2.5 rounded-full border-2 border-[#FFFDF8]/45 px-7 py-4 font-bold text-white transition duration-300 hover:bg-white/10 hover:-translate-y-0.5"
                >
                  Crea tu póster social
                  <MessageCircleHeart size={16} />
                </Link>
              </div>
            </motion.div>

            {/* Señal Editorial Flotante a la Derecha */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="ml-auto max-w-md rounded-[2rem] border border-white/15 bg-black/20 p-6.5 backdrop-blur-xl shadow-editorial">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D49A3A]">
                    Señal Editorial
                  </p>
                  <button
                    onClick={toggleMute}
                    className="rounded-full bg-white/10 p-1.5 text-white hover:bg-white/20 transition"
                    title={videoMuted ? "Activar audio" : "Silenciar"}
                  >
                    {videoMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                </div>
                
                <p className="mt-5 font-editorial text-3xl leading-snug text-white italic">
                  “Escuchar también transforma.”
                </p>
                <p className="mt-4 text-xs leading-relaxed text-white/70">
                  Una narrativa política de base que nace del territorio, no de la lejanía. La soberanía se teje escuchando a cada región.
                </p>
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/10 text-[10px] font-bold tracking-wider text-white/50">
                  <span>#PorlosCaminosdelSur</span>
                  <span className="text-[#D49A3A]">CEDTSN 2026</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. EL MANIFIESTO (REVISTA EDITORIAL) */}
      <section
        id="manifiesto"
        className="relative overflow-hidden bg-[#F4EFE6] px-5 py-24 lg:px-8 lg:py-32 paper-grain"
      >
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#D49A3A]/5 blur-[120px]" />
        
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          {/* Columna Izquierda: Retrato de Esthela */}
          <div className="relative">
            <div className="overflow-hidden rounded-[2.5rem] bg-[#FFFDF8] p-3 shadow-editorial border border-[#D7CCBC]/50">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.8rem]">
                <Image
                  src="/assets/img/foto29.jpg"
                  alt="Esthela Damián dialogando con vecinas de Guerrero"
                  fill
                  className="object-cover transition duration-700 hover:scale-[1.02]"
                />
              </div>
            </div>

            {/* Insignia Editorial Flotante */}
            <div className="absolute -bottom-8 left-6 right-6 rounded-[2rem] bg-[#11231D] p-6 text-white shadow-editorial border border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white/10 border border-white/15">
                  <Image
                    src="/assets/img/logo.png"
                    alt="Logo Por los Caminos del Sur"
                    fill
                    className="object-contain p-1.5"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D49A3A]">
                    Organización Territorial
                  </p>
                  <p className="text-[9px] text-white/50">Guerrero en defensa de la soberanía</p>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-white/80 italic">
                “Caminar Guerrero no es una campaña de carteles, es un compromiso de escucha, territorio y presencia real con el pueblo.”
              </p>
            </div>
          </div>

          {/* Columna Derecha: Contenido del Manifiesto */}
          <div className="pt-8 lg:pt-0">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#7A1F2B] uppercase">
              Manifiesto de Transformación
            </span>
            <div className="my-4 h-[3px] w-16 bg-[#D49A3A] rounded-full" />
            
            <h2 className="font-editorial text-4xl leading-tight text-[#11231D] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
              Caminar Guerrero es escuchar su historia, su fuerza y sus causas.
            </h2>
            
            <div className="mt-8 space-y-6 text-base leading-relaxed text-[#1E1E1C]/80">
              <p>
                Desde cada barrio, colonia y ejido de Guerrero, la organización territorial se erige como el camino indispensable para dialogar, estructurar causas colectivas y defender el bienestar común.
              </p>
              <p className="font-semibold text-[#11231D]">
                Este espacio no se edifica desde las oficinas ni la distancia mediática. Se construye a pie, compartiendo experiencias con el pueblo trabajador, organizando comités de defensa y construyendo soberanía nacional en cada rincón del estado.
              </p>
              <p>
                Con el espíritu de la convocatoria de Morena, trabajamos bajo los principios de honestidad y amor al territorio. No buscamos cargos, buscamos defender la transformación de manera organizada y fraterna.
              </p>
            </div>

            {/* Tarjetas de detalle asimétricas */}
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#FFFDF8] p-5 shadow-sm border border-[#D7CCBC]/40">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#D49A3A]">
                  Región de Regiones
                </span>
                <h4 className="mt-2 font-editorial text-xl font-bold text-[#11231D]">Cercanía Activa</h4>
                <p className="mt-2 text-xs leading-relaxed text-[#1E1E1C]/65">
                  Diálogos y presencia sin simulaciones en las siete regiones de Guerrero.
                </p>
              </div>
              <div className="rounded-2xl bg-[#FFFDF8] p-5 shadow-sm border border-[#D7CCBC]/40">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#D49A3A]">
                  Soberanía Nacional
                </span>
                <h4 className="mt-2 font-editorial text-xl font-bold text-[#11231D]">Defensa Colectiva</h4>
                <p className="mt-2 text-xs leading-relaxed text-[#1E1E1C]/65">
                  Organizar la fuerza del pueblo en comités locales de transformación nacional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. RUTAS DEL SUR (COMPOSICIÓN ASIMÉTRICA PREMIUM) */}
      <section id="rutas" className="bg-[#11231D] px-5 py-24 text-white lg:px-8 lg:py-32 relative overflow-hidden">
        {/* Luces de fondo */}
        <div className="absolute left-0 bottom-0 h-96 w-96 rounded-full bg-[#D49A3A]/5 blur-[120px] pointer-events-none" />
        
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-white/10 pb-10">
            <div className="max-w-2xl">
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#D49A3A] uppercase">
                Rutas de Trabajo Territorial
              </span>
              <div className="my-4 h-[3px] w-16 bg-[#D49A3A] rounded-full" />
              <h2 className="font-editorial text-4xl leading-tight sm:text-5xl">
                Cinco rutas. Un mismo horizonte.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-white/70">
              Cada ruta representa un eje de diálogo, recolección de propuestas y organización territorial, trazando un mapa integral de soluciones populares.
            </p>
          </div>

          {/* Grid Asimétrico Editorial para las Rutas */}
          <div className="mt-14 grid gap-6 lg:grid-cols-12">
            
            {/* RUTA 1: Grande e impactante (Soberanía y conectividad) - Col Span 7 */}
            <article className="ruta-card group overflow-hidden rounded-[2.5rem] bg-[#133B5C] lg:col-span-7 border border-white/10 flex flex-col justify-between">
              <div className="grid h-full lg:grid-cols-[1.1fr_0.9fr]">
                <div className="relative min-h-[320px] overflow-hidden">
                  <Image
                    src={routes[0].image}
                    alt={routes[0].title}
                    fill
                    className="ruta-img object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#133B5C]/90 hidden lg:block" />
                </div>
                <div className="flex flex-col justify-between bg-gradient-to-br from-[#133B5C] to-[#0D2940] p-8 lg:p-10">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F2CF8B]">
                        Ruta {routes[0].num}
                      </span>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-[9px] uppercase tracking-wider text-white/80">
                        {routes[0].tag}
                      </span>
                    </div>
                    <h3 className="mt-6 font-editorial text-3xl leading-tight">
                      {routes[0].title}
                    </h3>
                    <p className="mt-4 text-xs lg:text-sm leading-relaxed text-white/80">
                      {routes[0].text}
                    </p>
                  </div>
                  <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#D49A3A]">
                    Organizar el Sur <MoveRight size={14} className="transition group-hover:translate-x-1.5" />
                  </div>
                </div>
              </div>
            </article>

            {/* RUTA 2: Campo y economía comunitaria - Col Span 5 */}
            <article className="ruta-card group overflow-hidden rounded-[2.5rem] bg-[#244C3A] lg:col-span-5 border border-white/10 flex flex-col justify-between">
              <div className="relative min-h-[220px] overflow-hidden">
                <Image
                  src={routes[1].image}
                  alt={routes[1].title}
                  fill
                  className="ruta-img object-cover"
                />
              </div>
              <div className="bg-gradient-to-br from-[#244C3A] to-[#11231D] p-8">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F2CF8B]">
                    Ruta {routes[1].num}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[9px] uppercase tracking-wider text-white/80">
                    {routes[1].tag}
                  </span>
                </div>
                <h3 className="mt-5 font-editorial text-2xl leading-tight">
                  {routes[1].title}
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-white/80">
                  {routes[1].text}
                </p>
              </div>
            </article>

            {/* RUTA 3: Mujeres e igualdad sustantiva - Col Span 4 */}
            <article className="ruta-card group overflow-hidden rounded-[2.5rem] bg-[#7A1F2B] lg:col-span-4 border border-white/10 flex flex-col justify-between">
              <div className="relative min-h-[200px] overflow-hidden">
                <Image
                  src={routes[2].image}
                  alt={routes[2].title}
                  fill
                  className="ruta-img object-cover"
                />
              </div>
              <div className="bg-gradient-to-br from-[#7A1F2B] to-[#4A0F18] p-7.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F2CF8B]">
                    Ruta {routes[2].num}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[9px] uppercase tracking-wider text-white/80">
                    {routes[2].tag}
                  </span>
                </div>
                <h3 className="mt-5 font-editorial text-2xl leading-tight">
                  {routes[2].title}
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-white/80">
                  {routes[2].text}
                </p>
              </div>
            </article>

            {/* RUTA 4: Educación y juventudes - Col Span 4 */}
            <article className="ruta-card group overflow-hidden rounded-[2.5rem] bg-[#15395C] lg:col-span-4 border border-white/10 flex flex-col justify-between">
              <div className="relative min-h-[200px] overflow-hidden">
                <Image
                  src={routes[3].image}
                  alt={routes[3].title}
                  fill
                  className="ruta-img object-cover"
                />
              </div>
              <div className="bg-gradient-to-br from-[#15395C] to-[#10293E] p-7.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F2CF8B]">
                    Ruta {routes[3].num}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[9px] uppercase tracking-wider text-white/80">
                    {routes[3].tag}
                  </span>
                </div>
                <h3 className="mt-5 font-editorial text-2xl leading-tight">
                  {routes[3].title}
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-white/80">
                  {routes[3].text}
                </p>
              </div>
            </article>

            {/* RUTA 5: Agua y salud comunitaria - Col Span 4 */}
            <article className="ruta-card group overflow-hidden rounded-[2.5rem] bg-[#285B72] lg:col-span-4 border border-white/10 flex flex-col justify-between">
              <div className="relative min-h-[200px] overflow-hidden">
                <Image
                  src={routes[4].image}
                  alt={routes[4].title}
                  fill
                  className="ruta-img object-cover"
                />
              </div>
              <div className="bg-gradient-to-br from-[#285B72] to-[#133B5C] p-7.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F2CF8B]">
                    Ruta {routes[4].num}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[9px] uppercase tracking-wider text-white/80">
                    {routes[4].tag}
                  </span>
                </div>
                <h3 className="mt-5 font-editorial text-2xl leading-tight">
                  {routes[4].title}
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-white/80">
                  {routes[4].text}
                </p>
              </div>
            </article>

          </div>
        </div>
      </section>

      {/* DETALLE EDITORIAL (PIEZA DE TRANSICIÓN) */}
      <section className="bg-[#FFFDF8] px-5 py-24 lg:px-8 lg:py-28 paper-grain border-y border-[#D7CCBC]/50">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            
            <div className="rounded-[2.5rem] bg-[#11231D] p-8 lg:p-12 text-white shadow-editorial relative overflow-hidden">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#D49A3A]/10 blur-2xl" />
              <div className="relative z-10 flex items-center gap-3">
                <Quote className="h-6 w-6 text-[#D49A3A]" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D49A3A]">
                  Señal de Recorrido
                </p>
              </div>
              <h2 className="relative z-10 mt-6 font-editorial text-4xl leading-tight text-white lg:text-[2.6rem]">
                Una política que no posa: camina, escucha y teje comunidad.
              </h2>
              <p className="relative z-10 mt-6 text-sm leading-relaxed text-white/70">
                La organización territorial en Guerrero no se basa en el marketing digital ruidoso. Creamos identidad desde la base social, combinando el fotorreportaje documental con herramientas interactivas que amplifican la voz de los municipios.
              </p>
              <div className="relative z-10 mt-8 flex items-center gap-3.5 border-t border-white/10 pt-6">
                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/15 bg-white/10">
                  <Image
                    src="/assets/img/logo.png"
                    alt="Logo Por los Caminos del Sur"
                    fill
                    className="object-contain p-1.5"
                  />
                </div>
                <div>
                  <span className="block text-xs font-bold tracking-wider text-white">Esthela Damián</span>
                  <span className="block text-[10px] tracking-widest text-[#D49A3A] uppercase mt-0.5">Territorio · Comunidad · Soberanía</span>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2.5rem] border border-[#D7CCBC]/55 bg-white p-3 shadow-editorial">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[1.8rem]">
                <Image
                  src="/assets/img/foto22.jfif"
                  alt="Esthela Damián caminando en territorio guerrerense"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. MAPA DE VOCES (CARTOGRAFÍA VIVA INTERACTIVA) */}
      <section id="voces" className="bg-[#244C3A] px-5 py-24 text-white lg:px-8 lg:py-32 relative overflow-hidden">
        {/* Decoraciones */}
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-black/10 blur-[100px] pointer-events-none" />
        
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            
            {/* LADO IZQUIERDO: Cartografía Interactiva */}
            <div className="rounded-[2.5rem] border border-white/10 bg-[#11231D]/45 p-6 lg:p-8 backdrop-blur-md">
              <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D49A3A]">
                    Cartografía de Guerrero
                  </span>
                  <h3 className="mt-1 text-sm text-white/60">Asambleas y Red Territorial Activa</h3>
                </div>
                <div className="rounded-full bg-white/10 px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white/80 border border-white/5">
                  20 Municipios
                </div>
              </div>

              {/* Grid interactivo de municipios */}
              <div className="grid gap-2.5 sm:grid-cols-2 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
                {municipalities.map((item, idx) => (
                  <button
                    key={item.name}
                    onMouseEnter={() => setHoveredMunicipio(item)}
                    onClick={() => setHoveredMunicipio(item)}
                    className={`text-left rounded-xl border px-4 py-3 text-xs transition duration-300 flex flex-col justify-between gap-1.5 focus:outline-none ${
                      hoveredMunicipio.name === item.name
                        ? "border-[#D49A3A] bg-white/10 shadow-lg scale-[1.02]"
                        : "border-white/5 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className={`h-3.5 w-3.5 shrink-0 ${
                        hoveredMunicipio.name === item.name ? "text-[#D49A3A] animate-bounce" : "text-white/40"
                      }`} />
                      <span className="font-bold tracking-wide truncate">{item.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-white/45">
                      <span>Nodo {String(idx + 1).padStart(2, "0")}</span>
                      {hoveredMunicipio.name === item.name && (
                        <span className="text-[#D49A3A] font-semibold">Seleccionado</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* LADO DERECHO: El Faro de Voces */}
            <div className="lg:sticky lg:top-28">
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#D49A3A] uppercase">
                Mapa de Voces
              </span>
              <div className="my-4 h-[3px] w-16 bg-[#D49A3A] rounded-full" />
              
              <h2 className="font-editorial text-4xl leading-tight sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
                Voces territoriales en movimiento.
              </h2>
              
              <p className="mt-6 text-sm leading-relaxed text-white/70">
                Pasa el cursor o selecciona un municipio de la lista para ver la voz y la causa comunitaria que encabeza la organización del territorio.
              </p>

              {/* Panel dinámico con animación */}
              <div className="mt-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={hoveredMunicipio.name}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35 }}
                    className="rounded-[2rem] border border-[#D49A3A]/30 bg-gradient-to-br from-[#11231D] to-[#0A1410] p-8 shadow-editorial relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-5 text-white/10 select-none pointer-events-none">
                      <Quote size={80} />
                    </div>
                    
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D49A3A]">
                      <Sparkles size={12} />
                      Municipio Escuchado
                    </div>
                    
                    <h3 className="mt-3 font-editorial text-2xl text-white">
                      {hoveredMunicipio.name}
                    </h3>
                    
                    <div className="my-5 h-px w-12 bg-white/20" />
                    
                    <p className="font-editorial text-[22px] leading-snug text-[#FFFDF8] italic font-medium">
                      “{hoveredMunicipio.quote}”
                    </p>

                    <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5 text-[10px] text-white/50 tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Shield size={12} className="text-[#D49A3A]" />
                        Nodo Territorial Activo
                      </span>
                      <span>#PorlosCaminosdelSur</span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. GALERÍA TERRITORIAL (FOTORREPORTAJE) */}
      <section id="galeria" className="bg-[#F4EFE6] px-5 py-24 lg:px-8 lg:py-32 paper-grain border-b border-[#D7CCBC]/50">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-3xl border-b border-[#D7CCBC]/60 pb-8 flex flex-col justify-between items-start gap-4 md:flex-row md:items-end">
            <div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#7A1F2B] uppercase">
                Fotorreportaje Territorial
              </span>
              <div className="my-4 h-[3px] w-16 bg-[#D49A3A] rounded-full" />
              <h2 className="font-editorial text-4xl leading-tight text-[#11231D] sm:text-5xl">
                El sur no se explica desde lejos.
              </h2>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-[#1E1E1C]/65">
              Imágenes reales de Esthela recorriendo comunidades indígenas, zonas costeras y ejidos serranos, capturando el espíritu colectivo y organizativo de Guerrero.
            </p>
          </div>

          {/* Mosaic Grid Editorial */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className={`galeria-item group relative rounded-[2rem] overflow-hidden bg-[#FFFDF8] border border-[#D7CCBC]/50 p-2 shadow-sm ${item.span}`}
              >
                <div className="relative h-full w-full overflow-hidden rounded-[1.6rem]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Overlay gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Textos flotantes en hover */}
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#D49A3A]">
                      {item.title}
                    </span>
                    <p className="mt-1 font-editorial text-lg leading-tight text-[#FFFDF8]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. AGENDA TERRITORIAL (CRONOGRAMA DE DIÁLOGO) */}
      <section id="agenda" className="relative overflow-hidden bg-[#133B5C] px-5 py-24 text-white lg:px-8 lg:py-32">
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-[#D49A3A]/5 blur-[120px]" />
        
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl border-b border-white/10 pb-8 mb-12">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-[#D49A3A] uppercase">
              <CalendarDays size={14} className="text-[#D49A3A]" />
              Agenda Territorial Abierta
            </div>
            <div className="my-4 h-[3px] w-16 bg-[#D49A3A] rounded-full" />
            
            <h2 className="font-editorial text-4xl leading-tight sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
              Encuentros, asambleas y organización.
            </h2>
            
            <p className="mt-5 text-sm leading-relaxed text-white/70">
              Conoce los próximos nodos de escucha territorial, organizados por asambleas ejidales y sectoriales de base.
            </p>
          </div>

          {/* Grid de Actividades */}
          <div className="grid gap-6 lg:grid-cols-3">
            {agenda.map((item, idx) => (
              <article
                key={idx}
                className="rounded-[2.5rem] border border-white/10 bg-[#0D2940]/50 p-7.5 backdrop-blur flex flex-col justify-between hover:border-[#D49A3A]/40 transition duration-300"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#D49A3A]">
                      {item.status}
                    </span>
                    <span className="text-[11px] font-bold tracking-widest text-white/60">
                      {item.date}
                    </span>
                  </div>
                  
                  <h3 className="mt-5 font-editorial text-2xl leading-tight text-white">
                    {item.place}
                  </h3>
                  
                  <p className="mt-2 text-xs font-bold tracking-wider text-[#F2CF8B] uppercase">
                    {item.type}
                  </p>
                  
                  <p className="mt-4 text-xs lg:text-sm leading-relaxed text-white/70">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40 uppercase">
                  <span>Asamblea de base</span>
                  <span>Morena Gro</span>
                </div>
              </article>
            ))}
          </div>

          {/* CTA de Solicitud de Reunión */}
          <div className="mt-14 flex flex-col items-center justify-between rounded-[2rem] border border-white/10 bg-[#0D2940]/30 p-8 md:flex-row md:p-10">
            <div className="max-w-xl text-center md:text-left mb-6 md:mb-0">
              <h4 className="font-editorial text-2xl text-white">¿Quieres organizar un diálogo territorial en tu comunidad?</h4>
              <p className="mt-2 text-xs text-white/60">
                La organización colectiva se teje escuchando a cada ejido y colonia. Contáctanos para coordinar un encuentro.
              </p>
            </div>
            
            <a
              href="mailto:Miperfilpoliticogro@proton.me?subject=Solicitud%20de%20encuentro%20territorial"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-[#D49A3A] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#1E1E1C] transition duration-300 hover:bg-[#FFFDF8] hover:shadow-lg shrink-0"
            >
              Solicitar encuentro
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* SECCIÓN DEL PÓSTER (INVITACIÓN DE REDES) */}
      <section className="bg-[#1A0A0E] px-5 py-24 text-white lg:px-8 relative overflow-hidden">
        {/* Luces */}
        <div className="absolute left-0 bottom-0 h-96 w-96 rounded-full bg-[#7A1F2B]/10 blur-[120px] pointer-events-none" />
        
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D49A3A]">
              Identidad Digital Compartible
            </span>
            <h2 className="mt-4 font-editorial text-4xl leading-tight text-white sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
              El póster social es parte del manifiesto.
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-white/70">
              Nuestra campaña territorial no depende de presupuestos exorbitantes. Depende de la voz orgánica del pueblo. Hemos diseñado un generador de pósteres para que puedas integrar tu foto, tu municipio y tu frase en un diseño editorial premium e inmediatamente compartible en tus estados de WhatsApp o redes sociales.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/tarjetas"
                className="inline-flex items-center gap-2 rounded-full bg-[#D49A3A] px-7 py-4 text-xs font-bold uppercase tracking-wider text-[#1E1E1C] transition duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-0.5"
              >
                Crear mi póster social
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Tarjeta de simulación del póster */}
          <div className="flex justify-center">
            <div className="w-full max-w-[380px] rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-4 backdrop-blur shadow-editorial">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.8rem] poster-gradient-guinda p-6 text-white flex flex-col justify-between border border-oro/30">
                {/* Doble borde interior */}
                <div className="absolute inset-3 border border-oro/20 pointer-events-none rounded-[1.5rem]" />
                
                {/* Header */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full border border-oro/30 bg-black/10 backdrop-blur p-1">
                      <Image
                        src="/assets/img/logo.png"
                        alt="Logo"
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#F2CF8B] leading-none">
                        Guerrero se organiza.
                      </p>
                      <p className="mt-1 text-[7px] uppercase tracking-widest text-white/50 leading-none">
                        #PorlosCaminosdelSur
                      </p>
                    </div>
                  </div>
                </div>

                {/* Grid asimétrico mini */}
                <div className="relative z-10 grid grid-cols-[1.1fr_0.9fr] gap-4 py-4 items-center">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-oro/35 p-1 bg-black/10">
                    <div className="relative h-full w-full overflow-hidden rounded-lg">
                      <Image
                        src="/assets/img/foto28.jpg"
                        alt="Esthela"
                        fill
                        className="object-cover photo-blend-warm"
                      />
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-[#F2CF8B]">
                      Voz Ciudadana
                    </span>
                    <h3 className="mt-1 font-editorial text-lg leading-tight text-white">
                      “Organizarnos es defender lo nuestro.”
                    </h3>
                    <div className="my-2 h-[1px] w-6 bg-oro/40" />
                    <p className="text-xs font-bold text-white">Esthela Damián</p>
                    <p className="text-[9px] uppercase tracking-wider text-white/50">Chilpancingo, Gro.</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="relative z-10 text-center border-t border-white/10 pt-3">
                  <p className="text-[8px] font-bold uppercase tracking-widest text-[#F2CF8B]">
                    Defensa de la Soberanía Nacional
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER DEL MOVIMIENTO (LÍNEAS AUSTERA, LEGAL Y ORGANIZADA) */}
      <footer className="bg-[#11231D] px-5 py-12 text-white lg:px-8 border-t border-white/5">
        <div className="mx-auto max-w-7xl flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="relative h-14 w-14 overflow-hidden rounded-full border border-white/15 bg-white/10 shrink-0">
              <Image
                src="/assets/img/logo.png"
                alt="Logo Por los Caminos del Sur"
                fill
                className="object-contain p-2"
              />
            </div>

            <div>
              <p className="font-editorial text-2xl text-[#FFFDF8]">Esthela Damián</p>
              <p className="mt-0.5 text-xs font-bold tracking-[0.2em] text-[#D49A3A] uppercase">
                Por los Caminos del Sur
              </p>
              <p className="mt-4 max-w-md text-xs leading-relaxed text-white/60">
                Espacio de comunicación, diálogo y formación ciudadana. Guerrero, México. Con apego a las normas constitucionales de comunicación política del partido Morena.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-xs font-bold uppercase tracking-wider text-white/70">
            <span className="text-[10px] text-white/40 tracking-widest font-extrabold uppercase">Enlaces de Contacto</span>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <a
                href="https://www.facebook.com/PorLosCaminosDelSur"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#D49A3A] transition"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/porloscamnosdelsur/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#D49A3A] transition"
              >
                Instagram
              </a>
              <a
                href="https://chat.whatsapp.com/HSUgjqCm69g8vKujvgkNFN"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#D49A3A] transition"
              >
                WhatsApp
              </a>
              <a
                href="mailto:Miperfilpoliticogro@proton.me"
                className="hover:text-[#D49A3A] transition"
              >
                Contacto
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-[10px] leading-relaxed text-white/40">
          <p>
            © {new Date().getFullYear()} Por los Caminos del Sur. Todos los derechos reservados. #PorlosCaminosdelSur #GuerreroSeOrganiza #EscucharTambiénTransforma
          </p>
          <p className="italic text-white/30 text-right">
            Alineado a las bases de la Convocatoria de Morena para la Defensa de la Soberanía.
          </p>
        </div>
      </footer>
    </main>
  );
}