"use client";
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Star, Download, Share2, Camera, Check } from 'lucide-react';
import { CardMundialista, CardEsthelado, CardCamino } from '@/components/CardModels'; // Asegúrate de mover los componentes de tarjeta a un archivo separado o mantenerlos aquí si prefieres

const MUNICIPIOS_GUERRERO = ["Acapulco de Juarez", "Chilpancingo de los Bravo", "Iguala de la Independencia", "Taxco de Alarcon", "Zihuatanejo de Azueta", "Tlapa de Comonfort", "Chilapa de Alvarez", "Atoyac de Alvarez", "Copala", "Coyuca de Benitez"].sort();

type ModelType = 'mundialista' | 'esthelado' | 'camino';
interface PlayerData {
  nombre: string; apellido: string; municipio: string;
  foto: string | null; fotoScale: number; fotoRotate: number;
}

export default function TarjetasPage() {
  const [step, setStep] = useState<'form' | 'card'>('form');
  const [selectedModel, setSelectedModel] = useState<ModelType>('mundialista');
  const [downloaded, setDownloaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [playerData, setPlayerData] = useState<PlayerData>({
    nombre: '', apellido: '', municipio: '', foto: null, fotoScale: 1, fotoRotate: 0
  });

  // CORRECCIÓN CRÍTICA PARA MÓVIL: Habilita cámara frontal + galería nativa
  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Por favor selecciona una imagen válida.'); return; }
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPlayerData(prev => ({ 
        ...prev, 
        foto: ev.target?.result as string, 
        fotoScale: 1, 
        fotoRotate: 0 
      }));
    };
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
      // Escala 3 sobre 360px = 1080x1080px exactos para Facebook/WhatsApp
      const canvas = await html2canvas(cardRef.current, { scale: 3, useCORS: true, backgroundColor: null, logging: false });
      const link = document.createElement('a');
      link.download = `Titular_${playerData.nombre || 'Esthela'}_${selectedModel}_1080x1080.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch {
      alert('Tu navegador bloqueó la descarga automática. Por favor, haz una captura de pantalla de la tarjeta.');
    }
  };

  const handleShareWhatsApp = () => {
    const text = `¡Ya soy Titular de la Red de Esthela Damián!\n${playerData.nombre} ${playerData.apellido} — Capitán en ${playerData.municipio || 'Guerrero'}.\nÚnete: https://guerreroescone.vercel.app`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const inputClass = "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-[#D4A843] transition-all text-sm";
  const labelClass = "block text-xs font-semibold text-[#D4A843]/80 mb-1.5 tracking-wider uppercase";
  const models = [
    { id: 'mundialista' as ModelType, emoji: '🏆', title: 'Estampa Mundialista', desc: 'Holográfico · Institucional' },
    { id: 'esthelado' as ModelType, emoji: '⚡', title: 'Ola de la E', desc: 'Viral · Redes sociales' },
    { id: 'camino' as ModelType, emoji: '🌿', title: 'Yo Camino con Esthela', desc: 'Territorial · Acuarela' },
  ];

  return (
    <main className="overflow-x-hidden bg-[#14050B] w-full min-h-screen pb-20">
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 text-[#D4A843]/60 text-xs mb-4 hover:text-[#D4A843] transition-colors">
            <ChevronRight className="w-3 h-3 rotate-180" /> Volver al inicio
          </a>
          <h1 className="text-2xl md:text-4xl font-black text-white leading-tight mb-2 tracking-tight">Tu Tarjeta de <span className="text-[#D4A843]">Titular</span></h1>
          <p className="text-white/50 text-sm">Crea, descarga y comparte en Facebook o WhatsApp</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 'form' && (
            <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="grid md:grid-cols-2 gap-8 items-start">
              <div className="rounded-3xl bg-white/[0.025] border border-white/10 p-6">
                <h2 className="text-white font-black text-lg mb-4">Datos del Jugador</h2>
                <form onSubmit={handleGoToCard} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className={labelClass}>Nombre *</label><input type="text" required value={playerData.nombre} onChange={updateData('nombre')} className={inputClass} placeholder="María" /></div>
                    <div><label className={labelClass}>Apellido *</label><input type="text" required value={playerData.apellido} onChange={updateData('apellido')} className={inputClass} placeholder="García" /></div>
                  </div>
                  <div><label className={labelClass}>Municipio *</label>
                    <select required value={playerData.municipio} onChange={updateData('municipio')} className={`${inputClass} appearance-none cursor-pointer`}>
                      <option value="" disabled>Selecciona...</option>
                      {MUNICIPIOS_GUERRERO.map(m => <option key={m} value={m} className="bg-[#1A0510] text-white">{m}</option>)}
                    </select>
                  </div>

                  {/* CORRECCIÓN: Input móvil compatible con cámara y galería */}
                  <div>
                    <label className={labelClass}>Tu Foto (Cámara o Galería)</label>
                    <label 
                      htmlFor="mobile-camera-input"
                      className="w-full flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 active:bg-white/15 cursor-pointer transition-all min-h-[140px]"
                    >
                      {playerData.foto ? (
                        <>
                          <img src={playerData.foto} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-[#D4A843]" />
                          <p className="text-[#D4A843] font-semibold text-sm">Foto lista • Toca para cambiar</p>
                        </>
                      ) : (
                        <>
                          <Camera className="w-10 h-10 text-[#D4A843]" />
                          <p className="text-white font-semibold text-base">Toma o sube una foto</p>
                          <p className="text-white/50 text-xs text-center px-4">Se usará en tu tarjeta oficial 1080x1080</p>
                        </>
                      )}
                      {/* capture="user" activa cámara frontal, accept="image/*" permite galería */}
                      <input id="mobile-camera-input" type="file" accept="image/*" capture="user" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                  </div>

                  <button type="submit" className="w-full py-4 rounded-full font-black text-base bg-[#D4A843] text-[#14050B] flex items-center justify-center gap-2 transition-all hover:scale-[1.02]">
                    <Star className="w-5 h-5" /> Ver mi Tarjeta Oficial
                  </button>
                </form>
              </div>

              <div className="space-y-4">
                <h3 className="text-white font-black text-lg mb-3">Elige tu Modelo</h3>
                {models.map((model) => (
                  <button key={model.id} onClick={() => setSelectedModel(model.id)} className="w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 text-left" style={{ borderColor: selectedModel === model.id ? '#D4A843' : 'rgba(255,255,255,0.08)', background: selectedModel === model.id ? 'rgba(212,168,67,0.08)' : 'rgba(255,255,255,0.02)' }}>
                    <span className="text-2xl">{model.emoji}</span>
                    <div className="flex-1 min-w-0"><p className="text-white font-bold text-sm">{model.title}</p><p className="text-white/40 text-xs">{model.desc}</p></div>
                    {selectedModel === model.id && <div className="w-5 h-5 rounded-full bg-[#D4A843] flex items-center justify-center"><Check className="w-3 h-3 text-[#14050B]" /></div>}
                  </button>
                ))}
                <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col items-center">
                  <p className="text-white/40 text-xs mb-3 uppercase tracking-widest">Vista previa</p>
                  <div className="w-[180px] h-[180px]">
                    {selectedModel === 'mundialista' && <CardMundialista data={playerData} />}
                    {selectedModel === 'esthelado' && <CardEsthelado data={playerData} />}
                    {selectedModel === 'camino' && <CardCamino data={playerData} />}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'card' && (
            <motion.div key="card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto">
              <div className="text-center mb-6">
                <p className="text-[#D4A843] text-sm font-semibold uppercase tracking-widest mb-1">{models.find(m => m.id === selectedModel)?.emoji} Tarjeta lista</p>
                <h2 className="text-white font-black text-xl">{playerData.nombre} {playerData.apellido}</h2>
              </div>

              {/* Contenedor exacto 360x360 que escala a 1080x1080 al exportar */}
              <div ref={cardRef} className="mx-auto w-[360px] h-[360px]">
                {selectedModel === 'mundialista' && <CardMundialista data={playerData} />}
                {selectedModel === 'esthelado' && <CardEsthelado data={playerData} />}
                {selectedModel === 'camino' && <CardCamino data={playerData} />}
              </div>

              <div className="mt-4 flex gap-2 justify-center">
                {models.map(m => (
                  <button key={m.id} onClick={() => setSelectedModel(m.id)} className="px-3 py-2 rounded-lg text-sm font-semibold transition-all" style={{ background: selectedModel === m.id ? 'rgba(212,168,67,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${selectedModel === m.id ? '#D4A843' : 'rgba(255,255,255,0.1)'}`, color: selectedModel === m.id ? '#D4A843' : 'rgba(255,255,255,0.4)' }}>
                    {m.emoji}
                  </button>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                <button onClick={handleDownload} className="w-full py-4 rounded-full font-black flex items-center justify-center gap-2 transition-all hover:scale-[1.02] bg-[#D4A843] text-[#14050B]">
                  {downloaded ? <Check className="w-5 h-5" /> : <Download className="w-5 h-5" />}
                  {downloaded ? '¡Descargada!' : 'Descargar 1080x1080'}
                </button>
                <button onClick={handleShareWhatsApp} className="w-full py-4 rounded-full font-bold flex items-center justify-center gap-2 bg-[#6B1D3A] border border-[#D4A843]/40 text-white transition-all hover:scale-[1.02]">
                  <Share2 className="w-5 h-5 text-[#D4A843]" /> Compartir en WhatsApp
                </button>
                <button onClick={() => setStep('form')} className="w-full text-center text-white/30 text-xs py-2 hover:text-white/60 transition-colors">Editar datos</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}