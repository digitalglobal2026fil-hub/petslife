# PetsLife v53 — em curso (28 Ago 2026)

Decisões dela: **B** (planos base novos 3,28 €/16,30 € na consola → 3,99 €/19,99 € finais;
NÃO mexer nos FALLBACK da app) + **cartaz de animal perdido incluído**.

## Feito
- [x] first-aid.tsx: Hemorragias, Engasgos, Intoxicação ou Envenenamento reescritos com os textos dela
- [x] first-aid.tsx: cartão novo **Queimaduras**
- [x] breed-guide.tsx: +58 fichas (38 cães inc. 4 raças portuguesas, 10 gatos, outros)
- [x] tsc mobile = 0 erros depois das raças
- [x] lost-pets.ts (API): ALTER TABLE photo1/photo2/petId + POST aceita-os
- [x] lost-pets.tsx: imports Share/uploadImage/pickImageWithChoice

## A fazer
- [ ] lost-pets.tsx: escolher animal, até 2 fotos, texto livre, Partilhar (WhatsApp/FB), "Já encontrei"
- [ ] remover MOCK_POSTS (Bolinha/Mimi)
- [ ] tsc mobile + web = 0 erros
- [ ] bump 1.9.18 / versionCode 53 (app.json linha 34, build.gradle 95/96)
- [ ] build APK + AAB (/tmp/build53.sh, ~5 min, NUNCA prebuild)
- [ ] verificar BILLING no manifesto fundido
- [ ] commit + tag v1.9.18 + GitHub Release com os 2 ficheiros
- [ ] avisar e acabar (não esperar redeploy do Render)

## Lembretes para ela
- Nome "PetisLife" → corrigir na Ficha da loja (Editar ficha predefinida)
- Contador dos 12 testadores: Testar e lançar → Produção
- Criar planos base `mensal-b` 3,28 € e `anual-b` 16,30 €, activar e desactivar os antigos
