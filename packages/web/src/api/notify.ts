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
export async function sendMail(to: string, subject: string, html: string) {
  const user = process.env.GMAIL_USER;
  const pass = (process.env.GMAIL_APP_PASSWORD ?? "").replace(/\s+/g, ""); // a Google mostra a password em blocos de 4
  if (!user || !pass) {
    lastMailError = "GMAIL_USER ou GMAIL_APP_PASSWORD em falta";
    console.warn("[notify] Gmail não configurado — email não enviado");
    return false;
  }

  const tentativas = [
    { port: 465, secure: true },
    { port: 587, secure: false, requireTLS: true },
  ];

  let ultimo = "";
  for (const t of tentativas) {
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.default.createTransport({
        host: "smtp.gmail.com",
        ...t,
        family: 4, // sem isto o Render tenta IPv6 e o Gmail recusa
        auth: { user, pass },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 20000,
      } as any);
      await transporter.sendMail({ from: `"PetsLife" <${user}>`, to, subject, html });
      lastMailError = null;
      console.log("[notify] email enviado para", to, "pela porta", t.port);
      return true;
    } catch (err: any) {
      ultimo = `porta ${t.port}: ${err?.message ?? String(err)}`;
      console.error("[notify] falhou pela", t.port, "-", err?.message ?? err);
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
