import { Hono } from "hono";
import { eq, ne, and, desc } from "drizzle-orm";
import { db } from "../database";
import * as schema from "../database/schema";
import { getOrCreateBotUser, randomComment } from "../lib/bot";

// Segredo partilhado só entre o agendador (cron) e este endpoint — não é uma
// sessão de utilizador normal, por isso não passa por requireAuth. Pode ser
// substituído por uma variável de ambiente AUTO_ENGAGE_SECRET sem precisar
// de alterar código.
const CRON_SECRET = process.env.AUTO_ENGAGE_SECRET || "2fd6a14ff87e7c3d7e4bbb4da33dcf08f59cf0bbd5126e3f";

export const autoEngage = new Hono()
  // POST /api/auto-engage/run — chamado pelo agendador várias vezes por dia.
  // Toda a aleatoriedade (se faz algo, quantas vezes, em que publicações,
  // "gosto" e/ou comentário) vive aqui no servidor, para que o agendador
  // só precise de disparar o pedido — mantém o padrão imprevisível e
  // natural sem precisar de lógica nenhuma do lado do agendador.
  .post("/run", async (c) => {
    const secret = c.req.header("x-cron-secret");
    if (secret !== CRON_SECRET) return c.json({ message: "Unauthorized" }, 401);

    const botId = await getOrCreateBotUser();

    // Boa parte das vezes não faz nada — evita um padrão demasiado regular.
    if (Math.random() < 0.45) {
      return c.json({ skipped: true, reason: "random skip" }, 200);
    }

    const candidates = await db
      .select()
      .from(schema.posts)
      .where(ne(schema.posts.userId, botId))
      .orderBy(desc(schema.posts.createdAt))
      .limit(30);

    if (candidates.length === 0) {
      return c.json({ skipped: true, reason: "no posts" }, 200);
    }

    const actionsCount = 1 + Math.floor(Math.random() * 3); // 1 a 3 publicações por corrida
    const shuffled = [...candidates].sort(() => Math.random() - 0.5);
    const usedComments = new Set<string>();
    const results: Array<{ postId: string; liked: boolean; commented: boolean }> = [];

    for (const post of shuffled) {
      if (results.length >= actionsCount) break;

      const [existingLike] = await db
        .select()
        .from(schema.postLikes)
        .where(and(eq(schema.postLikes.postId, post.id), eq(schema.postLikes.userId, botId)));
      const [existingComment] = await db
        .select()
        .from(schema.postComments)
        .where(and(eq(schema.postComments.postId, post.id), eq(schema.postComments.userId, botId)));

      if (existingLike && existingComment) continue; // já interagiu totalmente com esta publicação

      // 55% só gosto, 25% só comentário, 20% ambos.
      const roll = Math.random();
      let doLike = roll < 0.55 || roll >= 0.8;
      let doComment = roll >= 0.55;
      if (existingLike) doLike = false;
      if (existingComment) doComment = false;
      if (!doLike && !doComment) continue;

      if (doLike) {
        await db.insert(schema.postLikes).values({ postId: post.id, userId: botId });
        await db.update(schema.posts).set({ likesCount: (post.likesCount ?? 0) + 1 }).where(eq(schema.posts.id, post.id));
      }
      if (doComment) {
        const content = randomComment(usedComments);
        usedComments.add(content);
        await db.insert(schema.postComments).values({ postId: post.id, userId: botId, content });
        await db.update(schema.posts).set({ commentsCount: (post.commentsCount ?? 0) + 1 }).where(eq(schema.posts.id, post.id));
      }

      results.push({ postId: post.id, liked: doLike, commented: doComment });
    }

    return c.json({ skipped: results.length === 0, actions: results }, 200);
  });
