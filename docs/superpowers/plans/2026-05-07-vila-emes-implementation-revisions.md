# Vila Emes Implementation Plan — REVISIONS (v2, 2026-05-07)

> **Read order:**
> 1. **This file (v2 revisions)** — supersedes the v1 tasks listed below for any conflict.
> 2. v1 plan: `2026-05-06-vila-emes-implementation.md` — full reference for unchanged tasks.
> 3. Spec: `../specs/2026-05-06-vila-emes-site-design.md` — single source of truth for tokens, content shape, and acceptance criteria.

**Why these revisions exist:** the v1 plan was authored before the Claude Design HTML/CSS/JS draft landed. The draft (after the user iterated with the design tool) introduced 11-room taxonomy, sunset/palm visual language, FAQ + trust strip on home, sunset PageHero on subpages, hand-drawn map tile, Caveat handwritten font, and a `mailto:` contact form. Source-of-truth content (Booking.com) confirmed the real owner is Shaban Emes (since 1998, two generations), 11 distinct rooms, ratings 9.0/4.7, and that the "Standard Double" room from the design was invented. This v2 captures all corrections.

**Execution mode:** subagent-driven (per handoff). Use `superpowers:subagent-driven-development`.

## Source-of-truth corrections vs v1

| Field | v1 | v2 (canonical) |
|---|---|---|
| Owner | silent | **Shaban Emes** (+ daughter + son, anonymous) |
| Founded | silent | **1998** |
| Generations | silent | **Two** |
| Locales | EN/AL/IT/DE | **EN/AL/IT/DE (unchanged) — but FAQ honestly says EN/IT/AL spoken** |
| Rooms | 3 categories | **11 individual rooms across 5 families** (apartments 2 / deluxe 3 / family 3 / standard 1 / economy 2) |
| Page bg | `#FAF6EE` | **`#F4F0E7`** |
| Body fonts | Cormorant Garamond + Inter | **+ Caveat (handwritten accents)** |
| Map | Google Maps iframe everywhere | **Hybrid: hand-drawn for `/` + `/rooms`, real iframe on `/contact`** |
| Hero | flat photo + heading + CTAs | **Photo variant: full-bleed + dual scrim + handwritten lead-in + serif heading + polaroid inset** |
| Sub-page hero | (none) | **PageHero: sunset gradient + sun blob + palm doodles** on `/rooms` + `/contact` |
| FAQ | (none) | **6-item FAQ on home + on `/contact`** |
| Trust strip | (none) | **9.0 Booking + 4.7 Google + Etain (Ireland) quote** on home |
| Contact form | (none — strip only) | **Minimal mailto form on `/contact`** wired to `vilaemes@gmail.com`; strip remains |
| Distances | "30 km airport / 200 m beach" placeholder | **Real: 22 mi airport · 100 m beach · 3.5 km centre · 3 mi amphitheatre** |
| Hours | "08:00–23:00" placeholder | **24-hour front desk · check-in 12:00–18:00 · check-out 07:00–11:00** |
| Breakfast | implied | **Not included; pastry shop on ground floor** |
| Pets | silent | **Not allowed** |
| Cribs | silent | **Not available; extra bed €5/night** |
| Address | placeholder | **Rruga Pavarësia, Plazh, Durrës 2001** |
| Reviews | silent | **9.0 Booking / 4.7 Google** (no review-count caption) |
| Logo | text wordmark in header | **Existing hand-drawn 3-palm SVG (`Emes/Logo/Vila Emes.svg`) optimized via SVGO** |
| Palm doodles | (none) | **Extracted from same logo SVG; hand-placed via `<PalmDoodle>` component (NOT runtime random)** |
| Pricing | silent | **Explicit: do NOT display prices anywhere — Booking.com decides** |
| Site constants | scattered in YAMLs | **Centralized in `src/config/site.ts`** |

---

## Updated task map

| # | Action | Notes |
|---|---|---|
| Task 1 | UPDATE | Add `@fontsource/caveat` + `svgo` to install list |
| Task 2 | unchanged | Tailwind v4 via `@tailwindcss/vite` |
| **Task 3** | **REPLACE — see R-03** | Full new theme tokens (cream `#F4F0E7`, sub-bg, sunset palette, Caveat) |
| Task 4 | unchanged | Sharp install |
| **Task 5** | **UPDATE — see R-05** | Update photo categories to align with 11-room taxonomy |
| **Task 6** | **UPDATE + new sub-task — see R-06** | Run photo opt + new SVGO step for logo + palm doodle extraction |
| **Task 7** | **REPLACE — see R-07** | New Zod schema for 11-room shape |
| **Task 8** | **REPLACE — see R-08** | New English YAML (full content from spec) |
| Task 9 | unchanged | Seed AL/IT/DE as copies of EN |
| Task 10 | unchanged | i18n helpers (4 locales already) |
| Task 11 | unchanged | Astro config (4 locales already) |
| **NEW T-A** | **NEW — see T-A** | `src/config/site.ts` constants (must run before Task 12) |
| **Task 12** | **UPDATE — see R-12** | Base layout — body bg `#F4F0E7`, Caveat font, scroll/reveal scripts |
| Task 13 | unchanged | LangSwitch (4 locales already) |
| **Task 14** | **REPLACE — see R-14** | Header w/ palm-wordmark inline SVG + transparent/solid scroll + mobile nav |
| **Task 15** | **UPDATE — see R-15** | Footer w/ optimized logo + handwritten signature |
| **Task 16** | **UPDATE — see R-16** | Amenity expand from 9 → 14 enum keys |
| **NEW T-B** | **NEW — see T-B** | `PalmDoodle` + `Eyebrow` + `Handwritten` + `SunBloom` utility components |
| **Task 17** | **REPLACE — see R-17** | Hero Photo variant w/ polaroid |
| **Task 18** | **REPLACE — see R-18** | About w/ eyebrow + handwritten + signature |
| **Task 19** | **REPLACE — see R-19** | RoomCard preview (4-card grid) |
| **Task 20** | **REPLACE — see R-20** | RoomDetails alternating layout w/ stat grid |
| **Task 21** | **UPDATE — see R-21** | Gallery w/ handwritten captions |
| **Task 22** | **REPLACE — see R-22** | LocationMap hybrid mode (drawn / iframe) |
| **Task 23** | **REPLACE — see R-23** | ContactStrip 5-card icon-circle grid |
| **NEW T-C** | **NEW — see T-C** | `TrustStrip` |
| **NEW T-D** | **NEW — see T-D** | `FAQ` |
| **NEW T-E** | **NEW — see T-E** | `PageHero` |
| **NEW T-F** | **NEW — see T-F** | `RoomFilterBar` |
| **NEW T-G** | **NEW — see T-G** | `RoomsIncludes` |
| **NEW T-H** | **NEW — see T-H** | `HouseRules` |
| **NEW T-I** | **NEW — see T-I** | `ContactForm` |
| **NEW T-J** | **NEW — see T-J** | `ContactSidebar` |
| **NEW T-K** | **NEW — see T-K** | `Directions` |
| Task 24 | unchanged | Photo manifest helper |
| **Task 25** | **REPLACE — see R-25** | HomeView (adds Trust strip + FAQ) |
| **Task 26** | **REPLACE — see R-26** | RoomsView (PageHero + filter + alternating + Includes + Rules) |
| **Task 27** | **REPLACE — see R-27** | ContactView (PageHero + form + sidebar + Directions + iframe + FAQ) |
| Task 28 | unchanged | EN page entries |
| Task 29 | unchanged | Localized page entries (4 locales) |
| **Task 30** | **UPDATE — see R-30** | New acceptance items (filter counts, renovated-2024 pill, mailto form) |
| **Task 31** | **UPDATE — see R-31** | Photo shortlist now lists 11 rooms |
| Tasks 32-34 | unchanged | README/gitignore polish, push, Cloudflare connect |

---

## R-01 (Task 1 update): Add Caveat font + SVGO

After running the Astro create command in v1's Task 1 Step 1, add:

```bash
npm install svgo @fontsource/caveat
```

These are the only additions to v1's install list.

---

## R-03 (Task 3 replace): Theme tokens

**Files:** Modify `src/styles/global.css`.

Replace the entire file contents with:

```css
@import "tailwindcss";
@import "@fontsource-variable/cormorant-garamond";
@import "@fontsource-variable/inter";
@import "@fontsource/caveat/400.css";
@import "@fontsource/caveat/500.css";
@import "@fontsource/caveat/600.css";

@theme {
  /* Page surfaces */
  --color-cream:           #F4F0E7;   /* canonical body bg */
  --color-cream-elevated:  #FAF6EE;   /* header solid, footer, inset panels */
  --color-sub-bg:          #F5EFE2;   /* trust strip, contact strip, FAQ section */
  --color-postcard:        #F4E9D0;   /* room postcard-voice paragraphs */

  /* Ink + accents */
  --color-ink:             #1F1A14;
  --color-ink-deep:        #5C5141;   /* amenity pill text, room body-deep */
  --color-terracotta:      #C25B3F;
  --color-terracotta-hover: #A94A30;
  --color-sea:             #2E5C7E;
  --color-muted:           #8C7E6A;
  --color-divider:         #E8DFCF;

  /* Sunset palette (PageHero on /rooms + /contact, accent washes) */
  --sunset-cream:          #FBE9D2;
  --sunset-border:         #EDC9A0;
  --sunset-sub-bg:         #F6D9B6;
  --sunset-sun:            #C25B3F;

  /* Type */
  --font-serif:        "Cormorant Garamond Variable", Georgia, serif;
  --font-sans:         "Inter Variable", system-ui, sans-serif;
  --font-handwritten:  "Caveat", "Cormorant Garamond Variable", cursive;
}

@layer base {
  html {
    background: var(--color-cream);
    color: var(--color-ink);
    font-family: var(--font-sans);
    font-size: 16px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  @media (min-width: 768px) {
    html { font-size: 17px; }
  }

  h1, h2, h3, h4 {
    font-family: var(--font-serif);
    font-weight: 500;
    letter-spacing: -0.005em;
    line-height: 1.15;
  }

  a { color: inherit; text-decoration: none; }
  img { display: block; max-width: 100%; }

  /* Reveal-on-scroll baseline state (script un-hides via .is-visible) */
  .reveal {
    opacity: 0;
    transform: translateY(14px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  .reveal.is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (prefers-reduced-motion: reduce) {
    .reveal { opacity: 1; transform: none; transition: none; }
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      transition-duration: 0.001ms !important;
    }
  }

  /* Eyebrow utility */
  .eyebrow {
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    font-weight: 500;
    color: var(--color-muted);
  }

  /* Handwritten utility */
  .handwritten {
    font-family: var(--font-handwritten);
    font-weight: 500;
    letter-spacing: 0;
  }

  /* FAQ <details> chev pseudo-elements */
  details > summary {
    list-style: none;
    cursor: pointer;
  }
  details > summary::-webkit-details-marker { display: none; }

  details > summary .faq-chev {
    width: 28px; height: 28px;
    border: 1px solid var(--color-divider);
    border-radius: 50%;
    position: relative;
    flex-shrink: 0;
    transition: border-color 0.2s ease, background-color 0.2s ease;
  }
  details > summary .faq-chev::before,
  details > summary .faq-chev::after {
    content: "";
    position: absolute;
    background: var(--color-ink);
    top: 50%; left: 50%;
    transition: transform 0.25s ease, opacity 0.2s ease;
  }
  details > summary .faq-chev::before { width: 12px; height: 1.5px; transform: translate(-50%, -50%); }
  details > summary .faq-chev::after  { width: 1.5px; height: 12px; transform: translate(-50%, -50%); }
  details[open] > summary .faq-chev { border-color: var(--color-terracotta); }
  details[open] > summary .faq-chev::after { opacity: 0; }
}
```

**Verify:** `npm run dev`, visit `/`, confirm cream `#F4F0E7` background and that handwritten Caveat renders if you temporarily inject `<span class="handwritten">test</span>`. Stop server.

```bash
git add src/styles/global.css
git commit -m "feat(style): theme tokens — sunset palette, caveat font, reveal-on-scroll baseline"
```

---

## R-05 (Task 5 update): Photo script categories

The original photo-optimization script `scripts/optimize-photos.mjs` (Task 5 in v1) maps source folders to category names. **Update the mapping** to match the 11-room schema:

```js
const MAP = {
  "Main":  "main",
  "101":   "deluxe-rooms",
  "102":   "deluxe-rooms",
  "103":   "deluxe-rooms",
  "1+1":   "apt-1bed-terrace",
  "2+1":   "apt-2bed",
  "301":   "standard-rooms",
  "302":   "standard-rooms",
  "303":   "standard-rooms",
  "304":   "standard-rooms",
  "305":   "standard-rooms",
  "306":   "standard-rooms",
};
```

(The old `deluxe`, `apartment-1plus1`, `apartment-2plus1`, `standard`, `beach` categories are renamed accordingly. Output paths become `src/assets/photos/<category>/<basename>-<size>.webp`.)

Everything else in v1 Task 5 (the Sharp pipeline itself) is unchanged.

---

## R-06 (Task 6 update): Photo + logo pipeline run

After v1 Task 6 Step 1 (run photo opt), add a logo step. Replace the v1 Step 2 (single SVG copy + PNG copy) with a richer logo pipeline:

```bash
mkdir -p src/assets/logo src/assets/decorations

# Master copy
cp "/Users/erbandanaj/Downloads/Emes/Logo/Vila Emes.svg" src/assets/logo/vila-emes.svg

# SVGO optimize in-place (default plugins + remove title)
npx svgo --multipass src/assets/logo/vila-emes.svg

# Generate og-image / favicon source from the SVG (Sharp via inline node)
node -e "
const sharp = require('sharp');
sharp('src/assets/logo/vila-emes.svg', { density: 300 })
  .resize(1024, 1024, { fit: 'contain', background: { r: 244, g: 240, b: 231, alpha: 1 } })
  .png()
  .toFile('src/assets/logo/vila-emes-1024.png')
  .then(() => console.log('og PNG written'));
"

# Manually extract palm-tree paths to src/assets/decorations/palm-doodle.svg
# This is a manual one-shot: open vila-emes.svg in any editor, identify the
# palm-tree <path> elements (3 trees in the original), copy ONE clean tree
# (the largest center one is recommended), strip transforms,
# wrap in a 200x300 viewBox, save as palm-doodle.svg.
# Target file size ≤ 5 KB after SVGO.
# (If the executor cannot do this manually, defer to user-supplied palm-doodle.svg
# and use a temporary placeholder triangle SVG until then.)
```

If manual extraction is impractical, generate a simple stylized palm-tree SVG inline as a fallback (the executor should mark this with `<!-- PLACEHOLDER PALM — replace with extract from logo -->` and continue):

```svg
<!-- src/assets/decorations/palm-doodle.svg — PLACEHOLDER -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
  <path d="M100 280 Q 102 200 100 90"/>
  <path d="M100 90 Q 50 75 30 50 M100 90 Q 60 90 35 105"/>
  <path d="M100 90 Q 150 75 170 50 M100 90 Q 140 90 165 105"/>
  <path d="M100 90 Q 100 60 95 30 M100 90 Q 105 60 110 30"/>
</svg>
```

Mark in commit:
```bash
git add src/assets/logo src/assets/decorations
git commit -m "feat(assets): copy + optimize hand-drawn logo, extract palm doodle"
```

---

## R-07 (Task 7 replace): Content collection schema

**Files:** Replace `src/content.config.ts` with:

```ts
// src/content.config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const FAMILIES = ["apartments", "deluxe", "family", "standard", "economy"] as const;
const AMENITIES = [
  "air-con", "wifi", "flat-tv", "private-bath", "bathtub-shower",
  "sea-view", "balcony", "terrace", "kitchenette", "2-bedrooms",
  "mini-fridge", "family-friendly", "sofa-bed", "renovated-2024",
] as const;

const room = z.object({
  id: z.string(),
  family: z.enum(FAMILIES),
  order: z.number().int().positive(),
  name: z.string(),
  size_m2: z.number().positive(),
  sleeps: z.number().int().positive(),
  sleeps_label: z.string(),
  beds: z.string(),
  view: z.string(),
  outdoor: z.string(),
  description: z.string(),
  amenities: z.array(z.enum(AMENITIES)).max(6),
});

const faqItem = z.object({
  q: z.string(),
  a: z.string(),
});

const trustQuote = z.object({
  text: z.string(),
  author: z.string(),
  location: z.string(),
  when: z.string().optional(),
});

export const collections = {
  site: defineCollection({
    loader: glob({ pattern: "**/*.yaml", base: "./src/content/site" }),
    schema: z.object({
      hotel: z.object({
        name: z.string(),
        tagline: z.string(),
        location: z.string(),
      }),

      home: z.object({
        hero: z.object({
          eyebrow: z.string(),
          welcome_handwritten: z.string(),
          heading: z.string(),
          sub: z.string(),
          cta_primary: z.string(),
          cta_secondary: z.string(),
          polaroid_caption_handwritten: z.string(),
        }),
        about: z.object({
          eyebrow: z.string(),
          heading_part_1: z.string(),
          heading_part_2_handwritten: z.string(),
          handwritten_year: z.string(),
          body: z.array(z.string()),
          signature_handwritten: z.string(),
          photo_caption: z.string(),
        }),
        trust: z.object({
          booking_label: z.string(),
          google_label: z.string(),
          quote: trustQuote,
        }),
        rooms: z.object({
          eyebrow: z.string(),
          heading: z.string(),
          intro: z.string(),
          preview_card_cta: z.string(),
        }),
        gallery: z.object({
          eyebrow: z.string(),
          heading: z.string(),
          intro: z.string(),
          captions: z.record(z.string(), z.string()).optional(),
        }),
        location: z.object({
          eyebrow: z.string(),
          heading: z.string(),
          cta: z.string(),
        }),
        contact_strip: z.object({
          eyebrow: z.string(),
          heading_part_1: z.string(),
          heading_part_2_handwritten: z.string(),
        }),
        faq: z.object({
          eyebrow: z.string(),
          heading_part_1: z.string(),
          heading_part_2_handwritten: z.string(),
          items: z.array(faqItem).length(6),
          footer_cta_handwritten: z.string(),
        }),
      }),

      rooms_page: z.object({
        hero_eyebrow: z.string(),
        hero_heading_part_1: z.string(),
        hero_heading_part_2_handwritten: z.string(),
        hero_intro: z.string(),
        includes: z.object({
          eyebrow: z.string(),
          heading: z.string(),
          handwritten: z.string(),
          pastry_note: z.string(),
          list: z.array(z.string()).min(8).max(12),
        }),
        rules: z.object({
          eyebrow: z.string(),
          heading: z.string(),
          check_in: z.object({ label: z.string(), value: z.string(), note: z.string() }),
          check_out: z.object({ label: z.string(), value: z.string(), note: z.string() }),
          notes: z.object({ label: z.string(), value: z.string() }),
        }),
        cta: z.object({
          handwritten: z.string(),
          heading: z.string(),
          button: z.string(),
        }),
      }),

      contact_page: z.object({
        hero_eyebrow: z.string(),
        hero_heading_part_1: z.string(),
        hero_heading_part_2_handwritten: z.string(),
        hero_intro: z.string(),
        form: z.object({
          heading: z.string(),
          intro: z.string(),
          fields: z.object({
            name: z.string(),
            email: z.string(),
            arrival: z.string(),
            guests: z.string(),
            message: z.string(),
          }),
          submit: z.string(),
          success: z.string(),
        }),
        sidebar: z.object({
          address_label: z.string(),
          hours_label: z.string(),
          speak_to_label: z.string(),
          speak_to_name: z.string(),
          speak_to_role: z.string(),
          speak_to_handwritten: z.string(),
        }),
        directions: z.object({
          eyebrow: z.string(),
          heading: z.string(),
        }),
      }),

      ui: z.object({
        nav: z.object({ home: z.string(), rooms: z.string(), contact: z.string() }),
        buttons: z.object({
          book: z.string(),
          map: z.string(),
          details: z.string(),
          next_room: z.string(),
          write: z.string(),
        }),
        filter: z.object({
          all: z.string(),
          apartments: z.string(),
          deluxe: z.string(),
          family: z.string(),
          standard: z.string(),
          economy: z.string(),
        }),
        labels: z.object({
          sleeps: z.string(),
          beds: z.string(),
          size: z.string(),
          view: z.string(),
          outdoor: z.string(),
        }),
        family_groups: z.object({
          apartments: z.string(),
          deluxe: z.string(),
          family: z.string(),
          standard: z.string(),
          economy: z.string(),
        }),
        amenity_labels: z.record(z.enum(AMENITIES), z.string()),
        footer: z.object({
          handwritten: z.string(),
          copyright: z.string(),
        }),
      }),

      rooms: z.array(room).length(11),
    }),
  }),
};
```

**Verify:** `npm run build`. Expected: zero schema errors after Task 8 (English YAML) is in place.

```bash
git add src/content.config.ts
git commit -m "feat(content): zod schema for 11-room taxonomy + 14 amenities + faq + trust"
```

---

## R-08 (Task 8 replace): English content file

**Files:** `src/content/site/en.yaml`.

Replace the entire file with the YAML in the spec under `## Content storage → site.en.yaml shape`. Do not improvise: the schema in R-07 will reject any deviation. Where the spec says `[PASTE: ...]`, leave the placeholder string in — owner fills before launch.

After writing:
```bash
git add src/content/site/en.yaml
git commit -m "feat(content): english content authored from spec"
```

---

## NEW T-A (insert before Task 12): Site config constants

**Files:** Create `src/config/site.ts`.

This file is the **single source of truth for contact + URL placeholders**. Owner edits this one file when real values arrive — no hunting through 4 YAML translations.

```ts
// src/config/site.ts
export const SITE = {
  url: "https://vila-emes.pages.dev",  // until custom domain

  contact: {
    phone: "+355 ___ ___ ___",                // PLACEHOLDER
    whatsapp: "+355 ___ ___ ___",             // PLACEHOLDER
    email: "vilaemes@gmail.com",
    address: ["Rruga Pavarësia", "Plazh, Durrës 2001", "Albania"],
  },

  hours: {
    front_desk: "24-hour",
    check_in: "12:00 – 18:00",
    check_out: "07:00 – 11:00",
  },

  links: {
    booking_com: "https://www.booking.com/hotel/al/vila-emes.html",  // PLACEHOLDER
    instagram:   "https://instagram.com/vilaemes",                    // PLACEHOLDER
    google_maps: "https://maps.app.goo.gl/PLACEHOLDER",
    google_maps_embed: "https://www.google.com/maps/embed?pb=PLACEHOLDER",
  },

  ratings: {
    booking: 9.0,
    google: 4.7,
  },

  distances: [
    { value: "22 mi",  label: "Tirana International Airport", blurb: "Door-to-door taxis run all day; ~35 minutes in light traffic." },
    { value: "100 m",  label: "Durrës Beach",                  blurb: "A two-minute walk through the palm-lined avenue." },
    { value: "3.5 km", label: "Centre of Durrës",              blurb: "City buses pass the corner every ten minutes." },
    { value: "3 mi",   label: "Durres Amphitheatre",           blurb: "The 2nd-century Roman amphitheatre is a 10-minute drive." },
  ],
} as const;

export type Site = typeof SITE;
```

```bash
git add src/config/site.ts
git commit -m "feat(config): centralize site constants (contact, links, ratings, distances)"
```

---

## R-12 (Task 12 update): Base layout

The v1 Base.astro adds the doctype, head, font imports, and footer slot. **Add** the following to the `<head>` and `<body>`:

1. Body bg via Tailwind class on `<body>`: `class="bg-[color:var(--color-cream)] text-[color:var(--color-ink)]"`. The `<html>` rule in `global.css` already paints the bg, but the `<body>` class makes it explicit for any `body { background: white }` user-agent overrides.

2. Add an inline `<script>` at the end of `<body>` (before the closing `</body>`) for sticky-header + reveal-on-scroll. Both are tiny and global.

```astro
<script is:inline>
  // Sticky header transparent → solid on scroll.
  // Header.astro applies data-transparent="true" on / and data-transparent="false" elsewhere.
  document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("siteHeader");
    if (!header) return;
    if (header.dataset.transparent !== "true") {
      header.classList.add("is-solid");
      return;
    }
    const onScroll = () => {
      const y = window.scrollY;
      header.classList.toggle("is-solid", y > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  });

  // Reveal-on-scroll via IntersectionObserver.
  document.addEventListener("DOMContentLoaded", () => {
    const targets = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || targets.length === 0) {
      targets.forEach((t) => t.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
    targets.forEach((t) => io.observe(t));
  });
</script>
```

3. Add `<link rel="icon" href="/favicon.svg" type="image/svg+xml" />` (already from template) AND `<meta property="og:image" content="/og-image.png" />` after the photo pipeline writes `vila-emes-1024.png`. Wire `og:image` to that PNG (copy or symlink to `public/og-image.png` at build time, or import via Astro `<Image>` from src/assets — but for og:image, a public/ path is simplest).

After update:
```bash
git add src/layouts/Base.astro
git commit -m "feat(layout): scroll/reveal scripts, og:image, body bg explicit"
```

---

## R-14 (Task 14 replace): Header

**Files:** `src/components/Header.astro`. Replace v1 contents with:

```astro
---
// src/components/Header.astro
import LangSwitch from "./LangSwitch.astro";
import type { Lang } from "../i18n/locales";

interface Props {
  lang: Lang;
  ui: { home: string; rooms: string; contact: string };
  isHome?: boolean;        // true = transparent over hero, false = always solid
  hotelName: string;
}
const { lang, ui, isHome = false, hotelName } = Astro.props;

const base = lang === "en" ? "" : `/${lang}`;
const links = [
  { href: `${base}/`,        label: ui.home,    matchPath: ["/"] },
  { href: `${base}/rooms`,   label: ui.rooms,   matchPath: ["/rooms"] },
  { href: `${base}/contact`, label: ui.contact, matchPath: ["/contact"] },
];
const path = Astro.url.pathname.replace(/\/+$/, "") || "/";
---
<header
  id="siteHeader"
  data-transparent={isHome ? "true" : "false"}
  class="fixed top-0 inset-x-0 z-40 h-16 md:h-20 transition-colors duration-300 [&.is-solid]:bg-[color:var(--color-cream-elevated)]/95 [&.is-solid]:backdrop-blur-sm [&.is-solid]:border-b [&.is-solid]:border-[color:var(--color-divider)]"
>
  <div class="max-w-[1280px] mx-auto h-full px-5 md:px-10 flex items-center justify-between gap-6">
    <a href={`${base}/`} class="flex items-center gap-2 group" aria-label={hotelName}>
      <!-- Inline palm icon — uses currentColor; small mark -->
      <svg width="22" height="28" viewBox="0 0 200 260" class="text-[color:var(--color-terracotta)] transition" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M100 250 C 102 180 100 100 100 70" />
        <path d="M100 70 C 50 50 30 30 20 10 M100 70 C 60 80 30 100 20 130" />
        <path d="M100 70 C 150 50 170 30 180 10 M100 70 C 140 80 170 100 180 130" />
        <path d="M100 70 C 100 30 95 10 90 0 M100 70 C 105 30 115 15 130 5" />
      </svg>
      <span class="font-serif text-[18px] md:text-[20px] tracking-[0.22em] font-medium" style="color: inherit;">VILA EMES</span>
    </a>

    <!-- Desktop nav -->
    <nav class="hidden md:flex items-center gap-8" aria-label="Primary">
      {links.map((l) => {
        const active = l.matchPath.some((m) => path === `${base || ""}${m}` || (m === "/" && path === (base || "/")));
        return (
          <a
            href={l.href}
            class={`text-[13px] tracking-[0.18em] uppercase font-medium transition ${active ? "text-[color:var(--color-terracotta)]" : "hover:text-[color:var(--color-terracotta)]"}`}
            aria-current={active ? "page" : undefined}
          >{l.label}</a>
        );
      })}
      <LangSwitch lang={lang} />
    </nav>

    <!-- Mobile hamburger -->
    <button
      type="button"
      id="mobileNavToggle"
      class="md:hidden p-2 -mr-2"
      aria-label="Toggle navigation"
      aria-expanded="false"
      aria-controls="mobileNav"
    >
      <span class="block w-6 h-px bg-current"></span>
      <span class="block w-6 h-px bg-current mt-1.5"></span>
      <span class="block w-6 h-px bg-current mt-1.5"></span>
    </button>
  </div>

  <!-- Mobile sheet -->
  <div
    id="mobileNav"
    hidden
    class="md:hidden fixed inset-x-0 top-16 bg-[color:var(--color-cream-elevated)] border-b border-[color:var(--color-divider)] py-6 px-5 space-y-4"
  >
    {links.map((l) => (
      <a href={l.href} class="block text-lg tracking-[0.12em] uppercase">{l.label}</a>
    ))}
    <div class="pt-4 border-t border-[color:var(--color-divider)]">
      <LangSwitch lang={lang} />
    </div>
  </div>
</header>

<style>
  /* Transparent state: white text + no bg */
  #siteHeader[data-transparent="true"]:not(.is-solid) {
    color: var(--color-cream);
  }
  /* Solid state (always on subpages, on scroll on home) */
  #siteHeader.is-solid { color: var(--color-ink); }
  /* Spacing top — pages should add pt-16 md:pt-20 unless they have a full-bleed hero */
</style>

<script is:inline>
  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("mobileNavToggle");
    const nav = document.getElementById("mobileNav");
    if (!btn || !nav) return;
    btn.addEventListener("click", () => {
      const open = !nav.hidden;
      nav.hidden = open;
      btn.setAttribute("aria-expanded", String(!open));
    });
  });
</script>
```

```bash
git add src/components/Header.astro
git commit -m "feat(components): header with palm wordmark, scroll-aware solid state, mobile nav"
```

---

## R-15 (Task 15 update): Footer

Replace v1 Footer.astro contents with:

```astro
---
// src/components/Footer.astro
import { Image } from "astro:assets";
import LangSwitch from "./LangSwitch.astro";
import logoPng from "../assets/logo/vila-emes-1024.png";
import type { Lang } from "../i18n/locales";

interface Props {
  lang: Lang;
  handwritten: string;
  copyright: string;
}
const { lang, handwritten, copyright } = Astro.props;
---
<footer class="bg-[color:var(--color-cream-elevated)] border-t border-[color:var(--color-divider)]">
  <div class="max-w-[1280px] mx-auto px-5 md:px-10 py-14 md:py-20 flex flex-col items-center gap-6 text-center">
    <div class="md:hidden w-full">
      <LangSwitch lang={lang} />
    </div>

    <Image src={logoPng} alt="Vila Emes" width={140} height={140} class="opacity-90" />

    <p class="handwritten text-2xl md:text-3xl text-[color:var(--color-terracotta)]">{handwritten}</p>

    <p class="text-sm text-[color:var(--color-muted)] tracking-wide">{copyright}</p>
  </div>
</footer>
```

```bash
git add src/components/Footer.astro
git commit -m "feat(components): footer with optimized logo and handwritten signature"
```

---

## R-16 (Task 16 update): Amenity component (14 keys)

Update v1 Amenity.astro to support the 14-key enum. Replace the type union and the icon switch:

```ts
type AmenityKind =
  | "air-con" | "wifi" | "flat-tv" | "private-bath" | "bathtub-shower"
  | "sea-view" | "balcony" | "terrace" | "kitchenette" | "2-bedrooms"
  | "mini-fridge" | "family-friendly" | "sofa-bed" | "renovated-2024";
```

Add icon SVGs for the new keys (`bathtub-shower`, `terrace`, `mini-fridge`, `family-friendly`, `sofa-bed`, `renovated-2024`). For `renovated-2024`, render a small "★ 2024" stamp instead of an icon — it's a label more than an amenity. Inline SVGs only; use simple line-art at 18×18 with `stroke="currentColor" stroke-width="1.5"`.

`renovated-2024` pill rendering treatment:
```astro
{kind === "renovated-2024" ? (
  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[color:var(--color-sub-bg)] text-[color:var(--color-terracotta)] text-xs tracking-wide">
    <span aria-hidden="true">★</span> {label}
  </span>
) : (
  <span class="inline-flex items-center gap-1.5 text-[color:var(--color-ink-deep)] text-sm">
    <svg class="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      {/* per-icon paths — see below */}
    </svg>
    <span>{label}</span>
  </span>
)}
```

(See appendix at end of this file for the full SVG path set for the 14 icons.)

```bash
git add src/components/Amenity.astro
git commit -m "feat(components): expand amenity enum to 14 keys with renovated-2024 stamp"
```

---

## NEW T-B (insert after Task 16): Utility components

**Files:** Create 4 small components.

### `src/components/PalmDoodle.astro`
```astro
---
interface Props {
  size?: number;
  rotate?: number;
  class?: string;
  opacity?: number;
}
const { size = 60, rotate = 0, class: className = "", opacity = 0.5 } = Astro.props;
---
<svg
  width={size}
  height={size * 1.5}
  viewBox="0 0 200 300"
  fill="none"
  stroke="currentColor"
  stroke-width="1.4"
  stroke-linecap="round"
  stroke-linejoin="round"
  style={`transform: rotate(${rotate}deg); opacity: ${opacity};`}
  class={`pointer-events-none ${className}`}
  aria-hidden="true"
>
  <!-- Inline-extracted palm path — replace with extracted-from-logo at scaffold -->
  <path d="M100 280 C 102 200 100 90 100 70" />
  <path d="M100 70 C 60 60 35 45 20 25 M100 70 C 65 80 40 100 30 130" />
  <path d="M100 70 C 140 60 165 45 180 25 M100 70 C 135 80 160 100 170 130" />
  <path d="M100 70 C 100 40 90 20 85 8 M100 70 C 110 40 125 20 135 12" />
</svg>
```

### `src/components/Eyebrow.astro`
```astro
---
interface Props { class?: string }
const { class: className = "" } = Astro.props;
---
<p class={`eyebrow ${className}`}><slot /></p>
```

### `src/components/Handwritten.astro`
```astro
---
interface Props {
  as?: "span" | "p" | "h2" | "em";
  class?: string;
  color?: "terracotta" | "ink" | "sea";
}
const { as: As = "span", class: className = "", color = "terracotta" } = Astro.props;
const colorClass = {
  terracotta: "text-[color:var(--color-terracotta)]",
  ink: "text-[color:var(--color-ink)]",
  sea: "text-[color:var(--color-sea)]",
}[color];
---
<As class={`handwritten ${colorClass} ${className}`}><slot /></As>
```

### `src/components/SunBloom.astro`
```astro
---
interface Props { class?: string }
const { class: className = "" } = Astro.props;
---
<svg
  viewBox="0 0 400 400"
  class={`pointer-events-none ${className}`}
  aria-hidden="true"
>
  <defs>
    <radialGradient id="sun-bloom" cx="50%" cy="50%">
      <stop offset="0%" stop-color="var(--sunset-sun)" stop-opacity="0.95" />
      <stop offset="40%" stop-color="var(--sunset-sun)" stop-opacity="0.55" />
      <stop offset="80%" stop-color="var(--sunset-sun)" stop-opacity="0.10" />
      <stop offset="100%" stop-color="var(--sunset-sun)" stop-opacity="0" />
    </radialGradient>
  </defs>
  <circle cx="200" cy="200" r="200" fill="url(#sun-bloom)" />
</svg>
```

```bash
git add src/components/PalmDoodle.astro src/components/Eyebrow.astro src/components/Handwritten.astro src/components/SunBloom.astro
git commit -m "feat(components): palm-doodle + eyebrow + handwritten + sunbloom utilities"
```

---

## R-17 (Task 17 replace): Hero (Photo variant w/ polaroid)

**Files:** `src/components/Hero.astro`. Replace v1 contents:

```astro
---
import { Image } from "astro:assets";
import type { ImageMetadata } from "astro";
import Eyebrow from "./Eyebrow.astro";
import Handwritten from "./Handwritten.astro";

interface Props {
  cover: ImageMetadata;
  polaroid: ImageMetadata;
  eyebrow: string;
  welcomeHandwritten: string;
  heading: string;
  sub: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  polaroidCaption: string;
  hotelName: string;
}
const { cover, polaroid, eyebrow, welcomeHandwritten, heading, sub, ctaPrimary, ctaSecondary, polaroidCaption, hotelName } = Astro.props;
---
<section class="relative isolate min-h-[88vh] flex items-end overflow-hidden">
  <Image
    src={cover}
    alt={hotelName}
    width={2400}
    quality={82}
    loading="eager"
    fetchpriority="high"
    class="absolute inset-0 w-full h-full object-cover"
  />
  <!-- Top scrim (under header) -->
  <div class="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/55 to-transparent" aria-hidden="true"></div>
  <!-- Bottom scrim (under copy) -->
  <div class="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/65 via-black/25 to-transparent" aria-hidden="true"></div>

  <!-- Polaroid family note (lg+ only) -->
  <figure class="absolute bottom-12 right-12 hidden lg:block reveal" style="transform: rotate(-3deg);">
    <div class="bg-[color:var(--color-cream-elevated)] p-3 pb-12 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)] w-56">
      <Image src={polaroid} alt="" width={420} class="w-full aspect-square object-cover" />
      <figcaption class="absolute bottom-3 left-0 right-0 text-center handwritten text-[color:var(--color-ink)] text-lg">
        {polaroidCaption}
      </figcaption>
    </div>
  </figure>

  <div class="relative max-w-[1180px] mx-auto px-5 md:px-10 pb-20 md:pb-28 text-[color:var(--color-cream)]">
    <Eyebrow class="!text-[color:var(--color-cream)]/80">{eyebrow}</Eyebrow>
    <Handwritten as="p" color="terracotta" class="!text-[color:var(--color-cream)] mt-3 text-3xl md:text-4xl">
      {welcomeHandwritten}
    </Handwritten>
    <h1 class="font-serif text-6xl md:text-8xl mt-1 leading-none">{heading}</h1>
    <p class="mt-5 max-w-2xl text-lg md:text-xl text-[color:var(--color-cream)]/90">{sub}</p>
    <div class="mt-8 flex flex-wrap gap-3">
      <a
        href={ctaPrimary.href}
        target="_blank" rel="noopener"
        class="inline-flex items-center px-6 py-3 bg-[color:var(--color-terracotta)] hover:bg-[color:var(--color-terracotta-hover)] text-[color:var(--color-cream)] font-medium tracking-wide rounded-md transition"
      >{ctaPrimary.label}</a>
      <a
        href={ctaSecondary.href}
        target="_blank" rel="noopener"
        class="inline-flex items-center px-6 py-3 border border-[color:var(--color-cream)]/80 hover:bg-[color:var(--color-cream)]/10 text-[color:var(--color-cream)] font-medium tracking-wide rounded-md transition"
      >{ctaSecondary.label}</a>
    </div>
  </div>
</section>
```

```bash
git add src/components/Hero.astro
git commit -m "feat(components): hero photo variant with polaroid family note"
```

---

## R-18 (Task 18 replace): About

**Files:** `src/components/About.astro`. Replace contents:

```astro
---
import { Image } from "astro:assets";
import type { ImageMetadata } from "astro";
import Eyebrow from "./Eyebrow.astro";
import Handwritten from "./Handwritten.astro";

interface Props {
  eyebrow: string;
  headingPart1: string;
  headingPart2Handwritten: string;
  handwrittenYear: string;
  body: string[];        // 3 paragraphs
  signatureHandwritten: string;
  photo: ImageMetadata;
  photoCaption: string;
}
const { eyebrow, headingPart1, headingPart2Handwritten, handwrittenYear, body, signatureHandwritten, photo, photoCaption } = Astro.props;
---
<section class="max-w-[1180px] mx-auto px-5 md:px-10 py-20 md:py-32 grid md:grid-cols-2 gap-10 md:gap-16 items-center reveal">
  <div>
    <Eyebrow>{eyebrow}</Eyebrow>
    <h2 class="mt-3 font-serif text-4xl md:text-5xl text-[color:var(--color-ink)] leading-[1.1]">
      {headingPart1}{" "}
      <Handwritten as="em" color="terracotta" class="not-italic text-[1.1em]">
        {headingPart2Handwritten}
      </Handwritten>
    </h2>
    <Handwritten as="p" color="terracotta" class="mt-4 text-2xl">{handwrittenYear}</Handwritten>

    <div class="mt-6 space-y-4 text-[color:var(--color-ink)]/85 max-w-prose">
      {body.map((para) => <p>{para}</p>)}
    </div>

    <hr class="mt-8 border-[color:var(--color-divider)]" />

    <Handwritten as="p" color="terracotta" class="mt-4 text-xl">{signatureHandwritten}</Handwritten>
  </div>

  <figure class="reveal">
    <Image
      src={photo}
      alt={photoCaption}
      width={1200}
      quality={82}
      class="w-full aspect-square object-cover rounded-md"
    />
    <Eyebrow class="mt-3">{photoCaption}</Eyebrow>
  </figure>
</section>
```

```bash
git add src/components/About.astro
git commit -m "feat(components): about with eyebrow, handwritten heading, signature, exterior photo"
```

---

## R-19 (Task 19 replace): RoomCard preview

**Files:** `src/components/RoomCard.astro`. Replace contents:

```astro
---
import { Image } from "astro:assets";
import type { ImageMetadata } from "astro";
import Eyebrow from "./Eyebrow.astro";

interface Props {
  href: string;
  photo: ImageMetadata;
  numberLabel: string;       // "01"
  familyLabel: string;       // "Apartments"
  name: string;
  capacity: string;          // "Sleeps up to 4"
  detailsLabel: string;      // "View details"
}
const { href, photo, numberLabel, familyLabel, name, capacity, detailsLabel } = Astro.props;
---
<a
  href={href}
  class="group block overflow-hidden rounded-md border border-[color:var(--color-divider)] bg-[color:var(--color-cream-elevated)] hover:-translate-y-[2px] transition duration-500"
>
  <div class="aspect-[4/3] overflow-hidden">
    <Image
      src={photo}
      alt={name}
      width={1200}
      quality={82}
      class="w-full h-full object-cover group-hover:scale-[1.02] transition duration-500"
    />
  </div>
  <div class="p-5">
    <Eyebrow>{numberLabel} · {familyLabel}</Eyebrow>
    <h3 class="mt-2 font-serif text-2xl text-[color:var(--color-ink)] leading-tight">{name}</h3>
    <p class="mt-1 text-sm text-[color:var(--color-muted)]">{capacity}</p>
    <p class="mt-4 text-sm text-[color:var(--color-terracotta)] font-medium">{detailsLabel}</p>
  </div>
</a>
```

```bash
git add src/components/RoomCard.astro
git commit -m "feat(components): room preview card with numbered eyebrow and family label"
```

---

## R-20 (Task 20 replace): RoomDetails alternating

**Files:** `src/components/RoomDetails.astro`. Replace contents:

```astro
---
import { Image } from "astro:assets";
import type { ImageMetadata } from "astro";
import Amenity from "./Amenity.astro";
import Eyebrow from "./Eyebrow.astro";

type AmenityKind =
  | "air-con" | "wifi" | "flat-tv" | "private-bath" | "bathtub-shower"
  | "sea-view" | "balcony" | "terrace" | "kitchenette" | "2-bedrooms"
  | "mini-fridge" | "family-friendly" | "sofa-bed" | "renovated-2024";

interface Props {
  id: string;
  cat: string;            // family slug for filter
  numberLabel: string;    // "01"
  familyLabel: string;    // "Apartments"
  name: string;
  size: string;           // "80 m²"
  beds: string;
  view: string;
  outdoor: string;
  capacity: string;       // "Sleeps up to 4"
  description: string;
  amenities: { kind: AmenityKind; label: string }[];
  photos: ImageMetadata[];
  bookHref: string;
  bookLabel: string;
  flip?: boolean;         // image right when true
  labels: { beds: string; size: string; view: string; outdoor: string };
}
const { id, cat, numberLabel, familyLabel, name, size, beds, view, outdoor, capacity, description, amenities, photos, bookHref, bookLabel, flip = false, labels } = Astro.props;
---
<article
  id={id}
  data-cat={cat}
  class={`max-w-[1180px] mx-auto px-5 md:px-10 py-16 md:py-24 grid md:grid-cols-12 gap-8 md:gap-12 items-start border-t border-[color:var(--color-divider)] first:border-t-0 reveal`}
>
  <div class={`md:col-span-7 ${flip ? "md:order-2" : ""}`}>
    {photos[0] && (
      <Image
        src={photos[0]}
        alt={name}
        width={1600}
        quality={82}
        class="w-full aspect-[4/3] object-cover rounded-md"
      />
    )}
  </div>

  <div class={`md:col-span-5 ${flip ? "md:order-1" : ""}`}>
    <Eyebrow>{numberLabel} · {familyLabel}</Eyebrow>
    <h2 class="mt-3 font-serif text-3xl md:text-4xl text-[color:var(--color-ink)] leading-tight">{name}</h2>
    <p class="mt-2 text-sm text-[color:var(--color-muted)]">{capacity}</p>

    <p class="mt-5 text-[color:var(--color-ink)]/85 max-w-prose">{description}</p>

    <dl class="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
      <div><dt class="text-[color:var(--color-muted)]">{labels.beds}</dt><dd class="text-[color:var(--color-ink)] mt-0.5">{beds}</dd></div>
      <div><dt class="text-[color:var(--color-muted)]">{labels.size}</dt><dd class="text-[color:var(--color-ink)] mt-0.5">{size}</dd></div>
      <div><dt class="text-[color:var(--color-muted)]">{labels.view}</dt><dd class="text-[color:var(--color-ink)] mt-0.5">{view}</dd></div>
      <div><dt class="text-[color:var(--color-muted)]">{labels.outdoor}</dt><dd class="text-[color:var(--color-ink)] mt-0.5">{outdoor}</dd></div>
    </dl>

    <ul class="mt-6 flex flex-wrap gap-2">
      {amenities.map((a) => (
        <li>
          <Amenity kind={a.kind} label={a.label} variant="pill" />
        </li>
      ))}
    </ul>

    <a
      href={bookHref}
      target="_blank" rel="noopener"
      class="inline-flex mt-8 px-5 py-3 bg-[color:var(--color-terracotta)] hover:bg-[color:var(--color-terracotta-hover)] text-[color:var(--color-cream)] rounded-md transition"
    >{bookLabel}</a>
  </div>
</article>
```

> The `Amenity.astro` component should accept a `variant?: "default" | "pill"` prop. In `pill` mode, render as `<span class="px-2.5 py-1 rounded-full bg-[color:var(--color-sub-bg)] text-[color:var(--color-ink-deep)] text-xs">{label}</span>` (no icon, just label, except `renovated-2024` which keeps the ★ stamp).

```bash
git add src/components/RoomDetails.astro src/components/Amenity.astro
git commit -m "feat(components): alternating room details with stat grid and amenity pills"
```

---

## R-21 (Task 21 update): Gallery captions

In v1 Gallery.astro, the `Props` interface has `photos: ImageMetadata[]`. Extend to:

```ts
interface Props {
  heading: string;
  eyebrow?: string;
  intro?: string;
  photos: { src: ImageMetadata; alt: string; caption?: string }[];
}
```

When rendering each tile, if `caption` is non-empty, render below the image:
```astro
{photo.caption && (
  <figcaption class="handwritten text-[color:var(--color-terracotta)] text-lg mt-2 px-1">
    — {photo.caption}
  </figcaption>
)}
```

`HomeView.astro` (Task 25) constructs the `photos` array from a manifest + caption lookup against `home.gallery.captions[basename]`.

```bash
git add src/components/Gallery.astro
git commit -m "feat(components): gallery handwritten captions"
```

---

## R-22 (Task 22 replace): LocationMap hybrid

**Files:** `src/components/LocationMap.astro`. Replace contents:

```astro
---
import Eyebrow from "./Eyebrow.astro";

interface Props {
  mode: "drawn" | "iframe";
  embedUrl?: string;     // required when mode="iframe"
  ariaLabel: string;
}
const { mode, embedUrl, ariaLabel } = Astro.props;
---
{mode === "iframe" && embedUrl ? (
  <div class="w-full aspect-[16/9] rounded-md overflow-hidden border border-[color:var(--color-divider)]">
    <iframe
      src={embedUrl}
      title={ariaLabel}
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      class="w-full h-full block"
    ></iframe>
  </div>
) : (
  <figure class="w-full aspect-[4/3] rounded-md overflow-hidden bg-[color:var(--color-cream-elevated)] border border-[color:var(--color-divider)] relative" aria-label={ariaLabel}>
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="absolute inset-0 w-full h-full">
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--color-divider)" stroke-width="0.5" />
        </pattern>
      </defs>
      <rect width="400" height="300" fill="url(#grid)" />
      <!-- Coastline curve (Adriatic) -->
      <path d="M -10 150 C 60 110, 140 170, 220 130 C 290 95, 360 145, 420 100 L 420 320 L -10 320 Z" fill="var(--color-sea)" opacity="0.10" stroke="var(--color-sea)" stroke-width="1.4" stroke-dasharray="2 4" />
      <!-- Compass N -->
      <g transform="translate(360, 30)">
        <line x1="0" y1="-12" x2="0" y2="12" stroke="var(--color-ink)" stroke-width="0.8" />
        <text x="0" y="-15" text-anchor="middle" font-family="var(--font-sans)" font-size="9" fill="var(--color-ink)">N</text>
      </g>
      <!-- Drop pin (Vila Emes) -->
      <g transform="translate(195, 165)">
        <path d="M 0 -22 C -10 -22, -10 -8, 0 0 C 10 -8, 10 -22, 0 -22 Z" fill="var(--color-terracotta)" />
        <circle cx="0" cy="-15" r="3" fill="var(--color-cream-elevated)" />
      </g>
      <text x="195" y="190" text-anchor="middle" font-family="var(--font-handwritten), cursive" font-size="14" fill="var(--color-ink)">Vila Emes</text>
    </svg>
  </figure>
)}
```

```bash
git add src/components/LocationMap.astro
git commit -m "feat(components): location map — hand-drawn coastline + iframe modes"
```

---

## R-23 (Task 23 replace): ContactStrip 5-card

**Files:** `src/components/ContactStrip.astro`. Replace contents:

```astro
---
import Eyebrow from "./Eyebrow.astro";
import Handwritten from "./Handwritten.astro";

interface Tile {
  kind: "phone" | "whatsapp" | "email" | "instagram" | "booking";
  label: string;       // small label
  value: string;       // displayed value (e.g., "+355 ___")
  href: string;
}

interface Props {
  eyebrow: string;
  headingPart1: string;
  headingPart2Handwritten: string;
  intro?: string;
  tiles: Tile[];       // exactly 5 tiles
}
const { eyebrow, headingPart1, headingPart2Handwritten, intro, tiles } = Astro.props;

const ICONS = {
  phone:     `<path d="M3 5a2 2 0 0 1 2-2h2.5a1 1 0 0 1 .95.69l1.2 3.6a1 1 0 0 1-.5 1.21l-1.6.8a12 12 0 0 0 5.66 5.66l.8-1.6a1 1 0 0 1 1.21-.5l3.6 1.2a1 1 0 0 1 .69.95V19a2 2 0 0 1-2 2A18 18 0 0 1 3 5z"/>`,
  whatsapp:  `<path d="M12 3a9 9 0 0 0-7.6 13.8L3 21l4.3-1.4A9 9 0 1 0 12 3z"/><path d="M8.5 9.5c0 4.5 3.5 8 8 8a2.5 2.5 0 0 0 1.4-.4l-1.7-1a1 1 0 0 0-1 0c-.5.3-1 .4-1.5.4-2 0-3.6-1.6-3.6-3.6 0-.5.1-1 .4-1.5.2-.3.2-.7 0-1l-1-1.7a2.5 2.5 0 0 0-.4 1.4z"/>`,
  email:     `<path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/><path d="m4 8 8 6 8-6"/>`,
  instagram: `<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor"/>`,
  booking:   `<path d="M5 3h10l4 4v14a0 0 0 0 1 0 0H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M9 12h6M9 16h6"/>`,
};
---
<section class="bg-[color:var(--color-sub-bg)] reveal">
  <div class="max-w-[1180px] mx-auto px-5 md:px-10 py-20 md:py-28">
    <div class="text-center max-w-2xl mx-auto">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 class="mt-3 font-serif text-4xl md:text-5xl text-[color:var(--color-ink)] leading-tight">
        {headingPart1}{" "}
        <Handwritten as="em" color="terracotta" class="not-italic text-[1.1em]">{headingPart2Handwritten}</Handwritten>
      </h2>
      {intro && <p class="mt-4 text-[color:var(--color-ink)]/80">{intro}</p>}
    </div>

    <ul class="mt-12 grid gap-4 grid-cols-2 md:grid-cols-5">
      {tiles.map((t) => (
        <li>
          <a
            href={t.href}
            target={t.kind === "phone" || t.kind === "whatsapp" || t.kind === "email" ? undefined : "_blank"}
            rel={t.kind === "instagram" || t.kind === "booking" ? "noopener" : undefined}
            class="block p-5 rounded-md bg-[color:var(--color-cream-elevated)] border border-[color:var(--color-divider)] hover:-translate-y-[2px] transition duration-300 text-center"
          >
            <span class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[color:var(--color-cream)] text-[color:var(--color-sea)] mb-3" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" set:html={ICONS[t.kind]} />
            </span>
            <p class="text-[11px] tracking-[0.22em] uppercase text-[color:var(--color-muted)]">{t.label}</p>
            <p class="font-serif text-base mt-1 text-[color:var(--color-ink)] break-words">{t.value}</p>
          </a>
        </li>
      ))}
    </ul>
  </div>
</section>
```

```bash
git add src/components/ContactStrip.astro
git commit -m "feat(components): contact strip with 5-tile icon-circle grid"
```

---

## NEW T-C: TrustStrip

**Files:** Create `src/components/TrustStrip.astro`.

```astro
---
import Eyebrow from "./Eyebrow.astro";
import Handwritten from "./Handwritten.astro";

interface Props {
  bookingLabel: string;
  bookingScore: number;
  googleLabel: string;
  googleScore: number;
  quote: { text: string; author: string; location: string; when?: string };
}
const { bookingLabel, bookingScore, googleLabel, googleScore, quote } = Astro.props;
---
<section class="bg-[color:var(--color-sub-bg)] reveal">
  <div class="max-w-[1180px] mx-auto px-5 md:px-10 py-16 md:py-20 grid md:grid-cols-12 gap-10 items-center">
    <div class="md:col-span-4">
      <div class="flex items-baseline gap-2">
        <span class="font-serif text-5xl md:text-6xl text-[color:var(--color-terracotta)] tabular-nums">{bookingScore.toFixed(1)}</span>
        <Eyebrow class="!text-[color:var(--color-muted)]">{bookingLabel}</Eyebrow>
      </div>
      <div class="mt-4 flex items-baseline gap-2">
        <span class="font-serif text-5xl md:text-6xl text-[color:var(--color-terracotta)] tabular-nums">{googleScore.toFixed(1)}</span>
        <Eyebrow class="!text-[color:var(--color-muted)]">{googleLabel} · ★</Eyebrow>
      </div>
    </div>

    <figure class="md:col-span-8">
      <svg width="28" height="22" viewBox="0 0 28 22" class="text-[color:var(--color-terracotta)] mb-3" fill="currentColor" aria-hidden="true">
        <path d="M0 14c0-4.5 3.2-8.4 7.6-9l1 1.7c-2.6.5-4.6 2.7-4.6 5.5h3.6V22H0V14zm14.4 0c0-4.5 3.2-8.4 7.6-9l1 1.7c-2.6.5-4.6 2.7-4.6 5.5H22V22h-7.6V14z"/>
      </svg>
      <blockquote class="font-serif text-xl md:text-2xl text-[color:var(--color-ink)] leading-snug italic">
        {quote.text}
      </blockquote>
      <figcaption class="mt-4 text-sm text-[color:var(--color-muted)]">
        <span class="font-medium text-[color:var(--color-ink)]">{quote.author}</span>
        {" · "}{quote.location}
        {quote.when && (<><span> · </span><Handwritten as="span" color="terracotta">{quote.when}</Handwritten></>)}
      </figcaption>
    </figure>
  </div>
</section>
```

```bash
git add src/components/TrustStrip.astro
git commit -m "feat(components): trust strip with two ratings and a guest quote"
```

---

## NEW T-D: FAQ

**Files:** Create `src/components/FAQ.astro`.

```astro
---
import Eyebrow from "./Eyebrow.astro";
import Handwritten from "./Handwritten.astro";

interface Props {
  eyebrow: string;
  headingPart1: string;
  headingPart2Handwritten: string;
  items: { q: string; a: string }[];
  footerCtaHandwritten?: string;
  footerCtaHref?: string;
  variant?: "default" | "subbg";   // subbg = sub-bg cream block (used on /contact)
}
const { eyebrow, headingPart1, headingPart2Handwritten, items, footerCtaHandwritten, footerCtaHref, variant = "default" } = Astro.props;
---
<section class={variant === "subbg" ? "bg-[color:var(--color-sub-bg)]" : ""}>
  <div class="max-w-[920px] mx-auto px-5 md:px-10 py-20 md:py-28 reveal">
    <div class="text-center">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 class="mt-3 font-serif text-4xl md:text-5xl text-[color:var(--color-ink)] leading-tight">
        {headingPart1}{" "}
        <Handwritten as="em" color="terracotta" class="not-italic text-[1.1em]">{headingPart2Handwritten}</Handwritten>
      </h2>
    </div>

    <ul class="mt-10 space-y-3">
      {items.map((item) => (
        <li>
          <details class="group rounded-md border border-[color:var(--color-divider)] bg-[color:var(--color-cream-elevated)] open:bg-[color:var(--color-cream)] transition">
            <summary class="flex items-center justify-between gap-4 p-5 font-serif text-lg md:text-xl text-[color:var(--color-ink)]">
              <span>{item.q}</span>
              <span class="faq-chev" aria-hidden="true"></span>
            </summary>
            <div class="px-5 pb-5 text-[color:var(--color-ink)]/85">
              {item.a}
            </div>
          </details>
        </li>
      ))}
    </ul>

    {footerCtaHandwritten && footerCtaHref && (
      <p class="mt-10 text-center">
        <a href={footerCtaHref} class="inline-block">
          <Handwritten as="span" color="terracotta" class="text-2xl">{footerCtaHandwritten}</Handwritten>
        </a>
      </p>
    )}
  </div>
</section>
```

```bash
git add src/components/FAQ.astro
git commit -m "feat(components): faq with cross/plus chev and handwritten footer cta"
```

---

## NEW T-E: PageHero

**Files:** Create `src/components/PageHero.astro`.

```astro
---
import Eyebrow from "./Eyebrow.astro";
import Handwritten from "./Handwritten.astro";
import PalmDoodle from "./PalmDoodle.astro";
import SunBloom from "./SunBloom.astro";

interface Props {
  eyebrow: string;
  headingPart1: string;
  headingPart2Handwritten: string;
  intro?: string;
}
---
<section
  class="relative isolate overflow-hidden bg-gradient-to-b from-[color:var(--sunset-cream)] via-[color:var(--sunset-sub-bg)]/60 to-[color:var(--color-cream)] pt-28 md:pt-36 pb-32 md:pb-40"
>
  <!-- Sun blob top-right -->
  <SunBloom class="absolute -top-32 -right-24 w-[520px] h-[520px] md:w-[640px] md:h-[640px] opacity-90" />

  <!-- Palm doodles -->
  <div class="absolute left-6 top-32 text-[color:var(--color-terracotta)]/40">
    <PalmDoodle size={120} rotate={-8} opacity={0.55} />
  </div>
  <div class="absolute right-12 bottom-20 text-[color:var(--color-terracotta)]/40">
    <PalmDoodle size={80} rotate={12} opacity={0.45} />
  </div>
  <div class="absolute left-1/4 bottom-10 text-[color:var(--color-terracotta)]/30 hidden md:block">
    <PalmDoodle size={64} rotate={-4} opacity={0.4} />
  </div>
  <div class="absolute right-1/3 top-44 text-[color:var(--color-terracotta)]/30 hidden md:block">
    <PalmDoodle size={56} rotate={20} opacity={0.4} />
  </div>

  <!-- Cream gradient mask at bottom edge -->
  <div class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[color:var(--color-cream)] pointer-events-none" aria-hidden="true"></div>

  <div class="relative max-w-[1180px] mx-auto px-5 md:px-10 text-center">
    <Eyebrow><slot name="eyebrow"><Fragment set:html={Astro.props.eyebrow} /></slot></Eyebrow>
    <h1 class="mt-4 font-serif text-6xl md:text-8xl text-[color:var(--color-ink)] leading-none">
      <Fragment set:html={Astro.props.headingPart1} />{" "}
      <Handwritten as="em" color="terracotta" class="not-italic">{Astro.props.headingPart2Handwritten}</Handwritten>
    </h1>
    {Astro.props.intro && <p class="mt-6 max-w-2xl mx-auto text-lg text-[color:var(--color-ink)]/80">{Astro.props.intro}</p>}
    <slot />
  </div>
</section>
```

```bash
git add src/components/PageHero.astro
git commit -m "feat(components): page hero with sunset gradient, sun blob, and palm doodles"
```

---

## NEW T-F: RoomFilterBar

**Files:** Create `src/components/RoomFilterBar.astro`.

```astro
---
interface Props {
  labels: { all: string; apartments: string; deluxe: string; family: string; standard: string; economy: string };
}
const { labels } = Astro.props;
const cats = [
  { value: "all",         label: labels.all },
  { value: "apartments",  label: labels.apartments },
  { value: "deluxe",      label: labels.deluxe },
  { value: "family",      label: labels.family },
  { value: "standard",    label: labels.standard },
  { value: "economy",     label: labels.economy },
];
---
<div class="mt-10 flex justify-center">
  <div class="inline-flex flex-wrap gap-2 p-1.5 rounded-full bg-[color:var(--color-cream-elevated)] border border-[color:var(--color-divider)]" role="tablist" aria-label="Filter rooms">
    {cats.map((c, i) => (
      <button
        type="button"
        data-filter={c.value}
        class={`room-filter-btn px-4 py-1.5 rounded-full text-[13px] tracking-wide transition ${i === 0 ? "is-active" : ""}`}
        role="tab"
        aria-selected={i === 0 ? "true" : "false"}
      >{c.label}</button>
    ))}
  </div>
</div>

<style>
  .room-filter-btn {
    color: var(--color-ink);
    background: transparent;
  }
  .room-filter-btn.is-active {
    background: var(--color-terracotta);
    color: var(--color-cream);
  }
  .room-filter-btn:not(.is-active):hover {
    background: var(--color-sub-bg);
  }
</style>

<script is:inline>
  document.addEventListener("DOMContentLoaded", () => {
    const btns = document.querySelectorAll(".room-filter-btn");
    if (btns.length === 0) return;
    btns.forEach((b) => b.addEventListener("click", () => {
      const filter = b.getAttribute("data-filter");
      btns.forEach((x) => {
        x.classList.toggle("is-active", x === b);
        x.setAttribute("aria-selected", x === b ? "true" : "false");
      });
      const articles = document.querySelectorAll("article[data-cat]");
      articles.forEach((a) => {
        const cat = a.getAttribute("data-cat");
        const show = filter === "all" || cat === filter;
        a.style.display = show ? "" : "none";
      });
    }));
  });
</script>
```

```bash
git add src/components/RoomFilterBar.astro
git commit -m "feat(components): rooms filter tab-bar with client-side toggle"
```

---

## NEW T-G: RoomsIncludes

**Files:** Create `src/components/RoomsIncludes.astro`.

```astro
---
import Eyebrow from "./Eyebrow.astro";
import Handwritten from "./Handwritten.astro";

interface Props {
  eyebrow: string;
  heading: string;
  handwritten: string;
  pastryNote: string;
  list: string[];
}
const { eyebrow, heading, handwritten, pastryNote, list } = Astro.props;
const half = Math.ceil(list.length / 2);
const left = list.slice(0, half);
const right = list.slice(half);
---
<section class="bg-[color:var(--color-sub-bg)] reveal">
  <div class="max-w-[1180px] mx-auto px-5 md:px-10 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-start">
    <div>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 class="mt-3 font-serif text-3xl md:text-4xl text-[color:var(--color-ink)] leading-tight">{heading}</h2>
      <Handwritten as="p" color="terracotta" class="mt-3 text-2xl">{handwritten}</Handwritten>
      <p class="mt-5 text-[color:var(--color-ink)]/80 max-w-prose">{pastryNote}</p>
    </div>
    <ul class="grid grid-cols-2 gap-x-6 gap-y-3 text-[color:var(--color-ink)]/85">
      {left.map((item) => <li class="flex items-baseline gap-2"><span class="text-[color:var(--color-terracotta)]">·</span><span>{item}</span></li>)}
      {right.map((item) => <li class="flex items-baseline gap-2"><span class="text-[color:var(--color-terracotta)]">·</span><span>{item}</span></li>)}
    </ul>
  </div>
</section>
```

```bash
git add src/components/RoomsIncludes.astro
git commit -m "feat(components): rooms includes section with two-column amenity list"
```

---

## NEW T-H: HouseRules

**Files:** Create `src/components/HouseRules.astro`.

```astro
---
import Eyebrow from "./Eyebrow.astro";

interface Props {
  eyebrow: string;
  heading: string;
  checkIn: { label: string; value: string; note: string };
  checkOut: { label: string; value: string; note: string };
  notes: { label: string; value: string };
}
const { eyebrow, heading, checkIn, checkOut, notes } = Astro.props;
---
<section class="reveal">
  <div class="max-w-[1180px] mx-auto px-5 md:px-10 py-20 md:py-28 text-center">
    <Eyebrow>{eyebrow}</Eyebrow>
    <h2 class="mt-3 font-serif text-3xl md:text-4xl text-[color:var(--color-ink)]">{heading}</h2>
    <div class="mt-12 grid md:grid-cols-3 gap-10 max-w-3xl mx-auto">
      {[checkIn, checkOut].map((rule) => (
        <div>
          <Eyebrow>{rule.label}</Eyebrow>
          <p class="mt-3 font-serif text-2xl text-[color:var(--color-ink)] tabular-nums">{rule.value}</p>
          <p class="mt-2 text-sm text-[color:var(--color-muted)]">{rule.note}</p>
        </div>
      ))}
      <div>
        <Eyebrow>{notes.label}</Eyebrow>
        <p class="mt-3 text-[color:var(--color-ink)]/85 leading-relaxed">{notes.value}</p>
      </div>
    </div>
  </div>
</section>
```

```bash
git add src/components/HouseRules.astro
git commit -m "feat(components): house rules section (3-col)"
```

---

## NEW T-I: ContactForm

**Files:** Create `src/components/ContactForm.astro`. Submits via `mailto:` (client-side draft compose; no backend).

```astro
---
import { SITE } from "../config/site";

interface Props {
  heading: string;
  intro: string;
  fields: { name: string; email: string; arrival: string; guests: string; message: string };
  submit: string;
  success: string;
}
const { heading, intro, fields, submit, success } = Astro.props;
---
<div>
  <h2 class="font-serif text-3xl md:text-4xl text-[color:var(--color-ink)] leading-tight">{heading}</h2>
  <p class="mt-3 text-[color:var(--color-ink)]/80">{intro}</p>

  <form id="contactForm" class="mt-8 grid gap-5" novalidate>
    <label class="grid gap-1.5">
      <span class="text-sm text-[color:var(--color-muted)]">{fields.name}</span>
      <input type="text" name="name" required class="px-4 py-3 rounded border border-[color:var(--color-divider)] bg-[color:var(--color-cream-elevated)] focus:outline-none focus:border-[color:var(--color-terracotta)]" />
    </label>
    <label class="grid gap-1.5">
      <span class="text-sm text-[color:var(--color-muted)]">{fields.email}</span>
      <input type="email" name="email" required class="px-4 py-3 rounded border border-[color:var(--color-divider)] bg-[color:var(--color-cream-elevated)] focus:outline-none focus:border-[color:var(--color-terracotta)]" />
    </label>
    <div class="grid grid-cols-2 gap-5">
      <label class="grid gap-1.5">
        <span class="text-sm text-[color:var(--color-muted)]">{fields.arrival}</span>
        <input type="date" name="arrival" class="px-4 py-3 rounded border border-[color:var(--color-divider)] bg-[color:var(--color-cream-elevated)] focus:outline-none focus:border-[color:var(--color-terracotta)]" />
      </label>
      <label class="grid gap-1.5">
        <span class="text-sm text-[color:var(--color-muted)]">{fields.guests}</span>
        <select name="guests" class="px-4 py-3 rounded border border-[color:var(--color-divider)] bg-[color:var(--color-cream-elevated)] focus:outline-none focus:border-[color:var(--color-terracotta)]">
          <option value="1">1</option><option value="2" selected>2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option>
        </select>
      </label>
    </div>
    <label class="grid gap-1.5">
      <span class="text-sm text-[color:var(--color-muted)]">{fields.message}</span>
      <textarea name="message" rows="5" required class="px-4 py-3 rounded border border-[color:var(--color-divider)] bg-[color:var(--color-cream-elevated)] focus:outline-none focus:border-[color:var(--color-terracotta)]"></textarea>
    </label>
    <button type="submit" class="justify-self-start inline-flex items-center px-6 py-3 bg-[color:var(--color-terracotta)] hover:bg-[color:var(--color-terracotta-hover)] text-[color:var(--color-cream)] font-medium tracking-wide rounded transition">
      {submit}
    </button>
    <p id="contactFormSuccess" class="hidden text-[color:var(--color-sea)] handwritten text-xl">{success}</p>
  </form>
</div>

<script is:inline define:vars={{ MAIL: SITE.contact.email }}>
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = data.get("name") || "";
      const email = data.get("email") || "";
      const arrival = data.get("arrival") || "";
      const guests = data.get("guests") || "";
      const message = data.get("message") || "";
      const subject = encodeURIComponent(`Vila Emes — message from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nArrival: ${arrival}\nGuests: ${guests}\n\n${message}\n`
      );
      window.location.href = `mailto:${MAIL}?subject=${subject}&body=${body}`;
      document.getElementById("contactFormSuccess")?.classList.remove("hidden");
    });
  });
</script>
```

```bash
git add src/components/ContactForm.astro
git commit -m "feat(components): minimal contact form with mailto draft compose"
```

---

## NEW T-J: ContactSidebar

**Files:** Create `src/components/ContactSidebar.astro`.

```astro
---
import Eyebrow from "./Eyebrow.astro";
import Handwritten from "./Handwritten.astro";
import { SITE } from "../config/site";

interface Props {
  addressLabel: string;
  hoursLabel: string;
  speakToLabel: string;
  speakToName: string;
  speakToRole: string;
  speakToHandwritten: string;
}
const { addressLabel, hoursLabel, speakToLabel, speakToName, speakToRole, speakToHandwritten } = Astro.props;
---
<aside class="space-y-10">
  <div>
    <Eyebrow>{addressLabel}</Eyebrow>
    <address class="mt-3 not-italic font-serif text-lg text-[color:var(--color-ink)] space-y-0.5">
      {SITE.contact.address.map((line) => <p>{line}</p>)}
    </address>
  </div>

  <div>
    <Eyebrow>{hoursLabel}</Eyebrow>
    <dl class="mt-3 grid gap-1.5 text-sm">
      <div class="flex justify-between gap-4">
        <dt class="text-[color:var(--color-muted)]">Front desk</dt>
        <dd class="text-[color:var(--color-ink)] font-serif">{SITE.hours.front_desk}</dd>
      </div>
      <div class="flex justify-between gap-4">
        <dt class="text-[color:var(--color-muted)]">Check-in</dt>
        <dd class="text-[color:var(--color-ink)] font-serif tabular-nums">{SITE.hours.check_in}</dd>
      </div>
      <div class="flex justify-between gap-4">
        <dt class="text-[color:var(--color-muted)]">Check-out</dt>
        <dd class="text-[color:var(--color-ink)] font-serif tabular-nums">{SITE.hours.check_out}</dd>
      </div>
    </dl>
  </div>

  <div>
    <Eyebrow>{speakToLabel}</Eyebrow>
    <p class="mt-3 font-serif text-xl text-[color:var(--color-ink)]">{speakToName}</p>
    <p class="text-sm text-[color:var(--color-muted)]">{speakToRole}</p>
    <Handwritten as="p" color="terracotta" class="mt-3 text-2xl">{speakToHandwritten}</Handwritten>
  </div>
</aside>
```

```bash
git add src/components/ContactSidebar.astro
git commit -m "feat(components): contact sidebar (address, hours, speak-to-shaban)"
```

---

## NEW T-K: Directions

**Files:** Create `src/components/Directions.astro`.

```astro
---
import Eyebrow from "./Eyebrow.astro";
import LocationMap from "./LocationMap.astro";
import { SITE } from "../config/site";

interface Props {
  eyebrow: string;
  heading: string;
  mapsCta: string;
}
const { eyebrow, heading, mapsCta } = Astro.props;
---
<section class="reveal">
  <div class="max-w-[1180px] mx-auto px-5 md:px-10 py-20 md:py-28 grid md:grid-cols-2 gap-10 md:gap-16 items-start">
    <div>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 class="mt-3 font-serif text-3xl md:text-4xl text-[color:var(--color-ink)]">{heading}</h2>
      <ul class="mt-8 divide-y divide-[color:var(--color-divider)]">
        {SITE.distances.map((d) => (
          <li class="py-4 grid grid-cols-[auto_1fr] gap-x-6 items-baseline">
            <span class="font-serif text-3xl text-[color:var(--color-terracotta)] tabular-nums">{d.value}</span>
            <div>
              <p class="font-medium text-[color:var(--color-ink)]">{d.label}</p>
              <p class="text-sm text-[color:var(--color-muted)] mt-1">{d.blurb}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
    <div class="space-y-5">
      <LocationMap mode="drawn" ariaLabel="Hand-drawn map of Vila Emes location" />
      <a
        href={SITE.links.google_maps}
        target="_blank" rel="noopener"
        class="inline-flex items-center px-5 py-3 border border-[color:var(--color-sea)] text-[color:var(--color-sea)] hover:bg-[color:var(--color-sea)] hover:text-[color:var(--color-cream)] rounded-md transition"
      >{mapsCta}</a>
    </div>
  </div>
</section>
```

```bash
git add src/components/Directions.astro
git commit -m "feat(components): directions section with distance table and drawn map"
```

---

## R-25 (Task 25 replace): HomeView

**Files:** `src/views/HomeView.astro`. Replace contents with composition that mounts: Header → Hero → About → TrustStrip → RoomsPreview (4 cards) → Gallery → Location (left text + drawn map) → ContactStrip → FAQ → Footer. Pull all data from `getSite(lang)` and the photo manifest. Important details:

- Header: `isHome={true}` (transparent over hero).
- Hero: pass `cover` (curated photo from `main` category), `polaroid` (smaller curated photo, ideally a family/exterior shot).
- RoomsPreview: 4 cards covering 4 representative families (one Apartment, one Deluxe, one Family, one Triple/Quad). Use `rooms.find(r => r.id === "apt-1bed-terrace")` etc.
- Gallery: pass an array of `{ src, alt, caption }` built from a manifest of 12 curated photos + caption lookup against `home.gallery.captions[basename]`.
- Location: 2-col with address + distance prose + Maps CTA on left, `<LocationMap mode="drawn" />` on right.
- FAQ: full 6 items with footer CTA pointing to `/contact`.

Skeleton (for the executing agent — fill in based on the spec and your locale data):

```astro
---
import Base from "../layouts/Base.astro";
import Header from "../components/Header.astro";
import Hero from "../components/Hero.astro";
import About from "../components/About.astro";
import TrustStrip from "../components/TrustStrip.astro";
import RoomCard from "../components/RoomCard.astro";
import Gallery from "../components/Gallery.astro";
import LocationMap from "../components/LocationMap.astro";
import ContactStrip from "../components/ContactStrip.astro";
import FAQ from "../components/FAQ.astro";
import Footer from "../components/Footer.astro";
import Eyebrow from "../components/Eyebrow.astro";
import { getSite } from "../i18n/content";
import type { Lang } from "../i18n/locales";
import { SITE } from "../config/site";
// Curated photos — one of these matches the spec photo categories
import heroCover from "../assets/photos/main/<chosen-cover>-2400.webp";
import heroPolaroid from "../assets/photos/main/<chosen-polaroid>-1600.webp";
import aboutPhoto from "../assets/photos/main/<chosen-about>-1600.webp";
// ... and so on for room previews + gallery

interface Props { lang: Lang }
const { lang } = Astro.props;
const site = await getSite(lang);

const baseLink = lang === "en" ? "" : `/${lang}`;

const home = site.data.home;
const ui = site.data.ui;
const rooms = site.data.rooms;
const get = (id: string) => rooms.find((r) => r.id === id)!;

const previewFamilies = [
  { room: get("apt-1bed-terrace"),  numberLabel: "01", familyLabel: ui.family_groups.apartments },
  { room: get("deluxe-king"),       numberLabel: "02", familyLabel: ui.family_groups.deluxe },
  { room: get("family-balcony"),    numberLabel: "03", familyLabel: ui.family_groups.family },
  { room: get("quad-sea"),          numberLabel: "04", familyLabel: "Triple & Quad" },
];

const tiles = [
  { kind: "phone",     label: "Phone",     value: SITE.contact.phone,    href: `tel:${SITE.contact.phone.replace(/\s+/g, "")}` },
  { kind: "whatsapp",  label: "WhatsApp",  value: SITE.contact.whatsapp, href: `https://wa.me/${SITE.contact.whatsapp.replace(/[^0-9]/g, "")}` },
  { kind: "email",     label: "Email",     value: SITE.contact.email,    href: `mailto:${SITE.contact.email}` },
  { kind: "instagram", label: "Instagram", value: "@vilaemes",           href: SITE.links.instagram },
  { kind: "booking",   label: "Booking.com", value: "Book online",       href: SITE.links.booking_com },
] as const;
---
<Base lang={lang} title={`${site.data.hotel.name} — ${site.data.hotel.tagline}`}>
  <Header lang={lang} ui={ui.nav} isHome hotelName={site.data.hotel.name} />

  <Hero
    cover={heroCover}
    polaroid={heroPolaroid}
    eyebrow={home.hero.eyebrow}
    welcomeHandwritten={home.hero.welcome_handwritten}
    heading={home.hero.heading}
    sub={home.hero.sub}
    ctaPrimary={{ label: home.hero.cta_primary, href: SITE.links.booking_com }}
    ctaSecondary={{ label: home.hero.cta_secondary, href: SITE.links.google_maps }}
    polaroidCaption={home.hero.polaroid_caption_handwritten}
    hotelName={site.data.hotel.name}
  />

  <About
    eyebrow={home.about.eyebrow}
    headingPart1={home.about.heading_part_1}
    headingPart2Handwritten={home.about.heading_part_2_handwritten}
    handwrittenYear={home.about.handwritten_year}
    body={home.about.body}
    signatureHandwritten={home.about.signature_handwritten}
    photo={aboutPhoto}
    photoCaption={home.about.photo_caption}
  />

  <TrustStrip
    bookingLabel={home.trust.booking_label}
    bookingScore={SITE.ratings.booking}
    googleLabel={home.trust.google_label}
    googleScore={SITE.ratings.google}
    quote={home.trust.quote}
  />

  <section class="max-w-[1180px] mx-auto px-5 md:px-10 py-20 md:py-32 reveal">
    <div class="text-center max-w-2xl mx-auto">
      <Eyebrow>{home.rooms.eyebrow}</Eyebrow>
      <h2 class="mt-3 font-serif text-4xl md:text-5xl text-[color:var(--color-ink)]">{home.rooms.heading}</h2>
      <p class="mt-4 text-[color:var(--color-ink)]/80">{home.rooms.intro}</p>
    </div>
    <div class="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
      {previewFamilies.map((p) => (
        <RoomCard
          href={`${baseLink}/rooms#${p.room.id}`}
          photo={/* import room hero photo by id */ heroCover}
          numberLabel={p.numberLabel}
          familyLabel={p.familyLabel}
          name={p.room.name}
          capacity={p.room.sleeps_label}
          detailsLabel={home.rooms.preview_card_cta}
        />
      ))}
    </div>
  </section>

  {/* Gallery — assemble photos[] manually from manifest, attach caption from home.gallery.captions[baseName] */}
  {/* Location section — 2-col with address + cta + drawn map */}

  <ContactStrip
    eyebrow={home.contact_strip.eyebrow}
    headingPart1={home.contact_strip.heading_part_1}
    headingPart2Handwritten={home.contact_strip.heading_part_2_handwritten}
    tiles={tiles}
  />

  <FAQ
    eyebrow={home.faq.eyebrow}
    headingPart1={home.faq.heading_part_1}
    headingPart2Handwritten={home.faq.heading_part_2_handwritten}
    items={home.faq.items}
    footerCtaHandwritten={home.faq.footer_cta_handwritten}
    footerCtaHref={`${baseLink}/contact`}
  />

  <Footer lang={lang} handwritten={ui.footer.handwritten} copyright={ui.footer.copyright} />
</Base>
```

```bash
git add src/views/HomeView.astro
git commit -m "feat(views): home view with hero, about, trust, rooms preview, gallery, location, contact, faq"
```

---

## R-26 (Task 26 replace): RoomsView

**Files:** `src/views/RoomsView.astro`. Composition: Header (solid) → PageHero with filter → 11 alternating RoomDetails articles → RoomsIncludes → HouseRules → "Still deciding?" CTA → Footer.

```astro
---
import Base from "../layouts/Base.astro";
import Header from "../components/Header.astro";
import PageHero from "../components/PageHero.astro";
import RoomFilterBar from "../components/RoomFilterBar.astro";
import RoomDetails from "../components/RoomDetails.astro";
import RoomsIncludes from "../components/RoomsIncludes.astro";
import HouseRules from "../components/HouseRules.astro";
import Footer from "../components/Footer.astro";
import Handwritten from "../components/Handwritten.astro";
import { getSite } from "../i18n/content";
import { SITE } from "../config/site";
import type { Lang } from "../i18n/locales";
// Photo imports — by room id
// import imgApt1Bed from "../assets/photos/apt-1bed-terrace/<chosen>-1600.webp";
// ... import one hero photo per room id

interface Props { lang: Lang }
const { lang } = Astro.props;
const site = await getSite(lang);
const ui = site.data.ui;
const page = site.data.rooms_page;
const rooms = site.data.rooms;
const baseLink = lang === "en" ? "" : `/${lang}`;

// Map room id → primary photo (executor wires this up after Task 24's manifest helper)
const roomPhoto: Record<string, ImageMetadata> = {
  // "apt-1bed-terrace": imgApt1Bed,
  // ... fill in
};
---
<Base lang={lang} title={`${ui.nav.rooms} — ${site.data.hotel.name}`}>
  <Header lang={lang} ui={ui.nav} hotelName={site.data.hotel.name} />

  <PageHero
    eyebrow={page.hero_eyebrow}
    headingPart1={page.hero_heading_part_1}
    headingPart2Handwritten={page.hero_heading_part_2_handwritten}
    intro={page.hero_intro}
  >
    <RoomFilterBar labels={ui.filter} />
  </PageHero>

  <main class="rooms-main">
    {rooms.sort((a, b) => a.order - b.order).map((r, i) => (
      <RoomDetails
        id={r.id}
        cat={r.family}
        numberLabel={String(r.order).padStart(2, "0")}
        familyLabel={ui.family_groups[r.family]}
        name={r.name}
        size={`${r.size_m2} m²`}
        beds={r.beds}
        view={r.view}
        outdoor={r.outdoor}
        capacity={r.sleeps_label}
        description={r.description}
        amenities={r.amenities.map((kind) => ({ kind, label: ui.amenity_labels[kind] }))}
        photos={[roomPhoto[r.id]]}
        bookHref={SITE.links.booking_com}
        bookLabel={ui.buttons.book}
        flip={i % 2 === 1}
        labels={ui.labels}
      />
    ))}
  </main>

  <RoomsIncludes
    eyebrow={page.includes.eyebrow}
    heading={page.includes.heading}
    handwritten={page.includes.handwritten}
    pastryNote={page.includes.pastry_note}
    list={page.includes.list}
  />

  <HouseRules
    eyebrow={page.rules.eyebrow}
    heading={page.rules.heading}
    checkIn={page.rules.check_in}
    checkOut={page.rules.check_out}
    notes={page.rules.notes}
  />

  <section class="reveal">
    <div class="max-w-2xl mx-auto px-5 py-20 text-center">
      <Handwritten as="p" color="terracotta" class="text-2xl">{page.cta.handwritten}</Handwritten>
      <h2 class="mt-3 font-serif text-3xl md:text-4xl text-[color:var(--color-ink)]">{page.cta.heading}</h2>
      <a
        href={`${baseLink}/contact`}
        class="inline-flex items-center mt-8 px-6 py-3 border border-[color:var(--color-sea)] text-[color:var(--color-sea)] hover:bg-[color:var(--color-sea)] hover:text-[color:var(--color-cream)] rounded-md transition"
      >{page.cta.button}</a>
    </div>
  </section>

  <Footer lang={lang} handwritten={ui.footer.handwritten} copyright={ui.footer.copyright} />
</Base>
```

```bash
git add src/views/RoomsView.astro
git commit -m "feat(views): rooms view — page hero, filter, alternating 11 rooms, includes, rules, cta"
```

---

## R-27 (Task 27 replace): ContactView

**Files:** `src/views/ContactView.astro`. Composition: Header (solid) → PageHero → ContactStrip → 5-col grid (form + sidebar) → Directions → real iframe LocationMap → FAQ → Footer.

```astro
---
import Base from "../layouts/Base.astro";
import Header from "../components/Header.astro";
import PageHero from "../components/PageHero.astro";
import ContactStrip from "../components/ContactStrip.astro";
import ContactForm from "../components/ContactForm.astro";
import ContactSidebar from "../components/ContactSidebar.astro";
import Directions from "../components/Directions.astro";
import LocationMap from "../components/LocationMap.astro";
import FAQ from "../components/FAQ.astro";
import Footer from "../components/Footer.astro";
import { getSite } from "../i18n/content";
import { SITE } from "../config/site";
import type { Lang } from "../i18n/locales";

interface Props { lang: Lang }
const { lang } = Astro.props;
const site = await getSite(lang);
const ui = site.data.ui;
const page = site.data.contact_page;
const home = site.data.home;

const tiles = [
  { kind: "phone",     label: "Phone",       value: SITE.contact.phone,    href: `tel:${SITE.contact.phone.replace(/\s+/g, "")}` },
  { kind: "whatsapp",  label: "WhatsApp",    value: SITE.contact.whatsapp, href: `https://wa.me/${SITE.contact.whatsapp.replace(/[^0-9]/g, "")}` },
  { kind: "email",     label: "Email",       value: SITE.contact.email,    href: `mailto:${SITE.contact.email}` },
  { kind: "instagram", label: "Instagram",   value: "@vilaemes",           href: SITE.links.instagram },
  { kind: "booking",   label: "Booking.com", value: "Book online",         href: SITE.links.booking_com },
] as const;
---
<Base lang={lang} title={`${ui.nav.contact} — ${site.data.hotel.name}`}>
  <Header lang={lang} ui={ui.nav} hotelName={site.data.hotel.name} />

  <PageHero
    eyebrow={page.hero_eyebrow}
    headingPart1={page.hero_heading_part_1}
    headingPart2Handwritten={page.hero_heading_part_2_handwritten}
    intro={page.hero_intro}
  />

  <ContactStrip
    eyebrow={home.contact_strip.eyebrow}
    headingPart1={home.contact_strip.heading_part_1}
    headingPart2Handwritten={home.contact_strip.heading_part_2_handwritten}
    tiles={tiles}
  />

  <section class="max-w-[1180px] mx-auto px-5 md:px-10 py-20 md:py-28 grid md:grid-cols-5 gap-12 reveal">
    <div class="md:col-span-3">
      <ContactForm
        heading={page.form.heading}
        intro={page.form.intro}
        fields={page.form.fields}
        submit={page.form.submit}
        success={page.form.success}
      />
    </div>
    <div class="md:col-span-2">
      <ContactSidebar
        addressLabel={page.sidebar.address_label}
        hoursLabel={page.sidebar.hours_label}
        speakToLabel={page.sidebar.speak_to_label}
        speakToName={page.sidebar.speak_to_name}
        speakToRole={page.sidebar.speak_to_role}
        speakToHandwritten={page.sidebar.speak_to_handwritten}
      />
    </div>
  </section>

  <Directions
    eyebrow={page.directions.eyebrow}
    heading={page.directions.heading}
    mapsCta={ui.buttons.map}
  />

  <section class="max-w-[1180px] mx-auto px-5 md:px-10 pb-20 reveal">
    <LocationMap mode="iframe" embedUrl={SITE.links.google_maps_embed} ariaLabel="Vila Emes location on Google Maps" />
  </section>

  <FAQ
    eyebrow={home.faq.eyebrow}
    headingPart1={home.faq.heading_part_1}
    headingPart2Handwritten={home.faq.heading_part_2_handwritten}
    items={home.faq.items}
    variant="subbg"
  />

  <Footer lang={lang} handwritten={ui.footer.handwritten} copyright={ui.footer.copyright} />
</Base>
```

```bash
git add src/views/ContactView.astro
git commit -m "feat(views): contact view — page hero, contact strip, form+sidebar, directions, map, faq"
```

---

## R-30 (Task 30 update): Acceptance additions

Add to v1's acceptance checklist:

- [ ] Logo + palm doodles visually consistent (both derived from the same hand-drawn source).
- [ ] Sticky header transitions smoothly transparent → solid on home; always solid on `/rooms` and `/contact`.
- [ ] Reveal-on-scroll respects `prefers-reduced-motion`.
- [ ] FAQ accordion uses `<details>`; chev pseudo-element renders cross/plus across Chrome/Safari/Firefox.
- [ ] Contact form `mailto:` opens user's mail client with prefilled subject + body (test by clicking Send).
- [ ] Trust strip shows `9.0 Booking.com` and `4.7 Google · ★` with no review-count caption.
- [ ] Room filter shows correct counts: All · 11 · Apartments · 2 · Deluxe · 3 · Family · 3 · Standard · 1 · Economy · 2.
- [ ] `renovated-2024` pill appears only on the three Deluxe rooms (Deluxe King, Deluxe Queen, Deluxe Double with Balcony).
- [ ] `/rooms` filter buttons toggle visibility of the matching `[data-cat]` articles.
- [ ] `/contact` real Google Maps iframe loads only when scrolled into view (DevTools → Network → confirm lazy).
- [ ] Cream `#F4F0E7` body background visible on all 12 pages.
- [ ] Caveat font renders correctly (handwritten phrases visibly different from serif headings).

---

## R-31 (Task 31 update): Photo shortlist (11 rooms)

Update `docs/photos-shortlist.md` template to list all 11 rooms instead of 3 categories. Each room id (e.g. `apt-1bed-terrace`) gets one section with:

- Hero photo (used in alternating layout at large size)
- 3–5 detail photos for the room sub-gallery
- 1 placeholder for the home preview card (if this room is one of the 4 family representatives)

Plus the home photo slots:
- `home-hero-cover` (full-bleed exterior)
- `home-hero-polaroid` (small inset, ideally a family/exterior detail)
- `home-about` (square exterior)
- `home-gallery × 12` (with optional captions)

---

## Appendix: amenity icons (paths, 18×18 viewBox 24)

For `Amenity.astro` icon switch:

```ts
const ICONS: Record<AmenityKind, string> = {
  "air-con":         '<rect x="3" y="6" width="18" height="8" rx="1.5"/><path d="M6 14v4M12 14v4M18 14v4"/>',
  "wifi":            '<path d="M5 12.5a10 10 0 0 1 14 0M8 15.5a6 6 0 0 1 8 0M11 18.5a2 2 0 0 1 2 0"/><circle cx="12" cy="20.5" r="0.6" fill="currentColor"/>',
  "flat-tv":         '<rect x="3" y="5" width="18" height="12" rx="1.5"/><path d="M9 21h6"/>',
  "private-bath":    '<path d="M3 12h18v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3z"/><path d="M7 12V6a3 3 0 0 1 6 0"/>',
  "bathtub-shower":  '<path d="M3 12h18v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3z"/><path d="M9 12V8a3 3 0 0 1 6 0"/><path d="M14 4l2 2M16 6l2 2"/>',
  "sea-view":        '<path d="M3 18c2-1.5 4-1.5 6 0 2 1.5 4 1.5 6 0 2-1.5 4-1.5 6 0"/><path d="M3 14c2-1.5 4-1.5 6 0 2 1.5 4 1.5 6 0 2-1.5 4-1.5 6 0"/><circle cx="18" cy="6" r="2.5"/>',
  "balcony":         '<rect x="4" y="6" width="16" height="3" rx="0.5"/><path d="M6 9v9M10 9v9M14 9v9M18 9v9M4 18h16"/>',
  "terrace":         '<path d="M4 21h16M5 21V9l7-4 7 4v12"/><path d="M9 21V14h6v7"/>',
  "kitchenette":     '<rect x="3" y="3" width="18" height="6" rx="1"/><rect x="3" y="11" width="8" height="10" rx="1"/><rect x="13" y="11" width="8" height="10" rx="1"/>',
  "2-bedrooms":      '<path d="M2 17v-4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4M14 17v-4a2 2 0 0 1 2-2h6"/><path d="M2 21h20"/>',
  "mini-fridge":     '<rect x="6" y="3" width="12" height="18" rx="1.5"/><path d="M6 11h12M9 7v2M9 15v2"/>',
  "family-friendly": '<circle cx="9" cy="7" r="2.5"/><path d="M5 18a4 4 0 0 1 8 0"/><circle cx="17" cy="9" r="2"/><path d="M14 18a3 3 0 0 1 6 0"/>',
  "sofa-bed":        '<path d="M3 14v4a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-4M3 14a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3"/><path d="M5 14V9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5"/>',
  "renovated-2024":  '<!-- rendered as ★ stamp, not an icon -->',
};
```

---

## Execution order

Execute in v1 order, but **for any task referenced in the table at the top, use the v2 version from this file**. Skip the v1 body for those tasks. New tasks (T-A through T-K) slot in at the points indicated.

Recommended commit cadence: one commit per task (matching the `git add` + `git commit` blocks above). Keeps history granular for review.
