# PetsLife — Correções Mobile

## Problemas a corrigir
1. ✅ QR Code URL (já corrigido localmente)
2. ⬜ Upload fotos — servidor só tem /presign (S3), precisa /image (base64 → guarda como data URL ou ficheiro local)
3. ⬜ index.tsx — abre direto para /(tabs) sem verificar sessão (AuthGuard trata mas há flicker)
4. ⬜ Texto preto — já todos têm suppressHighlighting, OK
5. ⬜ Consulta vídeo — OK, usa Linking.openURL para Jitsi
6. ⬜ Esqueci password — verificar se endpoint existe no servidor
7. ⬜ Dicas/curiosidades — já existe AnimalFact, adicionar mais
8. ⬜ Commit + build AAB

## Decisões
- Upload: adicionar rota /api/upload/image que guarda base64 como ficheiro em /tmp e devolve data URL, ou simplesmente guarda a data URL diretamente na BD
- Mais simples: servidor aceita base64, guarda data URL na BD (sem S3 necessário)
