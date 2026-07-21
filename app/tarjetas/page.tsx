"use client";

import {
  MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import html2canvas from "html2canvas";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Download,
  Loader2,
  MapPin,
  Palette,
  Share2,
  Sparkles,
} from "lucide-react";

const EXPORT_SIZE = 1080;
const PREVIEW_SCALE = 0.5555556;

const municipalities = [
  "Acapulco de Juárez",
  "Chilpancingo de los Bravo",
  "Iguala de la Independencia",
  "Zihuatanejo de Azueta",
  "Chilapa de Álvarez",
  "Taxco de Alarcón",
  "Tlapa de Comonfort",
  "Coyuca de Benítez",
  "Ometepec",
  "Tecpan de Galeana",
  "Atoyac de Álvarez",
  "Ayutla de los Libres",
  "Eduardo Neri",
  "Teloloapan",
  "Tixtla de Guerrero",
  "San Luis Acatlán",
  "Tecoanapa",
  "Petatlán",
  "Huitzuco de los Figueroa",
  "San Marcos",
];

const phrases = [
  "Mi comunidad tiene voz.",
  "Organizarnos es defender lo nuestro.",
  "Guerrero se construye desde el territorio.",
  "La soberanía se defiende entre todas y todos.",
  "Escuchar también transforma.",
  "Desde mi comunidad, abrimos camino.",
  "El futuro se conversa y se organiza.",
  "Los gobiernos son velas; el pueblo, el viento; el Estado, la nave, y el tiempo, el mar.",
];

const themes = [
  {
    id: "guinda",
    name: "Guinda institucional",
    base: "#3B0E1E",
    primary: "#6B1D3A",
    dark: "#12070B",
    mountain: "#153126",
    mountainLight: "#4A5B35",
    gold: "#D4A843",
    ivory: "#FFF9E8",
    border: "rgba(212,168,67,0.58)",
  },
  {
    id: "sierra",
    name: "Verde sierra",
    base: "#10261D",
    primary: "#244837",
    dark: "#06140F",
    mountain: "#183428",
    mountainLight: "#52623A",
    gold: "#D4A843",
    ivory: "#FFF9E8",
    border: "rgba(212,168,67,0.52)",
  },
  {
    id: "azul",
    name: "Azul soberanía",
    base: "#102B45",
    primary: "#17476A",
    dark: "#07131F",
    mountain: "#18352B",
    mountainLight: "#405B44",
    gold: "#D4A843",
    ivory: "#FFF9E8",
    border: "rgba(212,168,67,0.52)",
  },
];

const esthelaPhotos = [
  {
    id: "esthela1",
    name: "Esthela · Recorrido",
    path: "/assets/img/foto28.jpg",
  },
  {
    id: "esthela2",
    name: "Esthela · Encuentro",
    path: "/assets/img/pueblosabio.png",
  },
  {
    id: "esthela3",
    name: "Esthela · Territorio",
    path: "/assets/img/foto2.jfif",
  },
];

function GuerreroMap() {
  return (
    <svg
      viewBox="0 0 340 170"
      fill="none"
      aria-hidden="true"
      className="h-full w-full"
    >
      <path
        d="M26 93C41 73 58 67 79 62C96 58 109 48 123 49C139 50 147 42 163 45C180 48 191 57 207 59C224 61 236 55 253 58C270 61 283 72 294 79C305 87 314 99 311 111C308 123 296 128 286 132C276 136 270 146 257 146C243 146 234 139 221 141C207 143 195 150 181 147C167 144 158 136 146 136C132 136 123 144 110 143C94 141 83 131 69 129C54 126 38 122 29 112C24 107 22 100 26 93Z"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M92 85C108 87 118 96 132 99C149 102 160 90 177 91C193 92 202 102 220 105"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        opacity="0.72"
      />
      <path
        d="M118 120C135 111 149 118 162 123C177 129 193 121 210 125C223 128 232 135 245 136"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        opacity="0.62"
      />
    </svg>
  );
}

function MetallicSeal({
  tilt,
}: {
  tilt: { x: number; y: number };
}) {
  return (
    <div
      className="absolute right-[70px] top-[165px] z-40 grid h-[132px] w-[132px] place-items-center rounded-full border-[3px] text-center text-[#FFF3C9]"
      style={{
        borderColor: "#D4A843",
        background:
          "radial-gradient(circle at 30% 21%, #FFF0A7 0%, #E2B64E 20%, #9A6818 49%, #D4A843 74%, #513005 100%)",
        boxShadow:
          "inset 0 0 0 7px rgba(67,37,5,0.36), inset 0 0 20px rgba(255,244,194,0.30), 0 16px 30px rgba(0,0,0,0.46), 0 4px 0 rgba(255,231,152,0.24)",
        transform: `translate(${tilt.x * 8}px, ${tilt.y * 6}px) rotate(${tilt.x * 1.2}deg)`,
      }}
    >
      <div className="relative grid h-[99px] w-[99px] place-items-center rounded-full border border-[#FFE9A4]/60 px-3">
        <div className="absolute inset-[7px] rounded-full border border-black/20" />

        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.11em]">
            Organización
          </p>

          <p className="mt-1 font-serif text-[18px] leading-none text-[#FFF7D2]">
            territorial
          </p>

          <p className="mt-2 text-[10px] font-black uppercase tracking-[0.13em]">
            Guerrero
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TarjetasPage() {
  const posterRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [municipio, setMunicipio] = useState("Chilpancingo de los Bravo");
  const [phrase, setPhrase] = useState(phrases[1]);
  const [themeId, setThemeId] = useState("guinda");
  const [esthelaId, setEsthelaId] = useState("esthela1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const theme = useMemo(
    () => themes.find((item) => item.id === themeId) ?? themes[0],
    [themeId],
  );

  const esthela = useMemo(
    () =>
      esthelaPhotos.find((item) => item.id === esthelaId) ??
      esthelaPhotos[0],
    [esthelaId],
  );

  const displayName = name.trim() || "Voz comunitaria";

  useEffect(() => {
    const imageList = esthelaPhotos.map((photo) => {
      const image = new window.Image();
      image.src = photo.path;
      return image;
    });

    return () => {
      imageList.forEach((image) => {
        image.src = "";
      });
    };
  }, []);

  const handlePosterMove = (event: MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();

    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

    setTilt({ x, y });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  const waitForImages = async (element: HTMLElement) => {
    const images = Array.from(element.querySelectorAll("img"));

    await Promise.all(
      images.map(
        (image) =>
          new Promise<void>((resolve) => {
            if (image.complete) {
              resolve();
              return;
            }

            image.addEventListener("load", () => resolve(), { once: true });
            image.addEventListener("error", () => resolve(), { once: true });
          }),
      ),
    );
  };

  const makeCanvas = async () => {
    if (!posterRef.current) return null;

    const clone = posterRef.current.cloneNode(true) as HTMLDivElement;

    clone.style.position = "fixed";
    clone.style.left = "-12000px";
    clone.style.top = "0";
    clone.style.width = `${EXPORT_SIZE}px`;
    clone.style.height = `${EXPORT_SIZE}px`;
    clone.style.minWidth = `${EXPORT_SIZE}px`;
    clone.style.minHeight = `${EXPORT_SIZE}px`;
    clone.style.maxWidth = "none";
    clone.style.maxHeight = "none";
    clone.style.margin = "0";
    clone.style.padding = "0";
    clone.style.transform = "none";
    clone.style.transformOrigin = "top left";
    clone.style.borderRadius = "0";
    clone.style.overflow = "hidden";
    clone.style.pointerEvents = "none";
    clone.style.zIndex = "-1";

    document.body.appendChild(clone);

    try {
      await waitForImages(clone);

      return await html2canvas(clone, {
        width: EXPORT_SIZE,
        height: EXPORT_SIZE,
        scale: 1,
        backgroundColor: theme.base,
        useCORS: true,
        allowTaint: true,
        logging: false,
        imageTimeout: 15000,
        windowWidth: EXPORT_SIZE,
        windowHeight: EXPORT_SIZE,
        scrollX: 0,
        scrollY: 0,
      });
    } finally {
      document.body.removeChild(clone);
    }
  };

  const createBlob = async () => {
    const canvas = await makeCanvas();

    if (!canvas) {
      throw new Error("No se encontró el lienzo del póster.");
    }

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((file) => resolve(file), "image/png", 1),
    );

    if (!blob) {
      throw new Error("No fue posible convertir el lienzo en PNG.");
    }

    return blob;
  };

  const createFilename = () => {
    const cleanName = displayName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();

    return `poster-caminos-del-sur-${cleanName || "guerrero"}.png`;
  };

  const downloadPoster = async () => {
    setIsGenerating(true);

    try {
      const blob = await createBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = createFilename();

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.setTimeout(() => URL.revokeObjectURL(url), 400);
    } catch (error) {
      console.error("Error al generar el póster:", error);
      alert(
        "No fue posible generar el póster. Verifica que los archivos de imagen existan en /public/assets/img e inténtalo nuevamente.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const sharePoster = async () => {
    setIsGenerating(true);

    try {
      const blob = await createBlob();

      const file = new File([blob], createFilename(), {
        type: "image/png",
      });

      const shareText = `${displayName}, desde ${municipio}: “${phrase}” #PorlosCaminosdelSur`;

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: "Por los Caminos del Sur",
          text: shareText,
          files: [file],
        });

        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = createFilename();

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.setTimeout(() => URL.revokeObjectURL(url), 400);
    } catch (error) {
      console.error("Error al compartir el póster:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F4EFE6] text-[#221B19]">
      <header className="border-b border-[#D8CCBA] bg-[#FFFDF8]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#6B1D3A] transition hover:text-[#3E1021]"
          >
            <ArrowLeft size={16} />
            Volver al sitio
          </Link>

          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[#D4A843]/45 bg-[#6B1D3A]">
              <Image
                src="/assets/img/logo.png"
                alt="Por los Caminos del Sur"
                fill
                sizes="40px"
                className="object-contain p-1.5"
              />
            </div>

            <p className="hidden text-xs font-bold uppercase tracking-[0.19em] text-[#6B1D3A] sm:block">
              Por los Caminos del Sur
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-8 lg:grid-cols-[410px_minmax(0,1fr)] lg:px-8 lg:py-12">
        <aside className="h-fit rounded-[1.75rem] border border-[#D8CCBA] bg-[#FFFDF8] p-6 shadow-[0_20px_55px_rgba(50,31,25,0.10)]">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#6B1D3A]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.13em] text-[#6B1D3A]">
            <Sparkles size={14} />
            Editor editorial
          </div>

          <h1 className="mt-4 font-serif text-4xl leading-[0.98] text-[#284437]">
            Crea tu póster de territorio.
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-[#221B19]/70">
            El nombre y el municipio acompañan una voz comunitaria. Esthela es
            la única presencia visual, para mantener claridad y jerarquía.
          </p>

          <div className="mt-7 space-y-6">
            <div>
              <label
                htmlFor="poster-name"
                className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-[#6B1D3A]"
              >
                Nombre o alias
              </label>

              <input
                id="poster-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={32}
                placeholder="Ej. María del Carmen"
                className="min-h-12 w-full rounded-2xl border border-[#D8CCBA] bg-white px-4 text-sm outline-none transition focus:border-[#D4A843] focus:ring-2 focus:ring-[#D4A843]/25"
              />
            </div>

            <div>
              <label
                htmlFor="poster-municipality"
                className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-[#6B1D3A]"
              >
                Municipio
              </label>

              <select
                id="poster-municipality"
                value={municipio}
                onChange={(event) => setMunicipio(event.target.value)}
                className="min-h-12 w-full rounded-2xl border border-[#D8CCBA] bg-white px-4 text-sm outline-none transition focus:border-[#D4A843] focus:ring-2 focus:ring-[#D4A843]/25"
              >
                {municipalities.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#6B1D3A]">
                Frase del póster
              </p>

              <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                {phrases.map((item) => {
                  const selected = phrase === item;

                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setPhrase(item)}
                      className={`flex w-full items-start gap-2.5 rounded-xl border p-3 text-left text-xs leading-relaxed transition ${
                        selected
                          ? "border-[#D4A843] bg-[#FFF8E8] font-semibold text-[#6B1D3A]"
                          : "border-[#D8CCBA]/75 bg-white text-[#221B19]/75 hover:bg-[#FAF5ED]"
                      }`}
                    >
                      <span
                        className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
                          selected
                            ? "border-[#6B1D3A] bg-[#6B1D3A] text-white"
                            : "border-[#D8CCBA]"
                        }`}
                      >
                        {selected && <Check size={10} />}
                      </span>

                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#6B1D3A]">
                Retrato de Esthela
              </p>

              <div className="grid gap-2">
                {esthelaPhotos.map((item) => {
                  const selected = esthelaId === item.id;

                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setEsthelaId(item.id)}
                      className={`flex items-center justify-between rounded-xl border px-3 py-3 text-left text-xs transition ${
                        selected
                          ? "border-[#D4A843] bg-[#FFF8E8] font-bold text-[#6B1D3A]"
                          : "border-[#D8CCBA]/75 bg-white hover:bg-[#FAF5ED]"
                      }`}
                    >
                      {item.name}
                      {selected && <Check size={15} />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#6B1D3A]">
                Paleta editorial
              </p>

              <div className="grid gap-2">
                {themes.map((item) => {
                  const selected = themeId === item.id;

                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setThemeId(item.id)}
                      className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-left text-xs transition ${
                        selected
                          ? "border-[#D4A843] bg-[#FFF8E8] font-bold text-[#6B1D3A]"
                          : "border-[#D8CCBA]/75 bg-white hover:bg-[#FAF5ED]"
                      }`}
                    >
                      <span
                        className="h-5 w-5 rounded-full border border-white/50 shadow-sm"
                        style={{
                          background: `linear-gradient(135deg, ${item.primary} 0 56%, ${item.gold} 56% 100%)`,
                        }}
                      />
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-3">
            <button
              type="button"
              onClick={downloadPoster}
              disabled={isGenerating}
              className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#D4A843] px-5 py-4 text-center text-xs font-black uppercase leading-snug tracking-[0.07em] text-[#2B1603] shadow-[0_12px_26px_rgba(212,168,67,0.28)] transition hover:bg-[#E5BD62] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generando póster
                </>
              ) : (
                <>
                  <Download size={18} />
                  Obtener mi póster defendiendo la soberanía de Guerrero, México
                </>
              )}
            </button>

            <button
              type="button"
              onClick={sharePoster}
              disabled={isGenerating}
              className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#6B1D3A]/25 bg-white px-5 py-3 text-sm font-bold text-[#6B1D3A] transition hover:bg-[#FAF5ED] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Share2 size={17} />
              Compartir mi póster
            </button>
          </div>
        </aside>

        <section className="flex min-w-0 flex-col items-center justify-center">
          <div className="mb-4 flex w-full max-w-[600px] items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#221B19]/45">
              Vista previa · 1080 × 1080
            </p>

            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#221B19]/55">
              <Palette size={13} />
              Mueve el cursor para profundidad
            </span>
          </div>

          <div
            onMouseMove={handlePosterMove}
            onMouseLeave={resetTilt}
            className="relative w-full max-w-[600px] [perspective:1400px]"
          >
            <div
              className="relative aspect-square overflow-hidden rounded-[2rem] shadow-[0_32px_90px_rgba(39,20,12,0.35)] transition-transform duration-300 ease-out"
              style={{
                transform: `rotateX(${tilt.y * -2.6}deg) rotateY(${tilt.x * 2.6}deg)`,
              }}
            >
              {/* El padre se escala; el lienzo exportable nunca recibe scale(). */}
              <div
                className="absolute left-0 top-0 h-[1080px] w-[1080px] origin-top-left"
                style={{
                  transform: `scale(${PREVIEW_SCALE})`,
                  transformOrigin: "top left",
                }}
              >
                <div
                  ref={posterRef}
                  className="relative h-[1080px] w-[1080px] overflow-hidden"
                  style={{
                    background: `
                      radial-gradient(circle at 84% 10%, rgba(212,168,67,0.24), transparent 19%),
                      radial-gradient(circle at 14% 31%, rgba(255,231,170,0.10), transparent 23%),
                      linear-gradient(145deg, ${theme.primary} 0%, ${theme.base} 48%, ${theme.dark} 100%)
                    `,
                  }}
                >
                  {/* PLANO 0: cielo, luz ambiental y niebla lejana */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-8%,rgba(255,235,184,0.19),transparent_42%)]" />

                  <div
                    className="absolute left-[-190px] top-[205px] h-[190px] w-[1510px] rotate-[-25deg] opacity-65 blur-[7px]"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(255,245,207,0.03) 20%, rgba(255,223,145,0.48) 50%, rgba(255,245,207,0.08) 77%, transparent 100%)",
                    }}
                  />

                  {/* PLANO 1: Sierra lejana */}
                  <div
                    className="absolute inset-x-0 bottom-[285px] h-[455px] opacity-55"
                    style={{
                      background: `linear-gradient(162deg, rgba(255,224,151,0.13), ${theme.mountainLight} 54%, ${theme.mountain} 100%)`,
                      clipPath:
                        "polygon(0 74%, 10% 59%, 22% 68%, 35% 34%, 48% 62%, 62% 41%, 75% 64%, 89% 35%, 100% 53%, 100% 100%, 0 100%)",
                    }}
                  />

                  {/* PLANO 2: niebla dorada que separa los relieves */}
                  <div
                    className="absolute -left-[150px] top-[420px] h-[175px] w-[1410px] rotate-[-7deg] opacity-70 blur-[19px]"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(255,236,183,0.08) 24%, rgba(212,168,67,0.30) 52%, rgba(255,236,183,0.06) 76%, transparent 100%)",
                    }}
                  />

                  {/* PLANO 3: sierra media */}
                  <div
                    className="absolute inset-x-[-70px] bottom-[90px] h-[535px] opacity-86"
                    style={{
                      background: `linear-gradient(142deg, ${theme.mountainLight}, ${theme.mountain} 56%, ${theme.dark} 100%)`,
                      clipPath:
                        "polygon(0 68%, 12% 48%, 25% 65%, 39% 38%, 51% 59%, 64% 31%, 78% 57%, 90% 32%, 100% 47%, 100% 100%, 0 100%)",
                    }}
                  />

                  {/* PLANO 4: montaña frontal de contraste */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-[370px] opacity-97"
                    style={{
                      background: `linear-gradient(132deg, ${theme.mountain}, ${theme.dark} 74%)`,
                      clipPath:
                        "polygon(0 54%, 12% 43%, 25% 59%, 39% 34%, 53% 55%, 67% 32%, 80% 53%, 92% 28%, 100% 43%, 100% 100%, 0 100%)",
                    }}
                  />

                  {/* Textura y viñeta: profundidad cinematográfica */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.09] mix-blend-screen"
                    style={{
                      backgroundImage:
                        "radial-gradient(rgba(255,255,255,0.88) 0.65px, transparent 0.85px)",
                      backgroundSize: "6px 6px",
                    }}
                  />

                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_52%_35%,transparent_34%,rgba(0,0,0,0.47)_100%)]" />

                  {/* Marco tridimensional */}
                  <div
                    className="pointer-events-none absolute inset-[33px] rounded-[49px] border shadow-[inset_0_0_0_2px_rgba(0,0,0,0.22)]"
                    style={{ borderColor: theme.border }}
                  />

                  <div className="pointer-events-none absolute inset-[47px] rounded-[38px] border border-white/10" />
                  <div className="pointer-events-none absolute inset-[59px] rounded-[30px] border border-black/25" />

                  {/* Encabezado */}
                  <div className="absolute left-[68px] right-[72px] top-[58px] z-30 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="relative h-[112px] w-[112px] overflow-hidden rounded-full border border-[#D4A843]/85 bg-[#210A12]/80 shadow-[0_12px_28px_rgba(0,0,0,0.42),inset_0_0_0_7px_rgba(0,0,0,0.18)]">
                        <div className="absolute inset-[7px] rounded-full border border-[#F8E8B9]/20" />

                        <Image
                          src="/assets/img/logo.png"
                          alt="Por los Caminos del Sur"
                          fill
                          sizes="112px"
                          className="object-contain p-1.5"
                        />
                      </div>

                      <div>
                        <p className="text-[21px] font-black uppercase tracking-[0.20em] text-[#F8E8B9]">
                          Por los Caminos
                        </p>
                        <p className="mt-1 text-[16px] font-semibold uppercase tracking-[0.32em] text-white/60">
                          del Sur
                        </p>
                      </div>
                    </div>

                    <div
                      className="rounded-full border px-6 py-3 text-[14px] font-black uppercase tracking-[0.17em] text-[#F8E8B9] shadow-[0_8px_17px_rgba(0,0,0,0.20)]"
                      style={{
                        borderColor: "rgba(212,168,67,0.68)",
                        background: "rgba(0,0,0,0.20)",
                      }}
                    >
                      Guerrero
                    </div>
                  </div>

                  {/* Mapa en bajo relieve */}
                  {/* Mapa topográfico editorial: aprovecha el espacio alto derecho */}
<div
  className="absolute right-[67px] top-[286px] z-10 h-[260px] w-[350px] transition-transform duration-300"
  style={{
    transform: `translate(${tilt.x * 10}px, ${tilt.y * 8}px) rotate(${tilt.x * 0.75}deg)`,
  }}
>
  {/* Base en relieve */}
  <div className="absolute inset-0 text-[#0A1711]/80 drop-shadow-[0_15px_18px_rgba(0,0,0,0.38)]">
    <GuerreroMap />
  </div>

  {/* Contorno dorado fino */}
  <div className="absolute inset-0 text-[#D4A843]/65">
    <GuerreroMap />
  </div>

  {/* Velo para profundidad */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(212,168,67,0.14),transparent_59%)]" />

  {/* Leyenda editorial */}
  <div className="absolute bottom-[-12px] left-[24px] border-l border-[#D4A843]/55 pl-3">
    <p className="text-[11px] font-black uppercase tracking-[0.20em] text-[#F8E8B9]/75">
      Territorio guerrerense
    </p>

    <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/42">
      Organización desde la comunidad
    </p>
  </div>
</div>

                  {/* Sombra de contacto del retrato */}
                  <div
                    className="absolute left-[96px] top-[745px] z-10 h-[86px] w-[425px] rounded-full bg-black/75 blur-[31px]"
                    style={{
                      transform: `translate(${tilt.x * -3}px, ${tilt.y * 2}px)`,
                    }}
                  />

                  {/* Primer plano: retrato único */}
                  <div
                    className="absolute left-[70px] top-[230px] z-20 h-[590px] w-[470px]"
                    style={{
                      transform: `translate(${tilt.x * -6}px, ${tilt.y * -4}px)`,
                    }}
                  >
                    <div className="absolute inset-0 overflow-hidden rounded-[48px] border border-[#D4A843]/80 bg-[#17070C] shadow-[22px_30px_72px_rgba(0,0,0,0.54)]">
                      <img
                        src={esthela.path}
                        alt="Esthela Damián"
                        crossOrigin="anonymous"
                        className="h-full w-full object-cover object-center"
                      />

                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_17%,rgba(255,229,164,0.37),transparent_28%),linear-gradient(180deg,rgba(255,235,189,0.07),transparent_37%,rgba(22,4,10,0.92)_100%)]" />

                      <div className="pointer-events-none absolute inset-[11px] rounded-[38px] border border-white/20" />

                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#18060B]/97 via-[#18060B]/63 to-transparent px-9 pb-9 pt-28">
                        <p className="text-[15px] font-black uppercase tracking-[0.23em] text-[#F8E8B9]">
                          Territorio y comunidad
                        </p>

                        <p
                          className="mt-3 font-serif text-[48px] leading-none text-white"
                          style={{
                            textShadow: "0 4px 14px rgba(0,0,0,0.64)",
                          }}
                        >
                          Esthela Damián
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Segundo foco: manifiesto comunitario */}
                  <div
  className="absolute bottom-[178px] left-[582px] right-[78px] z-30"
  style={{
    transform: `translate(${tilt.x * 4}px, ${tilt.y * 2}px)`,
  }}
>
  <p className="text-[15px] font-black uppercase tracking-[0.21em] text-[#F8E8B9]">
    Voz del territorio
  </p>

  <div className="mt-5 h-[3px] w-[126px] rounded-full bg-[#D4A843]" />

  <h2
    className="mt-7 font-serif text-[50px] leading-[0.95] text-[#FFF9E8]"
    style={{
      textShadow:
        "0 4px 0 rgba(35,7,15,0.52), 0 13px 28px rgba(0,0,0,0.46)",
    }}
  >
    {phrase}
  </h2>

  <div className="mt-8 border-l-2 border-[#D4A843] pl-5">
    <p
      className="text-[19px] font-bold uppercase tracking-[0.12em] text-[#F8E8B9]"
      style={{
        textShadow: "0 2px 10px rgba(0,0,0,0.72)",
      }}
    >
      {displayName}
    </p>

    <p className="mt-4 text-[15px] font-black uppercase tracking-[0.20em] text-[#F8E8B9]">
      Voz comunitaria
    </p>

    <div className="mt-4 flex items-center gap-3">
      <span className="h-[1px] w-10 bg-[#D4A843]/75" />
      <p
        className="text-[14px] font-bold uppercase tracking-[0.14em] text-[#F3DEB0]"
        style={{
          textShadow: "0 2px 8px rgba(0,0,0,0.82)",
        }}
      >
        {municipio}, Guerrero
      </p>
    </div>
  </div>
</div>

                   

                  <MetallicSeal tilt={tilt} />

                  {/* Cierre: firma */}
                  <div className="absolute bottom-[57px] left-[76px] z-30">
                    <p
                      className="font-serif italic text-[34px] text-[#FFF1C2]"
                      style={{
                        textShadow: "0 3px 12px rgba(0,0,0,0.44)",
                      }}
                    >
                      Por los caminos del sur
                    </p>

                    <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.25em] text-white/58">
                      #PorlosCaminosdelSur
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 max-w-[600px] text-center text-xs leading-relaxed text-[#221B19]/55">
            La descarga genera un PNG nativo de 1080 × 1080. El escalamiento
            corresponde sólo a la vista previa y no afecta el archivo final.
          </p>
        </section>
      </section>
    </main>
  );
}