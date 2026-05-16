import { Link } from "wouter";
import { PawPrint } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FFF9F5]">
      {/* Navbar */}
      <nav className="bg-white border-b border-[#F0E8E0] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <Link href="/">
            <a className="flex items-center gap-2">
              <div className="bg-[#F5EDE4] rounded-xl p-1.5">
                <PawPrint size={20} color="#8B5E3C" />
              </div>
              <span className="font-bold text-xl text-[#FF6B35]">PetsLife</span>
            </a>
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-extrabold text-[#1A1A2E] mb-2">Política de Privacidade</h1>
        <p className="text-gray-500 text-sm mb-10">Última atualização: 15 de maio de 2025</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-3">1. Quem somos</h2>
            <p>
              A <strong>PetsLife</strong> é uma aplicação móvel e plataforma web destinada à gestão da saúde e bem-estar de animais de estimação. O responsável pelo tratamento dos dados é o operador da plataforma PetsLife.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-3">2. Dados que recolhemos</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Dados de conta:</strong> nome, endereço de e-mail e palavra-passe (encriptada).</li>
              <li><strong>Dados do animal:</strong> nome, espécie, raça, data de nascimento, peso, foto e informações de saúde introduzidas pelo utilizador (vacinas, consultas, diário de saúde, documentos).</li>
              <li><strong>Ficheiros e imagens:</strong> fotografias e documentos carregados pelo utilizador (armazenados de forma segura na cloud).</li>
              <li><strong>Dados de pagamento:</strong> os pagamentos são processados pela Stripe. A PetsLife não armazena dados de cartão de crédito.</li>
              <li><strong>Dados de utilização:</strong> informações técnicas como endereço IP, tipo de dispositivo e registos de acesso, para fins de segurança e melhoria do serviço.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-3">3. Como utilizamos os dados</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fornecer e melhorar os serviços da PetsLife.</li>
              <li>Enviar lembretes de vacinas, consultas e outros eventos de saúde do animal.</li>
              <li>Processar pagamentos e gerir subscrições.</li>
              <li>Garantir a segurança da conta e prevenir fraudes.</li>
              <li>Cumprir obrigações legais.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-3">4. Partilha de dados</h2>
            <p>
              Não vendemos nem partilhamos os seus dados pessoais com terceiros para fins comerciais. Partilhamos dados apenas com:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Stripe</strong> — processamento de pagamentos.</li>
              <li><strong>Fornecedores de cloud</strong> — armazenamento seguro de ficheiros.</li>
              <li><strong>Autoridades competentes</strong> — quando exigido por lei.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-3">5. Retenção de dados</h2>
            <p>
              Os seus dados são conservados enquanto a sua conta estiver ativa. Pode solicitar a eliminação da sua conta e todos os dados associados a qualquer momento através do e-mail de contacto.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-3">6. Os seus direitos (RGPD)</h2>
            <p>Se se encontra na União Europeia, tem os seguintes direitos:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Acesso aos seus dados pessoais.</li>
              <li>Retificação de dados incorretos.</li>
              <li>Eliminação dos seus dados ("direito ao esquecimento").</li>
              <li>Portabilidade dos dados.</li>
              <li>Oposição ao tratamento dos dados.</li>
            </ul>
            <p className="mt-3">Para exercer qualquer um destes direitos, contacte-nos pelo e-mail indicado abaixo.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-3">7. Segurança</h2>
            <p>
              Utilizamos encriptação HTTPS, tokens de autenticação seguros e armazenamento encriptado para proteger os seus dados. As palavras-passe são armazenadas com hash e nunca em texto simples.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-3">8. Crianças</h2>
            <p>
              A PetsLife não é dirigida a menores de 13 anos. Não recolhemos intencionalmente dados de crianças. Se tomar conhecimento de que uma criança nos forneceu dados, contacte-nos para os eliminar.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-3">9. Alterações a esta política</h2>
            <p>
              Podemos atualizar esta política periodicamente. Notificaremos os utilizadores sobre alterações significativas por e-mail ou através da aplicação.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-3">10. Contacto</h2>
            <p>
              Para questões relacionadas com privacidade, contacte-nos através da aplicação ou pelo e-mail disponível na página da app na Google Play Store.
            </p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-[#F0E8E0] text-center">
          <Link href="/">
            <a className="text-[#FF6B35] font-semibold hover:underline">← Voltar ao início</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
