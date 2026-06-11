"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Star, ChevronRight, Trophy } from "lucide-react";

export default function HomePage() {
  return (
    <main className="overflow-x-hidden min-h-screen bg-[#14050B]">
 <section className="relative min-h-screen flex flex-col justify-end pb-12 overflow-hidden">
  {/* IMAGEN DE FONDO Y OVERLAY EXISTENTES - NO MODIFICAR */}
  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/assets/img/equipo.png')" }} />
  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/90" />

  {/* 1. EYEBROW - Fijo arriba, fuera del flujo */}
  <span className="absolute top-6 left-1/2 -translate-x-1/2 z-20 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-[#D4A843]">
    SELECCIÓN GUERRERO · REGISTRO OFICIAL
  </span>

  {/* 2. WRAPPER - Ancla contenido abajo y alinea a la izquierda */}
  <div className="relative z-10 flex flex-col items-start gap-3 px-8 w-full max-w-2xl mx-auto md:mx-0">
    
    {/* 3. H1 - Tamaño controlado y alineación izquierda */}
    <h1 className="text-4xl md:text-5xl font-black leading-tight text-left text-white">
      Va por Guerrero. <span className="text-[#D4A843]">Va por México.</span>
    </h1>

    {/* 4. PÁRRAFO - Alineación izquierda y ancho limitado */}
    <p className="text-left text-base md:text-lg max-w-lg opacity-90 text-white">
      Forma tu equipo ganador, registra a tu capitán y sal a la cancha con Esthela Damián.
    </p>

    {/* 5. FILA: COPA + BOTONES - items-end alinea las bases perfectamente */}
    <div className="flex flex-row items-end gap-4 mt-2 flex-wrap">
      <img 
        src="/assets/img/copa.png" 
        alt="Copa Oficial" 
        className="h-20 w-auto object-contain self-end drop-shadow-lg" 
      />
      <Link 
        href="/registro/" 
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold bg-[#D4A843] text-[#6B1D3A] hover:bg-[#BC955C] transition-all"
      >
        Entrar a la cancha ★
      </Link>
      <Link 
        href="/tarjetas/" 
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
      >
        Crear tarjeta oficial →
      </Link>
    </div>
  </div>
</section>
    </main>
  );
}