import { Hono } from "hono";
import { sqlClient } from "../database";
import { db } from "../database";
import * as schema from "../database/schema";
import { eq } from "drizzle-orm";
import { requireAuth, authMiddleware } from "../middleware/auth";
import { isAdmin } from "../lib/admin";

/**
 * Denúncias de conteúdo impróprio.
 *
 * Qualquer utilizador pode denunciar uma publicação, comentário, anúncio do
 * marketplace, negócio ou anúncio de animal perdido. A administradora vê a
 * lista no painel do Perfil e pode apagar o conteúdo a partir de lá.
 */

const ensureTable = async () => {
  await sqlClient.execute({
    sql: `CREATE TABLE IF NOT EXISTS content_reports (
      id TEXT PRIMARY KEY,
      targetType TEXT NOT NULL,
      targetId TEXT NOT NULL,
      reason TEXT,
      details TEXT,
      preview TEXT,
      reporterId TEXT,
      reporterEmail TEXT,
      status TEXT DEFAULT 'open',
      createdAt TEXT DEFAULT (datetime('now'))
    )`,
    args: [],
  });
};

const TYPES = ["post", "comment", "listing", "business", "lost_pet"] as const;

export const reports = new Hono()
  .use("*", authMiddleware)

  // Denunciar conteúdo — qualquer utilizador autenticado
  .post("/", requireAuth, async (c) => {
    try {
      await ensureTable();
      const user = c.get("user")!;
      const body = await c.req.json();
      const targetType = String(body.targetType ?? "");
      const targetId = String(body.targetId ?? "");
      if (!TYPES.includes(targetType as any) || !targetId) {
        return c.json({ message: "Denúncia inválida" }, 400);
      }
      const id = `rp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      await sqlClient.execute({
        sql: `INSERT INTO content_reports (id, targetType, targetId, reason, details, preview, reporterId, reporterEmail)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          id,
          targetType,
          targetId,
          String(body.reason ?? "Outro"),
          String(body.details ?? ""),
          String(body.preview ?? "").slice(0, 300),
          user.id,
          user.email ?? "",
        ],
      });
      return c.json({ success: true, id }, 201);
    } catch (e: any) {
      return c.json({ error: e.message }, 500);
    }
  })

  // Lista de denúncias — só a administradora
  .get("/", requireAuth, async (c) => {
    try {
      const user = c.get("user")!;
      if (!isAdmin(user)) return c.json({ message: "Sem permissão" }, 403);
      await ensureTable();
      const status = c.req.query("status") ?? "open";
      const res = await sqlClient.execute({
        sql: `SELECT * FROM content_reports WHERE status = ? ORDER BY createdAt DESC LIMIT 200`,
        args: [status],
      });
      return c.json({ reports: res.rows }, 200);
    } catch (e: any) {
      return c.json({ reports: [], error: e.message }, 200);
    }
  })

  // Quantas denúncias por tratar — para o aviso no Perfil
  .get("/count", requireAuth, async (c) => {
    try {
      const user = c.get("user")!;
      if (!isAdmin(user)) return c.json({ count: 0 }, 200);
      await ensureTable();
      const res = await sqlClient.execute({
        sql: `SELECT COUNT(*) AS n FROM content_reports WHERE status = 'open'`,
        args: [],
      });
      return c.json({ count: Number((res.rows?.[0] as any)?.n ?? 0) }, 200);
    } catch {
      return c.json({ count: 0 }, 200);
    }
  })

  // Arquivar a denúncia sem apagar o conteúdo ("está tudo bem")
  .patch("/:id/dismiss", requireAuth, async (c) => {
    const user = c.get("user")!;
    if (!isAdmin(user)) return c.json({ message: "Sem permissão" }, 403);
    await ensureTable();
    await sqlClient.execute({
      sql: `UPDATE content_reports SET status = 'dismissed' WHERE id = ?`,
      args: [c.req.param("id")],
    });
    return c.json({ success: true }, 200);
  })

  // Apagar o conteúdo denunciado e fechar a denúncia
  .delete("/:id/content", requireAuth, async (c) => {
    try {
      const user = c.get("user")!;
      if (!isAdmin(user)) return c.json({ message: "Sem permissão" }, 403);
      await ensureTable();
      const id = c.req.param("id");
      const found = await sqlClient.execute({
        sql: `SELECT * FROM content_reports WHERE id = ?`,
        args: [id],
      });
      const report: any = found.rows?.[0];
      if (!report) return c.json({ message: "Não encontrada" }, 404);

      const targetId = String(report.targetId);
      switch (String(report.targetType)) {
        case "post":
          await db.delete(schema.postComments).where(eq(schema.postComments.postId, targetId));
          await db.delete(schema.postLikes).where(eq(schema.postLikes.postId, targetId));
          await db.delete(schema.posts).where(eq(schema.posts.id, targetId));
          break;
        case "comment":
          await db.delete(schema.postComments).where(eq(schema.postComments.id, targetId));
          break;
        case "listing":
          await db.delete(schema.listings).where(eq(schema.listings.id, targetId));
          break;
        case "business":
          await db.delete(schema.businessReviews).where(eq(schema.businessReviews.businessId, targetId));
          await db.delete(schema.businesses).where(eq(schema.businesses.id, targetId));
          break;
        case "lost_pet":
          await sqlClient.execute({ sql: `DELETE FROM lost_pets WHERE id = ?`, args: [targetId] });
          break;
      }

      await sqlClient.execute({
        sql: `UPDATE content_reports SET status = 'removed' WHERE id = ?`,
        args: [id],
      });
      return c.json({ success: true }, 200);
    } catch (e: any) {
      return c.json({ error: e.message }, 500);
    }
  });
