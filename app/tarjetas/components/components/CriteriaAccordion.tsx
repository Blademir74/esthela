"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, CheckCircle2, ChevronDown, UserCheck, Scale, Award } from "lucide-react";

interface Criterion {
  id: string;
  title: string;
  proof: string;
  icon: typeof Shield;
}

const BASE_CRITERIA: Criterion[] = [
  { id: "soberania", title: "Defensa de la Soberanía Nacional", proof: "40 años de trabajo territorial sin subordinación a intereses externos. Compromiso explícito con la autodeterminación y la 4T.", icon: Shield },
  { id: "cercania", title: "Cercanía con el Pueblo", proof: "Presencia verificable en asambleas, plazas y colonias. Recorridos casa por casa documentados en 72 municipios.", icon: UserCheck },
  { id: "honestidad", title: "Honestidad y Trayectoria Inobjetable", proof: "Sin antecedentes penales ni sanciones. Formación ética en INFP. Rechazo explícito al influyentismo y amiguismo.", icon: Scale },
  { id: "disponibilidad", title: "Disponibilidad Total", proof: "Separación de cargos públicos vigente. Dedicación exclusiva a la organización territorial y movilización popular.", icon: Award },
];

export default function CriteriaAccordion({ criteria = BASE_CRITERIA }: { criteria?: Criterion[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      {criteria.map((c) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden hover:border-[#D4A843]/30 transition-colors"
        >
          <button
            onClick={() => setOpenId(openId === c.id ? null : c.id)}
            className="w-full flex items-center justify-between p-4 md:p-5 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#6B1D3A]/30 flex items-center justify-center">
                <c.icon className="w-5 h-5 text-[#D4A843]" />
              </div>
              <span className="text-sm md:text-base font-bold text-white">{c.title}</span>
            </div>
            <motion.div
              animate={{ rotate: openId === c.id ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5 text-white/40" />
            </motion.div>
          </button>

          <AnimatePresence>
            {openId === c.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="px-4 md:px-5 pb-4 md:pb-5 pt-0">
                  <div className="flex gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-[#D4A843] mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-white/70 leading-relaxed">{c.proof}</p>
                  </div>
                  <div className="pl-6 text-xs text-[#D4A843]/60 uppercase tracking-wider font-medium">
                    Alineado a Base III · Convocatoria CEDTSN 2026
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}