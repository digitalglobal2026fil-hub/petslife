import { useQuery } from "@tanstack/react-query";
import { api } from "./api";

export interface SubscriptionGate {
  isLoading: boolean;
  isActive: boolean;
  isTrial: boolean;
  isBlocked: boolean;
  isTester: boolean;
  daysLeft: number;
  expiresAt: Date | null;
  showWarning: boolean;
  plan: string | null;
}

/**
 * Mesma lógica do gate da app mobile (packages/mobile/lib/useSubscriptionGate.ts),
 * adaptada para o cliente web. Trial de 3 dias, depois bloqueia tudo exceto
 * Álbum e Perfil/Subscrição, salvo testadores.
 */
export function useSubscriptionGate(): SubscriptionGate {
  const { data, isLoading } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => (await api.subscriptions.me.$get()).json(),
    refetchInterval: 60000,
  });

  const sub = (data as any)?.subscription;
  const isActive = !!(data as any)?.isActive;
  const isTrial = !!(data as any)?.isTrial;
  const isTester = !!(data as any)?.isTester;
  const plan = sub?.plan ?? null;

  const expiresAtRaw = isTrial ? sub?.trialEndsAt : sub?.currentPeriodEnd;
  const expiresAt = expiresAtRaw ? new Date(expiresAtRaw) : null;
  const daysLeft = expiresAt
    ? Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  const isBlocked = !isLoading && !isActive && !isTester;
  const showWarning = !isLoading && !isTester && (isBlocked || daysLeft <= 3);

  return { isLoading, isActive, isTrial, isTester, isBlocked, daysLeft, expiresAt, showWarning, plan };
}
