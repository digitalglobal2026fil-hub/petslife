/**
 * Pagamentos pela Google Play (subscrições).
 *
 * REGRA DE OURO: se a biblioteca nativa não existir ou falhar, NADA aqui pode
 * rebentar a app. Todas as funções devolvem null/[]/false em caso de erro e o
 * ecrã de subscrição continua a mostrar os preços fixos. Foi um módulo nativo
 * mal protegido que matou a app nas v37/v38 (Firebase) e v40/v41 (AsyncStorage).
 *
 * A biblioteca é carregada com require() preguiçoso dentro de try/catch, por
 * isso mesmo que o módulo nativo não esteja no build a app arranca normalmente.
 */
import { Platform } from "react-native";

export const SKU_MONTHLY = "premium_mensal";
export const SKU_ANNUAL = "premium_anual";

export interface StorePlan {
  sku: string;
  /** Preço já formatado pela loja, ex. "3,99 €" */
  price: string;
  /** Token da oferta (Android) — necessário para lançar a compra */
  offerToken: string | null;
}

export interface BillingPurchase {
  productId: string;
  purchaseToken: string;
  packageName: string | null;
}

type AnyIap = any;

let iap: AnyIap | null = null;
let loadFailed = false;

function getIap(): AnyIap | null {
  if (iap) return iap;
  if (loadFailed) return null;
  if (Platform.OS !== "android" && Platform.OS !== "ios") {
    loadFailed = true;
    return null;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    iap = require("expo-iap");
    if (!iap || typeof iap.initConnection !== "function") {
      iap = null;
      loadFailed = true;
      return null;
    }
    return iap;
  } catch {
    loadFailed = true;
    return null;
  }
}

/** True quando a loja está disponível neste dispositivo/build. */
export function isBillingAvailable(): boolean {
  return getIap() !== null;
}

let connected = false;

/** Liga à loja. Devolve false se não for possível (app continua a funcionar). */
export async function connectStore(): Promise<boolean> {
  const m = getIap();
  if (!m) return false;
  if (connected) return true;
  try {
    await m.initConnection();
    connected = true;
    return true;
  } catch {
    return false;
  }
}

export async function disconnectStore(): Promise<void> {
  const m = getIap();
  if (!m || !connected) return;
  try {
    await m.endConnection();
  } catch {
    /* ignorar */
  }
  connected = false;
}

function firstOfferToken(product: any): string | null {
  try {
    const offers = product?.subscriptionOffers;
    if (Array.isArray(offers) && offers.length > 0) {
      // A primeira oferta é a que inclui o período grátis, quando existe.
      const withFree = offers.find((o: any) =>
        Array.isArray(o?.pricingPhasesAndroid?.pricingPhaseList)
          ? o.pricingPhasesAndroid.pricingPhaseList.some((p: any) => p?.priceAmountMicros === "0")
          : false
      );
      const chosen = withFree ?? offers[0];
      return chosen?.offerTokenAndroid ?? chosen?.offerToken ?? null;
    }
  } catch {
    /* ignorar */
  }
  return null;
}

/**
 * Busca os preços reais das duas subscrições na loja.
 * Devolve [] se a loja não responder — o ecrã usa então os preços fixos.
 */
export async function fetchPlans(): Promise<StorePlan[]> {
  const m = getIap();
  if (!m) return [];
  const ok = await connectStore();
  if (!ok) return [];
  try {
    const products = await m.fetchProducts({ skus: [SKU_MONTHLY, SKU_ANNUAL], type: "subs" });
    if (!Array.isArray(products)) return [];
    return products
      .filter((p: any) => p && typeof p.id === "string")
      .map((p: any) => ({
        sku: p.id as string,
        price: (p.displayPrice as string) ?? "",
        offerToken: firstOfferToken(p),
      }));
  } catch {
    return [];
  }
}

/**
 * Lança o ecrã de pagamento da Google para o SKU indicado.
 * A confirmação chega pelo listener registado em `onPurchase`.
 */
export async function buy(sku: string, offerToken: string | null): Promise<boolean> {
  const m = getIap();
  if (!m) return false;
  const ok = await connectStore();
  if (!ok) return false;
  try {
    await m.requestPurchase({
      type: "subs",
      request: {
        apple: { sku },
        google: {
          skus: [sku],
          subscriptionOffers: offerToken ? [{ sku, offerToken }] : [],
        },
      },
    });
    return true;
  } catch {
    return false;
  }
}

/** Registo dos listeners de compra. Devolve uma função para os remover. */
export function onPurchase(
  onSuccess: (p: BillingPurchase) => void,
  onError: (message: string) => void
): () => void {
  const m = getIap();
  if (!m) return () => {};
  const subs: any[] = [];
  try {
    subs.push(
      m.purchaseUpdatedListener((purchase: any) => {
        try {
          const token = purchase?.purchaseToken ?? purchase?.purchaseTokenAndroid ?? null;
          const productId = purchase?.productId ?? purchase?.id ?? null;
          if (productId && token) {
            onSuccess({
              productId,
              purchaseToken: token,
              packageName: purchase?.packageNameAndroid ?? null,
            });
          }
        } catch {
          /* ignorar */
        }
      })
    );
  } catch {
    /* ignorar */
  }
  try {
    subs.push(
      m.purchaseErrorListener((err: any) => {
        const code = err?.code ?? "";
        // Cancelamento do utilizador não é erro para mostrar.
        if (String(code).toLowerCase().includes("cancel")) return;
        onError(err?.message ?? "");
      })
    );
  } catch {
    /* ignorar */
  }
  return () => {
    for (const s of subs) {
      try {
        s?.remove?.();
      } catch {
        /* ignorar */
      }
    }
  };
}

/** Fecha a transacção junto da loja (obrigatório, senão a Google reembolsa). */
export async function finish(purchase: any, isConsumable = false): Promise<void> {
  const m = getIap();
  if (!m) return;
  try {
    await m.finishTransaction({ purchase, isConsumable });
  } catch {
    /* ignorar */
  }
}

/** Compras activas já feitas por esta conta (para restaurar a subscrição). */
export async function getActive(): Promise<BillingPurchase[]> {
  const m = getIap();
  if (!m) return [];
  const ok = await connectStore();
  if (!ok) return [];
  try {
    const list = await m.getAvailablePurchases();
    if (!Array.isArray(list)) return [];
    return list
      .map((p: any) => ({
        productId: p?.productId ?? p?.id ?? "",
        purchaseToken: p?.purchaseToken ?? p?.purchaseTokenAndroid ?? "",
        packageName: p?.packageNameAndroid ?? null,
      }))
      .filter((p: BillingPurchase) => p.productId && p.purchaseToken);
  } catch {
    return [];
  }
}
