import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Syringe, Calendar, Gauge, Pill, FileText, Heart, QrCode, Trash2, Plus, Copy, Check } from "lucide-react";
import { api as apiTyped } from "../../lib/api";
const api: any = apiTyped;
import { RequireAuth, AppShell } from "../../components/AppShell";

const TABS = [
  { key: "vacinas", label: "Vacinas", icon: Syringe, color: "#4ECDC4" },
  { key: "consultas", label: "Consultas", icon: Calendar, color: "#FF6B35" },
  { key: "peso", label: "Peso", icon: Gauge, color: "#06D6A0" },
  { key: "desparasitacao", label: "Desparasitação", icon: Pill, color: "#F59E0B" },
  { key: "diario", label: "Diário", icon: Heart, color: "#EF476F" },
  { key: "documentos", label: "Documentos", icon: FileText, color: "#8B5CF6" },
  { key: "qr", label: "QR Code", icon: QrCode, color: "#06D6A0" },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  );
}
const inputCls = "w-full border border-[#F0E8E0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30";

function PetDetailContent() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState("vacinas");

  const { data: petData } = useQuery({
    queryKey: ["pet", id],
    queryFn: async () => (await api.pets[":id"].$get({ param: { id } })).json(),
  });
  const pet = (petData as any)?.pet;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-[#FFF0EB] flex items-center justify-center text-3xl overflow-hidden shrink-0">
          {pet?.photoUrl ? <img src={pet.photoUrl} className="w-full h-full object-cover" /> : "🐾"}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A1A2E]">{pet?.name ?? "..."}</h1>
          <p className="text-gray-500 text-sm">{pet?.breed || pet?.species}</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto mb-6 pb-1">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${tab === t.key ? "text-white" : "bg-white border border-[#F0E8E0] text-gray-600"}`}
            style={tab === t.key ? { backgroundColor: t.color } : {}}>
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {tab === "vacinas" && <VaccinesTab petId={id} />}
      {tab === "consultas" && <AppointmentsTab petId={id} />}
      {tab === "peso" && <WeightTab petId={id} />}
      {tab === "desparasitacao" && <DewormingTab petId={id} />}
      {tab === "diario" && <DiaryTab petId={id} />}
      {tab === "documentos" && <DocumentsTab petId={id} />}
      {tab === "qr" && <QrTab pet={pet} />}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white rounded-2xl border border-[#F0E8E0] p-4">{children}</div>;
}

function EmptyState({ text }: { text: string }) {
  return <div className="text-center text-gray-400 py-10 text-sm">{text}</div>;
}

// ---------------- Vacinas ----------------
function VaccinesTab({ petId }: { petId: string }) {
  const qc = useQueryClient();
  const [form, setForm] = useState(false);
  const [name, setName] = useState(""); const [date, setDate] = useState(""); const [nextDate, setNextDate] = useState("");
  const [vet, setVet] = useState(""); const [clinic, setClinic] = useState("");

  const { data } = useQuery({ queryKey: ["vaccines", petId], queryFn: async () => (await api.pets[":id"].vaccines.$get({ param: { id: petId } })).json() });
  const list = (data as any)?.vaccines ?? [];

  const add = useMutation({
    mutationFn: async () => (await api.pets[":id"].vaccines.$post({ param: { id: petId }, json: { name, date, nextDate: nextDate || undefined, veterinarian: vet || undefined, clinic: clinic || undefined } })).json(),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["vaccines", petId] }); setForm(false); setName(""); setDate(""); setNextDate(""); setVet(""); setClinic(""); },
  });

  return (
    <div className="space-y-3">
      {!form && <button onClick={() => setForm(true)} className="flex items-center gap-1.5 text-[#4ECDC4] font-bold text-sm"><Plus size={16} /> Registar vacina</button>}
      {form && (
        <Card>
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <Field label="Nome *"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Raiva" /></Field>
            <Field label="Data *"><input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} /></Field>
            <Field label="Próxima dose"><input type="date" className={inputCls} value={nextDate} onChange={(e) => setNextDate(e.target.value)} /></Field>
            <Field label="Veterinário"><input className={inputCls} value={vet} onChange={(e) => setVet(e.target.value)} /></Field>
            <Field label="Clínica"><input className={inputCls} value={clinic} onChange={(e) => setClinic(e.target.value)} /></Field>
          </div>
          <div className="flex gap-2">
            <button onClick={() => add.mutate()} disabled={!name || !date || add.isPending} className="bg-[#4ECDC4] text-white font-bold px-4 py-2 rounded-xl text-sm disabled:opacity-50">Guardar</button>
            <button onClick={() => setForm(false)} className="text-gray-500 text-sm font-semibold">Cancelar</button>
          </div>
        </Card>
      )}
      {list.length === 0 && !form ? <EmptyState text="Sem vacinas registadas." /> : list.map((v: any) => (
        <Card key={v.id}>
          <div className="flex justify-between items-start">
            <div>
              <div className="font-bold text-[#1A1A2E]">{v.name}</div>
              <div className="text-xs text-gray-500">{v.date}{v.nextDate ? ` · próxima: ${v.nextDate}` : ""}</div>
              {v.veterinarian && <div className="text-xs text-gray-400">{v.veterinarian}{v.clinic ? ` · ${v.clinic}` : ""}</div>}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ---------------- Consultas ----------------
function AppointmentsTab({ petId }: { petId: string }) {
  const qc = useQueryClient();
  const [form, setForm] = useState(false);
  const [title, setTitle] = useState(""); const [type, setType] = useState("consulta"); const [date, setDate] = useState(""); const [time, setTime] = useState("");
  const [vet, setVet] = useState(""); const [clinic, setClinic] = useState("");

  const { data } = useQuery({ queryKey: ["appointments", petId], queryFn: async () => (await api.appointments.pet[":petId"].$get({ param: { petId } })).json() });
  const list = (data as any)?.appointments ?? [];

  const add = useMutation({
    mutationFn: async () => (await api.appointments.$post({ json: { petId, title, type, date, time: time || undefined, veterinarian: vet || undefined, clinic: clinic || undefined } })).json(),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["appointments", petId] }); setForm(false); setTitle(""); setDate(""); setTime(""); setVet(""); setClinic(""); },
  });
  const del = useMutation({
    mutationFn: async (apId: string) => (await api.appointments[":id"].$delete({ param: { id: apId } })).json(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments", petId] }),
  });

  return (
    <div className="space-y-3">
      {!form && <button onClick={() => setForm(true)} className="flex items-center gap-1.5 text-[#FF6B35] font-bold text-sm"><Plus size={16} /> Marcar consulta</button>}
      {form && (
        <Card>
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <Field label="Título *"><input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Check-up anual" /></Field>
            <Field label="Tipo">
              <select className={inputCls} value={type} onChange={(e) => setType(e.target.value)}>
                <option value="consulta">Consulta</option><option value="vacina">Vacina</option><option value="exame">Exame</option><option value="outro">Outro</option>
              </select>
            </Field>
            <Field label="Data *"><input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} /></Field>
            <Field label="Hora"><input type="time" className={inputCls} value={time} onChange={(e) => setTime(e.target.value)} /></Field>
            <Field label="Veterinário"><input className={inputCls} value={vet} onChange={(e) => setVet(e.target.value)} /></Field>
            <Field label="Clínica"><input className={inputCls} value={clinic} onChange={(e) => setClinic(e.target.value)} /></Field>
          </div>
          <div className="flex gap-2">
            <button onClick={() => add.mutate()} disabled={!title || !date || add.isPending} className="bg-[#FF6B35] text-white font-bold px-4 py-2 rounded-xl text-sm disabled:opacity-50">Guardar</button>
            <button onClick={() => setForm(false)} className="text-gray-500 text-sm font-semibold">Cancelar</button>
          </div>
        </Card>
      )}
      {list.length === 0 && !form ? <EmptyState text="Sem consultas marcadas." /> : list.map((a: any) => (
        <Card key={a.id}>
          <div className="flex justify-between items-start">
            <div>
              <div className="font-bold text-[#1A1A2E]">{a.title}</div>
              <div className="text-xs text-gray-500">{a.date}{a.time ? ` às ${a.time}` : ""}</div>
              {a.clinic && <div className="text-xs text-gray-400">{a.clinic}</div>}
            </div>
            <button onClick={() => del.mutate(a.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ---------------- Peso ----------------
function WeightTab({ petId }: { petId: string }) {
  const qc = useQueryClient();
  const [weight, setWeight] = useState(""); const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const { data } = useQuery({ queryKey: ["weight-logs", petId], queryFn: async () => (await api["weight-logs"].pet[":petId"].$get({ param: { petId } })).json() });
  const list = ((data as any)?.weightLogs ?? []).slice().reverse();

  const add = useMutation({
    mutationFn: async () => (await api["weight-logs"].$post({ json: { petId, weight: parseFloat(weight), date } })).json(),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["weight-logs", petId] }); setWeight(""); },
  });

  return (
    <div className="space-y-3">
      <Card>
        <div className="flex gap-3 items-end flex-wrap">
          <Field label="Peso (kg)"><input type="number" step="0.1" className={inputCls + " w-28"} value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="0.0" /></Field>
          <Field label="Data"><input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} /></Field>
          <button onClick={() => add.mutate()} disabled={!weight || add.isPending} className="bg-[#06D6A0] text-white font-bold px-4 py-2.5 rounded-xl text-sm disabled:opacity-50">Registar</button>
        </div>
      </Card>
      {list.length === 0 ? <EmptyState text="Sem registos de peso." /> : (
        <Card>
          <div className="space-y-2">
            {list.map((w: any) => (
              <div key={w.id} className="flex justify-between text-sm border-b border-[#F8F6FF] last:border-0 pb-2 last:pb-0">
                <span className="text-gray-500">{w.date}</span>
                <span className="font-bold text-[#1A1A2E]">{w.weight} kg</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ---------------- Desparasitação ----------------
function DewormingTab({ petId }: { petId: string }) {
  const qc = useQueryClient();
  const [form, setForm] = useState(false);
  const [product, setProduct] = useState(""); const [date, setDate] = useState(""); const [nextDate, setNextDate] = useState(""); const [type, setType] = useState("internal");

  const { data } = useQuery({ queryKey: ["dewormings", petId], queryFn: async () => (await api.dewormings.pet[":petId"].$get({ param: { petId } })).json() });
  const list = (data as any)?.dewormings ?? [];

  const add = useMutation({
    mutationFn: async () => (await api.dewormings.$post({ json: { petId, product, date: date || undefined, nextDate: nextDate || undefined, type } })).json(),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["dewormings", petId] }); setForm(false); setProduct(""); setDate(""); setNextDate(""); },
  });

  return (
    <div className="space-y-3">
      {!form && <button onClick={() => setForm(true)} className="flex items-center gap-1.5 text-[#F59E0B] font-bold text-sm"><Plus size={16} /> Registar desparasitação</button>}
      {form && (
        <Card>
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <Field label="Produto *"><input className={inputCls} value={product} onChange={(e) => setProduct(e.target.value)} /></Field>
            <Field label="Tipo">
              <select className={inputCls} value={type} onChange={(e) => setType(e.target.value)}>
                <option value="internal">Interna</option><option value="external">Externa</option><option value="both">Ambas</option>
              </select>
            </Field>
            <Field label="Data"><input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} /></Field>
            <Field label="Próxima"><input type="date" className={inputCls} value={nextDate} onChange={(e) => setNextDate(e.target.value)} /></Field>
          </div>
          <div className="flex gap-2">
            <button onClick={() => add.mutate()} disabled={!product || add.isPending} className="bg-[#F59E0B] text-white font-bold px-4 py-2 rounded-xl text-sm disabled:opacity-50">Guardar</button>
            <button onClick={() => setForm(false)} className="text-gray-500 text-sm font-semibold">Cancelar</button>
          </div>
        </Card>
      )}
      {list.length === 0 && !form ? <EmptyState text="Sem registos." /> : list.map((d: any) => (
        <Card key={d.id}>
          <div className="font-bold text-[#1A1A2E]">{d.product}</div>
          <div className="text-xs text-gray-500">{d.date}{d.nextDate ? ` · próxima: ${d.nextDate}` : ""}</div>
        </Card>
      ))}
    </div>
  );
}

// ---------------- Diário ----------------
function DiaryTab({ petId }: { petId: string }) {
  const qc = useQueryClient();
  const [form, setForm] = useState(false);
  const [title, setTitle] = useState(""); const [description, setDescription] = useState(""); const [typeField, setTypeField] = useState("outro");
  const date = new Date().toISOString().slice(0, 10);

  const { data } = useQuery({ queryKey: ["health-logs", petId], queryFn: async () => (await api.health.pet[":petId"].$get({ param: { petId } })).json() });
  const list = (data as any)?.logs ?? [];

  const add = useMutation({
    mutationFn: async () => (await api.health.$post({ json: { petId, date, type: typeField, title, description: description || undefined } })).json(),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["health-logs", petId] }); setForm(false); setTitle(""); setDescription(""); },
  });

  return (
    <div className="space-y-3">
      {!form && <button onClick={() => setForm(true)} className="flex items-center gap-1.5 text-[#EF476F] font-bold text-sm"><Plus size={16} /> Novo registo</button>}
      {form && (
        <Card>
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <Field label="Título *"><input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
            <Field label="Tipo">
              <select className={inputCls} value={typeField} onChange={(e) => setTypeField(e.target.value)}>
                <option value="sintoma">Sintoma</option><option value="comportamento">Comportamento</option><option value="alimentacao">Alimentação</option><option value="medicacao">Medicação</option><option value="outro">Outro</option>
              </select>
            </Field>
          </div>
          <Field label="Descrição"><textarea className={inputCls} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
          <div className="flex gap-2 mt-3">
            <button onClick={() => add.mutate()} disabled={!title || add.isPending} className="bg-[#EF476F] text-white font-bold px-4 py-2 rounded-xl text-sm disabled:opacity-50">Guardar</button>
            <button onClick={() => setForm(false)} className="text-gray-500 text-sm font-semibold">Cancelar</button>
          </div>
        </Card>
      )}
      {list.length === 0 && !form ? <EmptyState text="Sem registos no diário." /> : list.map((l: any) => (
        <Card key={l.id}>
          <div className="font-bold text-[#1A1A2E]">{l.title}</div>
          <div className="text-xs text-gray-500">{l.date} · {l.type}</div>
          {l.description && <div className="text-sm text-gray-600 mt-1">{l.description}</div>}
        </Card>
      ))}
    </div>
  );
}

// ---------------- Documentos ----------------
function DocumentsTab({ petId }: { petId: string }) {
  const qc = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState(""); const [docType, setDocType] = useState("outro");

  const { data } = useQuery({ queryKey: ["documents", petId], queryFn: async () => (await api.documents.pet[":petId"].$get({ param: { petId } })).json() });
  const list = (data as any)?.documents ?? [];

  const add = useMutation({
    mutationFn: async (url: string) => (await api.documents.$post({ json: { petId, type: docType, title: title || "Documento", url } })).json(),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["documents", petId] }); setTitle(""); },
  });

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { uploadImageFile } = await import("../../lib/upload");
      const url = await uploadImageFile(file);
      add.mutate(url);
    } catch {
      alert("Não foi possível carregar o ficheiro.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <Card>
        <div className="flex gap-3 items-end flex-wrap">
          <Field label="Título"><input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Receita, caderneta..." /></Field>
          <Field label="Tipo">
            <select className={inputCls} value={docType} onChange={(e) => setDocType(e.target.value)}>
              <option value="receita">Receita</option><option value="caderneta">Caderneta</option><option value="exame">Exame</option><option value="outro">Outro</option>
            </select>
          </Field>
          <label className="bg-[#8B5CF6] text-white font-bold px-4 py-2.5 rounded-xl text-sm cursor-pointer">
            {uploading ? "A carregar..." : "Carregar imagem"}
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
          </label>
        </div>
      </Card>
      {list.length === 0 ? <EmptyState text="Sem documentos." /> : (
        <div className="grid sm:grid-cols-3 gap-3">
          {list.map((d: any) => (
            <a key={d.id} href={d.url} target="_blank" rel="noreferrer" className="block bg-white rounded-2xl border border-[#F0E8E0] overflow-hidden hover:shadow-md transition">
              <img src={d.url} className="w-full h-32 object-cover" />
              <div className="p-2"><div className="text-xs font-bold text-[#1A1A2E] truncate">{d.title}</div><div className="text-[10px] text-gray-400">{d.type}</div></div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------- QR ----------------
function QrTab({ pet }: { pet: any }) {
  const [copied, setCopied] = useState(false);
  if (!pet?.qrCode) return <EmptyState text="A carregar..." />;
  const url = `${window.location.origin}/pet/${pet.qrCode}`;
  const qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(url)}`;

  return (
    <Card>
      <div className="flex flex-col items-center text-center py-4">
        <img src={qrImg} alt="QR code" className="w-56 h-56 mb-4" />
        <p className="text-sm text-gray-500 mb-4 max-w-sm">Imprima e coloque na coleira. Quem encontrar o {pet.name} digitaliza o código e vê como contactar consigo.</p>
        <div className="flex items-center gap-2 bg-[#FFF9F5] rounded-xl px-3 py-2 text-xs text-gray-500 max-w-full">
          <span className="truncate">{url}</span>
          <button onClick={() => { navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="text-[#FF6B35] shrink-0">
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
      </div>
    </Card>
  );
}

export default function PetDetail() {
  return (
    <RequireAuth>
      <AppShell>
        <PetDetailContent />
      </AppShell>
    </RequireAuth>
  );
}
