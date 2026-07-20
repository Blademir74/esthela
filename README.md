# 🗺️ Mapa Político Viral de Guerrero

Una plataforma web interactiva viral tipo "Spotify Wrapped" para descubrir perfiles políticos personalizados en Guerrero, México.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Características Principales

- ✅ **Encuesta Interactiva**: 10 preguntas gamificadas tipo conversacional
- ✅ **Algoritmo Inteligente**: Análisis político basado en ejes ideológicos
- ✅ **Generación de Imágenes**: Resultados personalizados compartibles (1080x1080px)
- ✅ **100% Anónimo**: Sin registro, sin spam, sin tracking invasivo
- ✅ **Diseño Viral**: Optimizado para compartir en redes sociales
- ✅ **Responsive**: Funciona perfectamente en móvil y desktop
- ✅ **Performance**: Carga ultra rápida con Next.js 14

## 🚀 Demo en Vivo

[Ver Demo](https://miperfilguerrero.com) _(pendiente de deployment)_

## 📸 Screenshots

### Landing Page
Landing page moderna con contador en vivo de participantes.

### Encuesta Interactiva
Preguntas tipo conversacional con barra de progreso y animaciones.

### Página de Resultados
Resultados personalizados con imagen compartible generada automáticamente.

## 🛠️ Stack Tecnológico

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [TailwindCSS](https://tailwindcss.com/)
- **Animaciones**: [Framer Motion](https://www.framer.com/motion/)
- **Generación de Imágenes**: [node-canvas](https://github.com/Automattic/node-canvas)
- **Confetti**: [react-confetti](https://www.npmjs.com/package/react-confetti)
- **Deployment**: [Vercel](https://vercel.com/)

## 📦 Instalación

### Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/mapa-politico-guerrero.git
cd mapa-politico-guerrero
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno** (opcional)
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus valores:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
mapa-politico-guerrero/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── encuesta/
│   │   └── page.tsx            # Página de encuesta interactiva
│   ├── procesando/
│   │   └── page.tsx            # Pantalla de carga
│   ├── resultado/
│   │   └── page.tsx            # Página de resultados
│   ├── api/
│   │   └── generar-imagen/
│   │       └── route.ts        # API para generar imágenes
│   ├── layout.tsx              # Layout global
│   └── globals.css             # Estilos globales
├── lib/
│   ├── preguntas.ts            # Banco de preguntas
│   └── algoritmo.ts            # Lógica del algoritmo político
├── public/
│   └── assets/
│       └── guerrero-map.png    # Mapa de Guerrero
├── package.json
├── tsconfig.json
└── README.md
```

## 🧮 Algoritmo de Cálculo

El algoritmo analiza las respuestas en dos ejes principales:

### Eje X (0-100): Conservador ↔ Progresista
- Posición económica
- Visión social
- Apertura al cambio

### Eje Y (0-100): Libertario ↔ Autoritario
- Rol del Estado
- Prioridad de seguridad
- Autonomía regional

### Perfiles Resultantes

| Posición X | Posición Y | Etiqueta |
|-----------|-----------|----------|
| 0-35 | 0-35 | Conservador Liberal |
| 0-35 | 35-65 | Conservador Moderado |
| 0-35 | 65-100 | Conservador Autoritario |
| 35-65 | 0-35 | Centrista Pragmático |
| 35-65 | 35-65 | Centrista Equilibrado |
| 35-65 | 65-100 | Centrista Social |
| 65-100 | 0-35 | Progresista Libertario |
| 65-100 | 35-65 | Progresista Moderado |
| 65-100 | 65-100 | Progresista Radical |

## 🎨 Generación de Imágenes

Las imágenes compartibles se generan dinámicamente usando Canvas:

- **Formato**: PNG 1080x1080px (Instagram Post)
- **Elementos**:
  - Fondo con degradado según perfil
  - Mapa de Guerrero desvanecido
  - Etiqueta de perfil destacada
  - Mapa político miniatura con marcador
  - Estadísticas principales
  - Dato sorprendente
  - CTA para compartir
  - Hashtag #MiPerfilPolíticoGuerrero

## 🌐 Deployment

### Vercel (Recomendado)

1. **Push a GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Conectar con Vercel**
- Ve a [vercel.com](https://vercel.com)
- Importa tu repositorio
- Configura variables de entorno
- Deploy automático

### Otras opciones
- Netlify
- Railway
- DigitalOcean App Platform

## 📊 Métricas y Analytics

El proyecto incluye soporte para:

- **Google Analytics 4**: Tracking de visitas y conversiones
- **Custom Events**:
  - `encuesta_iniciada`
  - `pregunta_completada`
  - `resultado_generado`
  - `imagen_compartida`
  - `compartir_whatsapp`
  - `compartir_twitter`
  - `compartir_facebook`

Para activar analytics, configura `NEXT_PUBLIC_GA_ID` en tus variables de entorno.

## 🔒 Privacidad y Seguridad

- ✅ **Sin registro**: No se requiere cuenta
- ✅ **Datos anónimos**: No se almacenan identificadores personales
- ✅ **LocalStorage**: Datos solo en el navegador del usuario
- ✅ **Sin cookies invasivas**: Solo cookies técnicas necesarias
- ✅ **GDPR Compliant**: Cumple con regulaciones de privacidad

## 🎯 Roadmap

### Fase 1 (Actual)
- [x] Landing page
- [x] Encuesta interactiva
- [x] Algoritmo de cálculo
- [x] Generación de imágenes
- [x] Página de resultados

### Fase 2 (Próxima)
- [ ] Dashboard administrativo
- [ ] Estadísticas en tiempo real
- [ ] Mapa de calor de municipios
- [ ] Base de datos (Supabase)
- [ ] Sistema de referidos

### Fase 3 (Futuro)
- [ ] Comparación con amigos
- [ ] Histórico de resultados
- [ ] Informe PDF descargable
- [ ] App móvil nativa
- [ ] Multi-idioma

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más información.

## 👥 Autores

- **Tu Nombre** - *Desarrollo inicial* - [@tu_twitter](https://twitter.com/tu_twitter)

## 🙏 Agradecimientos

- Inspirado en el concepto "Spotify Wrapped"
- Comunidad de Guerrero
- Contributors y testers

## 📧 Contacto

- **Email**: contacto@miperfilguerrero.com
- **Twitter**: [@MapaPoliticoGRO](https://twitter.com/MapaPoliticoGRO)
- **Facebook**: [MiPerfilGuerrero](https://facebook.com/MiPerfilGuerrero)

## 🐛 Reportar Bugs

Si encuentras algún bug, por favor crea un [issue](https://github.com/tu-usuario/mapa-politico-guerrero/issues) describiendo:

1. Qué esperabas que sucediera
2. Qué sucedió realmente
3. Pasos para reproducir el error
4. Screenshots (si aplica)

## 💡 Preguntas Frecuentes

### ¿Es gratis?
Sí, 100% gratis y sin registro.

### ¿Mis respuestas son privadas?
Sí, solo se almacenan en tu navegador (localStorage).

### ¿Puedo usar esto para otro estado/país?
Sí, el código es open source. Puedes adaptarlo fácilmente.

### ¿Cómo cambio las preguntas?
Edita el archivo `lib/preguntas.ts`.

### ¿Cómo personalizo los colores?
Los colores se definen en `tailwind.config.ts` y `app/globals.css`.

---

**⭐ Si te gusta este proyecto, dale una estrella en GitHub!**

#MiPerfilPolíticoGuerrero
