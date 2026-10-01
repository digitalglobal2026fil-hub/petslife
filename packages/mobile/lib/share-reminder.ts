import { kvGet, kvSet } from "./kv";

/**
 * Lembretes de partilha/causa animal — o passarinho com a bandeirola e o
 * banner das patinhas 🐾.
 *
 * Não aparecem sempre juntos nem sempre fixos: alternam em rotação a cada
 * abertura da app, para não cansar.
 *   n % 3 === 0 → passarinho (partilhar a app)
 *   n % 3 === 1 → banner das patinhas (causa animal)
 *   n % 3 === 2 → nenhum dos dois nesta abertura
 * A decisão é tomada UMA vez por arranque (aqui) e fica guardada em
 * memória durante essa sessão, para as frentes mostrarem a mesma coisa.
 */

const CHAVE_CONTADOR = "aberturas_lembrete_partilha";

let decidido = false;
let mostrarNestaSessao = false;
let mostrarCausaNestaSessao = false;

/** Chamar uma vez ao arrancar a app (ex.: no AppLoading). */
export async function registarAberturaEDecidirLembretePartilha(): Promise<void> {
  if (decidido) return;
  decidido = true;
  try {
    const raw = await kvGet(CHAVE_CONTADOR);
    const n = (parseInt(raw ?? "0", 10) || 0) + 1;
    await kvSet(CHAVE_CONTADOR, String(n));
    mostrarNestaSessao = n % 3 === 0;
    mostrarCausaNestaSessao = n % 3 === 1;
  } catch {
    mostrarNestaSessao = false;
    mostrarCausaNestaSessao = false;
  }
}

/** Devolve se, nesta sessão (desde que a app abriu), o lembrete do passarinho deve aparecer. */
export function lembretePartilhaActivoNestaSessao(): boolean {
  return mostrarNestaSessao;
}

/** Devolve se, nesta sessão, o banner da causa animal (patinhas 🐾) deve aparecer. */
export function bannerCausaAnimalActivoNestaSessao(): boolean {
  return mostrarCausaNestaSessao;
}

export const TEXTO_LEMBRETE_PARTILHA =
  "Voando aqui para avisar: parte da sua subscrição converte para causas animais. Cada assinatura ajuda-nos a cuidar de mais amiguinhos — partilha a PetsLife com quem também ama animais! 🐾";
