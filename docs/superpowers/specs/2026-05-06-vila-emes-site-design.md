# Vila Emes — Hotel Website Design Spec

**Date:** 2026-05-06
**Last revised:** 2026-05-07 — locked design draft + Booking source-of-truth corrections (see `docs/design-analysis.md`)
**Owner:** danajerban
**Project folder:** `/Users/erbandanaj/Downloads/xCode/hotel-vila-emes`
**Git remote:** `https://github.com/danajerban/vila-emes.git`
**Hosting:** Cloudflare Pages (free tier)
**Domain:** TBD (placeholder until purchased)

## Goal

A simple, beautiful marketing site for **Vila Emes** — a small family-run hotel in **Plazh, Durrës, Albania**, run by **Shaban Emes** with help from his daughter and son. Welcoming guests since **1998**; two generations of the same family.

The site does **not** handle reservations. Every booking CTA links to **Booking.com** (placeholder URL until owner supplies). Other primary CTAs link to **Google Maps**, **Instagram**, **WhatsApp**, **email** (`vilaemes@gmail.com`), and **phone** (placeholder `+355`). One minimal `mailto:` contact form on `/contact`.

## Stack

- **Astro 5.x** (static site generation, TypeScript strict)
- **Tailwind CSS v4** via `@tailwindcss/vite` with `@theme {}` token block
- **Astro built-in i18n** for locale routing (4 locales)
- **Astro `<Image>`** for build-time webp + responsive srcsets
- **Sharp** (one-shot script) for source-photo optimization before they enter the repo
- **SVGO** (one-shot) to optimize the master logo SVG and extract palm-tree paths for site-wide doodles
- No client framework. Vanilla TS only for: lightbox, language switcher, FAQ accordion (`<details>`), sticky-header scroll listener, room-filter tab toggle, reveal-on-scroll IntersectionObserver, contact-form mailto.

## Languages

Four locales, English is default. Translation strategy: EN authored from this spec; AL/IT/DE start as byte-for-byte copies of EN and the owner translates each via Google Translate.

| Locale key | URL prefix | `<html lang="">` | Content source |
|---|---|---|---|
| `en` | `/` (no prefix) | `en` | Owner-authored (this spec) |
| `al` | `/al/` | `sq` (ISO 639-1 for Albanian) | Owner translates with Google Translate |
| `it` | `/it/` | `it` | Owner translates with Google Translate |
| `de` | `/de/` | `de` | Owner translates with Google Translate |

Astro config: `i18n.defaultLocale = "en"`, `i18n.locales = ["en", "al", "it", "de"]`. Default routing — English unprefixed, others prefixed.

**Why the `al`/`sq` split:** the URL prefix `/al/` is intuitive for Albanian visitors (country code), but the HTML `lang` attribute uses ISO 639-1 `sq` so screen-readers and search engines identify the language correctly. The mapping lives in a single `LOCALE_TO_LANG` constant.

> **Note re: spoken languages.** Booking confirms staff speak **English, Italian, and Albanian** on-site. The German *website* translation exists for German-speaking guests; the FAQ honestly answers "EN/IT/AL" for spoken-language inquiries.

## Site map

| Route | Purpose | Localized variants |
|---|---|---|
| `/` | One-page home: hero · about · trust strip · rooms preview · gallery · location · contact · FAQ | `/al/`, `/it/`, `/de/` |
| `/rooms` | All 11 individual rooms with 5-family filter, "always included" amenities, house rules, "still deciding" CTA | `/al/rooms`, `/it/rooms`, `/de/rooms` |
| `/contact` | 5-tile contact strip · minimal mailto form · sidebar (address/hours/Shaban) · directions · real Google Maps iframe · FAQ | `/al/contact`, `/it/contact`, `/de/contact` |

12 pages total (3 routes × 4 locales).

## Visual design

**Aesthetic:** Warm Mediterranean × sunset palette × hand-drawn family-run charm. Sun, palms, terracotta, and handwritten Caveat accents appear site-wide.

### Colors

| Token | Value | Usage |
|---|---|---|
| `--color-cream` | `#F4F0E7` | **Page background (canonical)** |
| `--color-cream-elevated` | `#FAF6EE` | Header solid state, footer, inset panels |
| `--color-sub-bg` | `#F5EFE2` | Trust strip, contact strip, FAQ section |
| `--color-postcard` | `#F4E9D0` | Postcard-voice room paragraphs |
| `--color-ink` | `#1F1A14` | Body text, default ink |
| `--color-ink-deep` | `#5C5141` | Amenity pill text, room body-deep |
| `--color-terracotta` | `#C25B3F` | Handwritten accents, primary buttons, sun bloom |
| `--color-terracotta-hover` | `#A94A30` | Primary button hover |
| `--color-sea` | `#2E5C7E` | Icons, secondary outline buttons |
| `--color-muted` | `#8C7E6A` | Eyebrows, body-light |
| `--color-divider` | `#E8DFCF` | Borders, hairline dividers |
| **Sunset palette** (PageHero on `/rooms` + `/contact`, accent washes site-wide) | | |
| `--sunset-cream` | `#FBE9D2` | Sunset banner body |
| `--sunset-border` | `#EDC9A0` | Sunset banner border |
| `--sunset-sub-bg` | `#F6D9B6` | Sunset deeper sub-bg |
| `--sunset-sun` | `#C25B3F` | Sun blob center (terracotta variant) |

### Type

| Role | Font | Weights |
|---|---|---|
| Headings (h1–h4) | **Cormorant Garamond** (variable) | 400/500/600 + italic 400/500 |
| Body | **Inter** (variable) | 300/400/500/600 |
| Handwritten accents | **Caveat** (static) | 400/500/600 |
| Wordmark | Cormorant Garamond, letter-spacing `0.22em`, weight 500 | |
| Eyebrow | Inter, letter-spacing `0.22em`, uppercase, 11px, weight 500 | |
| Nav link | Inter, letter-spacing `0.18em`, uppercase, 13px, weight 500 | |

Body sizes: 16px mobile / 17px ≥768px. Line-height 1.6.

### Spacing

- Section vertical rhythm: `py-20 md:py-32` (80 → 128px)
- Sub-section: `py-14 md:py-20`
- Containers: `max-w-[1280px]` for header / full-bleed; `max-w-[1180px]` for content; `max-w-[920px]` for FAQ
- Page side padding: `px-5 md:px-10` (20 / 40px)
- Header height: `h-16 md:h-20` (64 / 80px)

### Radii

- Cards / buttons / photos: `6px`
- Pills (amenity, filter, lang switcher): `999px`
- Form inputs: `4px`
- FAQ chev circle: `28×28 50%` with cross/plus pseudo-elements

### Shadows / motion

- Cards: `box-shadow: 0 1px 0 rgba(31,26,20,0.02)` (faint)
- Polaroid (hero inset): `shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)]`
- Reveal-on-scroll: `opacity 0→1, translateY(14px→0), 0.8s ease`, IntersectionObserver, **respects `prefers-reduced-motion`**
- Room-card hover: `translate-y(-2px)` + child image `scale(1.02)` over 0.6s
- Sticky header: transparent → solid (with backdrop-blur) on scroll
- No parallax, no autoplaying carousels

### Brand decoration

- **Logo** — the existing hand-drawn SVG at `Emes/Logo/Vila Emes.svg` (3 palm trees + flying birds + handwritten "Vila Emes hotel" wordmark). Single transparent illustration sitting on the cream `#F4F0E7` page background. Optimized via SVGO (target ≤ 30 KB inline) and used in the header (small) and footer (medium). Master copy at `src/assets/logo/vila-emes.svg`. PNG variant at `src/assets/logo/vila-emes-1024.png` for `og:image` + favicon set.
- **Palm doodles** — palm-tree paths extracted from the same logo via SVGO and saved as `src/assets/decorations/palm-doodle.svg` (~5 KB). Hand-placed across sections via a `<PalmDoodle>` component (NOT runtime random) so the doodles match the logo's hand-drawn style exactly.
- **Sun blob** — inline SVG `<SunBloom>` component on PageHero of `/rooms` + `/contact`, with a subtle terracotta gradient.

## Page structure

### `/` — Home (single scroll)

1. **Header** — sticky. Transparent over hero, solid (with backdrop-blur) after scroll. Logo (SVG inline, left), nav (Home / Rooms / Contact), language switcher (EN / AL / IT / DE). Mobile: hamburger nav, lang menu dropdown.
2. **Hero** — full-bleed photo from `Main/`, dark gradient scrim top + bottom. Eyebrow `Durrës · Albania · Since 1998`. Handwritten "welcome to" + serif "Vila Emes". Sub: *"Eleven layouts. Two generations of one family. The same coffee on the terrace every morning."* CTAs: "Book on Booking.com" (primary terracotta), "Open in Maps" (secondary outline). Polaroid family-note inset bottom-right (hidden < `lg`).
3. **About** — 2-col grid. Left: eyebrow "Our story", h2 "A small house, *kept by one family.*" (handwritten italic terracotta on second clause), handwritten "— since 1998", three paragraphs invoking Shaban + the pastry shop on the ground floor + welcomes from his daughter and son, hairline divider, handwritten "— with love, the Emes family". Right: real exterior photo (square) with eyebrow caption "Vila Emes · Plazh, Durrës".
4. **Trust strip** — sub-bg `#F5EFE2`. 12-col grid. Left: `9.0 Booking.com` + `4.7 Google · ★`. Right: blockquote with 28×22 quote SVG — Etain (Ireland) review with attribution. **No review-count caption.**
5. **Rooms preview** — eyebrow "Stay" + h2 "Our Rooms" + intro: *"Eleven layouts in total, from a 30 m² double to a 90 m² apartment with sea view."* + 4 cards (Apartments / Deluxe / Family / Triple & Quad) each with placeholder photo + numbered eyebrow ("01 · Apartments") + capacity row + "View details →" linking to `/rooms#<id>`.
6. **Gallery** — eyebrow + h2 + intro + CSS-columns masonry of 12 placeholder tiles, with handwritten captions on 4 of them ("balcony, room 204", "the walk down to the water", "first light, August", "our coffee corner").
7. **Location** — 2-col grid. Left: address (3 serif lines), distances paragraph, primary "Open in Maps". Right: hand-drawn coastline + drop-pin SVG tile.
8. **Contact strip** — sub-bg `#F5EFE2`. Eyebrow "Come say hello", h2 "Get in *touch*" (handwritten italic on "touch"). 5-card grid (Phone / WhatsApp / Email / Instagram / Booking.com) each with circular icon, eyebrow label, serif value.
9. **FAQ** — narrow column `max-w-[920px]`. Eyebrow "Before you ask" + h2 "Frequently *asked*" + 6 details/summary items. Trailing handwritten "Don't see your question? Write to us →" → `/contact`.
10. **Footer** — cream-elevated bg, top hairline border. Mobile lang switcher, optimized logo (medium), handwritten "made with care by the Emes family", "© 2026 Vila Emes · Plazh, Durrës".

### `/rooms`

1. **Header** — always solid (no full-bleed dark hero on this page).
2. **PageHero** — sunset banner: terracotta-warm gradient bg, sun blob top-right, 4 palm-tree silhouette SVGs scattered (left, right, bottom). Eyebrow "Stay with us", h1 "Our *rooms*" (handwritten italic on "rooms"), intro paragraph, **filter tab-bar** (`All · 11 / Apartments · 2 / Deluxe · 3 / Family · 3 / Standard · 1 / Economy · 2`). Cream gradient mask at bottom edge fades into the next section.
3. **All 11 rooms** — alternating 2-col layout (image-left, image-right, alternating). Each room: numbered eyebrow ("01 · Apartments"), capacity, h2, prose paragraph, 4-row stat grid (Beds / Size / View / Outdoor), amenity pill row (≤ 6 pills), primary "Book on Booking.com" CTA + occasional inline link to next room. Filter toggles `display:none` per `data-cat`.
4. **What's always included** — sub-bg `#F5EFE2`. 2-col. Left: eyebrow "In every room" + h2 + handwritten "— no fine print, no surprises" + pastry-shop note. Right: 2-col list of 10 amenities.
5. **House rules** — 3-col. Check-in 12:00 – 18:00 · Check-out 07:00 – 11:00 · House notes (no pets, no cribs, extra bed €5/night).
6. **"Still deciding?" CTA** — centered. Handwritten "— still deciding?", h2 "Tell us what you're looking for and we'll write back the same day.", outline-sea button → `/contact`.
7. **Footer**.

### `/contact`

1. **Header** — always solid.
2. **PageHero** — same sunset banner as `/rooms`, no filter. Eyebrow "We'd love to hear from you", h1 "Get in *touch*", intro paragraph.
3. **5-tile contact strip** — reused from home.
4. **Form + sidebar** — 5-col grid (3 + 2). Left: serif h2 "Write to us" + intro + minimal form (name, email, arrival date, guests select, message textarea, client-side validation, success line). **Submits via `mailto:vilaemes@gmail.com`** (no backend; the form composes a prefilled mail draft). Right: address (3 lines), hours (3 rows: 24-hour front desk, check-in 12:00 – 18:00, check-out 07:00 – 11:00), "Speak to" Shaban + handwritten "— I read every message myself".
5. **Directions** — 2-col. Left: h2 + 4-row distance table (22 mi airport, 100 m beach, 3.5 km centre, 3 mi amphitheatre), each terracotta serif num + bold label + muted blurb. Right: hand-drawn coastline SVG tile + "Open in Maps" CTA.
6. **Real Google Maps iframe** — sub-section with `loading="lazy"`. Embed URL from `src/config/site.ts`. (This is the only place that loads a real iframe; previews on `/` and `/rooms` use the hand-drawn tile.)
7. **FAQ** — same 6 questions as home, sub-bg `#F5EFE2`.
8. **Footer**.

## 11-room taxonomy (canonical)

Source: `/Users/erbandanaj/Downloads/hotel-vila-emes.md` (verified 2026-05-07). Filter families: **apartments / deluxe / family / standard / economy**.

| # | id | Display name | Family | Size m² | Beds | View | Featured amenities (up to 5) |
|---|---|---|---|---|---|---|---|
| 1 | `apt-1bed-terrace` | One-Bedroom Apartment with Terrace | apartments | 80 | 1 full + 2 bunk | Sea + city | terrace, kitchenette, air-con, wifi, family-friendly |
| 2 | `apt-2bed` | Two-Bedroom Apartment with Balcony and Terrace | apartments | 90 | 1 full + 1 twin + 2 bunk | Sea + city | kitchenette, 2-bedrooms, balcony, terrace, family-friendly |
| 3 | `deluxe-king` | Deluxe King Room | deluxe | 30 | 1 queen | City | renovated-2024, air-con, mini-fridge, private-bath, flat-tv |
| 4 | `deluxe-queen` | Deluxe Queen Room | deluxe | 27 | 1 queen | View | renovated-2024, bathtub-shower, air-con, mini-fridge, flat-tv |
| 5 | `deluxe-balcony` | Deluxe Double Room with Balcony | deluxe | 30 | 1 queen | Quiet street | renovated-2024, balcony, air-con, mini-fridge, flat-tv |
| 6 | `quad-sea` | Quadruple Room with Sea View | family | 27 | 1 full + 2 bunk | Sea | sea-view, balcony, air-con, wifi, family-friendly |
| 7 | `quad-balcony` | Quadruple Room with Balcony | family | 30 | 1 queen + 2 bunk | City | balcony, air-con, mini-fridge, wifi, family-friendly |
| 8 | `family-balcony` | Family Room with Balcony | family | 30 | 1 queen + 2 bunk + 1 sofa | Sea | balcony, sea-view, air-con, sofa-bed, family-friendly |
| 9 | `family-standard` | Standard Family Room | standard | 30 | 1 queen + 2 bunk | City | balcony, air-con, mini-fridge, family-friendly, wifi |
| 10 | `econ-triple` | Economy Triple Room | economy | 27 | 1 queen + 1 sofa | City | balcony, sofa-bed, air-con, private-bath, wifi |
| 11 | `budget-triple` | Budget Triple Room | economy | 30 | 1 queen + 1 sofa | City | balcony, air-con, private-bath, wifi, sofa-bed |

> Counts per family: **Apartments 2 · Deluxe 3 · Family 3 · Standard 1 · Economy 2 = 11.**
> The `renovated-2024` pill applies only to the three Deluxe rooms (#3, #4, #5).

### Amenity enum (14 keys)

`air-con`, `wifi`, `flat-tv`, `private-bath`, `bathtub-shower`, `sea-view`, `balcony`, `terrace`, `kitchenette`, `2-bedrooms`, `mini-fridge`, `family-friendly`, `sofa-bed`, `renovated-2024`. Each maps to an SVG icon in `Amenity.astro`.

## Content storage

### Site constants — single source of truth for contact + URL placeholders

`src/config/site.ts` (NOT in YAML — owner edits one file when real values arrive):

```ts
export const SITE = {
  url: "https://vila-emes.pages.dev",  // until custom domain
  contact: {
    phone: "+355 ___ ___ ___",         // PLACEHOLDER
    whatsapp: "+355 ___ ___ ___",      // PLACEHOLDER
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
    { value: "22 mi", label: "Tirana International Airport", blurb: "Door-to-door taxis run all day; ~35 minutes in light traffic." },
    { value: "100 m", label: "Durrës Beach", blurb: "A two-minute walk through the palm-lined avenue." },
    { value: "3.5 km", label: "Centre of Durrës", blurb: "City buses pass the corner every ten minutes." },
    { value: "3 mi", label: "Durres Amphitheatre", blurb: "The 2nd-century Roman amphitheatre is a 10-minute drive." },
  ],
} as const;
```

### Per-locale content YAMLs

```
src/content/
├── site.en.yaml       ← I author this from the spec
├── site.al.yaml       ← byte-for-byte copy of en, owner translates
├── site.it.yaml       ← byte-for-byte copy of en, owner translates
└── site.de.yaml       ← byte-for-byte copy of en, owner translates
```

Loaded via Astro Content Collections with a Zod schema for type-safety. Components consume one entry, keyed by current locale.

### `site.en.yaml` shape

```yaml
hotel:
  name: "Vila Emes"
  tagline: "Two generations of one family by the sea"
  location: "Plazh, Durrës · Albania"

home:
  hero:
    eyebrow: "Durrës · Albania · Since 1998"
    welcome_handwritten: "welcome to"
    heading: "Vila Emes"
    sub: "Eleven layouts. Two generations of one family. The same coffee on the terrace every morning."
    cta_primary: "Book on Booking.com"
    cta_secondary: "Open in Maps"
    polaroid_caption_handwritten: "— Shaban, his daughter and his son"
  about:
    eyebrow: "Our story"
    heading_part_1: "A small house,"
    heading_part_2_handwritten: "kept by one family."
    handwritten_year: "— since 1998"
    body:
      - "[PASTE: paragraph 1 — Shaban opened the house in 1998; two generations of family help run it; his daughter and son welcome guests now too.]"
      - "[PASTE: paragraph 2 — Plazh, Durrës; the avenue; the pastry shop on the ground floor (open early, cappuccino + espresso + fresh pastries).]"
      - "[PASTE: paragraph 3 — what to expect: 100 m to the beach, 24-hour front desk, simple rooms with a personal welcome (and a parking chair if Shaban can swing it).]"
    signature_handwritten: "— with love, the Emes family"
    photo_caption: "Vila Emes · Plazh, Durrës"
  trust:
    booking_label: "Booking.com"
    google_label: "Google"
    quote:
      text: "The location of the hotel was perfect, very close to the beach and lots of lovely restaurants and cafes. The room was everything you would want. The best part about the hotel is Shaban, the owner. He was beyond welcoming and friendly to us throughout our whole stay. We will definitely stay in Hotel Vila Emes again!"
      author: "Etain"
      location: "Ireland"
      when: "stayed last summer"
  rooms:
    eyebrow: "Stay"
    heading: "Our Rooms"
    intro: "Eleven layouts in total, from a 30 m² double to a 90 m² apartment with sea view."
    preview_card_cta: "View details →"
  gallery:
    eyebrow: "Inside & out"
    heading: "Twelve frames"
    intro: "Rooms, terrace, breakfast, the walk to the water."
    captions:
      "DSC_0123": "balcony, room 204"
      "DSC_0145": "the walk down to the water"
      "DSC_0169": "first light, August"
      "DSC_0204": "our coffee corner"
  location:
    eyebrow: "Where we are"
    heading: "On the avenue, by the sea"
    cta: "Open in Maps"
  contact_strip:
    eyebrow: "Come say hello"
    heading_part_1: "Get in"
    heading_part_2_handwritten: "touch"
  faq:
    eyebrow: "Before you ask"
    heading_part_1: "Frequently"
    heading_part_2_handwritten: "asked"
    items:
      - q: "What time is check-in and check-out?"
        a: "Check-in from 12:00 to 18:00. Check-out from 07:00 to 11:00. The front desk is open 24 hours, so late arrivals are fine — just let us know by WhatsApp so Shaban can meet you."
      - q: "Is breakfast included?"
        a: "Breakfast is not included in the room rate, but our ground-floor pastry shop opens early and serves cappuccino, espresso, and fresh pastries — five steps from the lobby."
      - q: "Where do I park?"
        a: "Free street parking in front of the hotel. Shaban will reserve a space for you with a chair if he can — first-come, first-served."
      - q: "Do you allow pets?"
        a: "Pets are not allowed at Vila Emes."
      - q: "Are cribs or extra beds available?"
        a: "Cribs are not available. An extra bed can be added to most rooms for €5 per person, per night — let us know in advance."
      - q: "What languages do you speak?"
        a: "English, Italian, and Albanian — every day, all day."
    footer_cta_handwritten: "Don't see your question? Write to us →"

rooms_page:
  hero_eyebrow: "Stay with us"
  hero_heading_part_1: "Our"
  hero_heading_part_2_handwritten: "rooms"
  hero_intro: "Eleven layouts across one small family house. Pick the one that fits."
  includes:
    eyebrow: "In every room"
    heading: "What's always included"
    handwritten: "— no fine print, no surprises"
    pastry_note: "Plus the pastry shop on the ground floor — open from 7:00 with cappuccino and fresh croissants."
    list:
      - "Air conditioning"
      - "Free Wi-Fi"
      - "Daily housekeeping"
      - "Private bathroom"
      - "Free toiletries"
      - "Linens & towels"
      - "Free street parking"
      - "Mosquito net"
      - "Heating in winter"
      - "Family-run welcome"
  rules:
    eyebrow: "House rules"
    heading: "A few simple things"
    check_in: { label: "Check-in",  value: "12:00 – 18:00", note: "Late arrivals welcome — message us first" }
    check_out: { label: "Check-out", value: "07:00 – 11:00", note: "Quick coffee on the terrace before you go" }
    notes: { label: "House notes", value: "No pets · No cribs · Extra bed €5 / night" }
  cta:
    handwritten: "— still deciding?"
    heading: "Tell us what you're looking for and we'll write back the same day."
    button: "Write to us"

contact_page:
  hero_eyebrow: "We'd love to hear from you"
  hero_heading_part_1: "Get in"
  hero_heading_part_2_handwritten: "touch"
  hero_intro: "Phone us. Message on WhatsApp. Or write a few lines below — Shaban reads every message himself."
  form:
    heading: "Write to us"
    intro: "Tell us when you'd like to come and what you're looking for. We answer the same day."
    fields:
      name: "Your name"
      email: "Email"
      arrival: "Arrival date"
      guests: "Guests"
      message: "Message"
    submit: "Send message"
    success: "Thanks — your mail draft is open. Hit Send and we'll be in touch within hours."
  sidebar:
    address_label: "Address"
    hours_label: "Hours"
    speak_to_label: "Speak to"
    speak_to_name: "Shaban Emes"
    speak_to_role: "Owner"
    speak_to_handwritten: "— I read every message myself"
  directions:
    eyebrow: "Getting here"
    heading: "How to find us"

ui:
  nav: { home: "Home", rooms: "Rooms", contact: "Contact" }
  buttons:
    book: "Book on Booking.com"
    map: "Open in Maps"
    details: "View details"
    next_room: "Next room →"
    write: "Write to us"
  filter:
    all: "All · 11"
    apartments: "Apartments · 2"
    deluxe: "Deluxe · 3"
    family: "Family · 3"
    standard: "Standard · 1"
    economy: "Economy · 2"
  labels:
    sleeps: "Sleeps"
    beds: "Beds"
    size: "Size"
    view: "View"
    outdoor: "Outdoor"
  family_groups:
    apartments: "Apartments"
    deluxe: "Deluxe"
    family: "Family"
    standard: "Standard"
    economy: "Economy"
  amenity_labels:
    air-con: "Air conditioning"
    wifi: "Free Wi-Fi"
    flat-tv: "Flat-screen TV"
    private-bath: "Private bathroom"
    bathtub-shower: "Bathtub or shower"
    sea-view: "Sea view"
    balcony: "Balcony"
    terrace: "Terrace"
    kitchenette: "Kitchen"
    2-bedrooms: "Two bedrooms"
    mini-fridge: "Mini-fridge"
    family-friendly: "Family-friendly"
    sofa-bed: "Sofa bed"
    renovated-2024: "Renovated 2024"
  footer:
    handwritten: "made with care by the Emes family"
    copyright: "© 2026 Vila Emes · Plazh, Durrës"

rooms:
  - id: "apt-1bed-terrace"
    family: "apartments"
    order: 1
    name: "One-Bedroom Apartment with Terrace"
    size_m2: 80
    sleeps: 4
    sleeps_label: "Sleeps up to 4"
    beds: "1 full · 2 bunk beds"
    view: "Sea + city"
    outdoor: "Private terrace"
    description: "[PASTE: paragraph from Booking — eighty square metres, kitchen with stovetop and oven, washing machine, sea views over the avenue.]"
    amenities: ["terrace", "kitchenette", "air-con", "wifi", "family-friendly"]

  - id: "apt-2bed"
    family: "apartments"
    order: 2
    name: "Two-Bedroom Apartment with Balcony and Terrace"
    size_m2: 90
    sleeps: 6
    sleeps_label: "Sleeps up to 6"
    beds: "1 full · 1 twin · 2 bunk beds"
    view: "Sea + city"
    outdoor: "Balcony + terrace"
    description: "[PASTE: paragraph from Booking — ninety square metres, two bedrooms, full kitchen, suitable for two families.]"
    amenities: ["kitchenette", "2-bedrooms", "balcony", "terrace", "family-friendly"]

  - id: "deluxe-king"
    family: "deluxe"
    order: 3
    name: "Deluxe King Room"
    size_m2: 30
    sleeps: 2
    sleeps_label: "Sleeps 2"
    beds: "1 queen bed"
    view: "City"
    outdoor: "—"
    description: "[PASTE: paragraph from Booking — thirty square metres, walk-in shower, flat-screen with cable, recently renovated.]"
    amenities: ["renovated-2024", "air-con", "mini-fridge", "private-bath", "flat-tv"]

  - id: "deluxe-queen"
    family: "deluxe"
    order: 4
    name: "Deluxe Queen Room"
    size_m2: 27
    sleeps: 2
    sleeps_label: "Sleeps 2"
    beds: "1 queen bed"
    view: "View"
    outdoor: "—"
    description: "[PASTE: paragraph from Booking — twenty-seven square metres, walk-in shower with bidet, flat-screen with cable.]"
    amenities: ["renovated-2024", "bathtub-shower", "air-con", "mini-fridge", "flat-tv"]

  - id: "deluxe-balcony"
    family: "deluxe"
    order: 5
    name: "Deluxe Double Room with Balcony"
    size_m2: 30
    sleeps: 2
    sleeps_label: "Sleeps 2"
    beds: "1 queen bed"
    view: "Quiet street"
    outdoor: "Balcony"
    description: "[PASTE: paragraph from Booking — thirty square metres, balcony with quiet street view, walk-in shower.]"
    amenities: ["renovated-2024", "balcony", "air-con", "mini-fridge", "flat-tv"]

  - id: "quad-sea"
    family: "family"
    order: 6
    name: "Quadruple Room with Sea View"
    size_m2: 27
    sleeps: 4
    sleeps_label: "Sleeps 4"
    beds: "1 full · 2 bunk beds"
    view: "Sea"
    outdoor: "Balcony"
    description: "[PASTE: paragraph from Booking — twenty-seven square metres, balcony with sea views, three beds.]"
    amenities: ["sea-view", "balcony", "air-con", "wifi", "family-friendly"]

  - id: "quad-balcony"
    family: "family"
    order: 7
    name: "Quadruple Room with Balcony"
    size_m2: 30
    sleeps: 4
    sleeps_label: "Sleeps 4"
    beds: "1 queen · 2 bunk beds"
    view: "City"
    outdoor: "Balcony"
    description: "[PASTE: paragraph from Booking — thirty square metres, balcony with city view, three beds.]"
    amenities: ["balcony", "air-con", "mini-fridge", "wifi", "family-friendly"]

  - id: "family-balcony"
    family: "family"
    order: 8
    name: "Family Room with Balcony"
    size_m2: 30
    sleeps: 5
    sleeps_label: "Sleeps up to 5"
    beds: "1 queen · 2 bunk · 1 sofa bed"
    view: "Sea"
    outdoor: "Balcony"
    description: "[PASTE: paragraph from Booking — thirty square metres, balcony with sea view, four beds in one room.]"
    amenities: ["balcony", "sea-view", "air-con", "sofa-bed", "family-friendly"]

  - id: "family-standard"
    family: "standard"
    order: 9
    name: "Standard Family Room"
    size_m2: 30
    sleeps: 4
    sleeps_label: "Sleeps 4"
    beds: "1 queen · 2 bunk beds"
    view: "City"
    outdoor: "Balcony"
    description: "[PASTE: paragraph from Booking — thirty square metres, balcony with city view, three beds.]"
    amenities: ["balcony", "air-con", "mini-fridge", "family-friendly", "wifi"]

  - id: "econ-triple"
    family: "economy"
    order: 10
    name: "Economy Triple Room"
    size_m2: 27
    sleeps: 3
    sleeps_label: "Sleeps 3"
    beds: "1 queen · 1 sofa bed"
    view: "City"
    outdoor: "Balcony"
    description: "[PASTE: paragraph from Booking — twenty-seven square metres, balcony with city view, sofa bed.]"
    amenities: ["balcony", "sofa-bed", "air-con", "private-bath", "wifi"]

  - id: "budget-triple"
    family: "economy"
    order: 11
    name: "Budget Triple Room"
    size_m2: 30
    sleeps: 3
    sleeps_label: "Sleeps 3"
    beds: "1 queen · 1 sofa bed"
    view: "City"
    outdoor: "Balcony"
    description: "[PASTE: paragraph from Booking — thirty square metres, balcony with city view, sofa bed.]"
    amenities: ["balcony", "air-con", "private-bath", "wifi", "sofa-bed"]
```

### Content the owner pastes from Booking

After scaffold, owner fills these free-text blocks in `site.en.yaml`:

1. `home.about.body` — three paragraphs.
2. 11 × `rooms[].description` — each room's Booking paragraph.

Contact / URL values go in `src/config/site.ts`, NOT the YAML.

## Photo pipeline

Source: `/Users/erbandanaj/Downloads/Emes/` (`Main/` plus per-room folders). ~600 MB across ~80 images.

**One-time optimization** via `scripts/optimize-photos.mjs` using Sharp:

- Read each source image.
- Output three sizes (longest edge): `2400 px` (hero), `1600 px` (gallery), `800 px` (cards).
- Encode as **webp**, quality 82, strip EXIF.
- Write to `src/assets/photos/<category>/<basename>-<size>.webp`.
- Mapping: `Main/` → `main`; `101/`, `102/`, `103/` → `deluxe-rooms`; `1+1/` → `apt-1bed-terrace`; `2+1/` → `apt-2bed`; `301/`–`306/` → `standard-rooms`. Per-room family/standard/economy folders are reused based on visual fit until owner curates.

Astro `<Image>` re-derives further responsive sizes per usage site at build time.

**Logo SVG pipeline:**
1. Copy master `Emes/Logo/Vila Emes.svg` → `src/assets/logo/vila-emes.svg`.
2. Run SVGO with default + `removeTitle` + `convertColors` to compress (target ≤ 30 KB).
3. Manually extract palm-tree paths (one tree) → `src/assets/decorations/palm-doodle.svg` (~5 KB).
4. Generate `src/assets/logo/vila-emes-1024.png` from SVG (Sharp) for `og:image` + favicon set.

**Initial photo curation workflow:**

1. Optimize every source photo. Nothing is dropped at this stage.
2. Generate `docs/photos-shortlist.md` with placeholder picks per slot (hero, gallery × 12, per-room × 4–6) using file names.
3. Owner reviews shortlist, replies with swap requests, I commit swaps.

**Expected output:** ~30–50 MB of optimized webp committed. Source originals stay outside the repo.

## Components

### Shared / chrome
- `Base.astro` — head, fonts, meta, body bg `#F4F0E7`, footer slot. One per locale via prop. Inline `<script>` for: sticky-header scroll listener, reveal-on-scroll IntersectionObserver. FAQ uses native `<details>`.
- `Header.astro` — palm-wordmark inline SVG + text wordmark, nav, lang switcher (4 locales). Sticky transparent on `/`, solid on `/rooms` + `/contact` and on scroll. Mobile hamburger nav.
- `LangSwitch.astro` — current path → same path under each locale prefix.
- `Footer.astro` — cream-elevated bg, mobile lang switcher, optimized logo, handwritten line, copyright.
- `PalmDoodle.astro` — static-placed palm SVG with size + rotation props. Hand-positioned in pages.
- `Eyebrow.astro` — uppercase tracked label.
- `Handwritten.astro` — Caveat-font wrapper with optional terracotta color.
- `SunBloom.astro` — inline SVG sun blob for PageHero.

### Home-only
- `Hero.astro` — Photo variant: full-bleed image + dual scrim + handwritten lead-in + serif heading + CTAs + polaroid inset.
- `About.astro` — 2-col with eyebrow, handwritten span, three body paragraphs, signature, exterior photo + caption.
- `TrustStrip.astro` — sub-bg, two ratings + Etain quote.
- `RoomsPreview.astro` — 4-card preview grid with numbered eyebrows.
- `Gallery.astro` — masonry + lightbox + per-photo handwritten captions.
- `LocationMap.astro` — accepts `mode="drawn"` (hand-drawn coastline + pin SVG) or `mode="iframe"` (Google Maps lazy iframe). `mode="drawn"` on home + rooms; `mode="iframe"` only on contact.
- `ContactStrip.astro` — 5-card grid with icon-circles.
- `FAQ.astro` — accepts `items[]`, renders narrow column with details/summary + chev pseudo-elements.

### Rooms-only
- `PageHero.astro` — sunset banner with sun blob + palm doodles + slot for filter.
- `RoomFilterBar.astro` — pill toggle, client-side `display:none` on `[data-cat]`.
- `RoomDetails.astro` — alternating 2-col room article with stat grid + amenity pills.
- `Amenity.astro` — icon + label, name-driven (14-key enum).
- `RoomsIncludes.astro` — sub-bg "always included" 2-col list.
- `HouseRules.astro` — 3-col check-in/out + notes.

### Contact-only
- `ContactForm.astro` — minimal form with client-side validation, submits via `mailto:vilaemes@gmail.com` (composes prefilled draft).
- `ContactSidebar.astro` — address + hours + Speak-to-Shaban.
- `Directions.astro` — 4-row distance table.

## Project bootstrap

```bash
cd /Users/erbandanaj/Downloads/xCode/hotel-vila-emes
npm create astro@latest . -- --template minimal --typescript strict --install --no-git
npx astro add tailwind   # installs @tailwindcss/vite for v4
npm i sharp svgo @fontsource-variable/cormorant-garamond @fontsource-variable/inter @fontsource/caveat
mkdir -p scripts src/content src/config src/assets/photos src/assets/logo src/assets/decorations
git init -b main
# git remote add origin https://github.com/danajerban/vila-emes.git  ← after empty repo created
```

Astro scaffolding into a non-empty directory will warn but proceed; the `docs/` folder is preserved.

## Deploy

1. Owner creates empty `vila-emes` repo on GitHub (no README, no `.gitignore`).
2. We `git remote add origin https://github.com/danajerban/vila-emes.git`, push.
3. Owner connects Cloudflare Pages → repo → build cmd `astro build`, output `dist`.
4. Cloudflare gives us a free subdomain `vila-emes.pages.dev` immediately. `astro.config.mjs` uses `site: "https://vila-emes.pages.dev"` for v1 (TODO comment to swap when domain purchased).
5. When the domain is purchased, owner moves DNS to Cloudflare for auto-SSL and we update `site:` in one place (and `SITE.url` in `src/config/site.ts`).
6. Every push to `main` rebuilds.

## Scope explicitly out

- Reservation system or availability calendar.
- Newsletter, blog, reviews-management surface, testimonials section beyond the home Trust strip.
- Server-rendered pages, API routes, auth.
- CMS integration.
- Analytics (can be added later as a 1-line snippet).
- Cookie banner (none required if no analytics; revisit when adding).
- Server-side translations or AI translation pipeline — owner uses Google Translate manually.
- Per-room pricing on site (Booking.com decides prices; we do not display them).
- Backend for the contact form — `mailto:` only.
- Per-photo lazy lightbox keyboard navigation beyond Esc-to-close (basic only).

## Acceptance criteria

- [ ] `npm run build` produces a static `dist/` with all 12 pages (3 routes × 4 locales).
- [ ] Lighthouse on home: Performance ≥ 95, Accessibility ≥ 95.
- [ ] Total deployed JS bundle < 30 KB gzipped.
- [ ] Total deployed images < 60 MB.
- [ ] Each language reachable via header switcher; switcher preserves current page.
- [ ] All external CTAs are placeholder URLs and clearly marked in `src/config/site.ts`.
- [ ] Site renders correctly at 360 px and 1440 px widths.
- [ ] No console errors, no hydration warnings.
- [ ] Logo + palm doodles visually consistent (same hand-drawn style — derived from the same master SVG).
- [ ] Sticky header transitions smoothly transparent → solid on home; always solid on subpages.
- [ ] Reveal-on-scroll respects `prefers-reduced-motion`.
- [ ] FAQ accordion uses `<details>`; chev pseudo-element renders cross/plus correctly across browsers.
- [ ] Contact form `mailto:` opens user's mail client with prefilled subject + body.
- [ ] Trust strip shows ratings only (no review-count caption).
- [ ] Room filter shows correct counts: All · 11 / Apartments · 2 / Deluxe · 3 / Family · 3 / Standard · 1 / Economy · 2.
- [ ] `renovated-2024` pill appears only on the three Deluxe rooms.
