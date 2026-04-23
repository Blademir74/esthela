import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Esthela Damián: El Proyecto Federal en Guerrero",
  description: "La mujer de confianza en el proyecto de Nación para construir el Segundo Piso de la Transformación en Guerrero.",
  openGraph: {
    title: "Esthela Damián: El Proyecto Federal en Guerrero",
    description: "La defensora del proyecto federal que conecta a Guerrero con el Bienestar Nacional. Súmate.",
    images: [{ url: "https://guerreroescone.vercel.app/assets/img/og-esthela-poder.jpg" }],
    url: "https://guerreroescone.vercel.app/",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`antialiased bg-[#0B0F19] text-white`}>
        {children}
      </body>
    </html>
  );
}
