import { Link } from "wouter";
import { Heart, Shield, QrCode, Camera, MapPin, ShoppingBag, Users, Bell, Star, CheckCircle, ArrowRight, Stethoscope, Video, PawPrint } from "lucide-react";

const MONTHLY_LINK = "https://buy.stripe.com/cNi3cugz46Xs2pQ1Oo4sE02";
const ANNUAL_LINK = "https://buy.stripe.com/eVq4gyfv081w3tU9gQ4sE03";

const features = [
  { icon: Heart, title: "Perfil Completo do Animal", desc: "Foto, raça, peso, alergias, dieta e todos os dados do seu pet num só lugar.", color: "text-[#EF476F]", bg: "bg-red-50" },
  { icon: QrCode, title: "QR Code Anti-Perda", desc: "Cada animal tem um QR code único. Se se perder, quem o encontrar acede aos contactos.", color: "text-[#4ECDC4]", bg: "bg-teal-50" },
  { icon: Shield, title: "Boletim de Vacinas Digital", desc: "Guarda a caderneta, receitas e documentos. Sempre à mão, nunca mais perde nada.", color: "text-[#FF6B35]", bg: "bg-orange-50" },
  { icon: Bell, title: "Lembretes Inteligentes", desc: "Notificações para vacinas, consultas e desparasitações. Nunca mais se esqueça.", color: "text-[#FFE66D] drop-shadow", bg: "bg-yellow-50" },
  { icon: Camera, title: "Álbum de Memórias", desc: "Guarde os melhores momentos do seu animal. Fotos e vídeos organizados.", color: "text-purple-500", bg: "bg-purple-50" },
  { icon: Users, title: "Comunidade de Donos", desc: "Partilhe momentos, peça conselhos e conecte-se com outros amantes de animais.", color: "text-blue-500", bg: "bg-blue-50" },
  { icon: MapPin, title: "Vets e Lojas Próximas", desc: "Encontre veterinários de urgência, clínicas e lojas de animais perto de si.", color: "text-[#06D6A0]", bg: "bg-emerald-50" },
  { icon: ShoppingBag, title: "Marketplace", desc: "Compre e venda produtos para animais. Acessórios, ração, brinquedos e mais.", color: "text-[#FF6B35]", bg: "bg-orange-50" },
  { icon: Stethoscope, title: "Diário de Saúde", desc: "Registe sintomas, peso, comportamento e histórico médico completo.", color: "text-[#4ECDC4]", bg: "bg-teal-50" },
  { icon: Video, title: "Consulta Online", desc: "Videochamada com o seu veterinário directamente na app. Sem deslocações, sem espera.", color: "text-[#FF6B35]", bg: "bg-orange-50" },
];

const tips = [
  { category: "Saúde", title: "Como saber se o seu cão está saudável", excerpt: "Sinais vitais, comportamento e alimentação — o guia completo.", emoji: "🐕" },
  { category: "Nutrição", title: "Alimentos proibidos para gatos", excerpt: "O que nunca deve dar ao seu gato e porquê.", emoji: "🐱" },
  { category: "Comportamento", title: "Como treinar o seu animal em casa", excerpt: "Técnicas de reforço positivo que realmente funcionam.", emoji: "🐾" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FFF9F5]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#F0E8E0]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#F5EDE4] rounded-xl p-1.5">
              <PawPrint size={22} color="#8B5E3C" />
            </div>
            <span className="font-bold text-xl text-[#FF6B35]">PetsLife</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-[#FF6B35] transition-colors">Funcionalidades</a>
            <a href="#tips" className="hover:text-[#FF6B35] transition-colors">Dicas</a>
            <a href="#marketplace" className="hover:text-[#FF6B35] transition-colors">Marketplace</a>
            <a href="#pricing" className="hover:text-[#FF6B35] transition-colors">Preços</a>
          </div>
          <a href="#pricing" className="bg-[#FF6B35] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#e55a24] transition-colors">
            Experimente grátis
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-0 w-96 h-96 bg-[#FF6B35]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#4ECDC4]/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#FF6B35]/10 text-[#FF6B35] px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              <span>🎉</span> 3 dias grátis — sem cartão
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-[#1A1A2E] leading-tight mb-6">
              A vida do seu animal,<br />
              <span className="text-[#FF6B35]">organizada.</span>
            </h1>
            <p className="text-xl text-gray-500 mb-8 max-w-xl leading-relaxed">
              Vacinas, saúde, memórias, comunidade e muito mais. Tudo o que precisa para cuidar do seu pet num só lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#pricing" className="inline-flex items-center justify-center gap-2 bg-[#FF6B35] text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-[#e55a24] transition-all shadow-lg shadow-[#FF6B35]/30">
                Experimente a app grátis 3 dias <ArrowRight size={20} />
              </a>
              <a href="#features" className="inline-flex items-center justify-center gap-2 border-2 border-[#F0E8E0] text-[#1A1A2E] px-8 py-4 rounded-2xl text-lg font-semibold hover:border-[#FF6B35] transition-colors">
                Ver funcionalidades
              </a>
            </div>
            <div className="flex items-center gap-6 mt-10">
              <div className="flex -space-x-2">
                {["🐕","🐱","🐰","🦜"].map((e, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-white border-2 border-[#FF6B35] flex items-center justify-center text-lg">{e}</div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} className="fill-[#FFE66D] text-[#FFE66D]" />)}
                </div>
                <p className="text-sm text-gray-500">+2.000 animais felizes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-[#1A1A2E] mb-4">Tudo o que o seu pet precisa</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Uma app completa para donos que querem o melhor para os seus animais.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-3xl p-6 border border-[#F0E8E0] hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className={`w-12 h-12 ${f.bg} rounded-2xl flex items-center justify-center mb-4`}>
                  <f.icon size={24} className={f.color} />
                </div>
                <h3 className="font-bold text-lg text-[#1A1A2E] mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips / Blog */}
      <section id="tips" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-extrabold text-[#1A1A2E] mb-2">Dicas para o seu pet</h2>
              <p className="text-gray-500">Conteúdo criado por veterinários e especialistas.</p>
            </div>
            <a href="#tips" className="hidden md:flex items-center gap-2 text-[#FF6B35] font-semibold hover:underline">
              Ver todos <ArrowRight size={16} />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tips.map((t) => (
              <div key={t.title} className="bg-[#FFF9F5] rounded-3xl p-6 border border-[#F0E8E0] hover:shadow-md transition-all cursor-pointer">
                <div className="text-4xl mb-4">{t.emoji}</div>
                <span className="text-xs font-bold text-[#FF6B35] uppercase tracking-wider">{t.category}</span>
                <h3 className="font-bold text-lg text-[#1A1A2E] mt-2 mb-2">{t.title}</h3>
                <p className="text-gray-500 text-sm">{t.excerpt}</p>
                <div className="flex items-center gap-1 mt-4 text-[#FF6B35] text-sm font-semibold">
                  Ler mais <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace preview */}
      <section id="marketplace" className="py-20 px-6 bg-gradient-to-br from-[#FF6B35]/5 to-[#4ECDC4]/5">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-4xl">🛍️</span>
          <h2 className="text-4xl font-extrabold text-[#1A1A2E] mt-4 mb-4">Marketplace para animais</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto mb-10">Compre e venda produtos para o seu animal. Ração, acessórios, brinquedos e serviços — tudo numa comunidade de confiança.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {["🦴 Alimentação", "🎾 Brinquedos", "🏠 Acessórios", "✂️ Serviços"].map((cat) => (
              <div key={cat} className="bg-white rounded-2xl p-4 border border-[#F0E8E0] font-semibold text-[#1A1A2E] text-sm hover:border-[#FF6B35] transition-colors cursor-pointer">
                {cat}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-[#1A1A2E] mb-4">Simples e transparente</h2>
          <p className="text-gray-500 text-lg mb-2">Ambos os planos incluem tudo. A diferença é só o preço.</p>
          <p className="text-[#FF6B35] font-semibold mb-12">🎉 3 dias grátis em qualquer plano — sem cartão</p>

          {/* Features list (shared) */}
          <div className="bg-[#FFF9F5] rounded-3xl p-6 border border-[#F0E8E0] mb-10 text-left max-w-xl mx-auto">
            <p className="font-bold text-[#1A1A2E] mb-4 text-center">O que está incluído nos dois planos:</p>
            <ul className="space-y-3">
              {[
                "Animais ilimitados",
                "QR Code anti-perda",
                "Boletim de vacinas digital",
                "Álbum de memórias ilimitado",
                "Diário de saúde completo",
                "Consulta online por videochamada",
                "Comunidade de donos",
                "Marketplace",
                "Suporte prioritário",
              ].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-[#06D6A0] flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly */}
            <div className="bg-[#FFF9F5] rounded-3xl p-8 border-2 border-[#F0E8E0]">
              <h3 className="font-bold text-xl mb-1 text-[#1A1A2E]">Mensal</h3>
              <div className="flex items-end gap-1 my-4">
                <span className="text-5xl font-extrabold text-[#1A1A2E]">€3.99</span>
                <span className="text-gray-400 mb-1">/mês</span>
              </div>
              <p className="text-gray-400 text-sm mb-8">Flexibilidade total. Cancele quando quiser.</p>
              <a href={MONTHLY_LINK} target="_blank" rel="noopener noreferrer"
                className="block w-full bg-[#FF6B35] text-white py-3 rounded-2xl font-bold text-center hover:bg-[#e55a24] transition-colors">
                Experimente grátis 3 dias
              </a>
            </div>
            {/* Annual */}
            <div className="bg-gradient-to-br from-[#FF6B35] to-[#e55a24] rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-[#FFE66D] text-[#1A1A2E] text-xs font-bold px-3 py-1 rounded-full">POUPA 58%</div>
              <h3 className="font-bold text-xl mb-1">Anual</h3>
              <div className="flex items-end gap-1 my-4">
                <span className="text-5xl font-extrabold">€19.99</span>
                <span className="text-white/70 mb-1">/ano</span>
              </div>
              <p className="text-white/80 text-sm mb-8">Equivale a €1.67/mês — o melhor negócio.</p>
              <a href={ANNUAL_LINK} target="_blank" rel="noopener noreferrer"
                className="block w-full bg-white text-[#FF6B35] py-3 rounded-2xl font-bold text-center hover:bg-white/90 transition-colors">
                Experimente grátis 3 dias
              </a>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-6">Cancele quando quiser. Sem compromisso.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A2E] text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-[#F5EDE4] rounded-xl p-1.5">
                <PawPrint size={20} color="#8B5E3C" />
              </div>
              <span className="font-bold text-xl text-[#FF6B35]">PetsLife</span>
            </div>
            <p className="text-gray-400 text-sm">© 2025 PetsLife. Feito com ❤️ para todos os animais.</p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos</a>
              <a href="#" className="hover:text-white transition-colors">Contacto</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
