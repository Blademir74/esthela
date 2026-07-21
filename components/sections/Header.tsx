"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#manifiesto", label: "Manifiesto" },
    { href: "#rutas", label: "Rutas" },
    { href: "#voces", label: "Voces" },
    { href: "#agenda", label: "Agenda" },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#11231D]/92 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.25)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className={`relative h-11 w-11 overflow-hidden rounded-full border transition-all duration-300 ${
              scrolled
                ? "border-[#D49A3A]/40 bg-white/10"
                : "border-white/20 bg-white/10"
            } backdrop-blur`}
          >
            <Image
              src="/assets/img/logo.png"
              alt="Logo Por los Caminos del Sur"
              fill
              className="object-contain p-1.5"
            />
          </div>
          <div>
            <span
              className={`block font-editorial text-lg leading-none transition-colors duration-300 ${
                scrolled ? "text-white" : "text-white"
              }`}
            >
              Esthela Damián
            </span>
            <span className="mt-0.5 block text-[9px] font-bold tracking-[0.24em] uppercase text-[#D49A3A]">
              Por los Caminos del Sur
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 text-sm font-semibold text-white/90 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-1 text-[13px] tracking-wide transition-colors hover:text-[#D49A3A] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-[#D49A3A] after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/tarjetas"
            className="rounded-full bg-[#D49A3A] px-5 py-2.5 text-[13px] font-bold text-[#1E1E1C] transition-all duration-300 hover:bg-[#FFFDF8] hover:shadow-[0_4px_20px_rgba(212,154,58,0.35)]"
          >
            Crea tu póster
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          type="button"
          aria-label="Abrir menú"
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-full p-2 text-white transition hover:bg-white/10 lg:hidden"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-[#11231D]/97 px-5 py-6 backdrop-blur-xl lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-4 text-sm font-semibold text-white">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-2 text-[15px] tracking-wide transition hover:text-[#D49A3A]"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/tarjetas"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-full bg-[#D49A3A] px-5 py-3 text-center text-[15px] font-bold text-[#1E1E1C]"
            >
              Crea tu póster
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
