"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Activity, CheckCircle2, ChevronRight, Users, Network, Send, MapPin, MessageCircle, Facebook, MessageSquare } from 'lucide-react';

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
  "Metlatónoc", "Mochitlán", "Ñuu Savi", "Olinalá", "Ometepec", "Pedro Ascencio Alquisiras",
  "Petatlán", "Pilcaya", "Pungarabato", "Quechultenango", "San Luis Acatlán", "San Marcos", "San Miguel Totolapan", "San Nicolás",
  "Santa Cruz del Rincón", "Taxco de Alarcón", "Tecoanapa", "Técpan de Galeana", "Teloloapan", "Tepecoacuilco de Trujano",
  "Tetipac", "Tixtla de Guerrero", "Tlacoachistlahuaca", "Tlacoapa", "Tlalchapa", "Tlalixtaquilla de Maldonado",
  "Tlapa de Comonfort", "Tlapehuala", "Xalpatláhuac", "Xochihuehuetlán", "Xochistlahuaca", "Zapotitlán Tablas",
  "Zirándaro", "Zitlala", "Zihuatanejo de Azueta"
].sort();

export default function EsthelaPlatform() {
  const [hasVoted, setHasVoted] = useState(false);
  const [voteStats, setVoteStats] = useState({ total: 0, structure: 0 });
  const [formData, setFormData] = useState({ nombre: '', whatsapp: '', municipio: '', privacidad: false });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
  const getFingerprint = () => {
    if (typeof window === 'undefined') return 'server';
    const nav = window.navigator;
    const screen = window.screen;
    const str = `${nav.userAgent}${nav.language}${screen.colorDepth}${screen.width}${screen.height}${nav.hardwareConcurrency}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  };

  const handleVote = async (type: string) => {
    setHasVoted(true);
    setVoteStats({ total: type === 'si' ? 84 : 80, structure: type === 'si' ? 88 : 85 });
    try {
      let geoData = { city: 'Desconocido', region: 'Guerrero' };
      try {
        const geoReq = await fetch('https://ipapi.co/json/');
        if (geoReq.ok) {
          const res = await geoReq.json();
          geoData = { city: res.city || 'Desconocido', region: res.region || 'Guerrero' };
        }
      } catch (e) {
        console.warn('Fallo geolocalización, usando default');
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/votes`, {
        method: 'POST',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ vote: type, opcion: type, fingerprint: getFingerprint(), city: geoData.city, region: geoData.region })
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error al registrar voto:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error de red al registrar voto:', error);
    }
  };

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
      if (!req.ok) {
        const errData = await req.text();
        throw new Error('Supabase rechazó el registro: ' + errData);
      }
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'CompleteRegistration');
      }
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'generate_lead', { currency: 'MXN', value: 1 });
      }
      setFormStatus('success');
    } catch (error) {
      console.error(error);
      setFormStatus('error');
    }
  };
  return (
    <main className="overflow-x-hidden bg-zinc-50 w-full">

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION — Fixed & Clean
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full h-[100svh] overflow-hidden flex items-center justify-center">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/assets/img/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="relative z-20 w-full max-w-4xl mx-auto px-6 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h1 className="text-white text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              Mi historia comenzó en Guerrero cuando tenía 15 años
            </h1>
            <h2 className="text-[#BC955C] text-xl md:text-3xl font-semibold">
              Aspirante a la Coordinación de Guerrero
            </h2>
            <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto mt-4">
              Hoy, con 25 años de resultados, quiero escribir la siguiente etapa contigo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <a
                href="#formulario"
                className="inline-flex items-center justify-center px-8 py-3 bg-[#691C32] hover:bg-[#8B2942] text-white font-bold rounded-lg transition-colors"
              >
                Integrarme al Proyecto 2027
                <ChevronRight className="ml-2 w-5 h-5" />
              </a>
              <a
                href="#pulso"
                className="inline-flex items-center justify-center px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors border border-white/30"
              >
                Sumar mi apoyo
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECCIÓN DE AUTORIDAD — Currículum de Poder
      ═══════════════════════════════════════════════════════════ */}
      <section className="w-full py-16 md:py-24 bg-white">
        <div className="w-full max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#691C32] mb-4">
              La Elegida para el Esfuerzo en Guerrero
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              La mujer de confianza en el proyecto de Nación. Quien ayudó a construir el Segundo Piso desde el Ejecutivo Federal ahora coordina los esfuerzos en su tierra.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Activity, title: "25 Años de Lealtad", desc: "Trayectoria impecable al servicio de las causas justas, demostrando congruencia y resultados sin titubeos." },
              { icon: Network, title: "Conexión Directa", desc: "El puente natural y estratégico entre las políticas del Gobierno Federal y las verdaderas necesidades de Guerrero." },
              { icon: Users, title: "Liderazgo de Tierra", desc: "Forjada en las bases, conoce cada región del estado y tiene la capacidad probada para organizar el triunfo." }
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-zinc-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <item.icon className="w-12 h-12 text-[#691C32] mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CUARTO DE GUERRA — Data en Tiempo Real
      ═══════════════════════════════════════════════════════════ */}
      <section id="pulso" className="w-full py-16 md:py-24 bg-zinc-900">
        <div className="w-full max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Cuarto de Guerra Digital</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Monitoreo en tiempo real de la consolidación territorial en los 85 municipios.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="w-full max-w-lg mx-auto bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10"
          >
            <h3 className="text-xl font-bold text-white text-center mb-6">Termómetro de Organización</h3>
            {!hasVoted ? (
              <div className="space-y-3">
                <button
                  onClick={() => handleVote('si')}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-green-500/20 hover:bg-green-500/30 transition-colors border border-green-500/30 group"
                >
                  <span className="text-white font-medium">Sí, estoy con la Aspirante</span>
                  <ChevronRight className="w-5 h-5 text-green-400 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => handleVote('dudo')}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group"
                >
                  <span className="text-white font-medium">Aún tengo dudas</span>
                  <ChevronRight className="w-5 h-5 text-[#BC955C] group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => handleVote('no')}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-red-500/10 transition-colors border border-white/10 group"
                >
                  <span className="text-white font-medium">No por ahora</span>
                  <ChevronRight className="w-5 h-5 text-red-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <div className="bg-green-500/20 rounded-xl p-4 border border-green-500/30">
                  <p className="text-white font-medium mb-1">Apoyo total para Guerrero</p>
                  <p className="text-3xl font-bold text-green-400">{voteStats.total}%</p>
                </div>
                <div className="bg-[#BC955C]/20 rounded-xl p-4 border border-[#BC955C]/30">
                  <p className="text-white font-medium mb-1">Quiero sumarme a la estructura</p>
                  <p className="text-3xl font-bold text-[#BC955C]">{voteStats.structure}%</p>
                </div>
                <p className="text-gray-300 mt-4">¡Misión Cumplida! Tu postura enciende el mapa territorial.</p>
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <a
                    href={`https://wa.me/?text=¡Yo ya activé mi pulso por Esthela! Súmate aquí: https://guerreroescone.vercel.app`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors text-center"
                  >
                    Compartir en WhatsApp
                  </a>
                  <a
                    href="https://www.facebook.com/sharer/sharer.php?u=https://guerreroescone.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 bg-[#1877F2] hover:bg-[#1466d6] text-white font-semibold rounded-lg transition-colors text-center"
                  >
                    Compartir en Facebook
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          MAPA DE INEVITABILIDAD — Fixed Dimensions
      ═══════════════════════════════════════════════════════════ */}
      <section className="w-full py-16 md:py-24 bg-white">
        <div className="w-full max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#691C32] mb-2">
              Mapa de Inevitabilidad
            </h2>
            <span className="inline-block px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-full">
              EN LÍNEA
            </span>
          </motion.div>

          {/* Contenedor padre estricto del mapa */}
          <div className="w-full max-w-5xl mx-auto px-4 py-8 relative">
            <div className="w-full aspect-square md:aspect-video bg-zinc-100 rounded-xl overflow-hidden relative shadow-inner border border-gray-200 flex items-center justify-center">
              <div className="w-full h-full relative p-4">
                {/* Grid de células activas — placeholder visual */}
                <div className="grid grid-cols-6 gap-2 w-full h-full">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        opacity: [0.4, 0.9, 0.4],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{
                        duration: 2 + Math.random() * 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 2
                      }}
                      className={`aspect-square rounded-sm border md:rounded-md ${
                        Math.random() > 0.8
                          ? 'bg-[#691C32] border-[#691C32]'
                          : Math.random() > 0.9
                          ? 'bg-[#BC955C] border-[#BC955C]'
                          : 'bg-zinc-200 border-zinc-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <p className="text-sm font-semibold text-[#691C32]">
                    CÉLULAS ACTIVAS EN LAS 8 REGIONES
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          IDENTIDAD TERRITORIAL (Regiones)
      ═══════════════════════════════════════════════════════════ */}
      <section className="w-full py-16 md:py-24 bg-zinc-50">
        <div className="w-full max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#691C32] mb-4">
              Estructura y Mensaje
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Vocación regional para construir un estado fuerte.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                region: "Acapulco y Costa",
                desc: "El proyecto está enfocado en la resiliencia y la inyección federal para la reconstrucción total de nuestros puertos históricos."
              },
              {
                region: "Montaña y Sierra",
                desc: "Forjada desde joven en el trabajo comunitario puro y fiel a sus raíces en la UAGro; nunca olvida de dónde viene."
              },
              {
                region: "Tierra Caliente",
                desc: "Desarrollo productivo con paz y justicia, garantizado gracias a la colaboración absoluta con la Federación."
              }
            ].map((item, idx) => (
              <motion.div
                key={item.region}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <MapPin className="w-10 h-10 text-[#691C32] mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">{item.region}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FORMULARIO ESTRATÉGICO DE CAPTACIÓN — Fixed Select & Inputs
      ═══════════════════════════════════════════════════════════ */}
      <section id="formulario" className="w-full py-16 md:py-24 bg-white">
        <div className="w-full max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#691C32] mb-4">
              Ingresa al Círculo de Decisión
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Regístrate para recibir línea directa y organizar tu municipio.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8 border-t-4 border-[#691C32]"
          >
            {formStatus === 'success' ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Comando Registrado!</h3>
                <p className="text-gray-600">
                  En breve recibirás un mensaje de WhatsApp automatizado para asignar tu nivel de participación en la estructura local de tu municipio.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-5">
                {/* Nombre */}
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full max-w-full truncate overflow-hidden border-gray-300 rounded-lg focus:ring-[#691C32] focus:border-[#691C32] px-4 py-3 bg-white text-gray-800"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp (10 dígitos)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      +52
                    </span>
                    <input
                      type="tel"
                      id="whatsapp"
                      required
                      pattern="[0-9]{10}"
                      maxLength={10}
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value.replace(/\D/g, '') })}
                      className="w-full max-w-full truncate overflow-hidden border-gray-300 rounded-lg focus:ring-[#691C32] focus:border-[#691C32] pl-12 pr-4 py-3 bg-white text-gray-800"
                      placeholder="747 000 0000"
                    />
                  </div>
                </div>

                {/* Municipio */}
                <div>
                  <label htmlFor="municipio" className="block text-sm font-medium text-gray-700 mb-1">
                    Municipio de Residencia
                  </label>
                  <select
                    id="municipio"
                    required
                    value={formData.municipio}
                    onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                    className="w-full max-w-full truncate overflow-hidden border-gray-300 rounded-lg focus:ring-[#691C32] focus:border-[#691C32] px-4 py-3 bg-white text-gray-800 appearance-none"
                  >
                    <option value="" disabled>
                      Selecciona uno de los 85 municipios...
                    </option>
                    {MUNICIPIOS_GUERRERO.map((mun) => (
                      <option key={mun} value={mun} className="bg-white">
                        {mun}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Privacidad */}
                <div className="flex items-start gap-3">
                  <input
                    id="privacidad"
                    type="checkbox"
                    required
                    checked={formData.privacidad}
                    onChange={(e) => setFormData({ ...formData, privacidad: e.target.checked })}
                    className="w-4 h-4 mt-1 accent-[#691C32]"
                  />
                  <label htmlFor="privacidad" className="text-sm text-gray-600">
                    Acepto el aviso de privacidad y el tratamiento de mis datos personales de acuerdo con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.
                  </label>
                </div>

                {/* Submit */}
                {formStatus === 'loading' ? (
                  <div className="flex items-center justify-center py-3">
                    <div className="w-6 h-6 border-2 border-[#691C32] border-t-transparent rounded-full animate-spin" />
                    <span className="ml-2 text-gray-600">Registrando...</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#691C32] hover:bg-[#8B2942] text-white rounded-lg font-bold transition-colors"
                  >
                    Integrarme al Proyecto 2027
                  </button>
                )}
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════ */}
      <footer className="w-full py-8 bg-[#691C32] text-white text-center">
        <p className="text-sm opacity-80">
          © {new Date().getFullYear()} Coordinación Territorial | Guerrero.
        </p>
        <p className="text-xs opacity-60 mt-2">
          Este sitio es una plataforma digital de organización ciudadana.
        </p>
      </footer>

      {/* ═══════════════════════════════════════════════════════════
          TOAST NOTIFICATIONS — Bandwagon Effect
      ═══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-4 z-50 bg-[#691C32] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3"
          >
            <Shield className="w-5 h-5 text-[#BC955C]" />
            <div>
              <p className="text-sm font-medium">{toastMessage}</p>
              <p className="text-xs opacity-70">Estructura Digital • Real-time</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════
          FLOATING WHATSAPP CTA
      ═══════════════════════════════════════════════════════════ */}
      <a
        href="https://wa.me/5217474795833?text=Hola, quiero unirme a la estructura de la Aspirante para Guerrero"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </a>

    </main>
  );
}
