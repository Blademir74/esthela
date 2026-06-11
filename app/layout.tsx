import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", weight: ["400", "700", "900"] });

export const metadata: Metadata = {
  title: "Esthela Damián | Selección Guerrero 2026 ⚽",
  description: "Únete al equipo. El 22 de junio, la cancha es nuestra. Ficha oficial con Esthela Damián — aspirante a la Coordinación de Guerrero · Morena.",
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
    <html lang="es" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="antialiased bg-[#14050B] text-white overflow-x-hidden">
        {children}
        
        {/* WhatsApp Flotante: Visible inmediatamente, z-index blindado, posición exacta */}
        <a
          href="https://chat.whatsapp.com/HSUgjqCm69g8vKujvgkNFN"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-[9999] w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg shadow-green-900/40 transition-transform hover:scale-110 active:scale-95"
          aria-label="Unirse al grupo oficial"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
            <path d="M9 10a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z" />
          </svg>
        </a>
      </body>
    </html>
  );
}