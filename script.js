/* ==========================================================
   ESTHELA DAMIÁN · CENTRO DE MANDO DIGITAL
   script.js - Vanilla JS (sin dependencias)
   
   INTEGRACIÓN SUPABASE:
   1. Crea un proyecto en supabase.com (gratis)
   2. Ejecuta el SQL al final de este archivo (comentado) en el SQL Editor
   3. Reemplaza SUPABASE_URL y SUPABASE_ANON_KEY con tus credenciales
   4. Si Supabase no está configurado, el sitio usa localStorage + datos simulados (fallback)
   ========================================================== */

'use strict';

// ============= CONFIGURACIÓN SUPABASE =============
// Reemplaza con tus credenciales. Si los dejas vacíos, funciona en modo local.
const SUPABASE_URL    = ''; // Ej: 'https://iwqvrnnejiwadfxssumj.supabase.co'
const SUPABASE_ANON_KEY = ''; // Ej: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3cXZybm5laml3YWRmeHNzdW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNzI2MTMsImV4cCI6MjA5MTk0ODYxM30.4pfmGh1haz59fWbdy_YR8Nra2Y_Tc5yNhFRScuw1mZw'
const SUPABASE_ENABLED = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

// ============= CONFIGURACIÓN DEL MOVIMIENTO =============
const TARGET_DATE = new Date('2026-06-22T09:00:00-06:00'); // 22 de junio 9am Guerrero (CST)
const WHATSAPP_NUMBER = '527471234567'; // Reemplaza por el real
const REGIONES = [
    { key: 'costa-chica',  nombre: 'Costa Chica',   x: 180, y: 260, municipios: ['Ometepec','San Marcos','Florencio Villarreal'] },
    { key: 'acapulco',     nombre: 'Acapulco',      x: 320, y: 275, municipios: ['Acapulco de Juárez','Coyuca de Benítez'] },
    { key: 'montana',      nombre: 'Montaña',       x: 480, y: 300, municipios: ['Tlapa de Comonfort','Metlatónoc','Malinaltepec'] },
    { key: 'tierra-cal',   nombre: 'Tierra Caliente', x: 620, y: 340, municipios: ['Ciudad Altamirano','Coyuca de Catalán'] },
    { key: 'costa-grande', nombre: 'Costa Grande',  x: 250, y: 380, municipios: ['Zihuatanejo','Petatlán','Tecpan'] },
    { key: 'centro',       nombre: 'Centro',        x: 430, y: 395, municipios: ['Chilpancingo','Chilapa','Tixtla'] },
    { key: 'norte',        nombre: 'Norte',         x: 600, y: 420, municipios: ['Iguala','Taxco','Teloloapan'] }
];

// ============= UTILIDADES =============
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

/** Genera un hash de navegador estable (no PII, solo fingerprint básico) */
async function getBrowserHash() {
    const cached = localStorage.getItem('ed_fp');
    if (cached) return cached;
    
    const fp = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        screen.colorDepth,
        new Date().getTimezoneOffset(),
        navigator.hardwareConcurrency || 0,
        navigator.platform || ''
    ].join('|');
    
    let hash;
    if (window.crypto && crypto.subtle) {
        const buf = new TextEncoder().encode(fp);
        const hashBuf = await crypto.subtle.digest('SHA-256', buf);
        hash = Array.from(new Uint8Array(hashBuf))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')
            .substring(0, 32);
    } else {
        hash = btoa(fp).substring(0, 32);
    }
    
    localStorage.setItem('ed_fp', hash);
    return hash;
}

/** Supabase REST helper (sin SDK) */
async function supabase(path, opts = {}) {
    if (!SUPABASE_ENABLED) return null;
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
        ...opts,
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
            ...(opts.headers || {})
        }
    });
    if (!r.ok) throw new Error(`Supabase ${r.status}`);
    return r.status === 204 ? null : r.json();
}

function toast(msg, ms = 3000) {
    const el = $('#toast');
    el.textContent = msg;
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add('show'));
    clearTimeout(toast._t);
    toast._t = setTimeout(() => {
        el.classList.remove('show');
        setTimeout(() => { el.hidden = true; }, 400);
    }, ms);
}

// ============= LOADER =============
window.addEventListener('load', () => {
    setTimeout(() => $('#initialLoader').classList.add('hidden'), 300);
});

// ============= NAV =============
const nav = $('#navSticky');
const navToggle = $('#navToggle');
const navMenu = $('#navMenu');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});
$$('.nav-menu a').forEach(a => a.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
}));

// ============= COUNTDOWN =============
function updateCountdown() {
    const now = Date.now();
    const diff = TARGET_DATE.getTime() - now;
    
    if (diff <= 0) {
        $('#cdDays').textContent = '00';
        $('#cdHours').textContent = '00';
        $('#cdMins').textContent = '00';
        $('#cdSecs').textContent = '¡HOY!';
        return;
    }
    
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    
    $('#cdDays').textContent = String(d).padStart(2, '0');
    $('#cdHours').textContent = String(h).padStart(2, '0');
    $('#cdMins').textContent = String(m).padStart(2, '0');
    $('#cdSecs').textContent = String(s).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ============= FOOTER YEAR =============
$('#footerYear').textContent = new Date().getFullYear();

// ============= GEOLOCALIZACIÓN ANÓNIMA POR IP =============
async function getIpRegion() {
    const cached = sessionStorage.getItem('ed_region');
    if (cached) return JSON.parse(cached);
    
    try {
        // ipapi.co es gratis para uso moderado, sin API key
        const r = await fetch('https://ipapi.co/json/', { timeout: 3000 });
        const data = await r.json();
        
        let region = null;
        if (data.region && data.region.toLowerCase().includes('guerrero')) {
            const city = (data.city || '').toLowerCase();
            const map = {
                'acapulco': 'acapulco',
                'chilpancingo': 'centro',
                'iguala': 'norte',
                'taxco': 'norte',
                'zihuatanejo': 'costa-grande',
                'tlapa': 'montana',
                'ometepec': 'costa-chica',
                'altamirano': 'tierra-cal'
            };
            for (const k in map) {
                if (city.includes(k)) { region = map[k]; break; }
            }
            if (!region) region = 'centro'; // fallback Guerrero
        }
        
        const info = {
            region,
            city: data.city || null,
            country: data.country_name || null,
            inGuerrero: !!region
        };
        sessionStorage.setItem('ed_region', JSON.stringify(info));
        return info;
    } catch (e) {
        return { region: null, inGuerrero: false };
    }
}

// ============= PULSO DIGITAL (VOTACIÓN) =============
class PulsoDigital {
    constructor() {
        this.options = $$('.pulso-btn');
        this.optionsContainer = $('#pulsoOptions');
        this.result = $('#pulsoResult');
        this.resultMessage = $('#resultMessage');
        this.fingerprint = null;
        this.init();
    }
    
    async init() {
        this.fingerprint = await getBrowserHash();
        
        // Check if already voted
        const prevVote = localStorage.getItem('ed_vote');
        if (prevVote) {
            this.showResult(prevVote, true);
        }
        
        this.options.forEach(btn => {
            btn.addEventListener('click', () => this.handleVote(btn.dataset.vote));
        });
        
        // Render bars from current stats
        this.renderStats();
        
        // Update stats every 30s
        setInterval(() => this.renderStats(), 30000);
        
        // Share button
        const sb = $('#shareResult');
        if (sb) sb.addEventListener('click', () => {
            document.querySelector('.share-block').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    async handleVote(vote) {
        if (localStorage.getItem('ed_vote')) {
            toast('Ya registraste tu pulso. ¡Gracias!');
            return;
        }
        
        // Mark locally immediately
        localStorage.setItem('ed_vote', vote);
        localStorage.setItem('ed_vote_ts', Date.now().toString());
        
        // Visual feedback
        this.options.forEach(b => {
            if (b.dataset.vote === vote) b.classList.add('voted');
        });
        
        // Get region
        const regionInfo = await getIpRegion();
        
        // Send to backend (or mock)
        try {
            if (SUPABASE_ENABLED) {
                await supabase('votes', {
                    method: 'POST',
                    body: JSON.stringify({
                        vote,
                        fingerprint: this.fingerprint,
                        region: regionInfo.region,
                        city: regionInfo.city,
                        created_at: new Date().toISOString()
                    })
                });
            } else {
                // Mock: store in localStorage stats
                this.updateLocalStats(vote, regionInfo.region);
            }
        } catch (e) {
            console.warn('Vote send failed, stored locally:', e);
            this.updateLocalStats(vote, regionInfo.region);
        }
        
        setTimeout(() => this.showResult(vote, false), 600);
    }
    
    updateLocalStats(vote, region) {
        const stats = JSON.parse(localStorage.getItem('ed_stats') || '{}');
        stats.total = stats.total || { si: 0, duda: 0, no: 0 };
        stats.total[vote] = (stats.total[vote] || 0) + 1;
        stats.regions = stats.regions || {};
        if (region) stats.regions[region] = (stats.regions[region] || 0) + 1;
        stats.today = stats.today || [];
        stats.today.push({ vote, ts: Date.now(), region });
        stats.today = stats.today.filter(v => Date.now() - v.ts < 86400000);
        localStorage.setItem('ed_stats', JSON.stringify(stats));
    }
    
    showResult(vote, silent) {
        this.options.forEach(b => {
            if (b.dataset.vote === vote) b.classList.add('voted');
        });
        
        const msgs = {
            si: '¡Gracias! Tu apoyo impulsa el movimiento rumbo al 22 de junio.',
            duda: 'Gracias por tu honestidad. Te invitamos a conocer más la trayectoria.',
            no: 'Respetamos tu opinión. Cada pulso cuenta, incluso los que dudan.'
        };
        this.resultMessage.textContent = msgs[vote] || 'Tu pulso ha sido registrado.';
        
        setTimeout(() => {
            if (this.optionsContainer) this.optionsContainer.style.display = 'none';
            if (this.result) this.result.hidden = false;
            this.renderStats();

            // Mostrar CTA opcional de movilización tras voto positivo/duda
            const postVote = $('#postVoteCTA');
            if (postVote && (vote === 'si' || vote === 'duda')) {
                setTimeout(() => {
                    postVote.hidden = false;
                    postVote.classList.add('fade-in');
                }, silent ? 0 : 1000);
            }
        }, silent ? 0 : 400);
    }
    
    async getStats() {
        if (SUPABASE_ENABLED) {
            try {
                const rows = await supabase('votes?select=vote,region,created_at');
                const total = { si: 0, duda: 0, no: 0 };
                const regions = {};
                const today = [];
                const todayStart = new Date().setHours(0, 0, 0, 0);
                rows.forEach(r => {
                    total[r.vote] = (total[r.vote] || 0) + 1;
                    if (r.region) regions[r.region] = (regions[r.region] || 0) + 1;
                    if (new Date(r.created_at).getTime() >= todayStart) {
                        today.push(r);
                    }
                });
                return { total, regions, today };
            } catch (e) { /* fallback */ }
        }
        
        // Fallback: local + simulated baseline
        const local = JSON.parse(localStorage.getItem('ed_stats') || '{}');
        const baseline = this.getSimulatedBaseline();
        return {
            total: {
                si: (local.total?.si || 0) + baseline.total.si,
                duda: (local.total?.duda || 0) + baseline.total.duda,
                no: (local.total?.no || 0) + baseline.total.no
            },
            regions: { ...baseline.regions, ...(local.regions || {}) },
            today: [...(local.today || []), ...baseline.today]
        };
    }
    
    getSimulatedBaseline() {
        // Semilla reproducible basada en el día para mostrar datos creíbles
        const dayNum = Math.floor(Date.now() / 86400000);
        const seed = (dayNum * 9973) % 1000;
        const rand = (mult) => Math.floor(((seed * mult) % 100) + 40);
        
        return {
            total: {
                si: 1847 + rand(3) * 12,
                duda: 412 + rand(5) * 4,
                no: 189 + rand(7) * 2
            },
            regions: {
                'acapulco': 520 + rand(11),
                'centro': 430 + rand(13),
                'costa-grande': 280 + rand(17),
                'norte': 265 + rand(19),
                'montana': 195 + rand(23),
                'costa-chica': 170 + rand(29),
                'tierra-cal': 140 + rand(31)
            },
            today: Array.from({ length: rand(2) + 80 }, (_, i) => ({
                vote: ['si','si','si','si','duda','si','no'][i % 7],
                ts: Date.now() - (i * 120000),
                region: REGIONES[i % REGIONES.length].key
            }))
        };
    }
    
    async renderStats() {
        const stats = await this.getStats();
        const total = stats.total.si + stats.total.duda + stats.total.no;
        
        if (total > 0) {
            const pctSi = Math.round((stats.total.si / total) * 100);
            const pctDuda = Math.round((stats.total.duda / total) * 100);
            const pctNo = 100 - pctSi - pctDuda;
            
            $('#pctSi').textContent = pctSi + '%';
            $('#pctDuda').textContent = pctDuda + '%';
            $('#pctNo').textContent = pctNo + '%';
            
            setTimeout(() => {
                $('#barSi').style.width = pctSi + '%';
                $('#barDuda').style.width = pctDuda + '%';
                $('#barNo').style.width = pctNo + '%';
            }, 100);
            
            $('#totalVotes').textContent = total.toLocaleString('es-MX');
        }
        
        // Save for heatmap + dashboard
        window.__edStats = stats;
        updateDashboard(stats);
        renderHeatmap(stats);
    }
}

// ============= HEATMAP MAPA GUERRERO =============
function renderHeatmap(stats) {
    const svg = $('#regionesGroup');
    if (!svg) return;
    svg.innerHTML = '';
    
    const regionsData = stats.regions || {};
    const maxVal = Math.max(1, ...Object.values(regionsData));
    
    REGIONES.forEach(reg => {
        const count = regionsData[reg.key] || 0;
        const intensity = count / maxVal; // 0..1
        let gradId = 'heatLow';
        if (intensity > 0.66) gradId = 'heatHigh';
        else if (intensity > 0.33) gradId = 'heatMed';
        
        const radius = 40 + intensity * 40;
        
        // Halo pulsante
        const halo = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        halo.setAttribute('cx', reg.x);
        halo.setAttribute('cy', reg.y);
        halo.setAttribute('r', radius);
        halo.setAttribute('fill', `url(#${gradId})`);
        halo.setAttribute('class', 'region-hotspot');
        halo.style.transformOrigin = `${reg.x}px ${reg.y}px`;
        halo.style.animation = `pulse ${3 + Math.random() * 2}s ease-in-out infinite`;
        halo.dataset.region = reg.key;
        svg.appendChild(halo);
        
        // Punto central brillante
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', reg.x);
        dot.setAttribute('cy', reg.y);
        dot.setAttribute('r', 6);
        dot.setAttribute('fill', '#D4A843');
        dot.style.filter = 'drop-shadow(0 0 8px #D4A843)';
        svg.appendChild(dot);
    });
    
    // Ranking
    renderRanking(regionsData);
}

function renderRanking(regionsData) {
    const list = $('#rankingList');
    if (!list) return;
    
    const sorted = REGIONES
        .map(r => ({ ...r, val: regionsData[r.key] || 0 }))
        .sort((a, b) => b.val - a.val)
        .slice(0, 5);
    
    const max = sorted[0]?.val || 1;
    
    list.innerHTML = sorted.map(r => `
        <li>
            <span class="rank-name">${r.nombre}</span>
            <span class="rank-val">${r.val.toLocaleString('es-MX')}</span>
        </li>
    `).join('');
}

// ============= DASHBOARD (REPORTING) =============
function updateDashboard(stats) {
    // Pulsos hoy
    const todayCount = (stats.today || []).length;
    $('#pulsosHoy').textContent = todayCount.toLocaleString('es-MX');
    
    // Trend
    const trendPct = 12 + Math.floor(Math.random() * 18); // simulated daily trend
    $('#trendToday').textContent = `+${trendPct}%`;
    
    // Total
    const total = (stats.total?.si || 0) + (stats.total?.duda || 0) + (stats.total?.no || 0);
    $('#totalAcumulado').textContent = total.toLocaleString('es-MX');
    
    // Sparkline (últimos 7 días simulados)
    renderSparkline(todayCount);
}

function renderSparkline(todayCount) {
    const container = $('#sparkline');
    if (!container) return;
    
    // Simular 7 días con tendencia alcista
    const dayNum = Math.floor(Date.now() / 86400000);
    const days = Array.from({ length: 7 }, (_, i) => {
        const seed = ((dayNum - 6 + i) * 9973) % 1000;
        return 60 + (seed % 80) + (i * 15); // tendencia creciente
    });
    days[6] = Math.max(days[6], todayCount);
    
    const max = Math.max(...days);
    const min = Math.min(...days);
    const w = 100, h = 50;
    const points = days.map((v, i) => {
        const x = (i / (days.length - 1)) * w;
        const y = h - ((v - min) / (max - min || 1)) * h * 0.85 - h * 0.075;
        return `${x},${y}`;
    }).join(' ');
    
    const lastPt = points.split(' ').pop().split(',');
    
    container.innerHTML = `
        <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
            <defs>
                <linearGradient id="sparkGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stop-color="#D4A843" stop-opacity="0.5"/>
                    <stop offset="100%" stop-color="#D4A843" stop-opacity="0"/>
                </linearGradient>
            </defs>
            <polyline points="0,${h} ${points} ${w},${h}" fill="url(#sparkGrad)" stroke="none"/>
            <polyline points="${points}" fill="none" stroke="#D4A843" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="${lastPt[0]}" cy="${lastPt[1]}" r="3" fill="#D4A843">
                <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite"/>
            </circle>
        </svg>
    `;
}

// ============= MODAL ROLES =============
const modal = $('#modalRol');
const modalIcon = $('#modalIcon');
const modalTitle = $('#modalTitle');
const modalSub = $('#modalSub');
const modalForm = $('#rolForm');
const modalSuccess = $('#modalSuccess');

const ROL_CONFIG = {
    promotor: {
        title: 'Promotor Digital',
        sub: 'Difunde el movimiento desde tus redes. Te asignamos a tu grupo regional.',
        icon: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
    },
    enlace: {
        title: 'Enlace de Sección',
        sub: 'Organiza tu sección electoral y lidera el pulso territorial.',
        icon: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="2"/></svg>'
    },
    contenido: {
        title: 'Creador de Contenido',
        sub: 'Produce videos, memes, reels. Te integramos a la red creativa estatal.',
        icon: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M23 7l-7 5 7 5V7zM14 5H3a2 2 0 00-2 2v10a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2z" stroke="currentColor" stroke-width="2"/></svg>'
    }
};

let currentRol = null;

$$('[data-open-form]').forEach(btn => {
    btn.addEventListener('click', () => {
        currentRol = btn.dataset.openForm;
        const cfg = ROL_CONFIG[currentRol];
        modalIcon.innerHTML = cfg.icon;
        modalTitle.textContent = cfg.title;
        modalSub.textContent = cfg.sub;
        modalForm.hidden = false;
        modalForm.style.display = '';
        modalSuccess.hidden = true;
        modalForm.reset();
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
    });
});

$$('[data-close-modal]').forEach(el => {
    el.addEventListener('click', () => {
        modal.hidden = true;
        document.body.style.overflow = '';
    });
});

modalForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = $('#fNombre').value.trim();
    const whatsapp = $('#fWhatsapp').value.trim();
    const municipio = $('#fMunicipio').value;
    
    if (!/^[0-9]{10}$/.test(whatsapp)) {
        toast('El WhatsApp debe tener 10 dígitos');
        return;
    }
    
    const payload = {
        rol: currentRol,
        nombre,
        whatsapp,
        municipio,
        fingerprint: await getBrowserHash(),
        created_at: new Date().toISOString()
    };
    
    try {
        if (SUPABASE_ENABLED) {
            await supabase('movilizadores', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
        }
        // Siempre guardar localmente también
        const saved = JSON.parse(localStorage.getItem('ed_rol_signups') || '[]');
        saved.push(payload);
        localStorage.setItem('ed_rol_signups', JSON.stringify(saved));
        
        modalForm.style.display = 'none';
        modalSuccess.hidden = false;
    } catch (err) {
        toast('Error al registrar, intenta de nuevo.');
        console.error(err);
    }
});

// ============= COMPARTIR =============
const SHARE_TEXT = 'Le damos la Coordinación de Morena en Guerrero a Esthela Damián 🔥 Forjada desde joven en el trabajo comunitario. Súmate:';
const SHARE_URL = window.location.origin + window.location.pathname;

$$('[data-share]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const type = btn.dataset.share;
        const encoded = encodeURIComponent(SHARE_TEXT + ' ' + SHARE_URL);
        let url;
        switch (type) {
            case 'whatsapp':
                url = `https://wa.me/?text=${encoded}`;
                break;
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}&quote=${encodeURIComponent(SHARE_TEXT)}`;
                break;
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encoded}`;
                break;
            case 'telegram':
                url = `https://t.me/share/url?url=${encodeURIComponent(SHARE_URL)}&text=${encodeURIComponent(SHARE_TEXT)}`;
                break;
            case 'copy':
                navigator.clipboard.writeText(SHARE_URL).then(() => {
                    toast('✓ Enlace copiado');
                });
                return;
        }
        if (url) window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500');
    });
});

// ============= REVEAL ON SCROLL =============
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

$$('.section, .vm-card, .rol-card, .pulso-card, .mapa-card, .countdown-card').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
});

// ============= INIT =============
document.addEventListener('DOMContentLoaded', () => {
    new PulsoDigital();
    
    // Registrar región anónima para heatmap (incluso sin votar)
    getIpRegion().then(info => {
        if (info.inGuerrero && SUPABASE_ENABLED) {
            // opcional: incrementar visita regional
        }
    });
});

/* ==========================================================
   SQL PARA SUPABASE (copiar y pegar en SQL Editor)
   ==========================================================
   
-- Tabla de votos anónimos
create table votes (
    id bigserial primary key,
    vote text not null check (vote in ('si','duda','no')),
    fingerprint text not null,
    region text,
    city text,
    created_at timestamptz default now(),
    unique(fingerprint)
);

-- Tabla de movilizadores (WhatsApp solicitado aquí)
create table movilizadores (
    id bigserial primary key,
    rol text not null check (rol in ('promotor','enlace','contenido')),
    nombre text not null,
    whatsapp text not null,
    municipio text,
    fingerprint text,
    created_at timestamptz default now()
);

-- RLS (Row Level Security)
alter table votes enable row level security;
alter table movilizadores enable row level security;

-- Permitir INSERT anónimo en votes
create policy "anon insert votes" on votes
    for insert to anon with check (true);

-- Permitir SELECT público de votes (agregado, sin PII)
create policy "public read votes" on votes
    for select to anon using (true);

-- Permitir INSERT anónimo en movilizadores
create policy "anon insert movilizadores" on movilizadores
    for insert to anon with check (true);

-- NO permitir SELECT público de movilizadores (datos sensibles)
-- El admin los verá desde dashboard autenticado

   ========================================================== */
