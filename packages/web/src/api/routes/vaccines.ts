import { Hono } from "hono";
import { db } from "../database";
import * as schema from "../database/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, authMiddleware } from "../middleware/auth";

export const vaccines = new Hono()
  .use("*", authMiddleware)
  .get("/pet/:petId", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { petId } = c.req.param();
    const result = await db.select().from(schema.vaccines).where(and(eq(schema.vaccines.petId, petId), eq(schema.vaccines.userId, user.id)));
    return c.json({ vaccines: result }, 200);
  })
  .post("/", requireAuth, async (c) => {
    const user = c.get("user")!;
    const body = await c.req.json();
    const [vaccine] = await db.insert(schema.vaccines).values({ ...body, userId: user.id }).returning();
    return c.json({ vaccine }, 201);
  })
  .put("/:id", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    const body = await c.req.json();
    const [vaccine] = await db.update(schema.vaccines).set(body).where(and(eq(schema.vaccines.id, id), eq(schema.vaccines.userId, user.id))).returning();
    return c.json({ vaccine }, 200);
  })
  .delete("/:id", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    await db.delete(schema.vaccines).where(and(eq(schema.vaccines.id, id), eq(schema.vaccines.userId, user.id)));
    return c.json({ success: true }, 200);
  });
