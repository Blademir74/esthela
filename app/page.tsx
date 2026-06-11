"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Star, ChevronRight, Trophy } from "lucide-react";

export default function HomePage() {
  return (
    <main className="overflow-x-hidden min-h-screen bg-[#14050B]">
 <section className="relative w-full h-[100svh] overflow-hidden flex flex-col bg-[#14050B]">
  {/* Fondo y Overlay (Mantenidos intactos) */}
  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/assets/img/equipo.png')" }} />
  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/90" />

  {/* 1. EYEBROW - Fijo arriba, fuera del flujo */}
  <div className="absolute top-6 left-0 right-0 z-20 text-center px-4">
    <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#D4A843]">
      SELECCIÓN GUERRERO · REGISTRO OFICIAL
    </span>
  </div>

  {/* 2. CONTENEDOR PRINCIPAL - Anclado al fondo */}
  <div className="relative z-10 w-full h-full flex items-end justify-center pb-12 px-4 sm:px-6">
    
    {/* 3. WRAPPER DE TEXTO - Optimizado para móvil (Problema B) */}
    <div className="flex flex-col items-start gap-2 w-full max-w-lg">
      
      {/* H1 - Tamaño base reducido (text-3xl) para evitar cortes */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-left text-white">
        Va por Guerrero. <span className="text-[#D4A843]">Va por México.</span>
      </h1>

      {/* Párrafo - Tipografía condensada para móvil */}
      <p className="text-sm sm:text-base text-left max-w-xs sm:max-w-lg opacity-90 leading-snug text-white">
        Forma tu equipo ganador, registra a tu capitán y sal a la cancha con Esthela Damián.
      </p>

      {/* 4. FILA DE BOTONES - Copa Emoji + Botones (Problema A) */}
      <div className="flex flex-row items-end gap-3 mt-2 flex-wrap">
        {/* Emoji Copa (Reemplaza la imagen rota) */}
        <span className="text-4xl sm:text-5xl drop-shadow-lg select-none" aria-hidden="true">🏆</span>
        
        <Link 
          href="/registro/" 
          className="shimmer-btn px-6 py-3 rounded-full font-bold text-sm sm:text-base whitespace-nowrap transition-all hover:scale-105"
          style={{ backgroundColor: '#D4A843', color: '#6B1D3A', border: 'none' }}
        >
          Entrar a la cancha ★
        </Link>
        
        <Link 
          href="/tarjetas/" 
          className="px-6 py-3 rounded-full font-bold text-sm sm:text-base bg-white/10 border border-white/20 text-white backdrop-blur-sm hover:bg-white/20 transition-all whitespace-nowrap"
        >
          Crear tarjeta oficial →
        </Link>
      </div>

    </div>
  </div>
</section>
    </main>
  );
}