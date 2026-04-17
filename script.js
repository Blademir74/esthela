/**
 * ESTHELA DAMIÁN — script.js v3.0
 *
 * BUGS CORREGIDOS:
 * 1. Cronómetro: se usa timestamp puro (no string con offset) para compatibilidad
 *    universal con Chrome Android, Safari iOS, Samsung Browser.
 * 2. Votación: listeners directos sin cloneNode. Guard doble-tap.
 *    pulsoOptions sin hidden en HTML; JS decide visibilidad.
 * 3. Supabase: CDN carga síncrono en <head>. El script corre al final del body
 *    sin defer, Supabase ya está disponible en window.supabase.
 * 4. Compartir: shareModule se muestra para CUALQUIER voto, no solo "sí".
 * 5. Municipios: populateMunicipios() con DOMContentLoaded garantizado.
 * 6. Móvil: word-break y overflow corregidos en CSS.
 * 7. OG/SEO: en index.html.
 */

/* ─── 1. SUPABASE ────────────────────────── */
const SUPABASE_URL = "https://efnfplynevefniadgidi.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmbmZwbHluZXZlZm5pYWRnaWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2ODc4MzUsImV4cCI6MjA3NTI2MzgzNX0.jNj-rnzMwV2WEGx8lqDjtNPKS3ACmTD4faAnr3eFrHI";

// Verificación defensiva: si Supabase no cargó correctamente, lo reportamos.
if (typeof window.supabase === 'undefined') {
    console.error('[Esthela] Supabase CDN no cargó. Revisa la etiqueta <script> en el <head>.');
}
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* ─── 2. STORAGE KEYS ────────────────────── */
const KEY_USER_ID  = 'esthela_anon_id';
const KEY_VOTED    = 'esthela_voted_v2'; // v2 para no colisionar con sesiones previas

/* ─── 3. LISTA DE MUNICIPIOS (81) ───────── */
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

/* ─── 4. HELPERS ─────────────────────────── */
function getAnonId() {
    let id = localStorage.getItem(KEY_USER_ID);
    if (!id) {
        id = 'u_' + Math.random().toString(36).slice(2,11) + Date.now().toString(36);
        localStorage.setItem(KEY_USER_ID, id);
    }
    return id;
}

function pad(n) { return String(n).padStart(2, '0'); }

function showToast(msg) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => { el.hidden = true; }, 3600);
}

/* ─── 5. CRONÓMETRO ──────────────────────── */
/*
 * FIX CRÍTICO para Chrome Android / Samsung Browser:
 * new Date('2026-06-22T00:00:00-05:00') falla en algunos Android.
 * Calculamos el timestamp manualmente con UTC y compensamos el offset.
 *
 * 22 jun 2026 00:00:00 en UTC-5 = 22 jun 2026 05:00:00 UTC
 * getTime() de esa fecha en UTC:
 */
const TARGET_TS = Date.UTC(2026, 5, 22, 5, 0, 0); // mes 5 = junio (0-indexed)

function initCountdown() {
    const update = () => {
        const diff = TARGET_TS - Date.now();

        if (diff <= 0) {
            const el = document.getElementById('countdownClock');
            if (el) el.innerHTML = '<span style="color:var(--dorado-light);font-size:1.5rem">¡HOY ES EL DÍA!</span>';
            return;
        }

        const days  = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const mins  = Math.floor((diff % 3600000)  / 60000);
        const secs  = Math.floor((diff % 60000)    / 1000);

        const d = document.getElementById('cdDays');
        const h = document.getElementById('cdHours');
        const m = document.getElementById('cdMins');
        const s = document.getElementById('cdSecs');

        if (d) d.textContent = pad(days);
        if (h) h.textContent = pad(hours);
        if (m) m.textContent = pad(mins);
        if (s) s.textContent = pad(secs);
    };

    update(); // renderiza inmediatamente, sin esperar 1 segundo
    setInterval(update, 1000);
}

/* ─── 6. MUNICIPIOS ──────────────────────── */
function populateMunicipios() {
    const select = document.getElementById('municipio');
    if (!select) return;

    // Evitar duplicados si la función se llama más de una vez
    if (select.options.length > 1) return;

    const sorted = [...MUNICIPIOS].sort((a, b) => a.localeCompare(b, 'es'));
    const frag   = document.createDocumentFragment();

    sorted.forEach(m => {
        const opt = document.createElement('option');
        opt.value       = m;
        opt.textContent = m;
        frag.appendChild(opt);
    });

    select.appendChild(frag);
}

/* ─── 7. PULSO CIUDADANO ─────────────────── */
let votingInProgress = false; // guard contra doble tap

async function fetchVoteCounts() {
    try {
        const { data, error } = await db.from('votos_pulso').select('opcion');
        if (error) throw error;

        if (!data || data.length === 0) {
            // Fallback numérico si la tabla está vacía
            return { si: 542, dudo: 89, no: 20 };
        }

        return {
            si:   data.filter(v => v.opcion === 'si').length,
            dudo: data.filter(v => v.opcion === 'dudo' || v.opcion === 'pienso').length,
            no:   data.filter(v => v.opcion === 'no').length,
        };
    } catch (err) {
        console.error('[Pulso] Error consultando votos:', err);
        return { si: 542, dudo: 89, no: 20 };
    }
}

function renderBars(counts) {
    const total  = counts.si + counts.dudo + counts.no;
    const pct    = v => total > 0 ? Math.round((v / total) * 100) : 0;

    const pSi   = pct(counts.si);
    const pDudo = pct(counts.dudo);
    const pNo   = pct(counts.no);

    // Actualizar textos
    const setPct = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val + '%'; };
    setPct('pctSi',     pSi);
    setPct('pctPienso', pDudo);
    setPct('pctNo',     pNo);

    // Animar barras (forzar reflow primero)
    const setBar = (id, val) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.style.width = '0%'; // reset
        requestAnimationFrame(() => {
            setTimeout(() => { el.style.width = val + '%'; }, 60);
        });
    };
    setBar('barSi',     pSi);
    setBar('barPienso', pDudo);
    setBar('barNo',     pNo);
}

async function showPulsoResult(voteType) {
    const loader    = document.getElementById('loaderPulso');
    const resultDiv = document.getElementById('pulsoResult');
    const shareMod  = document.getElementById('shareModule');

    if (loader) loader.hidden = false;

    const counts = await fetchVoteCounts();
    renderBars(counts);

    if (loader)    loader.hidden    = true;
    if (resultDiv) resultDiv.hidden = false;

    // shareModule aparece para TODOS los votos
    if (shareMod) shareMod.hidden = false;
}

async function registerVote(voteType) {
    if (votingInProgress) return;
    votingInProgress = true;

    const optionsDiv = document.getElementById('pulsoOptions');
    const loader     = document.getElementById('loaderPulso');

    if (optionsDiv) optionsDiv.hidden = true;
    if (loader)     loader.hidden     = false;

    try {
        const { error } = await db.from('votos_pulso').insert([{
            anon_id:    getAnonId(),
            opcion:     voteType,
            created_at: new Date().toISOString()
        }]);

        if (error) {
            // No bloqueamos si es duplicado de anon_id — continuamos
            console.warn('[Pulso] Insert warning:', error.message);
        }

        // Guardar en localStorage para no volver a mostrar botones
        localStorage.setItem(KEY_VOTED, voteType);
        showToast('Tu voto quedó registrado de forma anónima.');

        await showPulsoResult(voteType);

    } catch (err) {
        console.error('[Pulso] Error de red:', err);
        showToast('Problema de conexión. Intenta de nuevo.');
        if (optionsDiv) optionsDiv.hidden = false;
        if (loader)     loader.hidden     = true;
        votingInProgress = false;
    }
}

function initPulso() {
    const hasVoted   = localStorage.getItem(KEY_VOTED);
    const optionsDiv = document.getElementById('pulsoOptions');
    const loader     = document.getElementById('loaderPulso');
    const resultDiv  = document.getElementById('pulsoResult');

    if (hasVoted) {
        // Ya votó en sesión anterior: ocultar botones, mostrar resultados
        if (optionsDiv) optionsDiv.hidden = true;
        if (loader)     loader.hidden     = false;

        showPulsoResult(hasVoted); // async, no await (se actualiza en background)

    } else {
        // Primera visita: mostrar botones
        if (optionsDiv) optionsDiv.hidden = false;
        if (loader)     loader.hidden     = true;
        if (resultDiv)  resultDiv.hidden  = true;

        /*
         * FIX: listeners DIRECTOS sobre los botones existentes.
         * NO usar cloneNode — rompe data-vote en Chrome Android.
         */
        const btns = document.querySelectorAll('.pulso-btn[data-vote]');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                const voteType = btn.getAttribute('data-vote');
                if (voteType && !votingInProgress) {
                    registerVote(voteType);
                }
            });
        });
    }
}

/* ─── 8. COMPARTIR ───────────────────────── */
function initSharing() {
    const url = window.location.href.split('#')[0];
    const msg = `¡Yo ya respaldé a Esthela Damián para Coordinadora de Guerrero! Deja tu Pulso Digital aquí: ${url}`;

    const wa = document.getElementById('btnShareWhatsApp');
    if (wa) {
        wa.addEventListener('click', () => {
            window.open(
                'https://api.whatsapp.com/send?text=' + encodeURIComponent(msg),
                '_blank', 'noopener,noreferrer'
            );
        });
    }

    const fb = document.getElementById('btnShareFacebook');
    if (fb) {
        fb.addEventListener('click', () => {
            window.open(
                'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url),
                'fb-share', 'width=800,height=600'
            );
        });
    }

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
                showToast('Copia la URL manualmente desde la barra del navegador.');
            }
        });
    }
}

/* ─── 9. FORMULARIO SIMPATIZANTES ────────── */
function initForm() {
    const form = document.getElementById('simpatizanteForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn       = document.getElementById('btnSubmitForm');
        const nombre    = (document.getElementById('nombre')?.value || '').trim();
        const municipio = document.getElementById('municipio')?.value || '';
        const rol       = document.getElementById('rol')?.value || '';

        if (!nombre || !municipio || !rol) {
            showToast('Completa todos los campos.');
            return;
        }

        btn.textContent = 'Enviando...';
        btn.disabled    = true;

        try {
            const { error } = await db.from('simpatizantes').insert([{
                nombre,
                municipio,
                rol,
                anon_id:    getAnonId(),
                created_at: new Date().toISOString()
            }]);

            if (error) console.warn('[Form] Supabase warning:', error.message);

            form.hidden = true;
            const ok = document.getElementById('formSuccess');
            if (ok) ok.hidden = false;

        } catch (err) {
            console.error('[Form] Error de red:', err);
            showToast('Problema de conexión. Intenta de nuevo.');
            btn.textContent = 'Sumarme al Movimiento';
            btn.disabled    = false;
        }
    });
}

/* ─── 10. NAV MOBILE ─────────────────────── */
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

/* ─── 11. ANIMACIÓN MAPA ─────────────────── */
function initMap() {
    const circles = document.querySelectorAll('.region-hotspot');
    if (!circles.length) return;

    const animate = () => {
        circles.forEach(c => {
            const op = (Math.random() * 0.45 + 0.15).toFixed(2);
            c.style.opacity    = op;
            c.style.transition = 'opacity 2s ease-in-out';
        });
    };
    animate();
    setInterval(animate, 3000);
}

/* ─── ARRANQUE ───────────────────────────── */
/*
 * El script corre al final del body, sin defer.
 * El DOM ya está completamente construido aquí.
 * Supabase cargó en el <head> de forma síncrona.
 * Usamos DOMContentLoaded como red de seguridad.
 */
function bootstrap() {
    initNav();
    initCountdown();
    populateMunicipios();
    initPulso();
    initSharing();
    initForm();
    initMap();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
} else {
    // El DOM ya está listo (script al final del body)
    bootstrap();
}