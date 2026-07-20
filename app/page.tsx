'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

type Ruta = {
  titulo: string;
  subtitulo: string;
  texto: string;
  imagen: string;
  marco: string;
  posicion: string;
};

type Municipio = {
  nombre: string;
  region: string;
  top: string;
  left: string;
  acento: string;
};

const rutas: Ruta[] = [
  {
    titulo: 'Soberanía y conectividad',
    subtitulo: 'Mover el territorio, unir comunidades',
    texto:
      'La ruta que conecta sierra, costa y ciudad con sentido público: caminos, señal, transporte y presencia institucional donde hoy hace falta Estado.',
    imagen: '/assets/soberania.jpg',
    marco: 'lg:col-span-7 lg:row-span-2 min-h-[32rem]',
    posicion: 'bg-[position:center_35%]',
  },
  {
    titulo: 'Campo y economía comunitaria',
    subtitulo: 'Producir con dignidad',
    texto:
      'Del maíz al mezcal, de la parcela al mercado local: fortalecer lo que ya sostiene la vida comunitaria y el arraigo.',
    imagen: '/assets/campo.png',
    marco: 'lg:col-span-5 min-h-[20rem]',
    posicion: 'bg-[position:center_45%]',
  },
  {
    titulo: 'Mujeres e igualdad sustantiva',
    subtitulo: 'Comunidad con justicia',
    texto:
      'La organización cotidiana de las mujeres no es adorno del territorio: es estructura, defensa y horizonte compartido.',
    imagen: '/assets/mujeres.jfif',
    marco: 'lg:col-span-5 min-h-[22rem]',
    posicion: 'bg-center',
  },
  {
    titulo: 'Educación y juventudes',
    subtitulo: 'Abrir camino hacia adelante',
    texto:
      'Escuchar a las juventudes, acompañar trayectorias y vincular estudio, cultura y futuro con pertenencia territorial.',
    imagen: '/assets/juventud.jpg',
    marco: 'lg:col-span-4 min-h-[18rem]',
    posicion: 'bg-center',
  },
  {
    titulo: 'Agua y salud comunitaria',
    subtitulo: 'Lo común también se cuida',
    texto:
      'Donde el agua, la salud y el cuidado llegan con justicia, la comunidad gana tiempo, dignidad y confianza.',
    imagen: '/assets/agua.jpg',
    marco: 'lg:col-span-8 min-h-[18rem]',
    posicion: 'bg-[position:center_60%]',
  },
];

const municipios: Municipio[] = [
  { nombre: 'Acapulco de Juárez', region: 'Acapulco', top: '64%', left: '32%', acento: 'bg-[#c5963b]' },
  { nombre: 'Chilpancingo de los Bravo', region: 'Centro', top: '49%', left: '45%', acento: 'bg-[#335a66]' },
  { nombre: 'Iguala de la Independencia', region: 'Norte', top: '24%', left: '44%', acento: 'bg-[#4f7a43]' },
  { nombre: 'Zihuatanejo de Azueta', region: 'Costa Grande', top: '55%', left: '12%', acento: 'bg-[#7d5d1f]' },
  { nombre: 'Chilapa de Álvarez', region: 'Centro', top: '43%', left: '57%', acento: 'bg-[#335a66]' },
  { nombre: 'Taxco de Alarcón', region: 'Norte', top: '18%', left: '56%', acento: 'bg-[#4f7a43]' },
  { nombre: 'Tlapa de Comonfort', region: 'La Montaña', top: '42%', left: '74%', acento: 'bg-[#8b2742]' },
  { nombre: 'Coyuca de Benítez', region: 'Costa Grande', top: '62%', left: '23%', acento: 'bg-[#7d5d1f]' },
  { nombre: 'Ayutla de los Libres', region: 'Costa Chica', top: '60%', left: '56%', acento: 'bg-[#c5963b]' },
  { nombre: 'Ometepec', region: 'Costa Chica', top: '65%', left: '80%', acento: 'bg-[#c5963b]' },
  { nombre: 'Técpan de Galeana', region: 'Costa Grande', top: '57%', left: '6%', acento: 'bg-[#7d5d1f]' },
  { nombre: 'Atoyac de Álvarez', region: 'Costa Grande', top: '55%', left: '20%', acento: 'bg-[#7d5d1f]' },
  { nombre: 'Teloloapan', region: 'Norte', top: '26%', left: '30%', acento: 'bg-[#4f7a43]' },
  { nombre: 'Eduardo Neri', region: 'Centro', top: '35%', left: '47%', acento: 'bg-[#335a66]' },
  { nombre: 'San Marcos', region: 'Costa Chica', top: '58%', left: '47%', acento: 'bg-[#c5963b]' },
  { nombre: 'San Luis Acatlán', region: 'Costa Chica', top: '62%', left: '70%', acento: 'bg-[#c5963b]' },
  { nombre: 'Tecoanapa', region: 'Costa Chica', top: '55%', left: '60%', acento: 'bg-[#c5963b]' },
  { nombre: 'Petatlán', region: 'Costa Grande', top: '60%', left: '9%', acento: 'bg-[#7d5d1f]' },
  { nombre: 'Tixtla', region: 'Centro', top: '41%', left: '50%', acento: 'bg-[#335a66]' },
  { nombre: 'Acatepec', region: 'La Montaña', top: '52%', left: '70%', acento: 'bg-[#8b2742]' },
];

const agenda = [
  {
    etiqueta: 'Diálogos comunitarios',
    titulo: 'Mesas de escucha en barrios, colonias y comunidades',
    texto:
      'Espacios sobrios para escuchar necesidades, ordenar prioridades y traducir la conversación territorial en agenda pública.',
  },
  {
    etiqueta: 'Recorridos territoriales',
    titulo: 'Caminar el sur como método político',
    texto:
      'La presencia no se anuncia con grandilocuencia: se construye visitando, observando, registrando y volviendo.',
  },
  {
    etiqueta: 'Encuentros temáticos',
    titulo: 'Rutas con causa y conversación especializada',
    texto:
      'Campo, agua, juventudes, mujeres y conectividad como ejes de intercambio con actores locales y saberes comunitarios.',
  },
  {
    etiqueta: 'Formación política',
    titulo: 'Organización y memoria de la Transformación',
    texto:
      'Una agenda que fortalece convicción, lectura territorial y sentido histórico sin caer en propaganda vacía.',
  },
];

const frasesPoster = [
  'Mi comunidad tiene voz.',
  'Organizarnos es defender lo nuestro.',
  'Guerrero se construye desde el territorio.',
  'El futuro se conversa y se organiza.',
];

function SelloMarca() {
  return (
    <div className="inline-flex items-center gap-4 rounded-full border border-[#d6c7aa]/25 bg-[#120d0d]/55 px-4 py-3 backdrop-blur-md">
      <Image
        src="/assets/logo-caminos.png"
        alt="Logo Por los Caminos del Sur"
        width={54}
        height={54}
        className="h-12 w-12 rounded-full object-cover"
        priority
      />
      <div>
        <p className="text-[10px] uppercase tracking-[0.34em] text-[#d8c8aa]">Por los Caminos del Sur</p>
        <p className="text-sm text-[#f4ead7]">Guerrero · Territorio, voz y organización</p>
      </div>
    </div>
  );
}

function RutaCard({ ruta }: { ruta: Ruta }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className={`group relative overflow-hidden rounded-[2rem] border border-[#d7c8aa]/12 ${ruta.marco}`}
    >
      <div
        className={`absolute inset-0 bg-cover bg-no-repeat transition duration-700 group-hover:scale-105 ${ruta.posicion}`}
        style={{ backgroundImage: `url(${ruta.imagen})` }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,10,10,0.1),rgba(12,10,10,0.88)_68%,rgba(12,10,10,0.95))]" />
      <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_top_left,rgba(197,150,59,0.28),transparent_35%)]" />
      <div className="relative z-10 flex h-full flex-col justify-end p-7 md:p-8">
        <p className="mb-3 text-[11px] uppercase tracking-[0.34em] text-[#d8c8aa]">Ruta temática</p>
        <h3 className="max-w-[18ch] font-[family-name:var(--font-editorial)] text-3xl leading-[1.02] text-[#fff8ed] md:text-4xl">
          {ruta.titulo}
        </h3>
        <p className="mt-3 text-sm uppercase tracking-[0.24em] text-[#c5963b]">{ruta.subtitulo}</p>
        <p className="mt-4 max-w-[44ch] text-[15px] leading-7 text-[#efe3cf]/88">{ruta.texto}</p>
      </div>
    </motion.article>
  );
}

export default function Home() {
  return (
    <main className="bg-[#0d0908] text-[#f3e8d5]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#110d0c]/72 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <SelloMarca />
          <nav className="hidden items-center gap-6 text-[11px] uppercase tracking-[0.28em] text-[#e6d7bd]/82 md:flex">
            <a href="#manifiesto" className="hover:text-white">Manifiesto</a>
            <a href="#rutas" className="hover:text-white">Rutas</a>
            <a href="#voces" className="hover:text-white">Voces</a>
            <a href="#galeria" className="hover:text-white">Galería</a>
            <a href="#agenda" className="hover:text-white">Agenda</a>
            <a href="#poster" className="hover:text-white">Póster</a>
          </nav>
        </div>
      </header>

      <section className="relative isolate min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="/assets/foto28.jpg"
          >
            <source src="/assets/video1.mp4" type="video/mp4" />
          </video>
          <div
            className="absolute inset-0 bg-cover bg-center opacity-100"
            style={{ backgroundImage: "url('/assets/foto28.jpg')" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,5,5,0.88)_0%,rgba(24,10,15,0.78)_36%,rgba(13,9,8,0.7)_60%,rgba(13,9,8,0.94)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_28%,rgba(197,150,59,0.25),transparent_28%),radial-gradient(circle_at_74%_18%,rgba(51,90,102,0.24),transparent_22%),linear-gradient(180deg,transparent_0%,rgba(13,9,8,0.45)_55%,rgba(13,9,8,1)_100%)]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-5 pb-16 pt-32 md:px-8 md:pb-24 lg:justify-center">
          <div className="grid items-end gap-14 lg:grid-cols-[1.1fr_0.68fr]">
            <div>
              <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-[#d7c8aa]/18 bg-black/25 px-4 py-2 text-[10px] uppercase tracking-[0.34em] text-[#d8c8aa] backdrop-blur-md">
                <span>Guerrero · escucha · organización</span>
                <span className="h-1 w-1 rounded-full bg-[#c5963b]" />
                <span>#PorlosCaminosdelSur</span>
              </div>

              <div className="mb-7 block lg:hidden">
                <SelloMarca />
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85 }}
                className="max-w-[11ch] font-[family-name:var(--font-editorial)] text-[3.25rem] leading-[0.94] text-[#fff8ed] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[7rem]"
              >
                Guerrero se organiza.
                <br />
                Su futuro se defiende.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.15 }}
                className="mt-6 max-w-2xl text-lg leading-8 text-[#efe3cf]/82 md:text-xl"
              >
                Una experiencia territorial pensada como marca viva: comunidades, voces y rutas de causa que hacen visible la fuerza serena del sur.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.25 }}
                className="mt-9 flex flex-col gap-4 sm:flex-row"
              >
                <a href="#voces" className="btn-principal">
                  Conoce las voces del Sur
                </a>
                <a href="#poster" className="btn-secundario">
                  Crea tu póster
                </a>
              </motion.div>
            </div>

            <motion.aside
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35 }}
              className="hidden rounded-[2rem] border border-[#d7c8aa]/15 bg-[linear-gradient(180deg,rgba(24,14,15,0.76),rgba(9,8,8,0.84))] p-8 backdrop-blur-xl lg:block"
            >
              <div className="mb-8 flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.34em] text-[#d8c8aa]">Sello editorial</p>
                <span className="rounded-full border border-[#c5963b]/30 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[#c5963b]">
                  Presencia territorial
                </span>
              </div>
              <div className="mb-8 rounded-[1.7rem] border border-white/8 bg-black/20 p-4">
                <Image
                  src="/assets/logo-caminos.png"
                  alt="Logo Por los Caminos del Sur"
                  width={540}
                  height={540}
                  className="mx-auto h-auto w-full max-w-[16rem] rounded-full"
                />
              </div>
              <div className="space-y-4 text-[#efe3cf]/82">
                <p className="text-[11px] uppercase tracking-[0.32em] text-[#d8c8aa]">Lenguaje visual</p>
                <p className="text-lg leading-8">
                  Un sistema de marca que mezcla insignia, cartel político contemporáneo y revista de territorio.
                </p>
                <div className="editorial-rule" />
                <p className="text-sm leading-7 text-[#efe3cf]/72">
                  El logo funciona como sello rector en header, hero, póster y cierre. No cierra la página: la organiza.
                </p>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      <section id="manifiesto" className="section-shell pt-14 md:pt-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            className="relative overflow-hidden rounded-[2rem] border border-[#d7c8aa]/14"
          >
            <div
              className="aspect-[4/5] bg-cover bg-center"
              style={{ backgroundImage: "url('/assets/foto2.jfif')" }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(11,8,8,0.12)_50%,rgba(11,8,8,0.75)_100%)]" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[#d8c8aa]">Apertura de movimiento</p>
            </div>
          </motion.div>

          <div>
            <p className="eyebrow">Manifiesto</p>
            <h2 className="section-title max-w-[11ch]">
              Caminar el territorio no es pose. Es método.
            </h2>
            <div className="editorial-rule my-8" />
            <div className="space-y-6 text-lg leading-8 text-[#efe3cf]/82">
              <p>
                Por los Caminos del Sur nace como una conversación organizada con Guerrero: escuchar antes de enunciar, recorrer antes de concluir, convocar antes de imponer.
              </p>
              <p>
                La narrativa no gira en torno a una biografía. Gira en torno a comunidades que sostienen al estado, a la soberanía que se defiende desde abajo y a la organización territorial como forma concreta de futuro.
              </p>
              <p>
                La página debe sentirse así: no como volante digital, sino como un movimiento de presencia, memoria y dirección compartida.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="rutas" className="section-shell">
        <div className="mb-10 max-w-3xl">
          <p className="eyebrow">Rutas del Sur</p>
          <h2 className="section-title">Cinco causas, cinco atmósferas, un mismo territorio.</h2>
          <p className="mt-5 text-lg leading-8 text-[#efe3cf]/78">
            Aquí la landing deja de parecer una cuadrícula y se comporta como un mapa editorial: cada bloque tiene peso propio, ritmo desigual y vocación de recorrido.
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-12 auto-rows-[minmax(18rem,auto)]">
          {rutas.map((ruta) => (
            <RutaCard key={ruta.titulo} ruta={ruta} />
          ))}
        </div>
      </section>

      <section id="voces" className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="eyebrow">Mapa de voces</p>
            <h2 className="section-title max-w-[10ch]">Cobertura viva, lista para crecer.</h2>
            <p className="mt-6 text-lg leading-8 text-[#efe3cf]/78">
              El módulo se presenta como cartografía activa: no enumera municipios, los hace latir. La sensación es de presencia en expansión, conversación en curso y horizonte compartido.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {['Acapulco', 'Costa Chica', 'Costa Grande', 'Centro', 'La Montaña', 'Norte', 'Tierra Caliente', 'Sierra'].map((region) => (
                <div key={region} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-[#efe3cf]/78">
                  <span className="block text-[10px] uppercase tracking-[0.3em] text-[#d8c8aa]">Región</span>
                  <span className="mt-2 block text-base text-[#fff7ea]">{region}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-[#d7c8aa]/12 bg-[linear-gradient(180deg,#17110f,#0e0a09)] p-5 md:p-7">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(51,90,102,0.22),transparent_25%),radial-gradient(circle_at_80%_70%,rgba(197,150,59,0.18),transparent_25%)]" />
            <div className="relative rounded-[1.7rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-4 md:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.32em] text-[#d8c8aa]">Territorio activo</p>
                  <h3 className="mt-2 font-[family-name:var(--font-editorial)] text-3xl text-[#fff8ed]">20 municipios prioritarios</h3>
                </div>
                <span className="rounded-full border border-[#c5963b]/25 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-[#c5963b]">
                  Fase editorial
                </span>
              </div>

              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-white/8 bg-[linear-gradient(135deg,#13232c,#17110f_34%,#2d1219_100%)] md:aspect-[1.05/1]">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url(/assets/guerrero-map.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,rgba(5,4,4,0.4)_100%)]" />
                {municipios.map((municipio) => (
                  <div
                    key={municipio.nombre}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ top: municipio.top, left: municipio.left }}
                  >
                    <div className={`mx-auto h-2.5 w-2.5 rounded-full shadow-[0_0_16px_rgba(255,220,160,0.45)] ${municipio.acento}`} />
                    <div className="mt-2 whitespace-nowrap rounded-full border border-white/10 bg-[#120f0e]/85 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-[#f4ead7] backdrop-blur-md md:text-[11px]">
                      {municipio.nombre}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="galeria" className="section-shell">
        <div className="mb-10 max-w-3xl">
          <p className="eyebrow">Galería territorial</p>
          <h2 className="section-title">La fotografía no ilustra: argumenta.</h2>
          <p className="mt-5 text-lg leading-8 text-[#efe3cf]/78">
            La composición se inspira en revista política de alto nivel: alternancia de escalas, silencios amplios y bloques que cuentan comunidad, no relleno.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-12">
          <article className="story-card md:col-span-7">
            <div className="story-media aspect-[16/10]" style={{ backgroundImage: "url('/assets/foto3.jfif')" }} />
            <div className="story-copy">
              <p className="story-kicker">Territorio</p>
              <h3>Pacífico, sierra y vida cotidiana como un solo relato.</h3>
            </div>
          </article>

          <article className="story-card md:col-span-5 md:mt-16">
            <div className="story-media aspect-[4/5]" style={{ backgroundImage: "url('/assets/foto15.jfif')" }} />
            <div className="story-copy">
              <p className="story-kicker">Retrato editorial</p>
              <h3>Esthela desde la escucha, no desde el estrado.</h3>
            </div>
          </article>

          <article className="story-card md:col-span-4">
            <div className="story-media aspect-[4/5]" style={{ backgroundImage: "url('/assets/foto4.jfif')" }} />
            <div className="story-copy small">
              <p className="story-kicker">Ruta</p>
              <h3>Caminos que conectan presencia con soberanía.</h3>
            </div>
          </article>

          <article className="story-card md:col-span-4 md:-mt-12">
            <div className="story-media aspect-[4/5]" style={{ backgroundImage: "url('/assets/foto6.jfif')" }} />
            <div className="story-copy small">
              <p className="story-kicker">Comunidad</p>
              <h3>La fuerza colectiva también tiene rostro compartido.</h3>
            </div>
          </article>

          <article className="story-card md:col-span-4">
            <div className="story-media aspect-[4/5]" style={{ backgroundImage: "url('/assets/foto8.jfif')" }} />
            <div className="story-copy small">
              <p className="story-kicker">Cuidado</p>
              <h3>El agua y la salud como asuntos de dignidad común.</h3>
            </div>
          </article>
        </div>
      </section>

      <section id="agenda" className="section-shell">
        <div className="mb-10 max-w-3xl">
          <p className="eyebrow">Agenda territorial</p>
          <h2 className="section-title">Movimiento continuo, tono austero, presencia real.</h2>
          <p className="mt-5 text-lg leading-8 text-[#efe3cf]/78">
            En lugar de parecer un volante de eventos, la sección comunica método: escucha, recorrido, encuentro y formación como secuencia permanente.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-4">
          {agenda.map((item, index) => (
            <motion.article
              key={item.titulo}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="rounded-[1.8rem] border border-[#d7c8aa]/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6"
            >
              <span className="inline-flex rounded-full border border-[#c5963b]/24 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-[#c5963b]">
                {item.etiqueta}
              </span>
              <h3 className="mt-5 font-[family-name:var(--font-editorial)] text-3xl leading-tight text-[#fff8ed]">
                {item.titulo}
              </h3>
              <p className="mt-4 text-[15px] leading-7 text-[#efe3cf]/78">{item.texto}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="poster" className="section-shell pb-20 md:pb-28">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="eyebrow">Póster editorial compartible</p>
            <h2 className="section-title max-w-[10ch]">Una firma social para circular con fuerza y elegancia.</h2>
            <p className="mt-6 text-lg leading-8 text-[#efe3cf]/78">
              El sistema traduce persona, municipio y causa en una pieza de identidad: vertical, austera, emocional y reconocible al instante en WhatsApp, Stories y estados.
            </p>
            <div className="mt-8 space-y-4 rounded-[1.7rem] border border-[#d7c8aa]/12 bg-white/[0.03] p-6">
              <h3 className="font-[family-name:var(--font-editorial)] text-3xl text-[#fff8ed]">Constantes del sistema</h3>
              <ul className="space-y-3 text-[15px] leading-7 text-[#efe3cf]/78">
                <li>• Logo arriba como sello rector, no como remate.</li>
                <li>• Nombre, municipio y frase convertidos en eje compositivo.</li>
                <li>• Firma gráfica constante con marco editorial y hashtag visible.</li>
                <li>• Adaptación nativa a 4:5 y 9:16 sin perder jerarquía.</li>
              </ul>
              <div className="editorial-rule" />
              <div className="flex flex-wrap gap-2">
                {frasesPoster.map((frase) => (
                  <span key={frase} className="rounded-full border border-white/10 px-3 py-2 text-xs text-[#f3e8d5]/76">
                    {frase}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <article className="poster-card aspect-[4/5]">
              <div className="poster-media" style={{ backgroundImage: "url('/assets/foto17.jfif')" }} />
              <div className="poster-overlay" />
              <div className="poster-content">
                <div className="poster-brand">
                  <Image src="/assets/logo-caminos.png" alt="Logo Por los Caminos del Sur" width={58} height={58} className="h-11 w-11 rounded-full" />
                  <div>
                    <p>Por los Caminos del Sur</p>
                    <span>#PorlosCaminosdelSur</span>
                  </div>
                </div>
                <div>
                  <p className="poster-municipio">Tlapa de Comonfort</p>
                  <h3 className="poster-nombre">María del Sur</h3>
                  <p className="poster-frase">Organizarnos es defender lo nuestro.</p>
                </div>
              </div>
            </article>

            <article className="poster-card aspect-[9/16] md:mt-12">
              <div className="poster-media" style={{ backgroundImage: "url('/assets/foto28.jpg')" }} />
              <div className="poster-overlay alt" />
              <div className="poster-content">
                <div className="poster-brand">
                  <Image src="/assets/logo-caminos.png" alt="Logo Por los Caminos del Sur" width={58} height={58} className="h-11 w-11 rounded-full" />
                  <div>
                    <p>Por los Caminos del Sur</p>
                    <span>#PorlosCaminosdelSur</span>
                  </div>
                </div>
                <div>
                  <p className="poster-municipio">Acapulco de Juárez</p>
                  <h3 className="poster-nombre">Voz del territorio</h3>
                  <p className="poster-frase">Mi comunidad tiene voz.</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#0a0706]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-[1.05fr_0.95fr] md:px-8">
          <div>
            <SelloMarca />
            <p className="mt-5 max-w-xl text-[15px] leading-7 text-[#efe3cf]/72">
              Una identidad política contemporánea, territorial y memorable: sobria en el tono, poderosa en la imagen y coherente en cada derivado.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="eyebrow mb-3">Cierre de marca</p>
              <p className="text-[15px] leading-7 text-[#efe3cf]/72">
                Logo visible en header, hero, póster y footer para consolidar reconocimiento inmediato.
              </p>
            </div>
            <div>
              <p className="eyebrow mb-3">Canales oficiales</p>
              <p className="text-[15px] leading-7 text-[#efe3cf]/72">
                Integrar aquí correo y redes oficiales en la publicación final para evitar enlaces inventados o inconsistentes.
              </p>
              <p className="mt-4 text-sm uppercase tracking-[0.26em] text-[#c5963b]">#PorlosCaminosdelSur</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
