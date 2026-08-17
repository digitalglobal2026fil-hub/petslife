import { useQuery } from "@tanstack/react-query";
import { api } from "./api";
import { tr } from "./i18n";

export interface SubscriptionGate {
  isLoading: boolean;
  isActive: boolean;
  isTrial: boolean;
  isBlocked: boolean;
  isTester: boolean;
  daysLeft: number;
  expiresAt: Date | null;
  showWarning: boolean; // true when <=3 days left (or already expired)
  plan: string | null;
}

/**
 * Central hook to check subscription/trial status across the app.
 * - Trial: 3 days free, then blocked unless subscribed.
 * - Paid (monthly/annual): blocked if not renewed after currentPeriodEnd.
 * - When blocked, only the Álbum tab + Profile/Subscription screens remain usable.
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
  // Contas de testador: o servidor responde isTester e NÃO envia datas. Sem
  // isto a app calculava "0 dias" e mostrava o aviso de trial a terminar.
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
