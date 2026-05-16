# PetsLife Task

## Status: COMPLETO ✅

## O que foi feito
- [x] Web landing page (features, pricing, tips, marketplace preview)
- [x] Web sign-in / sign-up
- [x] API completa: pets, vaccines, appointments, health-logs, photos, documents, posts, marketplace, subscriptions, articles, consultations
- [x] Tabela `consultations` no schema + DB push feito
- [x] Mobile auth screens (sign-in, sign-up)
- [x] Mobile tabs: Home, Saúde, Consulta (nova!), Comunidade, Loja, Perfil
- [x] Mobile: consult.tsx — agendar + entrar na videochamada (Whereby link)
- [x] Mobile: add-pet, pet/[id], pet/[id]/health, qr/[code], find-vets, add-listing
- [x] Pricing simplificado: ambos os planos têm tudo igual, só preço diferente
- [x] CTAs atualizados: "Experimente a app grátis 3 dias" / "Experimente grátis 3 dias"
- [x] Feature "Consulta Online" adicionada nas features do site
- [x] TypeCheck passes (mobile + web)
- [x] Dev server a correr em :5173

## Decisões
- Videochamada: gera link Whereby gratuito (sem SDK), abre no browser via Linking.openURL
- Pricing: nenhuma feature exclusiva do anual — só preço diferente (€3.99/mês vs €19.99/ano)
- Trial: 3 dias em ambos os planos
