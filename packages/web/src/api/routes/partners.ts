import { Hono } from "hono";
import { db } from "../database";
import * as schema from "../database/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { requireAuth } from "../middleware/auth";

const ADMIN_EMAIL = "digitalglobal2026fil@gmail.com";
const ADMIN_PIN = process.env.ADMIN_PIN || "2776";

// Benefícios possíveis e a sua duração
function periodEndFor(benefit: string): Date | null {
  const now = Date.now();
  switch (benefit) {
    case "lifetime":
      return new Date("2099-12-31");
    case "year1":
      return new Date(now + 365 * 24 * 60 * 60 * 1000);
    case "months3":
      return new Date(now + 90 * 24 * 60 * 60 * 1000);
    default:
      return null; // discount / none -> não dá acesso grátis
  }
}

function planFor(benefit: string): string {
  if (benefit === "lifetime") return "lifetime";
  if (benefit === "year1") return "annual";
  if (benefit === "months3") return "monthly";
  return "trial";
}

function isAdmin(c: any) {
  const user = c.get("user");
  const pin = c.req.header("x-admin-pin") || c.req.query("pin");
  const extra = (process.env.ADMIN_USER_IDS || "").split(",").map((s: string) => s.trim()).filter(Boolean);
  const emailOk =
    user?.email?.toLowerCase() === ADMIN_EMAIL || extra.includes(user?.email) || extra.includes(user?.id);
  return emailOk && pin === ADMIN_PIN;
}

const rnd = (n = 5) =>
  Array.from({ length: n }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("");

export const partners = new Hono()

  // ---------- PÚBLICO (utilizador da app) ----------

  // Verificar um código sem o resgatar (mostra o que vai receber)
  .get("/check/:code", async (c) => {
    const code = c.req.param("code").toUpperCase().trim();
    const [pc] = await db.select().from(schema.partnerCodes).where(eq(schema.partnerCodes.code, code));
    if (!pc || !pc.active) return c.json({ valid: false, error: "Código não encontrado" }, 404);
    if (pc.maxUses != null && pc.uses >= pc.maxUses) {
      return c.json({ valid: false, error: "Este código já atingiu o limite de utilizações" }, 400);
    }
    const [p] = await db.select().from(schema.partners).where(eq(schema.partners.id, pc.partnerId));
    return c.json({
      valid: true,
      benefit: pc.benefit,
      partnerName: p?.name ?? null,
      label: pc.label,
    });
  })

  // Resgatar código
  .post("/redeem", requireAuth, async (c) => {
    const user = c.get("user")!;
    const body = await c.req.json();
    const code = String(body.code || "").toUpperCase().trim();
    if (!code) return c.json({ error: "Indica um código" }, 400);

    const [pc] = await db.select().from(schema.partnerCodes).where(eq(schema.partnerCodes.code, code));
    if (!pc || !pc.active) return c.json({ error: "Código não encontrado" }, 404);
    if (pc.maxUses != null && pc.uses >= pc.maxUses) {
      return c.json({ error: "Este código já atingiu o limite de utilizações" }, 400);
    }

    // Já resgatou este código antes?
    const [already] = await db
      .select()
      .from(schema.codeRedemptions)
      .where(and(eq(schema.codeRedemptions.codeId, pc.id), eq(schema.codeRedemptions.userId, user.id)));
    if (already) return c.json({ error: "Já usaste este código" }, 400);

    await db.insert(schema.codeRedemptions).values({
      codeId: pc.id,
      code: pc.code,
      partnerId: pc.partnerId,
      userId: user.id,
      userEmail: user.email,
      benefit: pc.benefit,
    });
    await db
      .update(schema.partnerCodes)
      .set({ uses: pc.uses + 1 })
      .where(eq(schema.partnerCodes.id, pc.id));

    const periodEnd = periodEndFor(pc.benefit);
    let message = "Código registado! O desconto é aplicado no pagamento.";

    if (periodEnd) {
      const plan = planFor(pc.benefit);
      const [existing] = await db
        .select()
        .from(schema.subscriptions)
        .where(eq(schema.subscriptions.userId, user.id));
      if (existing) {
        await db
          .update(schema.subscriptions)
          .set({ plan, status: "active", currentPeriodEnd: periodEnd, updatedAt: new Date() })
          .where(eq(schema.subscriptions.userId, user.id));
      } else {
        await db
          .insert(schema.subscriptions)
          .values({ userId: user.id, plan, status: "active", currentPeriodEnd: periodEnd });
      }
      message =
        pc.benefit === "lifetime"
          ? "Código aplicado! Tens acesso vitalício, nunca pagas."
          : pc.benefit === "year1"
            ? "Código aplicado! Tens 1 ano de acesso completo grátis."
            : "Código aplicado! Tens 3 meses de acesso completo grátis.";
    }

    return c.json({ success: true, benefit: pc.benefit, message });
  })

  // ---------- ADMIN (PIN) ----------

  .post("/admin/login", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { pin } = await c.req.json();
    const extra = (process.env.ADMIN_USER_IDS || "").split(",").map((s: string) => s.trim()).filter(Boolean);
    const emailOk = user.email?.toLowerCase() === ADMIN_EMAIL || extra.includes(user.email) || extra.includes(user.id);
    if (!emailOk) return c.json({ error: "Sem permissão" }, 403);
    if (pin !== ADMIN_PIN) return c.json({ error: "PIN incorrecto" }, 401);
    return c.json({ ok: true });
  })

  // Painel: parceiros + contagens + ranking
  .get("/admin/dashboard", requireAuth, async (c) => {
    if (!isAdmin(c)) return c.json({ error: "Sem permissão" }, 403);

    const all = await db.select().from(schema.partners).orderBy(desc(schema.partners.createdAt));
    const codes = await db.select().from(schema.partnerCodes);
    const reds = await db.select().from(schema.codeRedemptions).orderBy(desc(schema.codeRedemptions.createdAt));

    const list = all.map((p) => {
      const myCodes = codes.filter((x) => x.partnerId === p.id);
      const myReds = reds.filter((x) => x.partnerId === p.id);
      const last30 = myReds.filter(
        (x) => x.createdAt && new Date(x.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000,
      );
      return {
        ...p,
        codesCount: myCodes.length,
        totalRedemptions: myReds.length,
        last30Days: last30.length,
        codes: myCodes.map((cc) => ({
          ...cc,
          redemptions: reds.filter((r) => r.codeId === cc.id).length,
        })),
      };
    });

    list.sort((a, b) => b.totalRedemptions - a.totalRedemptions);

    return c.json({
      partners: list,
      totals: {
        partners: all.length,
        codes: codes.length,
        redemptions: reds.length,
        last30Days: reds.filter(
          (x) => x.createdAt && new Date(x.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000,
        ).length,
      },
      recent: reds.slice(0, 40),
    });
  })

  // Criar parceiro (gera o código principal dele)
  .post("/admin/partners", requireAuth, async (c) => {
    if (!isAdmin(c)) return c.json({ error: "Sem permissão" }, 403);
    const body = await c.req.json();
    const name = String(body.name || "").trim();
    if (!name) return c.json({ error: "Nome obrigatório" }, 400);

    const benefit = body.partnerBenefit || "lifetime";
    let mainCode = String(body.mainCode || "").toUpperCase().trim();
    if (!mainCode) {
      mainCode = `${name.split(/\s+/)[0].toUpperCase().replace(/[^A-Z]/g, "").slice(0, 8) || "PARC"}-${rnd(4)}`;
    }

    const [dup] = await db.select().from(schema.partners).where(eq(schema.partners.mainCode, mainCode));
    if (dup) return c.json({ error: "Esse código já existe" }, 400);

    const [p] = await db
      .insert(schema.partners)
      .values({
        name,
        email: body.email ?? null,
        phone: body.phone ?? null,
        notes: body.notes ?? null,
        mainCode,
        partnerBenefit: benefit,
      })
      .returning();

    // Código principal (só ele usa, 1 utilização)
    await db.insert(schema.partnerCodes).values({
      partnerId: p.id,
      code: mainCode,
      kind: "main",
      benefit,
      maxUses: 1,
      label: "Código do parceiro",
    });

    return c.json({ partner: p }, 201);
  })

  // Criar código-filho para o parceiro distribuir
  .post("/admin/partners/:id/codes", requireAuth, async (c) => {
    if (!isAdmin(c)) return c.json({ error: "Sem permissão" }, 403);
    const partnerId = c.req.param("id");
    const body = await c.req.json();

    const [p] = await db.select().from(schema.partners).where(eq(schema.partners.id, partnerId));
    if (!p) return c.json({ error: "Parceiro não encontrado" }, 404);

    let code = String(body.code || "").toUpperCase().trim();
    if (!code) code = `${p.mainCode.split("-")[0]}${rnd(3)}`;

    const [dup] = await db.select().from(schema.partnerCodes).where(eq(schema.partnerCodes.code, code));
    if (dup) return c.json({ error: "Esse código já existe" }, 400);

    const [pc] = await db
      .insert(schema.partnerCodes)
      .values({
        partnerId,
        code,
        kind: "referral",
        benefit: body.benefit || "discount",
        maxUses: body.maxUses ?? null,
        label: body.label ?? null,
      })
      .returning();

    return c.json({ code: pc }, 201);
  })

  .patch("/admin/codes/:id", requireAuth, async (c) => {
    if (!isAdmin(c)) return c.json({ error: "Sem permissão" }, 403);
    const id = c.req.param("id");
    const body = await c.req.json();
    const patch: any = {};
    if (body.active != null) patch.active = !!body.active;
    if (body.benefit) patch.benefit = body.benefit;
    if (body.maxUses !== undefined) patch.maxUses = body.maxUses;
    if (body.label !== undefined) patch.label = body.label;
    await db.update(schema.partnerCodes).set(patch).where(eq(schema.partnerCodes.id, id));
    return c.json({ ok: true });
  })

  .delete("/admin/codes/:id", requireAuth, async (c) => {
    if (!isAdmin(c)) return c.json({ error: "Sem permissão" }, 403);
    await db.delete(schema.partnerCodes).where(eq(schema.partnerCodes.id, c.req.param("id")));
    return c.json({ ok: true });
  })

  .delete("/admin/partners/:id", requireAuth, async (c) => {
    if (!isAdmin(c)) return c.json({ error: "Sem permissão" }, 403);
    const id = c.req.param("id");
    await db.delete(schema.partnerCodes).where(eq(schema.partnerCodes.partnerId, id));
    await db.delete(schema.partners).where(eq(schema.partners.id, id));
    return c.json({ ok: true });
  });
