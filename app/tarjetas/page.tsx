"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Share2, Camera, Check, Trophy } from "lucide-react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["800"] });

type ModeloType = "soberania" | "voz-pueblo" | "unidad";

export default function TarjetasPage() {
  const [modelo, setModelo] = useState<ModeloType>("soberania");
  const [nombre, setNombre] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [fotoImg, setFotoImg] = useState<HTMLImageElement | null>(null);
  const [esthelaImg, setEsthelaImg] = useState<HTMLImageElement | null>(null);
  const [ready, setReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const img = new Image();
    img.src = "/assets/img/esthela-territorio.png";
    img.crossOrigin = "anonymous";
    img.onload = () => { setEsthelaImg(img); setReady(true); };
  }, []);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFotoUrl(url);
    const img = new Image();
    img.onload = () => setFotoImg(img);
    img.src = url;
  };

  // ─── MOTORES CANVAS 3D / GLASSMORPHISM ───
  const draw3DText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size: number, color: string, align: CanvasTextAlign = "center") => {
    ctx.textAlign = align;
    ctx.textBaseline = "top";
    const font = `800 ${size}px ${montserrat.style.fontFamily}, system-ui, sans-serif`;
    ctx.font = font;
    // Sombra 3D profunda
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillText(text, x + 3, y + 4);
    ctx.fillText(text, x + 2, y + 3);
    // Biselado dorado
    ctx.fillStyle = "#BC955C";
    ctx.fillText(text, x + 1, y + 1);
    // Color principal
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  };

  const drawGlassPanel = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    ctx.save();
    ctx.filter = "blur(18px)";
    ctx.fillStyle = "rgba(255,255,255,0.14)";
    ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill();
    ctx.restore();

    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill();

    // Borde cristalino con reflejo
    const grad = ctx.createLinearGradient(x, y, x + w, y + h);
    grad.addColorStop(0, "rgba(255,255,255,0.4)");
    grad.addColorStop(0.5, "rgba(255,255,255,0.1)");
    grad.addColorStop(1, "rgba(255,255,255,0.3)");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.stroke();

    // Brillo interno superior
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.beginPath(); ctx.roundRect(x + 4, y + 4, w - 8, h / 3, r - 2); ctx.fill();
  };

  const drawMetallicSeal = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) => {
    const grad = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r);
    grad.addColorStop(0, "#E8D5A5");
    grad.addColorStop(0.4, "#D4A843");
    grad.addColorStop(0.7, "#8B6B2A");
    grad.addColorStop(1, "#D4A843");
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();

    ctx.strokeStyle = "#FFF8DC";
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(cx, cy, r - 4, 0, Math.PI * 2); ctx.stroke();

    ctx.fillStyle = "#3D0A1F";
    ctx.font = "800 14px system-ui, sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("ASPIRANTE", cx, cy - 12);
    ctx.fillText("REGISTRADA", cx, cy + 4);
    ctx.font = "800 12px system-ui, sans-serif";
    ctx.fillText("MORENA GUERRERO", cx, cy + 22);
  };

  const drawImageMidBody = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number, r: number) => {
    ctx.save();
    ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.clip();

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const boxRatio = w / h;
    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
    if (imgRatio > boxRatio) {
      sw = img.naturalHeight * boxRatio;
      sx = (img.naturalWidth - sw) / 2;
    } else {
      sh = img.naturalWidth / boxRatio;
      sy = (img.naturalHeight - sh) / 2;
    }
    // Recorte medio cuerpo: desplazamos origen Y un 15% para enfocarlo en torso/rostro
    ctx.drawImage(img, sx, sy + sh * 0.15, sw, sh * 0.85, x, y, w, h);
    ctx.restore();

    // Sombra isométrica bajo foto
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.beginPath(); ctx.roundRect(x + 6, y + 8, w, h, r); ctx.fill();
    ctx.drawImage(img, sx, sy + sh * 0.15, sw, sh * 0.85, x, y, w, h);
  };

  const drawMapRelief = (ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number) => {
    ctx.save();
    ctx.shadowColor = "rgba(212,168,67,0.5)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 8;
    ctx.shadowOffsetY = 12;

    const grad = ctx.createLinearGradient(cx - w/2, cy - h/2, cx + w/2, cy + h/2);
    grad.addColorStop(0, "rgba(212,168,67,0.15)");
    grad.addColorStop(0.5, "rgba(212,168,67,0.35)");
    grad.addColorStop(1, "rgba(212,168,67,0.1)");
    ctx.fillStyle = grad;

    // Silueta estilizada de Guerrero
    ctx.beginPath();
    ctx.moveTo(cx - 120, cy - 60);
    ctx.quadraticCurveTo(cx - 60, cy - 140, cx + 40, cy - 110);
    ctx.quadraticCurveTo(cx + 130, cy - 90, cx + 110, cy - 20);
    ctx.quadraticCurveTo(cx + 90, cy + 80, cx + 20, cy + 100);
    ctx.quadraticCurveTo(cx - 80, cy + 110, cx - 100, cy + 40);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(212,168,67,0.6)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  };

  // ─── MODELOS ───
  const drawModelSoberania = (ctx: CanvasRenderingContext2D, W: number, H: number) => {
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#1A0F12"); bg.addColorStop(1, "#0B0508");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // Textura artesanal
    ctx.fillStyle = "rgba(212,168,67,0.03)";
    for (let i = 0; i < W; i += 30) { ctx.fillRect(i, 0, 1, H); ctx.fillRect(0, i, W, 1); }

    drawMapRelief(ctx, W * 0.78, H * 0.25, 320, 380);
    drawGlassPanel(ctx, 60, 80, W - 120, H - 160, 36);

    if (esthelaImg) drawImageMidBody(ctx, esthelaImg, 120, 140, 380, 520, 24);
    if (fotoImg) drawImageMidBody(ctx, fotoImg, W - 500, 140, 380, 520, 24);

    draw3DText(ctx, "SOBERANÍA Y TERRITORIO", W / 2, 110, 48, "#FFFFFF");
    draw3DText(ctx, `"La soberanía se defiende con el pueblo.\nEsthela es la respuesta."`, W / 2, 680, 32, "#D4A843");

    drawMetallicSeal(ctx, W - 160, H - 140, 65);

    const gentilicio = municipio ? municipio.replace(/ del\s*Bravo/g, "").replace(/ de\s*Juarez/g, "") : "Guerrero";
    draw3DText(ctx, `SOY ${nombre.toUpperCase() || "CIUDADANO"}`, W / 2, 740, 42, "#FFFFFF");
    draw3DText(ctx, `ORGULLOSAMENTE ${gentilicio.toUpperCase()}`, W / 2, 800, 32, "#D4A843");
  };

  const drawModelVozPueblo = (ctx: CanvasRenderingContext2D, W: number, H: number) => {
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#3D0A1F"); bg.addColorStop(1, "#6B1D3A");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    drawGlassPanel(ctx, 80, 60, W - 160, H - 120, 40);
    if (esthelaImg) drawImageMidBody(ctx, esthelaImg, 140, 100, 400, 540, 28);
    if (fotoImg) drawImageMidBody(ctx, fotoImg, W - 540, 100, 400, 540, 28);

    draw3DText(ctx, "VOZ DEL PUEBLO", W / 2, 90, 52, "#FFFFFF");
    draw3DText(ctx, `"Soy ${nombre || "ciudadano"} de ${municipio || "Guerrero"}\ny Esthela va en mi encuesta por la justicia social."`, W / 2, 660, 30, "#D4A843");

    drawMetallicSeal(ctx, W - 180, H - 160, 60);
  };

  const drawModelUnidad = (ctx: CanvasRenderingContext2D, W: number, H: number) => {
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#0B0508"); bg.addColorStop(1, "#1A0510");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    drawGlassPanel(ctx, 70, 70, W - 140, H - 140, 32);
    if (esthelaImg) drawImageMidBody(ctx, esthelaImg, 130, 120, 360, 480, 20);
    if (fotoImg) drawImageMidBody(ctx, fotoImg, W - 490, 120, 360, 480, 20);

    draw3DText(ctx, "UNIDAD 4T", W / 2, 100, 56, "#FFFFFF");
    draw3DText(ctx, `"Con el pueblo todo,\nsin el pueblo nada."`, W / 2, 620, 34, "#D4A843");

    drawMetallicSeal(ctx, W - 170, H - 150, 62);
    draw3DText(ctx, `ESTHELA VA EN MI ENCUESTA POR LA ESPERANZA DE GUERRERO`, W / 2, 780, 28, "rgba(255,255,255,0.85)");
  };

  useEffect(() => {
    if (!canvasRef.current || !ready || !fotoImg) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const W = 1080, H = 1080;
    if (modelo === "soberania") drawModelSoberania(ctx, W, H);
    else if (modelo === "voz-pueblo") drawModelVozPueblo(ctx, W, H);
    else drawModelUnidad(ctx, W, H);
  }, [modelo, fotoImg, nombre, municipio, ready, esthelaImg]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `Insignia_${nombre || "Esthela"}_${modelo}_1080x1080.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const handleShare = async () => {
    if (!canvasRef.current) return;
    try {
      const blob = await new Promise<Blob | null>(resolve => canvasRef.current?.toBlob(resolve, "image/png"));
      if (!blob) return;
      const file = new File([blob], "insignia-guerrero.png", { type: "image/png" });
      if (navigator.share) {
        await navigator.share({ title: "Mi Insignia Oficial", text: `${nombre} ${municipio} — Esthela va en mi encuesta por la esperanza de Guerrero.`, files: [file] });
      }
    } catch {}
  };

  return (
    <main className="min-h-screen bg-[#0B0508] text-white px-4 py-12 md:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">
            Insignias 3D: <span className="text-[#D4A843]">La Respuesta es Esthela</span>
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-xl mx-auto">
            Profundidad de campo, glassmorphism premium y narrativa de la 4T. 1080×1080 lista para Facebook.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
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
                <label className="block text-xs font-semibold text-[#D4A843]/80 mb-1.5 tracking-wider uppercase">Tu Foto (Galería)</label>
                <label className="w-full flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 hover:border-[#D4A843]/40 cursor-pointer transition-all">
                  {fotoUrl ? <img src={fotoUrl} alt="Preview" className="w-20 h-20 rounded-lg object-cover border-2 border-[#D4A843]" /> : <Camera className="w-10 h-10 text-white/40" />}
                  <p className="text-white/80 text-sm font-medium">{fotoUrl ? "Toca para cambiar" : "Sube desde tu galería"}</p>
                </label>
                <input type="file" accept="image/*" onChange={handleFotoChange} className="hidden" />
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-semibold text-[#D4A843]/80 mb-1.5 tracking-wider uppercase">Modelo de Insignia</label>
                {[
                  { id: "soberania" as ModeloType, label: "🏔️ Soberanía y Territorio", desc: "Paisaje icónico + defensa nacional" },
                  { id: "voz-pueblo" as ModeloType, label: "📜 Voz del Pueblo", desc: "Editorial de alta gama + justicia social" },
                  { id: "unidad" as ModeloType, label: "🤝 Unidad 4T", desc: "Frase emblemática + esperanza" }
                ].map((m) => (
                  <button key={m.id} onClick={() => setModelo(m.id)} className={`w-full p-4 rounded-xl border text-left transition-all ${modelo === m.id ? "border-[#D4A843] bg-[#D4A843]/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
                    <p className={`font-bold text-sm ${modelo === m.id ? "text-[#D4A843]" : "text-white"}`}>{m.label}</p>
                    <p className="text-white/40 text-xs mt-1">{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleDownload} disabled={!fotoImg} className="w-full py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed bg-[#D4A843] text-[#0B0508]">
              <Download className="w-5 h-5" /> Descargar 1080×1080 (300dpi)
            </button>
            <button onClick={handleShare} disabled={!fotoImg} className="w-full py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50 bg-white/10 border border-white/20">
              <Share2 className="w-5 h-5" /> Compartir en Redes
            </button>
          </div>

          {/* PREVIEW 3D */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-white/40 text-xs uppercase tracking-widest">Vista previa en tiempo real · Profundidad 3D</p>
            <canvas ref={canvasRef} width={1080} height={1080} className="w-full max-w-sm rounded-2xl shadow-2xl border-2 border-[#D4A843]/30" style={{ aspectRatio: "1/1" }} />
            <p className="text-white/30 text-xs text-center max-w-xs">
              🔒 Procesamiento local. Sin servidores. Calidad optimizada para Facebook/WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}