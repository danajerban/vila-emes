# Vila Emes — Polish Phase Design

**Date:** 2026-05-07
**Status:** Spec — pending user review, then writing-plans
**Supersedes:** none — additive to `2026-05-06-vila-emes-site-design.md`

## Context

The site is built and deployed (https://vila-emes.pages.dev / pushed to github.com/danajerban/vila-emes). 8 commits on `main`, working tree clean. The user's feedback after seeing the live build:

> "i like the general vibe but we need to polish and perfect this"

This phase is purely additive polish — no architectural changes, no new pages, no new content schema. It refines what's there, adds motion + carousels + better CTAs, and swaps placeholders for real values.

Most users will arrive on **mobile** — design choices reflect that.

---

## Locked-in decisions (one-table summary)

| Area | Decision |
| --- | --- |
| Hero pattern | Slow cinema (Ken Burns + crossfade, 4–5 photos) **+** tagline rotator (prepositional swap) |
| Sunset filter | Moderate intensity, **hero photos only** (other photos stay clean) |
| Tagline structure | Stable: `A family hotel`. Rotators: `by the sea` · `since 1998` · `with love` · `100 m from the water` |
| Room carousel | Slide strip with peek (drag/swipe + arrows + dots, autoplay 8s, pauses on hover) |
| Gallery layout | Horizontal scroll, mobile-first |
| Lightbox | Swipe nav · counter · caption · auto-hide controls · pinch-zoom · loop · smooth open animation |
| CTAs added | Sticky header Book button · mobile bottom bar (WA/Call/Book) · Book on every room card · WhatsApp floating bubble (desktop) · "Read all reviews" link in TrustStrip · End-page "ready to come?" section |
| Header | Standard layout — logo left · nav center · 4 flag pills + Book right |
| Lang switcher | Flag pills replacing text (`sq` for Albanian — file rename to `al.svg` in `/public/flags/` for URL clarity) |
| Footer | 3 columns (brand · visit · stay-in-touch) + bottom signature with **made with ❤️** |
| Trust quote | Gry, Norway — replaces current Etain quote (which named Shaban) |
| Shaban rewrites | "the owner" / "owners" / "the family" — context-dependent. No proper name. |
| Map | Drop drawn-SVG mode — every map slot uses Google iframe embed |
| Translation flow | User has pasted Google-Translate output into AL/IT/DE YAMLs. Implementation phase dispatches parallel Opus subagents (one per locale) to verify tone, idiom, formality, place-name spelling. Corrections committed per locale. |
| Site config | Phone, maps URL, maps embed URL → real values into `src/config/site.ts` (Booking URL was already correct, just remove `// PLACEHOLDER` comment) |
| Astro stack | No version bump. Stay on Astro 6.3, Tailwind v4. No new heavy libraries. |

---

## 1 · Hero — Slow Cinema + Tagline Rotator

**Component:** `src/components/Hero.astro` (rewrite)

### Visual / motion

- 4–5 hero photos crossfade between each other, 6.5s per slide, 800ms crossfade overlap.
- Each active slide does a slow Ken Burns zoom: `scale(1.0 → 1.06)` over its 6.5s lifetime, with subtle `translateX/Y` drift (0–1.5%).
- All hero photos are filtered with the **moderate sunset wash** (see §2). Filter is on the `<img>` itself + an absolutely-positioned overlay `<div>` for the warm gradient + vignette.
- Polaroid (current decorative element) stays on `lg:` screens, hidden on mobile (already correct).

### Tagline rotator

- The hero `sub` line splits into stable + rotating:
  - **Stable:** `A family hotel`
  - **Rotating ending:** `by the sea` · `since 1998` · `with love` · `100 m from the water`
- Each phrase visible 4s, crossfade between phrases ~400ms.
- The rotating part is wrapped in a Caveat-handwritten span colored `--color-cream/0.95` (or terracotta if it reads better against current photo).
- Reduced-motion: photos and tagline both stop, first slide + first tagline shown statically.

### Layout

- Section min-height stays `88vh`.
- Bottom-right polaroid: keep the one-time wobble-on-load animation (motion item I★).
- CTAs in hero stay 2 (Book / Map) — adding a third dilutes focus, and the new sticky header Book + mobile bottom bar already give multiple booking entries.

### Content

- `home.hero.sub` (in YAML) → restructured. Add `home.hero.tagline_stable` and `home.hero.tagline_rotators` (string array).
- The current `polaroid_caption_handwritten: "— Shaban, his daughter and his son"` → "— our family, by the sea" or simply "— the Emes family".

### Mobile

- Single-column layout. Polaroid hidden. Tagline rotator works identically.
- Photo + filter + zoom: `transform-origin` set to center to avoid edge cropping on portrait viewports.

### Photos for the rotation

Use 5 photos already in `src/assets/photos/main/`:
- `dji-0379-2400.webp` (current cover — drone, hotel + beach)
- `dji-0380-1600.webp` (drone alt angle)
- `dji-0382-1600.webp` (avenue + palms)
- `dji-0384-1600.webp` (rooftop terrace)
- `beach-1600.webp` (Durrës beach)

---

## 2 · Sunset filter (hero only)

CSS recipe (applied via reusable class `.sunset-photo`):

```css
.sunset-photo {
  filter: sepia(0.32) saturate(1.12) brightness(0.88) contrast(1.05);
}
.sunset-photo + .sunset-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(255, 140, 60, 0.10) 0%,
    rgba(140, 70, 30, 0.18) 100%
  );
  mix-blend-mode: multiply;
  pointer-events: none;
}
.sunset-vignette {
  position: absolute;
  inset: 0;
  box-shadow: inset 0 -80px 60px -20px rgba(45, 34, 24, 0.45);
  pointer-events: none;
}
```

Applied **only** in `Hero.astro` to the slideshow slides. Other components (PageHero, About, Gallery, RoomCard, RoomDetails) render photos at their native brightness.

---

## 3 · Room carousel — slide strip with peek

**Component:** `src/components/RoomCarousel.astro` (new)
**Used by:** `src/components/RoomDetails.astro` (replaces current single-photo render at the photo slot)
**Schema:** `RoomDetails`'s `photos: ImageMetadata[]` already supports many; `RoomsView.astro` currently passes `[roomPhoto[r.id]]` (single). Map needs to expand to 4–6 photos per room (per "Open thread #8 — photo curation" in handoff).

### UX

- Big photo center, neighbor photos peek at left + right (~10% slice visible).
- Drag to advance (touch + pointer events, threshold 30px or 30% of width).
- Snap-scroll using CSS `scroll-snap-type: x mandatory` on the track for keyboard arrows + native scrolling.
- Prev/next buttons: round, semi-transparent, on photo overlay, centered vertically.
- Dots: under the photo, terracotta active / cream/40 inactive.
- Autoplay: 8s per slide, **pauses on `pointerenter` / `focus-within`**, resumes on leave.
- Loop: yes (last → first seamlessly via duplicate-first-slide trick or modulo).
- `prefers-reduced-motion`: autoplay disabled, no auto-advance; manual controls remain.

### Implementation hints

- Pure vanilla JS in an `is:inline` `<script>` block (consistent with the existing zero-bundle pattern). ~80 lines.
- Use IntersectionObserver to only autoplay carousels that are in viewport (saves CPU when many room rows).
- Photos still go through `<Image>` for Astro's image optimization.

### Photo allocation

Mapping (4–6 photos per room) — examples to seed; full table goes in the implementation plan:

| Room ID | Photos (count) | Source folder |
| --- | --- | --- |
| `apt-1bed-terrace` | 4–5 | `apt-1bed-terrace/` |
| `apt-2bed` | 4–5 | `apt-2bed/` |
| `deluxe-king/queen/balcony` | 4 each (split current `deluxe-rooms/` set) | `deluxe-rooms/` |
| `quad-sea/balcony`, `family-balcony/standard`, `econ-triple`, `budget-triple` | 4 each (split `standard-rooms/`) | `standard-rooms/` |

The user (or a follow-up curation pass) will refine which file goes where via `docs/photos-shortlist.md`.

---

## 4 · Gallery & Lightbox

**Component:** `src/components/Gallery.astro` (refactor)

### Layout — horizontal scroll

- Replace current `columns-{2,3,4}` masonry with a horizontal scroll-snap track.
- Each tile: `flex-shrink-0`, fixed width (e.g. `w-[60vw] md:w-[280px]`), aspect-ratio `4/3`.
- Track has `overflow-x: auto`, `scroll-snap-type: x mandatory`.
- Native swipe on mobile, scrollbar/drag on desktop. No JS needed for the basic scroll.
- Optional ghost arrows on desktop (CSS hover, hidden on touch).

### Lightbox upgrades

The existing `<dialog>`-style overlay in `Gallery.astro` already handles open/close/prev/next/keyboard. Add:

- **(a) Swipe gestures** — left/right to navigate, swipe-down to dismiss. Pointer events with velocity threshold.
- **(b) Counter** — `n / total` top-right, monospaced.
- **(c) Caption** — current `figcaption` only shows under thumbnail; surface inside lightbox at the bottom in handwritten Caveat.
- **(e) Auto-hide controls** — close + arrows fade after 2s of no pointer/touch activity. Tap reveals.
- **(f) Pinch zoom** — use the browser's native `touch-action` + `transform` matrix on the `<img>`. ~30 lines of vanilla JS or use `panzoom`-style minimal helper. Avoid heavy libraries.
- **(g) Loop** — already loops; confirm explicit.
- **(h) Smooth open animation** — FLIP (First-Last-Invert-Play) technique: read the thumbnail's bounding rect on click, render the lightbox at that rect, animate to fullscreen. ~40 lines extra.

### Skipped

- (d) Thumbnail strip — extra UI; swipe gesture covers browsing.

---

## 5 · CTAs

### A · Sticky header "Book now" button

- Always visible in the header on every page (transparent or solid state).
- Terracotta primary fill, white text, `tracking-[0.1em] uppercase font-medium`.
- Desktop label: `BOOK`. Mobile label: same (tight on space).
- Wraps to icon-only on `< 360px` if needed.
- Links to `SITE.links.booking_com` with `target="_blank" rel="noopener"`.

### B · Mobile bottom bar

**Component:** `src/components/MobileCTAStack.astro` (new)

- Fixed bottom on `< md` viewports only.
- 3 equal-width buttons: WhatsApp (green) · Call (sea-blue) · Book (terracotta primary).
- Hides when user scrolls **down** (translateY(100%)), reveals on scroll **up**. ~30 lines vanilla JS using `scroll` + `lastY` delta.
- Safe-area-inset padding for iPhone notch home bar.
- Hidden on `≥ md` (desktop has sticky header CTA + WhatsApp float instead).

### C · "Book this" on every room card

- **Home preview cards (`RoomCard.astro`)** — currently has only "View details →". Add a small terracotta `Book` link next to it (or pill button below). Click opens Booking.com directly, separate from the "details" link.
- **Room detail rows (`RoomDetails.astro`)** — already has a Book button; confirm it's prominent.

### E · WhatsApp floating bubble (desktop only)

**Component:** `src/components/WhatsAppFloat.astro` (new)

- 56px circle, fixed bottom-right (24px from edges), z-40, hidden on `< md` (mobile has the bottom bar).
- WhatsApp brand green (#25D366) with white outline icon.
- `href`: `https://wa.me/{wa_number}?text=Hello%2C%20I%27d%20like%20to%20book%20at%20Vila%20Emes`.
- Subtle pulse animation every 8s (CSS keyframe, can disable on reduced-motion).
- Pairs with sticky header — both visible together is fine.

### F · "Read all reviews" link in TrustStrip

- Add a link below the quote: `Read all reviews on Booking →` (handwritten, terracotta).
- Links to the Booking listing.

### H · End-page "ready to come?" section

**Component:** `src/components/ReadyToBookCTA.astro` (new), used as the section before `Footer` on every page (replaces current per-page variations).

```
                  — ready to come? —          ← handwritten Caveat, terracotta, animated
                  Book your stay at Vila Emes  ← serif H2
                                              ← optional 1-line sub-copy
   [ Book on Booking.com ] [ WhatsApp us ] [ Open in Maps ]
       (terracotta, primary)   (white outline)   (sea outline)
```

- Centered, `py-24 md:py-32`, full-width with cream-elevated soft sub-bg.
- `PalmDoodle` decorations flanking left and right (existing component, swayed via motion item J).
- Three buttons: row on `md:`, stacked on mobile (full-width buttons on phone).
- "Buttons not contact tiles" — explicit per user. The 5-tile `ContactStrip` (phone/wa/email/IG/booking) stays on home and contact, separately.
- The existing `home.faq.footer_cta_handwritten` link below the FAQ stays as-is in size and color — it's a soft inline link, not a competing CTA. The new End-page CTA section is the heavy hitter and lives below FAQ.

### Skipped

- D (mid-page block after Gallery) — H covers this.
- G (third hero CTA) — would dilute hero focus.
- I (exit-intent modal) — out of scope.

---

## 6 · Motion catalog

All effects respect `prefers-reduced-motion: reduce`. Mobile-friendly variants applied as noted (★).

### Foundations
- **A · Smooth scroll site-wide** — `html { scroll-behavior: smooth; }` (already partial; verify on all anchor jumps).
- **B · Staggered scroll reveals** — extend current `.reveal` class. New child class `.reveal-stagger > *` with 50ms `transition-delay` increments. ~30 lines CSS.
- **C★ · Hero scroll-zoom** (replaces parallax) — `transform: scale()` driven by IntersectionObserver entry ratio. iOS-safe.
- **G★ · Image ease-in on enter** — `.photo-enter { opacity: 0; transform: scale(0.96) translateY(12px); }` toggles to identity when intersecting. Applied to gallery + room photos + about photo + page-heroes.
- **H · Handwriting stroke reveal** — Caveat headings get an SVG-traced stroke draw OR a CSS clip-path animation. Use a lightweight approach: wrap text in a span with `background: linear-gradient(...)` clipped by `mask-image` that animates from 0% to 100% width. No library.
- **I★ · Polaroid one-time wobble on enter** — `.polaroid-wobble` keyframe: drop-in + 2 small angle wobbles, then settles. Triggered once when visible.
- **J · Palm doodle gentle sway** — `@keyframes palm-sway { 0%, 100% { rotate: -1deg; } 50% { rotate: 1deg; } }` 4s loop on `PalmDoodle` instances.
- **K · Number count-ups** — IntersectionObserver-triggered. 9.0, 4.7, "since 1998", 22 mi, 100 m, 3.5 km, 3 mi. ~50 lines vanilla JS, requestAnimationFrame.
- **L · View Transitions API** — Add `<ClientRouter />` from `astro:transitions` to `Base.astro`. Enables cross-fade between pages. Skip on reduced-motion (browser handles).

### Tap / press
- **D★ · Tap press** — Universal `.tappable:active { transform: scale(0.98); }` on cards, buttons, tiles. CSS only.

### Desktop-only (wrapped in `@media (hover: hover)`)
- **D⌘ · Card hover lift** — translateY(-4px) + shadow grow on cards.
- **F⌘ · Animated link underlines** — pseudo-element scaling from `transform: scaleX(0)` to `scaleX(1)` on hover, `transform-origin: left`.

### Mobile-specific
- **M · Mobile bottom bar show/hide on scroll** — already in §5-B.
- **N · Haptic on Book tap** — `navigator.vibrate?.(8)` in click handler. Respect reduced-motion (skip vibration).

---

## 7 · Header redesign

**Component:** `src/components/Header.astro` (rewrite)

### Layout (desktop ≥ md)

```
[ logo + VILA EMES ]      [ HOME · ROOMS · CONTACT ]      [ 🇬🇧 🇦🇱 🇮🇹 🇩🇪 ]  [ BOOK ]
```

- Container: `max-w-[1280px] mx-auto px-5 md:px-10` height 64px / 80px (current).
- Logo group on left, primary nav center (justified-self center via flex tricks), language flags + Book button on the right.
- Sticky behavior: transparent over hero on home, solid + blurred everywhere else (already implemented; preserve).
- Active nav link: terracotta (already implemented; preserve).

### Layout (mobile < md)

```
[ logo + VILA EMES ]                                              [ BOOK ]  [ ☰ ]
```

- Hamburger opens a full-width slide-down sheet with: nav links (vertical) + flags row + WhatsApp/Call shortcuts.
- Body scroll-locked while sheet is open.
- Sheet closes on link click.

### Language flag pills

- 4 small pills, ~28×20px each (4:3 SVG flags from `lipis/flag-icons`).
- Active locale: full opacity + 1.5px terracotta outline (offset 1px).
- Inactive: 0.55 opacity, 1px gray outline (no fill highlight).
- On hover (desktop) / focus: opacity 1, lift 2px.
- Action: clicking switches locale via `localizedPath()` — preserves current page (e.g., `/rooms` → `/al/rooms`).
- File names: copy `sq.svg` (Albanian), `en.svg`, `it.svg`, `de.svg` from `/Users/erbandanaj/Downloads/xCode/Student Card/Student Card/student-card/public/flags/` into `/Users/erbandanaj/Downloads/xCode/hotel-vila-emes/public/flags/`. Rename `sq.svg` to `al.svg` so it matches the URL locale (consistent with existing `LOCALES` array `["en","al","it","de"]`).

### Sticky Book button

- Always rendered, both transparent and solid header states.
- Adapts color: cream-on-terracotta in transparent state; terracotta-on-white-stroke in solid state? Or always terracotta primary — cleaner. Default: terracotta primary regardless.
- Mobile: visible alongside hamburger.

---

## 8 · Footer redesign

**Component:** `src/components/Footer.astro` (rewrite)

### Layout (desktop)

```
┌────────────────────────────────────────────────────────────────────────┐
│ [logo + VILA EMES]   [VISIT]              [STAY IN TOUCH]              │
│ Two generations …    Rooms                +355 4 867 654               │
│ Plazh, Durrës 2001   Contact              vilaemes@gmail.com           │
│                      Book on Booking.com  WhatsApp                     │
│                                           Instagram                    │
├────────────────────────────────────────────────────────────────────────┤
│  — with love, the Emes family —                  © 2026 · made with ❤️ │
└────────────────────────────────────────────────────────────────────────┘
```

- 3 columns desktop, stacked single-column mobile.
- Background: `--color-cream-elevated`, top border `--color-divider`.
- Bottom bar: handwritten signature + copyright + `made with ❤️` (right-aligned on desktop, centered on mobile).
- All links underline-on-hover (motion F⌘).

### Mobile

- Sections stacked. Brand → Visit → Stay → bottom bar. Each section has subtle divider.

---

## 9 · Content rewrites — Shaban → owner / family

Default replacement rules (context-dependent):

| Original | Replacement |
| --- | --- |
| `polaroid_caption_handwritten: "— Shaban, his daughter and his son"` | `"— the Emes family"` |
| `Shaban Emes opened Vila Emes in 1998…` | `Vila Emes opened in 1998. The same family runs the house — two of them welcome guests most days, and the same hands…` |
| `…and Shaban himself reserving you a parking space out front` | `…and the owner reserving you a parking space out front` |
| `home.trust.quote.text` (Etain quote naming Shaban) | Replaced entirely by Gry, Norway — see §10 |
| `…so Shaban can meet you` (FAQ) | `…so we can meet you` |
| `Shaban will reserve a space for you with a chair if he can` | `The owner will reserve a space for you with a chair if he can` |
| `Shaban reads every message himself` (contact intro) | `We read every message ourselves` |
| `speak_to_name: "Shaban Emes"` | Drop `speak_to_name` field entirely (or set to `"The Emes family"`); `speak_to_role` stays `"Owner"`. |
| `speak_to_handwritten: "— I read every message myself"` | `"— we read every message ourselves"` |

Additional cleanup: the About body removes "two generations of the family run the house" framing per user dislike of "two generations" — replaced with "the same family runs the house — two of them welcome guests most days." Avoids the phrasing the user objected to while preserving the family theme.

These rewrites apply to **EN only**. AL/IT/DE versions get the same restructure once translations are verified (§11).

---

## 10 · Trust quote replacement

**Source:** `home.trust.quote` in `src/content/site/en.yaml`

**New:**
```yaml
home:
  trust:
    quote:
      text: "Cozy family-run hotel. Exceptionally nice staff, always friendly and helpful. Excellent location. Everything you need is nearby. Just a stone's throw from the beach. Highly recommended!"
      author: "Gry"
      location: "Norway"
      when: "stayed last summer"
```

Plus add the "Read all reviews on Booking →" link below the quote (CTA F).

---

## 11 · Translation verification

User has pasted Google Translate output into `src/content/site/al.yaml`, `it.yaml`, `de.yaml`. Implementation phase verifies via parallel Opus subagents.

### Subagent assignment

Three parallel Agent calls (`subagent_type: general-purpose`, model: opus), one per locale:

1. **AL (Albanian / `sq` lang)** — verify:
   - Tone matches the warm, family-run, slightly handwritten EN tone (not formal/corporate Albanian).
   - Idioms read native (e.g., "100 m from the water" → "100 m nga deti", not literal-machine-Albanian).
   - Place-name spelling: "Plazh, Durrës" (with ë), "Rruga Pavarësia" — preserved exactly.
   - Caveat handwritten phrases ("welcome to" → "mirë se vini") feel right at handwriting weight.
2. **IT (Italian)** — verify:
   - Formality level is the warm "voi" or singular "tu"? Default to neutral plural ("vi diamo il benvenuto").
   - Place names: Durrës (Albanian) vs Durazzo (Italian historic). Italians often use Durazzo. Subagent decides which to keep.
   - Tone: avoid stiff hotel-marketing Italian.
3. **DE (German)** — verify:
   - Formality: Sie (formal) over du (informal). Vila Emes is hospitality, so Sie is correct.
   - Compound nouns aren't awkwardly broken or run-on.
   - Place names: Durrës or Durres (without ë)? Subagent decides.

### Subagent contract

Each subagent returns a structured diff: `{ field_path, original, suggested, reason }` JSON list. The implementation phase reviews, applies fixes (or asks user on contested calls), and commits per locale.

**Out of scope:** translating from scratch. The user has already done the translation; subagents only verify and refine.

---

## 12 · Site config swap

**File:** `src/config/site.ts`

| Field | Current | New |
| --- | --- | --- |
| `contact.phone` | `"+355 ___ ___ ___"` | `"+355 4 867 654"` (formatted) |
| `contact.whatsapp` | `"+355 ___ ___ ___"` | `"+355 4 867 654"` (assumed same as phone; user can correct in one-line edit if different) |
| `links.booking_com` | `"https://www.booking.com/hotel/al/vila-emes.html"` (PLACEHOLDER comment) | Same URL, drop comment |
| `links.google_maps` | `"https://maps.app.goo.gl/PLACEHOLDER"` | `"https://maps.app.goo.gl/PWWqRPcZb76uutfSA"` |
| `links.google_maps_embed` | `"https://www.google.com/maps/embed?pb=PLACEHOLDER"` | Extracted `src` from user-provided iframe: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4495.525837783402!2d19.48510047719195!3d41.30848697131005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x134fd988d042b5b1%3A0xa7caa866087393d0!2sHotel%20Vila%20Emes!5e1!3m2!1sen!2s!4v1778163921675!5m2!1sen!2s` |
| `links.instagram` | `"https://instagram.com/vilaemes"` (PLACEHOLDER) | **Stays as placeholder** until user provides real handle. Implementation flags this as a remaining open thread. |

Map iframe: `home.location` section in `HomeView.astro` currently uses `<LocationMap mode="drawn" />`. Switch to `<LocationMap mode="iframe" embedUrl={SITE.links.google_maps_embed} />`. The drawn-SVG `mode="drawn"` branch in `LocationMap.astro` becomes dead code — remove it (per "no fake maps").

---

## 13 · Out of scope (explicitly)

Things NOT changing in this polish phase:

- No new pages, no new content schema fields beyond hero tagline rotators.
- No reservation/booking logic. All "Book" buttons remain external links to Booking.com.
- No backend, no form submission server. Contact form stays mailto-based.
- No CMS, no admin UI.
- No new heavy JS dependencies. Vanilla JS + Astro components only.
- Translations are not re-translated from scratch — only verified.
- Astro version stays 6.3.0.
- Photo curation for `econ-triple` and `budget-triple` (Open Thread #8 from handoff) — separately tracked.
- Custom domain swap — separate post-deployment task.
- The `instagram` URL placeholder — flagged but not resolved until user provides.
- Custom cursor (motion item M) — skipped.
- Magnetic CTA buttons (motion E) — skipped.
- Exit-intent modal (CTA I) — skipped.
- Lightbox thumbnail strip (gallery d) — skipped.

---

## 14 · Implementation order (high level)

The plan agent decides exact phasing and atomic commits. Suggested grouping for context:

1. **Config + map swap** (1 file change, 1 component edit) — fastest visible win, unblocks any place that uses real URLs.
2. **Content rewrites** (Shaban → owner/family + trust quote in `en.yaml`).
3. **Header rewrite** (sticky Book + flag pills + mobile sheet).
4. **Hero rewrite** (slow cinema + tagline rotator + sunset filter).
5. **Room carousel component** (new `RoomCarousel.astro` + photo allocation map).
6. **Gallery refactor** (horizontal scroll + lightbox upgrades).
7. **Footer rewrite**.
8. **End-page CTA section** (new component + drop into all views).
9. **Mobile bottom bar + WhatsApp float**.
10. **Motion pass** — applies systemwide: reveals, palm sway, count-ups, view transitions, etc.
11. **Translation verification** (3 parallel Opus subagents).

Each step ends with a commit on `main`. Site builds cleanly after every commit.

---

## 15 · Acceptance criteria

A reviewer (or the user) should be able to verify the polish phase succeeded by:

1. **Build** — `npm run build` produces 12 HTML pages, no console errors, dist size still under ~6 MB.
2. **Hero** — open `/`. Photos crossfade with slow zoom. Tagline rotates between 4 phrases. Photo has a noticeable warm cast (not bright midday). Polaroid wobbles on first scroll into view.
3. **Header** — Book button visible top-right at all times. 4 flag pills work — clicking switches language and stays on the same page. Mobile: hamburger opens slide-down sheet.
4. **Room carousel** — `/rooms`, scroll to any room. Photos auto-advance every 8s. Drag, swipe, arrow buttons, and dots all advance the carousel. Hover (desktop) or focus pauses autoplay.
5. **Gallery** — `/`, scroll to gallery. Horizontal scroll on mobile (swipe), drag/scroll on desktop. Tap photo → lightbox opens with smooth animation, swipe nav works, pinch-zoom works, counter shows `n/12`, controls fade after 2s of inactivity.
6. **Mobile bottom bar** — open on phone. Bar at bottom shows WhatsApp / Call / Book. Scroll down → bar hides; scroll up → bar reveals.
7. **WhatsApp float** — desktop only. Bottom-right circle. Click opens chat.
8. **End-page CTA** — every page bottom (above footer): "ready to come?" handwritten + 3 buttons + palm doodles. Buttons stack on mobile.
9. **Motion** — page navigation cross-fades (View Transitions). Numbers count up when scrolled into view. Palms sway in CTA section. Card hovers lift on desktop only. Tap-press shrinks cards on mobile.
10. **Map** — every map slot is the Google iframe (no SVG drawn map remains).
11. **Content** — no occurrence of "Shaban" anywhere in `en.yaml` or rendered HTML. Trust quote is from Gry, Norway. "Two generations" is gone.
12. **Translations** — AL/IT/DE versions of all visible copy match EN structure (no missing fields per Zod schema). Subagent verification reports committed to `docs/translation-review-2026-05-07.md`.
13. **Reduced motion** — toggle "Reduce motion" in OS settings, refresh: hero stops crossfading, palms don't sway, carousel doesn't autoplay, view transitions disable.
14. **Lighthouse** — mobile scores match or exceed the current build's baseline (run before/after; report numbers in implementation summary).

---

## 16 · Open follow-ups (post-polish)

- Real Instagram URL once user provides handle.
- Photo curation pass for `econ-triple` and `budget-triple` rooms (Open Thread #8 — separate from this spec).
- Custom domain swap (post Cloudflare).
