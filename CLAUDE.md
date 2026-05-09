# CLAUDE.md

Guidance for [Claude Code](https://claude.ai/code) working in this repo. See [README.md](README.md) for stack, scripts, and structure, [docs/Design_System.md](docs/Design_System.md) for tokens / layout / type / buttons / motion rules, and [docs/Emes_Summary.md](docs/Emes_Summary.md) for hotel/property facts (rooms, amenities, location, ratings).

## Skills

**Project** (`.claude/`):

- `astro` — Astro 6 + Tailwind v4 + 4-locale routing, customized for this site
- `seo-expert` — canonical / hreflang / Open Graph / JSON-LD / sitemap / robots

**Plugin** (`.claude/settings.json`):

- `frontend-design@claude-plugins-official`

**Superpowers**: `brainstorming`, `writing-plans`, `executing-plans`, `verification-before-completion`, `systematic-debugging`

## Project gotchas

- **Content-schema edits force a dev restart** — changes to `src/content.config.ts` need `npm run dev` restart; `astro sync` alone isn't enough. Batch schema changes; prefer `.min().max()` over `.length()`.
- **Source photos live outside the repo** at `/Users/erbandanaj/Downloads/Emes/<folder>/`. The optimized webps in `src/assets/` are what ship.
- **Room names are English-only across all locales** (`rooms[].name` does not translate — by design).
- **No bathtubs** — every room has shower only; the `bathtub-shower` amenity key is legacy and labels render as "Shower".
- **Bed taxonomy is locale-aware** — AL: `krevat dopio` for all sizes, IT: `doppio` for all, EN/DE preserve queen/full distinction.
- **No reservation system** — every booking CTA links out to **Booking.com**. Other CTAs link to Maps, Instagram, WhatsApp, email, phone.
- **Vanilla TS only** — no React/Vue/Svelte. Inline `<script is:inline>` for lang switcher, mobile nav, FAQ, sticky header, room filter, gallery carousel, mailto compose, reveal-on-scroll, hero slideshow.
- **Single owner edit point** — phone, WhatsApp, email, Booking URL, Instagram, Maps, ratings, distances all live in `src/config/site.ts`.

## Image pipeline

Two-stage: pre-build (manual, on demand) + build-time (automatic via Astro).

**Pre-build** (`scripts/optimize-photos.mjs`):

- Source originals live outside the repo at `/Users/erbandanaj/Downloads/Emes/<folder>/`.
- Sharp 0.33.5 emits **213** WebP files into `src/assets/photos/<category>/` — 71 unique sources × 3 widths (`-800.webp`, `-1600.webp`, `-2400.webp`).
- Largest source: ~860 KB. Total source: 30 MB.

**Build-time** (`astro build`):

- Photo components use Astro's `<Image>` from `astro:assets`: `Hero`, `About`, `Gallery`, `RoomCarousel`, `Footer` (`RoomCard` delegates to `RoomCarousel`).
- Fixed `quality={82}` everywhere.
- `loading="eager"` on Hero slide #1 + Gallery slide #1; Hero #1 also gets `fetchpriority="high"`. Everything else `loading="lazy"`.

**Raw `<img>` exceptions** (intentional — vector SVGs in `/public/`, no Astro processing needed):

- `Footer.astro:65-69` — payment-provider SVGs (`/public/payments/`)
- `LangSwitch.astro:24,38,52,70` — flag SVGs (`/public/flags/`)

**Adding new photos**: drop into `src/assets/photos/<subdir>/` using `<name>-{800,1600,2400}.webp`. Astro picks them up automatically. If originals are JPG/PNG, convert with `cwebp -q 82 -resize 2400 0` (then 1600, 800) to match. Run `svgo --multipass` (already in deps) on any new SVGs.

## Doc workflow

- `docs/Emes_Summary.md` (hotel facts) and `docs/Design_System.md` (design rules) are the only tracked docs — keep each focused on its domain.
- Active specs/plans live in `docs/superpowers/{specs,plans}/` while in progress (untracked).
- When a spec is done, move it to `docs/archive/` (gitignored) — preserved locally, out of git.
