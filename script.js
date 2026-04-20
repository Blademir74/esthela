/**
 * ESTHELA DAMIÁN — script.js v5.0
 *
 * CORRECCIONES v5.0
 * ─────────────────────────────────────────────────────────────────────
 * FIX 1  Tabla correcta: todas las consultas apuntan a `votos_pulso`
 *         (no a 'votes'). Campos: `anon_id` y `opcion`.
 *
 * FIX 2  KPI del hero dinámico: `fetchVotosCount()` corre al cargar el
 *         DOM y devuelve el conteo exacto de filas ÚNICAS por anon_id
 *         desde Supabase. Sin constante BASE_VOCES que bloquee el valor.
 *
 * FIX 3  Lógica de reintento: hasta 3 intentos con backoff exponencial
 *         (0 ms → 800 ms → 1600 ms) antes de mostrar fallback. Ideal para
 *         zonas con señal intermitente en Guerrero.
 *
 * FIX 4  Post-voto: `fetchVotosCount()` se dispara tras el insert exitoso
 *         para que el usuario vea su voto reflejado al instante.
 *
 * FIX 5  Conflictos de merge Git eliminados — el archivo parseará sin errores.
 *
 * FIX 6  `syncPendingVotes` y `registerVote` actualizados para usar
 *         tabla `votos_pulso` y campos correctos del esquema real.
 */

'use strict';

/* ═══════════════════════════════════════════════
   1. SUPABASE
   ═══════════════════════════════════════════════ */
const SUPABASE_URL = "https://iwqvrnnejiwadfxssumj.supabase.co";
const SUPABASE_KEY = "sb_publishable_qFPSGf9-iITKuAX_rWVh2w_PtEHjCZx";

let db;
try {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
        throw new Error('Variables de Supabase (URL o Key) son null o undefined.');
    }
    if (typeof window.supabase === 'undefined') {
        throw new Error('Supabase SDK no detectado en el navegador (CDN falló).');
    }
    db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('[Supabase] Cliente inicializado correctamente.');
} catch (e) {
    console.error('[Supabase] Error de inicialización:', e.message);
    db = null;
}


/* ═══════════════════════════════════════════════
   2. CONSTANTES
   ═══════════════════════════════════════════════ */
const KEY_FP      = 'esthela_fp_v4';
const KEY_VOTED   = 'esthela_voted_v4';
const KEY_PENDING = 'esthela_pending_sync_v1';

/*
 * FIX 2: BASE_VOCES eliminada como constante sumada al total.
 * El KPI mostrará el conteo real de Supabase directamente.
 * Solo se usa como FALLBACK VISUAL si Supabase no responde después
 * de 3 intentos, para que el elemento nunca quede en blanco.
 */
const FALLBACK_VOCES = 5400;


/* ═══════════════════════════════════════════════
   3. MUNICIPIOS (81 de Guerrero)
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
        ctx.fillText('Guerrero 2026 🏔️', 2, 2);
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
        String(screen.width) + 'x' + String(screen.height),
        String(screen.colorDepth),
        String(new Date().getTimezoneOffset()),
        Intl.DateTimeFormat().resolvedOptions().timeZone,
        String(navigator.hardwareConcurrency || 0),
        String(navigator.maxTouchPoints || 0),
        getCanvasHash()
    ].join('|__|');

    const encoder    = new TextEncoder();
    const data       = encoder.encode(signals);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray  = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2,'0')).join('').slice(0, 32);
}

let _cachedFp = null;

async function getAnonId() {
    if (_cachedFp) return _cachedFp;

    const stored = localStorage.getItem(KEY_FP);
    if (stored) {
        _cachedFp = stored;
        return stored;
    }

    try {
        const fp = await generateFingerprint();
        _cachedFp = 'fp_' + fp;
    } catch (err) {
        console.warn('[FP] crypto.subtle no disponible, usando ID aleatorio:', err.message);
        _cachedFp = 'rnd_' + Math.random().toString(36).slice(2,11) + Date.now().toString(36);
    }

    localStorage.setItem(KEY_FP, _cachedFp);
    return _cachedFp;
}


/* ═══════════════════════════════════════════════
   5. HELPERS
   ═══════════════════════════════════════════════ */
function pad(n) { return String(n).padStart(2,'0'); }

let _toastTimer = null;
function showToast(msg) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => { el.hidden = true; }, 3800);
}

/**
 * Pausa la ejecución N milisegundos.
 * Usada para el backoff exponencial entre reintentos.
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


/* ═══════════════════════════════════════════════
   6. CRONÓMETRO
   ═══════════════════════════════════════════════
   22 jun 2026 00:00:00 hora Guerrero (UTC-5) = 22 jun 2026 05:00:00 UTC
   Date.UTC evita el bug de Chrome Android con strings ISO+offset.
   ═══════════════════════════════════════════════ */
const TARGET_TS = Date.UTC(2026, 5, 22, 5, 0, 0);

function initCountdown() {
    const elDays  = document.getElementById('cdDays');
    const elHours = document.getElementById('cdHours');
    const elMins  = document.getElementById('cdMins');
    const elSecs  = document.getElementById('cdSecs');

    if (!elDays) return;

    function update() {
        const diff = TARGET_TS - Date.now();

        if (diff <= 0) {
            const wrap = document.getElementById('countdownClock');
            if (wrap) wrap.innerHTML = '<span style="color:var(--dorado-light);font-size:1.4rem;font-weight:700">¡HOY ES EL DÍA!</span>';
            return;
        }

        const days  = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const mins  = Math.floor((diff % 3600000)  / 60000);
        const secs  = Math.floor((diff % 60000)    / 1000);

        elDays.textContent  = pad(days);
        elHours.textContent = pad(hours);
        elMins.textContent  = pad(mins);
        elSecs.textContent  = pad(secs);
    }

    update();
    setInterval(update, 1000);
}


/* ═══════════════════════════════════════════════
   7. MUNICIPIOS
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
   8. CONTEO KPI DEL HERO — fetchVotosCount()
   ═══════════════════════════════════════════════
   FIX 1 + FIX 3: Tabla `votos_pulso`, campo `anon_id`.
   Cuenta registros ÚNICOS por anon_id para mantener integridad.
   Reintenta hasta MAX_RETRIES veces con backoff exponencial.
   ═══════════════════════════════════════════════ */
const MAX_RETRIES    = 3;
const RETRY_BASE_MS  = 800; // 800ms → 1600ms → (no hay 4to intento)

/**
 * Consulta el conteo exacto de votos únicos en `votos_pulso`.
 * Implementa reintento automático con backoff exponencial para
 * conexiones lentas o inestables (zonas rurales de Guerrero).
 *
 * @param {number} attempt - intento actual (1-indexed, default 1)
 * @returns {Promise<number>} total de filas únicas por anon_id
 */
async function fetchVotosCount(attempt = 1) {
    if (!db) {
        console.warn('[KPI] Supabase no disponible. Mostrando fallback.');
        return null; // null indica "usar fallback"
    }

    try {
        /*
         * FIX 1: Tabla correcta: `votos_pulso`.
         * Usamos `count: 'exact'` + `head: true` para una consulta HEAD
         * que solo devuelve el header Content-Range con el total.
         * No descarga filas — es la consulta más liviana posible.
         *
         * Para contar únicos por anon_id necesitamos una estrategia diferente
         * ya que PostgREST no soporta COUNT(DISTINCT) directamente.
         * Solución: select de la columna anon_id y deduplicar en cliente.
         * Esto es eficiente porque solo baja strings, no filas completas.
         */
        const { data, error } = await db
            .from('votos_pulso')
            .select('anon_id');

        if (error) throw error;

        // Deduplicar por anon_id en cliente para conteo de votantes únicos
        const uniqueVoters = new Set(data.map(row => row.anon_id)).size;
        return uniqueVoters;

    } catch (err) {
        if (attempt < MAX_RETRIES) {
            const delay = RETRY_BASE_MS * attempt; // 800ms, 1600ms
            console.warn(`[KPI] Intento ${attempt}/${MAX_RETRIES} fallido. Reintentando en ${delay}ms...`);
            await sleep(delay);
            return fetchVotosCount(attempt + 1);
        }

        // Agotados los reintentos
        console.error(`[KPI] ${MAX_RETRIES} intentos fallidos. Mostrando fallback.`, err.message);
        return null;
    }
}

/**
 * Actualiza el elemento #kpiVoces con el conteo real de Supabase.
 * Se llama al cargar el DOM y después de cada voto exitoso.
 *
 * FIX 2: Muestra el total real directamente, sin sumar BASE_VOCES.
 * Si Supabase no responde, muestra FALLBACK_VOCES con prefijo "+"
 * para que el elemento nunca quede vacío.
 */
async function actualizarKpiVoces() {
    const kpi = document.getElementById('kpiVoces');
    if (!kpi) return;

    const total = await fetchVotosCount();

    if (total !== null) {
        // Total real desde Supabase
        kpi.textContent = '+' + total.toLocaleString('es-MX');
        console.log(`[KPI] Voces actualizadas: ${total} votantes únicos.`);
    } else {
        // Fallback solo cuando Supabase es inalcanzable
        kpi.textContent = '+' + FALLBACK_VOCES.toLocaleString('es-MX');
        console.warn('[KPI] Mostrando valor fallback: ' + FALLBACK_VOCES);
    }
}


/* ═══════════════════════════════════════════════
   9. PULSO CIUDADANO — fetchVoteCounts y renderBars
   ═══════════════════════════════════════════════ */
let votingInProgress = false;

/**
 * FIX 1: Tabla `votos_pulso`, campo `opcion` (no `vote`).
 * Consulta el desglose de votos para las barras del termómetro.
 * También incluye reintento con backoff.
 */
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
            const delay = RETRY_BASE_MS * attempt;
            console.warn(`[Pulso] Intento ${attempt}/${MAX_RETRIES} fallido. Reintentando en ${delay}ms...`);
            await sleep(delay);
            return fetchVoteCounts(attempt + 1);
        }

        console.warn('[Pulso] Sin conexión tras reintentos. Usando fallback de barras.');
        return fallback;
    }
}

/**
 * Actualiza las barras de porcentaje del termómetro.
 * El KPI #kpiVoces lo maneja exclusivamente `actualizarKpiVoces()`.
 */
function renderBars(counts) {
    const total = counts.si + counts.dudo + counts.no;
    const pct   = v => total > 0 ? Math.round((v / total) * 100) : 0;

    const pSi   = pct(counts.si);
    const pDudo = pct(counts.dudo);
    const pNo   = pct(counts.no);

    const sp = document.getElementById('pctSi');     if (sp) sp.textContent = pSi   + '%';
    const dp = document.getElementById('pctPienso'); if (dp) dp.textContent = pDudo + '%';
    const np = document.getElementById('pctNo');     if (np) np.textContent = pNo   + '%';

    const animBar = (id, val) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.style.transition = 'none';
        el.style.width = '0%';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                el.style.transition = 'width 1.4s cubic-bezier(.2,.8,.2,1)';
                el.style.width = val + '%';
            });
        });
    };

    animBar('barSi',     pSi);
    animBar('barPienso', pDudo);
    animBar('barNo',     pNo);
}


/* ═══════════════════════════════════════════════
   10. SINCRONIZACIÓN DE VOTOS PENDIENTES
   ═══════════════════════════════════════════════
   FIX 1: Tabla `votos_pulso`, campo `anon_id` y `opcion`.
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
                // Restricción UNIQUE: el voto ya existe en la DB
                console.log('[Sync] Voto ya persistido (duplicate key). Limpiando pendiente.');
                localStorage.removeItem(KEY_PENDING);
            } else {
                console.error('[Sync] Error de Supabase:', error.message);
            }
            return;
        }

        console.log('[Sync] Voto pendiente sincronizado exitosamente.');
        localStorage.removeItem(KEY_PENDING);

        // FIX 4: Actualizar KPI y barras tras sincronización exitosa
        await actualizarKpiVoces();
        const realCounts = await fetchVoteCounts();
        renderBars(realCounts);

    } catch (err) {
        // Falla silenciosa — se reintentará en la próxima carga de página
        console.warn('[Sync] Fallo de red. El voto quedará en KEY_PENDING para el próximo intento.');
    }
}


/* ═══════════════════════════════════════════════
   11. REGISTRO DE VOTO — registerVote()
   ═══════════════════════════════════════════════
   FIX 1: Tabla `votos_pulso`, campo `anon_id` y `opcion`.
   FIX 4: Llama a actualizarKpiVoces() post-insert exitoso.
   ═══════════════════════════════════════════════ */
async function registerVote(voteType) {
    if (localStorage.getItem(KEY_VOTED)) return;
    if (votingInProgress) return;
    votingInProgress = true;

    const optionsDiv = document.getElementById('pulsoOptions');
    const resultDiv  = document.getElementById('pulsoResult');
    const loader     = document.getElementById('loaderPulso');
    const shareMod   = document.getElementById('shareModule');

    // A) Guardar en localStorage inmediatamente (offline-first)
    localStorage.setItem(KEY_VOTED,   voteType);
    localStorage.setItem(KEY_PENDING, voteType);

    // B) UI optimista: mostrar resultado sin esperar la red
    if (optionsDiv) optionsDiv.hidden = true;
    if (resultDiv)  resultDiv.hidden  = false;
    if (loader)     loader.hidden     = true;
    if (shareMod)   shareMod.hidden   = false;
    showToast('¡Tu voz ha sido registrada con éxito!');

    // Mostrar barras con incremento local optimista mientras llega la red
    fetchVoteCounts().then(counts => {
        counts[voteType] = (counts[voteType] || 0) + 1;
        renderBars(counts);
    });

    // C) Sincronización en segundo plano con FIX 4 integrado
    (async () => {
        try {
            const anonId = await getAnonId();

            if (!db) {
                console.warn('[Vote] Supabase no disponible. Voto guardado en KEY_PENDING.');
                return;
            }

            const { error } = await db.from('votos_pulso').insert([{
                anon_id:    anonId,
                opcion:     voteType,
                created_at: new Date().toISOString()
            }]);

            if (error) {
                if (error.code === '23505') {
                    // Duplicado: el fingerprint ya está registrado
                    console.log('[Vote] Voto duplicado detectado por la base de datos.');
                    localStorage.removeItem(KEY_PENDING);
                } else {
                    console.error('[Vote] Error de insert:', error.message);
                }
                return;
            }

            // Insert exitoso: limpiar pendiente
            localStorage.removeItem(KEY_PENDING);
            console.log('[Vote] Voto sincronizado con Supabase correctamente.');

            /*
             * FIX 4: Actualizar KPI y barras con datos reales post-insert.
             * El usuario ve el termómetro con su voto contabilizado
             * unos segundos después del click — sin recarga de página.
             */
            await actualizarKpiVoces();
            const realCounts = await fetchVoteCounts();
            renderBars(realCounts);

        } catch (err) {
            console.error('[Vote] Error de red en background sync:', err.message);
        } finally {
            votingInProgress = false;
        }
    })();
}


/* ═══════════════════════════════════════════════
   12. INIT PULSO
   ═══════════════════════════════════════════════ */
function initPulso() {
    const hasVoted   = localStorage.getItem(KEY_VOTED);
    const optionsDiv = document.getElementById('pulsoOptions');
    const loader     = document.getElementById('loaderPulso');
    const resultDiv  = document.getElementById('pulsoResult');

    if (hasVoted) {
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
        if (optionsDiv) optionsDiv.hidden = false;
        if (loader)     loader.hidden     = true;
        if (resultDiv)  resultDiv.hidden  = true;

        const btns = document.querySelectorAll('.pulso-btn[data-vote]');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                const vote = btn.getAttribute('data-vote');
                if (vote && !votingInProgress) {
                    registerVote(vote);
                }
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
                showToast('Copia la URL desde la barra del navegador.');
            }
        });
    }
}


/* ═══════════════════════════════════════════════
   14. FORMULARIO SIMPATIZANTES
   ═══════════════════════════════════════════════
   FIX 5: Conflictos de merge Git eliminados.
   La versión HEAD (form.hidden = true) es la correcta y única.
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

        const waRegex = /^\d{10}$/;
        if (!nombre || !municipio || !waRegex.test(whatsapp)) {
            showToast('Ingresa un nombre, municipio y un WhatsApp válido (10 dígitos).');
            return;
        }

        btn.textContent = 'Enviando...';
        btn.disabled    = true;

        try {
            const anonId = await getAnonId();
            if (!db) throw new Error('Conexión a base de datos no disponible.');

            const { error } = await db.from('movilizadores').insert([{
                nombre,
                whatsapp,
                municipio,
                rol:         'promotor',
                fingerprint: anonId
            }]);

            if (error) throw error;

            // Ocultar formulario y encabezado, mostrar mensaje de éxito
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


/* ═══════════════════════════════════════════════
   BOOTSTRAP
   ═══════════════════════════════════════════════
   Orden de inicialización:
   1. UI estructural (nav, countdown, municipios, pulso, sharing, form, map)
   2. KPI dinámico: actualizarKpiVoces() al cargar el DOM — FIX 2
   3. Votos pendientes offline: syncPendingVotes()
   4. Fingerprint en background (no bloquea UI)
   ═══════════════════════════════════════════════ */
function bootstrap() {
    initNav();
    initCountdown();
    populateMunicipios();
    initPulso();
    initSharing();
    initForm();
    initMap();

    /*
     * FIX 2 + FIX 3: Llamar actualizarKpiVoces() al cargar el DOM.
     * Esta es la función que reemplaza el valor estático "5,400"
     * con el conteo real de Supabase, con hasta 3 reintentos automáticos.
     */
    actualizarKpiVoces();

    // Sincronizar cualquier voto que quedó pendiente por falta de red
    syncPendingVotes();

    // Pre-computar fingerprint en background
    getAnonId().catch(() => {});
}

/*
 * El script corre al final del body SIN defer.
 * Supabase ya cargó en <head> de forma síncrona.
 * readyState como red de seguridad extra.
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
} else {
    bootstrap();
}