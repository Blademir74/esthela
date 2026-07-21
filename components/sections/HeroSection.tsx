"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircleHeart, PlayCircle, Volume2, VolumeX } from "lucide-react";

export default function HeroSection() {
  const [heroReady, setHeroReady] = useState(false);
  const [muted, setMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    // Small delay for initial fade-in
    const timer = setTimeout(() => setHeroReady(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#11231D]">
      {/* Fallback Image */}
      <Image
        src="/assets/img/foto28.jpg"
        alt="Esthela Damián en Guerrero"
        fill
        priority
        className={`object-cover object-center transition-opacity duration-1000 ${
          videoLoaded ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Video */}
      <video
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
          videoLoaded ? "opacity-100" : "opacity-0"
        }`}
        autoPlay
        muted={muted}
        loop
        playsInline
        preload="metadata"
        poster="/assets/img/foto28.jpg"
        onCanPlay={() => {
          setVideoLoaded(true);
          setHeroReady(true);
        }}
      >
        <source src="/assets/img/video1.mp4" type="video/mp4" />
      </video>

      {/* Cinematic Overlays */}
      <div className="hero-overlay-cinematic absolute inset-0" />

      {/* Bottom vignette */}
      <div className="absolute inset-x-0 bottom-0 z-10 h-56 bg-gradient-to-t from-[#11231D] via-[#11231D]/60 to-transparent" />

      {/* Subtle grain texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[5] opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-20 mx-auto flex min-h-[100svh] max-w-7xl items-end px-5 pb-16 pt-32 lg:px-8 lg:pb-24">
        <div className="grid w-full gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          {/* Left Column */}
          <div
            className={`max-w-3xl transition-all duration-1000 ${
              heroReady ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            {/* Pill Badge */}
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[#D49A3A]/30 bg-black/20 px-4 py-2 text-[11px] font-bold tracking-[0.18em] text-[#F4EFE6] uppercase backdrop-blur-md">
              <PlayCircle size={14} className="text-[#D49A3A]" />
              Guerrero · Territorio de voces
            </div>

            {/* Logo Mark */}
            <div className="mb-6 flex items-center gap-3">
              <div className="relative h-14 w-14 overflow-hidden rounded-full border border-[#D49A3A]/30 bg-white/8 backdrop-blur">
                <Image
                  src="/assets/img/logo.png"
                  alt="Logo Por los Caminos del Sur"
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="h-8 w-px bg-[#D49A3A]/30" />
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#D49A3A]">
                Por los Caminos del Sur
              </p>
            </div>

            {/* Main Headline */}
            <h1 className="font-editorial text-balance text-[2.8rem] leading-[0.94] text-[#FFFDF8] sm:text-6xl lg:text-[5.8rem]">
              Guerrero se organiza.
              <span className="mt-2 block text-[#D49A3A]">Su futuro se defiende.</span>
            </h1>

            {/* Subtext */}
            <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-[#F4EFE6]/80">
              Voces, comunidades y caminos para dialogar, fortalecer la organización territorial y defender lo nuestro desde cada región de Guerrero.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="#voces"
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#D49A3A] px-7 py-4 text-[14px] font-bold text-[#1E1E1C] transition-all duration-300 hover:bg-[#FFFDF8] hover:shadow-[0_6px_30px_rgba(212,154,58,0.4)]"
              >
                Conoce las voces del Sur
                <ArrowRight size={17} />
              </a>
              <Link
                href="/tarjetas"
                className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/40 px-7 py-4 text-[14px] font-bold text-white transition-all duration-300 hover:bg-white/10 hover:border-white/60"
              >
                Crea tu póster
                <MessageCircleHeart size={17} />
              </Link>
            </div>
          </div>

          {/* Right Column - Editorial Card */}
          <div
            className={`hidden lg:block transition-all duration-1000 delay-300 ${
              heroReady ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="ml-auto max-w-sm rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.3)]">
              {/* Seal */}
              <div className="mb-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D49A3A]/40 to-transparent" />
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#D49A3A]">
                  Señal editorial
                </p>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D49A3A]/40 to-transparent" />
              </div>

              <p className="font-editorial text-[2.2rem] leading-tight text-white">
                Escuchar también transforma.
              </p>

              <p className="mt-4 text-[13px] leading-relaxed text-white/65">
                Una narrativa política contemporánea que nace del territorio, no de la distancia.
              </p>

              <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                <div className="relative h-8 w-8 overflow-hidden rounded-full bg-white/10">
                  <Image
                    src="/assets/img/logo.png"
                    alt="Logo"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <p className="text-[11px] tracking-wide text-white/50">
                  #PorlosCaminosdelSur
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Mute Toggle */}
      <button
        onClick={() => setMuted(!muted)}
        className="absolute bottom-6 right-6 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white/70 backdrop-blur transition hover:bg-black/50 hover:text-white"
        aria-label={muted ? "Activar sonido" : "Silenciar"}
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 opacity-60">
        <div className="h-10 w-[1px] bg-gradient-to-b from-transparent to-[#D49A3A]" />
      </div>
    </section>
  );
}
