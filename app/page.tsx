"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Activity, CheckCircle2, ChevronRight, Users, Network, Send, MapPin, MessageCircle, Facebook, MessageSquare, Share2, Heart } from 'lucide-react';

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
  const [formData, setFormData] = useState({ nombre: '', whatsapp: '', municipio: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasPulsed, setHasPulsed] = useState(false);

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
    } catch (error) {
      console.error(error);
      setFormStatus('error');
    }
  };
  return (
    <main className="overflow-x-hidden bg-[#14050B] w-full min-h-screen">

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION — Centro de Mando Digital
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full h-[100svh] overflow-hidden flex flex-col">
        {/* Video Background */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 30%' }}
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/assets/img/hero-video.mp4" type="video/mp4" />
          <img src="/assets/img/esthela.jpg" alt="Esthela Damián" className="w-full h-full object-cover" />
        </video>

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(180deg, rgba(20,5,11,0.4) 0%, rgba(20,5,11,0.6) 50%, rgba(20,5,11,0.92) 100%)'
          }}
        />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 pt-4 md:pt-6"
        >
          <div className="mx-auto w-fit px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <p className="text-xs md:text-sm text-[#D4A843] font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-[#D4A843] rounded-full animate-pulse" />
              Aspirante a la Coordinación de Guerrero · Morena
            </p>
          </div>
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-6 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="max-w-3xl"
          >
            <h1
              className="text-white font-bold leading-tight drop-shadow-2xl"
              style={{ fontSize: 'clamp(28px, 7vw, 64px)' }}
            >
              Forjada desde joven
              <span className="block text-[#D4A843]">en el trabajo comunitario</span>
            </h1>
            <p className="text-white/80 text-base md:text-lg mt-4 max-w-xl mx-auto">
              Con 25 años de resultados, Esthela Damián es la voz que Guerrero necesita para el cambio real.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#pulso"
                className="inline-flex items-center justify-center px-8 py-3 bg-[#D4A843] hover:bg-[#BC955C] text-[#14050B] font-bold rounded-full transition-all text-base"
              >
                Activar mi Pulso
                <Heart className="ml-2 w-5 h-5" />
              </a>
              <a
                href="#registro"
                className="inline-flex items-center justify-center px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full transition-all text-base border border-white/30 backdrop-blur-sm"
              >
                Unirme al Movimiento
                <ChevronRight className="ml-1 w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Leyenda Territorial */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative z-20 pb-4"
        >
          <p className="text-xs md:text-sm text-white/50 text-center tracking-widest uppercase">
            Chilpancingo · La Montaña · La Costa · Tierra Caliente · La Sierra · Un solo Guerrero
          </p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FACTOR SHEINBAUM — Experiencia Probada
      ═══════════════════════════════════════════════════════════ */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-b from-[#14050B] to-[#1F0A12]">
        <div className="w-full max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1 bg-[#D4A843]/20 text-[#D4A843] text-sm font-semibold rounded-full mb-4">
              Experiencia Probada
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Con la Dra. Claudia Sheinbaum
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Esthela Damián no es una promesa, es una realidad. Quien ayudó a construir el Segundo Piso desde el Ejecutivo Federal ahora lleva esa experiencia a Guerrero.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Construcción Federal", desc: "Parte del equipo que ejecutó obras transformadoras en la CDMX bajo la coordinación de la Dra. Sheinbaum." },
              { icon: Network, title: "Puente Estratégico", desc: "La conexión directa entre las políticas de la Cuarta Transformación y las necesidades reales de Guerrero." },
              { icon: CheckCircle2, title: "Resultados Tangibles", desc: "25 años de trabajo comprobable: no promesas, hechos que transforman comunidades." }
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-[#D4A843]/50 transition-colors"
              >
                <item.icon className="w-12 h-12 text-[#D4A843] mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PULSO — Activar mi Pulso
      ═══════════════════════════════════════════════════════════ */}
      <section id="pulso" className="w-full py-16 md:py-24 bg-[#1F0A12]">
        <div className="w-full max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Activa tu Pulso</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              ¿Quieres acompañar este camino? Déjanos tu contacto y forma parte del cambio real en Guerrero.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="w-full max-w-lg mx-auto"
          >
            {formStatus === 'success' ? (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-[#D4A843]/30 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.6 }}
                >
                  <div className="w-20 h-20 bg-[#D4A843] rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10 text-[#14050B]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">¡Bienvenida al Movimiento!</h3>
                  <p className="text-gray-400">
                    Tu contacto ha sido registrado. Pronto recibirás un mensaje para definir tu nivel de participación en la estructura de Guerrero.
                  </p>
                </motion.div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 space-y-5">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-[#D4A843] mb-2">
                    Tu nombre o apodo
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4A843] focus:ring-1 focus:ring-[#D4A843] transition-colors"
                    placeholder="Ej. María, La Jefa, Juanito..."
                  />
                </div>

                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-medium text-[#D4A843] mb-2">
                    WhatsApp
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
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
                      className="w-full bg-white/5 border border-white/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4A843] focus:ring-1 focus:ring-[#D4A843] transition-colors"
                      placeholder="747 000 0000"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="municipio" className="block text-sm font-medium text-[#D4A843] mb-2">
                    Municipio de Guerrero
                  </label>
                  <select
                    id="municipio"
                    required
                    value={formData.municipio}
                    onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4A843] focus:ring-1 focus:ring-[#D4A843] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-[#14050B]">
                      Selecciona tu municipio...
                    </option>
                    {MUNICIPIOS_GUERRERO.map((mun) => (
                      <option key={mun} value={mun} className="bg-[#14050B] text-white">
                        {mun}
                      </option>
                    ))}
                  </select>
                </div>

                {formStatus === 'loading' ? (
                  <button
                    type="button"
                    disabled
                    className="w-full py-4 bg-[#D4A843]/50 text-white rounded-full font-bold flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <div className="w-5 h-5 border-2 border-[#14050B] border-t-transparent rounded-full animate-spin" />
                    Registrando...
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full py-4 bg-[#D4A843] hover:bg-[#BC955C] text-[#14050B] rounded-full font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    Activar mi Pulso por Guerrero
                    <Heart className="w-5 h-5" />
                  </button>
                )}

                <p className="text-xs text-gray-500 text-center mt-4">
                  Tus datos están protegidos. Nos comprometemos a usarlos solo para fines de organización ciudadana.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          COMPARTE ESTE MOVIMIENTO — Viralización Orgánica
      ═══════════════════════════════════════════════════════════ */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-b from-[#1F0A12] to-[#14050B]">
        <div className="w-full max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Comparte este Movimiento
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
              ¡Yo ya activé mi pulso! Súmate aquí para que el futuro de Guerrero esté en nuestras manos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/?text=¡Yo ya activé mi pulso! Súmate aquí para que el futuro de Guerrero esté en nuestras manos: https://guerreroescone.vercel.app`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition-all shadow-lg shadow-green-500/20"
              >
                <MessageCircle className="w-6 h-6" />
                Compartir en WhatsApp
              </a>
              <a
                href="https://www.facebook.com/sharer/sharer.php?u=https://guerreroescone.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1877F2] hover:bg-[#1466d6] text-white font-bold rounded-full transition-all shadow-lg shadow-blue-500/20"
              >
                <Facebook className="w-6 h-6" />
                Compartir en Facebook
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════ */}
      <footer className="w-full py-8 bg-[#0D0307] border-t border-white/5">
        <div className="w-full max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-500 mb-2">
            © {new Date().getFullYear()} Esthela Damián | La Voz de Guerrero 🏔️
          </p>
          <p className="text-xs text-gray-600">
            Coordinación Territorial · Plataforma de organización ciudadana
          </p>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════════
          TOAST NOTIFICATIONS
      ═══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-4 right-4 sm:right-auto sm:w-auto z-50 bg-[#D4A843] text-[#14050B] px-5 py-3 rounded-full shadow-lg flex items-center gap-3"
          >
            <Shield className="w-5 h-5" />
            <div>
              <p className="text-sm font-semibold">{toastMessage}</p>
              <p className="text-xs opacity-80">Estructura Digital · Real-time</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════
          FLOATING WHATSAPP
      ═══════════════════════════════════════════════════════════ */}
      <a
        href="https://wa.me/5217474795833?text=Hola, quiero unirme al movimiento de Esthela Damián para Guerrero"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg shadow-green-500/30 transition-transform hover:scale-110 flex items-center justify-center"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </a>

    </main>
  );
}
