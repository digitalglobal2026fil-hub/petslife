import { Hono } from "hono";
import { db, sqlClient } from "../database";
import * as schema from "../database/schema";
import { desc, eq } from "drizzle-orm";
import { authMiddleware, requireAuth } from "../middleware/auth";
import { isAdmin } from "../lib/admin";

/**
 * "Nossas Missões" — trabalho social da PetsLife.
 *
 * Só a administradora publica e apaga. Qualquer pessoa com conta vê as
 * publicações e pode comentar (e apagar o seu próprio comentário).
 *
 * As tabelas são criadas aqui à mão porque em produção não se corre migração:
 * o CREATE TABLE IF NOT EXISTS é seguro e só faz trabalho na primeira vez.
 */
let tablesReady: Promise<void> | null = null;
function ensureTables() {
  if (!tablesReady) {
    tablesReady = (async () => {
      try {
        await sqlClient.execute({
          sql: `CREATE TABLE IF NOT EXISTS missions (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            content TEXT,
            image_url TEXT,
            location TEXT,
            author_id TEXT NOT NULL,
            author_name TEXT,
            comments_count INTEGER DEFAULT 0,
            created_at INTEGER
          )`,
          args: [],
        });
        await sqlClient.execute({
          sql: `CREATE TABLE IF NOT EXISTS mission_comments (
            id TEXT PRIMARY KEY,
            mission_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            user_name TEXT,
            content TEXT NOT NULL,
            created_at INTEGER
          )`,
          args: [],
        });
        await sqlClient.execute({
          sql: `CREATE TABLE IF NOT EXISTS mission_reactions (
            id TEXT PRIMARY KEY,
            mission_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            emoji TEXT NOT NULL,
            created_at INTEGER
          )`,
          args: [],
        });
        await sqlClient.execute({
          sql: `CREATE UNIQUE INDEX IF NOT EXISTS mission_reactions_uniq
                ON mission_reactions (mission_id, user_id)`,
          args: [],
        });
      } catch {
        /* já existem */
      }
    })();
  }
  return tablesReady;
}

export const missions = new Hono()
  .use("*", authMiddleware)

  // Quem está a ver é administradora? A app usa isto para mostrar (ou esconder)
  // os botões de publicar e apagar.
  .get("/can-post", async (c) => {
    const user = c.get("user");
    return c.json({ canPost: isAdmin(user) }, 200);
  })

  .get("/", async (c) => {
    await ensureTables();
    const rows = await db
      .select()
      .from(schema.missions)
      .orderBy(desc(schema.missions.createdAt))
      .limit(100);
    const user = c.get("user");

    // Contagem de cada emoji por missão + a reação de quem está a ver.
    const contagens = await sqlClient.execute({
      sql: `SELECT mission_id, emoji, COUNT(*) AS total
            FROM mission_reactions GROUP BY mission_id, emoji`,
      args: [],
    });
    const porMissao: Record<string, Record<string, number>> = {};
    for (const r of contagens.rows as any[]) {
      const mid = String(r.mission_id);
      porMissao[mid] = porMissao[mid] ?? {};
      porMissao[mid][String(r.emoji)] = Number(r.total);
    }

    const minhas: Record<string, string> = {};
    if (user) {
      const r = await sqlClient.execute({
        sql: `SELECT mission_id, emoji FROM mission_reactions WHERE user_id = ?`,
        args: [user.id],
      });
      for (const row of r.rows as any[]) minhas[String(row.mission_id)] = String(row.emoji);
    }

    const comReacoes = rows.map((m) => ({
      ...m,
      reactions: porMissao[m.id] ?? {},
      myReaction: minhas[m.id] ?? null,
    }));

    return c.json({ missions: comReacoes, canPost: isAdmin(user) }, 200);
  })

  // Reagir a uma missão. Mesmo emoji outra vez = tirar a reação.
  .post("/:id/reactions", requireAuth, async (c) => {
    await ensureTables();
    const user = c.get("user")!;
    const { id } = c.req.param();
    const body = await c.req.json().catch(() => ({}) as any);
    const emoji = String(body.emoji || "").trim();
    if (!emoji) return c.json({ message: "Falta o emoji." }, 400);

    const atual = await sqlClient.execute({
      sql: `SELECT emoji FROM mission_reactions WHERE mission_id = ? AND user_id = ?`,
      args: [id, user.id],
    });
    const anterior = atual.rows[0] ? String((atual.rows[0] as any).emoji) : null;

    if (anterior === emoji) {
      await sqlClient.execute({
        sql: `DELETE FROM mission_reactions WHERE mission_id = ? AND user_id = ?`,
        args: [id, user.id],
      });
      return c.json({ myReaction: null }, 200);
    }

    await sqlClient.execute({
      sql: `INSERT INTO mission_reactions (id, mission_id, user_id, emoji, created_at)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT (mission_id, user_id) DO UPDATE SET emoji = excluded.emoji`,
      args: [crypto.randomUUID(), id, user.id, emoji, Date.now()],
    });
    return c.json({ myReaction: emoji }, 200);
  })

  .post("/", requireAuth, async (c) => {
    await ensureTables();
    const user = c.get("user")!;
    if (!isAdmin(user)) return c.json({ message: "Só a administração pode publicar aqui." }, 403);
    const body = await c.req.json().catch(() => ({}) as any);
    const title = String(body.title || "").trim();
    if (!title) return c.json({ message: "O título é obrigatório." }, 400);
    const [mission] = await db
      .insert(schema.missions)
      .values({
        title,
        content: body.content ? String(body.content) : null,
        imageUrl: body.imageUrl ? String(body.imageUrl) : null,
        location: body.location ? String(body.location) : null,
        authorId: user.id,
        authorName: user.name ?? "PetsLife",
      })
      .returning();
    return c.json({ mission }, 201);
  })

  .delete("/:id", requireAuth, async (c) => {
    await ensureTables();
    const user = c.get("user")!;
    if (!isAdmin(user)) return c.json({ message: "Sem permissão." }, 403);
    const { id } = c.req.param();
    await db.delete(schema.missionComments).where(eq(schema.missionComments.missionId, id));
    await db.delete(schema.missionReactions).where(eq(schema.missionReactions.missionId, id));
    await db.delete(schema.missions).where(eq(schema.missions.id, id));
    return c.json({ ok: true }, 200);
  })

  .get("/:id/comments", async (c) => {
    await ensureTables();
    const { id } = c.req.param();
    const rows = await db
      .select()
      .from(schema.missionComments)
      .where(eq(schema.missionComments.missionId, id))
      .orderBy(desc(schema.missionComments.createdAt));
    return c.json({ comments: rows }, 200);
  })

  .post("/:id/comments", requireAuth, async (c) => {
    await ensureTables();
    const user = c.get("user")!;
    const { id } = c.req.param();
    const body = await c.req.json().catch(() => ({}) as any);
    const content = String(body.content || "").trim();
    if (!content) return c.json({ message: "Escreva o comentário." }, 400);
    const [comment] = await db
      .insert(schema.missionComments)
      .values({ missionId: id, userId: user.id, userName: user.name ?? "Utilizador", content })
      .returning();
    const [mission] = await db.select().from(schema.missions).where(eq(schema.missions.id, id));
    if (mission) {
      await db
        .update(schema.missions)
        .set({ commentsCount: (mission.commentsCount ?? 0) + 1 })
        .where(eq(schema.missions.id, id));
    }
    return c.json({ comment }, 201);
  })

  // O autor apaga o seu comentário; a administradora apaga qualquer um.
  .delete("/:missionId/comments/:commentId", requireAuth, async (c) => {
    await ensureTables();
    const user = c.get("user")!;
    const { missionId, commentId } = c.req.param();
    const [comment] = await db
      .select()
      .from(schema.missionComments)
      .where(eq(schema.missionComments.id, commentId));
    if (!comment) return c.json({ message: "Não encontrado" }, 404);
    if (comment.userId !== user.id && !isAdmin(user)) {
      return c.json({ message: "Sem permissão" }, 403);
    }
    await db.delete(schema.missionComments).where(eq(schema.missionComments.id, commentId));
    const [mission] = await db.select().from(schema.missions).where(eq(schema.missions.id, missionId));
    if (mission) {
      await db
        .update(schema.missions)
        .set({ commentsCount: Math.max(0, (mission.commentsCount ?? 1) - 1) })
        .where(eq(schema.missions.id, missionId));
    }
    return c.json({ ok: true }, 200);
  });
