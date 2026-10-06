// components/firmas/BadgeConsulta.tsx  (tarjeta solemne tipo acta)
'use client';
import { useEffect, useState } from 'react';
import type { FirmaPayload } from '@/lib/consulta-data';

export default function BadgeConsulta({ data, onClose }: { data: FirmaPayload; onClose: () => void }) {
  const [png, setPng] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      const c = document.createElement('canvas'); c.width = 1080; c.height = 1350;
      const x = c.getContext('2d')!;
      // fondo crema envejecido tipo acta
      x.fillStyle = '#F5EFE0'; x.fillRect(0, 0, 1080, 1350);
      // franja guinda superior
      x.fillStyle = '#691C32'; x.fillRect(0, 0, 1080, 180);
      x.fillStyle = '#D4AF37'; x.font = 'bold 28px Georgia, serif';
      x.textAlign = 'center'; x.fillText('CONSULTA CIUDADANA · GUERRERO 2026', 540, 90);
      x.font = 'bold 56px Georgia, serif';
      x.fillStyle = '#F5EFE0'; x.fillText('EL PUEBLO ES EL ÚNICO QUE MANDA', 540, 145);
      // sello dorado
      x.strokeStyle = '#D4AF37'; x.lineWidth = 4; x.beginPath();
      x.arc(540, 380, 130, 0, Math.PI * 2); x.stroke();
      x.fillStyle = '#691C32'; x.font = 'bold 42px Georgia, serif';
      x.fillText('FIRMA', 540, 370); x.fillText('VÁLIDA', 540, 415);
      x.font = '22px Georgia'; x.fillText(data.registro_id, 540, 450);
      // texto ciudadano
      x.fillStyle = '#0D0E12'; x.font = 'bold 40px Georgia, serif';
      let y = 620;
      const wrap = (txt: string, xx: number, yy: number, mw: number, lh: number) => {
        const ws = txt.split(' '); let ln = '';
        for (const w of ws) {
          const t = ln + w + ' ';
          if (x.measureText(t).width > mw && ln) { x.fillText(ln.trim(), xx, yy); ln = w + ' '; yy += lh; }
          else ln = t;
        }
        x.fillText(ln.trim(), xx, yy); return yy + lh;
      };
      y = wrap(`Mi firma ya cuenta en la Consulta por la Transparencia en Guerrero.`, 540, y, 900, 50);
      x.fillStyle = '#691C32'; x.font = 'bold 36px Georgia, serif';
      y = wrap(`Exijo transparencia y respeto a la voluntad popular.`, 540, y + 20, 900, 46);
      x.fillStyle = '#0D0E12'; x.font = '28px Georgia';
      y = wrap(`"${data.analisis_inconformidad_nlp.texto_original}"`, 540, y + 40, 920, 38);
      x.font = 'bold 30px Georgia'; x.fillStyle = '#691C32';
      x.fillText(`— ${data.usuario.nombre}`, 540, y + 50);
      x.font = '24px Georgia'; x.fillStyle = '#0D0E12';
      x.fillText(`${data.usuario.municipio} · ${data.fecha_hora.slice(0, 10)}`, 540, y + 90);
      x.font = 'bold 32px Georgia'; x.fillStyle = '#D4AF37';
      x.fillText('#PorlosCaminosdelSur', 540, 1280);
      setPng(c.toDataURL('image/png'));
    })();
    document.body.style.overflow = 'hidden';
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [data, onClose]);

  const txt = encodeURIComponent(`✅ Mi firma ya cuenta en la Consulta por la Transparencia en Guerrero. Folio: ${data.registro_id}. ¡El pueblo es el único que manda! #PorlosCaminosdelSur`);
  return (
    <div className="consulta-modal" onClick={onClose}>
      <div className="consulta-modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display text-2xl text-[#D4AF37]">📜 Acta Ciudadana Registrada</h3>
        <p className="text-sm text-white/70">Folio: <strong className="text-[#D4AF37]">{data.registro_id}</strong></p>
        {png && <img src={png} alt="Acta de firma" className="consulta-badge-img" />}
        <div className="mt-4 grid gap-3">
          <a className="consulta-cta justify-center" href={`https://wa.me/?text=${txt}`} target="_blank" rel="noopener">
            📲 Compartir en mi Estado de WhatsApp
          </a>
          {png && <a className="consulta-ghost justify-center" href={png} download={`acta-${data.registro_id}.png`}>⬇️ Descargar Acta</a>}
          <button className="consulta-ghost justify-center" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}