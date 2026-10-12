import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, ExternalLink, AlertTriangle, Search } from "lucide-react";
import { RequireAuth, AppShell } from "../../components/AppShell";

const PRODUCTS = [
  {
    id: "1", category: "Antiparasitários", emoji: "🪲",
    name: "Bravecto Spot-On Cão", brand: "MSD Animal Health",
    description: "Proteção de 3 meses contra pulgas e carraças. Aplicação na pele.",
    price: "28,50€", rating: 4.8, reviews: 342,
    tags: ["Pulgas", "Carraças", "3 meses"],
    color: "#F97316", bg: "#FFF7ED",
    where: [
      { name: "Farmácia Vet Online", url: "https://www.zooplus.pt" },
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "2", category: "Antiparasitários", emoji: "🪲",
    name: "Frontline Combo Gato", brand: "Boehringer",
    description: "Pipeta antiparasitária para gatos. Pulgas, carraças e piolhos.",
    price: "9,90€", rating: 4.5, reviews: 215,
    tags: ["Gatos", "Pulgas", "Mensal"],
    color: "#F97316", bg: "#FFF7ED",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "3", category: "Suplementos", emoji: "💊",
    name: "Nutrolin B Skin & Coat", brand: "Nutrolin",
    description: "Ácidos gordos ómega-3 e ómega-6 para pele e pelagem radiante.",
    price: "22,00€", rating: 4.9, reviews: 128,
    tags: ["Pele", "Pelagem", "Ómega-3"],
    color: "#8B5CF6", bg: "#F3EEFF",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "4", category: "Suplementos", emoji: "💊",
    name: "Vetri-Science Glyco-Flex III", brand: "Vetri-Science",
    description: "Suporte articular avançado para cães com displasia ou artrite.",
    price: "35,00€", rating: 4.7, reviews: 87,
    tags: ["Articulações", "Cão", "Idosos"],
    color: "#8B5CF6", bg: "#F3EEFF",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "5", category: "Higiene", emoji: "🛁",
    name: "Virbac SEBOCALM Champô", brand: "Virbac",
    description: "Champô dermatológico para pele sensível e seca. Sem parabenos.",
    price: "14,90€", rating: 4.6, reviews: 203,
    tags: ["Pele Sensível", "Cão", "Gato"],
    color: "#06D6A0", bg: "#E6FAF5",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "6", category: "Higiene", emoji: "🛁",
    name: "Limpador de Ouvidos Otodine", brand: "ICF",
    description: "Solução de limpeza auricular. Previne infecções e acumulação de cera.",
    price: "8,50€", rating: 4.4, reviews: 156,
    tags: ["Ouvidos", "Prevenção", "Cão/Gato"],
    color: "#06D6A0", bg: "#E6FAF5",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "7", category: "Alimentação Especial", emoji: "🍽️",
    name: "Royal Canin Urinary S/O", brand: "Royal Canin",
    description: "Ração veterinária para gatos com problemas urinários. Dissolve cristais.",
    price: "42,00€", rating: 4.7, reviews: 445,
    tags: ["Urinário", "Veterinário", "Gato"],
    color: "#FF6B35", bg: "#FFF0EB",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "8", category: "Alimentação Especial", emoji: "🍽️",
    name: "Hill's Prescription Diet z/d", brand: "Hill's",
    description: "Dieta hipoalergénica para cães com alergias alimentares diagnosticadas.",
    price: "55,00€", rating: 4.5, reviews: 89,
    tags: ["Alergias", "Veterinário", "Cão"],
    color: "#FF6B35", bg: "#FFF0EB",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "9", category: "Cuidados Dentários", emoji: "🦷",
    name: "Virbac C.E.T. Pasta Dentária", brand: "Virbac",
    description: "Pasta dentária enzimática com sabor a frango. Previne tártaro.",
    price: "11,00€", rating: 4.3, reviews: 312,
    tags: ["Dentes", "Tártaro", "Cão/Gato"],
    color: "#4ECDC4", bg: "#E8FAF9",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "10", category: "Cuidados Dentários", emoji: "🦷",
    name: "Tropiclean Water Additive", brand: "Tropiclean",
    description: "Adicione 1 capaz à água. Sem escovar — combate placa bacteriana.",
    price: "16,00€", rating: 4.2, reviews: 178,
    tags: ["Dentes", "Fácil", "Sem escova"],
    color: "#4ECDC4", bg: "#E8FAF9",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "11", category: "Antiparasitários", emoji: "🪲",
    name: "Frontline Combo Cão", brand: "Boehringer",
    description: "Pipeta mensal para cães. Mata pulgas, carraças e piolhos e impede que os ovos se desenvolvam dentro de casa.",
    price: "10,90€", rating: 4.6, reviews: 511,
    tags: ["Cães", "Pulgas", "Carraças", "Mensal"],
    color: "#F97316", bg: "#FFF7ED",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "12", category: "Antiparasitários", emoji: "🦟",
    name: "Advantix Spot-On Cão", brand: "Elanco",
    description: "Pipeta mensal que também repele mosquitos e flebótomos, os que transmitem a leishmaniose. Nunca usar em gatos.",
    price: "14,50€", rating: 4.7, reviews: 398,
    tags: ["Cães", "Leishmaniose", "Mosquitos", "Mensal"],
    color: "#F97316", bg: "#FFF7ED",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "13", category: "Antiparasitários", emoji: "⭕",
    name: "Coleira Seresto", brand: "Elanco",
    description: "Coleira que protege até 8 meses contra pulgas e carraças. Há versão para cão e versão para gato.",
    price: "39,90€", rating: 4.6, reviews: 447,
    tags: ["8 meses", "Cães", "Gatos", "Coleira"],
    color: "#F97316", bg: "#FFF7ED",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "14", category: "Antiparasitários", emoji: "💊",
    name: "NexGard Comprimido", brand: "Boehringer",
    description: "Comprimido mastigável mensal contra pulgas e carraças. Boa opção para cães que tomam banho com frequência ou nadam.",
    price: "13,90€", rating: 4.7, reviews: 362,
    tags: ["Cães", "Comprimido", "Mensal"],
    color: "#F97316", bg: "#FFF7ED",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "15", category: "Antiparasitários", emoji: "💊",
    name: "Simparica Trio", brand: "Zoetis",
    description: "Comprimido mensal que cobre pulgas, carraças, vermes intestinais e dirofilariose num só produto.",
    price: "19,90€", rating: 4.8, reviews: 254,
    tags: ["Cães", "Interno e externo", "Mensal"],
    color: "#F97316", bg: "#FFF7ED",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "16", category: "Antiparasitários", emoji: "🐛",
    name: "Drontal Plus", brand: "Elanco",
    description: "Desparasitante interno em comprimido. Trata lombrigas, ténias e outros vermes. Repetir conforme o veterinário indicar.",
    price: "7,50€", rating: 4.7, reviews: 620,
    tags: ["Vermes", "Interno", "Cães"],
    color: "#F97316", bg: "#FFF7ED",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "17", category: "Antiparasitários", emoji: "🐛",
    name: "Milbemax Gato", brand: "Elanco",
    description: "Desparasitante interno para gatos, em comprimido pequeno e fácil de dar. Vermes redondos e ténias.",
    price: "8,90€", rating: 4.5, reviews: 289,
    tags: ["Gatos", "Vermes", "Interno"],
    color: "#F97316", bg: "#FFF7ED",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "18", category: "Higiene", emoji: "🛁",
    name: "Champô Antiparasitário Beaphar", brand: "Beaphar",
    description: "Champô que ajuda a eliminar pulgas durante o banho. É um apoio: não substitui a pipeta nem o comprimido.",
    price: "8,50€", rating: 4.1, reviews: 143,
    tags: ["Banho", "Pulgas", "Cães e gatos"],
    color: "#4ECDC4", bg: "#E8FAF9",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "19", category: "Higiene", emoji: "🧴",
    name: "Soro Fisiológico Estéril", brand: "Genérico",
    description: "Para limpar olhos, narinas e feridas superficiais. Deve haver sempre um frasco na caixa de primeiros socorros.",
    price: "3,50€", rating: 4.9, reviews: 731,
    tags: ["Feridas", "Olhos", "Essencial"],
    color: "#4ECDC4", bg: "#E8FAF9",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "20", category: "Higiene", emoji: "🩹",
    name: "Spray Cicatrizante com Clorexidina", brand: "Virbac",
    description: "Desinfeta e ajuda a cicatrizar pequenas feridas e arranhões. Se a ferida for funda ou infetar, ir ao veterinário.",
    price: "12,90€", rating: 4.6, reviews: 208,
    tags: ["Feridas", "Desinfetante", "Pele"],
    color: "#4ECDC4", bg: "#E8FAF9",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "21", category: "Higiene", emoji: "👁️",
    name: "Solução de Limpeza Ocular", brand: "Beaphar",
    description: "Limpa o canto dos olhos e as manchas de lágrima. Muito útil no maltês, no shih tzu e noutras raças de olhos lacrimejantes.",
    price: "7,90€", rating: 4.4, reviews: 176,
    tags: ["Olhos", "Lágrimas", "Raças pequenas"],
    color: "#4ECDC4", bg: "#E8FAF9",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "22", category: "Higiene", emoji: "👂",
    name: "Limpador Auricular Epi-Otic", brand: "Virbac",
    description: "Limpa e seca o canal do ouvido. Importante nos cães de orelhas caídas, como o basset hound e o cocker.",
    price: "11,50€", rating: 4.7, reviews: 344,
    tags: ["Ouvidos", "Otites", "Orelhas caídas"],
    color: "#4ECDC4", bg: "#E8FAF9",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "23", category: "Suplementos", emoji: "🦴",
    name: "Cosequin Condroprotetor", brand: "Nutramax",
    description: "Glucosamina e condroitina para as articulações. Indicado em cães grandes, idosos ou com displasia da anca.",
    price: "26,90€", rating: 4.7, reviews: 312,
    tags: ["Articulações", "Idosos", "Cães grandes"],
    color: "#8B5CF6", bg: "#F3EEFF",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "24", category: "Suplementos", emoji: "🦠",
    name: "Fortiflora Probiótico", brand: "Purina",
    description: "Pó probiótico para juntar à comida. Ajuda a repor a flora intestinal em diarreias e depois de antibióticos.",
    price: "21,50€", rating: 4.8, reviews: 465,
    tags: ["Diarreia", "Intestino", "Cães e gatos"],
    color: "#8B5CF6", bg: "#F3EEFF",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "25", category: "Suplementos", emoji: "🧪",
    name: "Multivitamínico Beaphar", brand: "Beaphar",
    description: "Vitaminas em pasta ou comprimido para animais em recuperação, gestantes ou com pouco apetite.",
    price: "9,90€", rating: 4.3, reviews: 187,
    tags: ["Vitaminas", "Recuperação", "Apetite"],
    color: "#8B5CF6", bg: "#F3EEFF",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "26", category: "Cuidados Dentários", emoji: "🦷",
    name: "Escova de Dedo com Pasta", brand: "Beaphar",
    description: "Escova que se põe no dedo, mais fácil de usar em animais pequenos. A pasta é para engolir: nunca usar pasta de dentes de humanos.",
    price: "6,90€", rating: 4.4, reviews: 231,
    tags: ["Dentes", "Fácil", "Cães e gatos"],
    color: "#4ECDC4", bg: "#E8FAF9",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
];

const CATEGORIES = ["Todos", "Antiparasitários", "Suplementos", "Higiene", "Alimentação Especial", "Cuidados Dentários"];
const CAT_EMOJI: Record<string, string> = {
  Todos: "🛒", "Antiparasitários": "🪲", "Suplementos": "💊", "Higiene": "🛁",
  "Alimentação Especial": "🍽️", "Cuidados Dentários": "🦷",
};

function PharmacyContent() {
  const [cat, setCat] = useState("Todos");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<(typeof PRODUCTS)[0] | null>(null);

  const filtered = PRODUCTS.filter((p) => {
    const matchesCat = cat === "Todos" || p.category === cat;
    const matchesQuery = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase()) || p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  if (selected) {
    return (
      <div className="max-w-2xl mx-auto">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#1A1A2E] mb-4">
          <ChevronLeft size={18} /> Voltar
        </button>
        <div className="rounded-3xl p-8 text-center mb-6" style={{ backgroundColor: selected.bg }}>
          <div className="text-5xl mb-2">{selected.emoji}</div>
          <h1 className="text-2xl font-extrabold text-[#1A1A2E]">{selected.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{selected.brand}</p>
          <div className="flex items-center justify-center gap-1 mt-2">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-bold text-[#1A1A2E]">{selected.rating}</span>
            <span className="text-xs text-gray-400">({selected.reviews} avaliações)</span>
          </div>
          <p className="text-2xl font-extrabold mt-3" style={{ color: selected.color }}>{selected.price}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#F0E8E0] p-6 mb-4">
          <h2 className="font-bold text-[#1A1A2E] mb-3">Descrição</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{selected.description}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {selected.tags.map((t) => (
              <span key={t} className="text-xs font-bold px-2.5 py-1 rounded-lg" style={{ backgroundColor: selected.bg, color: selected.color }}>{t}</span>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#F0E8E0] p-6 mb-4">
          <h2 className="font-bold text-[#1A1A2E] mb-3">Onde comprar</h2>
          <div className="space-y-2">
            {selected.where.map((w) => (
              <a key={w.name} href={w.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-[#FAF6F2] rounded-xl p-3.5 hover:bg-[#F0E8E0] transition-colors">
                <span className="font-semibold text-sm text-[#1A1A2E]">{w.name}</span>
                <ExternalLink size={16} className="text-gray-400" />
              </a>
            ))}
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 items-start">
          <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">Antes de dar qualquer produto ao seu animal, confirme a dose e adequação com o veterinário — especialmente em gatos, cadelas gestantes e animais com outras condições.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-extrabold text-[#1A1A2E] mb-2">Farmácia 💊</h1>
      <p className="text-gray-500 text-sm mb-4">Produtos recomendados para a saúde do seu animal.</p>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Pesquisar produto, marca ou sintoma..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#F0E8E0] bg-white text-sm focus:outline-none focus:border-[#FF6B35]" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${cat === c ? "bg-[#FF6B35] text-white" : "bg-white text-gray-500 border border-[#F0E8E0]"}`}>
            <span>{CAT_EMOJI[c]}</span> {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#F0E8E0] p-10 text-center">
          <p className="text-gray-500">Nenhum produto encontrado.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p) => (
            <button key={p.id} onClick={() => setSelected(p)} className="w-full flex items-center gap-3 bg-white rounded-2xl p-4 border hover:shadow-md transition-all text-left" style={{ borderColor: p.color + "30" }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: p.bg }}>{p.emoji}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#1A1A2E] text-sm truncate">{p.name}</p>
                <p className="text-xs text-gray-400 truncate">{p.brand} · {p.category}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-extrabold text-sm" style={{ color: p.color }}>{p.price}</p>
                <div className="flex items-center gap-0.5 justify-end">
                  <Star size={11} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-[11px] text-gray-400">{p.rating}</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-300 shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Pharmacy() {
  return (
    <RequireAuth>
      <AppShell>
        <PharmacyContent />
      </AppShell>
    </RequireAuth>
  );
}
