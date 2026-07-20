// Preguntas de la encuesta política

export interface Opcion {
  id: string;
  texto: string;
  valor_x?: number;
  valor_y?: number;
  tema?: string;
  liderazgo?: string;
  valor?: string;
  boost_y?: number;
}

export interface Pregunta {
  id: number;
  pregunta: string;
  tipo: 'opcion_multiple' | 'escala' | 'casillas_multiples' | 'desplegable';
  opciones?: Opcion[];
  rango?: [number, number];
  labels?: { [key: number]: string };
  peso_x?: number;
  peso_y?: number;
  minimo?: number;
  maximo?: number;
}

export const preguntas: Pregunta[] = [
  {
    id: 1,
    pregunta: "¿Qué te hace sentir más orgulloso de Guerrero?",
    tipo: "opcion_multiple",
    opciones: [
      { id: "A", texto: "Nuestra riqueza cultural e histórica 🎨", valor_x: 0, valor_y: 40, tema: "Cultural" },
      { id: "B", texto: "La belleza natural y playas 🏖️", valor_x: 50, valor_y: 30, tema: "Ambiental" },
      { id: "C", texto: "La resistencia y lucha social ✊", valor_x: 90, valor_y: 80, tema: "Social" },
      { id: "D", texto: "El potencial económico y turístico 💼", valor_x: 20, valor_y: 10, tema: "Económico" },
      { id: "E", texto: "La diversidad y pluralidad 🌈", valor_x: 70, valor_y: 60, tema: "Social" }
    ]
  },
  {
    id: 2,
    pregunta: "¿Qué tan importante es para ti que el gobierno priorice la SEGURIDAD?",
    tipo: "escala",
    rango: [1, 10],
    labels: { 1: "Poco importante", 10: "Muy importante" },
    peso_y: 7
  },
  {
    id: 3,
    pregunta: "¿Cuál frase describe mejor tu visión de futuro para Guerrero?",
    tipo: "opcion_multiple",
    opciones: [
      { id: "A", texto: "Un Guerrero próspero con empresas y empleos 📈", valor_x: 20, valor_y: 10, tema: "Económico" },
      { id: "B", texto: "Un Guerrero seguro donde familias vivan sin miedo 🛡️", valor_x: 30, valor_y: 90, tema: "Seguridad" },
      { id: "C", texto: "Un Guerrero justo con igualdad de oportunidades ⚖️", valor_x: 80, valor_y: 70, tema: "Social" },
      { id: "D", texto: "Un Guerrero verde que proteja su naturaleza 🌱", valor_x: 60, valor_y: 50, tema: "Ambiental" },
      { id: "E", texto: "Un Guerrero con educación y salud de calidad 🎓", valor_x: 70, valor_y: 80, tema: "Social" }
    ]
  },
  {
    id: 4,
    pregunta: "Si tuvieras $1,000 millones para Guerrero, ¿cuáles 3 ÁREAS priorizarías?",
    tipo: "casillas_multiples",
    minimo: 1,
    maximo: 3,
    opciones: [
      { id: "seguridad", texto: "Seguridad pública 🚓", tema: "Seguridad", boost_y: 15 },
      { id: "educacion", texto: "Educación 📚", tema: "Social", boost_y: 10 },
      { id: "salud", texto: "Salud 🏥", tema: "Social", boost_y: 10 },
      { id: "infraestructura", texto: "Infraestructura 🛤️", tema: "Económico", boost_y: 8 },
      { id: "empleo", texto: "Empleos y apoyo a productores 💼", tema: "Económico", boost_y: 5 },
      { id: "ambiente", texto: "Medio ambiente 🌳", tema: "Ambiental", boost_y: 7 }
    ]
  },
  {
    id: 5,
    pregunta: "¿Cuál problema debe resolverse PRIMERO en Guerrero?",
    tipo: "opcion_multiple",
    opciones: [
      { id: "A", texto: "La violencia e inseguridad 🚨", valor_x: 40, valor_y: 90, tema: "Seguridad" },
      { id: "B", texto: "La pobreza y falta de empleos 💰", valor_x: 30, valor_y: 40, tema: "Económico" },
      { id: "C", texto: "La corrupción y mal gobierno ⚠️", valor_x: 60, valor_y: 60, tema: "Institucional" },
      { id: "D", texto: "La falta de servicios básicos 🚰", valor_x: 50, valor_y: 70, tema: "Social" },
      { id: "E", texto: "La desigualdad y discriminación 📊", valor_x: 80, valor_y: 75, tema: "Social" }
    ]
  },
  {
    id: 6,
    pregunta: "¿Cómo te sientes sobre la legalización de la amapola para uso medicinal en Guerrero?",
    tipo: "escala",
    rango: [1, 10],
    labels: { 1: "Totalmente en contra 😡", 10: "Totalmente a favor 😊" },
    peso_x: 8
  },
  {
    id: 7,
    pregunta: "¿Qué tipo de líder necesita Guerrero?",
    tipo: "opcion_multiple",
    opciones: [
      { id: "A", texto: "Un técnico experto 🎓", valor_x: 30, valor_y: 30, liderazgo: "Técnico" },
      { id: "B", texto: "Un líder carismático 🌟", valor_x: 50, valor_y: 70, liderazgo: "Carismático" },
      { id: "C", texto: "Un negociador dialogante 🤝", valor_x: 60, valor_y: 50, liderazgo: "Dialogante" },
      { id: "D", texto: "Un ejecutor firme 💪", valor_x: 40, valor_y: 80, liderazgo: "Ejecutor" },
      { id: "E", texto: "Un representante del pueblo 👥", valor_x: 85, valor_y: 65, liderazgo: "Popular" }
    ]
  },
  {
    id: 8,
    pregunta: "¿Estás más cerca de cuál postura?",
    tipo: "opcion_multiple",
    opciones: [
      { id: "A", texto: "El gobierno debe intervenir en la economía 🏛️", valor_x: 85, valor_y: 70 },
      { id: "B", texto: "El libre mercado debe generar empleos 📊", valor_x: 15, valor_y: 20 }
    ]
  },
  {
    id: 9,
    pregunta: "¿Qué tanto apoyas que Guerrero tenga mayor autonomía del gobierno federal?",
    tipo: "escala",
    rango: [1, 10],
    labels: { 1: "Prefiero coordinación federal", 10: "Queremos más autonomía" }
  },
  {
    id: 10,
    pregunta: "Para mí, un buen gobierno debe ser principalmente...",
    tipo: "opcion_multiple",
    opciones: [
      { id: "A", texto: "Eficiente y que resuelva rápido ⚡", valor_x: 40, valor_y: 40, valor: "Eficiencia" },
      { id: "B", texto: "Honesto y transparente 💎", valor_x: 60, valor_y: 50, valor: "Transparencia" },
      { id: "C", texto: "Cercano al pueblo y que escuche 👂", valor_x: 75, valor_y: 70, valor: "Participación" },
      { id: "D", texto: "Firme y que haga respetar la ley ⚖️", valor_x: 30, valor_y: 80, valor: "Autoridad" },
      { id: "E", texto: "Innovador con nuevas ideas 💡", valor_x: 70, valor_y: 55, valor: "Innovación" }
    ]
  }
];

export const preguntaBonus: Pregunta = {
  id: 11,
  pregunta: "¿De qué municipio de Guerrero eres? (Opcional)",
  tipo: "desplegable",
  opciones: [
    { id: "0", texto: "Prefiero no decir" },
    { id: "1", texto: "Acapulco de Juárez" },
    { id: "2", texto: "Chilpancingo de los Bravo" },
    { id: "3", texto: "Iguala de la Independencia" },
    { id: "4", texto: "Zihuatanejo de Azueta" },
    { id: "5", texto: "Chilapa de Álvarez" },
    { id: "6", texto: "Tlapa de Comonfort" },
    { id: "7", texto: "Taxco de Alarcón" },
    { id: "8", texto: "Ometepec" },
    { id: "9", texto: "Ayutla de los Libres" },
    { id: "10", texto: "Atoyac de Álvarez" },
    { id: "11", texto: "Coyuca de Benítez" },
    { id: "12", texto: "Tecpan de Galeana" },
    { id: "13", texto: "Petatlán" },
    { id: "14", texto: "Cruz Grande" },
    { id: "15", texto: "San Marcos" },
    { id: "16", texto: "Arcelia" },
    { id: "17", texto: "Tixtla de Guerrero" },
    { id: "18", texto: "Huitzuco de los Figueroa" },
    { id: "19", texto: "Teloloapan" },
    { id: "20", texto: "Otro municipio de Guerrero" },
    { id: "21", texto: "Vivo fuera de Guerrero" }
  ]
};

export const mensajesMotivacionales = [
  "¡Excelente! 🎯",
  "Perfecto, seguimos... 💪",
  "¡Vas muy bien! 🌟",
  "Solo unas más... ⚡",
  "¡Casi lo logras! 🔥",
  "¡Última pregunta! 🎉"
];
