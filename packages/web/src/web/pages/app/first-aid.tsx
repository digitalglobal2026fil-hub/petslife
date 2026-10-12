import { useState } from "react";
import { ChevronLeft, ChevronRight, AlertTriangle, Phone } from "lucide-react";
import { RequireAuth, AppShell } from "../../components/AppShell";

const DARK = "#1A1A2E";
const RED = "#EF4444";

const EMERGENCIES = [
  {
    title: "Dificuldade a respirar", emoji: "😮‍💨", severity: "urgente", color: "#EF4444", bg: "#FEF2F2",
    steps: [
      "Mantenha o animal calmo e imóvel",
      "Verifique se há obstrução na boca — remova com cuidado",
      "Não tape o focinho ou nariz",
      "Coloque o animal em posição lateral se estiver inconsciente",
      "Vá ao veterinário de EMERGÊNCIA IMEDIATAMENTE",
    ],
    doNot: ["Não force a boca se o animal resistir", "Não dê água nem comida", "Não tape as narinas"],
  },
  {
    title: "Intoxicação ou Envenenamento", emoji: "☠️", severity: "urgente", color: "#EF4444", bg: "#FEF2F2",
    steps: [
      "Nunca provoque o vómito nem dê qualquer medicamento ou remédio caseiro sem falar primeiro com um veterinário",
      "Fale com um veterinário de imediato e siga as indicações que lhe der",
      "Se souber o que o animal ingeriu, guarde a embalagem e leve-a consigo",
    ],
    doNot: ["Não provoque o vómito", "Não dê medicamentos por sua iniciativa", "Não dê remédios caseiros"],
  },
  {
    title: "Convulsões", emoji: "⚡", severity: "urgente", color: "#EF4444", bg: "#FEF2F2",
    steps: [
      "Mantenha a calma — NÃO coloque a mão na boca do animal",
      "Afaste objectos perigosos em redor",
      "Proteja a cabeça com uma toalha macia",
      "Marque a hora de início da convulsão",
      "Leve o animal ao veterinário de imediato — não espere que a convulsão passe",
    ],
    doNot: ["Não tente segurar o animal", "Não coloque nada na boca", "Não grite — mantenha silêncio e luz baixa"],
  },
  {
    title: "Hemorragias", emoji: "🩸", severity: "grave", color: "#F97316", bg: "#FFF7ED",
    steps: [
      "Pressione a ferida com uma gaze esterilizada ou um pano limpo",
      "Mantenha a pressão até o sangue parar ou até chegar à clínica",
      "Use luvas se tiver à mão",
    ],
    doNot: ["Não levante a gaze para ir vendo — se ensopar, ponha outra por cima", "Não use água oxigenada", "Não limpe a ferida em excesso"],
  },
  {
    title: "Picada de insecto / Alergia", emoji: "🐝", severity: "grave", color: "#F97316", bg: "#FFF7ED",
    steps: [
      "Remova o ferrão com cartão (não com pinça)",
      "Aplique compressas frias na zona",
      "Observe: inchaço do focinho/cara é emergência!",
      "Sinais graves: dificuldade a respirar, colapso — URGÊNCIA",
      "Contacte o veterinário para antihistamínico adequado",
    ],
    doNot: ["Não esprema o ferrão", "Não aplique calor", "Não dê medicação humana sem orientação"],
  },
  {
    title: "Golpe de calor", emoji: "🌡️", severity: "grave", color: "#F97316", bg: "#FFF7ED",
    steps: [
      "Mova para local fresco e com sombra imediatamente",
      "Molhe o animal com água FRIA (não gelada) — focinho, axilas, pescoço",
      "Ofereça água fresca em pequenas quantidades",
      "Use ventoinha se disponível",
      "Vá ao veterinário — o golpe de calor pode ser fatal",
    ],
    doNot: ["Não use água muito gelada ou gelo", "Não cubra com toalha molhada (retém calor)", "Não force a beber"],
  },
  {
    title: "Engasgos", emoji: "🤢", severity: "grave", color: "#F97316", bg: "#FFF7ED",
    steps: [
      "Abra a boca do animal com cuidado para ver se existe algum objecto visível",
      "Tente retirá-lo com os dedos ou com uma pinça",
      "Se não conseguir alcançar, ou se o animal continuar aflito, não force e procure ajuda de imediato",
    ],
    doNot: ["Não insista se não estiver a conseguir — vá ao veterinário", "Não dê água nem comida"],
  },
  {
    title: "Queimaduras", emoji: "🔥", severity: "grave", color: "#F97316", bg: "#FFF7ED",
    steps: [
      "Lave a zona afectada com água fria corrente durante pelo menos 10 minutos para aliviar a dor",
      "Cubra com um pano limpo e húmido",
      "Leve o animal ao veterinário",
    ],
    doNot: ["Não aplique cremes", "Não aplique pasta de dentes", "Não use receitas caseiras"],
  },
  {
    title: "Fractura / Osso partido", emoji: "🦴", severity: "moderado", color: "#8B5CF6", bg: "#F3EEFF",
    steps: [
      "Não tente endireitar o osso",
      "Imobilize a zona com improviso (cartão, rolo de jornal, ataduras)",
      "Use uma superfície rígida como maca improvisada",
      "Cubra o animal para evitar choque",
      "Transporte com cuidado ao veterinário",
    ],
    doNot: ["Não massaje a zona", "Não aplique pressão", "Não tente andar com o animal se tiver fractura na pata"],
  },
  {
    title: "Olho vermelho / Ferido", emoji: "👁️", severity: "moderado", color: "#8B5CF6", bg: "#F3EEFF",
    steps: [
      "Não esfregue o olho do animal",
      "Lave com soro fisiológico abundante",
      "Se houver corpo estranho visível e solto, tente remover com gaze húmida",
      "Impeça o animal de coçar o olho",
      "Consulte veterinário para prescrição adequada",
    ],
    doNot: ["Não use colírios humanos sem receita", "Não force abertura do olho", "Não ignore — pode perder visão"],
  },
  {
    title: "Vómitos repetidos", emoji: "🤮", severity: "moderado", color: "#8B5CF6", bg: "#F3EEFF",
    steps: [
      "Retire comida por 12h (para adultos saudáveis)",
      "Ofereça pequenas quantidades de água",
      "Se houver sangue, letargia ou dor abdominal: veterinário urgente",
      "Registe frequência e aspecto do vómito",
      "Mais de 3 vómitos em poucas horas = consulta veterinária",
    ],
    doNot: ["Não dê medicação humana", "Não force comida", "Não ignore vómito com sangue ou bile escura"],
  },
];

const severityLabel: Record<string, { label: string; color: string }> = {
  urgente: { label: "🚨 URGENTE", color: "#EF4444" },
  grave: { label: "⚠️ GRAVE", color: "#F97316" },
  moderado: { label: "⚕️ MODERADO", color: "#8B5CF6" },
};

function FirstAidContent() {
  const [selected, setSelected] = useState<(typeof EMERGENCIES)[0] | null>(null);

  if (selected) {
    const sv = severityLabel[selected.severity];
    return (
      <div className="max-w-2xl mx-auto">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#1A1A2E] mb-4">
          <ChevronLeft size={18} /> Voltar
        </button>
        <div className="rounded-3xl p-8 text-center mb-6" style={{ backgroundColor: selected.color }}>
          <div className="text-5xl mb-2">{selected.emoji}</div>
          <h1 className="text-2xl font-extrabold text-white">{selected.title}</h1>
          <span className="inline-block mt-3 bg-white/25 text-white font-bold text-xs px-3 py-1.5 rounded-full">{sv.label}</span>
        </div>
        <div className="bg-white rounded-2xl border border-[#F0E8E0] p-6 mb-4">
          <h2 className="font-bold text-[#1A1A2E] mb-4">✅ O que fazer</h2>
          <ol className="space-y-3">
            {selected.steps.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-600 leading-relaxed">
                <span className="w-6 h-6 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0" style={{ backgroundColor: selected.color }}>{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-4">
          <h2 className="font-bold text-red-600 mb-3">❌ Não fazer</h2>
          <ul className="space-y-2">
            {selected.doNot.map((d, i) => (
              <li key={i} className="flex gap-2 text-sm text-red-800">🚫 {d}</li>
            ))}
          </ul>
        </div>
        <a href="tel:213420000" className="flex items-center justify-center gap-2 bg-red-500 text-white font-bold rounded-2xl py-4 hover:bg-red-600 transition-colors">
          <Phone size={18} /> Ligar ao Veterinário — 213 420 000
        </a>
      </div>
    );
  }

  const groups = [
    { label: "🚨 Emergências Urgentes", items: EMERGENCIES.filter(e => e.severity === "urgente"), color: "#EF4444" },
    { label: "⚠️ Situações Graves", items: EMERGENCIES.filter(e => e.severity === "grave"), color: "#F97316" },
    { label: "⚕️ Situações Moderadas", items: EMERGENCIES.filter(e => e.severity === "moderado"), color: "#8B5CF6" },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-extrabold text-[#1A1A2E] mb-2">Primeiros Socorros 🩺</h1>
      <p className="text-gray-500 text-sm mb-4">Guia de emergência para animais.</p>
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3 items-start mb-6">
        <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
        <p className="text-xs text-red-700 leading-relaxed">Em caso de emergência grave, contacte sempre um veterinário. Este guia é de apoio, baseado em fontes veterinárias reconhecidas — não substitui cuidados médicos.</p>
      </div>
      <a href="tel:213420000" className="flex items-center justify-center gap-2 bg-red-500 text-white font-bold rounded-2xl py-3.5 mb-6 hover:bg-red-600 transition-colors">
        <Phone size={18} /> 🚨 Ligar Linha Veterinária de Urgência
      </a>
      {groups.map(g => (
        <div key={g.label} className="mb-6">
          <h2 className="font-extrabold text-sm mb-3" style={{ color: g.color }}>{g.label}</h2>
          <div className="space-y-2">
            {g.items.map(e => (
              <button key={e.title} onClick={() => setSelected(e)} className="w-full flex items-center gap-3 bg-white rounded-2xl p-4 border hover:shadow-md transition-all text-left" style={{ borderColor: e.color + "30" }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: e.bg }}>{e.emoji}</div>
                <div className="flex-1">
                  <p className="font-bold text-[#1A1A2E] text-sm">{e.title}</p>
                  <span className="inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-lg" style={{ backgroundColor: e.bg, color: e.color }}>{severityLabel[e.severity].label}</span>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FirstAid() {
  return (
    <RequireAuth>
      <AppShell>
        <FirstAidContent />
      </AppShell>
    </RequireAuth>
  );
}
