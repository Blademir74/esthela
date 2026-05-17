"use client";
import React, { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Activity, CheckCircle2, ChevronRight, Users, Network, Send, MapPin, MessageCircle, Facebook, MessageSquare, Share2, Heart, ThumbsUp, ThumbsDown, HelpCircle } from 'lucide-react';

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

export default function EsthelaPlatform() {
  const [formData, setFormData] = useState({ nombre: '', whatsapp: '', municipio: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [voteStatus, setVoteStatus] = useState<'idle' | 'loading' | 'voted' | 'error'>('idle');
  const [selectedVote, setSelectedVote] = useState<'si' | 'dudo' | 'no' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [totalVotes, setTotalVotes] = useState({ si: 0, dudo: 0, no: 0 });
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Countdown timer logic
  useEffect(() => {
    const targetDate = new Date('2026-06-22T00:00:00-06:00'); // Central Mexico Time (CST/CDT)
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

  // Toast notifications aleatorias
  useEffect(() => {
    const showRandomToast = () => {
      const randomMunicipio = MUNICIPIOS_GUERRERO[Math.floor(Math.random() * MUNICIPIOS_GUERRERO.length)];
      const randomMinutes = Math.floor(Math.random() * 15) + 1;
      setToastMessage(`Un nuevo lider se sumo en ${randomMunicipio} hace ${randomMinutes} min.`);
      setTimeout(() => setToastMessage(null), 5000);
      const nextInterval = Math.floor(Math.random() * (15000 - 8000 + 1) + 8000);
      setTimeout(showRandomToast, nextInterval);
    };
    const initialTimer = setTimeout(showRandomToast, 5000);
    return () => clearTimeout(initialTimer);
  }, []);

  // Simular votos en tiempo real
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

  // Manejar voto del Pulso Digital
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
        body: JSON.stringify({ vote: vote, fingerprint: crypto.randomUUID(), region: 'Guerrero', city: 'Guerrero' })
      });
      if (!req.ok) throw new Error('Error al votar');
      setVoteStatus('voted');
    } catch (error) {
      console.error(error);
      setVoteStatus('error');
    }
  };

  // Manejar registro (Unirme al Movimiento)
  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    try {
      const req = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/movilizadores`, {
        method: 'POST',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          whatsapp: formData.whatsapp,
          municipio: formData.municipio,
          rol: 'promotor'
        })
      });
      if (!req.ok) throw new Error('Error al registrar');
      setFormStatus('success');
      setShowModal(true);
      setTimeout(() => {
        window.location.href = "https://chat.whatsapp.com/HSUgjqCm69g8vKujvgkNFN";
      }, 2000);
    } catch (error) {
      console.error(error);
      setFormStatus('error');
    }
  };

  return (
    <main className="overflow-x-hidden bg-[#14050B] w-full min-h-screen">

      {/* =========================================================
          HERO SECTION — Centro de Mando Digital
      ========================================================= */}
      <section className="relative w-full h-[100svh] overflow-hidden flex flex-col">

        {/* Video Background */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '65% 20%' }}
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/assets/img/hero-video.mp4" type="video/mp4" />
          <img src="/assets/img/esthela.jpg" alt="Esthela Damian" className="w-full h-full object-cover" />
        </video>

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(180deg, rgba(20,5,11,0.2) 0%, rgba(20,5,11,0.5) 35%, rgba(20,5,11,0.95) 100%)'
          }}
        />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 pt-4 md:pt-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs md:text-sm text-white/90">
            <span className="w-2 h-2 bg-[#D4A843] rounded-full animate-pulse" />
            Aspirante a la Coordinación de Guerrero &middot; Morena
          </span>
        </motion.div>

        {/* Hero Content - Positioned at bottom to avoid covering face */}
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
              Desde los 15 años, mi historia comenzó en Guerrero. Hoy, con 40 años de experiencia, quiero escribir la siguiente etapa contigo
            </h2>

            {/* CTA Buttons - Column on mobile */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="#pulso"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full font-bold transition-all hover:scale-105 active:scale-95 text-sm md:text-base shimmer-btn"
              >
                Activar mi Pulso <Heart className="w-5 h-5 text-[#D4A843]" />
              </a>
              <a
                href="#registro"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full font-bold transition-all hover:scale-105 active:scale-95 text-sm md:text-base shimmer-btn bg-[#6B1D3A]/60"
              >
                Unirme al Movimiento <ChevronRight className="w-5 h-5 text-[#D4A843]" />
              </a>
            </div>
          </motion.div>

          {/* Leyenda Territorial */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="relative z-20 pb-4 pt-6"
          >
            <p className="text-xs md:text-sm text-white/50 text-center tracking-widest uppercase">
              Chilpancingo &middot; La Montana &middot; La Costa &middot; Tierra Caliente &middot; La Sierra &middot; Un solo Guerrero
            </p>
          </motion.div>
        </div>

      </section>

      {/* =========================================================
          COUNTDOWN — Reloj Dinámico
      ========================================================= */}
      <section className="relative -mt-10 z-30 px-6 md:px-10">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#6B1D3A]/95 to-[#802246]/95 backdrop-blur-md border border-[#D4A843]/40 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          {/* Shimmer effect */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="text-center md:text-left">
              <h3 className="text-lg md:text-xl font-bold text-white mb-1">El momento de la verdad se acerca</h3>
              <p className="text-white/70 text-xs md:text-sm font-medium">Para la definición interna de Morena &middot; 22 de junio</p>
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
          NUEVA SECCIÓN: De Guerrero, con Guerrero — Trayectoria y Unidad
      ========================================================= */}
      <section className="py-20 md:py-28 px-6 md:px-10 bg-[#14050B] relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#6B1D3A]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#D4A843]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
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
                desc: "Formada en las aulas de la Universidad Autónoma de Guerrero (UAGro), donde consolidé mis convicciones de justicia social, defendiendo siempre la educación pública y los derechos de las comunidades."
              },
              {
                step: "02",
                title: "Territorio y Cercanía",
                desc: "Recorriendo los municipios, de la Costa Grande a la Costa Chica, de la Montaña a la Tierra Caliente, escuchando y construyendo soluciones junto a la gente trabajadora de nuestro estado."
              },
              {
                step: "03",
                title: "Puente Probado",
                desc: "Con una sólida trayectoria de 40 años de resultados comprobables, actúo como el 'Puente Probado' para canalizar el bienestar del proyecto nacional directamente a Guerrero."
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#D4A843]/30 hover:bg-white/[0.04] transition-all group flex flex-col justify-between"
              >
                <div>
                  <span className="text-4xl font-extrabold text-[#D4A843]/20 group-hover:text-[#D4A843]/40 transition-colors block mb-4">
                    {item.step}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-white/75 text-sm md:text-base leading-relaxed">{item.desc}</p>
                </div>
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
              "Es momento de unidad y esperanza. Juntos haremos que{" "}
              <span className="font-extrabold text-[#D4A843] tracking-wide inline-block shadow-[#D4A843]/10 drop-shadow-[0_2px_5px_rgba(212,168,67,0.4)]">
                Guerrero Brilla
              </span>{" "}
              con fuerza propia sobre Acapulco y cada municipio de nuestra tierra."
            </p>
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          FACTOR SHEINBAUM — Experiencia Probada
      ========================================================= */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-[#14050B]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
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
              Esthela Damian no es una promesa, es una realidad. Quien ayudo a construir el Segundo Piso desde el Ejecutivo Federal ahora lleva esa experiencia a Guerrero.
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
                viewport={{ once: true, margin: "-100px" }}
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
          PULSO DIGITAL — Votacion Anonima
      ========================================================= */}
      <section id="pulso" className="py-16 md:py-24 px-6 md:px-10 bg-[#14050B]">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
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
              <p className="text-white/60 text-sm md:text-base">
                Tu voto ha sido registrado. Ahora unete a la estructura digital para el 22 de junio.
              </p>
              <a
                href="#registro"
                className="inline-block mt-6 px-8 py-3 bg-[#D4A843] hover:bg-[#BC955C] text-[#14050B] rounded-full font-bold transition-all hover:scale-105 text-sm md:text-base"
              >
                Unirme a la Estructura Digital
              </a>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4 md:space-y-6"
            >
              {/* Opciones de voto */}
              <div className="grid gap-3 md:gap-4">
                {[
                  { value: 'si', label: 'SI, apoyo a Esthela', icon: ThumbsUp, color: 'bg-green-500/20 border-green-500/40 hover:bg-green-500/30 text-green-400' },
                  { value: 'dudo', label: 'DUDO, necesito mas informacion', icon: HelpCircle, color: 'bg-yellow-500/20 border-yellow-500/40 hover:bg-yellow-500/30 text-yellow-400' },
                  { value: 'no', label: 'NO por ahora', icon: ThumbsDown, color: 'bg-red-500/20 border-red-500/40 hover:bg-red-500/30 text-red-400' }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleVote(opt.value as 'si' | 'dudo' | 'no')}
                    disabled={voteStatus === 'loading'}
                    className={`w-full p-4 md:p-6 rounded-xl border-2 transition-all flex items-center justify-between group
                      ${voteStatus === 'loading' && selectedVote === opt.value ? opt.color : 'bg-white/[0.03] border-white/10 hover:border-[#D4A843]/40 hover:bg-white/[0.05] text-white'}`}
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
                <p className="text-center text-red-400 text-sm">Hubo un error. Intenta de nuevo.</p>
              )}

              {/* Contador de votos */}
              <div className="pt-6 md:pt-8 border-t border-white/10">
                <p className="text-center text-white/40 text-xs md:text-sm mb-3">Pulso en tiempo real</p>
                <div className="flex justify-center gap-6 md:gap-10">
                  <div className="text-center">
                    <p className="text-xl md:text-2xl font-bold text-green-400">{totalVotes.si}</p>
                    <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-wider">Si</p>
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
          REGISTRO — Unirme al Movimiento
      ========================================================= */}
      <section id="registro" className="py-16 md:py-24 px-6 md:px-10 bg-[#14050B]">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 md:mb-12"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#D4A843]/10 border border-[#D4A843]/30 text-[#D4A843] text-xs md:text-sm font-semibold mb-4">
              Unete al Movimiento
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
              Unirme al Movimiento
            </h2>
            <p className="text-white/60 text-sm md:text-lg max-w-xl mx-auto leading-relaxed">
              Quieres acompanar este camino? Dejanos tu contacto y forma parte del cambio real en Guerrero.
            </p>
          </motion.div>

          {formStatus === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center p-8 md:p-12 rounded-2xl bg-[#D4A843]/10 border border-[#D4A843]/30"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#D4A843]/20 flex items-center justify-center mx-auto mb-4 md:mb-6">
                <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-[#D4A843]" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3">¡Bienvenida al Movimiento!</h3>
              <p className="text-white/60 text-sm md:text-base">
                Tu contacto ha sido registrado. Pronto recibiras un mensaje para definir tu nivel de participacion en la estructura de Guerrero.
              </p>
              <a
                href="#pulso"
                className="inline-block mt-6 px-8 py-3 bg-[#D4A843] hover:bg-[#BC955C] text-[#14050B] rounded-full font-bold transition-all hover:scale-105 text-sm md:text-base"
              >
                Activar mi Pulso
              </a>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleFormSubmit}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4 md:space-y-5"
            >
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-[#D4A843] mb-2">Tu nombre o apodo</label>
                <input
                  type="text"
                  id="nombre"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4A843] focus:ring-1 focus:ring-[#D4A843] transition-colors text-sm md:text-base"
                  placeholder="Ej. Maria, La Jefa, Juanito..."
                />
              </div>

              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-[#D4A843] mb-2">WhatsApp</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm md:text-base">+52</span>
                  <input
                    type="tel"
                    id="whatsapp"
                    required
                    pattern="[0-9]{10}"
                    maxLength={10}
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value.replace(/\D/g, '') })}
                    className="w-full bg-white/5 border border-white/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4A843] focus:ring-1 focus:ring-[#D4A843] transition-colors text-sm md:text-base"
                    placeholder="747 000 0000"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="municipio" className="block text-sm font-medium text-[#D4A843] mb-2">Municipio de Guerrero</label>
                <select
                  id="municipio"
                  required
                  value={formData.municipio}
                  onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4A843] focus:ring-1 focus:ring-[#D4A843] transition-colors appearance-none cursor-pointer text-sm md:text-base"
                >
                  <option value="" disabled className="bg-[#14050B]">Selecciona tu municipio...</option>
                  {MUNICIPIOS_GUERRERO.map((mun) => (
                    <option key={mun} value={mun} className="bg-[#14050B] text-white">{mun}</option>
                  ))}
                </select>
              </div>

              {formStatus === 'loading' ? (
                <button
                  type="button"
                  disabled
                  className="w-full py-4 bg-[#D4A843]/50 text-white rounded-full font-bold flex items-center justify-center gap-2 cursor-not-allowed text-sm md:text-base"
                >
                  <div className="w-5 h-5 border-2 border-[#14050B] border-t-transparent rounded-full animate-spin" />
                  Registrando...
                </button>
              ) : formStatus === 'error' ? (
                <button
                  type="submit"
                  className="w-full py-4 bg-red-500/20 border border-red-500/40 text-red-400 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-red-500/30 transition-colors text-sm md:text-base"
                >
                  Hubo un error. Intentar de nuevo
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full py-4 rounded-full font-bold transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm md:text-base shimmer-btn"
                >
                  Unete a la estructura digital del 22 de junio <Heart className="w-5 h-5 text-[#D4A843]" />
                </button>
              )}

              <p className="text-xs text-white/40 text-center pt-2">Tus datos estan protegidos. Nos comprometemos a usarlos solo para fines de organizacion ciudadana.</p>
            </motion.form>
          )}
        </div>
      </section>

      {/* =========================================================
          COMPARTE — Viraliza el Movimiento
      ========================================================= */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-[#14050B]">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#D4A843]/10 border border-[#D4A843]/30 text-[#D4A843] text-xs md:text-sm font-semibold mb-4">
              Comparte el Movimiento
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
              Unete a la estructura digital del 22 de junio
            </h2>
            <p className="text-white/60 text-sm md:text-lg mb-8 leading-relaxed">
              Yo ya active mi pulso. Sumate aqui para que el futuro de Guerrero este en nuestras manos.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a
                href="https://chat.whatsapp.com/HSUgjqCm69g8vKujvgkNFN"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold transition-all hover:scale-105 active:scale-95 text-sm md:text-base shimmer-btn"
              >
                <MessageCircle className="w-5 h-5 text-[#D4A843]" />
                Unirme al Grupo de WhatsApp
              </a>
              <a
                href="https://www.facebook.com/sharer/sharer.php?u=https://guerreroescone.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
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
            Coordinación Territorial &middot; Plataforma de organización ciudadana
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
            <p className="text-[9px] md:text-[10px] text-[#14050B]/60 mt-1">Estructura Digital &middot; Real-time</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp */}
      <a
        href="https://chat.whatsapp.com/HSUgjqCm69g8vKujvgkNFN"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shimmer-btn"
        style={{
          boxShadow: '0 0 15px rgba(212, 168, 67, 0.3)'
        }}
      >
        <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-white" />
      </a>

      {/* Confirmation Success Modal overlay */}
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
              style={{
                boxShadow: '0 0 30px rgba(212, 168, 67, 0.3)'
              }}
            >
              {/* Shimmer reflection effect */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />

              {/* Glowing icon */}
              <div className="w-20 h-20 rounded-full bg-[#D4A843]/20 flex items-center justify-center mb-6 border border-[#D4A843]/40 animate-pulse">
                <CheckCircle2 className="w-10 h-10 text-[#D4A843]" />
              </div>

              <h3 className="text-2xl md:text-3xl font-extrabold text-[#D4A843] mb-4">
                ¡Registro exitoso!
              </h3>
              
              <p className="text-white text-base md:text-lg leading-relaxed font-medium mb-6">
                Te estamos uniendo al único camino para que Guerrero avance...
              </p>

              {/* Loading progress bar */}
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, ease: "linear" }}
                  className="bg-[#D4A843] h-full"
                />
              </div>
              
              <p className="text-white/40 text-xs mt-4">
                Redirigiendo a WhatsApp en segundos...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
