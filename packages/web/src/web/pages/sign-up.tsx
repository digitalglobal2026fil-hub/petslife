import { useState } from "react";
import { Link, useLocation } from "wouter";
import { authClient } from "../lib/auth";
import { PawPrint } from "lucide-react";

export default function SignUpPage() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name || !email || !password) { setError("Preencha todos os campos."); return; }
    if (password !== confirm) { setError("As passwords não coincidem."); return; }
    if (password.length < 8) { setError("A password deve ter pelo menos 8 caracteres."); return; }
    setLoading(true);
    try {
      const res = await authClient.signUp.email({ name, email, password });
      if (res.error) throw new Error(res.error.message ?? "Erro ao criar conta");
      setLocation("/");
    } catch (err: any) {
      setError(err.message ?? "Não foi possível criar a conta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center px-6 py-12">
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
          <p className="text-gray-500">Comece com 3 dias grátis. Sem cartão.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-[#F0E8E0] p-8">
          <h1 className="text-2xl font-extrabold text-[#1A1A2E] mb-2 text-center">Criar conta</h1>
          <p className="text-center text-sm text-gray-500 mb-6">3 dias de trial gratuito, sem cartão de crédito</p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5 text-sm text-red-600 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="O seu nome"
                className="w-full border border-[#F0E8E0] rounded-xl px-4 py-3 text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] transition"
              />
            </div>
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
                placeholder="Mínimo 8 caracteres"
                className="w-full border border-[#F0E8E0] rounded-xl px-4 py-3 text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">Confirmar Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repita a password"
                className="w-full border border-[#F0E8E0] rounded-xl px-4 py-3 text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF6B35] text-white font-bold py-3 rounded-xl hover:bg-[#e55a24] transition disabled:opacity-60 mt-2"
            >
              {loading ? "A criar conta..." : "Criar conta gratuita"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            Ao criar conta, aceita os nossos{" "}
            <a href="#" className="underline">Termos de Serviço</a> e{" "}
            <a href="#" className="underline">Política de Privacidade</a>.
          </p>

          <p className="text-center text-sm text-gray-500 mt-4">
            Já tem conta?{" "}
            <Link href="/sign-in">
              <a className="text-[#FF6B35] font-semibold hover:underline">Entrar</a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
