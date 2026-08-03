import { Playfair_Display } from "next/font/google";
import type { Metadata } from "next";
import React from "react";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const siteUrl = "https://porloscaminosdelsur.vercel.app";
const shareImage = "/assets/img/foto3.jfif";
const shareTitle = "Esthela Damián | Por los Caminos del Sur";
const shareDescription = "Guerrero se organiza, su futuro se defiende. Territorio, voz y organización con Esthela Damián.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: shareTitle,
  description: shareDescription,
  openGraph: {
    title: shareTitle,
    description: shareDescription,
    images: [{ url: shareImage, width: 1200, height: 1500 }],
    url: siteUrl,
    type: "website",
    locale: "es_MX",
  },
  twitter: {
    card: "summary_large_image",
    title: shareTitle,
    description: shareDescription,
    images: [shareImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={playfair.variable}>
      <body className="antialiased bg-[#F4EFE6] text-[#1E1E1C]">
        {children}
      </body>
    </html>
  );
}