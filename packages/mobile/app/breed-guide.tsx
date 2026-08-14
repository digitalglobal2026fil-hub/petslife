import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Image } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react-native";

const BG = "#F8F6FF";
const PURPLE = "#8B5CF6";
const PURPLE_BG = "#F3EEFF";
const CARD = "#FFFFFF";
const GRAY = "#9CA3AF";
const DARK = "#1A1A2E";

const BREEDS = [
  {
    name: "Labrador Retriever", species: "dog", emoji: "🐕", size: "Grande",
    origin: "Canadá", life: "10–12 anos", weight: "25–36 kg",
    personality: ["Amigável", "Activo", "Leal", "Paciente"],
    health: ["Displasia da anca", "Obesidade", "Problemas oculares"],
    care: "Necessita de exercício diário intenso. Alimentação controlada para evitar obesidade. Escovagem semanal.",
    ideal: "Famílias com crianças, casas com jardim",
    color: "#FF6B35", bg: "#FFF0EB",
  },
  {
    name: "Golden Retriever", species: "dog", emoji: "🐕‍🦺", size: "Grande",
    origin: "Escócia", life: "10–12 anos", weight: "25–34 kg",
    personality: ["Carinhoso", "Inteligente", "Tolerante", "Brincalhão"],
    health: ["Cancro", "Displasia da anca", "Otites"],
    care: "Escovagem 2-3x/semana. Exercício diário. Banhos mensais. Verifique ouvidos regularmente.",
    ideal: "Famílias, crianças, idosos",
    color: "#F59E0B", bg: "#FEF3C7",
  },
  {
    name: "Bulldog Francês", species: "dog", emoji: "🐶", size: "Pequeno",
    origin: "França", life: "10–12 anos", weight: "8–14 kg",
    personality: ["Divertido", "Afectuoso", "Adaptável", "Calmo"],
    health: ["Problemas respiratórios", "Doenças de pele", "Displasia da anca"],
    care: "Evitar calor extremo. Limpar pregas da pele regularmente. Exercício moderado.",
    ideal: "Apartamentos, solteiros, casais",
    color: "#4ECDC4", bg: "#E8FAF9",
  },
  {
    name: "Pastor Alemão", species: "dog", emoji: "🐕", size: "Grande",
    origin: "Alemanha", life: "9–13 anos", weight: "22–40 kg",
    personality: ["Corajoso", "Leal", "Inteligente", "Versátil"],
    health: ["Displasia da anca", "Degeneração da coluna", "Alergias"],
    care: "Exercício vigoroso diário. Estimulação mental necessária. Escovagem 2-3x/semana.",
    ideal: "Donos activos, casas com espaço",
    color: "#6B7280", bg: "#F3F4F6",
  },
  {
    name: "Poodle", species: "dog", emoji: "🐩", size: "Variável",
    origin: "Alemanha/França", life: "12–15 anos", weight: "2–32 kg",
    personality: ["Inteligente", "Activo", "Instinto", "Fiel"],
    health: ["Problemas oculares", "Displasia da anca", "Alergias cutâneas"],
    care: "Tosquia a cada 6-8 semanas. Exercício diário. Excelente para alérgicos (pouca queda de pelo).",
    ideal: "Qualquer família, alérgicos",
    color: "#EC4899", bg: "#FDF2F8",
  },
  {
    name: "Persa", species: "cat", emoji: "🐱", size: "Médio",
    origin: "Irão", life: "12–17 anos", weight: "3–7 kg",
    personality: ["Tranquilo", "Carinhoso", "Reservado", "Elegante"],
    health: ["Problemas respiratórios", "Doenças renais", "Olhos"],
    care: "Escovagem diária obrigatória. Limpeza dos olhos regularmente. Dieta de qualidade.",
    ideal: "Casas tranquilas, pessoas calmas",
    color: "#8B5CF6", bg: "#F3EEFF",
  },
  {
    name: "Maine Coon", species: "cat", emoji: "🐈", size: "Grande",
    origin: "EUA", life: "12–15 anos", weight: "4–10 kg",
    personality: ["Sociável", "Inteligente", "Brincalhão", "Leal"],
    health: ["Miocardiopatia", "Displasia da anca", "Doença renal"],
    care: "Escovagem 2x/semana. Muito activo — precisa de estímulo. Adora água!",
    ideal: "Famílias, crianças, outros animais",
    color: "#06D6A0", bg: "#E6FAF5",
  },
  {
    name: "Siamês", species: "cat", emoji: "🐈‍⬛", size: "Médio",
    origin: "Tailândia", life: "12–20 anos", weight: "3–6 kg",
    personality: ["Vocal", "Curioso", "Social", "Inteligente"],
    health: ["Problemas dentários", "Amiloidose", "Asma"],
    care: "Muito interactivo — precisa de atenção. Escovagem semanal. Estimulação mental importante.",
    ideal: "Donos presentes, apreciam gatos comunicativos",
    color: "#F97316", bg: "#FFF7ED",
  },
  {
    name: "Canário", species: "bird", emoji: "🐤", size: "Pequeno",
    origin: "Ilhas Canárias", life: "10–15 anos", weight: "20–30 g",
    personality: ["Musical", "Activo", "Tímido", "Alegre"],
    health: ["Acarose", "Infecções respiratórias", "Obesidade"],
    care: "Gaiola espaçosa. Água fresca diária. Dieta variada com frutas e vegetais. Sem correntes de ar.",
    ideal: "Qualquer lar, iniciantes",
    color: "#FBBF24", bg: "#FFFBEB",
  },
  {
    name: "Papagaio Cinzento", species: "bird", emoji: "🦜", size: "Médio",
    origin: "África", life: "40–60 anos", weight: "400–600 g",
    personality: ["Inteligente", "Mimado", "Sensível", "Comunicativo"],
    health: ["Doenças do fígado", "Infecções respiratórias", "Autofagia"],
    care: "Muito inteligente — estimulação mental diária. Dieta rica e variada. Interação constante necessária.",
    ideal: "Donos experientes, muito tempo disponível",
    color: "#6B7280", bg: "#F3F4F6",
  },

  // ---------- CÃES (raças comuns em Portugal) ----------
  {
    name: "Cão da Serra da Estrela", species: "dog", emoji: "🐕", size: "Muito grande",
    origin: "Portugal", life: "10–14 anos", weight: "30–50 kg",
    personality: ["Protector", "Leal", "Independente", "Calmo"],
    health: ["Displasia da anca", "Torção gástrica", "Problemas cardíacos"],
    care: "Precisa de espaço e de exercício diário. Escovagem 2x/semana (muito mais na muda de pelo). Sofre com o calor.",
    ideal: "Casas com terreno, guarda de rebanhos e propriedades",
    color: "#B45309", bg: "#FEF3C7",
  },
  {
    name: "Podengo Português", species: "dog", emoji: "🐕", size: "Pequeno a médio",
    origin: "Portugal", life: "12–15 anos", weight: "4–30 kg",
    personality: ["Vivo", "Alerta", "Corajoso", "Brincalhão"],
    health: ["Muito saudável", "Luxação da patela", "Problemas oculares"],
    care: "Raça rústica e resistente. Muito exercício e brincadeira. Escovagem semanal simples.",
    ideal: "Donos activos, campo, caça",
    color: "#EA580C", bg: "#FFF0EB",
  },
  {
    name: "Yorkshire Terrier", species: "dog", emoji: "🐶", size: "Muito pequeno",
    origin: "Inglaterra", life: "13–16 anos", weight: "2–3 kg",
    personality: ["Corajoso", "Enérgico", "Afectuoso", "Teimoso"],
    health: ["Problemas dentários", "Traqueia colapsada", "Luxação da patela"],
    care: "Escovagem diária do pelo comprido. Lavagem dos dentes frequente. Cuidado com quedas e frio.",
    ideal: "Apartamentos, idosos, primeira experiência",
    color: "#7C3AED", bg: "#F5F3FF",
  },
  {
    name: "Chihuahua", species: "dog", emoji: "🐶", size: "Muito pequeno",
    origin: "México", life: "12–18 anos", weight: "1–3 kg",
    personality: ["Corajoso", "Muito ligado ao dono", "Alerta", "Ciumento"],
    health: ["Hidrocefalia", "Problemas dentários", "Hipoglicemia", "Tremores com frio"],
    care: "Proteger do frio com roupa. Refeições pequenas e frequentes. Socialização desde cachorro.",
    ideal: "Apartamentos, quem passa muito tempo em casa",
    color: "#DB2777", bg: "#FDF2F8",
  },

  // ---------- GATOS ----------
  {
    name: "Gato Europeu Comum", species: "cat", emoji: "🐈", size: "Médio",
    origin: "Europa", life: "14–20 anos", weight: "3–6 kg",
    personality: ["Equilibrado", "Independente", "Bom caçador", "Adaptável"],
    health: ["Muito robusto", "Doença renal na velhice", "Parasitas"],
    care: "O gato mais comum em Portugal e o mais saudável. Vacinação anual, desparasitação e esterilização.",
    ideal: "Qualquer família — a melhor escolha para adoptar",
    color: "#0EA5E9", bg: "#E0F2FE",
  },
  {
    name: "British Shorthair", species: "cat", emoji: "🐱", size: "Médio a grande",
    origin: "Reino Unido", life: "14–20 anos", weight: "4–8 kg",
    personality: ["Calmo", "Reservado", "Afável", "Pouco exigente"],
    health: ["Cardiomiopatia", "Doença renal policística", "Obesidade"],
    care: "Escovagem semanal. Controlar a comida — engorda com facilidade. Não gosta de ser muito pegado ao colo.",
    ideal: "Apartamentos, pessoas tranquilas",
    color: "#64748B", bg: "#F1F5F9",
  },
  {
    name: "Sphynx (sem pelo)", species: "cat", emoji: "🐈", size: "Médio",
    origin: "Canadá", life: "12–15 anos", weight: "3–6 kg",
    personality: ["Muito afectuoso", "Brincalhão", "Sociável", "Pegajoso"],
    health: ["Problemas de pele", "Cardiomiopatia", "Sensível ao frio e ao sol"],
    care: "Banho a cada 1-2 semanas (a pele fica oleosa). Manter em ambiente quente. Protector solar em zonas expostas.",
    ideal: "Quem está muito em casa, ambientes aquecidos",
    color: "#F472B6", bg: "#FDF2F8",
  },

  // ---------- AVES ----------
  {
    name: "Periquito", species: "bird", emoji: "🐦", size: "Muito pequeno",
    origin: "Austrália", life: "7–12 anos", weight: "30–40 g",
    personality: ["Alegre", "Sociável", "Curioso", "Falador"],
    health: ["Tumores", "Papo entupido", "Ácaros", "Obesidade"],
    care: "Gaiola larga e não alta. Companhia (melhor aos pares). Sementes, vegetais frescos e osso de choco.",
    ideal: "Primeira ave, apartamentos, crianças acompanhadas",
    color: "#22C55E", bg: "#DCFCE7",
  },
  {
    name: "Calopsita", species: "bird", emoji: "🦜", size: "Pequeno",
    origin: "Austrália", life: "15–20 anos", weight: "80–110 g",
    personality: ["Meiga", "Assobia melodias", "Ligada ao dono", "Sensível"],
    health: ["Doença do bico e das penas", "Deficiência de vitamina A", "Stress por solidão"],
    care: "Precisa de horas de convívio diário. Ração específica, legumes escuros. Nunca deixar fumo ou tachos antiaderentes ao lume perto.",
    ideal: "Quem tem tempo e paciência, famílias",
    color: "#FACC15", bg: "#FEF9C3",
  },
  {
    name: "Agapornis (inseparável)", species: "bird", emoji: "🦜", size: "Muito pequeno",
    origin: "África", life: "10–15 anos", weight: "40–60 g",
    personality: ["Muito activo", "Territorial", "Afectuoso", "Barulhento"],
    health: ["Automutilação de penas", "Problemas respiratórios", "Fracturas"],
    care: "Brinquedos e coisas para roer sempre disponíveis. Cuidado ao juntar com outras espécies — é territorial.",
    ideal: "Donos presentes, casas onde o barulho não incomoda",
    color: "#F97316", bg: "#FFEDD5",
  },

  // ---------- ROEDORES (inclui coelhos) ----------
  {
    name: "Hamster Sírio", species: "rodent", emoji: "🐹", size: "Muito pequeno",
    origin: "Síria", life: "2–3 anos", weight: "120–200 g",
    personality: ["Solitário", "Activo à noite", "Curioso", "Territorial"],
    health: ["Tumores", "Cauda molhada (diarreia)", "Dentes crescidos", "Obesidade"],
    care: "SEMPRE sozinho — brigam até à morte. Gaiola grande com muita cama para escavar. Roda sem barras.",
    ideal: "Crianças maiores com supervisão, pouco espaço",
    color: "#D97706", bg: "#FEF3C7",
  },
  {
    name: "Porquinho-da-índia", species: "rodent", emoji: "🐹", size: "Pequeno",
    origin: "Andes", life: "5–8 anos", weight: "700–1200 g",
    personality: ["Sociável", "Assobia quando contente", "Medroso", "Meigo"],
    health: ["Escorbuto (falta de vitamina C)", "Problemas dentários", "Infecções respiratórias"],
    care: "NUNCA sozinho — precisa de companhia. Vitamina C todos os dias (pimento, salsa). Feno à vontade.",
    ideal: "Famílias com crianças, primeira experiência",
    color: "#F59E0B", bg: "#FEF3C7",
  },
  {
    name: "Coelho Anão", species: "rodent", emoji: "🐰", size: "Pequeno",
    origin: "Europa", life: "8–12 anos", weight: "1–2 kg",
    personality: ["Curioso", "Afectuoso", "Activo", "Social"],
    health: ["Problemas dentários", "Paragem intestinal", "Mixomatose", "Doença hemorrágica"],
    care: "Feno fresco ilimitado (base da alimentação). Espaço para correr todos os dias. Vacinação anual e esterilização.",
    ideal: "Apartamentos, crianças maiores",
    color: "#F472B6", bg: "#FDF2F8",
  },
  {
    name: "Chinchila", species: "rodent", emoji: "🐭", size: "Pequeno",
    origin: "Andes", life: "10–20 anos", weight: "400–800 g",
    personality: ["Activa", "Saltitante", "Tímida", "Nocturna"],
    health: ["Golpe de calor", "Problemas dentários", "Fungos na pele"],
    care: "Banho de areia (nunca água). Não suporta calor — máximo 22°C. Gaiola alta com plataformas.",
    ideal: "Casas frescas, donos calmos",
    color: "#94A3B8", bg: "#F1F5F9",
  },
  {
    name: "Ratazana doméstica", species: "rodent", emoji: "🐀", size: "Pequeno",
    origin: "Ásia", life: "2–4 anos", weight: "300–600 g",
    personality: ["Muito inteligente", "Sociável", "Aprende truques", "Limpa"],
    health: ["Tumores mamários", "Infecções respiratórias", "Problemas de pele"],
    care: "Sempre aos pares ou grupos. Gaiola alta com túneis. Aprende o nome e truques com recompensas.",
    ideal: "Quem quer um animal pequeno e muito interactivo",
    color: "#78716C", bg: "#F5F5F4",
  },

  // ---------- RÉPTEIS ----------
  {
    name: "Tartaruga do Mediterrâneo", species: "reptile", emoji: "🐢", size: "Médio",
    origin: "Bacia do Mediterrâneo", life: "50–100 anos", weight: "1–5 kg",
    personality: ["Calma", "Curiosa", "Lenta", "Independente"],
    health: ["Carapaça mole (falta de cálcio)", "Problemas respiratórios", "Vermes"],
    care: "Precisa de sol real ou lâmpada UVB. Alimentação vegetal variada. Hibernação no Inverno. ATENÇÃO: espécie protegida, exige documentos legais.",
    ideal: "Quintais e jardins, compromisso para a vida",
    color: "#16A34A", bg: "#DCFCE7",
  },
  {
    name: "Gecko Leopardo", species: "reptile", emoji: "🦎", size: "Pequeno",
    origin: "Ásia", life: "15–20 anos", weight: "50–90 g",
    personality: ["Dócil", "Nocturno", "Tranquilo", "Fácil de manusear"],
    health: ["Doença óssea metabólica", "Muda de pele presa", "Impactação por areia"],
    care: "Terrário com zona quente (30°C) e fria. Insectos vivos com cálcio. Nunca usar areia solta como fundo.",
    ideal: "Primeiro réptil, pouco espaço",
    color: "#FBBF24", bg: "#FEF9C3",
  },
  {
    name: "Dragão Barbudo", species: "reptile", emoji: "🦎", size: "Médio",
    origin: "Austrália", life: "10–15 anos", weight: "300–600 g",
    personality: ["Muito dócil", "Diurno", "Curioso", "Sociável com o dono"],
    health: ["Doença óssea metabólica", "Parasitas", "Impactação intestinal"],
    care: "Terrário grande com UVB forte e ponto de calor a 40°C. Insectos e vegetais. Adora estar ao colo.",
    ideal: "Famílias, quem quer um réptil interactivo",
    color: "#EA580C", bg: "#FFEDD5",
  },
  {
    name: "Cobra do Milho", species: "reptile", emoji: "🐍", size: "Médio",
    origin: "América do Norte", life: "15–20 anos", weight: "700–900 g",
    personality: ["Calma", "Não agressiva", "Discreta", "Resistente"],
    health: ["Muda de pele presa", "Ácaros", "Infecções da boca"],
    care: "Terrário bem fechado (fogem com facilidade). Come um roedor congelado a cada 7-10 dias. Água sempre limpa.",
    ideal: "Quem quer um animal silencioso e de manutenção simples",
    color: "#DC2626", bg: "#FEE2E2",
  },

  // ---------- AQUÁTICOS ----------
  {
    name: "Peixe Dourado (alforreca)", species: "aquatic", emoji: "🐟", size: "Pequeno a médio",
    origin: "China", life: "10–25 anos", weight: "100–300 g",
    personality: ["Sociável", "Activo", "Reconhece a hora da comida"],
    health: ["Ponto branco", "Problemas da bexiga natatória", "Água com amónia"],
    care: "ERRO COMUM: não vive em taça. Precisa de 40 litros ou mais, com filtro. Água fresca, sem aquecedor.",
    ideal: "Primeiro aquário, com o tanque certo",
    color: "#F97316", bg: "#FFEDD5",
  },
  {
    name: "Peixe Betta (lutador)", species: "aquatic", emoji: "🐠", size: "Muito pequeno",
    origin: "Tailândia", life: "3–5 anos", weight: "3–5 g",
    personality: ["Territorial", "Curioso", "Vistoso", "Interage com o dono"],
    health: ["Podridão das barbatanas", "Inchaço", "Fungos"],
    care: "Macho SEMPRE sozinho — luta até à morte. Mínimo 15 litros aquecidos a 25-27°C. Água calma, sem corrente forte.",
    ideal: "Aquário pequeno, secretária, primeira experiência",
    color: "#3B82F6", bg: "#DBEAFE",
  },
  {
    name: "Carpa Koi", species: "aquatic", emoji: "🐟", size: "Muito grande",
    origin: "Japão", life: "25–50 anos", weight: "5–15 kg",
    personality: ["Mansa", "Come da mão", "Sociável", "Serena"],
    health: ["Parasitas da pele", "Úlceras", "Falta de oxigénio no Verão"],
    care: "Só em lago exterior a partir de 1000 litros e 1,2 m de fundo. Filtragem forte. Rede contra garças e gatos.",
    ideal: "Jardins com lago, projecto para a vida",
    color: "#EF4444", bg: "#FEE2E2",
  },
  {
    name: "Pato Doméstico", species: "aquatic", emoji: "🦆", size: "Médio",
    origin: "Domesticado (Ásia/Europa)", life: "8–15 anos", weight: "2–4 kg",
    personality: ["Muito sociável", "Barulhento", "Curioso", "Ligado ao grupo"],
    health: ["Problemas nas patas", "Botulismo", "Falta de niacina", "Predadores"],
    care: "NUNCA sozinho — precisa de outros patos. Água para nadar e limpar as narinas. Abrigo fechado à noite. Ração própria (a de galinha em excesso faz mal).",
    ideal: "Quintais com espaço e água, quintas",
    color: "#0EA5E9", bg: "#E0F2FE",
  },

  // ---------- ANIMAIS DE QUINTA ----------
  {
    name: "Galinha Poedeira", species: "farm", emoji: "🐔", size: "Médio",
    origin: "Domesticada", life: "5–10 anos", weight: "1,5–3 kg",
    personality: ["Curiosa", "Hierárquica", "Sociável", "Activa de dia"],
    health: ["Piolhos e ácaros", "Coccidiose", "Postura presa", "Bicagem entre elas"],
    care: "Galinheiro fechado à noite contra raposas. Poleiros e ninhos. Ração de postura com cálcio (casca de ostra). Espaço para ciscar.",
    ideal: "Quintais, ovos frescos em casa",
    color: "#D97706", bg: "#FEF3C7",
  },
  {
    name: "Cabra Anã", species: "farm", emoji: "🐐", size: "Pequeno a médio",
    origin: "África Ocidental", life: "12–18 anos", weight: "20–35 kg",
    personality: ["Brincalhona", "Curiosa", "Fugitiva", "Muito social"],
    health: ["Vermes internos", "Timpanismo (inchaço)", "Problemas nos cascos"],
    care: "Nunca sozinha. Vedação bem alta — sobe e foge. Cascos aparados a cada 6-8 semanas. Desparasitação regular.",
    ideal: "Terrenos vedados, companhia e limpeza de mato",
    color: "#A16207", bg: "#FEF9C3",
  },
  {
    name: "Ovelha", species: "farm", emoji: "🐑", size: "Grande",
    origin: "Ásia Menor", life: "10–14 anos", weight: "45–100 kg",
    personality: ["Calma", "Gregária", "Medrosa", "Rotineira"],
    health: ["Vermes", "Miíase (bicheira)", "Problemas nos cascos", "Golpe de calor"],
    care: "Vive em rebanho. Tosquia obrigatória uma vez por ano (Primavera). Pastagem, água limpa e sombra.",
    ideal: "Terrenos com pasto, lã e limpeza de terreno",
    color: "#94A3B8", bg: "#F1F5F9",
  },
  {
    name: "Cavalo", species: "farm", emoji: "🐴", size: "Muito grande",
    origin: "Ásia Central", life: "25–35 anos", weight: "350–700 kg",
    personality: ["Sensível", "Inteligente", "Gregário", "Leal"],
    health: ["Cólica (urgência grave)", "Laminite", "Vermes", "Problemas dentários"],
    care: "Compromisso grande: espaço, cascos aparados a cada 6-8 semanas, dentes vistos uma vez por ano, vacinas e exercício diário.",
    ideal: "Quem tem terreno, tempo e apoio veterinário próximo",
    color: "#92400E", bg: "#FEF3C7",
  },
  {
    name: "Porco Miniatura", species: "farm", emoji: "🐷", size: "Médio",
    origin: "Domesticado", life: "12–20 anos", weight: "35–90 kg",
    personality: ["Muito inteligente", "Teimoso", "Afectuoso", "Guloso"],
    health: ["Obesidade", "Problemas de pele", "Artrite", "Cascos crescidos"],
    care: "ATENÇÃO: os \"mini pigs\" crescem muito mais do que prometem. Dieta controlada, sombra e lama ou água para se refrescar (não suam).",
    ideal: "Quintais grandes, donos informados e pacientes",
    color: "#EC4899", bg: "#FDF2F8",
  },
];

const FILTERS = ["Todos", "Cães 🐕", "Gatos 🐱", "Aves 🦜", "Roedores 🐹", "Répteis 🦎", "Aquáticos 🐠", "Quinta 🐔"];
const filterMap: Record<string, string> = {
  "Cães 🐕": "dog", "Gatos 🐱": "cat", "Aves 🦜": "bird",
  // Roedores inclui os coelhos, como pedido
  "Roedores 🐹": "rodent", "Répteis 🦎": "reptile",
  "Aquáticos 🐠": "aquatic", "Quinta 🐔": "farm",
};

export default function BreedGuideScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [selected, setSelected] = useState<typeof BREEDS[0] | null>(null);

  const filtered = BREEDS.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "Todos" || b.species === filterMap[filter];
    return matchSearch && matchFilter;
  });

  if (selected) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: selected.bg }} edges={["top"]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Header */}
          <View style={{ backgroundColor: selected.color, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}>
            <TouchableOpacity onPress={() => setSelected(null)} style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 }}>
              <ChevronLeft size={20} color="#fff" />
              <Text suppressHighlighting style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>Voltar</Text>
            </TouchableOpacity>
            <Text suppressHighlighting style={{ fontSize: 64, textAlign: "center" }}>{selected.emoji}</Text>
            <Text suppressHighlighting style={{ fontSize: 26, fontWeight: "900", color: "#fff", textAlign: "center", marginTop: 8 }}>{selected.name}</Text>
            <View style={{ flexDirection: "row", justifyContent: "center", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              <View style={{ backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 }}>
                <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>📏 {selected.size}</Text>
              </View>
              <View style={{ backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 }}>
                <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>⏳ {selected.life}</Text>
              </View>
              <View style={{ backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 }}>
                <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>⚖️ {selected.weight}</Text>
              </View>
              <View style={{ backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 }}>
                <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>🌍 {selected.origin}</Text>
              </View>
            </View>
          </View>

          <View style={{ padding: 20, gap: 16 }}>
            {/* Personalidade */}
            <View style={{ backgroundColor: CARD, borderRadius: 20, padding: 18 }}>
              <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "800", color: DARK, marginBottom: 12 }}>✨ Personalidade</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {selected.personality.map(p => (
                  <View key={p} style={{ backgroundColor: selected.bg, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1.5, borderColor: selected.color + "40" }}>
                    <Text suppressHighlighting style={{ color: selected.color, fontWeight: "700", fontSize: 13 }}>{p}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Cuidados */}
            <View style={{ backgroundColor: CARD, borderRadius: 20, padding: 18 }}>
              <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "800", color: DARK, marginBottom: 10 }}>🛁 Cuidados</Text>
              <Text suppressHighlighting style={{ color: "#4B5563", fontSize: 14, lineHeight: 22 }}>{selected.care}</Text>
            </View>

            {/* Saúde */}
            <View style={{ backgroundColor: CARD, borderRadius: 20, padding: 18 }}>
              <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "800", color: DARK, marginBottom: 12 }}>⚕️ Atenção à Saúde</Text>
              {selected.health.map(h => (
                <View key={h} style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#EF4444" }} />
                  <Text suppressHighlighting style={{ color: "#4B5563", fontSize: 14 }}>{h}</Text>
                </View>
              ))}
            </View>

            {/* Ideal para */}
            <View style={{ backgroundColor: selected.bg, borderRadius: 20, padding: 18, borderWidth: 1.5, borderColor: selected.color + "30" }}>
              <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "800", color: DARK, marginBottom: 8 }}>🏠 Ideal para</Text>
              <Text suppressHighlighting style={{ color: "#4B5563", fontSize: 14, lineHeight: 20 }}>{selected.ideal}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={{ backgroundColor: PURPLE, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}>
            <ChevronLeft size={18} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text suppressHighlighting style={{ fontSize: 22, fontWeight: "900", color: "#fff" }}>Guia de Raças 📖</Text>
            <Text suppressHighlighting style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 2 }}>{BREEDS.length} raças disponíveis</Text>
          </View>
        </View>
        <View style={{ backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 14, flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 10, gap: 8 }}>
          <Search size={16} color="rgba(255,255,255,0.8)" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Pesquisar raça..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            style={{ flex: 1, color: "#fff", fontSize: 14 }}
          />
        </View>
      </View>

      {/* Filtros */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 20, paddingVertical: 14 }}>
        {FILTERS.map(f => (
          <TouchableOpacity key={f} onPress={() => setFilter(f)}
            style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: filter === f ? PURPLE : CARD, borderWidth: 1.5, borderColor: filter === f ? PURPLE : "#E5E7EB" }}>
            <Text suppressHighlighting style={{ color: filter === f ? "#fff" : GRAY, fontWeight: "700", fontSize: 13 }}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: Math.max(insets.bottom, 20) + 60, gap: 12 }}>
        {filtered.map(b => (
          <TouchableOpacity key={b.name} onPress={() => setSelected(b)} activeOpacity={0.85}
            style={{ backgroundColor: CARD, borderRadius: 20, padding: 16, flexDirection: "row", alignItems: "center", gap: 14, borderWidth: 1.5, borderColor: b.color + "25" }}>
            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: b.bg, alignItems: "center", justifyContent: "center" }}>
              <Text suppressHighlighting style={{ fontSize: 32 }}>{b.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "800", color: DARK }}>{b.name}</Text>
              <Text suppressHighlighting style={{ color: GRAY, fontSize: 12, marginTop: 2 }}>{b.size} · {b.life}</Text>
              <View style={{ flexDirection: "row", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                {b.personality.slice(0, 2).map(p => (
                  <View key={p} style={{ backgroundColor: b.bg, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <Text suppressHighlighting style={{ color: b.color, fontSize: 11, fontWeight: "700" }}>{p}</Text>
                  </View>
                ))}
              </View>
            </View>
            <ChevronRight size={18} color={GRAY} />
          </TouchableOpacity>
        ))}
        {filtered.length === 0 && (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Text suppressHighlighting style={{ fontSize: 48 }}>🔍</Text>
            <Text suppressHighlighting style={{ color: DARK, fontWeight: "700", fontSize: 16, marginTop: 12 }}>Nenhuma raça encontrada</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
