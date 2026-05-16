import { Hono } from "hono";
import { db } from "../database";
import * as schema from "../database/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, authMiddleware } from "../middleware/auth";

export const photos = new Hono()
  .use("*", authMiddleware)
  .get("/pet/:petId", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { petId } = c.req.param();
    const result = await db.select().from(schema.photos).where(and(eq(schema.photos.petId, petId), eq(schema.photos.userId, user.id)));
    return c.json({ photos: result }, 200);
  })
  .post("/", requireAuth, async (c) => {
    const user = c.get("user")!;
    const body = await c.req.json();
    const [photo] = await db.insert(schema.photos).values({ ...body, userId: user.id }).returning();
    return c.json({ photo }, 201);
  })
  .delete("/:id", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    await db.delete(schema.photos).where(and(eq(schema.photos.id, id), eq(schema.photos.userId, user.id)));
    return c.json({ success: true }, 200);
  });
