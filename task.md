# PetsLife Fix Tasks — COMPLETED

## DONE ✅
- [x] Category pages: clinicas, petshops, hoteis, tosquiadores, treino, adocao, perdidos, servicos
- [x] Marketplace pills navigate to category pages (router.push on click)
- [x] Jitsi fix: local room URL `https://meet.jit.si/petslife-{id}` when no server URL
- [x] QR Code: fixed URL to `https://petslife.app/pet/{code}` instead of sandbox
- [x] AnimalFact added to: health.tsx, social.tsx (already on index.tsx, category pages)
- [x] backgroundColor transparent on emoji Text elements
- [x] lib/api.ts: added generic get/post helpers + kept hono typed client
- [x] auth.ts: exported baseURL and added getTokenAsync()
- [x] listing/[id].tsx: fixed duplicate alignItems
- [x] SVG types added for PawIcon
- [x] versionCode 17 built + uploaded
- [x] AAB uploaded: https://gofile.io/d/XP6UgB

## REMAINING (not blocking)
- [ ] Railway/Render deploy for stable API URL
  - Once deployed: update app.json extra.apiUrl + WEBSITE_URL in .env
  - Railway tokens (UUID format) rejected by CLI 4.66.0 — try via web UI or Render.com
- [ ] "Aspeto mais fofinho" — some further UI polish could be done
- [ ] Login "sem ligação": works on sandbox, will fail if sandbox restarts without URL update

## AAB INFO
- versionCode: 17
- version: 1.2.0
- signed with release.keystore
- Download: https://gofile.io/d/XP6UgB
