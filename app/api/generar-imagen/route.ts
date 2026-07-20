import { NextRequest, NextResponse } from 'next/server';
import { createCanvas, loadImage, registerFont } from 'canvas';
import { type PerfilPolitico } from '@/lib/algoritmo';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { perfil }: { perfil: PerfilPolitico } = await request.json();

    const canvas = createCanvas(1080, 1080);
    const ctx = canvas.getContext('2d');

    // Fondo con degradado según el perfil
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
    
    if (perfil.color_principal === '#EF4444') {
      // Conservador - Rojo
      gradient.addColorStop(0, '#DC2626');
      gradient.addColorStop(1, '#7F1D1D');
    } else if (perfil.color_principal === '#10B981') {
      // Centro - Verde
      gradient.addColorStop(0, '#10B981');
      gradient.addColorStop(1, '#065F46');
    } else {
      // Progresista - Azul
      gradient.addColorStop(0, '#3B82F6');
      gradient.addColorStop(1, '#1E3A8A');
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1080);

    // Mapa de Guerrero de fondo (opacidad reducida)
    try {
      const mapaPath = path.join(process.cwd(), 'public', 'assets', 'guerrero-map.png');
      const mapaImg = await loadImage(mapaPath);
      ctx.globalAlpha = 0.15;
      ctx.drawImage(mapaImg, 50, 50, 980, 980);
      ctx.globalAlpha = 1.0;
    } catch (error) {
      console.log('No se pudo cargar la imagen del mapa');
    }

    // Título "MI PERFIL POLÍTICO"
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 56px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('MI PERFIL POLÍTICO', 540, 100);

    // Subtítulo "Guerrero 2025"
    ctx.font = '28px Arial';
    ctx.fillStyle = '#F3F4F6';
    ctx.fillText('Guerrero 2025', 540, 150);

    // Badge de perfil (rectángulo redondeado)
    ctx.fillStyle = '#FFFFFF';
    roundRect(ctx, 140, 200, 800, 100, 20);
    ctx.fill();

    // Texto del perfil
    ctx.fillStyle = '#1F2937';
    ctx.font = 'bold 44px Arial';
    ctx.fillText(perfil.etiqueta, 540, 265);

    // Mapa miniatura con marcador
    // Dibujar cuadrícula del mapa político
    const mapX = 180;
    const mapY = 350;
    const mapSize = 320;

    // Fondo del mapa
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(mapX, mapY, mapSize, mapSize);

    // Líneas de cuadrícula
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    
    // Líneas verticales
    for (let i = 0; i <= 4; i++) {
      ctx.beginPath();
      ctx.moveTo(mapX + (mapSize / 4) * i, mapY);
      ctx.lineTo(mapX + (mapSize / 4) * i, mapY + mapSize);
      ctx.stroke();
    }
    
    // Líneas horizontales
    for (let i = 0; i <= 4; i++) {
      ctx.beginPath();
      ctx.moveTo(mapX, mapY + (mapSize / 4) * i);
      ctx.lineTo(mapX + mapSize, mapY + (mapSize / 4) * i);
      ctx.stroke();
    }

    // Etiquetas de ejes
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    
    // Eje X (Conservador - Progresista)
    ctx.fillText('Conservador', mapX + 60, mapY + mapSize + 25);
    ctx.fillText('Progresista', mapX + mapSize - 60, mapY + mapSize + 25);
    
    // Eje Y (Libertario - Autoritario)
    ctx.save();
    ctx.translate(mapX - 30, mapY + 60);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Libertario', 0, 0);
    ctx.restore();
    
    ctx.save();
    ctx.translate(mapX - 30, mapY + mapSize - 60);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Autoritario', 0, 0);
    ctx.restore();

    // Marcador de posición del usuario
    const userX = mapX + (perfil.posicion_x / 100) * mapSize;
    const userY = mapY + (perfil.posicion_y / 100) * mapSize;

    // Círculo externo (glow)
    ctx.fillStyle = 'rgba(252, 211, 77, 0.3)';
    ctx.beginPath();
    ctx.arc(userX, userY, 25, 0, Math.PI * 2);
    ctx.fill();

    // Círculo principal
    ctx.fillStyle = '#FCD34D';
    ctx.beginPath();
    ctx.arc(userX, userY, 18, 0, Math.PI * 2);
    ctx.fill();

    // Borde del marcador
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Estadísticas - Panel derecho
    const statsX = 560;
    let statsY = 380;

    ctx.textAlign = 'left';
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#FFFFFF';
    
    // Tema prioritario
    ctx.fillText('📊 Tema Prioritario', statsX, statsY);
    ctx.font = '22px Arial';
    ctx.fillStyle = '#FCD34D';
    ctx.fillText(perfil.tema_principal, statsX, statsY + 35);
    
    statsY += 90;

    // Liderazgo
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('👤 Liderazgo Preferido', statsX, statsY);
    ctx.font = '22px Arial';
    ctx.fillStyle = '#FCD34D';
    ctx.fillText(perfil.liderazgo_preferido, statsX, statsY + 35);
    
    statsY += 90;

    // Valor en gobierno
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('💡 Valor en Gobierno', statsX, statsY);
    ctx.font = '22px Arial';
    ctx.fillStyle = '#FCD34D';
    ctx.fillText(perfil.valor_gobierno, statsX, statsY + 35);

    // Municipio (si está disponible)
    if (perfil.municipio !== "No especificado" && perfil.municipio !== "Prefiero no decir") {
      statsY += 90;
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('📍 Municipio', statsX, statsY);
      ctx.font = '20px Arial';
      ctx.fillStyle = '#FCD34D';
      
      // Truncar municipio si es muy largo
      const municipioCorto = perfil.municipio.length > 25 
        ? perfil.municipio.substring(0, 22) + '...'
        : perfil.municipio;
      ctx.fillText(municipioCorto, statsX, statsY + 35);
    }

    // Dato sorpresa (box amarillo)
    const boxY = 740;
    ctx.fillStyle = 'rgba(252, 211, 77, 0.3)';
    roundRect(ctx, 80, boxY, 920, 100, 15);
    ctx.fill();

    ctx.fillStyle = '#1F2937';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    
    // Dividir texto en líneas si es muy largo
    const datoSorpresa = `💡 ${perfil.dato_sorpresa}`;
    wrapText(ctx, datoSorpresa, 540, boxY + 35, 860, 26);

    // CTA inferior
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 30px Arial';
    ctx.fillText('¿Y TÚ? DESCUBRE TU PERFIL EN:', 540, 900);

    // URL
    ctx.fillStyle = '#FCD34D';
    ctx.font = 'bold 36px Arial';
    ctx.fillText('MiPerfilGuerrero.com', 540, 950);

    // Hashtag
    ctx.fillStyle = '#E5E7EB';
    ctx.font = '18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('#MiPerfilPolíticoGuerrero', 50, 1040);

    // Logo/Badge en la esquina
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.textAlign = 'right';
    ctx.font = '14px Arial';
    ctx.fillText('Guerrero 2025 🗺️', 1030, 1040);

    // Convertir a buffer
    const buffer = canvas.toBuffer('image/png');
    const uint8Array = new Uint8Array(buffer);

    return new Response(uint8Array, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });

  } catch (error) {
    console.error('Error al generar imagen:', error);
    return NextResponse.json(
      { error: 'Error al generar imagen' },
      { status: 500 }
    );
  }
}

// Función auxiliar para rectángulos redondeados
function roundRect(
  ctx: any,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Función auxiliar para texto con saltos de línea
function wrapText(
  ctx: any,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let lines: string[] = [];

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  // Centrar verticalmente
  const startY = y - (lines.length - 1) * lineHeight / 2;

  lines.forEach((line, index) => {
    ctx.fillText(line.trim(), x, startY + index * lineHeight);
  });
}
