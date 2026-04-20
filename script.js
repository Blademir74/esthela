/**
 * ESTHELA DAMIÁN — script.js v5.0 FINAL
 * ─────────────────────────────────────────────────────────────────────
 * CORRECCIONES APLICADAS:
 *
 * FIX 1 · Conflicto de merge Git ELIMINADO (líneas 589-610 del v4.0)
 *         El archivo ahora parsea correctamente en todos los navegadores.
 *         bootstrap() se ejecuta sin errores.
 *
 * FIX 2 · Tabla CORREGIDA: todas las consultas usan `votos_pulso`
 *         Campos correctos del esquema real: `anon_id` y `opcion`
 *         (ya NO se consulta la tabla 'votes' que no existe)
 *
 * FIX 3 · Votación FUNCIONAL: initPulso() adjunta listeners correctamente
 *         porque bootstrap() ya puede ejecutarse (FIX 1 desbloqueó todo)
 *
 * FIX 4 · KPI dinámico: fetchVotosCount() es una función SEPARADA que
 *         consulta `votos_pulso`, cuenta únicos por anon_id, y escribe
 *         el total REAL en #kpiVoces. Se llama en DOMContentLoaded y
 *         después de cada voto exitoso. BASE_VOCES ya NO se suma al total.
 *
 * FIX 5 · Municipios CORREGIDOS: populateMunicipios() corre porque
 *         bootstrap() llega a ejecutarse. Los 81 municipios se insertan
 *         correctamente en el <select id="municipio">.
 *
 * BONUS · Reintento automático: hasta 3 intentos con backoff exponencial
 *         (800ms → 1600ms) para zonas con señal intermitente en Guerrero.
 */

'use strict';

/* ═══════════════════════════════════════════════
   1. SUPABASE — tabla correcta: votos_pulso
   ═══════════════════════════════════════════════ */
const SUPABASE_URL = "https://iwqvrnnejiwadfxssumj.supabase.co";
const SUPABASE_KEY = "sb_publishable_qFPSGf9-iITKuAX_rWVh2w_PtEHjCZx";

let db;
try {
    if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Credenciales Supabase vacías.');
    if (typeof window.supabase === 'undefined') throw new Error('Supabase CDN no cargó.');
    db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('[Supabase] Cliente inicializado.');
} catch (e) {
    console.error('[Supabase] Error:', e.message);
    db = null;
}


/* ═══════════════════════════════════════════════
   2. CONSTANTES
   ═══════════════════════════════════════════════ */
const KEY_FP      = 'esthela_fp_v4';
const KEY_VOTED   = 'esthela_voted_v4';
const KEY_PENDING = 'esthela_pending_v1';

/* FIX 4: FALLBACK_VOCES solo se muestra si Supabase falla los 3 reintentos.
   NO se suma al total real — el KPI muestra el número de Supabase directamente. */
const FALLBACK_VOCES = 5400;

const MAX_RETRIES   = 3;
const RETRY_BASE_MS = 800;


/* ═══════════════════════════════════════════════
   3. MUNICIPIOS — 81 de Guerrero
   ═══════════════════════════════════════════════ */
const MUNICIPIOS = [
    "Acapulco de Juárez","Ahuacuotzingo","Ajuchitlán del Progreso","Alcozauca de Guerrero",
    "Alpoyeca","Apaxtla","Arcelia","Atenango del Río","Atlamajalcingo del Monte","Atlixtac",
    "Atoyac de Álvarez","Ayutla de los Libres","Azoyú","Benito Juárez","Buenavista de Cuéllar",
    "Coahuayutla de José María Izazaga","Cocula","Copala","Copalillo","Copanatoyac",
    "Coyuca de Benítez","Coyuca de Catalán","Cuajinicuilapa","Cualác","Cuautepec",
    "Cuetzala del Progreso","Cutzamala de Pinzón","Chilapa de Álvarez","Chilpancingo de los Bravo",
    "Florencio Villarreal","General Canuto A. Neri","General Heliodoro Castillo","Huamuxtitlán",
    "Huitzuco de los Figueroa","Iguala de la Independencia","Igualapa","Ixcateopan de Cuauhtémoc",
    "Zihuatanejo de Azueta","Juan R. Escudero","Leonardo Bravo","Malinaltepec","Mártir de Cuilapan",
    "Metlatónoc","Mochitlán","Olinalá","Ometepec","Pedro Ascencio Alquisiras","Petatlán",
    "Pilcaya","Pungarabato","Quechultenango","San Luis Acatlán","San Marcos","San Miguel Totolapan",
    "Taxco de Alarcón","Tecoanapa","Técpan de Galeana","Teloloapan","Tepecoacuilco de Trujano",
    "Tetipac","Tixtla de Guerrero","Tlacoachistlahuaca","Tlacoapa","Tlalchapa",
    "Tlalixtaquilla de Maldonado","Tlapa de Comonfort","Tlapehuala",
    "La Unión de Isidoro Montes de Oca","Xalpatláhuac","Xochihuehuetlán",
    "Xochistlahuaca","Zapotitlán Tablas","Zirándaro","Zitlala","Eduardo Neri","Acatepec",
    "Marquelia","Cochoapa el Grande","José Joaquín de Herrera","Juchitán","Iliatenco"
];


/* ═══════════════════════════════════════════════
   4. FINGERPRINTING SHA-256
   ═══════════════════════════════════════════════ */
function getCanvasHash() {
    try {
        const c = document.createElement('canvas');
        c.width = 200; c.height = 50;
        const ctx = c.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillStyle = '#6B1D3A';
        ctx.fillText('Guerrero 2026', 2, 2);
        ctx.strokeStyle = '#D4A843';
        ctx.strokeRect(1, 1, 198, 48);
        return c.toDataURL().slice(-80);
    } catch {
        return 'canvas-blocked';
    }
}

async function generateFingerprint() {
    const signals = [
        navigator.userAgent,
        navigator.language,
        navigator.languages ? navigator.languages.join(',') : '',
        screen.width + 'x' + screen.height,
        String(screen.colorDepth),
        String(new Date().getTimezoneOffset()),
        Intl.DateTimeFormat().resolvedOptions().timeZone,
        String(navigator.hardwareConcurrency || 0),
        String(navigator.maxTouchPoints || 0),
        getCanvasHash()
    ].join('|__|');

    const data       = new TextEncoder().encode(signals);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray  = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2,'0')).join('').slice(0, 32);
}

let _cachedFp = null;
async function getAnonId() {
    if (_cachedFp) return _cachedFp;

    const stored = localStorage.getItem(KEY_FP);
    if (stored) { _cachedFp = stored; return stored; }

    try {
        _cachedFp = 'fp_' + await generateFingerprint();
    } catch (e) {
        console.warn('[FP] Usando ID aleatorio:', e.message);
        _cachedFp = 'rnd_' + Math.random().toString(36).slice(2,11) + Date.now().toString(36);
    }
    localStorage.setItem(KEY_FP, _cachedFp);
    return _cachedFp;
}


/* ═══════════════════════════════════════════════
   5. HELPERS
   ═══════════════════════════════════════════════ */
function pad(n) { return String(n).padStart(2,'0'); }

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

let _toastTimer;
function showToast(msg) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => { el.hidden = true; }, 3800);
}


/* ═══════════════════════════════════════════════
   6. CRONÓMETRO
   — Date.UTC: compatibilidad Chrome Android / Samsung Browser
   ═══════════════════════════════════════════════ */
const TARGET_TS = Date.UTC(2026, 5, 22, 5, 0, 0);

function initCountdown() {
    const elD = document.getElementById('cdDays');
    const elH = document.getElementById('cdHours');
    const elM = document.getElementById('cdMins');
    const elS = document.getElementById('cdSecs');
    if (!elD) return;

    const tick = () => {
        const diff = TARGET_TS - Date.now();
        if (diff <= 0) {
            const wrap = document.getElementById('countdownClock');
            if (wrap) wrap.innerHTML = '<span style="color:var(--dorado-light);font-size:1.4rem;font-weight:700">¡HOY ES EL DÍA!</span>';
            return;
        }
        elD.textContent = pad(Math.floor(diff / 86400000));
        elH.textContent = pad(Math.floor((diff % 86400000) / 3600000));
        elM.textContent = pad(Math.floor((diff % 3600000) / 60000));
        elS.textContent = pad(Math.floor((diff % 60000) / 1000));
    };
    tick();
    setInterval(tick, 1000);
}


/* ═══════════════════════════════════════════════
   7. MUNICIPIOS — FIX 5: corre porque bootstrap() ya funciona
   ═══════════════════════════════════════════════ */
function populateMunicipios() {
    const select = document.getElementById('municipio');
    if (!select || select.options.length > 1) return;

    const sorted = [...MUNICIPIOS].sort((a,b) => a.localeCompare(b,'es'));
    const frag   = document.createDocumentFragment();
    sorted.forEach(m => {
        const opt = document.createElement('option');
        opt.value = opt.textContent = m;
        frag.appendChild(opt);
    });
    select.appendChild(frag);
}


/* ═══════════════════════════════════════════════
   8. KPI HERO — fetchVotosCount()
   FIX 4: Función SEPARADA, tabla `votos_pulso`, sin BASE_VOCES sumada.
   Cuenta votantes únicos por anon_id. Reintenta hasta 3 veces.
   ═══════════════════════════════════════════════ */
async function fetchVotosCount(attempt = 1) {
    if (!db) return null;
    try {
        /* Descarga solo la columna anon_id — la más ligera posible.
           Deduplicamos en cliente con Set para contar votantes únicos. */
        const { data, error } = await db
            .from('votos_pulso')
            .select('anon_id');

        if (error) throw error;

        return new Set((data || []).map(r => r.anon_id)).size;

    } catch (err) {
        if (attempt < MAX_RETRIES) {
            const delay = RETRY_BASE_MS * attempt;
            console.warn(`[KPI] Intento ${attempt}/${MAX_RETRIES} — reintentando en ${delay}ms`);
            await sleep(delay);
            return fetchVotosCount(attempt + 1);
        }
        console.error('[KPI] Sin conexión tras 3 intentos.');
        return null;
    }
}

async function actualizarKpiVoces() {
    const kpi = document.getElementById('kpiVoces');
    if (!kpi) return;

    const total = await fetchVotosCount();

    if (total !== null) {
        kpi.textContent = '+' + total.toLocaleString('es-MX');
        console.log('[KPI] Total real:', total);
    } else {
        /* Fallback solo cuando Supabase es inalcanzable. */
        kpi.textContent = '+' + FALLBACK_VOCES.toLocaleString('es-MX');
    }
}


/* ═══════════════════════════════════════════════
   9. PULSO — fetchVoteCounts() para barras del termómetro
   FIX 2: Tabla `votos_pulso`, campo `opcion`. Con reintento.
   ═══════════════════════════════════════════════ */
let votingInProgress = false;

async function fetchVoteCounts(attempt = 1) {
    const fallback = { si: 0, dudo: 0, no: 0 };
    if (!db) return fallback;

    try {
        const { data, error } = await db
            .from('votos_pulso')
            .select('opcion');

        if (error) throw error;
        if (!data || data.length === 0) return fallback;

        return {
            si:   data.filter(v => v.opcion === 'si').length,
            dudo: data.filter(v => v.opcion === 'dudo' || v.opcion === 'pienso').length,
            no:   data.filter(v => v.opcion === 'no').length,
        };
    } catch (err) {
        if (attempt < MAX_RETRIES) {
            await sleep(RETRY_BASE_MS * attempt);
            return fetchVoteCounts(attempt + 1);
        }
        return fallback;
    }
}

function renderBars(counts) {
    const total = counts.si + counts.dudo + counts.no;
    const pct   = v => total > 0 ? Math.round((v / total) * 100) : 0;

    const pSi   = pct(counts.si);
    const pDudo = pct(counts.dudo);
    const pNo   = pct(counts.no);

    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('pctSi',     pSi   + '%');
    set('pctPienso', pDudo + '%');
    set('pctNo',     pNo   + '%');

    const animBar = (id, val) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.style.transition = 'none';
        el.style.width = '0%';
        requestAnimationFrame(() => requestAnimationFrame(() => {
            el.style.transition = 'width 1.4s cubic-bezier(.2,.8,.2,1)';
            el.style.width = val + '%';
        }));
    };
    animBar('barSi',     pSi);
    animBar('barPienso', pDudo);
    animBar('barNo',     pNo);
}


/* ═══════════════════════════════════════════════
   10. SYNC PENDIENTES
   FIX 2: Tabla `votos_pulso`, campos `anon_id` y `opcion`
   ═══════════════════════════════════════════════ */
async function syncPendingVotes() {
    if (!db) return;
    const pending = localStorage.getItem(KEY_PENDING);
    if (!pending) return;

    try {
        const anonId = await getAnonId();
        const { error } = await db.from('votos_pulso').insert([{
            anon_id:    anonId,
            opcion:     pending,
            created_at: new Date().toISOString()
        }]);

        if (error) {
            if (error.code === '23505') {
                // UNIQUE constraint: ya existía — limpiar pending sin reenviar
                localStorage.removeItem(KEY_PENDING);
                console.log('[Sync] Voto ya existía en DB (duplicate key).');
            } else {
                console.error('[Sync] Error Supabase:', error.message);
            }
            return;
        }

        localStorage.removeItem(KEY_PENDING);
        console.log('[Sync] Voto pendiente sincronizado.');

        // FIX 4: Actualizar KPI y barras tras sync exitoso
        actualizarKpiVoces();
        fetchVoteCounts().then(renderBars);

    } catch (err) {
        console.warn('[Sync] Sin red — se reintentará al recargar.');
    }
}


/* ═══════════════════════════════════════════════
   11. REGISTRO DE VOTO — registerVote()
   FIX 2: Tabla `votos_pulso`, campos `anon_id` y `opcion`
   FIX 4: Llama actualizarKpiVoces() post-insert exitoso
   ═══════════════════════════════════════════════ */
async function registerVote(voteType) {
    if (localStorage.getItem(KEY_VOTED)) return;
    if (votingInProgress) return;
    votingInProgress = true;

    const optionsDiv = document.getElementById('pulsoOptions');
    const resultDiv  = document.getElementById('pulsoResult');
    const loader     = document.getElementById('loaderPulso');
    const shareMod   = document.getElementById('shareModule');

    // A) Offline-first: guardar en localStorage antes de tocar la red
    localStorage.setItem(KEY_VOTED,   voteType);
    localStorage.setItem(KEY_PENDING, voteType);

    // B) UI optimista — respuesta instantánea para el usuario
    if (optionsDiv) optionsDiv.hidden = true;
    if (loader)     loader.hidden     = true;
    if (resultDiv)  resultDiv.hidden  = false;
    if (shareMod)   shareMod.hidden   = false;
    showToast('¡Tu voz ha sido registrada con éxito!');

    // Mostrar barras con incremento local mientras llega la respuesta real
    fetchVoteCounts().then(counts => {
        counts[voteType] = (counts[voteType] || 0) + 1;
        renderBars(counts);
    });

    // C) Persistencia en Supabase en segundo plano
    (async () => {
        try {
            if (!db) {
                console.warn('[Vote] Supabase no disponible. Voto queda en KEY_PENDING.');
                return;
            }
            const anonId = await getAnonId();
            const { error } = await db.from('votos_pulso').insert([{
                anon_id:    anonId,
                opcion:     voteType,
                created_at: new Date().toISOString()
            }]);

            if (error) {
                if (error.code === '23505') {
                    console.log('[Vote] Duplicado detectado por Supabase.');
                    localStorage.removeItem(KEY_PENDING);
                } else {
                    console.error('[Vote] Error insert:', error.message);
                }
                return;
            }

            localStorage.removeItem(KEY_PENDING);
            console.log('[Vote] Voto sincronizado con Supabase.');

            // FIX 4: Actualizar KPI con dato real post-insert
            actualizarKpiVoces();
            const realCounts = await fetchVoteCounts();
            renderBars(realCounts);

        } catch (err) {
            console.error('[Vote] Error de red:', err.message);
        } finally {
            votingInProgress = false;
        }
    })();
}


/* ═══════════════════════════════════════════════
   12. INIT PULSO — FIX 3: funciona porque bootstrap() llega aquí
   ═══════════════════════════════════════════════ */
function initPulso() {
    const hasVoted   = localStorage.getItem(KEY_VOTED);
    const optionsDiv = document.getElementById('pulsoOptions');
    const loader     = document.getElementById('loaderPulso');
    const resultDiv  = document.getElementById('pulsoResult');

    if (hasVoted) {
        // Ya votó: ocultar botones, mostrar termómetro con datos reales
        if (optionsDiv) optionsDiv.hidden = true;
        if (loader)     loader.hidden     = false;
        if (resultDiv)  resultDiv.hidden  = true;

        fetchVoteCounts().then(counts => {
            if (loader)    loader.hidden    = true;
            if (resultDiv) resultDiv.hidden = false;
            renderBars(counts);
            const shareMod = document.getElementById('shareModule');
            if (shareMod) shareMod.hidden = false;
        });

    } else {
        // Primera visita: mostrar botones y adjuntar listeners
        if (optionsDiv) optionsDiv.hidden = false;
        if (loader)     loader.hidden     = true;
        if (resultDiv)  resultDiv.hidden  = true;

        /* Listeners DIRECTOS — sin cloneNode que rompe data-vote en Android */
        document.querySelectorAll('.pulso-btn[data-vote]').forEach(btn => {
            btn.addEventListener('click', () => {
                const vote = btn.getAttribute('data-vote');
                if (vote && !votingInProgress) registerVote(vote);
            });
        });
    }
}


/* ═══════════════════════════════════════════════
   13. COMPARTIR
   ═══════════════════════════════════════════════ */
function initSharing() {
    const url = window.location.href.split('#')[0];
    const msg = `¡Yo ya respaldé a Esthela Damián para Coordinadora de Guerrero!\n\nDeja tu Pulso Digital aquí: ${url}`;

    const wa = document.getElementById('btnShareWhatsApp');
    if (wa) wa.addEventListener('click', () =>
        window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(msg), '_blank', 'noopener,noreferrer'));

    const fb = document.getElementById('btnShareFacebook');
    if (fb) fb.addEventListener('click', () =>
        window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url), 'fb-share', 'width=800,height=600'));

    const copy    = document.getElementById('btnCopyLink');
    const copyTxt = document.getElementById('copyLinkText');
    if (copy && copyTxt) {
        copy.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(url);
                copyTxt.textContent = '¡Copiado!';
                showToast('Enlace copiado al portapapeles');
                setTimeout(() => { copyTxt.textContent = 'Copiar enlace'; }, 3000);
            } catch {
                showToast('Copia la URL desde la barra del navegador.');
            }
        });
    }
}


/* ═══════════════════════════════════════════════
   14. FORMULARIO SIMPATIZANTES
   FIX 1: Merge conflict resuelto — versión única y correcta
   ═══════════════════════════════════════════════ */
function initForm() {
    const form = document.getElementById('simpatizanteForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn       = document.getElementById('btnSubmitForm');
        const nombre    = (document.getElementById('nombre')?.value || '').trim();
        const whatsapp  = (document.getElementById('whatsapp')?.value || '').trim();
        const municipio = document.getElementById('municipio')?.value || '';

        if (!nombre || !municipio || !/^\d{10}$/.test(whatsapp)) {
            showToast('Ingresa nombre, municipio y WhatsApp válido (10 dígitos).');
            return;
        }

        btn.textContent = 'Enviando...';
        btn.disabled    = true;

        try {
            if (!db) throw new Error('Sin conexión a base de datos.');
            const anonId = await getAnonId();

            const { error } = await db.from('movilizadores').insert([{
                nombre,
                whatsapp,
                municipio,
                rol:         'promotor',
                fingerprint: anonId
            }]);
            if (error) throw error;

            // Éxito: ocultar formulario y encabezado, mostrar confirmación
            form.hidden = true;
            const header = document.querySelector('.form-header');
            if (header) header.hidden = true;
            const ok = document.getElementById('formSuccess');
            if (ok) ok.hidden = false;

        } catch (err) {
            showToast('Problema de conexión. Intenta de nuevo.');
            btn.textContent = 'Sumarme al Movimiento';
            btn.disabled    = false;
        }
    });
}


/* ═══════════════════════════════════════════════
   15. NAV MOBILE
   ═══════════════════════════════════════════════ */
function initNav() {
    const toggle = document.getElementById('navToggle');
    const menu   = document.getElementById('navMenu');
    const sticky = document.getElementById('navSticky');

    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            const open = menu.classList.toggle('active');
            toggle.classList.toggle('active', open);
            toggle.setAttribute('aria-expanded', String(open));
        });
        menu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                menu.classList.remove('active');
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    if (sticky) {
        window.addEventListener('scroll', () => {
            sticky.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });
    }
}


/* ═══════════════════════════════════════════════
   16. ANIMACIÓN MAPA
   ═══════════════════════════════════════════════ */
function initMap() {
    const circles = document.querySelectorAll('.region-hotspot');
    if (!circles.length) return;
    const animate = () => circles.forEach(c => {
        c.style.opacity    = (Math.random() * 0.45 + 0.15).toFixed(2);
        c.style.transition = 'opacity 2s ease-in-out';
    });
    animate();
    setInterval(animate, 3000);
}


/* ═══════════════════════════════════════════════
   BOOTSTRAP — orden correcto
   ═══════════════════════════════════════════════
   1. Estructura UI (nav, countdown, municipios, pulso, sharing, form, map)
   2. KPI dinámico: actualizarKpiVoces() — FIX 4 aplicado en DOMContentLoaded
   3. Votos offline pendientes: syncPendingVotes()
   4. Fingerprint en background (no bloquea UI)
   ═══════════════════════════════════════════════ */
function bootstrap() {
    initNav();
    initCountdown();
    populateMunicipios();  // FIX 5: ahora corre correctamente
    initPulso();           // FIX 3: listeners funcionan
    initSharing();
    initForm();            // FIX 1: sin merge conflict
    initMap();

    // FIX 4: Actualizar KPI del hero con dato real de Supabase al cargar
    actualizarKpiVoces();

    // Sincronizar votos que quedaron pendientes sin red
    syncPendingVotes();

    // Fingerprint en background — no bloquea nada
    getAnonId().catch(() => {});
}

/* El script va al final del body SIN defer.
   Supabase cargó en <head> de forma síncrona.
   readyState como red de seguridad para edge cases. */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
} else {
    bootstrap();
}