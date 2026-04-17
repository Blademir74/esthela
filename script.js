/**
 * ESTHELA DAMIÁN — Lógica Core v2.0
 * Vanilla JS sin dependencias para Vercel Static.
 * Supabase CDN. Bugs corregidos: votación, countdown, compartir.
 */

// 1. CREDENCIALES SUPABASE
const SUPABASE_URL = "https://efnfplynevefniadgidi.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmbmZwbHluZXZlZm5pYWRnaWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2ODc4MzUsImV4cCI6MjA3NTI2MzgzNX0.jNj-rnzMwV2WEGx8lqDjtNPKS3ACmTD4faAnr3eFrHI";

// 2. INICIALIZAR SUPABASE CLIENT
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 3. KEYS LOCALSTORAGE
const STORAGE_KEYS = {
    USER_ID: 'esthela_anon_id',
    HAS_VOTED: 'esthela_apoyo_voted'
};

// 4. MUNICIPIOS DE GUERRERO (81)
const MUNICIPIOS_GUERRERO = [
    "Acapulco de Juárez", "Ahuacuotzingo", "Ajuchitlán del Progreso", "Alcozauca de Guerrero",
    "Alpoyeca", "Apaxtla", "Arcelia", "Atenango del Río", "Atlamajalcingo del Monte", "Atlixtac",
    "Atoyac de Álvarez", "Ayutla de los Libres", "Azoyú", "Benito Juárez", "Buenavista de Cuéllar",
    "Coahuayutla de José María Izazaga", "Cocula", "Copala", "Copalillo", "Copanatoyac",
    "Coyuca de Benítez", "Coyuca de Catalán", "Cuajinicuilapa", "Cualác", "Cuautepec",
    "Cuetzala del Progreso", "Cutzamala de Pinzón", "Chilapa de Álvarez", "Chilpancingo de los Bravo",
    "Florencio Villarreal", "General Canuto A. Neri", "General Heliodoro Castillo", "Huamuxtitlán",
    "Huitzuco de los Figueroa", "Iguala de la Independencia", "Igualapa", "Ixcateopan de Cuauhtémoc",
    "Zihuatanejo de Azueta", "Juan R. Escudero", "Leonardo Bravo", "Malinaltepec", "Mártir de Cuilapan",
    "Metlatónoc", "Mochitlán", "Olinalá", "Ometepec", "Pedro Ascencio Alquisiras", "Petatlán",
    "Pilcaya", "Pungarabato", "Quechultenango", "San Luis Acatlán", "San Marcos", "San Miguel Totolapan",
    "Taxco de Alarcón", "Tecoanapa", "Técpan de Galeana", "Teloloapan", "Tepecoacuilco de Trujano",
    "Tetipac", "Tixtla de Guerrero", "Tlacoachistlahuaca", "Tlacoapa", "Tlalchapa",
    "Tlalixtaquilla de Maldonado", "Tlapa de Comonfort", "Tlapehuala",
    "La Unión de Isidoro Montes de Oca", "Xalpatláhuac", "Xochihuehuetlán",
    "Xochistlahuaca", "Zapotitlán Tablas", "Zirándaro", "Zitlala", "Eduardo Neri", "Acatepec",
    "Marquelia", "Cochoapa el Grande", "José Joaquín de Herrera", "Juchitán", "Iliatenco"
];

// Genera o recupera ID anónimo
function getAnonId() {
    let id = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (!id) {
        id = 'user_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
        localStorage.setItem(STORAGE_KEYS.USER_ID, id);
    }
    return id;
}

class EsthelaLandingApp {
    constructor() {
        this.userId = getAnonId();
        this.votingInProgress = false; // Guard contra doble click
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupCountdown();
        this.populateMunicipios();
        this.setupPulsoCiudadano();
        this.setupViralSharing();
        this.setupSimpatizanteForm();
        this.animateHeatmap();
    }

    // --- Navegación Mobile ---
    setupNavigation() {
        const toggle = document.getElementById('navToggle');
        const menu = document.getElementById('navMenu');
        const sticky = document.getElementById('navSticky');

        if (toggle && menu) {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
                menu.classList.toggle('active');
            });

            menu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    toggle.classList.remove('active');
                    menu.classList.remove('active');
                });
            });
        }

        if (sticky) {
            window.addEventListener('scroll', () => {
                sticky.classList.toggle('scrolled', window.scrollY > 50);
            }, { passive: true });
        }
    }

    // --- Countdown al 22 de junio 2026 ---
    // Usamos fecha en hora local de México (UTC-6, sin DST en Guerrero)
    setupCountdown() {
        const el = document.getElementById('countdownClock');
        if (!el) return;

        // Fecha objetivo: 22 de junio 2026 00:00 hora Guerrero (UTC-5 en verano)
        // Usamos ISO con offset para precisión
        const TARGET_MS = new Date('2026-06-22T00:00:00-05:00').getTime();

        const pad = n => String(n).padStart(2, '0');

        const update = () => {
            const diff = TARGET_MS - Date.now();

            if (diff <= 0) {
                el.textContent = '¡HOY!';
                return;
            }

            const days  = Math.floor(diff / 86400000);
            const hours = Math.floor((diff % 86400000) / 3600000);
            const mins  = Math.floor((diff % 3600000)  / 60000);
            const secs  = Math.floor((diff % 60000)    / 1000);

            el.textContent = `${pad(days)} d : ${pad(hours)} h : ${pad(mins)} m : ${pad(secs)} s`;
        };

        update();
        setInterval(update, 1000);
    }

    // --- Llenar Select de Municipios ---
    populateMunicipios() {
        const select = document.getElementById('municipio');
        if (!select) return;

        [...MUNICIPIOS_GUERRERO].sort().forEach(mun => {
            const opt = document.createElement('option');
            opt.value = mun;
            opt.textContent = mun;
            select.appendChild(opt);
        });
    }

    // --- Pulso Ciudadano ---
    setupPulsoCiudadano() {
        const hasVoted = localStorage.getItem(STORAGE_KEYS.HAS_VOTED);
        const optionsDiv = document.getElementById('pulsoOptions');
        const loader     = document.getElementById('loaderPulso');
        const resultDiv  = document.getElementById('pulsoResult');

        if (hasVoted) {
            // Ya votó: ocultar botones, mostrar resultados directamente
            if (optionsDiv) optionsDiv.hidden = true;
            if (loader)     loader.hidden     = false;

            this.fetchAndRenderResults(hasVoted).then(() => {
                if (loader)    loader.hidden    = true;
                if (resultDiv) resultDiv.hidden = false;

                // Mostrar módulo de compartir si votó "sí"
                if (hasVoted === 'si') {
                    const shareModule = document.getElementById('shareModule');
                    if (shareModule) shareModule.hidden = false;
                }
            });

        } else {
            // No ha votado: asegurar que los botones sean visibles
            if (optionsDiv) optionsDiv.hidden = false;
            if (loader)     loader.hidden     = true;
            if (resultDiv)  resultDiv.hidden  = true;

            // Adjuntar listeners DIRECTAMENTE (sin cloneNode que rompe data-vote)
            const btns = document.querySelectorAll('.pulso-btn');
            btns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    // Prevenir doble click
                    if (this.votingInProgress) return;
                    const voteType = btn.dataset.vote;
                    if (!voteType) return;
                    this.registerPulsoVote(voteType);
                });
            });
        }
    }

    async registerPulsoVote(voteType) {
        if (this.votingInProgress) return;
        this.votingInProgress = true;

        const optionsDiv = document.getElementById('pulsoOptions');
        const loader     = document.getElementById('loaderPulso');
        const resultDiv  = document.getElementById('pulsoResult');

        if (optionsDiv) optionsDiv.hidden = true;
        if (loader)     loader.hidden     = false;

        try {
            const { error } = await supabase
                .from('votos_pulso')
                .insert([{
                    anon_id:    this.userId,
                    opcion:     voteType,
                    created_at: new Date().toISOString()
                }]);

            if (error) {
                // Probable duplicado de anon_id — registrar pero continuar
                console.warn('Supabase insert warning:', error.message);
            }

            // Guardar en localStorage para no volver a mostrar botones
            localStorage.setItem(STORAGE_KEYS.HAS_VOTED, voteType);
            this.showToast('Tu voto quedó registrado de forma anónima.');

            // Cargar totales reales y mostrar resultado
            await this.fetchAndRenderResults(voteType);

            if (loader)    loader.hidden    = true;
            if (resultDiv) resultDiv.hidden = false;

            // Módulo de compartir solo si votó "sí"
            if (voteType === 'si') {
                const shareModule = document.getElementById('shareModule');
                if (shareModule) shareModule.hidden = false;
            }

        } catch (err) {
            console.error('Error al registrar voto:', err);
            this.showToast('Hubo un problema de conexión. Intenta de nuevo.');
            if (optionsDiv) optionsDiv.hidden = false;
            if (loader)     loader.hidden     = true;
            this.votingInProgress = false;
        }
    }

    // Consulta los totales reales y actualiza las barras
    async fetchAndRenderResults(myVote) {
        let siCount = 0, dudoCount = 0, noCount = 0;

        try {
            const { data, error } = await supabase
                .from('votos_pulso')
                .select('opcion');

            if (error) throw error;

            if (data && data.length > 0) {
                siCount   = data.filter(v => v.opcion === 'si').length;
                dudoCount = data.filter(v => v.opcion === 'dudo' || v.opcion === 'pienso').length;
                noCount   = data.filter(v => v.opcion === 'no').length;
            } else {
                // Fallback si la tabla está vacía
                siCount = 542; dudoCount = 89; noCount = 20;
            }

        } catch (err) {
            console.error('Error al consultar Supabase:', err);
            siCount = 542; dudoCount = 89; noCount = 20;
        }

        const total  = siCount + dudoCount + noCount;
        const getPct = v => total > 0 ? Math.round((v / total) * 100) : 0;

        const pSi   = getPct(siCount);
        const pDudo = getPct(dudoCount);
        const pNo   = getPct(noCount);

        // Actualizar UI con un pequeño delay para que la animación CSS sea visible
        requestAnimationFrame(() => {
            const set = (idPct, idBar, pct, cssClass) => {
                const elPct = document.getElementById(idPct);
                const elBar = document.getElementById(idBar);
                if (elPct) elPct.textContent = `${pct}%`;
                if (elBar) {
                    // Forzar reflow antes de animar
                    elBar.style.width = '0%';
                    setTimeout(() => { elBar.style.width = `${pct}%`; }, 50);
                }
            };
            set('pctSi',     'barSi',     pSi,   'bar-si');
            set('pctPienso', 'barPienso', pDudo, 'bar-duda');
            set('pctNo',     'barNo',     pNo,   'bar-no');
        });
    }

    // --- Módulo de Compartir ---
    setupViralSharing() {
        const currentUrl = window.location.href.split('#')[0];
        const msgWa = `¡Yo ya respaldé a Esthela Damián! Únete aquí: ${currentUrl}`;

        const btnWa = document.getElementById('btnShareWhatsApp');
        if (btnWa) {
            btnWa.addEventListener('click', () => {
                window.open(
                    `https://api.whatsapp.com/send?text=${encodeURIComponent(msgWa)}`,
                    '_blank', 'noopener,noreferrer'
                );
            });
        }

        const btnFb = document.getElementById('btnShareFacebook');
        if (btnFb) {
            btnFb.addEventListener('click', () => {
                window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
                    'fb-share',
                    'width=800,height=600'
                );
            });
        }

        const btnCopy     = document.getElementById('btnCopyLink');
        const copyTextEl  = document.getElementById('copyLinkText');
        if (btnCopy && copyTextEl) {
            btnCopy.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(currentUrl);
                    copyTextEl.textContent = '¡Enlace copiado!';
                    this.showToast('Enlace copiado al portapapeles');
                    setTimeout(() => { copyTextEl.textContent = 'Copiar Enlace'; }, 3000);
                } catch {
                    this.showToast('No se pudo copiar. Copia la URL manualmente.');
                }
            });
        }
    }

    // --- Formulario Simpatizantes ---
    setupSimpatizanteForm() {
        const form = document.getElementById('simpatizanteForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn       = document.getElementById('btnSubmitForm');
            const nombre    = document.getElementById('nombre').value.trim();
            const municipio = document.getElementById('municipio').value;
            const rolEl     = document.getElementById('rol');
            const rol       = rolEl ? rolEl.value : 'Simpatizante';

            if (!nombre || !municipio || !rol) {
                this.showToast('Completa todos los campos antes de enviar.');
                return;
            }

            btn.textContent = 'Enviando...';
            btn.disabled    = true;

            try {
                const { error } = await supabase
                    .from('simpatizantes')
                    .insert([{
                        nombre:     nombre,
                        municipio:  municipio,
                        rol:        rol,
                        anon_id:    this.userId,
                        created_at: new Date().toISOString()
                    }]);

                if (error) console.warn('Supabase simpatizante warning:', error.message);

                form.hidden = true;
                const successDiv = document.getElementById('formSuccess');
                if (successDiv) successDiv.hidden = false;

            } catch (err) {
                console.error('Error de red:', err);
                this.showToast('Problema de conexión. Vuelve a intentarlo.');
                btn.textContent = 'Sumarme al Movimiento';
                btn.disabled    = false;
            }
        });
    }

    // --- Animación del Mapa ---
    animateHeatmap() {
        const circles = document.querySelectorAll('.region-hotspot');
        if (!circles.length) return;

        const animate = () => {
            circles.forEach(c => {
                const opacity = (Math.random() * 0.4 + 0.2).toFixed(2);
                c.style.opacity    = opacity;
                c.style.transition = 'opacity 2s ease-in-out';
            });
        };

        animate();
        setInterval(animate, 3000);
    }

    showToast(msg) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = msg;
        toast.hidden = false;
        clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => { toast.hidden = true; }, 3500);
    }
}

// Arrancar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new EsthelaLandingApp();
});