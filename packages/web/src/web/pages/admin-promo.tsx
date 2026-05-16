import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API = "/api/promo-codes/admin";

async function fetchCodes() {
  const r = await fetch(API, { credentials: "include" });
  return r.json();
}

export default function AdminPromo() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["promo-codes"], queryFn: fetchCodes });
  const [description, setDescription] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [creating, setCreating] = useState(false);
  const [msg, setMsg] = useState("");

  async function createCode() {
    setCreating(true);
    setMsg("");
    const r = await fetch(API, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, customCode: customCode || undefined }),
    });
    const d = await r.json();
    if (d.error) setMsg("❌ " + d.error);
    else {
      setMsg("✅ Código criado: " + d.promo.code);
      setDescription(""); setCustomCode("");
      qc.invalidateQueries({ queryKey: ["promo-codes"] });
    }
    setCreating(false);
  }

  async function deleteCode(id: string) {
    if (!confirm("Apagar código?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE", credentials: "include" });
    qc.invalidateQueries({ queryKey: ["promo-codes"] });
  }

  async function copyCode(code: string) {
    await navigator.clipboard.writeText(code);
    alert("Copiado: " + code);
  }

  if (isLoading) return <div style={s.page}><p>A carregar...</p></div>;
  if (error || data?.error) return <div style={s.page}><p style={{color:"red"}}>Sem permissão ou erro.</p></div>;

  const codes = data?.codes || [];
  const used = codes.filter((c: any) => c.usedByUserId);
  const available = codes.filter((c: any) => !c.usedByUserId);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <span style={s.logo}>🐾 PetsLife</span>
        <h1 style={s.title}>Códigos Promocionais</h1>
        <p style={s.subtitle}>Gestão de códigos de acesso vitalício</p>
      </div>

      {/* Stats */}
      <div style={s.stats}>
        <div style={s.stat}><span style={s.statNum}>{codes.length}</span><span style={s.statLabel}>Total</span></div>
        <div style={s.stat}><span style={{...s.statNum, color:"#10B981"}}>{available.length}</span><span style={s.statLabel}>Disponíveis</span></div>
        <div style={s.stat}><span style={{...s.statNum, color:"#6B7280"}}>{used.length}</span><span style={s.statLabel}>Usados</span></div>
      </div>

      {/* Criar código */}
      <div style={s.card}>
        <h2 style={s.cardTitle}>Criar novo código</h2>
        <div style={s.form}>
          <input
            style={s.input}
            placeholder="Para quem é? (ex: Influencer João, Familiar Maria)"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <input
            style={s.input}
            placeholder="Código personalizado (opcional, ex: PETS-JOAO)"
            value={customCode}
            onChange={e => setCustomCode(e.target.value.toUpperCase())}
          />
          <button style={s.btn} onClick={createCode} disabled={creating}>
            {creating ? "A criar..." : "+ Gerar código"}
          </button>
        </div>
        {msg && <p style={s.msg}>{msg}</p>}
      </div>

      {/* Lista */}
      <div style={s.card}>
        <h2 style={s.cardTitle}>Todos os códigos</h2>
        {codes.length === 0 && <p style={{color:"#9CA3AF"}}>Nenhum código criado ainda.</p>}
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Código</th>
              <th style={s.th}>Descrição</th>
              <th style={s.th}>Estado</th>
              <th style={s.th}>Criado em</th>
              <th style={s.th}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {codes.map((c: any) => (
              <tr key={c.id} style={{borderBottom:"1px solid #F3F4F6"}}>
                <td style={s.td}>
                  <span style={s.code}>{c.code}</span>
                </td>
                <td style={s.td}>{c.description || "-"}</td>
                <td style={s.td}>
                  {c.usedByUserId
                    ? <span style={s.tagUsed}>Usado</span>
                    : <span style={s.tagFree}>Disponível</span>
                  }
                </td>
                <td style={s.td}>{new Date(c.createdAt).toLocaleDateString("pt-PT")}</td>
                <td style={s.td}>
                  <button style={s.copyBtn} onClick={() => copyCode(c.code)}>Copiar</button>
                  {!c.usedByUserId && (
                    <button style={s.delBtn} onClick={() => deleteCode(c.id)}>Apagar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight:"100vh", background:"#F9FAFB", padding:"32px 24px", fontFamily:"sans-serif" },
  header: { textAlign:"center", marginBottom:32 },
  logo: { fontSize:32 },
  title: { fontSize:28, fontWeight:700, color:"#1F2937", margin:"8px 0 4px" },
  subtitle: { color:"#6B7280", fontSize:15 },
  stats: { display:"flex", gap:16, justifyContent:"center", marginBottom:32 },
  stat: { background:"#fff", borderRadius:14, padding:"20px 32px", textAlign:"center", boxShadow:"0 1px 4px rgba(0,0,0,0.08)" },
  statNum: { display:"block", fontSize:32, fontWeight:700, color:"#FF6B35" },
  statLabel: { fontSize:13, color:"#6B7280" },
  card: { background:"#fff", borderRadius:16, padding:28, marginBottom:24, boxShadow:"0 1px 4px rgba(0,0,0,0.08)", maxWidth:900, margin:"0 auto 24px" },
  cardTitle: { fontSize:18, fontWeight:700, color:"#1F2937", marginBottom:16 },
  form: { display:"flex", flexDirection:"column", gap:12 },
  input: { border:"1.5px solid #E5E7EB", borderRadius:10, padding:"12px 16px", fontSize:15, outline:"none" },
  btn: { background:"#FF6B35", color:"#fff", border:"none", borderRadius:10, padding:"12px 24px", fontSize:15, fontWeight:700, cursor:"pointer" },
  msg: { marginTop:12, fontSize:15, fontWeight:600 },
  table: { width:"100%", borderCollapse:"collapse" as const },
  th: { textAlign:"left" as const, padding:"10px 12px", fontSize:13, color:"#6B7280", fontWeight:600, borderBottom:"2px solid #F3F4F6" },
  td: { padding:"12px 12px", fontSize:14, color:"#1F2937", verticalAlign:"middle" as const },
  code: { fontFamily:"monospace", background:"#FFF3EE", color:"#FF6B35", padding:"4px 10px", borderRadius:6, fontWeight:700, fontSize:15 },
  tagUsed: { background:"#F3F4F6", color:"#6B7280", padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:600 },
  tagFree: { background:"#D1FAE5", color:"#065F46", padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:600 },
  copyBtn: { background:"#EFF6FF", color:"#2563EB", border:"none", borderRadius:7, padding:"5px 12px", fontSize:13, cursor:"pointer", marginRight:6 },
  delBtn: { background:"#FEF2F2", color:"#DC2626", border:"none", borderRadius:7, padding:"5px 12px", fontSize:13, cursor:"pointer" },
};
