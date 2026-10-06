import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-editorial",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Por los Caminos del Sur | Esthela Damián",
  description:
    "Guerrero se organiza. Su futuro se defiende. Voces, comunidades y caminos para dialogar, fortalecer la organización territorial y defender lo nuestro.",
  keywords: [
    "Guerrero",
    "Por los Caminos del Sur",
    "Esthela Damián",
    "organización territorial",
    "soberanía nacional",
    "comunidades",
    "Cuarta Transformación",
    "Morena Guerrero",
  ],
  openGraph: {
    title: "Por los Caminos del Sur | Esthela Damián",
    description: "Guerrero se organiza. Su futuro se defiende.",
    type: "website",
    locale: "es_MX",
    images: [
      {
        url: "/assets/img/foto28.jpg",
        width: 1200,
        height: 630,
        alt: "Esthela Damián - Por los Caminos del Sur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Por los Caminos del Sur | Esthela Damián",
    description: "Guerrero se organiza. Su futuro se defiende.",
    images: ["/assets/img/foto28.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-MX" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
