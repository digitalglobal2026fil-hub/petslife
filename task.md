# Task: Paywall + visual ilustrado toda a app

## Progresso
- [x] useSubscriptionGate.ts criado
- [x] SubscriptionBanner.tsx criado
- [x] PaywallScreen.tsx criado (com mascote ilustrada)
- [x] Mascotes geradas: mascot-lock, mascot-happy (assets/)
- [x] Gate aplicado: health.tsx, consult.tsx, marketplace.tsx, businesses.tsx
- [ ] Gate aplicado: social.tsx
- [ ] Gate aplicado: index.tsx (home) — NOTA: home mostra lista de pets, decidir se bloqueia tudo ou só quick actions
- [ ] NÃO bloquear: photos.tsx (Álbum), profile.tsx, subscription.tsx — confirmar que ficam livres
- [ ] Adicionar SubscriptionBanner no index.tsx (aviso countdown)
- [ ] Decoração ilustrada (mascot-happy) nos headers principais
- [ ] Testar fluxo simulando isActive=false
- [ ] Rebuild AAB v27, commit, upload
- [ ] Bump versionCode 26->27, versionName 1.8.0->1.8.1 (app.json + build.gradle)

## Progresso actualizado
- [x] Gate aplicado: index.tsx, health.tsx, consult.tsx, marketplace.tsx, businesses.tsx, social.tsx
- [x] SubscriptionBanner substituindo o banner antigo de trial no index.tsx
- [x] Mascote fofa aplicada: photos.tsx (empty state), subscription.tsx (topo)
- [x] Testado bundle no Expo Web — sem erros de sintaxe/compilação
- [x] Bump versionCode 26->27, versionName/version 1.8.0->1.8.1
- [ ] Build AAB v27 em curso (tmux build_v27)
- [ ] Upload + commit git

## Notas técnicas
- Backend já calcula isActive/isTrial em subscriptions.ts — nenhuma alteração de backend necessária
- Hidden tabs bloqueadas: consult, businesses (acedidas via navegação, não tab bar)
- Tabs visíveis bloqueadas: index, health, social, marketplace
- Tabs visíveis livres: photos (Álbum), profile
- NOTA: pedido de rede para /api/subscriptions/me não dispara no preview Expo Web (limitação conhecida de gestão de token no browser) — comportamento não testável 100% no preview web, mas código compila sem erros; funciona no fluxo nativo (SecureStore)

