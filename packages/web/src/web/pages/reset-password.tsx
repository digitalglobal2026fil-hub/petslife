import { useState, useEffect } from "react";
import { Link } from "wouter";
import { authClient } from "../lib/auth";
import { PawPrint, CheckCircle2, Eye, EyeOff } from "lucide-react";

/**
 * Página onde a pessoa escolhe a password nova.
 *
 * O link do email traz o código na barra de endereço (?token=...). Sem esta
 * página, o email de recuperação chegava e o link não abria nada.
 */
export default function ResetPasswordPage() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [repetir, setRepetir] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [pronto, setPronto] = useState(false);
  const [verPassword, setVerPassword] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setToken(p.get("token"));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    if (!password || password.length < 8) {
      setErro("A password nova tem de ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== repetir) {
      setErro("As duas passwords não são iguais.");
      return;
    }
    if (!token) {
      setErro("Este link já não é válido. Peça a recuperação outra vez na app.");
      return;
    }
    setLoading(true);
    try {
      const res = await authClient.resetPassword({ newPassword: password, token });
      if ((res as any)?.error) throw new Error((res as any).error.message ?? "Erro");
      setPronto(true);
    } catch (err: any) {
      const m = String(err?.message ?? "");
      setErro(
        m.toLowerCase().includes("invalid") || m.toLowerCase().includes("expired")
          ? "Este link já expirou. Peça a recuperação outra vez na app."
          : "Não foi possível mudar a password. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <a className="inline-flex items-center gap-2 mb-4">
              <div className="bg-[#F5EDE4] rounded-2xl p-2">
                <PawPrint size={32} color="#8B5E3C" />
              </div>
              <span className="text-3xl font-extrabold text-[#FF6B35]">PetsLife</span>
            </a>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-[#F0E8E0] p-8">
          {pronto ? (
            <div className="text-center">
              <CheckCircle2 size={48} className="mx-auto mb-4 text-green-500" />
              <h1 className="text-2xl font-extrabold text-[#1A1A2E] mb-2">Password alterada</h1>
              <p className="text-gray-500 mb-6">
                Já pode entrar na app PetsLife com a password nova.
              </p>
              <a
                href="petslife://"
                className="inline-block w-full bg-[#FF6B35] text-white font-bold py-3 px-6 rounded-xl hover:bg-[#e55a24] transition"
              >
                Abrir a app PetsLife
              </a>
              <p className="text-gray-400 text-xs mt-4">
                Se o botão não abrir a app, feche esta página e abra a PetsLife
                normalmente no seu telemóvel.
              </p>
              <Link href="/sign-in">
                <a className="inline-block text-gray-400 text-xs mt-4 underline">
                  Prefiro entrar aqui no site
                </a>
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-extrabold text-[#1A1A2E] mb-2 text-center">Nova password</h1>
              <p className="text-gray-500 text-sm text-center mb-6">
                Escolha a password que vai passar a usar na app.
              </p>

              {erro && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5 text-sm text-red-600 text-center">
                  {erro}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">Password nova</label>
                  <div className="relative">
                    <input
                      type={verPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="pelo menos 8 caracteres"
                      className="w-full border border-[#F0E8E0] rounded-xl px-4 py-3 pr-12 text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] transition"
                    />
                    <button
                      type="button"
                      onClick={() => setVerPassword((v) => !v)}
                      aria-label={verPassword ? "Esconder password" : "Mostrar password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF6B35] p-1"
                    >
                      {verPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">Repita a password</label>
                  <div className="relative">
                    <input
                      type={verPassword ? "text" : "password"}
                      value={repetir}
                      onChange={(e) => setRepetir(e.target.value)}
                      placeholder="escreva outra vez"
                      className="w-full border border-[#F0E8E0] rounded-xl px-4 py-3 pr-12 text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] transition"
                    />
                    <button
                      type="button"
                      onClick={() => setVerPassword((v) => !v)}
                      aria-label={verPassword ? "Esconder password" : "Mostrar password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF6B35] p-1"
                    >
                      {verPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                {password.length > 0 && repetir.length > 0 && password !== repetir && (
                  <p className="text-xs text-red-500">As duas passwords ainda não são iguais.</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FF6B35] text-white font-bold py-3 rounded-xl hover:bg-[#e55a24] transition disabled:opacity-60 mt-2"
                >
                  {loading ? "A guardar..." : "Guardar password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
