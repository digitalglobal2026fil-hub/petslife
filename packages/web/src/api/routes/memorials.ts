import { Hono } from "hono";
import { db, sqlClient } from "../database";
import * as schema from "../database/schema";
import { desc, eq } from "drizzle-orm";
import { authMiddleware, requireAuth } from "../middleware/auth";
import { isAdmin } from "../lib/admin";

/**
 * "Lembranças" — memorial dos animais que já partiram.
 *
 * Qualquer pessoa com conta publica o seu memorial (nome, fotos, um vídeo por
 * link e uma despedida). Os outros deixam comentários e acendem uma vela.
 * Só o autor (ou a administração) apaga.
 *
 * As tabelas são criadas aqui à mão porque em produção não se corre migração:
 * CREATE TABLE IF NOT EXISTS é seguro e só trabalha na primeira vez.
 */
let tabelasProntas: Promise<void> | null = null;
function garantirTabelas() {
  if (!tabelasProntas) {
    tabelasProntas = (async () => {
      try {
        await sqlClient.execute({
          sql: `CREATE TABLE IF NOT EXISTS memorials (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            user_name TEXT,
            pet_name TEXT NOT NULL,
            species TEXT,
            photo_url TEXT,
            photos TEXT,
            video_url TEXT,
            message TEXT,
            birth_date TEXT,
            death_date TEXT,
            candles INTEGER DEFAULT 0,
            comments_count INTEGER DEFAULT 0,
            created_at INTEGER
          )`,
          args: [],
        });
        await sqlClient.execute({
          sql: `CREATE TABLE IF NOT EXISTS memorial_comments (
            id TEXT PRIMARY KEY,
            memorial_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            user_name TEXT,
            content TEXT NOT NULL,
            created_at INTEGER
          )`,
          args: [],
        });
        await sqlClient.execute({
          sql: `CREATE TABLE IF NOT EXISTS memorial_candles (
            id TEXT PRIMARY KEY,
            memorial_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            created_at INTEGER
          )`,
          args: [],
        });
        await sqlClient.execute({
          sql: `CREATE UNIQUE INDEX IF NOT EXISTS memorial_candles_uniq
                ON memorial_candles (memorial_id, user_id)`,
          args: [],
        });
      } catch {
        /* já existem */
      }
    })();
  }
  return tabelasProntas;
}

export const memorials = new Hono()
  .use("*", authMiddleware)

  .get("/", async (c) => {
    await garantirTabelas();
    const user = c.get("user");
    const rows = await db
      .select()
      .from(schema.memorials)
      .orderBy(desc(schema.memorials.createdAt))
      .limit(100);

    // Em que memoriais é que já acendi vela?
    const minhas = new Set<string>();
    if (user) {
      const r = await sqlClient.execute({
        sql: `SELECT memorial_id FROM memorial_candles WHERE user_id = ?`,
        args: [user.id],
      });
      for (const row of r.rows as any[]) minhas.add(String(row.memorial_id));
    }

    const lista = rows.map((m) => ({
      ...m,
      photos: m.photos ? safeParse(m.photos) : [],
      minhaVela: minhas.has(m.id),
      souAutor: !!user && (m.userId === user.id || isAdmin(user)),
    }));

    return c.json({ memorials: lista }, 200);
  })

  .post("/", requireAuth, async (c) => {
    await garantirTabelas();
    const user = c.get("user")!;
    const body = await c.req.json().catch(() => ({}) as any);
    const petName = String(body.petName || "").trim();
    if (!petName) return c.json({ message: "O nome do animal é obrigatório." }, 400);

    const fotos: string[] = Array.isArray(body.photos)
      ? body.photos.filter((f: any) => typeof f === "string").slice(0, 4)
      : [];

    const [memorial] = await db
      .insert(schema.memorials)
      .values({
        userId: user.id,
        userName: user.name ?? "Utilizador",
        petName,
        species: body.species ? String(body.species) : null,
        photoUrl: body.photoUrl ? String(body.photoUrl) : (fotos[0] ?? null),
        photos: fotos.length ? JSON.stringify(fotos) : null,
        videoUrl: body.videoUrl ? String(body.videoUrl).trim() : null,
        message: body.message ? String(body.message) : null,
        birthDate: body.birthDate ? String(body.birthDate) : null,
        deathDate: body.deathDate ? String(body.deathDate) : null,
      })
      .returning();

    return c.json({ memorial }, 201);
  })

  .delete("/:id", requireAuth, async (c) => {
    await garantirTabelas();
    const user = c.get("user")!;
    const { id } = c.req.param();
    const [m] = await db.select().from(schema.memorials).where(eq(schema.memorials.id, id));
    if (!m) return c.json({ message: "Não encontrado" }, 404);
    if (m.userId !== user.id && !isAdmin(user)) {
      return c.json({ message: "Sem permissão" }, 403);
    }
    await db.delete(schema.memorialComments).where(eq(schema.memorialComments.memorialId, id));
    await db.delete(schema.memorialCandles).where(eq(schema.memorialCandles.memorialId, id));
    await db.delete(schema.memorials).where(eq(schema.memorials.id, id));
    return c.json({ ok: true }, 200);
  })

  // Acender / apagar a vela
  .post("/:id/candle", requireAuth, async (c) => {
    await garantirTabelas();
    const user = c.get("user")!;
    const { id } = c.req.param();

    const ja = await sqlClient.execute({
      sql: `SELECT id FROM memorial_candles WHERE memorial_id = ? AND user_id = ?`,
      args: [id, user.id],
    });

    if (ja.rows.length > 0) {
      await sqlClient.execute({
        sql: `DELETE FROM memorial_candles WHERE memorial_id = ? AND user_id = ?`,
        args: [id, user.id],
      });
    } else {
      await sqlClient.execute({
        sql: `INSERT INTO memorial_candles (id, memorial_id, user_id, created_at)
              VALUES (?, ?, ?, ?)
              ON CONFLICT (memorial_id, user_id) DO NOTHING`,
        args: [crypto.randomUUID(), id, user.id, Date.now()],
      });
    }

    const total = await sqlClient.execute({
      sql: `SELECT COUNT(*) AS n FROM memorial_candles WHERE memorial_id = ?`,
      args: [id],
    });
    const candles = Number((total.rows[0] as any)?.n ?? 0);
    await db.update(schema.memorials).set({ candles }).where(eq(schema.memorials.id, id));

    return c.json({ candles, minhaVela: ja.rows.length === 0 }, 200);
  })

  .get("/:id/comments", async (c) => {
    await garantirTabelas();
    const { id } = c.req.param();
    const rows = await db
      .select()
      .from(schema.memorialComments)
      .where(eq(schema.memorialComments.memorialId, id))
      .orderBy(desc(schema.memorialComments.createdAt));
    return c.json({ comments: rows }, 200);
  })

  .post("/:id/comments", requireAuth, async (c) => {
    await garantirTabelas();
    const user = c.get("user")!;
    const { id } = c.req.param();
    const body = await c.req.json().catch(() => ({}) as any);
    const content = String(body.content || "").trim();
    if (!content) return c.json({ message: "Escreva a mensagem." }, 400);

    const [comment] = await db
      .insert(schema.memorialComments)
      .values({ memorialId: id, userId: user.id, userName: user.name ?? "Utilizador", content })
      .returning();

    const [m] = await db.select().from(schema.memorials).where(eq(schema.memorials.id, id));
    if (m) {
      await db
        .update(schema.memorials)
        .set({ commentsCount: (m.commentsCount ?? 0) + 1 })
        .where(eq(schema.memorials.id, id));
    }
    return c.json({ comment }, 201);
  })

  .delete("/:memorialId/comments/:commentId", requireAuth, async (c) => {
    await garantirTabelas();
    const user = c.get("user")!;
    const { memorialId, commentId } = c.req.param();
    const [comment] = await db
      .select()
      .from(schema.memorialComments)
      .where(eq(schema.memorialComments.id, commentId));
    if (!comment) return c.json({ message: "Não encontrado" }, 404);
    if (comment.userId !== user.id && !isAdmin(user)) {
      return c.json({ message: "Sem permissão" }, 403);
    }
    await db.delete(schema.memorialComments).where(eq(schema.memorialComments.id, commentId));
    const [m] = await db.select().from(schema.memorials).where(eq(schema.memorials.id, memorialId));
    if (m) {
      await db
        .update(schema.memorials)
        .set({ commentsCount: Math.max(0, (m.commentsCount ?? 1) - 1) })
        .where(eq(schema.memorials.id, memorialId));
    }
    return c.json({ ok: true }, 200);
  });

function safeParse(v: string): string[] {
  try {
    const p = JSON.parse(v);
    return Array.isArray(p) ? p : [];
  } catch {
    return [];
  }
}
