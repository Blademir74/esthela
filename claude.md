PROYECTO: ESTHELA DAMIÁN - CENTRO DE MANDO DIGITAL (FASE: SELECCIÓN DE LA ESPERANZA)
🎖️ CONTEXTO DE MISIÓN CRÍTICA
Este no es un sitio web común; es una herramienta de movilización política de nivel gubernatura. Esthela Damián es la "Mujer de Confianza del Proyecto de Nación" y el "Puente Probado" hacia el bienestar de Guerrero.
Nuestra meta: Ganar la coordinación este 22 de junio. Nuestra mística: 40 años de trayectoria (iniciada a los 15 años en territorio guerrerense). Nuestra estética: "Gama" Premium. Sofisticación deportiva (Fútbol de Élite) mezclada con autoridad política.
💻 ENTORNO DE PRODUCCIÓN
El proyecto se encuentra en producción activa. Debes trabajar estrictamente sobre la siguiente estructura de archivos y rutas:
🛠️ Rutas del Core App (Next.js/React):
Directorio Raíz: C:\Users\campe\Desktop\esthela-landing\app
Estilos Globales: global.css (Configuración de paleta Guinda #6B1D3A y Oro #D4A843).
Estructura Base: layout.tsx (Head, Navbar, Footer institucional).
Lógica Principal: page.tsx (Aquí ejecutaremos el giro futbolero y el nuevo sistema de registro).
🖼️ Activos Visuales (Imágenes):
Las imágenes están ubicadas en la ruta de recursos del proyecto. Se deben utilizar para:
Hero Section: Imágenes de Esthela en Acapulco, Chilpancingo y Taxco (estilo travel sketch/acuarela).
Registro de Titulares: Fondos dinámicos que representen la "Selección de la Esperanza".
Módulo de Tarjetas: Activos para generar el cromo digital personalizado.
⚡ NUEVA JUGADA: "RED DE TITULARES"
Debes transformar la sección de "Pulso" en la "Red de Titulares de la Esperanza". El usuario ya no solo se registra; se integra a la alineación oficial de Esthela.
📝 Requerimientos del Formulario (Registro de Nuevo Voluntario):
Debes implementar un formulario de alta conversión vinculado a Supabase con los siguientes campos:
Identidad: Nombre(s), Apellido Paterno, Apellido Materno.
Contacto: Correo Electrónico, Teléfono Celular* (Validación 10 dígitos).
Territorio: Dirección Completa, Municipio*, Distrito Local, Sección Electoral*.
Estructura: Zona de Atención, Redes Sociales.
🎨 DINÁMICA: GENERADOR DE TARJETAS DIGITALES
El sistema debe permitir que el usuario, tras registrarse, cree su Ficha Oficial de Jugador en la URL: /Tarjetas.
Instrucciones de Programación para Claude:
Habilidades: Implementa lógica para subir foto, escalar, rotar y aplicar marcos.
Modelos (3 Variantes):
Estampa Mundialista: Bordes dorados, estilo holográfico Morena.
Yo estoy de #Esthelado: Estilo viral, fresco, tipografía moderna.
Yo Camino con Esthela: Estilo acuarela/territorial.
Campos en la Tarjeta: Nombre Jugador, Fecha de Nacimiento (Opcional), Equipo / Municipio.
🎯 REGLAS DE ORO PARA LA IA
Identidad: Siempre usa 40 años de trayectoria. Esthela es la capitana con experiencia.
Tono: Nada de respuestas robóticas. Habla como un estratega de campaña.
Diseño: Usa Glassmorphism, bordes dorados (#D4A843) y tipografía Montserrat/Inter.
CTA: El botón principal siempre debe invitar a la acción: "¡CREAR MI RED Y ACTIVAR MI CAMBIO!".
ESTADO DE LA CARPETA: Lista para edición. OBJETIVO: Inundar Guerrero de "Titulares de la Esperanza" para el 22 de junio.
💡 Instrucción para ti, Estratega:
Entrega este MD a Claude y dile: "Claude, lee este manifiesto de producción. Tengo los archivos abiertos en C:\Users\campe\Desktop\esthela-landing\app. Necesito que procedas a modificar page.tsx para integrar el nuevo formulario de 'Red de Titulares' y que diseñes la lógica para el generador de tarjetas en /Tarjetas usando nuestras imágenes de Acapulco, Chilpancingo y Taxco."