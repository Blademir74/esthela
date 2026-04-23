"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Activity, 
  CheckCircle2, 
  ChevronRight, 
  Users, 
  Network,
  Send,
  MapPin,
  MessageCircle,
  Facebook,
  MessageSquare
} from 'lucide-react';

// --- DATA ---
const MUNICIPIOS_GUERRERO = [
  "Acapulco de Juárez", "Acatepec", "Ahuacuotzingo", "Ajuchitlán del Progreso", "Alcozauca de Guerrero", 
  "Alpoyeca", "Apaxtla", "Arcelia", "Atenango del Río", "Atlamajalcingo del Monte", "Atlixtac", 
  "Atoyac de Álvarez", "Ayutla de los Libres", "Azoyú", "Benito Juárez", "Buenavista de Cuéllar", 
  "Coahuayutla de José María Izazaga", "Cocula", "Copala", "Copalillo", "Copanatoyac", "Coyuca de Benítez", 
  "Coyuca de Catalán", "Cuajinicuilapa", "Cualác", "Cuautepec", "Cuetzala del Progreso", "Cutzamala de Pinzón", 
  "Chilapa de Álvarez", "Chilpancingo de los Bravo", "Eduardo Neri", "Florencio Villarreal", "General Canuto A. Neri", 
  "General Heliodoro Castillo", "Huamuxtitlán", "Huitzuco de los Figueroa", "Iguala de la Independencia", "Igualapa", 
  "Iliatenco", "Ixcateopan de Cuauhtémoc", "José Joaquín de Herrera", "Juan R. Escudero", "Juchitán", 
  "La Unión de Isidoro Montes de Oca", "Las Vigas", "Leonardo Bravo", "Malinaltepec", "Marquelia", "Mártir de Cuilapan", 
  "Metlatónoc", "Mochitlán", "Ñuu Savi", "Olinalá", "Ometepec", "Pedro Ascencio Alquisiras", "Petatlán", "Pilcaya", 
  "Pungarabato", "Quechultenango", "San Luis Acatlán", "San Marcos", "San Miguel Totolapan", "San Nicolás", 
  "Santa Cruz del Rincón", "Taxco de Alarcón", "Tecoanapa", "Técpan de Galeana", "Teloloapan", "Tepecoacuilco de Trujano", 
  "Tetipac", "Tixtla de Guerrero", "Tlacoachistlahuaca", "Tlacoapa", "Tlalchapa", "Tlalixtaquilla de Maldonado", 
  "Tlapa de Comonfort", "Tlapehuala", "Xalpatláhuac", "Xochihuehuetlán", "Xochistlahuaca", "Zapotitlán Tablas", 
  "Zirándaro", "Zitlala", "Zihuatanejo de Azueta"
].sort();

// --- MAIN COMPONENT ---

export default function EsthelaPlatform() {
  const [hasVoted, setHasVoted] = useState(false);
  const [voteStats, setVoteStats] = useState({ total: 0, structure: 0 });
  const [formData, setFormData] = useState({ nombre: '', whatsapp: '', municipio: '', privacidad: false });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Bandwagon Effect: Toast Notifications
  useEffect(() => {
    const showRandomToast = () => {
      const randomMunicipio = MUNICIPIOS_GUERRERO[Math.floor(Math.random() * MUNICIPIOS_GUERRERO.length)];
      const randomMinutes = Math.floor(Math.random() * 15) + 1;
      setToastMessage(`Un nuevo líder se sumó en ${randomMunicipio} hace ${randomMinutes} min.`);
      
      setTimeout(() => setToastMessage(null), 5000);
      
      const nextInterval = Math.floor(Math.random() * (15000 - 8000 + 1) + 8000);
      setTimeout(showRandomToast, nextInterval);
    };

    const initialTimer = setTimeout(showRandomToast, 5000);
    return () => clearTimeout(initialTimer);
  }, []);

  // Handlers
  const handleVote = async (type: string) => {
    setHasVoted(true);
    setVoteStats({
      total: type === 'si' ? 84 : 80,
      structure: type === 'si' ? 88 : 85
    });

    try {
      await fetch('https://iwqvrnnejiwadfxssumj.supabase.co/rest/v1/votes_pulso', {
        method: 'POST',
        headers: {
          'apikey': 'sb_publishable_qFPSGf9-iITKuAX_rWVh2w_PtEHjCZx',
          'Authorization': 'Bearer sb_publishable_qFPSGf9-iITKuAX_rWVh2w_PtEHjCZx',
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          tipo_apoyo: type,
          fecha: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Error al registrar voto:', error);
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');

    try {
      // 1. Inserción Nativa en Supabase vía REST API
      const req = await fetch('https://iwqvrnnejiwadfxssumj.supabase.co/rest/v1/movilizadores', {
        method: 'POST',
        headers: {
          'apikey': 'sb_publishable_qFPSGf9-iITKuAX_rWVh2w_PtEHjCZx',
          'Authorization': 'Bearer sb_publishable_qFPSGf9-iITKuAX_rWVh2w_PtEHjCZx',
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

      if (!req.ok) {
        const errData = await req.text();
        throw new Error('Supabase rechazo el registro: ' + errData);
      }

      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'CompleteRegistration');
      }
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'generate_lead', {
          currency: 'MXN',
          value: 1
        });
      }

      setFormStatus('success');
    } catch (error) {
      console.error(error);
      setFormStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white font-sans selection:bg-[#621132] selection:text-[#D4A843]">

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION — Premium Mobile-First
          Diseño split: Imagen arriba (55vh) + Texto abajo en móvil
          Desktop: Imagen fullbleed con texto superpuesto
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col bg-[#0B0F19] overflow-hidden">

        {/* ── BLOQUE DE IMAGEN (parte superior en móvil, fullbleed en desktop) ── */}
        <div className="relative w-full h-[45vh] md:absolute md:inset-0 md:h-full flex-shrink-0">

          {/* Imagen principal — Esthela y Claudia Sheinbaum opt for mobile */}
          <img 
            src="/assets/img/esthela.jpg" 
            alt="Esthela Damián y Claudia Sheinbaum, unidas por Guerrero" 
            className="w-full h-full object-cover object-[70%_25%] md:object-[50%_25%]"
            loading="eager"
            fetchPriority="high"
          />

          {/* Overlay gradiente — móvil: fuerte abajo para fundir con el texto */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19]/30 via-transparent to-[#0B0F19] md:bg-gradient-to-r md:from-[#0B0F19]/90 md:via-[#0B0F19]/50 md:to-transparent" />
          
          {/* Borde dorado sutil inferior (solo móvil) */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4A843]/40 to-transparent md:hidden" />

          {/* Línea dorada decorativa lateral (solo desktop) */}
          <div className="hidden md:block absolute top-[15%] bottom-[15%] left-[42%] w-[1px] bg-gradient-to-b from-transparent via-[#D4A843]/20 to-transparent" />
        </div>

        {/* ── BLOQUE DE TEXTO (parte inferior en móvil, superpuesto izquierda en desktop) ── */}
        <div className="relative z-10 flex-1 flex items-start md:items-center w-full md:absolute md:inset-0">
          <div className="w-full max-w-6xl mx-auto px-6 pt-6 pb-4 md:py-24">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-xl space-y-5 md:space-y-6"
            >
              {/* Badge — Estatus legal claro */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="inline-flex items-center space-x-2 bg-[#0B0F19]/80 md:bg-black/50 border border-[#D4A843]/30 backdrop-blur-md px-4 py-2 rounded-full text-xs md:text-sm font-medium tracking-wide"
              >
                <span className="w-2 h-2 rounded-full bg-[#D4A843] animate-pulse"></span>
                <span className="text-gray-200">Aspirante a la Coordinación de Guerrero · Morena</span>
              </motion.div>
              
              {/* H1 — Narrativa humanizada */}
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.15]" style={{ textTransform: 'none' }}>
                Forjada desde joven<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4A843] to-[#E8C869]">en el trabajo comunitario</span>
              </h1>
              
              {/* Subtítulo de identidad */}
              <p className="text-base md:text-xl text-gray-300 font-light max-w-lg leading-relaxed">
                Mi historia comenzó en Guerrero cuando tenía 15 años. Hoy, con 25 años de resultados, quiero escribir la siguiente etapa contigo.
              </p>

              {/* Indicador social — miles de guerrerenses */}
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-[#621132] border-2 border-[#0B0F19] flex items-center justify-center text-[10px] font-bold">E</div>
                  <div className="w-7 h-7 rounded-full bg-[#D4A843] border-2 border-[#0B0F19] flex items-center justify-center text-[10px] font-bold text-[#0B0F19]">C</div>
                  <div className="w-7 h-7 rounded-full bg-[#B38E5D]/40 border-2 border-[#0B0F19] flex items-center justify-center text-[10px]">+</div>
                </div>
                <span>Miles de guerrerenses ya se sumaron</span>
              </div>

              {/* CTAs — Apilados en móvil, horizontales en desktop */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <motion.a 
                  href="#formulario"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="cta-pulse inline-flex items-center justify-center space-x-3 bg-[#621132] hover:bg-[#7a153e] text-white px-7 py-3.5 md:px-8 md:py-4 rounded-xl font-bold text-base md:text-lg shadow-[0_0_25px_rgba(98,17,50,0.5)] transition-all relative overflow-hidden group"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  <span>Únete a la estructura digital</span>
                  <ChevronRight className="w-5 h-5" />
                </motion.a>
                <motion.a 
                  href="#pulso"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/15 backdrop-blur-sm text-white px-7 py-3.5 md:px-8 md:py-4 rounded-xl font-semibold text-base md:text-lg border border-white/15 hover:border-[#D4A843]/40 transition-all"
                >
                  <span>Sumar mi apoyo</span>
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── FOOTER TERRITORIAL — Factor de Poder ── */}
        <div className="relative z-10 w-full border-t border-white/10 bg-[#0B0F19]/90 md:bg-black/40 backdrop-blur-sm mt-auto">
          <div className="max-w-6xl mx-auto px-6 py-3">
            <div className="flex items-center justify-center space-x-2">
              <MapPin className="w-3 h-3 text-[#D4A843] flex-shrink-0 hidden sm:block" />
              <p className="text-[10px] md:text-sm text-gray-400 font-mono tracking-wider text-center">
                Chilpancingo · La Montaña · La Costa · Acapulco · Tierra Caliente · La Sierra · <span className="text-[#D4A843] font-semibold">Un solo Guerrero</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECCIÓN DE AUTORIDAD — Currículum de Poder
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-[#0F1423] relative border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">La Elegida para el Esfuerzo en Guerrero</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">La mujer de confianza en el proyecto de Nación. Quien ayudó a construir el Segundo Piso desde el Ejecutivo Federal ahora coordina los esfuerzos en su tierra.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Activity, title: "25 Años de Lealtad", desc: "Trayectoria impecable al servicio de las causas justas, demostrando congruencia y resultados sin titubeos." },
              { icon: Network, title: "Conexión Directa", desc: "El puente natural y estratégico entre las políticas del Gobierno Federal y las verdaderas necesidades de Guerrero." },
              { icon: Users, title: "Liderazgo de Tierra", desc: "Forjada en las bases, conoce cada región del estado y tiene la capacidad probada para organizar el triunfo." }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-[#141B2D] p-8 rounded-2xl border border-white/5 hover:border-[#B38E5D]/30 transition-colors"
              >
                <div className="w-14 h-14 bg-[#621132]/20 rounded-xl flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-[#B38E5D]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CUARTO DE GUERRA — Data en Tiempo Real
      ═══════════════════════════════════════════════════════════ */}
      <section id="pulso" className="py-24 bg-[#0B0F19] relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-[#B38E5D]/30 to-transparent" />
        
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 flex items-center">
                <span className="w-3 h-3 rounded-full bg-red-500 mr-4 animate-pulse" />
                Cuarto de Guerra Digital
              </h2>
              <p className="text-gray-400 text-lg">Monitoreo en tiempo real de la consolidación territorial en los 85 municipios.</p>
            </div>
            <div className="tabular-nums text-[#B38E5D] font-mono text-xl mt-6 md:mt-0 bg-[#B38E5D]/10 px-4 py-2 rounded-lg border border-[#B38E5D]/20">
              ACTIVIDAD DEL DÍA: AUMENTO DEL 24%
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Termómetro del Pueblo 2.0 */}
            <div className="bg-[#141B2D] rounded-2xl p-8 border border-white/5 flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-8">Termómetro de Organización</h3>
              
              {!hasVoted ? (
                <div className="space-y-4">
                  <button 
                    onClick={() => handleVote('si')}
                    className="w-full flex items-center justify-between p-5 rounded-xl bg-green-500/10 hover:bg-green-500/20 transition-colors border border-transparent hover:border-green-500 group"
                  >
                    <span className="text-lg font-medium text-green-400">Sí, estoy con la Aspirante</span>
                    <ChevronRight className="text-green-500/50 group-hover:text-green-400 transition-colors" />
                  </button>
                  <button 
                    onClick={() => handleVote('dudo')}
                    className="w-full flex items-center justify-between p-5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-[#D4A843] group"
                  >
                    <span className="text-lg font-medium text-[#D4A843]">Aún tengo dudas</span>
                    <ChevronRight className="text-gray-500 group-hover:text-[#D4A843] transition-colors" />
                  </button>
                  <button 
                    onClick={() => handleVote('no')}
                    className="w-full flex items-center justify-between p-5 rounded-xl bg-white/5 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500 group"
                  >
                    <span className="text-lg font-medium text-gray-400">No por ahora</span>
                    <ChevronRight className="text-gray-500 group-hover:text-red-500 transition-colors" />
                  </button>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8"
                >
                  <div>
                    <div className="flex justify-between text-sm mb-2 font-mono">
                      <span className="text-gray-300">Apoyo total para Guerrero</span>
                      <span className="text-green-400">{voteStats.total}%</span>
                    </div>
                    <div className="w-full bg-black/50 rounded-full h-3 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${voteStats.total}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="bg-gradient-to-r from-[#621132] to-red-500 h-full rounded-full"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2 font-mono">
                      <span className="text-gray-300">Quiero sumarme a la estructura</span>
                      <span className="text-[#B38E5D]">{voteStats.structure}%</span>
                    </div>
                    <div className="w-full bg-black/50 rounded-full h-3 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${voteStats.structure}%` }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                        className="bg-gradient-to-r from-[#B38E5D] to-yellow-600 h-full rounded-full"
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start space-x-3 mt-6">
                    <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-green-500 font-medium">¡Misión Cumplida!</p>
                      <p className="text-sm text-gray-400 mt-1">Tu postura enciende el mapa territorial. Ayuda a que el pulso no se detenga.</p>
                      
                      <div className="mt-4 flex flex-col space-y-2">
                        <a 
                          href="https://wa.me/?text=¡Yo ya activé mi pulso por Esthela! Es de Guerrero y tiene la experiencia. Súmate aquí: https://guerreroescone.vercel.app" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white text-sm font-bold py-3 pr-4 pl-3 rounded-lg w-full transition-colors"
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span>Compartir este Pulso en WhatsApp</span>
                        </a>
                        <a 
                          href="https://www.facebook.com/sharer/sharer.php?u=https://guerreroescone.vercel.app" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center space-x-2 bg-[#1877F2] hover:bg-[#0c59ba] text-white text-sm font-bold py-3 pr-4 pl-3 rounded-lg w-full transition-colors"
                        >
                          <Facebook className="w-5 h-5" />
                          <span>Misión Promotor Facebook</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Mapa de Inevitabilidad */}
            <div className="bg-[#141B2D] rounded-2xl p-8 border border-white/5 relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(98,17,50,0.1)_0%,transparent_70%)]" />
              
              <div className="relative z-10 w-full mb-6">
                <h3 className="text-xl font-bold flex items-center justify-between">
                  Mapa de Inevitabilidad
                  <span className="text-xs font-mono bg-green-500/20 text-green-400 px-2 py-1 rounded">EN LÍNEA</span>
                </h3>
              </div>
              
              <div className="grid grid-cols-6 gap-2 w-full relative z-10">
                {Array.from({ length: 36 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      opacity: [0.2, Math.random() > 0.7 ? 1 : 0.4, 0.2],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className={`aspect-square rounded-sm border md:rounded-md ${
                      Math.random() > 0.8 
                        ? 'bg-[#621132] border-[#621132]' 
                        : Math.random() > 0.9 
                          ? 'bg-[#B38E5D] border-[#B38E5D]' 
                          : 'bg-white/5 border-white/10'
                    }`}
                  />
                ))}
              </div>
              
              <p className="text-xs text-gray-500 font-mono mt-6 text-center w-full relative z-10">
                CÉLULAS ACTIVAS EN LAS 8 REGIONES
              </p>
            </div>
            
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          IDENTIDAD TERRITORIAL (Regiones)
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-[#0B0F19] relative border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[#D4A843] mb-2 font-mono">ESTRUCTURA Y MENSAJE</h2>
            <p className="text-gray-400 text-lg">Vocación regional para construir un estado fuerte.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 border border-white/10 rounded-xl bg-white/5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50 group-hover:bg-blue-400 transition-colors" />
              <h4 className="text-lg font-bold text-white mb-2">Acapulco y Costa</h4>
              <p className="text-gray-400 text-sm">El proyecto está enfocado en la resiliencia y la inyección federal para la reconstrucción total de nuestros puertos históricos.</p>
            </div>
            <div className="p-6 border border-white/10 rounded-xl bg-white/5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#621132]/50 group-hover:bg-[#621132] transition-colors" />
              <h4 className="text-lg font-bold text-white mb-2">Montaña y Sierra</h4>
              <p className="text-gray-400 text-sm">Forjada desde joven en el trabajo comunitario puro y fiel a sus raíces en la UAGro; nunca olvida de dónde viene.</p>
            </div>
            <div className="p-6 border border-white/10 rounded-xl bg-white/5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#D4A843]/50 group-hover:bg-[#D4A843] transition-colors" />
              <h4 className="text-lg font-bold text-white mb-2">Tierra Caliente</h4>
              <p className="text-gray-400 text-sm">Desarrollo productivo con paz y justicia, garantizado gracias a la colaboración absoluta con la Federación.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FORMULARIO ESTRATÉGICO DE CAPTACIÓN
      ═══════════════════════════════════════════════════════════ */}
      <section id="formulario" className="py-24 bg-[#0F1423] relative">
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          
          <div className="bg-[#141B2D] rounded-3xl p-8 md:p-12 border border-[#B38E5D]/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ingresa al Círculo de Decisión</h2>
              <p className="text-gray-400">Regístrate para recibir línea directa y organizar tu municipio.</p>
            </div>

            {formStatus === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 flex flex-col items-center"
              >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">¡Comando Registrado!</h3>
                <p className="text-gray-300 max-w-md mx-auto">
                  En breve recibirás un mensaje de WhatsApp automatizado para asignar tu nivel de participación en la estructura local de tu municipio.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-300 mb-2">Nombre Completo</label>
                  <input 
                    type="text" 
                    id="nombre"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="w-full bg-black/30 border-b-2 border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#B38E5D] transition-colors rounded-t-md"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>

                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-300 mb-2">WhatsApp (10 dígitos)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500">+52</span>
                    <input 
                      type="tel" 
                      id="whatsapp"
                      required
                      pattern="[0-9]{10}"
                      maxLength={10}
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({...formData, whatsapp: e.target.value.replace(/\D/g, '')})}
                      className="w-full bg-black/30 border-b-2 border-white/10 pl-14 pr-4 py-3 text-white focus:outline-none focus:border-[#B38E5D] transition-colors rounded-t-md"
                      placeholder="747 000 0000"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="municipio" className="block text-sm font-medium text-gray-300 mb-2">Municipio de Residencia</label>
                  <select 
                    id="municipio"
                    required
                    value={formData.municipio}
                    onChange={(e) => setFormData({...formData, municipio: e.target.value})}
                    className="w-full bg-black/30 border-b-2 border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#B38E5D] transition-colors rounded-t-md appearance-none"
                  >
                    <option value="" disabled className="text-gray-500">Selecciona uno de los 85 municipios...</option>
                    {MUNICIPIOS_GUERRERO.map((mun) => (
                      <option key={mun} value={mun} className="bg-[#141B2D]">{mun}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-start mt-6">
                  <div className="flex items-center h-5">
                    <input 
                      id="privacidad" 
                      type="checkbox" 
                      required
                      checked={formData.privacidad}
                      onChange={(e) => setFormData({...formData, privacidad: e.target.checked})}
                      className="w-4 h-4 bg-black/50 border-gray-600 rounded focus:ring-[#B38E5D] focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0F1423] accent-[#B38E5D]"
                    />
                  </div>
                  <label htmlFor="privacidad" className="ml-3 text-xs text-gray-400">
                    Acepto el aviso de privacidad y el tratamiento de mis datos personales de acuerdo con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares. <a href="#" className="text-[#B38E5D] hover:underline">Ver Aviso</a>.
                  </label>
                </div>

                <button 
                  type="submit"
                  disabled={formStatus === 'loading'}
                  className="w-full bg-[#621132] hover:bg-[#7a153e] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg mt-8 transition-colors flex items-center justify-center space-x-2"
                >
                  {formStatus === 'loading' ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Integrarme al Proyecto 2027</span>
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════ */}
      <footer className="border-t border-white/5 bg-[#0B0F19] py-12 text-center text-gray-500 text-sm">
        <div className="max-w-6xl mx-auto px-6">
          <p>© {new Date().getFullYear()} Coordinación Territorial | Guerrero.</p>
          <p className="mt-2 text-xs">Este sitio es una plataforma digital de organización ciudadana. Sistema en cumplimiento con normativas vigentes.</p>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════════
          TOAST NOTIFICATIONS — Bandwagon Effect
      ═══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-6 z-50 bg-[#141B2D]/95 backdrop-blur-md border border-[#B38E5D]/30 shadow-2xl p-4 rounded-xl flex items-start space-x-3 max-w-sm"
          >
            <div className="bg-[#B38E5D]/20 p-2 rounded-full shrink-0">
              <Shield className="w-5 h-5 text-[#B38E5D]" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">{toastMessage}</p>
              <p className="text-xs text-gray-400 mt-1">Estructura Digital • Real-time</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING WHATSAPP CTA */}
      <a
        href="https://wa.me/5217474795833?text=Hola, quiero unirme a la estructura de la Aspirante para Guerrero"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] transition-transform hover:scale-110 flex items-center justify-center animate-bounce duration-1000"
      >
        <MessageCircle className="w-8 h-8" />
      </a>
      
      {/* Keyframes globales */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes ctaPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(98,17,50,0.4); }
          50% { box-shadow: 0 0 35px rgba(98,17,50,0.7), 0 0 50px rgba(98,17,50,0.2); }
        }
        .cta-pulse {
          animation: ctaPulse 2.5s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}
