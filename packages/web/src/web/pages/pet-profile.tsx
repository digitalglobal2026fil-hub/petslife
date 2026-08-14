import { useEffect, useState } from "react";
import { PawPrint, Phone, AlertTriangle, MapPin, Check, Loader2 } from "lucide-react";

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
  const code = getCode();

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

        {/* Enviar localização ao dono */}
        <FinderLocation qrCode={code} petName={pet.name} />
      </div>

      <p className="text-xs text-gray-300 mt-8">Powered by PetsLife 🐾</p>
    </div>
  );
}

/**
 * Quem encontra o animal pode enviar a sua localização ao dono.
 * Usa a geolocalização do browser (pede permissão) — não precisa de app nem login.
 */
function FinderLocation({ qrCode, petName }: { qrCode: string; petName?: string }) {
  const [state, setState] = useState<"idle" | "locating" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [open, setOpen] = useState(false);

  async function send(lat?: number, lng?: number, accuracy?: number) {
    setState("sending");
    try {
      const res = await fetch("/api/pet-scans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrCode, lat, lng, accuracy, finderName: name || null, finderPhone: phone || null }),
      });
      if (!res.ok) throw new Error("falhou");
      setState("sent");
    } catch {
      setError("Não foi possível enviar. Verifique a ligação à internet.");
      setState("error");
    }
  }

  function locateAndSend() {
    setError("");
    if (!navigator.geolocation) {
      send();
      return;
    }
    setState("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => send(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy),
      () => {
        // Sem permissão? envia mesmo assim, só sem coordenadas
        send();
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
    );
  }

  if (state === "sent") {
    return (
      <div className="mt-5 bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
        <Check size={22} className="mx-auto text-green-600 mb-1" />
        <p className="font-bold text-green-700 text-sm">Localização enviada!</p>
        <p className="text-xs text-green-600 mt-1">
          O dono {petName ? `d${petName.endsWith("a") ? "a" : "o"} ${petName}` : ""} vai receber onde está.
          Obrigado pela ajuda 💛
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5 border-t border-[#F0E8E0] pt-5">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center gap-2 w-full bg-[#FFF5F0] text-[#FF6B35] font-bold rounded-2xl py-3.5 text-sm border-2 border-[#FF6B35]/20 hover:bg-[#FFEDE4] transition-colors"
        >
          <MapPin size={17} />
          Avisar o dono onde estou
        </button>
      ) : (
        <div className="text-left">
          <p className="text-xs text-gray-500 mb-3">
            Envie a sua localização ao dono para ele vir buscar o animal. Os seus dados são opcionais.
          </p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="O seu nome (opcional)"
            className="w-full border border-[#F0E8E0] rounded-xl px-3 py-2.5 text-sm mb-2 outline-none focus:border-[#FF6B35]"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="O seu telefone (opcional)"
            inputMode="tel"
            className="w-full border border-[#F0E8E0] rounded-xl px-3 py-2.5 text-sm mb-3 outline-none focus:border-[#FF6B35]"
          />
          {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
          <button
            onClick={locateAndSend}
            disabled={state === "locating" || state === "sending"}
            className="flex items-center justify-center gap-2 w-full bg-[#FF6B35] text-white font-bold rounded-2xl py-3.5 text-sm disabled:opacity-60"
          >
            {state === "locating" || state === "sending" ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                {state === "locating" ? "A obter localização..." : "A enviar..."}
              </>
            ) : (
              <>
                <MapPin size={17} />
                Enviar a minha localização
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
