"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Trophy, ChevronRight, Users, Zap, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <main className="overflow-x-hidden min-h-screen bg-[#0a1f1b] text-[#fdfaf5]">
      
     <section className="hero-section relative w-full h-[100svh] overflow-hidden flex flex-col">
  <div className="hero-bg absolute inset-0 w-full h-full" />
  <div className="hero-overlay absolute inset-0 z-10" />
  
  <div className="hero-content relative z-20 w-full flex flex-col justify-end px-6 md:px-10 pb-12">
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-3xl mx-auto text-center md:text-left"
    >
      <motion.span 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs md:text-sm font-bold tracking-widest uppercase mb-6"
      >
        SELECCIÓN GUERRERO · REGISTRO OFICIAL
      </motion.span>
      
      <motion.h1 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="font-black leading-tight tracking-tight mb-4 text-4xl md:text-6xl lg:text-7xl text-white"
      >
        Va por Guerrero. <span className="text-[#D4A843]">Va por México.</span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-lg md:text-xl text-white/90 max-w-2xl mb-8 leading-relaxed font-medium"
      >
        Forma tu equipo ganador, registra a tu capitán y sal a la cancha con Esthela Damián.
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
      >
        <Link href="/registro" className="btn-stadium animate-shimmer">
          Entrar a la cancha <Trophy className="w-5 h-5" />
        </Link>
        <Link href="/tarjetas" className="btn-ghost">
          Crear tarjeta oficial <ChevronRight className="w-5 h-5" />
        </Link>
      </motion.div>
    </motion.div>
  </div>
</section>

      {/* SECCIÓN DE CONVOCATORIA (ESTADIO) */}
      <section className="py-20 px-6 md:px-10 bg-gradient-to-b from-[#0a1f1b] to-[#0d2924] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #D4A843 0, #D4A843 1px, transparent 0, transparent 40px)'
        }} />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Tu equipo ya está en la cancha</h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">Después de registrarte, crea y comparte la tarjeta oficial de tu capitán o de tu escuadra. Cada ficha suma una victoria.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Users, title: "Construye tu Red", desc: "Registra a tu Responsable de Zona y añade a tu alineación territorial." },
              { icon: Shield, title: "Estructura Probada", desc: "Trayectoria federal y local. 40 años forjando puentes en Guerrero." },
              { icon: Zap, title: "Viralidad Organizada", desc: "Genera cromos digitales, compárteles por WhatsApp y activa tu pulso." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#D4A843]/40 transition-all group"
              >
                <item.icon className="w-8 h-8 text-[#D4A843] mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER MÍNIMO */}
      <footer className="py-8 px-6 border-t border-white/5 text-center text-white/40 text-sm">
        <p>© {new Date().getFullYear()} Esthela Damián | Plataforma Oficial Selección Guerrero</p>
        <p className="mt-1 text-xs">Coordinación Territorial · Morena · Va por México</p>
      </footer>

      {/* WHATSAPP FLOTANTE (CORREGIDO) */}
      <a 
        href="https://chat.whatsapp.com/HSUgjqCm69g8vKujvgkNFN" 
        target="_blank" rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Unirse al grupo oficial"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
          <path d="M9 10a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z" fill="#D4A843" stroke="none"/>
        </svg>
      </a>
    </main>
  );
}