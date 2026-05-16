import { Hono } from "hono";
import { db } from "../database";
import * as schema from "../database/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, authMiddleware } from "../middleware/auth";

export const health = new Hono()
  .use("*", authMiddleware)
  .get("/pet/:petId", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { petId } = c.req.param();
    const result = await db.select().from(schema.healthLogs).where(and(eq(schema.healthLogs.petId, petId), eq(schema.healthLogs.userId, user.id)));
    return c.json({ logs: result }, 200);
  })
  .post("/", requireAuth, async (c) => {
    const user = c.get("user")!;
    const body = await c.req.json();
    const [log] = await db.insert(schema.healthLogs).values({ ...body, userId: user.id }).returning();
    return c.json({ log }, 201);
  })
  .delete("/:id", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    await db.delete(schema.healthLogs).where(and(eq(schema.healthLogs.id, id), eq(schema.healthLogs.userId, user.id)));
    return c.json({ success: true }, 200);
  });
