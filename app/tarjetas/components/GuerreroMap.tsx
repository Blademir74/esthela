"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, Users, Shield, ChevronRight } from "lucide-react";

export interface RegionNode {
  id: string;
  name: string;
  x: number; y: number; // % del viewBox
  voceros: number;
  comites: number;
  link: string;
}

const REGION_NODES: RegionNode[] = [
  { id: "costa-grande", name: "Costa Grande", x: 25, y: 28, voceros: 420, comites: 185, link: "/registro?zona=Costa Grande" },
  { id: "costa-chica", name: "Costa Chica", x: 15, y: 52, voceros: 310, comites: 142, link: "/registro?zona=Costa Chica" },
  { id: "montana", name: "La Montaña", x: 45, y: 35, voceros: 580, comites: 210, link: "/registro?zona=La Montaña" },
  { id: "tierra-caliente", name: "Tierra Caliente", x: 62, y: 55, voceros: 490, comites: 178, link: "/registro?zona=Tierra Caliente" },
  { id: "centro", name: "Centro Guerrero", x: 55, y: 25, voceros: 720, comites: 265, link: "/registro?zona=Centro" },
  { id: "sierra", name: "La Sierra", x: 75, y: 42, voceros: 380, comites: 156, link: "/registro?zona=La Sierra" },
];

export default function GuerreroMap({
  nodes = REGION_NODES,
  onRegionSelect,
}: {
  nodes?: RegionNode[];
  onRegionSelect?: (node: RegionNode) => void;
}) {
  const [active, setActive] = useState<RegionNode | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  return (
    <div className="relative w-full aspect-[16/9] md:aspect-[2/1] rounded-3xl overflow-hidden bg-[#0B0508] border border-white/10 shadow-2xl">
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Silueta base de Guerrero (simplificada para demo, reemplazar con SVG oficial) */}
        <path
          d="M20,20 Q35,15 50,25 Q65,18 80,30 Q90,45 85,60 Q75,85 55,80 Q35,88 20,70 Q10,55 15,35 Z"
          fill="rgba(255,255,255,0.03)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="0.5"
        />

        {/* Líneas de conexión animadas */}
        {nodes.map((node, i) => (
          <motion.line
            key={`line-${node.id}`}
            x1="50" y1="50" x2={node.x} y2={node.y}
            stroke="#D4A843"
            strokeWidth="0.4"
            strokeDasharray="2 1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: active?.id === node.id ? 1 : 0.3 }}
            transition={{ duration: 0.8, delay: i * 0.15 }}
          />
        ))}

        {/* Nodos interactivos */}
        {nodes.map((node, i) => (
          <g key={node.id} onMouseEnter={() => setActive(node)} onClick={() => onRegionSelect?.(node)}>
            <motion.circle
              cx={node.x} cy={node.y} r={active?.id === node.id ? 3.5 : 2.5}
              fill={active?.id === node.id ? "#D4A843" : "#6B1D3A"}
              stroke="#D4A843"
              strokeWidth="0.6"
              animate={{
                scale: active?.id === node.id ? 1.4 : 1,
                filter: active?.id === node.id ? "drop-shadow(0 0 8px rgba(212,168,67,0.6))" : "none",
              }}
              transition={{ duration: 0.3 }}
            />
            <text
              x={node.x} y={node.y - 4}
              textAnchor="middle"
              fill="white"
              fontSize="2.5"
              fontWeight="700"
              className="pointer-events-none"
            >
              {node.name}
            </text>
          </g>
        ))}
      </svg>

      {/* Panel informativo contextual */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: active ? 1 : 0, y: active ? 0 : 10 }}
        className="absolute bottom-4 left-4 right-4 md:left-8 md:right-auto md:w-80 bg-[#0B050B]/90 backdrop-blur-md border border-[#D4A843]/30 rounded-xl p-4 shadow-xl"
      >
        {active ? (
          <div>
            <h3 className="text-lg font-black text-white mb-1">{active.name}</h3>
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="flex items-center gap-1.5 text-white/70"><Users className="w-3.5 h-3.5 text-[#D4A843]" /> {active.voceros} voceros</div>
              <div className="flex items-center gap-1.5 text-white/70"><Shield className="w-3.5 h-3.5 text-[#D4A843]" /> {active.comites} comités</div>
            </div>
            <a
              href={active.link}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4A843] hover:text-white transition-colors"
            >
              Activar zona territorial <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <p className="text-white/40 text-sm">Selecciona una región para activar tu zona territorial</p>
        )}
      </motion.div>
    </div>
  );
}