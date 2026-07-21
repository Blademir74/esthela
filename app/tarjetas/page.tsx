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
    bg: "#38101D",
    primary: "#6B1D3A",
    secondary: "#14070B",
    gold: "#D4A843",
    ivory: "#FFF9E8",
    line: "rgba(212,168,67,0.58)",
  },
  {
    id: "sierra",
    name: "Verde sierra",
    bg: "#10261D",
    primary: "#244837",
    secondary: "#06140F",
    gold: "#D4A843",
    ivory: "#FFF9E8",
    line: "rgba(212,168,67,0.52)",
  },
  {
    id: "azul",
    name: "Azul soberanía",
    bg: "#102B45",
    primary: "#17476A",
    secondary: "#07131F",
    gold: "#D4A843",
    ivory: "#FFF9E8",
    line: "rgba(212,168,67,0.52)",
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
    path: "/assets/img/foto29.jpg",
  },
  {
    id: "esthela3",
    name: "Esthela · Territorio",
    path: "/assets/img/foto30.jpg",
  },
];

function GuerreroMap() {
  return (
    <svg
      viewBox="0 0 260 190"
      fill="none"
      aria-hidden="true"
      className="h-full w-full"
    >
      <path
        d="M23 76C42 58 63 51 89 45C108 40 116 23 135 31C151 37 150 52 166 55C181 58 187 48 204 58C215 66 207 82 218 91C225 98 222 112 206 117C195 120 198 139 181 140C166 141 157 130 147 141C135 155 117 146 107 136C93 122 87 142 69 137C55 133 62 115 46 109C31 104 19 93 23 76Z"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M68 65C86 72 90 88 108 91C125 93 131 75 151 79C169 83 171 101 190 105"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M79 113C95 102 111 115 125 120C144 127 159 111 179 119"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
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
    const preloadedImages = esthelaPhotos.map((photo) => {
      const image = new window.Image();
      image.src = photo.path;
      return image;
    });

    return () => {
      preloadedImages.forEach((image) => {
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

    const source = posterRef.current;
    const clone = source.cloneNode(true) as HTMLDivElement;

    clone.style.position = "fixed";
    clone.style.left = "-12000px";
    clone.style.top = "0";
    clone.style.width = "1080px";
    clone.style.height = "1080px";
    clone.style.minWidth = "1080px";
    clone.style.minHeight = "1080px";
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
        width: 1080,
        height: 1080,
        scale: 1,
        backgroundColor: theme.bg,
        useCORS: true,
        allowTaint: true,
        logging: false,
        imageTimeout: 15000,
        windowWidth: 1080,
        windowHeight: 1080,
        scrollX: 0,
        scrollY: 0,
      });
    } finally {
      document.body.removeChild(clone);
    }
  };

  const downloadPoster = async () => {
    setIsGenerating(true);

    try {
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

      const safeName = displayName
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `poster-caminos-del-sur-${safeName || "guerrero"}.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.setTimeout(() => URL.revokeObjectURL(url), 300);
    } catch (error) {
      console.error("Error al generar el póster:", error);
      alert(
        "No fue posible generar el póster. Verifica que las imágenes existan en /public/assets/img e inténtalo nuevamente.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const sharePoster = async () => {
    setIsGenerating(true);

    try {
      const canvas = await makeCanvas();

      if (!canvas) {
        throw new Error("No se encontró el lienzo del póster.");
      }

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((file) => resolve(file), "image/png", 0.96),
      );

      if (!blob) {
        throw new Error("No fue posible crear el archivo.");
      }

      const file = new File([blob], "poster-caminos-del-sur.png", {
        type: "image/png",
      });

      const text = `${displayName}, desde ${municipio}: “${phrase}” #PorlosCaminosdelSur`;

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: "Por los Caminos del Sur",
          text,
          files: [file],
        });

        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "poster-caminos-del-sur.png";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.setTimeout(() => URL.revokeObjectURL(url), 300);
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
            Una pieza editorial de voz comunitaria. El nombre y municipio
            acompañan el mensaje; Esthela permanece como la única presencia
            visual del póster.
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
              {/* Sólo este envoltorio se escala para la vista previa */}
              <div
                className="absolute left-0 top-0 h-[1080px] w-[1080px] origin-top-left"
                style={{
                  transform: "scale(0.5555556)",
                  transformOrigin: "top left",
                }}
              >
                {/* posterRef siempre mide 1080 x 1080 sin transformaciones */}
                <div
                  ref={posterRef}
                  className="relative h-[1080px] w-[1080px] overflow-hidden"
                  style={{
                    background: `
                      radial-gradient(circle at 84% 10%, rgba(212,168,67,0.25), transparent 20%),
                      radial-gradient(circle at 14% 34%, rgba(255,231,170,0.09), transparent 22%),
                      linear-gradient(145deg, ${theme.primary} 0%, ${theme.bg} 49%, ${theme.secondary} 100%)
                    `,
                  }}
                >
                  {/* Capa de atmósfera y brillo superior */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-8%,rgba(255,235,184,0.18),transparent_43%)]" />

                  {/* Sierra lejana */}
                  <div
                    className="absolute inset-x-0 bottom-[240px] h-[480px] opacity-55"
                    style={{
                      background:
                        "linear-gradient(162deg, rgba(255,224,151,0.12), rgba(28,64,47,0.82) 55%, rgba(5,19,13,0.92))",
                      clipPath:
                        "polygon(0 74%, 10% 59%, 22% 68%, 35% 34%, 48% 62%, 62% 41%, 75% 64%, 89% 35%, 100% 53%, 100% 100%, 0 100%)",
                    }}
                  />

                  {/* Niebla horizontal dorada */}
                  <div
                    className="absolute -left-[160px] top-[350px] h-[220px] w-[1420px] rotate-[-10deg] opacity-75 blur-[15px]"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(255,230,168,0.06) 20%, rgba(212,168,67,0.38) 50%, rgba(255,230,168,0.08) 78%, transparent 100%)",
                    }}
                  />

                  {/* Montaña intermedia */}
                  <div
                    className="absolute inset-x-[-60px] bottom-[90px] h-[540px] opacity-80"
                    style={{
                      background:
                        "linear-gradient(142deg, rgba(62,91,59,0.80), rgba(8,27,18,0.95) 60%, rgba(1,7,4,0.98))",
                      clipPath:
                        "polygon(0 67%, 12% 47%, 25% 64%, 39% 37%, 51% 58%, 64% 30%, 78% 56%, 90% 31%, 100% 46%, 100% 100%, 0 100%)",
                    }}
                  />

                  {/* Montaña frontal oscura */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-[370px] opacity-95"
                    style={{
                      background:
                        "linear-gradient(132deg, rgba(24,52,39,0.98), rgba(3,13,9,1) 74%)",
                      clipPath:
                        "polygon(0 54%, 12% 43%, 25% 59%, 39% 34%, 53% 55%, 67% 32%, 80% 53%, 92% 28%, 100% 43%, 100% 100%, 0 100%)",
                    }}
                  />

                  {/* Flare diagonal: esperanza */}
                  <div
                    className="absolute -left-[200px] top-[253px] h-[135px] w-[1540px] rotate-[-25deg] opacity-80"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,245,207,0.06), rgba(255,223,145,0.72), rgba(255,245,207,0.12), transparent)",
                      filter: "blur(5px)",
                    }}
                  />

                  {/* Grano cinematográfico */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-screen"
                    style={{
                      backgroundImage:
                        "radial-gradient(rgba(255,255,255,0.85) 0.65px, transparent 0.85px)",
                      backgroundSize: "6px 6px",
                    }}
                  />

                  {/* Viñeta */}
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_53%_37%,transparent_34%,rgba(0,0,0,0.45)_100%)]" />

                  {/* Marco exterior de alto relieve */}
                  <div
                    className="pointer-events-none absolute inset-[34px] rounded-[48px] border"
                    style={{ borderColor: theme.line }}
                  />
                  <div className="pointer-events-none absolute inset-[48px] rounded-[37px] border border-white/10" />
                  <div className="pointer-events-none absolute inset-[60px] rounded-[29px] border border-black/20" />

                  {/* Identidad superior */}
                  <div className="absolute left-[72px] right-[72px] top-[66px] z-30 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="relative h-[85px] w-[85px] overflow-hidden rounded-full border border-[#D4A843]/75 bg-black/20 shadow-[0_10px_23px_rgba(0,0,0,0.30)]">
                        <Image
                          src="/assets/img/logo.png"
                          alt="Por los Caminos del Sur"
                          fill
                          sizes="85px"
                          className="object-contain p-2"
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
                      className="rounded-full border px-6 py-3 text-[14px] font-black uppercase tracking-[0.17em] text-[#F8E8B9] shadow-[0_8px_16px_rgba(0,0,0,0.18)]"
                      style={{
                        borderColor: "rgba(212,168,67,0.66)",
                        background: "rgba(0,0,0,0.18)",
                      }}
                    >
                      Guerrero
                    </div>
                  </div>

                  {/* Mapa de Guerrero, bajo relieve con parallax */}
                  <div
                    className="absolute right-[75px] top-[155px] z-10 h-[238px] w-[306px] text-[#D4A843]/45 transition-transform duration-300"
                    style={{
                      transform: `translate(${tilt.x * 13}px, ${tilt.y * 10}px) rotate(${tilt.x * 1.1}deg)`,
                    }}
                  >
                    <GuerreroMap />
                  </div>

                  {/* Sombra de retrato */}
                  <div
                    className="absolute left-[98px] top-[706px] z-10 h-[105px] w-[430px] rounded-full bg-black/70 blur-[34px]"
                    style={{
                      transform: `translate(${tilt.x * -3}px, ${tilt.y * 2}px)`,
                    }}
                  />

                  {/* Único retrato: Esthela */}
                  <div
                    className="absolute left-[70px] top-[230px] z-20 h-[590px] w-[470px]"
                    style={{
                      transform: `translate(${tilt.x * -6}px, ${tilt.y * -4}px)`,
                    }}
                  >
                    <div className="absolute inset-0 overflow-hidden rounded-[48px] border border-[#D4A843]/75 bg-[#17070C] shadow-[21px_29px_70px_rgba(0,0,0,0.50)]">
                      <img
                        src={esthela.path}
                        alt="Esthela Damián"
                        crossOrigin="anonymous"
                        className="h-full w-full object-cover object-center"
                      />

                      {/* Luz de retrato y contraste cinematográfico */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(255,229,164,0.34),transparent_28%),linear-gradient(180deg,rgba(255,235,189,0.06),transparent_38%,rgba(22,4,10,0.90)_100%)]" />

                      {/* Detalle de marco interno */}
                      <div className="pointer-events-none absolute inset-[11px] rounded-[38px] border border-white/20" />

                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#18060B]/96 via-[#18060B]/60 to-transparent px-9 pb-9 pt-28">
                        <p className="text-[15px] font-black uppercase tracking-[0.23em] text-[#F8E8B9]">
                          Territorio y comunidad
                        </p>

                        <p
                          className="mt-3 font-serif text-[48px] leading-none text-white"
                          style={{
                            textShadow: "0 4px 14px rgba(0,0,0,0.62)",
                          }}
                        >
                          Esthela Damián
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bloque editorial de frase: sustituye el segundo retrato */}
                  <div
                    className="absolute bottom-[165px] left-[585px] right-[78px] z-30"
                    style={{
                      transform: `translate(${tilt.x * 4}px, ${tilt.y * 2}px)`,
                    }}
                  >
                    <p className="text-[15px] font-black uppercase tracking-[0.21em] text-[#F8E8B9]">
                      Voz del territorio
                    </p>

                    <div className="mt-5 h-[3px] w-[130px] rounded-full bg-[#D4A843]" />

                    <h2
                      className="mt-7 font-serif text-[50px] leading-[0.95] text-[#FFF9E8]"
                      style={{
                        textShadow:
                          "0 4px 0 rgba(35,7,15,0.48), 0 12px 28px rgba(0,0,0,0.44)",
                      }}
                    >
                      {phrase}
                    </h2>

                    <div className="mt-8 border-l border-[#D4A843]/75 pl-5">
                      <p className="text-[19px] font-bold uppercase tracking-[0.12em] text-[#F8E8B9]">
                        {displayName}
                      </p>

                      <div className="mt-3 flex items-center gap-2 text-[14px] font-semibold uppercase tracking-[0.16em] text-white/68">
                        <MapPin size={17} strokeWidth={2.2} />
                        {municipio}, Guerrero
                      </div>
                    </div>
                  </div>

                  {/* Sello metalizado */}
                  <div
                    className="absolute bottom-[58px] right-[76px] z-30 grid h-[116px] w-[116px] place-items-center rounded-full border-[3px] text-center text-[#F8E8B9]"
                    style={{
                      borderColor: "#D4A843",
                      background:
                        "radial-gradient(circle at 30% 23%, #F7DE87 0%, #D6A63C 23%, #885A13 51%, #D4A843 77%, #563205 100%)",
                      boxShadow:
                        "inset 0 0 0 7px rgba(61,29,4,0.36), inset 0 0 17px rgba(255,243,194,0.24), 0 13px 26px rgba(0,0,0,0.40)",
                    }}
                  >
                    <div className="rounded-full border border-[#FFE9A4]/55 px-3 py-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.12em]">
                        Por los
                      </p>
                      <p className="mt-1 font-serif text-[17px] leading-none text-[#FFF4CC]">
                        Caminos
                      </p>
                      <p className="mt-1 text-[10px] font-black uppercase tracking-[0.12em]">
                        del Sur
                      </p>
                    </div>
                  </div>

                  {/* Firma de autenticidad */}
                  <div className="absolute bottom-[58px] left-[76px] z-30">
                    <p
                      className="font-serif italic text-[34px] text-[#FFF1C2]"
                      style={{
                        textShadow: "0 3px 12px rgba(0,0,0,0.42)",
                      }}
                    >
                      Por los caminos del sur
                    </p>

                    <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.25em] text-white/55">
                      #PorlosCaminosdelSur
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 max-w-[600px] text-center text-xs leading-relaxed text-[#221B19]/55">
            La descarga genera un PNG nativo de 1080 × 1080. La vista previa
            sólo está escalada para la pantalla: no interviene en el archivo
            final.
          </p>
        </section>
      </section>
    </main>
  );
}