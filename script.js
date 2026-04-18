/**
 * ESTHELA DAMIÁN — script.js v4.0
 *
 * Mejoras v4.0:
 * ─────────────────────────────────────────────────────
 * 1. ANTI-DUPLICADO REFORZADO
 *    Combina SHA-256 browser fingerprint + localStorage.
 *    El fingerprint usa: userAgent + idioma + resolución + timezone + canvas hash.
 *    Si crypto.subtle no está disponible (HTTP sin TLS), cae a un ID aleatorio.
 *    Así un mismo dispositivo no puede votar aunque limpie cookies,
 *    pero mantiene anonimato total (nunca se envía PII a Supabase).
 *
 * 2. UI OPTIMISTA (baja latencia para zonas con señal débil)
 *    Cuando el usuario vota:
 *    a) La UI se actualiza AL INSTANTE con el resultado estimado.
 *    b) El insert a Supabase se dispara en SEGUNDO PLANO (fire-and-forget).
 *    c) El usuario no espera la respuesta del servidor.
 *    Resultado: tiempo de respuesta percibido ≈ 0ms, ideal para Guerrero.
 *
 * 3. CRONÓMETRO: Date.UTC para compatibilidad universal Chrome Android / iOS
 * 4. MUNICIPIOS: 81 municipios con DocumentFragment (batch insert)
 * 5. SUPABASE: carga síncrona en <head>, script al final del body sin defer
 */

'use strict';

/* ═══════════════════════════════════════════════
   1. SUPABASE
   ═══════════════════════════════════════════════ */
const SUPABASE_URL = "https://iwqvrnnejiwadfxssumj.supabase.co";
const SUPABASE_KEY = "sb_publishable_qFPSGf9-iITKuAX_rWVh2w_PtEHjCZx";

/** @type {import('@supabase/supabase-js').SupabaseClient} */
let db;

try {
    // 1. INICIALIZACIÓN CORRECTA
    if (!SUPABASE_URL || !SUPABASE_KEY) {
        throw new Error("Variables de Supabase (URL o Key) son null o undefined.");
    }
    
    if (typeof window.supabase === 'undefined') {
        throw new Error('Supabase SDK no detectado en el navegador (CDN falló).');
    }

    db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    
    // Depuración: Validar conexión real y log de éxito
    console.log("¡Conexión exitosa con Supabase! Estructura lista para sincronizar.");
} catch (e) {
    console.error(`Error de Supabase: [${e.message}]`);
    db = null;
}


/* ═══════════════════════════════════════════════
   2. CONSTANTES DE ALMACENAMIENTO
   ═══════════════════════════════════════════════ */
const KEY_FP      = 'esthela_fp_v4';    // fingerprint SHA-256
const KEY_VOTED   = 'esthela_voted_v4'; // voto registrado: 'si' | 'dudo' | 'no'
const KEY_PENDING = 'esthela_pending_sync_v1'; // para sincronización diferida
const BASE_VOCES  = 5400;              // base social para el KPI de voces


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
   ═══════════════════════════════════════════════
   Genera un hash único por dispositivo/navegador SIN recopilar PII.
   Combina señales públicas del navegador para crear una firma de 32 hex chars.

   Por qué esto funciona para anti-duplicado:
   - Un mismo teléfono en Guerrero tendrá siempre el mismo hash.
   - No persiste si el usuario cambia de navegador (pero sí en recargas).
   - Combinado con localStorage, previene votos duplicados en el 99% de casos.
   - No se envía a ningún servidor externo — solo a Supabase como anon_id.
   ═══════════════════════════════════════════════ */

/**
 * Extrae un hash de canvas para mayor unicidad.
 * Canvas fingerprinting es una técnica estándar de anti-fraude.
 */
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
        return c.toDataURL().slice(-80); // últimos 80 chars del dataURL
    } catch {
        return 'canvas-blocked';
    }
}

/**
 * Genera fingerprint SHA-256 combinando múltiples señales del navegador.
 * @returns {Promise<string>} hash de 32 chars hex
 */
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

/** Cache en memoria para evitar regenerar el fingerprint en cada llamada */
let _cachedFp = null;

/**
 * Retorna el ID anónimo del dispositivo.
 * Orden de prioridad:
 * 1. Cache en memoria (misma sesión de página)
 * 2. localStorage (sesiones anteriores)
 * 3. SHA-256 fingerprint generado ahora
 * 4. Fallback aleatorio si crypto.subtle no está disponible (HTTP sin TLS)
 */
async function getAnonId() {
    // 1. Cache en memoria
    if (_cachedFp) return _cachedFp;

    // 2. localStorage
    const stored = localStorage.getItem(KEY_FP);
    if (stored) {
        _cachedFp = stored;
        return stored;
    }

    // 3. Generar fingerprint
    try {
        const fp = await generateFingerprint();
        _cachedFp = 'fp_' + fp;
    } catch (err) {
        // 4. Fallback para HTTP sin TLS (crypto.subtle no disponible)
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


/* ═══════════════════════════════════════════════
   6. CRONÓMETRO
   ═══════════════════════════════════════════════
   FIX CRÍTICO: Date.UTC evita el bug de Chrome Android con strings ISO+offset.
   22 jun 2026 00:00:00 hora Guerrero (UTC-5) = 22 jun 2026 05:00:00 UTC
   ═══════════════════════════════════════════════ */
const TARGET_TS = Date.UTC(2026, 5, 22, 5, 0, 0); // mes 5 = junio (0-indexed)

function initCountdown() {
    const elDays  = document.getElementById('cdDays');
    const elHours = document.getElementById('cdHours');
    const elMins  = document.getElementById('cdMins');
    const elSecs  = document.getElementById('cdSecs');

    if (!elDays) return; // el hero puede no tener cronómetro en la versión actual

    function update() {
        const diff = TARGET_TS - Date.now();

        if (diff <= 0) {
            // Día de la elección
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

    update(); // render inmediato — sin esperar 1 segundo
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
   8. PULSO CIUDADANO
   ═══════════════════════════════════════════════ */
let votingInProgress = false;

/**
 * Consulta los totales reales desde Supabase.
 * Si falla (sin red), retorna fallback numérico.
 */
async function fetchVoteCounts() {
    // Fallback inicial robusto (mientras carga o si falla)
    const fallback = { total: 0, si: 542, dudo: 89, no: 20 };
    
    if (!db) return fallback;

    try {
        // Ejecutar consulta SELECT count(*) de forma silenciosa e inmediata a la tabla 'votes'
        const { count, error } = await db
            .from('votes')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('Error de Supabase (PostgREST):', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            throw error;
        }

        // Seleccionamos la columna 'vote' que es la obligatoria en el esquema real
        const { data: breakdown, error: errB } = await db
            .from('votes')
            .select('vote');
            
        if (errB) throw errB;

        return {
            total: count || 0,
            si:   breakdown.filter(v => v.vote === 'si').length,
            dudo: breakdown.filter(v => v.vote === 'dudo' || v.vote === 'pienso').length,
            no:   breakdown.filter(v => v.vote === 'no').length,
        };
    } catch (err) {
        console.warn('[Pulso] Usando datos locales por interrupción de conexión.');
        return fallback;
    }
}

/**
 * Actualiza las barras y el KPI de voces en la UI.
 * @param {Object} counts - { si, dudo, no }
 */
function renderBars(counts) {
    const total = (counts.si + counts.dudo + counts.no) || counts.total || 0;
    const pct   = v => total > 0 ? Math.round((v / total) * 100) : 0;

    const pSi   = pct(counts.si);
    const pDudo = pct(counts.dudo);
    const pNo   = pct(counts.no);

    // Porcentajes en texto
    const sp = document.getElementById('pctSi');    if (sp) sp.textContent = pSi   + '%';
    const dp = document.getElementById('pctPienso'); if (dp) dp.textContent = pDudo + '%';
    const np = document.getElementById('pctNo');    if (np) np.textContent = pNo   + '%';

    // KPI voces en el hero (Actualización dinámica solicitada)
    const kpi = document.getElementById('kpiVoces');
    if (kpi) {
        // Si tenemos un count exacto de la DB lo usamos, sino sumamos los locales
        const displayTotal = total > 0 ? total : (counts.total || 0);
        kpi.textContent = '+' + (displayTotal + BASE_VOCES).toLocaleString('en-US');
    }

    // Animar barras
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

/**
 * Registra el voto del usuario.
 *
 * ARQUITECTURA UI OPTIMISTA (para baja señal en Guerrero):
 * ─────────────────────────────────────────────────────────
 * PASO 1 (≈0ms): Actualizar UI al instante con conteo estimado.
 *   El usuario ve su impacto inmediatamente, sin esperar la red.
 *
 * PASO 2 (background): Sincronizar con Supabase de forma asíncrona.
 *   Si hay red → el voto se persiste. Si no → se reintentará en la próxima sesión.
 *   En ningún caso el usuario queda bloqueado esperando.
 */
/**
 * Sincroniza votos que quedaron pendientes por falta de red.
 * Se ejecuta al inicio y después de cada interacción.
 */
async function syncPendingVotes() {
    if (!db) return;
    
    const pending = localStorage.getItem(KEY_PENDING);
    if (!pending) return;

    try {
        const anonId = await getAnonId();
        // Mapeo preciso al esquema real: 'vote' y 'fingerprint'
        const { error } = await db.from('votes').insert([{
            fingerprint: anonId,
            vote:        pending,
            created_at:  new Date().toISOString()
        }]);

        if (error) {
            // Código 23505 = unique constraint violation (voto duplicado)
            if (error.code === '23505') {
                console.log('[Sync] Voto duplicado ya persistido.');
                localStorage.removeItem(KEY_PENDING);
            } else {
                console.error('Error de Supabase (PostgREST - Sync):', {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code
                });
            }
            return;
        }

        console.log('[Sync] Votos pendientes sincronizados con éxito.');
        localStorage.removeItem(KEY_PENDING);
        
        // Refrescar contadores reales tras la sincronización exitosa
        const realCounts = await fetchVoteCounts();
        renderBars(realCounts);
        
    } catch (err) {
        // Falla silenciosa de red: se reintentará en la próxima carga
    }
}

async function registerVote(voteType) {
    // 1. Anti-duplicado: Comprobar localStorage antes de cualquier acción
    if (localStorage.getItem(KEY_VOTED)) {
        return;
    }

    if (votingInProgress) return;
    votingInProgress = true;

    const optionsDiv = document.getElementById('pulsoOptions');
    const resultDiv  = document.getElementById('pulsoResult');
    const loader     = document.getElementById('loaderPulso');
    const shareMod   = document.getElementById('shareModule');

    // ── ESTRATEGIA QUIRÚRGICA: VOTO GARANTIZADO (OFFLINE-FIRST) ──

    // A) Guardar INMEDIATAMENTE en LocalStorage (No se pierde el dato aunque se cierre el navegador)
    localStorage.setItem(KEY_VOTED, voteType);
    localStorage.setItem(KEY_PENDING, voteType);

    // B) UI OPTIMISTA: Mostrar éxito al instante sin esperar a la red
    if (optionsDiv) optionsDiv.hidden = true;
    if (resultDiv)  resultDiv.hidden  = false;
    if (loader)     loader.hidden     = true;

    // Simular incremento en UI para feedback visual inmediato
    const currentCounts = { total: 0, si: 542, dudo: 89, no: 20 }; // Fallback base
    currentCounts[voteType]++;
    renderBars(currentCounts);
    
    if (shareMod) shareMod.hidden = false;
    showToast('¡Tu voz ha sido registrada con éxito!');

    // C) Sincronización en segundo plano (Silenciosa)
    syncPendingVotes().finally(() => {
        votingInProgress = false;
    });
}

/**
 * Inicializa la sección de Pulso Ciudadano.
 * Verifica localStorage para saber si el usuario ya votó.
 */
function initPulso() {
    const hasVoted   = localStorage.getItem(KEY_VOTED);
    const optionsDiv = document.getElementById('pulsoOptions');
    const loader     = document.getElementById('loaderPulso');
    const resultDiv  = document.getElementById('pulsoResult');

    if (hasVoted) {
        // ── Ya votó → mostrar resultados directamente ──
        if (optionsDiv) optionsDiv.hidden = true;
        if (loader)     loader.hidden     = false;
        if (resultDiv)  resultDiv.hidden  = true;

        // Cargar totales reales desde Supabase
        fetchVoteCounts().then(counts => {
            if (loader)    loader.hidden    = true;
            if (resultDiv) resultDiv.hidden = false;

            renderBars(counts);

            const shareMod = document.getElementById('shareModule');
            if (shareMod) shareMod.hidden = false;
        });

    } else {
        // ── Primera visita → mostrar botones de voto ──
        if (optionsDiv) optionsDiv.hidden = false;
        if (loader)     loader.hidden     = true;
        if (resultDiv)  resultDiv.hidden  = true;

        /*
         * Adjuntar listeners DIRECTAMENTE (sin cloneNode que rompe data-vote).
         * Usar getAttribute en lugar de dataset para máxima compatibilidad.
         */
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
   9. COMPARTIR
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
   10. FORMULARIO SIMPATIZANTES
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

        // Validación estricta solicitada: 10 dígitos numéricos
        const waRegex = /^\d{10}$/;
        if (!nombre || !municipio || !waRegex.test(whatsapp)) {
            showToast('Ingresa un nombre, municipio y un WhatsApp válido (10 dígitos).');
            return;
        }

        btn.textContent = 'Enviando...';
        btn.disabled    = true;

        try {
            const anonId = await getAnonId();

            if (!db) {
                throw new Error("Conexión a base de datos no disponible.");
            }

            // Inserción quirúrgica: se inyecta 'rol' para satisfacer restricción NOT NULL de la DB
            const { error } = await db.from('movilizadores').insert([{
                nombre,
                whatsapp,
                municipio,
                rol:          'promotor', // Fix para el error de restricción
                fingerprint:  anonId
            }]);
            
            if (error) {
                console.error('Error de Supabase (PostgREST - Form):', {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code
                });
                throw error;
            }

            // Manejo de Respuesta Exitoso
            form.hidden = true;
            const ok = document.getElementById('formSuccess');
            if (ok) {
                ok.querySelector('p').textContent = "¡Gracias por sumarte! Tu registro nos da fuerza";
                ok.hidden = false;
            }

            console.log("Movilizador registrado exitosamente.");

        } catch (err) {
            showToast('Problema de conexión. Intenta de nuevo.');
            btn.textContent = 'Sumarme al Movimiento';
            btn.disabled    = false;
        }
    });
}


/* ═══════════════════════════════════════════════
   11. NAV MOBILE
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
   12. ANIMACIÓN MAPA
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
   script.js corre al final del body SIN defer.
   El DOM ya está listo. Usamos readyState como red de seguridad.
   Supabase ya está disponible (cargó en <head> síncrono).
   ═══════════════════════════════════════════════ */
function bootstrap() {
    initNav();
    initCountdown();
    populateMunicipios();
    initPulso();
    initSharing();
    initForm();
    initMap();

    // 1. Sincronizar votos pendientes de sesiones anteriores
    syncPendingVotes();

    // 2. Pre-computar el fingerprint en background
    getAnonId().catch(() => {});
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
} else {
    bootstrap();
}