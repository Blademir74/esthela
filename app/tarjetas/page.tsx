"use client";

import { useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import {
  Download, Share2, ImagePlus, Camera, ArrowLeft,
  Palette, Sparkles, Sliders, Check, ChevronDown,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/* ══════════════════════════════════════
   DATA
   ══════════════════════════════════════ */
const municipios = [
  "Acapulco de Juárez", "Chilpancingo de los Bravo", "Iguala de la Independencia",
  "Zihuatanejo de Azueta", "Chilapa de Álvarez", "Taxco de Alarcón",
  "Tlapa de Comonfort", "Coyuca de Benítez", "Ometepec", "Tecpan de Galeana",
  "Atoyac de Álvarez", "Ayutla de los Libres", "Eduardo Neri", "Teloloapan",
  "Tixtla de Guerrero", "San Luis Acatlán", "Tecoanapa", "Petatlán",
  "Huitzuco de los Figueroa", "San Marcos",
];

const frases = [
  "Mi comunidad tiene voz.",
  "Organizarnos es defender lo nuestro.",
  "Guerrero se construye desde el territorio.",
  "La soberanía se defiende entre todas y todos.",
  "Escuchar también transforma.",
  "Desde mi comunidad, abrimos camino.",
  "El futuro se conversa y se organiza.",
];

const temas = [
  {
    id: "guinda",
    nombre: "Guinda Profundo",
    css: "poster-guinda",
    dot: "#7A1F2B",
    bgHex: "#2C0A12",
    acento: "#F2CF8B",
  },
  {
    id: "sierra",
    nombre: "Verde Sierra",
    css: "poster-sierra",
    dot: "#2D5A27",
    bgHex: "#0d1f0b",
    acento: "#F2CF8B",
  },
  {
    id: "pacifico",
    nombre: "Azul Pacífico",
    css: "poster-pacifico",
    dot: "#0F4C81",
    bgHex: "#061d36",
    acento: "#F2CF8B",
  },
  {
    id: "terracota",
    nombre: "Terracota Sur",
    css: "poster-terracota",
    dot: "#C85A32",
    bgHex: "#4A1A0A",
    acento: "#F2CF8B",
  },
  {
    id: "miel",
    nombre: "Miel Dorado",
    css: "poster-miel",
    dot: "#E5A93C",
    bgHex: "#5A3F10",
    acento: "#1A1A18",
  },
];

const filtros = [
  { id: "natural",    nombre: "Natural",    css: "photo-natural"    },
  { id: "warm",       nombre: "Cálido",     css: "photo-warm"       },
  { id: "editorial",  nombre: "Editorial",  css: "photo-editorial"  },
  { id: "mono",       nombre: "Monocromo",  css: "photo-monochrome" },
];

const fotoOptions = [
  { id: "esthela1",  nombre: "Esthela (Recorrido)",  src: "/assets/img/foto28.jpg" },
  { id: "esthela2",  nombre: "Esthela (Diálogo)",    src: "/assets/img/foto29.jpg" },
  { id: "esthela3",  nombre: "Esthela (Territorio)", src: "/assets/img/foto30.jpg" },
  { id: "causa",     nombre: "Sin foto (Causa)",     src: ""                       },
  { id: "user",      nombre: "Subir mi foto",        src: ""                       },
];

/* ══════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════ */
export default function TarjetasPage() {
  const posterRef = useRef<HTMLDivElement>(null);

  /* Estado del editor */
  const [nombre,        setNombre]        = useState("");
  const [municipio,     setMunicipio]     = useState("Chilpancingo de los Bravo");
  const [frase,         setFrase]         = useState(frases[1]);
  const [temaId,        setTemaId]        = useState("guinda");
  const [filtroId,      setFiltroId]      = useState("warm");
  const [fotoSourceId,  setFotoSourceId]  = useState("esthela1");
  const [userPhotoURL,  setUserPhotoURL]  = useState<string | null>(null);
  const [layout,        setLayout]        = useState<"asimetrico" | "retrato">("asimetrico");
  const [formato,       setFormato]       = useState<"4-5" | "9-16">("4-5");
  const [generando,     setGenerando]     = useState(false);
  const [tab,           setTab]           = useState<"mensaje" | "estilo" | "imagen">("mensaje");

  /* Derivados */
  const tema    = useMemo(() => temas.find(t => t.id === temaId)   || temas[0],   [temaId]);
  const filtro  = useMemo(() => filtros.find(f => f.id === filtroId)|| filtros[0], [filtroId]);
  const displayNombre = useMemo(() => nombre.trim() || "Voz Ciudadana", [nombre]);

  const fotoSrc = useMemo(() => {
    if (fotoSourceId === "user") return userPhotoURL;
    if (fotoSourceId === "causa") return null;
    return fotoOptions.find(o => o.id === fotoSourceId)?.src ?? null;
  }, [fotoSourceId, userPhotoURL]);

  /* Dimensiones internas del canvas (siempre 1080px de ancho) */
  const canvasH = formato === "4-5" ? 1350 : 1920;

  /* Escala de preview */
  const previewW = 400;
  const previewH = formato === "4-5" ? 500 : 711;
  const scale    = previewW / 1080;

  /* Manejo de foto */
  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUserPhotoURL(URL.createObjectURL(file));
    setFotoSourceId("user");
  };

  /* Generación del canvas */
  const buildCanvas = async () => {
    if (!posterRef.current) return null;
    return html2canvas(posterRef.current, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: tema.bgHex,
      logging: false,
    });
  };

  const handleDownload = async () => {
    setGenerando(true);
    try {
      const canvas = await buildCanvas();
      if (!canvas) return;
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `poster-caminos-${displayNombre.replace(/\s+/g, "-").toLowerCase()}-${formato}.png`;
      a.click();
    } catch (err) { console.error(err); }
    finally { setGenerando(false); }
  };

  const handleShare = async () => {
    setGenerando(true);
    try {
      const canvas = await buildCanvas();
      if (!canvas) return;
      const blob = await new Promise<Blob | null>(r => canvas.toBlob(b => r(b), "image/png", 0.95));
      if (!blob) return;
      const file = new File([blob], "poster-caminos-del-sur.png", { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "Por los Caminos del Sur",
          text: `${displayNombre} desde ${municipio}: "${frase}" #PorlosCaminosdelSur`,
          files: [file],
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "poster-caminos-del-sur.png"; a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) { console.error(err); }
    finally { setGenerando(false); }
  };

  /* ════════════════════ RENDER ════════════════════ */
  return (
    <main className="min-h-screen bg-[#F4EFE6] text-[#1A1A18]">

      {/* HEADER EDITOR */}
      <header className="sticky top-0 z-40 border-b border-[#1A1A18]/10 bg-[#FFFDF8]/90 backdrop-blur py-3.5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link href="/" className="group flex items-center gap-2 text-[11px] font-black tracking-widest uppercase text-[#C85A32] transition hover:text-[#A04526]">
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
            Volver al inicio
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="relative h-9 w-9 overflow-hidden rounded-full border border-[#E5A93C]/50 bg-white/10">
              <Image src="/assets/img/logo.png" alt="Logo" fill className="object-contain p-1.5" />
            </div>
            <span className="hidden text-[9px] font-black tracking-[0.24em] uppercase text-[#C85A32] sm:block">
              Por los Caminos del Sur
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[420px_1fr] lg:gap-12 lg:px-8 lg:py-14">

        {/* ══ PANEL DE CONTROL ══ */}
        <section className="flex flex-col rounded-5xl bg-[#FFFDF8] p-6 shadow-editorial border border-[#1A1A18]/8">
          {/* Encabezado del editor */}
          <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-[#C85A32]/10 px-4 py-1.5 text-[9px] font-black tracking-[0.2em] uppercase text-[#C85A32]">
            <Camera size={12} />
            Editor de Póster Editorial
          </div>
          <h1 className="mt-3 font-editorial text-3xl leading-tight text-[#1A1A18]">
            Crea tu pieza de identidad digital.
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-[#1A1A18]/60">
            Tu foto se procesa en tu navegador. No se guarda en ningún servidor.
          </p>

          {/* Tabs */}
          <div className="mt-6 flex border-b border-[#1A1A18]/10">
            {(["mensaje", "estilo", "imagen"] as const).map((t, i) => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 pb-3 text-[10px] font-black uppercase tracking-widest transition ${
                  tab === t
                    ? "border-b-2 border-[#C85A32] text-[#C85A32]"
                    : "text-[#1A1A18]/35 hover:text-[#1A1A18]/60"
                }`}>
                {i + 1}. {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Contenido de tabs */}
          <div className="mt-6 flex-1 space-y-5">

            {/* ── TAB 1: MENSAJE ── */}
            {tab === "mensaje" && (
              <>
                <div>
                  <label className="mb-1.5 block text-[10px] font-black tracking-[0.18em] uppercase text-[#C85A32]">
                    Tu nombre o alias
                  </label>
                  <input type="text" value={nombre} onChange={e => setNombre(e.target.value)}
                    placeholder="Ej. María, Jorge o Tu voz" maxLength={32}
                    className="w-full rounded-2xl border border-[#1A1A18]/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#E5A93C] focus:ring-1 focus:ring-[#E5A93C]" />
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-black tracking-[0.18em] uppercase text-[#C85A32]">
                    Municipio de Guerrero
                  </label>
                  <div className="relative">
                    <select value={municipio} onChange={e => setMunicipio(e.target.value)}
                      className="w-full appearance-none rounded-2xl border border-[#1A1A18]/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#E5A93C] pr-10">
                      {municipios.map(m => <option key={m}>{m}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1A1A18]/40" />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-black tracking-[0.18em] uppercase text-[#C85A32]">
                    Frase para tu territorio
                  </label>
                  <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                    {frases.map(fr => (
                      <button key={fr} onClick={() => setFrase(fr)}
                        className={`w-full rounded-xl border p-3 text-left text-xs transition flex items-start gap-2.5 ${
                          frase === fr
                            ? "border-[#E5A93C] bg-[#FDF9F2] font-semibold text-[#C85A32]"
                            : "border-[#1A1A18]/10 hover:bg-[#F4EFE6]/60 text-[#1A1A18]/75"
                        }`}>
                        <span className={`mt-0.5 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border text-[8px] ${
                          frase === fr ? "border-[#C85A32] bg-[#C85A32] text-white" : "border-[#1A1A18]/20"
                        }`}>
                          {frase === fr && <Check size={7} />}
                        </span>
                        {fr}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── TAB 2: ESTILO ── */}
            {tab === "estilo" && (
              <>
                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase text-[#C85A32]">
                    <Palette size={12} />Tema de Color
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {temas.map(t => (
                      <button key={t.id} onClick={() => setTemaId(t.id)}
                        className={`flex items-center gap-2.5 rounded-xl border p-3 transition ${
                          temaId === t.id
                            ? "border-[#E5A93C] bg-[#FFFDF8] shadow-sm font-bold"
                            : "border-[#1A1A18]/10 bg-[#F4EFE6]/40 hover:bg-[#F4EFE6]"
                        }`}>
                        <span className="h-4 w-4 rounded-full border border-white/30 shrink-0"
                          style={{ background: t.dot }} />
                        <span className="text-[10px]">{t.nombre}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase text-[#C85A32]">
                    <Sparkles size={12} />Composición
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "asimetrico", label: "Asimétrico (Revista)" },
                      { id: "retrato",    label: "Retrato Cinematográfico" },
                    ].map(l => (
                      <button key={l.id} onClick={() => setLayout(l.id as any)}
                        className={`rounded-xl border p-3 text-[10px] text-center transition ${
                          layout === l.id
                            ? "border-[#E5A93C] bg-[#E5A93C]/8 font-black text-[#C85A32]"
                            : "border-[#1A1A18]/10 hover:bg-[#F4EFE6]"
                        }`}>
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase text-[#C85A32]">
                    <Sliders size={12} />Formato de Red Social
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "4-5",  label: "Feed Vertical (4:5)"    },
                      { id: "9-16", label: "Historia / Estado (9:16)" },
                    ].map(f => (
                      <button key={f.id} onClick={() => setFormato(f.id as any)}
                        className={`rounded-xl border p-3 text-[10px] text-center transition ${
                          formato === f.id
                            ? "border-[#E5A93C] bg-[#E5A93C]/8 font-black text-[#C85A32]"
                            : "border-[#1A1A18]/10 hover:bg-[#F4EFE6]"
                        }`}>
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── TAB 3: IMAGEN ── */}
            {tab === "imagen" && (
              <>
                <div>
                  <label className="mb-2 block text-[10px] font-black tracking-widest uppercase text-[#C85A32]">
                    Selecciona imagen
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {fotoOptions.map(opt => (
                      <button key={opt.id} onClick={() => setFotoSourceId(opt.id)}
                        className={`rounded-xl border p-2.5 text-[10px] transition ${
                          fotoSourceId === opt.id
                            ? "border-[#E5A93C] bg-[#E5A93C]/8 font-black text-[#C85A32]"
                            : "border-[#1A1A18]/10 hover:bg-[#F4EFE6]"
                        }`}>
                        {opt.nombre}
                      </button>
                    ))}
                  </div>
                </div>

                {fotoSourceId === "user" && (
                  <div>
                    <label className="mb-1.5 block text-[10px] font-black tracking-widest uppercase text-[#C85A32]">
                      Sube tu foto
                    </label>
                    <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-[#1A1A18]/15 bg-white px-4 py-6 text-center transition hover:bg-[#F4EFE6]/40">
                      <ImagePlus className="h-6 w-6 text-[#E5A93C]" />
                      <span className="text-[10px] font-black text-[#C85A32]">Haz clic para subir</span>
                      <span className="text-[9px] text-[#1A1A18]/40">JPG · PNG · WEBP</span>
                      <input type="file" accept="image/*" onChange={handleFotoChange} className="hidden" />
                    </label>
                  </div>
                )}

                {fotoSourceId !== "causa" && (
                  <div>
                    <label className="mb-2 block text-[10px] font-black tracking-widest uppercase text-[#C85A32]">
                      Filtro de mezcla fotográfica
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {filtros.map(f => (
                        <button key={f.id} onClick={() => setFiltroId(f.id)}
                          className={`rounded-xl border p-2.5 text-[10px] transition ${
                            filtroId === f.id
                              ? "border-[#E5A93C] bg-[#E5A93C]/8 font-black text-[#C85A32]"
                              : "border-[#1A1A18]/10 hover:bg-[#F4EFE6]"
                          }`}>
                          {f.nombre}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Acciones */}
          <div className="mt-8 grid gap-3">
            <button onClick={handleDownload} disabled={generando}
              className="flex items-center justify-center gap-2 rounded-full bg-[#C85A32] px-6 py-4 font-black text-sm text-white transition hover:bg-[#E07A52] hover:shadow-glow disabled:opacity-60 focus:outline-none">
              <Download className="h-4 w-4" />
              {generando ? "Procesando lienzo..." : "Descargar imagen HD"}
            </button>
            <button onClick={handleShare} disabled={generando}
              className="flex items-center justify-center gap-2 rounded-full border border-[#C85A32]/25 bg-white px-6 py-4 font-black text-sm text-[#C85A32] transition hover:bg-[#F4EFE6] disabled:opacity-60 focus:outline-none">
              <Share2 className="h-4 w-4" />
              Compartir en redes
            </button>
          </div>
        </section>

        {/* ══ VISTA PREVIA DEL PÓSTER ══ */}
        <section className="flex flex-col items-center">
          <p className="mb-4 text-[9px] font-black tracking-[0.24em] uppercase text-[#1A1A18]/35">
            Vista previa en tiempo real
          </p>

          {/* Contenedor de escala */}
          <div className="relative w-full flex justify-center">
            <div
              style={{
                width:  `${previewW}px`,
                height: `${previewH}px`,
                overflow: "hidden",
                borderRadius: "2.5rem",
                boxShadow: "0 30px 80px rgba(26,26,24,0.28)",
              }}>
              {/* Póster interno a 1080px escalonado */}
              <div
                ref={posterRef}
                className={`${tema.css} relative text-white`}
                style={{
                  width:           "1080px",
                  height:          `${canvasH}px`,
                  transform:       `scale(${scale})`,
                  transformOrigin: "top left",
                  overflow:        "hidden",
                }}>

                {/* Marco perimetral editorial fino */}
                <div className="absolute inset-4 border border-[#E5A93C]/25 rounded-[2.5rem] pointer-events-none z-20" />
                <div className="absolute inset-[18px] border border-white/5 rounded-[2.3rem] pointer-events-none z-20" />

                {/* ── HEADER DEL PÓSTER — logo + marca ── */}
                <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-12 pt-10">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-[#E5A93C]/50 bg-black/20 backdrop-blur p-1.5">
                      <img src="/assets/img/logo.png" alt="Logo" className="h-full w-full object-contain" />
                    </div>
                    <div>
                      <p className="text-[16px] font-black uppercase tracking-[0.28em] text-[#E5A93C] leading-none">
                        Guerrero se organiza.
                      </p>
                      <p className="mt-1.5 text-[11px] uppercase tracking-[0.3em] text-white/50 leading-none">
                        #PorlosCaminosdelSur
                      </p>
                    </div>
                  </div>
                  <span className="rounded-xl border border-[#E5A93C]/25 bg-white/[0.04] px-4 py-1.5 text-[10px] font-black tracking-widest uppercase text-[#E5A93C]">
                    Soberanía · Territorio
                  </span>
                </div>

                {/* ══ LAYOUT ASIMÉTRICO ══ */}
                {layout === "asimetrico" && (
                  <div className="flex h-full flex-col justify-between px-12 pb-12 pt-28">
                    {/* Área central: foto izquierda + datos derecha */}
                    <div className="grid grid-cols-[1.1fr_0.9fr] gap-10 flex-1 items-center my-8">
                      {/* Marco foto */}
                      <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border-2 border-[#E5A93C]/35 bg-black/15 p-2">
                        <div className="absolute inset-1.5 border border-[#E5A93C]/15 rounded-[2.2rem] pointer-events-none" />
                        {fotoSrc ? (
                          <div className="relative h-full overflow-hidden rounded-[2rem]">
                            <img src={fotoSrc} alt="Foto" className={`h-full w-full object-cover ${filtro.css}`} />
                          </div>
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center rounded-[2rem] bg-black/20 text-center p-6">
                            <Camera className="h-14 w-14 text-[#E5A93C]/40 mb-3" />
                            <p className="font-editorial text-2xl text-[#E5A93C]/60 uppercase tracking-widest">Voces del Sur</p>
                            <div className="mt-3 h-px w-10 bg-[#E5A93C]/30" />
                          </div>
                        )}
                      </div>

                      {/* Datos + frase */}
                      <div className="flex flex-col justify-center">
                        <p className="text-[15px] font-black uppercase tracking-[0.2em] text-[#E5A93C] leading-none">
                          Testimonio Territorial
                        </p>
                        <blockquote className="mt-6 font-editorial text-[44px] leading-[1.06] text-white">
                          "{frase}"
                        </blockquote>
                        <div className="my-7 h-[2px] w-16 bg-[#E5A93C]/40 rounded-full" />
                        <p className="text-[20px] font-black text-white leading-none">{displayNombre}</p>
                        <p className="mt-2 text-[14px] uppercase tracking-[0.2em] text-[#E5A93C]/80">
                          {municipio}, Gro.
                        </p>
                      </div>
                    </div>

                    {/* Firma inferior */}
                    <div className="flex items-center border-t border-white/10 pt-6">
                      <span className="h-px flex-1 bg-[#E5A93C]/20" />
                      <p className="mx-5 text-[13px] font-black uppercase tracking-[0.26em] text-[#E5A93C]/80">
                        Defensa de la Soberanía Nacional
                      </p>
                      <span className="h-px flex-1 bg-[#E5A93C]/20" />
                    </div>
                  </div>
                )}

                {/* ══ LAYOUT RETRATO CINEMATOGRÁFICO ══ */}
                {layout === "retrato" && (
                  <>
                    {/* Foto de fondo */}
                    {fotoSrc ? (
                      <div className="absolute inset-0">
                        <img src={fotoSrc} alt="Fondo" className={`h-full w-full object-cover ${filtro.css}`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/30" />
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
                        <p className="font-editorial text-[220px] font-black uppercase text-white select-none">GRO</p>
                      </div>
                    )}

                    {/* Contenido flotante inferior */}
                    <div className="absolute inset-x-0 bottom-0 z-10 px-12 pb-16 text-center">
                      <div className="mx-auto mb-5 h-2 w-20 rounded-full bg-[#E5A93C]/70" />
                      <blockquote className="font-editorial text-[56px] leading-[1.04] text-white text-balance drop-shadow-lg">
                        "{frase}"
                      </blockquote>
                      <div className="mt-8 flex flex-col items-center">
                        <p className="text-[22px] font-black tracking-wide text-white drop-shadow">{displayNombre}</p>
                        <p className="mt-2 text-[15px] font-black uppercase tracking-[0.22em] text-[#E5A93C] drop-shadow">
                          {municipio}, Guerrero
                        </p>
                      </div>
                      <div className="mt-8 border-t border-white/15 pt-6">
                        <p className="text-[12px] font-black uppercase tracking-[0.28em] text-[#E5A93C]/80">
                          Defensa de la Soberanía Nacional
                        </p>
                        <p className="mt-1.5 text-[9px] uppercase tracking-[0.2em] text-white/40">
                          Morena · Comité Territorial · Guerrero
                        </p>
                      </div>
                    </div>
                  </>
                )}

              </div>{/* /posterRef */}
            </div>{/* /scale wrapper */}
          </div>{/* /flex justify-center */}

          {/* Metadatos de producción */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-[9px] font-black tracking-widest uppercase text-[#1A1A18]/30">
            <span>Tema: {tema.nombre}</span>
            <span>·</span>
            <span>Layout: {layout === "asimetrico" ? "Revista" : "Retrato"}</span>
            <span>·</span>
            <span>Formato: {formato}</span>
            <span>·</span>
            <span>Filtro: {filtro.nombre}</span>
          </div>
        </section>

      </div>
    </main>
  );
}