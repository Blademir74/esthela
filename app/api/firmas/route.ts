// app/api/firmas/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { clasificarInconformidad, generarFolio } from '@/lib/consulta-data';

const SB = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get('limit') ?? 50);
  const res = await fetch(`${SB}/rest/v1/consultas_firmas?select=*&order=created_at.desc&limit=${limit}`, { headers: H });
  return NextResponse.json(res.ok ? await res.json() : []);
}

export async function POST(req: NextRequest) {
  const b = await req.json();
  const nlp = clasificarInconformidad(b.inconformidad ?? '', b.municipio);
  const row = {
    folio: generarFolio(),
    nombre: String(b.nombre ?? '').trim().slice(0, 100),
    municipio: String(b.municipio ?? '').trim().slice(0, 80),
    whatsapp: String(b.whatsapp ?? '').replace(/\D/g, '').slice(0, 15),
    pregunta_1: b.pregunta_1,
    pregunta_2: b.pregunta_2,
    inconformidad: String(b.inconformidad ?? '').trim().slice(0, 1500),
    categoria_queja: nlp.categoria,
    sentimiento: nlp.sentimiento,
    region: nlp.region,
    firma_data_url: typeof b.firma === 'string' && b.firma.length < 400000 ? b.firma : null,
    ip_hash: req.headers.get('x-forwarded-for')
      ? Buffer.from(req.headers.get('x-forwarded-for')!).toString('base64').slice(0, 32)
      : null,
  };
  if (row.nombre.length < 3 || !row.municipio || !['SI_SEPARACION','NO_PERMANENCIA'].includes(row.pregunta_1))
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });

  const res = await fetch(`${SB}/rest/v1/consultas_firmas?select=*`, {
    method: 'POST',
    headers: { ...H, Prefer: 'return=representation' },
    body: JSON.stringify(row),
  });
  if (!res.ok) return NextResponse.json({ error: 'DB' }, { status: 500 });
  const [guardado] = await res.json();
  return NextResponse.json(guardado, { status: 201 });
}