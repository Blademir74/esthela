'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share2, Camera, Check, Sparkles, Move, RefreshCw } from 'lucide-react';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['800'] });

type ModeloType = 'soberania' | 'voz-pueblo' | 'unidad';

// ─────────────────────────────────────────────────────────────────
// UTILIDADES PNG + 300 DPI
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
  for (let i = 0; i < bytes.length; i++) {
    crc = crcTable[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

const inject300DpiToBlob = async (blob: Blob): Promise<Blob> => {
  const arrayBuffer = await blob.arrayBuffer();
  const originalBytes = new Uint8Array(arrayBuffer);

  const chunkData = new Uint8Array([
    112, 72, 89, 115,
    0, 0, 46, 35,
    0, 0, 46, 35,
    1,
  ]);

  const crcVal = calculateCrc(chunkData);
  const pHYsChunk = new Uint8Array(17);

  pHYsChunk[0] = 0;
  pHYsChunk[1] = 0;
  pHYsChunk[2] = 0;
  pHYsChunk[3] = 9;
  pHYsChunk.set(chunkData, 4);
  pHYsChunk[13] = (crcVal >>> 24) & 0xff;
  pHYsChunk[14] = (crcVal >>> 16) & 0xff;
  pHYsChunk[15] = (crcVal >>> 8) & 0xff;
  pHYsChunk[16] = crcVal & 0xff;

  const newBytes = new Uint8Array(originalBytes.length + 17);
  newBytes.set(originalBytes.subarray(0, 33), 0);
  newBytes.set(pHYsChunk, 33);
  newBytes.set(originalBytes.subarray(33), 50);

  return new Blob([newBytes], { type: 'image/png' });
};

const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('No fue posible generar el archivo PNG desde el canvas.'));
        return;
      }
      resolve(blob);
    }, 'image/png', 1.0);
  });

// ─────────────────────────────────────────────────────────────────
// COMPONENTE
// ─────────────────────────────────────────────────────────────────
export default function TarjetasPage() {
  const [modelo, setModelo] = useState<ModeloType>('unidad');
  const [nombre, setNombre] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [gentilicio, setGentilicio] = useState('');
  const [isGentilicioManual, setIsGentilicioManual] = useState(false);
  const [paisaje, setPaisaje] = useState<'sierra' | 'mar'>('sierra');

  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [userZoom, setUserZoom] = useState(1.0);
  const [userPanX, setUserPanX] = useState(0);
  const [userPanY, setUserPanY] = useState(0);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [esthelaImg, setEsthelaImg] = useState<HTMLImageElement | null>(null);
  const [landscapeImg, setLandscapeImg] = useState<HTMLImageElement | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [ready, setReady] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // ─────────────────────────────────────────────────────────────
  // CARGA DE ACTIVOS
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const loadImage = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    Promise.allSettled([
      loadImage('/assets/img/esthela4.png'),
      loadImage('/assets/img/por los caminos del sur.png'),
      fetch('https://raw.githubusercontent.com/PhantomInsights/mexico-geojson/main/2023/states/Guerrero.json').then(r => r.json()),
    ]).then((results) => {
      const esthela = results[0];
      const fondo = results[1];
      const geo = results[2];

      if (esthela.status === 'fulfilled') {
        setEsthelaImg(esthela.value);
      } else {
        const backup = new Image();
        backup.crossOrigin = 'anonymous';
        backup.onload = () => setEsthelaImg(backup);
        backup.src = '/assets/img/perfil.png';
      }

      if (fondo.status === 'fulfilled') {
        setLandscapeImg(fondo.value);
      }

      if (geo.status === 'fulfilled') {
        setGeoJsonData(geo.value);
      }
    });
  }, []);

  useEffect(() => {
    if (esthelaImg) setReady(true);
  }, [esthelaImg]);

  useEffect(() => {
    if (isGentilicioManual) return;
    const mun = municipio.trim().toLowerCase();

    if (!mun) {
      setGentilicio('');
      return;
    }

    if (mun.includes('acapulco')) setGentilicio('Acapulqueño');
    else if (mun.includes('chilpancingo')) setGentilicio('Chilpancingueño');
    else if (mun.includes('iguala')) setGentilicio('Igualense');
    else if (mun.includes('taxco')) setGentilicio('Taxqueño');
    else if (mun.includes('zihuatanejo')) setGentilicio('Zihuatanejense');
    else if (mun.includes('chilapa')) setGentilicio('Chilapeo');
    else if (mun.includes('tixtla')) setGentilicio('Tixtleco');
    else if (mun.includes('ometepec')) setGentilicio('Ometepequense');
    else setGentilicio('Guerrerense');
  }, [municipio, isGentilicioManual]);

  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 4000);
    return () => clearTimeout(t);
  }, [showToast]);

  useEffect(() => {
    return () => {
      if (fotoUrl) URL.revokeObjectURL(fotoUrl);
    };
  }, [fotoUrl]);

  // ─────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────
  const showElegantToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (fotoUrl) URL.revokeObjectURL(fotoUrl);

    const blobUrl = URL.createObjectURL(file);
    setFotoFile(file);
    setFotoUrl(blobUrl);
    setUserZoom(1.0);
    setUserPanX(0);
    setUserPanY(0);
  };

  const handleResetAjustes = () => {
    setUserZoom(1.0);
    setUserPanX(0);
    setUserPanY(0);
  };

  // ─────────────────────────────────────────────────────────────
  // HELPERS DE CANVAS
  // ─────────────────────────────────────────────────────────────
  const drawRoundedRectPath = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
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
  };

  const drawTextWithTracking = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    letterSpacing = 0,
    align: CanvasTextAlign = 'center'
  ) => {
    const chars = text.split('');
    const widths = chars.map((char) => ctx.measureText(char).width);
    const totalWidth =
      widths.reduce((sum, width) => sum + width, 0) + letterSpacing * (chars.length - 1);

    let startX = x;
    if (align === 'center') startX = x - totalWidth / 2;
    if (align === 'right') startX = x - totalWidth;

    let cursor = startX;
    chars.forEach((char, i) => {
      ctx.fillText(char, cursor, y);
      cursor += widths[i] + letterSpacing;
    });
  };

  const drawPaperTexture = (ctx: CanvasRenderingContext2D, W: number, H: number) => {
    ctx.fillStyle = '#F7F1E7';
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < 4500; i++) {
      const x = Math.random() * W;
      const y = Math.random() * H;
      const r = Math.random() * 1.3 + 0.2;
      ctx.fillStyle = `rgba(120, 78, 32, ${Math.random() * 0.035 + 0.01})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, 'rgba(255,255,255,0.22)');
    grad.addColorStop(0.55, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.08)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  };

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

      if (feature.geometry.type === 'Polygon') {
        feature.geometry.coordinates.forEach(processCoords);
      } else if (feature.geometry.type === 'MultiPolygon') {
        feature.geometry.coordinates.forEach((poly: any) => poly.forEach(processCoords));
      }
    });

    const boxW = 860;
    const boxH = 560;
    const boxX = (W - boxW) / 2;
    const boxY = H * 0.18;

    const project = (lon: number, lat: number) => ({
      x: boxX + ((lon - minLon) / (maxLon - minLon)) * boxW,
      y: boxY + (1 - (lat - minLat) / (maxLat - minLat)) * boxH,
    });

    const drawMapPath = () => {
      ctx.beginPath();

      geoJsonData.features.forEach((feature: any) => {
        const drawPolygon = (polygon: number[][]) => {
          polygon.forEach(([lon, lat], idx) => {
            const p = project(lon, lat);
            if (idx === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          });
          ctx.closePath();
        };

        if (feature.geometry.type === 'Polygon') {
          feature.geometry.coordinates.forEach(drawPolygon);
        } else if (feature.geometry.type === 'MultiPolygon') {
          feature.geometry.coordinates.forEach((poly: any) => poly.forEach(drawPolygon));
        }
      });
    };

    ctx.save();

    ctx.shadowColor = 'rgba(0,0,0,0.22)';
    ctx.shadowBlur = 34;
    ctx.shadowOffsetX = 18;
    ctx.shadowOffsetY = 30;
    drawMapPath();
    ctx.fillStyle = 'rgba(25,12,15,0.22)';
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    for (let i = 1; i <= 10; i++) {
      ctx.save();
      ctx.translate(i * 0.8, i * 1.1);
      drawMapPath();
      ctx.fillStyle = '#8A6417';
      ctx.fill();
      ctx.restore();
    }

    drawMapPath();
    const goldGrad = ctx.createLinearGradient(boxX, boxY, boxX + boxW, boxY + boxH);
    goldGrad.addColorStop(0, '#FFF1B7');
    goldGrad.addColorStop(0.35, '#D4A843');
    goldGrad.addColorStop(0.7, '#9E7725');
    goldGrad.addColorStop(1, '#F2D884');
    ctx.fillStyle = goldGrad;
    ctx.fill();

    ctx.strokeStyle = 'rgba(255,239,166,0.95)';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    ctx.restore();
  };

  const drawGlassPanel = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    ctx.save();

    ctx.shadowColor = 'rgba(0,0,0,0.28)';
    ctx.shadowBlur = 35;
    ctx.shadowOffsetX = 12;
    ctx.shadowOffsetY = 22;

    const bg = ctx.createLinearGradient(x, y, x + w, y + h);
    bg.addColorStop(0, 'rgba(255,255,255,0.12)');
    bg.addColorStop(1, 'rgba(255,255,255,0.03)');

    drawRoundedRectPath(ctx, x, y, w, h, r);
    ctx.fillStyle = bg;
    ctx.fill();

    ctx.shadowColor = 'transparent';

    const border = ctx.createLinearGradient(x, y, x + w, y + h);
    border.addColorStop(0, 'rgba(255,255,255,0.4)');
    border.addColorStop(0.5, 'rgba(255,255,255,0.08)');
    border.addColorStop(1, 'rgba(212,168,67,0.3)');
    ctx.strokeStyle = border;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.save();
    drawRoundedRectPath(ctx, x, y, w, h, r);
    ctx.clip();

    const gloss = ctx.createLinearGradient(x - w, y, x + w, y + h);
    gloss.addColorStop(0, 'rgba(255,255,255,0)');
    gloss.addColorStop(0.48, 'rgba(255,255,255,0)');
    gloss.addColorStop(0.5, 'rgba(255,255,255,0.08)');
    gloss.addColorStop(0.52, 'rgba(255,255,255,0.15)');
    gloss.addColorStop(0.55, 'rgba(255,255,255,0.04)');
    gloss.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gloss;
    ctx.fillRect(x, y, w, h);

    ctx.restore();
    ctx.restore();
  };

  const drawMetallicSeal = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) => {
    ctx.save();

    ctx.shadowColor = 'rgba(0,0,0,0.38)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 7;
    ctx.shadowOffsetY = 10;

    const metallic = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, r * 0.1, cx, cy, r);
    metallic.addColorStop(0, '#FFF0B5');
    metallic.addColorStop(0.28, '#E2BC62');
    metallic.addColorStop(0.62, '#9D7623');
    metallic.addColorStop(0.86, '#F7DC88');
    metallic.addColorStop(1, '#7D5A12');

    ctx.fillStyle = metallic;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowColor = 'transparent';

    ctx.strokeStyle = 'rgba(255,255,255,0.42)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 3, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#7D5A12';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 8, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#3D0A1F';
    ctx.font = "800 14px 'Montserrat', system-ui, sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ASPIRANTE', cx, cy - 15);
    ctx.fillText('REGISTRADA', cx, cy + 2);

    ctx.font = "800 11px 'Montserrat', system-ui, sans-serif";
    ctx.fillStyle = '#6B1D3A';
    ctx.fillText('MORENA GUERRERO', cx, cy + 20);

    ctx.fillStyle = '#D4A843';
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText('★', cx, cy + 34);

    ctx.restore();
  };

  // ─────────────────────────────────────────────────────────────
  // TIPOGRAFÍA PREMIUM ESCALADA PARA FACEBOOK
  // ─────────────────────────────────────────────────────────────
  const drawCitizenName = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    color = '#FFFFFF',
    align: CanvasTextAlign = 'center'
  ) => {
    ctx.save();
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.font = "700 52px 'Playfair Display', 'Georgia', serif";

    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    drawTextWithTracking(ctx, text, x + 2.2, y + 2.2, 2.6, align);

    ctx.fillStyle = color;
    drawTextWithTracking(ctx, text, x, y, 2.6, align);
    ctx.restore();
  };

  const drawSectionTitle = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    color = '#FFFFFF'
  ) => {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = "700 58px 'Playfair Display', 'Georgia', serif";

    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    drawTextWithTracking(ctx, text, x + 2.5, y + 2.5, 2, 'center');

    ctx.fillStyle = color;
    drawTextWithTracking(ctx, text, x, y, 2, 'center');
    ctx.restore();
  };

  const drawLocationText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    color = '#C9A84C',
    align: CanvasTextAlign = 'center'
  ) => {
    ctx.save();
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.font = "400 28px 'Montserrat', 'Arial', sans-serif";

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillText(text, x + 1.5, y + 1.5);

    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.restore();
  };

  const drawLemaText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    color = '#FFFFFF'
  ) => {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = "italic 600 36px 'Playfair Display', serif";

    const lines = text.split('\n');
    const lineHeight = 46;

    lines.forEach((line, index) => {
      const ly = y + index * lineHeight;
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fillText(line, x + 2, ly + 2);
      ctx.fillStyle = color;
      ctx.fillText(line, x, ly);
    });

    ctx.restore();
  };

  const drawSmallText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    color = 'rgba(255,255,255,0.88)'
  ) => {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = "500 22px 'Montserrat', sans-serif";

    ctx.fillStyle = 'rgba(0,0,0,0.38)';
    ctx.fillText(text, x + 1.2, y + 1.2);

    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.restore();
  };

  const drawEsthelaPhoto = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ): Promise<void> =>
    new Promise((resolve) => {
      if (!esthelaImg) {
        resolve();
        return;
      }

      ctx.save();

      ctx.shadowColor = 'rgba(0,0,0,0.25)';
      ctx.shadowBlur = 22;
      ctx.shadowOffsetX = 8;
      ctx.shadowOffsetY = 16;

      drawRoundedRectPath(ctx, x, y, w, h, r);
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.fill();

      ctx.shadowColor = 'transparent';

      drawRoundedRectPath(ctx, x, y, w, h, r);
      ctx.clip();

      const imgRatio = esthelaImg.naturalWidth / esthelaImg.naturalHeight;
      const boxRatio = w / h;

      let sx = 0;
      let sy = 0;
      let sw = esthelaImg.naturalWidth;
      let sh = esthelaImg.naturalHeight;

      if (imgRatio > boxRatio) {
        sw = esthelaImg.naturalHeight * boxRatio;
        sx = (esthelaImg.naturalWidth - sw) / 2;
      } else {
        sh = esthelaImg.naturalWidth / boxRatio;
        sy = (esthelaImg.naturalHeight - sh) / 2;
      }

      ctx.drawImage(esthelaImg, sx, sy + sh * 0.08, sw, sh * 0.92, x, y, w, h);

      const gradient = ctx.createLinearGradient(x, y, x + w, y + h);
      gradient.addColorStop(0, 'rgba(139,20,20,0.14)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.22)');
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, w, h);

      ctx.restore();

      ctx.strokeStyle = 'rgba(212,168,67,0.38)';
      ctx.lineWidth = 2.8;
      drawRoundedRectPath(ctx, x, y, w, h, r);
      ctx.stroke();

      resolve();
    });

  // CAMBIO 3 — FUSIÓN REAL DE FOTO EN CANVAS
  const drawUserPhoto = (
    ctx: CanvasRenderingContext2D,
    imgSrc: string | null,
    x: number,
    y: number,
    w: number,
    h: number
  ): Promise<void> => {
    return new Promise((resolve) => {
      const radius = 18;

      if (!imgSrc) {
        ctx.save();
        drawRoundedRectPath(ctx, x, y, w, h, radius);
        ctx.clip();

        const grad = ctx.createLinearGradient(x, y, x + w, y + h);
        grad.addColorStop(0, 'rgba(255,255,255,0.06)');
        grad.addColorStop(1, 'rgba(255,255,255,0.015)');
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, w, h);

        ctx.fillStyle = 'rgba(255,255,255,0.32)';
        ctx.font = "500 22px 'Montserrat', sans-serif";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SUBE TU FOTOGRAFÍA', x + w / 2, y + h / 2 - 18);

        ctx.font = "500 16px 'Montserrat', sans-serif";
        ctx.fillStyle = 'rgba(212,168,67,0.6)';
        ctx.fillText('Para crear la dupla ganadora', x + w / 2, y + h / 2 + 18);

        ctx.restore();

        ctx.strokeStyle = 'rgba(212,168,67,0.35)';
        ctx.lineWidth = 2.8;
        drawRoundedRectPath(ctx, x, y, w, h, radius);
        ctx.stroke();
        resolve();
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        ctx.save();

        drawRoundedRectPath(ctx, x, y, w, h, radius);
        ctx.clip();

        // Cover fit real
        const scale = Math.max(w / img.width, h / img.height) * userZoom;
        const sw = img.width * scale;
        const sh = img.height * scale;
        const sx = x - (sw - w) / 2 + userPanX;
        const sy = y - (sh - h) / 2 + userPanY;

        ctx.drawImage(img, sx, sy, sw, sh);

        const gradient = ctx.createLinearGradient(x, y, x + w, y + h);
        gradient.addColorStop(0, 'rgba(139,20,20,0.12)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.24)');
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, w, h);

        ctx.restore();

        ctx.strokeStyle = 'rgba(212,168,67,0.4)';
        ctx.lineWidth = 2.8;
        drawRoundedRectPath(ctx, x, y, w, h, radius);
        ctx.stroke();

        resolve();
      };

      img.onerror = () => resolve();

      // IMPORTANTE: src DESPUÉS de registrar onload/onerror
      img.src = imgSrc;
    });
  };

  // ─────────────────────────────────────────────────────────────
  // MODELOS
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
    drawGlassPanel(ctx, 54, 54, W - 108, H - 108, 40);

    await drawEsthelaPhoto(ctx, 95, 145, 410, 560, 26);
    await drawUserPhoto(ctx, fotoUrl, W - 505, 145, 410, 560);

    drawCitizenName(ctx, 'ESTHELA DAMIÁN', 300, 92, '#FFF5D0');
    drawCitizenName(ctx, nombre ? nombre.toUpperCase() : 'TÚ', W - 300, 92, '#D4A843');

    drawMetallicSeal(ctx, W - 145, H - 145, 74);

    drawSectionTitle(ctx, 'SOBERANÍA Y TERRITORIO', W / 2, 760, '#FFFFFF');
    drawLemaText(ctx, 'La soberanía se defiende con el pueblo.\nLa respuesta nace desde Guerrero.', W / 2, 835, '#F6DE97');

    const mun = municipio ? municipio.toUpperCase() : 'GUERRERO';
    drawLocationText(ctx, `SOY ${nombre ? nombre.toUpperCase() : 'CIUDADANO'} DE ${mun}`, W / 2, 965, '#FFFFFF');
    drawSmallText(ctx, 'ESTHELA VA EN MI ENCUESTA POR LA RESPUESTA DE GUERRERO', W / 2, 1022, 'rgba(255,255,255,0.95)');
  };

  const drawModelVozPueblo = async (ctx: CanvasRenderingContext2D, W: number, H: number) => {
    const bg = ctx.createRadialGradient(W / 2, H / 2, 120, W / 2, H / 2, 820);
    bg.addColorStop(0, '#5C0F29');
    bg.addColorStop(1, '#170208');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(212,168,67,0.05)';
    ctx.lineWidth = 2;
    for (let i = -W; i < W; i += 58) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + W, H);
      ctx.stroke();
    }

    ctx.save();
    ctx.globalAlpha = 0.45;
    drawGuerreroRelief(ctx, W, H);
    ctx.restore();

    drawGlassPanel(ctx, 54, 54, W - 108, H - 108, 40);

    await drawEsthelaPhoto(ctx, 95, 145, 410, 560, 26);
    await drawUserPhoto(ctx, fotoUrl, W - 505, 145, 410, 560);

    drawCitizenName(ctx, 'ESTHELA DAMIÁN', 300, 92, '#FFF5D0');
    drawCitizenName(ctx, nombre ? nombre.toUpperCase() : 'TÚ', W - 300, 92, '#D4A843');

    drawMetallicSeal(ctx, W - 145, H - 145, 74);

    drawSectionTitle(ctx, 'VOZ DEL PUEBLO', W / 2, 760, '#FFFFFF');
    drawLemaText(
      ctx,
      `Soy ${nombre || 'un ciudadano'} de ${municipio || 'Guerrero'}\ny Esthela va en mi encuesta por la justicia social.`,
      W / 2,
      835,
      '#F1D98B'
    );

    drawSmallText(ctx, 'MORENA · LA ESPERANZA DE GUERRERO', W / 2, 1015, '#FFFFFF');
  };

  const drawModelUnidad = async (ctx: CanvasRenderingContext2D, W: number, H: number) => {
    drawPaperTexture(ctx, W, H);
    drawGuerreroRelief(ctx, W, H);
    drawGlassPanel(ctx, 54, 54, W - 108, H - 108, 40);

    await drawEsthelaPhoto(ctx, 95, 145, 410, 560, 26);
    await drawUserPhoto(ctx, fotoUrl, W - 505, 145, 410, 560);

    drawCitizenName(ctx, 'ESTHELA DAMIÁN', 300, 92, '#3D0A1F');
    drawCitizenName(ctx, nombre ? nombre.toUpperCase() : 'TÚ', W - 300, 92, '#8A6417');

    drawMetallicSeal(ctx, W - 145, H - 145, 74);

    drawSectionTitle(ctx, 'UNIDAD Y ESPERANZA', W / 2, 760, '#3D0A1F');
    drawLemaText(ctx, 'Con el pueblo todo,\nsin el pueblo nada.', W / 2, 835, '#8A6417');

    drawLocationText(
      ctx,
      `Soy ${nombre || 'ciudadano'}, orgullosamente ${gentilicio || 'Guerrerense'}.`,
      W / 2,
      960,
      '#3D0A1F'
    );

    drawSmallText(
      ctx,
      'ESTHELA VA EN MI ENCUESTA POR LA ESPERANZA DE GUERRERO',
      W / 2,
      1018,
      'rgba(61,10,31,0.92)'
    );
  };

  // ─────────────────────────────────────────────────────────────
  // RENDER DE CANVAS
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!canvasRef.current || !ready) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 1080;
    const H = 1080;

    const drawCard = async () => {
      try {
        await document.fonts.ready;
      } catch (e) {
        console.warn('Error esperando fuentes del canvas', e);
      }

      ctx.clearRect(0, 0, W, H);

      if (modelo === 'soberania') {
        await drawModelSoberania(ctx, W, H);
      } else if (modelo === 'voz-pueblo') {
        await drawModelVozPueblo(ctx, W, H);
      } else {
        await drawModelUnidad(ctx, W, H);
      }
    };

    drawCard();
  }, [
    modelo,
    ready,
    fotoUrl,
    nombre,
    municipio,
    gentilicio,
    paisaje,
    userZoom,
    userPanX,
    userPanY,
    geoJsonData,
    esthelaImg,
    landscapeImg,
  ]);

  // ─────────────────────────────────────────────────────────────
  // DESCARGA ROBUSTA
  // ─────────────────────────────────────────────────────────────
  const generateAndDownloadCanvas = async () => {
    if (!canvasRef.current) return;

    try {
      const canvas = canvasRef.current;
      const blob = await canvasToBlob(canvas);
      const png300 = await inject300DpiToBlob(blob);
      const url = URL.createObjectURL(png300);

      const link = document.createElement('a');
      link.href = url;
      link.download = `Insignia-${(nombre || 'Esthela').replace(/\s+/g, '_')}-${modelo}-300dpi.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch (error) {
      console.error('Error al descargar imagen:', error);
      showElegantToast('⚠️ No fue posible descargar la imagen. Revisa que la foto y los assets hayan cargado correctamente.');
    }
  };

  const handleDescargar = async () => {
    if (!fotoUrl) {
      setToastMessage('⚠️ Para descargar tu insignia, primero sube tu fotografía en el paso 2.');
      setShowToast(true);
      document.getElementById('foto-upload-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    await generateAndDownloadCanvas();
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
      const blob = await canvasToBlob(canvasRef.current);
      const png300 = await inject300DpiToBlob(blob);
      const file = new File([png300], 'insignia-guerrero-300dpi.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: 'Mi Insignia Oficial - Esthela Damián',
          text: `Soy ${nombre || 'ciudadano'} de ${municipio || 'Guerrero'}. Esthela va en mi encuesta por la esperanza de Guerrero.`,
          files: [file],
        });
      } else {
        await generateAndDownloadCanvas();
      }
    } catch (err) {
      console.error('Error al compartir insignia:', err);
      showElegantToast('⚠️ No fue posible compartir la insignia en este dispositivo.');
    }
  };

  return (
    <main className="min-h-screen bg-[#070204] text-white px-4 py-8 md:py-16 selection:bg-[#D4A843] selection:text-black font-sans">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,600&family=Montserrat:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.32 }}
            className="fixed bottom-6 right-6 z-50 bg-[#1a0a00] border border-[#C9A84C] text-white px-5 py-4 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.45)] max-w-sm"
          >
            <span className="text-sm md:text-[15px] font-medium leading-relaxed">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
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
            Reconstruidas bajo una arquitectura visual de alto impacto para redes sociales, con tipografía editorial,
            relieve dorado y composición premium lista para Facebook.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#12070B] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A843]/5 rounded-full blur-3xl pointer-events-none" />

              <h2 className="text-xl font-bold text-[#D4A843] flex items-center gap-2 border-b border-white/10 pb-4">
                1. Datos del Ciudadano
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/50 mb-2 tracking-wider uppercase">Nombre</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#D4A843] transition-all font-semibold"
                    placeholder="Escribe tu nombre"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/50 mb-2 tracking-wider uppercase">Municipio de Guerrero</label>
                  <input
                    type="text"
                    value={municipio}
                    onChange={(e) => setMunicipio(e.target.value)}
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
                  type="text"
                  value={gentilicio}
                  onChange={(e) => {
                    setGentilicio(e.target.value);
                    setIsGentilicioManual(true);
                  }}
                  disabled={!isGentilicioManual}
                  className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#D4A843] transition-all font-semibold ${
                    !isGentilicioManual ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                  placeholder="Ej. Chilpancingueño"
                />
              </div>

              <h2
                id="foto-upload-section"
                className="text-xl font-bold text-[#D4A843] flex items-center gap-2 border-b border-white/10 pb-4 pt-2"
              >
                2. Sube y Ajusta tu Foto (Galería)
              </h2>

              <div className="space-y-4">
                <label className="w-full flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#D4A843]/30 cursor-pointer transition-all">
                  {fotoUrl ? (
                    <img
                      src={fotoUrl}
                      alt="Vista previa de usuario"
                      className="w-24 h-32 rounded-xl object-cover border-2 border-[#D4A843]"
                    />
                  ) : (
                    <div className="p-4 rounded-full bg-white/5 text-white/40">
                      <Camera className="w-8 h-8" />
                    </div>
                  )}

                  <p className="text-white/80 text-sm font-bold">
                    {fotoUrl ? 'Cambiar Fotografía' : 'Selecciona tu mejor fotografía'}
                  </p>
                  <p className="text-xs text-white/40">Acepta archivos JPG, PNG y formatos de celular</p>

                  <input type="file" accept="image/*" onChange={handleFotoChange} className="hidden" />
                </label>

                {fotoUrl && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <p className="text-xs font-bold text-[#D4A843] tracking-widest uppercase flex items-center gap-1.5">
                        <Move className="w-3.5 h-3.5" />
                        AJUSTAR DUPLA GANADORA
                      </p>

                      <button
                        onClick={handleResetAjustes}
                        className="text-xs text-white/50 hover:text-white flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Restablecer
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1 text-white/60">
                          <span>Zoom de Foto</span>
                          <span>{userZoom.toFixed(2)}x</span>
                        </div>
                        <input
                          type="range"
                          min={0.5}
                          max={3}
                          step={0.05}
                          value={userZoom}
                          onChange={(e) => setUserZoom(parseFloat(e.target.value))}
                          className="w-full accent-[#D4A843]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between text-xs mb-1 text-white/60">
                            <span>Desplazar Horizontal X</span>
                          </div>
                          <input
                            type="range"
                            min={-300}
                            max={300}
                            step={5}
                            value={userPanX}
                            onChange={(e) => setUserPanX(parseInt(e.target.value))}
                            className="w-full accent-[#D4A843]"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-xs mb-1 text-white/60">
                            <span>Desplazar Vertical Y</span>
                          </div>
                          <input
                            type="range"
                            min={-300}
                            max={300}
                            step={5}
                            value={userPanY}
                            onChange={(e) => setUserPanY(parseInt(e.target.value))}
                            className="w-full accent-[#D4A843]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <h2 className="text-xl font-bold text-[#D4A843] flex items-center gap-2 border-b border-white/10 pb-4 pt-2">
                3. Selecciona tu Modelo de Insignia
              </h2>

              <div className="grid md:grid-cols-3 gap-3">
                {[
                  {
                    id: 'unidad' as ModeloType,
                    label: 'Unidad y Esperanza',
                    desc: 'Textura artesanal premium, Guerrero en relieve y mensaje institucional elegante.',
                  },
                  {
                    id: 'soberania' as ModeloType,
                    label: 'Soberanía y Territorio',
                    desc: 'Composición poderosa, pareja visual líder-ciudadano y mensaje de respuesta popular.',
                  },
                  {
                    id: 'voz-pueblo' as ModeloType,
                    label: 'Voz del Pueblo',
                    desc: 'Editorial de alto impacto para Facebook, fondo guinda premium y acabado de campaña.',
                  },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setModelo(m.id)}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      modelo === m.id
                        ? 'border-[#D4A843] bg-[#D4A843]/10 shadow-lg shadow-[#D4A843]/5'
                        : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/15'
                    }`}
                  >
                    <div>
                      <p className={`font-black text-sm mb-1 ${modelo === m.id ? 'text-[#D4A843]' : 'text-white'}`}>
                        {m.label}
                      </p>
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
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center gap-6">
            <div className="w-full max-w-sm flex flex-col items-center">
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4A843]" />
                Vista previa 3D interactiva
              </p>

              {/* CAMBIO 1 — ELIMINADOS COMPLETAMENTE LOS LABELS DOM FUERA DEL CANVAS */}

              <motion.div
                animate={{ rotateX: tilt.y, rotateY: tilt.x }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (e.clientX - rect.left) / rect.width - 0.5;
                  const y = (e.clientY - rect.top) / rect.height - 0.5;
                  setTilt({ x: x * 12, y: -y * 12 });
                }}
                onMouseLeave={() => setTilt({ x: 0, y: 0 })}
                style={{ transformStyle: 'preserve-3d', perspective: 1000 } as any}
                className="relative w-full aspect-square rounded-3xl overflow-hidden cursor-pointer shadow-[0_35px_90px_rgba(0,0,0,0.72)] group border border-[#D4A843]/20"
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
                Pasa el cursor sobre la tarjeta para percibir profundidad, volumen y brillo editorial.
              </p>
            </div>

            <div className="w-full max-w-sm space-y-3">
              <button
                onClick={handleDescargar}
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

            <div className="bg-[#12070B] border border-white/10 rounded-2xl p-4 text-xs text-white/50 text-center leading-relaxed">
              Seguridad y procesamiento local: tu fotografía no se guarda en ningún servidor; toda la composición se genera
              directamente en el navegador del usuario.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}