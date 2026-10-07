'use client';
import { useState } from 'react';
import { MUNICIPIOS_GUERRERO, buildConsultaPayload } from '@/lib/consulta-data';
import SignaturePadConsulta from '@/components/firmas/SignaturePadConsulta';
import BadgeConsulta from '@/components/firmas/BadgeConsulta';

const P1_SI = 'SI_SEPARACION';
const P1_NO = 'NO_PERMANENCIA';
const CAND_ESTHELA = 'Esthela Damián';
const CAND_MOJICA = 'Beatriz Mojica';

export default function ConsultaPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nombre: '',
    municipio: '',
    whatsapp: '',
    p1: '',
    p2: '',
    inconformidad: '',
    firma: null as string | null,
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
    try {
      const res = await fetch('/api/firmas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          municipio: form.municipio,
          whatsapp: form.whatsapp,
          pregunta_1: form.p1,
          pregunta_2: form.p2,
          inconformidad: form.inconformidad,
          firma: form.firma,
        }),
      });

      if (res.ok) {
        const saved = await res.json();
        setBadge(buildConsultaPayload(saved));
        setStats((s) => ({ ...s, total: s.total + 1 }));
      } else {
        alert('No pudimos registrar tu firma. Intenta de nuevo.');
      }
    } catch (err) {
      alert('Error de conexión. Revisa tu internet.');
    } finally {
      setLoading(false);
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
          <h1 className="consulta-title">
            Por la Transparencia
            <br />y la Soberanía Popular
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Tu firma es un <strong className="text-[#D4AF37]">acto de soberanía</strong>. Cada registro queda foliado,
            clasificado y resguardado como instrumento jurídico-político del pueblo guerrerense.
          </p>
          <div className="mx-auto mt-6 grid max-w-md grid-cols-2 divide-x divide-white/10 consulta-stats">
            <div>
              <p className="consulta-stat-num">{stats.total.toLocaleString('es-MX')}</p>
              <p className="consulta-stat-label">Firmas Folio</p>
            </div>
            <div>
              <p className="consulta-stat-num">{stats.municipios} / 81</p>
              <p className="consulta-stat-label">Municipios</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-5 pb-24">
        <div className="consulta-steps">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className={`consulta-step-dot ${step >= n ? 'active' : ''}`}>
              <span>{n}</span>
              <span className="hidden sm:inline">{['Datos', 'Consulta', 'Catarsis', 'Firma'][n - 1]}</span>
            </div>
          ))}
        </div>

        <div className="consulta-card mt-8 p-6 md:p-8">
          {step === 1 && (
            <div className="grid gap-5">
              <h2 className="consulta-h2">Paso 1 · Datos del Ciudadano</h2>
              <div>
                <label className="consulta-label">Nombre completo o alias verificado</label>
                <input
                  className="consulta-input"
                  placeholder="Ej. María C. o Juan Pérez"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
              </div>
              <div>
                <label className="consulta-label">Municipio de Guerrero</label>
                <select
                  className="consulta-input"
                  value={form.municipio}
                  onChange={(e) => setForm({ ...form, municipio: e.target.value })}
                >
                  <option value="">Selecciona tu municipio…</option>
                  {MUNICIPIOS_GUERRERO.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="consulta-label">WhatsApp / Teléfono (10 dígitos)</label>
                <input
                  className="consulta-input"
                  type="tel"
                  inputMode="numeric"
                  placeholder="7471234567"
                  value={form.whatsapp}
                  onChange={(e) =>
                    setForm({ ...form, whatsapp: e.target.value.replace(/\D/g, '').slice(0, 10) })
                  }
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-6">
              <h2 className="consulta-h2">Paso 2 · Consulta Ciudadana</h2>
              <fieldset>
                <legend className="consulta-question">
                  Pregunta 1 · Ante las inconsistencias e inconformidades registradas en el proceso de selección de
                  coordinaciones en Guerrero, ¿respaldas la exigencia popular para la separación del cargo de Citlalli
                  Hernández y Ariadna Montiel?
                </legend>
                <label className="consulta-radio">
                  <input
                    type="radio"
                    name="p1"
                    value={P1_SI}
                    checked={form.p1 === P1_SI}
                    onChange={(e) => setForm({ ...form, p1: e.target.value })}
                  />
                  <span>
                    <strong>SÍ</strong>, exijo transparencia y separación del cargo para revisar el proceso.
                  </span>
                </label>
                <label className="consulta-radio">
                  <input
                    type="radio"
                    name="p1"
                    value={P1_NO}
                    checked={form.p1 === P1_NO}
                    onChange={(e) => setForm({ ...form, p1: e.target.value })}
                  />
                  <span>
                    <strong>NO</strong>, considero que deben permanecer.
                  </span>
                </label>
              </fieldset>
              <fieldset>
                <legend className="consulta-question">
                  Pregunta 2 · Para encabezar los trabajos de organización y defensa de la transformación en Guerrero,
                  ¿a quién prefieres como Coordinadora Estatal?
                </legend>
                <label className="consulta-radio">
                  <input
                    type="radio"
                    name="p2"
                    value={CAND_ESTHELA}
                    checked={form.p2 === CAND_ESTHELA}
                    onChange={(e) => setForm({ ...form, p2: e.target.value })}
                  />
                  <span>
                    <strong>Mtra. Esthela Damián</strong> — Experiencia nacional, raíz en Chilpancingo y trabajo de base.
                  </span>
                </label>
                <label className="consulta-radio">
                  <input
                    type="radio"
                    name="p2"
                    value={CAND_MOJICA}
                    checked={form.p2 === CAND_MOJICA}
                    onChange={(e) => setForm({ ...form, p2: e.target.value })}
                  />
                  <span>
                    <strong>Beatriz Mojica</strong>
                  </span>
                </label>
              </fieldset>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-5">
              <h2 className="consulta-h2">Paso 3 · Registro de Inconformidad</h2>
              <p className="text-sm text-white/70">
                Describe brevemente tu inconformidad o el motivo de tu firma sobre la situación política de tu municipio
                o del estado.
              </p>
              <textarea
                className="consulta-input min-h-[160px]"
                rows={6}
                placeholder="No estamos de acuerdo con la imposición desde el centro…"
                value={form.inconformidad}
                onChange={(e) => setForm({ ...form, inconformidad: e.target.value })}
              />
              <p className="text-xs text-white/50">{form.inconformidad.length}/1500 caracteres</p>
            </div>
          )}

          {step === 4 && (
            <div className="grid gap-5">
              <h2 className="consulta-h2">Paso 4 · Firma y Validación</h2>
              <p className="text-sm text-white/70">
                Tu firma digital sella el acta como documento válido. Tómate tu tiempo.
              </p>
              <SignaturePadConsulta onChange={(d) => setForm({ ...form, firma: d })} />
            </div>
          )}

          <div className="mt-8 flex justify-between gap-3">
            {step > 1 && (
              <button className="consulta-ghost" onClick={() => setStep(step - 1)}>
                ← Anterior
              </button>
            )}
            {step < 4 ? (
              <button
                className="consulta-cta ml-auto"
                disabled={!canNext()}
                onClick={() => setStep(step + 1)}
              >
                Siguiente →
              </button>
            ) : (
              <button
                className="consulta-cta ml-auto"
                disabled={!canNext() || loading}
                onClick={submit}
              >
                {loading ? 'Registrando acta…' : '📜 Firmar y Validar mi Voz'}
              </button>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-white/50">
        Consulta Ciudadana por la Transparencia · Guerrero es Primero 💚
      </footer>

      {/* WhatsApp flotante · 7474795833 · z-999 · right/bottom 20px */}
      <a
        href="https://wa.me/527474795833?text=Hola%2C%20quiero%20firmar%20la%20Consulta%20Ciudadana%20por%20la%20Transparencia%20en%20Guerrero.%20%C2%BFPodr%C3%ADan%20enviarme%20el%20link%3F"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escríbenos por WhatsApp"
        className="fixed z-[999] flex items-center justify-center rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-all hover:scale-110 active:scale-95"
        style={{
          bottom: '20px',
          right: '20px',
          width: '58px',
          height: '58px',
          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
        }}
      >
        <svg viewBox="0 0 32 32" width="30" height="30" fill="#fff">
          <path d="M16 3C9.4 3 4 8.2 4 14.7c0 2.6.9 5 2.3 7L4 29l7.5-2.2c1.4.7 2.9 1.1 4.5 1.1 6.6 0 12-5.2 12-11.7S22.6 3 16 3zm6 16.1c-.3.8-1.5 1.5-2.1 1.6-.6.1-1.2.3-4-.8-3.4-1.4-5.6-4.8-5.8-5-.2-.2-1.4-1.9-1.4-3.6s.9-2.5 1.2-2.9c.3-.3.7-.4.9-.4h.7c.2 0 .5-.1.8.6.3.8 1.1 2.7 1.2 2.9.1.2.2.4 0 .7-.2.3-.3.5-.5.8-.2.2-.4.5-.2.9.2.4 1.1 1.8 2.4 2.9 1.6 1.4 3 1.9 3.4 2.1.4.2.7.1 1-.1.3-.3 1.1-1.3 1.4-1.7.3-.4.6-.4 1-.2.4.1 2.5 1.2 2.9 1.4.4.2.7.3.8.5.1.2.1 1-.2 1.8z" />
        </svg>
      </a>

      {badge && <BadgeConsulta data={badge} onClose={() => setBadge(null)} />}
    </div>
  );
}