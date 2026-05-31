import { useState, useEffect } from "react";
import { authClient } from "../lib/auth";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token") ?? "";
    setToken(t);
    if (!t) { setStatus("error"); setMsg("Link inválido ou expirado."); }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) return setMsg("A password deve ter pelo menos 8 caracteres.");
    if (password !== confirm) return setMsg("As passwords não coincidem.");
    setStatus("loading");
    try {
      const res = await authClient.resetPassword({ newPassword: password, token });
      if ((res as any)?.error) throw new Error((res as any).error.message);
      setStatus("done");
      setMsg("Password alterada com sucesso! Já podes fechar esta página e entrar na app.");
    } catch (e: any) {
      setStatus("error");
      setMsg(e?.message ?? "Erro ao redefinir password. O link pode ter expirado.");
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F5ECD7", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#fff", borderRadius: 24, padding: 36, maxWidth: 420, width: "100%", boxShadow: "0 8px 40px rgba(107,58,42,0.12)", border: "1.5px solid #E8D5B7" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🐾</div>
          <h1 style={{ color: "#6B3A2A", fontWeight: 900, fontSize: 24, margin: 0 }}>Nova password</h1>
          <p style={{ color: "#A08060", fontSize: 13, marginTop: 6 }}>Define a tua nova password para a PetsLife</p>
        </div>

        {status === "done" ? (
          <div style={{ background: "#F0FFF4", border: "1.5px solid #9AE6B4", borderRadius: 12, padding: 20, textAlign: "center", color: "#276749", fontWeight: 600 }}>
            ✅ {msg}
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#A08060", display: "block", marginBottom: 6 }}>Nova password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
                style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #E8D5B7", background: "#F5ECD7", fontSize: 15, color: "#6B3A2A", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#A08060", display: "block", marginBottom: 6 }}>Confirmar password</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Repete a nova password"
                required
                style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #E8D5B7", background: "#F5ECD7", fontSize: 15, color: "#6B3A2A", boxSizing: "border-box" }}
              />
            </div>
            {msg && (
              <div style={{ background: "#FFF0F0", border: "1.5px solid #FECDCD", borderRadius: 10, padding: 12, color: "#E53E3E", fontSize: 13, fontWeight: 600 }}>
                {msg}
              </div>
            )}
            <button
              type="submit"
              disabled={status === "loading"}
              style={{ background: "#6B3A2A", color: "#fff", border: "none", borderRadius: 14, padding: "16px 0", fontWeight: 900, fontSize: 16, cursor: "pointer", marginTop: 4 }}
            >
              {status === "loading" ? "A guardar..." : "Guardar nova password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
