"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Star, ChevronRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="overflow-x-hidden min-h-screen bg-[#14050B]">
      <section className="relative w-full min-h-[100svh] overflow-hidden flex flex-col">
        <div className="hero-bg absolute inset-0 w-full h-full" style={{ backgroundImage: "url('/assets/img/equipo.png')" }} />
        <div className="hero-overlay absolute inset-0 z-10" />

        <div className="relative z-20 w-full flex flex-col items-center justify-start pt-10 px-4 sm:px-6 md:pt-16">
          {/* Eyebrow Político */}
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-montserrat text-[#D4A843] text-xs sm:text-sm md:text-base font-bold tracking-[0.3em] uppercase text-center"
          >
            SELECCIÓN GUERRERO · REGISTRO OFICIAL
          </motion.span>

          {/* Headline & Subheadline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 md:mt-10 text-center"
          >
            <h1 className="font-black text-3xl sm:text-4xl md:text-5xl lg:text-7xl leading-tight tracking-tight mb-4 text-white">
              Va por Guerrero. <span className="text-[#D4A843]">Va por México.</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-medium px-2">
              Forma tu equipo ganador, registra a tu capitán y sal a la cancha con Esthela Damián.
            </p>
          </motion.div>

          {/* Alineación: Copa + Botones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 flex flex-col items-center gap-6 w-full max-w-4xl"
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full">
              {/* Imagen Copa/Trofeo */}
              <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 relative">
                <img src="/assets/img/copa.png" alt="Copa Oficial" className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(212,168,67,0.6)]" />
              </div>
              
              {/* Botones alineados */}
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <Link href="/registro" className="btn-primary w-full sm:w-auto justify-center">
                  Entrar a la cancha <Star className="w-5 h-5" />
                </Link>
                <Link href="/tarjetas" className="btn-secondary w-full sm:w-auto justify-center">
                  Crear tarjeta oficial <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}