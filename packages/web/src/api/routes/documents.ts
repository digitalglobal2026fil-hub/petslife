import { Hono } from "hono";
import { db } from "../database";
import * as schema from "../database/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, authMiddleware } from "../middleware/auth";

export const documents = new Hono()
  .use("*", authMiddleware)
  .get("/pet/:petId", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { petId } = c.req.param();
    const result = await db.select().from(schema.documents).where(and(eq(schema.documents.petId, petId), eq(schema.documents.userId, user.id)));
    return c.json({ documents: result }, 200);
  })
  .post("/", requireAuth, async (c) => {
    const user = c.get("user")!;
    const body = await c.req.json();
    const [doc] = await db.insert(schema.documents).values({ ...body, userId: user.id }).returning();
    return c.json({ document: doc }, 201);
  })
  .delete("/:id", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    await db.delete(schema.documents).where(and(eq(schema.documents.id, id), eq(schema.documents.userId, user.id)));
    return c.json({ success: true }, 200);
  });
