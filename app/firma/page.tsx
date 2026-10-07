// app/firmas/page.tsx
'use client';
import { useState } from 'react';
import { MUNICIPIOS_GUERRERO, buildConsultaPayload } from '@/lib/consulta-data';
import SignaturePadConsulta from '@/components/SignaturePadConsulta';
import BadgeConsulta from '@/components/BadgeConsulta';

const P1_SI = 'SI_SEPARACION', P1_NO = 'NO_PERMANENCIA';
const CAND_ESTHELA = 'Esthela Damián', CAND_MOJICA = 'Beatriz Mojica';

export default function ConsultaPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nombre: '', municipio: '', whatsapp: '',
    p1: '', p2: '', inconformidad: '', firma: null as string | null,
  });
  const [badge, setBadge] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 14280, municipios: 81 });

  const canNext = () => {
    if (step === 1) return form.nombre.length >= 3 && form.municipio && form.whatsapp.length >= 10;
    if (step === 2) return !!form.p1 && !!form.p2;
    if (step === 3) return form.inconformidad.trim().length >= 10;
    return !!form.firma;
  };

  const submit = async () => {
    setLoading(true);
    const res = await fetch('/api/firmas', {
      method: 'POST',
      body: JSON.stringify({
        nombre: form.nombre, municipio: form.municipio, whatsapp: form.whatsapp,
        pregunta_1: form.p1, pregunta_2: form.p2,
        inconformidad: form.inconformidad, firma: form.firma,
      }),
    });
    setLoading(false);
    if (res.ok) {
      const saved = await res.json();
      setBadge(buildConsultaPayload(saved));
      setStats((s) => ({ ...s, total: s.total + 1 }));
    } else {
      alert('No pudimos registrar tu firma. Intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen consulta-bg text-white">
      <header className="fixed inset-x-0 top-0 z-40 consulta-header">
        <span className="font-display text-sm tracking-widest text-[#D4AF37]">ESTHELA DAMIÁN</span>
        <span className="consulta-hashtag">#PorlosCaminosdelSur</span>
      </header>

      <section className="consulta-hero pt-28 pb-10">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <p className="consulta-eyebrow">CONSULTA CIUDADANA · GUERRERO 2026</p>
          <h1 className="consulta-title">Por la Transparencia<br/>y la Soberanía Popular</h1>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Tu firma es un <strong className="text-[#D4AF37]">acto de soberanía</strong>. Cada registro queda foliado,
            clasificado y resguardado como instrumento jurídico-político del pueblo guerrerense.
          </p>
          <div className="mx-auto mt-6 grid max-w-md grid-cols-2 divide-x divide-white/10 consulta-stats">
            <div><p className="consulta-stat-num">{stats.total.toLocaleString('es-MX')}</p><p className="consulta-stat-label">Firmas Folio</p></div>
            <div><p className="consulta-stat-num">{stats.municipios} / 81</p><p className="consulta-stat-label">Municipios</p></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-5 pb-24">
        <div className="consulta-steps">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className={`consulta-step-dot ${step >= n ? 'active' : ''}`}>
              <span>{n}</span><span className="hidden sm:inline">{['Datos','Consulta','Catarsis','Firma'][n-1]}</span>
            </div>
          ))}
        </div>

        <div className="consulta-card mt-8 p-6 md:p-8">
          {step === 1 && (
            <div className="grid gap-5">
              <h2 className="consulta-h2">Paso 1 · Datos del Ciudadano</h2>
              <div>
                <label className="consulta-label">Nombre completo o alias verificado</label>
                <input className="consulta-input" placeholder="Ej. María C. o Juan Pérez" value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
              </div>
              <div>
                <label className="consulta-label">Municipio de Guerrero</label>
                <select className="consulta-input" value={form.municipio}
                  onChange={(e) => setForm({ ...form, municipio: e.target.value })}>
                  <option value="">Selecciona tu municipio…</option>
                  {MUNICIPIOS_GUERRERO.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="consulta-label">WhatsApp / Teléfono (10 dígitos)</label>
                <input className="consulta-input" type="tel" inputMode="numeric" placeholder="7471234567"
                  value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value.replace(/\D/g,'').slice(0,10) })} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-6">
              <h2 className="consulta-h2">Paso 2 · Consulta Ciudadana</h2>
              <fieldset>
                <legend className="consulta-question">
                  Pregunta 1 · Ante las inconsistencias e inconformidades registradas en el proceso de selección
                  de coordinaciones en Guerrero, ¿respaldas la exigencia popular para la separación del cargo de
                  Citlalli Hernández y Ariadna Montiel?
                </legend>
                <label className="consulta-radio"><input type="radio" name="p1" value={P1_SI} checked={form.p1===P1_SI}
                  onChange={(e) => setForm({ ...form, p1: e.target.value })} />
                  <span><strong>SÍ</strong>, exijo transparencia y separación del cargo para revisar el proceso.</span></label>
                <label className="consulta-radio"><input type="radio" name="p1" value={P1_NO} checked={form.p1===P1_NO}
                  onChange={(e) => setForm({ ...form, p1: e.target.value })} />
                  <span><strong>NO</strong>, considero que deben permanecer.</span></label>
              </fieldset>
              <fieldset>
                <legend className="consulta-question">
                  Pregunta 2 · Para encabezar los trabajos de organización y defensa de la transformación en Guerrero,
                  ¿a quién prefieres como Coordinadora Estatal?
                </legend>
                <label className="consulta-radio"><input type="radio" name="p2" value={CAND_ESTHELA} checked={form.p2===CAND_ESTHELA}
                  onChange={(e) => setForm({ ...form, p2: e.target.value })} />
                  <span><strong>Mtra. Esthela Damián</strong> — Experiencia nacional, raíz en Chilpancingo y trabajo de base.</span></label>
                <label className="consulta-radio"><input type="radio" name="p2" value={CAND_MOJICA} checked={form.p2===CAND_MOJICA}
                  onChange={(e) => setForm({ ...form, p2: e.target.value })} />
                  <span><strong>Beatriz Mojica</strong></span></label>
              </fieldset>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-5">
              <h2 className="consulta-h2">Paso 3 · Registro de Inconformidad</h2>
              <p className="text-sm text-white/70">Describe brevemente tu inconformidad o el motivo de tu firma sobre
                la situación política de tu municipio o del estado.</p>
              <textarea className="consulta-input min-h-[160px]" rows={6}
                placeholder="No estamos de acuerdo con la imposición desde el centro…"
                value={form.inconformidad} onChange={(e) => setForm({ ...form, inconformidad: e.target.value })} />
              <p className="text-xs text-white/50">{form.inconformidad.length}/1500 caracteres</p>
            </div>
          )}

          {step === 4 && (
            <div className="grid gap-5">
              <h2 className="consulta-h2">Paso 4 · Firma y Validación</h2>
              <p className="text-sm text-white/70">Tu firma digital sella el acta como documento válido. Tómate tu tiempo.</p>
              <SignaturePadConsulta onChange={(d) => setForm({ ...form, firma: d })} />
            </div>
          )}

          <div className="mt-8 flex justify-between gap-3">
            {step > 1 && <button className="consulta-ghost" onClick={() => setStep(step - 1)}>← Anterior</button>}
            {step < 4
              ? <button className="consulta-cta ml-auto" disabled={!canNext()} onClick={() => setStep(step + 1)}>Siguiente →</button>
              : <button className="consulta-cta ml-auto" disabled={!canNext() || loading} onClick={submit}>
                  {loading ? 'Registrando acta…' : '📜 Firmar y Validar mi Voz'}
                </button>}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-white/50">
        Consulta Ciudadana por la Transparencia · Guerrero es Primero 💚
      </footer>

      {badge && <BadgeConsulta data={badge} onClose={() => setBadge(null)} />}
    </div>
  );
}