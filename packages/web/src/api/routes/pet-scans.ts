import { Hono } from "hono";
import { db } from "../database";
import * as schema from "../database/schema";
import { desc, eq } from "drizzle-orm";
import { requireAuth } from "../middleware/auth";

export const petScans = new Hono()

  // PÚBLICO — quem encontra o animal digitaliza o QR e envia a localização.
  // Recebe o qrCode (não o petId) para não expor ids internos.
  .post("/", async (c) => {
    const body = await c.req.json().catch(() => ({}) as any);
    const qrCode = String(body.qrCode || "").trim();
    if (!qrCode) return c.json({ error: "qrCode obrigatório" }, 400);

    const [pet] = await db.select().from(schema.pets).where(eq(schema.pets.qrCode, qrCode));
    if (!pet) return c.json({ error: "Animal não encontrado" }, 404);

    const [row] = await db
      .insert(schema.petScans)
      .values({
        petId: pet.id,
        lat: body.lat != null ? Number(body.lat) : null,
        lng: body.lng != null ? Number(body.lng) : null,
        accuracy: body.accuracy != null ? Number(body.accuracy) : null,
        address: body.address ?? null,
        finderName: body.finderName ?? null,
        finderPhone: body.finderPhone ?? null,
        message: body.message ?? null,
        userAgent: c.req.header("user-agent") ?? null,
      })
      .returning();

    return c.json({ ok: true, scan: { id: row.id } }, 201);
  })

  // DONO — ver onde o animal foi digitalizado
  .get("/pet/:petId", requireAuth, async (c) => {
    const user = c.get("user")!;
    const petId = c.req.param("petId");
    const [pet] = await db.select().from(schema.pets).where(eq(schema.pets.id, petId));
    if (!pet || pet.userId !== user.id) return c.json({ error: "Sem permissão" }, 403);

    const rows = await db
      .select()
      .from(schema.petScans)
      .where(eq(schema.petScans.petId, petId))
      .orderBy(desc(schema.petScans.createdAt))
      .limit(50);
    return c.json({ scans: rows });
  });
