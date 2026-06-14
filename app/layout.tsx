import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Esthela Damián | Selección Guerrero 2026 ⚽",
  description: "Únete al equipo. El 22 de junio, la cancha es nuestra. Ficha oficial con Esthela Damián.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.className}>
      <body className="antialiased bg-[#14050B] text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}