# CLAUDE.md

Guidance for [Claude Code](https://claude.ai/code) working in this repo. Stack, commands, content map, and layout are in the [Stack & development](#stack--development) section below. See [docs/Design_System.md](docs/Design_System.md) for tokens / layout / type / buttons / motion rules. Hotel/property facts (rooms, amenities, location, ratings) are in `docs/Emes_Summary.md` — **local-only / gitignored**, not in the public repo.

## Skills

**Project** (`.claude/`):

- `astro` — Astro 6 + Tailwind v4 + 4-locale routing, customized for this site
- `seo-expert` — canonical / hreflang / Open Graph / JSON-LD / sitemap / robots
- `seo-audit` — technical / on-page / international SEO audit framework; vendored via skills.sh, so it lives at `.agents/skills/seo-audit/` with a symlink at `.claude/skills/seo-audit` (the two above are hand-authored dirs directly under `.claude/`)

**Plugin** (`.claude/settings.json`):

- `frontend-design@claude-plugins-official`

**Superpowers**: `brainstorming`, `writing-plans`, `executing-plans`, `verification-before-completion`, `systematic-debugging`

## Project gotchas

- **Content-schema edits force a dev restart** — changes to `src/content.config.ts` need `npm run dev` restart; `astro sync` alone isn't enough. Batch schema changes; prefer `.min().max()` over `.length()`.
- **Source photos live outside the repo** — local-only, path set via `PHOTOS_SOURCE` in `.env`. The optimized webps in `src/assets/` are what ship.
- **Room names are English-only across all locales** (`rooms[].name` does not translate — by design).
- **No bathtubs** — every room has shower only; the `bathtub-shower` amenity key is legacy and labels render as "Shower".
- **Bed taxonomy is locale-aware** — AL: `krevat dopio` for all sizes, IT: `doppio` for all, EN/DE preserve queen/full distinction.
- **No reservation system** — every booking CTA links out to **Booking.com**. Other CTAs link to Maps, Instagram, WhatsApp, email, phone.
- **Vanilla TS only** — no React/Vue/Svelte. Inline `<script is:inline>` for lang switcher, mobile nav, FAQ, sticky header, room filter, image carousels, mailto compose, contact link decoder, reveal-on-scroll, hero slideshow.
- **Single owner edit point** — phone, WhatsApp, email, Booking URL, Instagram, Maps, ratings, distances all live in `src/config/site.ts`.

## Stack & development

- **Astro 6** — static site generation, TypeScript strict, four-locale routing (EN / AL / IT / DE)
- **Tailwind CSS v4** — `@theme` token block in `src/styles/global.css`, no JS framework
- **Sharp** — one-shot photo optimization; **SVGO** — logo SVG compression
- Fonts: **Cormorant Garamond** (serif), **Inter** (body), **Caveat** (handwritten) — self-hosted via `@fontsource`
- **Cloudflare Pages** — free hosting, auto-build on push to `main`. Canonical URL `https://www.vilaemes.com` (set in `astro.config.mjs` `site:` and `src/config/site.ts` `SITE.url`); `vila-emes.pages.dev` still resolves and redirects.

### Local dev

```bash
pnpm install --frozen-lockfile  # one-time
pnpm dev                        # http://localhost:4321
pnpm build                      # -> dist/
pnpm preview                    # serve dist/
```

### Editing content

| What | Where |
|---|---|
| English copy (hotel name, hero, about, FAQ, room descriptions) | `src/content/site/en.yaml` |
| Albanian / Italian / German copy | `src/content/site/{al,it,de}.yaml` |
| Phone, WhatsApp, email, Booking URL, Instagram, Maps URLs, ratings, distances | `src/config/site.ts` — **single edit point** |
| Color tokens, fonts, palette | `src/styles/global.css` (Tailwind v4 `@theme` block) |
| Photo picks per slot | `src/views/HomeView.astro`, `src/views/RoomsView.astro` (top-of-file imports) |

### Project layout

```
src/
├── assets/         # webp photos + optimized logo + palm doodle
├── components/     # Astro components (chrome + sections)
├── config/         # site.ts (constants)
├── content/site/   # en/al/it/de.yaml (Zod-validated via content.config.ts)
├── i18n/           # locale registry + content getter
├── layouts/        # Base.astro (head, scripts, scroll/reveal)
├── pages/          # /, /rooms, /contact + /{al,it,de}/{...}
├── styles/         # global.css with @theme tokens
└── views/          # HomeView, RoomsView, ContactView (compose components)
```

### Commands

| Command | Action |
|---|---|
| `pnpm dev` | Dev server at `http://localhost:4321` |
| `pnpm build` | Build production site to `dist/` |
| `pnpm preview` | Preview the built site locally |
| `node scripts/optimize-photos.mjs` | Regenerate optimized webps from `PHOTOS_SOURCE` (`.env`) |
| `pnpm svgo --multipass <path>` | Optimize an SVG in place |

## Image pipeline

Two-stage: pre-build (manual, on demand) + build-time (automatic via Astro).

**Pre-build** (`scripts/optimize-photos.mjs`):

- Source originals live outside the repo (path set via `PHOTOS_SOURCE` in `.env`).
- Sharp 0.33.5 emits **213** WebP files into `src/assets/photos/<category>/` — 71 unique sources × 3 widths (`-800.webp`, `-1600.webp`, `-2400.webp`).
- Largest source: ~860 KB. Total source: 30 MB.

**Build-time** (`astro build`):

- Photo components use Astro's `<Picture>` from `astro:assets` at `quality={72}` with `formats={['avif', 'webp']}` and `fallbackFormat="webp"` (overrides Astro's default PNG fallback — this is what keeps the unused PNG variants out of the build): `Hero`, `About`, `Gallery`, `RoomCarousel` (`RoomCard` delegates to `RoomCarousel`).
- `<Image>` at `quality={82}` is retained for `Footer` (logo, 140px) and `Hero` polaroid (decorative lg+, fixed 420px) — single-width, AVIF buys nothing.
- `loading="eager"` on Hero slide #1 + Gallery slide #1; Hero #1 also gets `fetchpriority="high"`. Everything else `loading="lazy"`.

**Raw `<img>` exceptions** (intentional — vector SVGs in `/public/`, no Astro processing needed):

- `Footer.astro:65-69` — payment-provider SVGs (`/public/payments/`)
- `LangSwitch.astro:24,38,52,70` — flag SVGs (`/public/flags/`)

**Adding new photos**: drop into `src/assets/photos/<subdir>/` using `<name>-{800,1600,2400}.webp`. Astro picks them up automatically. If originals are JPG/PNG, convert with `cwebp -q 82 -resize 2400 0` (then 1600, 800) to match. Run `svgo --multipass` (already in deps) on any new SVGs.

## Doc workflow

- `docs/Design_System.md` (design rules) is the only tracked doc — keep it focused on its domain. `docs/Emes_Summary.md` (hotel facts) is **local-only / gitignored**.
- Active specs/plans live in `docs/superpowers/{specs,plans}/` while in progress (untracked).
- When a spec is done, move it to `docs/archive/` (gitignored) — preserved locally, out of git.
