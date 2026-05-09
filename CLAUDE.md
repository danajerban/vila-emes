# CLAUDE.md

Guidance for [Claude Code](https://claude.ai/code) working in this repo. See [README.md](README.md) for stack, scripts, and structure.

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
- **Vanilla TS only** — no React/Vue/Svelte. Inline `<script is:inline>` for lightbox, lang switcher, mobile nav, FAQ, sticky header, room filter, mailto compose, reveal-on-scroll, hero slideshow.
- **Single owner edit point** — phone, WhatsApp, email, Booking URL, Instagram, Maps, ratings, distances all live in `src/config/site.ts`.

## Key docs

- [docs/superpowers/specs/2026-05-06-vila-emes-site-design.md](docs/superpowers/specs/2026-05-06-vila-emes-site-design.md) — locked design spec
- [docs/superpowers/plans/2026-05-07-vila-emes-implementation-revisions.md](docs/superpowers/plans/2026-05-07-vila-emes-implementation-revisions.md) — canonical v2 plan
- [docs/source-of-truth/booking-content.md](docs/source-of-truth/booking-content.md) — Booking.com source of truth for rooms / distances / ratings
- [docs/photos-shortlist.md](docs/photos-shortlist.md) — photo picks + swap workflow
