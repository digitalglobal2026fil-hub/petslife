import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth";
import { authMiddleware } from "./middleware/auth";
import { pets } from "./routes/pets";
import { vaccines } from "./routes/vaccines";
import { appointments } from "./routes/appointments";
import { health } from "./routes/health";
import { photos } from "./routes/photos";
import { documents } from "./routes/documents";
import { posts } from "./routes/posts";
import { marketplace } from "./routes/marketplace";
import { subscriptions } from "./routes/subscriptions";
import { articles } from "./routes/articles";
import { consultations } from "./routes/consultations";
import { upload } from "./routes/upload";
import { dewormings } from "./routes/dewormings";
import { weightLogs } from "./routes/weight-logs";
import { businesses } from "./routes/businesses";
import { promoCodes } from "./routes/promo-codes";
import chat from "./routes/chat";
import { lostPets } from "./routes/lost-pets";
import { reports } from "./routes/reports";
import { missions } from "./routes/missions";
import { memorials } from "./routes/memorials";
import { agenda } from "./routes/agenda";
import { partners } from "./routes/partners";
import { reminders } from "./routes/reminders";
import { petScans } from "./routes/pet-scans";
import { users } from "./routes/users";
import { ensureTables } from "./database/ensure-tables";
import { sendMail, getLastMailError } from "./notify";

// Cria tabelas novas no arranque (o projecto não tem migrações automáticas)
ensureTables();

const app = new Hono()
  .use(cors({
    origin: (origin) => origin ?? "*",
    credentials: true,
    exposeHeaders: ["set-auth-token"],
  }))
  .on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw))
  .basePath("api")
  .use("*", authMiddleware)
  .get("/health", (c) => c.json({ status: "ok" }, 200))
  // Diagnóstico de notificações (protegido pelo PIN de administração).
  // Serve para confirmar se o Gmail/Twilio estão configurados no servidor e
  // para enviar um email de teste sem precisar de digitalizar um QR real.
  .get("/diag/notify", async (c) => {
    const pin = c.req.query("pin");
    if (pin !== (process.env.ADMIN_PIN ?? "2776")) return c.json({ error: "PIN inválido" }, 403);
    const to = c.req.query("to");
    const cfg = {
      gmailUser: Boolean(process.env.GMAIL_USER),
      gmailPassword: Boolean(process.env.GMAIL_APP_PASSWORD),
      twilio: Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM),
      websiteUrl: process.env.WEBSITE_URL ?? null,
    };
    let emailSent: boolean | null = null;
    if (to) {
      emailSent = await sendMail(
        to,
        "\✅ Teste de aviso — PetsLife",
        `<div style="font-family:sans-serif;padding:24px">
           <h2 style="color:#FF6B35">\ud83d\udc3e PetsLife</h2>
           <p>Este é um email de teste do servidor. Se o recebeu, os avisos do QR code chegam bem.</p>
         </div>`,
      );
    }
    let probe: any = null;
    if (to && c.req.query("probe") === "1") {
      const { probeMail } = await import("../api/mail-probe");
      probe = await probeMail(to);
    }
    return c.json({ ...cfg, emailSent, lastError: getLastMailError(), probe }, 200);
  })
  // Reset de password da conta da administradora (protegido pelo ADMIN_PIN).
  // GET /api/admin/reset-password?pin=2776&email=...&password=...
  .get("/admin/reset-password", async (c) => {
    const pin = c.req.query("pin");
    if (pin !== (process.env.ADMIN_PIN ?? "2776")) return c.json({ error: "PIN inválido" }, 403);
    const email = (c.req.query("email") ?? "").trim().toLowerCase();
    const password = c.req.query("password") ?? "";
    if (!email || password.length < 8) return c.json({ error: "email e password (min 8) obrigatórios" }, 400);
    try {
      const { db } = await import("./database");
      const { user: userTable } = await import("./database/auth-schema");
      const { eq } = await import("drizzle-orm");
      const rows = await db.select().from(userTable).where(eq(userTable.email, email));
      const found = rows[0];
      if (!found) return c.json({ error: "Utilizador não existe" }, 404);
      const actx = await auth.$context;
      const hashed = await actx.password.hash(password);
      await actx.internalAdapter.updatePassword(found.id, hashed);
      return c.json({ ok: true, email, userId: found.id }, 200);
    } catch (e: any) {
      return c.json({ error: String(e?.message ?? e) }, 500);
    }
  })
  .route("/pets", pets)
  .route("/vaccines", vaccines)
  .route("/appointments", appointments)
  .route("/health-logs", health)
  .route("/photos", photos)
  .route("/documents", documents)
  .route("/posts", posts)
  .route("/marketplace", marketplace)
  .route("/subscriptions", subscriptions)
  .route("/articles", articles)
  .route("/consultations", consultations)
  .route("/upload", upload)
  .route("/dewormings", dewormings)
  .route("/weight-logs", weightLogs)
  .route("/businesses", businesses)
  .route("/promo-codes", promoCodes)
  .route("/chats", chat)
  .route("/lost-pets", lostPets)
  .route("/partners", partners)
  .route("/reminders", reminders)
  .route("/pet-scans", petScans)
  .route("/users", users)
  .route("/reports", reports)
  .route("/missions", missions)
  .route("/memorials", memorials)
  .route("/agenda", agenda);

export type AppType = typeof app;
export default app;
