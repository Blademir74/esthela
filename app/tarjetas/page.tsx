"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Share2, Camera, Check } from "lucide-react";

type ModeloType = "pueblo-manda" | "esperanza" | "unidad-victoria";

// ─── UTILIDADES CANVAS COMPATIBLES ───
const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

const drawImageCover = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) => {
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
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
};

const fitText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number, baseSize: number): number => {
  let size = baseSize;
  ctx.font = `800 ${size}px "Montserrat", system-ui, sans-serif`;
  while (ctx.measureText(text).width > maxWidth && size > 20) {
    size -= 2;
    ctx.font = `800 ${size}px "Montserrat", system-ui, sans-serif`;
  }
  return size;
};

export default function TarjetasPage() {
  const [modelo, setModelo] = useState<ModeloType>("pueblo-manda");
  const [nombre, setNombre] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [registroId] = useState(() => `GR-${Math.floor(Math.random() * 9000) + 1000}`);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
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
    setFotoUrl(url);
    const img = new Image();
    img.onload = () => setFotoImg(img);
    img.src = url;
  };

  // ─── MOTORES DE DIBUJO POR MODELO ───
  const drawModelPuebloManda = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number) => {
    // Fondo Guinda Profundo
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#3D0A1F"); bg.addColorStop(1, "#6B1D3A");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Textura sutil
    ctx.fillStyle = "rgba(212,168,67,0.05)";
    for (let i = 0; i < W; i += 40) { ctx.fillRect(i, 0, 2, H); ctx.fillRect(0, i, W, 2); }

    // Panel Glass
    drawRoundedRect(ctx, 60, 100, W - 120, H - 200, 32);
    ctx.save(); ctx.filter = "blur(24px)"; ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fill(); ctx.restore();
    ctx.fillStyle = "rgba(255,255,255,0.06)"; ctx.fill();
    const goldGrad = ctx.createLinearGradient(60, 100, W - 60, H - 100);
    goldGrad.addColorStop(0, "#BC955C"); goldGrad.addColorStop(0.5, "#D4A843"); goldGrad.addColorStop(1, "#fff8e1");
    ctx.strokeStyle = goldGrad; ctx.lineWidth = 4; ctx.stroke();

    // Foto 3D
    if (fotoImg) {
      ctx.save(); ctx.beginPath(); ctx.arc(280, 380, 130, 0, Math.PI * 2); ctx.clip();
      drawImageCover(ctx, fotoImg, 150, 250, 260, 260); ctx.restore();
      const glow = ctx.createRadialGradient(280, 380, 110, 280, 380, 150);
      glow.addColorStop(0, "rgba(212,168,67,0.5)"); glow.addColorStop(1, "rgba(212,168,67,0)");
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(280, 380, 150, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#D4A843"; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(280, 380, 130, 0, Math.PI * 2); ctx.stroke();
    }

    // Silueta Esthela
    if (silhouetteImg) {
      ctx.globalAlpha = 0.85; ctx.drawImage(silhouetteImg, 650, 120, 360, 580); ctx.globalAlpha = 1;
    } else {
      ctx.fillStyle = "rgba(212,168,67,0.15)";
      ctx.beginPath(); ctx.ellipse(800, 400, 70, 110, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(800, 550, 50, 150, 0, 0, Math.PI * 2); ctx.fill();
    }

    // Textos
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillStyle = "#D4A843";
    ctx.font = "600 36px system-ui, sans-serif";
    ctx.fillText("DEFENSOR(A) DE LA CUARTA TRANSFORMACIÓN", W / 2, 180);

    const nClean = (nombre || "CIUDADANO").toUpperCase();
    const mClean = (municipio || "GUERRERO").toUpperCase();
    let fs = fitText(ctx, `SOY ${nClean}`, W - 160, 68);
    ctx.fillStyle = "#FFFFFF"; ctx.fillText(`SOY ${nClean}`, W / 2, 360);
    fs = fitText(ctx, `ORGULLOSAMENTE ${mClean}`, W - 160, 52);
    ctx.fillStyle = "#D4A843"; ctx.fillText(`ORGULLOSAMENTE ${mClean}`, W / 2, 440);
    fs = fitText(ctx, "POR EL BIEN DE TODOS, EN LA ENCUESTA", W - 160, 32);
    ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.fillText("POR EL BIEN DE TODOS, EN LA ENCUESTA", W / 2, 540);
    fs = fitText(ctx, "ESTHELA ES LA RESPUESTA", W - 160, 40);
    ctx.fillStyle = "#D4A843"; ctx.fillText("ESTHELA ES LA RESPUESTA", W / 2, 610);
  }, [fotoImg, silhouetteImg, nombre, municipio]);

  const drawModelEsperanza = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number) => {
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#0B0508"); bg.addColorStop(1, "#1A0F12");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    drawRoundedRect(ctx, 80, 80, W - 160, H - 160, 40);
    ctx.save(); ctx.filter = "blur(32px)"; ctx.fillStyle = "rgba(255,255,255,0.1)"; ctx.fill(); ctx.restore();
    ctx.fillStyle = "rgba(255,255,255,0.05)"; ctx.fill();
    ctx.strokeStyle = "#D4A843"; ctx.lineWidth = 3; ctx.stroke();

    if (fotoImg) {
      ctx.save(); ctx.beginPath(); ctx.arc(250, 360, 120, 0, Math.PI * 2); ctx.clip();
      drawImageCover(ctx, fotoImg, 130, 240, 240, 240); ctx.restore();
      const glow = ctx.createRadialGradient(250, 360, 100, 250, 360, 140);
      glow.addColorStop(0, "rgba(212,168,67,0.5)"); glow.addColorStop(1, "rgba(212,168,67,0)");
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(250, 360, 140, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#D4A843"; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(250, 360, 120, 0, Math.PI * 2); ctx.stroke();
    }

    if (silhouetteImg) { ctx.globalAlpha = 0.8; ctx.drawImage(silhouetteImg, 600, 100, 380, 600); ctx.globalAlpha = 1; }

    ctx.textAlign = "left"; ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.font = "300 32px system-ui, sans-serif";
    ctx.fillText("Esthela va en mi encuesta", 320, 200);
    ctx.fillText("por la esperanza de Guerrero.", 320, 250);

    const nClean = nombre || "CIUDADANO";
    let fs = fitText(ctx, nClean, W - 400, 84);
    ctx.fillStyle = "#D4A843"; ctx.fillText(nClean, 320, 380);
    fs = fitText(ctx, "Porque con ella,", W - 400, 36);
    ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.fillText("Porque con ella,", 320, 480);
    fs = fitText(ctx, "el pueblo nunca más estará solo.", W - 400, 36);
    ctx.fillText("el pueblo nunca más estará solo.", 320, 530);

    ctx.textAlign = "center";
    ctx.fillStyle = "#D4A843"; ctx.font = "600 28px system-ui, sans-serif";
    ctx.fillText(`📍 ${municipio || "GUERRERO"}`, W / 2, H - 120);
  }, [fotoImg, silhouetteImg, nombre, municipio]);

  const drawModelUnidadVictoria = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number) => {
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#0f0508"); bg.addColorStop(1, "#1A0510");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // Grid tech
    ctx.strokeStyle = "rgba(212,168,67,0.15)"; ctx.lineWidth = 1;
    for (let i = 0; i < W; i += 60) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke(); }
    for (let i = 0; i < H; i += 60) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke(); }

    drawRoundedRect(ctx, 60, 80, W - 120, H - 160, 28);
    ctx.save(); ctx.filter = "blur(18px)"; ctx.fillStyle = "rgba(255,255,255,0.08)"; ctx.fill(); ctx.restore();
    ctx.fillStyle = "rgba(255,255,255,0.04)"; ctx.fill();
    ctx.strokeStyle = "#D4A843"; ctx.lineWidth = 5; ctx.stroke();

    if (fotoImg) {
      ctx.save(); ctx.beginPath(); ctx.arc(250, 320, 110, 0, Math.PI * 2); ctx.clip();
      drawImageCover(ctx, fotoImg, 140, 210, 220, 220); ctx.restore();
      const glow = ctx.createRadialGradient(250, 320, 90, 250, 320, 130);
      glow.addColorStop(0, "rgba(212,168,67,0.5)"); glow.addColorStop(1, "rgba(212,168,67,0)");
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(250, 320, 130, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#D4A843"; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(250, 320, 110, 0, Math.PI * 2); ctx.stroke();
    }

    if (silhouetteImg) { ctx.globalAlpha = 0.85; ctx.drawImage(silhouetteImg, 620, 120, 380, 550); ctx.globalAlpha = 1; }

    // Contador 3D
    drawRoundedRect(ctx, 740, 120, 280, 70, 14);
    ctx.fillStyle = "#1A0510"; ctx.fill();
    ctx.strokeStyle = "#D4A843"; ctx.lineWidth = 2; ctx.stroke();
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillStyle = "#D4A843"; ctx.font = "800 26px system-ui, sans-serif";
    ctx.fillText(`REGISTRO OFICIAL #${registroId}`, 880, 155);

    ctx.textAlign = "center";
    let fs = fitText(ctx, "GUERRERO ES CON E", W - 160, 72);
    ctx.fillStyle = "#FFFFFF"; ctx.fillText("GUERRERO ES CON E", W / 2, 260);
    fs = fitText(ctx, "DE ESTRUCTURA", W - 160, 52);
    ctx.fillStyle = "#D4A843"; ctx.fillText("DE ESTRUCTURA", W / 2, 340);
    const nClean = nombre || "CIUDADANO";
    fs = fitText(ctx, `SOY ${nClean}`, W - 160, 42);
    ctx.fillStyle = "rgba(255,255,255,0.8)"; ctx.fillText(`SOY ${nClean}`, W / 2, 440);
    fs = fitText(ctx, "Y MI PULSO ES POR LA UNIDAD", W - 160, 30);
    ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.fillText("Y MI PULSO ES POR LA UNIDAD", W / 2, 520);
    fs = fitText(ctx, "CON ESTHELA DAMIÁN", W - 160, 38);
    ctx.fillStyle = "#D4A843"; ctx.fillText("CON ESTHELA DAMIÁN", W / 2, 580);

    ctx.strokeStyle = "rgba(212,168,67,0.4)"; ctx.lineWidth = 2; ctx.setLineDash([8, 4]);
    ctx.beginPath(); ctx.moveTo(140, H - 100); ctx.lineTo(W - 140, H - 100); ctx.stroke();
    ctx.setLineDash([]);
  }, [fotoImg, silhouetteImg, nombre, registroId]);

  useEffect(() => {
    if (!canvasRef.current || !fotoImg) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const W = 1080, H = 1080;
    if (modelo === "pueblo-manda") drawModelPuebloManda(ctx, W, H);
    else if (modelo === "esperanza") drawModelEsperanza(ctx, W, H);
    else drawModelUnidadVictoria(ctx, W, H);
  }, [modelo, fotoImg, nombre, municipio, registroId, silhouetteImg, drawModelPuebloManda, drawModelEsperanza, drawModelUnidadVictoria]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `Insignia_${nombre || "Esthela"}_${modelo}_1080x1080.png`;
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
      const file = new File([blob], "insignia-guerrero.png", { type: "image/png" });
      if (navigator.share) {
        await navigator.share({ title: "Mi Insignia Oficial", text: `${nombre} ${municipio} — En la encuesta Esthela es la respuesta.`, files: [file] });
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
                <label className="block text-xs font-semibold text-[#D4A843]/80 mb-1.5 tracking-wider uppercase">Foto de Adhesión</label>
                <label className="w-full flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 hover:border-[#D4A843]/40 cursor-pointer transition-all">
                  {fotoUrl ? <img src={fotoUrl} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-[#D4A843]" /> : <Camera className="w-10 h-10 text-white/40" />}
                  <p className="text-white/80 text-sm font-medium">{fotoUrl ? "Toca para cambiar" : "Sube o toma una foto"}</p>
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
        </div>
      </div>
    </main>
  );
}