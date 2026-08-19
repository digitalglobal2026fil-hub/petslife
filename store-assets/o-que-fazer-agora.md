# PetsLife — o que fazer enquanto esperamos

Tudo o que está nesta lista é **trabalho seu no Play Console ou no email** —
não gasta créditos e não obriga a nova versão da app. Dá para ir fazendo
enquanto a revisão não sai e durante os 15 dias de testes.

---

## 1. Traduzir a ficha da loja  ⏱️ ~30 min · grátis
Os textos já estão escritos em `ficha-loja-idiomas.md` (inglês, espanhol,
alemão, francês, português do Brasil). É só copiar e colar.

Play Console → **Presença na loja** → **Listagem principal da loja** →
**Gerir traduções** → **Adicionar traduções**.

Porque importa: a app v49 já fala 5 idiomas, mas se a página da loja
estiver só em português, o influencer estrangeiro fecha antes de instalar.

---

## 2. Abrir a app aos países dos influencers  ⏱️ 5 min · grátis
Play Console → **Publicação** → **Países e regiões**.

Confirmar que não está só Portugal. O mais simples é escolher **todos os
países**. Sem isto, o influencer alemão nem encontra a app na loja dele.

---

## 3. Criar os produtos de subscrição  ⏱️ ~1 h · grátis
Isto é a metade do "pagamento" que **não** precisa de código meu. Fazer
agora poupa tempo depois.

Play Console → **Monetizar** → **Produtos** → **Subscrições** → **Criar subscrição**

| Campo | Valor |
|---|---|
| ID do produto | `premium_mensal` |
| Nome | Premium mensal |
| Período de cobrança | 1 mês |
| Preço | 3,99 € |
| Período de avaliação gratuita | 3 dias |

E uma segunda:

| Campo | Valor |
|---|---|
| ID do produto | `premium_anual` |
| Nome | Premium anual |
| Período de cobrança | 1 ano |
| Preço | 19,99 € |
| Período de avaliação gratuita | 3 dias |

⚠️ Os IDs têm de ser **exactamente** `premium_mensal` e `premium_anual` —
é a esses nomes que o código vai ligar depois.

---

## 4. Perfil de pagamentos  ⏱️ ~20 min · grátis
Play Console → **Configuração** → **Perfil de pagamentos**.

Preencher os dados fiscais e o IBAN. Sem isto, a Google não pode pagar-lhe
nada, mesmo que as subscrições funcionem. Costuma levar 1 a 2 dias a ser
verificado, por isso vale a pena começar cedo.

---

## 5. Lista de testadores  ⏱️ 10 min · grátis
Play Console → **Testes** → **Teste fechado** → **Testadores**.

A lista está em `testadores.csv`. Precisa de **12 testadores durante 14 dias**
para poder pedir a produção. Convém ter mais do que 12, porque há sempre
quem instale e desapareça.

Lembrete: a sua cunhada veterinária tem de entrar nesta lista para poder
testar a app.

---

## 6. Email à cunhada  ⏱️ 5 min
Para a v50 preciso de:
- Nome completo tal como quer aparecer
- Número de cédula profissional (Ordem dos Médicos Veterinários)
- Confirmação por escrito de que aceita que o nome apareça na app

O terceiro ponto é importante: se a Google pedir prova da alegação
veterinária, é esse email que a justifica.

---

## Fica para depois (precisa de créditos)

| O quê | Quando |
|---|---|
| v50 — dados da cunhada nos avisos veterinários | quando ela responder |
| Google Play Billing no código | com créditos com folga |
| Firebase / notificações com a app fechada | fim do ano |
| Modo escuro | fim do ano |

---

## Já feito e à espera

- **v49 (1.9.14)** compilada com os 5 idiomas, guardada no GitHub
  - AAB: `releases/download/v1.9.14/petslife_v49.aab`
  - APK: `releases/download/v1.9.14/petslife_v49.apk`
- **v48 (1.9.13)** é a que está em revisão na Google
