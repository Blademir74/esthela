# Esthela Damián Peralta · Centro de Mando Digital

Landing page de alto impacto para la aspiración a la Coordinación de Morena en Guerrero — rumbo al **22 de junio**.

## 🎯 Identidad

- **Paleta**: Guinda Morena `#6B1D3A` · Dorado Autoridad `#D4A843` · Blanco puro
- **Concepto**: *"Forjada desde joven en el trabajo comunitario"*
- **Optimizado para móviles** (90% del tráfico en Guerrero)
- **Vanilla HTML/CSS/JS** — sin frameworks, sin dependencias, carga instantánea incluso con señal débil

## 📂 Estructura

```
esthela-landing/
├── index.html          # Marcado semántico + SEO + OG tags
├── styles.css          # Glassmorphism institucional + mobile-first
├── script.js           # Pulso Digital, Heatmap, Countdown, Supabase
├── assets/
│   ├── img/
│   │   ├── hero-guerrero.jpg        # Fondo cinematográfico Sierra Madre
│   │   └── esthela-placeholder.jpg  # Placeholder institucional
│   └── icons/
└── README.md
```

## 🔥 Secciones implementadas

| Sección | Descripción |
|---------|-------------|
| **Hero Impacto** | Imagen cinematográfica 2K + H1/H2 estratégicos + stats "25 · 81 · 1" |
| **Verdad vs. Mito** | Glassmorphism dual: desmiente imposición. Refuerzo biografía UAGro |
| **Pulso Digital** | Votación 1-click anónima (localStorage + browser fingerprint SHA-256) |
| **Heatmap Guerrero** | SVG interactivo 7 regiones + ranking top 5 en vivo |
| **Movilización Roles** | 3 roles: Promotor · Enlace · Creador — WhatsApp **solo aquí** |
| **Countdown + Reporting** | Reloj al 22 junio + dashboard con sparkline semanal |
| **Share viral** | WhatsApp, Facebook, X, Telegram, copiar enlace |
| **FAB WhatsApp** | Flotante con animación pulse siempre visible |

## ⚙️ Configuración — 3 niveles

### Nivel 1: Demo local (funciona out-of-the-box)
No requiere configuración. Abre `index.html` directamente. Usa localStorage + baseline simulado.

### Nivel 2: Integración Supabase (recomendado para producción)

1. Crea proyecto gratis en [supabase.com](https://supabase.com)
2. En el **SQL Editor**, ejecuta the SQL al final de `script.js` (está comentado)
3. Edita `script.js` líneas 13-14:
   ```js
   const SUPABASE_URL      = 'https://TU-PROYECTO.supabase.co';
   const SUPABASE_ANON_KEY = 'eyJhbGci...';
   ```
4. ¡Listo! Los votos ya persisten en la nube.

### Nivel 3: Personalización final
- **WhatsApp real**: cambia `WHATSAPP_NUMBER` en `script.js` y el href del FAB en `index.html`
- **Fecha**: `TARGET_DATE` en `script.js` (línea ~25)
- **Imágenes**: reemplaza `assets/img/hero-guerrero.jpg` y `esthela-placeholder.jpg` con las reales

## 🚀 Despliegue

### Vercel (1 clic)
```bash
npm i -g vercel
cd esthela-landing
vercel --prod
```

### Netlify (drag & drop)
Arrastra la carpeta completa a [app.netlify.com/drop](https://app.netlify.com/drop).

### GitHub Pages
1. Sube a un repo público
2. Settings → Pages → Branch `main` / root
3. URL lista en 2 min

### Hosting tradicional
Sube los archivos vía FTP a `public_html/`. Sin PHP, sin Node.js, solo archivos estáticos.

## 🔒 Privacidad

- **Pulso Digital**: 100% anónimo. Browser fingerprint SHA-256 + localStorage. Sin cookies, sin tracking.
- **Geolocalización**: Por IP vía `ipapi.co` (sin API key, precisión regional).
- **WhatsApp**: solicitado **únicamente** en formulario de roles (consentimiento explícito).
- **Cumple GDPR/LFPDPPP** por diseño.

## 📊 KPIs medibles

- Pulsos registrados (total, hoy, semana)
- Distribución Sí / Duda / No
- Heatmap regional (7 regiones de Guerrero)
- Tendencia 7 días (sparkline)
- Conversión a roles (promotores, enlaces, creadores)
- Shares virales por plataforma

## 🎨 Decisiones de diseño

- **Glassmorphism** con backdrop-filter sutil (20-30px blur) + borde dorado
- **Fallback sólido** para navegadores sin soporte
- **`prefers-reduced-motion`**: respeta usuarios con sensibilidad al movimiento
- **`prefers-reduced-data`**: reduce efectos en conexiones lentas (ideal zonas rurales Guerrero)
- **LCP <1s**: imagen hero con `fetchpriority="high"` + preload
- **CLS = 0**: `aspect-ratio` en todos los contenedores de media
- **SVG inline** (mapa, iconos, sparklines) — cero peticiones HTTP extra
- **Supabase REST API** (sin SDK, peso mínimo)

---

**Hecho con 💛 desde Guerrero · Para Morena · Rumbo al 22 de junio**
