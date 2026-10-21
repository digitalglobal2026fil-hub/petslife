import { eq } from "drizzle-orm";
import { db } from "../database";
import * as schema from "../database/schema";

// ─── Conta oficial "Equipa PetsLife" ────────────────────────────────────────
// Usada pelo agendador de interação automática (auto-engage) para dar
// "gosto" e comentar publicações reais de forma visível e identificada —
// nunca finge ser outro utilizador. Tem selo "Oficial" na interface.
export const BOT_EMAIL = "equipa@petslife.app";
export const BOT_NAME = "Equipa PetsLife";
export const BOT_AVATAR_URL =
  "https://storage.googleapis.com/runable-templates/cli-uploads%2Fq6ryD3RauALglSnKjt1VH5n0bGy5umpS%2FvP-p0lNj_rk-80E4ecTBV%2Fpetslife_bot_avatar.png";

let cachedBotId: string | null = null;

// Procura a conta oficial; cria-a automaticamente na primeira vez que for
// necessária (não requer nenhuma configuração manual na base de dados de
// produção — assim que o endpoint corre uma vez, a conta já existe).
export async function getOrCreateBotUser(): Promise<string> {
  if (cachedBotId) return cachedBotId;

  const [existing] = await db.select().from(schema.user).where(eq(schema.user.email, BOT_EMAIL));
  if (existing) {
    cachedBotId = existing.id;
    return existing.id;
  }

  const [created] = await db
    .insert(schema.user)
    .values({
      id: crypto.randomUUID(),
      name: BOT_NAME,
      email: BOT_EMAIL,
      emailVerified: true,
      image: BOT_AVATAR_URL,
    })
    .returning();

  cachedBotId = created.id;
  return created.id;
}

// Comentários simpáticos e genéricos — a conta oficial não "lê" o conteúdo
// de cada publicação, só reage com simpatia, por isso os textos nunca
// referem detalhes específicos (evita comentários descontextualizados).
export const COMMENT_TEMPLATES = [
  "Que lindo! 🐾",
  "Adorei! ❤️",
  "Que fofura, parabéns!",
  "Isto alegrou-nos o dia 😍",
  "Lindo de morrer!",
  "Que amor de animal 🥰",
  "Fotografia incrível!",
  "Parabéns pelo momento especial!",
  "Isto é pura alegria 🐶🐱",
  "Tão bonito, continuem a partilhar!",
  "Que energia boa transmite esta publicação!",
  "Dá para sentir o amor ❤️🐾",
  "Simplesmente perfeito!",
  "Fez-nos sorrir, obrigada por partilhar!",
  "Que companhia maravilhosa!",
  "Isto é a vida — amor incondicional 🐾",
  "Que brincalhão(ona)! Adorável.",
  "A equipa adora ver estes momentos 💛",
  "Lindo registo, continuem assim!",
  "Isto merece mais do que um gosto!",
];

export function randomComment(exclude: Set<string> = new Set<string>()): string {
  const pool = COMMENT_TEMPLATES.filter((t) => !exclude.has(t));
  const list = pool.length > 0 ? pool : COMMENT_TEMPLATES;
  return list[Math.floor(Math.random() * list.length)];
}
