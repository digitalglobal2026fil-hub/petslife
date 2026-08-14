import { Hono } from "hono";
import { db } from "../database";
import * as schema from "../database/schema";
import { and, desc, eq } from "drizzle-orm";
import { requireAuth } from "../middleware/auth";

export const reminders = new Hono()

  .get("/", requireAuth, async (c) => {
    const user = c.get("user")!;
    const petId = c.req.query("petId");
    const rows = await db
      .select()
      .from(schema.reminders)
      .where(
        petId
          ? and(eq(schema.reminders.userId, user.id), eq(schema.reminders.petId, petId))
          : eq(schema.reminders.userId, user.id),
      )
      .orderBy(desc(schema.reminders.createdAt));
    return c.json({ reminders: rows });
  })

  .post("/", requireAuth, async (c) => {
    const user = c.get("user")!;
    const body = await c.req.json();
    if (!body.title || !body.startDate) return c.json({ error: "Título e data são obrigatórios" }, 400);

    const [row] = await db
      .insert(schema.reminders)
      .values({
        userId: user.id,
        petId: body.petId ?? null,
        title: String(body.title).trim(),
        kind: body.kind || "medication",
        dosage: body.dosage ?? null,
        notes: body.notes ?? null,
        startDate: body.startDate,
        endDate: body.endDate ?? null,
        times: JSON.stringify(body.times ?? []),
        frequency: body.frequency || "daily",
        intervalDays: body.intervalDays ?? null,
      })
      .returning();
    return c.json({ reminder: row }, 201);
  })

  .patch("/:id", requireAuth, async (c) => {
    const user = c.get("user")!;
    const id = c.req.param("id");
    const body = await c.req.json();
    const patch: any = {};
    for (const k of ["title", "kind", "dosage", "notes", "startDate", "endDate", "frequency", "intervalDays"]) {
      if (body[k] !== undefined) patch[k] = body[k];
    }
    if (body.times !== undefined) patch.times = JSON.stringify(body.times);
    if (body.active !== undefined) patch.active = !!body.active;
    await db
      .update(schema.reminders)
      .set(patch)
      .where(and(eq(schema.reminders.id, id), eq(schema.reminders.userId, user.id)));
    return c.json({ ok: true });
  })

  .delete("/:id", requireAuth, async (c) => {
    const user = c.get("user")!;
    const id = c.req.param("id");
    await db.delete(schema.reminderLogs).where(eq(schema.reminderLogs.reminderId, id));
    await db
      .delete(schema.reminders)
      .where(and(eq(schema.reminders.id, id), eq(schema.reminders.userId, user.id)));
    return c.json({ ok: true });
  })

  // Marcar dose como dada
  .post("/:id/done", requireAuth, async (c) => {
    const user = c.get("user")!;
    const id = c.req.param("id");
    const body = await c.req.json().catch(() => ({}) as any);
    const [row] = await db
      .insert(schema.reminderLogs)
      .values({
        reminderId: id,
        userId: user.id,
        dueAt: body.dueAt || new Date().toISOString().slice(0, 16).replace("T", " "),
        doneAt: new Date(),
        skipped: !!body.skipped,
      })
      .returning();
    return c.json({ log: row }, 201);
  })

  .get("/:id/logs", requireAuth, async (c) => {
    const user = c.get("user")!;
    const id = c.req.param("id");
    const rows = await db
      .select()
      .from(schema.reminderLogs)
      .where(and(eq(schema.reminderLogs.reminderId, id), eq(schema.reminderLogs.userId, user.id)))
      .orderBy(desc(schema.reminderLogs.doneAt))
      .limit(200);
    return c.json({ logs: rows });
  });
