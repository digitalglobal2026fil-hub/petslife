import { PawPrint } from "lucide-react";

export default function DeleteAccountPage() {
  return (
    <div className="min-h-screen bg-[#FFF8F0] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <PawPrint className="text-[#8B5E3C]" size={28} />
          <span className="text-2xl font-bold text-[#8B5E3C]">PetsLife</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Eliminar Conta
        </h1>

        <p className="text-gray-600 mb-6">
          Para solicitar a eliminação da tua conta e de todos os dados
          associados, envia um email para o nosso suporte com o assunto
          "Eliminar Conta".
        </p>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f0e0cc] mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Como eliminar a tua conta:
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Envia um email para <strong>support@petslife.app</strong></li>
            <li>Usa o assunto: <strong>Eliminar Conta</strong></li>
            <li>Inclui o email associado à tua conta</li>
            <li>Processamos o pedido em até 7 dias úteis</li>
          </ol>
        </div>

        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 mb-6">
          <h2 className="text-lg font-semibold text-amber-800 mb-2">
            O que é eliminado:
          </h2>
          <ul className="list-disc list-inside space-y-1 text-amber-700 text-sm">
            <li>Dados da tua conta (nome, email)</li>
            <li>Perfis e dados dos teus animais de estimação</li>
            <li>Histórico de registos e vacinações</li>
            <li>Fotografias e ficheiros enviados</li>
          </ul>
        </div>

        <a
          href="mailto:support@petslife.app?subject=Eliminar%20Conta"
          className="inline-block bg-[#8B5E3C] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#7a5235] transition-colors"
        >
          Enviar Email de Eliminação
        </a>

        <p className="text-gray-400 text-sm mt-6">
          PetsLife · support@petslife.app
        </p>
      </div>
    </div>
  );
}
