import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer } from "better-auth/plugins";
import { db } from "./database";
import { sendMail, getLastMailError } from "./notify";

/**
 * Email de recuperação de password.
 *
 * ANTES: este ficheiro tinha o seu próprio envio, com `service: "gmail"` (porta
 * 587) e sem limpar os espaços da app password. No Render essa ligação ficava
 * pendurada e o erro era engolido — o email nunca chegava, mas a app dizia
 * "enviado". Passa a usar o sendMail de notify.ts, que usa a porta 465 com SSL
 * e é o mesmo que já entrega os avisos do QR.
 */
async function sendResetEmail(to: string, name: string, url: string) {
  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px">
      <h2 style="color:#FF6B35">🐾 PetsLife</h2>
      <p>Olá <strong>${name}</strong>,</p>
      <p>Recebemos um pedido para mudar a sua password.</p>
      <p style="text-align:center;margin:32px 0">
        <a href="${url}" style="background:#FF6B35;color:#fff;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:700">
          Escolher password nova
        </a>
      </p>
      <p style="color:#6B7280;font-size:13px">
        Se o botão não funcionar, copie este endereço para o browser:<br/>
        <span style="word-break:break-all">${url}</span>
      </p>
      <p style="color:#6B7280;font-size:13px">
        Se não fez este pedido, ignore este email.<br/>
        O link expira dentro de 1 hora.
      </p>
    </div>
  `;
  const ok = await sendMail(to, "Recuperar a password — PetsLife", html);
  if (!ok) console.error("[auth] email de recuperação NÃO foi enviado para", to, "-", getLastMailError());
  return ok;
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
  // A app Android/iOS não envia cabeçalho "Origin". Assim que o telemóvel
  // tem um cookie guardado, o better-auth exigia esse cabeçalho e rejeitava
  // o login com "Missing or null Origin" (ficava impossível entrar depois de
  // fazer logout). Esta API é usada por app nativa, não por formulários web
  // de terceiros, por isso a verificação de CSRF/origem não se aplica.
  advanced: {
    disableCSRFCheck: true,
    disableOriginCheck: true,
  },
  plugins: [bearer()],
});
