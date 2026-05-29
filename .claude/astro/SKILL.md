---
name: astro
description: Skill for building with the Astro web framework, customized for the Vila Emes hotel site (Astro 6, Tailwind v4, 4-locale subdir routing, static SSG, Cloudflare Pages). Use when working with .astro files, locale routing, content collections, photo pipeline, or build/deploy concerns in this repo.
license: MIT
metadata:
  authors: "Astro Team (upstream) + Vila Emes customization"
  version: "0.0.2-vila-emes"
  upstream_source: "astrolicious/agent-skills (skills-lock.json hash will desync after local edits — expected)"
---

# Astro Usage Guide — Vila Emes edition

**Always consult [docs.astro.build](https://docs.astro.build) for the latest API.** Use the context7 MCP for current Astro docs before non-trivial changes.

Astro is the web framework for content-driven websites. This file is the upstream Astro skill *plus* a Vila Emes context block so guidance lands on the right files in this repo.

---

## Project context — Vila Emes

| Aspect | Reality |
|--------|---------|
| Astro version | `^6.3.0` (from `package.json`); Node `>=22.12.0` |
| Output mode | **Static SSG only** — no SSR adapter, no server functions |
| Styling | Tailwind v4 via `@tailwindcss/vite` (no `@astrojs/tailwind`); `@theme` token block in `src/styles/global.css` |
| i18n | `astro.config.mjs` `i18n: { defaultLocale: "en", locales: ["en","al","it","de"], routing: { prefixDefaultLocale: false } }`. Locale registry + helpers live in `src/i18n/locales.ts`. EN is unprefixed; others get `/al`, `/it`, `/de` prefix. **Note:** `al` is the URL key, but BCP 47 is `sq` (mapped via `LOCALE_TO_LANG`). |
| Pages → views | Page files in `src/pages/{,al,it,de}/{index,rooms,contact}.astro` are thin shells — they import a single `*View.astro` from `src/views/` and pass `lang`. Edit views, not pages. |
| Single source of truth | Phone, WhatsApp, email, Booking URL, ratings, distances, etc. live in `src/config/site.ts`. **The owner edits this one file** — never duplicate values into YAML. |
| Localized copy | `src/content/site/{en,al,it,de}.yaml` — parallel structure across locales, loaded via `getSite(lang)` in `src/i18n/content.ts`. |
| View Transitions | `<ClientRouter />` is mounted in `src/layouts/Base.astro` `<head>`. All initialisation listens on `astro:page-load`, not `DOMContentLoaded`, to survive client-side nav. |
| No client framework | Vanilla TS only (lightbox, lang switcher, mobile nav, FAQ, sticky header, room filter, mailto compose, reveal-on-scroll). |
| Photo pipeline | `node scripts/optimize-photos.mjs` reads `$PHOTOS_SOURCE/<folder>/` (set in `.env`) and writes 3-size webp into `src/assets/photos/`. Curated picks documented in `docs/photos-shortlist.md`. |
| Hosting | Cloudflare Pages, auto-build on push to `main`. Site URL `https://www.vilaemes.com`. CF Pages preview also lives at `vila-emes.pages.dev` (redirect to canonical once domain is live). |
| Local dev | `pnpm dev` → `http://localhost:4321`. iOS-only bugs: tunnel via ngrok; `vite.server.allowedHosts` already permits `.ngrok-free.app`. |

---

## Quick Reference

### File Location
CLI looks for `astro.config.js`, `astro.config.mjs`, `astro.config.cjs`, and `astro.config.ts` in: `./`. Use `--config` for custom path.

### CLI Commands

- `pnpm exec astro dev` - Start the development server.
- `pnpm exec astro build` - Build your project and write it to disk.
- `pnpm exec astro check` - Check your project for errors.
- `pnpm exec astro add` - Add an integration.
- `pnpm exec astro sync` - Generate TypeScript types for all Astro modules.

**Re-run after adding/changing plugins.**

### Project Structure (this repo)

Generic [project structure docs](https://docs.astro.build/en/basics/project-structure) apply, but the actual layout here is:

```
hotel-vila-emes/
├── astro.config.mjs            # i18n + tailwindcss vite plugin + ngrok allowedHosts
├── tsconfig.json               # strict TS
├── package.json                # Astro 6, Tailwind v4, sharp, svgo
├── public/
│   ├── favicon.svg / favicon.ico
│   ├── og-image.jpg            # 1200×630, served from SITE.url
│   └── flags/                  # locale switcher icons
├── scripts/
│   └── optimize-photos.mjs     # one-shot webp pipeline (3 sizes per source)
├── src/
│   ├── pages/                  # thin route shells — import a View
│   │   ├── {index,rooms,contact}.astro          # English (unprefixed)
│   │   └── {al,it,de}/{index,rooms,contact}.astro
│   ├── views/                  # full-page composition (HomeView, RoomsView, ContactView)
│   ├── layouts/Base.astro      # <head>, <ClientRouter />, global init script
│   ├── components/             # vanilla .astro components, no JS framework
│   ├── content/site/{en,al,it,de}.yaml   # all localized copy
│   ├── content.config.ts       # content collection schema
│   ├── i18n/
│   │   ├── locales.ts          # LOCALES, LOCALE_TO_LANG, localizedPath, stripLocalePrefix
│   │   └── content.ts          # getSite(lang) loader
│   ├── config/site.ts          # SITE: contact, links, ratings, distances — owner-editable
│   ├── styles/global.css       # Tailwind v4 @theme block
│   └── assets/photos/...       # generated webp output (do not hand-edit)
└── docs/                       # owner-facing notes (photos-shortlist.md, etc.)
```

Conventions:
- **Add a new page** → create the file in `src/pages/` AND in each `src/pages/{al,it,de}/` (same filename), each thin-wrapping a new view. Don't try to make one shared `[lang]` route — the project intentionally uses subdir routing without a dynamic locale segment.
- **Add localized copy** → add the key to all four YAMLs in `src/content/site/`. Out-of-sync keys break TS at view-render time.
- **Change a phone number / URL / rating** → `src/config/site.ts`, never the YAMLs.

---

## Core Config Options

| Option | Notes |
|--------|-------|
| `site` | Final deployed URL. Used to generate sitemaps and canonical URLs. **`https://www.vilaemes.com`** — keep in lockstep with `SITE.url` in `src/config/site.ts`. |
| `i18n.locales` / `defaultLocale` | `["en","al","it","de"]` / `"en"`. URL key `al` ≠ BCP 47 `sq` — see `LOCALE_TO_LANG` in `src/i18n/locales.ts`. |
| `i18n.routing.prefixDefaultLocale` | `false` — EN is unprefixed. Don't flip this without a redirect plan. |
| `vite.plugins` | Tailwind v4 via `@tailwindcss/vite`. Don't add `@astrojs/tailwind` — that's the v3 path. |
| `vite.server.allowedHosts` | Allows `.ngrok-free.app`, `.ngrok.io`, `.ngrok.app`, `.trycloudflare.com` for tunnel-based device testing. |

### Actual `astro.config.mjs`

```js
// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://www.vilaemes.com",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "al", "it", "de"],
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: [".ngrok-free.app", ".ngrok.io", ".ngrok.app", ".trycloudflare.com"],
    },
  },
});
```

---

## Common Workflows (this repo)

### Adding a new page (e.g. `/gallery`)

The repo uses **subdir routing without `[lang]`** — every page exists 4×.

```astro
---
// src/views/GalleryView.astro
import Base from "../layouts/Base.astro";
import type { Lang } from "../i18n/locales";
import { getSite } from "../i18n/content";

interface Props { lang: Lang }
const { lang } = Astro.props;
const site = await getSite(lang);
---
<Base lang={lang} title={`Gallery — ${site.data.hotel.name}`}>
  <!-- ... -->
</Base>
```

```astro
---
// src/pages/gallery.astro                (EN, unprefixed)
import GalleryView from "../views/GalleryView.astro";
---
<GalleryView lang="en" />
```

Repeat for `src/pages/{al,it,de}/gallery.astro` with `lang="al" | "it" | "de"`. Add the YAML keys in all four `src/content/site/*.yaml` files.

### Creating a component

Existing components in `src/components/` use props-down, no slots-up state, and Tailwind utility classes referencing `@theme` tokens via `var(--color-…)`. Match that style — don't introduce CSS-in-JS or external state.

```astro
---
const { title, body } = Astro.props;
---
<div class="rounded-md bg-[color:var(--color-cream)] text-[color:var(--color-ink)]">
  <h2 class="font-serif text-2xl">{title}</h2>
  <p class="mt-2">{body}</p>
</div>
```

### Build + preview

```bash
pnpm dev           # http://localhost:4321  (HMR)
pnpm exec astro check    # TS + content collection schema check — run before commits
pnpm build         # → dist/ (Cloudflare Pages reads this)
pnpm preview       # serve dist/ locally
```

`pnpm exec astro sync` regenerates `astro:content` types after editing `src/content.config.ts` or YAML schema. Re-run after schema changes.

### Photo pipeline

Source photos live **outside the repo** — set the path via `PHOTOS_SOURCE` in `.env` (gitignored). To regenerate optimized webp:

```bash
node scripts/optimize-photos.mjs
```

Picks per slot are documented in `docs/photos-shortlist.md`. Implementer applies one-line import swaps in `src/views/HomeView.astro` and `src/views/RoomsView.astro`.

---

## Deployment — Cloudflare Pages (no adapter)

**No SSR adapter is installed and none is needed.** The site is pure static SSG. `pnpm build` produces `dist/` and Cloudflare Pages serves it.

If on-demand rendering ever becomes a requirement (e.g. a real reservations API), `pnpm exec astro add cloudflare --yes` is the right path — Cloudflare Pages Functions match the existing host. Until then: **do not add an adapter**.

`docs.astro.build/llms.txt` is a useful prompt context if context7 is unavailable.

## Resources

- [Docs](https://docs.astro.build)
- [Config Reference](https://docs.astro.build/en/reference/configuration-reference/)
- [i18n Routing](https://docs.astro.build/en/guides/internationalization/)
- [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) — see the `seo-expert` skill in this repo for project-specific sitemap setup.
- [llms.txt](https://docs.astro.build/llms.txt)
- [GitHub](https://github.com/withastro/astro)
