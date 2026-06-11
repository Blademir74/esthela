"use client";
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Star, Download, Share2, RotateCcw, Upload, Check, Trophy, ZoomIn, ZoomOut } from 'lucide-react';

const MUNICIPIOS_GUERRERO = [
 "Acapulco de Juarez", "Acatepec", "Ahuacuotzingo", "Ajuchitlan del Progreso", "Alcozauca de Guerrero",
 "Alpoyeca", "Apaxtla", "Arcelia", "Atenango del Rio", "Atlamajalcingo del Monte",
 "Atlixtac", "Atoyac de Alvarez", "Ayutla de los Libres", "Azoyu", "Benito Juarez", "Buenavista de Cuellar",
 "Coahuayutla de Jose Maria Izazaga", "Cocula", "Copala", "Copalillo", "Copanatoyac",
 "Coyuca de Benitez", "Coyuca de Catalan", "Cuajinicuilapa", "Cualac", "Cuautepec",
 "Cuetzala del Progreso", "Cutzamala de Pinzon", "Chilapa de Alvarez", "Chilpancingo de los Bravo", "Eduardo Neri",
 "Florencio Villarreal", "General Canuto A. Neri", "General Heliodoro Castillo", "Huamuxtitlan",
 "Huitzuco de los Figueroa", "Iguala de la Independencia", "Igualapa",
 "Iliatenco", "Ixcateopan de Cuauhtemoc", "Jose Joaquin de Herrera", "Juan R. Escudero", "Juchitan",
 "La Union de Isidoro Montes de Oca", "Las Vigas", "Leonardo Bravo", "Malinaltepec",
 "Marquelia", "Martir de Cuilapan", "Metlatonoc", "Mochitlan", "Nuu Savi",
 "Olinala", "Ometepec", "Pedro Ascencio Alquisiras", "Petatlan", "Pilcaya",
 "Pungarabato", "Quechultenango", "San Luis Acatlan", "San Marcos",
 "San Miguel Totolapan", "San Nicolas", "Santa Cruz del Rincon", "Taxco de Alarcon",
 "Tecoanapa", "Tecpan de Galeana", "Teloloapan", "Tepecoacuilco de Trujano",
 "Tetipac", "Tixtla de Guerrero", "Tlacoachistlahuaca", "Tlacoapa", "Tlalchapa",
 "Tlalixtaquilla de Maldonado", "Tlapa de Comonfort", "Tlapehuala", "Xalpatlahuac", "Xochihuehuetlan",
 "Xochistlahuaca", "Zapotitlan Tablas", "Zirandaro", "Zitlala", "Zihuatanejo de Azueta"
].sort();

type ModelType = 'mundialista' | 'esthelado' | 'camino';
interface PlayerData {
  nombre: string; apellido: string; municipio: string; fechaNacimiento: string;
  foto: string | null; fotoScale: number; fotoRotate: number;
}

// --- MODELOS DE TARJETA (Lógica idéntica, sintaxis saneada) ---
function CardMundialista({ data }: { data: PlayerData }) {
  const nombre = data.nombre || 'Tu Nombre';
  const apellido = data.apellido ? data.apellido.toUpperCase() : 'APELLIDO';
  const municipio = data.municipio || 'Tu Municipio';
  const año = data.fechaNacimiento ? new Date(data.fechaNacimiento).getFullYear() : '';
  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: '3/4', background: 'linear-gradient(145deg, #6B1D3A 0%, #3D0A1F 55%, #0D0308 100%)', border: '3px solid #D4A843', boxShadow: '0 0 60px rgba(212,168,67,0.2)' }}>
      <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg, #D4A843 0%, #fff9e6 50%, #D4A843 100%)' }} />
      <div className="px-5 pt-3 pb-2 flex items-center justify-between">
        <div><p className="text-[8px] font-black tracking-[0.2em] text-[#D4A843] uppercase">Guerrero</p><p className="text-[9px] font-black tracking-widest text-white/60 uppercase">2026</p></div>
        <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} className="w-2.5 h-2.5 fill-[#D4A843] text-[#D4A843]" />)}</div>
        <div className="text-right"><p className="text-[8px] font-black tracking-widest text-[#D4A843] uppercase">Selección</p><p className="text-[8px] tracking-widest text-white/50 uppercase">de la Esperanza</p></div>
      </div>
      <div className="flex-1 flex items-center justify-center px-6 py-2">
        {data.foto ? (
          <div className="w-28 h-28 rounded-full overflow-hidden" style={{ border: '3px solid #D4A843' }}>
            <img src={data.foto} alt="Titular" className="w-full h-full object-cover" style={{ transform: `scale(${data.fotoScale}) rotate(${data.fotoRotate}deg)`, transformOrigin: 'center' }} />
          </div>
        ) : (
          <div className="w-28 h-28 rounded-full flex items-center justify-center text-4xl font-black" style={{ background: 'rgba(212,168,67,0.12)', border: '3px solid rgba(212,168,67,0.4)', color: '#D4A843' }}>
            {nombre[0]?.toUpperCase() || '?'}
          </div>
        )}
      </div>
      <div className="px-4 py-4 text-center" style={{ background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.7))', borderTop: '1px solid rgba(212,168,67,0.25)' }}>
        <p className="text-[10px] tracking-[0.25em] text-[#D4A843]/70 uppercase mb-0.5 font-semibold">Capitán de la Esperanza</p>
        <p className="font-black text-white text-xl leading-tight">{nombre}</p>
        <p className="font-black text-[#D4A843] text-2xl leading-tight tracking-widest">{apellido}</p>
        {año && <p className="text-white/40 text-[10px] mt-1 uppercase tracking-wider">Desde {año}</p>}
        <div className="mt-2 mx-auto px-4 py-1 rounded-full inline-block" style={{ background: 'rgba(212,168,67,0.18)', border: '1px solid rgba(212,168,67,0.35)' }}>
          <p className="text-[10px] text-[#D4A843] font-bold tracking-wider">{municipio}</p>
        </div>
      </div>
      <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #D4A843 0%, #BC955C 50%, #D4A843 100%)' }} />
    </div>
  );
}

function CardEsthelado({ data }: { data: PlayerData }) {
  const nombre = data.nombre || 'Tu Nombre';
  const apellido = data.apellido || '';
  const municipio = data.municipio || 'Tu Municipio';
  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: '3/4', background: '#ffffff', border: '3px solid #6B1D3A' }}>
      <div className="h-2/5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #6B1D3A 0%, #9B2B55 60%, #6B1D3A 100%)' }}>
        <div className="absolute top-4 right-6 w-16 h-16 rounded-full opacity-20" style={{ background: '#D4A843' }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10">
          {data.foto ? (
            <div className="w-24 h-24 rounded-full overflow-hidden" style={{ border: '4px solid #D4A843' }}>
              <img src={data.foto} alt="Titular" className="w-full h-full object-cover" style={{ transform: `scale(${data.fotoScale}) rotate(${data.fotoRotate}deg)`, transformOrigin: 'center' }} />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black" style={{ background: '#D4A843', border: '4px solid #D4A843', color: '#6B1D3A' }}>
              {nombre[0]?.toUpperCase() || '?'}
            </div>
          )}
        </div>
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full" style={{ background: '#D4A843' }}>
          <p className="text-[9px] font-black text-[#6B1D3A] tracking-widest uppercase">Titular Oficial</p>
        </div>
      </div>
      <div className="h-3/5 flex flex-col items-center justify-center px-5 pt-14 pb-5">
        <p className="text-[10px] font-black tracking-[0.3em] text-[#6B1D3A]/50 uppercase mb-1">Yo estoy de</p>
        <p className="font-black text-5xl leading-none mb-1" style={{ color: '#6B1D3A', textShadow: '2px 2px 0px rgba(212,168,67,0.3)' }}>Esthelado</p>
        <div className="w-16 h-0.5 mx-auto my-3" style={{ background: '#D4A843' }} />
        <p className="font-black text-[#6B1D3A] text-xl leading-tight text-center">{nombre} {apellido && <span className="text-[#9B2B55]">{apellido}</span>}</p>
        <div className="mt-3 px-4 py-1.5 rounded-full" style={{ background: '#6B1D3A' }}>
          <p className="text-[10px] text-[#D4A843] font-bold tracking-wider uppercase">{municipio}</p>
        </div>
      </div>
    </div>
  );
}

function CardCamino({ data }: { data: PlayerData }) {
  const nombre = data.nombre || 'Tu Nombre';
  const municipio = data.municipio || 'Tu Municipio';
  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: '3/4', background: 'linear-gradient(160deg, #F9F4EF 0%, #EDE0D4 60%, #E0CEBC 100%)', border: '2px solid #8B5E3C' }}>
      <div className="relative z-10 px-5 pt-5">
        <p className="text-[11px] font-black tracking-[0.2em] uppercase text-center" style={{ color: '#8B5E3C', fontFamily: 'Georgia, serif' }}>Guerrero · 40 años</p>
        <div className="w-full h-px mt-2" style={{ background: 'linear-gradient(90deg, transparent, #8B5E3C, transparent)' }} />
      </div>
      <div className="relative z-10 flex justify-center mt-5">
        {data.foto ? (
          <div className="w-28 h-28 overflow-hidden" style={{ borderRadius: '40% 60% 60% 40% / 55% 45% 55% 45%', border: '3px solid #8B5E3C' }}>
            <img src={data.foto} alt="Titular" className="w-full h-full object-cover" style={{ transform: `scale(${data.fotoScale}) rotate(${data.fotoRotate}deg)`, transformOrigin: 'center' }} />
          </div>
        ) : (
          <div className="w-28 h-28 flex items-center justify-center text-4xl font-black" style={{ borderRadius: '40% 60% 60% 40% / 55% 45% 55% 45%', background: 'rgba(107,29,58,0.15)', border: '3px solid #8B5E3C', color: '#8B5E3C' }}>
            {nombre[0]?.toUpperCase() || '?'}
          </div>
        )}
      </div>
      <div className="relative z-10 flex-1 flex flex-col items-center px-5 pt-5 pb-6">
        <p className="text-[10px] tracking-[0.25em] uppercase text-center mb-1 font-semibold" style={{ color: '#8B5E3C', fontFamily: 'Georgia, serif' }}>Yo camino con</p>
        <p className="font-black text-4xl leading-none text-center" style={{ color: '#6B1D3A', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>Esthela</p>
        <p className="font-black text-[#6B1D3A] text-xl leading-tight text-center">{nombre}</p>
        <p className="text-[11px] text-center mt-1 font-semibold" style={{ color: '#8B5E3C' }}>{municipio}</p>
        <div className="mt-auto pt-4">
          <div className="px-5 py-2 rounded-full border-2 text-center" style={{ borderColor: '#8B5E3C', borderStyle: 'dashed' }}>
            <p className="text-[9px] font-black tracking-[0.25em] uppercase" style={{ color: '#8B5E3C' }}>Forjada en el territorio</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- PÁGINA PRINCIPAL DE TARJETAS ---
export default function TarjetasPage() {
  const [step, setStep] = useState<'form' | 'card'>('form');
  const [selectedModel, setSelectedModel] = useState<ModelType>('mundialista');
  const [downloaded, setDownloaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [playerData, setPlayerData] = useState<PlayerData>({
    nombre: '', apellido: '', municipio: '', fechaNacimiento: '', foto: null, fotoScale: 1, fotoRotate: 0
  });

  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPlayerData(prev => ({ ...prev, foto: ev.target?.result as string, fotoScale: 1, fotoRotate: 0 }));
    reader.readAsDataURL(file);
  }, []);

  const updateData = (field: keyof PlayerData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPlayerData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleGoToCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerData.nombre) { alert('Ingresa al menos tu nombre.'); return; }
    setStep('card');
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, { scale: 3, useCORS: true, backgroundColor: null, logging: false });
      const link = document.createElement('a');
      link.download = `Titular_${playerData.nombre || 'Esthela'}_${selectedModel}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch {
      alert('Para descargar, haz una captura de pantalla de tu tarjeta.');
    }
  };

  const handleShareWhatsApp = () => {
    const text = `¡Ya soy Titular de la Red de Esthela Damián!\n${playerData.nombre} ${playerData.apellido} — Capitán de la Esperanza en ${playerData.municipio || 'Guerrero'}.\nÚnete: https://guerreroescone.vercel.app`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const inputClass = "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-[#D4A843] transition-all text-sm";
  const labelClass = "block text-xs font-semibold text-[#D4A843]/80 mb-1.5 tracking-wider uppercase";
  const models = [
    { id: 'mundialista' as ModelType, emoji: '🏆', title: 'Estampa Mundialista con la E', desc: 'Holográfico · Institucional' },
    { id: 'esthelado' as ModelType, emoji: '⚡', title: 'Yo Camino con la Ola de la E', desc: 'Viral · Redes sociales' },
    { id: 'camino' as ModelType, emoji: '🌿', title: 'Yo Camino con Esthela', desc: 'Acuarela · Territorial' },
  ];

  return (
    <main className="overflow-x-hidden bg-[#14050B] w-full min-h-screen text-white">
      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 py-10 md:py-16">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 md:mb-14">
          <a href="/" className="inline-flex items-center gap-2 text-[#D4A843]/60 text-xs mb-6 hover:text-[#D4A843] transition-colors">
            <ChevronRight className="w-3 h-3 rotate-180" /> Volver al inicio
          </a>
          <div className="flex items-center justify-center gap-3 mb-5">
            <Trophy className="w-7 h-7 text-[#D4A843]" />
            <span className="text-[#D4A843] font-black text-lg tracking-widest uppercase">Generador Oficial</span>
            <Trophy className="w-7 h-7 text-[#D4A843]" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-3 tracking-tight">
            Tu Tarjeta de <span className="text-[#D4A843]">Titular</span>
          </h1>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 'form' && (
            <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid lg:grid-cols-2 gap-8 items-start">
              <div className="rounded-3xl bg-white/[0.025] border border-white/10 p-6 md:p-8">
                <h2 className="text-white font-black text-xl mb-1">Datos del Jugador</h2>
                <form onSubmit={handleGoToCard} className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className={labelClass}>Nombre(s) *</label><input type="text" required value={playerData.nombre} onChange={updateData('nombre')} className={inputClass} placeholder="María" /></div>
                    <div><label className={labelClass}>Apellido *</label><input type="text" required value={playerData.apellido} onChange={updateData('apellido')} className={inputClass} placeholder="García" /></div>
                  </div>
                  <div><label className={labelClass}>Municipio / Equipo *</label>
                    <select required value={playerData.municipio} onChange={updateData('municipio')} className={`${inputClass} appearance-none cursor-pointer`}>
                      <option value="" disabled className="bg-[#1A0510]">Selecciona tu municipio...</option>
                      {MUNICIPIOS_GUERRERO.map(m => <option key={m} value={m} className="bg-[#1A0510] text-white">{m}</option>)}
                    </select>
                  </div>
                  <div><label className={labelClass}>Tu Foto</label>
                    <label className="w-full flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-white/20 hover:border-[#D4A843]/40 cursor-pointer transition-colors group" htmlFor="foto-upload">
                      {playerData.foto ? <><img src={playerData.foto} alt="Preview" className="w-12 h-12 rounded-full object-cover border border-[#D4A843]/40" /><p className="text-[#D4A843] font-semibold text-sm">Foto cargada</p></> : <><Upload className="w-8 h-8 text-white/30 group-hover:text-[#D4A843]" /><p className="text-white/50 text-sm">Sube tu foto</p></>}
                      <input id="foto-upload" type="file" accept="image/*" capture="user" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                  </div>
                  {playerData.foto && (
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                      <p className="text-[#D4A843]/70 text-xs font-semibold tracking-wider uppercase mb-2">Ajustar foto</p>
                      <div className="flex items-center gap-3">
                        <ZoomOut className="w-4 h-4 text-white/40 flex-shrink-0" />
                        <input type="range" min="0.5" max="2" step="0.1" value={playerData.fotoScale} onChange={(e) => setPlayerData(prev => ({ ...prev, fotoScale: parseFloat(e.target.value) }))} className="flex-1 accent-[#D4A843]" />
                        <ZoomIn className="w-4 h-4 text-white/40 flex-shrink-0" />
                      </div>
                    </div>
                  )}
                  <button type="submit" className="w-full py-4 rounded-full font-black text-base shimmer-btn flex items-center justify-center gap-2 transition-all hover:scale-[1.02]">
                    <Star className="w-5 h-5 text-[#D4A843]" /> Ver mi Tarjeta Oficial
                  </button>
                </form>
              </div>
              <div className="space-y-4">
                <h3 className="text-white font-black text-lg mb-5">Elige tu Modelo</h3>
                {models.map((model) => (
                  <button key={model.id} onClick={() => setSelectedModel(model.id)} className="w-full p-5 rounded-2xl border-2 transition-all flex items-center gap-4 text-left" style={{ borderColor: selectedModel === model.id ? '#D4A843' : 'rgba(255,255,255,0.08)', background: selectedModel === model.id ? 'rgba(212,168,67,0.08)' : 'rgba(255,255,255,0.02)' }}>
                    <span className="text-3xl">{model.emoji}</span>
                    <div className="flex-1 min-w-0"><p className="text-white font-bold text-base">{model.title}</p><p className="text-white/40 text-xs mt-0.5">{model.desc}</p></div>
                    {selectedModel === model.id && <div className="w-6 h-6 rounded-full bg-[#D4A843] flex items-center justify-center"><Check className="w-4 h-4 text-[#14050B]" /></div>}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
          {step === 'card' && (
            <motion.div key="card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <p className="text-[#D4A843] text-sm font-semibold uppercase tracking-widest mb-2">{models.find(m => m.id === selectedModel)?.emoji} Tu tarjeta oficial está lista</p>
                <h2 className="text-white font-black text-2xl">{playerData.nombre} {playerData.apellido}</h2>
              </div>
              <div ref={cardRef} className="mx-auto max-w-[280px]">
                {selectedModel === 'mundialista' && <CardMundialista data={playerData} />}
                {selectedModel === 'esthelado' && <CardEsthelado data={playerData} />}
                {selectedModel === 'camino' && <CardCamino data={playerData} />}
              </div>
              <div className="mt-8 space-y-3">
                <button onClick={handleDownload} className="w-full py-4 rounded-full font-black flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shimmer-btn">
                  {downloaded ? <Check className="w-5 h-5" /> : <Download className="w-5 h-5" />}
                  {downloaded ? '¡Tarjeta descargada!' : 'Descargar mi Tarjeta'}
                </button>
                <button onClick={handleShareWhatsApp} className="w-full py-4 rounded-full font-bold flex items-center justify-center gap-2 shimmer-btn">
                  <Share2 className="w-5 h-5 text-[#D4A843]" /> Compartir en WhatsApp
                </button>
                <button onClick={() => setStep('form')} className="w-full text-center text-white/30 text-xs py-2 hover:text-white/60 transition-colors">Editar mis datos</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}