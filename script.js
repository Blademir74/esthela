/**
 * CORE LOGIC: Pulso Digital Guerrero
 * Optimized for Vercel Static Deployment
 * Anonymous localStorage Voting Standard
 */

class PulsoDigital {
    constructor() {
        this.STORAGE_KEY = 'guerrero_pulse_v1';
        this.VOTED_KEY = 'guerrero_has_voted';
        this.stats = this.getStats();
        this.init();
    }

    init() {
        this.renderStats();
        this.setupEventListeners();
        this.checkIfVoted();
        this.initHeatmap();
        this.initCountdown();
        this.updateFooterYear();
    }

    getStats() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) return JSON.parse(saved);
        
        return {
            si: 8420,
            duda: 1205,
            no: 432,
            total: 10057,
            today: 342,
            trend: 12.5
        };
    }

    saveStats() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.stats));
    }

    checkIfVoted() {
        const hasVoted = localStorage.getItem(this.VOTED_KEY);
        if (hasVoted) {
            this.showResult(hasVoted, false);
        }
    }

    setupEventListeners() {
        const voteBtns = document.querySelectorAll('.pulso-btn');
        voteBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const vote = btn.dataset.vote;
                this.handleVote(vote);
            });
        });

        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        const rolForm = document.getElementById('rolForm');
        if (rolForm) {
            rolForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegistration();
            });
        }

        const closeModals = document.querySelectorAll('[data-close-modal]');
        closeModals.forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = document.getElementById('modalRol');
                if (modal) modal.hidden = true;
            });
        });

        const triggerBtns = document.querySelectorAll('[data-open-form]');
        triggerBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const rol = btn.dataset.openForm;
                this.openModal(rol);
            });
        });
    }

    handleVote(vote) {
        if (localStorage.getItem(this.VOTED_KEY)) {
            this.showToast('Ya has registrado tu pulso hoy.');
            return;
        }

        this.stats[vote]++;
        this.stats.total++;
        this.stats.today++;
        this.saveStats();

        localStorage.setItem(this.VOTED_KEY, vote);
        this.showResult(vote, true);
        this.renderStats();
    }

    showResult(votedOption, animate = true) {
        const options = document.getElementById('pulsoOptions');
        const result = document.getElementById('pulsoResult');
        const postVoteCTA = document.getElementById('postVoteCTA');
        
        if (options && result) {
            options.style.display = 'none';
            result.hidden = false;
            if (postVoteCTA) postVoteCTA.hidden = false;
        }
    }

    renderStats() {
        const total = this.stats.total;
        const pctSi = Math.round((this.stats.si / total) * 100);
        const pctDuda = Math.round((this.stats.duda / total) * 100);
        const pctNo = Math.round((this.stats.no / total) * 100);

        this.updateElement('pctSi', `${pctSi}%`);
        this.updateElement('pctDuda', `${pctDuda}%`);
        this.updateElement('pctNo', `${pctNo}%`);
        this.updateElement('totalVotes', total.toLocaleString());
        this.updateElement('pulsosHoy', this.stats.today);
        this.updateElement('totalAcumulado', total.toLocaleString());
        this.updateElement('trendToday', `+${this.stats.trend}%`);

        this.updateBar('barSi', pctSi);
        this.updateBar('barDuda', pctDuda);
        this.updateBar('barNo', pctNo);
    }

    updateElement(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }

    updateBar(id, pct) {
        const el = document.getElementById(id);
        if (el) el.style.width = `${pct}%`;
    }

    initHeatmap() {
        const rankingList = document.getElementById('rankingList');
        if (!rankingList) return;

        const regions = [
            { name: 'Costa Chica', value: 88, trend: 'up' },
            { name: 'Centro', value: 76, trend: 'up' },
            { name: 'Acapulco', value: 65, trend: 'stable' },
            { name: 'Costa Grande', value: 54, trend: 'up' },
            { name: 'Norte', value: 42, trend: 'up' }
        ];

        rankingList.innerHTML = regions.map((r, i) => `
            <li class="ranking-item">
                <span class="rank-name">${r.name}</span>
                <span class="rank-value">${r.value}%</span>
            </li>
        `).join('');
    }

    initCountdown() {
        const targetDate = new Date('2026-06-22T00:00:00').getTime();
        const update = () => {
            const now = new Date().getTime();
            const diff = targetDate - now;
            if (diff < 0) return;
            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            this.updateElement('cdDays', String(d).padStart(2, '0'));
            this.updateElement('cdHours', String(h).padStart(2, '0'));
            this.updateElement('cdMins', String(m).padStart(2, '0'));
        };
        setInterval(update, 60000);
        update();
    }

    handleRegistration() {
        const success = document.getElementById('modalSuccess');
        const form = document.getElementById('rolForm');
        if (success && form) {
            form.hidden = true;
            success.hidden = false;
        }
    }

    openModal(rol) {
        const modal = document.getElementById('modalRol');
        const title = document.getElementById('modalTitle');
        if (modal && title) {
            modal.hidden = false;
            title.textContent = `Sumarme como ${rol.charAt(0).toUpperCase() + rol.slice(1)}`;
            const form = document.getElementById('rolForm');
            const success = document.getElementById('modalSuccess');
            if (form && success) {
                form.hidden = false;
                success.hidden = true;
            }
        }
    }

    showToast(msg) {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = msg;
            toast.hidden = false;
            setTimeout(() => toast.hidden = true, 3000);
        }
    }

    updateFooterYear() {
        const el = document.getElementById('footerYear');
        if (el) el.textContent = new Date().getFullYear();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PulsoDigital();
});
