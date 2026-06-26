# PetsLife Task — v25 Build

## Estado: BUILD AAB v25 A CORRER (tmux: build_v25)

## ✅ CONCLUÍDO
- lost-pets.tsx — ecrã de animais perdidos/encontrados com formulário
- chat.tsx — chat em tempo real (polling 4s) com bolhas animadas
- weight-chart.tsx — gráfico de peso com barras animadas + histórico
- first-aid.tsx — guia primeiros socorros (estático)
- breed-guide.tsx — guia de raças (estático)
- training-guide.tsx — guia de treino com links YouTube
- pharmacy.tsx — farmácia pet com links zooplus.pt
- chat.ts (API) — CRUD chats + messages
- lost-pets.ts (API) — CRUD posts perdidos/encontrados
- api/index.ts — .route("/chats", chat) + .route("/lost-pets", lostPets) adicionados
- (tabs)/index.tsx — secção "Explorar" com 6 quick actions novas
- (tabs)/health.tsx — secção "Ferramentas" + SectionCard agora navega para routes
- Build web: ✅ sem erros
- Git: commit 2c2917e, pushed to master
- Render: a fazer deploy automático

## 🔄 EM CURSO
- AAB v25 build (versionCode 25, versionName 1.7.0)
- Render deploy (automático por push)

## ⏳ PENDENTE APÓS BUILD
- Upload AAB v25 para gofile/GCS
- Submeter v25 na Play Store
- Corrigir bugs antigos:
  - texto preto Android (backgroundColor: transparent nos inputs)
  - app abre no registo em vez do login
  - vídeos consulta não abrem

## Verificar build:
tail -f /tmp/build_v25.log
AAB output: packages/mobile/android/app/build/outputs/bundle/release/app-release.aab
