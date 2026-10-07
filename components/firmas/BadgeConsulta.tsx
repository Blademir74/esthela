export const MUNICIPIOS_GUERRERO = [
  "Acapulco de Juarez", "Acatepec", "Ahuacuotzingo", "Ajuchitlan del Progreso", "Alcozauca de Guerrero",
  "Alpoyeca", "Apaxtla", "Arcelia", "Atenango del Rio", "Atlamajalcingo del Monte",
  "Atlixtac", "Atoyac de Alvarez", "Ayutla de los Libres", "Azoyu", "Benito Juarez", "Buenavista de Cuellar",
  "Coahuayutla de Jose Maria Izazaga", "Cocula", "Copala", "Copalillo", "Copanatoyac",
  "Coyuca de Benitez", "Coyuca de Catalan", "Cuajinicuilapa", "Cualac", "Cuautepec",
  "Cuetzala del Progreso", "Cutzamala de Pinzon", "Chilapa de Alvarez", "Chilpancingo de los Bravo", "Eduardo Neri",
  "Florencio Villarreal", "General Canuto A. Neri", "General Heliodoro Castillo", "Huamuxtitlan",
  "Huitzuco de los Figueroa", "Iguala de la Independencia", "Igualapa",
  "Iliatenco", "Ixcateopan de Cuauhtemoc", "Jose Joaquin de Herrera", "Juan R. Escudero", "Juchitan",
  "La Union de Isidoro Montes de Oca", "Las Vigas", "Leonardo Bravo", "Malinaltepec",
  "Marquelia", "Martir de Cuilapan", "Metlatonoc", "Mochitlan", "Nuu Savi",
  "Olinala", "Ometepec", "Pedro Ascencio Alquisiras", "Petatlan", "Pilcaya",
  "Pungarabato", "Quechultenango", "San Luis Acatlan", "San Marcos",
  "San Miguel Totolapan", "San Nicolas", "Santa Cruz del Rincon", "Taxco de Alarcon",
  "Tecoanapa", "Tecpan de Galeana", "Teloloapan", "Tepecoacuilco de Trujano",
  "Tetipac", "Tixtla de Guerrero", "Tlacoachistlahuaca", "Tlacoapa", "Tlalchapa",
  "Tlalixtaquilla de Maldonado", "Tlapa de Comonfort", "Tlapehuala", "Xalpatlahuac", "Xochihuehuetlan",
  "Xochistlahuaca", "Zapotitlan Tablas", "Zirandaro", "Zitlala", "Zihuatanejo de Azueta"
].sort();

export const REGIONES: Record<string, string[]> = {
  'Centro': ['Chilpancingo de los Bravo', 'Eduardo Neri', 'Tixtla de Guerrero', 'Mochitlan', 'Leonardo Bravo', 'Zitlala', 'General Heliodoro Castillo', 'Quechultenango'],
  'Costa Grande': ['Zihuatanejo de Azueta', 'Petatlan', 'Tecpan de Galeana', 'Atoyac de Alvarez', 'Benito Juarez', 'La Union de Isidoro Montes de Oca'],
  'Costa Chica': ['Ayutla de los Libres', 'Marquelia', 'Ometepec', 'San Luis Acatlan', 'Tecoanapa', 'San Marcos', 'Cuajinicuilapa'],
  'Tierra Caliente': ['Arcelia', 'Teloloapan', 'Coyuca de Catalan', 'Cutzamala de Pinzon', 'Pungarabato', 'Iguala de la Independencia'],
  'Norte': ['Iguala de la Independencia', 'Taxco de Alarcon', 'Huitzuco de los Figueroa', 'Tepecoacuilco de Trujano', 'Buenavista de Cuellar'],
  'Montaña': ['Tlapa de Comonfort', 'Metlatonoc', 'Cochoapa el Grande', 'Acatepec', 'Malinaltepec'],
  'Sierra': ['Chilapa de Alvarez', 'Ahuacuotzingo', 'Cualac', 'Jose Joaquin de Herrera'],
  'Acapulco': ['Acapulco de Juarez', 'Coyuca de Benitez'],
};

const KEYWORDS: Record<string, string[]> = {
  'Imposición / Falta de Transparencia': ['imposición', 'impuesto', 'impuesta', 'encuesta', 'fraude', 'transparente', 'transparencia', 'tongo', 'dedazo'],
  'Exigencia de Respeto a Bases': ['respeto', 'bases', 'militancia', 'estatutos', 'reglas', 'proceso interno'],
  'Descontento con Liderazgo Actual': ['Citlalli', 'Ariadna', 'dirigencia', 'coordinación', 'coordinadoras', 'mal liderazgo'],
  'Apoyo a Esthela Damián': ['Esthela', 'Damián', 'raíz', 'experiencia nacional', 'Chilpancingo', 'trabajo de base'],
};

export function clasificarInconformidad(texto: string, municipio: string) {
  const t = texto.toLowerCase();
  let categoria = 'Expresión Libre';
  let maxHits = 0;
  for (const [cat, kws] of Object.entries(KEYWORDS)) {
    const hits = kws.filter((k) => t.includes(k)).length;
    if (hits > maxHits) {
      maxHits = hits;
      categoria = cat;
    }
  }
  let sentimiento = 'Indignación Constructiva';
  if (t.includes('esperanza') || t.includes('vamos') || t.includes('lograr')) sentimiento = 'Esperanza Combativa';
  else if (t.includes('harto') || t.includes('basta') || t.includes('hartazgo')) sentimiento = 'Hartazgo Histórico';
  else if (t.includes('miedo') || t.includes('temor')) sentimiento = 'Preocupación Activa';
  let region = 'Centro';
  for (const [r, ms] of Object.entries(REGIONES)) {
    if (ms.some((m) => municipio.includes(m) || m.includes(municipio))) {
      region = r;
      break;
    }
  }
  return { categoria, sentimiento, region };
}

export function generarFolio() {
  const año = new Date().getFullYear();
  const n = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
  return `FIRMA-${año}-GRO-${n}`;
}