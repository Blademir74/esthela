# ⚡ Instrucciones Rápidas de Uso

## 🚀 Inicio Rápido (3 minutos)

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Ejecutar en Desarrollo
```bash
npm run dev
```

Abre http://localhost:3000 en tu navegador.

### 3. Probar la Aplicación
1. Haz clic en "Descubre Tu Perfil"
2. Responde las 10 preguntas
3. Ve tu resultado con imagen compartible

## 📱 Testing en Móvil

### Opción 1: Desde tu celular en la misma red
1. Encuentra tu IP local:
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig`
2. Abre en tu celular: `http://TU_IP:3000`

### Opción 2: Usar ngrok
```bash
npx ngrok http 3000
```
Abre la URL que te da ngrok en cualquier dispositivo.

## 🌐 Deployment en Vercel (5 minutos)

### Opción A: Deploy Automático desde GitHub
1. Sube el código a GitHub:
```bash
git init
git add .
git commit -m "Mapa Político Guerrero"
git remote add origin https://github.com/TU_USUARIO/mapa-politico-guerrero.git
git push -u origin main
```

2. Ve a [vercel.com](https://vercel.com)
3. Clic en "Add New Project"
4. Importa tu repositorio de GitHub
5. Clic en "Deploy"
6. ¡Listo! Tendrás una URL pública

### Opción B: Deploy desde CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

## 🎨 Personalización Rápida

### Cambiar Colores
Edita `tailwind.config.ts` o `app/globals.css`

### Modificar Preguntas
Edita `lib/preguntas.ts` - Solo cambia los textos, respeta la estructura de datos

### Cambiar Textos
- Landing: `app/page.tsx`
- Encuesta: `app/encuesta/page.tsx`
- Resultados: `app/resultado/page.tsx`

### Cambiar Logo/Imagen
Reemplaza `public/assets/guerrero-map.png` con tu imagen

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Compilar para producción
npm run build

# Iniciar versión de producción localmente
npm start

# Linter
npm run lint
```

## ⚠️ Troubleshooting Común

### Error: "Cannot find module 'canvas'"
```bash
npm install canvas --force
```

### Error: "Port 3000 is already in use"
```bash
# Mata el proceso en puerto 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Las imágenes no se generan
Verifica que `public/assets/guerrero-map.png` existe.

### Errores de TypeScript
```bash
npm run build
```
Si hay errores, léelos y corrige uno por uno.

## 📊 Ver Estadísticas

En desarrollo, puedes agregar:
```javascript
console.log(localStorage.getItem('respuestas_guerrero'))
```
en la consola del navegador para ver las respuestas guardadas.

## 🎯 Variables de Entorno (Opcional)

Crea `.env.local`:
```env
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Revisa la terminal donde corre `npm run dev`
3. Lee los errores completos
4. Busca en la documentación de Next.js

## 🎉 ¡Listo para Lanzar!

Cuando todo funcione localmente:
1. Haz deployment en Vercel
2. Configura un dominio personalizado (opcional)
3. Comparte tu URL en redes sociales
4. ¡Disfruta de la viralidad! 🚀

---

**Tip Pro:** Prueba con amigos ANTES del lanzamiento público. Pide feedback honesto.

#MiPerfilPolíticoGuerrero
