# v51 — traduções (1.9.16 / versionCode 51)

## Feito (tsc a 0 erros em cada passo)
- pt-BR removido (5 idiomas: PT, EN, ES, FR, DE)
- catalog-guias.ts — 760 chaves (Primeiros Socorros, Farmácia, Adestramento, Raças)
- catalog-ecras.ts ligado ao catalog.ts
- Ecrãs envolvidos em tr(): first-aid, pharmacy, training-guide, breed-guide,
  find-vets, video-call-guide, (tabs)/marketplace, marketplace/[slug],
  add-document, missions, (tabs)/consult, add-vaccine, reports, notifications

## A fazer
- [ ] admin.tsx
- [ ] add-business.tsx
- [ ] add-listing.tsx
- [ ] (tabs)/profile.tsx
- [ ] promo-code.tsx
- [ ] add-appointment.tsx
- [ ] (tabs)/health.tsx
- [ ] edit-profile.tsx
- [ ] add-diary.tsx
- [ ] add-pet.tsx
- [ ] bumpar 1.9.16 / 51 em app.json + android/app/build.gradle
- [ ] APK + AAB (tmux, /tmp/build51.sh)
- [ ] commit + push + GitHub Release
- [ ] avisar: faltam 12 testadores × 14 dias para Produção

## Regras
- Não usar async-storage, expo-notifications, expo-device, expo-localization
- Filtros do pharmacy comparam a chave PT — não mexer
- Nomes de raças ficam em PT
- Correr /tmp/dedup.py depois de cada bloco novo
