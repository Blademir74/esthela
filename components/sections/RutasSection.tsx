"use client";

import Image from "next/image";
import { MoveRight } from "lucide-react";

const routes = [
  {
    title: "Soberanía y conectividad",
    text: "Pensar los caminos, la infraestructura y el desarrollo desde el interés público y las decisiones de las comunidades.",
    image: "/assets/img/soberania.jpg",
    bg: "from-[#133B5C] to-[#0D2940]",
    label: "Ruta 01",
  },
  {
    title: "Campo y economía comunitaria",
    text: "Reconocer a quienes trabajan la tierra y fortalecer el diálogo por la soberanía alimentaria y el trabajo comunitario.",
    image: "/assets/img/campo.png",
    bg: "from-[#244C3A] to-[#11231D]",
    label: "Ruta 02",
  },
  {
    title: "Mujeres e igualdad sustantiva",
    text: "Abrir espacios de participación, organización y respeto para una vida con derechos y libre de violencias.",
    image: "/assets/img/mujeres.jfif",
    bg: "from-[#7A1F2B] to-[#4A0F18]",
    label: "Ruta 03",
  },
  {
    title: "Educación y juventudes",
    text: "Defender la educación pública, las oportunidades y las vocaciones que construyen futuro en cada región.",
    image: "/assets/img/juventud.jpg",
    bg: "from-[#15395C] to-[#10293E]",
    label: "Ruta 04",
  },
  {
    title: "Agua y salud comunitaria",
    text: "Poner en el centro el cuidado, la prevención, el acceso al agua y el bienestar de las comunidades.",
    image: "/assets/img/agua.jpg",
    bg: "from-[#285B72] to-[#133B5C]",
    label: "Ruta 05",
  },
];

export default function RutasSection() {
  return (
    <section id="rutas" className="bg-[#11231D] px-5 py-24 text-white lg:px-8 lg:py-36">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <p className="text-[11px] font-bold tracking-[0.2em] text-[#D49A3A] uppercase">
                Rutas del Sur
              </p>
              <div className="h-px w-10 bg-[#D49A3A]/50" />
            </div>
            <div className="my-5 h-[3px] w-[72px] rounded-full bg-[#D49A3A]" />
            <h2 className="font-editorial text-[2.6rem] leading-[1.05] sm:text-5xl lg:text-[3.2rem]">
              Cinco rutas. Un mismo horizonte.
            </h2>
          </div>

          <p className="max-w-md text-[14px] leading-relaxed text-white/60">
            La página no presenta bloques repetidos; presenta recorridos visuales con causa, territorio y dirección política.
          </p>
        </div>

        {/* Editorial Grid - Asymmetric Layout */}
        <div className="mt-16 grid gap-5 lg:grid-cols-12">
          {/* Row 1: Large card (7 cols) + Tall card (5 cols) */}
          <article className="ruta-card group overflow-hidden rounded-[2rem] lg:col-span-7">
            <div className="grid h-full lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative min-h-[340px] overflow-hidden">
                <Image
                  src={routes[0].image}
                  alt={routes[0].title}
                  fill
                  className="ruta-img object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#133B5C]/30" />
              </div>
              <div className={`flex flex-col justify-between bg-gradient-to-br ${routes[0].bg} p-7`}>
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D49A3A]/30 bg-white/5 px-3 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#D49A3A]" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D49A3A]">
                      {routes[0].label}
                    </span>
                  </div>
                  <h3 className="font-editorial text-[1.8rem] leading-tight sm:text-[2.2rem]">
                    {routes[0].title}
                  </h3>
                  <p className="mt-4 text-[14px] leading-relaxed text-white/75">
                    {routes[0].text}
                  </p>
                </div>
                <div className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#D49A3A] transition group-hover:gap-3">
                  Horizonte compartido <MoveRight size={14} />
                </div>
              </div>
            </div>
          </article>

          <article className="ruta-card group overflow-hidden rounded-[2rem] lg:col-span-5">
            <div className="relative min-h-[260px] overflow-hidden">
              <Image
                src={routes[2].image}
                alt={routes[2].title}
                fill
                className="ruta-img object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#7A1F2B]/60 to-transparent" />
            </div>
            <div className={`bg-gradient-to-br ${routes[2].bg} p-7`}>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D49A3A]/30 bg-white/5 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D49A3A]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D49A3A]">
                  {routes[2].label}
                </span>
              </div>
              <h3 className="font-editorial text-[1.6rem] leading-tight sm:text-[1.9rem]">
                {routes[2].title}
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-white/75">
                {routes[2].text}
              </p>
            </div>
          </article>

          {/* Row 2: Three equal cards */}
          {[routes[1], routes[3], routes[4]].map((route) => (
            <article
              key={route.title}
              className="ruta-card group overflow-hidden rounded-[2.5rem] bg-[#1A1A1A] lg:col-span-4"
            >
              <div className="relative min-h-[220px] overflow-hidden">
                <Image
                  src={route.image}
                  alt={route.title}
                  fill
                  className="ruta-img object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-transparent to-transparent" />
              </div>
              <div className={`bg-gradient-to-br ${route.bg} p-6`}>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D49A3A]/30 bg-white/5 px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D49A3A]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D49A3A]">
                    {route.label}
                  </span>
                </div>
                <h3 className="font-editorial text-[1.4rem] leading-tight sm:text-[1.7rem]">
                  {route.title}
                </h3>
                <p className="mt-3 text-[13px] leading-relaxed text-white/70">
                  {route.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
