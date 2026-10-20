# Aaron Works

**Find talent. Get work done.**
A freelancer marketplace for East African businesses and skilled professionals —
Website 52 of 100.

Built with Next.js 16 (App Router), React 19, NextAuth v5, TypeScript and the
original City Real Estate template stylesheet, reproduced verbatim.

---

## Quick start

```bash
npm install        # .npmrc sets legacy-peer-deps for the NextAuth beta peer range
npm run dev        # http://localhost:3000
npm run build      # production build (verified)
npm start          # serve the production build
```

Node ≥ 24 is declared in `package.json` (`.nvmrc` = 24). The project also builds
on Node 22 with an `EBADENGINE` warning.

### Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Client | `client@aaronworks.co.ke` | `Demo1234!` |
| Freelancer | `freelancer@aaronworks.co.ke` | `Demo1234!` |

The demo data layer lives in `lib/seed.ts` and `lib/db.ts`. Without KV
credentials it runs from an in-memory store and mirrors to `data/runtime.json`
(git-ignored) so local writes survive a dev-server restart.

---

## What is in the app

### Pages

| Route | Purpose |
| --- | --- |
| `/` | Hero, 8 category grid, client/freelancer flows, 4 featured freelancers, trust, stats, testimonials, WhatsApp CTA |
| `/freelancers` | Directory with category, rating, rate-range, availability, search and sort filters |
| `/freelancers/[username]` | Profile: bio, skills, portfolio, work history, reviews, rate, availability, hire panel |
| `/jobs` | Job board with category, budget-type, posted-date, search and sort filters |
| `/jobs/[id]` | Brief, skills, budget, deadline, client card, proposal form |
| `/post-job` | Session-gated job composer with Blob attachments and reCAPTCHA v3 |
| `/dashboard/client` | Active jobs, proposals, hired freelancers, payment history, escrow |
| `/dashboard/freelancer` | Proposals, contracts, earnings chart, profile completion |
| `/messages` | Session-gated threaded text messaging |
| `/auth/signin`, `/auth/signup` | Credentials + Google OAuth, react-hook-form + zod, role selection |
| `/legal/privacy-policy`, `/legal/terms`, `/legal/cookie-policy` | Kenya DPA 2019-aware legal pages |
| `/contact` | Contact form (reCAPTCHA + nodemailer) |
| `404`, `500`, `global-error` | Briefcase "This job no longer exists." · Try Again + WhatsApp |

### API

`GET /api/freelancers` · `GET /api/freelancers/[username]` · `GET /api/jobs` ·
`GET /api/jobs/[id]` · `POST /api/jobs/create` · `POST /api/proposals/submit` ·
`POST /api/messages/send` · `POST /api/contact` · `POST /api/recaptcha/verify` ·
`POST /api/signup` · `POST /api/upload` · `* /api/auth/[...nextauth]`

All mutating endpoints validate with zod, require a session where relevant, and
pass through Google reCAPTCHA v3 when keys are configured.

### Template fidelity

The original template is preserved byte-for-byte in `public/template/` (132
files: `style.css`, `css/`, `fonts/`, `js/`, images). It is linked from the root
layout in its original order:

```html
<link rel="stylesheet" href="/template/style.css" />
<link rel="stylesheet" href="/aw.css" />
```

This keeps every `@font-face` rule, the Noto Sans import, the colour palette
(lime `#a8cf45`, blue `#076799`), heading scale and the original preloader
intact. `public/aw.css` is an additive component layer — it never replaces or
edits template rules, so fonts and weights cannot drift.

The template's preloader markup is reproduced by `components/Preloader.tsx` and
faded on load exactly like `js/custom.js`.

### Cookie consent

`components/CookieConsent.tsx` renders a full-width bottom banner (z-index 9999)
with **Accept All** / **Manage Preferences**, plus a modal with four toggles:

- Necessary — always on, locked
- Functional / Analytics / Marketing — off by default

The choice is stored in `localStorage` under **`aaron_works_consent`** with a
timestamp. The banner hides once a choice is saved and can be reopened from the
footer's “Cookie settings” link.

### CAPTCHA

Google reCAPTCHA v3 (invisible) is wired to sign-in, sign-up, job posting,
proposals and contact. The client helper lazy-loads the script and returns `null` when
`NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is missing; the server verifier reports
`{ skipped: true }` when `RECAPTCHA_SECRET_KEY` is missing, so local demos work.
Threshold: score ≥ 0.5.

---

## Environment

Copy `.env.example` to `.env.local`. Everything is optional for a local demo:

| Area | Vars | Fallback when unset |
| --- | --- | --- |
| Site | `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER` | `aaronworks.co.ke`, `254112272061` |
| reCAPTCHA | `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY` | verification skipped |
| Auth | `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | dev secret; Google button disabled |
| Images | `PEXELS_API_KEY` | curated images already committed |
| KV | `KV_REST_API_URL`, `KV_REST_API_TOKEN` | in-memory store + `data/runtime.json` |
| Blob | `BLOB_READ_WRITE_TOKEN` | `/api/upload` → 503, posts continue without files |
| SMTP | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | message stored, email not sent |

Secrets are read server-side only (`PEXELS_API_KEY`, `RECAPTCHA_SECRET_KEY`,
SMTP and KV/Blob tokens never reach the browser).

---

## Responsive & accessibility notes

- Breakpoints at 1080 / 960 / 760 / 560 px; grids collapse to one column.
- Skip link (`.aw-skip`) to `#main`, visible on focus.
- Focus-visible outlines on buttons, links, inputs and toggles.
- Filters and modal toggles use native form controls with labels and
  `aria-pressed`; the cookie modal traps nothing but closes on Escape/overlay.
- Ratings are filled circles (`RatingDots`), never stars.
- Motion respects `prefers-reduced-motion` (hover transforms and preloader fade).
- Images use `next/image` with explicit sizes; `images.remotePatterns` allows
  `images.pexels.com` for future remote swaps.

## Image credits

See [image-credits.md](./image-credits.md) — each file, Pexels URL, photographer
and licence. All human subjects are Black / East African or of African descent.

## Deployment

`vercel.json` pins the framework, `.next` output, `cdg1` region and security
headers (`X-Frame-Options: DENY`, `nosniff`, `strict-origin-when-cross-origin`,
HSTS, restrictive `Permissions-Policy`). Set the environment variables above in
the Vercel project, connect KV/Blob if you want persistence and uploads, and
deploy.
