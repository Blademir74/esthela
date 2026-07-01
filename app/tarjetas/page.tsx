'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share2, Camera, Check, Trophy, Sparkles, ZoomIn, Move, RefreshCw } from 'lucide-react';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['800'] });

type ModeloType = 'soberania' | 'voz-pueblo' | 'unidad';

// ─────────────────────────────────────────────────────────────────
// UTILS: CRC32 + PNG DPI INJECTOR (300 DPI = 11811 pixels/meter)
// ─────────────────────────────────────────────────────────────────
const crcTable: number[] = [];
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[i] = c;
}
function calculateCrc(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) crc = crcTable[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

const inject300Dpi = (base64Png: string): string => {
  try {
    const parts = base64Png.split(',');
    const mime = parts[0];
    const binary = atob(parts[1]);
    const originalBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) originalBytes[i] = binary.charCodeAt(i);

    const chunkData = new Uint8Array([
      112, 72, 89, 115,                  // 'pHYs'
      0, 0, 46, 35,                       // X: 11811 = 0x2E23
      0, 0, 46, 35,                       // Y: 11811 = 0x2E23
      1,                                  // unit: meters
    ]);
    const crcVal = calculateCrc(chunkData);
    const pHYsChunk = new Uint8Array(17);
    pHYsChunk[0] = 0; pHYsChunk[1] = 0; pHYsChunk[2] = 0; pHYsChunk[3] = 9;
    pHYsChunk.set(chunkData, 4);
    pHYsChunk[13] = (crcVal >>> 24) & 0xff;
    pHYsChunk[14] = (crcVal >>> 16) & 0xff;
    pHYsChunk[15] = (crcVal >>> 8) & 0xff;
    pHYsChunk[16] = crcVal & 0xff;

    // IHDR always ends at byte 33 — insert pHYs immediately after
    const newBytes = new Uint8Array(originalBytes.length + 17);
    newBytes.set(originalBytes.subarray(0, 33), 0);
    newBytes.set(pHYsChunk, 33);
    newBytes.set(originalBytes.subarray(33), 50);

    let newBinary = '';
    const chunkSize = 8192;
    for (let i = 0; i < newBytes.length; i += chunkSize)
      newBinary += String.fromCharCode.apply(null, Array.from(newBytes.subarray(i, i + chunkSize)));
    return mime + ',' + btoa(newBinary);
  } catch (err) {
    console.error('Error al inyectar DPI', err);
    return base64Png;
  }
};

// ─────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────
export default function TarjetasPage() {
  const [modelo, setModelo] = useState<ModeloType>('unidad');
  const [nombre, setNombre] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [gentilicio, setGentilicio] = useState('');
  const [isGentilicioManual, setIsGentilicioManual] = useState(false);
  const [paisaje, setPaisaje] = useState<'sierra' | 'mar'>('sierra');

  // Foto del usuario
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [fotoImg, setFotoImg] = useState<HTMLImageElement | null>(null);
  const [userZoom, setUserZoom] = useState(1.0);
  const [userPanX, setUserPanX] = useState(0);
  const [userPanY, setUserPanY] = useState(0);

  // CAMBIO 2 — Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Imágenes de campaña
  const [esthelaImg, setEsthelaImg] = useState<HTMLImageElement | null>(null);
  const [landscapeImg, setLandscapeImg] = useState<HTMLImageElement | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [ready, setReady] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // ── 1. Cargar activos iniciales con fallback robusto ──────────
  useEffect(() => {
    const imgE = new Image();
    imgE.crossOrigin = 'anonymous';
    imgE.src = '/assets/img/esthela4.png';
    imgE.onload = () => setEsthelaImg(imgE);
    imgE.onerror = () => {
      console.warn('No se pudo cargar esthela4.png, intentando perfil.png…');
      const backup = new Image();
      backup.crossOrigin = 'anonymous';
      backup.src = '/assets/img/perfil.png';
      backup.onload = () => setEsthelaImg(backup);
    };

    const imgL = new Image();
    imgL.crossOrigin = 'anonymous';
    imgL.src = '/assets/img/por los caminos del sur.png';
    imgL.onload = () => setLandscapeImg(imgL);

    fetch('https://raw.githubusercontent.com/PhantomInsights/mexico-geojson/main/2023/states/Guerrero.json')
      .then(res => res.json())
      .then(data => setGeoJsonData(data))
      .catch(err => console.error('Error al cargar GeoJSON de Guerrero', err));
  }, []);

  useEffect(() => {
    if (esthelaImg) setReady(true);
  }, [esthelaImg]);

  // ── 2. Auto-derivar Gentilicio ─────────────────────────────
  useEffect(() => {
    if (isGentilicioManual) return;
    const mun = municipio.trim().toLowerCase();
    if (!mun) { setGentilicio(''); return; }
    if (mun.includes('acapulco'))          setGentilicio('Acapulqueño');
    else if (mun.includes('chilpancingo')) setGentilicio('Chilpancingueño');
    else if (mun.includes('iguala'))       setGentilicio('Igualense');
    else if (mun.includes('taxco'))        setGentilicio('Taxqueño');
    else if (mun.includes('zihuatanejo'))  setGentilicio('Zihuatanejense');
    else if (mun.includes('chilapa'))      setGentilicio('Chilapeo');
    else if (mun.includes('tixtla'))       setGentilicio('Tixtleco');
    else if (mun.includes('ometepec'))     setGentilicio('Ometepequense');
    else setGentilicio('Guerrerense');
  }, [municipio, isGentilicioManual]);

  // Toast auto-dismiss (4 s)
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // ── Manejo de foto de usuario ──────────────────────────────
  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFotoUrl(url);
    const img = new Image();
    img.onload = () => setFotoImg(img);
    setUserZoom(1.0);
    setUserPanX(0);
    setUserPanY(0);
    img.src = url;
  };

  const handleResetAjustes = () => {
    setUserZoom(1.0);
    setUserPanX(0);
    setUserPanY(0);
  };

  // ─────────────────────────────────────────────────────────────
  // MOTORES DE RENDERIZADO EN CANVAS
  // ─────────────────────────────────────────────────────────────

  // Fondo de Papel Artesanal Guerrerense
  const drawPaperTexture = (ctx: CanvasRenderingContext2D, W: number, H: number) => {
    ctx.fillStyle = '#FAF6EE';
    ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 6000; i++) {
      const x = Math.random() * W;
      const y = Math.random() * H;
      const r = Math.random() * 1.5 + 0.4;
      ctx.fillStyle = `rgba(139, 90, 43, ${Math.random() * 0.04 + 0.01})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = 'rgba(139, 90, 43, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 180; i++) {
      ctx.beginPath();
      const x = Math.random() * W;
      const y = Math.random() * H;
      const len = Math.random() * 20 + 8;
      const angle = Math.random() * Math.PI * 2;
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(
        x + Math.cos(angle) * len * 0.5 + (Math.random() - 0.5) * 4,
        y + Math.sin(angle) * len * 0.5 + (Math.random() - 0.5) * 4,
        x + Math.cos(angle) * len,
        y + Math.sin(angle) * len
      );
      ctx.stroke();
    }
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, 'rgba(255,255,255,0.25)');
    grad.addColorStop(0.5, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.08)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  };

  // Guerrero en relieve dorado 3D (GeoJSON)
  const drawGuerreroRelief = (ctx: CanvasRenderingContext2D, W: number, H: number) => {
    if (!geoJsonData) return;
    let minLon = Infinity, maxLon = -Infinity;
    let minLat = Infinity, maxLat = -Infinity;
    geoJsonData.features.forEach((feature: any) => {
      const processCoords = (coords: number[][]) => {
        coords.forEach(([lon, lat]) => {
          if (lon < minLon) minLon = lon;
          if (lon > maxLon) maxLon = lon;
          if (lat < minLat) minLat = lat;
          if (lat > maxLat) maxLat = lat;
        });
      };
      if (feature.geometry.type === 'Polygon')
        feature.geometry.coordinates.forEach(processCoords);
      else if (feature.geometry.type === 'MultiPolygon')
        feature.geometry.coordinates.forEach((poly: any) => poly.forEach(processCoords));
    });
    const boxW = 850, boxH = 550;
    const boxX = (W - boxW) / 2;
    const boxY = H * 0.22;
    const project = (lon: number, lat: number) => ({
      x: boxX + ((lon - minLon) / (maxLon - minLon)) * boxW,
      y: boxY + (1 - (lat - minLat) / (maxLat - minLat)) * boxH,
    });
    const drawMapPath = () => {
      ctx.beginPath();
      geoJsonData.features.forEach((feature: any) => {
        const drawPolygon = (polygon: number[][]) => {
          polygon.forEach(([lon, lat], idx) => {
            const { x: px, y: py } = project(lon, lat);
            if (idx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.closePath();
        };
        if (feature.geometry.type === 'Polygon')
          feature.geometry.coordinates.forEach(drawPolygon);
        else if (feature.geometry.type === 'MultiPolygon')
          feature.geometry.coordinates.forEach((poly: any) => poly.forEach(drawPolygon));
      });
    };
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.18)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetX = 16;
    ctx.shadowOffsetY = 28;
    drawMapPath();
    ctx.fillStyle = 'rgba(20,10,12,0.25)';
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    const extrusionDepth = 10;
    ctx.fillStyle = '#8A6417';
    for (let i = 1; i < extrusionDepth; i++) {
      ctx.save();
      ctx.translate(i * 0.8, i * 1.2);
      drawMapPath();
      ctx.fill();
      ctx.restore();
    }
    ctx.save();
    drawMapPath();
    const goldGrad = ctx.createLinearGradient(boxX, boxY, boxX + boxW, boxY + boxH);
    goldGrad.addColorStop(0, '#FFEFA6');
    goldGrad.addColorStop(0.4, '#D4A843');
    goldGrad.addColorStop(0.7, '#9F7A26');
    goldGrad.addColorStop(1, '#D4A843');
    ctx.fillStyle = goldGrad;
    ctx.fill();
    ctx.strokeStyle = '#FFEFA6';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
    ctx.restore();
  };

  // Glassmorphism premium panel
  const drawGlassPanel = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    ctx.save();
    const glassBg = ctx.createLinearGradient(x, y, x + w, y + h);
    glassBg.addColorStop(0, 'rgba(255,255,255,0.12)');
    glassBg.addColorStop(1, 'rgba(255,255,255,0.02)');
    ctx.shadowColor = 'rgba(0,0,0,0.28)';
    ctx.shadowBlur = 35;
    ctx.shadowOffsetX = 12;
    ctx.shadowOffsetY = 24;
    ctx.fillStyle = glassBg;
    ctx.beginPath();
    (ctx as any).roundRect(x, y, w, h, r);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    const borderGrad = ctx.createLinearGradient(x, y, x + w, y + h);
    borderGrad.addColorStop(0, 'rgba(255,255,255,0.45)');
    borderGrad.addColorStop(0.25, 'rgba(255,255,255,0.1)');
    borderGrad.addColorStop(0.75, 'rgba(212,168,67,0.25)');
    borderGrad.addColorStop(1, 'rgba(255,255,255,0.45)');
    ctx.strokeStyle = borderGrad;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.save();
    ctx.beginPath();
    (ctx as any).roundRect(x, y, w, h, r);
    ctx.clip();
    const glossGrad = ctx.createLinearGradient(x - w, y, x + w, y + h);
    glossGrad.addColorStop(0, 'rgba(255,255,255,0)');
    glossGrad.addColorStop(0.48, 'rgba(255,255,255,0)');
    glossGrad.addColorStop(0.5, 'rgba(255,255,255,0.08)');
    glossGrad.addColorStop(0.52, 'rgba(255,255,255,0.16)');
    glossGrad.addColorStop(0.54, 'rgba(255,255,255,0.08)');
    glossGrad.addColorStop(0.56, 'rgba(255,255,255,0)');
    glossGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = glossGrad;
    ctx.fillRect(x, y, w, h);
    ctx.restore();
    ctx.restore();
  };

  // Sello 3D Metalizado
  const drawMetallicSeal = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) => {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetX = 8;
    ctx.shadowOffsetY = 12;
    const metallicGrad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
    metallicGrad.addColorStop(0, '#FFEFA6');
    metallicGrad.addColorStop(0.3, '#E3BC61');
    metallicGrad.addColorStop(0.65, '#9E7623');
    metallicGrad.addColorStop(0.85, '#FCE794');
    metallicGrad.addColorStop(1, '#7D5A12');
    ctx.fillStyle = metallicGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#7D5A12';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#3D0A1F';
    ctx.font = "800 12px 'Montserrat', system-ui, sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ASPIRANTE', cx, cy - 13);
    ctx.fillText('REGISTRADA', cx, cy + 1);
    ctx.font = "800 10px 'Montserrat', system-ui, sans-serif";
    ctx.fillStyle = '#6B1D3A';
    ctx.fillText('MORENA GUERRERO', cx, cy + 15);
    ctx.fillStyle = '#D4A843';
    ctx.font = '14px system-ui, sans-serif';
    ctx.fillText('★', cx, cy + 27);
    ctx.restore();
  };

  // ─────────────────────────────────────────────────────────────
  // CAMBIO 4 — TIPOGRAFÍAS PREMIUM "TARJETA DE DISEÑADOR"
  // ─────────────────────────────────────────────────────────────

  // NOMBRE DEL CIUDADANO — Grande, impactante
  const drawCitizenName = (
    ctx: CanvasRenderingContext2D, text: string, x: number, y: number,
    color = '#FFFFFF', align: CanvasTextAlign = 'center'
  ) => {
    ctx.save();
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.font = "bold 28px 'Playfair Display', 'Georgia', serif";
    try { (ctx as any).letterSpacing = '2px'; } catch (e) {}
    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    ctx.fillText(text, x + 1.5, y + 1.5);
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.restore();
  };

  // MUNICIPIO / GENTILICIO — Elegante, secundario
  const drawLocationText = (
    ctx: CanvasRenderingContext2D, text: string, x: number, y: number,
    color = '#C9A84C', align: CanvasTextAlign = 'center'
  ) => {
    ctx.save();
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.font = "300 16px 'Montserrat', 'Arial', sans-serif";
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillText(text, x + 1, y + 1);
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.restore();
  };

  // LEMA — Itálica, emocional
  const drawLemaText = (
    ctx: CanvasRenderingContext2D, text: string, x: number, y: number,
    color = '#FFFFFF', align: CanvasTextAlign = 'center'
  ) => {
    ctx.save();
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.font = "italic 600 18px 'Playfair Display', serif";
    ctx.fillStyle = color;
    const lines = text.split('\n');
    const lineHeight = 26;
    lines.forEach((line, index) => {
      const ly = y + index * lineHeight;
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillText(line, x + 1.5, ly + 1.5);
      ctx.fillStyle = color;
      ctx.fillText(line, x, ly);
    });
    ctx.restore();
  };

  // TEXTO PEQUEÑO — Limpio, moderno
  const drawSmallText = (
    ctx: CanvasRenderingContext2D, text: string, x: number, y: number,
    color = 'rgba(255,255,255,0.85)', align: CanvasTextAlign = 'center'
  ) => {
    ctx.save();
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.font = "400 12px 'Montserrat', sans-serif";
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillText(text, x + 0.8, y + 0.8);
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.restore();
  };

  // ─────────────────────────────────────────────────────────────
  // CAMBIO 3 — FUSIÓN REAL DE FOTO EN CANVAS (BUG CRÍTICO)
  // ─────────────────────────────────────────────────────────────

  // Foto de Esthela Damián
  const drawEsthelaPhoto = (
    ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number
  ): Promise<void> =>
    new Promise(resolve => {
      if (!esthelaImg) { resolve(); return; }
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.22)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 6;
      ctx.shadowOffsetY = 14;
      ctx.beginPath();
      (ctx as any).roundRect(x, y, w, h, r);
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.clip();
      const imgRatio = esthelaImg.naturalWidth / esthelaImg.naturalHeight;
      const boxRatio = w / h;
      let sx = 0, sy = 0, sw = esthelaImg.naturalWidth, sh = esthelaImg.naturalHeight;
      if (imgRatio > boxRatio) { sw = esthelaImg.naturalHeight * boxRatio; sx = (esthelaImg.naturalWidth - sw) / 2; }
      else { sh = esthelaImg.naturalWidth / boxRatio; sy = (esthelaImg.naturalHeight - sh) / 2; }
      ctx.drawImage(esthelaImg, sx, sy + sh * 0.1, sw, sh * 0.9, x, y, w, h);
      const gradient = ctx.createLinearGradient(x, y, x + w, y + h);
      gradient.addColorStop(0, 'rgba(139,20,20,0.15)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.25)');
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();
      ctx.strokeStyle = 'rgba(212,168,67,0.35)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      (ctx as any).roundRect(x, y, w, h, r);
      ctx.stroke();
      resolve();
    });

  // CAMBIO 3 — Foto del usuario con zoom/pan + cover fit + overlay 3D
  const drawUserPhoto = (
    ctx: CanvasRenderingContext2D, imgSrc: string | null,
    x: number, y: number, w: number, h: number, r: number
  ): Promise<void> =>
    new Promise(resolve => {
      if (!imgSrc) {
        ctx.save();
        ctx.beginPath();
        (ctx as any).roundRect(x, y, w, h, r);
        ctx.clip();
        const grad = ctx.createLinearGradient(x, y, x + w, y + h);
        grad.addColorStop(0, 'rgba(255,255,255,0.05)');
        grad.addColorStop(1, 'rgba(255,255,255,0.01)');
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.font = "400 12px 'Montserrat', sans-serif";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SUBE TU FOTOGRAFÍA', x + w / 2, y + h / 2 - 10);
        ctx.font = "500 11px system-ui, sans-serif";
        ctx.fillStyle = 'rgba(212,168,67,0.5)';
        ctx.fillText('Para crear la dupla ganadora', x + w / 2, y + h / 2 + 12);
        ctx.restore();
        ctx.strokeStyle = 'rgba(212,168,67,0.35)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        (ctx as any).roundRect(x, y, w, h, r);
        ctx.stroke();
        resolve();
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.save();
        // Clip con esquinas redondeadas — look premium
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.clip();

        // Cover fit + zoom + pan del usuario
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const boxRatio = w / h;
        let drawW = w, drawH = h;
        if (imgRatio > boxRatio) drawH = w / imgRatio;
        else drawW = h * imgRatio;
        drawW *= userZoom;
        drawH *= userZoom;
        const drawX = x + (w - drawW) / 2 + userPanX;
        const drawY = y + (h - drawH) / 2 + userPanY;
        ctx.drawImage(img, drawX, drawY, drawW, drawH);

        // Overlay de integración: gradiente sutil para fusión 3D
        const gradient = ctx.createLinearGradient(x, y, x + w, y + h);
        gradient.addColorStop(0, 'rgba(139,20,20,0.15)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.25)');
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.restore();

        ctx.strokeStyle = 'rgba(212,168,67,0.35)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        (ctx as any).roundRect(x, y, w, h, r);
        ctx.stroke();
        resolve();
      };
      img.onerror = () => resolve(); // fail silently
      img.src = imgSrc;
    });

  // ─────────────────────────────────────────────────────────────
  // RENDERS DE MODELOS COMPLETOS (ASÍNCRONOS)
  // ─────────────────────────────────────────────────────────────

  const drawModelSoberania = async (ctx: CanvasRenderingContext2D, W: number, H: number) => {
    if (landscapeImg) {
      ctx.drawImage(landscapeImg, 0, 0, W, H);
      ctx.fillStyle = 'rgba(11,5,8,0.72)';
      ctx.fillRect(0, 0, W, H);
    } else {
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, '#1A0F12');
      bg.addColorStop(1, '#0B0508');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
    }
    drawGuerreroRelief(ctx, W, H);
    drawGlassPanel(ctx, 60, 60, W - 120, H - 120, 36);
    await drawEsthelaPhoto(ctx, 110, 160, 400, 520, 24);
    await drawUserPhoto(ctx, fotoUrl, W - 510, 160, 400, 520, 24);
    // CAMBIO 1 — Nombres SOLO en canvas (sin labels JSX duplicados)
    drawCitizenName(ctx, 'ESTHELA DAMIÁN', 310, 120);
    drawCitizenName(ctx, nombre ? nombre.toUpperCase() : 'TÚ', W - 310, 120, '#D4A843');
    drawMetallicSeal(ctx, W - 140, H - 140, 68);
    drawCitizenName(ctx, 'SOBERANÍA Y TERRITORIO', W / 2, 720);
    drawLemaText(ctx, 'La soberanía se defiende\ncon el pueblo. es la respuesta.', W / 2, 770, '#D4A843');
    const mun = municipio ? municipio.toUpperCase() : 'GUERRERO';
    drawLocationText(ctx, `SOY ${nombre ? nombre.toUpperCase() : 'CIUDADANO'} DE ${mun}`, W / 2, 870, '#FFFFFF');
    drawSmallText(ctx, 'ESTHELA VA EN MI ENCUESTA POR LA RESPUESTA DE GUERRERO', W / 2, 935);
  };

  const drawModelVozPueblo = async (ctx: CanvasRenderingContext2D, W: number, H: number) => {
    const bg = ctx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, 800);
    bg.addColorStop(0, '#4F0D23');
    bg.addColorStop(1, '#170208');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(212,168,67,0.04)';
    ctx.lineWidth = 2;
    for (let i = -W; i < W; i += 60) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + W, H);
      ctx.stroke();
    }
    ctx.save();
    ctx.globalAlpha = 0.5;
    drawGuerreroRelief(ctx, W, H);
    ctx.restore();
    drawGlassPanel(ctx, 60, 60, W - 120, H - 120, 36);
    await drawEsthelaPhoto(ctx, 110, 160, 400, 520, 24);
    await drawUserPhoto(ctx, fotoUrl, W - 510, 160, 400, 520, 24);
    drawCitizenName(ctx, 'ESTHELA DAMIÁN', 310, 120);
    drawCitizenName(ctx, nombre ? nombre.toUpperCase() : 'TÚ', W - 310, 120, '#D4A843');
    drawMetallicSeal(ctx, W - 140, H - 140, 68);
    drawCitizenName(ctx, 'VOZ DEL PUEBLO', W / 2, 720);
    const textLema = `Soy ${nombre || 'un ciudadano'} de ${municipio || 'Guerrero'}\ny Esthela va mi encuesta por la justicia social.`;
    drawLemaText(ctx, textLema, W / 2, 770, '#D4A843');
    drawSmallText(ctx, 'MORENA — LA ESPERANZA DE GUERRERO', W / 2, 915, '#FFFFFF');
  };

  const drawModelUnidad = async (ctx: CanvasRenderingContext2D, W: number, H: number) => {
    drawPaperTexture(ctx, W, H);
    drawGuerreroRelief(ctx, W, H);
    drawGlassPanel(ctx, 60, 60, W - 120, H - 120, 36);
    await drawEsthelaPhoto(ctx, 110, 160, 400, 520, 24);
    await drawUserPhoto(ctx, fotoUrl, W - 510, 160, 400, 520, 24);
    drawCitizenName(ctx, 'ESTHELA DAMIÁN', 310, 120, '#3D0A1F');
    drawCitizenName(ctx, nombre ? nombre.toUpperCase() : 'TÚ', W - 310, 120, '#8A6417');
    drawMetallicSeal(ctx, W - 140, H - 140, 68);
    drawCitizenName(ctx, 'UNIDAD Y ESPERANZA', W / 2, 720, '#3D0A1F');
    drawLemaText(ctx, 'Con el pueblo todo, sin el pueblo nada.', W / 2, 770, '#8A6417');
    drawLocationText(ctx, `Soy ${nombre || 'ciudadano'}, orgullosamente ${gentilicio || 'Guerrerense'}.`, W / 2, 860, '#3D0A1F');
    drawSmallText(ctx, 'Esthela va en mi encuesta por la esperanza de Guerrero.', W / 2, 900, 'rgba(61,10,31,0.85)');
  };

  // ── Redibujar canvas al cambiar datos ─────────────────────────
  useEffect(() => {
    if (!canvasRef.current || !ready) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const W = 1080, H = 1080;
    const drawCard = async () => {
      // CAMBIO 4 — Esperar fuentes personalizadas antes de dibujar
      try { await document.fonts.ready; } catch (e) { console.warn('Error esperando fuentes en canvas', e); }
      ctx.clearRect(0, 0, W, H);
      if (modelo === 'soberania') await drawModelSoberania(ctx, W, H);
      else if (modelo === 'voz-pueblo') await drawModelVozPueblo(ctx, W, H);
      else await drawModelUnidad(ctx, W, H);
    };
    drawCard();
  }, [modelo, ready, fotoUrl, nombre, municipio, gentilicio, paisaje, userZoom, userPanX, userPanY, geoJsonData, esthelaImg, landscapeImg]);

  // ── Descarga y Compartir ──────────────────────────────────────
  const handleDownload = () => {
    if (!canvasRef.current) return;
    const rawDataUrl = canvasRef.current.toDataURL('image/png');
    const highDpiDataUrl = inject300Dpi(rawDataUrl);
    const link = document.createElement('a');
    link.download = `Insignia-${nombre.replace(/ /g, '_') || 'Esthela'}-${modelo}-300dpi.png`;
    link.href = highDpiDataUrl;
    link.click();
  };

  // CAMBIO 2 — Validación con feedback Toast + scroll al subir foto
  const handleDescargarClick = () => {
    if (!fotoUrl) {
      setToastMessage('⚠️ Para descargar tu insignia, primero sube tu fotografía en el paso 2.');
      setShowToast(true);
      document.getElementById('foto-upload-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    handleDownload();
  };

  const handleShare = async () => {
    if (!fotoUrl) {
      setToastMessage('⚠️ Para compartir tu insignia, primero sube tu fotografía en el paso 2.');
      setShowToast(true);
      document.getElementById('foto-upload-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!canvasRef.current) return;
    try {
      const rawDataUrl = canvasRef.current.toDataURL('image/png');
      const highDpiDataUrl = inject300Dpi(rawDataUrl);
      const parts = highDpiDataUrl.split(',');
      const binary = atob(parts[1]);
      const array = [];
      for (let i = 0; i < binary.length; i++) array.push(binary.charCodeAt(i));
      const blob = new Blob([new Uint8Array(array)], { type: 'image/png' });
      const file = new File([blob], 'insignia-guerrero-300dpi.png', { type: 'image/png' });
      if (navigator.share) {
        await navigator.share({
          title: 'Mi Insignia Oficial - Esthela Damián',
          text: `Soy ${nombre} de ${municipio || 'Guerrero'}. Esthela va en mi encuesta por la esperanza de Guerrero.`,
          files: [file],
        });
      } else { handleDownload(); }
    } catch (err) { console.error('Error al compartir insignia', err); }
  };

  // ─────────────────────────────────────────────────────────────
  // RENDER JSX
  // ─────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#070204] text-white px-4 py-8 md:py-16 selection:bg-[#D4A843] selection:text-black font-sans">

      {/* CAMBIO 4 — Fuentes editoriales premium */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,600&family=Montserrat:wght@300;400;600&display=swap"
        rel="stylesheet"
      />

      {/* CAMBIO 2 — Toast flotante (#1a0a00 + borde dorado, fade 4 s) */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50 bg-[#1a0a00] border-2 border-[#C9A84C] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm"
          >
            <span className="text-sm font-semibold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest uppercase text-[#D4A843] mb-4">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            DISEÑO EDITORIAL 3D PREMIUM
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-3">
            Insignias de la{' '}
            <span className="text-[#D4A843] bg-gradient-to-r from-[#FFEFA6] via-[#D4A843] to-[#9F7A26] bg-clip-text text-transparent font-extrabold font-serif">
              Esperanza
            </span>
          </h1>
          <p className="text-white/60 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
            Reconstruidas bajo una arquitectura tridimensional de profundidad de campo, sombras reales
            e inyección de metadatos de alta definición para redes sociales.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* ── PANEL DE CONTROL ───────────────────────────────── */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#12070B] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A843]/5 rounded-full filter blur-3xl pointer-events-none" />

              {/* PASO 1 */}
              <h2 className="text-xl font-bold text-[#D4A843] flex items-center gap-2 border-b border-white/10 pb-4">
                1. Datos del Ciudadano
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/50 mb-2 tracking-wider uppercase">Nombre</label>
                  <input
                    type="text" value={nombre} onChange={e => setNombre(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#D4A843] transition-all font-semibold"
                    placeholder="Escribe tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/50 mb-2 tracking-wider uppercase">Municipio de Guerrero</label>
                  <input
                    type="text" value={municipio} onChange={e => setMunicipio(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#D4A843] transition-all font-semibold"
                    placeholder="Ej. Chilpancingo"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-white/50 tracking-wider uppercase">Gentilicio Generado</label>
                  <button
                    onClick={() => setIsGentilicioManual(!isGentilicioManual)}
                    className="text-xs text-[#D4A843] hover:underline"
                  >
                    {isGentilicioManual ? 'Auto-generar' : 'Modificar manual'}
                  </button>
                </div>
                <input
                  type="text" value={gentilicio}
                  onChange={e => { setGentilicio(e.target.value); setIsGentilicioManual(true); }}
                  disabled={!isGentilicioManual}
                  className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#D4A843] transition-all font-semibold ${!isGentilicioManual ? 'opacity-60 cursor-not-allowed' : ''}`}
                  placeholder="Ej. Chilpancingueño"
                />
              </div>

              {/* PASO 2 — id para scroll CAMBIO 2 */}
              <h2 id="foto-upload-section" className="text-xl font-bold text-[#D4A843] flex items-center gap-2 border-b border-white/10 pb-4 pt-2">
                2. Sube y Ajusta tu Foto (Galería)
              </h2>
              <div className="space-y-4">
                <label className="w-full flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#D4A843]/30 cursor-pointer transition-all">
                  {fotoUrl
                    ? <img src={fotoUrl} alt="Vista previa de usuario" className="w-24 h-32 rounded-xl object-cover border-2 border-[#D4A843]" />
                    : <div className="p-4 rounded-full bg-white/5 text-white/40"><Camera className="w-8 h-8" /></div>
                  }
                  <p className="text-white/80 text-sm font-bold">{fotoUrl ? 'Cambiar Fotografía' : 'Selecciona tu mejor fotografía'}</p>
                  <p className="text-xs text-white/40">Acepta archivos JPG, PNG y formatos de celular</p>
                  <input type="file" accept="image/*" onChange={handleFotoChange} className="hidden" />
                </label>

                {fotoUrl && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <p className="text-xs font-bold text-[#D4A843] tracking-widest uppercase flex items-center gap-1.5">
                        <Move className="w-3.5 h-3.5" /> AJUSTAR DUPLA GANADORA
                      </p>
                      <button onClick={handleResetAjustes} className="text-xs text-white/50 hover:text-white flex items-center gap-1">
                        <RefreshCw className="w-3 h-3" /> Restablecer
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1 text-white/60">
                          <span>Zoom de Foto</span><span>{userZoom.toFixed(2)}x</span>
                        </div>
                        <input type="range" min={0.5} max={3.0} step={0.05} value={userZoom}
                          onChange={e => setUserZoom(parseFloat(e.target.value))}
                          className="w-full accent-[#D4A843]" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between text-xs mb-1 text-white/60"><span>Desplazar X</span></div>
                          <input type="range" min={-300} max={300} step={5} value={userPanX}
                            onChange={e => setUserPanX(parseInt(e.target.value))}
                            className="w-full accent-[#D4A843]" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1 text-white/60"><span>Desplazar Y</span></div>
                          <input type="range" min={-300} max={300} step={5} value={userPanY}
                            onChange={e => setUserPanY(parseInt(e.target.value))}
                            className="w-full accent-[#D4A843]" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* PASO 3 */}
              <h2 className="text-xl font-bold text-[#D4A843] flex items-center gap-2 border-b border-white/10 pb-4 pt-2">
                3. Selecciona tu Modelo de Insignia
              </h2>
              <div className="grid md:grid-cols-3 gap-3">
                {([
                  { id: 'unidad' as ModeloType, label: 'Unidad y Esperanza', desc: 'Textura de papel artesanal, Guerrero dorado 3D flotando y frase "Con el pueblo todo."' },
                  { id: 'soberania' as ModeloType, label: 'Soberanía y Territorio', desc: 'Esthela y tú sobre paisaje de la sierra, relieve dorado de Guerrero y lema nacional.' },
                  { id: 'voz-pueblo' as ModeloType, label: 'Voz del Pueblo', desc: 'Estilo editorial de alta gama, fondo guinda institucional y lema de justicia social.' },
                ]).map(m => (
                  <button key={m.id} onClick={() => setModelo(m.id)}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${modelo === m.id ? 'border-[#D4A843] bg-[#D4A843]/10 shadow-lg shadow-[#D4A843]/5' : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/15'}`}>
                    <div>
                      <p className={`font-black text-sm mb-1 transition-colors ${modelo === m.id ? 'text-[#D4A843]' : 'text-white'}`}>{m.label}</p>
                      <p className="text-white/40 text-xs leading-relaxed">{m.desc}</p>
                    </div>
                    {modelo === m.id && (
                      <span className="self-end mt-2 bg-[#D4A843] text-black p-0.5 rounded-full flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {modelo === 'soberania' && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                  <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Opción de Paisaje de Fondo</p>
                  <div className="flex gap-4">
                    <button onClick={() => setPaisaje('sierra')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${paisaje === 'sierra' ? 'bg-[#D4A843] text-black' : 'bg-white/5 text-white'}`}>
                      Sierra de Guerrero
                    </button>
                    <button onClick={() => setPaisaje('mar')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${paisaje === 'mar' ? 'bg-[#D4A843] text-black' : 'bg-white/5 text-white'}`}>
                      Mar de Guerrero
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── COLUMNA PREVIEW + DESCARGA ─────────────────────── */}
          <div className="lg:col-span-5 flex flex-col items-center gap-6">
            <div className="w-full max-w-sm flex flex-col items-center">
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4A843]" />
                Vista previa 3D interactiva
              </p>

              {/*
                ✅ CAMBIO 1 — Labels JSX "ESTHELA DAMIÁN" y "TÚ" ELIMINADOS.
                Los nombres se renderizan con drawCitizenName() dentro del canvas.
                Tenerlos fuera duplicaba el texto y rompía el diseño visual.
              */}

              <motion.div
                animate={{ rotateX: tilt.y, rotateY: tilt.x }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onMouseMove={e => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (e.clientX - rect.left) / rect.width - 0.5;
                  const y = (e.clientY - rect.top) / rect.height - 0.5;
                  setTilt({ x: x * 12, y: -y * 12 });
                }}
                onMouseLeave={() => setTilt({ x: 0, y: 0 })}
                style={{ transformStyle: 'preserve-3d', perspective: 1000 } as any}
                className="relative w-full aspect-square rounded-3xl overflow-hidden cursor-pointer shadow-[0_35px_80px_rgba(0,0,0,0.7)] group border border-[#D4A843]/20"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30" />
                <canvas
                  ref={canvasRef}
                  width={1080}
                  height={1080}
                  className="w-full h-full bg-[#12070B] block"
                  style={{ aspectRatio: '1/1' }}
                />
              </motion.div>

              <p className="text-white/30 text-xs text-center mt-3 max-w-xs">
                💡 Pasa el cursor sobre la tarjeta para interactuar con la profundidad de campo 3D.
              </p>
            </div>

            <div className="w-full max-w-sm space-y-3">
              {/*
                ✅ CAMBIO 2 — Botón SIEMPRE clickeable (sin disabled).
                Si no hay foto: muestra toast + scroll. opacity-75 simula estado
                "casi listo" y el tooltip explica la acción requerida.
              */}
              <button
                onClick={handleDescargarClick}
                title={!fotoUrl ? 'Sube tu foto primero' : 'Descargar insignia'}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer shadow-lg shadow-[#D4A843]/10 ${
                  !fotoUrl
                    ? 'bg-gradient-to-r from-[#FFEFA6]/80 via-[#D4A843]/80 to-[#9F7A26]/80 text-black/80 opacity-75 hover:opacity-100'
                    : 'bg-gradient-to-r from-[#FFEFA6] via-[#D4A843] to-[#9F7A26] text-black'
                }`}
              >
                <Download className="w-5 h-5" />
                Descargar en 300 DPI Oficial
              </button>

              <button
                onClick={handleShare}
                className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] bg-white/5 hover:bg-white/10 border border-white/10 text-white cursor-pointer"
              >
                <Share2 className="w-5 h-5" />
                Compartir en Redes Sociales
              </button>
            </div>

            <div className="bg-[#12070B] border border-white/10 rounded-2xl p-4 text-xs text-white/50 text-center leading-relaxed max-w-sm">
              🔒 <strong>Seguridad y Procesamiento Local</strong> — Tus fotografías no se guardan en ningún servidor;
              todo el montaje gráfico ocurre directamente en la GPU de tu teléfono o computadora.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}