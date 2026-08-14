// Notificações: email (Gmail/nodemailer) e SMS (Twilio, opcional)

export async function sendMail(to: string, subject: string, html: string) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    console.warn("[notify] Gmail não configurado — email não enviado");
    return false;
  }
  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.default.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
    await transporter.sendMail({ from: `"PetsLife" <${user}>`, to, subject, html });
    console.log("[notify] email enviado para", to);
    return true;
  } catch (err: any) {
    console.error("[notify] erro no email:", err?.message);
    return false;
  }
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
