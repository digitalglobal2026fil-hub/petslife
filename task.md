# PetsLife v54 — em curso (29 Ago 2026)

Luz verde dela para os 8 pontos numa só compilação. Fotos das raças = Wikimedia Commons.

## Lista
- [x] 1. AppLoading: patinhas de várias cores a andar pela parte branca
- [x] 2. Adoções na grelha do Início (abre /category/adocao)
- [x] 3. Farmácia: Frontline Combo, Advantix, Seresto, Bravecto, Simparica, NexGard,
        Drontal, Milbemax, champô/coleira antipulgas, vitaminas, ouvidos/olhos,
        pasta de dentes, cicatrizante, soro fisiológico
- [x] 4. Partilhar + Imprimir em todas as imagens (expo-print + expo-sharing)
- [x] 5. Clínicas/vets NÃO são 24h — só hospitais veterinários
- [x] 6. Primeiros socorros: convulsões (tirar "esperar que passe" → ir já ao vet);
        engasgos (tirar "não force o objecto para baixo")
- [x] 7. Bonequinhos das curiosidades todos animados
- [x] 8. Fotos reais das 96 raças (Wikimedia Commons, redimensionadas, em assets)
- [x] tsc mobile + web (0 erros nos dois, 29 Ago)
- [ ] bump 1.9.19 / versionCode 54, build APK+AAB, GitHub Release

## Regras
NUNCA prebuild. NUNCA db:push. NUNCA async-storage. NUNCA expo-notifications.
Build: /tmp/build54.sh (sed do build53.sh). Release por GitHub API.

## Feito na v54
1. AppLoading: 9 patinhas coloridas a atravessar a zona branca (components/AppLoading.tsx)
2. Adoções na grelha do Início -> /category/adocao
3. Farmácia: 26 produtos (era 10)
4. Partilhar + Imprimir: lib/share-image.ts (expo-print 15.0.8 + expo-sharing 14.0.8)
   aplicado em: pet/[id]/photos, documentos, receitas, vaccines, qr/[code],
   e "Imprimir cartaz" em lost-pets (cartaz em HTML com fotos)
5. find-vets: "Hospitais 24h" + texto a explicar que só hospitais são 24h
6. Primeiros socorros: convulsões e engasgos corrigidos
7. Curiosidades: AnimatedPet em vez de PetIllustration + emoji com balanço (WobbleEmoji)
8. 111 fotos reais (Wikipédia/Wikimedia, 400x400, 4.1 MB) em assets/breeds/,
   campo photo: require(...) em cada ficha; foto na lista e na ficha detalhada

## v55 (em curso, ainda não compilada)
1. breed-guide: "Rafeiro / Cão sem raça" → "Raça indefinida"; Westie sem escovagem repetida
2. pharmacy: chips com emoji e sem nomes cortados; produtos agrupados por categoria; categorias vazias escondidas
3. Início: "Diário de Saúde" e "Diário do Animal" novos; "Animais Perdidos"
4. marketplace: saíram Adoções e Perdidos (abrem-se pelo Início)
5. training-guide: só reforço positivo, peitoral obrigatório, cartão verde de aviso
6. 111 fotos de raças refeitas: animal INTEIRO na moldura (sem corte), foto certa via títulos da Wikipédia; Akita Inu e Pombo Doméstico trocados (colagem/desenho)
7. Mosaico em store-assets/mosaico/folha1-4.jpg — À ESPERA DE APROVAÇÃO DELA antes de compilar
8. PENDENTE: verificar os 18 vídeos do YouTube em training-guide (perguntar antes)
