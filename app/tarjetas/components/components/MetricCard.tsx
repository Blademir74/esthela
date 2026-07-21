"use client";
import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { LucideIcon } from "lucide-react";

export default function MetricCard({
  value,
  label,
  icon: Icon,
  delay = 0,
}: {
  value: number | string;
  label: string;
  icon?: LucideIcon;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);
  const isNumeric = typeof value === "number";

  useEffect(() => {
    if (!inView || !isNumeric) return;
    let start = 0;
    const duration = 1800;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, isNumeric, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#6B1D3A]/40 to-[#0B0508]/60 rounded-2xl blur-md group-hover:blur-lg transition-all" />
      <div className="relative bg-[#0B0508]/80 backdrop-blur-md border border-[#D4A843]/20 rounded-2xl p-6 flex items-center gap-4 transition-all group-hover:border-[#D4A843]/50 group-hover:scale-[1.02]">
        {Icon && (
          <div className="w-12 h-12 rounded-xl bg-[#D4A843]/10 flex items-center justify-center group-hover:bg-[#D4A843]/20 transition-colors">
            <Icon className="w-6 h-6 text-[#D4A843]" />
          </div>
        )}
        <div>
          <p className="text-3xl md:text-4xl font-black text-[#D4A843] leading-none tabular-nums">
            {isNumeric ? count.toLocaleString() : value}
          </p>
          <p className="text-xs md:text-sm text-white/50 uppercase tracking-wider mt-1 font-medium">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}