// Testa várias formas de sair do servidor para o SMTP do Gmail.
// O Render bloqueia portas SMTP em alguns planos — isto diz-nos exactamente
// o que passa e o que não passa, num só pedido.

type Attempt = { name: string; ok: boolean; error?: string; ms: number };

export async function probeMail(to: string) {
  const user = process.env.GMAIL_USER ?? "";
  const pass = (process.env.GMAIL_APP_PASSWORD ?? "").replace(/\s+/g, "");
  const attempts: Attempt[] = [];
  const nodemailer = (await import("nodemailer")).default;

  const configs: { name: string; opts: any }[] = [
    { name: "465 SSL (auto)", opts: { host: "smtp.gmail.com", port: 465, secure: true } },
    { name: "465 SSL (IPv4)", opts: { host: "smtp.gmail.com", port: 465, secure: true, family: 4 } },
    { name: "587 STARTTLS (IPv4)", opts: { host: "smtp.gmail.com", port: 587, secure: false, requireTLS: true, family: 4 } },
    { name: "2525 (IPv4)", opts: { host: "smtp.gmail.com", port: 2525, secure: false, family: 4 } },
  ];

  for (const cfg of configs) {
    const t0 = Date.now();
    try {
      const transporter = nodemailer.createTransport({
        ...cfg.opts,
        auth: { user, pass },
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 8000,
      });
      await transporter.sendMail({
        from: `"PetsLife" <${user}>`,
        to,
        subject: `Teste PetsLife — ${cfg.name}`,
        html: `<p>Email de teste enviado por <strong>${cfg.name}</strong>.</p>`,
      });
      attempts.push({ name: cfg.name, ok: true, ms: Date.now() - t0 });
      break; // já sabemos que uma funciona, não vale a pena mandar mais
    } catch (e: any) {
      attempts.push({ name: cfg.name, ok: false, error: e?.message ?? String(e), ms: Date.now() - t0 });
    }
  }

  // Confirmar que HTTPS para fora funciona (se sim, um serviço de email por
  // API — tipo Resend/Brevo — resolve, mesmo com o SMTP bloqueado).
  let httpsOut = false;
  try {
    const r = await fetch("https://api.resend.com/", { method: "GET", signal: AbortSignal.timeout(8000) });
    httpsOut = r.status > 0;
  } catch {
    httpsOut = false;
  }

  return { attempts, httpsOut };
}
