"use client";
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Star, Download, Share2, Upload, Check, Trophy, Camera, Image } from 'lucide-react';

const MUNICIPIOS_GUERRERO = ["Acapulco de Juarez", "Chilpancingo de los Bravo", "Iguala de la Independencia", "Taxco de Alarcon", "Zihuatanejo de Azueta", "Tlapa de Comonfort", "Chilapa de Alvarez", "Atoyac de Alvarez", "Copala", "Coyuca de Benitez"].sort();

type ModelType = 'camino' | 'mundialista' | 'ola';
interface PlayerData {
  nombre: string; apellido: string; municipio: string;
  foto: string | null; fotoScale: number; fotoRotate: number;
}

// --- MODELO 1: Yo camino con Esthela (Territorial / Acuarela) ---
function CardCamino({ data }: { data: PlayerData }) {
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: 'linear-gradient(145deg, #F9F4EF 0%, #EDE0D4 50%, #E0CEBC 100%)' }}>
      <svg className="absolute inset-0 w-full h-full opacity-[0.12]" viewBox="0 0 360 360" preserveAspectRatio="xMidYMid slice">
        <path d="M0,200 Q90,150 180,200 T360,200 L360,360 L0,360 Z" fill="#6B1D3A" />
        <path d="M0,250 Q90,220 180,250 T360,250 L360,360 L0,360 Z" fill="#8B5E3C" opacity="0.6" />
      </svg>
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <p className="font-montserrat text-[11px] tracking-[0.2em] uppercase text-[#8B5E3C] mb-3">Guerrero · 40 años</p>
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#8B5E3C] mb-4" style={{ boxShadow: '4px 4px 0px rgba(107,29,58,0.2)' }}>
          {data.foto ? <img src={data.foto} className="w-full h-full object-cover" style={{ transform: `scale(${data.fotoScale}) rotate(${data.fotoRotate}deg)` }} alt="Titular" /> 
          : <div className="w-full h-full flex items-center justify-center text-5xl font-black bg-[#8B5E3C]/20 text-[#8B5E3C]">{data.nombre[0]?.toUpperCase() || '?'}</div>}
        </div>
        <p className="font-montserrat text-[10px] tracking-[0.25em] uppercase text-[#8B5E3C]/80 mb-1">Yo camino con</p>
        <p className="font-black text-4xl leading-none text-[#6B1D3A] italic">Esthela</p>
        <div className="w-20 h-0.5 my-4 bg-gradient-to-r from-transparent via-[#D4A843] to-transparent" />
        <p className="font-black text-[#6B1D3A] text-2xl leading-tight">{data.nombre || 'Tu Nombre'} {data.apellido || ''}</p>
        <p className="font-montserrat font-bold text-[#8B5E3C] text-lg mt-1">{data.municipio || 'Tu Municipio'}</p>
      </div>
    </div>
  );
}

// --- MODELO 2: Estampa Mundialista (Cromo / Guinda / E Dorada) ---
function CardMundialista({ data }: { data: PlayerData }) {
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: 'linear-gradient(145deg, #6B1D3A 0%, #3D0A1F 60%, #1A0510 100%)', border: '3px solid #D4A843' }}>
      <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 8px)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[180px] font-black text-[#D4A843]/10 font-montserrat select-none">E</div>
      
      <div className="relative z-10 flex flex-col h-full px-6 py-5">
        <div className="flex justify-between items-start">
          <div className="text-[#D4A843] font-montserrat text-[9px] font-bold tracking-widest uppercase">Guerrero<br/>2026</div>
          <div className="flex gap-1">{[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-[#D4A843] text-[#D4A843]" />)}</div>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-[#D4A843]" style={{ boxShadow: '0 0 30px rgba(212,168,67,0.4)' }}>
            {data.foto ? <img src={data.foto} className="w-full h-full object-cover" style={{ transform: `scale(${data.fotoScale}) rotate(${data.fotoRotate}deg)` }} alt="Titular" /> 
            : <div className="w-full h-full flex items-center justify-center text-5xl font-black bg-[#D4A843]/20 text-[#D4A843]">{data.nombre[0]?.toUpperCase() || '?'}</div>}
          </div>
        </div>

        <div className="text-center mt-2" style={{ borderTop: '1px solid rgba(212,168,67,0.3)' }}>
          <p className="text-[10px] tracking-[0.25em] text-[#D4A843]/80 uppercase mb-1 font-bold">Capitán de la Esperanza</p>
          <p className="font-black text-white text-2xl leading-tight">{data.nombre || 'Tu Nombre'}</p>
          {data.apellido && <p className="font-black text-[#D4A843] text-3xl leading-tight tracking-widest">{data.apellido.toUpperCase()}</p>}
          <div className="mt-2 mx-auto px-4 py-1.5 rounded-full bg-[#D4A843]/20 border border-[#D4A843]/40">
            <p className="text-[10px] text-[#D4A843] font-montserrat font-bold tracking-wider">{data.municipio || 'Tu Municipio'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- MODELO 3: Yo camino con la Ola de la E (Movimiento / Vibrante) ---
function CardOla({ data }: { data: PlayerData }) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-white">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #6B1D3A 0%, #9B2B55 50%, #D4A843 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-white rounded-t-[40px]" />
      
      <div className="relative z-10 flex flex-col h-full px-6 py-5">
        <div className="flex justify-between items-center mb-2">
          <span className="px-3 py-1 rounded-full bg-[#D4A843] text-[#6B1D3A] font-montserrat text-[9px] font-black tracking-widest uppercase">Titular Oficial</span>
          <div className="flex gap-1">{[1,2,3,4,5].map(i => <Star key={i} className="w-2.5 h-2.5 fill-[#6B1D3A] text-[#6B1D3A]" />)}</div>
        </div>

        <div className="flex-1 flex items-center justify-center relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white" style={{ boxShadow: '0 8px 25px rgba(0,0,0,0.25)' }}>
            {data.foto ? <img src={data.foto} className="w-full h-full object-cover" style={{ transform: `scale(${data.fotoScale}) rotate(${data.fotoRotate}deg)` }} alt="Titular" /> 
            : <div className="w-full h-full flex items-center justify-center text-5xl font-black bg-[#D4A843] text-[#6B1D3A]">{data.nombre[0]?.toUpperCase() || '?'}</div>}
          </div>
        </div>

        <div className="text-center mt-2">
          <p className="text-[10px] font-black tracking-[0.2em] text-[#6B1D3A]/50 uppercase mb-1">Yo camino con la Ola</p>
          <p className="font-black text-4xl leading-none text-[#6B1D3A]" style={{ textShadow: '2px 2px 0px rgba(212,168,67,0.3)' }}>de la E</p>
          <div className="w-16 h-0.5 mx-auto my-3 bg-[#D4A843]" />
          <p className="font-black text-[#6B1D3A] text-2xl leading-tight">{data.nombre || 'Tu Nombre'} {data.apellido || ''}</p>
          <div className="mt-2 px-4 py-1.5 rounded-full bg-[#6B1D3A] inline-block">
            <p className="text-[10px] text-[#D4A843] font-montserrat font-bold tracking-wider uppercase">{data.municipio || 'Tu Municipio'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- PÁGINA PRINCIPAL ---
export default function TarjetasPage() {
  const [step, setStep] = useState<'form' | 'card'>('form');
  const [selectedModel, setSelectedModel] = useState<ModelType>('mundialista');
  const [downloaded, setDownloaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [playerData, setPlayerData] = useState<PlayerData>({
    nombre: '', apellido: '', municipio: '', foto: null, fotoScale: 1, fotoRotate: 0
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
      // 360px preview * scale 3 = 1080x1080px export
      const canvas = await html2canvas(cardRef.current, { scale: 3, useCORS: true, backgroundColor: null, logging: false });
      const link = document.createElement('a');
      link.download = `Titular_${playerData.nombre || 'Esthela'}_${selectedModel}_1080x1080.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch {
      alert('Para descargar, haz una captura de pantalla de tu tarjeta.');
    }
  };

  const handleShareWhatsApp = () => {
    const text = `¡Ya soy Titular de la Red de Esthela Damián!\n${playerData.nombre} ${playerData.apellido} — Capitán en ${playerData.municipio || 'Guerrero'}.\nÚnete: https://guerreroescone.vercel.app`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const inputClass = "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-[#D4A843] transition-all text-sm";
  const labelClass = "block text-xs font-montserrat font-semibold text-[#D4A843]/80 mb-1.5 tracking-wider uppercase";
  const models = [
    { id: 'mundialista' as ModelType, emoji: '🏆', title: 'Estampa Mundialista', desc: 'Cromo Guinda · E Dorada' },
    { id: 'ola' as ModelType, emoji: '⚡', title: 'Ola de la E', desc: 'Movimiento · Vibrante' },
    { id: 'camino' as ModelType, emoji: '🌿', title: 'Yo camino con Esthela', desc: 'Territorial · Acuarela' },
  ];

  return (
    <main className="overflow-x-hidden bg-[#14050B] w-full min-h-screen pb-20">
      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 py-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <a href="/" className="inline-flex items-center gap-2 text-[#D4A843]/60 text-xs mb-6 hover:text-[#D4A843] transition-colors">
            <ChevronRight className="w-3 h-3 rotate-180" /> Volver al inicio
          </a>
          <div className="flex items-center justify-center gap-3 mb-5">
            <Trophy className="w-7 h-7 text-[#D4A843]" />
            <span className="text-[#D4A843] font-montserrat font-black text-lg tracking-widest uppercase">Generador Oficial</span>
            <Trophy className="w-7 h-7 text-[#D4A843]" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-3 tracking-tight">Tu Tarjeta de <span className="text-[#D4A843]">Titular</span></h1>
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
                  <div><label className={labelClass}>Tu Foto (Cámara o Galería)</label>
                    <label className="w-full flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-white/20 hover:border-[#D4A843]/40 cursor-pointer transition-colors group" htmlFor="foto-upload">
                      {playerData.foto ? <><img src={playerData.foto} alt="Preview" className="w-12 h-12 rounded-full object-cover border border-[#D4A843]/40" /><p className="text-[#D4A843] font-semibold text-sm">Foto cargada</p></> 
                      : <><Camera className="w-8 h-8 text-white/30 group-hover:text-[#D4A843]" /><p className="text-white/50 text-sm">Toma o sube una foto</p></>}
                      <input id="foto-upload" type="file" accept="image/*" capture="user" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                  </div>
                  <button type="submit" className="w-full py-4 rounded-full font-black text-base bg-[#D4A843] text-[#14050B] flex items-center justify-center gap-2 transition-all hover:scale-[1.02]">
                    <Star className="w-5 h-5" /> Ver mi Tarjeta Oficial
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
                <div className="mt-6 p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col items-center">
                  <p className="text-white/40 text-xs text-center mb-4 uppercase tracking-widest">Vista previa</p>
                  <div className="w-[200px] h-[200px]">
                    {selectedModel === 'mundialista' && <CardMundialista data={playerData} />}
                    {selectedModel === 'ola' && <CardOla data={playerData} />}
                    {selectedModel === 'camino' && <CardCamino data={playerData} />}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {step === 'card' && (
            <motion.div key="card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <p className="text-[#D4A843] text-sm font-semibold uppercase tracking-widest mb-2">{models.find(m => m.id === selectedModel)?.emoji} Tu tarjeta está lista</p>
                <h2 className="text-white font-black text-2xl">{playerData.nombre} {playerData.apellido}</h2>
              </div>
              {/* Contenedor 360px que escala a 1080x1080 al exportar */}
              <div ref={cardRef} className="mx-auto w-[360px] h-[360px]">
                {selectedModel === 'mundialista' && <CardMundialista data={playerData} />}
                {selectedModel === 'ola' && <CardOla data={playerData} />}
                {selectedModel === 'camino' && <CardCamino data={playerData} />}
              </div>
              <div className="mt-6 flex gap-2 justify-center">
                {models.map(m => (
                  <button key={m.id} onClick={() => setSelectedModel(m.id)} className="px-3 py-2 rounded-xl text-sm font-semibold transition-all" style={{ background: selectedModel === m.id ? 'rgba(212,168,67,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${selectedModel === m.id ? '#D4A843' : 'rgba(255,255,255,0.1)'}`, color: selectedModel === m.id ? '#D4A843' : 'rgba(255,255,255,0.4)' }}>
                    {m.emoji}
                  </button>
                ))}
              </div>
              <div className="mt-8 space-y-3">
                <button onClick={handleDownload} className="w-full py-4 rounded-full font-black flex items-center justify-center gap-2 transition-all hover:scale-[1.02] bg-[#D4A843] text-[#14050B]">
                  {downloaded ? <Check className="w-5 h-5" /> : <Download className="w-5 h-5" />}
                  {downloaded ? '¡Tarjeta descargada!' : 'Descargar 1080x1080'}
                </button>
                <button onClick={handleShareWhatsApp} className="w-full py-4 rounded-full font-bold flex items-center justify-center gap-2 bg-[#6B1D3A] border border-[#D4A843]/40 text-white transition-all hover:scale-[1.02]">
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