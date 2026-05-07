# Vila Emes — Design Draft Analysis

> Analysis of `docs/design-draft/vila-emes/` against `docs/superpowers/specs/2026-05-06-vila-emes-site-design.md` and `docs/superpowers/plans/2026-05-06-vila-emes-implementation.md`. Output target: implementer (next Claude session) doing visual polish over the existing Astro plan.

---

## TL;DR

- **The design draft has diverged substantially from the spec/plan.** The spec assumes 3 room categories, 4 locales (EN/AL/IT/DE), Google Maps iframes, and a flat hero photo. The draft (after iteration with the user) ships **11 individual room types** in 4–5 families, **3 locales** (EN/AL/IT — DE dropped), a **hand-drawn coastline + pin map**, a **terracotta-sun + palm sunset banner** for sub-pages, scattered **palm-tree doodles** site-wide, **handwritten Caveat** accents, an **FAQ on the home page**, a **trust strip** with real Booking/Google ratings, and a vibrant **sunset/dusk vibe-mode** system via `data-vibe`.
- **Source-of-truth corrections required.** Owner is **Shaban Emes**, not "Petrit / Ana" (those were invented by the design tool, then corrected mid-chat). Real ratings are **9.0 Booking.com / 4.7 Google (47 reviews)**. Real distances: **22 mi airport, 100 m beach, 3.5 km centre, 3 mi amphitheatre**. Languages spoken: **EN/IT/AL only** (drop German). Address: **Rruga Pavarësia, Plazh, Durrës 2001**. **No breakfast** (pastry shop downstairs), **no pets**, **no cribs**, extra bed **€5/night**. Check-in **12:00–18:00**, check-out **07:00–11:00**.
- **Hero variant decision:** the user explicitly said *"i like the photo"* and the Sand variant was dropped from `hero.jsx`. Default to the **Photo hero** (full-bleed exterior photo + polaroid family note + warm overlay). Split is the optional second variant if needed.
- **Three things to drop verbatim from the prototype:** (1) the React + Babel CDN scripts for hero variants (re-implement as static Astro), (2) the `tweaks-panel.jsx` (dev-only, has no place in production), (3) the runtime JS i18n (`data-i18n` text replacement) — replace with Astro's per-locale routing.
- **Decisions to confirm with the user before implementing:** "since 1998" claim (fictional, invented by the design tool), default vibe (normal vs sunset vs dusk), hand-drawn coastline map vs Google Maps embed, and whether all 11 rooms should be displayed on `/rooms` or grouped into 4–5 families (chat shows the user has accepted 11-with-families).

---

## Design tokens (final canonical list)

Pulled from `shared.css` and `Vila Emes.html`. Where the homepage `<style>` block deviates from `shared.css`, the homepage value is the latest iteration and wins.

### Colors

| Token | Hex | Notes |
|---|---|---|
| Cream (page bg, fallback) | `#FAF6EE` | spec value, used in header solid state, footer |
| Cream (warm body bg) | `#FBF3E4` | **`shared.css:3` and `Vila Emes.html:32` override the spec.** "Slightly warmer cream than spec base for a softer, more home-like feel" — Vila Emes.html:33 |
| Trust-strip / soft-cream sub-bg | `#F5EFE2` | used as `bg-[#F5EFE2]` on trust strip and contact strip — Vila Emes.html:243, 417 |
| Ink | `#1F1A14` | spec aligned |
| Terracotta | `#C25B3F` | spec aligned (handwritten accents, primary button, sun bloom) |
| Terracotta hover | `#A94A30` | shared.css:42 |
| Sea-blue | `#2E5C7E` | spec aligned (icons, secondary outline) |
| Muted (warm taupe) | `#8C7E6A` | spec aligned (eyebrow, body-light) |
| Border / divider | `#E8DFCF` | spec aligned (named `divider` in tailwind config) |
| Body-text-deep | `#5C5141` | shared.css:189 (room amenity pill text) |
| Sunset cream | `#FBE9D2` | shared.css:122 (`[data-vibe="sunset"]` body) |
| Sunset border | `#EDC9A0` | shared.css:123 |
| Sunset sub-bg | `#F6D9B6` | shared.css:125 |
| Dusk body | `#F2D6BB` | shared.css:139 |
| Dusk ink | `#2A1810` | shared.css:139 |
| Dusk border | `#D8A87F` | shared.css:140 |
| Postcard paper | `#F4E9D0` | Rooms.html:107 (`[data-voice="postcard"]`) |

**Recommendation:** Keep cream `#FBF3E4` (the warmer one from the design) as the canonical body background. Promote the spec's `#FAF6EE` to `--color-cream-elevated` for header solid state, footer, and inset panels. Update spec accordingly.

### Typography

| Role | Font | Source |
|---|---|---|
| Headings (h1–h4) | **Cormorant Garamond** weights 400/500/600 + italic 400/500 | shared.css:7, Vila Emes.html:10 |
| Body | **Inter** weights 300/400/500/600 | shared.css:4, Vila Emes.html:10 |
| Handwritten accents | **Caveat** weights 400/500/600 | Vila Emes.html:10, shared.css:9 |
| Wordmark | Cormorant Garamond, letter-spacing `0.22em`, weight 500 | shared.css:8 |
| Eyebrow | Inter, letter-spacing `0.22em`, uppercase, 11px, weight 500 | shared.css:10 |
| Nav link | Inter, letter-spacing `0.18em`, uppercase, 13px, weight 500 | shared.css:11 |

**Caveat is new** — not mentioned in the spec at all. The plan currently installs only `@fontsource-variable/cormorant-garamond` and `@fontsource-variable/inter`. Add `@fontsource/caveat` (it's a static Google font, not variable).

### Body type sizes

- Mobile: 16px, line-height 1.6 (shared.css:4)
- ≥768px: 17px (shared.css:5) — note this is the breakpoint, not 17px universally as in spec

### Spacing

- Section vertical rhythm: `py-20 md:py-32` (mobile 80px → desktop 128px)
- Sub-section: `py-14 md:py-20`
- Container: `max-w-[1280px]` for header/full-bleed sections, `max-w-[1180px]` for content sections, `max-w-[920px]` for FAQ (centered narrow)
- Page side padding: `px-5 md:px-10` (20px / 40px)
- Header height: `h-16 md:h-20` (64px / 80px)

### Radii

- Small (cards, buttons, photos): `6px` (`rounded-md` in Tailwind, customised) — matches spec
- Pill / amenity / tab-bar: `999px`
- Form inputs: `4px` (shared.css:177)
- FAQ chev circle: `50%` (28×28 with cross/plus pseudo-elements) — shared.css:200

### Shadows / motion

- Cards: `box-shadow: 0 1px 0 rgba(31,26,20,0.02)` only — very faint
- Polaroid (hero): `shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)]` (hero.jsx:55)
- Reveal-on-scroll: `opacity 0 → 1`, `translateY(14px) → 0`, `0.8s ease`, fired by IntersectionObserver
- Room-card hover: `translate-y(-2px)` + child image `scale(1.02)` over 0.6s
- Reduce motion respected (shared.css:77)

---

## Layout & sections that MUST exist (per page)

### Home (`Vila Emes.html`)

**Single-scroll page. Header is fixed (transparent over hero, solid otherwise).**

| # | Section / Anchor | Visual purpose | Key visual ingredients | Astro components |
|---|---|---|---|---|
| 1 | `<header id="siteHeader">` | Sticky nav | Palm-tree wordmark SVG (Vila Emes.html:152–158), nav (Home / Rooms / Contact), 3-locale switch (EN/AL/IT), mobile hamburger | `Header.astro`, `LangSwitch.astro`, `PalmWordmark.astro` (NEW) |
| 2 | `#hero-root` (React-mounted) | Headline + CTA | Default = Photo variant: full-bleed `assets/vila-emes-exterior.png`, dark overlay scrim top + bottom, big handwritten "welcome to" + serif "Vila Emes", sub copy, 2 CTAs (Book + Maps), polaroid family-note inset bottom-right (`hero.jsx:7–67`). Eyebrow "Durrës · Albania · Since 1998". | `Hero.astro` (extended; replaces existing `Hero.astro` in plan) |
| 3 | `#about` | Story | 2-col grid: left text with eyebrow "Our story", h2 "A small house, *kept by one family.*" (handwritten italic terracotta on second clause), handwritten "— since 1998", three paragraphs invoking Shaban + pastry shop, hairline divider, handwritten "— with love, the Emes family". Right column: `assets/vila-emes-exterior.png` square photo with eyebrow caption "Vila Emes · Plazh, Durrës". | `About.astro` (REWRITE — bigger than the plan's current 1×1 grid) |
| 4 | trust strip | Social proof | Sub-bg `#F5EFE2`, 12-col grid: left = `9.0 Booking.com` + `4.7 Google · 5` + "From 47 reviews in the past year", right = blockquote (Baling, Hungary quote) with 28×22 quote SVG, attribution `Baling · Hungary · stayed September`. | `TrustStrip.astro` (NEW) |
| 5 | `#rooms` | Room teaser | Eyebrow "Stay" + h2 "Our Rooms" + intro "Eleven layouts in total, from a 30 m² double to a 90 m² apartment with sea view." + 4 cards (Apartments, Family, Deluxe, Triple & Quad) each with placeholder photo + numeric "01 · Apartments" eyebrow + capacity num row + "View details →". | `RoomsPreview.astro` (4-card grid, replaces plan's 3-card RoomCard usage on home) |
| 6 | `#gallery` | Inside & out | Eyebrow + h2 + intro "Twelve frames: rooms, terrace, breakfast, the walk to the water." + CSS-columns masonry of 12 placeholder tiles, **with handwritten captions on 4 of them**: "balcony, room 204", "breakfast on the terrace", "the walk down to the water", "first light, August", "our coffee corner". | `Gallery.astro` (extend existing — add per-photo optional `caption` field + handwritten font for caption) |
| 7 | `#location` | Where we are | 2-col grid: left = address (3 serif lines), hairline, distances paragraph, primary "Open in Maps" button. Right = **hand-drawn map tile** (cream/blue grid + soft coastline SVG curve + terracotta drop pin + tiny "N" compass marker). | `LocationMap.astro` (REWRITE — drop iframe, draw the SVG tile inline; OR keep both, controllable) |
| 8 | `#contact` (strip) | Reach us | Sub-bg `#F5EFE2`, eyebrow "Come say hello", h2 "Get in *touch*" (handwritten italic on "touch"), intro paragraph, 5-card grid (Phone, WhatsApp, Email, Instagram, Booking.com) each with circular icon, eyebrow label, serif value | `ContactStrip.astro` (REWRITE to match this card style) |
| 9 | `#faq` | Frequently asked | **THIS IS NEW vs spec.** `max-w-[920px]` narrow column. Eyebrow "Before you ask" + h2 "Frequently *asked*" (handwritten italic on "asked") + 6 details/summary items: check-in/out, breakfast, parking, pets, children/cribs, languages. + Trailing "Don't see your question? Write to us →" linking to Contact. The chev uses circular border + cross/plus via ::before/::after (shared.css:200–216). | `FAQ.astro` (NEW) |
| 10 | `<footer>` | Sign-off | Cream bg, top border. Mobile lang switcher, wordmark "VILA EMES", handwritten "made with care by the Emes family", "© 2026 Vila Emes · Durrës, Albania". | `Footer.astro` (rewrite from plan) |

**Source-of-truth fields consumed:**
- `hotel.name`, `hotel.location`, `hotel.tagline`
- `home.hero.heading`, `home.hero.sub`, `home.hero.cta_*`, `home.hero.eyebrow` (NEW field)
- `home.about.heading`, `home.about.body` (multi-paragraph), `home.about.signature` (NEW)
- `home.trust.booking_rating`, `home.trust.google_rating`, `home.trust.review_count`, `home.trust.quote.{text,author,location,when}` (ALL NEW)
- `home.rooms_intro` (NEW)
- `gallery.intro`, `gallery.captions[]` (NEW: per-photo caption text)
- `home.location.address[]` (3-line array), `home.location.distances[]` (NEW), `home.location.cta`
- `contact.{phone,whatsapp,email,instagram,booking_com}` (existing)
- `home.faq[]` (NEW: array of `{question, answer}`)

### Rooms (`Rooms.html`)

| # | Section / Anchor | Visual purpose | Key visual ingredients | Astro components |
|---|---|---|---|---|
| 1 | header | Sticky | Same as home, `is-solid` from page load (no transparent state — no full-bleed hero) | `Header.astro` |
| 2 | `.page-hero` | Page intro | **Sunset banner**: terracotta-toned gradient bg, big red sun blob top-right, 4 palm-tree silhouette SVGs scattered (left, right, bottom), eyebrow "Stay with us", massive h1 "Our *rooms*" (handwritten italic), intro paragraph, **filter tab-bar** (All · 11 / Apartments / Deluxe / Family / Standard / Economy). Cream gradient mask at bottom edge fades into next section. | `PageHero.astro` (NEW), `RoomFilterBar.astro` (NEW) |
| 3 | `<main class="rooms-main">` (room list) | All 11 rooms | Alternating 2-col layout (image-left, image-right, alternating). Each room: numbered eyebrow ("01 · Apartment"), capacity, h2, prose paragraph, 4-row stat grid (Beds / Size / View / Outdoor), amenity pill row (~6 pills), primary CTA "Book on Booking.com" + occasional inline link to next room. | `RoomDetails.astro` (RESHAPE — alternating, not stacked) |
| 4 | "What's always included" | Amenities meta | Sub-bg `#F5EFE2`, 2-col: left = eyebrow "In every room" + h2 + handwritten "— no fine print, no surprises" + pastry-shop note. Right = 2-col list of 10 amenities. | `RoomsIncludes.astro` (NEW) |
| 5 | "House rules" | Check-in/out + notes | 3-col: Check-in 12:00–18:00, Check-out 07:00–11:00, House notes (no pets, no cribs, extra bed €5) | `HouseRules.astro` (NEW) |
| 6 | "Still deciding?" CTA | Conversion | Centered: handwritten "— still deciding?", h2 "Tell us what you're looking for and we'll write back the same day.", outline-sea button → Contact | `RoomsCta.astro` (NEW, can be inline) |
| 7 | footer | Sign-off | Same as home | `Footer.astro` |

**Note:** `Rooms.html` includes a Tweaks panel with `data-layout`, `data-density`, `data-voice` controls. **Do NOT carry these over** — they're a dev exploration tool. Pick `data-layout="alternating"`, `data-density="balanced"`, `data-voice="family"` (the design's default in the EDITMODE block, line 713) and bake those styles in directly.

### Contact (`Contact.html`)

| # | Section | Visual purpose | Key visual ingredients | Astro components |
|---|---|---|---|---|
| 1 | header | Sticky | Same | `Header.astro` |
| 2 | `.page-hero` | Page intro | Same sunset+palms banner. Eyebrow "We'd love to hear from you", h1 "Get in *touch*", intro paragraph. **No filter bar.** | `PageHero.astro` (parameterized: optional filter) |
| 3 | quick-contact tiles | 5 contact methods | Same 5-tile grid pattern as home contact-strip | `ContactStrip.astro` (reused) |
| 4 | form + sidebar | Send message | 5-col grid (3+2). Left = serif h2 "Write to us" + intro + form (name, email, arrival date, guests select, message textarea, validation, success line). Right = address (3 lines), hours (3 rows), "Speak to" Shaban + handwritten "— I read every message myself". | `ContactForm.astro` (NEW), `ContactSidebar.astro` (NEW) |
| 5 | map + directions | Getting here | 2-col grid: left = h2 + 4-row distance table (22 mi airport, 100 m beach, 3.5 km centre, 3 mi amphitheatre), each with terracotta serif num + bold label + muted blurb. Right = same hand-drawn coastline map tile + "Open in Maps" CTA. | `Directions.astro` (NEW), `LocationMap.astro` (reused) |
| 6 | FAQ | Same FAQ | Same 6 questions, sub-bg `#F5EFE2`, repeated from home. | `FAQ.astro` (reused) |
| 7 | footer | Sign-off | Same | `Footer.astro` |

**Source-of-truth fields consumed (Contact-specific):**
- `contact.{phone,whatsapp,email}` plus `contact.address[]` (3 lines), `contact.hours[]` (front-desk + check-in/out)
- `contact.speak_to.{name,role,handwritten_note}`
- `contact.distances[]` (same as home location)

> Note: the Contact form has client-side validation only — no backend. The plan does not currently include a contact form. **This may be out of scope; the spec says "every booking CTA links to Booking.com"**. Surface as question. If kept, send through a static formspree-style POST or use a `mailto:` fallback.

---

## What's in the design but NOT in our spec/plan

| # | Thing | Cosmetic vs substantive | Spec/plan should absorb? |
|---|---|---|---|
| 1 | **Caveat handwritten font** for accent phrases | Substantive (visual identity) | YES — add `@fontsource/caveat` and a `--font-handwritten` token |
| 2 | **Palm-tree wordmark** SVG in header | Cosmetic | YES — replace plain `Vila Emes` text with the SVG mark |
| 3 | **Trust strip** (ratings + guest quote) | Substantive (content + new component) | YES — new `TrustStrip.astro`, new YAML schema fields |
| 4 | **FAQ on home + on Contact** | Substantive (new section, dual placement) | YES — new `FAQ.astro` and `home.faq[]` schema |
| 5 | **Page hero** (sunset + palms + sun) for `/rooms` and `/contact` | Substantive (replaces flat title block in plan) | YES — new `PageHero.astro` with optional filter slot |
| 6 | **Sunset and Dusk vibe modes** via `data-vibe` on `<html>` | Cosmetic, optional | OPTIONAL — surface to user as Q. If kept, simplest: a one-time decision baked into `<html data-vibe="sunset">`. NOT a runtime toggle. |
| 7 | **Palm-doodle scattering** site-wide via `palm-doodles.js` | Cosmetic | YES — but rewrite as a static Astro `PalmDoodle.astro` component that pages drop manually, OR a small inline `<script>` that runs at runtime. Avoid the random-jitter approach (different render per page reload — bad for build determinism). Recommend hand-placed. |
| 8 | **Hand-drawn coastline + drop-pin map tile** (instead of Google Maps iframe) | Substantive (visual choice) | NEEDS USER DECISION. Spec says iframe; design uses hand-drawn. Recommend keeping hand-drawn for hero/preview spots, AND adding a real Google Maps embed for the dedicated `Find us` block on Contact (best of both). |
| 9 | **Live JS i18n string swap** (`data-i18n`, runtime `applyLang()`) | Substantive (architectural divergence) | NO — drop entirely. Plan's per-locale Astro routes (`/al/`, `/it/`) are correct and serve SEO better. |
| 10 | **Hero variants** (Photo + Split, with Sand dropped) selectable via Tweaks | Cosmetic | NO Tweaks — pick **Photo** as default per chat ("i like the photo"). Keep Split as a documented alternate but don't ship the toggle. |
| 11 | **Tweaks panel** for layout/density/voice on Rooms (3×3×3 = 27 presentations) | Dev tool | NO — drop entirely. Bake the defaults `alternating × balanced × family` (Rooms.html:713–717). |
| 12 | **"Since 1998"** historical claim throughout | Substantive (content) | NEEDS USER CONFIRMATION — invented by design tool. If false, scrub. |
| 13 | **Named family invocations** ("Shaban — our owner — will reserve a parking spot for you (sometimes with a chair)") | Substantive (copy) | YES — Booking.com reviews corroborate the chair detail (Daniela's review). Capture in `site.en.yaml` body fields verbatim. |
| 14 | **Polaroid family note** inset on hero (`hero.jsx:53–63`) | Cosmetic | YES — implement as part of `Hero.astro`. Hidden below `lg:`. |
| 15 | **3-locale switch (EN/AL/IT)**, no DE | Architectural | YES — drop DE from plan |
| 16 | **`#F5EFE2` sub-background** color for trust strip / contact strip / faq | Cosmetic | YES — add token |
| 17 | **Numbered eyebrows** "01 · Apartment", "02 · Family" | Cosmetic | YES — display ordering in room data, render as eyebrow |
| 18 | **Tab-bar room filter** on `/rooms` (All · 11 / Apartments / Deluxe / Family / Standard / Economy) | Substantive (interaction) | YES — small client-side toggle, ~10 lines vanilla JS |
| 19 | **Contact form with validation + success message** | Substantive (out of original scope) | NEEDS USER DECISION — spec says no reservation logic; form is a contact channel only. If shipped, no backend, just `mailto:` or formspree. |
| 20 | **Per-photo handwritten gallery captions** | Cosmetic | YES — extend `gallery.captions[]` schema |
| 21 | **Eyebrow "Durrës · Albania · Since 1998"** above hero h1 | Cosmetic | YES (modulo "Since 1998" question) |
| 22 | **"Renovated 2024" amenity pill** (Rooms.html:298) | Substantive (claim) | NEEDS USER CONFIRMATION — invented detail |
| 23 | **Per-room "from €X / night" pricing** (in Tweaks density="everything") | Substantive | NO — chat user explicitly said *"nop prices (booking .com decidesd)"*. Drop. |
| 24 | **"Speak to Shaban" + handwritten signature on Contact** | Cosmetic | YES |

---

## What's in our spec/plan but NOT honored by the design

| # | Thing | Decision |
|---|---|---|
| 1 | **DE locale** + `de.yaml` + `/de/*` routes | DROP — Booking.com lists EN/IT/AL only |
| 2 | **Astro per-locale folder routing** | KEEP (override the design's runtime JS swap) |
| 3 | **Google Maps iframe** for location | NEEDS USER DECISION — propose hybrid (hand-drawn for visual, iframe for the dedicated Contact "Find us" block) |
| 4 | **Separate `/gallery` route** (not actually in spec, only in plan-spec.md hint) | N/A — spec already has gallery on home only. Design agrees. |
| 5 | **3 room categories grouping (deluxe/apartments/standard)** | UPDATE — chat shows user accepted 11 individual rooms displayed under 4–5 family groups |
| 6 | **Simple PNG placeholder for hero** | UPDATE — design uses real `assets/vila-emes-exterior.png` (Booking exterior shot). Plan should use a curated photo from `Main/`, picked at scaffold. |
| 7 | **`amenities` schema enum (9 values)** | UPDATE — design uses richer pill text (Terrace, Kitchenette, Bathtub, Mini-fridge, Balcony, Family-friendly, Sea view, Renovated 2024, etc). Keep enum approach but expand to ~14 keys. |
| 8 | **Single hero "cover" photo per page** | UPDATE — `/rooms` and `/contact` use the *gradient + palms* hero, not a photo. Only `/` uses a photo hero. |
| 9 | **`amenities.air-con/wifi/tv/private-bath/sea-view/balcony/kitchen/living-area/two-bedrooms`** (9 keys) | EXPAND to: above + `terrace`, `bathtub`, `mini-fridge`, `family-friendly`, `2-bedrooms` (already there), `dining-table`, `washing-machine`. Cross-reference with design's pill labels. |
| 10 | **`Sleeps X-Y` capacity strings** | KEEP, but design also surfaces "Sleeps up to N" wording variant — use whichever reads cleaner per room |
| 11 | **`reception_hours` field** | UPDATE — drop in favor of structured `hours.{front_desk, check_in, check_out}` |
| 12 | **`location_blurb` ("30 km from Tirana...")** | REPLACE with structured `distances` array (4 items, each with `value`, `label`, `blurb`) |

---

## Source-of-truth corrections required to spec

All confirmed against `/Users/erbandanaj/Downloads/hotel-vila-emes.md`:

| Field | Spec/plan currently | Booking source-of-truth | Fix |
|---|---|---|---|
| Owner name | Silent (design tool invented "Petrit / Ana") | **Shaban** ("Sabhan", "Shaban", "Shaban Emes") + his daughter | Use "Shaban Emes" + "his daughter" in copy |
| Languages spoken | EN + AL + IT + DE | EN + IT + AL only | Drop DE everywhere |
| Rooms | 3 (deluxe / apartments / standard) | 11 distinct types | See Room taxonomy below |
| Distance — airport | "30 km from Tirana International Airport" | **22 mi** (Booking) | Use 22 mi (~35 km). Note: Booking uses miles. Display as "22 mi (≈35 km)" or stick with miles to match design? Design uses 22 mi raw. |
| Distance — beach | "200 m to the beach" | **100 m** (Booking) / "8-minute walk" / "two-minute walk" (review summary) | Use 100 m (most precise) |
| Distance — centre | (silent) | **3.5 km from the centre of Durrës** | Add |
| Distance — amphitheatre | (silent) | **3 mi (Durres Amphitheatre)** + **3.7 mi (Rock of Kavaje)** | Add |
| Booking rating | (silent) | **9.0** | Add |
| Google rating | (silent) | **4.7** | Add |
| Review count | (silent) | **47** (past 12 months) | Add |
| Hours — check-in | (silent) | **12:00 PM – 6:00 PM** = **12:00 – 18:00** | Add |
| Hours — check-out | (silent) | **7:00 AM – 11:00 AM** = **07:00 – 11:00** | Add |
| Hours — front desk | "08:00 – 23:00" placeholder | **24-hour front desk** | Replace |
| Breakfast | (silent — implied by "breakfast table" copy) | **NOT included** — pastry shop on ground floor | Remove all "breakfast" mentions; add pastry-shop sentence |
| Pets | (silent) | **NOT allowed** | Add to FAQ + house rules |
| Cribs | (silent) | **NOT available** | Add to FAQ + house rules |
| Extra bed | (silent) | **€5/night** | Add |
| Address | "____, Durrës, Albania" placeholder | **Plazh, Durrës** (likely **Rruga Pavarësia, Plazh, Durrës 2001** — design uses this; Booking does not give street name explicitly) | NEEDS USER CONFIRMATION on the street (Rruga Pavarësia is from the design draft, not the markdown). |
| Coordinates / Maps URL | placeholder | (Owner-provided when ready) | Keep placeholder until owner supplies real Booking + Google Maps URLs |

> The design draft also writes copy like *"Three generations of our family look after the rooms"* and *"sixteen rooms"* (hero.jsx:39 — *"Three generations. Sixteen rooms. The same coffee on the terrace every morning."*). The 16-room number is invented; total room count from Booking is 11 (count of distinct types, not units). NEEDS USER CONFIRMATION before shipping.

---

## Room taxonomy (recommended for both rooms.yaml schema and /rooms page)

The chat shows the user accepted **11 individual rooms grouped into 4–5 families** (chat at line 270 confirms "11 actual room types"; chat at line 316 confirms `data-cat` filter values: apartment / deluxe / family / standard / economy = **5 families**).

### Recommended display: 5 families on the filter bar, 11 individual rooms below

Keep all 11 distinct cards. Use the `data-cat` family for filtering. The home preview shows 4 representative families (excluding Economy), as in `Vila Emes.html:288–323`.

### Per-room data (consolidated from Booking source-of-truth + Rooms.html ordering)

| # | id | Display name | Family | Size m² | Beds | View | Recommended featured amenities (max 5) |
|---|---|---|---|---|---|---|---|
| 1 | `apt-1bed-terrace` | One-Bedroom Apartment with Terrace | Apartments | 80 | 1 full + 2 bunk (3 beds) | Sea + city | Terrace, Kitchenette, Air conditioning, Wi-Fi, Family-friendly |
| 2 | `apt-2bed` | Two-Bedroom Apartment with Balcony and Terrace | Apartments | 90 | 1 full + 1 twin + 2 bunk (4 beds) | Sea + city | Kitchenette, 2 bedrooms, Balcony, Terrace, Family-friendly |
| 3 | `deluxe-king` | Deluxe King Room | Deluxe | 30 | 1 queen | City | Air conditioning, Mini-fridge, Private bath, Wi-Fi, Flat-screen TV |
| 4 | `deluxe-queen` | Deluxe Queen Room | Deluxe | 27 | 1 queen | View | Bathtub-or-shower, Air conditioning, Mini-fridge, Wi-Fi, Flat-screen TV |
| 5 | `deluxe-balcony` | Deluxe Double Room with Balcony | Deluxe | 30 | 1 queen | Quiet street | Balcony, Air conditioning, Mini-fridge, Private bath, Flat-screen TV |
| 6 | `quad-sea` | Quadruple Room with Sea View | Family | 27 | 1 full + 2 bunk (3 beds) | Sea | Sea view, Balcony, Air conditioning, Wi-Fi, Family-friendly |
| 7 | `family-balcony` | Family Room with Balcony | Family | 30 | 1 queen + 2 bunk + 1 sofa (4 beds) | Sea | Balcony, Sea view, Air conditioning, Sofa bed, Family-friendly |
| 8 | `family-standard` | Standard Family Room | Family | 30 | 1 queen + 2 bunk (3 beds) | City | Balcony, Air conditioning, Mini-fridge, Family-friendly, Wi-Fi |
| 9 | `std-double` | Standard Double | Standard | (~20–30 — Booking lists "Double" type but no separate spec; design uses 20 m²) | 1 queen | Side / courtyard | Air conditioning, Mini-fridge, Private bath, Wi-Fi |
| 10 | `econ-triple` | Economy Triple Room | Economy | 27 | 1 queen + 1 sofa (2 beds) | City | Balcony, Sofa bed, Air conditioning, Private bath, Wi-Fi |
| 11 | `budget-triple` | Budget Triple Room | Economy | 30 (per Booking; design uses 18) | 1 queen + 1 sofa (2 beds) | City | Balcony, Air conditioning, Private bath, Wi-Fi |

> **Discrepancies between Booking source-of-truth and Rooms.html sizing:**
> - Booking's *Budget Triple* is 30 m²; design says 18 m². → Trust Booking (30).
> - Booking's *Standard Double* is not in the markdown — Booking's FAQ lists "Double" but no dedicated spec. Design invented 20 m² + "1 double" + "Side street / courtyard". → NEEDS USER CONFIRMATION; recommend dropping `std-double` if it doesn't actually exist on Booking, or paste the real Booking listing.
> - Booking's *Deluxe Queen* is 27 m²; design uses 26 m². → Use 27.
> - Booking's *Deluxe Double with Balcony* is 30 m²; design uses 26 m². → Use 30.
>
> **General recommendation:** When in doubt, the Booking markdown wins. Design copy was iterated quickly in a prototype tool.

### Schema shape recommendation

```yaml
rooms:
  - id: "apt-1bed-terrace"
    family: "apartments"        # one of: apartments, deluxe, family, standard, economy
    order: 1                    # display order, used for "01 · Apartments" eyebrow
    name: "One-Bedroom Apartment with Terrace"
    size_m2: 80
    sleeps: 4                   # max occupancy as a number
    sleeps_label: "Sleeps up to 4"   # i18n-safe display string
    beds: "1 full · 2 bunk beds"     # display string
    beds_structured:                  # optional, for stat grid
      - { kind: "full", count: 1 }
      - { kind: "bunk", count: 2 }
    view: "Sea + city"
    outdoor: "Private terrace"
    description: "Our largest one-bedroom — eighty square metres..."
    amenities:                  # short list for pill display, max 6
      - "terrace"
      - "kitchenette"
      - "air-con"
      - "wifi"
      - "private-bath"
      - "family-friendly"
    photos:                     # optional override; otherwise pull by id
      folder: "apartment-1bed-terrace"   # mapping to src/assets/photos/...
```

---

## Component mapping: design HTML → Astro

| Design / HTML element | Plan's current component | Recommendation | Status |
|---|---|---|---|
| Header (Vila Emes.html:148–208) | `Header.astro` (Task 14) | EXTEND — add palm-wordmark SVG, switch to 3 locales, add transparent/solid scroll behavior, mobile dropdown lang menu, mobile nav | UPDATE |
| Hero photo variant (`hero.jsx:7–67`) | `Hero.astro` (Task 17) | REWRITE — full-bleed photo + dual scrim + handwritten lead-in + polaroid inset | UPDATE |
| Hero split variant (hero.jsx:69–134) | — | OPTIONAL alternate variant | NEW (skip unless requested) |
| About section (Vila Emes.html:213–240) | `About.astro` (Task 18) | REWRITE — bigger layout, eyebrow, handwritten span, since-1998 line, family signature | UPDATE |
| Trust strip (Vila Emes.html:242–274) | — | NEW component | NEW: `TrustStrip.astro` |
| Rooms preview (Vila Emes.html:276–325) | `RoomCard.astro` (Task 19) — used 3× | REWRITE — 4-card layout with numbered eyebrow, family/group label, capacity num row, "View details →" | UPDATE |
| Gallery (Vila Emes.html:327–369) | `Gallery.astro` (Task 21) | EXTEND — handwritten captions on selected tiles | UPDATE |
| Location section + map tile (Vila Emes.html:371–414) | `LocationMap.astro` (Task 22) | REWRITE — drop iframe (or make optional), add hand-drawn coastline SVG + pin | UPDATE |
| Contact strip (Vila Emes.html:416–482) | `ContactStrip.astro` (Task 23) | REWRITE — 5-card grid with icon-circles, eyebrow + serif label | UPDATE |
| FAQ (Vila Emes.html:484–519) | — | NEW | NEW: `FAQ.astro` |
| Footer (Vila Emes.html:521–535) | `Footer.astro` (Task 15) | REWRITE — stacked-centered with mobile lang switcher, wordmark, handwritten line | UPDATE |
| Page hero (Rooms.html:171–198, Contact.html:64–77) | — | NEW — sunset + palms + sun, with optional filter slot | NEW: `PageHero.astro` |
| Filter tab-bar (Rooms.html:186–196) | — | NEW — small client-side toggle | NEW: `RoomFilterBar.astro` (or inline in `RoomsView.astro`) |
| Per-room article (Rooms.html:204–540) | `RoomDetails.astro` (Task 20) | RESHAPE — alternating left/right layout, numbered eyebrow, stat grid, amenity pills | UPDATE |
| "What's always included" (Rooms.html:543–567) | — | NEW | NEW: `RoomsIncludes.astro` |
| House rules (Rooms.html:569–587) | — | NEW (or part of `RoomsView.astro`) | NEW |
| Contact form (Contact.html:144–187) | — | NEW (if user keeps form) | NEW: `ContactForm.astro` |
| Contact sidebar (Contact.html:190–218) | — | NEW | NEW: `ContactSidebar.astro` |
| Directions / map (Contact.html:222–279) | — | NEW (mostly reuses `LocationMap.astro`) | NEW: `Directions.astro` |
| Palm doodle decorations (palm-doodles.js) | — | NEW — but as static placement, not random JS | NEW: `PalmDoodle.astro` |
| Palm-tree wordmark SVG (Vila Emes.html:152–158) | — | Tiny inline SVG, can live in `Header.astro` | inline |
| Lang switcher (Vila Emes.html:170–189) | `LangSwitch.astro` (Task 13) | UPDATE — 3 locales (EN/AL/IT), keep mobile dropdown pattern | UPDATE |
| Tweaks panel (tweaks-panel.jsx) | — | DROP entirely | — |
| `palm-doodles.js` | — | DROP runtime-random version; reimplement static | — |
| Hero React mount + Babel scripts | — | DROP — replace with static Astro component | — |

### Components in the plan that should be deleted or merged

- The current `Hero.astro` (plan Task 17) is too simple — doesn't carry the polaroid, the handwritten lead-in, or the dual scrim. **Replace wholesale.**
- The current `RoomCard.astro` (Task 19) and `RoomDetails.astro` (Task 20) need a major refactor — keep names, replace bodies.
- The current `About.astro` (Task 18) doesn't carry any handwritten accents or eyebrow. **Replace wholesale.**
- The current `Footer.astro` (Task 15) needs the handwritten "made with care" line and the wordmark.
- `LocationMap.astro` (Task 22) — the iframe-only version. Either replace with hand-drawn (matches design) or keep iframe and add a sister `MapDoodle.astro` for the smaller spots.

---

## Implementation deviations from the prototype (intentional)

Things the new session should explicitly NOT carry over verbatim:

| What the prototype does | What we do instead | Why |
|---|---|---|
| **Tailwind via CDN** (`<script src="https://cdn.tailwindcss.com">`) | Tailwind v4 via `@tailwindcss/vite`, tokens in `@theme` block in `global.css` | Production build, faster, no runtime JS for styles |
| **Inline `tailwind.config = {...}`** with theme.extend.colors | Token declarations in `@theme` block (Tailwind v4 idiom) | Tailwind v4 best practice |
| **Inline `<style>` blocks** in HTML files | Astro component scoped styles + `global.css` for shared tokens | Componentization, no duplication |
| **React + Babel CDN** for hero + tweaks | Static Astro component, default to **Photo** variant | Plan disallows client framework; static is faster |
| **`hero.jsx` Tweaks toggle** between Photo and Split | Pick **Photo** as default; keep `HeroSplit` documented in code comments only | "i like the photo" — chat:142 |
| **`tweaks-panel.jsx`** dev-only Tweaks UI | DROP entirely | Dev tool, has no place in production build |
| **`palm-doodles.js`** runtime random scattering | Static `PalmDoodle.astro` component, manually placed in 1–2 spots per section | Build determinism, no layout shift, controllable |
| **`data-i18n` runtime string swap** + `applyLang(lang)` | Per-locale Astro routes (`/al/`, `/it/`) loading per-locale YAML | Better SEO, server-side rendering, simpler code |
| **Live language switcher rewrites text in place** | Switcher is a navigation control: same path under another locale prefix | Already in plan |
| **3-language switch on EN/AL/IT** baked in HTML | Same — but driven by `LOCALES` constant, with DE removed | Plan correction |
| **Filter bar JS toggles `display:none`** | Same client-side approach (~10 lines vanilla JS) | Reasonable for a static-list filter |
| **FAQ animation: HTML `<details>`** with custom chev pseudo-elements | Same — keep the pattern | Lightweight, semantic |
| **Form validation runs in inline `<script>`** | If form kept: small inline `<script>` in `ContactForm.astro`, no submit handler beyond client validation + mailto fallback | Client-only is fine for a marketing site |
| **Preconnect to fonts.googleapis.com + fonts.gstatic.com** | Use `@fontsource-variable/cormorant-garamond` + `@fontsource-variable/inter` + `@fontsource/caveat` (self-hosted) | Plan already self-hosts; don't fetch from Google |
| **`assets/vila-emes-exterior.png`** unoptimized PNG | Astro `<Image>` from `src/assets/photos/main/<exterior>-2400.webp` (run optimizer first) | Plan already optimizes via Sharp |
| **Vibe modes via `data-vibe="sunset|dusk"`** as runtime toggle | Either: (a) DROP, (b) ship as a once-decided `<html data-vibe="...">` baked in `Base.astro`, or (c) wrap as a `<VibeProvider>` Astro slot. Surface to user. | Avoid runtime user-facing toggles per spec ethos |
| **Reveal-on-scroll** via IntersectionObserver | Keep — small inline `<script>` in `Base.astro` | Lightweight, pure CSS-state |
| **Sticky header transparent → solid on scroll** | Keep — same approach | Already idiomatic |
| **Mobile hamburger nav** | Keep — same approach | Already idiomatic |

---

## Risk areas / open questions for the user

Surface these BEFORE the new session implements. Proposed defaults marked **(default)**.

1. **"Since 1998" claim in copy.** Invented by the design tool. Real founding year? Or omit entirely? **(default: omit "since 1998" until owner confirms)**
2. **"Three generations / sixteen rooms"** in hero copy (`hero.jsx:39`). Generations is plausible but unverified; "sixteen" is wrong (Booking shows 11 distinct types, but room *units* may be 16+). **(default: rewrite as "Eleven layouts. Three generations of one family.")**
3. **Default vibe.** Drop the system entirely, or ship one of: `default`, `sunset`, `dusk`? **(default: ship the warm-default site-wide; reserve sunset/dusk gradient ONLY for the `PageHero.astro` on /rooms and /contact, not site-wide)**
4. **Hand-drawn map vs Google Maps embed.** Spec says iframe; design uses hand-drawn. **(default: hand-drawn for `/` and `/rooms` location previews; real Google Maps `<iframe>` for the dedicated "Find us" block on `/contact`)**
5. **All 11 rooms vs 4-5 families.** Chat at line 270 + Rooms.html shows 11 individual cards with 5-family filter. **(default: 11 cards on `/rooms` with filter; 4-card preview on `/` showing 4 family representatives)**
6. **Address — Rruga Pavarësia 2001 — was added by design draft, not in Booking markdown.** Real street address? **(default: keep "Plazh, Durrës 2001" until owner confirms street)**
7. **Owner family details.** Booking reviews mention Shaban (and his daughter — chat copy mentions "between Shaban and his daughter"). Daughter's name unknown. **(default: refer to "Shaban Emes — owner" + "his daughter" without naming)**
8. **Contact form on `/contact`.** Design includes a working client-side form with name/email/dates/guests/message. Spec says no reservation logic, all bookings go to Booking.com. **(default: omit form; the 5-tile contact strip + phone/whatsapp/email is the contact mechanism)**. If user wants the form: send via mailto:hello@vilaemes.al or Formspree.
9. **"Renovated 2024"** amenity pill on Deluxe King (Rooms.html:298). Real? **(default: drop unless confirmed)**
10. **Specific photos to use.** The design's About + Polaroid both reference `assets/vila-emes-exterior.png` (the same one image). The plan says ~80 photos available across `Main/` + per-room folders. **(default: scaffold a `docs/photos-shortlist.md` with my picks for each photo slot; let the owner swap them)**
11. **Hero variant default.** Photo (per chat) — confirm the user still wants Photo. **(default: Photo)**.
12. **Trust strip quote.** Currently uses Baling (Hungary, September). The Booking markdown has 13+ quotes; chat picked Baling explicitly (chat:344). **(default: keep Baling unless user wants to swap)**
13. **Gallery captions.** Design has 5 of 12 tiles captioned. Owner needs to pick. **(default: leave as placeholder strings; owner edits captions in YAML during photo-shortlist review)**
14. **"Reception hours" wording.** Booking says 24-hour front desk. Old spec field `reception_hours` should be replaced with structured hours (front_desk, check_in, check_out). **(default: do this restructure)**
15. **Header always-solid on /rooms and /contact** vs transparent + scroll-solid. Design starts solid (`is-solid` from page load) on those pages because they don't have a full-bleed dark hero. **(default: keep this — Photo hero on `/`, solid header elsewhere)**
16. **Pricing.** Chat user said *"nop prices (booking .com decidesd)"* (chat:256). The Tweaks-panel `density="everything"` mode shows "from €X" pills. **(default: do NOT ship per-room pricing anywhere)**
17. **Logo — palm-tree SVG mark vs the existing PNG/SVG logo at `Emes/Logo/Vila Emes.svg`.** The design draft uses an inline 5-frond palm-tree SVG. The Booking-supplied logo is unrelated. **(default: keep the existing logo file as `og:image` and favicon; use the inline palm-tree SVG as the header wordmark mark)**
18. **`/gallery` page.** Chat user said "no separately gallery page (rooms has pictures)" (chat:259). Spec already has gallery only on home. **(default: gallery on home only — no separate page)**

---

## Priority queue for the new session

1. **Update spec** (`docs/superpowers/specs/2026-05-06-vila-emes-site-design.md`) with source-of-truth corrections from the table above. Drop DE locale. Replace 3-room schema with 11-room + 5-family schema. Replace `reception_hours` with structured hours. Add real distances + ratings.
2. **Update plan** (`docs/superpowers/plans/2026-05-06-vila-emes-implementation.md`) tasks:
   - Task 9 (Locale seeding): drop `de.yaml`
   - Task 11 (Astro config): drop `"de"` from locales
   - Task 16 (Amenity component): expand the enum to ~14 keys
   - Task 17 (Hero): rewrite per design
   - Task 18 (About): rewrite per design (eyebrow + handwritten + signature)
   - Task 19 (RoomCard): rewrite to 4-family layout
   - Task 20 (RoomDetails): rewrite to alternating layout with stat grid + pills
   - Task 22 (LocationMap): hand-drawn version + optional iframe
   - Task 23 (ContactStrip): 5-card grid with icon-circles
   - Task 29 (Localized pages): drop `/de/*`
   - **NEW tasks** for: `TrustStrip`, `FAQ`, `PageHero`, `RoomFilterBar`, `RoomsIncludes`, `HouseRules`, `PalmDoodle`, `PalmWordmark`, `Directions` (and optionally `ContactForm`, `ContactSidebar`)
3. **Confirm with user** the open questions in the Risk areas list above (especially #1, #3, #4, #6, #8, #11, #16).
4. **Begin execution per the (updated) plan**, starting with Phase 1. Visual polish loop after each phase against the prototypes.
5. **Visual-polish pass** at the end — pull up `Vila Emes.html` and our build side-by-side; pixel-check spacing, shadows, gradients, font weights, tracking on eyebrows.

---

## File-by-file annotation (brief)

| File | Contents | Reusable? |
|---|---|---|
| `vila-emes/README.md` | Handoff instructions ("read chats first") | Reference only |
| `vila-emes/chats/chat1.md` | 657-line iteration log between user and design tool. **Single source of truth for user intent.** Key turning points: line 142 ("i like the photo"), 156 (3 pages spec), 210 (deeper dive), 252 (no Sand hero, trust signals yes, no gallery page, palm wordmark, translation changes everything, no prices, no family photo, gallery captions yes), 270 (Booking.com markdown attached), 402 (hate sand on hero banner — go warmer with palms), 414 (faq on home), 458 (sunset banner = redder), 471 (sunset vibe site-wide, more palms), 602 (more palms everywhere, fading hero edge, fix faq icon). | Reference only |
| `vila-emes/project/Vila Emes.html` | Homepage prototype, single-file with inline Tailwind config + style + scripts. 635 lines. Has 8 sections + FAQ + footer. Uses real `assets/vila-emes-exterior.png` for About + Polaroid. | Visual reference only — port markup to Astro components |
| `vila-emes/project/Rooms.html` | Rooms prototype with 11 individual articles, alternating layout, sunset hero, filter tabs, Tweaks panel. 745 lines. | Visual reference + room copy as YAML seed |
| `vila-emes/project/Contact.html` | Contact prototype with quick-tile grid, contact form, sidebar (address/hours/Shaban), directions + map, FAQ, footer. 380 lines. | Visual reference; copy seeds for hours/distances/sidebar |
| `vila-emes/project/shared.css` | Site-wide tokens, components (page-hero, sunset/dusk vibes, faq, amenity pill, tab-bar). 240 lines. | Token reference — port to `@theme` + Astro component scoped styles |
| `vila-emes/project/hero.jsx` | React + Babel inline component for 2 hero variants (Photo + Split). Sand was removed. ~180 lines. | Visual reference only — port to static Astro |
| `vila-emes/project/palm-doodles.js` | Runtime JS scatters palm SVGs across `<section>` elements with random sizes/rotations. ~60 lines. | Replace with static Astro component (no runtime random) |
| `vila-emes/project/tweaks-panel.jsx` | Dev-only Tweaks UI shell. ~568 lines. | DROP — has no production role |
| `vila-emes/project/assets/` | Has `vila-emes-exterior.png` (the one real photo used in About + Polaroid) and possibly other uploads. | Already mirrored in `/Users/erbandanaj/Downloads/Emes/`; use the optimized webp output of `scripts/optimize-photos.mjs` |
| `Hotel-vila-emes.md` (in `~/Downloads/`) | Booking.com source-of-truth. Hotel description, rules, 11 rooms with sizes/beds/views/facilities, 12+ guest reviews, ratings 9.0/4.7. | **Authoritative content source** for every fact in the YAML |

---

## Appendix: tiny but meaningful chat quotes (verbatim)

For the next session — these are the user's actual words, in order:

- *"make it warmer - more family like"* (chat:43)
- *"i like everything except the hero.."* (chat:67)
- *"i like the phjoto but the text needs to be more visible.. the cars not shown"* (chat:142)
- *"what can we improve.. this is a good start.. lets dive deeper. ask me a lot of questions and give me a lot of options until we perfect/polish this. also i need 3 pages - homepage, contact & rooms (wtih categories and types)"* (chat:156)
- *"no hero sand - we keep the photo. - trust singlas yes add no separealy gallery page (rooms has pictures) wordsmardk yes palm tree translation changes everything nop prices (booking .com decidesd) no family photo - just names yes we can add some gallery captions here and there."* (chat:252–259) — **CRITICAL — single most consequential message**
- *"i dont like the contact page and rooms hero banner btw - not this sand but warmer, maybe some palm trees (as many as you see fit) here and there. also i want faq in homepage. what else can we improve. research best UI/UX for this warm vibe i am going for here."* (chat:402, restated 414)
- *"warmer sun (redder) on the banner on rooms/contace page.. mimic sunset"* (chat:457)
- *"also fix the faq in the homepage- right now its a lot of issues with the + icon i like what you did in the banner, make he sun a bit bigger, add more palms (smaller) here and there in the banner and around the pages. also can we mimic this sunset vibe all around the website? give me 2 options but i love this palm + sunset vibe"* (chat:473–475)
- *"1 - i said more palm trees (smaller) all around the website - all the places (here and there but giving the doodle vibe) 2 - can we blend the banners of rooms/contact with the page background a bit better? what if we make some kind of fading gradient 3 - the faq icon is not yet fixed 4 - anything else?"* (chat:604–607)
