import { useEffect, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Home, HeartPulse, Camera, Users, ShoppingBag, Building2, User, PawPrint, Loader2 } from "lucide-react";
import { authClient } from "../lib/auth";
import { useSubscriptionGate } from "../lib/useSubscriptionGate";

const NAV = [
  { href: "/app", label: "Início", icon: Home },
  { href: "/app/saude", label: "Saúde", icon: HeartPulse },
  { href: "/app/album", label: "Álbum", icon: Camera },
  { href: "/app/comunidade", label: "Comunidade", icon: Users },
  { href: "/app/loja", label: "Marketplace", icon: ShoppingBag },
  { href: "/app/negocios", label: "Negócios", icon: Building2 },
  { href: "/app/perfil", label: "Perfil", icon: User },
];

export function RequireAuth({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isPending && !session) {
      setLocation("/sign-in");
    }
  }, [isPending, session]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#FF6B35]" size={32} />
      </div>
    );
  }
  if (!session) return null;
  return <>{children}</>;
}

export function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const gate = useSubscriptionGate();

  const allowedWhenBlocked = ["/app/album", "/app/perfil", "/app/subscricao"];
  const blockedHere = gate.isBlocked && !allowedWhenBlocked.some((p) => location.startsWith(p));

  return (
    <div className="min-h-screen bg-[#FFF9F5] flex flex-col">
      {/* Top bar (desktop) */}
      <header className="bg-white border-b border-[#F0E8E0] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/app">
            <a className="flex items-center gap-2">
              <div className="bg-[#F5EDE4] rounded-xl p-1.5">
                <PawPrint size={20} color="#8B5E3C" />
              </div>
              <span className="font-extrabold text-xl text-[#FF6B35]">PetsLife</span>
            </a>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => {
              const active = location === item.href || (item.href !== "/app" && location.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href}>
                  <a className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold transition ${active ? "bg-[#FF6B35] text-white" : "text-gray-600 hover:bg-[#FFF0EB]"}`}>
                    <item.icon size={16} />
                    {item.label}
                  </a>
                </Link>
              );
            })}
          </nav>
        </div>
        {gate.showWarning && !gate.isLoading && (
          <div className={`text-center text-xs font-semibold py-1.5 ${gate.isBlocked ? "bg-red-500 text-white" : "bg-[#FFE66D] text-[#1A1A2E]"}`}>
            {gate.isBlocked
              ? "O seu período grátis terminou. "
              : `Restam ${gate.daysLeft} dia(s) de teste grátis. `}
            <Link href="/app/subscricao"><a className="underline">Assinar agora</a></Link>
          </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-6 py-6 pb-24 md:pb-10">
        {blockedHere ? <BlockedNotice /> : children}
      </main>

      {/* Bottom tabs (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F0E8E0] md:hidden z-40">
        <div className="flex items-center justify-between px-1 py-1.5 overflow-x-auto">
          {NAV.map((item) => {
            const active = location === item.href || (item.href !== "/app" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <a className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl min-w-[58px] ${active ? "text-[#FF6B35]" : "text-gray-400"}`}>
                  <item.icon size={20} />
                  <span className="text-[10px] font-semibold">{item.label}</span>
                </a>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function BlockedNotice() {
  return (
    <div className="bg-white rounded-3xl border border-[#F0E8E0] p-10 text-center max-w-md mx-auto mt-10">
      <div className="text-5xl mb-4">🔒</div>
      <h2 className="text-xl font-extrabold text-[#1A1A2E] mb-2">O seu período grátis terminou</h2>
      <p className="text-gray-500 mb-6">Assine o PetsLife para continuar a aceder a esta secção. O Álbum e o Perfil continuam disponíveis.</p>
      <Link href="/app/subscricao">
        <a className="inline-block bg-[#FF6B35] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#e55a24] transition">Ver planos</a>
      </Link>
    </div>
  );
}
