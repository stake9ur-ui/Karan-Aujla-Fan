# KARAN AUJLA — Unofficial 3D Fan Experience

A mobile-first, dark black/red/chrome fan website with a Three.js 3D stage, animated disc, content sections and a Supabase owner dashboard.

## Free stack
- Three.js and GSAP-ready frontend (Three.js loaded from jsDelivr; CSS transitions used for core motion)
- Supabase Auth + Postgres + Storage free tier (subject to current quotas/terms)
- GitHub + Vercel free tiers (subject to current quotas/terms)

## 1. Create Supabase
1. Create a Supabase project.
2. In Authentication > Users, create your owner user with your email and password.
3. Disable public signups in Authentication settings.
4. Open SQL Editor and run `supabase.sql`.
5. In `supabase.sql`, replace BOTH instances of `YOUR_OWNER_EMAIL` with the exact owner email before running.
6. Copy Project URL and anon/public key from Project Settings > API.

## 2. Configure website
Open `config.js` and replace:
- `PASTE_SUPABASE_PROJECT_URL`
- `PASTE_SUPABASE_ANON_KEY`
- `YOUR_OWNER_EMAIL`

The anon/public key is designed for browser use. Never put the Supabase `service_role` key in frontend code.

## 3. Deploy with GitHub + Vercel
1. Create a GitHub repository, for example `karan-aujla-3d-fan`.
2. Upload all files in this folder to the repository root (not the ZIP itself).
3. Import the repository into Vercel.
4. Framework preset: Other. Build command: leave empty. Output directory: `.`.
5. Deploy. After each GitHub commit, Vercel redeploys automatically.

For local testing, serve this folder with any static HTTP server; opening `index.html` as a file may block JavaScript module imports.

## 4. Admin
- Tap ADMIN in the navigation or OWNER LOGIN in the footer.
- Sign in with the owner account created in Supabase.
- Add songs, albums, videos, gallery photos, milestones, concerts, lyrics, awards and fan posts.
- Add media by using a publicly reachable image URL. For a production version, upload images to the `fan-artwork` Supabase bucket and paste their public URLs.
- Delete content from the Live Content list.

## 5. Content and copyright
This is an independent, unofficial fan project and is not affiliated with or endorsed by the artist or management. Use only photographs, logos, artwork, lyrics and videos that you own, have permission to use, or are otherwise licensed to use. Do not upload full copyrighted lyrics without permission. Prefer official YouTube/Spotify embeds and link-outs. Confirm concert dates from official sources before publishing. The sample entries are placeholders, not a verified discography.

## 6. Notes / limitations
- This starter includes a working 3D rotating metallic record and red particle field. Device performance varies; low-end phones may render fewer effects.
- The current admin content form creates and deletes records. Editing existing records and direct file-upload UI can be added as a next iteration; use external licensed image URLs for now.
- Free hosting/database plans have quotas, inactivity rules and changing terms. ₹0 means no paid subscription is required for this starter, not guaranteed unlimited service.
- The 3D disc is an original abstract visual, not official album artwork.
