import { Hono } from "hono";
import { db } from "../database";
import * as schema from "../database/schema";
import { eq } from "drizzle-orm";
import { requireAuth, authMiddleware } from "../middleware/auth";

// Testadores fechados (Play Console) — acesso ilimitado, sem bloqueio de trial/subscrição
const TESTER_EMAILS = [
  "digitalglobal2026fil@gmail.com",
  "videira.xana82@gmail.com",
  "ale.c.cardoso2010@gmail.com",
  "alebtc2121@gmail.com",
  "barbarateresa735@gmail.com",
  "julianasousa2006@gmail.com",
  "marianasousa42@gmail.com",
  "aleclikes@outlook.pt",
  "alessandra100275@gmail.com",
  "amorim2309izabel@gmail.com",
  "marco_reis19@hotmail.com",
  "ricardoabril1977@gmail.com",
  "amordebolo.almada@gmail.com",
  "amordebolo.corroios@gmail.com",
  "ritaraquelbia@gmail.com",
  "wiser.pt@hotmail.com",
  "mdccrds@gmail.com",
];

export const subscriptions = new Hono()
  .use("*", authMiddleware)
  .get("/me", requireAuth, async (c) => {
    const user = c.get("user")!;

    if (user.email && TESTER_EMAILS.includes(user.email.toLowerCase())) {
      return c.json({ subscription: null, isActive: true, isTrial: false, isTester: true }, 200);
    }

    const [sub] = await db.select().from(schema.subscriptions).where(eq(schema.subscriptions.userId, user.id));
    if (!sub) {
      // Auto-create trial
      const trialEndsAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      const [newSub] = await db.insert(schema.subscriptions).values({
        userId: user.id,
        plan: "trial",
        status: "active",
        trialEndsAt,
      }).returning();
      return c.json({ subscription: newSub, isActive: true, isTrial: true }, 200);
    }
    const now = new Date();
    const isTrial = sub.plan === "trial";
    const isActive = sub.status === "active" && (
      isTrial ? (sub.trialEndsAt ? sub.trialEndsAt > now : false) :
      (sub.currentPeriodEnd ? sub.currentPeriodEnd > now : false)
    );
    return c.json({ subscription: sub, isActive, isTrial }, 200);
  })
  .post("/activate", requireAuth, async (c) => {
    const user = c.get("user")!;
    const body = await c.req.json();
    const { plan } = body; // monthly or annual
    const now = new Date();
    const periodEnd = plan === "annual"
      ? new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
      : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const [existing] = await db.select().from(schema.subscriptions).where(eq(schema.subscriptions.userId, user.id));
    if (existing) {
      const [sub] = await db.update(schema.subscriptions).set({
        plan,
        status: "active",
        currentPeriodEnd: periodEnd,
        updatedAt: new Date(),
      }).where(eq(schema.subscriptions.userId, user.id)).returning();
      return c.json({ subscription: sub }, 200);
    }
    const [sub] = await db.insert(schema.subscriptions).values({
      userId: user.id,
      plan,
      status: "active",
      currentPeriodEnd: periodEnd,
    }).returning();
    return c.json({ subscription: sub }, 201);
  });
