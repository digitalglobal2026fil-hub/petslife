import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer } from "better-auth/plugins";
import { db } from "./database";

async function sendResetEmail(to: string, name: string, url: string) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    console.warn("[auth] Gmail não configurado");
    return;
  }

  // Usar nodemailer via import dinâmico para evitar crash no boot
  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.default.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
    await transporter.sendMail({
      from: `"PetsLife" <${user}>`,
      to,
      subject: "Recuperar a tua password — PetsLife",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px">
          <h2 style="color:#FF6B35">🐾 PetsLife</h2>
          <p>Olá <strong>${name}</strong>,</p>
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
    console.log("[auth] Email enviado para", to);
  } catch (err: any) {
    console.error("[auth] Erro ao enviar email:", err.message);
  }
}

export const auth = betterAuth({
  basePath: "/api/auth",
  baseURL: process.env.WEBSITE_URL ?? "https://petslife.onrender.com",
  database: drizzleAdapter(db, { provider: "sqlite" }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await sendResetEmail(user.email, user.name || user.email, url);
    },
  },
  secret: process.env.BETTER_AUTH_SECRET ?? "petslife2024secretkey",
  // Sem isto o better-auth usa o default de 7 dias: a sessão guardada no
  // telemóvel expirava e a app dava "Sessão expirada" em tudo o que exige
  // login (upload de fotos/documentos), sem forma de recuperar.
  session: {
    expiresIn: 60 * 60 * 24 * 365, // 1 ano
    updateAge: 60 * 60 * 24,       // renova a validade a cada dia de uso
  },
  trustedOrigins: ["*"],
  plugins: [bearer()],
});
