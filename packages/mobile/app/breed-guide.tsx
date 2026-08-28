import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Image } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react-native";
import { tr } from "../lib/i18n";

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
  // ---------- RAÇAS ACRESCENTADAS ----------
  {
    name: "Border Collie", species: "dog", emoji: "🐕", size: "Médio",
    origin: "Reino Unido", life: "12–15 anos", weight: "14–20 kg",
    personality: ["Muito inteligente", "Incansável", "Obediente", "Sensível"],
    health: ["Displasia da anca", "Anomalia ocular do Collie", "Epilepsia"],
    care: "É o cão mais inteligente que existe e isso dá trabalho: precisa de tarefas todos os dias. Sem ocupação começa a pastorear pessoas e a destruir a casa.",
    ideal: "Pessoas activas, campo, desportos caninos",
    color: "#1F2937", bg: "#F3F4F6",
  },
  {
    name: "Beagle", species: "dog", emoji: "🐶", size: "Pequeno a médio",
    origin: "Reino Unido", life: "12–15 anos", weight: "9–14 kg",
    personality: ["Alegre", "Teimoso", "Sociável", "Guloso"],
    health: ["Obesidade", "Otites", "Epilepsia", "Problemas de coluna"],
    care: "Segue cheiros e desaparece — passeio sempre com trela e jardim bem vedado. Come tudo o que vê, controlar a ração.",
    ideal: "Famílias com crianças e paciência para a teimosia",
    color: "#B45309", bg: "#FEF3C7",
  },
  {
    name: "Rafeiro / Cão sem raça", species: "dog", emoji: "🐕", size: "Variável",
    origin: "Portugal e todo o mundo", life: "12–16 anos", weight: "Variável",
    personality: ["Equilibrado", "Agradecido", "Adaptável", "Único"],
    health: ["Geralmente mais saudável que os de raça", "Depende da origem"],
    care: "Os cães sem raça definida costumam ser mais resistentes a doenças hereditárias. Nos abrigos portugueses estão milhares à espera de casa.",
    ideal: "Toda a gente — adoptar em vez de comprar",
    color: "#059669", bg: "#D1FAE5",
  },
  {
    name: "Cocker Spaniel", species: "dog", emoji: "🐕", size: "Médio",
    origin: "Reino Unido", life: "12–15 anos", weight: "12–16 kg",
    personality: ["Meigo", "Alegre", "Apegado", "Sensível"],
    health: ["Otites frequentes", "Cataratas", "Problemas de pele"],
    care: "As orelhas compridas abafam e infectam com facilidade: limpar e verificar todas as semanas. Tosquia a cada 2 meses.",
    ideal: "Famílias, apartamentos com passeios diários",
    color: "#92400E", bg: "#FEF3C7",
  },
  {
    name: "Ragdoll", species: "cat", emoji: "🐱", size: "Grande",
    origin: "Estados Unidos", life: "12–17 anos", weight: "4,5–9 kg",
    personality: ["Extremamente calmo", "Amoroso", "Fica mole ao colo", "Segue o dono"],
    health: ["Cardiomiopatia hipertrófica", "Problemas renais", "Bolas de pelo"],
    care: "Deve viver só dentro de casa — é confiante demais e não foge do perigo. Escovar 3 vezes por semana.",
    ideal: "Casas calmas, quem quer um gato muito dócil",
    color: "#6366F1", bg: "#E0E7FF",
  },
  {
    name: "Bengal", species: "cat", emoji: "🐈", size: "Médio a grande",
    origin: "Estados Unidos", life: "12–16 anos", weight: "4–8 kg",
    personality: ["Muito activo", "Brincalhão", "Falador", "Gosta de água"],
    health: ["Cardiomiopatia", "Atrofia da retina", "Problemas digestivos"],
    care: "Não é gato de sofá: precisa de prateleiras altas, brinquedos e atenção. Aborrecido, destrói tudo.",
    ideal: "Donos presentes e casas com espaço vertical",
    color: "#EA580C", bg: "#FFEDD5",
  },
  {
    name: "Ringneck (Periquito-de-colar)", species: "bird", emoji: "🦜", size: "Médio",
    origin: "Índia e África", life: "25–30 anos", weight: "115–140 g",
    personality: ["Muito inteligente", "Fala bem", "Independente", "Teimoso na adolescência"],
    health: ["Arrancar penas por tédio", "Psitacose", "Problemas de fígado por má alimentação"],
    care: "Vive 30 anos — é um compromisso para a vida. Gaiola grande (mínimo 90 cm) e várias horas fora dela. Aprende dezenas de palavras. Por volta de 1 ano passa por uma fase rebelde (bluffing) que passa com calma e sem gritos. Ração de qualidade, fruta e legumes; nada de abacate nem chocolate.",
    ideal: "Donos experientes, com tempo e paciência",
    color: "#16A34A", bg: "#DCFCE7",
  },
  {
    name: "Caturra Ninfa", species: "bird", emoji: "🐦", size: "Pequeno",
    origin: "Austrália", life: "15–20 anos", weight: "80–120 g",
    personality: ["Carinhosa", "Assobia melodias", "Sociável", "Meiga"],
    health: ["Pó das penas (alergias no dono)", "Terrores nocturnos", "Obesidade"],
    care: "Deixar uma luz de presença — assustam-se no escuro e batem na gaiola. Adoram festas na crista.",
    ideal: "Primeira ave, famílias",
    color: "#F59E0B", bg: "#FEF3C7",
  },
  {
    name: "Caldinho / Canário-da-terra", species: "bird", emoji: "🐤", size: "Muito pequeno",
    origin: "América do Sul", life: "8–12 anos", weight: "20 g",
    personality: ["Canta muito", "Activo", "Territorial entre machos"],
    health: ["Ácaros", "Stress por barulho", "Falta de cálcio"],
    care: "Machos separados. Banho de água todos os dias e osso de siba para o bico e o cálcio.",
    ideal: "Quem gosta de canto em casa",
    color: "#EAB308", bg: "#FEF9C3",
  },
  {
    name: "Pombo Doméstico", species: "bird", emoji: "🕊️", size: "Médio",
    origin: "Europa e Ásia", life: "10–15 anos", weight: "300–500 g",
    personality: ["Muito calmo", "Fiel ao par", "Reconhece o dono"],
    health: ["Tricomoníase", "Vermes", "Varíola aviária"],
    care: "Vivem em casal para a vida. Pombal limpo e seco, grit para a digestão e vacinas próprias.",
    ideal: "Quem tem pátio ou telhado disponível",
    color: "#64748B", bg: "#F1F5F9",
  },
  {
    name: "Coelho Belier (orelhudo)", species: "rodent", emoji: "🐰", size: "Médio",
    origin: "Países Baixos", life: "7–12 anos", weight: "2–4 kg",
    personality: ["Muito calmo", "Meigo", "Gosta de colo", "Curioso"],
    health: ["Dentes crescidos", "Otites por causa das orelhas", "Estase intestinal"],
    care: "Feno à vontade 24 horas por dia — é 80% da alimentação e gasta os dentes. Vacinas contra mixomatose e doença hemorrágica todos os anos.",
    ideal: "Famílias com crianças mais velhas",
    color: "#A855F7", bg: "#F3E8FF",
  },
  {
    name: "Hamster Anão Russo", species: "rodent", emoji: "🐹", size: "Muito pequeno",
    origin: "Rússia e Cazaquistão", life: "2–3 anos", weight: "30–50 g",
    personality: ["Rápido", "Nocturno", "Curioso"],
    health: ["Diabetes (muito comum)", "Tumores", "Problemas de pele"],
    care: "Nada de fruta doce nem de guloseimas açucaradas — dão diabetes. Roda sem barras (fechada) para não partir as patas.",
    ideal: "Casas pequenas, quem se deita tarde",
    color: "#78716C", bg: "#F5F5F4",
  },
  {
    name: "Furão", species: "rodent", emoji: "🦡", size: "Pequeno",
    origin: "Europa", life: "6–10 anos", weight: "0,7–2 kg",
    personality: ["Brincalhão", "Curioso", "Ladrão de objectos", "Dorme muitas horas"],
    health: ["Doença adrenal", "Insulinoma", "Gripe humana (apanha de nós)"],
    care: "É carnívoro: ração de furão ou de gato de alta qualidade, nunca comida de coelho. Vacina da esganana obrigatória. Esconde tudo o que apanha.",
    ideal: "Donos atentos, casas à prova de fugas",
    color: "#7C3AED", bg: "#EDE9FE",
  },
  {
    name: "Camaleão-comum", species: "reptile", emoji: "🦎", size: "Médio",
    origin: "Sul de Portugal e Mediterrâneo", life: "5–8 anos", weight: "100–200 g",
    personality: ["Solitário", "Lento", "Muito sensível ao stress"],
    health: ["Desidratação", "Falta de cálcio", "Infecções respiratórias"],
    care: "Em Portugal é espécie protegida — não se apanha na natureza. Bebe gotas nas folhas, não em taça. Terrário alto com plantas e UVB.",
    ideal: "Só para criadores experientes e com licença",
    color: "#22C55E", bg: "#DCFCE7",
  },
  {
    name: "Pogona / Tartaruga de água", species: "reptile", emoji: "🐢", size: "Médio",
    origin: "Ásia e América", life: "20–40 anos", weight: "1–2 kg",
    personality: ["Calma", "Activa de dia", "Come da mão"],
    health: ["Casco mole por falta de UVB", "Infecções nos olhos", "Água suja"],
    care: "Precisa de zona seca para apanhar calor e lâmpada UVB. Vive dezenas de anos: nunca largar num lago ou ribeira, é crime e destrói as espécies locais.",
    ideal: "Quem quer um animal para décadas",
    color: "#0D9488", bg: "#CCFBF1",
  },
  {
    name: "Guppy", species: "aquatic", emoji: "🐠", size: "Muito pequeno",
    origin: "América do Sul", life: "2–3 anos", weight: "1–2 g",
    personality: ["Muito activo", "Pacífico", "Colorido", "Vive em grupo"],
    health: ["Ponto branco", "Fungos na cauda", "Excesso de crias"],
    care: "Um macho para duas ou três fêmeas. Reproduz-se muito depressa — cuidado com o aquário a encher. Água a 24-26°C.",
    ideal: "Primeiro aquário, crianças",
    color: "#06B6D4", bg: "#CFFAFE",
  },
  {
    name: "Pato Real / Marreco", species: "aquatic", emoji: "🦆", size: "Médio",
    origin: "Europa", life: "10–15 anos", weight: "1–1,5 kg",
    personality: ["Sociável", "Bom guardião", "Barulhento"],
    health: ["Patas feridas", "Parasitas", "Predadores"],
    care: "Come lesmas e caracóis — ajuda na horta. Precisa de água para se limpar e de abrigo fechado à noite.",
    ideal: "Quintais com horta",
    color: "#0891B2", bg: "#E0F2FE",
  },
  {
    name: "Codorniz", species: "farm", emoji: "🐣", size: "Muito pequeno",
    origin: "Ásia", life: "2–4 anos", weight: "100–300 g",
    personality: ["Discreta", "Nervosa", "Vive em grupo"],
    health: ["Stress", "Bicagem", "Falta de proteína"],
    care: "Ocupa pouco espaço e põe ovos quase todos os dias. Ração com muita proteína. Tecto no cercado — voam de repente.",
    ideal: "Quintais pequenos, varandas grandes",
    color: "#CA8A04", bg: "#FEF9C3",
  },
  {
    name: "Burro / Jumento", species: "farm", emoji: "🫏", size: "Grande",
    origin: "África", life: "30–40 anos", weight: "150–350 kg",
    personality: ["Calmo", "Muito inteligente", "Prudente", "Fiel"],
    health: ["Cascos crescidos", "Vermes", "Obesidade com erva rica"],
    care: "Não é teimoso, é prudente: pára quando sente perigo. Nunca sozinho. Cascos aparados a cada 8 semanas. Em Portugal há raças protegidas, como o burro de Miranda.",
    ideal: "Terrenos, companhia de cavalos, quintas pedagógicas",
    color: "#6B7280", bg: "#F3F4F6",
  },
  {
    name: "Maltês (Bichon Maltês)", species: "dog", emoji: "🐶", size: "Muito pequeno",
    origin: "Malta / Mediterrâneo", life: "12–15 anos", weight: "3–4 kg",
    personality: ["Meigo", "Alegre", "Corajoso", "Muito apegado"],
    health: ["Lágrimas nos olhos", "Tártaro e perda de dentes", "Luxação da rótula"],
    care: "Pelo branco e comprido: escovar todos os dias para não emaranhar, ou manter tosquia curta. Limpar o canto dos olhos. Lavar os dentes com frequência.",
    ideal: "Apartamentos, idosos, quem está muito em casa",
    color: "#8B5CF6", bg: "#F3EEFF",
  },
  {
    name: "Bichon Frisé", species: "dog", emoji: "🐩", size: "Pequeno",
    origin: "Bélgica / França", life: "12–15 anos", weight: "5–8 kg",
    personality: ["Brincalhão", "Sociável", "Bem-humorado", "Sensível"],
    health: ["Alergias de pele", "Problemas de ouvidos", "Cataratas"],
    care: "Tosquia a cada 6-8 semanas e escovagem 3x/semana. Solta pouco pelo, bom para alérgicos. Não gosta de ficar sozinho muitas horas.",
    ideal: "Famílias, apartamentos, alérgicos",
    color: "#EC4899", bg: "#FDF2F8",
  },
  {
    name: "Shih Tzu", species: "dog", emoji: "🐶", size: "Pequeno",
    origin: "Tibete / China", life: "12–16 anos", weight: "4–8 kg",
    personality: ["Companheiro", "Calmo", "Teimoso", "Afectuoso"],
    health: ["Dificuldade a respirar no calor", "Olhos secos e feridas na córnea", "Problemas de coluna"],
    care: "Focinho achatado: nunca passear no calor nem exigir corridas. Escovar diariamente ou tosquiar curto. Limpar a cara depois de comer.",
    ideal: "Apartamentos, idosos, vida calma",
    color: "#F59E0B", bg: "#FEF3C7",
  },
  {
    name: "Chow Chow", species: "dog", emoji: "🐕", size: "Médio a grande",
    origin: "China", life: "9–12 anos", weight: "20–32 kg",
    personality: ["Independente", "Reservado", "Digno", "Territorial"],
    health: ["Displasia da anca", "Entrópio (pálpebras viradas)", "Golpe de calor", "Problemas de tiroide"],
    care: "Pelo muito denso: escovar 3-4x/semana e todos os dias na muda. Sofre muito com o calor. Precisa de socialização desde cachorro — não é cão para estranhos pegarem ao colo.",
    ideal: "Donos experientes, clima fresco, casa com espaço",
    color: "#FF6B35", bg: "#FFF0EB",
  },
  {
    name: "Dogue Alemão (Grande Dinamarquês)", species: "dog", emoji: "🐕", size: "Gigante",
    origin: "Alemanha", life: "7–10 anos", weight: "45–90 kg",
    personality: ["Gentil", "Tranquilo", "Amigo das crianças", "Sensível"],
    health: ["Torção do estômago (urgência)", "Problemas cardíacos", "Displasia da anca", "Dores de crescimento"],
    care: "Gigante meigo. Dar refeições repartidas e evitar exercício logo depois de comer, pelo risco de torção do estômago. Cama macia e grossa para proteger as articulações. Crescimento controlado com ração própria para raças gigantes.",
    ideal: "Casas grandes, famílias calmas",
    color: "#6B7280", bg: "#F3F4F6",
  },
  {
    name: "Maremano-Abruzês (Pastor Maremano)", species: "dog", emoji: "🐕‍🦺", size: "Grande",
    origin: "Itália", life: "11–13 anos", weight: "30–45 kg",
    personality: ["Guardião", "Independente", "Corajoso", "Desconfiado de estranhos"],
    health: ["Displasia da anca", "Torção do estômago", "Problemas de ouvidos"],
    care: "Cão de guarda de rebanhos, não de apartamento. Precisa de terreno e trabalho. Pelo branco e espesso: escovar 2x/semana. Late para avisar, sobretudo à noite. Não obedece por obedecer — decide.",
    ideal: "Quintas, terrenos, guarda de animais",
    color: "#10B981", bg: "#ECFDF5",
  },
  {
    name: "Rottweiler", species: "dog", emoji: "🐕", size: "Grande",
    origin: "Alemanha", life: "8–11 anos", weight: "35–60 kg",
    personality: ["Confiante", "Leal", "Calmo", "Protector"],
    health: ["Displasia da anca e do cotovelo", "Problemas cardíacos", "Obesidade", "Cancro dos ossos"],
    care: "Precisa de educação firme e serena desde cachorro e de muita socialização. Exercício diário. Pelo curto, escovagem semanal. Em Portugal está na lista de raças potencialmente perigosas: exige licença, seguro, açaimo e trela na via pública.",
    ideal: "Donos experientes e presentes",
    color: "#1F2937", bg: "#F3F4F6",
  },
  {
    name: "Boxer", species: "dog", emoji: "🐕", size: "Médio a grande",
    origin: "Alemanha", life: "10–12 anos", weight: "25–32 kg",
    personality: ["Palhaço", "Energético", "Muito apegado", "Bom com crianças"],
    health: ["Problemas cardíacos", "Cancro", "Dificuldade a respirar no calor", "Displasia da anca"],
    care: "Cachorro até tarde: muita energia e brincadeira. Não aguenta calor nem frio extremos, dorme dentro de casa. Exercício diário obrigatório senão fica destrutivo.",
    ideal: "Famílias activas com crianças",
    color: "#FF6B35", bg: "#FFF0EB",
  },
  {
    name: "Husky Siberiano", species: "dog", emoji: "🐺", size: "Médio",
    origin: "Sibéria", life: "12–14 anos", weight: "16–27 kg",
    personality: ["Aventureiro", "Sociável", "Teimoso", "Falador (uiva)"],
    health: ["Problemas oculares", "Displasia da anca", "Problemas de pele no calor"],
    care: "Foge e escava — precisa de vedação alta e segura. Solta pelo em quantidade 2x/ano. Nunca tosquiar: o pelo protege do calor. Precisa de correr muito; não é cão de apartamento sem exercício.",
    ideal: "Donos desportivos, casas com quintal vedado",
    color: "#0EA5E9", bg: "#E0F2FE",
  },
  {
    name: "Dobermann", species: "dog", emoji: "🐕", size: "Grande",
    origin: "Alemanha", life: "10–12 anos", weight: "32–45 kg",
    personality: ["Atento", "Muito inteligente", "Leal", "Cheio de energia"],
    health: ["Doença cardíaca (cardiomiopatia)", "Problemas de coagulação", "Coluna cervical"],
    care: "Muito ligado à família, sofre se ficar isolado no quintal. Pelo curto sente frio: agasalho no inverno. Treino diário e desgaste mental. Também na lista portuguesa de raças potencialmente perigosas.",
    ideal: "Donos activos e experientes",
    color: "#1F2937", bg: "#F3F4F6",
  },
  {
    name: "Pug (Carlino)", species: "dog", emoji: "🐶", size: "Pequeno",
    origin: "China", life: "12–15 anos", weight: "6–9 kg",
    personality: ["Palhaço", "Carinhoso", "Comilão", "Muito de colo"],
    health: ["Dificuldade grave a respirar", "Olhos feridos", "Obesidade", "Pregas infectadas"],
    care: "Focinho muito achatado: nada de esforço no calor, usar peitoral em vez de coleira. Limpar as pregas da cara e da cauda. Vigiar o peso com rigor — engorda muito depressa.",
    ideal: "Apartamentos, vida tranquila, clima fresco",
    color: "#F59E0B", bg: "#FEF3C7",
  },
  {
    name: "Teckel (Dachshund / Salsicha)", species: "dog", emoji: "🌭", size: "Pequeno",
    origin: "Alemanha", life: "12–16 anos", weight: "4–9 kg",
    personality: ["Corajoso", "Teimoso", "Vigilante", "Caçador"],
    health: ["Hérnia discal (coluna)", "Obesidade", "Problemas dentários"],
    care: "A coluna é o ponto fraco: não deixar subir e descer escadas nem saltar de sofás e camas, e usar rampas. Manter magro. Peitoral em vez de coleira. Adora escavar.",
    ideal: "Apartamentos e casas sem muitas escadas",
    color: "#8B4513", bg: "#FDF6EC",
  },
  {
    name: "Pinscher Miniatura", species: "dog", emoji: "🐶", size: "Muito pequeno",
    origin: "Alemanha", life: "12–16 anos", weight: "3–6 kg",
    personality: ["Corajoso", "Muito activo", "Vigilante", "Late bastante"],
    health: ["Luxação da rótula", "Problemas dentários", "Fracturas por saltos"],
    care: "Pequeno mas cheio de energia: precisa de passeios a sério. Sente frio, agasalhar no inverno. Ensinar desde cedo a não latir a tudo. Pelo curto, escovagem semanal.",
    ideal: "Apartamentos, donos pacientes com o latido",
    color: "#1F2937", bg: "#F3F4F6",
  },
  {
    name: "Lulu da Pomerânia (Spitz Alemão)", species: "dog", emoji: "🐕", size: "Muito pequeno",
    origin: "Alemanha / Polónia", life: "12–16 anos", weight: "1,8–3,5 kg",
    personality: ["Extrovertido", "Vivo", "Vigilante", "Convencido"],
    health: ["Traqueia colapsada", "Queda de pelo hormonal", "Problemas dentários", "Luxação da rótula"],
    care: "Usar peitoral, nunca coleira que aperte a garganta. Escovar 3x/semana e nunca tosquiar à máquina rente. Vigiar os dentes. Sofre com o calor.",
    ideal: "Apartamentos, primeira experiência com cão pequeno",
    color: "#F59E0B", bg: "#FEF3C7",
  },
  {
    name: "São Bernardo", species: "dog", emoji: "🐕‍🦺", size: "Gigante",
    origin: "Suíça", life: "8–10 anos", weight: "60–90 kg",
    personality: ["Paciente", "Bonacheirão", "Protector", "Calmo"],
    health: ["Displasia da anca", "Torção do estômago", "Problemas de coração", "Golpe de calor"],
    care: "Baba muito — ter um pano à mão. Sofre muito com o calor, precisa de sombra e água sempre. Exercício moderado, nunca corridas longas quando jovem. Escovagem 3x/semana.",
    ideal: "Casas grandes com espaço e clima fresco",
    color: "#EF4444", bg: "#FEF2F2",
  },
  {
    name: "Jack Russell Terrier", species: "dog", emoji: "🐶", size: "Pequeno",
    origin: "Inglaterra", life: "13–16 anos", weight: "5–8 kg",
    personality: ["Incansável", "Esperto", "Destemido", "Escavador"],
    health: ["Luxação da rótula", "Surdez em alguns exemplares", "Problemas oculares"],
    care: "Energia enorme num corpo pequeno: sem exercício e jogos torna-se destruidor e latido constante. Persegue tudo o que se mexe — cuidado com gatos e ruas abertas.",
    ideal: "Donos activos, casas com quintal",
    color: "#10B981", bg: "#ECFDF5",
  },
  {
    name: "Bulldog Inglês", species: "dog", emoji: "🐶", size: "Médio",
    origin: "Inglaterra", life: "8–10 anos", weight: "18–25 kg",
    personality: ["Tranquilo", "Teimoso", "Afectuoso", "Preguiçoso"],
    health: ["Problemas respiratórios graves", "Pregas infectadas", "Displasia da anca", "Problemas de parto"],
    care: "Passeios curtos e só nas horas frescas. Limpar e secar as pregas da cara e da cauda a cada 2-3 dias. Não sabe nadar — cuidado com piscinas. Vigiar o peso.",
    ideal: "Apartamentos, vida calma, casa fresca",
    color: "#4ECDC4", bg: "#E8FAF9",
  },
  {
    name: "Basset Hound", species: "dog", emoji: "🐕", size: "Médio",
    origin: "França", life: "10–12 anos", weight: "20–29 kg",
    personality: ["Calmo", "Teimoso", "Amigável", "Guiado pelo olfacto"],
    health: ["Otites (orelhas compridas)", "Problemas de coluna", "Obesidade", "Olhos irritados"],
    care: "Limpar as orelhas por dentro toda a semana — abafam e infectam. Não deixar engordar, o peso esmaga a coluna. Quando fareja, deixa de ouvir: sempre com trela.",
    ideal: "Famílias calmas, casas sem muitas escadas",
    color: "#8B4513", bg: "#FDF6EC",
  },
  {
    name: "Akita Inu", species: "dog", emoji: "🐕", size: "Grande",
    origin: "Japão", life: "10–13 anos", weight: "32–50 kg",
    personality: ["Fiel", "Reservado", "Digno", "Dominante com outros cães"],
    health: ["Problemas de tiroide", "Doenças autoimunes de pele", "Displasia da anca"],
    care: "Muito leal a uma família, distante com estranhos. Costuma não tolerar outros cães — socialização desde cachorro. Solta muito pelo 2x/ano. Educação calma e firme, nunca à bruta.",
    ideal: "Donos experientes, cão único",
    color: "#FF6B35", bg: "#FFF0EB",
  },
  {
    name: "Shiba Inu", species: "dog", emoji: "🦊", size: "Pequeno a médio",
    origin: "Japão", life: "13–16 anos", weight: "8–11 kg",
    personality: ["Independente", "Limpo", "Alerta", "Teimoso"],
    health: ["Alergias de pele", "Luxação da rótula", "Problemas oculares"],
    care: "Parece um raposinho e comporta-se quase como um gato: muito limpo e independente. Foge se ficar solto — trela sempre. Solta bastante pelo. Não gosta de ser agarrado.",
    ideal: "Donos pacientes, apartamentos com passeios diários",
    color: "#F59E0B", bg: "#FEF3C7",
  },
  {
    name: "Samoiedo", species: "dog", emoji: "🐕‍🦺", size: "Médio a grande",
    origin: "Sibéria", life: "12–14 anos", weight: "16–30 kg",
    personality: ["Sorridente", "Sociável", "Brincalhão", "Falador"],
    health: ["Displasia da anca", "Problemas oculares", "Diabetes"],
    care: "Pelo branco duplo e enorme: escovar 3-4x/semana e todos os dias nas mudas. Nunca tosquiar. Sofre com o calor. Não suporta solidão.",
    ideal: "Famílias presentes, clima fresco",
    color: "#0EA5E9", bg: "#E0F2FE",
  },
  {
    name: "Cane Corso", species: "dog", emoji: "🐕", size: "Grande",
    origin: "Itália", life: "9–12 anos", weight: "40–50 kg",
    personality: ["Protector", "Sereno", "Muito ligado ao dono", "Dominante"],
    health: ["Displasia da anca", "Pálpebras viradas", "Torção do estômago"],
    care: "Precisa de mão calma e experiente e de socialização desde os primeiros meses. Exercício diário sem exageros enquanto cresce. Consta na lista portuguesa de raças potencialmente perigosas: licença, seguro, trela e açaimo.",
    ideal: "Donos experientes, casas com terreno",
    color: "#1F2937", bg: "#F3F4F6",
  },
  {
    name: "Mastim / Dogue de Bordéus", species: "dog", emoji: "🐕", size: "Gigante",
    origin: "França", life: "8–10 anos", weight: "45–65 kg",
    personality: ["Calmo", "Corajoso", "Afectuoso", "Preguiçoso em casa"],
    health: ["Problemas cardíacos", "Displasia da anca", "Golpe de calor", "Babar constante"],
    care: "Focinho curto: nada de esforço no calor. Limpar as pregas da cara. Passeios calmos e camas grossas. Cresce muito depressa — alimentação própria para raças gigantes.",
    ideal: "Casas espaçosas, vida tranquila",
    color: "#8B4513", bg: "#FDF6EC",
  },
  {
    name: "Galgo / Greyhound", species: "dog", emoji: "🐕", size: "Grande",
    origin: "Egipto / Inglaterra", life: "10–14 anos", weight: "25–40 kg",
    personality: ["Doce", "Sossegado", "Reservado", "Corredor"],
    health: ["Sensibilidade à anestesia", "Frio e feridas na pele fina", "Problemas dentários"],
    care: "Corre a 60 km/h mas em casa dorme quase todo o dia. Precisa de cama macia (tem pouca gordura) e casaco no inverno. Nunca soltar em zonas abertas: se arrancar, não pára. Muitos são galgos resgatados e dão excelentes companheiros.",
    ideal: "Apartamentos, vida calma, adopção de galgos resgatados",
    color: "#EC4899", bg: "#FDF2F8",
  },
  {
    name: "Schnauzer", species: "dog", emoji: "🐶", size: "Variável",
    origin: "Alemanha", life: "12–15 anos", weight: "5–45 kg",
    personality: ["Atento", "Corajoso", "Brincalhão", "Vigilante"],
    health: ["Pedras na bexiga", "Pancreatite", "Diabetes", "Problemas oculares"],
    care: "Barba e sobrancelhas exigem tosquia a cada 8 semanas e limpeza da barba depois de comer. Existe em três tamanhos (miniatura, médio e gigante). Dieta com pouca gordura ajuda a evitar pancreatite.",
    ideal: "Famílias, apartamentos (miniatura)",
    color: "#6B7280", bg: "#F3F4F6",
  },
  {
    name: "West Highland Terrier (Westie)", species: "dog", emoji: "🐶", size: "Pequeno",
    origin: "Escócia", life: "12–16 anos", weight: "6–10 kg",
    personality: ["Confiante", "Alegre", "Teimoso", "Curioso"],
    health: ["Alergias e comichão", "Problemas de pele", "Luxação da rótula"],
    care: "Pele muito sensível: banhos com champô suave e vigiar comichão e vermelhões. Escovar 2-3x/semana. Gosta de escavar e de perseguir bichos pequenos.",
    ideal: "Apartamentos, casais, idosos activos",
    color: "#8B5CF6", bg: "#F3EEFF",
  },
  {
    name: "Fox Terrier", species: "dog", emoji: "🐶", size: "Pequeno",
    origin: "Inglaterra", life: "12–15 anos", weight: "6–9 kg",
    personality: ["Vivo", "Destemido", "Muito activo", "Latido fácil"],
    health: ["Luxação da rótula", "Surdez", "Problemas oculares"],
    care: "Energia sem fim: exercício e jogos diários, senão escava e late. Persegue gatos e roedores. Escovagem semanal.",
    ideal: "Donos activos, casas com quintal",
    color: "#10B981", bg: "#ECFDF5",
  },
  {
    name: "Lhasa Apso", species: "dog", emoji: "🐶", size: "Pequeno",
    origin: "Tibete", life: "12–15 anos", weight: "5–8 kg",
    personality: ["Independente", "Vigilante", "Digno", "Desconfiado"],
    health: ["Olhos secos", "Problemas de rins", "Luxação da rótula"],
    care: "Pelo comprido até ao chão: escovar todos os dias ou manter curto. Prender ou cortar o pelo à frente dos olhos. Era cão de guarda de templos — avisa de tudo.",
    ideal: "Apartamentos, vida calma",
    color: "#F59E0B", bg: "#FEF3C7",
  },
  {
    name: "Pequinês", species: "dog", emoji: "🐶", size: "Muito pequeno",
    origin: "China", life: "12–15 anos", weight: "3–6 kg",
    personality: ["Orgulhoso", "Leal", "Teimoso", "Corajoso"],
    health: ["Dificuldade a respirar", "Olhos salientes e feridos", "Problemas de coluna", "Golpe de calor"],
    care: "Focinho achatado e olhos grandes: passeios curtos e frescos, limpar a cara e as pregas todos os dias. Não deixar saltar de móveis. Escovagem diária.",
    ideal: "Apartamentos, idosos, casa fresca",
    color: "#EF4444", bg: "#FEF2F2",
  },
  {
    name: "Papillon", species: "dog", emoji: "🐶", size: "Muito pequeno",
    origin: "França / Bélgica", life: "13–16 anos", weight: "2–5 kg",
    personality: ["Espertíssimo", "Alegre", "Activo", "Sociável"],
    health: ["Luxação da rótula", "Problemas dentários", "Fontanela aberta"],
    care: "Pequeno mas atleta e muito inteligente: adora aprender truques. Cuidado com quedas e com crianças pequenas que o peguem ao colo. Lavar os dentes com frequência.",
    ideal: "Apartamentos, donos que gostam de treinar",
    color: "#EC4899", bg: "#FDF2F8",
  },
  {
    name: "Weimaraner", species: "dog", emoji: "🐕", size: "Grande",
    origin: "Alemanha", life: "10–13 anos", weight: "25–40 kg",
    personality: ["Incansável", "Colante", "Inteligente", "Sensível"],
    health: ["Torção do estômago", "Displasia da anca", "Ansiedade de separação"],
    care: "Chamam-lhe o \"fantasma cinzento\": segue o dono para todo o lado e sofre muito sozinho. Precisa de corrida diária a sério. Refeições repartidas e descanso depois de comer.",
    ideal: "Donos desportivos e muito presentes",
    color: "#6B7280", bg: "#F3F4F6",
  },
  {
    name: "Setter Irlandês", species: "dog", emoji: "🐕", size: "Grande",
    origin: "Irlanda", life: "11–14 anos", weight: "24–32 kg",
    personality: ["Exuberante", "Amigável", "Brincalhão", "Distraído"],
    health: ["Displasia da anca", "Torção do estômago", "Otites", "Epilepsia"],
    care: "Pelo comprido acobreado: escovar 3x/semana e limpar as orelhas toda a semana. Amadurece tarde, fica cachorro durante anos. Exercício longo diário.",
    ideal: "Famílias activas com espaço",
    color: "#FF6B35", bg: "#FFF0EB",
  },
  {
    name: "Staffordshire Bull Terrier", species: "dog", emoji: "🐕", size: "Médio",
    origin: "Inglaterra", life: "12–14 anos", weight: "11–17 kg",
    personality: ["Muito afectuoso", "Corajoso", "Brincalhão", "Amigo das crianças"],
    health: ["Alergias de pele", "Cataratas juvenis", "Problemas articulares"],
    care: "Muito ligado às pessoas, mas pode não tolerar outros cães — socialização desde cachorro. Pelo curto, escovagem semanal. Em Portugal está na lista de raças potencialmente perigosas: licença, seguro, trela e açaimo na rua.",
    ideal: "Donos presentes e informados",
    color: "#4ECDC4", bg: "#E8FAF9",
  },
  {
    name: "Braco Alemão", species: "dog", emoji: "🐕", size: "Grande",
    origin: "Alemanha", life: "12–14 anos", weight: "20–32 kg",
    personality: ["Trabalhador", "Obediente", "Energético", "Sociável"],
    health: ["Displasia da anca", "Otites", "Torção do estômago"],
    care: "Cão de caça: precisa de exercício intenso e de trabalho mental, senão fica ansioso. Limpar as orelhas. Pelo curto, escovagem semanal.",
    ideal: "Caçadores, donos muito activos",
    color: "#8B4513", bg: "#FDF6EC",
  },
  {
    name: "Cão de Água Português", species: "dog", emoji: "🐩", size: "Médio",
    origin: "Portugal (Algarve)", life: "11–14 anos", weight: "16–27 kg",
    personality: ["Trabalhador", "Alegre", "Muito inteligente", "Colante"],
    health: ["Displasia da anca", "Problemas oculares hereditários", "Doença de armazenamento (GM1)"],
    care: "Raça portuguesa de pescadores, nada e mergulha. Pelo encaracolado que quase não cai: tosquia a cada 6-8 semanas e escovagem 3x/semana. Boa opção para alérgicos. Precisa de trabalho, senão inventa travessuras.",
    ideal: "Famílias activas, quem tem água por perto, alérgicos",
    color: "#0EA5E9", bg: "#E0F2FE",
  },
  {
    name: "Cão de Castro Laboreiro", species: "dog", emoji: "🐕‍🦺", size: "Grande",
    origin: "Portugal (Minho)", life: "12–14 anos", weight: "23–40 kg",
    personality: ["Guardião", "Desconfiado", "Muito leal", "Rústico"],
    health: ["Displasia da anca", "Poucas doenças hereditárias", "Otites"],
    care: "Raça portuguesa de guarda de gado, muito resistente. Liga-se a uma família e desconfia de estranhos. Precisa de espaço, trabalho e socialização cedo. Escovagem semanal.",
    ideal: "Quintas, terrenos, guarda",
    color: "#6B7280", bg: "#F3F4F6",
  },
  {
    name: "Rafeiro do Alentejo", species: "dog", emoji: "🐕‍🦺", size: "Gigante",
    origin: "Portugal (Alentejo)", life: "10–13 anos", weight: "35–60 kg",
    personality: ["Sereno", "Guardião nocturno", "Independente", "Protector"],
    health: ["Displasia da anca", "Torção do estômago", "Problemas articulares"],
    care: "Raça portuguesa de guarda de rebanhos e herdades. Trabalha sobretudo de noite e late a avisar. Não é cão de apartamento nem de obediência de circo — precisa de terreno. Escovagem semanal.",
    ideal: "Herdades, quintas, propriedades grandes",
    color: "#F59E0B", bg: "#FEF3C7",
  },
  {
    name: "Cão da Serra de Aires", species: "dog", emoji: "🐕", size: "Médio",
    origin: "Portugal (Alentejo)", life: "12–14 anos", weight: "17–27 kg",
    personality: ["Vivo", "Espertíssimo", "Brincalhão", "Muito apegado"],
    health: ["Displasia da anca", "Problemas oculares", "Alergias de pele"],
    care: "É o \"cão-macaco\" português, pastor de ovelhas cheio de energia e humor. Pelo comprido: escovar 3x/semana para não emaranhar. Precisa de actividade e companhia constantes.",
    ideal: "Famílias activas, quintas, desportos com cães",
    color: "#10B981", bg: "#ECFDF5",
  },
  {
    name: "Sagrado da Birmânia", species: "cat", emoji: "🐱", size: "Médio a grande",
    origin: "Birmânia / França", life: "13–16 anos", weight: "4–6 kg",
    personality: ["Doce", "Calmo", "Sociável", "Companheiro"],
    health: ["Problemas cardíacos", "Cálculos renais", "Bolas de pelo"],
    care: "Pelo semi-longo que emaranha pouco: escovar 2x/semana. Olhos azuis e luvas brancas típicas. Gato de interior, muito ligado às pessoas e pouco arisco.",
    ideal: "Famílias, apartamentos, casas com crianças",
    color: "#8B5CF6", bg: "#F3EEFF",
  },
  {
    name: "Norueguês da Floresta", species: "cat", emoji: "🐈", size: "Grande",
    origin: "Noruega", life: "14–16 anos", weight: "4–9 kg",
    personality: ["Independente", "Tranquilo", "Trepador", "Afectuoso sem ser colante"],
    health: ["Problemas cardíacos", "Displasia da anca", "Doença renal"],
    care: "Pelo duplo à prova de água: escovar 2-3x/semana e todos os dias na muda da primavera. Adora altura — prateleiras e árvore de gato. Cresce até aos 5 anos.",
    ideal: "Casas com espaço vertical, clima fresco",
    color: "#0EA5E9", bg: "#E0F2FE",
  },
  {
    name: "Angorá Turco", species: "cat", emoji: "🐈", size: "Médio",
    origin: "Turquia", life: "13–18 anos", weight: "3–5 kg",
    personality: ["Brincalhão", "Activo", "Curioso", "Falador"],
    health: ["Surdez em brancos de olhos azuis", "Problemas cardíacos", "Ataxia hereditária"],
    care: "Pelo comprido e fino, sem subpelo: escovar 2x/semana. Muito activo, abre portas e armários. Os brancos de olhos azuis podem ser surdos — nunca deixar andar na rua.",
    ideal: "Apartamentos com brinquedos, donos presentes",
    color: "#EC4899", bg: "#FDF2F8",
  },
  {
    name: "Abissínio", species: "cat", emoji: "🐈", size: "Médio",
    origin: "Etiópia / Egipto", life: "12–16 anos", weight: "3–5 kg",
    personality: ["Elétrico", "Curiosíssimo", "Sociável", "Inteligente"],
    health: ["Problemas de gengivas", "Doença renal (amiloidose)", "Atrofia da retina"],
    care: "Nunca pára: precisa de brinquedos, altura e companhia, senão aborrece-se e faz estragos. Pelo curto, escovagem semanal. Lavar os dentes com frequência.",
    ideal: "Casas movimentadas, quem quer um gato \"cão\"",
    color: "#FF6B35", bg: "#FFF0EB",
  },
  {
    name: "Scottish Fold (orelhas dobradas)", species: "cat", emoji: "🐱", size: "Médio",
    origin: "Escócia", life: "11–15 anos", weight: "3–6 kg",
    personality: ["Meigo", "Calmo", "Adaptável", "Companheiro"],
    health: ["Problemas de cartilagem e articulações (osteocondrodisplasia)", "Doença renal", "Problemas cardíacos"],
    care: "As orelhas dobradas vêm de uma alteração da cartilagem que também afecta as articulações: vigiar dores, dificuldade a saltar e rigidez, e ir ao veterinário ao primeiro sinal. Limpar as orelhas com cuidado. Escovagem semanal.",
    ideal: "Vida calma, apartamentos",
    color: "#4ECDC4", bg: "#E8FAF9",
  },
  {
    name: "Devon Rex", species: "cat", emoji: "🐈", size: "Pequeno",
    origin: "Inglaterra", life: "12–16 anos", weight: "2,5–4,5 kg",
    personality: ["Palhaço", "Colante", "Trepador", "Muito sociável"],
    health: ["Problemas cardíacos", "Fraqueza muscular hereditária", "Pele oleosa"],
    care: "Pelo curto e ondulado, quase sem cobertura: sente frio, precisa de casa quente e mantinha. Limpar a pele e as orelhas, que ficam oleosas. Vive em cima do dono.",
    ideal: "Casas quentes, donos muito presentes",
    color: "#F59E0B", bg: "#FEF3C7",
  },
  {
    name: "Azul da Rússia", species: "cat", emoji: "🐱", size: "Médio",
    origin: "Rússia", life: "15–20 anos", weight: "3–5,5 kg",
    personality: ["Reservado", "Leal a um dono", "Sossegado", "Rotineiro"],
    health: ["Muito saudável", "Obesidade", "Pedras na bexiga"],
    care: "Tímido com estranhos e muito ligado a uma pessoa. Odeia mudanças de rotina e barulho. Pelo curto e denso azul-acinzentado: escovar 1x/semana. Vigiar o peso.",
    ideal: "Casas calmas, pessoas que vivem sozinhas",
    color: "#6B7280", bg: "#F3F4F6",
  },
  {
    name: "Siberiano", species: "cat", emoji: "🐈", size: "Grande",
    origin: "Rússia", life: "12–18 anos", weight: "4,5–9 kg",
    personality: ["Robusto", "Brincalhão", "Afectuoso", "Corajoso"],
    health: ["Problemas cardíacos", "Doença renal"],
    care: "Pelo triplo à prova de neve: escovar 2-3x/semana. Costuma produzir menos da proteína que causa alergia — muitos alérgicos toleram-no melhor (mas não é garantido). Adora água.",
    ideal: "Famílias, alérgicos com prova prévia",
    color: "#0EA5E9", bg: "#E0F2FE",
  },
  {
    name: "Exótico (Persa de pelo curto)", species: "cat", emoji: "🐱", size: "Médio",
    origin: "EUA", life: "12–15 anos", weight: "3–6 kg",
    personality: ["Preguiçoso", "Doce", "Silencioso", "De colo"],
    health: ["Dificuldade a respirar", "Lágrimas e olhos feridos", "Doença renal policística"],
    care: "Cara achatada como o persa mas pelo curto: escovar 2x/semana. Limpar os olhos e a prega do nariz todos os dias. Nada de calor. Comedouro raso ajuda a comer.",
    ideal: "Apartamentos, vida tranquila",
    color: "#EC4899", bg: "#FDF2F8",
  },
  {
    name: "Munchkin (patas curtas)", species: "cat", emoji: "🐈", size: "Pequeno",
    origin: "EUA", life: "12–15 anos", weight: "2,5–4 kg",
    personality: ["Brincalhão", "Sociável", "Curioso", "Bem-humorado"],
    health: ["Problemas de coluna (lordose)", "Peito afundado", "Artrite"],
    care: "Patas muito curtas: não salta como os outros gatos, precisa de rampas e degraus para chegar aos sítios. Manter magro para proteger a coluna. Escovagem semanal.",
    ideal: "Casas sem grandes alturas",
    color: "#8B5CF6", bg: "#F3EEFF",
  },
  {
    name: "Coelho Rex", species: "rodent", emoji: "🐰", size: "Médio",
    origin: "França", life: "8–10 anos", weight: "2–2,5 kg",
    personality: ["Dócil", "Curioso", "Sociável", "Calmo"],
    health: ["Feridas nas patas (pododermatite)", "Dentes em crescimento", "Problemas digestivos"],
    care: "Pelo curtinho de veludo, mas as patas têm pouca protecção: nunca em chão de rede ou duro, usar palha e tapetes macios. Feno à discrição sempre. Unhas aparadas.",
    ideal: "Famílias, interior com espaço para saltar",
    color: "#10B981", bg: "#ECFDF5",
  },
  {
    name: "Degu", species: "rodent", emoji: "🐭", size: "Pequeno",
    origin: "Chile", life: "6–8 anos", weight: "170–300 g",
    personality: ["Muito sociável", "Diurno", "Activo", "Comunicativo"],
    health: ["Diabetes (muito sensível ao açúcar)", "Cataratas", "Dentes em crescimento"],
    care: "Nunca dar fruta nem nada doce — ficam diabéticos com facilidade. Vivem em grupo, sozinhos adoecem de tristeza. Gaiola alta com rodas e banho de areia. Nunca pegar pela cauda.",
    ideal: "Quem quer roedores acordados de dia, em par ou grupo",
    color: "#8B4513", bg: "#FDF6EC",
  },
  {
    name: "Píton-real", species: "reptile", emoji: "🐍", size: "Médio",
    origin: "África Ocidental", life: "20–30 anos", weight: "1,5–2,5 kg",
    personality: ["Calma", "Lenta", "Nocturna", "Tímida"],
    health: ["Infecções respiratórias", "Muda de pele incompleta", "Recusa de comida (normal no inverno)"],
    care: "Terrário com zona quente a 31-32 °C e fria a 25 °C, esconderijos e humidade 55-65%. Come roedores congelados e descongelados a cada 1-2 semanas. Compromisso de décadas.",
    ideal: "Donos calmos e informados, sem crianças pequenas a mexer",
    color: "#6B7280", bg: "#F3F4F6",
  },
  {
    name: "Axolote", species: "aquatic", emoji: "🦎", size: "Médio",
    origin: "México", life: "10–15 anos", weight: "60–200 g",
    personality: ["Curioso", "Sossegado", "Sempre \"a sorrir\"", "Solitário"],
    health: ["Stress com água quente", "Fungos e feridas nas guelras", "Ingestão de cascalho"],
    care: "Água fria entre 16 e 18 °C — nunca aquecer, e no verão pode ser preciso arrefecer. Fundo de areia fina ou nu, nunca cascalho (engolem). Sem companheiros que o mordam. Não se tira da água.",
    ideal: "Quem quer um aquário original e fresco",
    color: "#EC4899", bg: "#FDF2F8",
  },
  {
    name: "Peru", species: "farm", emoji: "🦃", size: "Grande",
    origin: "América do Norte", life: "8–10 anos", weight: "5–15 kg",
    personality: ["Curioso", "Sociável", "Vigilante", "Mais esperto do que parece"],
    health: ["Parasitas intestinais", "Doenças respiratórias", "Problemas de patas pelo peso"],
    care: "Precisa de espaço ao ar livre, abrigo seco e ração própria para perus (mais proteína que a das galinhas). Reconhece as pessoas e segue-as. Vigiar as patas nos exemplares muito pesados.",
    ideal: "Quintas e quintais grandes",
    color: "#F59E0B", bg: "#FEF3C7",
  },
  {
    name: "Ganso", species: "farm", emoji: "🦢", size: "Grande",
    origin: "Europa / Ásia", life: "15–25 anos", weight: "4–10 kg",
    personality: ["Guardião", "Fiel", "Barulhento", "Corajoso"],
    health: ["Problemas de patas", "Parasitas", "Asa virada por excesso de proteína"],
    care: "É o melhor alarme de uma quinta: grita a qualquer estranho. Precisa de erva, água para se lavar e abrigo à noite. Vive em par ou grupo — sozinho fica infeliz. Muito longevo.",
    ideal: "Quintas com água e espaço",
    color: "#0EA5E9", bg: "#E0F2FE",
  },
];

// Separadores: nome e ícone guardados à parte para o texto nunca sair cortado.
// (Roedores inclui os coelhos, como pedido.)
const FILTERS = [
  { label: "Todos", icon: "🐾", species: null },
  { label: "Cães", icon: "🐕", species: "dog" },
  { label: "Gatos", icon: "🐱", species: "cat" },
  { label: "Aves", icon: "🦜", species: "bird" },
  { label: "Roedores", icon: "🐹", species: "rodent" },
  { label: "Répteis", icon: "🦎", species: "reptile" },
  { label: "Aquáticos", icon: "🐠", species: "aquatic" },
  { label: "Quinta", icon: "🐔", species: "farm" },
] as const;

type BreedFilter = (typeof FILTERS)[number];

export default function BreedGuideScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<BreedFilter>(FILTERS[0]);
  const [selected, setSelected] = useState<typeof BREEDS[0] | null>(null);

  const filtered = BREEDS.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter.species === null || b.species === filter.species;
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
              <Text suppressHighlighting style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>{tr("Voltar")}</Text>
            </TouchableOpacity>
            <Text suppressHighlighting style={{ fontSize: 64, textAlign: "center" }}>{selected.emoji}</Text>
            <Text suppressHighlighting style={{ fontSize: 26, fontWeight: "900", color: "#fff", textAlign: "center", marginTop: 8 }}>{selected.name}</Text>
            <View style={{ flexDirection: "row", justifyContent: "center", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              <View style={{ backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 }}>
                <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>📏 {tr(selected.size)}</Text>
              </View>
              <View style={{ backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 }}>
                <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>⏳ {tr(selected.life)}</Text>
              </View>
              <View style={{ backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 }}>
                <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>⚖️ {tr(selected.weight)}</Text>
              </View>
              <View style={{ backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 }}>
                <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>🌍 {tr(selected.origin)}</Text>
              </View>
            </View>
          </View>

          <View style={{ padding: 20, gap: 16 }}>
            {/* Personalidade */}
            <View style={{ backgroundColor: CARD, borderRadius: 20, padding: 18 }}>
              <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "800", color: DARK, marginBottom: 12 }}>{tr("✨ Personalidade")}</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {selected.personality.map(p => (
                  <View key={p} style={{ backgroundColor: selected.bg, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1.5, borderColor: selected.color + "40" }}>
                    <Text suppressHighlighting style={{ color: selected.color, fontWeight: "700", fontSize: 13 }}>{tr(p)}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Cuidados */}
            <View style={{ backgroundColor: CARD, borderRadius: 20, padding: 18 }}>
              <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "800", color: DARK, marginBottom: 10 }}>{tr("🛁 Cuidados")}</Text>
              <Text suppressHighlighting style={{ color: "#4B5563", fontSize: 14, lineHeight: 22 }}>{tr(selected.care)}</Text>
            </View>

            {/* Saúde */}
            <View style={{ backgroundColor: CARD, borderRadius: 20, padding: 18 }}>
              <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "800", color: DARK, marginBottom: 12 }}>{tr("⚕️ Atenção à Saúde")}</Text>
              {selected.health.map(h => (
                <View key={h} style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#EF4444" }} />
                  <Text suppressHighlighting style={{ color: "#4B5563", fontSize: 14 }}>{tr(h)}</Text>
                </View>
              ))}
            </View>

            {/* Ideal para */}
            <View style={{ backgroundColor: selected.bg, borderRadius: 20, padding: 18, borderWidth: 1.5, borderColor: selected.color + "30" }}>
              <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "800", color: DARK, marginBottom: 8 }}>{tr("🏠 Ideal para")}</Text>
              <Text suppressHighlighting style={{ color: "#4B5563", fontSize: 14, lineHeight: 20 }}>{tr(selected.ideal)}</Text>
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
            <Text suppressHighlighting style={{ fontSize: 22, fontWeight: "900", color: "#fff" }}>{tr("Guia de Raças 📖")}</Text>
            <Text suppressHighlighting style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 2 }}>{BREEDS.length} {tr("raças disponíveis")}</Text>
          </View>
        </View>
        <View style={{ backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 14, flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 10, gap: 8 }}>
          <Search size={16} color="rgba(255,255,255,0.8)" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={tr("Pesquisar raça...")}
            placeholderTextColor="rgba(255,255,255,0.6)"
            style={{ flex: 1, color: "#fff", fontSize: 14 }}
          />
        </View>
      </View>

      {/* Filtros — separador com nome e ícone, sempre por inteiro */}
      <View style={{ height: 78 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0, flexShrink: 0 }}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 20, paddingVertical: 16, alignItems: "center" }}
        >
          {FILTERS.map(f => {
            const active = filter === f;
            return (
              <TouchableOpacity
                key={f.label}
                onPress={() => setFilter(f)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  minHeight: 44,
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 22,
                  backgroundColor: active ? PURPLE : CARD,
                  borderWidth: 1.5,
                  borderColor: active ? PURPLE : "#E5E7EB",
                }}
              >
                <Text suppressHighlighting style={{ fontSize: 15, lineHeight: 22 }}>{f.icon}</Text>
                <Text
                  suppressHighlighting
                  numberOfLines={1}
                  style={{
                    color: active ? "#fff" : DARK,
                    fontWeight: "700",
                    fontSize: 13,
                    lineHeight: 22,
                    includeFontPadding: false,
                    textAlignVertical: "center",
                  }}
                >
                  {tr(f.label)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: Math.max(insets.bottom, 20) + 60, gap: 12 }}>
        {filtered.map(b => (
          <TouchableOpacity key={b.name} onPress={() => setSelected(b)} activeOpacity={0.85}
            style={{ backgroundColor: CARD, borderRadius: 20, padding: 16, flexDirection: "row", alignItems: "center", gap: 14, borderWidth: 1.5, borderColor: b.color + "25" }}>
            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: b.bg, alignItems: "center", justifyContent: "center" }}>
              <Text suppressHighlighting style={{ fontSize: 32 }}>{b.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "800", color: DARK }}>{b.name}</Text>
              <Text suppressHighlighting style={{ color: GRAY, fontSize: 12, marginTop: 2 }}>{tr(b.size)} · {tr(b.life)}</Text>
              <View style={{ flexDirection: "row", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                {b.personality.slice(0, 2).map(p => (
                  <View key={p} style={{ backgroundColor: b.bg, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <Text suppressHighlighting style={{ color: b.color, fontSize: 11, fontWeight: "700" }}>{tr(p)}</Text>
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
            <Text suppressHighlighting style={{ color: DARK, fontWeight: "700", fontSize: 16, marginTop: 12 }}>{tr("Nenhuma raça encontrada")}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
