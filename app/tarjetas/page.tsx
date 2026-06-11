"use client";
import { useState, useRef, useEffect, useCallback } from 'react';

// --- TIPOS ---
type FormData = {
  nombre: string;
  apellido: string;
  municipio: string;
};

export default function TarjetasPage() {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ESTADO Y REFS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const [formData, setFormData] = useState<FormData>({ nombre: '', apellido: '', municipio: '' });
  const [fotoUsuario, setFotoUsuario] = useState<HTMLImageElement | null>(null);
  const [fotoPreviewURL, setFotoPreviewURL] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CAMBIO 1: INPUT DE FOTO SIN CAPTURE FORZADO
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const handleFotoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setFotoPreviewURL(url);

    const img = new Image();
    img.onload = () => {
      setFotoUsuario(img);
    };
    img.src = url;
  }, []);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CAMBIO 4: COMPOSICIÓN DEL CANVAS (1080x1080)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 1080;
    const H = 1080;

    // 1. FONDO OSCURO BASE
    ctx.fillStyle = '#120608';
    ctx.fillRect(0, 0, W, H);

    // 2. FOTO DEL USUARIO (zona superior 70% = 756px)
    const fotoH = Math.round(H * 0.70); // 756px
    if (fotoUsuario) {
      // Lógica object-cover en Canvas
      const img = fotoUsuario;
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = W / fotoH;
      let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
      
      if (imgRatio > canvasRatio) {
        sw = img.naturalHeight * canvasRatio;
        sx = (img.naturalWidth - sw) / 2;
      } else {
        sh = img.naturalWidth / canvasRatio;
        sy = (img.naturalHeight - sh) / 2;
      }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, fotoH);
    } else {
      // Placeholder si no hay foto
      ctx.fillStyle = '#2a1010';
      ctx.fillRect(0, 0, W, fotoH);
      ctx.fillStyle = 'rgba(201, 168, 76, 0.3)';
      ctx.font = 'bold 120px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚽', W / 2, fotoH / 2 + 40);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '36px sans-serif';
      ctx.fillText('Sube tu foto', W / 2, fotoH / 2 + 100);
    }

    // 3. GRADIENTE DE TRANSICIÓN foto → datos (120px de transición)
    const gradStart = Math.round(H * 0.55); // 594px
    const gradEnd = Math.round(H * 0.72);   // 778px
    const grad = ctx.createLinearGradient(0, gradStart, 0, gradEnd);
    grad.addColorStop(0, 'rgba(18, 6, 8, 0)');
    grad.addColorStop(1, 'rgba(18, 6, 8, 1)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, gradStart, W, gradEnd - gradStart);

    // 4. ZONA DE DATOS (30% inferior = 324px)
    const dataY = Math.round(H * 0.70); // 756px
    ctx.fillStyle = '#120608';
    ctx.fillRect(0, dataY, W, H - dataY);

    // 5. LÍNEA DECORATIVA DORADA
    ctx.strokeStyle = '#c9a84c';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(60, dataY + 30);
    ctx.lineTo(W - 60, dataY + 30);
    ctx.stroke();

    // 6. NOMBRE DEL USUARIO (grande, blanco, bold)
    const nombreCompleto = `${formData.nombre.toUpperCase()} ${formData.apellido.toUpperCase()}`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    // Auto-escalar fuente si el nombre es muy largo
    let fontSize = 72;
    const maxWidth = W - 120;
    ctx.font = `bold ${fontSize}px "Arial Black", system-ui, sans-serif`;
    while (ctx.measureText(nombreCompleto).width > maxWidth && fontSize > 36) {
      fontSize -= 4;
      ctx.font = `bold ${fontSize}px "Arial Black", system-ui, sans-serif`;
    }
    ctx.fillText(nombreCompleto, W / 2, dataY + 60);

    // 7. MUNICIPIO (dorado)
    ctx.fillStyle = '#c9a84c';
    ctx.font = 'bold 44px system-ui, sans-serif';
    ctx.fillText(formData.municipio.toUpperCase() || 'TU MUNICIPIO', W / 2, dataY + 130);

    // 8. SLOGAN
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '32px system-ui, sans-serif';
    ctx.fillText('SELECCIÓN GUERRERO · 2026', W / 2, dataY + 190);

    // 9. ESTRELLAS decorativas
    ctx.fillStyle = '#c9a84c';
    ctx.font = '34px system-ui, sans-serif';
    ctx.fillText('★  ★  ★  ★  ★', W / 2, dataY + 240);

    // 10. HASHTAG viral
    ctx.fillStyle = 'rgba(201, 168, 76, 0.75)';
    ctx.font = 'italic 26px system-ui, sans-serif';
    ctx.fillText('#GuerreroEsCone  #SelecciónGuerrero', W / 2, dataY + 290);

    // 11. Logo/Esquina (simulado con texto si no hay imagen)
    ctx.fillStyle = 'rgba(201, 168, 76, 0.8)';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('🏆 ESTHELA DAMIÁN', W - 40, H - 30);
  }, [formData, fotoUsuario]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CAMBIO 5: HOOKS Y RE-DIBUJAJO AUTOMÁTICO
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // FUNCIONES DE DESCARGA Y COMPARTIR
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const handleDownload = () => {
    if (!canvasRef.current) return;
    setIsGenerating(true);
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Titular_${formData.nombre || 'Esthela'}_1080x1080.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert('Error al generar la imagen. Inténtalo de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!canvasRef.current) return;
    try {
      const blob = await new Promise<Blob | null>(resolve => canvasRef.current?.toBlob(resolve, 'image/png'));
      if (!blob) return;
      const file = new File([blob], 'titular-guerrero.png', { type: 'image/png' });
      if (navigator.share) {
        await navigator.share({
          title: '¡Ya soy Titular de Selección Guerrero!',
          text: `${formData.nombre} ${formData.apellido} — Capitán de la Esperanza en ${formData.municipio}. #GuerreroEsCone`,
          files: [file]
        });
      } else {
        // Fallback para escritorio
        alert('En móvil, esta opción abrirá tu menú de compartir nativo. En PC, descárgala y súbelo directamente.');
      }
    } catch {
      // Usuario canceló el share
    }
  };

  const updateField = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // RENDERIZADO
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  return (
    <main className="min-h-screen bg-[#0f0508] text-white px-4 py-12 md:py-16">
      {/* Encabezado */}
      <div className="max-w-5xl mx-auto mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
          Generador Oficial <span className="text-[#c9a84c]">Titular</span>
        </h1>
        <p className="text-white/60 text-sm md:text-base max-w-xl mx-auto">
          Sube tu foto, llena tus datos y genera tu imagen viral lista para Facebook.
        </p>
      </div>

      {/* CAMBIO 2: LAYOUT RESPONSIVE (COLUMNA EN MÓVIL, 2 COL EN DESKTOP) */}
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl mx-auto">
        
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <div className="w-full md:w-1/2 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-lg font-bold mb-4 text-[#c9a84c]">Datos del Capitán</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nombre(s)"
                value={formData.nombre}
                onChange={updateField('nombre')}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a84c] transition-all"
              />
              <input
                type="text"
                placeholder="Apellido(s)"
                value={formData.apellido}
                onChange={updateField('apellido')}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a84c] transition-all"
              />
              <input
                type="text"
                placeholder="Municipio"
                value={formData.municipio}
                onChange={updateField('municipio')}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a84c] transition-all"
              />
            </div>

            {/* ÁREA DE UPLOAD */}
            <div 
              onClick={() => inputRef.current?.click()}
              className="mt-6 w-full flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 hover:border-[#c9a84c]/50 cursor-pointer transition-all"
            >
              {fotoPreviewURL ? (
                <div className="relative">
                  <img src={fotoPreviewURL} alt="Preview" className="w-24 h-24 rounded-full object-cover border-2 border-[#c9a84c]" />
                  <span className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">✓</span>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
                  <Camera className="w-10 h-10 text-white/40" />
                </div>
              )}
              <p className="text-white/80 font-medium text-sm">
                {fotoPreviewURL ? 'Toca para cambiar la foto' : 'Toma o sube una foto'}
              </p>
              {/* CAMBIO 1: TEXTO DE AYUDA VISIBLE SIEMPRE */}
              <p className="text-xs text-amber-400 mt-1 text-center">
                📱 Elige desde tu galería o toma una foto nueva
              </p>
            </div>

            {/* Input oculto */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFotoChange}
              className="hidden"
              ref={inputRef}
              id="foto-input"
            />
          </div>
        </div>

        {/* COLUMNA DERECHA: VISTA PREVIA + ACCIONES */}
        <div className="w-full md:w-1/2 space-y-6">
          {/* CAMBIO 3: VISTA PREVIA GRANDE Y CENTRADA */}
          <div className="w-full max-w-sm mx-auto mt-6 md:mt-0">
            <canvas
              ref={canvasRef}
              width={1080}
              height={1080}
              className="w-full rounded-2xl shadow-2xl border-2 border-[#c9a84c]/40"
              style={{ aspectRatio: '1/1' }}
            />
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="w-full max-w-sm mx-auto space-y-3">
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 bg-[#c9a84c] text-[#0f0508] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5" />
              {isGenerating ? 'Generando...' : 'Descargar 1080x1080'}
            </button>
            
            <button
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 bg-white/10 border border-white/20 hover:bg-white/15"
            >
              <Share2 className="w-5 h-5" />
              Compartir en Redes
            </button>
          </div>

          <p className="text-center text-white/40 text-xs max-w-sm mx-auto">
            💡 Descarga la imagen y compártela en Facebook/WhatsApp etiquetando a <span className="text-[#c9a84c]">@EsthelaDamiánGuerrero</span>
          </p>
        </div>
      </div>
    </main>
  );
}