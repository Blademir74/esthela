// Este archivo ISOLA la ruta /registro y le dice a Next.js:
// "No intentes prerenderizar nada bajo esta rama. Renderiza bajo demanda."
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function RegistroLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}