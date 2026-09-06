// Notificações: email (Gmail/nodemailer) e SMS (Twilio, opcional)

/** Guarda o último erro de email, para o endpoint de diagnóstico o mostrar. */
let lastMailError: string | null = null;
export function getLastMailError() {
  return lastMailError;
}

/**
 * Envio de email pelo Gmail.
 *
 * PORQUE É QUE ISTO TEM DUAS TENTATIVAS
 * No Render, o nome smtp.gmail.com resolve primeiro para um endereço IPv6 e a
 * ligação é recusada ("ECONNREFUSED ...:465"). Resultado: nenhum email saía —
 * nem a recuperação de password, nem os avisos do QR — e o erro ficava escondido.
 * Passa a forçar IPv4 (family: 4) e, se a porta 465 falhar, tenta a 587.
 */
/**
 * ENVIO POR API WEB (Brevo ou Resend) — é este que funciona no Render.
 *
 * O Render bloqueia as portas de SMTP: a 465 é recusada e a 587 fica em espera
 * até desistir. Com o Gmail por SMTP nunca sai email nenhum, seja qual for a
 * password. Por isso o envio passa primeiro por uma API web, que usa a porta
 * normal da internet (443) e não é bloqueada.
 *
 * Basta uma destas variáveis no Render:
 *   BREVO_API_KEY   → conta gratuita em brevo.com (300 emails por dia)
 *   RESEND_API_KEY  → conta gratuita em resend.com
 *   MAIL_FROM       → opcional, o endereço que aparece como remetente
 *                     (por omissão usa o GMAIL_USER)
 *
 * Se nenhuma existir, tenta o SMTP à mesma — para não deixar de funcionar em
 * sítios onde o SMTP não esteja bloqueado.
 */
async function enviarPorApi(to: string, subject: string, html: string): Promise<boolean | null> {
  const remetente = process.env.MAIL_FROM || process.env.GMAIL_USER || "";

  const brevo = process.env.BREVO_API_KEY;
  if (brevo) {
    try {
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "api-key": brevo, "Content-Type": "application/json", accept: "application/json" },
        body: JSON.stringify({
          sender: { name: "PetsLife", email: remetente },
          to: [{ email: to }],
          subject,
          htmlContent: html,
        }),
      });
      if (res.ok) {
        lastMailError = null;
        console.log("[notify] email enviado por Brevo para", to);
        return true;
      }
      lastMailError = `Brevo ${res.status}: ${(await res.text().catch(() => "")).slice(0, 300)}`;
      console.error("[notify]", lastMailError);
      return false;
    } catch (e: any) {
      lastMailError = `Brevo: ${e?.message ?? String(e)}`;
      console.error("[notify]", lastMailError);
      return false;
    }
  }

  // Mailjet — plano gratuito com 6000 emails por mês (200 por dia).
  const mjKey = process.env.MAILJET_API_KEY;
  const mjSecret = process.env.MAILJET_SECRET_KEY;
  if (mjKey && mjSecret) {
    try {
      const cred = Buffer.from(`${mjKey}:${mjSecret}`).toString("base64");
      const res = await fetch("https://api.mailjet.com/v3.1/send", {
        method: "POST",
        headers: { Authorization: `Basic ${cred}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          Messages: [{
            From: { Email: remetente, Name: "PetsLife" },
            To: [{ Email: to }],
            Subject: subject,
            HTMLPart: html,
          }],
        }),
      });
      if (res.ok) {
        lastMailError = null;
        console.log("[notify] email enviado por Mailjet para", to);
        return true;
      }
      lastMailError = `Mailjet ${res.status}: ${(await res.text().catch(() => "")).slice(0, 300)}`;
      console.error("[notify]", lastMailError);
      return false;
    } catch (e: any) {
      lastMailError = `Mailjet: ${e?.message ?? String(e)}`;
      console.error("[notify]", lastMailError);
      return false;
    }
  }

  // SendGrid — plano gratuito com 100 emails por dia.
  const sg = process.env.SENDGRID_API_KEY;
  if (sg) {
    try {
      const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: { Authorization: `Bearer ${sg}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: remetente, name: "PetsLife" },
          subject,
          content: [{ type: "text/html", value: html }],
        }),
      });
      if (res.ok || res.status === 202) {
        lastMailError = null;
        console.log("[notify] email enviado por SendGrid para", to);
        return true;
      }
      lastMailError = `SendGrid ${res.status}: ${(await res.text().catch(() => "")).slice(0, 300)}`;
      console.error("[notify]", lastMailError);
      return false;
    } catch (e: any) {
      lastMailError = `SendGrid: ${e?.message ?? String(e)}`;
      console.error("[notify]", lastMailError);
      return false;
    }
  }

  const resend = process.env.RESEND_API_KEY;
  if (resend) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resend}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: `PetsLife <${remetente}>`, to: [to], subject, html }),
      });
      if (res.ok) {
        lastMailError = null;
        console.log("[notify] email enviado por Resend para", to);
        return true;
      }
      lastMailError = `Resend ${res.status}: ${(await res.text().catch(() => "")).slice(0, 300)}`;
      console.error("[notify]", lastMailError);
      return false;
    } catch (e: any) {
      lastMailError = `Resend: ${e?.message ?? String(e)}`;
      console.error("[notify]", lastMailError);
      return false;
    }
  }

  return null; // nenhuma API configurada — segue para o SMTP
}

/** Diz qual a forma de envio que está configurada (para o diagnóstico). */
export function metodoDeEnvio(): string {
  if (process.env.BREVO_API_KEY) return "Brevo (API web)";
  if (process.env.MAILJET_API_KEY && process.env.MAILJET_SECRET_KEY) return "Mailjet (API web)";
  if (process.env.SENDGRID_API_KEY) return "SendGrid (API web)";
  if (process.env.RESEND_API_KEY) return "Resend (API web)";
  return "SMTP do Gmail (bloqueado no Render)";
}

/** Guarda o endereço IPv4 do Gmail depois de o descobrir uma vez. */
let ipGmail: string | null = null;

/**
 * Descobre o endereço IPv4 do smtp.gmail.com.
 *
 * No Render o nome resolve primeiro para IPv6 e a ligação é recusada
 * ("ECONNREFUSED 2a00:1450:...:465"). A opção `family: 4` do nodemailer não
 * chega — é preciso ligar directamente ao endereço IPv4, dizendo ao TLS que o
 * certificado é o do smtp.gmail.com.
 */
async function enderecoIPv4(): Promise<string | null> {
  if (ipGmail) return ipGmail;
  try {
    const dns = await import("node:dns");
    const ips = await dns.promises.resolve4("smtp.gmail.com");
    ipGmail = ips[0] ?? null;
    return ipGmail;
  } catch (e: any) {
    console.error("[notify] não foi possível resolver o IPv4 do Gmail:", e?.message ?? e);
    return null;
  }
}

export async function sendMail(to: string, subject: string, html: string) {
  const user = process.env.GMAIL_USER;
  const pass = (process.env.GMAIL_APP_PASSWORD ?? "").replace(/\s+/g, ""); // a Google mostra a password em blocos de 4
  if (!user || !pass) {
    lastMailError = "GMAIL_USER ou GMAIL_APP_PASSWORD em falta";
    console.warn("[notify] Gmail não configurado — email não enviado");
    return false;
  }

  // Primeiro a API web (a única que passa no Render).
  const porApi = await enviarPorApi(to, subject, html);
  if (porApi !== null) return porApi;

  const ip = await enderecoIPv4();
  const anfitrioes = ip ? [ip, "smtp.gmail.com"] : ["smtp.gmail.com"];
  const portas = [
    { port: 465, secure: true },
    { port: 587, secure: false, requireTLS: true },
  ];

  let ultimo = "";
  for (const host of anfitrioes) {
    for (const t of portas) {
      try {
        const nodemailer = await import("nodemailer");
        const transporter = nodemailer.default.createTransport({
          host,
          ...t,
          family: 4,
          auth: { user, pass },
          // Ao ligar por endereço IP é preciso dizer qual o nome do certificado.
          tls: { servername: "smtp.gmail.com" },
          connectionTimeout: 12000,
          greetingTimeout: 12000,
          socketTimeout: 20000,
        } as any);
        await transporter.sendMail({ from: `"PetsLife" <${user}>`, to, subject, html });
        lastMailError = null;
        console.log("[notify] email enviado para", to, "via", host, t.port);
        return true;
      } catch (err: any) {
        ultimo = `${host}:${t.port} — ${err?.message ?? String(err)}`;
        console.error("[notify] falhou", ultimo);
      }
    }
  }

  lastMailError = ultimo;
  return false;
}

export async function sendSms(to: string, body: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM;
  if (!sid || !token || !from || !to) {
    console.warn("[notify] Twilio não configurado — SMS não enviado");
    return false;
  }
  try {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: to, From: from, Body: body }).toString(),
    });
    if (!res.ok) {
      console.error("[notify] Twilio falhou:", res.status, await res.text());
      return false;
    }
    console.log("[notify] SMS enviado para", to);
    return true;
  } catch (err: any) {
    console.error("[notify] erro no SMS:", err?.message);
    return false;
  }
}

export function siteUrl() {
  return (process.env.WEBSITE_URL ?? "https://petslife.onrender.com").replace(/\/$/, "");
}
