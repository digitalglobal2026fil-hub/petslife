# PetsLife Bug Fix Session

## Bugs a corrigir agora

1. ✅ add-pet.tsx - teclado fecha (Input dentro do componente) - CORRIGIDO
2. 🔧 QR code em ucraniano - petslife.app aponta para site ucraniano; usar URL do servidor próprio
3. 🔧 Videochamada não envia link - roomUrl gerado mas não enviado; mostrar link no ecrã imediatamente após agendar
4. 🔧 Teclado tapa a escrita - falta KeyboardAvoidingView nos modais/forms (consult.tsx modal)
5. 🔧 keyboardType="numeric" em datas/horas - bloqueia traços e dois pontos; mudar para "default"
6. 🔧 Upload não mostra o que foi colocado (add-document.tsx) - já mostra se for imagem; OK
7. 🔧 Álbum de fotos - criar ecrã de álbum por animal (rota /photos existe no backend)
8. 🔧 Anúncio dá JSON Parse error - price é notNull() mas pode chegar undefined; corrigir no backend E no frontend
9. 🔧 add-listing.tsx - Field component dentro do render = mesmo bug do teclado!

## Estado
- API URL: https://qx7w0z1uul79my5hxm5d2-preview-4200.runable.site/
- QR code da app aponta para petslife.app que está em ucraniano (não é o nosso site)
