import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Esthela Damián | Selección Guerrero 2026 ⚽",
  description:
    "Únete al equipo. El 22 de junio, la cancha es nuestra. Ficha oficial con Esthela Damián — aspirante a la Coordinación de Guerrero · Morena.",
  openGraph: {
    title: "Esthela Damián | Selección Guerrero 2026 ⚽",
    description: "Ficha con el equipo más fuerte de Guerrero. 22 de junio.",
    url: "https://guerreroescone.vercel.app",
    siteName: "Esthela Damián Guerrero",
    locale: "es_MX",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable}`}>
      <body className="antialiased bg-[#0a1f1b] text-[#fdfaf5]">{children}</body>
    </html>
  );
}