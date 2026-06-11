"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Star, ChevronRight, Trophy } from "lucide-react";

export default function HomePage() {
  return (
    <main className="overflow-x-hidden min-h-screen bg-[#14050B]">
      <section className="relative w-full min-h-[100svh] overflow-hidden flex flex-col">
        <div className="hero-bg absolute inset-0 w-full h-full" style={{ backgroundImage: "url('/assets/img/equipo.png')" }} />
        <div className="hero-overlay absolute inset-0 z-10" />

        {/* Eyebrow Superior */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-20 w-full pt-6 pb-2 text-center"
        >
          <span className="font-montserrat text-[#D4A843] text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.3em] uppercase">
            SELECCIÓN GUERRERO · REGISTRO OFICIAL
          </span>
        </motion.div>

        {/* Contenido Principal (Bajado estratégicamente) */}
        <div className="relative z-20 w-full flex flex-col items-center justify-end px-4 sm:px-6 pt-[45vh] md:pt-[30vh] pb-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl w-full text-center"
          >
            <h1 className="font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight mb-3 text-white">
              Va por Guerrero. <span className="text-[#D4A843]">Va por México.</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed font-medium mb-6 px-2">
              Forma tu equipo ganador, registra a tu capitán y sal a la cancha con Esthela Damián.
            </p>
          </motion.div>

          {/* Botones Alineados */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto"
          >
            <Link href="/registro" className="btn-primary w-full">
              Entrar a la cancha <Star className="w-5 h-5" />
            </Link>
            <Link href="/tarjetas" className="btn-secondary w-full">
              Crear tarjeta oficial <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Trofeo Decorativo (Sustituye la imagen rota) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-6 md:mt-8 flex items-center gap-2 text-[#D4A843]/60 text-xs font-semibold"
          >
            <Trophy className="w-5 h-5" />
            <span className="uppercase tracking-widest">Copa Oficial 2026</span>
          </motion.div>
        </div>
      </section>
    </main>
  );
}