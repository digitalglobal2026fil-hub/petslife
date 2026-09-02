import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft, Calculator } from "lucide-react-native";
import { tr } from "../lib/i18n";

type Especie = "cao" | "gato";

interface Fase {
  key: string;
  label: string;
  fator: number;
  nota: string;
}

const FASES_CAO: Fase[] = [
  { key: "cachorro1", label: tr("Cachorro até 4 meses"), fator: 3.0, nota: tr("Em crescimento rápido") },
  { key: "cachorro2", label: tr("Cachorro 4 a 12 meses"), fator: 2.0, nota: tr("A acabar de crescer") },
  { key: "adulto_est", label: tr("Adulto castrado"), fator: 1.6, nota: tr("O mais comum") },
  { key: "adulto", label: tr("Adulto não castrado"), fator: 1.8, nota: tr("Gasta um pouco mais") },
  { key: "ativo", label: tr("Adulto muito ativo"), fator: 2.5, nota: tr("Corridas, trabalho, caça") },
  { key: "senior", label: tr("Sénior / pouco ativo"), fator: 1.4, nota: tr("Mais de 8 anos ou sedentário") },
  { key: "dieta", label: tr("A perder peso"), fator: 1.0, nota: tr("Dieta — confirme com o vet") },
];

const FASES_GATO: Fase[] = [
  { key: "gatinho", label: tr("Gatinho até 12 meses"), fator: 2.5, nota: tr("Em crescimento") },
  { key: "adulto_est", label: tr("Adulto castrado"), fator: 1.2, nota: tr("O mais comum") },
  { key: "adulto", label: tr("Adulto não castrado"), fator: 1.4, nota: tr("Gasta um pouco mais") },
  { key: "interior", label: tr("Vive só dentro de casa"), fator: 1.0, nota: tr("Pouco movimento") },
  { key: "exterior", label: tr("Sai à rua todos os dias"), fator: 1.6, nota: tr("Gasta mais energia") },
  { key: "senior", label: tr("Sénior"), fator: 1.1, nota: tr("Mais de 10 anos") },
  { key: "dieta", label: tr("A perder peso"), fator: 0.8, nota: tr("Dieta — confirme com o vet") },
];

const BG = "#FFF9F5";
const CARD = "#FFFFFF";
const BORDER = "#F0E8E0";
const TEAL = "#4ECDC4";
const DARK = "#1A1A2E";
const GRAY = "#6B7280";

export default function FoodCalculatorScreen() {
  const router = useRouter();
  const [especie, setEspecie] = useState<Especie>("cao");
  const [peso, setPeso] = useState("");
  const [fase, setFase] = useState("adulto_est");
  const [kcal, setKcal] = useState("");

  const fases = especie === "cao" ? FASES_CAO : FASES_GATO;
  const faseSel = fases.find((f) => f.key === fase) ?? fases[2];

  const pesoNum = parseFloat(peso.replace(",", "."));
  const kcalKg = parseFloat(kcal.replace(",", ".")) || (especie === "cao" ? 3600 : 4000);

  const valido = !isNaN(pesoNum) && pesoNum > 0 && pesoNum < 120;

  // RER = 70 x peso^0.75 (formula veterinaria padrao) ; DER = RER x fator
  const rer = valido ? 70 * Math.pow(pesoNum, 0.75) : 0;
  const der = rer * faseSel.fator;
  const gramas = kcalKg > 0 ? (der / kcalKg) * 1000 : 0;

  function resetFase(e: Especie) {
    setEspecie(e);
    setFase("adulto_est");
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top", "left", "right"]}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 20, paddingBottom: 12 }}>
        <TouchableOpacity onPress={() => router.back()}
          style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: CARD, borderWidth: 1.5, borderColor: BORDER, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
          <ChevronLeft size={20} color={DARK} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text suppressHighlighting style={{ fontSize: 20, fontWeight: "800", color: DARK }}>{tr("Quanta ração dar")}</Text>
          <Text suppressHighlighting style={{ fontSize: 12, color: GRAY }}>{tr("Calcule a dose certa por dia")}</Text>
        </View>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingTop: 4, paddingBottom: 50 }}>
        {/* Especie */}
        <Text suppressHighlighting style={{ fontSize: 13, fontWeight: "700", color: DARK, marginBottom: 8 }}>{tr("1. Que animal é?")}</Text>
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
          {([["cao", "🐶", tr("Cão")], ["gato", "🐱", tr("Gato")]] as const).map(([k, emoji, label]) => (
            <TouchableOpacity key={k} onPress={() => resetFase(k as Especie)}
              style={{ flex: 1, backgroundColor: especie === k ? TEAL : CARD, borderRadius: 16, padding: 14, borderWidth: 1.5, borderColor: especie === k ? TEAL : BORDER, alignItems: "center" }}>
              <Text suppressHighlighting style={{ fontSize: 26 }}>{emoji}</Text>
              <Text suppressHighlighting style={{ fontWeight: "700", fontSize: 14, color: especie === k ? "#fff" : DARK, marginTop: 4 }}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Peso */}
        <Text suppressHighlighting style={{ fontSize: 13, fontWeight: "700", color: DARK, marginBottom: 8 }}>{tr("2. Quanto pesa? (kg)")}</Text>
        <TextInput
          value={peso}
          onChangeText={setPeso}
          placeholder={especie === "cao" ? "12" : "4"}
          placeholderTextColor="#9CA3AF"
          keyboardType="decimal-pad"
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
          style={{ backgroundColor: CARD, borderWidth: 1.5, borderColor: BORDER, borderRadius: 14, padding: 14, fontSize: 16, color: DARK, marginBottom: 20 }}
        />

        {/* Fase */}
        <Text suppressHighlighting style={{ fontSize: 13, fontWeight: "700", color: DARK, marginBottom: 8 }}>{tr("3. Como é a vida dele?")}</Text>
        <View style={{ gap: 8, marginBottom: 20 }}>
          {fases.map((f) => (
            <TouchableOpacity key={f.key} onPress={() => setFase(f.key)}
              style={{ backgroundColor: fase === f.key ? "#E8FAF9" : CARD, borderRadius: 14, padding: 13, borderWidth: 1.5, borderColor: fase === f.key ? TEAL : BORDER, flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: fase === f.key ? TEAL : "#D1D5DB", alignItems: "center", justifyContent: "center" }}>
                {fase === f.key && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: TEAL }} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text suppressHighlighting style={{ fontWeight: "700", fontSize: 14, color: DARK }}>{f.label}</Text>
                <Text suppressHighlighting style={{ fontSize: 11, color: GRAY, marginTop: 1 }}>{f.nota}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Kcal */}
        <Text suppressHighlighting style={{ fontSize: 13, fontWeight: "700", color: DARK, marginBottom: 4 }}>{tr("4. Energia da ração (kcal/kg)")}</Text>
        <Text suppressHighlighting style={{ fontSize: 11, color: GRAY, marginBottom: 8 }}>
          {tr("Está no saco, na tabela nutricional (\"energia metabolizável\"). Se não encontrar, deixe em branco.")}
        </Text>
        <TextInput
          value={kcal}
          onChangeText={setKcal}
          placeholder={especie === "cao" ? "3600" : "4000"}
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
          style={{ backgroundColor: CARD, borderWidth: 1.5, borderColor: BORDER, borderRadius: 14, padding: 14, fontSize: 16, color: DARK, marginBottom: 22 }}
        />

        {/* Resultado */}
        {valido ? (
          <View style={{ backgroundColor: TEAL, borderRadius: 22, padding: 20, alignItems: "center" }}>
            <Calculator size={26} color="#fff" />
            <Text suppressHighlighting style={{ color: "#E8FAF9", fontSize: 13, fontWeight: "700", marginTop: 8 }}>{tr("Dose por dia")}</Text>
            <Text suppressHighlighting style={{ color: "#fff", fontSize: 46, fontWeight: "900", marginTop: 2 }}>{Math.round(gramas)} g</Text>
            <Text suppressHighlighting style={{ color: "#E8FAF9", fontSize: 13, marginTop: 2 }}>
              {tr("cerca de")} {Math.round(der)} kcal
            </Text>
            <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.35)", alignSelf: "stretch", marginVertical: 14 }} />
            <Text suppressHighlighting style={{ color: "#fff", fontSize: 13, fontWeight: "700", textAlign: "center" }}>
              {tr("Divida em 2 refeições")}: {Math.round(gramas / 2)} g {tr("de manhã e")} {Math.round(gramas / 2)} g {tr("à noite")}
            </Text>
            {(fase === "cachorro1" || fase === "cachorro2" || fase === "gatinho") && (
              <Text suppressHighlighting style={{ color: "#E8FAF9", fontSize: 12, textAlign: "center", marginTop: 8 }}>
                {tr("Sendo bebé, é melhor 3 refeições")}: {Math.round(gramas / 3)} g {tr("cada")}
              </Text>
            )}
          </View>
        ) : (
          <View style={{ backgroundColor: CARD, borderRadius: 22, padding: 22, borderWidth: 1.5, borderColor: BORDER, alignItems: "center" }}>
            <Text suppressHighlighting style={{ color: GRAY, fontSize: 14, textAlign: "center" }}>{tr("Escreva o peso para ver a dose.")}</Text>
          </View>
        )}

        {/* Aviso */}
        <View style={{ backgroundColor: "#FFF0EB", borderRadius: 20, padding: 18, marginTop: 18, borderWidth: 1.5, borderColor: "#FFD5C2" }}>
          <Text suppressHighlighting style={{ fontSize: 14, fontWeight: "700", color: "#FF6B35", marginBottom: 8 }}>{tr("⚠️ Isto é uma estimativa")}</Text>
          <Text suppressHighlighting style={{ color: DARK, fontSize: 13, lineHeight: 20 }}>
            {tr("O cálculo usa a fórmula de energia usada na medicina veterinária, mas cada animal é diferente. Animais doentes, grávidas, a amamentar ou com problemas de rins, coração ou diabetes precisam de uma dose definida pelo veterinário. Pese-o uma vez por mês: se estiver a engordar, baixe 10%; se emagrecer, suba 10%.")}
          </Text>
        </View>

        <View style={{ backgroundColor: "#E8FAF9", borderRadius: 20, padding: 18, marginTop: 14 }}>
          <Text suppressHighlighting style={{ fontSize: 14, fontWeight: "700", color: DARK, marginBottom: 8 }}>{tr("💡 Boas práticas")}</Text>
          {[
            tr("Pese a ração numa balança de cozinha — o copo engana muito"),
            tr("Os biscoitos e petiscos contam: não passe de 10% do total do dia"),
            tr("Água fresca sempre disponível, mudada todos os dias"),
            tr("Se mudar de ração, misture as duas durante uma semana"),
          ].map((t, i) => (
            <View key={i} style={{ flexDirection: "row", gap: 8, marginTop: i > 0 ? 6 : 0 }}>
              <Text suppressHighlighting style={{ color: TEAL, fontWeight: "700" }}>•</Text>
              <Text suppressHighlighting style={{ color: DARK, fontSize: 13, lineHeight: 20, flex: 1 }}>{t}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
