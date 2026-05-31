# PetsLife Bug Fixes (AAB v19)

## Status
- [ ] Fix 1: Login blank error dialog
- [ ] Fix 2: Black shadow on text labels (sombra preta)
- [ ] Fix 3: Reset password email not arriving (needs Resend key)
- [ ] Fix 4: Buttons cut off at bottom (safe area)
- [ ] Build AAB v19
- [ ] Upload to gofile + Play Store

## Root Causes
1. Login: `res.error.message` may be undefined — need fallback chain
2. Black shadow: `elevation` + `shadowColor: "#000"` on tab bar and cards on Android
   - Tab bar: elevation:12, shadowColor:"#000"
   - Cards: various elevation values
   - Fix: lower elevation or use `shadowColor` with lighter color
3. Email: Better Auth emailAndPassword has no `sendResetPassword` callback
   - Need Resend API key from user
4. Safe area: sign-in uses edges=["top","left","right"] — missing bottom
   - ScrollView contentContainer needs paddingBottom with insets.bottom

## Files to Edit
- packages/mobile/app/(auth)/sign-in.tsx — fix 1, 4
- packages/mobile/app/(auth)/sign-up.tsx — fix 4
- packages/mobile/app/(auth)/forgot-password.tsx — fix 4
- packages/mobile/app/(tabs)/_layout.tsx — fix 2 (elevation)
- packages/web/src/api/auth.ts — fix 3 (email)
- packages/web/.env — add RESEND_API_KEY

## Notes
- versionCode currently 18, will become 19
- Server: https://petslife.onrender.com
