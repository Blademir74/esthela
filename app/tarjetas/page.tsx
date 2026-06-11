"use client";
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Camera, Check, Trophy, ChevronRight } from 'lucide-react';

type ModeloType = 'vamos-guerrero' | 'vamos-mexico' | 'camino-esthela';

export default function TarjetasPage() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [modelo, setModelo] = useState<ModeloType>('vamos-guerrero');
  const [fotoUsuario, setFotoUsuario] = useState<HTMLImageElement | null>(null);
  const [fotoPreviewURL, setFotoPreviewURL] = useState<string | null>(null);
  const [esthelaImg, setEsthelaImg] = useState<HTMLImageElement | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cargar imagen de Esthela al montar
  useEffect(() => {
    const img = new Image();
    // Usa mangos.png como solicitaste. Cambia a '/esthela-tarjeta.jpg' si prefieres
    img.src = '/assets/img/mangos.png';
    img.crossOrigin = 'anonymous';
    img.onload = () => setEsthelaImg(img);
  }, []);

  // Handler para foto del usuario (sin capture forzado)
  const handleFotoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFotoPreviewURL(url);
    const img = new Image();
    img.onload = () => setFotoUsuario(img);
    img.src = url;
  }, []);

  // Sloganes según modelo
  const getSloganLineas = (m: ModeloType) => {
    switch (m) {
      case 'vamos-guerrero': return ['VAMOS', 'POR', 'GUERRERO'];
      case 'vamos-mexico': return ['VAMOS', 'POR', 'MÉXICO'];
      case 'camino-esthela': return ['CAMINO', 'CON', 'ESTHELA'];
      default: return ['VAMOS', 'POR', 'GUERRERO'];
    }
  };

  // ═══════════════════════════════════════════════════════
  // DRAWCANVAS - COMPOSICIÓN VIRAL 1080x1080
  // ═══════════════════════════════════════════════════════
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !esthelaImg) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 1080, H = 1080;
    ctx.clearRect(0, 0, W, H);

    // 1. FONDO BASE oscuro
    ctx.fillStyle = '#0d0408';
    ctx.fillRect(0, 0, W, H);

    // 2. FOTO DE ESTHELA (zona izquierda 540px, object-cover vertical)
    const eW = 540, eH = H;
    const ratio = esthelaImg.naturalWidth / esthelaImg.naturalHeight;
    let sx = 0, sy = 0, sw = esthelaImg.naturalWidth, sh = esthelaImg.naturalHeight;
    const targetRatio = eW / eH;
    if (ratio > targetRatio) {
      sw = esthelaImg.naturalHeight * targetRatio;
      sx = (esthelaImg.naturalWidth - sw) / 2;
    } else {
      sh = esthelaImg.naturalWidth / targetRatio;
      sy = (esthelaImg.naturalHeight - sh) / 2;
    }
    ctx.drawImage(esthelaImg, sx, sy, sw, sh, 0, 0, eW, eH);

    // 3. GRADIENTE DIAGONAL sobre foto (para legibilidad del texto)
    const gradH = ctx.createLinearGradient(300, 0, 750, 0);
    gradH.addColorStop(0, 'rgba(13,4,8,0)');
    gradH.addColorStop(0.45, 'rgba(13,4,8,0.65)');
    gradH.addColorStop(1, 'rgba(13,4,8,0.95)');
    ctx.fillStyle = gradH;
    ctx.fillRect(0, 0, W, H);

    // 4. ZONA DERECHA semisólida
    ctx.fillStyle = 'rgba(13,4,8,0.92)';
    ctx.fillRect(520, 0, 560, H);

    // 5. LÍNEA DORADA divisoria
    ctx.strokeStyle = '#c9a84c';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(530, 60);
    ctx.lineTo(530, H - 60);
    ctx.stroke();

    // 6. LOGO/ESQUINA SUPERIOR DERECHA
    ctx.fillStyle = '#c9a84c';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('⚽ SELECCIÓN GUERRERO', W - 40, 60);
    ctx.fillText('2026', W - 40, 85);

    // 7. SLOGAN PRINCIPAL (Jerarquía #2)
    const sloganLineas = getSloganLineas(modelo);
    const sloganX = 810;
    let sloganY = 260;

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 110px "Arial Black", system-ui, sans-serif';
    ctx.fillText(sloganLineas[0], sloganX, sloganY);
    ctx.fillText(sloganLineas[1], sloganX, sloganY + 125);

    ctx.fillStyle = '#c9a84c';
    let fs = 100;
    ctx.font = `bold ${fs}px "Arial Black", system-ui, sans-serif`;
    while (ctx.measureText(sloganLineas[2]).width > 460 && fs > 60) {
      fs -= 5;
      ctx.font = `bold ${fs}px "Arial Black", system-ui, sans-serif`;
    }
    ctx.fillText(sloganLineas[2], sloganX, sloganY + 240);

    // 8. FOTO DEL USUARIO (Jerarquía #3)
    const circleX = 810, circleY = 680, circleR = 110;
    if (fotoUsuario) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(circleX, circleY, circleR, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      const img = fotoUsuario;
      const size = circleR * 2;
      const imgRatio = img.naturalWidth / img.naturalHeight;
      let usx = 0, usy = 0, usw = img.naturalWidth, ush = img.naturalHeight;
      if (imgRatio > 1) { usw = ush; usx = (img.naturalWidth - usw) / 2; }
      else { ush = usw; usy = (img.naturalHeight - ush) / 2; }
      ctx.drawImage(img, usx, usy, usw, ush, circleX - circleR, circleY - circleR, size, size);
      ctx.restore();

      ctx.strokeStyle = '#c9a84c';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(circleX, circleY, circleR + 3, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.strokeStyle = '#c9a84c';
      ctx.lineWidth = 4;
      ctx.setLineDash([10, 6]);
      ctx.beginPath();
      ctx.arc(circleX, circleY, circleR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(201,168,76,0.15)';
      ctx.fill();
      ctx.fillStyle = '#c9a84c';
      ctx.font = '16px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Tu foto aquí', circleX, circleY + 5);
    }

    // 9. MUNICIPIO (Jerarquía #4)
    ctx.fillStyle = '#c9a84c';
    ctx.font = 'bold 34px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText((municipio || 'TU MUNICIPIO').toUpperCase(), sloganX, circleY + 145);

    // 10. NOMBRE DEL USUARIO (Jerarquía #5 - discreto)
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    let nf = 26;
    const nombreCompleto = `${(nombre || 'TU NOMBRE').toUpperCase()} ${(apellido || '').toUpperCase()}`;
    ctx.font = `${nf}px system-ui, sans-serif`;
    while (ctx.measureText(nombreCompleto).width > 420 && nf > 18) {
      nf -= 2;
      ctx.font = `${nf}px system-ui, sans-serif`;
    }
    ctx.fillText(nombreCompleto, sloganX, circleY + 195);

    // 11. HASHTAGS (Jerarquía #6 - muy pequeño)
    ctx.fillStyle = 'rgba(201,168,76,0.6)';
    ctx.font = 'italic 22px system-ui, sans-serif';
    ctx.fillText('#GuerreroEsCone #SelecciónGuerrero', sloganX, H - 65);
    ctx.fillText('@EsthelaDamiánGuerrero', sloganX, H - 35);

  }, [nombre, apellido, municipio, modelo, fotoUsuario, esthelaImg]);

  // Redibujar cuando cambien los datos
  useEffect(() => {
    if (esthelaImg) drawCanvas();
  }, [drawCanvas, esthelaImg]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    setIsGenerating(true);
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Declaracion_${nombre || 'Guerrero'}_1080x1080.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch {
      alert('Error al generar. Intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!canvasRef.current) return;
    try {
      const blob = await new Promise<Blob | null>(resolve => canvasRef.current?.toBlob(resolve, 'image/png'));
      if (!blob) return;
      const file = new File([blob], 'declaracion-guerrero.png', { type: 'image/png' });
      if (navigator.share) {
        await navigator.share({
          title: '¡Me uno a Esthela Damián!',
          text: `${nombre} ${apellido} — Capitán de la Esperanza en ${municipio || 'Guerrero'}. #GuerreroEsCone`,
          files: [file]
        });
      } else {
        alert('En móvil se abrirá tu menú de compartir nativo. En PC, descárgala y súbelo directamente.');
      }
    } catch { /* Cancelado */ }
  };

  const modelos: { id: ModeloType; label: string; slogan: string }[] = [
    { id: 'vamos-guerrero', label: '🏆 Vamos por Guerrero', slogan: 'VAMOS POR GUERRERO' },
    { id: 'vamos-mexico', label: '🇲 Vamos por México', slogan: 'VAMOS POR MÉXICO' },
    { id: 'camino-esthela', label: '🌿 Camino con Esthela', slogan: 'CAMINO CON ESTHELA' },
  ];

  return (
    <main className="min-h-screen bg-[#0f0508] text-white px-4 py-12 md:py-16">
      <div className="max-w-5xl mx-auto mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
          Declaración Oficial <span className="text-[#c9a84c]">Titular</span>
        </h1>
        <p className="text-white/60 text-sm md:text-base max-w-xl mx-auto">
          Esta no es una credencial. Es tu declaración pública de apoyo a Esthela. Comparte y multiplica el movimiento.
        </p>
      </div>

      {/* Layout Responsive: Columna en móvil, 2 columnas en desktop */}
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl mx-auto">
        
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <div className="w-full md:w-1/2 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-lg font-bold mb-4 text-[#c9a84c]">Datos del Declarante</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Nombre(s)" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a84c] transition-all" />
              <input type="text" placeholder="Apellido(s)" value={apellido} onChange={(e) => setApellido(e.target.value)} className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a84c] transition-all" />
              <input type="text" placeholder="Municipio" value={municipio} onChange={(e) => setMunicipio(e.target.value)} className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a84c] transition-all" />
            </div>

            <div className="mt-6">
              <label className="block text-xs font-semibold text-[#c9a84c]/80 mb-1.5 tracking-wider uppercase">Tu Foto (Galería o Cámara)</label>
              <div onClick={() => inputRef.current?.click()} className="w-full flex flex-col items-center justify-center gap-2 p-8 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 hover:border-[#c9a84c]/50 cursor-pointer transition-all">
                {fotoPreviewURL ? (
                  <img src={fotoPreviewURL} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-[#c9a84c]" />
                ) : (
                  <Camera className="w-10 h-10 text-white/40" />
                )}
                <p className="text-white/80 font-medium text-sm">{fotoPreviewURL ? 'Toca para cambiar' : 'Sube o toma una foto'}</p>
                <p className="text-xs text-amber-400 mt-1">📱 Elige desde tu galería o toma una foto nueva</p>
              </div>
              <input type="file" accept="image/*" onChange={handleFotoChange} className="hidden" ref={inputRef} id="foto-input" />
            </div>

            <div className="mt-6">
              <label className="block text-xs font-semibold text-[#c9a84c]/80 mb-1.5 tracking-wider uppercase">Modelo de Slogan</label>
              <div className="space-y-2">
                {modelos.map(m => (
                  <button key={m.id} onClick={() => setModelo(m.id)} className={`w-full p-3 rounded-xl border text-left transition-all ${modelo === m.id ? 'border-[#c9a84c] bg-[#c9a84c]/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                    <span className="text-white font-semibold text-sm block">{m.label}</span>
                    <span className="text-white/40 text-xs">{m.slogan}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: PREVIEW + ACCIONES */}
        <div className="w-full md:w-1/2 space-y-6">
          <div className="w-full max-w-sm mx-auto">
            <canvas ref={canvasRef} width={1080} height={1080} className="w-full rounded-2xl shadow-2xl border-2 border-[#c9a84c]/40" style={{ aspectRatio: '1/1' }} />
          </div>

          <div className="w-full max-w-sm mx-auto space-y-3">
            <button onClick={handleDownload} disabled={isGenerating} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 bg-[#c9a84c] text-[#0f0508] disabled:opacity-50">
              {downloaded ? <Check className="w-5 h-5" /> : <Download className="w-5 h-5" />}
              {isGenerating ? 'Generando...' : downloaded ? '¡Descargada!' : 'Descargar 1080x1080'}
            </button>
            <button onClick={handleShare} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 bg-white/10 border border-white/20 hover:bg-white/15">
              <Share2 className="w-5 h-5" /> Compartir en Redes
            </button>
          </div>

          <p className="text-center text-white/40 text-xs max-w-sm mx-auto">
            💡 Descarga la imagen y compártela en Facebook/WhatsApp etiquetando a <span className="text-[#c9a84c]">@EsthelaDamiánGuerrero</span>. Tu nombre aparece pequeño porque el movimiento es lo grande.
          </p>
        </div>
      </div>
    </main>
  );
}