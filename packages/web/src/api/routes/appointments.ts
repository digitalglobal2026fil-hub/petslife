import { Hono } from "hono";
import { db } from "../database";
import * as schema from "../database/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, authMiddleware } from "../middleware/auth";

export const appointments = new Hono()
  .use("*", authMiddleware)
  .get("/pet/:petId", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { petId } = c.req.param();
    const result = await db.select().from(schema.appointments).where(and(eq(schema.appointments.petId, petId), eq(schema.appointments.userId, user.id)));
    return c.json({ appointments: result }, 200);
  })
  .get("/upcoming", requireAuth, async (c) => {
    const user = c.get("user")!;
    const result = await db.select().from(schema.appointments).where(eq(schema.appointments.userId, user.id));
    return c.json({ appointments: result }, 200);
  })
  .post("/", requireAuth, async (c) => {
    const user = c.get("user")!;
    const body = await c.req.json();
    const [appointment] = await db.insert(schema.appointments).values({ ...body, userId: user.id }).returning();
    return c.json({ appointment }, 201);
  })
  .put("/:id", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    const body = await c.req.json();
    const [appointment] = await db.update(schema.appointments).set(body).where(and(eq(schema.appointments.id, id), eq(schema.appointments.userId, user.id))).returning();
    return c.json({ appointment }, 200);
  })
  .delete("/:id", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    await db.delete(schema.appointments).where(and(eq(schema.appointments.id, id), eq(schema.appointments.userId, user.id)));
    return c.json({ success: true }, 200);
  });
