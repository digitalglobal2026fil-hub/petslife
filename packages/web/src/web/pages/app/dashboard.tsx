import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, ChevronRight, QrCode } from "lucide-react";
import { api } from "../../lib/api";
import { RequireAuth, AppShell } from "../../components/AppShell";

const SPECIES_EMOJI: Record<string, string> = { dog: "🐕", cat: "🐱", bird: "🦜", rabbit: "🐰", other: "🐾" };
const SPECIES_COLOR: Record<string, string> = { dog: "#FF6B35", cat: "#8B5CF6", bird: "#06D6A0", rabbit: "#F59E0B", other: "#4ECDC4" };

function DashboardContent() {
  const { data, isLoading } = useQuery({
    queryKey: ["pets"],
    queryFn: async () => (await api.pets.$get()).json(),
  });
  const pets = (data as any)?.pets ?? [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#1A1A2E]">Os meus animais 🐾</h1>
        <p className="text-gray-500 mt-1">Gira a saúde, fotos e tudo sobre os seus animais, aqui no computador.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {isLoading ? (
          <div className="text-gray-400">A carregar...</div>
        ) : pets.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl border border-[#F0E8E0] p-10 text-center">
            <div className="text-5xl mb-3">🐾</div>
            <p className="text-gray-500 mb-5">Ainda não tem nenhum animal registado.</p>
            <Link href="/app/pets/novo">
              <a className="inline-flex items-center gap-2 bg-[#FF6B35] text-white font-bold px-5 py-3 rounded-xl hover:bg-[#e55a24] transition">
                <Plus size={18} /> Adicionar animal
              </a>
            </Link>
          </div>
        ) : (
          pets.map((pet: any) => {
            const emoji = SPECIES_EMOJI[pet.species] ?? "🐾";
            const color = SPECIES_COLOR[pet.species] ?? "#FF6B35";
            return (
              <Link key={pet.id} href={`/app/pet/${pet.id}`}>
                <a className="bg-white rounded-3xl border border-[#F0E8E0] p-5 flex items-center gap-4 hover:shadow-md transition">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shrink-0 overflow-hidden" style={{ backgroundColor: color + "20" }}>
                    {pet.photoUrl ? <img src={pet.photoUrl} className="w-full h-full object-cover" /> : emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-[#1A1A2E]">{pet.name}</div>
                    <div className="text-sm text-gray-400">{pet.breed || pet.species}</div>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 shrink-0" />
                </a>
              </Link>
            );
          })
        )}
      </div>

      {pets.length > 0 && (
        <Link href="/app/pets/novo">
          <a className="inline-flex items-center gap-2 text-[#FF6B35] font-bold mb-10 hover:underline">
            <Plus size={18} /> Adicionar outro animal
          </a>
        </Link>
      )}

      <div className="grid sm:grid-cols-3 gap-4">
        <Link href="/app/saude">
          <a className="bg-[#E8FAF9] rounded-2xl p-5 flex items-center gap-3 hover:shadow-md transition">
            <span className="text-2xl">🏥</span>
            <div>
              <div className="font-extrabold text-[#1A1A2E] text-sm">Saúde</div>
              <div className="text-xs text-gray-500">Vacinas, consultas, peso</div>
            </div>
          </a>
        </Link>
        <Link href="/app/album">
          <a className="bg-purple-50 rounded-2xl p-5 flex items-center gap-3 hover:shadow-md transition">
            <span className="text-2xl">📸</span>
            <div>
              <div className="font-extrabold text-[#1A1A2E] text-sm">Álbum</div>
              <div className="text-xs text-gray-500">Fotos e memórias</div>
            </div>
          </a>
        </Link>
        <Link href="/app/comunidade">
          <a className="bg-blue-50 rounded-2xl p-5 flex items-center gap-3 hover:shadow-md transition">
            <span className="text-2xl">👥</span>
            <div>
              <div className="font-extrabold text-[#1A1A2E] text-sm">Comunidade</div>
              <div className="text-xs text-gray-500">Partilhe momentos</div>
            </div>
          </a>
        </Link>
      </div>

      {pets.length > 0 && (
        <div className="mt-6 bg-white rounded-2xl border border-[#F0E8E0] p-5 flex items-center gap-3">
          <QrCode size={28} className="text-[#4ECDC4]" />
          <div className="flex-1">
            <div className="font-bold text-[#1A1A2E] text-sm">QR anti-perda</div>
            <div className="text-xs text-gray-500">Abra o animal e veja o separador "QR" para imprimir ou partilhar.</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  return (
    <RequireAuth>
      <AppShell>
        <DashboardContent />
      </AppShell>
    </RequireAuth>
  );
}
