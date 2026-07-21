'use client';

import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';

export default function ShareCard() {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [nombre, setNombre] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleShare = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#691C32',
        width: 1080,
        height: 1920,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const file = new File([blob], 'esthela-guerrero.png', {
          type: 'image/png',
        });

        // Intentar usar Web Share API (soporte nativo en móviles)
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Yo soy promotor de la Esperanza en Guerrero',
            text: 'Yo, ' + (nombre || 'un guerrerense') + ', soy promotor de la Esperanza en Guerrero.',
            files: [file],
          });
        } else {
          // Fallback: descarga automática
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'esthela-guerrero.png';
          a.click();
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    } catch (err) {
      console.error('Error al generar imagen:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* ── INPUT DEL NOMBRE ── */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white">
          Tu nombre
        </label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej. Juan Pérez"
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#BC955C] transition-all"
        />
      </div>

      {/* ── TARJETA 1080x1920 — Formato Story WhatsApp ── */}
      {/* Escalada visualmente con transform para que quepa en pantalla */}
      <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl border border-white/10">
        <div
          className="origin-top-left"
          style={{
            transform: 'scale(0.3)',
            transformOrigin: 'top left',
            width: '333.33%',
            paddingBottom: '592.59%', // 1920/1080 * 100%
          }}
        >
          <div
            ref={cardRef}
            className="absolute inset-0 flex flex-col items-center"
            style={{
              width: '1080px',
              height: '1920px',
              backgroundColor: '#691C32',
              overflow: 'hidden',
            }}
          >
            {/* ── HEADER DECORATIVO ── */}
            <div className="w-full h-16 bg-gradient-to-r from-[#BC955C]/20 via-transparent to-[#BC955C]/20" />

            {/* ── FOTO DE ESTHELA ── */}
            <div className="w-full flex-1 flex items-center justify-center relative">
              <img
                src="/assets/img/esthela3.png"
                alt="Esthela Damián"
                className="w-full h-full object-cover"
                style={{ objectFit: 'cover' }}
              />
              {/* Overlay gradiente en la parte inferior */}
              <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#691C32] to-transparent" />
            </div>

            {/* ── TEXTO DORADO PRINCIPAL ── */}
            <div className="w-full px-12 py-8 text-center">
              <p
                className="text-[#BC955C] font-serif text-5xl font-bold leading-tight"
                style={{
                  fontFamily: 'Playfair Display, Georgia, serif',
                }}
              >
                Forjada desde joven
                <br />
                en el trabajo comunitario
              </p>
            </div>

            {/* ── NOMBRE DEL PROMOTOR ── */}
            <div className="w-full px-12 py-6 text-center flex-1 flex items-center justify-center">
              <p className="text-white text-3xl font-medium">
                Yo,{' '}
                <span className="font-bold text-[#BC955C]">
                  {nombre || '____________'}
                </span>
                , soy promotor de la Esperanza en Guerrero
              </p>
            </div>

            {/* ── FOOTER DECORATIVO ── */}
            <div className="w-full px-12 py-6 flex items-center justify-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#BC955C]/30 flex items-center justify-center">
                <span className="text-[#BC955C] text-xs font-bold">E</span>
              </div>
              <p className="text-white/60 text-lg tracking-wider">
                COORDINACIÓN TERRITORIAL GUERRERO
              </p>
            </div>
            <div className="w-full h-12 bg-gradient-to-t from-[#BC955C]/30 to-transparent" />
          </div>
        </div>
      </div>

      {/* ── BOTÓN COMPARTIR ── */}
      <button
        onClick={handleShare}
        disabled={isGenerating}
        className="w-full inline-flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#1ebc57] text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {isGenerating ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>Generando imagen...</span>
          </>
        ) : (
          <>
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            <span>Compartir en WhatsApp</span>
          </>
        )}
      </button>
    </div>
  );
}
