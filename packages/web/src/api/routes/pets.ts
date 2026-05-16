import { Hono } from "hono";
import { db } from "../database";
import * as schema from "../database/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, authMiddleware } from "../middleware/auth";

export const pets = new Hono()
  .use("*", authMiddleware)
  .get("/", requireAuth, async (c) => {
    const user = c.get("user")!;
    const result = await db.select().from(schema.pets).where(eq(schema.pets.userId, user.id));
    return c.json({ pets: result }, 200);
  })
  .post("/", requireAuth, async (c) => {
    const user = c.get("user")!;
    const body = await c.req.json();
    const qrCode = crypto.randomUUID();
    const [pet] = await db.insert(schema.pets).values({ ...body, userId: user.id, qrCode }).returning();
    return c.json({ pet }, 201);
  })
  // Public QR lookup — must be before /:id to avoid conflict
  .get("/qr/:qrCode", async (c) => {
    const { qrCode } = c.req.param();
    const [pet] = await db.select().from(schema.pets).where(eq(schema.pets.qrCode, qrCode));
    if (!pet) return c.json({ message: "Not found" }, 404);
    return c.json({ pet: { name: pet.name, species: pet.species, breed: pet.breed, photoUrl: pet.photoUrl, isLost: pet.isLost } }, 200);
  })
  .get("/:id", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    const [pet] = await db.select().from(schema.pets).where(and(eq(schema.pets.id, id), eq(schema.pets.userId, user.id)));
    if (!pet) return c.json({ message: "Not found" }, 404);
    return c.json({ pet }, 200);
  })
  .put("/:id", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    const body = await c.req.json();
    const [pet] = await db.update(schema.pets).set({ ...body, updatedAt: new Date() }).where(and(eq(schema.pets.id, id), eq(schema.pets.userId, user.id))).returning();
    if (!pet) return c.json({ message: "Not found" }, 404);
    return c.json({ pet }, 200);
  })
  .delete("/:id", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    await db.delete(schema.pets).where(and(eq(schema.pets.id, id), eq(schema.pets.userId, user.id)));
    return c.json({ success: true }, 200);
  })
  // Nested vaccines under pet — GET /pets/:id/vaccines, POST /pets/:id/vaccines
  .get("/:id/vaccines", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    const result = await db.select().from(schema.vaccines).where(and(eq(schema.vaccines.petId, id), eq(schema.vaccines.userId, user.id)));
    return c.json({ vaccines: result }, 200);
  })
  .post("/:id/vaccines", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    const body = await c.req.json();
    const [vaccine] = await db.insert(schema.vaccines).values({ ...body, petId: id, userId: user.id }).returning();
    return c.json({ vaccine }, 201);
  });
