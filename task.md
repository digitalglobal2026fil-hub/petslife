# PetsLife — task.md (17 Set 2026)

## Sessão actual — tudo pronto para compilar a v60

Todas as correcções pedidas foram feitas, verificadas com `tsc --noEmit` (mobile e web, 0 erros)
e as traduções conferidas (0 chaves em falta nos ficheiros novos/alterados). NADA foi
commitado nem compilado ainda — falta só a confirmação da utilizadora para compilar.

### Feito nesta sessão
1. **Bug do "gosto" (coração)** — corrigido em `packages/web/src/api/routes/posts.ts`
   (`likedByMe` devolvido por post, cálculo de `likesCount` corrigido) e em
   `packages/mobile/app/(tabs)/social.tsx` (estado visual do coração + botão desactivado
   durante o pedido).
2. **Ecrã de comentários** — criado dentro de `social.tsx` (`CommentsModal`), com listar,
   escrever e apagar comentário.
3. **Consultas "Em breve" com data passada** — corrigido em
   `packages/web/src/api/routes/appointments.ts` (`/upcoming` agora filtra `gte(hoje)` e
   `ne(cancelled)`). Isto também resolve o pedido sobre "notificações de datas já passadas
   que deviam apagar-se" — confirmado com a utilizadora que era este o comportamento em falta.
4. **Botão "voltar" sem efeito** — `lib/safe-back.ts` (novo) aplicado em `add-vaccine.tsx`,
   `add-appointment.tsx`, `add-diary.tsx`, `add-document.tsx`, `pet/[id]/health.tsx`,
   `pet/[id]/vaccines.tsx`.
5. **Rota de Desparasitação em falta** (dava "Unmatched Route" e fechava a app) —
   `app/add-deworming.tsx` criado (ecrã completo, análogo a add-vaccine.tsx). Confirmado
   com a utilizadora que era este o bug do "fecha e reabre".
6. **Música de abertura mais suave** — `lib/opening-sound.ts`: volume de 0.6 para 0.28 +
   fade-out suave nos últimos ~1.5s.
7. **Lembrete de partilha/subscrição (passarinho + bandeirola)** — novo:
   - `lib/share-reminder.ts`: contador de aberturas, decide 1 em cada 3 vezes.
   - `components/ShareReminderBird.tsx`: passarinho a voar com bandeirola a abanar.
   - `components/ExitShareModal.tsx`: mesmo aviso ao tentar saír da app (botão de voltar
     do telemóvel no ecrã Início), via `BackHandler` + `useFocusEffect`.
   - Aparece nos dois sítios pedidos: banner no Início + ao fechar a app.
   - Texto final (combinando as duas frases que a utilizadora deu):
     "Voando aqui para avisar: parte da sua subscrição converte para causas animais.
     Cada assinatura ajuda-nos a cuidar de mais amiguinhos — partilha a PetsLife com quem
     também ama animais! 🐾"
8. **Passo de tutorial sobre videochamada** — adicionado em `app/tutorial.tsx`
   (explica Saúde > Ferramentas > Consulta Online).
9. **12 chaves i18n** de comentários/desparasitação já estavam traduzidas (confirmado em
   sessão anterior, 0 em falta).

### Verificação técnica feita
- `bunx tsc --noEmit` em `packages/mobile` → 0 erros
- `bunx tsc --noEmit` em `packages/web` → 0 erros
- Script de chaves i18n corrido nos ficheiros novos/alterados → 0 em falta (as 3 que
  aparecem no scan geral, "Animais Perdidos"/"Adoções"/"Diário do Animal" em
  `(tabs)/index.tsx`, já existiam antes desta sessão e não foram tocadas agora)

## RONDA 2 — bug do botão de voltar em TODAS as páginas + pergunta de "segurança" (17 Set 2026)

Utilizadora reportou: em páginas como o Diário, não há como voltar atrás nem com o
botão físico do telemóvel — fica "presa" até preencher e guardar. Pediu que TODAS as
páginas deixem voltar atrás livremente.

### Causa raiz encontrada
1. `app/_layout.tsx` usa `<Slot/>` na raiz (sem `<Stack/>`), por isso não havia nenhum
   navigator a apanhar o botão físico de voltar do Android fora dos separadores — só
   o ecrã Início tinha o seu próprio `BackHandler` (para o diálogo de saída).
2. Vários `<Modal>` (ex.: Diário, Vacinas, Consultas, Desparasitação, Peso,
   Documentos, Receitas, Animais Perdidos, gráfico de peso) não tinham
   `onRequestClose` — no Android, um Modal aberto **engole** o botão físico de voltar
   se essa prop não estiver definida, dando a sensação de estar "preso" até usar um
   botão dentro do modal (Cancelar/Guardar).

### Correções aplicadas (tsc limpo em mobile e web, 0 erros)
1. Todos os 53 usos de `router.back()` em 40 ficheiros (todo o `app/pet/[id]/*`,
   `add-*`, `app/(auth)/*`, e todas as páginas de topo com botão "←") passaram a usar
   `safeBack(router, fallback)` — se não houver histórico, vai para um sítio sensato
   (ex.: `/pet/${id}` para sub-páginas do animal, `/(tabs)/health` para páginas de
   Saúde, `/(tabs)/profile` para perfil/admin/subscrição, etc.) em vez de ficar
   parada. `safe-back.ts`: fallback por defeito passou de `/health` (rota inválida)
   para `/(tabs)`.
2. Todos os `<Modal>` sem `onRequestClose` (10 ficheiros: `health.tsx` 7 modais,
   `vaccines.tsx`, `deworming.tsx`, `weight.tsx`, `consultas.tsx`, `receitas.tsx`,
   `diario.tsx`, `documentos.tsx`, `lost-pets.tsx`, `weight-chart.tsx`) passaram a
   fechar com o botão físico de voltar do Android, ligado ao mesmo `setModal(false)`/
   `setShowModal(false)` que o botão Cancelar já usava.
3. Novo `BackHandler` global em `app/_layout.tsx` (dentro do `AuthGuard`, sempre
   montado): em qualquer ecrã fora dos separadores, o botão físico de voltar chama
   `safeBack(router, "/(tabs)")`. O listener do ecrã Início é registado depois deste
   (só quando está em foco) e por isso tem sempre prioridade — não há conflito, o
   diálogo de "quer mesmo saír?" continua a funcionar normalmente na página Início.

### Pergunta sobre "segurança para que ninguém copie a app"
A utilizadora esclareceu: quer impedir que outra pessoa copie o código e publique uma
cópia da app. Ainda por decidir com ela (ver próximos passos) — não fiz nenhuma
alteração de build ainda para isto, porque:
- O JS/TS já corre como bytecode Hermes (não é código-fonte legível) e passa por
  minificação automática do Expo/Metro em builds de produção — já há uma camada
  razoável de proteção sem tocar em nada.
- A única alteração adicional realista no código é activar ProGuard/R8
  (`minifyEnabled`/`shrinkResources` no `build.gradle`, hoje desligados) para
  ofuscar a parte nativa Android. Isto tem risco real de rebentar em runtime com
  os vários módulos nativos da app (WebRTC, image-manipulator, file-system,
  secure-store, reanimated, etc.) sem regras de "keep" dedicadas, e exige um build
  de teste dedicado — não vou activar isto junto com a v60 sem falar com ela primeiro.
- Nenhuma destas medidas torna a app "impossível de copiar" — isso não existe para
  nenhuma app instalável. A proteção real e mais forte é o nome/marca registados, a
  conta própria da Play Store (só ela pode publicar actualizações à ficha atual) e
  denunciar cópias à Google caso apareçam.

### Próximo passo — À ESPERA DE CONFIRMAÇÃO DA UTILIZADORA
Expliquei tudo o que foi feito e vou pedir confirmação explícita antes de:
1. Bump `versionCode` 60 / `versionName` 1.9.27 em `app.json` (mobile) e `build.gradle`
2. Gerar APK + AAB (`/tmp/build59.sh` como modelo, `sed 's/v59/v60/g'`, tmux)
3. Verificar `BILLING` presente e ausência de "google-services" no manifest final
4. Publicar via GitHub Releases (`.env.deploy` tem o token)
5. `git add`/`commit`/tag `v60` em `master`
6. Avisar a utilizadora: **tem de desinstalar a versão antiga antes de instalar o APK novo**

## Regras técnicas absolutas (não violar) — recordar sempre
- NUNCA `expo prebuild` (apaga a keystore)
- NUNCA `db:push`
- NUNCA `@react-native-async-storage/async-storage` — usar `lib/kv.ts`
- NUNCA reintroduzir `expo-notifications`/`expo-device` sem Firebase; NUNCA `expo-av`
- Depois de `bun add`/`expo install`: confirmar `react-native-svg` continua 15.12.1
- Compilar sempre APK + AAB; gerar em tmux, nunca polling em ciclo
- Package Android: `com.petislife2.app` (nunca mudar)
