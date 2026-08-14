import { View, Text, ScrollView, TouchableOpacity, Linking, Modal } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ChevronLeft, Play, ChevronRight, BookOpen } from "lucide-react-native";

const BG = "#F0FFF4";
const DARK = "#1A1A2E";
const GRAY = "#9CA3AF";
const GREEN = "#06D6A0";
const GREEN_DARK = "#059669";
const CARD = "#FFFFFF";

const GUIDES = [
  {
    category: "🐕 Treino Básico", color: "#FF6B35", bg: "#FFF0EB",
    guides: [
      {
        title: "Sentar e Ficar", emoji: "🐾", difficulty: "Iniciante",
        steps: [
          "Segure um petisco perto do focinho do cão",
          "Mova lentamente para trás enquanto diz 'Senta'",
          "Quando ele sentar, dê o petisco imediatamente",
          "Repita 5-10x por sessão, sessões curtas de 5 min",
          "Gradualmente aumente o tempo antes de dar o prémio",
        ],
        tip: "Consistência é chave! Use sempre a mesma palavra. Positivo sempre — nunca puna.",
        videoTitle: "Treino de Sentar — Tutorial",
        videoUrl: "https://www.youtube.com/watch?v=-yfxy1BFnsM",
      },
      {
        title: "Vem cá", emoji: "📣", difficulty: "Iniciante",
        steps: [
          "Comece em espaço fechado e pequeno",
          "Chame o nome do cão + 'Vem'",
          "Quando chegar, elogie muito e dê petisco",
          "Nunca chame para fazer algo desagradável",
          "Aumente gradualmente a distância",
        ],
        tip: "Nunca puna quando o cão chegar — mesmo que demore. Isso desmotiva para o futuro.",
        videoTitle: "Ensinar 'Vem cá' com sucesso",
        videoUrl: "https://www.youtube.com/watch?v=sZO8leEixKk",
      },
      {
        title: "Deitar", emoji: "🛏️", difficulty: "Iniciante",
        steps: [
          "Com o cão sentado, segure petisco no chão à frente dele",
          "Mova lentamente para baixo dizendo 'Deita'",
          "Quando o cotovelo tocar no chão: prémio!",
          "Se não funcionar, tente debaixo da sua perna como barreira",
          "Praticar 5-10 repetições em sessões curtas",
        ],
        tip: "Pode levar dias ou semanas — sem pressão. Sempre positivo!",
        videoTitle: "Como ensinar o cão a deitar",
        videoUrl: "https://www.youtube.com/watch?v=IBibDxVfYgg",
      },
      {
        title: "Não puxar na trela", emoji: "🦮", difficulty: "Intermédio",
        steps: [
          "Quando o cão puxar, PARE completamente",
          "Espere que a trela fique solta",
          "Quando largar a tensão, continue a andar",
          "Mude de direcção se ele continuar a puxar",
          "Elogie e prémio quando andar ao lado",
        ],
        tip: "Requer muita paciência nas primeiras semanas. Resultado: passeios agradáveis para sempre.",
        videoTitle: "Passeio sem puxar na trela",
        videoUrl: "https://www.youtube.com/watch?v=8VXZyrgjZ4U",
      },
    ],
  },
  {
    category: "🧠 Comportamento", color: "#8B5CF6", bg: "#F3EEFF",
    guides: [
      {
        title: "Ansiedade de Separação", emoji: "😰", difficulty: "Avançado",
        steps: [
          "Comece com ausências muito curtas (30 segundos)",
          "Não faça cerimónia ao sair/chegar",
          "Deixe música calma ou TV ligada",
          "Crie uma zona segura e confortável",
          "Aumente gradualmente o tempo de ausência",
        ],
        tip: "Em casos graves, consulte um comportamentalista animal. Nunca puna o animal por destruição por ansiedade.",
        videoTitle: "Tratar ansiedade de separação",
        videoUrl: "https://www.youtube.com/watch?v=QXEiu-3SHaU",
      },
      {
        title: "Latido Excessivo", emoji: "🔊", difficulty: "Intermédio",
        steps: [
          "Identifique o gatilho do latido",
          "Não grite — isso parece que está a latir também",
          "Ensine o comando 'Silêncio' com petisco",
          "Exercício físico suficiente reduz latido por excesso de energia",
          "Para alertas: agradeça e redirecione",
        ],
        tip: "Latir é comunicação natural. O objectivo é controlar, não eliminar completamente.",
        videoTitle: "Como travar o latido excessivo",
        videoUrl: "https://www.youtube.com/watch?v=3XRMsv9-XhE",
      },
      {
        title: "Morder e Morder a Brincar", emoji: "🦷", difficulty: "Iniciante",
        steps: [
          "Quando morder em jogo, diga 'Ai!' alto e pare de brincar",
          "Ignore por 30 segundos, depois retome",
          "Substitua sempre pela bola ou brinquedo",
          "Não use as mãos para brincar",
          "Consistência de toda a família é essencial",
        ],
        tip: "Cachorros precisam de aprender controlo da mordida. É normal até aos 6 meses.",
        videoTitle: "Controlo de mordida em cachorros",
        videoUrl: "https://www.youtube.com/watch?v=2eJ_DZFPCZw",
      },
    ],
  },
  {
    category: "🐈 Gatos", color: "#4ECDC4", bg: "#E8FAF9",
    guides: [
      {
        title: "Usar a Caixa de Areia", emoji: "🪣", difficulty: "Iniciante",
        steps: [
          "Coloque o gatinho na caixa após refeições e sonos",
          "Posição calma e localização privada",
          "Nunca puna por acidentes — limpe sem drama",
          "Uma caixa por gato + uma extra",
          "Limpar diariamente aumenta a adesão",
        ],
        tip: "Problemas com caixa de areia podem indicar doença. Consulte veterinário se persistir.",
        videoTitle: "Habituar gato à caixa de areia",
        videoUrl: "https://www.youtube.com/watch?v=Qfajxd4c7Cw",
      },
      {
        title: "Arranhar em Locais Certos", emoji: "🐾", difficulty: "Iniciante",
        steps: [
          "Disponibilize arranhadores em locais estratégicos",
          "Coloque arranhador perto do sofá ou local onde arranha",
          "Use spray de catnip no arranhador para atrair",
          "Quando usar o arranhador certo, elogie",
          "Tape temporariamente as zonas indesejadas com fita dupla-face",
        ],
        tip: "Arranhar é necessidade natural — não tente eliminar, apenas redirecionar.",
        videoTitle: "Treino de arranhadores para gatos",
        videoUrl: "https://www.youtube.com/watch?v=QR4tYsJXuOA",
      },
    ],
  },
  {
    category: "🦜 Aves", color: "#F59E0B", bg: "#FFF8E7",
    guides: [
      {
        title: "Subir ao Dedo", emoji: "🖐️", difficulty: "Iniciante",
        steps: [
          "Deixe a ave habituar-se à sua presença durante alguns dias",
          "Fale com voz suave junto à gaiola, sem movimentos bruscos",
          "Aproxime o dedo lentamente da barriguinha dela",
          "Faça uma leve pressão — o instinto dela é subir",
          "Recompense com um petisco (milho, painço) e repita diariamente",
        ],
        tip: "Nunca agarre a ave à força. Sessões curtas de 5 minutos, todos os dias, dão melhor resultado que uma sessão longa.",
        videoTitle: "Ensinar periquito a subir no dedo",
        videoUrl: "https://www.youtube.com/watch?v=sesqJZuS2hU",
      },
      {
        title: "Voar até Você", emoji: "🕊️", difficulty: "Intermédio",
        steps: [
          "Só depois de a ave já subir ao dedo com confiança",
          "Comece a uma distância muito curta, com petisco na mão",
          "Chame-a sempre com a mesma palavra ou assobio",
          "Aumente a distância aos poucos, sessão a sessão",
          "Faça sempre num espaço fechado, com janelas e portas fechadas",
        ],
        tip: "Serve para qualquer ave: periquito, calopsita, agapornis, canário ou papagaio.",
        videoTitle: "Ensinar o pássaro a voar até você",
        videoUrl: "https://www.youtube.com/watch?v=QFprzs2vS4U",
      },
      {
        title: "Amansar Ave Arisca", emoji: "🪶", difficulty: "Intermédio",
        steps: [
          "Coloque a gaiola num local com movimento de pessoas",
          "Passe tempo perto sem tentar tocar — só presença",
          "Ofereça petisco através das grades da gaiola",
          "Quando ela aceitar, ofereça com a mão dentro da gaiola",
          "Só depois tente o contacto direto",
        ],
        tip: "Uma ave assustada não é uma ave má. Pode levar semanas — a pressa estraga o progresso.",
        videoTitle: "Como amansar o seu periquito",
        videoUrl: "https://www.youtube.com/watch?v=uf4ueHytyEs",
      },
    ],
  },
  {
    category: "🐰 Coelhos", color: "#EC4899", bg: "#FDF2F8",
    guides: [
      {
        title: "Usar o Banheirinho", emoji: "🪣", difficulty: "Iniciante",
        steps: [
          "Escolha o canto onde ele já costuma fazer as necessidades",
          "Coloque lá a caixa com feno numa ponta",
          "Ponha os cocós dele dentro da caixa para marcar o cheiro",
          "Limpe muito bem os sítios errados para não deixar odor",
          "Nunca castigue — recompense quando acertar",
        ],
        tip: "Coelhos esterilizados aprendem muito mais rápido e marcam menos território.",
        videoTitle: "Ensinar o coelho a usar o banheirinho",
        videoUrl: "https://www.youtube.com/watch?v=SGcUQa7LCD8",
      },
      {
        title: "Higiene: Cortar as Unhas", emoji: "✂️", difficulty: "Intermédio",
        steps: [
          "Escolha um local calmo e bem iluminado",
          "Envolva o coelho suavemente numa toalha (deixando a pata de fora)",
          "Identifique a parte rosada (veia) — nunca corte aí",
          "Corte só a ponta branca, uma unha de cada vez",
          "Se ele se agitar, pare e continue mais tarde",
        ],
        tip: "As unhas dos coelhos crescem sempre. Se estiverem muito compridas, o coelho pode magoar-se nas patas.",
        videoTitle: "Como cortar as unhas do coelho",
        videoUrl: "https://www.youtube.com/watch?v=AoztTU0Fnbo",
      },
      {
        title: "Escovar e Ganhar Confiança", emoji: "🪮", difficulty: "Iniciante",
        steps: [
          "Deixe-o cheirar a escova antes de a usar",
          "Comece por passar a mão nas costas, sem escova",
          "Escove no sentido do pelo, com movimentos leves",
          "Aumente o tempo gradualmente em cada sessão",
          "Termine sempre com um petisco",
        ],
        tip: "Escovar é essencial nas mudas de pelo — o coelho não vomita bolas de pelo como o gato e pode ficar com obstrução.",
        videoTitle: "Escovar o coelho e cortar unhas",
        videoUrl: "https://www.youtube.com/watch?v=V2HpifC8G-8",
      },
    ],
  },
  {
    category: "🐹 Hamsters e Roedores", color: "#A16207", bg: "#FEF8E7",
    guides: [
      {
        title: "Amansar o Hamster", emoji: "🤲", difficulty: "Iniciante",
        steps: [
          "Nos primeiros dias, deixe-o adaptar-se sem lhe tocar",
          "Fale baixinho perto da gaiola para ele conhecer a sua voz",
          "Ofereça um petisco na palma da mão aberta, dentro da gaiola",
          "Espere que ele venha — nunca o vá buscar",
          "Só quando subir sozinho é que o pode levantar",
        ],
        tip: "Hamsters são noturnos. Nunca o acorde para brincar — um hamster acordado à força morde.",
        videoTitle: "Como amansar o seu hamster",
        videoUrl: "https://www.youtube.com/watch?v=-3o6Ak0108g",
      },
      {
        title: "Subir à Mão", emoji: "✋", difficulty: "Iniciante",
        steps: [
          "Lave as mãos — cheiro a comida faz com que ele morda",
          "Ponha a mão dentro da gaiola, quieta, durante 2 minutos",
          "Coloque uma semente na palma da mão",
          "Quando ele subir, não feche a mão nem o aperte",
          "Levante-o sempre com as duas mãos em taça, junto ao chão",
        ],
        tip: "Se ele morder, não tire a mão de repente — pode fazê-lo cair. Sopre suavemente.",
        videoTitle: "Ensinar o hamster a subir na mão",
        videoUrl: "https://www.youtube.com/watch?v=INCP0oGFgSc",
      },
    ],
  },
];

export default function TrainingGuideScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<any>(null);
  const [catColor, setCatColor] = useState("#FF6B35");
  const [catBg, setCatBg] = useState("#FFF0EB");

  if (selected) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: catBg }} edges={["top"]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={{ backgroundColor: catColor, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
            <TouchableOpacity onPress={() => setSelected(null)} style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 14 }}>
              <ChevronLeft size={20} color="#fff" />
              <Text suppressHighlighting style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>Voltar</Text>
            </TouchableOpacity>
            <Text suppressHighlighting style={{ fontSize: 52, textAlign: "center" }}>{selected.emoji}</Text>
            <Text suppressHighlighting style={{ fontSize: 22, fontWeight: "900", color: "#fff", textAlign: "center", marginTop: 8 }}>{selected.title}</Text>
            <View style={{ backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, alignSelf: "center", marginTop: 10 }}>
              <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>📊 {selected.difficulty}</Text>
            </View>
          </View>

          <View style={{ padding: 20, gap: 16 }}>
            <View style={{ backgroundColor: CARD, borderRadius: 20, padding: 18 }}>
              <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "800", color: DARK, marginBottom: 14 }}>📋 Passos</Text>
              {selected.steps.map((s: string, i: number) => (
                <View key={i} style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
                  <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: catColor, alignItems: "center", justifyContent: "center" }}>
                    <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 12 }}>{i + 1}</Text>
                  </View>
                  <Text suppressHighlighting style={{ flex: 1, color: "#374151", fontSize: 14, lineHeight: 22 }}>{s}</Text>
                </View>
              ))}
            </View>

            <View style={{ backgroundColor: "#FFFBEB", borderRadius: 20, padding: 18, borderWidth: 1.5, borderColor: "#FDE68A" }}>
              <Text suppressHighlighting style={{ fontSize: 15, fontWeight: "800", color: "#92400E", marginBottom: 8 }}>💡 Dica Importante</Text>
              <Text suppressHighlighting style={{ color: "#78350F", fontSize: 14, lineHeight: 22 }}>{selected.tip}</Text>
            </View>

            <TouchableOpacity onPress={() => Linking.openURL(selected.videoUrl)}
              style={{ backgroundColor: "#FF0000", borderRadius: 18, padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <Play size={20} color="#fff" fill="#fff" />
              <View>
                <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 14 }}>Ver vídeo no YouTube</Text>
                <Text suppressHighlighting style={{ color: "rgba(255,255,255,0.75)", fontSize: 11 }}>{selected.videoTitle}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top", "left", "right"]}>
      <View style={{ backgroundColor: GREEN_DARK, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}>
            <ChevronLeft size={18} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text suppressHighlighting style={{ fontSize: 22, fontWeight: "900", color: "#fff" }}>Treino & Comportamento 🎯</Text>
            <Text suppressHighlighting style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 2 }}>Guias com vídeo incluído</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: Math.max(insets.bottom, 20) + 60 }}>
        {GUIDES.map(cat => (
          <View key={cat.category} style={{ marginBottom: 24 }}>
            <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "800", color: cat.color, marginBottom: 12 }}>{cat.category}</Text>
            {cat.guides.map(g => (
              <TouchableOpacity key={g.title} onPress={() => { setSelected(g); setCatColor(cat.color); setCatBg(cat.bg); }} activeOpacity={0.85}
                style={{ backgroundColor: CARD, borderRadius: 18, padding: 16, marginBottom: 10, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1.5, borderColor: cat.color + "25" }}>
                <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: cat.bg, alignItems: "center", justifyContent: "center" }}>
                  <Text suppressHighlighting style={{ fontSize: 28 }}>{g.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text suppressHighlighting style={{ fontWeight: "800", color: DARK, fontSize: 15 }}>{g.title}</Text>
                  <View style={{ flexDirection: "row", gap: 8, marginTop: 5 }}>
                    <View style={{ backgroundColor: cat.bg, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 }}>
                      <Text suppressHighlighting style={{ color: cat.color, fontSize: 11, fontWeight: "700" }}>📊 {g.difficulty}</Text>
                    </View>
                    <View style={{ backgroundColor: "#FEF2F2", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 }}>
                      <Text suppressHighlighting style={{ color: "#DC2626", fontSize: 11, fontWeight: "700" }}>▶ Vídeo</Text>
                    </View>
                  </View>
                </View>
                <ChevronRight size={18} color={GRAY} />
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
