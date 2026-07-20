'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { preguntas, preguntaBonus, mensajesMotivacionales, type Pregunta } from '@/lib/preguntas';
import { type Respuesta } from '@/lib/algoritmo';
import Image from 'next/image';

export default function EncuestaPage() {
  const router = useRouter();
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState<Respuesta[]>([]);
  const [seleccionMultiple, setSeleccionMultiple] = useState<string[]>([]);
  const [valorEscala, setValorEscala] = useState(5);
  const [mostrarBonus, setMostrarBonus] = useState(false);

  const pregunta = mostrarBonus ? preguntaBonus : preguntas[preguntaActual];
  const progreso = ((preguntaActual + 1) / preguntas.length) * 100;

  const handleRespuestaOpcionMultiple = (opcion: any) => {
    const nuevaRespuesta: Respuesta = {
      pregunta_id: pregunta.id,
      tipo: 'opcion_multiple',
      opcion
    };

    setRespuestas([...respuestas, nuevaRespuesta]);
    siguientePregunta();
  };

  const handleRespuestaEscala = () => {
    const nuevaRespuesta: Respuesta = {
      pregunta_id: pregunta.id,
      tipo: 'escala',
      valor: valorEscala
    };

    setRespuestas([...respuestas, nuevaRespuesta]);
    setValorEscala(5);
    siguientePregunta();
  };

  const toggleOpcionMultiple = (id: string) => {
    if (seleccionMultiple.includes(id)) {
      setSeleccionMultiple(seleccionMultiple.filter(x => x !== id));
    } else {
      if (pregunta.maximo && seleccionMultiple.length >= pregunta.maximo) {
        return;
      }
      setSeleccionMultiple([...seleccionMultiple, id]);
    }
  };

  const handleCasillasMultiples = () => {
    if (!pregunta.minimo || seleccionMultiple.length >= pregunta.minimo) {
      const seleccionados = pregunta.opciones!.filter(op => 
        seleccionMultiple.includes(op.id)
      );

      const nuevaRespuesta: Respuesta = {
        pregunta_id: pregunta.id,
        tipo: 'casillas_multiples',
        seleccionados: seleccionados.map(s => ({
          id: s.id,
          texto: s.texto,
          tema: s.tema,
          boost_y: s.boost_y
        }))
      };

      setRespuestas([...respuestas, nuevaRespuesta]);
      setSeleccionMultiple([]);
      siguientePregunta();
    }
  };

  const siguientePregunta = () => {
    if (preguntaActual < preguntas.length - 1) {
      setPreguntaActual(preguntaActual + 1);
    } else if (!mostrarBonus) {
      setMostrarBonus(true);
    } else {
      // Finalizar y procesar
      procesarResultados();
    }
  };

  const procesarResultados = () => {
    // Guardar respuestas en localStorage
    localStorage.setItem('respuestas_guerrero', JSON.stringify(respuestas));
    // Redirigir a página de procesamiento
    router.push('/procesando');
  };

  const getMensajeMotivacional = () => {
    const index = Math.min(
      Math.floor(progreso / 20),
      mensajesMotivacionales.length - 1
    );
    return mensajesMotivacionales[index];
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      {/* Mapa de fondo desvanecido */}
      <div className="absolute inset-0 opacity-5">
        <Image
          src="/assets/guerrero-map.png"
          alt="Mapa"
          fill
          className="object-cover"
        />
      </div>

      {/* Barra de progreso */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-sm font-semibold">
              Pregunta {preguntaActual + 1} de {preguntas.length}
            </span>
            <span className="text-white/80 text-sm">
              {getMensajeMotivacional()}
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${progreso}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Preguntas */}
      <div className="pt-24 pb-12 px-4 min-h-screen flex items-center">
        <div className="max-w-3xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={pregunta.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              {/* Pregunta */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight">
                  {pregunta.pregunta}
                </h2>

                {/* Opciones múltiples */}
                {pregunta.tipo === 'opcion_multiple' && (
                  <div className="space-y-4">
                    {pregunta.opciones!.map((opcion, index) => (
                      <motion.button
                        key={opcion.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleRespuestaOpcionMultiple(opcion)}
                        className="w-full text-left p-5 rounded-xl bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-yellow-400 transition-all duration-200 group"
                      >
                        <span className="text-white text-lg group-hover:text-yellow-300 transition-colors">
                          {opcion.texto}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Escala */}
                {pregunta.tipo === 'escala' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <span className="text-white/70 text-sm">
                        {pregunta.labels![pregunta.rango![0]]}
                      </span>
                      <span className="text-white/70 text-sm">
                        {pregunta.labels![pregunta.rango![1]]}
                      </span>
                    </div>

                    <div className="relative py-4">
                      <input
                        type="range"
                        min={pregunta.rango![0]}
                        max={pregunta.rango![1]}
                        value={valorEscala}
                        onChange={(e) => setValorEscala(Number(e.target.value))}
                        className="w-full h-3 bg-white/20 rounded-full appearance-none cursor-pointer slider"
                      />
                      <div className="text-center mt-4">
                        <div className="inline-block bg-yellow-400 text-gray-900 px-6 py-2 rounded-full font-bold text-2xl">
                          {valorEscala}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleRespuestaEscala}
                      className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-yellow-500/50 transition-all"
                    >
                      Continuar →
                    </button>
                  </div>
                )}

                {/* Casillas múltiples */}
                {pregunta.tipo === 'casillas_multiples' && (
                  <div className="space-y-6">
                    <p className="text-white/80 text-sm mb-4">
                      Selecciona entre {pregunta.minimo} y {pregunta.maximo} opciones
                    </p>
                    <div className="space-y-3">
                      {pregunta.opciones!.map((opcion, index) => (
                        <motion.div
                          key={opcion.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <label className="flex items-center p-4 rounded-xl bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-yellow-400 cursor-pointer transition-all">
                            <input
                              type="checkbox"
                              checked={seleccionMultiple.includes(opcion.id)}
                              onChange={() => toggleOpcionMultiple(opcion.id)}
                              className="w-6 h-6 rounded border-2 border-white/50 mr-4"
                            />
                            <span className="text-white text-lg">
                              {opcion.texto}
                            </span>
                          </label>
                        </motion.div>
                      ))}
                    </div>

                    <button
                      onClick={handleCasillasMultiples}
                      disabled={!pregunta.minimo || seleccionMultiple.length < pregunta.minimo}
                      className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                        seleccionMultiple.length >= (pregunta.minimo || 0)
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:shadow-lg hover:shadow-yellow-500/50'
                          : 'bg-white/10 text-white/50 cursor-not-allowed'
                      }`}
                    >
                      Continuar ({seleccionMultiple.length} seleccionadas) →
                    </button>
                  </div>
                )}

                {/* Desplegable (Municipio) */}
                {pregunta.tipo === 'desplegable' && (
                  <div className="space-y-6">
                    <select
                      onChange={(e) => {
                        const opcionSeleccionada = pregunta.opciones!.find(
                          op => op.id === e.target.value
                        );
                        if (opcionSeleccionada) {
                          handleRespuestaOpcionMultiple(opcionSeleccionada);
                        }
                      }}
                      className="w-full p-4 rounded-xl bg-white/10 text-white border-2 border-white/30 focus:border-yellow-400 outline-none text-lg"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Selecciona una opción...
                      </option>
                      {pregunta.opciones!.map(opcion => (
                        <option key={opcion.id} value={opcion.id} className="text-gray-900">
                          {opcion.texto}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #FBBF24;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(251, 191, 36, 0.5);
        }

        .slider::-moz-range-thumb {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #FBBF24;
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 12px rgba(251, 191, 36, 0.5);
        }
      `}</style>
    </div>
  );
}
