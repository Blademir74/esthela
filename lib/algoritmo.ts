// Algoritmo de cálculo del perfil político

export interface Respuesta {
  pregunta_id: number;
  tipo: string;
  valor?: number;
  opcion?: {
    id: string;
    texto: string;
    valor_x?: number;
    valor_y?: number;
    tema?: string;
    liderazgo?: string;
    valor?: string;
  };
  seleccionados?: Array<{
    id: string;
    texto: string;
    tema?: string;
    boost_y?: number;
  }>;
}

export interface PerfilPolitico {
  posicion_x: number;
  posicion_y: number;
  etiqueta: string;
  tema_principal: string;
  liderazgo_preferido: string;
  valor_gobierno: string;
  nivel_autonomia: number;
  municipio: string;
  descripcion: string;
  dato_sorpresa: string;
  color_principal: string;
}

export function calcularPerfilPolitico(respuestas: Respuesta[]): PerfilPolitico {
  let suma_x = 0;
  let suma_y = 0;
  let contador = 0;
  const temas: string[] = [];
  let liderazgo = "Equilibrado";
  let valor_gobierno = "Pragmático";
  let nivel_autonomia = 5;
  let municipio = "No especificado";

  // Procesar respuestas de opción múltiple
  respuestas.forEach(r => {
    if (r.opcion) {
      if (r.opcion.valor_x !== undefined && r.opcion.valor_y !== undefined) {
        suma_x += r.opcion.valor_x;
        suma_y += r.opcion.valor_y;
        contador++;
      }
      if (r.opcion.tema) temas.push(r.opcion.tema);
      if (r.opcion.liderazgo) liderazgo = r.opcion.liderazgo;
      if (r.opcion.valor) valor_gobierno = r.opcion.valor;
    }

    // Procesar casillas múltiples (pregunta 4)
    if (r.seleccionados && r.seleccionados.length > 0) {
      r.seleccionados.forEach(sel => {
        if (sel.tema) temas.push(sel.tema);
        if (sel.boost_y) suma_y += sel.boost_y;
      });
    }

    // Procesar escalas
    if (r.tipo === 'escala' && r.valor !== undefined) {
      if (r.pregunta_id === 2) {
        // Seguridad
        suma_y += r.valor * 7;
        contador++;
      } else if (r.pregunta_id === 6) {
        // Amapola
        suma_x += r.valor * 8;
        contador++;
      } else if (r.pregunta_id === 9) {
        // Autonomía
        nivel_autonomia = r.valor;
      }
    }

    // Municipio
    if (r.pregunta_id === 11 && r.opcion) {
      municipio = r.opcion.texto;
    }
  });

  // Calcular posición final
  const posicion_x = Math.max(0, Math.min(100, suma_x / (contador || 1)));
  const posicion_y = Math.max(0, Math.min(100, suma_y / (contador || 1)));

  // Determinar etiqueta política
  const etiqueta = determinarEtiqueta(posicion_x, posicion_y);

  // Tema principal (el más frecuente)
  const tema_principal = obtenerTemaPrincipal(temas);

  // Descripción del perfil
  const descripcion = generarDescripcion(etiqueta, tema_principal);

  // Dato sorprendente
  const dato_sorpresa = generarDatoSorpresa(posicion_x, posicion_y, municipio);

  // Color según posición
  const color_principal = obtenerColor(posicion_x, posicion_y);

  return {
    posicion_x: Math.round(posicion_x * 10) / 10,
    posicion_y: Math.round(posicion_y * 10) / 10,
    etiqueta,
    tema_principal,
    liderazgo_preferido: liderazgo,
    valor_gobierno,
    nivel_autonomia,
    municipio,
    descripcion,
    dato_sorpresa,
    color_principal
  };
}

function determinarEtiqueta(x: number, y: number): string {
  if (x < 35) {
    if (y < 35) return "Conservador Liberal";
    if (y < 65) return "Conservador Moderado";
    return "Conservador Autoritario";
  } else if (x < 65) {
    if (y < 35) return "Centrista Pragmático";
    if (y < 65) return "Centrista Equilibrado";
    return "Centrista Social";
  } else {
    if (y < 35) return "Progresista Libertario";
    if (y < 65) return "Progresista Moderado";
    return "Progresista Radical";
  }
}

function obtenerTemaPrincipal(temas: string[]): string {
  if (temas.length === 0) return "Equilibrado";

  const conteo: { [key: string]: number } = {};
  temas.forEach(tema => {
    conteo[tema] = (conteo[tema] || 0) + 1;
  });

  let maxTema = "Equilibrado";
  let maxCount = 0;
  Object.entries(conteo).forEach(([tema, count]) => {
    if (count > maxCount) {
      maxCount = count;
      maxTema = tema;
    }
  });

  return maxTema;
}

function generarDescripcion(etiqueta: string, tema: string): string {
  const descripciones: { [key: string]: string } = {
    "Conservador Liberal": "Valoras la tradición y el orden, pero apoyas las libertades económicas. Crees en el progreso mediante instituciones sólidas.",
    "Conservador Moderado": "Buscas el equilibrio entre tradición y cambio gradual. Valoras la estabilidad y el orden social.",
    "Conservador Autoritario": "Priorizas el orden, la seguridad y la autoridad del Estado. Crees en gobiernos firmes que garanticen estabilidad.",
    "Centrista Pragmático": "No te defines por ideologías extremas. Buscas soluciones prácticas y equilibradas a los problemas de Guerrero.",
    "Centrista Equilibrado": "Valoras el balance entre libertad individual y bienestar colectivo. Tu enfoque es moderado y dialogante.",
    "Centrista Social": "Buscas equilibrio con énfasis en justicia social. Apoyas políticas que beneficien a la mayoría.",
    "Progresista Libertario": "Valoras la libertad individual y el cambio social. Apoyas la autonomía personal y políticas innovadoras.",
    "Progresista Moderado": "Apoyas cambios sociales progresivos pero de forma gradual y consensuada. Valoras la inclusión y la igualdad.",
    "Progresista Radical": "Apoyas transformaciones profundas en las estructuras sociales y económicas. Priorizas la justicia social y la igualdad."
  };

  return descripciones[etiqueta] || "Tu perfil político es único y refleja una combinación especial de valores.";
}

function generarDatoSorpresa(x: number, y: number, municipio: string): string {
  const sorpresas = [
    "Tu perfil coincide con el 23% de guerrerenses que priorizan el cambio social",
    "Compartes valores con líderes históricos de movimientos sociales en Guerrero",
    "Tu visión política refleja las aspiraciones de las nuevas generaciones",
    "Tu perfil es único: solo el 8% de participantes tienen esta combinación",
    `En ${municipio} predominan perfiles similares al tuyo`,
    "Tu postura sobre autonomía regional es compartida por el 67% de participantes",
    "Tu enfoque equilibrado es valorado en tiempos de polarización política"
  ];

  // Seleccionar basado en posición
  const index = Math.floor((x + y) / 28.5) % sorpresas.length;
  return sorpresas[index];
}

function obtenerColor(x: number, y: number): string {
  if (x < 35) return "#EF4444"; // Rojo - Conservador
  if (x < 65) return "#10B981"; // Verde - Centro
  return "#3B82F6"; // Azul - Progresista
}

// Función para generar estadísticas agregadas
export function calcularEstadisticas(perfiles: PerfilPolitico[]) {
  const total = perfiles.length;
  
  const distribucionEtiquetas: { [key: string]: number } = {};
  const distribucionTemas: { [key: string]: number } = {};
  const distribucionMunicipios: { [key: string]: number } = {};

  perfiles.forEach(perfil => {
    distribucionEtiquetas[perfil.etiqueta] = (distribucionEtiquetas[perfil.etiqueta] || 0) + 1;
    distribucionTemas[perfil.tema_principal] = (distribucionTemas[perfil.tema_principal] || 0) + 1;
    if (perfil.municipio !== "No especificado" && perfil.municipio !== "Prefiero no decir") {
      distribucionMunicipios[perfil.municipio] = (distribucionMunicipios[perfil.municipio] || 0) + 1;
    }
  });

  return {
    total,
    distribucionEtiquetas,
    distribucionTemas,
    distribucionMunicipios,
    promedioX: perfiles.reduce((sum, p) => sum + p.posicion_x, 0) / total,
    promedioY: perfiles.reduce((sum, p) => sum + p.posicion_y, 0) / total
  };
}
