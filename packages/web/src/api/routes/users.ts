import { Hono } from "hono";
import { db } from "../database";
import * as schema from "../database/schema";
import * as authSchema from "../database/auth-schema";
import { eq } from "drizzle-orm";
import { requireAuth, authMiddleware } from "../middleware/auth";

export const users = new Hono()
  .use("*", authMiddleware)
  // GET /api/users/me — retorna dados do utilizador + perfil
  .get("/me", requireAuth, async (c) => {
    const user = c.get("user")!;
    const [profile] = await db.select().from(schema.userProfiles).where(eq(schema.userProfiles.userId, user.id));
    const [authUser] = await db
      .select({ name: authSchema.user.name, email: authSchema.user.email, image: authSchema.user.image })
      .from(authSchema.user)
      .where(eq(authSchema.user.id, user.id));
    // photoUrl: prefer auth.user.image (better-auth native), fallback to userProfiles.photoUrl
    const photoUrl = authUser?.image ?? profile?.photoUrl ?? null;
    return c.json({ user: { ...authUser, ...profile, id: user.id, photoUrl } }, 200);
  })
  // PUT /api/users/me — atualiza nome, perfil e foto
  .put("/me", requireAuth, async (c) => {
    const user = c.get("user")!;
    const body = await c.req.json<{ name?: string; phone?: string; address?: string; city?: string; photoUrl?: string }>();
    // Atualizar nome e imagem no better-auth se fornecido
    if (body.name || body.photoUrl !== undefined) {
      await db
        .update(authSchema.user)
        .set({
          ...(body.name ? { name: body.name } : {}),
          ...(body.photoUrl !== undefined ? { image: body.photoUrl } : {}),
          updatedAt: new Date(),
        })
        .where(eq(authSchema.user.id, user.id));
    }
    // Upsert do perfil
    const existing = await db.select().from(schema.userProfiles).where(eq(schema.userProfiles.userId, user.id));
    if (existing.length > 0) {
      await db.update(schema.userProfiles)
        .set({
          phone: body.phone,
          address: body.address,
          city: body.city,
          ...(body.photoUrl !== undefined ? { photoUrl: body.photoUrl } : {}),
          updatedAt: new Date(),
        })
        .where(eq(schema.userProfiles.userId, user.id));
    } else {
      await db.insert(schema.userProfiles).values({
        userId: user.id,
        phone: body.phone,
        address: body.address,
        city: body.city,
        photoUrl: body.photoUrl,
      });
    }
    return c.json({ success: true }, 200);
  });
