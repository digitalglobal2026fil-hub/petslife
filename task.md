# PetsLife v57 (versionCode 57 / 1.9.24) — em curso

Última versão publicada: v56 (1.9.23). NÃO compilar até a utilizadora confirmar
que já não quer acrescentar mais nada ("Quero acrescentar mais coisas antes").

## Pedidos dela (6 pontos) — estado

1. [FEITO] Musiquinha de abertura mais longa e mais alta
   - assets/opening.mp3 recortado de store-assets/promo/musica.mp3: 10,03 s
     (antes 3,8 s), fade in 0,25 s + fade out a partir de 8,6 s
   - lib/opening-sound.ts: volume 0.35 -> 0.6 (nas duas funções),
     timeout de limpeza 4500 -> 11000 ms
2. [FEITO] Botão "+" do peso invisível
   - app/weight-chart.tsx: botão grande "Registar peso" abaixo do cabeçalho
     (styles.registarBtn / registarBtnTxt)
   - app/pet/[id]/weight.tsx: botão grande igual antes do banner da frase
3. [DECIDIDO NÃO FAZER] Pet Friendly no mapa — ela escolheu deixar como está
   (abre o Google Maps; quem assinala os locais é a Google)
4. [FEITO] Emojis de reação nas Missões (👍 ❤️ 😍 🥰 👏)
   - schema.ts: tabela missionReactions (mission_reactions)
   - api/routes/missions.ts: CREATE TABLE + índice único (mission_id,user_id),
     GET / devolve reactions{} e myReaction, POST /:id/reactions (toggle),
     DELETE da missão apaga também as reações
   - app/missions.tsx: EMOJIS, função reagir() com actualização optimista,
     barra de reações no cartão
5. [A FAZER] Calendário
   - (a) ícone do calendário em components/DateFieldPT.tsx é só desenho —
     passar a abrir um calendário mensal para escolher o dia
   - (b) ecrã novo "Agenda": calendário do mês, ponto colorido nos dias com
     marcações, lista do dia (consultas, vacinas, desparasitação, medicação);
     atalho no Início e na Saúde
6. [FEITO] Medicação
   - app/reminders.tsx: label "Notas" -> "Como se administra (opcional)",
     placeholder "Ex: meio comprimido de manhã, com comida"; notas passam a
     aparecer no cartão do lembrete
   - atalho "Medicação" (Pill, #EF4444) em (tabs)/index.tsx extraActions e em
     (tabs)/health.tsx (ferramentas) -> /reminders
   - o campo já existia na API (reminders.notes), não foi preciso mexer na BD

## Feito antes destes 6 pontos (também entra na v57)
- app/admin.tsx: mensagem de partilha do código de parceiro sem links nenhuns
  (só o código e "Perfil -> Código Promocional"); função mensagemDoCodigo()

## Já no ar (site, sem precisar de compilar)
- /promo/:code (packages/web/src/web/pages/promo.tsx) + rota em app.tsx
- GET /api/promo-codes/check/:code reconhece códigos promocionais E de parceiro
- /admin/promo: promo-codes.ts admin usa isAdmin() (emails) além de
  ADMIN_USER_IDS; painel gera mensagem pronta + botão WhatsApp
- dist/ recompilado e commitado; Render já actualizado

## Regras
- tsc a 0 erros antes de compilar (packages/mobile e packages/web)
- versionCode 57 / versionName 1.9.24 em app.json:34 e build.gradle:95-96
- build: /tmp/build56.sh -> /tmp/build57.sh (sed v56->v57), tmux, ~13 min
- gerar SEMPRE APK + AAB e publicar por GitHub Releases

## v57 — actualização 5 Set
- [x] Lembranças: servidor (memorials.ts + 3 tabelas) + ecrã app/memorial.tsx + atalho no Início + 30 traduções
- [x] Adoções: botão "Colocar animal para adoção" + lupa a funcionar
- [x] "Quanta Ração" → "Medidor de Ração"
- [ ] FALTA: ecrã Agenda (calendário do mês com pontinhos + lista do dia)
tsc mobile 0 erros · tsc web 0 erros

## v57 — build a decorrer (5 Set)
- [x] Agenda: packages/web/src/api/routes/agenda.ts (GET /api/agenda) + app/agenda.tsx
      + atalho do Início corrigido (apontava para /health) + entrada na Saúde + 7 traduções
- [x] git commit b548618 + push (Render redeploy automático)
- [ ] build v57 a correr (tmux b57), versionCode 57 / 1.9.24
- [ ] depois: verificar BILLING=1, tag v57, GitHub Release com APK+AAB

## 6 Set — emails de recuperação de password
Causa encontrada: no Render o smtp.gmail.com resolvia para IPv6 e a ligação era
recusada (ECONNREFUSED ...:465). NENHUM email saía (recuperação e avisos do QR).
- [x] notify.ts: family: 4 (IPv4) + segunda tentativa pela porta 587 — commit 6bb5a74
- [x] auth.ts deixou de ter mailer próprio (service gmail, 587, sem limpar espaços) — usa sendMail
- [x] página /reset-password criada (o link do email não abria nada) + dist rebuild — commit 9a1a188
- [x] validação real das compras Google Play — commit 8b96928 (falta ela pôr a chave no Render)
- [ ] confirmar em produção que o email sai depois do redeploy

## 6 Set 2026 — Pagamentos e verificação Google (fechado)

- Validação de compras Google Play: ATIVA em produção.
  - Projeto Cloud: PetisLife (id `petislife`), API "Google Play Android Developer" ativada.
  - Conta de serviço: `id-petslife-compras@petislife.iam.gserviceaccount.com`
  - Permissões no Play Console (Utilizadores e permissões, app PetsLife): Ver informações da app + Ver dados financeiros + Gerir encomendas e subscrições.
  - `GOOGLE_PLAY_SERVICE_ACCOUNT` colocado no Render.
  - Confirmado: GET /api/subscriptions/google-status?pin=2776 -> validacaoLigada:true, pacote com.petislife2.app
  - NOTA: nunca apagar o projeto Cloud "PetisLife" — a chave morre com ele.
  - NOTA: o "Acesso à API" já não existe no menu do Play Console; a conta de serviço liga-se por Utilizadores e permissões.

- Produtos de subscrição arrumados:
  - `premium_mensal`: plano base "mensal" Ativa, 3,99 €, oferta `gratis-3-dias` Ativa. Um só plano base.
  - `premium_anual`: tinha DOIS planos base activos. "anual" (21,90 €) DESATIVADO junto com a oferta `gratis-3-dias`.
    Fica "anual-b" (19,99 €) Ativa com nova oferta `gratis-3-dias-b` Ativa (elegibilidade: nunca tiveram qualquer subscrição).
  - Avisos "níveis de preço antigos" continuam (outros países); Portugal está certo. Sem impacto.

- Email "[Final reminder] Register your apps and signing keys ... before Sep 30, 2026":
  RESOLVIDO SEM AÇÃO. Play Console > Validação de programadores Android > Nomes de pacotes:
  NutriTrack, PetisLife (com.petislife2.app) e PetsLife todas "Registada". Identidade da conta verificada.

- v59 (Guia de Raças: Pogona/Tartaruga separados + Arara-azul + Arara-vermelha) ainda POR COMPILAR — a utilizadora respondeu "Depois digo".
