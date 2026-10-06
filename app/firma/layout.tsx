// app/firmas/layout.tsx
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Consulta Ciudadana por la Transparencia | Por Los Caminos del Sur',
  description: 'Firma tu acta ciudadana. El pueblo es el único que manda. #PorlosCaminosdelSur',
  openGraph: { title: 'Consulta Ciudadana · Guerrero 2026', description: 'Cada firma es un acto de soberanía.', url: 'https://porloscaminosdelsur.org/firmas' },
};
export default function L({ children }: { children: React.ReactNode }) { return <>{children}</>; }