"use client";

import Image from "next/image";

export default function ManifiestoSection() {
  return (
    <section
      id="manifiesto"
      className="relative overflow-hidden bg-[#F4EFE6] px-5 py-24 lg:px-8 lg:py-36"
    >
      {/* Ambient glow */}
      <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-[#D49A3A]/8 blur-3xl" />
      <div className="absolute -right-20 bottom-20 h-64 w-64 rounded-full bg-[#244C3A]/8 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16">
        {/* Image Column */}
        <div className="relative order-2 lg:order-1">
          <div className="overflow-hidden rounded-[2rem] bg-[#FFFDF8] shadow-[0_28px_90px_rgba(30,30,28,0.14)]">
            <div className="relative aspect-[4/5]">
              <Image
                src="/assets/img/foto29.jpg"
                alt="Esthela Damián en encuentro comunitario"
                fill
                className="object-cover"
              />
              {/* Subtle overlay on image bottom */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#11231D]/40 to-transparent" />
            </div>
          </div>

          {/* Floating Editorial Card */}
          <div className="absolute -bottom-8 left-6 right-6 rounded-[1.5rem] bg-[#11231D] p-6 text-white shadow-[0_20px_70px_rgba(17,35,29,0.3)]">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 overflow-hidden rounded-full border border-[#D49A3A]/30 bg-white/10">
                <Image
                  src="/assets/img/logo.png"
                  alt="Logo Por los Caminos del Sur"
                  fill
                  className="object-contain p-1.5"
                />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D49A3A]">
                  Organización territorial
                </p>
                <p className="text-[11px] text-white/50">Guerrero, México</p>
              </div>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-white/75">
              Caminar, escuchar y tejer comunidad con claridad, respeto y presencia.
            </p>
          </div>
        </div>

        {/* Text Column */}
        <div className="order-1 pt-4 lg:order-2 lg:pt-0">
          <div className="flex items-center gap-3">
            <p className="text-[11px] font-bold tracking-[0.2em] text-[#7A1F2B] uppercase">
              Manifiesto
            </p>
            <div className="h-px w-12 bg-[#D49A3A]" />
          </div>

          <div className="my-5 h-[3px] w-[72px] rounded-full bg-[#D49A3A]" />

          <h2 className="font-editorial text-[2.6rem] leading-[1.05] text-[#244C3A] sm:text-5xl lg:text-[3.2rem]">
            Caminar Guerrero es escuchar su historia, su fuerza y sus desafíos.
          </h2>

          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-[#1E1E1C]/75">
            Desde cada barrio, comunidad y municipio, la organización territorial abre caminos para dialogar, compartir experiencias y defender lo que pertenece al pueblo.
          </p>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-[#1E1E1C]/65">
            Este espacio no se construye desde la distancia, sino desde el encuentro: con causas, recorridos, voces y una convicción sencilla de futuro compartido.
          </p>

          {/* Values Grid */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-[#FFFDF8] p-6 shadow-[0_12px_40px_rgba(30,30,28,0.07)] transition-all duration-300 hover:shadow-[0_16px_50px_rgba(30,30,28,0.12)]">
              <div className="mb-3 h-[2px] w-10 bg-[#D49A3A]" />
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#D49A3A]">
                Territorio
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-[#1E1E1C]/70">
                Presencia real en regiones, municipios y comunidades. El mapa no se dibuja desde una oficina.
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-[#FFFDF8] p-6 shadow-[0_12px_40px_rgba(30,30,28,0.07)] transition-all duration-300 hover:shadow-[0_16px_50px_rgba(30,30,28,0.12)]">
              <div className="mb-3 h-[2px] w-10 bg-[#244C3A]" />
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#244C3A]">
                Escucha
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-[#1E1E1C]/70">
                Una narrativa que nace del diálogo y la experiencia colectiva. Escuchar también transforma.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
