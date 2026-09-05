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
