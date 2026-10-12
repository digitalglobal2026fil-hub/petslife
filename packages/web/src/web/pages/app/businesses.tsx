import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Phone, MapPin, Star, Loader2 } from "lucide-react";
import { api as apiTyped } from "../../lib/api";
import { RequireAuth, AppShell } from "../../components/AppShell";
const api: any = apiTyped;

const TYPES = [
  { key: "clinica", label: "Clínica" }, { key: "petshop", label: "Petshop" }, { key: "tosquiador", label: "Tosquiador" },
  { key: "hotel", label: "Hotel" }, { key: "treino", label: "Treino" }, { key: "outro", label: "Outro" },
];
const inputCls = "w-full border border-[#F0E8E0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30";

function NewBusinessForm({ onDone }: { onDone: () => void }) {
  const qc = useQueryClient();
  const [name, setName] = useState(""); const [type, setType] = useState("clinica"); const [phone, setPhone] = useState("");
  const [address, setAddress] = useState(""); const [city, setCity] = useState(""); const [description, setDescription] = useState("");

  const create = useMutation({
    mutationFn: async () => (await api.businesses.$post({ json: { name, type, phone: phone || undefined, address: address || undefined, city: city || undefined, description: description || undefined } })).json(),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["businesses"] }); onDone(); },
  });

  return (
    <div className="bg-white rounded-2xl border border-[#F0E8E0] p-4 mb-6 space-y-3">
      <input className={inputCls} placeholder="Nome *" value={name} onChange={(e) => setName(e.target.value)} />
      <select className={inputCls} value={type} onChange={(e) => setType(e.target.value)}>
        {TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
      </select>
      <div className="grid sm:grid-cols-2 gap-3">
        <input className={inputCls} placeholder="Telefone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input className={inputCls} placeholder="Cidade" value={city} onChange={(e) => setCity(e.target.value)} />
      </div>
      <input className={inputCls} placeholder="Endereço" value={address} onChange={(e) => setAddress(e.target.value)} />
      <textarea className={inputCls} rows={2} placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} />
      <div className="flex gap-2">
        <button onClick={() => name && create.mutate()} disabled={!name || create.isPending} className="bg-[#FF6B35] text-white font-bold px-4 py-2 rounded-xl text-sm disabled:opacity-50">Registar negócio</button>
        <button onClick={onDone} className="text-gray-500 text-sm font-semibold">Cancelar</button>
      </div>
    </div>
  );
}

function BusinessesContent() {
  const [form, setForm] = useState(false);
  const [filter, setFilter] = useState("");
  const { data, isLoading } = useQuery({ queryKey: ["businesses"], queryFn: async () => (await api.businesses.$get()).json() });
  const list = ((data as any)?.businesses ?? []).filter((b: any) => !filter || b.type === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-extrabold text-[#1A1A2E]">Negócios 🏪</h1>
        <button onClick={() => setForm(!form)} className="flex items-center gap-1.5 bg-[#FF6B35] text-white font-bold px-4 py-2 rounded-xl text-sm"><Plus size={16} /> Registar negócio</button>
      </div>

      {form && <NewBusinessForm onDone={() => setForm(false)} />}

      <div className="flex gap-2 mb-5 overflow-x-auto">
        <button onClick={() => setFilter("")} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${!filter ? "bg-[#FF6B35] text-white" : "bg-white border border-[#F0E8E0]"}`}>Todos</button>
        {TYPES.map((t) => (
          <button key={t.key} onClick={() => setFilter(t.key)} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${filter === t.key ? "bg-[#FF6B35] text-white" : "bg-white border border-[#F0E8E0]"}`}>{t.label}</button>
        ))}
      </div>

      {isLoading ? <Loader2 className="animate-spin text-gray-300 mx-auto" /> : list.length === 0 ? (
        <p className="text-center text-gray-400 py-10">Sem negócios registados nesta categoria.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((b: any) => (
            <div key={b.id} className="bg-white rounded-2xl border border-[#F0E8E0] p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-11 h-11 rounded-xl bg-[#FFF0EB] flex items-center justify-center text-xl shrink-0 overflow-hidden">
                  {b.logoUrl ? <img src={b.logoUrl} className="w-full h-full object-cover" /> : "🏪"}
                </div>
                <div>
                  <div className="font-bold text-[#1A1A2E] text-sm">{b.name}</div>
                  <div className="text-xs text-gray-400">{TYPES.find((t) => t.key === b.type)?.label ?? b.type}</div>
                </div>
              </div>
              {b.description && <p className="text-xs text-gray-500 mb-2 line-clamp-2">{b.description}</p>}
              <div className="space-y-1 text-xs text-gray-500">
                {b.address && <div className="flex items-center gap-1.5"><MapPin size={12} />{b.address}{b.city ? `, ${b.city}` : ""}</div>}
                {b.phone && <div className="flex items-center gap-1.5"><Phone size={12} />{b.phone}</div>}
                {b.reviewsCount > 0 && <div className="flex items-center gap-1.5"><Star size={12} className="text-yellow-500" />{b.averageRating?.toFixed(1)} ({b.reviewsCount})</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Businesses() {
  return (
    <RequireAuth>
      <AppShell>
        <BusinessesContent />
      </AppShell>
    </RequireAuth>
  );
}
