import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChevronRight, Plus } from "lucide-react";
import { api as apiTyped } from "../../lib/api";
import { RequireAuth, AppShell } from "../../components/AppShell";
const api: any = apiTyped;

const SPECIES_EMOJI: Record<string, string> = { dog: "🐕", cat: "🐱", bird: "🦜", rabbit: "🐰", other: "🐾" };
const SPECIES_COLOR: Record<string, string> = { dog: "#FF6B35", cat: "#8B5CF6", bird: "#06D6A0", rabbit: "#F59E0B", other: "#4ECDC4" };

function HealthHubContent() {
  const { data, isLoading } = useQuery({ queryKey: ["pets"], queryFn: async () => (await api.pets.$get()).json() });
  const pets = (data as any)?.pets ?? [];

  return (
    <div>
      <div className="bg-[#4ECDC4] rounded-3xl p-6 mb-6 text-white">
        <h1 className="text-2xl font-extrabold">Saúde 🏥</h1>
        <p className="opacity-90 mt-1 text-sm">Vacinas, consultas, peso, desparasitação, diário e documentos — tudo por animal.</p>
      </div>

      <h2 className="font-extrabold text-[#1A1A2E] mb-3">Os meus animais</h2>
      {isLoading ? (
        <p className="text-gray-400">A carregar...</p>
      ) : pets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#F0E8E0] p-8 text-center">
          <p className="text-gray-500 mb-4">Adicione um animal para gerir a sua saúde.</p>
          <Link href="/app/pets/novo"><a className="inline-flex items-center gap-1.5 bg-[#FF6B35] text-white font-bold px-4 py-2 rounded-xl text-sm"><Plus size={16} /> Adicionar animal</a></Link>
        </div>
      ) : (
        <div className="space-y-2">
          {pets.map((pet: any) => {
            const emoji = SPECIES_EMOJI[pet.species] ?? "🐾";
            const color = SPECIES_COLOR[pet.species] ?? "#FF6B35";
            return (
              <Link key={pet.id} href={`/app/pet/${pet.id}`}>
                <a className="bg-white rounded-2xl border border-[#F0E8E0] p-4 flex items-center gap-3 hover:shadow-md transition">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: color + "20" }}>{emoji}</div>
                  <div className="flex-1">
                    <div className="font-bold text-[#1A1A2E] text-sm">{pet.name}</div>
                    <div className="text-xs text-gray-400">{pet.breed ?? pet.species}</div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </a>
              </Link>
            );
          })}
        </div>
      )}

      <h2 className="font-extrabold text-[#1A1A2E] mb-3 mt-8">Ferramentas de saúde</h2>
      <div className="grid grid-cols-2 gap-3">
        <Link href="/app/primeiros-socorros">
          <a className="bg-white rounded-2xl border border-[#F0E8E0] p-4 hover:shadow-md transition flex flex-col gap-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-red-50">🩺</div>
            <div>
              <p className="font-bold text-[#1A1A2E] text-sm">Primeiros Socorros</p>
              <p className="text-xs text-gray-400">Guia de emergência</p>
            </div>
          </a>
        </Link>
        <Link href="/app/farmacia">
          <a className="bg-white rounded-2xl border border-[#F0E8E0] p-4 hover:shadow-md transition flex flex-col gap-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: "#F3EEFF" }}>💊</div>
            <div>
              <p className="font-bold text-[#1A1A2E] text-sm">Farmácia</p>
              <p className="text-xs text-gray-400">Produtos recomendados</p>
            </div>
          </a>
        </Link>
        <Link href="/app/guia-racas">
          <a className="bg-white rounded-2xl border border-[#F0E8E0] p-4 hover:shadow-md transition flex flex-col gap-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: "#FFF0EB" }}>📖</div>
            <div>
              <p className="font-bold text-[#1A1A2E] text-sm">Guia de Raças</p>
              <p className="text-xs text-gray-400">124 raças de animais</p>
            </div>
          </a>
        </Link>
        <Link href="/app/consulta">
          <a className="bg-white rounded-2xl border border-[#F0E8E0] p-4 hover:shadow-md transition flex flex-col gap-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: "#E8FAF9" }}>🎥</div>
            <div>
              <p className="font-bold text-[#1A1A2E] text-sm">Consulta Online</p>
              <p className="text-xs text-gray-400">Videochamada com vet</p>
            </div>
          </a>
        </Link>
      </div>
    </div>
  );
}

export default function HealthHub() {
  return (
    <RequireAuth>
      <AppShell>
        <HealthHubContent />
      </AppShell>
    </RequireAuth>
  );
}
