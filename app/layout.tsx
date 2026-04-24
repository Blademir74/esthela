import type { Metadata } from "next";
import React from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Esthela Damián | La Voz de Guerrero 🏔️",
  description: "Forjada desde joven en el trabajo comunitario. Mi historia comenzó en Guerrero a los 15 años. ¡Suma tu voz hoy!",
  openGraph: {
    title: "Esthela Damián | La Voz de Guerrero 🏔️",
    description: "Forjada desde joven en el trabajo comunitario. Mi historia comenzó en Guerrero a los 15 años. ¡Suma tu voz hoy!",
    images: [{ url: "https://guerreroescone.vercel.app/assets/img/esthela.jpg" }],
    url: "https://guerreroescone.vercel.app/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Esthela Damián | La Voz de Guerrero 🏔️",
    description: "Forjada desde joven en el trabajo comunitario. Mi historia comenzó en Guerrero a los 15 años. ¡Suma tu voz hoy!",
    images: ["https://guerreroescone.vercel.app/assets/img/esthela.jpg"],
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