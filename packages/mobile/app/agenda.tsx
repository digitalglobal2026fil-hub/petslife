/**
 * Agenda — calendário do mês sempre actualizado com tudo o que está marcado.
 *
 * Junta num só sítio: consultas, próximas vacinas, próximas desparasitações e
 * a medicação/lembretes. Os dias com coisas marcadas ficam com pontinhos
 * coloridos e, ao carregar num dia, aparece por baixo a lista desse dia.
 *
 * Os dados vêm todos de um pedido só: GET /api/agenda.
 */
import { useState, useCallback } from "react";
import {
  View, Text, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import {
  ArrowLeft, CalendarDays, Stethoscope, Syringe, Bug, Pill, Plus, Bell,
} from "lucide-react-native";
import CalendarioMes, { hojeISO, isoPorExtenso } from "../components/CalendarioMes";
import { BASE_URL } from "../lib/api";
import { authFetch } from "../lib/auth-fetch";
import { netError } from "../lib/net-error";
import { tr } from "../lib/i18n";

const AZUL = "#3B82F6";
const BG = "#F4F7FF";

type Evento = {
  chave: string;
  tipo: "consulta" | "vacina" | "desparasitacao" | "medicacao";
  titulo: string;
  detalhe?: string;
  hora?: string | null;
  pet?: string;
  cor: string;
};

const CORES = {
  consulta: "#3B82F6",
  vacina: "#10B981",
  desparasitacao: "#F59E0B",
  medicacao: "#EF4444",
};

const ICONES = {
  consulta: Stethoscope,
  vacina: Syringe,
  desparasitacao: Bug,
  medicacao: Pill,
};

const NOMES = {
  consulta: "Consulta",
  vacina: "Vacina",
  desparasitacao: "Desparasitação",
  medicacao: "Medicação",
};

/** Dias entre duas datas AAAA-MM-DD (só conta dias inteiros). */
function diasEntre(a: string, b: string): number {
  const d1 = Date.parse(a + "T00:00:00Z");
  const d2 = Date.parse(b + "T00:00:00Z");
  if (isNaN(d1) || isNaN(d2)) return NaN;
  return Math.round((d2 - d1) / 86400000);
}

function diaDaSemana(iso: string): number {
  const d = Date.parse(iso + "T00:00:00Z");
  return isNaN(d) ? -1 : new Date(d).getUTCDay();
}

function dataValida(s?: string | null): s is string {
  return !!s && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

/** Diz se um lembrete cai neste dia, conforme a repetição escolhida. */
function lembreteCaiEm(r: any, dia: string): boolean {
  if (r.active === false) return false;
  if (!dataValida(r.startDate)) return false;
  if (diasEntre(r.startDate, dia) < 0) return false;
  if (dataValida(r.endDate) && diasEntre(r.endDate, dia) > 0) return false;

  const passados = diasEntre(r.startDate, dia);
  switch (r.frequency) {
    case "once":
      return passados === 0;
    case "weekly":
      return passados % 7 === 0 || diaDaSemana(r.startDate) === diaDaSemana(dia);
    case "monthly":
      return r.startDate.slice(8, 10) === dia.slice(8, 10);
    case "interval": {
      const n = Number(r.intervalDays) || 1;
      return passados % n === 0;
    }
    default: // daily
      return true;
  }
}

function horasDoLembrete(r: any): string[] {
  try {
    const t = typeof r.times === "string" ? JSON.parse(r.times) : r.times;
    return Array.isArray(t) ? t.filter((x: any) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export default function AgendaScreen() {
  const router = useRouter();
  const [dados, setDados] = useState<any | null>(null);
  const [erro, setErro] = useState("");
  const [dia, setDia] = useState<string>(hojeISO());
  const [refreshing, setRefreshing] = useState(false);

  const carregar = useCallback(async () => {
    try {
      setErro("");
      const res = await authFetch(`${BASE_URL}/api/agenda`);
      if (!res.ok) throw new Error(String(res.status));
      setDados(await res.json());
    } catch (e: any) {
      setErro(netError(e, tr("Não foi possível carregar a agenda.")));
      setDados({ appointments: [], vaccines: [], dewormings: [], reminders: [] });
    }
  }, []);

  // Sempre que se entra no ecrã, vai buscar tudo outra vez — assim o
  // calendário está sempre actualizado com o que se marcou noutros ecrãs.
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  const aoPuxar = async () => {
    setRefreshing(true);
    await carregar();
    setRefreshing(false);
  };

  /** Datas fixas (consultas, vacinas, desparasitações) -> cores dos pontinhos. */
  const marcas: Record<string, string[]> = {};
  const juntarMarca = (d: string | null | undefined, cor: string) => {
    if (!dataValida(d)) return;
    if (!marcas[d]) marcas[d] = [];
    if (!marcas[d].includes(cor)) marcas[d].push(cor);
  };

  if (dados) {
    for (const a of dados.appointments ?? []) juntarMarca(a.date, CORES.consulta);
    for (const v of dados.vaccines ?? []) juntarMarca(v.nextDate, CORES.vacina);
    for (const d of dados.dewormings ?? []) juntarMarca(d.nextDate, CORES.desparasitacao);
    // A medicação repete-se — marca-se o dia escolhido e os dias à volta
    // (60 dias para trás e para a frente chega para o calendário que se vê).
    const base = Date.parse(dia + "T00:00:00Z");
    if (!isNaN(base)) {
      for (let i = -60; i <= 60; i++) {
        const d = new Date(base + i * 86400000).toISOString().slice(0, 10);
        for (const r of dados.reminders ?? []) {
          if (lembreteCaiEm(r, d)) {
            juntarMarca(d, CORES.medicacao);
            break;
          }
        }
      }
    }
  }

  /** Lista de coisas marcadas no dia escolhido. */
  const eventos: Evento[] = [];
  if (dados) {
    for (const a of dados.appointments ?? []) {
      if (a.date === dia) {
        eventos.push({
          chave: `c${a.id}`,
          tipo: "consulta",
          titulo: a.title,
          detalhe: [a.clinic, a.veterinarian].filter(Boolean).join(" · "),
          hora: a.time,
          pet: a.petName,
          cor: CORES.consulta,
        });
      }
    }
    for (const v of dados.vaccines ?? []) {
      if (v.nextDate === dia) {
        eventos.push({
          chave: `v${v.id}`,
          tipo: "vacina",
          titulo: v.name,
          detalhe: tr("Próxima dose"),
          pet: v.petName,
          cor: CORES.vacina,
        });
      }
    }
    for (const d of dados.dewormings ?? []) {
      if (d.nextDate === dia) {
        eventos.push({
          chave: `d${d.id}`,
          tipo: "desparasitacao",
          titulo: d.product,
          detalhe: tr("Próxima dose"),
          pet: d.petName,
          cor: CORES.desparasitacao,
        });
      }
    }
    for (const r of dados.reminders ?? []) {
      if (lembreteCaiEm(r, dia)) {
        const horas = horasDoLembrete(r);
        if (horas.length === 0) horas.push("");
        for (const h of horas) {
          eventos.push({
            chave: `r${r.id}-${h}`,
            tipo: "medicacao",
            titulo: r.title,
            detalhe: [r.dosage, r.notes].filter(Boolean).join(" · "),
            hora: h || null,
            pet: r.petName,
            cor: CORES.medicacao,
          });
        }
      }
    }
    eventos.sort((a, b) => (a.hora ?? "99:99").localeCompare(b.hora ?? "99:99"));
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top", "left", "right"]}>
      <View style={{
        backgroundColor: AZUL, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 18,
        borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
      }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <CalendarDays size={22} color="#fff" />
          <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800" }}>{tr("Agenda")}</Text>
        </View>
        <Text style={{ color: "#DBEAFE", fontSize: 13, marginTop: 6, marginLeft: 40 }}>
          {tr("Tudo o que tem marcado, mês a mês")}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={aoPuxar} tintColor={AZUL} />}
      >
        {!dados ? (
          <View style={{ paddingVertical: 60, alignItems: "center" }}>
            <ActivityIndicator color={AZUL} />
          </View>
        ) : (
          <>
            {!!erro && (
              <View style={{ backgroundColor: "#FEF2F2", borderRadius: 12, padding: 12, marginBottom: 12 }}>
                <Text style={{ color: "#B91C1C", fontSize: 13 }}>{erro}</Text>
              </View>
            )}

            <View style={{
              backgroundColor: "#fff", borderRadius: 20, padding: 12,
              borderWidth: 1, borderColor: "#E8EDF7",
            }}>
              <CalendarioMes valor={dia} aoEscolher={setDia} marcas={marcas} cor={AZUL} />
            </View>

            {/* Legenda das cores */}
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 14, marginTop: 12, paddingHorizontal: 4 }}>
              {(Object.keys(CORES) as (keyof typeof CORES)[]).map((k) => (
                <View key={k} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: CORES[k] }} />
                  <Text style={{ fontSize: 12, color: "#64748B" }}>{tr(NOMES[k])}</Text>
                </View>
              ))}
            </View>

            <Text style={{ fontSize: 16, fontWeight: "800", color: "#0F172A", marginTop: 20, marginBottom: 10 }}>
              {isoPorExtenso(dia)}
            </Text>

            {eventos.length === 0 ? (
              <View style={{
                backgroundColor: "#fff", borderRadius: 18, padding: 24, alignItems: "center",
                borderWidth: 1, borderColor: "#E8EDF7",
              }}>
                <Bell size={30} color="#CBD5E1" />
                <Text style={{ color: "#64748B", fontSize: 14, marginTop: 10, textAlign: "center" }}>
                  {tr("Nada marcado para este dia.")}
                </Text>
              </View>
            ) : (
              eventos.map((ev) => {
                const Icone = ICONES[ev.tipo];
                return (
                  <View
                    key={ev.chave}
                    style={{
                      backgroundColor: "#fff", borderRadius: 16, padding: 14, marginBottom: 10,
                      flexDirection: "row", alignItems: "center", gap: 12,
                      borderWidth: 1, borderColor: "#E8EDF7", borderLeftWidth: 4, borderLeftColor: ev.cor,
                    }}
                  >
                    <View style={{
                      width: 40, height: 40, borderRadius: 20, backgroundColor: ev.cor + "1A",
                      alignItems: "center", justifyContent: "center",
                    }}>
                      <Icone size={20} color={ev.cor} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: "700", color: "#0F172A" }}>{ev.titulo}</Text>
                      <Text style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
                        {[tr(NOMES[ev.tipo]), ev.pet, ev.detalhe].filter(Boolean).join(" · ")}
                      </Text>
                    </View>
                    {!!ev.hora && (
                      <Text style={{ fontSize: 14, fontWeight: "800", color: ev.cor }}>{ev.hora}</Text>
                    )}
                  </View>
                );
              })
            )}

            <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
              <TouchableOpacity
                onPress={() => router.push("/add-appointment" as any)}
                style={{
                  flex: 1, backgroundColor: AZUL, borderRadius: 14, paddingVertical: 14,
                  flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                <Plus size={18} color="#fff" />
                <Text style={{ color: "#fff", fontWeight: "800", fontSize: 14 }}>{tr("Marcar consulta")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/reminders" as any)}
                style={{
                  flex: 1, backgroundColor: "#fff", borderRadius: 14, paddingVertical: 14,
                  flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
                  borderWidth: 1.5, borderColor: CORES.medicacao,
                }}
              >
                <Pill size={18} color={CORES.medicacao} />
                <Text style={{ color: CORES.medicacao, fontWeight: "800", fontSize: 14 }}>{tr("Medicação")}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
