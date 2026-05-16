import { Hono } from "hono";
import { db } from "../database";
import * as schema from "../database/schema";
import { eq, and, asc } from "drizzle-orm";
import { requireAuth, authMiddleware } from "../middleware/auth";

export const weightLogs = new Hono()
  .use("*", authMiddleware)
  .get("/pet/:petId", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { petId } = c.req.param();
    const result = await db.select().from(schema.weightLogs)
      .where(and(eq(schema.weightLogs.petId, petId), eq(schema.weightLogs.userId, user.id)))
      .orderBy(asc(schema.weightLogs.date));
    return c.json({ weightLogs: result }, 200);
  })
  .post("/", requireAuth, async (c) => {
    const user = c.get("user")!;
    const body = await c.req.json();
    const today = new Date().toISOString().split("T")[0];
    const date = body.date || today;
    const weight = typeof body.weight === "number" ? body.weight : parseFloat(body.weight ?? "0") || 0;
    const [item] = await db.insert(schema.weightLogs).values({ ...body, date, weight, userId: user.id }).returning();
    return c.json({ weightLog: item }, 201);
  })
  .delete("/:id", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    await db.delete(schema.weightLogs).where(and(eq(schema.weightLogs.id, id), eq(schema.weightLogs.userId, user.id)));
    return c.json({ success: true }, 200);
  });
