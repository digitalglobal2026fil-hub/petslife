import { Hono } from "hono";
import { db } from "../database";
import * as schema from "../database/schema";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth, authMiddleware } from "../middleware/auth";

export const consultations = new Hono()
  .use("*", authMiddleware)
  // List my consultations
  .get("/", requireAuth, async (c) => {
    const user = c.get("user")!;
    const result = await db
      .select()
      .from(schema.consultations)
      .where(eq(schema.consultations.userId, user.id))
      .orderBy(desc(schema.consultations.scheduledAt));
    return c.json({ consultations: result }, 200);
  })
  // Get single
  .get("/:id", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    const [consultation] = await db
      .select()
      .from(schema.consultations)
      .where(and(eq(schema.consultations.id, id), eq(schema.consultations.userId, user.id)));
    if (!consultation) return c.json({ error: "Not found" }, 404);
    return c.json({ consultation }, 200);
  })
  // Book a consultation
  .post("/", requireAuth, async (c) => {
    const user = c.get("user")!;
    const body = await c.req.json();

    // Generate a Whereby-style room name (free, no SDK needed)
    const roomName = `petslife-${crypto.randomUUID().slice(0, 8)}`;
    const roomUrl = `https://whereby.com/${roomName}`;

    const [consultation] = await db
      .insert(schema.consultations)
      .values({
        ...body,
        userId: user.id,
        roomName,
        roomUrl,
        status: "pending",
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      })
      .returning();
    return c.json({ consultation }, 201);
  })
  // Update status / notes
  .put("/:id", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    const body = await c.req.json();
    const [consultation] = await db
      .update(schema.consultations)
      .set({ ...body, updatedAt: new Date() })
      .where(and(eq(schema.consultations.id, id), eq(schema.consultations.userId, user.id)))
      .returning();
    if (!consultation) return c.json({ error: "Not found" }, 404);
    return c.json({ consultation }, 200);
  })
  // Cancel
  .delete("/:id", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    await db
      .update(schema.consultations)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(and(eq(schema.consultations.id, id), eq(schema.consultations.userId, user.id)));
    return c.json({ success: true }, 200);
  });
