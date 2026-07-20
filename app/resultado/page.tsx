'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Confetti from 'react-confetti';
import { calcularPerfilPolitico, type PerfilPolitico, type Respuesta } from '@/lib/algoritmo';

export default function ResultadoPage() {
  const router = useRouter();
  const [perfil, setPerfil] = useState<PerfilPolitico | null>(null);
  const [imagenURL, setImagenURL] = useState<string | null>(null);
  const [mostrarConfetti, setMostrarConfetti] = useState(true);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    // Obtener respuestas del localStorage
    const respuestasGuardadas = localStorage.getItem('respuestas_guerrero');
    
    if (!respuestasGuardadas) {
      router.push('/');
      return;
    }

    try {
      const respuestas: Respuesta[] = JSON.parse(respuestasGuardadas);
      const perfilCalculado = calcularPerfilPolitico(respuestas);
      setPerfil(perfilCalculado);

      // Generar imagen
      generarImagenCompartible(perfilCalculado);
    } catch (error) {
      console.error('Error al procesar resultados:', error);
      router.push('/');
    }

    // Detener confetti después de 5 segundos
    setTimeout(() => setMostrarConfetti(false), 5000);
  }, [router]);

  const generarImagenCompartible = async (perfil: PerfilPolitico) => {
    try {
      const response = await fetch('/api/generar-imagen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ perfil })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setImagenURL(url);
      }
    } catch (error) {
      console.error('Error al generar imagen:', error);
    }
  };

  const compartirWhatsApp = () => {
    const texto = `🗺️ ¡Descubrí mi perfil político!\n\nSoy: ${perfil?.etiqueta}\n\n¿Y tú? Descubre el tuyo en:\n${window.location.origin}\n\n#MiPerfilPolíticoGuerrero`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
  };

  const compartirTwitter = () => {
    const texto = `🗺️ Mi perfil político: ${perfil?.etiqueta}\n\n¿Y tú dónde estás en el mapa de Guerrero?\n\n#MiPerfilPolíticoGuerrero`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(texto)}&url=${window.location.origin}`, '_blank');
  };

  const compartirFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}`, '_blank');
  };

  const descargarImagen = () => {
    if (imagenURL) {
      const link = document.createElement('a');
      link.href = imagenURL;
      link.download = 'mi-perfil-politico-guerrero.png';
      link.click();
    }
  };

  const copiarEnlace = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  if (!perfil) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {mostrarConfetti && (
        <Confetti
          width={typeof window !== 'undefined' ? window.innerWidth : 300}
          height={typeof window !== 'undefined' ? window.innerHeight : 200}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      {/* Mapa de fondo */}
      <div className="absolute inset-0 opacity-5">
        <Image
          src="/assets/guerrero-map.png"
          alt="Mapa"
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-10 min-h-screen py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-2 rounded-full mb-4">
              <span className="text-gray-900 font-bold uppercase text-sm tracking-wider">
                Tu Resultado
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
              ¡Tu Perfil Está Listo!
            </h1>
            <p className="text-white/70 text-xl">
              Descubre qué dice tu mapa político sobre ti
            </p>
          </motion.div>

          {/* Card principal de resultado */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl mb-8"
          >
            {/* Etiqueta de perfil */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className={`inline-block px-8 py-4 rounded-2xl border-4 mb-6`}
                style={{ 
                  backgroundColor: `${perfil.color_principal}20`,
                  borderColor: perfil.color_principal
                }}
              >
                <h2 className="text-4xl md:text-5xl font-black text-white">
                  {perfil.etiqueta}
                </h2>
              </motion.div>

              <p className="text-white/90 text-lg max-w-2xl mx-auto leading-relaxed">
                {perfil.descripcion}
              </p>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center">
                <div className="text-4xl mb-3">📊</div>
                <div className="text-white/60 text-sm mb-1">Tema Prioritario</div>
                <div className="text-white font-bold text-xl">{perfil.tema_principal}</div>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center">
                <div className="text-4xl mb-3">👤</div>
                <div className="text-white/60 text-sm mb-1">Liderazgo Preferido</div>
                <div className="text-white font-bold text-xl">{perfil.liderazgo_preferido}</div>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center">
                <div className="text-4xl mb-3">💡</div>
                <div className="text-white/60 text-sm mb-1">Valor en Gobierno</div>
                <div className="text-white font-bold text-xl">{perfil.valor_gobierno}</div>
              </div>
            </div>

            {/* Dato sorpresa */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-400/30">
              <div className="flex items-start gap-4">
                <div className="text-4xl">💡</div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">Dato Sorprendente:</h3>
                  <p className="text-white/90">{perfil.dato_sorpresa}</p>
                </div>
              </div>
            </div>

            {/* Posición política */}
            <div className="mt-8 text-center">
              <p className="text-white/60 text-sm mb-2">Tu posición en el mapa político:</p>
              <p className="text-white font-mono text-lg">
                Eje Social: {perfil.posicion_x.toFixed(1)} | Eje Autoridad: {perfil.posicion_y.toFixed(1)}
              </p>
              {perfil.municipio !== "No especificado" && perfil.municipio !== "Prefiero no decir" && (
                <p className="text-white/60 text-sm mt-2">
                  📍 {perfil.municipio}
                </p>
              )}
            </div>
          </motion.div>

          {/* Imagen compartible */}
          {imagenURL && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl mb-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                📸 Tu Resultado Compartible
              </h3>
              
              <div className="max-w-md mx-auto mb-6">
                <img 
                  src={imagenURL} 
                  alt="Resultado compartible"
                  className="w-full rounded-xl shadow-2xl border-4 border-white/20"
                />
              </div>

              {/* Botones de compartir */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={descargarImagen}
                  className="bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 border border-white/20"
                >
                  <span>📥</span>
                  <span>Descargar</span>
                </button>

                <button
                  onClick={compartirWhatsApp}
                  className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <span>📱</span>
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={compartirTwitter}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <span>🐦</span>
                  <span>Twitter</span>
                </button>

                <button
                  onClick={compartirFacebook}
                  className="bg-blue-700 hover:bg-blue-800 text-white py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <span>📘</span>
                  <span>Facebook</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* CTA Viral */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-center"
          >
            <h3 className="text-3xl font-black text-white mb-4">
              ¿Desafías a Tus Amigos? 🎯
            </h3>
            <p className="text-white/90 mb-6 text-lg">
              Comparte este enlace y descubre si tienen el mismo perfil que tú
            </p>

            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="flex-1 bg-white/20 rounded-xl p-4 flex items-center justify-between">
                <span className="text-white font-mono text-sm truncate mr-2">
                  {typeof window !== 'undefined' && window.location.origin}
                </span>
                <button
                  onClick={copiarEnlace}
                  className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all whitespace-nowrap"
                >
                  {copiado ? '✓ Copiado' : 'Copiar'}
                </button>
              </div>
            </div>

            <p className="text-white/70 text-sm mt-6">
              #MiPerfilPolíticoGuerrero
            </p>
          </motion.div>

          {/* Botón para reiniciar */}
          <div className="text-center mt-8">
            <button
              onClick={() => {
                localStorage.removeItem('respuestas_guerrero');
                router.push('/');
              }}
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              ← Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
