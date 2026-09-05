import { useMemo, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { tr } from "../lib/i18n";

/**
 * Calendário mensal simples, feito à mão (sem bibliotecas novas).
 *
 * Serve para dois sítios:
 *  - escolher uma data nos formulários (components/DateFieldPT.tsx);
 *  - ver os dias que têm coisas marcadas no ecrã Agenda.
 *
 * As datas andam sempre no formato técnico AAAA-MM-DD, que é o que a base de
 * dados guarda. O que se mostra à pessoa é em português.
 */

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

// A semana começa à segunda-feira, como em Portugal.
const DIAS = ["S", "T", "Q", "Q", "S", "S", "D"];

export function hojeISO(): string {
  const d = new Date();
  return isoDe(d.getFullYear(), d.getMonth(), d.getDate());
}

export function isoDe(ano: number, mes0: number, dia: number): string {
  return `${ano}-${String(mes0 + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

/** "2026-09-05" -> "5 de setembro de 2026" */
export function isoPorExtenso(iso: string): string {
  const m = iso?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return iso ?? "";
  return `${+m[3]} de ${MESES[+m[2] - 1].toLowerCase()} de ${m[1]}`;
}

type Props = {
  /** Dia seleccionado (AAAA-MM-DD), se houver. */
  valor?: string | null;
  /** Chamado ao carregar num dia. */
  aoEscolher: (iso: string) => void;
  /**
   * Dias com marcações: { "2026-09-12": ["#FF6B35", "#4ECDC4"] }.
   * Mostra até 3 pontinhos coloridos por baixo do número.
   */
  marcas?: Record<string, string[]>;
  /** Mês inicial a mostrar (AAAA-MM-DD). Por omissão, o do valor ou hoje. */
  mesInicial?: string | null;
  cor?: string;
};

export default function CalendarioMes({
  valor,
  aoEscolher,
  marcas = {},
  mesInicial,
  cor = "#FF6B35",
}: Props) {
  const base = mesInicial || valor || hojeISO();
  const [ano, setAno] = useState(() => +base.slice(0, 4));
  const [mes, setMes] = useState(() => +base.slice(5, 7) - 1);

  const hoje = hojeISO();

  const celulas = useMemo(() => {
    const primeiro = new Date(ano, mes, 1);
    // getDay(): 0 = domingo. Queremos 0 = segunda.
    const desvio = (primeiro.getDay() + 6) % 7;
    const totalDias = new Date(ano, mes + 1, 0).getDate();
    const lista: (number | null)[] = [];
    for (let i = 0; i < desvio; i++) lista.push(null);
    for (let d = 1; d <= totalDias; d++) lista.push(d);
    while (lista.length % 7 !== 0) lista.push(null);
    return lista;
  }, [ano, mes]);

  function mudarMes(passo: number) {
    let m = mes + passo;
    let a = ano;
    if (m < 0) { m = 11; a -= 1; }
    if (m > 11) { m = 0; a += 1; }
    setMes(m);
    setAno(a);
  }

  return (
    <View>
      {/* Cabeçalho: mês e setas */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <TouchableOpacity onPress={() => mudarMes(-1)} style={{ padding: 8 }}>
          <ChevronLeft size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text suppressHighlighting style={{ fontSize: 15.5, fontWeight: "800", color: "#1A1A2E" }}>
          {MESES[mes]} {ano}
        </Text>
        <TouchableOpacity onPress={() => mudarMes(1)} style={{ padding: 8 }}>
          <ChevronRight size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Iniciais dos dias da semana */}
      <View style={{ flexDirection: "row", marginBottom: 4 }}>
        {DIAS.map((d, i) => (
          <View key={i} style={{ flex: 1, alignItems: "center", paddingVertical: 4 }}>
            <Text suppressHighlighting style={{ fontSize: 11.5, fontWeight: "800", color: "#9CA3AF" }}>{d}</Text>
          </View>
        ))}
      </View>

      {/* Dias */}
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {celulas.map((dia, i) => {
          if (dia === null) {
            return <View key={i} style={{ width: `${100 / 7}%`, height: 44 }} />;
          }
          const iso = isoDe(ano, mes, dia);
          const escolhido = valor === iso;
          const eHoje = iso === hoje;
          const pontos = (marcas[iso] ?? []).slice(0, 3);

          return (
            <TouchableOpacity
              key={i}
              onPress={() => aoEscolher(iso)}
              activeOpacity={0.7}
              style={{ width: `${100 / 7}%`, height: 44, alignItems: "center", justifyContent: "center" }}
            >
              <View
                style={{
                  width: 34, height: 34, borderRadius: 17,
                  alignItems: "center", justifyContent: "center",
                  backgroundColor: escolhido ? cor : eHoje ? cor + "1A" : "transparent",
                  borderWidth: eHoje && !escolhido ? 1.5 : 0,
                  borderColor: cor,
                }}
              >
                <Text
                  suppressHighlighting
                  style={{
                    fontSize: 14,
                    fontWeight: escolhido || eHoje ? "800" : "600",
                    color: escolhido ? "#fff" : eHoje ? cor : "#1A1A2E",
                  }}
                >
                  {dia}
                </Text>
              </View>

              {pontos.length > 0 && (
                <View style={{ flexDirection: "row", gap: 2, marginTop: 1, height: 5 }}>
                  {pontos.map((c, k) => (
                    <View key={k} style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: escolhido ? "#fff" : c }} />
                  ))}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        onPress={() => { const h = hojeISO(); setAno(+h.slice(0, 4)); setMes(+h.slice(5, 7) - 1); aoEscolher(h); }}
        style={{ alignSelf: "center", marginTop: 6, paddingVertical: 8, paddingHorizontal: 18, borderRadius: 12, backgroundColor: cor + "1A" }}
      >
        <Text suppressHighlighting style={{ color: cor, fontWeight: "800", fontSize: 13 }}>{tr("Hoje")}</Text>
      </TouchableOpacity>
    </View>
  );
}
