# PetsLife — Guia completo para a Play Console

## 1. Screenshots (pasta store-assets/screenshots/)
Já preparados, 5 imagens 1024x768px (aceite pela Play Store):
- 01-inicio.png — Ecrã principal com acessos rápidos
- 02-saude.png — Gestão de saúde do animal
- 03-primeiros-socorros.png — Guia de emergência
- 04-videochamada.png — Guia de consulta online
- 05-marketplace.png — Marketplace de serviços

**Como usar:** Play Console → Presença na loja → Listagem principal da loja → Gráficos → Telefone → carregar as 5 imagens (mínimo 2, recomendado 4-8).

---

## 2. Ícone / Imagem promocional
- Ícone da app já existe: `packages/mobile/assets/icon.png` (usar tal e qual, 512x512px)
- Imagem em destaque (feature graphic 1024x500px): PRECISA de ser criada — avisa que quero gerar já.

---

## 3. Descrição curta (máx. 80 caracteres)
```
Gestão completa da saúde e bem-estar do seu animal de estimação
```

## 4. Descrição completa (máx. 4000 caracteres)
```
🐾 PetsLife — a vida do seu animal, organizada!

O PetsLife é a app completa para cuidar da saúde, bem-estar e felicidade do seu animal de estimação, tudo num só lugar.

✅ GESTÃO DE SAÚDE
• Boletim de vacinas digital com lembretes automáticos
• Agenda de consultas veterinárias
• Diário de saúde do seu animal
• Registo de desparasitações
• Gráfico de evolução de peso
• Armazenamento de documentos (receitas, exames)

📹 CONSULTA VETERINÁRIA ONLINE
• Marque consultas por videochamada com o seu veterinário
• Sem instalações — funciona directamente no browser
• Guia completo de como usar a videochamada

🆘 GUIAS DE EMERGÊNCIA
• Primeiros socorros para situações urgentes
• Farmácia — medicamentos comuns e onde encontrar
• Guia de raças com informação essencial
• Guia de treino com vídeos e dicas

📍 SEGURANÇA
• QR Code do seu animal para caso se perca
• Lista de animais perdidos e encontrados na sua zona

📸 MEMÓRIAS E COMUNIDADE
• Álbum de fotos do seu animal
• Comunidade para partilhar momentos com outros donos
• Chat com outros utilizadores

🛍️ MARKETPLACE
• Encontre clínicas, petshops, hotéis, tosquiadores e mais
• Pesquise por serviços perto de si

Tudo isto pensado para tornar a vida de quem tem animais de estimação mais fácil, organizada e tranquila.

Descarregue já e comece a cuidar melhor do seu melhor amigo! 🐶🐱
```

---

## 5. Questionário de classificação de conteúdo (Content Rating)
Onde: Play Console → Conteúdo da app → Classificação de conteúdo → Iniciar questionário

**Categoria da app:** Utilitários / Estilo de vida (não é jogo)

Respostas recomendadas (app sem conteúdo sensível):
| Pergunta | Resposta |
|---|---|
| Violência | Não |
| Conteúdo sexual/nudez | Não |
| Linguagem imprópria | Não |
| Referências a drogas/álcool/tabaco | Não |
| Conteúdo de terror/assustador | Não |
| Jogo de azar simulado | Não |
| Partilha de localização com outros utilizadores | **Sim** (função de animais perdidos e QR code usam localização) |
| Interação entre utilizadores (chat/comunidade) | **Sim** |
| Partilha de dados pessoais/conteúdo gerado pelo utilizador | **Sim** (fotos, posts na comunidade) |
| Compras dentro da app | **Sim** (subscrição premium) |

Resultado esperado: **PEGI 3 / Livre para todas as idades**

---

## 6. Formulário de segurança dos dados (Data Safety)
Onde: Play Console → Conteúdo da app → Segurança dos dados

**A app recolhe dados?** Sim

**Tipos de dados recolhidos:**
- Informações pessoais: Nome, Endereço de email
- Localização: Localização aproximada (para função de animais perdidos e clínicas próximas) — **opcional/aproximada**
- Fotos e vídeos: sim (fotos de animais, documentos)
- Informações de saúde do animal (não é dado pessoal do utilizador, mas trate como "outros dados do app")
- Informações financeiras: Histórico de compras (subscrição, processado via Stripe — a app não armazena dados de cartão)
- Mensagens: Sim (chat entre utilizadores)

**Os dados são partilhados com terceiros?**
- Sim, com a Stripe (processamento de pagamentos) — finalidade: processamento de pagamentos

**Os dados são encriptados em trânsito?** Sim
**Os utilizadores podem pedir eliminação dos dados?** Sim (ecrã `delete-account.tsx` já existe no site)

**Finalidade da recolha:**
- Funcionalidade da app (obrigatório para o funcionamento)
- Comunicação com o utilizador (lembretes de vacinas/consultas)
- Personalização

---

## 7. Política de privacidade (URL)
Já está pronta e publicada:
```
https://petslife.onrender.com/privacy
```
Cola este link no campo "URL da política de privacidade".

---

## 8. Público-alvo e conteúdo
Onde: Play Console → Conteúdo da app → Público-alvo

- **Faixa etária:** 18+ (recomendado, já que há chat, comunidade e pagamentos — mais simples de aprovar)
  - Alternativa: "13-17 e mais" se quiser público mais jovem, mas exige mais regras de moderação de conteúdo
- **A app é dirigida a crianças?** Não

---

## 9. Declaração de anúncios / preço / compras in-app
- **A app contém anúncios?** Não
- **A app é gratuita ou paga?** Gratuita (com compras dentro da app)
- **Compras dentro da app:** Sim
  - Subscrição Premium: €3.99/mês ou €19.99/ano
  - Trial gratuito: 3 dias

---

## RESUMO — Ordem de preenchimento na Play Console
1. Presença na loja → Listagem principal → Descrição curta + completa + screenshots + ícone
2. Conteúdo da app → Classificação de conteúdo → questionário (secção 5 acima)
3. Conteúdo da app → Segurança dos dados (secção 6 acima)
4. Conteúdo da app → Política de privacidade → colar URL (secção 7)
5. Conteúdo da app → Público-alvo (secção 8)
6. Conteúdo da app → Anúncios (secção 9)
7. Monetização → Produtos dentro da app (se ainda não configurado, criar produto de subscrição)
8. Enviar para revisão
