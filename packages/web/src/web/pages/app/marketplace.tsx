import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { api as apiTyped } from "../../lib/api";
import { authClient } from "../../lib/auth";
import { uploadImageFile } from "../../lib/upload";
import { RequireAuth, AppShell } from "../../components/AppShell";
const api: any = apiTyped;

const CATEGORIES = [
  { key: "alimentacao", label: "Alimentação" }, { key: "brinquedos", label: "Brinquedos" },
  { key: "acessorios", label: "Acessórios" }, { key: "servicos", label: "Serviços" }, { key: "outro", label: "Outro" },
];
const inputCls = "w-full border border-[#F0E8E0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30";

function NewListingForm({ onDone }: { onDone: () => void }) {
  const qc = useQueryClient();
  const [title, setTitle] = useState(""); const [price, setPrice] = useState(""); const [category, setCategory] = useState("outro");
  const [description, setDescription] = useState(""); const [location, setLocation] = useState(""); const [contact, setContact] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null); const [uploading, setUploading] = useState(false);

  const create = useMutation({
    mutationFn: async () => (await api.marketplace.$post({ json: { title, price: parseFloat(price) || 0, category, description: description || undefined, location: location || undefined, contact: contact || undefined, imageUrl: imageUrl || undefined } })).json(),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["marketplace"] }); onDone(); },
  });

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try { setImageUrl(await uploadImageFile(file)); } catch { alert("Erro ao carregar imagem."); } finally { setUploading(false); }
  }

  return (
    <div className="bg-white rounded-2xl border border-[#F0E8E0] p-4 mb-6 space-y-3">
      <input className={inputCls} placeholder="Título *" value={title} onChange={(e) => setTitle(e.target.value)} />
      <div className="grid sm:grid-cols-2 gap-3">
        <input className={inputCls} type="number" step="0.01" placeholder="Preço (€)" value={price} onChange={(e) => setPrice(e.target.value)} />
        <select className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
        </select>
      </div>
      <textarea className={inputCls} rows={2} placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} />
      <div className="grid sm:grid-cols-2 gap-3">
        <input className={inputCls} placeholder="Localização" value={location} onChange={(e) => setLocation(e.target.value)} />
        <input className={inputCls} placeholder="Contacto" value={contact} onChange={(e) => setContact(e.target.value)} />
      </div>
      <label className="inline-flex items-center gap-1.5 text-[#FF6B35] text-sm font-semibold cursor-pointer">
        {uploading ? <Loader2 className="animate-spin" size={14} /> : null} {imageUrl ? "Imagem carregada ✓" : "Adicionar foto"}
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
      </label>
      <div className="flex gap-2">
        <button onClick={() => title && create.mutate()} disabled={!title || create.isPending} className="bg-[#FF6B35] text-white font-bold px-4 py-2 rounded-xl text-sm disabled:opacity-50">Publicar anúncio</button>
        <button onClick={onDone} className="text-gray-500 text-sm font-semibold">Cancelar</button>
      </div>
    </div>
  );
}

function MarketplaceContent() {
  const qc = useQueryClient();
  const { data: session } = authClient.useSession();
  const myId = (session as any)?.user?.id;
  const [form, setForm] = useState(false);
  const [filter, setFilter] = useState("");

  const { data, isLoading } = useQuery({ queryKey: ["marketplace"], queryFn: async () => (await api.marketplace.$get()).json() });
  const listings = ((data as any)?.listings ?? []).filter((l: any) => !filter || l.category === filter);

  const del = useMutation({
    mutationFn: async (id: string) => (await api.marketplace[":id"].$delete({ param: { id } })).json(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["marketplace"] }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-extrabold text-[#1A1A2E]">Marketplace 🛍️</h1>
        <button onClick={() => setForm(!form)} className="flex items-center gap-1.5 bg-[#FF6B35] text-white font-bold px-4 py-2 rounded-xl text-sm"><Plus size={16} /> Novo anúncio</button>
      </div>

      {form && <NewListingForm onDone={() => setForm(false)} />}

      <div className="flex gap-2 mb-5 overflow-x-auto">
        <button onClick={() => setFilter("")} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${!filter ? "bg-[#FF6B35] text-white" : "bg-white border border-[#F0E8E0]"}`}>Todos</button>
        {CATEGORIES.map((c) => (
          <button key={c.key} onClick={() => setFilter(c.key)} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${filter === c.key ? "bg-[#FF6B35] text-white" : "bg-white border border-[#F0E8E0]"}`}>{c.label}</button>
        ))}
      </div>

      {isLoading ? <Loader2 className="animate-spin text-gray-300 mx-auto" /> : listings.length === 0 ? (
        <p className="text-center text-gray-400 py-10">Sem anúncios nesta categoria.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((l: any) => (
            <div key={l.id} className="bg-white rounded-2xl border border-[#F0E8E0] overflow-hidden">
              <div className="h-36 bg-[#FFF0EB] flex items-center justify-center text-4xl">
                {l.imageUrl ? <img src={l.imageUrl} className="w-full h-full object-cover" /> : "🛍️"}
              </div>
              <div className="p-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="font-bold text-[#1A1A2E] text-sm">{l.title}</div>
                  {myId === l.userId && <button onClick={() => del.mutate(l.id)} className="text-gray-300 hover:text-red-500 shrink-0"><Trash2 size={14} /></button>}
                </div>
                <div className="text-[#FF6B35] font-extrabold mt-1">{l.price?.toFixed(2)} €</div>
                {l.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{l.description}</p>}
                {l.contact && <p className="text-xs text-gray-400 mt-2">📞 {l.contact}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Marketplace() {
  return (
    <RequireAuth>
      <AppShell>
        <MarketplaceContent />
      </AppShell>
    </RequireAuth>
  );
}
