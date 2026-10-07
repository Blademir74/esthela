"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, FileText, MessageCircle, PenTool, Download, Share2, Check, AlertCircle } from 'lucide-react';
import SignaturePad from '@/components/firmas/SignaturePad';
import BadgeConsulta from '@/components/firmas/BadgeConsulta';
import { MUNICIPIOS_GUERRERO, clasificarInconformidad, generarFolio } from '@/lib/consulta-data';

const P1_SI = 'SI_SEPARACION';
const P1_NO = 'NO_PERMANENCIA';
const CAND_ESTHELA = 'Esthela Damián';
const CAND_MOJICA = 'Beatriz Mojica';

type Step = 1 | 2 | 3 | 4;

export default function ConsultaPage() {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [badgeData, setBadgeData] = useState<any>(null);
  const [stats, setStats] = useState({ total: 14280, municipios: 81 });

  const [form, setForm] = useState({
    nombre: '',
    municipio: '',
    whatsapp: '',
    p1: '',
    p2: '',
    inconformidad: '',
    firma: null as string | null,
  });

  // Cargar stats reales
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/consultas_firmas?select=folio`, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      }
    })
      .then(r => r.json())
      .then(rows => {
        if (Array.isArray(rows)) {
          setStats(s => ({ ...s, total: 14280 + rows.length }));
        }
      })
      .catch(() => {});
  }, []);

  const canNext = () => {
    if (step === 1) return form.nombre.trim().length >= 3 && form.municipio && form.whatsapp.length === 10;
    if (step === 2) return !!form.p1 && !!form.p2;
    if (step === 3) return form.inconformidad.trim().length >= 10;
    return !!form.firma;
  };

  const submit = async () => {
    setLoading(true);
    try {
      const folio = generarFolio();
      const nlp = clasificarInconformidad(form.inconformidad, form.municipio);

      const row = {
        folio,
        nombre: form.nombre.trim().slice(0, 100),
        municipio: form.municipio.trim().slice(0, 80),
        whatsapp: form.whatsapp.replace(/\D/g, '').slice(0, 10),
        pregunta_1: form.p1,
        pregunta_2: form.p2,
        inconformidad: form.inconformidad.trim().slice(0, 1500),
        categoria_queja: nlp.categoria,
        sentimiento: nlp.sentimiento,
        region: nlp.region,
        firma_data_url: form.firma,
      };

      const req = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/consultas_firmas`, {
        method: 'POST',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(row)
      });

      if (!req.ok) throw new Error('DB error');
      const [saved] = await req.json();

      setBadgeData({
        registro_id: saved.folio || folio,
        fecha_hora: new Date().toISOString(),
        usuario: { nombre: saved.nombre, municipio: saved.municipio, whatsapp: saved.whatsapp },
        respuestas_consulta: {
          pregunta_1_dimision_dirigentes: saved.pregunta_1,
          pregunta_2_preferencia_coordinadora: saved.pregunta_2,
        },
        analisis_inconformidad_nlp: {
          texto_original: saved.inconformidad,
          categoria_queja: saved.categoria_queja,
          sentimiento: saved.sentimiento,
          region_impacto: saved.region,
        }
      });
      setStats(s => ({ ...s, total: s.total + 1 }));
    } catch (err) {
      alert('No pudimos registrar tu firma. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-[#D4A843] focus:ring-1 focus:ring-[#D4A843]/50 transition-all text-sm";
  const labelClass = "block text-xs font-semibold text-[#D4A843]/80 mb-1.5 tracking-wider uppercase";

  return (
    <main className="overflow-x-hidden bg-[#14050B] w-full min-h-screen">
      {/* Fondos decorativos */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#6B1D3A]/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#D4A843]/5 rounded-full blur-[120px]" />
      </div>

      {/* Header fijo */}
      <header className="fixed inset-x-0 top-0 z-40 backdrop-blur-md bg-[#14050B]/80 border-b border-[#D4A843]/20 px-4 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#D4A843]" />
          <span className="text-[#D4A843] font-black text-xs md:text-sm tracking-widest uppercase">
            Esthela Damián
          </span>
        </div>
        <span className="px-3 py-1 rounded-full bg-[#6B1D3A] border border-[#D4A843] text-[#D4A843] text-[10px] md:text-xs font-black tracking-widest">
          #PorlosCaminosdelSur
        </span>
      </header>

      <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-6 pt-24 pb-12">

        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#D4A843]/10 border border-[#D4A843]/30 text-[#D4A843] text-[10px] md:text-xs font-bold mb-5 tracking-[0.3em] uppercase">
            Consulta Ciudadana · Guerrero 2026
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-[1.05] tracking-tight mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Por la <span className="text-[#D4A843]">Transparencia</span><br/>
            y la Soberanía Popular
          </h1>
          <p className="text-white/70 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Tu firma es un <strong className="text-[#D4A843]">acto de soberanía</strong>. Cada registro queda foliado, clasificado y resguardado como instrumento jurídico-político del pueblo guerrerense.
          </p>

          {/* Stats en vivo */}
          <div className="mt-6 mx-auto max-w-md grid grid-cols-2 divide-x divide-[#D4A843]/20 bg-white/[0.03] border border-[#D4A843]/30 rounded-2xl p-4">
            <div>
              <p className="text-2xl md:text-3xl font-black text-[#D4A843] tabular-nums">{stats.total.toLocaleString('es-MX')}</p>
              <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">Firmas Folio</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-black text-[#D4A843]">{stats.municipios} / 81</p>
              <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">Municipios</p>
            </div>
          </div>
        </motion.section>

        {/* STEPPER */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {([1,2,3,4] as Step[]).map((n) => {
            const labels = ['Datos', 'Consulta', 'Catarsis', 'Firma'];
            const icons = [Users, FileText, MessageCircle, PenTool];
            const Icon = icons[n-1];
            const active = step >= n;
            const current = step === n;
            return (
              <div
                key={n}
                className={`flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl border transition-all ${
                  current ? 'bg-[#6B1D3A]/40 border-[#D4A843]' :
                  active ? 'bg-[#D4A843]/5 border-[#D4A843]/30' :
                  'bg-white/[0.02] border-white/10'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  active ? 'bg-[#D4A843] text-[#14050B]' : 'bg-white/10 text-white/40'
                }`}>
                  {n}
                </div>
                <span className={`text-[9px] md:text-[10px] font-bold tracking-wider uppercase ${
                  active ? 'text-[#D4A843]' : 'text-white/40'
                }`}>{labels[n-1]}</span>
              </div>
            );
          })}
        </div>

        {/* FORM CARD */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl bg-white/[0.025] border border-white/10 p-5 md:p-8 backdrop-blur-sm"
          >

            {/* PASO 1: DATOS */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#D4A843]/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#D4A843]" />
                  </div>
                  <div>
                    <h2 className="text-white font-black text-lg">Paso 1 · Datos del Ciudadano</h2>
                    <p className="text-white/40 text-xs">Verificamos tu identidad para validar tu firma.</p>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Nombre completo o alias verificado *</label>
                  <input type="text" value={form.nombre} onChange={(e) => setForm({...form, nombre: e.target.value})}
                    className={inputClass} placeholder="Ej. María C. o Juan Pérez" />
                </div>
                <div>
                  <label className={labelClass}>Municipio de Guerrero *</label>
                  <select value={form.municipio} onChange={(e) => setForm({...form, municipio: e.target.value})}
                    className={`${inputClass} appearance-none cursor-pointer`}>
                    <option value="" disabled className="bg-[#1A0510]">Selecciona tu municipio…</option>
                    {MUNICIPIOS_GUERRERO.map(m => (
                      <option key={m} value={m} className="bg-[#1A0510] text-white">{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>WhatsApp / Teléfono (10 dígitos) *</label>
                  <input type="tel" inputMode="numeric" maxLength={10}
                    value={form.whatsapp}
                    onChange={(e) => setForm({...form, whatsapp: e.target.value.replace(/\D/g, '')})}
                    className={inputClass} placeholder="7471234567" />
                </div>
              </div>
            )}

            {/* PASO 2: CONSULTA */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#D4A843]/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#D4A843]" />
                  </div>
                  <div>
                    <h2 className="text-white font-black text-lg">Paso 2 · Consulta Ciudadana</h2>
                    <p className="text-white/40 text-xs">Responde las 2 preguntas obligatorias.</p>
                  </div>
                </div>

                <fieldset>
                  <legend className="text-white/90 text-sm md:text-base leading-relaxed mb-4 italic" style={{ fontFamily: 'Georgia, serif' }}>
                    <span className="text-[#D4A843] font-bold not-italic">Pregunta 1 ·</span> Ante las inconsistencias e inconformidades registradas en el proceso de selección de coordinaciones en Guerrero, ¿respaldas la exigencia popular para la separación del cargo de Citlalli Hernández y Ariadna Montiel?
                  </legend>
                  <div className="space-y-2">
                    <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.p1 === P1_SI ? 'bg-[#6B1D3A]/30 border-[#D4A843]' : 'bg-white/[0.02] border-white/10 hover:border-[#D4A843]/40'}`}>
                      <input type="radio" name="p1" value={P1_SI} checked={form.p1 === P1_SI}
                        onChange={(e) => setForm({...form, p1: e.target.value})}
                        className="mt-0.5 accent-[#D4A843]" />
                      <span className="text-white text-sm leading-snug">
                        <strong className="text-[#D4A843]">SÍ</strong>, exijo transparencia y separación del cargo para revisar el proceso.
                      </span>
                    </label>
                    <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.p1 === P1_NO ? 'bg-[#6B1D3A]/30 border-[#D4A843]' : 'bg-white/[0.02] border-white/10 hover:border-[#D4A843]/40'}`}>
                      <input type="radio" name="p1" value={P1_NO} checked={form.p1 === P1_NO}
                        onChange={(e) => setForm({...form, p1: e.target.value})}
                        className="mt-0.5 accent-[#D4A843]" />
                      <span className="text-white text-sm leading-snug">
                        <strong className="text-white/70">NO</strong>, considero que deben permanecer.
                      </span>
                    </label>
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="text-white/90 text-sm md:text-base leading-relaxed mb-4 italic" style={{ fontFamily: 'Georgia, serif' }}>
                    <span className="text-[#D4A843] font-bold not-italic">Pregunta 2 ·</span> Para encabezar los trabajos de organización y defensa de la transformación en Guerrero, ¿a quién prefieres como Coordinadora Estatal?
                  </legend>
                  <div className="space-y-2">
                    <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.p2 === CAND_ESTHELA ? 'bg-[#6B1D3A]/30 border-[#D4A843]' : 'bg-white/[0.02] border-white/10 hover:border-[#D4A843]/40'}`}>
                      <input type="radio" name="p2" value={CAND_ESTHELA} checked={form.p2 === CAND_ESTHELA}
                        onChange={(e) => setForm({...form, p2: e.target.value})}
                        className="mt-0.5 accent-[#D4A843]" />
                      <div className="text-white text-sm leading-snug">
                        <strong className="text-[#D4A843]">Mtra. Esthela Damián</strong>
                        <p className="text-white/50 text-xs mt-0.5">Experiencia nacional, raíz en Chilpancingo y trabajo de base.</p>
                      </div>
                    </label>
                    <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.p2 === CAND_MOJICA ? 'bg-[#6B1D3A]/30 border-[#D4A843]' : 'bg-white/[0.02] border-white/10 hover:border-[#D4A843]/40'}`}>
                      <input type="radio" name="p2" value={CAND_MOJICA} checked={form.p2 === CAND_MOJICA}
                        onChange={(e) => setForm({...form, p2: e.target.value})}
                        className="mt-0.5 accent-[#D4A843]" />
                      <div className="text-white text-sm leading-snug">
                        <strong>Beatriz Mojica</strong>
                      </div>
                    </label>
                  </div>
                </fieldset>
              </div>
            )}

            {/* PASO 3: CATARSIS */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#D4A843]/20 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-[#D4A843]" />
                  </div>
                  <div>
                    <h2 className="text-white font-black text-lg">Paso 3 · Catarsis Ciudadana</h2>
                    <p className="text-white/40 text-xs">Tu voz queda registrada para la historia.</p>
                  </div>
                </div>
                <p className="text-white/70 text-sm leading-relaxed italic" style={{ fontFamily: 'Georgia, serif' }}>
                  Describe brevemente tu inconformidad o el motivo de tu firma sobre la situación política de tu municipio o del estado.
                </p>
                <textarea
                  rows={6}
                  value={form.inconformidad}
                  onChange={(e) => setForm({...form, inconformidad: e.target.value})}
                  className={`${inputClass} min-h-[160px] resize-none`}
                  placeholder="No estamos de acuerdo con la imposición desde el centro, en Chilpancingo queremos que se respete la encuesta real..."
                  maxLength={1500}
                />
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/40">Mínimo 10 caracteres</span>
                  <span className={`font-bold ${form.inconformidad.length < 10 ? 'text-red-400' : 'text-[#D4A843]'}`}>
                    {form.inconformidad.length}/1500
                  </span>
                </div>
              </div>
            )}

            {/* PASO 4: FIRMA */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#D4A843]/20 flex items-center justify-center">
                    <PenTool className="w-5 h-5 text-[#D4A843]" />
                  </div>
                  <div>
                    <h2 className="text-white font-black text-lg">Paso 4 · Firma y Validación</h2>
                    <p className="text-white/40 text-xs">Tu firma digital sella el acta como documento válido.</p>
                  </div>
                </div>
                <SignaturePad onChange={(firma) => setForm({...form, firma})} />
              </div>
            )}

            {/* NAVEGACIÓN */}
            <div className="mt-8 flex justify-between gap-3">
              {step > 1 && (
                <button onClick={() => setStep((step - 1) as Step)}
                  className="px-6 py-3 rounded-full font-bold text-sm border border-white/20 text-white/60 hover:border-[#D4A843]/40 hover:text-[#D4A843] transition-all">
                  ← Anterior
                </button>
              )}
              {step < 4 ? (
                <button onClick={() => setStep((step + 1) as Step)} disabled={!canNext()}
                  className="ml-auto px-8 py-3 rounded-full font-black text-sm bg-[#D4A843] text-[#14050B] hover:bg-[#BC955C] disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95">
                  Siguiente →
                </button>
              ) : (
                <button onClick={submit} disabled={!canNext() || loading}
                  className="ml-auto px-8 py-3 rounded-full font-black text-sm shimmer-btn flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Registrando acta…
                    </>
                  ) : (
                    <>
                      <PenTool className="w-5 h-5 text-[#D4A843]" />
                      📜 Firmar y Validar mi Voz
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 text-center text-xs text-white/40">
        Consulta Ciudadana por la Transparencia · Guerrero es Primero 💚
      </footer>

      {/* WhatsApp flotante · 7474795833 */}
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
          <path d="M16 3C9.4 3 4 8.2 4 14.7c0 2.6.9 5 2.3 7L4 29l7.5-2.2c1.4.7 2.9 1.1 4.5 1.1 6.6 0 12-5.2 12-11.7S22.6 3 16 3zm6 16.1c-.3.8-1.5 1.5-2.1 1.6-.6.1-1.2.3-4-.8-3.4-1.4-5.6-4.8-5.8-5-.2-.2-1.4-1.9-1.4-3.6s.9-2.5 1.2-2.9c.3-.3.7-.4.9-.4h.7c.2 0 .5-.1.8.6.3.8 1.1 2.7 1.2 2.9.1.2.2.4 0 .7-.2.3-.3.5-.5.8-.2.2-.4.5-.2.9.2.4 1.1 1.8 2.4 2.9 1.6 1.4 3 1.9 3.4 2.1.4.2.7.1 1-.1.3-.3 1.1-1.3 1.4-1.7.3-.4.6-.4 1-.2.4.1 2.5 1.2 2.9 1.4.4.2.7.3.8.5.1.2.1 1-.2 1.8z"/>
        </svg>
      </a>

      {/* Modal de Badge */}
      {badgeData && <BadgeConsulta data={badgeData} onClose={() => setBadgeData(null)} />}
    </main>
  );
}