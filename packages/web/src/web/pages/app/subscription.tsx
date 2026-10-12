import { useSubscriptionGate } from "../../lib/useSubscriptionGate";
import { RequireAuth, AppShell } from "../../components/AppShell";

const MONTHLY_LINK = "https://buy.stripe.com/cNi3cugz46Xs2pQ1Oo4sE02";
const ANNUAL_LINK = "https://buy.stripe.com/eVq4gyfv081w3tU9gQ4sE03";

function SubscriptionContent() {
  const gate = useSubscriptionGate();

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-extrabold text-[#1A1A2E] mb-2">Subscrição</h1>

      <div className="bg-white rounded-2xl border border-[#F0E8E0] p-5 mb-6">
        {gate.isLoading ? (
          <p className="text-gray-400 text-sm">A carregar...</p>
        ) : gate.isTester ? (
          <p className="text-sm text-[#06D6A0] font-bold">✓ Conta de testador — acesso total e sem limites.</p>
        ) : gate.isActive ? (
          <p className="text-sm text-[#06D6A0] font-bold">✓ Subscrição activa ({gate.plan}){gate.expiresAt ? ` · renova a ${gate.expiresAt.toLocaleDateString("pt-PT")}` : ""}</p>
        ) : gate.isTrial ? (
          <p className="text-sm text-[#1A1A2E]">Está no período de teste grátis — restam <b>{gate.daysLeft} dia(s)</b>.</p>
        ) : (
          <p className="text-sm text-red-500 font-bold">O seu período grátis terminou. Assine para continuar a usar o PetsLife.</p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-[#F0E8E0] p-5">
          <div className="text-xs text-gray-400 font-semibold mb-1">MENSAL</div>
          <div className="text-2xl font-extrabold text-[#1A1A2E] mb-3">3,99 € <span className="text-sm font-normal text-gray-400">/mês</span></div>
          <a href={MONTHLY_LINK} target="_blank" rel="noopener noreferrer" className="block text-center bg-[#FF6B35] text-white font-bold py-2.5 rounded-xl hover:bg-[#e55a24] transition">Assinar</a>
        </div>
        <div className="bg-white rounded-2xl border-2 border-[#FF6B35] p-5 relative">
          <div className="absolute -top-2.5 right-4 bg-[#FF6B35] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">POUPE 58%</div>
          <div className="text-xs text-gray-400 font-semibold mb-1">ANUAL</div>
          <div className="text-2xl font-extrabold text-[#1A1A2E] mb-3">19,99 € <span className="text-sm font-normal text-gray-400">/ano</span></div>
          <a href={ANNUAL_LINK} target="_blank" rel="noopener noreferrer" className="block text-center bg-[#FF6B35] text-white font-bold py-2.5 rounded-xl hover:bg-[#e55a24] transition">Assinar</a>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">Pagamento processado de forma segura pela Stripe. Se recebeu um código de acesso de um parceiro, use o link que lhe foi enviado para o activar.</p>
    </div>
  );
}

export default function Subscription() {
  return (
    <RequireAuth>
      <AppShell>
        <SubscriptionContent />
      </AppShell>
    </RequireAuth>
  );
}
