"use client";
import { Suspense, useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, CheckCircle2, AlertCircle, Loader2, Trophy, ChevronRight, MapPin, Users, Shield } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface TeamMember {
  id: number;
  nombre: string;
  celular: string;
  facebook: string;
  tiktok: string;
  twitter: string;
}

function RegistroContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const liderRef = searchParams.get("lider")?.trim();

  const [form, setForm] = useState({
    fecha: new Date().toISOString().split('T')[0],
    seccion: "", federal: "", local: "", municipal: "", seccional: "",
    nombre: "", celular: "", email: "", facebook: "", tiktok: "", twitter: ""
  });
  const [team, setTeam] = useState<TeamMember[]>([
    { id: Date.now(), nombre: "", celular: "", facebook: "", tiktok: "", twitter: "" }
  ]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const updateField = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const updateTeam = (id: number, field: keyof TeamMember) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setTeam(prev => prev.map(m => m.id === id ? { ...m, [field]: e.target.value } : m));

  const addTeamMember = () =>
    setTeam(prev => [...prev, { id: Date.now(), nombre: "", celular: "", facebook: "", tiktok: "", twitter: "" }]);

  const removeTeamMember = (id: number) => {
    if (team.length > 1) setTeam(prev => prev.filter(m => m.id !== id));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.celular) { setErrorMsg("Completa Nombre y Celular."); return; }
    const cleanPhone = form.celular.replace(/\D/g, "");
    if (cleanPhone.length !== 10) { setErrorMsg("Celular requiere 10 dígitos."); return; }

    setStatus("loading");
    setErrorMsg("");

    try {
      const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      // HEADERS EXACTOS (sin espacios)
      const headers = {
        "apikey": KEY,
        "Authorization": `Bearer ${KEY}`,
        "Content-Type": "application/json"
      };

      if (liderRef) {
        console.log("🔹 FLUJO INTEGRANTE → Líder:", liderRef);
        
        // 1. Leer array actual del líder
        const fetchRes = await fetch(`${URL}/rest/v1/red_territorial?codigo_acceso=eq.${encodeURIComponent(liderRef)}&select=alineacion_equipo`, { headers });
        if (!fetchRes.ok) throw new Error(`Error leyendo líder (${fetchRes.status})`);
        const existing = await fetchRes.json();
        
        let currentTeam: any[] = existing[0]?.alineacion_equipo || [];
        if (typeof currentTeam === "string") {
          try { currentTeam = JSON.parse(currentTeam); } catch { currentTeam = []; }
        }

        // 2. Agregar nuevo integrante
        const updatedTeam = [
          ...currentTeam,
          { id: Date.now(), nombre: form.nombre.trim(), celular: cleanPhone, facebook: form.facebook, tiktok: form.tiktok, twitter: form.twitter }
        ];

        console.log("📤 PATCH PAYLOAD:", JSON.stringify(updatedTeam));

        // 3. Actualizar JSONB en Supabase
        const patchRes = await fetch(`${URL}/rest/v1/red_territorial?codigo_acceso=eq.${encodeURIComponent(liderRef)}`, {
          method: "PATCH",
          headers: { ...headers, "Prefer": "return=minimal" },
          body: JSON.stringify({ alineacion_equipo: updatedTeam })
        });

        if (!patchRes.ok) {
          const errText = await patchRes.text().catch(() => "");
          console.error("❌ PATCH FALLÓ:", patchRes.status, errText);
          throw new Error("No se pudo añadir al equipo. Verifica el código del líder o RLS.");
        }

        console.log("✅ INTEGRANTE AÑADIDO CORRECTAMENTE");
        setStatus("success");
        setTimeout(() => router.push("/"), 1500);

      } else {
        // 🟢 FLUJO LÍDER: Crea nuevo registro
        const codigoAcceso = `GRRO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const payload = {
          fecha_registro: form.fecha,
          responsabilidad_seccion: form.seccion || null,
          responsabilidad_federal: form.federal || null,
          responsabilidad_local: form.local || null,
          responsabilidad_municipal: form.municipal || null,
          responsabilidad_seccional: form.seccional || null,
          nombre_responsable: form.nombre.trim(),
          celular_responsable: cleanPhone,
          codigo_acceso: codigoAcceso,
          email_responsable: form.email || null,
          redes_sociales: { facebook: form.facebook, tiktok: form.tiktok, twitter: form.twitter },
          alineacion_equipo: team.filter(m => m.nombre?.trim() || m.celular?.trim())
        };

        const res = await fetch(`${URL}/rest/v1/red_territorial`, {
          method: "POST",
          headers: { ...headers, "Prefer": "return=minimal" },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Error al registrar líder.");
        setStatus("success");
        setTimeout(() => router.push(`/mi-estructura/${codigoAcceso}`), 1500);
      }
    } catch (err: any) {
      console.error("❌ ERROR GENERAL:", err);
      setStatus("error");
      setErrorMsg(err.message || "Error de conexión. Verifica tu red.");
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2.5 text-white placeholder-white/25 focus:outline-none focus:border-[#D4A843] transition-all text-sm";
  const labelClass = "block text-[11px] font-semibold text-[#D4A843]/80 mb-1 tracking-wider uppercase";

  return (
    <main className="min-h-screen bg-[#14050B] text-white px-4 py-10 md:py-14">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6B1D3A]/30 border border-[#D4A843]/30 text-[#D4A843] text-xs font-bold tracking-widest uppercase mb-3">
            <Shield className="w-3.5 h-3.5" /> {liderRef ? "Adhesión a Escuadra" : "Registro Oficial de Red"}
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white mb-2">{liderRef ? "Únete a la Estructura" : "Formulario Territorial"}</h1>
          <p className="text-white/50 text-sm max-w-lg mx-auto">{liderRef ? "Completa tus datos para sumarte al equipo." : "Completa tus datos y registra tu alineación. La información está separada y protegida."}</p>
        </div>

        {liderRef && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-[#D4A843]/10 border border-[#D4A843]/30 text-center">
            <p className="text-[#D4A843] text-xs font-bold tracking-widest uppercase mb-1">Te estás uniendo a la escuadra de:</p>
            <p className="text-white text-xl font-black tracking-widest">{liderRef}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!liderRef && (
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 md:p-7 space-y-4">
              <div className="flex items-center gap-2 text-[#D4A843] mb-2"><MapPin className="w-4 h-4" /> <span className="text-xs font-bold tracking-wider uppercase">Responsabilidad Territorial</span></div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div><label className={labelClass}>Sección</label><input type="text" value={form.seccion} onChange={updateField("seccion")} className={inputClass} placeholder="0000" /></div>
                <div><label className={labelClass}>Federal</label><input type="text" value={form.federal} onChange={updateField("federal")} className={inputClass} placeholder="Distrito" /></div>
                <div><label className={labelClass}>Local</label><input type="text" value={form.local} onChange={updateField("local")} className={inputClass} placeholder="Módulo" /></div>
                <div><label className={labelClass}>Municipal *</label><input type="text" required value={form.municipal} onChange={updateField("municipal")} className={inputClass} placeholder="Municipio" /></div>
                <div><label className={labelClass}>Seccional</label><input type="text" value={form.seccional} onChange={updateField("seccional")} className={inputClass} placeholder="Delegación" /></div>
              </div>
              <div className="h-px bg-white/10 my-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={labelClass}>Nombre del Responsable *</label><input type="text" required value={form.nombre} onChange={updateField("nombre")} className={inputClass} placeholder="Nombre completo" /></div>
                <div><label className={labelClass}>Celular *</label><input type="tel" required maxLength={10} value={form.celular} onChange={updateField("celular")} className={inputClass} placeholder="10 dígitos" /></div>
              </div>
            </div>
          )}

          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 md:p-7 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-[#D4A843]"><Users className="w-4 h-4" /> <span className="text-xs font-bold tracking-wider uppercase">{liderRef ? "Datos del Integrante" : "Alineación de Equipo"}</span></div>
              {!liderRef && <button type="button" onClick={addTeamMember} className="flex items-center gap-1 text-xs font-semibold text-[#D4A843] hover:text-white"><Plus className="w-4 h-4" /> Agregar</button>}
            </div>

            {liderRef ? (
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 grid grid-cols-1 md:grid-cols-6 gap-3">
                <div className="md:col-span-2"><label className={labelClass}>Nombre *</label><input type="text" required value={form.nombre} onChange={updateField("nombre")} className={inputClass} placeholder="Tu nombre" /></div>
                <div className="md:col-span-1"><label className={labelClass}>Celular *</label><input type="tel" required maxLength={10} value={form.celular} onChange={updateField("celular")} className={inputClass} placeholder="10 dígitos" /></div>
                <div className="md:col-span-3 grid grid-cols-3 gap-2">
                  <div><label className={labelClass}>FB</label><input type="text" value={form.facebook} onChange={updateField("facebook")} className={inputClass} placeholder="Perfil" /></div>
                  <div><label className={labelClass}>X</label><input type="text" value={form.twitter} onChange={updateField("twitter")} className={inputClass} placeholder="Usuario" /></div>
                  <div><label className={labelClass}>TT</label><input type="text" value={form.tiktok} onChange={updateField("tiktok")} className={inputClass} placeholder="Usuario" /></div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {team.map((member, idx) => (
                    <motion.div key={member.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="p-3 rounded-xl bg-white/[0.03] border border-white/10 grid grid-cols-1 md:grid-cols-6 gap-3">
                      <div className="md:col-span-1"><label className={labelClass}>No.</label><input type="text" value={idx + 1} readOnly className={`${inputClass} bg-transparent`} /></div>
                      <div className="md:col-span-2"><label className={labelClass}>Nombre</label><input type="text" value={member.nombre} onChange={updateTeam(member.id, "nombre")} className={inputClass} placeholder="Miembro" /></div>
                      <div className="md:col-span-1"><label className={labelClass}>Celular</label><input type="tel" value={member.celular} onChange={updateTeam(member.id, "celular")} className={inputClass} placeholder="10 dígitos" /></div>
                      <div className="md:col-span-2 grid grid-cols-3 gap-2">
                        <div><label className={labelClass}>F</label><input type="text" value={member.facebook} onChange={updateTeam(member.id, "facebook")} className={inputClass} placeholder="FB" /></div>
                        <div><label className={labelClass}>X</label><input type="text" value={member.twitter} onChange={updateTeam(member.id, "twitter")} className={inputClass} placeholder="X" /></div>
                        <div><label className={labelClass}>TT</label><input type="text" value={member.tiktok} onChange={updateTeam(member.id, "tiktok")} className={inputClass} placeholder="TT" /></div>
                      </div>
                      {team.length > 1 && <div className="md:col-span-6 flex justify-end"><button type="button" onClick={() => removeTeamMember(member.id)} className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Eliminar</button></div>}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {!liderRef && (
            <div className="bg-[#6B1D3A]/10 border border-[#D4A843]/20 rounded-2xl p-5 md:p-7 space-y-4">
              <div className="flex items-center gap-2 text-[#D4A843] mb-2"><Shield className="w-4 h-4" /> <span className="text-xs font-bold tracking-wider uppercase">Datos Confidenciales (Solo Coordinación)</span></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className={labelClass}>Correo Electrónico</label><input type="email" value={form.email} onChange={updateField("email")} className={inputClass} placeholder="correo@ejemplo.com" /></div>
                <div className="grid grid-cols-3 gap-2">
                  <div><label className={labelClass}>Facebook</label><input type="text" value={form.facebook} onChange={updateField("facebook")} className={inputClass} placeholder="Perfil" /></div>
                  <div><label className={labelClass}>TikTok</label><input type="text" value={form.tiktok} onChange={updateField("tiktok")} className={inputClass} placeholder="Usuario" /></div>
                  <div><label className={labelClass}>X</label><input type="text" value={form.twitter} onChange={updateField("twitter")} className={inputClass} placeholder="Usuario" /></div>
                </div>
              </div>
            </div>
          )}

          <AnimatePresence>
            {errorMsg && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-xl border border-red-500/20"><AlertCircle className="w-4 h-4 flex-shrink-0" /><span>{errorMsg}</span></motion.div>}
          </AnimatePresence>

          <button type="submit" disabled={status === "loading" || status === "success"} className="w-full py-4 rounded-full font-black text-base transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed bg-[#D4A843] text-[#14050B]">
            {status === "loading" ? <><Loader2 className="w-5 h-5 animate-spin" /> Procesando...</> : status === "success" ? <><CheckCircle2 className="w-5 h-5" /> ¡Registrado! Redirigiendo...</> : <>{liderRef ? "Unirme a la Escuadra" : "Registrar Red y Activar Cambio"} <Trophy className="w-5 h-5" /></>}
          </button>

          <a href="/" className="block text-center text-white/30 text-xs py-2 hover:text-white/60 transition-colors"><ChevronRight className="w-3 h-3 rotate-180 inline" /> Volver al inicio</a>
        </form>
      </motion.div>
    </main>
  );
}

export default function RegistroPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#14050B] flex items-center justify-center text-[#D4A843] font-bold">
        Cargando formulario...
      </div>
    }>
      <RegistroContent />
    </Suspense>
  );
}