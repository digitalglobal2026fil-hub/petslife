import { Hono } from "hono";
import { db } from "../database";
import * as schema from "../database/schema";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth, authMiddleware } from "../middleware/auth";
import { isAdmin } from "../lib/admin";

export const businesses = new Hono()
  .use("*", authMiddleware)

  // Listar todos os negócios
  .get("/", async (c) => {
    const result = await db.select().from(schema.businesses)
      .where(eq(schema.businesses.status, "active"))
      .orderBy(desc(schema.businesses.createdAt));
    return c.json({ businesses: result }, 200);
  })

  // Detalhes de um negócio + reviews
  .get("/:id", async (c) => {
    const { id } = c.req.param();
    const [business] = await db.select().from(schema.businesses).where(eq(schema.businesses.id, id));
    if (!business) return c.json({ message: "Not found" }, 404);
    const reviews = await db.select().from(schema.businessReviews)
      .where(eq(schema.businessReviews.businessId, id))
      .orderBy(desc(schema.businessReviews.createdAt));
    return c.json({ business, reviews }, 200);
  })

  // Negócios do utilizador atual
  .get("/my/listings", requireAuth, async (c) => {
    const user = c.get("user")!;
    const result = await db.select().from(schema.businesses).where(eq(schema.businesses.userId, user.id));
    return c.json({ businesses: result }, 200);
  })

  // Criar negócio
  .post("/", requireAuth, async (c) => {
    const user = c.get("user")!;
    const body = await c.req.json();
    const [business] = await db.insert(schema.businesses).values({ ...body, userId: user.id }).returning();
    return c.json({ business }, 201);
  })

  // Atualizar negócio
  .put("/:id", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    const body = await c.req.json();
    const [business] = await db.update(schema.businesses).set({ ...body, updatedAt: new Date() })
      .where(and(eq(schema.businesses.id, id), eq(schema.businesses.userId, user.id))).returning();
    return c.json({ business }, 200);
  })

  // Apagar negócio: o dono apaga o seu; a administradora apaga qualquer um
  // (clínicas/lojas que já não existem, testes ou registos falsos).
  .delete("/:id", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    const [business] = await db.select().from(schema.businesses).where(eq(schema.businesses.id, id));
    if (!business) return c.json({ message: "Não encontrado" }, 404);
    if (business.userId !== user.id && !isAdmin(user)) {
      return c.json({ message: "Sem permissão" }, 403);
    }
    await db.delete(schema.businessReviews).where(eq(schema.businessReviews.businessId, id));
    await db.delete(schema.businesses).where(eq(schema.businesses.id, id));
    return c.json({ success: true, byAdmin: business.userId !== user.id }, 200);
  })

  // Adicionar review
  .post("/:id/reviews", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    const { rating, comment } = await c.req.json();

    // Inserir review
    await db.insert(schema.businessReviews).values({ businessId: id, userId: user.id, rating, comment });

    // Atualizar média
    const reviews = await db.select().from(schema.businessReviews).where(eq(schema.businessReviews.businessId, id));
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await db.update(schema.businesses).set({ averageRating: avg, reviewsCount: reviews.length }).where(eq(schema.businesses.id, id));

    return c.json({ success: true }, 201);
  });
