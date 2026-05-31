import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer } from "better-auth/plugins";
import { db } from "./database";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const auth = betterAuth({
  basePath: "/api/auth",
  baseURL: process.env.WEBSITE_URL,
  database: drizzleAdapter(db, { provider: "sqlite" }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      if (!resend) {
        console.warn("[auth] RESEND_API_KEY não configurado — email não enviado");
        return;
      }
      await resend.emails.send({
        from: "PetsLife <onboarding@resend.dev>",
        to: user.email,
        subject: "Recuperar a tua password — PetsLife",
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px">
            <h2 style="color:#FF6B35">🐾 PetsLife</h2>
            <p>Olá <strong>${user.name || user.email}</strong>,</p>
            <p>Recebemos um pedido para redefinir a tua password.</p>
            <p style="text-align:center;margin:32px 0">
              <a href="${url}" style="background:#FF6B35;color:#fff;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:700">
                Redefinir password
              </a>
            </p>
            <p style="color:#6B7280;font-size:13px">
              Se não fizeste este pedido, ignora este email.<br/>
              O link expira em 1 hora.
            </p>
          </div>
        `,
      });
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: ["*"],
  plugins: [bearer()],
});
