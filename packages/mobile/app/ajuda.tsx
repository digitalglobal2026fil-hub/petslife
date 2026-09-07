import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Linking, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ChevronLeft, ChevronDown, ChevronUp, PawPrint, PlayCircle, Mail,
  Home, HeartPulse, CalendarDays, QrCode, Images, Users, ShoppingBag, User, Flame,
} from "lucide-react-native";
import { tr } from "../lib/i18n";
import { kvSet } from "../lib/kv";
import { TUTORIAL_KEY } from "./tutorial";

type Secao = {
  icone: any;
  cor: string;
  titulo: string;
  linhas: string[];
};

const SECOES: Secao[] = [
  {
    icone: Home,
    cor: "#FF6B35",
    titulo: "Início",
    linhas: [
      "É o primeiro ecrã. Mostra os seus animais e os atalhos mais usados.",
      "Para adicionar um animal: carregue em \"Adicionar animal\", escreva o nome, escolha a espécie e a raça e a data de nascimento. A foto que puser fica como foto de perfil dele.",
      "Carregue no cartão de um animal para ver a ficha completa.",
      "Se tiver mais do que um animal, aparecem todos aqui, um cartão para cada.",
    ],
  },
  {
    icone: HeartPulse,
    cor: "#10B981",
    titulo: "Saúde",
    linhas: [
      "Vacinas: guarde a data de cada vacina e a data da próxima. Pode fotografar a caderneta e anexar.",
      "Consultas: marque a data, o veterinário e o motivo. Fica no histórico.",
      "Desparasitação: interna e externa, com a data da próxima.",
      "Medicação e tratamentos: em Lembretes. Pode escrever como se administra (por exemplo \"meio comprimido com a comida\") e essa nota aparece no cartão.",
      "Peso: use o botão \"Registar peso\". O gráfico mostra a evolução ao longo do tempo.",
      "Documentos: fotografe receitas, análises e certificados para os ter sempre no telemóvel.",
      "Ferramentas: primeiros socorros, plantas e alimentos tóxicos, medidor de ração, farmácia, guia de raças, adestramento e consulta online.",
    ],
  },
  {
    icone: CalendarDays,
    cor: "#3B82F6",
    titulo: "Agenda",
    linhas: [
      "Está em Saúde > Agenda. É um calendário do mês inteiro.",
      "Os dias com coisas marcadas têm pontinhos: azul é consulta, verde é vacina, laranja é desparasitação e vermelho é medicação.",
      "Carregue num dia para ver a lista do que há nesse dia, por ordem da hora.",
      "A agenda actualiza-se sozinha — tudo o que marcar na Saúde aparece aqui.",
    ],
  },
  {
    icone: QrCode,
    cor: "#8B5CF6",
    titulo: "QR Code (se o animal se perder)",
    linhas: [
      "Cada animal tem um QR Code próprio, na ficha dele.",
      "Imprima-o e ponha-o na chapa da coleira, ou guarde-o na carteira.",
      "Quem encontrar o animal aponta a câmara do telemóvel ao código e vê logo os seus contactos — não precisa de instalar nada.",
      "Quando alguém lê o código, a senhora recebe um aviso por email. Se essa pessoa partilhar a localização, o email traz também o link do mapa.",
      "Em Animais Perdidos pode publicar o desaparecimento para a comunidade ajudar.",
    ],
  },
  {
    icone: Images,
    cor: "#0EA5E9",
    titulo: "Álbum",
    linhas: [
      "Guarde aqui as fotos e os momentos do seu animal.",
      "Carregue no + para juntar uma foto. Pode escrever uma legenda.",
      "As fotos ficam guardadas na sua conta — se mudar de telemóvel, não as perde.",
    ],
  },
  {
    icone: Flame,
    cor: "#8B5CF6",
    titulo: "Lembranças",
    linhas: [
      "Uma página em memória dos animais que já partiram.",
      "Pode pôr até 4 fotos, os anos e uma mensagem de despedida.",
      "Quem visitar pode acender uma vela e deixar uma mensagem.",
      "Se quiser juntar um vídeo, ponha o link (do YouTube ou do Google Fotos) — vídeos são ficheiros muito grandes para carregar directamente.",
    ],
  },
  {
    icone: Users,
    cor: "#A78BFA",
    titulo: "Comunidade",
    linhas: [
      "Publique fotos e perguntas e fale com outros donos.",
      "Pode reagir às publicações e comentar.",
      "Nas conversas privadas fala directamente com outra pessoa.",
      "Regra simples: seja gentil. Conselhos de saúde da comunidade não substituem o veterinário.",
    ],
  },
  {
    icone: ShoppingBag,
    cor: "#F59E0B",
    titulo: "Marketplace e Negócios",
    linhas: [
      "Veja produtos e serviços por categoria (incluindo adoções).",
      "Para anunciar: carregue no botão de criar anúncio, ponha foto, título, preço e descrição.",
      "Se tem um negócio ligado a animais, pode registá-lo para aparecer na app.",
    ],
  },
  {
    icone: User,
    cor: "#6B7280",
    titulo: "Perfil",
    linhas: [
      "Editar os seus dados e a sua foto.",
      "Subscrição: ver o estado e o plano.",
      "Idioma: a app fala 14 idiomas, escolha o que quiser.",
      "Som de abertura: pode ligar ou desligar a musiquinha.",
      "Como funciona: esta página. E o tutorial do cãozinho pode ser revisto no botão em cima.",
    ],
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "Como funcionam os 3 dias grátis?",
    a: "Quando cria a conta ficam automaticamente 3 dias com tudo desbloqueado, sem pagar nada e sem pôr cartão. No fim dos 3 dias, para continuar a usar a app é preciso subscrever: 3,99 € por mês ou 19,99 € por ano. O Álbum continua sempre acessível para não perder as suas fotos.",
  },
  {
    q: "Como subscrevo?",
    a: "Perfil > Subscrição, e escolha mensal ou anual. O pagamento é feito pela Google Play, com o método que já tem associado à sua conta Google. A PetsLife nunca vê os dados do seu cartão.",
  },
  {
    q: "Como cancelo a subscrição?",
    a: "O cancelamento é na Google Play, não na app: abra a Play Store > toque na sua foto > Pagamentos e subscrições > Subscrições > PetsLife > Cancelar. Fica com acesso até ao fim do período já pago.",
  },
  {
    q: "Esqueci-me da palavra-passe.",
    a: "No ecrã de entrada carregue em \"Esqueci-me da palavra-passe\" e escreva o seu email. Recebe uma mensagem com um link para criar uma nova. Verifique também a pasta do lixo/spam.",
  },
  {
    q: "A app demora a abrir na primeira vez.",
    a: "O servidor entra em repouso quando ninguém o usa há algum tempo e demora uns segundos a acordar. Depois disso fica rápido. Se ficar muito tempo à espera, feche e volte a abrir.",
  },
  {
    q: "Posso usar a app em mais do que um animal?",
    a: "Sim, pode ter os animais que quiser, cada um com a sua ficha, vacinas, álbum e QR Code.",
  },
  {
    q: "As minhas fotos e dados ficam guardados se eu mudar de telemóvel?",
    a: "Sim. Está tudo ligado à sua conta. Basta entrar com o mesmo email no telemóvel novo.",
  },
  {
    q: "Como partilho o QR Code do meu animal?",
    a: "Abra a ficha do animal > QR Code. Aí pode partilhar a imagem por WhatsApp ou email, ou imprimir para pôr na coleira.",
  },
  {
    q: "Recebo avisos das vacinas e da medicação?",
    a: "As datas ficam todas na Agenda e nos Lembretes, com aviso dentro da app. Os avisos com a app fechada estão a ser preparados.",
  },
  {
    q: "A app substitui o veterinário?",
    a: "Não. Os guias da app são baseados em fontes veterinárias reconhecidas e servem de orientação, mas qualquer sintoma ou dúvida deve ser vista pelo seu veterinário.",
  },
];

function Acordeao({ q, a }: { q: string; a: string }) {
  const [aberto, setAberto] = useState(false);
  return (
    <TouchableOpacity
      onPress={() => setAberto(!aberto)}
      activeOpacity={0.85}
      style={{ backgroundColor: "#fff", borderRadius: 18, padding: 16, marginBottom: 10 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text suppressHighlighting style={{ flex: 1, fontWeight: "700", color: "#1A1A2E", fontSize: 14.5, lineHeight: 21 }}>
          {tr(q)}
        </Text>
        {aberto ? <ChevronUp size={18} color="#9AA5B4" /> : <ChevronDown size={18} color="#9AA5B4" />}
      </View>
      {aberto && (
        <Text suppressHighlighting style={{ marginTop: 10, color: "#4B5563", fontSize: 14, lineHeight: 22 }}>
          {tr(a)}
        </Text>
      )}
    </TouchableOpacity>
  );
}

export default function Ajuda() {
  const router = useRouter();

  async function verTutorial() {
    await kvSet(TUTORIAL_KEY, "0");
    router.push("/tutorial" as any);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9F5" }} edges={["top"]}>
      {/* Topo */}
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12 }}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={{ padding: 4, marginRight: 6 }}>
          <ChevronLeft size={26} color="#1A1A2E" />
        </TouchableOpacity>
        <Text suppressHighlighting style={{ fontSize: 20, fontWeight: "800", color: "#1A1A2E" }}>
          {tr("Como funciona")}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Cãozinho + rever tutorial */}
        <View style={{ backgroundColor: "#fff", borderRadius: 22, padding: 16, flexDirection: "row", alignItems: "center", marginBottom: 18 }}>
          <Image source={require("../assets/mascot-dog.png")} style={{ width: 76, height: 76, marginRight: 12 }} resizeMode="contain" />
          <View style={{ flex: 1 }}>
            <Text suppressHighlighting style={{ fontWeight: "800", color: "#1A1A2E", fontSize: 15 }}>
              {tr("Quer ver outra vez o tutorial?")}
            </Text>
            <Text suppressHighlighting style={{ color: "#8B95A5", fontSize: 12.5, marginTop: 2, lineHeight: 18 }}>
              {tr("O Max explica-lhe a app passo a passo, em menos de um minuto.")}
            </Text>
            <TouchableOpacity
              onPress={verTutorial}
              activeOpacity={0.85}
              style={{ marginTop: 10, backgroundColor: "#FF6B35", borderRadius: 14, paddingVertical: 10, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", alignSelf: "flex-start", gap: 6 }}>
              <PlayCircle size={17} color="#fff" />
              <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 13.5 }}>{tr("Ver o tutorial")}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Explicações por ecrã */}
        <Text suppressHighlighting style={{ fontSize: 13, fontWeight: "800", color: "#8B95A5", letterSpacing: 0.6, marginBottom: 10 }}>
          {tr("ECRÃ POR ECRÃ")}
        </Text>

        {SECOES.map((s) => (
          <View key={s.titulo} style={{ backgroundColor: "#fff", borderRadius: 20, padding: 16, marginBottom: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
              <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: s.cor + "18", alignItems: "center", justifyContent: "center", marginRight: 11 }}>
                <s.icone size={19} color={s.cor} />
              </View>
              <Text suppressHighlighting style={{ fontSize: 16.5, fontWeight: "800", color: "#1A1A2E", flex: 1 }}>
                {tr(s.titulo)}
              </Text>
            </View>
            {s.linhas.map((l, k) => (
              <View key={k} style={{ flexDirection: "row", marginBottom: 8 }}>
                <PawPrint size={13} color={s.cor} style={{ marginTop: 4, marginRight: 8 }} />
                <Text suppressHighlighting style={{ flex: 1, color: "#4B5563", fontSize: 14, lineHeight: 21.5 }}>
                  {tr(l)}
                </Text>
              </View>
            ))}
          </View>
        ))}

        {/* Perguntas frequentes */}
        <Text suppressHighlighting style={{ fontSize: 13, fontWeight: "800", color: "#8B95A5", letterSpacing: 0.6, marginTop: 10, marginBottom: 10 }}>
          {tr("PERGUNTAS FREQUENTES")}
        </Text>
        {FAQS.map((f) => (
          <Acordeao key={f.q} q={f.q} a={f.a} />
        ))}

        {/* Contacto */}
        <TouchableOpacity
          onPress={() =>
            Linking.openURL("mailto:support@petslife.app?subject=Suporte%20PetsLife").catch(() =>
              Alert.alert(tr("Erro"), tr("Não foi possível abrir o email.")),
            )
          }
          activeOpacity={0.85}
          style={{ backgroundColor: "#1A1A2E", borderRadius: 20, padding: 16, flexDirection: "row", alignItems: "center", gap: 10, marginTop: 8 }}>
          <Mail size={19} color="#fff" />
          <View style={{ flex: 1 }}>
            <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 14.5 }}>{tr("Não encontrou a resposta?")}</Text>
            <Text suppressHighlighting style={{ color: "#B9C0CC", fontSize: 12.5, marginTop: 2 }}>{tr("Escreva-nos e respondemos assim que possível.")}</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
