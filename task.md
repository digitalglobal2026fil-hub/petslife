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

### v60 — COMPILADA E PUBLICADA (19 Set 2026)
Adicionado extra a pedido da utilizadora: som do sistema (notification_sound do
Android) + vibração quando o QR de um animal é digitalizado (`lib/scan-alerts.ts`,
função `tocarSomDeAviso`, só Android). Texto do passo do tutorial sobre o QR
actualizado a mencionar o som, com traduções EN/ES/DE/FR.

- `versionCode` 60 / `versionName` 1.9.27 em `app.json` e `build.gradle` ✅
- APK + AAB compilados com sucesso (`aapt2 dump badging`: package
  `com.petislife2.app`, versionCode 60, `BILLING` presente uma vez, sem
  google-services/firebase messaging) ✅
- Publicados em GitHub Releases:
  - APK: https://github.com/digitalglobal2026fil-hub/petslife/releases/download/v1.9.27/petslife_v60.apk
  - AAB: https://github.com/digitalglobal2026fil-hub/petslife/releases/download/v1.9.27/petslife_v60.aab
- Commit `8e39bbb`, tag `v60`, push feito para `master` ✅

**AVISAR A UTILIZADORA: tem de desinstalar a versão antiga da app antes de instalar
o APK novo (não se pode instalar por cima).**

## Regras técnicas absolutas (não violar) — recordar sempre
- NUNCA `expo prebuild` (apaga a keystore)
- NUNCA `db:push`
- NUNCA `@react-native-async-storage/async-storage` — usar `lib/kv.ts`
- NUNCA reintroduzir `expo-notifications`/`expo-device` sem Firebase; NUNCA `expo-av`
- Depois de `bun add`/`expo install`: confirmar `react-native-svg` continua 15.12.1
- Compilar sempre APK + AAB; gerar em tmux, nunca polling em ciclo
- Package Android: `com.petislife2.app` (nunca mudar)

## v61 (1.9.28) — 25 Set 2026: corrige rejeicao da v60 no Google Play

Rejeicao teve 2 causas: (1) "Detalhes de inicio de sessao" desactualizado
(credenciais de teste antigas sem explicacao de acesso gratuito) - resolvido
pela utilizadora directamente no Play Console. (2) app declarava servico
"FOREGROUND_SERVICE_MEDIA_PLAYBACK" (do expo-audio) que a Google exige
video de demonstracao para justificar - a app nunca usou isto de facto
(so toca um som pontual do QR code, sem sessao de media em background).

Corrigido removendo AudioControlsService e AudioRecordingService do
AndroidManifest.xml (packages/mobile/android/app/src/main/AndroidManifest.xml),
DENTRO da tag <application> (nao na raiz do <manifest> - services so podem
ser removidos via tools:node="remove" se estiverem no sitio certo da arvore,
senao o merger nao encontra nada para remover e mantem o servico intacto).
Confirmado no manifesto final gerado (merged_manifests/release/... e
bundle_manifest/release/...) que os 2 servicos desaparecem, sem afectar o
LocationTaskService (usado por expo-location, feature diferente).

versionCode 60->61, versionName 1.9.27->1.9.28.
AndroidManifest.xml foi forcado no git (git add -f) porque toda a pasta
android/ esta no .gitignore como "generated native folder" - so build.gradle
e release.keystore ja estavam com essa excecao antes; agora o AndroidManifest
tambem, porque a correcao de hoje so existe la.

APK: https://github.com/digitalglobal2026fil-hub/petslife/releases/download/v1.9.28/petslife_v61.apk
AAB: https://github.com/digitalglobal2026fil-hub/petslife/releases/download/v1.9.28/petslife_v61.aab
Commit: d3d4c3c

Proximo passo: utilizadora faz upload do AAB v61 no Play Console (Testar e
lancar > Producao > nova versao) depois de confirmar que o passo dos
"Detalhes de inicio de sessao" ja foi guardado com sucesso.

=== v62 (29 Set 2026) — botao de voltar + fotos no Mercado/Comunidade + aviso deprecated APIs ===

Pedido da utilizadora (3 partes, resolvidas todas nesta versao):

1) Botao de voltar em falta nas paginas de categoria (Clinicas, Petshops,
   Hoteis, Tosquiadores, Treino, Adocao, Perdidos, Servicos). Causa real:
   components/CategoryHeader.tsx usava router.back() puro em vez de
   safeBack() - se nao houvesse historico de navegacao (ex.: app reaberta,
   link directo), o botao nao fazia nada. Corrigido para
   safeBack(router, "/(tabs)").

2) Fotos no Mercado e na Comunidade (as Missoes ja tinham):
   - app/(tabs)/social.tsx: composer de publicacao ganhou botao "Adicionar
     foto" (pickImageWithChoice + uploadImage), imageUrl enviado no
     createPost.mutate.
   - app/add-listing.tsx: formulario de anuncio (usado tambem por
     category/adocao.tsx) ganhou o mesmo campo de foto, imageUrl enviado
     no POST /api/marketplace.
   - app/listing/[id].tsx: mostra a foto real do anuncio no topo (antes so
     tinha emoji fixo por categoria).
   - app/(tabs)/marketplace.tsx: ListingCard mostra a foto do anuncio na
     grelha (antes so tinha icone PawPrint fixo).
   Backend (posts.ts, marketplace.ts) ja aceitava qualquer campo extra no
   body (sem validador zod restritivo) - nao foi preciso tocar no servidor
   nem no schema. So imagens por agora (video adiado a pedido da
   utilizadora - mais lento e complexo).

3) Avisos "recomendados" da Google Play (prazo ~2027):
   - "app usa APIs ou parametros descontinuados": encontrado
     android:statusBarColor no tema nativo
     (android/app/src/main/res/values/styles.xml) - esta propriedade e
     exactamente a que a Google assinala como descontinuada para
     "edge-to-edge" (o ecra deixou de usar cor fixa na barra de estado,
     isso e controlado pelo StatusBar do expo-status-bar em _layout.tsx).
     Removida a linha. Ficheiro forcado no git (git add -f) porque nao
     tinha essa excecao ainda.
   - "restricoes de redimensionamento/orientacao para ecras grandes":
     pesquisado - a partir do Android 16/17 o proprio sistema vai IGNORAR
     o bloqueio de orientacao/redimensionamento em ecras grandes (tablets)
     de qualquer forma, quer mudemos o manifesto ou nao. Corrigir isto a
     serio implica tornar todos os ecras adaptaveis a rotacao/tablet, o
     que e um trabalho grande e arriscado de fazer as pressas (pode
     partir layouts). DECISAO: nao tocar agora - o aviso e so
     "recomendado", nao bloqueia a publicacao, e o comportamento no
     telemovel (o publico real da app) nao muda nada. Retomar so se a
     Google tornar isto obrigatorio de facto.

Ficheiros alterados: components/CategoryHeader.tsx, app/(tabs)/social.tsx,
app/add-listing.tsx, app/listing/[id].tsx, app/(tabs)/marketplace.tsx,
android/app/src/main/res/values/styles.xml (forcado no git),
android/app/build.gradle, app.json.

versionCode 61->62, versionName 1.9.28->1.9.29.
tsc --noEmit limpo em mobile e web antes de compilar.

v62 publicado no GitHub Releases:
APK: https://github.com/digitalglobal2026fil-hub/petslife/releases/download/v1.9.29/petslife_v62.apk
AAB: https://github.com/digitalglobal2026fil-hub/petslife/releases/download/v1.9.29/petslife_v62.aab

=== PEDIDOS PENDENTES PARA v63 (confirmados pela utilizadora em 01 Out 2026, sem credito ainda — NAO EXECUTAR sem ela pedir "pode avancar com a v63") ===

1) Botao de voltar em falta em quase TODOS os ecras principais (o v62 so
   corrigiu CategoryHeader das paginas de categoria tipo Clinicas/Petshops,
   nao foi suficiente). Confirmado pela utilizadora que falta em:
   - Album (photos.tsx)
   - Comunidade (social.tsx)
   - Aba Vacinas (dentro de Saude/health)
   - Ao clicar numa linha/item de lista (ex: abrir um anuncio, uma
     publicacao, etc.)
   - Perfil (profile.tsx)
   - Ou seja: revisar TODOS os ecras da app (nao so os citados) e aplicar
     safeBack() em todos os headers/botoes de voltar que ainda usam
     router.back() puro ou que nao tem botao de voltar nenhum. Fazer
     varredura completa do packages/mobile/app/, nao so pontual.

2) Foto no Negocio (businesses.tsx / add-business.tsx) — o v62 so pos
   campo de foto no Mercado (add-listing.tsx) e na Comunidade (social.tsx),
   faltou fazer o mesmo no fluxo de Negocio.

3) Teclado tapa o texto ao escrever comentarios (e possivelmente outros
   campos de texto tambem) — nao se ve o que se esta a escrever porque o
   teclado cobre o input. Precisa de KeyboardAvoidingView / ajuste de
   scroll nos formularios de comentario e rever outros formularios com o
   mesmo problema (add-pet, add-vaccine ja tinham sido corrigidos na v37,
   confirmar se continuam OK; focar em comentarios da Comunidade que ainda
   nao foi corrigido).

4) NOVO (01 Out 2026): rodape/banner rotativo que apareca de vez em quando
   (nao fixo, tipo os banners/avisos que ja existem no ecra Inicio) com o
   aviso:
   "Lembre-se: parte da sua subscricao sera convertida em ajuda para
   causa animal. Partilhe, ajude-nos nessa causa!"
   (texto exacto a confirmar com a utilizadora na altura — ela escreveu em
   estilo telegrafico, rever a frase final antes de implementar). Ideia:
   reaproveitar o padrao ja usado na caixa "Parte de sua subscricao
   reverte para a CAUSA ANIMAL" do folheto promocional, trazer essa
   mensagem tambem para dentro da app, em rotacao com outros avisos/dicas
   que ja existem (ex.: AnimalFact/banners do Inicio), nao sobrepor nada
   fixo.

Proximo passo: aguardar a utilizadora ter credito e pedir explicitamente
para avancar com a v63. Antes de implementar, CONFIRMAR com ela a lista
completa (ela pediu expressamente para confirmar tudo antes de fazer).

5) NOVO (01 Out 2026): incluir no TUTORIAL (o tutorial do caozinho Max /
   ecra "Como funciona", feito na v59-ish) uma explicacao de como funciona
   a CONSULTA POR VIDEOCHAMADA com o veterinario — passo a passo, dentro
   do mesmo fluxo de onboarding/tutorial que ja existe. Reaproveitar o
   conteudo que ja existe no ecra "Guia de Videochamada" (criado na v26,
   5 passos + FAQ + requisitos + permissoes + botao de teste) e adaptar/
   resumir para caber no formato de tutorial de boas-vindas.

=== v63 — IMPLEMENTADO (01 Out 2026) ===
Todos os 6 itens pedidos foram implementados no código e verificados com
`tsc --noEmit` (sem erros):

1) Botão de voltar: criado components/HomeBackButton.tsx e aplicado nos
   ecrãs-raiz que não tinham nenhum: health.tsx, photos.tsx, social.tsx,
   profile.tsx, marketplace.tsx, businesses.tsx, consult.tsx. Varredura
   completa do app/ confirmou que os restantes ecrãs (category/*, sub-
   ecrãs com [id], add-*, etc.) já usam safeBack() — só os 7 acima
   estavam mesmo sem nada.
2) Foto no Negócio: campo de foto em add-business.tsx (mesmo padrão do
   add-listing.tsx: pickImageWithChoice + uploadImage), guardado em
   logoUrl (já existia no schema). Mostrado na lista (businesses.tsx) e
   no detalhe (business/[id].tsx).
3) Teclado a tapar comentários: KeyboardAvoidingView do CommentsModal em
   social.tsx tinha behavior=undefined no Android — mudado para "height".
4) Banner fofo da causa animal: criado components/CauseBanner.tsx com as
   patinhas 🐾 a balançar no início/fim do texto exacto pedido. Entra em
   rotação com o passarinho de partilha (lib/share-reminder.ts, agora com
   bannerCausaAnimalActivoNestaSessao) — nunca os dois juntos, aparece de
   vez em quando, não é fixo.
5) Tutorial: passo "Consulta por vídeo" (tutorial.tsx) reescrito com mais
   detalhe (link único, partilhar, sem instalar nada) e com botão "Ver
   guia completo" que abre o ecrã video-call-guide.tsx.
6) Música de abertura: volume baixado de 0.28 para 0.15 em
   lib/opening-sound.ts.

versionCode 62→63, version 1.9.29→1.9.30 em app.json.

IMPORTANTE: build de AAB/APK NÃO foi feito na sandbox (regra da
plataforma). Preview mobile entregue a correr (Metro na porta 4300).
Para gerar o AAB/APK real e publicar, a utilizadora deve usar a opção
"Publish" no dashboard do preview mobile (liga a conta Expo dela e
dispara o build directamente) — depois sobe à Play Console como sempre.
