import { useState } from "react";
import { Link, useLocation } from "wouter";
import { authClient } from "../lib/auth";
import { PawPrint } from "lucide-react";

export default function SignInPage() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) { setError("Preencha todos os campos."); return; }
    setLoading(true);
    try {
      const res = await authClient.signIn.email({ email, password });
      if (res.error) throw new Error(res.error.message ?? "Erro ao entrar");
      setLocation("/");
    } catch (err: any) {
      setError(err.message ?? "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <a className="inline-flex items-center gap-2 mb-4">
              <div className="bg-[#F5EDE4] rounded-2xl p-2">
                <PawPrint size={32} color="#8B5E3C" />
              </div>
              <span className="text-3xl font-extrabold text-[#FF6B35]">PetsLife</span>
            </a>
          </Link>
          <p className="text-gray-500">A vida do seu animal, organizada.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-[#F0E8E0] p-8">
          <h1 className="text-2xl font-extrabold text-[#1A1A2E] mb-6 text-center">Entrar na conta</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5 text-sm text-red-600 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="o.seu@email.com"
                className="w-full border border-[#F0E8E0] rounded-xl px-4 py-3 text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-[#F0E8E0] rounded-xl px-4 py-3 text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF6B35] text-white font-bold py-3 rounded-xl hover:bg-[#e55a24] transition disabled:opacity-60 mt-2"
            >
              {loading ? "A entrar..." : "Entrar"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Não tem conta?{" "}
            <Link href="/sign-up">
              <a className="text-[#FF6B35] font-semibold hover:underline">Registe-se</a>
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          A aplicação móvel PetsLife está disponível para iOS e Android.
        </p>
      </div>
    </div>
  );
}
