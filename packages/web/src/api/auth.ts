import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer } from "better-auth/plugins";
import { db } from "./database";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const auth = betterAuth({
  basePath: "/api/auth",
  baseURL: process.env.WEBSITE_URL ?? "https://petslife.onrender.com",
  database: drizzleAdapter(db, { provider: "sqlite" }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn("[auth] Gmail não configurado — email não enviado");
        return;
      }
      await transporter.sendMail({
        from: `"PetsLife" <${process.env.GMAIL_USER}>`,
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
