# CulturInd.ai — Kila's storybook

A redesign of the supplied React application, retaining its routes, bilingual content and Supabase integration. The original Kila image is the canonical mascot throughout. See `ART_DIRECTION.md` for the illustration system and `DELIVERY_REPORT.md` for changes, checks and limitations.

## Run locally

Use Node.js 22.12 or newer (Node 24.12 was used for validation) and npm.

```powershell
npm ci
npm run dev
```

Open the Local URL printed by Vite. Guest exploration works without configuring an account service. Progress is browser-local and can be lost if browser storage is cleared or unavailable.

## Enable the existing account integration

```powershell
Copy-Item .env.example .env
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env` to your Supabase project's URL and public anon/publishable key. These values are intentionally public in the browser. Never use a service-role key or any secret key here. The modified source ZIP excludes the active `.env`; the separately preserved original archive retains the originally supplied configuration.

Use the existing migration in `supabase/migrations/` for your own configured project if the tables do not exist. Inspect it before applying it; this redesign did not run a migration against any live database. The SQL defines owner-scoped RLS policies. Configure email confirmation, recovery redirect URLs and site URLs in Supabase for the hostname you will use. A read-only health request to the originally supplied auth service returned 200; this does not verify account creation, email delivery, table availability, RLS enforcement or synchronization.

The existing email/password flows remain. Live sign-up, sign-in, recovery and cross-device progress were not exercised against real accounts. The original password-reset request flow is retained; a complete post-reset password-edit screen is still outstanding.

## Validate and build

```powershell
npm run typecheck
npm run build
npm run preview -- --host 127.0.0.1
npm audit
```

`dist/` contains a static build. Serve it with an HTTP server rather than opening `index.html` using a file URL. Navigation uses hash routes such as `/#/gallery`, so basic static hosting does not need a route rewrite. Unknown hash routes show a recovery page. The prebuilt files included in delivery use the originally supplied public Supabase configuration; rebuild after changing `.env`.

The `.openai/hosting.json` manifest identifies the private Sites preview created for this project. Keep its identifier when updating that same Site; use a new registration for a separately hosted copy. No hosted service credentials are stored in the repository.

## What is implemented

- Shared pastel design system, responsive navigation and illustrated artwork across all existing pages.
- The unchanged original Kila PNG through one `KilaMascot` component.
- Preserved English and Indonesian Analytical Exposition, with its original argument labeled as the author's viewpoint.
- Searchable cultural gallery, filters, image enlargement and browser read-aloud controls.
- Story reading, a Timun Mas branching adventure, quiz, matching and keyboard-friendly word sorting.
- Profile-scoped local learning progress and corrected Supabase progress serialization. Local and remote save failures receive visible feedback.
- An Outfit Studio learning moodboard with local notes, restoration and a real text download.
- A self-paced dance guide with an explicit review-completion action and an optional camera mirror for eligible signed-in profiles. No simulated movement scores.
- Accessible dialogs, focus handling, keyboard cards, high contrast, text size and reduced-motion settings.

## Service boundaries

Kila currently uses locally prepared, source-linked cultural notes. It is clearly labeled as a local guide; no live generative AI endpoint is configured. To add one, use a server endpoint, keep keys server-side, add source-aware responses and test errors before changing this label. Never place an AI secret in a `VITE_*` variable.

The supplied application had no genuine standalone translation service, live media library, recipe module or working AI outfit generator. Its original EN/ID interface and supplied translations remain. Do not interpret them as a general-purpose translator.

Community, club and moderation screens are labeled local demonstrations. Their sample people, posts, member counts and queues are fictional. Actions do not publish, report, moderate or message real people. Public community services need a real backend and server authorization before launch.

Dance camera access is optional, starts only after user consent and browser permission, and stops on page exit, tab hiding or the timeout. The application does not contain a camera recording or upload path. Physical-device camera behavior and audible speech quality were not verified. The guides are introductory text, not complete or authenticated choreography. Cultural summaries and illustrations still require broader community review before authoritative educational use.

## Recovery

The delivery archive includes `backup/original-project.zip`, an untouched copy of the supplied ZIP. `ORIGINAL_README.md` preserves the original project's documentation. No original archive was overwritten.
