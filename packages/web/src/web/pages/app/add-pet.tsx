import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Camera, Loader2 } from "lucide-react";
import { api } from "../../lib/api";
import { uploadImageFile } from "../../lib/upload";
import { RequireAuth, AppShell } from "../../components/AppShell";

const SPECIES = [
  { key: "dog", label: "Cão", emoji: "🐕" },
  { key: "cat", label: "Gato", emoji: "🐱" },
  { key: "bird", label: "Pássaro", emoji: "🦜" },
  { key: "rabbit", label: "Coelho", emoji: "🐰" },
  { key: "other", label: "Outro", emoji: "🐾" },
];
const GENDERS = [{ key: "male", label: "Macho" }, { key: "female", label: "Fêmea" }];

function AddPetContent() {
  const [, setLocation] = useLocation();
  const qc = useQueryClient();

  const [name, setName] = useState("");
  const [species, setSpecies] = useState("dog");
  const [breed, setBreed] = useState("");
  const [gender, setGender] = useState("male");
  const [birthDate, setBirthDate] = useState("");
  const [microchip, setMicrochip] = useState("");
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
    setUploading(true);
    try {
      const url = await uploadImageFile(file);
      setPhotoUrl(url);
    } catch {
      setError("Não foi possível carregar a foto.");
      setPhoto(null);
    } finally {
      setUploading(false);
    }
  }

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.pets.$post({
        json: { name, species, breed: breed || undefined, gender, birthDate: birthDate || undefined, microchip: microchip || undefined, notes: notes || undefined, photoUrl: photoUrl || undefined },
      });
      if (!res.ok) throw new Error("Falha ao guardar");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pets"] });
      setLocation("/app");
    },
    onError: () => setError("Não foi possível adicionar o animal."),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("O nome é obrigatório.");
    mutation.mutate();
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-extrabold text-[#1A1A2E] mb-6">Adicionar Animal</h1>

      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5 text-sm text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#F0E8E0] p-6 space-y-5">
        <label className="w-24 h-24 rounded-full bg-[#FFF9F5] border-2 border-dashed border-[#F0E8E0] flex items-center justify-center mx-auto cursor-pointer overflow-hidden relative">
          {photo ? (
            <img src={photo} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center text-[#FF6B35]">
              <Camera size={24} />
              <span className="text-[10px] font-semibold mt-1">Foto</span>
            </div>
          )}
          {uploading && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><Loader2 className="animate-spin text-white" size={20} /></div>}
          <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        </label>

        <div>
          <label className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">Nome *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Bola, Luna..." className="w-full border border-[#F0E8E0] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#1A1A2E] mb-2">Espécie *</label>
          <div className="flex gap-2 flex-wrap">
            {SPECIES.map((s) => (
              <button type="button" key={s.key} onClick={() => setSpecies(s.key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-1.5 text-sm font-semibold ${species === s.key ? "bg-[#FF6B35] text-white border-[#FF6B35]" : "bg-white border-[#F0E8E0] text-[#1A1A2E]"}`}>
                <span>{s.emoji}</span>{s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#1A1A2E] mb-2">Sexo</label>
          <div className="flex gap-2">
            {GENDERS.map((g) => (
              <button type="button" key={g.key} onClick={() => setGender(g.key)}
                className={`flex-1 py-2.5 rounded-xl border-1.5 font-semibold ${gender === g.key ? "bg-[#FF6B35] text-white border-[#FF6B35]" : "bg-white border-[#F0E8E0] text-[#1A1A2E]"}`}>
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">Raça</label>
          <input value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="Ex: Labrador, Siamês..." className="w-full border border-[#F0E8E0] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">Data de nascimento</label>
            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full border border-[#F0E8E0] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">Nº Microchip</label>
            <input value={microchip} onChange={(e) => setMicrochip(e.target.value)} placeholder="620098..." className="w-full border border-[#F0E8E0] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">Notas</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Alergias, condições especiais..." rows={3} className="w-full border border-[#F0E8E0] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30" />
        </div>

        <button type="submit" disabled={mutation.isPending} className="w-full bg-[#FF6B35] text-white font-bold py-3.5 rounded-xl hover:bg-[#e55a24] transition disabled:opacity-60">
          {mutation.isPending ? "A guardar..." : "Guardar Animal"}
        </button>
      </form>
    </div>
  );
}

export default function AddPet() {
  return (
    <RequireAuth>
      <AppShell>
        <AddPetContent />
      </AppShell>
    </RequireAuth>
  );
}
