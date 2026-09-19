import { kvGet, kvSet } from "./kv";

/**
 * Lembrete de partilha/subscrição — o passarinho com a bandeirola.
 *
 * Aparece em duas frentes (banner no Início + aviso ao sair da app) e só
 * em 1 de cada 3 aberturas da app, para não ser cansativo. A decisão é
 * tomada UMA vez por arranque (aqui) e fica guardada em memória durante
 * essa sessão, para as duas frentes mostrarem a mesma coisa.
 */

const CHAVE_CONTADOR = "aberturas_lembrete_partilha";

let decidido = false;
let mostrarNestaSessao = false;

/** Chamar uma vez ao arrancar a app (ex.: no AppLoading). */
export async function registarAberturaEDecidirLembretePartilha(): Promise<void> {
  if (decidido) return;
  decidido = true;
  try {
    const raw = await kvGet(CHAVE_CONTADOR);
    const n = (parseInt(raw ?? "0", 10) || 0) + 1;
    await kvSet(CHAVE_CONTADOR, String(n));
    mostrarNestaSessao = n % 3 === 0;
  } catch {
    mostrarNestaSessao = false;
  }
}

/** Devolve se, nesta sessão (desde que a app abriu), o lembrete deve aparecer. */
export function lembretePartilhaActivoNestaSessao(): boolean {
  return mostrarNestaSessao;
}

export const TEXTO_LEMBRETE_PARTILHA =
  "Voando aqui para avisar: parte da sua subscrição converte para causas animais. Cada assinatura ajuda-nos a cuidar de mais amiguinhos — partilha a PetsLife com quem também ama animais! 🐾";
