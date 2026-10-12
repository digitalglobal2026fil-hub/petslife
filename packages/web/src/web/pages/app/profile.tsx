import { useLocation, Link } from "wouter";
import { LogOut, Shield, Trash2, CreditCard } from "lucide-react";
import { authClient, clearToken } from "../../lib/auth";
import { useSubscriptionGate } from "../../lib/useSubscriptionGate";
import { RequireAuth, AppShell } from "../../components/AppShell";

const ADMIN_EMAILS = ["digitalglobal2026fil@gmail.com", "aleclikes@outlook.pt"];

function ProfileContent() {
  const { data: session } = authClient.useSession();
  const [, setLocation] = useLocation();
  const gate = useSubscriptionGate();
  const user = (session as any)?.user;
  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase());

  async function handleLogout() {
    await authClient.signOut();
    clearToken();
    setLocation("/sign-in");
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-extrabold text-[#1A1A2E] mb-6">Perfil</h1>

      <div className="bg-white rounded-2xl border border-[#F0E8E0] p-5 mb-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-[#FF6B35] text-white font-extrabold text-xl flex items-center justify-center">
          {(user?.name ?? user?.email ?? "?")[0]?.toUpperCase()}
        </div>
        <div>
          <div className="font-bold text-[#1A1A2E]">{user?.name || "Utilizador"}</div>
          <div className="text-sm text-gray-500">{user?.email}</div>
        </div>
      </div>

      <Link href="/app/subscricao">
        <a className="bg-white rounded-2xl border border-[#F0E8E0] p-4 flex items-center gap-3 mb-3 hover:shadow-md transition">
          <CreditCard size={18} className="text-[#FF6B35]" />
          <div className="flex-1">
            <div className="font-bold text-[#1A1A2E] text-sm">Subscrição</div>
            <div className="text-xs text-gray-400">
              {gate.isTester ? "Conta de testador — acesso total" : gate.isTrial ? `Período grátis · ${gate.daysLeft} dia(s) restantes` : gate.isActive ? `Plano ${gate.plan}` : "Sem subscrição activa"}
            </div>
          </div>
        </a>
      </Link>

      {isAdmin && (
        <Link href="/admin/promo">
          <a className="bg-white rounded-2xl border border-[#F0E8E0] p-4 flex items-center gap-3 mb-3 hover:shadow-md transition">
            <Shield size={18} className="text-[#8B5CF6]" />
            <div className="font-bold text-[#1A1A2E] text-sm">Painel de administração</div>
          </a>
        </Link>
      )}

      <Link href="/privacy">
        <a className="bg-white rounded-2xl border border-[#F0E8E0] p-4 flex items-center gap-3 mb-3 hover:shadow-md transition">
          <div className="font-bold text-[#1A1A2E] text-sm">Política de Privacidade</div>
        </a>
      </Link>

      <button onClick={handleLogout} className="w-full bg-white rounded-2xl border border-[#F0E8E0] p-4 flex items-center gap-3 mb-3 text-red-500 font-bold text-sm hover:shadow-md transition">
        <LogOut size={18} /> Sair da conta
      </button>

      <Link href="/delete-account">
        <a className="flex items-center gap-2 text-gray-400 text-xs justify-center mt-6 hover:underline">
          <Trash2 size={13} /> Eliminar conta
        </a>
      </Link>
    </div>
  );
}

export default function Profile() {
  return (
    <RequireAuth>
      <AppShell>
        <ProfileContent />
      </AppShell>
    </RequireAuth>
  );
}
