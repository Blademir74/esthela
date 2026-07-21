"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Users, Phone, MapPin, Facebook, Instagram, Link2, Copy, AlertCircle, CheckCircle2, Download } from "lucide-react";

export default function MiEstructuraPage() {
  const params = useParams();
  const codigo = typeof params.codigo === "string" ? params.codigo : String(params.codigo || "");
  const router = useRouter();
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [csvStatus, setCsvStatus] = useState<"idle" | "success" | "error">("idle");
  const [teamList, setTeamList] = useState<any[]>([]);

    // ═══════════════════════════════════════════════════════
  // 1. FETCH CON INVALIDACIÓN DE CACHÉ
  // ═══════════════════════════════════════════════════════
  useEffect(() => {
    if (!codigo) return;
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error("Config de Supabase faltante");

        const res = await fetch(`${SUPABASE_URL}/rest/v1/red_territorial?codigo_acceso=eq.${encodeURIComponent(codigo)}&select=*`, {
          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json"
          },
          cache: "no-store" // Obliga a leer desde BD, no desde caché de Vercel
        });

        if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
        const result = await res.json();

        if (!mounted) return;
        if (!Array.isArray(result) || result.length === 0) throw new Error("Código inválido o registro no encontrado.");
        setData(result[0]);
      } catch (err: any) {
        if (mounted) setError(err.message || "Error al cargar la estructura.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, [codigo]);

  // ═══════════════════════════════════════════════════════
  // 2. PARSER AUTO-CORRECTIVO (Maneja String/Array/Objeto)
  // ═══════════════════════════════════════════════════════
  useEffect(() => {
    if (!data) return;
    
    let raw = data.alineacion_equipo;
    console.log("📦 RAW TYPE:", typeof raw);
    console.log("📦 RAW VALUE:", raw);

    // 1. Si viene como string (formato común de PostgREST para JSONB)
    if (typeof raw === "string") {
      try { raw = JSON.parse(raw); } catch { /* sigue como string */ }
    }

    // 2. Normalización forzada a array
    let arr: any[] = [];
    if (Array.isArray(raw)) {
      arr = raw;
    } else if (raw && typeof raw === "object") {
      // Supabase a veces devuelve { "0": {...}, "1": {...}, length: 2 }
      if (Array.isArray(raw.value)) arr = raw.value;
      else if (Array.isArray(raw.data)) arr = raw.data;
      else if (raw.length && typeof raw.length === "number") {
        arr = Array.from({ length: raw.length }, (_, i) => raw[i]);
      } else {
        arr = Object.values(raw).filter((v: any) => v && typeof v === "object" && !Array.isArray(v));
      }
    }

    // 3. Limpieza y filtrado seguro
    const filtered = (Array.isArray(arr) ? arr : [])
      .map((item: any) => ({
        id: item.id || Math.random().toString(36).substr(2, 9),
        nombre: String(item.nombre || "").trim(),
        celular: String(item.celular || "").trim(),
        facebook: String(item.facebook || "").trim(),
        tiktok: String(item.tiktok || "").trim(),
        twitter: String(item.twitter || "").trim(),
      }))
      .filter((m: any) => m.nombre || m.celular || m.facebook || m.tiktok || m.twitter);

    console.log("✅ EQUIPO PARSEADO Y LIMPIO:", filtered);
    setTeamList(filtered);
  }, [data]);

  // ═══════════════════════════════════════════════════════
  // 3. ACCIONES
  // ═══════════════════════════════════════════════════════
  const handleCopyLink = () => {
    const link = `${window.location.origin}/mi-estructura/${codigo}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCSV = () => {
    try {
      if (teamList.length === 0) {
        setCsvStatus("error");
        setTimeout(() => setCsvStatus("idle"), 3000);
        return;
      }
      const headers = ["Nombre", "Celular", "Facebook", "TikTok", "Twitter"];
      const rows = teamList.map((m: any) =>
        [m.nombre || "", m.celular || "", m.facebook || "", m.tiktok || "", m.twitter || ""]
          .map((val: string) => `"${String(val).replace(/"/g, '""')}"`)
          .join(",")
      );
      const csvContent = [headers.join(","), ...rows].join("\n");
      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Estructura_${data?.responsabilidad_municipal || "Guerrero"}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setCsvStatus("success");
      setTimeout(() => setCsvStatus("idle"), 3000);
    } catch {
      setCsvStatus("error");
      setTimeout(() => setCsvStatus("idle"), 3000);
    }
  };

  // ═══════════════════════════════════════════════════════
  // 4. RENDERIZADO
  // ═══════════════════════════════════════════════════════
  return (
    <main className="min-h-screen bg-[#14050B] text-white px-4 py-10 md:py-14">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6B1D3A]/30 border border-[#D4A843]/30 text-[#D4A843] text-xs font-bold tracking-widest uppercase mb-3">
            <Shield className="w-3.5 h-3.5" /> Acceso Territorial Restringido
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white mb-2">Tu Estructura en Cancha</h1>
          <p className="text-white/50 text-sm max-w-lg mx-auto">Comparte este enlace con tus colaboradores. Los datos sensibles están protegidos por código único.</p>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#D4A843] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-white/60 text-sm">Cargando alineación territorial...</p>
            </motion.div>
          ) : error ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
              <p className="text-white/80 font-medium mb-2">{error}</p>
              <button onClick={() => router.push("/")} className="text-[#D4A843] text-sm hover:underline">Volver al inicio</button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">{data?.nombre_responsable || "Responsable"}</h2>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm">
                      <span className="flex items-center gap-1 text-white/60"><MapPin className="w-3.5 h-3.5" /> {data?.responsabilidad_municipal || "-"}</span>
                      <span className="flex items-center gap-1 text-white/60"><Phone className="w-3.5 h-3.5" /> {data?.celular_responsable || "-"}</span>
                      <span className="flex items-center gap-1 text-white/60"><span className="w-3.5 h-3.5 border border-white/40 rounded-sm" /> Sección: {data?.responsabilidad_seccion || "N/A"}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleCopyLink} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm">
                      {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Enlace copiado" : "Copiar acceso"}
                    </button>
                    <button onClick={handleDownloadCSV} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4A843] text-[#14050B] hover:bg-[#BC955C] transition-all text-sm font-bold">
                      <Download className="w-4 h-4" /> CSV
                    </button>
                  </div>
                </div>
                <div className="h-px bg-white/10 my-4" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-white/40">
                  <div>Federal: <span className="text-white/70">{data?.responsabilidad_federal || "-"}</span></div>
                  <div>Local: <span className="text-white/70">{data?.responsabilidad_local || "-"}</span></div>
                  <div>Seccional: <span className="text-white/70">{data?.responsabilidad_seccional || "-"}</span></div>
                  <div>Código: <span className="text-[#D4A843] font-mono">{codigo}</span></div>
                </div>
              </div>

              {teamList.length > 0 ? (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8">
                  <div className="flex items-center gap-2 text-[#D4A843] mb-4">
                    <Users className="w-4 h-4" /> <span className="text-xs font-bold tracking-wider uppercase">Alineación Registrada ({teamList.length})</span>
                  </div>
                  <div className="space-y-3">
                    {teamList.map((member: any, idx: number) => (
                      <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-[#6B1D3A]/30 border border-[#D4A843]/30 flex items-center justify-center text-xs font-bold text-[#D4A843]">{idx + 1}</span>
                          <div>
                            <p className="text-white font-medium">{member.nombre || "Sin nombre"}</p>
                            <p className="text-white/40 text-xs">{member.celular || "Sin celular"}</p>
                          </div>
                        </div>
                        <div className="flex gap-3 text-white/30">
                          {member.facebook && <a href={member.facebook.startsWith("http") ? member.facebook : `https://facebook.com/${member.facebook}`} target="_blank" rel="noreferrer" className="hover:text-[#D4A843]"><Facebook className="w-4 h-4" /></a>}
                          {member.tiktok && <a href={member.tiktok.startsWith("http") ? member.tiktok : `https://tiktok.com/@${member.tiktok}`} target="_blank" rel="noreferrer" className="hover:text-[#D4A843]"><Instagram className="w-4 h-4" /></a>}
                          {member.twitter && <a href={member.twitter.startsWith("http") ? member.twitter : `https://twitter.com/${member.twitter}`} target="_blank" rel="noreferrer" className="hover:text-[#D4A843]"><Link2 className="w-4 h-4" /></a>}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-white/40 text-sm bg-white/[0.02] rounded-2xl border border-dashed border-white/10">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  No hay integrantes registrados en la alineación.
                </div>
              )}

              {csvStatus === "success" && <p className="text-green-400 text-xs text-center mt-2">✓ Archivo CSV descargado correctamente</p>}
              {csvStatus === "error" && <p className="text-red-400 text-xs text-center mt-2">⚠ No hay integrantes para exportar a CSV</p>}

              <div className="text-center pt-4">
                <a href="/" className="text-white/30 text-xs hover:text-white/60 transition-colors inline-flex items-center gap-1">← Volver a la plataforma pública</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}