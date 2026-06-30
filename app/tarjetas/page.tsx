"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Share2, Camera, Check, Trophy, ChevronRight } from "lucide-react";

type ModeloType = "pueblo-manda" | "esperanza" | "unidad-victoria";

export default function TarjetasPage() {
  const [modelo, setModelo] = useState<ModeloType>("pueblo-manda");
  const [nombre, setNombre] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [registroId] = useState(() => `GR-${Math.floor(Math.random() * 9000) + 1000}`);
  const [foto, setFoto] = useState<string | null>(null);
  const [fotoImg, setFotoImg] = useState<HTMLImageElement | null>(null);
  const [silhouetteImg, setSilhouetteImg] = useState<HTMLImageElement | null>(null);
  const [downloaded, setDownloaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const img = new Image();
    img.src = "/assets/img/esthela-silhouette.png";
    img.crossOrigin = "anonymous";
    img.onload = () => setSilhouetteImg(img);
  }, []);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFoto(url);
    const img = new Image();
    img.onload = () => setFotoImg(img);
    img.src = url;
  };

  // ═══════════════════════════════════════════════════════
  // MOTORES DE DIBUJO 3D / GLASSMORPHISM (CANVAS 2D)
  // ═══════════════════════════════════════════════════════
  const drawBackground = (ctx: CanvasRenderingContext2D, W: number, H: number) => {
    const grad = ctx.createLinearGradient(0, 0, W, H);
    if (modelo === "pueblo-manda") {
      grad.addColorStop(0, "#3D0A1F");
      grad.addColorStop(1, "#6B1D3A");
    } else if (modelo === "esperanza") {
      grad.addColorStop(0, "#0B0508");
      grad.addColorStop(1, "#1A0F12");
    } else {
      grad.addColorStop(0, "#0f0508");
      grad.addColorStop(1, "#1A0510");
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Textura sutil (simulación de tejido/relieve)
    ctx.fillStyle = "rgba(212,168,67,0.04)";
    for (let i = 0; i < W; i += 40) {
      ctx.fillRect(i, 0, 2, H);
      ctx.fillRect(0, i, W, 2);
    }
  };

  const drawGlassPanel = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, radius: number, blur: number) => {
    ctx.save();
    ctx.filter = `blur(${blur}px)`;
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.fill();

    // Borde cristalino
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.stroke();
  };

  const draw3DText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size: number, color: string, align: "center" | "left" | "right" = "center") => {
    ctx.font = `800 ${size}px "Montserrat", system-ui, sans-serif`;
    ctx.textAlign = align;
    ctx.textBaseline = "top";

    // Relieve 3D
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillText(text, x + 4, y + 4);
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  };

  const drawPhotoCircle = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, cx: number, cy: number, r: number) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    const ratio = img.naturalWidth / img.naturalHeight;
    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
    if (ratio > 1) { sw = sh; sx = (img.naturalWidth - sw) / 2; }
    else { sh = sw; sy = (img.naturalHeight - sh) / 2; }
    ctx.drawImage(img, sx, sy, sw, sh, cx - r, cy - r, r * 2, r * 2);
    ctx.restore();

    // Glow dorado 3D
    const glow = ctx.createRadialGradient(cx, cy, r * 0.8, cx, cy, r * 1.3);
    glow.addColorStop(0, "rgba(212,168,67,0.5)");
    glow.addColorStop(1, "rgba(212,168,67,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.3, 0, Math.PI * 2);
    ctx.fill();

    // Borde extruido
    ctx.strokeStyle = "#D4A843";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  };

  const drawGoldBorder = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, radius: number, thickness: number) => {
    const grad = ctx.createLinearGradient(x, y, x + w, y + h);
    grad.addColorStop(0, "#BC955C");
    grad.addColorStop(0.5, "#D4A843");
    grad.addColorStop(1, "#fff8e1");
    ctx.strokeStyle = grad;
    ctx.lineWidth = thickness;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.stroke();
  };

  const drawEsthelaSilhouette = (ctx: CanvasRenderingContext2D, W: number, H: number) => {
    if (silhouetteImg) {
      const sw = W * 0.35, sh = H * 0.75;
      const x = modelo === "pueblo-manda" ? W * 0.62 : W * 0.05;
      const y = H * 0.15;
      ctx.globalAlpha = 0.85;
      ctx.drawImage(silhouetteImg, x, y, sw, sh);
      ctx.globalAlpha = 1;
    } else {
      // Fallback vectorial elegante
      ctx.fillStyle = "rgba(212,168,67,0.15)";
      ctx.beginPath();
      ctx.ellipse(W * 0.15, H * 0.45, 60, 80, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(W * 0.15, H * 0.65, 40, 120, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // ═══════════════════════════════════════════════════════
  // MODELOS ESPECÍFICOS
  // ═══════════════════════════════════════════════════════
  const drawModelPuebloManda = (ctx: CanvasRenderingContext2D, W: number, H: number) => {
    drawBackground(ctx, W, H);
    drawGlassPanel(ctx, W * 0.05, H * 0.12, W * 0.9, H * 0.76, 32, 24);
    drawGoldBorder(ctx, W * 0.05, H * 0.12, W * 0.9, H * 0.76, 32, 4);

    drawPhotoCircle(ctx, fotoImg!, W * 0.22, H * 0.38, 140);
    drawEsthelaSilhouette(ctx, W, H);

    ctx.fillStyle = "#D4A843";
    ctx.font = "600 32px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`DEFENSOR(A) DE LA CUARTA TRANSFORMACIÓN`, W / 2, H * 0.18);

    const nombreClean = nombre || "CIUDADANO";
    const munClean = municipio || "GUERRERO";
    draw3DText(ctx, `SOY ${nombreClean.toUpperCase()}`, W / 2, H * 0.58, 64, "#FFFFFF");
    draw3DText(ctx, `ORGULLOSAMENTE ${munClean.toUpperCase()}`, W / 2, H * 0.68, 42, "#D4A843");
    draw3DText(ctx, "POR EL BIEN DE TODOS, EN LA ENCUESTA", W / 2, H * 0.78, 28, "rgba(255,255,255,0.7)");
    draw3DText(ctx, "ESTHELA ES LA RESPUESTA", W / 2, H * 0.84, 36, "#D4A843");
  };

  const drawModelEsperanza = (ctx: CanvasRenderingContext2D, W: number, H: number) => {
    drawBackground(ctx, W, H);
    drawGlassPanel(ctx, W * 0.08, H * 0.08, W * 0.84, H * 0.84, 40, 32);
    drawGoldBorder(ctx, W * 0.08, H * 0.08, W * 0.84, H * 0.84, 40, 3);

    drawPhotoCircle(ctx, fotoImg!, W * 0.18, H * 0.35, 130);
    drawEsthelaSilhouette(ctx, W, H);

    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "300 28px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Esthela va en mi encuesta", W * 0.38, H * 0.22);
    ctx.fillText("por la esperanza de Guerrero.", W * 0.38, H * 0.28);

    draw3DText(ctx, `${nombre || "CIUDADANO"}`, W * 0.55, H * 0.48, 72, "#D4A843", "left");
    draw3DText(ctx, "Porque con ella,", W * 0.38, H * 0.62, 34, "rgba(255,255,255,0.6)");
    draw3DText(ctx, "el pueblo nunca más estará solo.", W * 0.38, H * 0.68, 34, "rgba(255,255,255,0.6)");

    ctx.fillStyle = "#D4A843";
    ctx.font = "600 24px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`📍 ${municipio || "GUERRERO"}`, W / 2, H * 0.86);
  };

  const drawModelUnidadVictoria = (ctx: CanvasRenderingContext2D, W: number, H: number) => {
    drawBackground(ctx, W, H);
    drawGlassPanel(ctx, W * 0.06, H * 0.1, W * 0.88, H * 0.8, 28, 18);
    drawGoldBorder(ctx, W * 0.06, H * 0.1, W * 0.88, H * 0.8, 28, 5);

    drawPhotoCircle(ctx, fotoImg!, W * 0.18, H * 0.32, 125);
    drawEsthelaSilhouette(ctx, W, H);

    // Contador 3D
    ctx.fillStyle = "#1A0510";
    ctx.beginPath();
    ctx.roundRect(W * 0.68, H * 0.14, W * 0.22, H * 0.1, 12);
    ctx.fill();
    draw3DText(ctx, `REGISTRO OFICIAL #${registroId}`, W * 0.79, H * 0.17, 28, "#D4A843", "center");

    draw3DText(ctx, "GUERRERO ES CON E", W / 2, H * 0.52, 68, "#FFFFFF");
    draw3DText(ctx, "DE ESTRUCTURA", W / 2, H * 0.6, 48, "#D4A843");
    draw3DText(ctx, `SOY ${nombre || "CIUDADANO"}`, W / 2, H * 0.7, 40, "rgba(255,255,255,0.8)");
    draw3DText(ctx, "Y MI PULSO ES POR LA UNIDAD", W / 2, H * 0.76, 28, "rgba(255,255,255,0.6)");
    draw3DText(ctx, "CON ESTHELA DAMIÁN", W / 2, H * 0.81, 36, "#D4A843");

    // Línea de combate digital
    ctx.strokeStyle = "rgba(212,168,67,0.4)";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 4]);
    ctx.beginPath();
    ctx.moveTo(W * 0.15, H * 0.9);
    ctx.lineTo(W * 0.85, H * 0.9);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  // ═══════════════════════════════════════════════════════
  // RENDERIZADO UNIFICADO
  // ═══════════════════════════════════════════════════════
  useEffect(() => {
    if (!canvasRef.current || !fotoImg) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const W = 1080, H = 1080;
    if (modelo === "pueblo-manda") drawModelPuebloManda(ctx, W, H);
    else if (modelo === "esperanza") drawModelEsperanza(ctx, W, H);
    else drawModelUnidadVictoria(ctx, W, H);
  }, [modelo, fotoImg, nombre, municipio, registroId, silhouetteImg]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `Tarjeta_${nombre || "Esthela"}_${modelo.replace("-", "_")}_1080x1080.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const handleShare = async () => {
    if (!canvasRef.current) return;
    try {
      const blob = await new Promise<Blob | null>(resolve => canvasRef.current?.toBlob(resolve, "image/png"));
      if (!blob) return;
      const file = new File([blob], "tarjeta-guerrero.png", { type: "image/png" });
      if (navigator.share) {
        await navigator.share({ title: "Mi Tarjeta Oficial de Adhesión", text: `${nombre} ${municipio} — Por el bien de todos, en la encuesta Esthela es la respuesta.`, files: [file] });
      }
    } catch {}
  };

  return (
    <main className="min-h-screen bg-[#0B0508] text-white px-4 py-12 md:py-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">
            Insignias 3D: <span className="text-[#D4A843]">La Respuesta es Esthela</span>
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-xl mx-auto">
            Genera tu tarjeta de identidad política ultra-lujo. 1080×1080 lista para viralizar.
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-2 gap-8">
            {/* FORMULARIO */}
            <div className="space-y-6">
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#D4A843]/80 mb-1.5 tracking-wider uppercase">Nombre *</label>
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-[#D4A843] transition-all" placeholder="Tu nombre" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#D4A843]/80 mb-1.5 tracking-wider uppercase">Municipio *</label>
                    <input type="text" value={municipio} onChange={(e) => setMunicipio(e.target.value)} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-[#D4A843] transition-all" placeholder="Chilpancingo" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#D4A843]/80 mb-1.5 tracking-wider uppercase">Foto de Adhesión</label>
                  <label className="w-full flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 hover:border-[#D4A843]/40 cursor-pointer transition-all">
                    {foto ? <img src={foto} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-[#D4A843]" /> : <Camera className="w-10 h-10 text-white/40" />}
                    <p className="text-white/80 text-sm font-medium">{foto ? "Toca para cambiar" : "Sube o toma una foto"}</p>
                  </label>
                  <input type="file" accept="image/*" onChange={handleFotoChange} className="hidden" />
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-[#D4A843]/80 mb-1.5 tracking-wider uppercase">Modelo de Insignia</label>
                  {[
                    { id: "pueblo-manda" as ModeloType, label: "🏛️ El Pueblo Manda", desc: "Orgullo local + Cuarta Transformación" },
                    { id: "esperanza" as ModeloType, label: "🕊️ Esperanza Guerrerense", desc: "Humanista, cercanía y encuesta" },
                    { id: "unidad-victoria" as ModeloType, label: "⚔️ Unidad y Victoria", desc: "Estructura, combate digital y registro" }
                  ].map((m) => (
                    <button key={m.id} onClick={() => setModelo(m.id)} className={`w-full p-4 rounded-xl border text-left transition-all ${modelo === m.id ? "border-[#D4A843] bg-[#D4A843]/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
                      <p className={`font-bold text-sm ${modelo === m.id ? "text-[#D4A843]" : "text-white"}`}>{m.label}</p>
                      <p className="text-white/40 text-xs mt-1">{m.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={handleDownload} disabled={!fotoImg} className="w-full py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed bg-[#D4A843] text-[#0B0508]">
                {downloaded ? <Check className="w-5 h-5" /> : <Download className="w-5 h-5" />}
                {downloaded ? "¡Descargada!" : "Descargar 1080×1080"}
              </button>
              <button onClick={handleShare} disabled={!fotoImg} className="w-full py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50 bg-white/10 border border-white/20">
                <Share2 className="w-5 h-5" /> Compartir en Redes
              </button>
            </div>

            {/* PREVIEW */}
            <div className="flex flex-col items-center gap-4">
              <p className="text-white/40 text-xs uppercase tracking-widest">Vista previa en tiempo real</p>
              <canvas ref={canvasRef} width={1080} height={1080} className="w-full max-w-sm rounded-2xl shadow-2xl border-2 border-[#D4A843]/30" style={{ aspectRatio: "1/1" }} />
              <p className="text-white/30 text-xs text-center max-w-xs">
                🔒 Los datos solo se usan localmente para generar la imagen. No se almacenan en servidores.
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}