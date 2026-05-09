# Vila Emes — Hotel Website

Static marketing site for [Vila Emes](https://vila-emes.pages.dev), a small family-run hotel in Plazh, Durrës, Albania. Run by **Shaban Emes** with his daughter and son since **1998**. Two generations of one family by the sea.

The site is **not** a reservation system — every booking CTA links to **Booking.com**. Other CTAs link to Google Maps, Instagram, WhatsApp, email, and phone.

## Stack

- **Astro 6** — static site generation, TypeScript strict, 4-locale routing
- **Tailwind CSS v4** — `@theme` token block, no JS framework
- **Sharp** — one-shot photo optimization (webp at 3 sizes per source)
- **SVGO** — logo SVG compression
- Fonts: **Cormorant Garamond** (serif), **Inter** (body), **Caveat** (handwritten accents) — all self-hosted via `@fontsource`
- **Cloudflare Pages** — free hosting + auto-build on push to `main`
- No client framework, no backend. Vanilla TS only for: lightbox, lang switcher, mobile nav, FAQ accordion, sticky header, room filter, contact-form mailto compose, reveal-on-scroll

## Pages

| Route | Localized as |
|---|---|
| `/` — single-scroll home (hero · about · trust · rooms preview · gallery · location · contact · FAQ) | `/al/`, `/it/`, `/de/` |
| `/rooms` — 9 rooms with 4-family filter (apartments · deluxe · family · standard), "always included", house rules | `/al/rooms`, `/it/rooms`, `/de/rooms` |
| `/contact` — 5-tile contact strip + minimal mailto form + sidebar + directions + Google Maps + FAQ | `/al/contact`, `/it/contact`, `/de/contact` |

12 pages total.

## Local dev

```bash
npm install        # one-time
npm run dev        # http://localhost:4321
npm run build      # → dist/
npm run preview    # serve dist/
```

## Photo pipeline

Source photos live outside the repo at `/Users/erbandanaj/Downloads/Emes/<folder>/`. To regenerate the optimized webp set:

```bash
node scripts/optimize-photos.mjs
```

Curated picks per slot are documented in `docs/photos-shortlist.md`. Owner reviews that file and the implementer applies one-line import swaps in `src/views/`.

## Editing content

| What | Where |
|---|---|
| English copy (hotel name, hero, about, FAQ, room descriptions) | `src/content/site/en.yaml` |
| Albanian / Italian / German copy | `src/content/site/{al,it,de}.yaml` (start as copies of `en.yaml`; owner translates via Google Translate) |
| Phone, WhatsApp, email, Booking URL, Instagram, Google Maps URLs, ratings, distances | `src/config/site.ts` — **single edit point for the owner** |
| Color tokens, fonts, sunset palette | `src/styles/global.css` (Tailwind v4 `@theme` block) |
| Photo picks per slot | `src/views/HomeView.astro` and `src/views/RoomsView.astro` (top-of-file imports) |

## Project layout

```
src/
├── assets/         # webp photos + optimized hand-drawn logo + palm doodle
├── components/     # 29 Astro components (chrome + sections)
├── config/         # site.ts (constants)
├── content/site/   # en/al/it/de.yaml (Zod-validated via content.config.ts)
├── i18n/           # locale registry + content getter
├── layouts/        # Base.astro (head, scripts, scroll/reveal)
├── pages/          # /, /rooms, /contact + /{al,it,de}/{...}
├── styles/         # global.css with @theme tokens
└── views/          # HomeView, RoomsView, ContactView (compose components)
```

## Documentation

- [`docs/Design_System.md`](docs/Design_System.md) — tokens, layout, typography, buttons, motion rules (extend before adding new patterns)
- [`docs/Emes_Summary.md`](docs/Emes_Summary.md) — hotel/property facts (rooms, amenities, location, ratings)

## Deploy

- Connect this repo to Cloudflare Pages — build command `astro build`, output directory `dist`.
- Every push to `main` rebuilds.
- Until a custom domain is purchased, the canonical URL is `https://vila-emes.pages.dev`. Update `site:` in `astro.config.mjs` and `SITE.url` in `src/config/site.ts` when ready.

## Commands

| Command | Action |
|---|---|
| `npm run dev` | Start dev server at `http://localhost:4321` |
| `npm run build` | Build production site to `dist/` |
| `npm run preview` | Preview the built site locally |
| `node scripts/optimize-photos.mjs` | Regenerate optimized webps from `/Users/erbandanaj/Downloads/Emes/` |
| `./node_modules/.bin/svgo --multipass <path>` | Optimize an SVG in place |

## Claude Code

See [CLAUDE.md](CLAUDE.md) for project skills, gotchas, and dev guidance for [Claude Code](https://www.anthropic.com/claude-code).
