# Task: Corrigir bugs críticos reportados pelo utilizador em produção

## Bugs encontrados e corrigidos
1. [x] **CRÍTICO**: `lib/api.ts` espalhava (`{...honoClient.api}`) um Proxy do Hono client — isso NÃO copia as rotas dinâmicas (pets, businesses, posts, etc.), resultando em `api.pets` (e todos os outros) = undefined em produção. Causa de "Cannot read property '$post' of undefined" em TODOS os formulários (Adicionar Animal, Registar Negócio, Comunidade "Não foi possível publicar", etc.)
   - Fix: exportar `honoClient.api` directamente, sem spread. Confirmado que `api.get`/`api.post` genéricos nunca eram usados em lado nenhum do código.
2. [x] Vídeos de treino (training-guide.tsx) — os 9 IDs de vídeo do YouTube eram inválidos/aleatórios (não eram sobre treino de animais). Substituídos por vídeos reais e válidos em português (PeritoAnimal e outros canais confirmados via pesquisa).
3. [x] Teclado a tapar perguntas — `add-pet.tsx` e `add-vaccine.tsx` não tinham `KeyboardAvoidingView`. Adicionado (mesmo padrão já usado em add-business.tsx/add-listing.tsx).
4. [x] "Escreve-se 2 letras e o teclado fecha" — hipótese: era efeito colateral do bug #1 (Alert de erro a aparecer a meio da digitação, fechando o teclado). A ser confirmado após fix.

## Por fazer
- [ ] Testar bundle (expo web) sem erros de sintaxe
- [ ] Testar fluxo real: adicionar animal, adicionar vacina, publicar post — confirmar que já não dá erro
- [ ] Rebuild AAB v31 (bump version)
- [ ] Commit + push GitHub (o backend também mudou? Não, só mobile desta vez — subscriptions.ts já tinha sido pushed antes)
- [ ] Deliver ao utilizador com explicação clara do que foi a causa raiz

## 2026-08-14 — Correcções servidor (commit 8026ead) — LIVE em produção ✓
- chat.ts reescrito com drizzle (o SQL cru usava tabela `users` e colunas camelCase que não existem; e db.execute não existe no drizzle) → GET /api/chats agora 200
- lost-pets.ts passa a usar `sqlClient` (cliente libsql cru, exportado em database/index.ts)
- teste.screenshots.pl@gmail.com removido de TESTER_EMAILS
- AppLoading: barra de progresso adicionada (0→70% rápido, →95% lento) — PRECISA de build v34
- Verificado em prod: /api/chats 200, POST /api/chats 201, /api/lost-pets 200
