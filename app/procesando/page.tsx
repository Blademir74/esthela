'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

const mensajesCarga = [
  "Analizando tus respuestas... 🔍",
  "Calculando tu perfil político... 📊",
  "Comparando con otros guerrerenses... 🗺️",
  "Preparando tu mapa político... 🎨",
  "Generando tu resultado único... ✨",
  "¡Casi listo! Últimos detalles... 🎯"
];

export default function ProcesandoPage() {
  const router = useRouter();
  const [mensajeActual, setMensajeActual] = useState(0);
  const [progreso, setProgreso] = useState(0);

  useEffect(() => {
    // Verificar que hay respuestas
    const respuestasGuardadas = localStorage.getItem('respuestas_guerrero');
    if (!respuestasGuardadas) {
      router.push('/');
      return;
    }

    // Simular procesamiento con mensajes rotativos
    const intervaloMensaje = setInterval(() => {
      setMensajeActual(prev => (prev + 1) % mensajesCarga.length);
    }, 1500);

    // Incrementar progreso
    const intervaloProgreso = setInterval(() => {
      setProgreso(prev => {
        if (prev >= 100) {
          clearInterval(intervaloProgreso);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    // Redirigir a resultados después de 6 segundos
    const timeout = setTimeout(() => {
      router.push('/resultado');
    }, 6000);

    return () => {
      clearInterval(intervaloMensaje);
      clearInterval(intervaloProgreso);
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center px-4">
      {/* Mapa de fondo animado */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Image
          src="/assets/guerrero-map.png"
          alt="Mapa"
          fill
          className="object-cover"
        />
      </motion.div>

      {/* Círculos animados de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: 200 + i * 100,
              height: 200 + i * 100,
              left: '50%',
              top: '50%',
              marginLeft: -(100 + i * 50),
              marginTop: -(100 + i * 50)
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      {/* Contenido */}
      <div className="relative z-10 max-w-2xl w-full">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 backdrop-blur-2xl rounded-3xl p-12 border border-white/20 shadow-2xl text-center"
        >
          {/* Icono animado */}
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity }
            }}
            className="text-8xl mb-8"
          >
            🗺️
          </motion.div>

          {/* Título */}
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
            Generando Tu Perfil
          </h1>

          {/* Mensaje rotativo */}
          <motion.p
            key={mensajeActual}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xl text-white/90 mb-8"
          >
            {mensajesCarga[mensajeActual]}
          </motion.p>

          {/* Barra de progreso */}
          <div className="w-full bg-white/20 rounded-full h-4 mb-4 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${progreso}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <p className="text-white/70 text-lg font-semibold">
            {progreso}%
          </p>

          {/* Datos curiosos */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-8 bg-white/5 rounded-xl p-6 border border-white/10"
          >
            <p className="text-white/60 text-sm mb-2">💡 Sabías que...</p>
            <p className="text-white text-base">
              Guerrero tiene 81 municipios con culturas y tradiciones únicas.
              Tu perfil político refleja la diversidad de nuestro estado.
            </p>
          </motion.div>
        </motion.div>

        {/* Indicador adicional */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8"
        >
          <p className="text-white/70 text-sm">
            No cierres esta ventana. Estamos preparando algo especial para ti...
          </p>
        </motion.div>
      </div>
    </div>
  );
}
