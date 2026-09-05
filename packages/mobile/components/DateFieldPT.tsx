import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Modal } from "react-native";
import { useState, useEffect } from "react";
import { Calendar, X } from "lucide-react-native";
import CalendarioMes from "./CalendarioMes";
import { tr } from "../lib/i18n";

/**
 * Campo de data em português: o utilizador escreve e vê DD/MM/AAAA
 * (dia, mês, ano — a ordem usada em Portugal), enquanto a app continua a
 * guardar a data no formato técnico AAAA-MM-DD que a base de dados espera.
 *
 * Antes os formulários pediam "AAAA-MM-DD", o que obrigava a escrever o ano
 * primeiro e era fonte de erros.
 *
 * A máscara é automática: escrevendo 15062026 aparece 15/06/2026.
 */

export function isoToPT(iso: string): string {
  if (!iso) return "";
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return iso;
  return `${m[3]}/${m[2]}/${m[1]}`;
}

export function ptToISO(pt: string): string {
  const m = pt.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return "";
  return `${m[3]}-${m[2]}-${m[1]}`;
}

/** Aplica a máscara DD/MM/AAAA aos dígitos escritos. */
export function maskDatePT(input: string): string {
  const d = input.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

/** Valida um dia/mês/ano realmente existente (rejeita 31/02, por exemplo). */
export function isValidPT(pt: string): boolean {
  const m = pt.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return false;
  const day = +m[1], month = +m[2], year = +m[3];
  if (month < 1 || month > 12 || day < 1 || year < 1900 || year > 2200) return false;
  const dt = new Date(year, month - 1, day);
  return dt.getDate() === day && dt.getMonth() === month - 1;
}

type Props = {
  label: string;
  /** Data em AAAA-MM-DD (o que fica guardado). */
  value: string;
  /** Recebe a data em AAAA-MM-DD, ou "" enquanto estiver incompleta. */
  onChange: (iso: string) => void;
  /** Mostra o botão Hoje. */
  showToday?: boolean;
  color?: string;
};

export function DateFieldPT({ label, value, onChange, showToday = true, color = "#FF6B35" }: Props) {
  const [text, setText] = useState(isoToPT(value));
  const [calendario, setCalendario] = useState(false);

  // Acompanhar alterações vindas de fora (ex.: preenchimento automático)
  useEffect(() => {
    const asPT = isoToPT(value);
    if (ptToISO(text) !== value && asPT !== text) setText(asPT);
  }, [value]);

  const handle = (raw: string) => {
    const masked = maskDatePT(raw);
    setText(masked);
    if (masked.length === 10 && isValidPT(masked)) onChange(ptToISO(masked));
    else onChange("");
  };

  const setToday = () => {
    const now = new Date();
    const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    setText(isoToPT(iso));
    onChange(iso);
  };

  const incomplete = text.length > 0 && text.length < 10;
  const invalid = text.length === 10 && !isValidPT(text);

  return (
    <View style={{ marginBottom: 14 }}>
      <Text suppressHighlighting style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {/* O ícone abre um calendário para escolher o dia sem escrever nada. */}
        <TouchableOpacity onPress={() => setCalendario(true)} style={{ paddingVertical: 12, paddingRight: 4 }}>
          <Calendar size={19} color={color} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={handle}
          placeholder={tr("DD/MM/AAAA")}
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
          maxLength={10}
        />
        {showToday && (
          <TouchableOpacity onPress={setToday} style={[styles.today, { backgroundColor: color + "1A" }]}>
            <Text suppressHighlighting style={[styles.todayTxt, { color }]}>{tr("Hoje")}</Text>
          </TouchableOpacity>
        )}
      </View>
      <Modal visible={calendario} transparent animationType="fade" onRequestClose={() => setCalendario(false)}>
        <View style={styles.fundo}>
          <View style={styles.caixa}>
            <View style={styles.caixaTopo}>
              <Text suppressHighlighting style={styles.caixaTitulo}>{tr("Escolha o dia")}</Text>
              <TouchableOpacity onPress={() => setCalendario(false)} style={{ padding: 4 }}>
                <X size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            <CalendarioMes
              valor={ptToISO(text) || value || null}
              cor={color}
              aoEscolher={(iso) => {
                setText(isoToPT(iso));
                onChange(iso);
                setCalendario(false);
              }}
            />
          </View>
        </View>
      </Modal>

      <Text suppressHighlighting style={styles.hint}>
        {invalid ? "Essa data não existe. Verifique o dia e o mês."
          : incomplete ? "Continue a escrever: dia, mês e ano."
          : "Dia / mês / ano — ex: 15/06/2026"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: "700", color: "#374151", fontSize: 13, marginBottom: 6 },
  row: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#F9FAFB", borderWidth: 1.5, borderColor: "#E5E7EB",
    borderRadius: 12, paddingHorizontal: 12,
    ...(Platform.OS === "android" ? { elevation: 0 } : {}),
  },
  input: { flex: 1, paddingVertical: 13, fontSize: 15, color: "#1A1A2E", letterSpacing: 1 },
  today: { paddingHorizontal: 11, paddingVertical: 5, borderRadius: 8 },
  todayTxt: { fontWeight: "800", fontSize: 12 },
  hint: { color: "#9CA3AF", fontSize: 11, marginTop: 4 },
  fundo: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", alignItems: "center", justifyContent: "center", padding: 22 },
  caixa: { width: "100%", maxWidth: 380, backgroundColor: "#fff", borderRadius: 20, padding: 16 },
  caixaTopo: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  caixaTitulo: { fontSize: 15.5, fontWeight: "800", color: "#1A1A2E" },
});

export default DateFieldPT;
