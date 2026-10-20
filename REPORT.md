# Aaron Works — build report

Website 52 of 100 · freelancer marketplace · built on the uploaded City Real
Estate template without redesigning it.

## 1. Delivered

**Pages (all requested routes):** `/`, `/freelancers`, `/freelancers/[username]`,
`/jobs`, `/jobs/[id]`, `/post-job`, `/dashboard/client`, `/dashboard/freelancer`,
`/messages`, `/auth/signin`, `/auth/signup`, `/legal/privacy-policy`,
`/legal/terms`, `/legal/cookie-policy`, `/contact`, plus 404, route-level 500
(`app/error.tsx`), root 500 (`app/global-error.tsx`) and a `/500` page.

**API routes (all requested):** `/api/freelancers` (category, rating,
`minRate`/`maxRate`, availability, q), `/api/freelancers/[username]`, `/api/jobs`
(category, budget type, posted date, q), `/api/jobs/[id]`, `/api/jobs/create`,
`/api/proposals/submit`, `/api/messages/send`, `/api/contact`,
`/api/recaptcha/verify`, `/api/signup`, `/api/upload`, `/api/auth/[...nextauth]`.

**Extras that support the brief:** sitemap, robots, Organization JSON-LD,
contact page, cookie settings re-entry point, analytics/speed-insights mounts,
preloader reproduced from the template, `data/runtime.json` dev mirror.

## 2. Template fidelity

- The uploaded template is copied verbatim to `public/template/` — 132 files,
  no renames, no edits. `style.css`, `css/*`, `fonts/*` and `js/*` are untouched.
- The root layout links it first, then the additive layer:
  `<link rel="stylesheet" href="/template/style.css" />` followed by
  `<link rel="stylesheet" href="/aw.css" />`.
- Consequence: the template's `@font-face` blocks (Glyphicons, FontAwesome 4.6.3,
  Flaticon), its Noto Sans `@import`, body size (15px/1.80857), heading scale and
  the lime `#a8cf45` / blue `#076799` palette are reproduced exactly. No Google
  Fonts were added; no system-font fallback was substituted.
- The original preloader (`#preloader`, fixed, lime, 30×30 spinning loader,
  z-index 11000) is rendered by `components/Preloader.tsx` and faded on load,
  mirroring `js/custom.js`.
- All new UI is namespaced under `aw-` classes, so no template selectors are
  redefined. The one global addition is a CSS-variable block scoped to `:root`
  for the new components.
- `.aw-logo`, eyebrow rules and buttons reuse the template palette rather than
  a new brand system. Page composition, spacing and card language follow the
  template's flat, airy look (white cards, thin borders, lime accents).

## 3. Auth, CAPTCHA and consent

- **NextAuth v5 (beta 28)** with credentials + optional Google. JWT sessions
  carry `id`, `role` and `username`; `types/next-auth.d.ts` augments the types.
  Demo logins verified end to end.
- **reCAPTCHA v3 (invisible)** on sign-in, sign-up, post-job, proposal and
  contact. Threshold 0.5, expected actions `signin` / `signup` / `post_job` /
  `proposal` / `contact`.
  Missing keys ⇒ client sends no token and server returns `skipped` (documented
  in the UI), so local previews still work.
- **Cookie consent** per the brief: fixed full-width bottom banner, z-index
  9999, Accept All / Manage Preferences, four toggles with Necessary locked on,
  stored in `localStorage` key `aaron_works_consent`, hides after saving,
  reopenable from the footer. Links to the cookie policy. No decorative
  diamonds/sparkle icons.

## 4. Version deviation and dependency note

- Requested `@vercel/blob@0.29.4` **does not exist** on npm (no 0.29.x was ever
  published). Pinned the current stable **2.8.2** instead; the upload route uses
  `put()` with `access: "public"`, compatible with the v2 API.
- `next-auth@5.0.0-beta.28` declares a peer range of Next 14/15. With Next 16
  this triggers `ERESOLVE`, so `.npmrc` sets `legacy-peer-deps=true`. This is a
  deliberate, documented workaround (not `--force`).
- Node engine is `>=24` with `.nvmrc` = 24. The sandbox ran Node 22.22.3; install
  and build both succeed with an `EBADENGINE` warning only. Engine-strict is
  intentionally off.
- Every other package matches the requested exact version (no carets/tildes),
  including the `postcss`, `sharp` and `sprintf-js` overrides.

## 5. Integration fallbacks (all visible in the UI)

| Integration | Configured | Not configured |
| --- | --- | --- |
| reCAPTCHA | server verify, score ≥ 0.5 | skipped, flagged in helper text |
| Auth secret | `AUTH_SECRET` / `NEXTAUTH_SECRET` | fixed dev secret (never for prod) |
| Google OAuth | button active | button disabled + explanation |
| KV | persistent store | in-memory + `data/runtime.json` mirror |
| Blob | uploads to `aaron-works/jobs/…` | `/api/upload` → 503, posting continues |
| SMTP | nodemailer sends | message stored, 202 with "stored" note |
| Pexels API | build-time fetch possible | committed curated images used |

## 6. Verification performed

- `npx tsc --noEmit` → clean.
- `npm run build` → **compiled successfully**, 15 static pages rendered, all API
  routes and dynamic pages emitted (see route table in build output).
- Dev-server smoke test, every route:

| Route | Status |
| --- | --- |
| `/`, `/freelancers`, `/freelancers/amina-hassan`, `/jobs`, `/jobs/job-001` | 200 |
| `/auth/signin`, `/auth/signup`, `/contact`, all three legal pages | 200 |
| `/post-job`, `/dashboard/client`, `/dashboard/freelancer`, `/messages` | 307 → sign-in when signed out |
| `/nonexistent` | 404 with “This job no longer exists.” |
| `/500` | 500 status by design, renders “Try Again” + WhatsApp |
| `/api/jobs`, `/api/freelancers` | 200 JSON |

- Credentials sign-in through the real NextAuth callback → session contains
  `role: "freelancer"`, correct `id` and `username`; `/dashboard/freelancer`
  then returns 200.
- `POST /api/proposals/submit` → 201, proposal persisted, job proposal count
  incremented, reCAPTCHA reported `skipped`.
- `POST /api/jobs/create` (client session) → 201, job created with slug,
  budget and client snapshot.
- `POST /api/messages/send` → 201, thread/message created (and appends when a
  valid `threadId` is supplied).
- `POST /api/contact` → 200, message stored, SMTP note returned.
- `POST /api/signup` → 201 with new user; `POST /api/upload` without a session →
  401 (503 when signed in but Blob is unconfigured).
- Static assets verified: `/template/style.css` (49 KB), `/aw.css` (51 KB),
  hero image and all 13 seed image paths return 200 and exist on disk.

## 7. Known limitations

- Without KV credentials, data is per-process; a dev-server restart reloads the
  seed (the `data/runtime.json` mirror restores local writes when present).
- Google OAuth cannot be exercised without client credentials; the button is
  present and disabled with an explanatory hint.
- Real email/file delivery requires SMTP and Blob credentials.
- The demo assets are Pexels stock (credits in `image-credits.md`); names,
  reviews and work histories are fictional.
- No headless browser was available in the build sandbox (Chromium needs system
  libraries that could not be fetched), so visual QA was structural: CSS was
  audited against the template's global rules, every class used by a component
  is defined, and all pages/assets were fetched successfully over HTTP. A
  human pass in a real browser is still recommended before launch.
- Rating dots support half states; the seed data uses 4.5–5.0 scores.

## 8. Where things live

```
app/                 routes, layouts, error boundaries, metadata files
components/          header, footer, cards, filters, forms, chat, consent
lib/                 seed data, store, auth, filters, validation, utils
public/template/     original template, verbatim (132 files)
public/images/       curated Pexels photography
public/aw.css        additive component layer
.env.example         every supported environment variable
image-credits.md     per-image Pexels URL, photographer, licence
README.md            setup, routes, env table, accessibility notes
```
