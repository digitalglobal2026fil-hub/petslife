import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { api as apiTyped } from "../../lib/api";
import { uploadImageFile } from "../../lib/upload";
import { RequireAuth, AppShell } from "../../components/AppShell";
const api: any = apiTyped;

function AlbumContent() {
  const qc = useQueryClient();
  const { data: petsData } = useQuery({ queryKey: ["pets"], queryFn: async () => (await api.pets.$get()).json() });
  const pets = (petsData as any)?.pets ?? [];
  const [petId, setPetId] = useState<string>("");
  const activePetId = petId || pets[0]?.id;
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");

  const { data } = useQuery({
    queryKey: ["photos", activePetId],
    queryFn: async () => (await api.photos.pet[":petId"].$get({ param: { petId: activePetId } })).json(),
    enabled: !!activePetId,
  });
  const photos = (data as any)?.photos ?? [];

  const add = useMutation({
    mutationFn: async (url: string) => (await api.photos.$post({ json: { petId: activePetId, url, caption: caption || undefined } })).json(),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["photos", activePetId] }); setCaption(""); },
  });
  const del = useMutation({
    mutationFn: async (id: string) => (await api.photos[":id"].$delete({ param: { id } })).json(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["photos", activePetId] }),
  });

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !activePetId) return;
    setUploading(true);
    try {
      const url = await uploadImageFile(file);
      add.mutate(url);
    } catch {
      alert("Não foi possível carregar a foto.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  if (pets.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-[#F0E8E0] p-10 text-center max-w-md mx-auto mt-10">
        <div className="text-5xl mb-3">📸</div>
        <p className="text-gray-500">Adicione um animal primeiro para criar o álbum.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-extrabold text-[#1A1A2E]">Álbum de Memórias 📸</h1>
        <select className="border border-[#F0E8E0] rounded-xl px-3 py-2 text-sm" value={activePetId} onChange={(e) => setPetId(e.target.value)}>
          {pets.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <label className="flex items-center justify-center gap-2 border-2 border-dashed border-[#F0E8E0] rounded-2xl py-6 mb-6 cursor-pointer text-[#FF6B35] font-bold hover:bg-[#FFF9F5] transition">
        <Plus size={18} /> {uploading ? "A carregar..." : "Adicionar foto"}
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
      </label>

      {photos.length === 0 ? (
        <div className="text-center text-gray-400 py-10">Ainda sem fotos neste álbum.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((p: any) => (
            <div key={p.id} className="relative group rounded-2xl overflow-hidden bg-white border border-[#F0E8E0] aspect-square">
              <img src={p.url} className="w-full h-full object-cover" />
              <button onClick={() => del.mutate(p.id)} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Album() {
  return (
    <RequireAuth>
      <AppShell>
        <AlbumContent />
      </AppShell>
    </RequireAuth>
  );
}
