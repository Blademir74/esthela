// lib/consulta-data.ts  (catálogo + NLP heurístico gratuito)
export const MUNICIPIOS_GUERRERO = [
  'Acapulco de Juárez','Chilpancingo de los Bravo','Iguala de la Independencia',
  'Taxco de Alarcón','Zihuatanejo de Azueta','Tlapa de Comonfort','Ometepec',
  'Arcelia','Teloloapan','Coyuca de Benítez','Petatlán','Técpan de Galeana',
  'Atoyac de Álvarez','Ayutla de los Libres','Marquelia','San Luis Acatlán',
  'Chilapa de Álvarez','Tixtla de Guerrero','Huitzuco de los Figueroa',
  // … resto hasta 81 (usa el mismo array de tu landing principal)
];

export const REGIONES: Record<string, string[]> = {
  'Centro': ['Chilpancingo de los Bravo','Eduardo Neri','Tixtla de Guerrero','Mochitlán','Leonardo Bravo','Zitlala','General Heliodoro Castillo','Quechultenango'],
  'Costa Grande': ['Zihuatanejo de Azueta','Petatlán','Técpan de Galeana','Atoyac de Álvarez','Benito Juárez','La Unión de Isidoro Montes de Oca'],
  'Costa Chica': ['Ayutla de los Libres','Marquelia','Ometepec','San Luis Acatlán','Tecoanapa','San Marcos','Cuajinicuilapa'],
  'Tierra Caliente': ['Arcelia','Teloloapan','Coyuca de Catalán','Cutzamala de Pinzón','Pungarabato','Ciudad Altamirano','Iguala de la Independencia'],
  'Norte': ['Iguala de la Independencia','Taxco de Alarcón','Huitzuco de los Figueroa','Tepecoacuilco','Buenavista de Cuéllar'],
  'Montaña': ['Tlapa de Comonfort','Metlatónoc','Cochoapa el Grande','Acatepec','Malinaltepec'],
  'Sierra': ['Chilapa de Álvarez','Ahuacuotzingo','Cualác','José Joaquín de Herrera'],
  'Acapulco': ['Acapulco de Juárez','Coyuca de Benítez'],
};

const KEYWORDS: Record<string, string[]> = {
  'Imposición / Falta de Transparencia': ['imposición','impuesto','impuesta','encuesta','fraude','transparente','transparencia','tongo','dedazo'],
  'Exigencia de Respeto a Bases': ['respeto','bases','militancia','estatutos','reglas','proceso interno'],
  'Descontento con Liderazgo Actual': ['Citlalli','Ariadna','dirigencia','coordinación','coordinadoras','mal liderazgo'],
  'Apoyo a Esthela Damián': ['Esthela','Damián','raíz','experiencia nacional','Chilpancingo','trabajo de base'],
};

export function clasificarInconformidad(texto: string, municipio: string) {
  const t = texto.toLowerCase();
  let categoria = 'Expresión Libre';
  let maxHits = 0;
  for (const [cat, kws] of Object.entries(KEYWORDS)) {
    const hits = kws.filter((k) => t.includes(k)).length;
    if (hits > maxHits) { maxHits = hits; categoria = cat; }
  }
  let sentimiento = 'Indignación Constructiva';
  if (t.includes('esperanza') || t.includes('vamos') || t.includes('lograr')) sentimiento = 'Esperanza Combativa';
  else if (t.includes('harto') || t.includes('basta') || t.includes('hartazgo')) sentimiento = 'Hartazgo Histórico';
  else if (t.includes('miedo') || t.includes('temor')) sentimiento = 'Preocupación Activa';
  let region = 'Centro';
  for (const [r, ms] of Object.entries(REGIONES)) {
    if (ms.some((m) => municipio.includes(m) || m.includes(municipio))) { region = r; break; }
  }
  return { categoria, sentimiento, region };
}

export function generarFolio() {
  const año = new Date().getFullYear();
  const n = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
  return `FIRMA-${año}-GRO-${n}`;
}

export interface FirmaPayload {
  registro_id: string;
  fecha_hora: string;
  usuario: { nombre: string; municipio: string; whatsapp: string };
  respuestas_consulta: { pregunta_1_dimision_dirigentes: string; pregunta_2_preferencia_coordinadora: string };
  analisis_inconformidad_nlp: { texto_original: string; categoria_queja: string; sentimiento: string; region_impacto: string };
}

export function buildConsultaPayload(f: any): FirmaPayload {
  return {
    registro_id: f.folio,
    fecha_hora: new Date().toISOString(),
    usuario: { nombre: f.nombre, municipio: f.municipio, whatsapp: f.whatsapp },
    respuestas_consulta: {
      pregunta_1_dimision_dirigentes: f.pregunta_1,
      pregunta_2_preferencia_coordinadora: f.pregunta_2,
    },
    analisis_inconformidad_nlp: {
      texto_original: f.inconformidad,
      categoria_queja: f.categoria_queja,
      sentimiento: f.sentimiento,
      region_impacto: f.region,
    },
  };
}