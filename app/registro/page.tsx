"use client";
import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2, Trophy, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const MUNICIPIOS_GUERRERO = [
  "Acapulco de Juarez", "Chilpancingo de los Bravo", "Iguala de la Independencia", "Taxco de Alarcon", "Zihuatanejo de Azueta", "Tlapa de Comonfort", "Chilapa de Alvarez", "Atoyac de Alvarez", "Copala", "Coyuca de Benitez"
].sort(); // En producción, importa tu array completo

export default function RegistroPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    responsable: "",
    whatsapp: "",
    municipio: "",
    alineacion: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.responsable || !formData.whatsapp || !formData.municipio) {
      setErrorMsg("Completa los campos obligatorios del Responsable.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    const cleanWhatsapp = formData.whatsapp.replace(/\D/g, "");
    if (cleanWhatsapp.length !== 10) {
      setStatus("error");
      setErrorMsg("El WhatsApp debe tener 10 dígitos.");
      return;
    }

    try {
      const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!SUPABASE_URL || !SUPABASE_KEY) {
        throw new Error("Configuración de servidor faltante. Verifica .env.local");
      }

      const res = await fetch(`${SUPABASE_URL}/rest/v1/titulares`, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          nombres: formData.responsable,
          whatsapp: cleanWhatsapp,
          municipio: formData.municipio,
          alineacion: formData.alineacion,
          rol: "responsable",
          region: "Guerrero"
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Error al conectar con la base de datos. Inténtalo de nuevo.");
      }

      setStatus("success");
      // Redirección inmediata a la pantalla de recompensa
      setTimeout(() => router.push("/tarjetas"), 1800);

    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Error de red. Verifica tu conexión o intenta en 30 segundos.");
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#0a1f1b] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,168,67,0.05),transparent_70%)]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md relative z-10"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#D4A843]/20 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-[#D4A843]" />
          </div>
          <div>
            <h2 className="text-white font-black text-xl">Registro de Alineación</h2>
            <p className="text-white/40 text-xs">Forma tu escuadra oficial para el 22 de junio</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#D4A843]/80 mb-1.5 tracking-wider uppercase">Nombre del Responsable *</label>
            <input type="text" required value={formData.responsable} onChange={handleChange("responsable")} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-[#D4A843] transition-all text-sm" placeholder="Ej. Juan Pérez" />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#D4A843]/80 mb-1.5 tracking-wider uppercase">WhatsApp (10 dígitos) *</label>
              <input type="tel" required maxLength={10} value={formData.whatsapp} onChange={handleChange("whatsapp")} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-[#D4A843] transition-all text-sm" placeholder="747 000 0000" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#D4A843]/80 mb-1.5 tracking-wider uppercase">Municipio *</label>
              <select required value={formData.municipio} onChange={handleChange("municipio")} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-[#D4A843] transition-all text-sm appearance-none cursor-pointer">
                <option value="" disabled className="bg-[#0d2924]">Selecciona tu municipio...</option>
                {MUNICIPIOS_GUERRERO.map(m => <option key={m} value={m} className="bg-[#0d2924] text-white">{m}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D4A843]/80 mb-1.5 tracking-wider uppercase">Alineación de Equipo</label>
            <textarea rows={3} value={formData.alineana} onChange={handleChange("alineacion")} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-[#D4A843] transition-all text-sm resize-none" placeholder="Escribe los nombres de tus compañeros de zona, separados por comas..." />
            <p className="text-white/30 text-[11px] mt-1.5">Estos nombres se usarán para generar las tarjetas de tu escuadra.</p>
          </div>

          <AnimatePresence>
            {errorMsg && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit" 
            disabled={status === "loading" || status === "success"}
            className="w-full py-4 rounded-full font-black text-base transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed bg-[#D4A843] text-[#0a1f1b]"
          >
            {status === "loading" ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Procesando fichaje...</>
            ) : status === "success" ? (
              <><CheckCircle2 className="w-5 h-5 text-green-600" /> ¡Registro exitoso! Redirigiendo...</>
            ) : (
              <>Fichar mi Equipo <ChevronRight className="w-5 h-5" /></>
            )}
          </button>
        </form>

        <p className="text-[11px] text-white/30 text-center mt-4">
          Tus datos están protegidos. Se usan exclusivamente para organización territorial.
        </p>
      </motion.div>

      <a href="/" className="fixed top-6 left-6 z-20 text-white/50 hover:text-white transition-colors flex items-center gap-2 text-sm font-semibold">
        <ChevronRight className="w-4 h-4 rotate-180" /> Volver al inicio
      </a>
    </main>
  );
}