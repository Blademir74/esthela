"use client";
import { useEffect, useRef, useState } from 'react';

export default function SignaturePad({ onChange }: { onChange: (firma: string | null) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const c = canvasRef.current!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = c.getBoundingClientRect();
    c.width = rect.width * dpr;
    c.height = 200 * dpr;
    const ctx = c.getContext('2d')!;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#F5EFE0';
    ctx.fillRect(0, 0, rect.width, 200);
    ctx.strokeStyle = 'rgba(107, 29, 58, 0.2)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(20, 150);
    ctx.lineTo(rect.width - 20, 150);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = '#14050B';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getPos = (e: React.PointerEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const startDraw = (e: React.PointerEvent) => {
    drawing.current = true;
    canvasRef.current!.setPointerCapture(e.pointerId);
    const ctx = canvasRef.current!.getContext('2d')!;
    const p = getPos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };

  const draw = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext('2d')!;
    const p = getPos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    setHasSignature(true);
  };

  const endDraw = () => {
    if (!drawing.current) return;
    drawing.current = false;
    onChange(canvasRef.current!.toDataURL('image/png'));
  };

  const clear = () => {
    const c = canvasRef.current!;
    const ctx = c.getContext('2d')!;
    const rect = c.getBoundingClientRect();
    ctx.fillStyle = '#F5EFE0';
    ctx.fillRect(0, 0, rect.width, 200);
    ctx.strokeStyle = 'rgba(107, 29, 58, 0.2)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(20, 150);
    ctx.lineTo(rect.width - 20, 150);
    ctx.stroke();
    ctx.setLineDash([]);
    setHasSignature(false);
    onChange(null);
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-[#D4A843]/80 mb-1.5 tracking-wider uppercase">
        Firma Digital (traza con el dedo o mouse)
      </label>
      <canvas
        ref={canvasRef}
        className="w-full border border-[#D4A843]/30 rounded-xl cursor-crosshair"
        style={{ height: 200, touchAction: 'none' }}
        onPointerDown={startDraw}
        onPointerMove={draw}
        onPointerUp={endDraw}
        onPointerLeave={endDraw}
      />
      {hasSignature && (
        <button type="button" onClick={clear}
          className="mt-2 px-4 py-2 rounded-full text-xs font-bold border border-white/20 text-white/60 hover:border-[#D4A843]/40 hover:text-[#D4A843] transition-all">
          Borrar firma
        </button>
      )}
    </div>
  );
}