import { useEffect, useState } from "react";
import { PawPrint, Phone, AlertTriangle } from "lucide-react";

const EMOJI: Record<string, string> = {
  dog: "🐕", cat: "🐱", bird: "🐦", rabbit: "🐰", fish: "🐟",
  hamster: "🐹", turtle: "🐢", reptile: "🦎", other: "🐾",
};

function getCode(): string {
  const parts = window.location.pathname.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

export default function PetProfilePage() {
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const code = getCode();
    if (!code) { setNotFound(true); setLoading(false); return; }
    fetch(`/api/pets/qr/${code}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => { setPet(d.pet); setLoading(false); })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">A carregar...</p>
      </div>
    </div>
  );

  if (notFound || !pet) return (
    <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-4">🐾</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Animal não encontrado</h1>
        <p className="text-gray-500">Este QR code não corresponde a nenhum animal registado.</p>
      </div>
    </div>
  );

  const emoji = EMOJI[pet.species?.toLowerCase()] ?? "🐾";

  return (
    <div className="min-h-screen bg-[#FFF9F5] flex flex-col items-center justify-center px-4 py-10">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="bg-[#F5EDE4] rounded-xl p-1.5">
          <PawPrint size={20} color="#8B5E3C" />
        </div>
        <span className="font-bold text-lg text-[#FF6B35]">PetsLife</span>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-[#F0E8E0] p-8 max-w-sm w-full text-center">
        {/* Foto */}
        <div className="w-28 h-28 rounded-full mx-auto mb-4 overflow-hidden border-4 border-[#FF6B35]/20 bg-[#F5EDE4] flex items-center justify-center">
          {pet.photoUrl ? (
            <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-5xl">{emoji}</span>
          )}
        </div>

        {/* Mensagem */}
        <p className="text-3xl mb-2">🐾</p>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Olá! Encontrou-me!</h1>
        <p className="text-gray-500 text-sm mb-1">O meu nome é <span className="font-bold text-[#FF6B35]">{pet.name}</span></p>

        {pet.isLost && (
          <div className="mt-3 inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm animate-pulse">
            <AlertTriangle size={15} />
            Estou perdido(a)!
          </div>
        )}

        <div className="w-full h-px bg-[#F0E8E0] my-6" />

        <p className="text-gray-600 text-sm mb-4">Por favor contacte o meu dono 💛</p>

        {/* Dono */}
        {pet.ownerName && (
          <div className="bg-[#FFF5F0] rounded-2xl p-4 mb-4 text-left">
            <p className="text-xs text-gray-400 mb-1">Dono registado</p>
            <p className="font-bold text-gray-800 text-base">{pet.ownerName}</p>
          </div>
        )}

        {/* Botão ligar */}
        {pet.ownerPhone ? (
          <a href={`tel:${pet.ownerPhone}`}
            className="flex items-center justify-center gap-2 bg-[#FF6B35] text-white font-bold rounded-2xl py-4 text-base w-full hover:bg-[#e85a25] transition-colors">
            <Phone size={18} />
            Ligar ao dono
          </a>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-4 text-gray-400 text-sm">
            Sem contacto disponível. Por favor entregue numa clínica veterinária.
          </div>
        )}
      </div>

      <p className="text-xs text-gray-300 mt-8">Powered by PetsLife 🐾</p>
    </div>
  );
}
