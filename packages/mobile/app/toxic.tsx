import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft, Phone, AlertTriangle } from "lucide-react-native";
import { tr } from "../lib/i18n";

const BG = "#FFF9F5";
const CARD = "#FFFFFF";
const BORDER = "#F0E8E0";
const DARK = "#1A1A2E";
const GRAY = "#6B7280";

type Nivel = "mortal" | "grave" | "cuidado";

interface Item {
  emoji: string;
  nome: string;
  nivel: Nivel;
  quem: string;
  porque: string;
  sinais: string;
  img?: any;
}

const NIVEIS: Record<Nivel, { label: string; cor: string; bg: string; borda: string }> = {
  mortal: { label: tr("PODE MATAR"), cor: "#DC2626", bg: "#FEF2F2", borda: "#FECACA" },
  grave: { label: tr("MUITO PERIGOSO"), cor: "#EA580C", bg: "#FFF7ED", borda: "#FED7AA" },
  cuidado: { label: tr("EVITAR"), cor: "#CA8A04", bg: "#FEFCE8", borda: "#FEF08A" },
};

const COMIDAS: Item[] = [
  { emoji: "🍫", nome: tr("Chocolate e cacau"), nivel: "mortal", quem: tr("Cães e gatos"), porque: tr("Tem teobromina, que o animal não consegue eliminar. O chocolate negro e o cacau em pó são os piores."), sinais: tr("Vómitos, agitação, tremores, coração acelerado, convulsões") },
  { emoji: "🍇", nome: tr("Uvas e passas"), nivel: "mortal", quem: tr("Cães"), porque: tr("Causam falência dos rins. Não se sabe a quantidade segura — pode ser um punhado num cão pequeno."), sinais: tr("Vómitos, não come, deixa de urinar") },
  { emoji: "🧅", nome: tr("Cebola, alho, alho-francês"), nivel: "grave", quem: tr("Cães e gatos"), porque: tr("Destroem os glóbulos vermelhos. Contam também cozinhados, em pó, no refogado e nos restos de comida."), sinais: tr("Fraqueza, gengivas pálidas, urina escura") },
  { emoji: "🍬", nome: tr("Xilitol (adoçante)"), nivel: "mortal", quem: tr("Cães"), porque: tr("Está em chicletes, pastilhas, rebuçados sem açúcar, alguns bolos e pastas de dentes. Faz o açúcar no sangue cair a pique em minutos."), sinais: tr("Fraqueza súbita, desmaio, convulsões") },
  { emoji: "🥑", nome: tr("Abacate"), nivel: "cuidado", quem: tr("Aves, coelhos, roedores"), porque: tr("A persina é muito tóxica para aves e pequenos animais. Nos cães o maior risco é o caroço entalar."), sinais: tr("Dificuldade a respirar, apatia") },
  { emoji: "☕", nome: tr("Café, chá e bebidas energéticas"), nivel: "grave", quem: tr("Cães e gatos"), porque: tr("A cafeína afecta o coração e o sistema nervoso."), sinais: tr("Agitação, tremores, coração acelerado") },
  { emoji: "🍺", nome: tr("Álcool e massa de pão crua"), nivel: "mortal", quem: tr("Todos"), porque: tr("A massa crua fermenta no estômago e produz álcool e gás — o estômago pode torcer."), sinais: tr("Barriga inchada, desorientação, coma") },
  { emoji: "🦴", nome: tr("Ossos cozinhados"), nivel: "grave", quem: tr("Cães e gatos"), porque: tr("Lascam-se e podem furar o intestino. Ossos crus grandes são menos perigosos, mas nunca cozinhados."), sinais: tr("Dor, vómitos, sangue nas fezes") },
  { emoji: "🥜", nome: tr("Nozes de macadâmia"), nivel: "grave", quem: tr("Cães"), porque: tr("Provocam fraqueza nas patas de trás e tremores."), sinais: tr("Não se aguenta em pé, febre, tremores") },
  { emoji: "🧂", nome: tr("Sal, salgados e enchidos"), nivel: "cuidado", quem: tr("Todos"), porque: tr("Excesso de sal provoca sede enorme e pode afectar o cérebro. Fiambre, presunto e chouriço são muito salgados e gordos."), sinais: tr("Muita sede, vómitos, tremores") },
  { emoji: "🥛", nome: tr("Leite de vaca"), nivel: "cuidado", quem: tr("Cães e gatos adultos"), porque: tr("A maioria não digere a lactose. Não mata, mas dá diarreia."), sinais: tr("Diarreia, gases, barriga inchada") },
  { emoji: "🍅", nome: tr("Tomate verde e batata crua"), nivel: "cuidado", quem: tr("Cães e gatos"), porque: tr("A parte verde tem solanina. Maduros e cozinhados não são problema."), sinais: tr("Vómitos, apatia") },
];

const PLANTAS: Item[] = [
  { emoji: "🌸", nome: tr("Lírio"), img: require("../assets/toxic/lirio.jpg"), nivel: "mortal", quem: tr("Gatos"), porque: tr("O mais perigoso de todos para gatos. Basta lamber o pólen ou a água da jarra para os rins falharem."), sinais: tr("Baba, não come, deixa de urinar — vet imediato") },
  { emoji: "🌺", nome: tr("Azálea e rododendro"), img: require("../assets/toxic/azalea.jpg"), nivel: "mortal", quem: tr("Todos"), porque: tr("Afectam o coração. Muito comuns em jardins portugueses."), sinais: tr("Baba, vómitos, batimento irregular") },
  { emoji: "🎄", nome: tr("Poinsétia (flor-de-natal)"), img: require("../assets/toxic/poinsetia.jpg"), nivel: "cuidado", quem: tr("Cães e gatos"), porque: tr("O leite da planta irrita a boca e o estômago. Raramente é grave, mas incomoda muito."), sinais: tr("Baba, boca vermelha, vómitos") },
  { emoji: "🌿", nome: tr("Dieffenbachia e filodendro"), img: require("../assets/toxic/dieffenbachia.jpg"), nivel: "grave", quem: tr("Cães e gatos"), porque: tr("Plantas de interior muito comuns. Queimam a boca e a garganta e podem fechar as vias respiratórias."), sinais: tr("Baba, patas na boca, dificuldade a engolir") },
  { emoji: "🌷", nome: tr("Bulbos de túlipa e narciso"), img: require("../assets/toxic/tulipa.jpg"), nivel: "grave", quem: tr("Cães"), porque: tr("O bulbo é a parte mais tóxica — e é o que os cães desenterram."), sinais: tr("Vómitos, diarreia, tremores") },
  { emoji: "🍀", nome: tr("Trevo-azedo e sempre-noiva"), img: require("../assets/toxic/oxalis.jpg"), nivel: "cuidado", quem: tr("Todos"), porque: tr("Ricos em oxalatos, afectam os rins se comer muito."), sinais: tr("Baba, vómitos") },
  { emoji: "🌵", nome: tr("Aloé vera"), img: require("../assets/toxic/aloe.jpg"), nivel: "cuidado", quem: tr("Cães e gatos"), porque: tr("Serve para nós, não para eles: a parte amarela por baixo da casca é purgante."), sinais: tr("Diarreia, vómitos, urina avermelhada") },
  { emoji: "🌰", nome: tr("Loendro (aloendro)"), img: require("../assets/toxic/loendro.jpg"), nivel: "mortal", quem: tr("Todos"), porque: tr("Uma das plantas mais venenosas que existem — está nas bermas das estradas por todo o país. Uma folha basta."), sinais: tr("Vómitos, coração lento, morte súbita") },
  { emoji: "🍃", nome: tr("Hera e cica (palmeira-sagu)"), img: require("../assets/toxic/cica.jpg"), nivel: "mortal", quem: tr("Cães"), porque: tr("A cica destrói o fígado; a semente é a pior parte."), sinais: tr("Vómitos com sangue, icterícia, apatia") },
];

const OUTROS: Item[] = [
  { emoji: "☠️", nome: tr("Veneno para ratos e caracóis"), nivel: "mortal", quem: tr("Todos"), porque: tr("Uma das intoxicações mais frequentes. O animal pode comer o veneno ou o rato envenenado."), sinais: tr("Hemorragias, sangue no nariz, fraqueza, convulsões") },
  { emoji: "🧴", nome: tr("Anticongelante do carro"), nivel: "mortal", quem: tr("Todos"), porque: tr("Sabe a doce e eles bebem das poças na garagem. Destrói os rins em horas."), sinais: tr("Parece embriagado, vomita, deixa de urinar") },
  { emoji: "💊", nome: tr("Paracetamol, ibuprofeno, aspirina"), nivel: "mortal", quem: tr("Cães e gatos"), porque: tr("NUNCA dar medicamentos humanos. Meio comprimido de paracetamol mata um gato."), sinais: tr("Baba, cara inchada, gengivas acinzentadas") },
  { emoji: "🚬", nome: tr("Tabaco, nicotina e cinzeiros"), nivel: "grave", quem: tr("Todos"), porque: tr("Beatas, tabaco de enrolar e líquidos de cigarros electrónicos são muito concentrados."), sinais: tr("Vómitos, agitação, tremores") },
  { emoji: "🧼", nome: tr("Lixívia e detergentes"), nivel: "grave", quem: tr("Todos"), porque: tr("Queimam a boca e o esófago. Não faça vomitar — piora a queimadura."), sinais: tr("Baba, boca queimada, tosse") },
  { emoji: "🌿", nome: tr("Óleos essenciais e difusores"), nivel: "grave", quem: tr("Gatos e aves"), porque: tr("Tea tree, eucalipto, canela e citrinos são tóxicos, mesmo só no ar. As aves são as mais sensíveis."), sinais: tr("Baba, dificuldade a respirar, tropeça") },
];

const SECS: { titulo: string; itens: Item[] }[] = [
  { titulo: tr("🍽️ Comidas"), itens: COMIDAS },
  { titulo: tr("🪴 Plantas"), itens: PLANTAS },
  { titulo: tr("🧪 Produtos de casa"), itens: OUTROS },
];

function Cartao({ it }: { it: Item }) {
  const [aberto, setAberto] = useState(false);
  const n = NIVEIS[it.nivel];
  return (
    <TouchableOpacity onPress={() => setAberto((a) => !a)} activeOpacity={0.8}
      style={{ backgroundColor: CARD, borderRadius: 18, padding: 14, borderWidth: 1.5, borderColor: aberto ? n.borda : BORDER, marginBottom: 10 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        {it.img ? (
          <Image source={it.img} style={{ width: 54, height: 54, borderRadius: 12 }} resizeMode="cover" />
        ) : (
          <Text suppressHighlighting style={{ fontSize: 30 }}>{it.emoji}</Text>
        )}
        <View style={{ flex: 1 }}>
          <Text suppressHighlighting style={{ fontWeight: "800", color: DARK, fontSize: 15 }}>{it.nome}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
            <View style={{ backgroundColor: n.bg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: n.borda }}>
              <Text suppressHighlighting style={{ color: n.cor, fontSize: 10, fontWeight: "800" }}>{n.label}</Text>
            </View>
            <Text suppressHighlighting style={{ color: GRAY, fontSize: 11 }}>{it.quem}</Text>
          </View>
        </View>
        <Text suppressHighlighting style={{ color: GRAY, fontSize: 18 }}>{aberto ? "−" : "+"}</Text>
      </View>
      {aberto && (
        <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: BORDER }}>
          {it.img && (
            <Image source={it.img} style={{ width: "100%", height: 170, borderRadius: 14, marginBottom: 12 }} resizeMode="cover" />
          )}
          <Text suppressHighlighting style={{ color: DARK, fontSize: 13, lineHeight: 20 }}>{it.porque}</Text>
          <Text suppressHighlighting style={{ color: n.cor, fontSize: 12, fontWeight: "700", marginTop: 10 }}>{tr("Sinais de alerta")}</Text>
          <Text suppressHighlighting style={{ color: DARK, fontSize: 13, lineHeight: 20, marginTop: 2 }}>{it.sinais}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function ToxicScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top", "left", "right"]}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 20, paddingBottom: 12 }}>
        <TouchableOpacity onPress={() => router.back()}
          style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: CARD, borderWidth: 1.5, borderColor: BORDER, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
          <ChevronLeft size={20} color={DARK} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text suppressHighlighting style={{ fontSize: 20, fontWeight: "800", color: DARK }}>{tr("Venenos em Casa")}</Text>
          <Text suppressHighlighting style={{ fontSize: 12, color: GRAY }}>{tr("Comidas, plantas e produtos perigosos")}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingTop: 4, paddingBottom: 50 }}>
        {/* Emergencia */}
        <View style={{ backgroundColor: "#FEF2F2", borderRadius: 20, padding: 18, borderWidth: 1.5, borderColor: "#FECACA", marginBottom: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <AlertTriangle size={20} color="#DC2626" />
            <Text suppressHighlighting style={{ fontSize: 15, fontWeight: "800", color: "#DC2626" }}>{tr("Se ele já comeu")}</Text>
          </View>
          <Text suppressHighlighting style={{ color: DARK, fontSize: 13, lineHeight: 20 }}>
            {tr("Vá ao veterinário imediatamente, mesmo que pareça bem — muitos venenos só dão sinais horas depois. Leve a embalagem ou um pedaço da planta. NÃO o faça vomitar sem o vet dizer: com produtos corrosivos, vomitar queima outra vez a garganta.")}
          </Text>
          <TouchableOpacity onPress={() => router.push("/find-vets" as any)}
            style={{ backgroundColor: "#DC2626", borderRadius: 14, padding: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 14 }}>
            <Phone size={18} color="#fff" />
            <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>{tr("Encontrar vet 24h perto de mim")}</Text>
          </TouchableOpacity>
        </View>

        {SECS.map((s) => (
          <View key={s.titulo} style={{ marginBottom: 14 }}>
            <Text suppressHighlighting style={{ fontSize: 17, fontWeight: "800", color: DARK, marginBottom: 10 }}>{s.titulo}</Text>
            {s.itens.map((it) => <Cartao key={it.nome} it={it} />)}
          </View>
        ))}

        <View style={{ backgroundColor: "#E8FAF9", borderRadius: 20, padding: 18, marginTop: 6 }}>
          <Text suppressHighlighting style={{ fontSize: 14, fontWeight: "700", color: DARK, marginBottom: 8 }}>{tr("💡 Prevenir é mais fácil")}</Text>
          {[
            tr("Lixo fechado e fora do alcance — é a origem de metade dos casos"),
            tr("Medicamentos em armários fechados, nunca na mesa de apoio"),
            tr("Antes de comprar uma planta, veja se é segura para animais"),
            tr("Nas festas, avise as visitas para não darem restos de comida"),
          ].map((t, i) => (
            <View key={i} style={{ flexDirection: "row", gap: 8, marginTop: i > 0 ? 6 : 0 }}>
              <Text suppressHighlighting style={{ color: "#4ECDC4", fontWeight: "700" }}>•</Text>
              <Text suppressHighlighting style={{ color: DARK, fontSize: 13, lineHeight: 20, flex: 1 }}>{t}</Text>
            </View>
          ))}
        </View>

        <Text suppressHighlighting style={{ color: GRAY, fontSize: 11, lineHeight: 17, marginTop: 16, textAlign: "center" }}>
          {tr("Informação baseada em fontes veterinárias reconhecidas. Em caso de dúvida, fale sempre com o seu veterinário.")}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
