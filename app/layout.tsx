import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Por los Caminos del Sur | Guerrero se organiza',
  description:
    'Landing editorial y territorial para Por los Caminos del Sur: organización comunitaria, soberanía nacional, rutas temáticas, voces y presencia viva en Guerrero.',
  keywords: [
    'Por los Caminos del Sur',
    'Guerrero',
    'organización territorial',
    'soberanía nacional',
    'Esthela Damián',
    'landing política',
  ],
  authors: [{ name: 'Proyecto editorial Por los Caminos del Sur' }],
  openGraph: {
    title: 'Por los Caminos del Sur | Guerrero se organiza',
    description:
      'Una experiencia política-digital editorial, cinematográfica y territorial para Guerrero.',
    siteName: 'Por los Caminos del Sur',
    type: 'website',
    images: [
      {
        url: '/assets/foto28.jpg',
        width: 1200,
        height: 630,
        alt: 'Por los Caminos del Sur',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Por los Caminos del Sur | Guerrero se organiza',
    description: 'Territorio, voces, rutas y organización comunitaria en Guerrero.',
    images: ['/assets/foto28.jpg'],
  },
  robots: 'index, follow',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <head>
        <meta name="theme-color" content="#4c1220" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
