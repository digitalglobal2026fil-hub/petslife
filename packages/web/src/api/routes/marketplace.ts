import { Hono } from "hono";
import { db } from "../database";
import * as schema from "../database/schema";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth, authMiddleware } from "../middleware/auth";
import { isAdmin } from "../lib/admin";

export const marketplace = new Hono()
  .use("*", authMiddleware)
  .get("/", async (c) => {
    const result = await db.select().from(schema.listings).where(eq(schema.listings.status, "active")).orderBy(desc(schema.listings.createdAt));
    return c.json({ listings: result }, 200);
  })
  .get("/:id", async (c) => {
    const { id } = c.req.param();
    const [listing] = await db.select().from(schema.listings).where(eq(schema.listings.id, id));
    if (!listing) return c.json({ message: "Not found" }, 404);
    return c.json({ listing }, 200);
  })
  .post("/", requireAuth, async (c) => {
    const user = c.get("user")!;
    const body = await c.req.json();
    // Sanitize notNull fields to avoid SQLite constraint errors
    const price = typeof body.price === "number" ? body.price : parseFloat(body.price ?? "0") || 0;
    const category = body.category ?? "outro";
    const title = body.title ?? "";
    if (!title) return c.json({ message: "title is required" }, 400);
    const [listing] = await db
      .insert(schema.listings)
      .values({ ...body, price, category, title, userId: user.id })
      .returning();
    return c.json({ listing }, 201);
  })
  .put("/:id", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    const body = await c.req.json();
    const [listing] = await db.update(schema.listings).set(body).where(and(eq(schema.listings.id, id), eq(schema.listings.userId, user.id))).returning();
    return c.json({ listing }, 200);
  })
  // Apagar anúncio: o dono apaga o seu; a administradora apaga qualquer um
  // (anúncios falsos, de teste, ou de lojas que já fecharam).
  .delete("/:id", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    const [listing] = await db.select().from(schema.listings).where(eq(schema.listings.id, id));
    if (!listing) return c.json({ message: "Não encontrado" }, 404);
    if (listing.userId !== user.id && !isAdmin(user)) {
      return c.json({ message: "Sem permissão" }, 403);
    }
    await db.delete(schema.listings).where(eq(schema.listings.id, id));
    return c.json({ success: true, byAdmin: listing.userId !== user.id }, 200);
  });
