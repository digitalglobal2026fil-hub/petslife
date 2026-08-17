import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { tr } from "../lib/i18n";

/**
 * Apanha qualquer erro de JavaScript (render ou global) e mostra-o no ecrã em
 * vez de deixar a app fechar-se. Assim é possível ver a causa real de um
 * arranque falhado, tirar uma fotografia ao ecrã e enviá-la.
 */

type State = { error: string | null };

function format(e: any): string {
  if (!e) return "Erro desconhecido";
  const msg = e?.message ?? String(e);
  const stack = typeof e?.stack === "string" ? e.stack.split("\n").slice(0, 12).join("\n") : "";
  return stack ? `${msg}\n\n${stack}` : msg;
}

export class ErrorCatcher extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: any): State {
    return { error: format(error) };
  }

  componentDidMount() {
    const g: any = global as any;
    const utils = g?.ErrorUtils;
    if (!utils?.setGlobalHandler) return;
    const previous = utils.getGlobalHandler?.();
    utils.setGlobalHandler((error: any, isFatal?: boolean) => {
      if (isFatal) {
        this.setState({ error: format(error) });
      } else if (previous) {
        try {
          previous(error, isFatal);
        } catch {
          /* ignora */
        }
      }
    });
  }

  componentDidCatch(error: any) {
    this.setState({ error: format(error) });
  }

  render() {
    if (!this.state.error) return this.props.children as any;

    return (
      <View style={{ flex: 1, backgroundColor: "#05060F", paddingTop: 60, paddingHorizontal: 20 }}>
        <Text style={{ color: "#FF6B35", fontSize: 20, fontWeight: "800", marginBottom: 6 }}>
          A app encontrou um erro
        </Text>
        <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 14 }}>
          Tire uma fotografia a este ecrã e envie-a. Assim o problema é corrigido à primeira.
        </Text>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: "rgba(255,255,255,0.06)",
            borderRadius: 12,
            padding: 12,
            marginBottom: 16,
          }}
        >
          <Text selectable style={{ color: "#fff", fontSize: 12, fontFamily: Platform.OS === "android" ? "monospace" : "Menlo" }}>
            {this.state.error}
          </Text>
        </ScrollView>
        <TouchableOpacity
          onPress={() => this.setState({ error: null })}
          style={{
            backgroundColor: "#FF6B35",
            borderRadius: 14,
            paddingVertical: 14,
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>{tr("Tentar continuar")}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
