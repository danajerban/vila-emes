# Design System

Single source of truth for tokens, layout, type, buttons, motion. All tokens live in `src/styles/global.css` (`@theme` block) — never hardcode hexes.

## Colors

| Token | Hex | Use |
|---|---|---|
| `--color-cream` | `#F4F0E7` | page background |
| `--color-cream-elevated` | `#FAF6EE` | cards, footer |
| `--color-sub-bg` | `#F5EFE2` | secondary surfaces, tags |
| `--color-ink` | `#1F1A14` | primary text |
| `--color-ink-deep` | `#5C5141` | secondary text |
| `--color-muted` | `#736550` | eyebrows, captions |
| `--color-divider` | `#DDD2BC` | borders, hairlines |
| `--color-terracotta` | `#C25B3F` | primary CTA, accents |
| `--color-terracotta-hover` | `#A94A30` | terracotta hover |
| `--color-sea` | `#2E5C7E` | secondary CTA, links |

**Sunset palette** (`--sunset-cream` / `-border` / `-sub-bg` / `-sun`) — Hero photos only via `.sunset-photo` filter + `.sunset-overlay`. Don't reuse on general surfaces.

## Fonts

- `--font-serif` Cormorant Garamond — h1–h4 (weight 500, letter-spacing -0.005em)
- `--font-sans` Inter — body, `17px` / `18px` at md+
- `--font-handwritten` Caveat — accents only (use `.handwritten` class or `<Handwritten>`)

## Type scale

- `h1` `text-6xl md:text-8xl` — Hero only
- `h2` `text-4xl md:text-5xl` — section headings
- `h3` `text-2xl` — cards
- `.eyebrow` — `11px` uppercase, `0.22em` tracking, muted color (above every h2)
- Body min `16px` — never smaller

## Section + container

```html
<section class="py-12 md:py-20">
  <div class="max-w-[1180px] mx-auto px-5 md:px-10">…</div>
</section>
<SectionDivider />
```

- Standard rhythm: `py-12 md:py-20`. Feature CTAs: `py-20 md:py-28`.
- `<SectionDivider />` (palm SVG) sits between every section AND between every room card on `/rooms`. Use `tone="current"` over Hero glass.

## Buttons

- **Primary** — `px-6 py-3 bg-[color:var(--color-terracotta)] hover:bg-[color:var(--color-terracotta-hover)] text-[color:var(--color-cream)] font-medium tracking-wide rounded-md transition tappable`
- **Secondary** — `px-6 py-3 border border-[color:var(--color-divider)] hover:bg-[color:var(--color-sea)] hover:text-[color:var(--color-cream)] hover:border-[color:var(--color-sea)] font-medium tracking-wide rounded-md transition tappable`
- **Pill** (filter bar) — `px-3.5 py-1.5 rounded-full text-[13px] tracking-wide`
- **Text link** — `.link-underline` (animated underline on desktop hover only)

## Motion

- `.reveal` / `.reveal-stagger` — fade + translateY on intersect (Base.astro IO)
- `.photo-enter` — scale + drift on intersect (photo-only)
- `.palm-sway` — 4s infinite gentle sway (palm doodles)
- `.polaroid-wobble` — one-time entry wobble
- `.tappable` — `scale(0.98)` on `:active` (works touch + click)
- All animations respect `prefers-reduced-motion`. Don't add new keyframes without a fallback.

## Components (29 — see `src/components/`)

- **Chrome** — Header, Footer, Base (layout), Seo
- **Hero / sections** — Hero, About, TrustStrip, Gallery, ReadyToBookCTA, ContactStrip, Directions, FAQ, PageHero
- **Rooms** — RoomCard, RoomCarousel, RoomFilterBar, RoomDetails, Amenity, RoomsIncludes, HouseRules
- **Contact** — ContactForm, ContactSidebar, LocationMap, WhatsAppFloat
- **Primitives** — SectionDivider, PalmDoodle, SunBloom, Eyebrow, Handwritten, LangSwitch

## Don'ts

- **No new color hexes** — extend `@theme` in `global.css` instead
- **No React/Vue/Svelte** — vanilla TS via `<script is:inline>` only
- **No bare `<img>`** for photos — use `astro:assets` `<Picture>` (or `<Image>` for fixed-width photos); raw `<img>` only for SVGs in `/public/`
- **No skipped `<SectionDivider />`** between sections
- **No body text below 16px** — bump tiny captions/CTAs
- **No new component without checking `src/components/` first** — reuse over invent
