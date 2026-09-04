import { Hono } from "hono";
import { db } from "../database";
import * as schema from "../database/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middleware/auth";
import { isAdmin } from "../lib/admin";

// Quem pode criar/ver/apagar códigos: os emails de administração da app
// (packages/web/src/api/lib/admin.ts) ou, se estiver definida, a variável
// de ambiente ADMIN_USER_IDS (ids ou emails separados por vírgulas).
function podeGerir(user: { id: string; email: string }): boolean {
  if (isAdmin(user)) return true;
  const extra = (process.env.ADMIN_USER_IDS || "")
    .split(",").map((s: string) => s.trim()).filter(Boolean);
  return extra.includes(user.id) || extra.includes(user.email);
}

export const promoCodes = new Hono()

  // Verificar um código sem estar autenticado (página web /promo/CODIGO)
  .get("/check/:code", async (c) => {
    const raw = c.req.param("code") || "";
    const code = raw.toUpperCase().trim();
    if (!code) return c.json({ error: "Código inválido" }, 400);

    const [promo] = await db.select().from(schema.promoCodes)
      .where(eq(schema.promoCodes.code, code));

    if (!promo) return c.json({ valid: false, used: false, code }, 200);
    return c.json({ valid: true, used: !!promo.usedByUserId, code }, 200);
  })

  // Resgatar código (app mobile)
  .post("/redeem", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { code } = await c.req.json();

    if (!code) return c.json({ error: "Código inválido" }, 400);

    const [promo] = await db.select().from(schema.promoCodes)
      .where(eq(schema.promoCodes.code, code.toUpperCase().trim()));

    if (!promo) return c.json({ error: "Código não encontrado" }, 404);
    if (promo.usedByUserId) return c.json({ error: "Este código já foi utilizado" }, 400);

    // Marcar código como usado
    await db.update(schema.promoCodes)
      .set({ usedByUserId: user.id, usedAt: new Date() })
      .where(eq(schema.promoCodes.id, promo.id));

    // Dar subscrição vitalícia
    const [existing] = await db.select().from(schema.subscriptions)
      .where(eq(schema.subscriptions.userId, user.id));

    const farFuture = new Date("2099-12-31");

    if (existing) {
      await db.update(schema.subscriptions)
        .set({ plan: "lifetime", status: "active", currentPeriodEnd: farFuture, updatedAt: new Date() })
        .where(eq(schema.subscriptions.userId, user.id));
    } else {
      await db.insert(schema.subscriptions).values({
        userId: user.id,
        plan: "lifetime",
        status: "active",
        currentPeriodEnd: farFuture,
      });
    }

    return c.json({ success: true, message: "Código aplicado! Tens acesso vitalício." });
  })

  // Listar todos os códigos (admin - só tu)
  .get("/admin", requireAuth, async (c) => {
    const user = c.get("user")!;
    if (!podeGerir(user)) return c.json({ error: "Sem permissão" }, 403);

    const codes = await db.select().from(schema.promoCodes)
      .orderBy(schema.promoCodes.createdAt);

    return c.json({ codes });
  })

  // Criar código (admin)
  .post("/admin", requireAuth, async (c) => {
    const user = c.get("user")!;
    if (!podeGerir(user)) return c.json({ error: "Sem permissão" }, 403);

    const { description, customCode } = await c.req.json();

    // Gerar código aleatório ou usar personalizado
    const code = customCode
      ? customCode.toUpperCase().trim()
      : `PETS-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const [existing] = await db.select().from(schema.promoCodes)
      .where(eq(schema.promoCodes.code, code));
    if (existing) return c.json({ error: "Código já existe" }, 400);

    const [promo] = await db.insert(schema.promoCodes)
      .values({ code, description })
      .returning();

    return c.json({ promo });
  })

  // Apagar código (admin)
  .delete("/admin/:id", requireAuth, async (c) => {
    const user = c.get("user")!;
    if (!podeGerir(user)) return c.json({ error: "Sem permissão" }, 403);

    const id = c.req.param("id");
    await db.delete(schema.promoCodes).where(eq(schema.promoCodes.id, id));
    return c.json({ success: true });
  });
