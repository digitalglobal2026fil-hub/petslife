import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Video, Calendar, Plus, X, Copy } from "lucide-react";
import { api as apiTyped } from "../../lib/api";
import { RequireAuth, AppShell } from "../../components/AppShell";
const api: any = apiTyped;

const SPECIALTIES = ["Geral", "Dermatologia", "Ortopedia", "Oncologia", "Comportamento", "Nutrição", "Outro"];
const DURATIONS = [
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "60 min", value: 60 },
];

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pendente", color: "#B45309", bg: "#FEF3C7" },
  confirmed: { label: "Confirmada", color: "#047857", bg: "#D1FAE5" },
  ongoing: { label: "Em curso", color: "#1D4ED8", bg: "#DBEAFE" },
  done: { label: "Concluída", color: "#6B7280", bg: "#F3F4F6" },
  cancelled: { label: "Cancelada", color: "#B91C1C", bg: "#FEE2E2" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? STATUS_MAP.pending;
  return <span className="text-[11px] font-extrabold px-2 py-1 rounded-lg shrink-0" style={{ backgroundColor: s.bg, color: s.color }}>{s.label}</span>;
}

function formatDate(ts: number | string | null) {
  if (!ts) return "—";
  const d = new Date(ts);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("pt-PT", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function ConsultContent() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [bookedRoomUrl, setBookedRoomUrl] = useState<string | null>(null);

  const [vetName, setVetName] = useState("");
  const [vetEmail, setVetEmail] = useState("");
  const [specialty, setSpecialty] = useState("Geral");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["consultations"],
    queryFn: async () => (await api.consultations.$get()).json(),
  });
  const consultations: any[] = (data as any)?.consultations ?? [];

  const book = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => (await api.consultations.$post({ json: payload })).json(),
    onSuccess: (result: any) => {
      qc.invalidateQueries({ queryKey: ["consultations"] });
      setShowModal(false);
      resetForm();
      setBookedRoomUrl(result?.consultation?.roomUrl ?? null);
    },
  });

  const cancel = useMutation({
    mutationFn: async (id: string) => (await api.consultations[":id"].$delete({ param: { id } })).json(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["consultations"] }),
  });

  function resetForm() {
    setVetName(""); setVetEmail(""); setSpecialty("Geral");
    setDate(""); setTime(""); setDuration(30); setNotes("");
    setError("");
  }

  function handleBook() {
    if (!date || !time) { setError("Por favor preencha a data e hora."); return; }
    const scheduledAt = new Date(`${date}T${time}`).toISOString();
    if (isNaN(new Date(scheduledAt).getTime())) { setError("Data ou hora inválida."); return; }
    setError("");
    book.mutate({ vetName, vetEmail, specialty, scheduledAt, duration, notes });
  }

  const upcoming = consultations.filter((c) => ["pending", "confirmed", "ongoing"].includes(c.status));
  const past = consultations.filter((c) => ["done", "cancelled"].includes(c.status));

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A1A2E]">Consulta Online 🩺</h1>
          <p className="text-gray-500 text-sm mt-1">Fale com o seu veterinário por videochamada.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="shrink-0 w-10 h-10 rounded-full bg-[#FF6B35] text-white flex items-center justify-center hover:bg-[#e85f2c] transition-colors">
          <Plus size={20} />
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#F0E8E0] p-4 flex gap-3 items-start mb-6">
        <Video size={20} className="text-[#4ECDC4] shrink-0 mt-0.5" />
        <p className="text-xs text-gray-500 leading-relaxed">Agende, receba o link verde, partilhe com o veterinário e entre directamente no browser — sem instalar nada.</p>
      </div>

      {bookedRoomUrl && (
        <div className="bg-[#D1FAE5] border border-[#6EE7B7] rounded-2xl p-4 mb-6">
          <p className="font-extrabold text-[#047857] text-sm mb-1.5">✅ Consulta agendada!</p>
          <p className="text-xs text-[#065F46] mb-3">Partilhe este link com o veterinário — é por aqui que os dois entram na videochamada.</p>
          <div className="bg-white rounded-xl p-2.5 flex items-center gap-2 mb-3">
            <span className="flex-1 text-xs text-[#065F46] font-mono truncate">{bookedRoomUrl}</span>
            <button onClick={() => navigator.clipboard?.writeText(bookedRoomUrl)} className="text-[#047857]"><Copy size={16} /></button>
          </div>
          <div className="flex gap-2">
            <a href={bookedRoomUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-[#047857] text-white font-bold text-xs rounded-lg py-2.5">Entrar agora</a>
            <button onClick={() => setBookedRoomUrl(null)} className="flex-1 border border-[#6EE7B7] text-[#047857] font-semibold text-xs rounded-lg py-2.5">Fechar</button>
          </div>
        </div>
      )}

      <h2 className="font-extrabold text-[#1A1A2E] text-sm mb-3">Próximas consultas</h2>
      {isLoading ? (
        <p className="text-gray-400 text-sm">A carregar...</p>
      ) : upcoming.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#F0E8E0] p-8 text-center mb-6">
          <div className="text-4xl mb-2">📅</div>
          <p className="text-gray-500 text-sm mb-4">Nenhuma consulta agendada.</p>
          <button onClick={() => setShowModal(true)} className="bg-[#FF6B35] text-white font-bold text-sm px-4 py-2 rounded-xl">Agendar consulta</button>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {upcoming.map((c: any) => (
            <div key={c.id} className="bg-white rounded-2xl border border-[#F0E8E0] p-4">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#FFF0EB] flex items-center justify-center shrink-0"><Video size={18} className="text-[#FF6B35]" /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#1A1A2E] text-sm">{c.vetName || "Veterinário"}</p>
                  <p className="text-xs text-gray-400">{c.specialty} · {c.duration} min</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                <Calendar size={13} /> {formatDate(c.scheduledAt)}
              </div>
              {c.notes && <p className="text-xs text-gray-500 mb-2">{c.notes}</p>}
              {c.roomUrl && (
                <div className="bg-[#D1FAE5] border border-[#6EE7B7] rounded-xl p-2.5 flex items-center gap-2 mb-2">
                  <span className="flex-1 text-[11px] text-[#065F46] font-mono truncate">{c.roomUrl}</span>
                  <button onClick={() => navigator.clipboard?.writeText(c.roomUrl)} className="text-[#047857]"><Copy size={14} /></button>
                </div>
              )}
              <div className="flex gap-2">
                {c.roomUrl && (
                  <a href={c.roomUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center flex items-center justify-center gap-1.5 bg-[#FF6B35] text-white font-bold text-xs rounded-lg py-2.5">
                    <Video size={14} /> Entrar na chamada
                  </a>
                )}
                {c.status !== "done" && c.status !== "cancelled" && (
                  <button onClick={() => cancel.mutate(c.id)} className="flex items-center justify-center gap-1 border border-red-200 text-red-500 font-semibold text-xs rounded-lg py-2.5 px-3">
                    <X size={13} /> Cancelar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {past.length > 0 && (
        <>
          <h2 className="font-extrabold text-[#1A1A2E] text-sm mb-3">Histórico</h2>
          <div className="space-y-2">
            {past.map((c: any) => (
              <div key={c.id} className="bg-white rounded-2xl border border-[#F0E8E0] p-4 opacity-70">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0"><Video size={18} className="text-gray-400" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#1A1A2E] text-sm">{c.vetName || "Veterinário"}</p>
                    <p className="text-xs text-gray-400">{c.specialty} · {c.duration} min</p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Calendar size={13} /> {formatDate(c.scheduledAt)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-extrabold text-[#1A1A2E]">Agendar consulta</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-400"><X size={22} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1.5">Nome do veterinário</label>
                <input value={vetName} onChange={(e) => setVetName(e.target.value)} placeholder="Dr(a). ..." className="w-full px-3.5 py-2.5 rounded-xl border border-[#F0E8E0] text-sm focus:outline-none focus:border-[#FF6B35]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1.5">Email do veterinário</label>
                <input type="email" value={vetEmail} onChange={(e) => setVetEmail(e.target.value)} placeholder="vet@exemplo.pt" className="w-full px-3.5 py-2.5 rounded-xl border border-[#F0E8E0] text-sm focus:outline-none focus:border-[#FF6B35]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1.5">Especialidade</label>
                <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-[#F0E8E0] text-sm focus:outline-none focus:border-[#FF6B35]">
                  {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1.5">Data</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-[#F0E8E0] text-sm focus:outline-none focus:border-[#FF6B35]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1.5">Hora</label>
                  <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-[#F0E8E0] text-sm focus:outline-none focus:border-[#FF6B35]" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1.5">Duração</label>
                <div className="flex gap-2">
                  {DURATIONS.map((d) => (
                    <button key={d.value} onClick={() => setDuration(d.value)} className={`flex-1 py-2 rounded-xl text-sm font-semibold border ${duration === d.value ? "bg-[#FF6B35] text-white border-[#FF6B35]" : "border-[#F0E8E0] text-gray-500"}`}>{d.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1.5">Notas (opcional)</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Motivo da consulta, sintomas..." rows={3} className="w-full px-3.5 py-2.5 rounded-xl border border-[#F0E8E0] text-sm focus:outline-none focus:border-[#FF6B35] resize-none" />
              </div>
              {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}
              <button onClick={handleBook} disabled={book.isPending} className="w-full bg-[#FF6B35] text-white font-bold rounded-xl py-3 mt-2 disabled:opacity-60">
                {book.isPending ? "A agendar..." : "Agendar consulta"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Consult() {
  return (
    <RequireAuth>
      <AppShell>
        <ConsultContent />
      </AppShell>
    </RequireAuth>
  );
}
