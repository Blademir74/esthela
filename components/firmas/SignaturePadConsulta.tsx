'use client';
import { useEffect, useRef, useState } from 'react';

export default function SignaturePadConsulta({ onChange }: { onChange: (d: string | null) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const c = ref.current!;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = c.getBoundingClientRect().width;
    c.width = w * dpr;
    c.height = 180 * dpr;
    const ctx = c.getContext('2d')!;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#F5EFE0';
    ctx.fillRect(0, 0, w, 180);
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(20, 140);
    ctx.lineTo(w - 20, 140);
    ctx.stroke();
    ctx.setLineDash([]);
  }, []);

  const p = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const down = (e: React.PointerEvent) => {
    drawing.current = true;
    ref.current!.setPointerCapture(e.pointerId);
    const ctx = ref.current!.getContext('2d')!;
    const pt = p(e);
    ctx.beginPath();
    ctx.moveTo(pt.x, pt.y);
  };

  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const ctx = ref.current!.getContext('2d')!;
    const pt = p(e);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
    setOk(true);
  };

  const up = () => {
    if (!drawing.current) return;
    drawing.current = false;
    onChange(ref.current!.toDataURL('image/png'));
  };

  const clear = () => {
    const c = ref.current!;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#F5EFE0';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(20, 140);
    ctx.lineTo(c.getBoundingClientRect().width - 20, 140);
    ctx.stroke();
    ctx.setLineDash([]);
    setOk(false);
    onChange(null);
  };

  return (
    <div>
      <label className="consulta-label">Firma Digital (traza con el dedo o mouse)</label>
      <canvas
        ref={ref}
        className="consulta-canvas"
        style={{ height: 180, touchAction: 'none' }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerLeave={up}
      />
      {ok && (
        <button type="button" onClick={clear} className="consulta-ghost mt-2">
          Borrar firma
        </button>
      )}
    </div>
  );
}