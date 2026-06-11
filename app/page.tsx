"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Star, ChevronRight, Trophy } from "lucide-react";

export default function HomePage() {
  return (
    <main className="overflow-x-hidden min-h-screen bg-[#14050B]">
     <section className="relative w-full h-[100svh] overflow-hidden flex flex-col">
  <div className="hero-bg absolute inset-0 w-full h-full" style={{ backgroundImage: "url('/assets/img/equipo.png')" }} />
  <div className="hero-overlay absolute inset-0 z-10" />

  {/* 7. EYEBROW SUPERIOR (Sin cambios de posición) */}
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="hero-eyebrow"
  >
    SELECCIÓN GUERRERO · REGISTRO OFICIAL
  </motion.div>

  {/* 1. CONTENEDOR GRID DE 2 COLUMNAS */}
  <div className="relative z-20 hero-grid-container px-4 md:px-0">
    
    {/* 2. COLUMNA IZQUIERDA: Copa Oficial */}
    <motion.div
      initial={{ opacity: 0, x: -40, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="hero-copa"
    >
      <img src="/assets/img/copa.png" alt="Copa Oficial" className="w-full h-auto" />
    </motion.div>

    {/* 3. COLUMNA DERECHA: Texto + Botones (Anclado abajo) */}
    <div className="hero-text-col">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="hero-h1"
      >
        Va por Guerrero. <span className="text-[#D4A843]">Va por México.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="hero-p"
      >
        Forma tu equipo ganador, registra a tu capitán y sal a la cancha con Esthela Damián.
      </motion.p>

      {/* 6. BOTONES (Fondo columna derecha) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="hero-buttons"
      >
        <Link href="/registro" className="btn-primary">
          Entrar a la cancha <Star className="w-5 h-5" />
        </Link>
        <Link href="/tarjetas" className="btn-secondary">
          Crear tarjeta oficial <ChevronRight className="w-5 h-5" />
        </Link>
      </motion.div>
    </div>

  </div>
</section>
    </main>
  );
}