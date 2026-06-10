"use client";
import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, CheckCircle2, ChevronRight, Network,
  MessageCircle, Facebook, Heart, ThumbsUp, ThumbsDown,
  HelpCircle, Star, Trophy, Users, Zap
} from 'lucide-react';

// --- DATA ---
const MUNICIPIOS_GUERRERO = [
  "Acapulco de Juarez", "Acatepec", "Ahuacuotzingo", "Ajuchitlan del Progreso", "Alcozauca de Guerrero",
  "Alpoyeca", "Apaxtla", "Arcelia", "Atenango del Rio", "Atlamajalcingo del Monte",
  "Atlixtac", "Atoyac de Alvarez", "Ayutla de los Libres", "Azoyu", "Benito Juarez", "Buenavista de Cuellar",
  "Coahuayutla de Jose Maria Izazaga", "Cocula", "Copala", "Copalillo", "Copanatoyac",
  "Coyuca de Benitez", "Coyuca de Catalan", "Cuajinicuilapa", "Cualac", "Cuautepec",
  "Cuetzala del Progreso", "Cutzamala de Pinzon", "Chilapa de Alvarez", "Chilpancingo de los Bravo", "Eduardo Neri",
  "Florencio Villarreal", "General Canuto A. Neri", "General Heliodoro Castillo", "Huamuxtitlan",
  "Huitzuco de los Figueroa", "Iguala de la Independencia", "Igualapa",
  "Iliatenco", "Ixcateopan de Cuauhtemoc", "Jose Joaquin de Herrera", "Juan R. Escudero", "Juchitan",
  "La Union de Isidoro Montes de Oca", "Las Vigas", "Leonardo Bravo", "Malinaltepec",
  "Marquelia", "Martir de Cuilapan", "Metlatonoc", "Mochitlan", "Nuu Savi",
  "Olinala", "Ometepec", "Pedro Ascencio Alquisiras", "Petatlan", "Pilcaya",
  "Pungarabato", "Quechultenango", "San Luis Acatlan", "San Marcos",
  "San Miguel Totolapan", "San Nicolas", "Santa Cruz del Rincon", "Taxco de Alarcon",
  "Tecoanapa", "Tecpan de Galeana", "Teloloapan", "Tepecoacuilco de Trujano",
  "Tetipac", "Tixtla de Guerrero", "Tlacoachistlahuaca", "Tlacoapa", "Tlalchapa",
  "Tlalixtaquilla de Maldonado", "Tlapa de Comonfort", "Tlapehuala", "Xalpatlahuac", "Xochihuehuetlan",
  "Xochistlahuaca", "Zapotitlan Tablas", "Zirandaro", "Zitlala", "Zihuatanejo de Azueta"
].sort();

const DISTRITOS_GUERRERO = [
  "Distrito 01 - Acapulco Centro", "Distrito 02 - Acapulco Norte", "Distrito 03 - Acapulco Sur",
  "Distrito 04 - Chilpancingo", "Distrito 05 - Chilapa", "Distrito 06 - Iguala Norte",
  "Distrito 07 - Iguala Sur", "Distrito 08 - Taxco", "Distrito 09 - Teloloapan",
  "Distrito 10 - Tierra Caliente", "Distrito 11 - Huitzuco", "Distrito 12 - Atoyac",
  "Distrito 13 - Costa Chica Norte", "Distrito 14 - Costa Chica Sur", "Distrito 15 - Montaña Norte",
  "Distrito 16 - Montaña Sur", "Distrito 17 - Tlapa", "Distrito 18 - Zihuatanejo Norte",
  "Distrito 19 - Zihuatanejo Sur", "Distrito 20 - La Unión"
];

const ZONAS_ATENCION = [
  "Centro (Chilpancingo y alrededores)",
  "Costa Grande",
  "Costa Chica",
  "La Montaña",
  "Tierra Caliente",
  "Norte (Iguala, Taxco)",
  "Sierra",
  "Acapulco Metropolitano"
];

// --- TIPOS ---
interface FormData {
  nombres: string;
  apPaterno: string;
  apMaterno: string;
  correo: string;
  whatsapp: string;
  direccion: string;
  municipio: string;
  distrito: string;
  seccionElectoral: string;
  zona: string;
  redesFacebook: string;
  redesTiktok: string;
  redesInstagram: string;
}

// --- COMPONENTE PREVIEW CARD ---
function CardPreview({ nombres, apPaterno, municipio }: { nombres: string; apPaterno: string; municipio: string }) {
  const nombreDisplay = nombres ? `${nombres}` : 'Tu Nombre';
  const apellidoDisplay = apPaterno ? apPaterno.toUpperCase() : '';
  const municipioDisplay = municipio || 'Tu Municipio';
  const nombreCorto = nombres.split(' ')[0] || 'Titular';

  return (
    <div className="relative w-full max-w-[280px] mx-auto" style={{ aspectRatio: '3/4' }}>
      {/* Card base */}
      <div
        className="w-full h-full rounded-2xl flex flex-col overflow-hidden relative"
        style={{
          background: 'linear-gradient(145deg, #6B1D3A 0%, #3D0A1F 60%, #1A0510 100%)',
          border: '2px solid #D4A843',
          boxShadow: '0 0 40px rgba(212,168,67,0.25), inset 0 1px 0 rgba(212,168,67,0.3)'
        }}
      >
        {/* Holographic top stripe */}
        <div
          className="h-1.5 w-full"
          style={{ background: 'linear-gradient(90deg, #D4A843, #fff8e1, #D4A843, #BC955C, #D4A843)' }}
        />

        {/* Badge superior */}
        <div className="px-4 pt-3 pb-1 flex items-center justify-between">
          <span className="text-[9px] font-black tracking-widest text-[#D4A843] uppercase">
            Guerrero 2026
          </span>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} className="w-2 h-2 fill-[#D4A843] text-[#D4A843]" />
            ))}
          </div>
        </div>

        {/* Avatar placeholder */}
        <div className="flex-1 flex items-center justify-center px-6 py-2">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black"
            style={{
              background: 'rgba(212,168,67,0.15)',
              border: '2px solid rgba(212,168,67,0.5)',
              color: '#D4A843'
            }}
          >
            {nombreCorto[0]?.toUpperCase() || '?'}
          </div>
        </div>

        {/* Info zone */}
        <div
          className="px-4 py-3 text-center"
          style={{
            background: 'rgba(0,0,0,0.4)',
            borderTop: '1px solid rgba(212,168,67,0.3)'
          }}
        >
          <p className="text-[11px] tracking-widest text-[#D4A843]/70 uppercase mb-0.5">Capitán de la Esperanza</p>
          <p className="font-black text-white text-base leading-tight tracking-wide">
            {nombreDisplay}
          </p>
          {apellidoDisplay && (
            <p className="font-black text-[#D4A843] text-lg leading-tight tracking-widest">
              {apellidoDisplay}
            </p>
          )}
          <div
            className="mt-2 px-3 py-1 rounded-full inline-block"
            style={{ background: 'rgba(212,168,67,0.2)', border: '1px solid rgba(212,168,67,0.4)' }}
          >
            <p className="text-[10px] text-[#D4A843] font-semibold tracking-wider">{municipioDisplay}</p>
          </div>
        </div>

        {/* Bottom stripe */}
        <div
          className="h-1 w-full"
          style={{ background: 'linear-gradient(90deg, #D4A843, #BC955C, #D4A843)' }}
        />
      </div>

      {/* Filigrana de fondo */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #D4A843 0, #D4A843 1px, transparent 0, transparent 50%)',
          backgroundSize: '8px 8px'
        }}
      />
    </div>
  );
}

// --- COMPONENTE PRINCIPAL ---
export default function EsthelaPlatform() {
  const [formData, setFormData] = useState<FormData>({
    nombres: '', apPaterno: '', apMaterno: '', correo: '', whatsapp: '',
    direccion: '', municipio: '', distrito: '', seccionElectoral: '',
    zona: '', redesFacebook: '', redesTiktok: '', redesInstagram: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [voteStatus, setVoteStatus] = useState<'idle' | 'loading' | 'voted' | 'error'>('idle');
  const [selectedVote, setSelectedVote] = useState<'si' | 'dudo' | 'no' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [totalVotes, setTotalVotes] = useState({ si: 0, dudo: 0, no: 0 });
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [registeredData, setRegisteredData] = useState<{ nombre: string; municipio: string } | null>(null);

  // Countdown
  useEffect(() => {
    const targetDate = new Date('2026-06-22T00:00:00-06:00');
    const calculateTime = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      }
    };
    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Toasts aleatorios
  useEffect(() => {
    const showRandomToast = () => {
      const randomMunicipio = MUNICIPIOS_GUERRERO[Math.floor(Math.random() * MUNICIPIOS_GUERRERO.length)];
      const randomMinutes = Math.floor(Math.random() * 15) + 1;
      setToastMessage(`Un nuevo titular se fichó en ${randomMunicipio} hace ${randomMinutes} min.`);
      setTimeout(() => setToastMessage(null), 5000);
      const nextInterval = Math.floor(Math.random() * (15000 - 8000 + 1) + 8000);
      setTimeout(showRandomToast, nextInterval);
    };
    const initialTimer = setTimeout(showRandomToast, 5000);
    return () => clearTimeout(initialTimer);
  }, []);

  // Simular votos
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalVotes(prev => ({
        si: prev.si + Math.floor(Math.random() * 3),
        dudo: prev.dudo + Math.floor(Math.random() * 2),
        no: prev.no + Math.floor(Math.random() * 1)
      }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleVote = async (vote: 'si' | 'dudo' | 'no') => {
    setSelectedVote(vote);
    setVoteStatus('loading');
    try {
      const req = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/votes`, {
        method: 'POST',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ vote, fingerprint: crypto.randomUUID(), region: 'Guerrero', city: 'Guerrero' })
      });
      if (!req.ok) throw new Error('Error al votar');
      setVoteStatus('voted');
    } catch {
      setVoteStatus('error');
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const cleanWhatsapp = formData.whatsapp.replace(/\D/g, '');
    if (cleanWhatsapp.length !== 10) {
      alert('Ingresa un número de WhatsApp válido de 10 dígitos.');
      return;
    }
    if (!formData.municipio) {
      alert('Selecciona tu municipio.');
      return;
    }

    setFormStatus('loading');
    try {
      const req = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/titulares`, {
        method: 'POST',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          nombres: formData.nombres,
          ap_paterno: formData.apPaterno,
          ap_materno: formData.apMaterno,
          correo: formData.correo,
          whatsapp: cleanWhatsapp,
          direccion: formData.direccion,
          municipio: formData.municipio,
          distrito: formData.distrito,
          seccion_electoral: formData.seccionElectoral,
          zona: formData.zona,
          redes_facebook: formData.redesFacebook,
          redes_tiktok: formData.redesTiktok,
          redes_instagram: formData.redesInstagram,
          rol: 'titular'
        })
      });
      if (req.status !== 201) throw new Error('Error al registrar.');

      setRegisteredData({
        nombre: `${formData.nombres} ${formData.apPaterno}`.trim(),
        municipio: formData.municipio
      });
      setFormStatus('success');
      setShowModal(true);

      setTimeout(() => {
        window.location.assign('https://chat.whatsapp.com/HSUgjqCm69g8vKujvgkNFN');
      }, 2500);
    } catch {
      setFormStatus('error');
    }
  };

  const updateField = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const inputClass = "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-[#D4A843] focus:ring-1 focus:ring-[#D4A843]/50 transition-all text-sm";
  const labelClass = "block text-xs font-semibold text-[#D4A843]/80 mb-1.5 tracking-wider uppercase";

  return (
    <main className="overflow-x-hidden bg-[#14050B] w-full min-h-screen">

      {/* =========================================================
          HERO SECTION
      ========================================================= */}
      <section className="relative w-full h-[100svh] overflow-hidden flex flex-col">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '65% 20%' }}
          autoPlay loop muted playsInline
        >
          <source src="/assets/img/hero-video.mp4" type="video/mp4" />
          <img src="/assets/img/esthela.jpg" alt="Esthela Damián" className="w-full h-full object-cover" />
        </video>

        <div
          className="absolute inset-0 z-10"
          style={{ background: 'linear-gradient(180deg, rgba(20,5,11,0.2) 0%, rgba(20,5,11,0.5) 35%, rgba(20,5,11,0.95) 100%)' }}
        />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 pt-4 md:pt-6 flex justify-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs md:text-sm text-white/90">
            <span className="w-2 h-2 bg-[#D4A843] rounded-full animate-pulse" />
            Aspirante a la Coordinación de Guerrero · Morena
          </span>
        </motion.div>

        <div className="relative z-20 flex-1 flex flex-col justify-end px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-auto max-w-2xl"
          >
            <h1 className="hero-title font-bold leading-tight tracking-tight mb-4 text-white">
              Forjada desde joven <span className="text-[#D4A843]">en el trabajo comunitario</span>
            </h1>
            <h2 className="text-white/95 text-sm md:text-xl max-w-2xl mb-6 md:mb-8 leading-relaxed font-normal">
              Desde los 15 años, mi historia comenzó en Guerrero. Hoy, con 40 años de experiencia, quiero escribir la siguiente etapa contigo.
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a href="#pulso" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full font-bold transition-all hover:scale-105 active:scale-95 text-sm md:text-base shimmer-btn">
                Activar mi Pulso <Heart className="w-5 h-5 text-[#D4A843]" />
              </a>
              <a href="#red-titulares" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full font-bold transition-all hover:scale-105 active:scale-95 text-sm md:text-base shimmer-btn bg-[#6B1D3A]/60">
                Crear mi Red <Trophy className="w-5 h-5 text-[#D4A843]" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="relative z-20 pb-4 pt-6"
          >
            <p className="text-xs md:text-sm text-white/50 text-center tracking-widest uppercase">
              Chilpancingo · La Montaña · La Costa · Tierra Caliente · La Sierra · Un solo Guerrero
            </p>
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          COUNTDOWN
      ========================================================= */}
      <section className="relative -mt-10 z-30 px-6 md:px-10">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#6B1D3A]/95 to-[#802246]/95 backdrop-blur-md border border-[#D4A843]/40 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="text-center md:text-left">
              <h3 className="text-lg md:text-xl font-bold text-white mb-1">El Gran Registro se acerca</h3>
              <p className="text-white/70 text-xs md:text-sm font-medium">Definición interna Morena · 22 de junio</p>
            </div>
            <div className="flex gap-3 md:gap-4 justify-center">
              {[
                { label: 'Días', value: timeLeft.days },
                { label: 'Horas', value: timeLeft.hours },
                { label: 'Minutos', value: timeLeft.minutes },
                { label: 'Segundos', value: timeLeft.seconds }
              ].map((time, idx) => (
                <div key={idx} className="flex flex-col items-center min-w-[70px] md:min-w-[85px] bg-[#14050B]/60 border border-white/10 rounded-xl p-3 md:p-4">
                  <span className="text-2xl md:text-4xl font-extrabold text-[#D4A843] tabular-nums tracking-tight">
                    {String(time.value).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] md:text-xs text-white/50 uppercase tracking-widest mt-1 font-semibold">
                    {time.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          TRAYECTORIA — De Guerrero, con Guerrero
      ========================================================= */}
      <section className="py-20 md:py-28 px-6 md:px-10 bg-[#14050B] relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#6B1D3A]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#D4A843]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#6B1D3A]/30 border border-[#D4A843]/30 text-[#D4A843] text-xs md:text-sm font-semibold mb-4 tracking-wider uppercase">
              Nuestra Historia, Nuestro Futuro
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
              De Guerrero, con Guerrero
            </h2>
            <p className="text-white/80 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
              Mi trayectoria comenzó en las aulas y la lucha social de nuestro estado. La formación y el compromiso no se improvisan, se construyen con años de entrega y amor al pueblo guerrerense.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Orgullo UAGro",
                desc: "Formada en las aulas de la Universidad Autónoma de Guerrero, donde consolidé mis convicciones de justicia social, defendiendo siempre la educación pública y los derechos de las comunidades."
              },
              {
                step: "02",
                title: "Territorio y Cercanía",
                desc: "Recorriendo los municipios, de la Costa Grande a la Costa Chica, de la Montaña a la Tierra Caliente, escuchando y construyendo soluciones junto a la gente trabajadora de nuestro estado."
              },
              {
                step: "03",
                title: "Puente Probado",
                desc: "Con 40 años de resultados comprobables, soy el puente directo para canalizar el bienestar del proyecto nacional hacia cada rincón de Guerrero."
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#D4A843]/30 hover:bg-white/[0.04] transition-all group"
              >
                <span className="text-4xl font-extrabold text-[#D4A843]/20 group-hover:text-[#D4A843]/40 transition-colors block mb-4">
                  {item.step}
                </span>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/75 text-sm md:text-base leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-16 text-center p-8 rounded-2xl bg-gradient-to-r from-[#6B1D3A]/30 to-[#802246]/30 border border-[#D4A843]/30 max-w-3xl mx-auto"
          >
            <p className="text-white text-lg md:text-xl font-medium leading-relaxed">
              "Es momento de unidad y esperanza. Juntos haremos que{' '}
              <span className="font-extrabold text-[#D4A843] tracking-wide inline-block drop-shadow-[0_2px_5px_rgba(212,168,67,0.4)]">
                Guerrero Brilla
              </span>{' '}
              con fuerza propia sobre Acapulco y cada municipio de nuestra tierra."
            </p>
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          FACTOR SHEINBAUM
      ========================================================= */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-[#14050B]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#D4A843]/10 border border-[#D4A843]/30 text-[#D4A843] text-xs md:text-sm font-semibold mb-4">
              Experiencia Probada
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
              Con la Dra. Claudia Sheinbaum
            </h2>
            <p className="text-white/60 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
              Esthela Damián no es una promesa, es una realidad. Quien ayudó a construir el Segundo Piso desde el Ejecutivo Federal ahora lleva esa experiencia a Guerrero.
            </p>
          </motion.div>

          <div className="grid gap-4 md:gap-6 md:grid-cols-3">
            {[
              { icon: Shield, title: "Construcción Federal", desc: "Parte del equipo que ejecutó obras transformadoras en la CDMX bajo la coordinación de la Dra. Sheinbaum." },
              { icon: Network, title: "Puente Estratégico", desc: "La conexión directa entre las políticas de la Cuarta Transformación y las necesidades reales de Guerrero." },
              { icon: CheckCircle2, title: "Resultados Tangibles", desc: "40 años de trabajo comprobable: no promesas, hechos que transforman comunidades." }
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group p-6 md:p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#D4A843]/40 hover:bg-white/[0.05] transition-all"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#D4A843]/10 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-[#D4A843]/20 transition-colors">
                  <item.icon className="w-6 h-6 md:w-7 md:h-7 text-[#D4A843]" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">{item.title}</h3>
                <p className="text-white/50 text-sm md:text-base leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          PULSO DIGITAL
      ========================================================= */}
      <section id="pulso" className="py-16 md:py-24 px-6 md:px-10 bg-[#14050B]">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 md:mb-12"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#D4A843]/10 border border-[#D4A843]/30 text-[#D4A843] text-xs md:text-sm font-semibold mb-4">
              Pulso Digital 22 de Junio
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
              Activar mi Pulso
            </h2>
            <p className="text-white/60 text-sm md:text-lg max-w-xl mx-auto leading-relaxed">
              Tu opinión cuenta. Vota de forma anónima y sé parte del movimiento por la Coordinación de Guerrero.
            </p>
          </motion.div>

          {voteStatus === 'voted' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center p-8 md:p-12 rounded-2xl bg-[#D4A843]/10 border border-[#D4A843]/30"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#D4A843]/20 flex items-center justify-center mx-auto mb-4 md:mb-6">
                <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-[#D4A843]" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3">¡Gracias por tu Pulso!</h3>
              <p className="text-white/60 text-sm md:text-base">Tu voto ha sido registrado. Ahora únete a la estructura digital para el 22 de junio.</p>
              <a href="#red-titulares" className="inline-block mt-6 px-8 py-3 bg-[#D4A843] hover:bg-[#BC955C] text-[#14050B] rounded-full font-bold transition-all hover:scale-105 text-sm md:text-base">
                Crear mi Red de Titulares
              </a>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4 md:space-y-6"
            >
              <div className="grid gap-3 md:gap-4">
                {[
                  { value: 'si', label: 'Sí, apoyo a Esthela', icon: ThumbsUp, color: 'bg-green-500/20 border-green-500/40 hover:bg-green-500/30 text-green-400' },
                  { value: 'dudo', label: 'Dudo, necesito más información', icon: HelpCircle, color: 'bg-yellow-500/20 border-yellow-500/40 hover:bg-yellow-500/30 text-yellow-400' },
                  { value: 'no', label: 'No por ahora', icon: ThumbsDown, color: 'bg-red-500/20 border-red-500/40 hover:bg-red-500/30 text-red-400' }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleVote(opt.value as 'si' | 'dudo' | 'no')}
                    disabled={voteStatus === 'loading'}
                    className={`w-full p-4 md:p-6 rounded-xl border-2 transition-all flex items-center justify-between group ${voteStatus === 'loading' && selectedVote === opt.value ? opt.color : 'bg-white/[0.03] border-white/10 hover:border-[#D4A843]/40 hover:bg-white/[0.05] text-white'}`}
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${voteStatus === 'loading' && selectedVote === opt.value ? 'bg-white/20' : 'bg-white/5 group-hover:bg-[#D4A843]/20'} transition-colors`}>
                        <opt.icon className={`w-5 h-5 md:w-6 md:h-6 ${voteStatus === 'loading' && selectedVote === opt.value ? 'text-white' : 'text-white/60 group-hover:text-[#D4A843]'} transition-colors`} />
                      </div>
                      <span className="font-semibold text-sm md:text-base">{opt.label}</span>
                    </div>
                    <ChevronRight className={`w-5 h-5 md:w-6 md:h-6 ${voteStatus === 'loading' && selectedVote === opt.value ? 'text-white' : 'text-white/30 group-hover:text-[#D4A843]'} transition-colors`} />
                  </button>
                ))}
              </div>

              {voteStatus === 'loading' && (
                <div className="flex items-center justify-center gap-3 py-4 text-white/50 text-sm">
                  <div className="w-5 h-5 border-2 border-[#D4A843] border-t-transparent rounded-full animate-spin" />
                  Registrando tu Pulso...
                </div>
              )}
              {voteStatus === 'error' && (
                <p className="text-center text-red-400 text-sm">Hubo un error. Inténtalo de nuevo.</p>
              )}

              <div className="pt-6 md:pt-8 border-t border-white/10">
                <p className="text-center text-white/40 text-xs md:text-sm mb-3">Pulso en tiempo real</p>
                <div className="flex justify-center gap-6 md:gap-10">
                  <div className="text-center">
                    <p className="text-xl md:text-2xl font-bold text-green-400">{totalVotes.si}</p>
                    <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-wider">Sí</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl md:text-2xl font-bold text-yellow-400">{totalVotes.dudo}</p>
                    <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-wider">Dudo</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl md:text-2xl font-bold text-red-400">{totalVotes.no}</p>
                    <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-wider">No</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* =========================================================
          RED DE TITULARES — Sección de Alto Impacto (NUEVA)
      ========================================================= */}
      <section id="red-titulares" className="py-16 md:py-24 px-4 md:px-10 bg-[#14050B] relative overflow-hidden">

        {/* Fondo de textura decorativa */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #D4A843 0, #D4A843 1px, transparent 0, transparent 60px), repeating-linear-gradient(90deg, #D4A843 0, #D4A843 1px, transparent 0, transparent 60px)',
          }}
        />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-[#6B1D3A]/15 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#D4A843]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">

          {/* Encabezado de sección */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4A843]/10 border border-[#D4A843]/30 text-[#D4A843] text-xs md:text-sm font-semibold mb-5 tracking-wider uppercase">
              <Trophy className="w-3.5 h-3.5" />
              Fichaje Oficial · 22 de Junio
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
              Crea tu Red con <span className="text-[#D4A843]">Esthela</span>
            </h2>
            <p className="text-white/65 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
              Toma tu lugar en la formación oficial. Registra tus datos y coordina la victoria en tu territorio. Cada titular suma.
            </p>
          </motion.div>

          {/* Estadísticas de la formación */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12 md:mb-16"
          >
            {[
              { icon: Users, label: 'Titulares activos', value: '4,200+' },
              { icon: Trophy, label: 'Municipios cubiertos', value: '72' },
              { icon: Zap, label: 'Días para el registro', value: String(timeLeft.days) }
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/[0.04] border border-white/10">
                <stat.icon className="w-5 h-5 text-[#D4A843]" />
                <div>
                  <p className="text-xl font-black text-[#D4A843] leading-none">{stat.value}</p>
                  <p className="text-[11px] text-white/40 uppercase tracking-wider mt-0.5">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {formStatus === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto text-center p-10 rounded-2xl bg-[#D4A843]/10 border border-[#D4A843]/30"
            >
              <div className="w-20 h-20 rounded-full bg-[#D4A843]/20 flex items-center justify-center mx-auto mb-6 border border-[#D4A843]/40">
                <Trophy className="w-10 h-10 text-[#D4A843]" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-[#D4A843] mb-3">¡Ya eres Titular!</h3>
              <p className="text-white/75 text-base leading-relaxed mb-8">
                {registeredData?.nombre && <span className="font-bold text-white">{registeredData.nombre}</span>}, tu fichaje en la Red de Guerrero está confirmado.{' '}
                {registeredData?.municipio && <span>Representas a <span className="font-bold text-[#D4A843]">{registeredData.municipio}</span>.</span>}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/Tarjetas"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold text-[#14050B] bg-[#D4A843] hover:bg-[#BC955C] transition-all hover:scale-105 text-sm"
                >
                  <Star className="w-4 h-4" />
                  Crear mi Tarjeta de Titular
                </a>
                <a
                  href="https://chat.whatsapp.com/HSUgjqCm69g8vKujvgkNFN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold text-white shimmer-btn text-sm"
                >
                  <MessageCircle className="w-4 h-4 text-[#D4A843]" />
                  Unirme al Vestidor
                </a>
              </div>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">

              {/* COLUMNA IZQUIERDA: Formulario */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="rounded-3xl bg-white/[0.025] border border-white/10 p-6 md:p-8 backdrop-blur-sm">

                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-10 h-10 rounded-xl bg-[#D4A843]/20 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-[#D4A843]" />
                    </div>
                    <div>
                      <h3 className="text-white font-black text-lg">Ficha de Registro</h3>
                      <p className="text-white/40 text-xs">Todos los campos marcados con * son requeridos</p>
                    </div>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-5">

                    {/* IDENTIDAD */}
                    <div>
                      <p className="text-[#D4A843] text-xs font-black tracking-widest uppercase mb-3 flex items-center gap-2">
                        <span className="w-4 h-px bg-[#D4A843]/40" />
                        Identidad
                        <span className="flex-1 h-px bg-[#D4A843]/10" />
                      </p>
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label className={labelClass}>Nombre(s) *</label>
                          <input type="text" required value={formData.nombres} onChange={updateField('nombres')} className={inputClass} placeholder="Ej. María Elena" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={labelClass}>Apellido Paterno *</label>
                            <input type="text" required value={formData.apPaterno} onChange={updateField('apPaterno')} className={inputClass} placeholder="Rodríguez" />
                          </div>
                          <div>
                            <label className={labelClass}>Apellido Materno</label>
                            <input type="text" value={formData.apMaterno} onChange={updateField('apMaterno')} className={inputClass} placeholder="González" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CONTACTO */}
                    <div>
                      <p className="text-[#D4A843] text-xs font-black tracking-widest uppercase mb-3 flex items-center gap-2">
                        <span className="w-4 h-px bg-[#D4A843]/40" />
                        Contacto
                        <span className="flex-1 h-px bg-[#D4A843]/10" />
                      </p>
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label className={labelClass}>Correo Electrónico</label>
                          <input type="email" value={formData.correo} onChange={updateField('correo')} className={inputClass} placeholder="maria@ejemplo.com" />
                        </div>
                        <div>
                          <label className={labelClass}>WhatsApp * (10 dígitos)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">+52</span>
                            <input
                              type="tel" required pattern="[0-9]{10}" maxLength={10}
                              value={formData.whatsapp}
                              onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value.replace(/\D/g, '') }))}
                              className={`${inputClass} pl-12`}
                              placeholder="747 000 0000"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* TERRITORIO */}
                    <div>
                      <p className="text-[#D4A843] text-xs font-black tracking-widest uppercase mb-3 flex items-center gap-2">
                        <span className="w-4 h-px bg-[#D4A843]/40" />
                        Territorio
                        <span className="flex-1 h-px bg-[#D4A843]/10" />
                      </p>
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label className={labelClass}>Municipio *</label>
                          <select required value={formData.municipio} onChange={updateField('municipio')} className={`${inputClass} appearance-none cursor-pointer`}>
                            <option value="" disabled className="bg-[#1A0510]">Selecciona tu municipio...</option>
                            {MUNICIPIOS_GUERRERO.map(m => (
                              <option key={m} value={m} className="bg-[#1A0510] text-white">{m}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>Dirección Completa</label>
                          <input type="text" value={formData.direccion} onChange={updateField('direccion')} className={inputClass} placeholder="Calle, número y colonia" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={labelClass}>Distrito Local</label>
                            <select value={formData.distrito} onChange={updateField('distrito')} className={`${inputClass} appearance-none cursor-pointer`}>
                              <option value="" className="bg-[#1A0510]">Selecciona...</option>
                              {DISTRITOS_GUERRERO.map(d => (
                                <option key={d} value={d} className="bg-[#1A0510] text-white">{d}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className={labelClass}>Sección Electoral *</label>
                            <input type="text" required value={formData.seccionElectoral} onChange={updateField('seccionElectoral')} className={inputClass} placeholder="Ej. 0123" maxLength={4} />
                          </div>
                        </div>
                        <div>
                          <label className={labelClass}>Zona de Atención</label>
                          <select value={formData.zona} onChange={updateField('zona')} className={`${inputClass} appearance-none cursor-pointer`}>
                            <option value="" className="bg-[#1A0510]">Selecciona tu región...</option>
                            {ZONAS_ATENCION.map(z => (
                              <option key={z} value={z} className="bg-[#1A0510] text-white">{z}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* REDES SOCIALES */}
                    <div>
                      <p className="text-[#D4A843] text-xs font-black tracking-widest uppercase mb-3 flex items-center gap-2">
                        <span className="w-4 h-px bg-[#D4A843]/40" />
                        Redes Sociales
                        <span className="flex-1 h-px bg-[#D4A843]/10" />
                      </p>
                      <div className="grid grid-cols-1 gap-3">
                        {[
                          { key: 'redesFacebook', label: 'Facebook', placeholder: '@tu.perfil.fb' },
                          { key: 'redesTiktok', label: 'TikTok', placeholder: '@tu_usuario_tiktok' },
                          { key: 'redesInstagram', label: 'Instagram', placeholder: '@tu_perfil_ig' },
                        ].map(red => (
                          <div key={red.key}>
                            <label className={labelClass}>{red.label}</label>
                            <input
                              type="text"
                              value={formData[red.key as keyof FormData]}
                              onChange={updateField(red.key as keyof FormData)}
                              className={inputClass}
                              placeholder={red.placeholder}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* BOTÓN DE ACCIÓN */}
                    {formStatus === 'loading' ? (
                      <button type="button" disabled className="w-full py-4 bg-[#D4A843]/40 text-white rounded-full font-bold flex items-center justify-center gap-2 cursor-not-allowed text-sm">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Procesando tu fichaje...
                      </button>
                    ) : formStatus === 'error' ? (
                      <button type="submit" className="w-full py-4 bg-red-500/20 border border-red-500/40 text-red-400 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-red-500/30 transition-colors text-sm">
                        Hubo un error. Intentar de nuevo
                      </button>
                    ) : (
                      <button type="submit" className="w-full py-4 rounded-full font-black text-base transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shimmer-btn">
                        <Trophy className="w-5 h-5 text-[#D4A843]" />
                        ¡CREAR MI RED Y ACTIVAR MI CAMBIO!
                      </button>
                    )}

                    <p className="text-[11px] text-white/30 text-center pt-1">
                      Tus datos están protegidos. Se usan exclusivamente para organización ciudadana.
                    </p>
                  </form>
                </div>

                {/* Platica con Esthela */}
                {(formData.nombres || formData.municipio) && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-5 rounded-2xl bg-[#6B1D3A]/20 border border-[#D4A843]/20"
                  >
                    <div className="flex items-start gap-3">
                      <MessageCircle className="w-5 h-5 text-[#D4A843] mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-white/80 text-sm mb-2 font-medium">¿Tienes una jugada maestra para Guerrero?</p>
                        <p className="text-white/50 text-xs mb-3">Al terminar tu registro, puedes enviarle un mensaje directo a la Mtra. Esthela.</p>
                        <a
                          href={`https://wa.me/52?text=Hola+Mtra.+Esthela%2C+soy+${encodeURIComponent(formData.nombres || 'un ciudadano')}+de+${encodeURIComponent(formData.municipio || 'Guerrero')}%2C+ya+tengo+mi+Red+lista+y+quiero+proponerte...`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[#D4A843] text-xs font-semibold hover:text-white transition-colors"
                        >
                          Enviar propuesta directa <ChevronRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* COLUMNA DERECHA: Preview de tarjeta + CTA Tarjetas */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="flex flex-col items-center gap-6 lg:sticky lg:top-8"
              >
                {/* Badge "Vista previa" */}
                <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-widest">
                  <span className="w-8 h-px bg-white/20" />
                  Vista previa en tiempo real
                  <span className="w-8 h-px bg-white/20" />
                </div>

                {/* Card preview animada */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-full"
                >
                  <CardPreview
                    nombres={formData.nombres}
                    apPaterno={formData.apPaterno}
                    municipio={formData.municipio}
                  />
                </motion.div>

                {/* Label dinámico */}
                <div className="text-center">
                  {formData.nombres ? (
                    <p className="text-[#D4A843] font-bold text-lg">
                      {formData.nombres.split(' ')[0]} — Capitán de la Esperanza
                    </p>
                  ) : (
                    <p className="text-white/40 text-sm">Ingresa tus datos y ve tu tarjeta tomar forma</p>
                  )}
                  {formData.municipio && (
                    <p className="text-white/60 text-sm mt-1">Selección de {formData.municipio}</p>
                  )}
                </div>

                {/* CTA generador de tarjetas */}
                <div className="w-full p-6 rounded-2xl bg-gradient-to-br from-[#6B1D3A]/40 to-[#3D0A1F]/60 border border-[#D4A843]/25">
                  <h4 className="text-white font-black text-center mb-2 text-base">Después de registrarte</h4>
                  <p className="text-white/50 text-xs text-center mb-5 leading-relaxed">
                    Genera tu cromo digital oficial en tres modelos distintos y compártelo con tu red.
                  </p>
                  <div className="flex flex-col gap-2.5">
                    {[
                      { emoji: '🏆', title: 'Estampa Mundialista', desc: 'Estilo holográfico institucional' },
                      { emoji: '⚡', title: 'Yo estoy de Esthelado', desc: 'Diseño viral para redes' },
                      { emoji: '🌿', title: 'Yo Camino con Esthela', desc: 'Estilo acuarela territorial' },
                    ].map((modelo, idx) => (
                      <a
                        key={idx}
                        href="/Tarjetas"
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#D4A843]/30 hover:bg-white/[0.08] transition-all group"
                      >
                        <span className="text-xl">{modelo.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-sm truncate">{modelo.title}</p>
                          <p className="text-white/40 text-[11px]">{modelo.desc}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#D4A843] transition-colors flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                  <a
                    href="/Tarjetas"
                    className="mt-4 w-full py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 bg-[#D4A843] hover:bg-[#BC955C] text-[#14050B] transition-all hover:scale-105"
                  >
                    <Star className="w-4 h-4" />
                    Ir al generador de tarjetas
                  </a>
                </div>
              </motion.div>

            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          COMPARTE
      ========================================================= */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-[#14050B]">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#D4A843]/10 border border-[#D4A843]/30 text-[#D4A843] text-xs md:text-sm font-semibold mb-4">
              Comparte el Movimiento
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
              El futuro de Guerrero está en nuestras manos
            </h2>
            <p className="text-white/60 text-sm md:text-lg mb-8 leading-relaxed">
              Ya activé mi pulso. Súmate aquí para que el 22 de junio sea nuestro.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a
                href="https://chat.whatsapp.com/HSUgjqCm69g8vKujvgkNFN"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold transition-all hover:scale-105 active:scale-95 text-sm md:text-base shimmer-btn"
              >
                <MessageCircle className="w-5 h-5 text-[#D4A843]" />
                Unirme al Grupo de WhatsApp
              </a>
              <a
                href="https://www.facebook.com/sharer/sharer.php?u=https://guerreroescone.vercel.app"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-full font-bold transition-all hover:scale-105 active:scale-95 text-sm md:text-base"
              >
                <Facebook className="w-5 h-5" />
                Compartir en Facebook
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="py-8 md:py-12 px-6 md:px-10 bg-[#14050B] border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-white/80 font-bold text-sm md:text-base mb-2">
            &copy; {new Date().getFullYear()} Esthela Damián | Aspirante a la Coordinación
          </p>
          <p className="text-white/40 text-xs md:text-sm">
            Coordinación Territorial · Plataforma de organización ciudadana
          </p>
        </div>
      </footer>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 md:px-6 py-3 md:py-4 bg-[#D4A843]/90 backdrop-blur-sm text-[#14050B] rounded-full font-semibold text-xs md:text-sm shadow-lg shadow-black/30 max-w-[90vw] text-center"
          >
            {toastMessage}
            <p className="text-[9px] md:text-[10px] text-[#14050B]/60 mt-1">Red de Titulares · En vivo</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp */}
      <a
        href="https://chat.whatsapp.com/HSUgjqCm69g8vKujvgkNFN"
        target="_blank" rel="noopener noreferrer"
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shimmer-btn"
        style={{ boxShadow: '0 0 15px rgba(212, 168, 67, 0.3)' }}
      >
        <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-white" />
      </a>

      {/* Modal de confirmación */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-md w-full p-8 rounded-2xl bg-[#6B1D3A] border-2 border-[#D4A843]/50 shadow-2xl text-center flex flex-col items-center overflow-hidden"
              style={{ boxShadow: '0 0 30px rgba(212, 168, 67, 0.3)' }}
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />
              <div className="w-20 h-20 rounded-full bg-[#D4A843]/20 flex items-center justify-center mb-6 border border-[#D4A843]/40 animate-pulse">
                <Trophy className="w-10 h-10 text-[#D4A843]" />
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-[#D4A843] mb-3">¡Ya eres Titular!</h3>
              <p className="text-white text-base md:text-lg leading-relaxed font-medium mb-2">
                Guerrero brilla con tu compromiso.
              </p>
              {registeredData && (
                <p className="text-white/70 text-sm mb-6">
                  <span className="font-bold text-white">{registeredData.nombre}</span> — Capitán de la Esperanza en{' '}
                  <span className="text-[#D4A843] font-bold">{registeredData.municipio}</span>
                </p>
              )}
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.5, ease: 'linear' }}
                  className="bg-[#D4A843] h-full"
                />
              </div>
              <p className="text-white/40 text-xs mt-4">Uniéndote al vestidor oficial...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}