import { useEffect, useState } from "react";

const PLAY_STORE =
  "https://play.google.com/store/apps/details?id=com.petislife2.app";

function getCode(): string {
  const parts = window.location.pathname.split("/").filter(Boolean);
  return (parts[parts.length - 1] ?? "").toUpperCase();
}

export default function PromoPage() {
  const [code, setCode] = useState("");
  const [estado, setEstado] = useState<"a-ver" | "ok" | "usado" | "invalido">("a-ver");
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    const c = getCode();
    setCode(c);
    if (!c) {
      setEstado("invalido");
      return;
    }
    fetch(`/api/promo-codes/check/${encodeURIComponent(c)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d?.valid) setEstado("invalido");
        else if (d.used) setEstado("usado");
        else setEstado("ok");
      })
      .catch(() => setEstado("ok"));
  }, []);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(code);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      /* alguns telemóveis não deixam copiar — o código está à vista */
    }
  }

  return (
    <div style={s.pagina}>
      <div style={s.cartao}>
        <div style={s.topo}>
          <div style={s.marca}>PetsLife</div>
          <div style={s.slogan}>contigo para a vida!</div>
        </div>

        {estado === "a-ver" && <p style={s.texto}>A verificar o código...</p>}

        {estado === "invalido" && (
          <>
            <h1 style={s.titulo}>Código não encontrado</h1>
            <p style={s.texto}>
              Este código não existe ou foi escrito de forma diferente. Peça um
              novo código a quem lhe enviou este link.
            </p>
            <a href={PLAY_STORE} style={s.botaoPrincipal}>
              Ver a PetsLife no Google Play
            </a>
          </>
        )}

        {estado === "usado" && (
          <>
            <h1 style={s.titulo}>Este código já foi usado</h1>
            <p style={s.texto}>
              Cada código só pode ser activado por uma pessoa. Se foi você que o
              activou, já tem acesso vitalício — basta entrar na app.
            </p>
            <a href={PLAY_STORE} style={s.botaoPrincipal}>
              Abrir a PetsLife
            </a>
          </>
        )}

        {estado === "ok" && (
          <>
            <div style={s.presente}>Presente para si</div>
            <h1 style={s.titulo}>Acesso vitalício à PetsLife</h1>
            <p style={s.texto}>
              Com este código tem a app completa <strong>para sempre</strong>,
              sem pagar nada, nunca.
            </p>

            <div style={s.caixaCodigo}>
              <div style={s.rotulo}>O SEU CÓDIGO</div>
              <div style={s.codigo}>{code}</div>
              <button onClick={copiar} style={s.botaoCopiar}>
                {copiado ? "Copiado!" : "Copiar código"}
              </button>
            </div>

            <a href={PLAY_STORE} style={s.botaoPrincipal}>
              1. Instalar a PetsLife
            </a>

            <div style={s.passos}>
              <div style={s.passo}>
                <span style={s.numero}>2</span>
                <span>Abra a app e crie a sua conta (email e password).</span>
              </div>
              <div style={s.passo}>
                <span style={s.numero}>3</span>
                <span>
                  Vá a <strong>Perfil</strong> &rarr;{" "}
                  <strong>Código Promocional</strong>, escreva o código e
                  confirme.
                </span>
              </div>
              <div style={s.passo}>
                <span style={s.numero}>4</span>
                <span>Pronto. Acesso completo, para sempre.</span>
              </div>
            </div>

            <p style={s.nota}>
              Guarde este link. O código só funciona uma vez, na primeira conta
              que o usar.
            </p>
          </>
        )}
      </div>

      <div style={s.rodape}>PetsLife &middot; Digital Global</div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  pagina: {
    minHeight: "100vh",
    background: "linear-gradient(160deg,#7C3AED 0%,#EC4899 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
    fontFamily:
      "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
  },
  cartao: {
    width: "100%",
    maxWidth: 420,
    background: "#fff",
    borderRadius: 24,
    padding: "28px 22px 32px",
    boxShadow: "0 18px 50px rgba(0,0,0,0.25)",
    textAlign: "center",
  },
  topo: { marginBottom: 18 },
  marca: { fontSize: 26, fontWeight: 800, color: "#7C3AED", letterSpacing: -0.5 },
  slogan: { fontSize: 13, color: "#9CA3AF", marginTop: 2 },
  presente: {
    display: "inline-block",
    background: "#FDF4FF",
    color: "#A21CAF",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
    padding: "6px 12px",
    borderRadius: 999,
    marginBottom: 10,
  },
  titulo: {
    fontSize: 25,
    fontWeight: 800,
    color: "#111827",
    margin: "0 0 10px",
    lineHeight: 1.2,
  },
  texto: { fontSize: 15, color: "#4B5563", lineHeight: 1.55, margin: "0 0 18px" },
  caixaCodigo: {
    background: "#F5F3FF",
    border: "2px dashed #C4B5FD",
    borderRadius: 16,
    padding: "16px 12px",
    marginBottom: 18,
  },
  rotulo: {
    fontSize: 11,
    fontWeight: 700,
    color: "#7C3AED",
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  codigo: {
    fontSize: 30,
    fontWeight: 800,
    color: "#111827",
    letterSpacing: 2,
    wordBreak: "break-all",
    marginBottom: 12,
  },
  botaoCopiar: {
    background: "#fff",
    border: "1px solid #C4B5FD",
    color: "#7C3AED",
    fontSize: 14,
    fontWeight: 700,
    padding: "9px 18px",
    borderRadius: 999,
    cursor: "pointer",
  },
  botaoPrincipal: {
    display: "block",
    background: "#7C3AED",
    color: "#fff",
    fontSize: 16,
    fontWeight: 700,
    textDecoration: "none",
    padding: "15px 18px",
    borderRadius: 14,
    marginBottom: 20,
  },
  passos: { textAlign: "left", display: "flex", flexDirection: "column", gap: 12 },
  passo: {
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
    fontSize: 14.5,
    color: "#374151",
    lineHeight: 1.5,
  },
  numero: {
    flexShrink: 0,
    width: 24,
    height: 24,
    borderRadius: 999,
    background: "#7C3AED",
    color: "#fff",
    fontSize: 13,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  nota: {
    fontSize: 12.5,
    color: "#9CA3AF",
    marginTop: 20,
    marginBottom: 0,
    lineHeight: 1.5,
  },
  rodape: { color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 18 },
};
