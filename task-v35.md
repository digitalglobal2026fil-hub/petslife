# PetsLife v35 — plano

## Causa raiz do "sessão expirada" (upload de fotos/docs)
- betterAuth não tinha config de `session` → default do better-auth = expira em 7 dias.
- A sessão guardada no SecureStore sobrevive às actualizações da app (v32 → v34),
  logo a utilizadora abriu a v34 com um token com semanas → 401 em tudo o que exige auth.
- O upload mostrava "Sessão expirada. Faz login novamente." mas nada limpava o token,
  e o logout estava quebrado → ficava presa sem forma de voltar a entrar.
- Servidor testado em produção: POST /api/upload/image com foto de 2,5MB → HTTP 200. O servidor está bom.

## Correcções
1. [x] logout: limpar token primeiro + try/catch + router.replace (commit 3736600)
2. [x] session expiresIn 365 dias + updateAge 1 dia
3. [x] 401 → limpar token e mandar para sign-in automaticamente (auto-recuperação)
4. [x] videochamada: sala PRÓPRIA em /call/:id com WebRTC ponto a ponto
   - meet.jit.si foi ABANDONADO: passou a exigir login de moderador
     ("a conferência ainda não começou porque não chegou nenhum moderador")
     e em Android forçava a instalação da app.
   - Agora: /ws/call (sinalização no nosso servidor) + WebRTC directo entre os
     dois browsers. STUN Google + TURN openrelay para redes fechadas.
   - Testado com 2 browsers reais: vídeo nos dois lados em 1s + chat OK.
   - Bónus: corrigido ./runable.js relativo que dava "Unexpected token '<'"
     em todas as rotas com sub-caminho (/call/*, /pet/*).
5. [ ] datas em DD/MM/AAAA em todos os formulários
6. [ ] QR digitalizado → email + notificação na app + SMS (Twilio)
7. [ ] foto do animal como foto de perfil junto ao nome
8. [ ] guia de raças: cão, gato, aves, roedores(inc. coelho), répteis, aquáticos, quinta
9. [ ] adestramento: "Hamsters e Roedores" → "Roedores" (inclui coelho)
10. [ ] find-vets: "Pets e Outros" + vets, urgências, petshops, serviços
11. [ ] splash universo escuro + logo Digital Global → ecrã branco com barra + marca
12. [ ] bump v35 / versionCode 35, build, upload

- [x] 5. Guia de raças: 38 fichas, 7 categorias (dog/cat/bird/rodent/reptile/aquatic/farm)
- [x] 6. Adestramento: categorias Coelhos+Hamsters fundidas em "🐭 Roedores"
- [x] 7. Localizador: "Vets" -> "Vets e Outros", 13 categorias de pesquisa
- [x] 8. Foto de perfil do animal: toque no avatar (câmara/galeria/remover) em pet/[id]/index.tsx
- [ ] 9. Aviso do QR (email + notificação in-app + SMS Twilio - falta credenciais)
- [ ] 10. Splash universo + AppLoading com marca DigitalGlobal

- [x] 9. Aviso do QR: email (nodemailer, testado OK) + notificacao in-app (/api/pet-scans/mine no ecra Notificacoes, toca para abrir mapa) + SMS Twilio (codigo pronto em api/notify.ts, falta TWILIO_ACCOUNT_SID/TWILIO_AUTH_TOKEN/TWILIO_FROM no Render)
- [x] 10. Splash: BrandIntro (universo escuro + logo Digital Global a entrar) -> AppLoading branco com barra + mascote + "DigitalGlobal"; splash nativo tambem passou a escuro (#05060F) com o logo
- [x] BONUS: /api/users/me nao estava registado no index.ts e a tabela user_profiles nao existia no schema -> ecra Perfil / Editar perfil dava 404. Corrigido e testado (GET/PUT 200).
- [x] 11. v35 / versionCode 35 / 1.9.1 build OK, commit 546a026 pushed, deploy Render confirmado (users/me 401 em vez de 404, /call/x 200)
AAB v35: https://gofile.io/d/N74dvAlu (md5 d5a73e9abd81ef61f7eedb8d8354bea9)

## v36 (1.9.2, versionCode 36) — correccoes apos teste da alpha
Download: https://github.com/digitalglobal2026fil-hub/petslife/releases/download/v1.9.2/petslife_v36.aab

1. [x] LOGIN/LOGOFF BLOQUEADO ("Missing or null Origin") — better-auth exige
   cabecalho Origin quando o pedido traz cookie; a app nativa nao envia Origin.
   Depois do logout ficava impossivel entrar. Corrigido com
   advanced.disableCSRFCheck/disableOriginCheck em api/auth.ts.
   Reproduzido antes (403) e confirmado depois (200), local e em producao.
2. [x] AVISO DO QR nao chegava — duas causas:
   a) o aviso so era enviado se a pessoa carregasse em "Avisar o dono onde estou";
      agora e registado logo ao abrir a pagina do QR (POST automatico) e a
      partilha de localizacao faz PUT no mesmo registo (novo endpoint PUT /:id),
      por isso o dono ve 1 unica entrada e recebe 2 emails no maximo.
   b) o servidor no Render nao tinha GMAIL_USER nem WEBSITE_URL (estavam num
      Environment Group nao ligado ao servico) e a app password tinha espacos;
      SMTP passou a 465 SSL directo com timeouts. Testado: emailSent true.
3. [x] Imagem do ecra branco substituida pela arte PetsLife enviada pela
   utilizadora (assets/petslife-loading.png), fundo branco, 250x285.
4. [x] Diagnostico: GET /api/diag/notify?pin=2776[&to=email&probe=1] mostra se
   Gmail/Twilio estao configurados, envia email de teste e testa portas SMTP.
5. [ ] SMS do QR — falta TWILIO_ACCOUNT_SID/TWILIO_AUTH_TOKEN/TWILIO_FROM.
6. [ ] Avisos da Google (edge-to-edge, orientacao) — adiados pela utilizadora.
7. [ ] Modo escuro — continua de fora.
