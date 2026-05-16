import { Hono } from "hono";
import { db } from "../database";
import * as schema from "../database/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, authMiddleware } from "../middleware/auth";

export const dewormings = new Hono()
  .use("*", authMiddleware)
  .get("/pet/:petId", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { petId } = c.req.param();
    const result = await db.select().from(schema.dewormings).where(and(eq(schema.dewormings.petId, petId), eq(schema.dewormings.userId, user.id)));
    return c.json({ dewormings: result }, 200);
  })
  .post("/", requireAuth, async (c) => {
    const user = c.get("user")!;
    const body = await c.req.json();
    const today = new Date().toISOString().split("T")[0];
    const date = body.date || today;
    const [item] = await db.insert(schema.dewormings).values({ ...body, date, userId: user.id }).returning();
    return c.json({ deworming: item }, 201);
  })
  .delete("/:id", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    await db.delete(schema.dewormings).where(and(eq(schema.dewormings.id, id), eq(schema.dewormings.userId, user.id)));
    return c.json({ success: true }, 200);
  });
