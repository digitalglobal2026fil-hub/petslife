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
