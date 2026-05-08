# Vila Emes Polish Phase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the live Vila Emes site (Astro 6.3 / Tailwind v4 / 4 locales) with hero slow-cinema + tagline rotator, room carousels, gallery + lightbox upgrades, additional CTAs (sticky header, mobile bottom bar, WhatsApp float, end-page section), motion catalog, header redesign with flag pills, footer redesign, content rewrites (Shaban → owner / family + new trust quote), site-config swap (real phone + map URLs), and Opus-subagent translation verification across AL/IT/DE.

**Architecture:** Pure additive polish — no new pages, no schema-breaking changes. All new behavior implemented as inline scripts (`is:inline`, zero-bundle pattern preserved). Schema gains only optional fields. Site stays buildable after every commit. Translation verification runs as the final group via 3 parallel Opus subagents (one per locale), each producing a structured diff that becomes a per-locale commit.

**Tech Stack:** Astro 6.3.0 · Tailwind v4 (`@theme` token blocks) · Zod content collections · Cormorant Garamond serif + Inter sans + Caveat handwritten · vanilla JS only (no new deps) · Cloudflare Pages.

**Source Spec:** `docs/superpowers/specs/2026-05-07-vila-emes-polish-design.md` (510 lines).

---

## Build-Green Invariant

After **every** task's commit:

```bash
npm run build
```

must produce 12 HTML pages with no schema errors and no console errors during render. Each task's verification step ends with this command. If a task adds visible UI, the verification also lists what to check in the browser at `http://localhost:4321/` after `npm run dev`.

---

## File Structure

### Created files (8)

| Path | Responsibility |
| --- | --- |
| `public/flags/en.svg` | English (UK) flag, 4:3 |
| `public/flags/al.svg` | Albanian flag, 4:3 (renamed from `sq.svg` source) |
| `public/flags/it.svg` | Italian flag, 4:3 |
| `public/flags/de.svg` | German flag, 4:3 |
| `src/components/RoomCarousel.astro` | Slide-strip carousel: drag/swipe/arrows/dots/autoplay/peek, scoped to one room's photo list |
| `src/components/MobileCTAStack.astro` | Fixed mobile bottom bar with WhatsApp / Call / Book; auto-hides on scroll-down |
| `src/components/WhatsAppFloat.astro` | Desktop-only floating WhatsApp bubble bottom-right |
| `src/components/ReadyToBookCTA.astro` | End-page "ready to come?" section with 3 buttons (Book / WA / Map) |

### Modified files (16)

| Path | What changes |
| --- | --- |
| `src/config/site.ts` | Real phone, real Google Maps URL + embed URL; drop `// PLACEHOLDER` comments |
| `src/content.config.ts` | Add optional `tagline_stable: string` and `tagline_rotators: array<string>` under `home.hero` |
| `src/content/site/en.yaml` | Trust quote (Etain → Gry), Shaban → owner / family rewrites, hero rotator data, footer text, new End-page CTA copy, RoomCard book label, TrustStrip review-link label |
| `src/content/site/al.yaml`, `it.yaml`, `de.yaml` | Translation verification (one commit each, separately, via Opus subagent diffs) |
| `src/styles/global.css` | Sunset filter classes, `.reveal-stagger`, `.photo-enter`, `.palm-sway`, `.polaroid-wobble`, `.tappable`, `@media (hover: hover)` desktop hover variants |
| `src/components/Hero.astro` | Slow cinema (5-photo crossfade + Ken Burns) + tagline rotator + sunset filter + polaroid wobble |
| `src/components/Header.astro` | Sticky Book button + flag pills + mobile slide-down sheet |
| `src/components/Footer.astro` | 3-column layout (brand / visit / stay-in-touch) + bottom bar with `made with ❤️` |
| `src/components/LangSwitch.astro` | Replace text labels with flag pills (4:3 SVGs from `/public/flags/`) |
| `src/components/LocationMap.astro` | Delete `mode="drawn"` branch (no callers after Task 1); iframe-only |
| `src/components/Gallery.astro` | Horizontal scroll-snap track + lightbox upgrades (swipe nav, counter, caption, auto-hide controls, pinch-zoom, FLIP open animation) |
| `src/components/RoomCard.astro` | Add small terracotta Book pill alongside "View details →" |
| `src/components/RoomDetails.astro` | Replace single `<Image>` photo block with `<RoomCarousel photos={photos} />` |
| `src/components/TrustStrip.astro` | Add "Read all reviews on Booking →" handwritten link below quote |
| `src/components/PalmDoodle.astro` | Add `palm-sway` class hook (animation defined in global.css) |
| `src/views/HomeView.astro` | Hero photo array (5 main/), `<LocationMap mode="iframe">` swap, RoomCard `bookHref`, `<ReadyToBookCTA />` insert, mobile bar + WA float |
| `src/views/RoomsView.astro` | Expand `roomPhoto: Record<string, ImageMetadata>` to `Record<string, ImageMetadata[]>` (4–6 photos per room), `<ReadyToBookCTA />` insert |
| `src/views/ContactView.astro` | `<ReadyToBookCTA />` insert |
| `src/layouts/Base.astro` | `<ClientRouter />` from `astro:transitions`, count-up inline script, `.reveal-stagger` observer |

### Deleted files (0)

No file deletions. The drawn-map branch in `LocationMap.astro` is cut from the same file.

---

## Implementation Order Summary

| # | Title | Files touched | Build-green pivot |
| --- | --- | --- | --- |
| 1 | Site config swap + Maps iframe | site.ts, HomeView, LocationMap | Real URLs land; drawn-map branch removed |
| 2 | Copy flag assets | public/flags/*.svg (4 files) | Pure asset addition |
| 3 | Trust quote + Shaban rewrites | en.yaml | EN content cleaned |
| 4 | Schema + tagline rotator data | content.config.ts, en.yaml | Hero data ready (Hero unchanged yet) |
| 5 | Sunset filter CSS | global.css | Classes available (no consumer yet) |
| 6 | Hero rewrite | Hero.astro, HomeView.astro | Slow cinema + rotator + sunset filter active |
| 7 | Header redesign + flag pills + mobile sheet | Header.astro, LangSwitch.astro | New nav UX live |
| 8 | Footer redesign | Footer.astro, en.yaml | 3-col + made-with-❤️ |
| 9 | Room carousel | RoomCarousel.astro (new), RoomDetails.astro, RoomsView.astro | Carousel live on /rooms |
| 10 | Gallery refactor | Gallery.astro | Horizontal scroll + enhanced lightbox |
| 11 | RoomCard Book CTA + TrustStrip review link | RoomCard.astro, TrustStrip.astro, HomeView.astro, en.yaml | Conversion CTAs added |
| 12 | End-page CTA section | ReadyToBookCTA.astro (new), 3 views, en.yaml | "Ready to come?" block on every page |
| 13 | Mobile bottom bar + WhatsApp float | MobileCTAStack.astro (new), WhatsAppFloat.astro (new), Base.astro, en.yaml | Sticky CTAs across viewports |
| 14 | Motion pass | global.css, Base.astro, PalmDoodle.astro, About.astro | Reveals/sway/count-up/view-transitions |
| 15 | AL translation verification | al.yaml | AL committed (separate commit) |
| 16 | IT translation verification | it.yaml | IT committed (separate commit) |
| 17 | DE translation verification | de.yaml | DE committed (separate commit) |

Total commits expected: 17. Three of those (15–17) are produced from parallel Opus subagent runs.

---

## Task 1: Site config swap + Google Maps iframe

**Goal:** Replace the placeholder phone and Google Maps URLs with real values, swap the home page from the drawn SVG map to the Google iframe embed, and delete the now-unused `mode="drawn"` branch in `LocationMap.astro`.

**LocationMap callers (verified by `grep -rn "LocationMap" src/ --include="*.astro"`):** THREE call sites — `HomeView.astro:168`, `ContactView.astro:79`, AND `Directions.astro:31` (used inside ContactView). All three must be updated atomically with the contract change, otherwise Astro silently passes `embedUrl=undefined` and renders a blank iframe.

**Files:**
- Modify: `src/config/site.ts`
- Modify: `src/views/HomeView.astro:168` (the `<LocationMap mode="drawn" ... />` call)
- Modify: `src/views/ContactView.astro:79-83` (drop `mode="iframe"` prop)
- Modify: `src/components/Directions.astro:31` (replace `mode="drawn"` with `embedUrl={SITE.links.google_maps_embed}`)
- Modify: `src/components/LocationMap.astro` (delete the drawn-mode JSX branch)

- [ ] **Step 1: Update `src/config/site.ts`**

Replace lines 7–11 and 20–25 to read:

```ts
  contact: {
    phone: "+355 4 867 654",
    whatsapp: "+355 4 867 654",
    email: "vilaemes@gmail.com",
    address: ["Rruga Pavarësia", "Plazh, Durrës 2001", "Albania"],
  },

  hours: {
    front_desk: "24-hour",
    check_in: "12:00 – 18:00",
    check_out: "07:00 – 11:00",
  },

  links: {
    booking_com: "https://www.booking.com/hotel/al/vila-emes.html",
    instagram: "https://instagram.com/vilaemes", // PLACEHOLDER — update when owner provides handle
    google_maps: "https://maps.app.goo.gl/PWWqRPcZb76uutfSA",
    google_maps_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4495.525837783402!2d19.48510047719195!3d41.30848697131005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x134fd988d042b5b1%3A0xa7caa866087393d0!2sHotel%20Vila%20Emes!5e1!3m2!1sen!2s!4v1778163921675!5m2!1sen!2s",
  },
```

The `// PLACEHOLDER` comment is removed from `booking_com`, `phone`, `whatsapp`, `google_maps`, `google_maps_embed`. It stays only on `instagram`.

- [ ] **Step 2: Swap HomeView's LocationMap to iframe mode**

In `src/views/HomeView.astro` line 168, replace:

```astro
<LocationMap mode="drawn" ariaLabel="Hand-drawn map of Vila Emes location" />
```

with:

```astro
<LocationMap
  mode="iframe"
  embedUrl={SITE.links.google_maps_embed}
  ariaLabel="Vila Emes location on Google Maps"
/>
```

- [ ] **Step 3: Delete the drawn-mode branch in `LocationMap.astro`**

Replace the entire content of `src/components/LocationMap.astro` (lines 1–41) with:

```astro
---
interface Props {
  embedUrl: string;
  ariaLabel: string;
}
const { embedUrl, ariaLabel } = Astro.props;
---
<div class="w-full aspect-[16/9] rounded-md overflow-hidden border border-[color:var(--color-divider)]" aria-label={ariaLabel}>
  <iframe
    src={embedUrl}
    title={ariaLabel}
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
    class="w-full h-full block"
  ></iframe>
</div>
```

The `mode` prop is removed entirely. Both callers (`HomeView`, `ContactView`) now pass `embedUrl` and `ariaLabel` only.

- [ ] **Step 4: Update ContactView's LocationMap call to drop `mode="iframe"`**

In `src/views/ContactView.astro:79-83`, change:

```astro
<LocationMap
  mode="iframe"
  embedUrl={SITE.links.google_maps_embed}
  ariaLabel="Vila Emes location on Google Maps"
/>
```

to:

```astro
<LocationMap
  embedUrl={SITE.links.google_maps_embed}
  ariaLabel="Vila Emes location on Google Maps"
/>
```

(The `mode` prop no longer exists.)

- [ ] **Step 5: Build verify**

Run:

```bash
npm run build
```

Expected: 12 HTML pages built, no errors. Open `dist/index.html` and grep for `iframe` — should appear in the home page output.

```bash
grep -c "google.com/maps/embed" dist/index.html dist/contact/index.html
```

Expected: each file shows `1`.

- [ ] **Step 6: Commit**

```bash
git add src/config/site.ts src/views/HomeView.astro src/views/ContactView.astro src/components/LocationMap.astro
git commit -m "feat(config): real phone + maps URLs, drop drawn-map mode

- Replace placeholder phone with +355 4 867 654 (matches whatsapp)
- Replace placeholder google_maps with maps.app.goo.gl/PWWqRPcZb76uutfSA
- Replace placeholder google_maps_embed with real Hotel Vila Emes pin embed URL
- Drop // PLACEHOLDER comment on booking_com (URL was already real)
- Switch home page LocationMap from mode=drawn to embedUrl iframe
- Delete the drawn-mode SVG branch from LocationMap (no callers remain)"
```

---

## Task 2: Copy flag assets into `public/flags/`

**Goal:** Make 4 flag SVGs available at `/flags/{en,al,it,de}.svg` for the new flag-pill language switcher.

**Files:**
- Create: `public/flags/en.svg`
- Create: `public/flags/al.svg` (renamed from upstream `sq.svg`)
- Create: `public/flags/it.svg`
- Create: `public/flags/de.svg`

- [ ] **Step 1: Create the `public/flags/` directory and copy + rename the 4 SVGs**

```bash
mkdir -p public/flags
cp "/Users/erbandanaj/Downloads/xCode/Student Card/Student Card/student-card/public/flags/en.svg" public/flags/en.svg
cp "/Users/erbandanaj/Downloads/xCode/Student Card/Student Card/student-card/public/flags/sq.svg" public/flags/al.svg
cp "/Users/erbandanaj/Downloads/xCode/Student Card/Student Card/student-card/public/flags/it.svg" public/flags/it.svg
cp "/Users/erbandanaj/Downloads/xCode/Student Card/Student Card/student-card/public/flags/de.svg" public/flags/de.svg
```

Note: the source filename for Albanian is `sq.svg` (ISO 639-1). It is renamed to `al.svg` so the filename matches the URL locale (`/al/...`). The `<html lang="sq">` mapping in `src/i18n/locales.ts` is preserved separately.

- [ ] **Step 2: Verify**

```bash
ls public/flags/
```

Expected output: `al.svg  de.svg  en.svg  it.svg`

```bash
file public/flags/*.svg
```

Expected: all 4 reported as `SVG Scalable Vector Graphics`.

- [ ] **Step 3: Build verify**

```bash
npm run build
```

Expected: success (no consumers reference these yet, so this is a pure asset addition that will be picked up in Task 7).

```bash
ls dist/flags/
```

Expected: same 4 files copied through to `dist/`.

- [ ] **Step 4: Commit**

```bash
git add public/flags/
git commit -m "feat(assets): add 4 flag SVGs for language switcher

Source: lipis/flag-icons via Student Card project. Albanian flag was
named sq.svg upstream — renamed to al.svg here so filenames match
URL locales (en, al, it, de). HTML lang attribute mapping (al→sq) is
preserved in i18n/locales.ts."
```

---

## Task 3: Content rewrites — Shaban → owner/family + trust quote (en.yaml)

**Goal:** Replace every "Shaban" reference in `en.yaml` with the owner/family/we framing, swap the trust quote from Etain (Ireland) to Gry (Norway), and remove the "two generations" framing per user feedback.

**Files:**
- Modify: `src/content/site/en.yaml`

This task is pure data — no schema or component change. Schema validation continues to pass because all field types stay identical.

- [ ] **Step 1: Update `home.hero.polaroid_caption_handwritten`**

Find (line 14):

```yaml
    polaroid_caption_handwritten: "— Shaban, his daughter and his son"
```

Replace with:

```yaml
    polaroid_caption_handwritten: "— the Emes family"
```

- [ ] **Step 2: Update `home.about.body` (the 3-paragraph story)**

Replace lines 20–23 with:

```yaml
    body:
      - "Vila Emes opened in 1998. The same family runs the house — two of them welcome guests most days, and the same hands that lay out fresh towels know which room catches the morning light first."
      - "We sit on Rruga Pavarësia in Plazh, the long avenue that runs above the beach in Durrës. The pastry shop on our ground floor opens early — cappuccino, espresso, fresh croissants — five steps from the lobby. Restaurants, supermarkets, and the bus stop are all within a short stroll."
      - "What to expect: a hundred metres to the water, a 24-hour front desk, simple rooms cared for daily, and the owner reserving you a parking space out front (sometimes with a chair on it). It is not a luxury hotel. It is a small house with a real heart."
```

Changes vs current:
- "Shaban Emes opened Vila Emes in 1998" → "Vila Emes opened in 1998"
- "Two generations of the family run the house now — his daughter and son welcome guests alongside him most days" → "The same family runs the house — two of them welcome guests most days"
- "Shaban himself reserving you a parking space" → "the owner reserving you a parking space"

- [ ] **Step 3: Replace the trust quote (Etain → Gry)**

Replace lines 29–33 with:

```yaml
    quote:
      text: "Cozy family-run hotel. Exceptionally nice staff, always friendly and helpful. Excellent location. Everything you need is nearby. Just a stone's throw from the beach. Highly recommended!"
      author: "Gry"
      location: "Norway"
      when: "stayed last summer"
```

- [ ] **Step 4: Update FAQ items for Shaban references**

Replace `home.faq.items` (lines 60–72) with:

```yaml
    items:
      - q: "What time is check-in and check-out?"
        a: "Check-in from 12:00 to 18:00. Check-out from 07:00 to 11:00. The front desk is open 24 hours, so late arrivals are fine — just let us know by WhatsApp so we can meet you."
      - q: "Is breakfast included?"
        a: "Breakfast is not included in the room rate, but our ground-floor pastry shop opens early and serves cappuccino, espresso, and fresh pastries — five steps from the lobby."
      - q: "Where do I park?"
        a: "Free street parking in front of the hotel. The owner will reserve a space for you with a chair if he can — first-come, first-served."
      - q: "Do you allow pets?"
        a: "Pets are not allowed at Vila Emes."
      - q: "Are cribs or extra beds available?"
        a: "Cribs are not available. An extra bed can be added to most rooms for €5 per person, per night — let us know in advance."
      - q: "What languages do you speak?"
        a: "English, Italian, and Albanian — every day, all day."
```

- [ ] **Step 5: Update contact_page intro and sidebar**

Find `contact_page.hero_intro` (line 119):

```yaml
  hero_intro: "Phone us. Message on WhatsApp. Or write a few lines below — Shaban reads every message himself."
```

Replace with:

```yaml
  hero_intro: "Phone us. Message on WhatsApp. Or write a few lines below — we read every message ourselves."
```

Find `contact_page.sidebar` (lines 132–137):

```yaml
  sidebar:
    address_label: "Address"
    hours_label: "Hours"
    speak_to_label: "Speak to"
    speak_to_name: "Shaban Emes"
    speak_to_role: "Owner"
    speak_to_handwritten: "— I read every message myself"
```

Replace with:

```yaml
  sidebar:
    address_label: "Address"
    hours_label: "Hours"
    speak_to_label: "Speak to"
    speak_to_name: "The Emes family"
    speak_to_role: "Owners"
    speak_to_handwritten: "— we read every message ourselves"
```

(Note: `speak_to_name` cannot be dropped — Zod schema requires it. Setting it to "The Emes family" preserves the schema and reads naturally.)

- [ ] **Step 6: Update `hotel.tagline`**

Find line 3:

```yaml
  tagline: "Two generations of one family by the sea"
```

Replace with:

```yaml
  tagline: "A family hotel by the sea"
```

This is the `<title>` suffix on every page (composed in `Base.astro:23`). Drops "two generations" framing.

- [ ] **Step 7: Update `home.hero.sub`**

Find line 11:

```yaml
    sub: "Eleven layouts. Two generations of one family. The same coffee on the terrace every morning."
```

Replace with:

```yaml
    sub: "Eleven layouts. A family that opens the door themselves. The same coffee on the terrace every morning."
```

(Hero rewrite in Task 6 will use the rotator, not `sub`. This update is for backward compat — `sub` remains a valid fallback and stays in schema.)

- [ ] **Step 8: Build verify**

```bash
npm run build
```

Expected: success. EN home page now shows Gry's quote, no occurrences of "Shaban", no "two generations".

```bash
grep -ic "shaban" dist/index.html
```

Expected: `0`.

```bash
grep -ic "two generations" dist/index.html
```

Expected: `0`.

```bash
grep -c "Gry" dist/index.html
```

Expected: `1` (the trust quote attribution).

- [ ] **Step 9: Commit**

```bash
git add src/content/site/en.yaml
git commit -m "content(en): replace Shaban references with owner/family + new trust quote

- Trust quote: Etain/Ireland → Gry/Norway (Etain quote named Shaban)
- Polaroid caption: 'Shaban, his daughter and his son' → 'the Emes family'
- About body: drop 'two generations' framing, swap 'Shaban' for 'the owner'
- FAQ: 'so Shaban can meet you' → 'so we can meet you'
- FAQ: 'Shaban will reserve' → 'The owner will reserve'
- Contact intro: 'Shaban reads every message' → 'we read every message ourselves'
- Sidebar speak_to: 'Shaban Emes' / 'I read every message myself' → 'The Emes family' / 'we read every message ourselves'
- Tagline + hero sub: drop 'two generations' phrasing"
```

---

## Task 4: Schema extension + tagline rotator data

**Goal:** Add optional `tagline_stable` and `tagline_rotators` fields to the `home.hero` Zod schema, then populate them in `en.yaml`. Optional so the build stays green for AL/IT/DE locales (which won't get these fields until translation step 11).

**Files:**
- Modify: `src/content.config.ts`
- Modify: `src/content/site/en.yaml`

- [ ] **Step 1: Extend the Zod schema**

In `src/content.config.ts`, find the `home.hero` schema block (lines 65–73):

```ts
        hero: z.object({
          eyebrow: z.string(),
          welcome_handwritten: z.string(),
          heading: z.string(),
          sub: z.string(),
          cta_primary: z.string(),
          cta_secondary: z.string(),
          polaroid_caption_handwritten: z.string(),
        }),
```

Replace with:

```ts
        hero: z.object({
          eyebrow: z.string(),
          welcome_handwritten: z.string(),
          heading: z.string(),
          sub: z.string(),
          tagline_stable: z.string().optional(),
          tagline_rotators: z.array(z.string()).min(2).optional(),
          cta_primary: z.string(),
          cta_secondary: z.string(),
          polaroid_caption_handwritten: z.string(),
        }),
```

The new fields are `.optional()` so AL/IT/DE yaml files (which don't have them yet) still validate. The `min(2)` constraint applies only when present, ensuring we never get a single-phrase rotator.

- [ ] **Step 2: Add the rotator data to `en.yaml`**

In `src/content/site/en.yaml`, after the `heading: "Vila Emes"` line in `home.hero` (currently line 10), insert:

```yaml
    tagline_stable: "A family hotel"
    tagline_rotators:
      - "by the sea"
      - "since 1998"
      - "with love"
      - "100 m from the water"
```

Final `home.hero` block in `en.yaml` should look like:

```yaml
  hero:
    eyebrow: "Durrës · Albania · Since 1998"
    welcome_handwritten: "welcome to"
    heading: "Vila Emes"
    tagline_stable: "A family hotel"
    tagline_rotators:
      - "by the sea"
      - "since 1998"
      - "with love"
      - "100 m from the water"
    sub: "Eleven layouts. A family that opens the door themselves. The same coffee on the terrace every morning."
    cta_primary: "Book on Booking.com"
    cta_secondary: "Open in Maps"
    polaroid_caption_handwritten: "— the Emes family"
```

- [ ] **Step 3: Build verify**

```bash
npm run build
```

Expected: success. AL/IT/DE locales build because `tagline_stable` and `tagline_rotators` are optional. EN locale carries the new data which Hero will consume in Task 6.

To confirm AL/IT/DE work without the new fields:

```bash
ls dist/al/index.html dist/it/index.html dist/de/index.html
```

Expected: all three exist.

- [ ] **Step 4: Commit**

```bash
git add src/content.config.ts src/content/site/en.yaml
git commit -m "feat(content): add optional tagline rotator fields to home.hero

Schema gains tagline_stable: string? and tagline_rotators: string[]?
(min 2 when present). EN gets 'A family hotel' + 4 rotating endings:
'by the sea', 'since 1998', 'with love', '100 m from the water'.
Optional so AL/IT/DE keep building until translation verification
adds locale-specific rotators."
```

---

## Task 5: Sunset filter CSS

**Goal:** Add reusable `.sunset-photo`, `.sunset-overlay`, and `.sunset-vignette` classes to `global.css`. They go nowhere yet — Hero rewrite in Task 6 will apply them to the slideshow images.

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Append filter classes to `global.css`**

At the bottom of `src/styles/global.css` (after the `@layer base` block closes at line 120), add:

```css
/* Sunset filter — applied only to Hero photos (other photos render natural). */
.sunset-photo {
  filter: sepia(0.32) saturate(1.12) brightness(0.88) contrast(1.05);
}
.sunset-overlay {
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

- [ ] **Step 2: Build verify**

```bash
npm run build
```

Expected: success. CSS additions compile — Tailwind v4 ignores plain CSS class declarations outside `@theme`/`@layer base`.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat(css): add sunset filter classes for Hero photos

Three reusable utilities — .sunset-photo (sepia + brightness),
.sunset-overlay (warm gradient with multiply blend), .sunset-vignette
(inset shadow at bottom). Applied in Task 6 to the Hero slideshow only;
other photos render at native brightness."
```

---

## Task 6: Hero rewrite — slow cinema + tagline rotator + sunset filter

**Goal:** Rewrite `Hero.astro` to crossfade 5 photos with slow Ken Burns zoom, rotate the tagline ending across 4 phrases, apply the sunset filter, keep the polaroid (lg+) with a one-time wobble-on-load animation. All motion respects `prefers-reduced-motion`. Update `HomeView.astro` to pass the 5-photo array and rotator data.

**Files:**
- Modify: `src/components/Hero.astro` (full rewrite)
- Modify: `src/views/HomeView.astro` (hero photo imports + props)

- [ ] **Step 1: Add 4 additional hero photo imports to `HomeView.astro`**

In `src/views/HomeView.astro` after line 18 (existing `heroCover` import), add:

```ts
import heroSlide2 from "../assets/photos/main/dji-0380-2400.webp";
import heroSlide3 from "../assets/photos/main/dji-0382-2400.webp";
import heroSlide4 from "../assets/photos/main/dji-0384-2400.webp";
import heroSlide5 from "../assets/photos/main/beach-2400.webp";
```

(Existing `heroCover` already points at `dji-0379-2400.webp` — that becomes slide 1.)

- [ ] **Step 2: Update the `<Hero ... />` call in `HomeView.astro`**

Replace the existing `<Hero ... />` block (lines 86–97) with:

```astro
  <Hero
    slides={[heroCover, heroSlide2, heroSlide3, heroSlide4, heroSlide5]}
    polaroid={heroPolaroid}
    eyebrow={home.hero.eyebrow}
    welcomeHandwritten={home.hero.welcome_handwritten}
    heading={home.hero.heading}
    taglineStable={home.hero.tagline_stable}
    taglineRotators={home.hero.tagline_rotators}
    sub={home.hero.sub}
    ctaPrimary={{ label: home.hero.cta_primary, href: SITE.links.booking_com }}
    ctaSecondary={{ label: home.hero.cta_secondary, href: SITE.links.google_maps }}
    polaroidCaption={home.hero.polaroid_caption_handwritten}
    hotelName={site.data.hotel.name}
  />
```

The `cover` prop is replaced with `slides` (array). New `taglineStable` / `taglineRotators` props are passed; Hero falls back to `sub` when rotators are missing.

- [ ] **Step 3: Rewrite `src/components/Hero.astro` end-to-end**

Replace the entire content of `src/components/Hero.astro` (lines 1–77) with:

```astro
---
import { Image } from "astro:assets";
import type { ImageMetadata } from "astro";
import Eyebrow from "./Eyebrow.astro";
import Handwritten from "./Handwritten.astro";

interface Props {
  slides: ImageMetadata[];
  polaroid: ImageMetadata;
  eyebrow: string;
  welcomeHandwritten: string;
  heading: string;
  taglineStable?: string;
  taglineRotators?: string[];
  sub: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  polaroidCaption: string;
  hotelName: string;
}
const {
  slides,
  polaroid,
  eyebrow,
  welcomeHandwritten,
  heading,
  taglineStable,
  taglineRotators,
  sub,
  ctaPrimary,
  ctaSecondary,
  polaroidCaption,
  hotelName,
} = Astro.props;

const useRotator = !!(taglineStable && taglineRotators && taglineRotators.length >= 2);
---
<section class="relative isolate min-h-[88vh] flex items-end overflow-hidden" data-hero>
  <!-- Slideshow track: each slide is a stacked absolute layer with the sunset filter. -->
  <div class="absolute inset-0" aria-hidden="true">
    {slides.map((slide, i) => (
      <div
        class="absolute inset-0 hero-slide"
        data-slide-index={i}
        data-active={i === 0 ? "true" : "false"}
      >
        <Image
          src={slide}
          alt=""
          width={2400}
          quality={82}
          loading={i === 0 ? "eager" : "lazy"}
          fetchpriority={i === 0 ? "high" : undefined}
          class="absolute inset-0 w-full h-full object-cover sunset-photo hero-img"
        />
        <div class="sunset-overlay"></div>
        <div class="sunset-vignette"></div>
      </div>
    ))}
  </div>

  <!-- Top + bottom gradient masks for legibility. -->
  <div class="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/55 to-transparent pointer-events-none" aria-hidden="true"></div>
  <div class="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/65 via-black/25 to-transparent pointer-events-none" aria-hidden="true"></div>

  <!-- Polaroid (lg+ only). One-time wobble on enter via .polaroid-wobble. -->
  <figure class="absolute bottom-12 right-12 hidden lg:block reveal polaroid-wobble" style="transform: rotate(-3deg);">
    <div class="bg-[color:var(--color-cream-elevated)] p-3 pb-12 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)] w-56 relative">
      <Image src={polaroid} alt="" width={420} class="w-full aspect-square object-cover" />
      <figcaption class="absolute bottom-3 left-0 right-0 text-center handwritten text-[color:var(--color-ink)] text-lg">
        {polaroidCaption}
      </figcaption>
    </div>
  </figure>

  <!-- Copy + CTAs. -->
  <div class="relative max-w-[1180px] mx-auto px-5 md:px-10 pb-20 md:pb-28 text-[color:var(--color-cream)]">
    <Eyebrow class="!text-[color:var(--color-cream)]/80">{eyebrow}</Eyebrow>
    <Handwritten as="p" color="terracotta" class="!text-[color:var(--color-cream)] mt-3 text-3xl md:text-4xl">
      {welcomeHandwritten}
    </Handwritten>
    <h1 class="font-serif text-6xl md:text-8xl mt-1 leading-none">{heading}</h1>

    {useRotator ? (
      <p class="mt-5 max-w-2xl text-lg md:text-xl text-[color:var(--color-cream)]/90" aria-live="polite">
        <span>{taglineStable}{" "}</span>
        <span class="hero-rotator inline-block min-w-[12ch]" data-rotators={JSON.stringify(taglineRotators)}>
          <span class="handwritten text-[color:var(--color-cream)]/95 text-[1.2em]">{taglineRotators![0]}</span>
        </span>
      </p>
    ) : (
      <p class="mt-5 max-w-2xl text-lg md:text-xl text-[color:var(--color-cream)]/90">{sub}</p>
    )}

    <div class="mt-8 flex flex-wrap gap-3">
      <a
        href={ctaPrimary.href}
        target="_blank"
        rel="noopener"
        class="inline-flex items-center px-6 py-3 bg-[color:var(--color-terracotta)] hover:bg-[color:var(--color-terracotta-hover)] text-[color:var(--color-cream)] font-medium tracking-wide rounded-md transition tappable"
      >{ctaPrimary.label}</a>
      <a
        href={ctaSecondary.href}
        target="_blank"
        rel="noopener"
        class="inline-flex items-center px-6 py-3 border border-[color:var(--color-cream)]/80 hover:bg-[color:var(--color-cream)]/10 text-[color:var(--color-cream)] font-medium tracking-wide rounded-md transition tappable"
      >{ctaSecondary.label}</a>
    </div>
  </div>
</section>

<style>
  .hero-slide {
    opacity: 0;
    transition: opacity 0.8s ease-in-out;
    will-change: opacity;
  }
  .hero-slide[data-active="true"] {
    opacity: 1;
  }
  .hero-slide .hero-img {
    transform: scale(1.0);
    transition: transform 6.5s linear;
    transform-origin: center center;
    will-change: transform;
  }
  .hero-slide[data-active="true"] .hero-img {
    transform: scale(1.06) translate3d(0.5%, -0.5%, 0);
  }
  .hero-rotator > span {
    display: inline-block;
    transition: opacity 0.4s ease, transform 0.4s ease;
  }
  .hero-rotator.fading > span {
    opacity: 0;
    transform: translateY(-4px);
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-slide { transition: none; opacity: 1; }
    .hero-slide:not([data-active="true"]) { opacity: 0; }
    .hero-slide .hero-img { transition: none; transform: none; }
    .hero-rotator > span { transition: none; }
  }
</style>

<script is:inline>
  // Hero slideshow + tagline rotator. Zero-bundle: pure inline.
  document.addEventListener("DOMContentLoaded", () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hero = document.querySelector("[data-hero]");
    if (!hero) return;

    // 1) Slideshow crossfade with Ken Burns
    const slides = hero.querySelectorAll(".hero-slide");
    if (!reduced && slides.length > 1) {
      let current = 0;
      setInterval(() => {
        slides[current].setAttribute("data-active", "false");
        current = (current + 1) % slides.length;
        slides[current].setAttribute("data-active", "true");
      }, 6500);
    }

    // 2) Tagline rotator
    const rotator = hero.querySelector(".hero-rotator");
    if (!reduced && rotator) {
      let phrases = [];
      try { phrases = JSON.parse(rotator.getAttribute("data-rotators") || "[]"); } catch (e) {}
      if (Array.isArray(phrases) && phrases.length >= 2) {
        let idx = 0;
        const inner = rotator.querySelector("span");
        setInterval(() => {
          rotator.classList.add("fading");
          setTimeout(() => {
            idx = (idx + 1) % phrases.length;
            if (inner) inner.textContent = phrases[idx];
            rotator.classList.remove("fading");
          }, 400);
        }, 4000);
      }
    }
  });
</script>
```

- [ ] **Step 4: Build verify**

```bash
npm run build
```

Expected: success.

- [ ] **Step 5: Visual verify**

```bash
npm run dev
```

Open `http://localhost:4321/`:
- 5 hero photos crossfade every ~6.5s.
- Each active photo slowly zooms (scale 1.0 → 1.06).
- All 5 photos look warm/sunset (not bright midday) — sunset filter visible.
- Tagline rotates: "A family hotel by the sea" → "A family hotel since 1998" → "A family hotel with love" → "A family hotel 100 m from the water". 4s per phrase.
- The rotating ending word(s) render in handwritten Caveat font.
- Polaroid (lg+ screens) wobbles once on first scroll-into-view (still works — Task 14 finalizes the keyframe; for now the existing `.reveal` baseline runs).
- macOS: System Settings → Accessibility → Display → "Reduce motion" → reload — slideshow stops, no rotation, first photo + first tagline static.

Open `http://localhost:4321/al/`, `/it/`, `/de/`:
- Hero falls back to `sub` paragraph (no rotator, since AL/IT/DE don't have rotator data yet). Photos still crossfade.

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero.astro src/views/HomeView.astro
git commit -m "feat(hero): slow cinema 5-photo crossfade + tagline rotator + sunset filter

- Hero takes a slides[] array (5 photos from main/) instead of single cover
- Each slide crossfades 6.5s with Ken Burns zoom (scale 1.0 → 1.06 + drift)
- Sunset filter (.sunset-photo + .sunset-overlay + .sunset-vignette) on hero only
- Tagline structure: stable prefix 'A family hotel' + 4 rotating endings,
  4s per phrase, 400ms crossfade. Falls back to sub when rotators missing
  (AL/IT/DE locales until translation step adds them).
- Polaroid retains existing reveal + keyframe wobble (Task 14 finalizes).
- All motion respects prefers-reduced-motion: reduce.
- Inline-only JS, zero-bundle pattern preserved."
```

---

## Task 7: Header redesign + flag pills + mobile slide-down sheet

**Goal:** Rewrite `Header.astro` with a sticky Book button always visible, flag pills replacing text-label language switcher, and a full-width slide-down mobile sheet. Rewrite `LangSwitch.astro` to render flag pills using the SVGs from Task 2.

**Files:**
- Modify: `src/components/Header.astro` (rewrite)
- Modify: `src/components/LangSwitch.astro` (rewrite)

- [ ] **Step 1: Rewrite `LangSwitch.astro` end-to-end**

Replace `src/components/LangSwitch.astro` (lines 1–43) with:

```astro
---
import { LOCALES, LOCALE_LABELS, stripLocalePrefix, localizedPath, type Lang } from "../i18n/locales";

interface Props {
  lang: Lang;
  variant?: "inline" | "stacked";
}
const { lang, variant = "inline" } = Astro.props;

const path = stripLocalePrefix(Astro.url.pathname.replace(/\/+$/, "") || "/");
---
{variant === "inline" ? (
  <nav class="flex items-center gap-1.5" aria-label="Language">
    {LOCALES.map((l) => {
      const active = l === lang;
      return (
        <a
          href={localizedPath(l, path)}
          class={`flag-pill ${active ? "is-active" : ""}`}
          aria-current={active ? "true" : undefined}
          aria-label={LOCALE_LABELS[l]}
        >
          <img src={`/flags/${l}.svg`} alt="" width="28" height="20" loading="lazy" />
        </a>
      );
    })}
  </nav>
) : (
  <nav class="flex flex-wrap items-center justify-center gap-3" aria-label="Language">
    {LOCALES.map((l) => {
      const active = l === lang;
      return (
        <a
          href={localizedPath(l, path)}
          class={`flag-pill flag-pill-stacked ${active ? "is-active" : ""}`}
          aria-current={active ? "true" : undefined}
          aria-label={LOCALE_LABELS[l]}
        >
          <img src={`/flags/${l}.svg`} alt="" width="32" height="24" loading="lazy" />
          <span class="ml-2 text-[12px] tracking-[0.18em] uppercase">{LOCALE_LABELS[l]}</span>
        </a>
      );
    })}
  </nav>
)}

<style>
  .flag-pill {
    display: inline-flex;
    align-items: center;
    padding: 2px;
    border: 1.5px solid transparent;
    border-radius: 4px;
    opacity: 0.55;
    transition: opacity 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
  }
  .flag-pill img { display: block; }
  .flag-pill:hover, .flag-pill:focus-visible {
    opacity: 1;
    transform: translateY(-2px);
  }
  .flag-pill.is-active {
    opacity: 1;
    border-color: var(--color-terracotta);
  }
  .flag-pill-stacked {
    padding: 6px 12px;
    border: 1px solid var(--color-divider);
    border-radius: 999px;
  }
  .flag-pill-stacked.is-active {
    border-color: var(--color-terracotta);
    color: var(--color-terracotta);
  }
</style>
```

- [ ] **Step 2: Rewrite `Header.astro` end-to-end**

Replace `src/components/Header.astro` (lines 1–91) with:

```astro
---
import LangSwitch from "./LangSwitch.astro";
import { localizedPath, type Lang } from "../i18n/locales";
import { SITE } from "../config/site";

interface Props {
  lang: Lang;
  ui: { home: string; rooms: string; contact: string };
  isHome?: boolean;
  hotelName: string;
  bookLabel: string;
}
const { lang, ui, isHome = false, hotelName, bookLabel } = Astro.props;

const path = (Astro.url.pathname.replace(/\/+$/, "") || "/");
const links = [
  { href: localizedPath(lang, "/"),        label: ui.home,    activePaths: ["/", `/${lang}`, `/${lang}/`] },
  { href: localizedPath(lang, "/rooms"),   label: ui.rooms,   activePaths: ["/rooms", `/${lang}/rooms`] },
  { href: localizedPath(lang, "/contact"), label: ui.contact, activePaths: ["/contact", `/${lang}/contact`] },
];
---
<header
  id="siteHeader"
  data-transparent={isHome ? "true" : "false"}
  class="fixed top-0 inset-x-0 z-40 h-16 md:h-20 transition-colors duration-300"
>
  <div class="max-w-[1280px] mx-auto h-full px-5 md:px-10 flex items-center justify-between gap-4">
    <a href={localizedPath(lang, "/")} class="flex items-center gap-2 group shrink-0" aria-label={hotelName}>
      <svg width="22" height="28" viewBox="0 0 200 260" class="text-[color:var(--color-terracotta)]" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M100 250 C 102 180 100 100 100 70" />
        <path d="M100 70 C 50 50 30 30 20 10 M100 70 C 60 80 30 100 20 130" />
        <path d="M100 70 C 150 50 170 30 180 10 M100 70 C 140 80 170 100 180 130" />
        <path d="M100 70 C 100 30 95 10 90 0 M100 70 C 105 30 115 15 130 5" />
      </svg>
      <span class="font-serif text-[18px] md:text-[20px] tracking-[0.22em] font-medium">VILA EMES</span>
    </a>

    <nav class="hidden md:flex items-center gap-7 text-[13px] tracking-[0.18em] uppercase font-medium" aria-label="Primary">
      {links.map((l) => {
        const active = l.activePaths.some((p) => path === p);
        return (
          <a
            href={l.href}
            class={`transition ${active ? "text-[color:var(--color-terracotta)]" : "hover:text-[color:var(--color-terracotta)]"}`}
            aria-current={active ? "page" : undefined}
          >{l.label}</a>
        );
      })}
    </nav>

    <div class="hidden md:flex items-center gap-4">
      <LangSwitch lang={lang} />
      <a
        href={SITE.links.booking_com}
        target="_blank"
        rel="noopener"
        class="inline-flex items-center px-4 py-2 bg-[color:var(--color-terracotta)] hover:bg-[color:var(--color-terracotta-hover)] text-[color:var(--color-cream)] text-[12px] tracking-[0.2em] uppercase font-medium rounded transition tappable"
      >{bookLabel}</a>
    </div>

    <div class="md:hidden flex items-center gap-2">
      <a
        href={SITE.links.booking_com}
        target="_blank"
        rel="noopener"
        class="inline-flex items-center px-3 py-1.5 bg-[color:var(--color-terracotta)] hover:bg-[color:var(--color-terracotta-hover)] text-[color:var(--color-cream)] text-[11px] tracking-[0.18em] uppercase font-medium rounded tappable"
      >{bookLabel}</a>
      <button
        type="button"
        id="mobileNavToggle"
        class="p-2 -mr-2"
        aria-label="Toggle navigation"
        aria-expanded="false"
        aria-controls="mobileNav"
      >
        <span class="block w-6 h-px bg-current"></span>
        <span class="block w-6 h-px bg-current mt-1.5"></span>
        <span class="block w-6 h-px bg-current mt-1.5"></span>
      </button>
    </div>
  </div>

  <div
    id="mobileNav"
    hidden
    class="md:hidden fixed inset-x-0 top-16 bg-[color:var(--color-cream-elevated)] border-b border-[color:var(--color-divider)] py-6 px-5 space-y-5 max-h-[calc(100vh-4rem)] overflow-y-auto"
  >
    <nav class="space-y-3" aria-label="Primary mobile">
      {links.map((l) => (
        <a href={l.href} class="block text-lg tracking-[0.12em] uppercase font-medium">{l.label}</a>
      ))}
    </nav>
    <div class="pt-4 border-t border-[color:var(--color-divider)]">
      <LangSwitch lang={lang} variant="stacked" />
    </div>
    <div class="pt-4 border-t border-[color:var(--color-divider)] flex gap-3">
      <a
        href={`https://wa.me/${SITE.contact.whatsapp.replace(/[^0-9]/g, "")}`}
        class="flex-1 inline-flex items-center justify-center px-4 py-2 border border-[color:var(--color-divider)] rounded text-[12px] tracking-[0.18em] uppercase tappable"
      >WhatsApp</a>
      <a
        href={`tel:${SITE.contact.phone.replace(/\s+/g, "")}`}
        class="flex-1 inline-flex items-center justify-center px-4 py-2 border border-[color:var(--color-divider)] rounded text-[12px] tracking-[0.18em] uppercase tappable"
      >Call</a>
    </div>
  </div>
</header>

<style>
  #siteHeader[data-transparent="true"]:not(.is-solid) {
    color: var(--color-cream);
    background: transparent;
  }
  #siteHeader.is-solid {
    color: var(--color-ink);
    background-color: color-mix(in oklab, var(--color-cream-elevated) 95%, transparent);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--color-divider);
  }
</style>
```

- [ ] **Step 3: Update each `<Header />` consumer to pass `bookLabel`**

The Header now requires a `bookLabel` prop. Update all 3 view files. Pass the literal string `"Book"` for now — Task 11 introduces the `ui.buttons.book_short` schema field and replaces these literals.

In `src/views/HomeView.astro:84`:

```astro
<Header lang={lang} ui={ui.nav} isHome hotelName={site.data.hotel.name} bookLabel="Book" />
```

In `src/views/RoomsView.astro:55`:

```astro
<Header lang={lang} ui={ui.nav} hotelName={site.data.hotel.name} bookLabel="Book" />
```

In `src/views/ContactView.astro:34`:

```astro
<Header lang={lang} ui={ui.nav} hotelName={site.data.hotel.name} bookLabel="Book" />
```

Hardcoded literal avoids TypeScript error: `ui.buttons.book_short` is not in the Zod schema yet, so accessing it would be a compile-time failure. Task 11 adds the schema field, then replaces these literals with `ui.buttons.book_short ?? "Book"`.

- [ ] **Step 4: Build verify**

```bash
npm run build
```

Expected: success on all 4 locales.

```bash
grep -c "flag-pill" dist/index.html
```

Expected: at least 4 (one for each locale).

```bash
grep -c '/flags/al.svg' dist/index.html
```

Expected: at least 1.

- [ ] **Step 5: Visual verify**

```bash
npm run dev
```

- `http://localhost:4321/` (home, transparent header over hero):
  - Logo top-left, nav middle, flag pills + BOOK button right.
  - Active flag has terracotta border.
  - Click flag for AL → `/al/`, page swaps to Albanian content.
  - Scroll down past hero → header turns solid + blurred. BOOK button still terracotta.
- `http://localhost:4321/rooms` (solid header from start):
  - Header is solid + cream background, BOOK still terracotta primary.
- Mobile (resize browser <768px):
  - Logo + BOOK button + hamburger only (no nav, no flag pills inline).
  - Tap hamburger → slide-down sheet with: nav links + stacked flag pills + WhatsApp + Call buttons.
  - Tap any nav link → sheet closes (existing toggle script handles re-toggle to hide).

- [ ] **Step 6: Commit**

```bash
git add src/components/Header.astro src/components/LangSwitch.astro src/views/HomeView.astro src/views/RoomsView.astro src/views/ContactView.astro
git commit -m "feat(header): sticky Book button + flag pills + mobile slide-down sheet

- Header always renders BOOK terracotta primary on desktop + mobile
- LangSwitch swaps text labels for 4:3 flag SVGs from /public/flags/
  Active flag: full opacity + 1.5px terracotta border. Inactive: 0.55 opacity.
- Mobile sheet: nav + stacked flag pills + WhatsApp + Call shortcuts
- Sticky transparent→solid behavior preserved (data-transparent + .is-solid)
- bookLabel prop accepts ui.buttons.book_short, falls back to 'Book' until
  Task 11 adds the schema field"
```

---

## Task 8: Footer redesign — 3-col + made with ❤️

**Goal:** Replace the centered single-column footer with a 3-column layout (Brand · Visit · Stay in touch) and a bottom bar showing the handwritten signature on the left and `© 2026 · made with ❤️` on the right.

**Files:**
- Modify: `src/components/Footer.astro` (rewrite)
- Modify: `src/content/site/en.yaml` (footer copy: handwritten + made_with strings)
- Modify: `src/content.config.ts` (add `made_with` field if needed — see Step 1)

- [ ] **Step 1: Decide footer text strategy**

Two existing fields: `ui.footer.handwritten`, `ui.footer.copyright`. Plan keeps both as-is (no schema change) and adds the `made with ❤️` inline within `copyright`. So:

- `handwritten`: `"with love, the Emes family"` (left column / center bottom)
- `copyright`: `"© 2026 Vila Emes · made with ❤️"` (right column / bottom)

Schema change: **none**. The existing strings keep their types.

- [ ] **Step 2: Update `en.yaml` footer copy**

In `src/content/site/en.yaml` lines 187–189, replace:

```yaml
  footer:
    handwritten: "made with care by the Emes family"
    copyright: "© 2026 Vila Emes · Plazh, Durrës"
```

with:

```yaml
  footer:
    handwritten: "with love, the Emes family"
    copyright: "© 2026 Vila Emes · made with ❤️"
```

- [ ] **Step 3: Rewrite `Footer.astro` end-to-end**

Replace `src/components/Footer.astro` (lines 1–27) with:

```astro
---
import { Image } from "astro:assets";
import LangSwitch from "./LangSwitch.astro";
import logoPng from "../assets/logo/vila-emes-1024.png";
import { localizedPath, type Lang } from "../i18n/locales";
import { SITE } from "../config/site";

interface Props {
  lang: Lang;
  handwritten: string;
  copyright: string;
  ui: {
    nav: { home: string; rooms: string; contact: string };
    buttons: { book: string; map: string };
    footer_columns?: { visit: string; stay_in_touch: string };
  };
  brandTagline: string;
}
const { lang, handwritten, copyright, ui, brandTagline } = Astro.props;

const visitTitle = ui.footer_columns?.visit ?? "Visit";
const stayTitle = ui.footer_columns?.stay_in_touch ?? "Stay in touch";
---
<footer class="bg-[color:var(--color-cream-elevated)] border-t border-[color:var(--color-divider)]">
  <div class="max-w-[1280px] mx-auto px-5 md:px-10 py-14 md:py-20">
    <div class="grid md:grid-cols-3 gap-10 md:gap-12">
      <!-- Brand column -->
      <div class="text-center md:text-left">
        <Image src={logoPng} alt="Vila Emes" width={120} height={120} class="opacity-90 mx-auto md:mx-0" />
        <p class="mt-4 text-sm text-[color:var(--color-ink)]/75 max-w-xs mx-auto md:mx-0">{brandTagline}</p>
        <address class="mt-3 not-italic text-sm text-[color:var(--color-muted)] space-y-0.5">
          {SITE.contact.address.map((line) => <p>{line}</p>)}
        </address>
      </div>

      <!-- Visit column -->
      <nav class="text-center md:text-left" aria-label={visitTitle}>
        <p class="eyebrow mb-4">{visitTitle}</p>
        <ul class="space-y-2 text-sm">
          <li><a href={localizedPath(lang, "/")} class="hover:text-[color:var(--color-terracotta)] transition">{ui.nav.home}</a></li>
          <li><a href={localizedPath(lang, "/rooms")} class="hover:text-[color:var(--color-terracotta)] transition">{ui.nav.rooms}</a></li>
          <li><a href={localizedPath(lang, "/contact")} class="hover:text-[color:var(--color-terracotta)] transition">{ui.nav.contact}</a></li>
          <li><a href={SITE.links.booking_com} target="_blank" rel="noopener" class="hover:text-[color:var(--color-terracotta)] transition">{ui.buttons.book}</a></li>
          <li><a href={SITE.links.google_maps} target="_blank" rel="noopener" class="hover:text-[color:var(--color-terracotta)] transition">{ui.buttons.map}</a></li>
        </ul>
      </nav>

      <!-- Stay in touch column -->
      <div class="text-center md:text-left">
        <p class="eyebrow mb-4">{stayTitle}</p>
        <ul class="space-y-2 text-sm">
          <li><a href={`tel:${SITE.contact.phone.replace(/\s+/g, "")}`} class="hover:text-[color:var(--color-terracotta)] transition">{SITE.contact.phone}</a></li>
          <li><a href={`mailto:${SITE.contact.email}`} class="hover:text-[color:var(--color-terracotta)] transition">{SITE.contact.email}</a></li>
          <li><a href={`https://wa.me/${SITE.contact.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener" class="hover:text-[color:var(--color-terracotta)] transition">WhatsApp</a></li>
          <li><a href={SITE.links.instagram} target="_blank" rel="noopener" class="hover:text-[color:var(--color-terracotta)] transition">Instagram</a></li>
        </ul>
        <div class="mt-6 flex justify-center md:justify-start">
          <LangSwitch lang={lang} variant="stacked" />
        </div>
      </div>
    </div>

    <hr class="mt-12 border-[color:var(--color-divider)]" />

    <div class="mt-6 flex flex-col md:flex-row items-center md:justify-between gap-3">
      <p class="handwritten text-xl text-[color:var(--color-terracotta)]">— {handwritten} —</p>
      <p class="text-xs text-[color:var(--color-muted)] tracking-wide">{copyright}</p>
    </div>
  </div>
</footer>
```

- [ ] **Step 4: Update each `<Footer />` consumer to pass `ui` and `brandTagline`**

In `src/views/HomeView.astro:187`:

```astro
<Footer lang={lang} handwritten={ui.footer.handwritten} copyright={ui.footer.copyright} ui={ui} brandTagline={site.data.hotel.tagline} />
```

In `src/views/RoomsView.astro:117`:

```astro
<Footer lang={lang} handwritten={ui.footer.handwritten} copyright={ui.footer.copyright} ui={ui} brandTagline={site.data.hotel.tagline} />
```

In `src/views/ContactView.astro:94`:

```astro
<Footer lang={lang} handwritten={ui.footer.handwritten} copyright={ui.footer.copyright} ui={ui} brandTagline={site.data.hotel.tagline} />
```

- [ ] **Step 5: Build verify**

```bash
npm run build
```

Expected: success.

```bash
grep -c "made with ❤️" dist/index.html
```

Expected: at least 1.

```bash
grep -c "with love, the Emes family" dist/index.html
```

Expected: at least 1.

- [ ] **Step 6: Visual verify**

```bash
npm run dev
```

Open `http://localhost:4321/`, scroll to footer:
- 3 columns desktop: logo + tagline + address (left), Visit links (center), Stay-in-touch + lang switcher (right).
- Bottom bar: "— with love, the Emes family —" left, "© 2026 Vila Emes · made with ❤️" right.
- Mobile (<768px): all sections stacked single-column, centered.
- AL/IT/DE locales: still show the EN footer text (translation step adds locale variants — schema doesn't require the new strings yet).

- [ ] **Step 7: Commit**

```bash
git add src/components/Footer.astro src/content/site/en.yaml src/views/HomeView.astro src/views/RoomsView.astro src/views/ContactView.astro
git commit -m "feat(footer): 3-column layout + made with ❤️ bottom bar

- Brand column: logo + tagline + address
- Visit column: site nav + Book + Map
- Stay-in-touch column: phone + email + WhatsApp + Instagram + lang switcher
- Bottom bar: handwritten signature left, copyright + made with ❤️ right
- Footer text: 'made with care' → 'with love, the Emes family'
  copyright: '© 2026 Vila Emes · Plazh, Durrës' → '© 2026 Vila Emes · made with ❤️'"
```

---

## Task 9: Room carousel — slide strip with peek

**Goal:** Replace the single-photo render in `RoomDetails.astro` with a new `RoomCarousel.astro` component that renders 4–6 photos per room as a drag/swipe scroll-snap track with peek, autoplay (8s), prev/next buttons, dots, and IntersectionObserver-gated autoplay. Update `RoomsView.astro` to expand the photo map from one image per room to a list per room.

**Files:**
- Create: `src/components/RoomCarousel.astro`
- Modify: `src/components/RoomDetails.astro` (replace photo block with `<RoomCarousel />`)
- Modify: `src/views/RoomsView.astro` (expand `roomPhoto` to lists)

- [ ] **Step 1: Create `src/components/RoomCarousel.astro`**

Write `src/components/RoomCarousel.astro`:

```astro
---
import { Image } from "astro:assets";
import type { ImageMetadata } from "astro";

interface Props {
  photos: ImageMetadata[];
  alt: string;
  autoplayMs?: number;
}
const { photos, alt, autoplayMs = 8000 } = Astro.props;
const id = `rc-${Math.random().toString(36).slice(2, 8)}`;
---
<div
  class="room-carousel relative w-full"
  data-room-carousel
  data-autoplay-ms={autoplayMs}
  id={id}
>
  <div class="rc-track flex snap-x snap-mandatory overflow-x-auto gap-3 scroll-smooth no-scrollbar" tabindex="0" aria-label={alt}>
    {photos.map((p, i) => (
      <div class="rc-slide snap-center shrink-0 w-[88%] md:w-[80%]" data-slide-index={i}>
        <Image
          src={p}
          alt={i === 0 ? alt : ""}
          width={1600}
          quality={82}
          loading={i === 0 ? "eager" : "lazy"}
          class="w-full aspect-[4/3] object-cover rounded-md"
        />
      </div>
    ))}
  </div>

  {photos.length > 1 && (
    <>
      <button type="button" class="rc-btn rc-prev" aria-label="Previous photo">‹</button>
      <button type="button" class="rc-btn rc-next" aria-label="Next photo">›</button>

      <div class="rc-dots mt-4 flex justify-center gap-2" aria-hidden="true">
        {photos.map((_, i) => (
          <span class="rc-dot" data-dot-index={i} data-active={i === 0 ? "true" : "false"}></span>
        ))}
      </div>
    </>
  )}
</div>

<style>
  .no-scrollbar { scrollbar-width: none; }
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .rc-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border-radius: 999px;
    background: color-mix(in oklab, white 80%, transparent);
    color: var(--color-ink);
    font-size: 22px;
    line-height: 1;
    display: none;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transition: opacity 0.2s ease;
  }
  @media (hover: hover) {
    .rc-btn { display: flex; opacity: 0.85; }
    .room-carousel:hover .rc-btn { opacity: 1; }
  }
  .rc-prev { left: 8px; }
  .rc-next { right: 8px; }
  .rc-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: color-mix(in oklab, var(--color-cream-elevated) 60%, var(--color-ink) 20%);
    transition: background-color 0.2s ease, transform 0.2s ease;
  }
  .rc-dot[data-active="true"] {
    background: var(--color-terracotta);
    transform: scale(1.3);
  }
</style>

<script is:inline>
  document.addEventListener("DOMContentLoaded", () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.querySelectorAll("[data-room-carousel]").forEach((el) => {
      const track = el.querySelector(".rc-track");
      const slides = el.querySelectorAll(".rc-slide");
      const dots = el.querySelectorAll(".rc-dot");
      const prevBtn = el.querySelector(".rc-prev");
      const nextBtn = el.querySelector(".rc-next");
      if (!track || slides.length < 2) return;

      const total = slides.length;
      let current = 0;
      let autoplay;

      const goTo = (i) => {
        current = ((i % total) + total) % total;
        const targetSlide = slides[current];
        track.scrollTo({ left: targetSlide.offsetLeft - track.offsetLeft, behavior: "smooth" });
        dots.forEach((d, j) => d.setAttribute("data-active", j === current ? "true" : "false"));
      };

      prevBtn?.addEventListener("click", () => { stopAutoplay(); goTo(current - 1); });
      nextBtn?.addEventListener("click", () => { stopAutoplay(); goTo(current + 1); });

      // Sync dots when user scrolls manually (drag/swipe).
      let scrollTimer;
      track.addEventListener("scroll", () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          let closestIdx = 0;
          let closestDist = Infinity;
          slides.forEach((s, j) => {
            const d = Math.abs(s.offsetLeft - track.scrollLeft - track.offsetLeft);
            if (d < closestDist) { closestDist = d; closestIdx = j; }
          });
          current = closestIdx;
          dots.forEach((d, j) => d.setAttribute("data-active", j === current ? "true" : "false"));
        }, 100);
      });

      // Autoplay (gated to in-view + not reduced-motion + not hovered/focused)
      const startAutoplay = () => {
        if (reduced || autoplay) return;
        const ms = parseInt(el.dataset.autoplayMs || "8000", 10);
        autoplay = setInterval(() => goTo(current + 1), ms);
      };
      const stopAutoplay = () => {
        if (autoplay) { clearInterval(autoplay); autoplay = null; }
      };

      el.addEventListener("pointerenter", stopAutoplay);
      el.addEventListener("focusin", stopAutoplay);
      el.addEventListener("pointerleave", () => {
        if (entryObserver && entryObserver.lastEntry?.isIntersecting) startAutoplay();
      });
      el.addEventListener("focusout", () => {
        if (entryObserver && entryObserver.lastEntry?.isIntersecting) startAutoplay();
      });

      // Only autoplay when in viewport
      const entryObserver = ("IntersectionObserver" in window) ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            entryObserver.lastEntry = entry;
            if (entry.isIntersecting) startAutoplay();
            else stopAutoplay();
          });
        },
        { threshold: 0.4 }
      ) : null;
      if (entryObserver) entryObserver.observe(el);
      else startAutoplay();
    });
  });
</script>
```

- [ ] **Step 2: Update `RoomDetails.astro` to use the carousel**

In `src/components/RoomDetails.astro`, replace the photo block (lines 38–48):

```astro
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
```

with:

```astro
  <div class={`md:col-span-7 ${flip ? "md:order-2" : ""}`}>
    {photos.length > 0 && (
      <RoomCarousel photos={photos} alt={name} />
    )}
  </div>
```

Also add the import at the top of `RoomDetails.astro` (after line 5):

```astro
import RoomCarousel from "./RoomCarousel.astro";
```

The unused `Image` import on line 2 can stay (still used by `Amenity` paths or harmless unused-import). Astro tolerates unused imports.

- [ ] **Step 3: Expand `roomPhoto` in `RoomsView.astro` to a list per room**

In `src/views/RoomsView.astro`, replace the imports block (lines 16–26) with the full set of per-room photos:

```ts
// Apartments — 5 photos each
import imgApt1Bed1 from "../assets/photos/apt-1bed-terrace/dsc-0434-1600.webp";
import imgApt1Bed2 from "../assets/photos/apt-1bed-terrace/dsc-0435-1600.webp";
import imgApt1Bed3 from "../assets/photos/apt-1bed-terrace/dsc-0440-1600.webp";
import imgApt1Bed4 from "../assets/photos/apt-1bed-terrace/dsc-0444-1600.webp";
import imgApt1Bed5 from "../assets/photos/apt-1bed-terrace/dsc-0447-1600.webp";

import imgApt2Bed1 from "../assets/photos/apt-2bed/dsc-0457-1600.webp";
import imgApt2Bed2 from "../assets/photos/apt-2bed/dsc-0461-1600.webp";
import imgApt2Bed3 from "../assets/photos/apt-2bed/dsc-0465-1600.webp";
import imgApt2Bed4 from "../assets/photos/apt-2bed/dsc-0470-1600.webp";
import imgApt2Bed5 from "../assets/photos/apt-2bed/dsc-0479-1600.webp";

// Deluxe (3 rooms split from deluxe-rooms/)
import imgDeluxeKing1 from "../assets/photos/deluxe-rooms/dsc-0327-1600.webp";
import imgDeluxeKing2 from "../assets/photos/deluxe-rooms/dsc-0333-1600.webp";
import imgDeluxeKing3 from "../assets/photos/deluxe-rooms/dsc-0334-1600.webp";
import imgDeluxeKing4 from "../assets/photos/deluxe-rooms/dsc-0337-1600.webp";

import imgDeluxeQueen1 from "../assets/photos/deluxe-rooms/dsc-0329-1600.webp";
import imgDeluxeQueen2 from "../assets/photos/deluxe-rooms/dsc-0335-1600.webp";
import imgDeluxeQueen3 from "../assets/photos/deluxe-rooms/dsc-0336-1600.webp";
import imgDeluxeQueen4 from "../assets/photos/deluxe-rooms/dsc-0345-1600.webp";

import imgDeluxeBalc1 from "../assets/photos/deluxe-rooms/dsc-0330-1600.webp";
import imgDeluxeBalc2 from "../assets/photos/deluxe-rooms/dsc-0340-1600.webp";
import imgDeluxeBalc3 from "../assets/photos/deluxe-rooms/dsc-0342-1600.webp";
import imgDeluxeBalc4 from "../assets/photos/deluxe-rooms/dsc-0346-1600.webp";

// Family + Standard (split from standard-rooms/)
import imgQuadSea1   from "../assets/photos/standard-rooms/dsc-0381-1600.webp";
import imgQuadSea2   from "../assets/photos/standard-rooms/dsc-0386-1600.webp";
import imgQuadSea3   from "../assets/photos/standard-rooms/dsc-0397-1600.webp";
import imgQuadSea4   from "../assets/photos/standard-rooms/dsc-0398-1600.webp";

import imgQuadBalc1  from "../assets/photos/standard-rooms/dsc-0382-1600.webp";
import imgQuadBalc2  from "../assets/photos/standard-rooms/dsc-0389-1600.webp";
import imgQuadBalc3  from "../assets/photos/standard-rooms/dsc-0391-1600.webp";
import imgQuadBalc4  from "../assets/photos/standard-rooms/dsc-0393-1600.webp";

import imgFamilyBalc1 from "../assets/photos/standard-rooms/dsc-0384-1600.webp";
import imgFamilyBalc2 from "../assets/photos/standard-rooms/dsc-0394-1600.webp";
import imgFamilyBalc3 from "../assets/photos/standard-rooms/dsc-0399-1600.webp";
import imgFamilyBalc4 from "../assets/photos/standard-rooms/dsc-0402-1600.webp";

import imgFamilyStd1  from "../assets/photos/standard-rooms/dsc-0385-1600.webp";
import imgFamilyStd2  from "../assets/photos/standard-rooms/dsc-0405-1600.webp";
import imgFamilyStd3  from "../assets/photos/standard-rooms/dsc-0406-1600.webp";
import imgFamilyStd4  from "../assets/photos/standard-rooms/dsc-0407-1600.webp";

// Economy — unique sets (no longer dups of quad-sea / quad-balcony)
import imgEconTriple1   from "../assets/photos/standard-rooms/dsc-0411-1600.webp";
import imgEconTriple2   from "../assets/photos/standard-rooms/dsc-0412-1600.webp";
import imgEconTriple3   from "../assets/photos/standard-rooms/dsc-0413-1600.webp";
import imgEconTriple4   from "../assets/photos/standard-rooms/dsc-0414-1600.webp";

import imgBudgetTriple1 from "../assets/photos/standard-rooms/dsc-0420-1600.webp";
import imgBudgetTriple2 from "../assets/photos/standard-rooms/dsc-0421-1600.webp";
import imgBudgetTriple3 from "../assets/photos/standard-rooms/dsc-0422-1600.webp";
import imgBudgetTriple4 from "../assets/photos/standard-rooms/dsc-0425-1600.webp";
```

Then change the `roomPhoto` const (lines 38–50):

```ts
const roomPhotos: Record<string, ImageMetadata[]> = {
  "apt-1bed-terrace": [imgApt1Bed1, imgApt1Bed2, imgApt1Bed3, imgApt1Bed4, imgApt1Bed5],
  "apt-2bed":         [imgApt2Bed1, imgApt2Bed2, imgApt2Bed3, imgApt2Bed4, imgApt2Bed5],
  "deluxe-king":      [imgDeluxeKing1, imgDeluxeKing2, imgDeluxeKing3, imgDeluxeKing4],
  "deluxe-queen":     [imgDeluxeQueen1, imgDeluxeQueen2, imgDeluxeQueen3, imgDeluxeQueen4],
  "deluxe-balcony":   [imgDeluxeBalc1, imgDeluxeBalc2, imgDeluxeBalc3, imgDeluxeBalc4],
  "quad-sea":         [imgQuadSea1, imgQuadSea2, imgQuadSea3, imgQuadSea4],
  "quad-balcony":     [imgQuadBalc1, imgQuadBalc2, imgQuadBalc3, imgQuadBalc4],
  "family-balcony":   [imgFamilyBalc1, imgFamilyBalc2, imgFamilyBalc3, imgFamilyBalc4],
  "family-standard":  [imgFamilyStd1, imgFamilyStd2, imgFamilyStd3, imgFamilyStd4],
  "econ-triple":      [imgEconTriple1, imgEconTriple2, imgEconTriple3, imgEconTriple4],
  "budget-triple":    [imgBudgetTriple1, imgBudgetTriple2, imgBudgetTriple3, imgBudgetTriple4],
};
```

(Note: `econ-triple` and `budget-triple` now have unique photos — fixes the dup flagged in `docs/photos-shortlist.md`.)

Update the `<RoomDetails ... photos={...} />` call inside the `orderedRooms.map` (line 81) from:

```astro
photos={[roomPhoto[r.id]]}
```

to:

```astro
photos={roomPhotos[r.id]}
```

- [ ] **Step 4: Build verify**

```bash
npm run build
```

Expected: success.

```bash
grep -c "data-room-carousel" dist/rooms/index.html
```

Expected: `11` (one per room).

- [ ] **Step 5: Visual verify**

```bash
npm run dev
```

Open `http://localhost:4321/rooms`:
- Each of the 11 rooms shows a carousel where the previous behavior had a single photo.
- Drag/swipe horizontally → next photo snaps into place. Dots update.
- Wait 8s with cursor outside → autoplay advances. Hover/focus → pauses.
- Desktop: prev/next round buttons appear at left/right.
- Reduced-motion: autoplay disabled; manual controls still work.
- Carousel rooms not in viewport → autoplay doesn't run (CPU saver).

- [ ] **Step 6: Commit**

```bash
git add src/components/RoomCarousel.astro src/components/RoomDetails.astro src/views/RoomsView.astro
git commit -m "feat(rooms): slide-strip carousel with peek + autoplay + drag/swipe

- New RoomCarousel.astro: scroll-snap track with dots, prev/next, autoplay 8s
- IntersectionObserver gates autoplay (saves CPU when off-screen)
- Pauses on pointerenter / focus-within, resumes on leave
- prefers-reduced-motion disables autoplay; manual controls remain
- RoomDetails: replace single Image with <RoomCarousel photos={photos} />
- RoomsView: roomPhoto -> roomPhotos (Record<string, ImageMetadata[]>),
  4 photos per room (5 for apartments). Economy rooms get unique
  photos — no longer share files with quad-sea / quad-balcony."
```

---

## Task 10: Gallery refactor — horizontal scroll + lightbox upgrades

**Goal:** Refactor `Gallery.astro` from a CSS-columns masonry to a horizontal scroll-snap track. Upgrade the lightbox with swipe nav, swipe-down dismiss, photo counter, caption, auto-hide controls (2s), pinch-zoom, and a FLIP open animation from the thumbnail's bounding rect.

**Files:**
- Modify: `src/components/Gallery.astro` (rewrite)

- [ ] **Step 1: Rewrite `Gallery.astro` end-to-end**

Replace `src/components/Gallery.astro` (lines 1–103) with:

```astro
---
import { Image } from "astro:assets";
import type { ImageMetadata } from "astro";
import Eyebrow from "./Eyebrow.astro";

interface Props {
  heading: string;
  eyebrow?: string;
  intro?: string;
  photos: { src: ImageMetadata; alt: string; caption?: string }[];
}
const { heading, eyebrow, intro, photos } = Astro.props;
---
<section class="max-w-[1180px] mx-auto px-5 md:px-10 py-20 md:py-28 reveal">
  <div class="max-w-2xl">
    {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
    <h2 class="mt-3 font-serif text-4xl md:text-5xl text-[color:var(--color-ink)] leading-tight">{heading}</h2>
    {intro && <p class="mt-4 text-[color:var(--color-ink)]/80">{intro}</p>}
  </div>

  <div class="mt-10 -mx-5 md:-mx-10 px-5 md:px-10">
    <div class="gallery-track flex snap-x snap-mandatory overflow-x-auto gap-3 scroll-smooth no-scrollbar pb-2">
      {photos.map((photo, i) => (
        <figure class="snap-start shrink-0 w-[60vw] md:w-[280px]" data-gallery-index={i}>
          <button
            type="button"
            class="block w-full overflow-hidden rounded-md cursor-zoom-in tappable"
            data-lightbox-index={i}
            data-lightbox-src={photo.src.src}
            data-lightbox-caption={photo.caption ?? ""}
            data-lightbox-alt={photo.alt}
            aria-label={photo.alt}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={900}
              quality={82}
              class="w-full aspect-[4/3] object-cover photo-enter"
              loading={i < 4 ? "eager" : "lazy"}
            />
          </button>
          {photo.caption && (
            <figcaption class="handwritten text-[color:var(--color-terracotta)] text-lg mt-2 px-1">
              — {photo.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  </div>

  <div
    id="lightbox"
    class="fixed inset-0 bg-black/95 z-50 hidden items-center justify-center p-6 select-none"
    role="dialog"
    aria-modal="true"
    aria-label={heading}
  >
    <div id="lightbox-counter" class="absolute top-4 left-1/2 -translate-x-1/2 text-white/80 text-sm font-mono lightbox-control"></div>
    <button type="button" id="lightbox-close" class="absolute top-4 right-4 text-white text-3xl lightbox-control" aria-label="Close">×</button>
    <button type="button" id="lightbox-prev" class="absolute left-4 text-white text-4xl lightbox-control" aria-label="Previous">‹</button>
    <button type="button" id="lightbox-next" class="absolute right-4 text-white text-4xl lightbox-control" aria-label="Next">›</button>
    <img id="lightbox-img" src="" alt="" class="max-h-[85vh] max-w-[92vw] object-contain transition-transform duration-300" />
    <div id="lightbox-caption" class="absolute bottom-6 left-0 right-0 text-center handwritten text-[color:var(--color-cream)] text-xl px-6 lightbox-control"></div>
  </div>
</section>

<style>
  .no-scrollbar { scrollbar-width: none; }
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .lightbox-control {
    transition: opacity 0.3s ease;
  }
  #lightbox.hide-controls .lightbox-control {
    opacity: 0;
    pointer-events: none;
  }
</style>

<script is:inline>
  document.addEventListener("DOMContentLoaded", () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const photos = Array.from(document.querySelectorAll("[data-lightbox-index]")).map((btn) => ({
      src: btn.getAttribute("data-lightbox-src") || "",
      caption: btn.getAttribute("data-lightbox-caption") || "",
      alt: btn.getAttribute("data-lightbox-alt") || "",
      thumb: btn,
    }));
    const box = document.getElementById("lightbox");
    const imgEl = document.getElementById("lightbox-img");
    const captionEl = document.getElementById("lightbox-caption");
    const counterEl = document.getElementById("lightbox-counter");
    const close = document.getElementById("lightbox-close");
    const prev = document.getElementById("lightbox-prev");
    const next = document.getElementById("lightbox-next");
    let current = 0;
    let hideTimer;
    let scale = 1;
    let touchStart = null;

    if (!box || !imgEl || photos.length === 0) return;

    const resetZoom = () => { scale = 1; imgEl.style.transform = "translate3d(0,0,0) scale(1)"; };

    const updateCounter = () => {
      if (counterEl) counterEl.textContent = `${current + 1} / ${photos.length}`;
    };

    const updateCaption = () => {
      if (captionEl) {
        captionEl.textContent = photos[current].caption ? `— ${photos[current].caption}` : "";
      }
    };

    const armAutoHide = () => {
      box.classList.remove("hide-controls");
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => box.classList.add("hide-controls"), 2000);
    };

    const show = (i, originRect) => {
      current = ((i % photos.length) + photos.length) % photos.length;
      imgEl.src = photos[current].src;
      imgEl.alt = photos[current].alt;
      updateCounter();
      updateCaption();
      resetZoom();
      box.classList.remove("hidden");
      box.classList.add("flex");
      document.body.style.overflow = "hidden";
      armAutoHide();

      // FLIP from thumbnail rect
      if (!reduced && originRect && imgEl.getBoundingClientRect) {
        requestAnimationFrame(() => {
          const finalRect = imgEl.getBoundingClientRect();
          const dx = originRect.left - finalRect.left;
          const dy = originRect.top - finalRect.top;
          const sx = originRect.width / finalRect.width;
          const sy = originRect.height / finalRect.height;
          imgEl.style.transition = "none";
          imgEl.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${(sx+sy)/2})`;
          requestAnimationFrame(() => {
            imgEl.style.transition = "transform 0.4s ease";
            imgEl.style.transform = "translate3d(0,0,0) scale(1)";
          });
        });
      }
    };

    const hide = () => {
      box.classList.add("hidden");
      box.classList.remove("flex");
      document.body.style.overflow = "";
      clearTimeout(hideTimer);
    };

    photos.forEach((p) => {
      p.thumb.addEventListener("click", () => {
        const rect = p.thumb.getBoundingClientRect();
        show(Number(p.thumb.dataset.lightboxIndex), rect);
      });
    });

    close.addEventListener("click", hide);
    prev.addEventListener("click", () => { armAutoHide(); show(current - 1); });
    next.addEventListener("click", () => { armAutoHide(); show(current + 1); });

    box.addEventListener("click", (e) => {
      if (e.target === box || e.target === imgEl) {
        // Tap on backdrop or image: arm auto-hide cycle (image tap = wake controls)
        armAutoHide();
      }
    });
    box.addEventListener("pointermove", armAutoHide);

    document.addEventListener("keydown", (e) => {
      if (box.classList.contains("hidden")) return;
      if (e.key === "Escape") hide();
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });

    // Swipe nav (left/right) + swipe-down dismiss
    box.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
      }
    }, { passive: true });

    box.addEventListener("touchend", (e) => {
      if (!touchStart) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStart.x;
      const dy = t.clientY - touchStart.y;
      const dt = Date.now() - touchStart.t;
      const fast = dt < 400;
      if (Math.abs(dx) > 60 && fast && Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) show(current - 1);
        else show(current + 1);
        armAutoHide();
      } else if (dy > 90 && fast) {
        hide();
      }
      touchStart = null;
    });

    // Pinch-zoom (two-finger) — basic scale only
    let pinchStartDist = 0;
    let pinchStartScale = 1;
    box.addEventListener("touchstart", (e) => {
      if (e.touches.length === 2) {
        const [a, b] = e.touches;
        pinchStartDist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        pinchStartScale = scale;
      }
    }, { passive: true });
    box.addEventListener("touchmove", (e) => {
      if (e.touches.length === 2 && pinchStartDist > 0) {
        const [a, b] = e.touches;
        const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        scale = Math.max(1, Math.min(4, pinchStartScale * (dist / pinchStartDist)));
        imgEl.style.transition = "none";
        imgEl.style.transform = `translate3d(0,0,0) scale(${scale})`;
      }
    }, { passive: true });
    box.addEventListener("touchend", (e) => {
      if (e.touches.length === 0) pinchStartDist = 0;
    });
  });
</script>
```

- [ ] **Step 2: Build verify**

```bash
npm run build
```

Expected: success.

```bash
grep -c "data-lightbox-index" dist/index.html
```

Expected: `12` (gallery has 12 photos).

```bash
grep -c "gallery-track" dist/index.html
```

Expected: `1`.

- [ ] **Step 3: Visual verify**

```bash
npm run dev
```

Open `http://localhost:4321/`, scroll to gallery:
- Mobile width: photos in a horizontal scroll track. Swipe left/right to browse.
- Desktop: same horizontal scroll, narrower tile width (~280px), drag mouse or use trackpad.
- Tap any photo → lightbox opens with FLIP animation from thumbnail position.
- Swipe left/right inside lightbox → next/prev photo.
- Swipe down → lightbox closes.
- Counter top-center shows `n / 12`.
- Caption at bottom in handwritten Caveat for photos that have one.
- Wait 2s with no input → controls fade. Move mouse / tap → controls reappear.
- Pinch (touch device) → image zooms (scale up to 4×).
- Press Esc → closes.

- [ ] **Step 4: Commit**

```bash
git add src/components/Gallery.astro
git commit -m "feat(gallery): horizontal scroll + enhanced lightbox

- Replace columns-{2,3,4} masonry with snap-x horizontal track
- Tile width 60vw mobile / 280px desktop, aspect 4/3
- Lightbox upgrades:
  * Counter (n/total) top-center monospace
  * Handwritten caption at bottom in Caveat
  * Auto-hide controls after 2s of inactivity (tap/move to wake)
  * Swipe left/right for prev/next, swipe-down to dismiss
  * Pinch-zoom up to 4× via two-finger touch
  * FLIP open animation from thumbnail bounding rect (skipped on reduced-motion)
- All keyboard nav (Esc / arrow keys) preserved"
```

---

## Task 11: RoomCard Book CTA + TrustStrip "Read all reviews" link

**Goal:** Add a small terracotta Book pill to home-page RoomCards and a "Read all reviews on Booking →" handwritten link below the trust quote. Add a new `book_short` field to schema and en.yaml so the Header / RoomCard book label can be a tight word.

**Files:**
- Modify: `src/content.config.ts` (add `ui.buttons.book_short: string?`)
- Modify: `src/content/site/en.yaml` (set `book_short: "Book"` and add `home.trust.read_all_reviews`)
- Modify: `src/components/RoomCard.astro` (add Book pill)
- Modify: `src/components/TrustStrip.astro` (add review link)
- Modify: `src/views/HomeView.astro` (pass `bookHref`, `bookLabel`, `readAllReviews` props)

- [ ] **Step 1: Add `book_short` and `read_all_reviews_label` to schema**

In `src/content.config.ts`, find the `buttons` block (around line 179):

```ts
        buttons: z.object({
          book: z.string(),
          map: z.string(),
          details: z.string(),
          next_room: z.string(),
          write: z.string(),
        }),
```

Replace with:

```ts
        buttons: z.object({
          book: z.string(),
          book_short: z.string().optional(),
          map: z.string(),
          details: z.string(),
          next_room: z.string(),
          write: z.string(),
        }),
```

Find the `home.trust` block (around line 83):

```ts
        trust: z.object({
          booking_label: z.string(),
          google_label: z.string(),
          quote: trustQuote,
        }),
```

Replace with:

```ts
        trust: z.object({
          booking_label: z.string(),
          google_label: z.string(),
          quote: trustQuote,
          read_all_reviews_label: z.string().optional(),
          read_all_reviews_url: z.string().optional(),
        }),
```

Both new fields are `.optional()` so AL/IT/DE keep validating until translation step adds them.

- [ ] **Step 2: Update `en.yaml`**

Find `ui.buttons` block (lines 147–152 originally):

```yaml
  buttons:
    book: "Book on Booking.com"
    map: "Open in Maps"
    details: "View details"
    next_room: "Next room →"
    write: "Write to us"
```

Replace with:

```yaml
  buttons:
    book: "Book on Booking.com"
    book_short: "Book"
    map: "Open in Maps"
    details: "View details"
    next_room: "Next room →"
    write: "Write to us"
```

Find `home.trust` (lines 26–33):

```yaml
  trust:
    booking_label: "Booking.com"
    google_label: "Google"
    quote:
      text: "..."
      author: "Gry"
      location: "Norway"
      when: "stayed last summer"
```

Append two fields under `home.trust`:

```yaml
    read_all_reviews_label: "Read all reviews on Booking →"
    read_all_reviews_url: "https://www.booking.com/hotel/al/vila-emes.html#tab-reviews"
```

(The URL anchors directly to Booking.com's reviews tab. If that URL doesn't anchor correctly when tested, change `_url` to `https://www.booking.com/hotel/al/vila-emes.html` — the user can correct in one line.)

- [ ] **Step 3: Update `RoomCard.astro` to accept `bookHref` + `bookLabel` + render Book pill**

Replace `src/components/RoomCard.astro` (lines 1–37) with:

```astro
---
import { Image } from "astro:assets";
import type { ImageMetadata } from "astro";
import Eyebrow from "./Eyebrow.astro";

interface Props {
  href: string;
  bookHref: string;
  bookLabel: string;
  photo: ImageMetadata;
  numberLabel: string;
  familyLabel: string;
  name: string;
  capacity: string;
  detailsLabel: string;
}
const { href, bookHref, bookLabel, photo, numberLabel, familyLabel, name, capacity, detailsLabel } = Astro.props;
---
<article class="group block overflow-hidden rounded-md border border-[color:var(--color-divider)] bg-[color:var(--color-cream-elevated)] tappable transition duration-500">
  <a href={href} class="block">
    <div class="aspect-[4/3] overflow-hidden">
      <Image
        src={photo}
        alt={name}
        width={1200}
        quality={82}
        class="w-full h-full object-cover transition duration-500 photo-enter"
      />
    </div>
    <div class="p-5 pb-3">
      <Eyebrow>{numberLabel} · {familyLabel}</Eyebrow>
      <h3 class="mt-2 font-serif text-2xl text-[color:var(--color-ink)] leading-tight">{name}</h3>
      <p class="mt-1 text-sm text-[color:var(--color-muted)]">{capacity}</p>
    </div>
  </a>
  <div class="px-5 pb-5 flex items-center justify-between">
    <a href={href} class="text-sm text-[color:var(--color-terracotta)] font-medium hover:underline">{detailsLabel}</a>
    <a
      href={bookHref}
      target="_blank"
      rel="noopener"
      class="inline-flex items-center px-3 py-1.5 bg-[color:var(--color-terracotta)] hover:bg-[color:var(--color-terracotta-hover)] text-[color:var(--color-cream)] text-[11px] tracking-[0.18em] uppercase rounded font-medium tappable"
    >{bookLabel}</a>
  </div>
</article>

<style>
  @media (hover: hover) {
    article:hover { transform: translateY(-4px); box-shadow: 0 12px 32px -8px rgba(0,0,0,0.12); }
    article:hover img { transform: scale(1.03); }
  }
</style>
```

- [ ] **Step 4: Pass `bookHref` and `bookLabel` from `HomeView.astro` to RoomCards**

In `src/views/HomeView.astro`, update the RoomCard call inside the map (lines 124–135):

```astro
{previewFamilies.map((p) => (
  <RoomCard
    href={`${baseLink}/rooms#${p.room.id}`}
    bookHref={SITE.links.booking_com}
    bookLabel={ui.buttons.book_short ?? "Book"}
    photo={p.photo}
    numberLabel={p.numberLabel}
    familyLabel={p.familyLabel}
    name={p.room.name}
    capacity={p.room.sleeps_label}
    detailsLabel={home.rooms.preview_card_cta}
  />
))}
```

- [ ] **Step 4b: Replace hardcoded Header `bookLabel="Book"` with the schema field**

Now that `ui.buttons.book_short` exists, swap the literals introduced in Task 7 Step 3 for the schema-driven value.

In `src/views/HomeView.astro:84`:

```astro
<Header lang={lang} ui={ui.nav} isHome hotelName={site.data.hotel.name} bookLabel={ui.buttons.book_short ?? "Book"} />
```

In `src/views/RoomsView.astro:55`:

```astro
<Header lang={lang} ui={ui.nav} hotelName={site.data.hotel.name} bookLabel={ui.buttons.book_short ?? "Book"} />
```

In `src/views/ContactView.astro:34`:

```astro
<Header lang={lang} ui={ui.nav} hotelName={site.data.hotel.name} bookLabel={ui.buttons.book_short ?? "Book"} />
```

The `?? "Book"` fallback keeps AL/IT/DE rendering "Book" until translation step 11 fills in locale-specific values (e.g., "Rezervo", "Prenota", "Buchen").

- [ ] **Step 5: Update `TrustStrip.astro` to render the review link**

Replace lines 5–13 in `src/components/TrustStrip.astro` (the `Props` block) with:

```astro
interface Props {
  bookingLabel: string;
  bookingScore: number;
  googleLabel: string;
  googleScore: number;
  quote: { text: string; author: string; location: string; when?: string };
  readAllReviewsLabel?: string;
  readAllReviewsUrl?: string;
}
const { bookingLabel, bookingScore, googleLabel, googleScore, quote, readAllReviewsLabel, readAllReviewsUrl } = Astro.props;
```

After the closing `</figcaption>` tag inside `<figure>` (around line 38), insert:

```astro
        {readAllReviewsLabel && readAllReviewsUrl && (
          <a
            href={readAllReviewsUrl}
            target="_blank"
            rel="noopener"
            class="handwritten text-[color:var(--color-terracotta)] text-lg mt-4 inline-block hover:underline"
          >{readAllReviewsLabel}</a>
        )}
```

- [ ] **Step 6: Pass review-link props from `HomeView.astro` to TrustStrip**

In `src/views/HomeView.astro` lines 110–116, update:

```astro
<TrustStrip
  bookingLabel={home.trust.booking_label}
  bookingScore={SITE.ratings.booking}
  googleLabel={home.trust.google_label}
  googleScore={SITE.ratings.google}
  quote={home.trust.quote}
  readAllReviewsLabel={home.trust.read_all_reviews_label}
  readAllReviewsUrl={home.trust.read_all_reviews_url}
/>
```

- [ ] **Step 7: Build verify**

```bash
npm run build
```

Expected: success.

```bash
grep -c 'class="[^"]*tappable[^"]*"' dist/index.html | head
```

Expected: many matches (4 RoomCards × 2 anchors + 2 hero CTAs etc).

```bash
grep -c "Read all reviews on Booking" dist/index.html
```

Expected: `1`.

- [ ] **Step 8: Visual verify**

```bash
npm run dev
```

Open `http://localhost:4321/`:
- Each of the 4 home-page RoomCards has a small terracotta `Book` pill bottom-right + `View details →` link bottom-left.
- Click Book → opens booking.com in new tab.
- Below the Gry quote, a handwritten terracotta link "Read all reviews on Booking →".

- [ ] **Step 9: Commit**

```bash
git add src/content.config.ts src/content/site/en.yaml src/components/RoomCard.astro src/components/TrustStrip.astro src/views/HomeView.astro
git commit -m "feat(cta): RoomCard Book pill + TrustStrip Read all reviews link

- Schema: ui.buttons.book_short (optional, 'Book') for tight CTA labels
- Schema: home.trust.read_all_reviews_{label,url} (optional)
- RoomCard: split footer into 'View details →' link + terracotta Book pill
  Card hover: translateY -4px + shadow + image scale (desktop only via
  @media (hover: hover))
- TrustStrip: handwritten 'Read all reviews on Booking →' below quote"
```

---

## Task 12: End-page "Ready to come?" CTA section

**Goal:** Add a new `ReadyToBookCTA.astro` component that renders a centered handwritten heading + serif H2 + 3 buttons (Book / WhatsApp / Open in Maps), flanked by `PalmDoodle` decorations. Insert it on home, rooms, and contact pages immediately above the footer.

**Files:**
- Create: `src/components/ReadyToBookCTA.astro`
- Modify: `src/content.config.ts` (add `home.ready_cta` schema block — optional)
- Modify: `src/content/site/en.yaml` (add `home.ready_cta` block)
- Modify: `src/views/HomeView.astro`, `RoomsView.astro`, `ContactView.astro` (insert `<ReadyToBookCTA />` above `<Footer />`)

- [ ] **Step 1: Add `home.ready_cta` to schema**

In `src/content.config.ts`, inside the `home` block (after `faq`, around line 117), add:

```ts
        ready_cta: z.object({
          handwritten: z.string(),
          heading: z.string(),
          sub: z.string().optional(),
          book_label: z.string(),
          whatsapp_label: z.string(),
          map_label: z.string(),
        }).optional(),
```

The whole block is optional so AL/IT/DE keep building without it.

- [ ] **Step 2: Add `home.ready_cta` to `en.yaml`**

After the `home.faq` block in `src/content/site/en.yaml` (after line 73), insert:

```yaml
  ready_cta:
    handwritten: "— ready to come?"
    heading: "Book your stay at Vila Emes"
    sub: "Pick your dates on Booking.com, message us on WhatsApp, or open us in Maps."
    book_label: "Book on Booking.com"
    whatsapp_label: "WhatsApp us"
    map_label: "Open in Maps"
```

- [ ] **Step 3: Create `src/components/ReadyToBookCTA.astro`**

```astro
---
import Handwritten from "./Handwritten.astro";
import PalmDoodle from "./PalmDoodle.astro";
import { SITE } from "../config/site";

interface Props {
  handwritten: string;
  heading: string;
  sub?: string;
  bookLabel: string;
  whatsappLabel: string;
  mapLabel: string;
}
const { handwritten, heading, sub, bookLabel, whatsappLabel, mapLabel } = Astro.props;

const waHref = `https://wa.me/${SITE.contact.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hello, I'd like to book at Vila Emes")}`;
---
<section class="relative bg-[color:var(--color-sub-bg)] py-24 md:py-32 reveal overflow-hidden">
  <div class="absolute left-4 md:left-12 top-12 text-[color:var(--color-terracotta)] palm-sway" style="opacity: 0.3;" aria-hidden="true">
    <PalmDoodle size={80} rotate={-8} opacity={0.6} />
  </div>
  <div class="absolute right-4 md:right-12 bottom-12 text-[color:var(--color-terracotta)] palm-sway" style="opacity: 0.3; animation-delay: 1s;" aria-hidden="true">
    <PalmDoodle size={80} rotate={8} opacity={0.6} />
  </div>

  <div class="relative max-w-3xl mx-auto px-5 md:px-10 text-center">
    <Handwritten as="p" color="terracotta" class="text-2xl md:text-3xl">{handwritten}</Handwritten>
    <h2 class="mt-3 font-serif text-4xl md:text-5xl text-[color:var(--color-ink)] leading-tight">{heading}</h2>
    {sub && <p class="mt-5 text-[color:var(--color-ink)]/80 max-w-prose mx-auto">{sub}</p>}

    <div class="mt-10 flex flex-col md:flex-row md:justify-center gap-3">
      <a
        href={SITE.links.booking_com}
        target="_blank"
        rel="noopener"
        class="inline-flex items-center justify-center px-6 py-3 bg-[color:var(--color-terracotta)] hover:bg-[color:var(--color-terracotta-hover)] text-[color:var(--color-cream)] font-medium tracking-wide rounded-md transition tappable"
      >{bookLabel}</a>
      <a
        href={waHref}
        target="_blank"
        rel="noopener"
        class="inline-flex items-center justify-center px-6 py-3 border border-[color:var(--color-divider)] text-[color:var(--color-ink)] hover:bg-[color:var(--color-cream-elevated)] font-medium tracking-wide rounded-md transition tappable"
      >{whatsappLabel}</a>
      <a
        href={SITE.links.google_maps}
        target="_blank"
        rel="noopener"
        class="inline-flex items-center justify-center px-6 py-3 border border-[color:var(--color-sea)] text-[color:var(--color-sea)] hover:bg-[color:var(--color-sea)] hover:text-[color:var(--color-cream)] font-medium tracking-wide rounded-md transition tappable"
      >{mapLabel}</a>
    </div>
  </div>
</section>
```

- [ ] **Step 4: Insert into all 3 views above `<Footer />`**

In `src/views/HomeView.astro` directly before line 187 (the `<Footer ... />` line), add:

```astro
  {home.ready_cta && (
    <ReadyToBookCTA
      handwritten={home.ready_cta.handwritten}
      heading={home.ready_cta.heading}
      sub={home.ready_cta.sub}
      bookLabel={home.ready_cta.book_label}
      whatsappLabel={home.ready_cta.whatsapp_label}
      mapLabel={home.ready_cta.map_label}
    />
  )}
```

Add the import at the top of HomeView (after Footer import):

```ts
import ReadyToBookCTA from "../components/ReadyToBookCTA.astro";
```

In `src/views/RoomsView.astro` directly before line 117 (the `<Footer ... />` line), add the same block. Add the import after the Footer import.

In `src/views/ContactView.astro` directly before line 94 (the `<Footer ... />` line), add the same block. Add the import after the Footer import.

(Note: `home.ready_cta` is the same data object on all 3 pages — we're reusing it intentionally. AL/IT/DE locales render no CTA section because the optional block is missing; translation step 11 adds locale variants.)

- [ ] **Step 5: Build verify**

```bash
npm run build
```

Expected: success.

```bash
grep -c "ready to come" dist/index.html dist/rooms/index.html dist/contact/index.html
```

Expected: each shows `1`.

- [ ] **Step 6: Visual verify**

```bash
npm run dev
```

Open all three EN pages:
- Above the footer, a centered "ready to come?" handwritten + "Book your stay at Vila Emes" + 3 buttons.
- Buttons stack vertically on mobile, sit in a row on desktop.
- Palm doodles flank left + right (left-leaning + right-leaning).
- Click each button → opens correct external destination.

AL/IT/DE pages: section is absent (missing data, optional block).

- [ ] **Step 7: Commit**

```bash
git add src/components/ReadyToBookCTA.astro src/content.config.ts src/content/site/en.yaml src/views/HomeView.astro src/views/RoomsView.astro src/views/ContactView.astro
git commit -m "feat(cta): end-page 'Ready to come?' section on every page

- New ReadyToBookCTA component with 3 buttons (Book / WA / Map)
- PalmDoodle decorations flanking left + right (palm-sway hook ready for Task 14)
- Schema: optional home.ready_cta block (handwritten + heading + sub + 3 button labels)
- Inserted above <Footer /> in HomeView, RoomsView, ContactView
- AL/IT/DE locales skip the section until translation step adds the block"
```

---

## Task 13: Mobile bottom bar + WhatsApp float

**Goal:** Add the mobile-only sticky bottom bar (WhatsApp / Call / Book) and the desktop-only WhatsApp floating bubble. Both render globally via `<Base />`.

**Files:**
- Create: `src/components/MobileCTAStack.astro`
- Create: `src/components/WhatsAppFloat.astro`
- Modify: `src/layouts/Base.astro` (insert both before closing `</body>`)

- [ ] **Step 1: Create `src/components/MobileCTAStack.astro`**

```astro
---
import { SITE } from "../config/site";

const waHref = `https://wa.me/${SITE.contact.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hello, I'd like to book at Vila Emes")}`;
const telHref = `tel:${SITE.contact.phone.replace(/\s+/g, "")}`;
---
<div
  id="mobileCTAStack"
  class="md:hidden fixed inset-x-0 bottom-0 z-30 bg-[color:var(--color-cream-elevated)] border-t border-[color:var(--color-divider)] grid grid-cols-3 transition-transform duration-300"
  style="padding-bottom: env(safe-area-inset-bottom);"
  data-visible="true"
>
  <a
    href={waHref}
    target="_blank"
    rel="noopener"
    class="py-3 text-center text-[12px] tracking-[0.18em] uppercase font-medium border-r border-[color:var(--color-divider)] text-[#25D366] tappable"
  >WhatsApp</a>
  <a
    href={telHref}
    class="py-3 text-center text-[12px] tracking-[0.18em] uppercase font-medium border-r border-[color:var(--color-divider)] text-[color:var(--color-sea)] tappable"
  >Call</a>
  <a
    href={SITE.links.booking_com}
    target="_blank"
    rel="noopener"
    class="py-3 text-center text-[12px] tracking-[0.18em] uppercase font-medium bg-[color:var(--color-terracotta)] text-[color:var(--color-cream)] tappable"
  >Book</a>
</div>

<script is:inline>
  document.addEventListener("DOMContentLoaded", () => {
    const bar = document.getElementById("mobileCTAStack");
    if (!bar) return;
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const goingDown = y > lastY && y > 200;
        bar.style.transform = goingDown ? "translateY(100%)" : "translateY(0)";
        lastY = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
  });
</script>
```

- [ ] **Step 2: Create `src/components/WhatsAppFloat.astro`**

```astro
---
import { SITE } from "../config/site";

const waHref = `https://wa.me/${SITE.contact.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hello, I'd like to book at Vila Emes")}`;
---
<a
  href={waHref}
  target="_blank"
  rel="noopener"
  aria-label="Chat on WhatsApp"
  class="hidden md:flex fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-[#25D366] items-center justify-center shadow-[0_8px_20px_-4px_rgba(37,211,102,0.5)] tappable wa-float"
>
  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" class="text-white" aria-hidden="true">
    <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-1 1.1-.2.2-.4.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.8-.7-1.4-1.7-1.6-1.9-.2-.3 0-.4.1-.6.1-.1.3-.4.5-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4 0-.1-.2-.2-.5-.3z"/>
    <path d="M20.5 3.5C18.2 1.3 15.2 0 12 0 5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.7.9 3.7 1.4 5.8 1.4 6.6 0 12-5.4 12-12 0-3.2-1.3-6.2-3.5-8.4zM12 21.8c-1.9 0-3.7-.5-5.3-1.4l-.4-.2-3.6.9.9-3.5-.2-.4c-1-1.6-1.5-3.5-1.5-5.4 0-5.6 4.6-10.2 10.2-10.2 2.7 0 5.3 1.1 7.2 3 1.9 1.9 3 4.5 3 7.2 0 5.6-4.6 10-10.3 10z"/>
  </svg>
</a>

<style>
  .wa-float {
    animation: wa-pulse 8s ease-in-out infinite;
  }
  @keyframes wa-pulse {
    0%, 92%, 100% { transform: scale(1); }
    94% { transform: scale(1.06); }
    96% { transform: scale(1); }
    98% { transform: scale(1.04); }
  }
  @media (prefers-reduced-motion: reduce) {
    .wa-float { animation: none; }
  }
</style>
```

- [ ] **Step 3: Insert both into `Base.astro`**

In `src/layouts/Base.astro`, after `<slot />` on line 35 (before the existing `<script>` blocks), add:

```astro
    <slot />
    <MobileCTAStack />
    <WhatsAppFloat />
```

Add imports at the top of `Base.astro` (after the `SITE` import on line 4):

```ts
import MobileCTAStack from "../components/MobileCTAStack.astro";
import WhatsAppFloat from "../components/WhatsAppFloat.astro";
```

- [ ] **Step 4: Build verify**

```bash
npm run build
```

Expected: success.

```bash
grep -c "mobileCTAStack" dist/index.html dist/rooms/index.html dist/contact/index.html
```

Expected: each shows `1`.

```bash
grep -c "wa-float" dist/index.html dist/rooms/index.html dist/contact/index.html
```

Expected: each shows `1`.

- [ ] **Step 5: Visual verify**

```bash
npm run dev
```

Mobile (<768px):
- Sticky bottom bar with WhatsApp / Call / Book.
- Scroll down past 200px → bar slides off (translateY 100%).
- Scroll up → bar slides back.
- iPhone home-bar safe-area padding visible.
- WhatsApp float NOT visible.

Desktop (≥768px):
- Mobile bar hidden.
- Bottom-right WhatsApp green circle, gentle pulse every 8s.
- Click → opens wa.me chat with pre-filled greeting.
- Reduced-motion → no pulse animation.

- [ ] **Step 6: Commit**

```bash
git add src/components/MobileCTAStack.astro src/components/WhatsAppFloat.astro src/layouts/Base.astro
git commit -m "feat(cta): mobile bottom CTA bar + desktop WhatsApp float

- MobileCTAStack: 3-up grid (WhatsApp / Call / Book), <md only
  Hides on scroll-down, reveals on scroll-up. Safe-area padding for iPhone.
- WhatsAppFloat: 56px circle bottom-right, md+ only. Subtle 8s pulse
  animation (suppressed by prefers-reduced-motion).
- Both rendered globally via Base.astro for every page."
```

---

## Task 14: Motion pass — staggered reveals, palm sway, count-ups, view transitions

**Goal:** Add the motion catalog from spec §6 systemwide. CSS for `.reveal-stagger`, `.photo-enter`, `.palm-sway`, `.polaroid-wobble`, `.tappable`, hover-only desktop classes. Inline scripts for count-up numbers and `.photo-enter` IntersectionObserver. View Transitions API via `<ClientRouter />` from `astro:transitions` in `Base.astro`.

**Files:**
- Modify: `src/styles/global.css` (motion classes)
- Modify: `src/layouts/Base.astro` (View Transitions + count-up + photo-enter observers)
- Modify: `src/components/PalmDoodle.astro` (palm-sway class hook)
- Modify: `src/components/Hero.astro` (already has polaroid-wobble class — confirm keyframe in CSS)
- Modify: `src/components/About.astro`, gallery already has `.photo-enter` from Task 10

- [ ] **Step 1: Append motion classes to `global.css`**

After the sunset classes added in Task 5, append:

```css
/* Reveal-stagger: extends .reveal so children animate in sequence. */
.reveal-stagger > * {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  transition-delay: 0ms;
}
.reveal-stagger.is-visible > *:nth-child(1) { opacity: 1; transform: translateY(0); transition-delay: 0ms; }
.reveal-stagger.is-visible > *:nth-child(2) { opacity: 1; transform: translateY(0); transition-delay: 50ms; }
.reveal-stagger.is-visible > *:nth-child(3) { opacity: 1; transform: translateY(0); transition-delay: 100ms; }
.reveal-stagger.is-visible > *:nth-child(4) { opacity: 1; transform: translateY(0); transition-delay: 150ms; }
.reveal-stagger.is-visible > *:nth-child(5) { opacity: 1; transform: translateY(0); transition-delay: 200ms; }
.reveal-stagger.is-visible > *:nth-child(n+6) { opacity: 1; transform: translateY(0); transition-delay: 250ms; }

/* Photo enter: image fades in + slight scale + drift on intersection */
.photo-enter {
  opacity: 0;
  transform: scale(0.96) translateY(12px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.photo-enter.is-entered {
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* Palm doodle gentle 4s sway */
@keyframes palm-sway {
  0%, 100% { transform: rotate(-1deg); }
  50%      { transform: rotate(1deg); }
}
.palm-sway {
  animation: palm-sway 4s ease-in-out infinite;
  transform-origin: 50% 100%;
}

/* Polaroid one-time wobble on enter */
@keyframes polaroid-drop {
  0%   { transform: rotate(-3deg) translateY(-12px); opacity: 0.6; }
  60%  { transform: rotate(-1deg) translateY(0); opacity: 1; }
  80%  { transform: rotate(-4deg); }
  100% { transform: rotate(-3deg); }
}
.polaroid-wobble.is-visible {
  animation: polaroid-drop 1s ease-out;
}

/* Tap feedback (works everywhere — :active fires on touch + click) */
.tappable {
  transition: transform 0.15s ease;
}
.tappable:active {
  transform: scale(0.98);
}

/* Desktop-only hover variants */
@media (hover: hover) {
  .link-underline {
    position: relative;
  }
  .link-underline::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -2px;
    height: 1px;
    background: currentColor;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  .link-underline:hover::after {
    transform: scaleX(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .reveal-stagger > *,
  .photo-enter,
  .polaroid-wobble.is-visible {
    opacity: 1;
    transform: none;
    animation: none;
    transition: none;
  }
  .palm-sway { animation: none; }
}
```

- [ ] **Step 2: Add `palm-sway` class hook in `PalmDoodle.astro`**

In `src/components/PalmDoodle.astro`, change the `class` attribute on the `<svg>` element (line 20):

```astro
class={`pointer-events-none palm-sway ${className}`}
```

(Adds `palm-sway` to all PalmDoodle instances. The CSS keyframe handles the animation; reduced-motion media query disables it.)

- [ ] **Step 3: Add View Transitions, count-ups, and photo-enter observers to `Base.astro`**

In `src/layouts/Base.astro`:

a) Add the import at the top (after the `SITE` import):

```ts
import { ClientRouter } from "astro:transitions";
```

b) In the `<head>` block (before `</head>`, around line 32), insert:

```astro
    <ClientRouter />
```

c) Replace the existing two `<script is:inline>` blocks (lines 37–84) with:

```astro
    <script is:inline>
      // Header transparent → solid on scroll
      document.addEventListener("astro:page-load", () => {
        const header = document.getElementById("siteHeader");
        if (header) {
          if (header.dataset.transparent !== "true") {
            header.classList.add("is-solid");
          } else {
            const onScroll = () => header.classList.toggle("is-solid", window.scrollY > 24);
            onScroll();
            window.addEventListener("scroll", onScroll, { passive: true });
          }
        }

        // Mobile nav toggle
        const btn = document.getElementById("mobileNavToggle");
        const nav = document.getElementById("mobileNav");
        if (btn && nav) {
          btn.addEventListener("click", () => {
            const isOpen = !nav.hidden;
            nav.hidden = isOpen;
            btn.setAttribute("aria-expanded", String(!isOpen));
          });
        }

        // Reveal-on-scroll (.reveal + .reveal-stagger)
        const targets = document.querySelectorAll(".reveal, .reveal-stagger");
        if (!("IntersectionObserver" in window) || targets.length === 0) {
          targets.forEach((t) => t.classList.add("is-visible"));
        } else {
          const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                io.unobserve(entry.target);
              }
            });
          }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
          targets.forEach((t) => io.observe(t));
        }

        // Photo-enter
        const photos = document.querySelectorAll(".photo-enter");
        if ("IntersectionObserver" in window && photos.length) {
          const photoIO = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-entered");
                photoIO.unobserve(entry.target);
              }
            });
          }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
          photos.forEach((p) => photoIO.observe(p));
        }

        // Number count-ups: any element with [data-count-up]
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const counters = document.querySelectorAll("[data-count-up]");
        if (!reduced && "IntersectionObserver" in window && counters.length) {
          const countIO = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              const el = entry.target;
              const target = parseFloat(el.getAttribute("data-count-up") || "0");
              const decimals = (target.toString().split(".")[1] || "").length;
              const duration = 1200;
              const start = performance.now();
              const initial = 0;
              const tick = (now) => {
                const t = Math.min(1, (now - start) / duration);
                const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
                el.textContent = (initial + (target - initial) * eased).toFixed(decimals);
                if (t < 1) requestAnimationFrame(tick);
                else el.textContent = target.toFixed(decimals);
              };
              requestAnimationFrame(tick);
              countIO.unobserve(el);
            });
          }, { threshold: 0.5 });
          counters.forEach((c) => countIO.observe(c));
        } else {
          counters.forEach((c) => {
            const target = parseFloat(c.getAttribute("data-count-up") || "0");
            const decimals = (target.toString().split(".")[1] || "").length;
            c.textContent = target.toFixed(decimals);
          });
        }
      });
    </script>
```

Key change vs original Base.astro: switched event listener from `DOMContentLoaded` to `astro:page-load` so initialization re-runs after each ClientRouter navigation (otherwise scroll listeners and reveal observers stop working after a page transition).

- [ ] **Step 3b: Convert component inline scripts to re-init after ClientRouter transitions**

The scripts written in Tasks 6, 9, 10, 13 listen to `DOMContentLoaded` only — that fires once on first page load but NOT after ClientRouter swaps the page. Convert each to also listen to `astro:page-load` so observers / autoplay / event delegation re-attach to the freshly-rendered DOM.

Pattern to apply (replace the outer `document.addEventListener("DOMContentLoaded", () => { ... });` wrapper with):

```js
(function () {
  function init() {
    // ...existing body of the original DOMContentLoaded callback...
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  document.addEventListener("astro:page-load", init);
})();
```

Apply this conversion to:
- `src/components/Hero.astro` (inline script at the bottom)
- `src/components/RoomCarousel.astro`
- `src/components/Gallery.astro`
- `src/components/MobileCTAStack.astro`

Note on idempotency: ClientRouter REPLACES the DOM on each transition, so old elements (and their event listeners + intervals) are garbage-collected. Re-running init queries fresh DOM and attaches new listeners to the new elements — no double-binding. Old intervals reference dead elements and harmlessly tick out (tiny CPU cost, no memory leak).

- [ ] **Step 4: Wire `data-count-up` on the TrustStrip scores**

In `src/components/TrustStrip.astro`, change the score spans (lines 18 and 22 originally):

```astro
<span class="font-serif text-5xl md:text-6xl text-[color:var(--color-terracotta)] tabular-nums">{bookingScore.toFixed(1)}</span>
```

→

```astro
<span class="font-serif text-5xl md:text-6xl text-[color:var(--color-terracotta)] tabular-nums" data-count-up={bookingScore}>0.0</span>
```

Same for `googleScore`:

```astro
<span class="font-serif text-5xl md:text-6xl text-[color:var(--color-terracotta)] tabular-nums" data-count-up={googleScore}>0.0</span>
```

The placeholder `0.0` shows pre-script if JS fails / for screen readers; the `data-count-up` attribute drives the animation.

- [ ] **Step 5: Apply `.reveal-stagger` to grids that benefit from it**

In `src/views/HomeView.astro` line 124, change:

```astro
<div class="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
```

to:

```astro
<div class="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5 reveal-stagger">
```

In `src/components/ContactStrip.astro` line 40, change:

```astro
<ul class="mt-12 grid gap-4 grid-cols-2 md:grid-cols-5">
```

to:

```astro
<ul class="mt-12 grid gap-4 grid-cols-2 md:grid-cols-5 reveal-stagger">
```

- [ ] **Step 6: Apply `.photo-enter` to remaining un-tagged `<Image>` elements**

In `src/components/About.astro` line 49, add the class to the `<Image>` element:

```astro
<Image
  src={photo}
  alt={photoCaption}
  width={1200}
  quality={82}
  class="w-full aspect-square object-cover rounded-md photo-enter"
/>
```

(Hero photos already inherit the sunset filter; we don't apply photo-enter to them. RoomCarousel slides skip photo-enter so the carousel transition isn't fighting the entrance animation. Gallery thumbnails got `.photo-enter` via Task 10.)

- [ ] **Step 7: Build verify**

```bash
npm run build
```

Expected: success.

```bash
grep -c 'data-count-up' dist/index.html
```

Expected: `2` (booking + google scores).

```bash
grep -c "palm-sway" dist/index.html
```

Expected: at least `1` (the ReadyToBookCTA decorations rendered with PalmDoodle).

```bash
grep -c "astro:transitions" dist/index.html
```

Expected: at least `1` (View Transitions injects CSS via the head).

- [ ] **Step 8: Visual verify**

```bash
npm run dev
```

Open `http://localhost:4321/`:
- Numbers (9.0, 4.7) count from 0.0 when scrolling into the trust strip.
- Home rooms grid: 4 cards animate in sequence (50ms apart).
- Contact tiles: same staggered behavior.
- Click a nav link → page cross-fades (View Transitions visible) instead of hard reload.
- Palm doodles in ReadyToBookCTA gently sway side-to-side, 4s loop.
- Hero polaroid wobbles once on first reveal.
- Reduced-motion: every animation is suppressed; layout is identical, just no movement.
- Repeat across `/rooms`, `/contact`, `/al/`, `/it/`, `/de/`.

- [ ] **Step 9: Commit**

```bash
git add src/styles/global.css src/layouts/Base.astro src/components/PalmDoodle.astro src/components/About.astro src/components/TrustStrip.astro src/views/HomeView.astro src/components/ContactStrip.astro
git commit -m "feat(motion): stagger reveals + palm sway + count-ups + view transitions

- global.css: .reveal-stagger (50ms increments), .photo-enter, palm-sway
  keyframe, polaroid-drop wobble, .tappable :active, hover-only
  .link-underline. All gated by prefers-reduced-motion: reduce.
- Base.astro: ClientRouter for cross-page transitions. Listeners moved
  from DOMContentLoaded to astro:page-load so observers re-init after
  navigation. Photo-enter observer + count-up animator added.
- TrustStrip: data-count-up on the booking + google scores.
- About + Gallery: photo-enter applied to in-content images.
- HomeView room grid + ContactStrip tiles: reveal-stagger applied.
- PalmDoodle: palm-sway class added unconditionally (motion-safe via CSS)."
```

---

## Task 15: Reconstruct al.yaml schema (Albanian)

**Goal:** Dispatch a fresh `general-purpose` Opus subagent to reconstruct `src/content/site/al.yaml` against `en.yaml` as canonical schema. The subagent **preserves** the user's existing Albanian translations and **fixes** schema-level issues only: missing keys, missing required/optional fields added through the polish phase (tagline rotators, trust review link, ready_cta block, ui.buttons.book_short, gallery captions), smart quotes (` „ " " ' ' « »` etc.) → ASCII straight quotes, and indentation drift.

**Pre-condition:** Tasks 1–14 done. The WIP `al.yaml` from the polish-WIP stash is in the working tree alongside `/tmp/vila-emes-yaml-wip-backup/al.yaml` as a safety backup. (Pop the stash with `git stash pop` BEFORE dispatching this task. Do NOT pop until ready to dispatch.)

**Files:**
- Modify: `src/content/site/al.yaml`

**Implementer prompt** — dispatch via the `Agent` tool with `subagent_type: "general-purpose"`, `model: "opus"`, `description: "AL yaml schema reconstruction"`:

```
You are reconstructing the schema of an Albanian (locale: al, HTML lang: sq)
content YAML file for a small family-run hotel marketing site. The user
already pasted Google-Translate output earlier in the project; the TONE of
their existing Albanian values is acceptable. Your job is NOT to retranslate
or refine wording — it is to fix SCHEMA issues while preserving every
existing translated value as-is.

Files (absolute paths):
- Canonical schema source (English): /Users/erbandanaj/Downloads/xCode/hotel-vila-emes/src/content/site/en.yaml
- Schema definition (Zod):           /Users/erbandanaj/Downloads/xCode/hotel-vila-emes/src/content.config.ts
- Target file (Albanian):            /Users/erbandanaj/Downloads/xCode/hotel-vila-emes/src/content/site/al.yaml
- WIP backup (safety reference):     /tmp/vila-emes-yaml-wip-backup/al.yaml

Steps:

1. Read all four files above.

2. Compare al.yaml's KEY structure against en.yaml. Identify:
   - Keys present in en.yaml but missing from al.yaml.
   - Keys present in al.yaml that don't exist in en.yaml (probably typos
     or pre-polish names — fix them to match en.yaml).
   - Indentation drift (use 2 spaces, no tabs; mirror en.yaml exactly).
   - Smart quotes inside YAML string values that should be ASCII straight
     quotes (" and '). Curly/typographic quotes are valid YAML but
     should not appear in raw values — convert „ " " ' ' « » → straight.

3. Reconstruct al.yaml using the Write tool, applying these rules:
   - **PRESERVE** every existing Albanian translated value verbatim. Do
     NOT change wording, tone, idiom, or punctuation of values that
     already exist in al.yaml. Only smart-quote substitution is allowed
     on existing values.
   - Mirror en.yaml's field ORDER exactly so the diff stays minimal.
   - For numeric fields in `rooms[]` (size_m2, sleeps, order, id, family,
     amenities[]) — copy from en.yaml verbatim, only translate the
     `name`, `sleeps_label`, `beds`, `view`, `outdoor`, `description`
     string fields.

4. ADD any of the following schema-required or polish-added optional
   fields if they are missing in al.yaml. Translate to Albanian with the
   tone/idiom guidance below; do NOT add them if they already exist with
   user content (preserve user values):

   Required (Zod schema enforces these):
   - All non-optional fields per src/content.config.ts. The build will
     fail if any required field is missing.

   Polish-added optional fields that should be PRESENT for visual parity
   with the EN site (en.yaml has them; the AL site should too):
   - home.hero.tagline_stable          (e.g. "Një hotel familjar")
   - home.hero.tagline_rotators        (array of EXACTLY 4 strings, e.g.
                                        ["pranë detit", "që nga 1998",
                                         "me dashuri", "100 m nga deti"])
   - home.trust.quote.when             (e.g. "qëndroi verën e kaluar")
   - home.trust.read_all_reviews_label (e.g. "Lexo të gjitha rishikimet në Booking →")
   - home.trust.read_all_reviews_url   ("https://www.booking.com/hotel/al/vila-emes.html#tab-reviews"
                                        — same URL across all locales,
                                        copy from en.yaml verbatim)
   - home.gallery.captions             (object with 4 entries: keys
                                        "DSC_0123", "DSC_0145",
                                        "DSC_0169", "DSC_0204" — values
                                        translated from en.yaml's
                                        captions)
   - home.ready_cta                    (object with these keys, in this
                                        order: handwritten, heading,
                                        sub, wa_text, book_label,
                                        whatsapp_label, map_label —
                                        7 fields total. wa_text is the
                                        prefilled WhatsApp message text,
                                        translate to Albanian: e.g.
                                        "Përshëndetje, dëshiroj të rezervoj në Vila Emes")
   - ui.buttons.book_short             (e.g. "Rezervo")

5. Tone constraints (ONLY for newly-added translations — do not rewrite
   existing values to match these):
   - Warm, family-run, slightly handwritten — NOT formal/corporate Albanian.
   - Caveat-handwritten phrases ("welcome to", "since 1998") read native
     (e.g. "mirë se vini", "që nga 1998").
   - Place names: "Plazh, Durrës" (with ë), "Rruga Pavarësia" preserved.
   - "100 m from the water" → "100 m nga deti" (idiomatic, not literal).
   - "the owner / the family / owners" — context-appropriate Albanian forms.

6. Use the Write tool to overwrite src/content/site/al.yaml with your
   reconstructed YAML.

7. Run `npm run build` from /Users/erbandanaj/Downloads/xCode/hotel-vila-emes/.
   Expected: 12 pages built, no Zod validation errors. If validation fails,
   read the error, fix the offending field, re-write, re-build until green.

8. Return a brief textual summary (under 300 words):
   - Count of fields preserved verbatim from the WIP yaml.
   - Count of fields added (with brief list of which ones).
   - Smart-quote / indentation fixes applied (count + brief examples).
   - Final `npm run build` exit code and page count.

If you cannot resolve an issue, return BLOCKED with the specific question.
DO NOT add comments or extra fields beyond what en.yaml contains.
DO NOT change any value in al.yaml that already had a user translation,
unless the change is purely smart-quote → ASCII or schema key correction.
```

**Verification (controller-side, after implementer + reviewers approve):**

```bash
npm run build  # expect 12 pages, no errors
```

**Commit:**

```bash
git add src/content/site/al.yaml
git commit -m "i18n(al): reconstruct yaml schema preserving user translations

Mirrors en.yaml after polish-phase schema additions: tagline_stable,
tagline_rotators (4), trust.quote.when, trust.read_all_reviews_label,
trust.read_all_reviews_url, gallery.captions (4), ready_cta (7 fields
incl wa_text), ui.buttons.book_short. User's existing Albanian
translations preserved verbatim; only smart-quote and indentation
fixes applied to existing values."
```

After the implementer returns DONE, follow the subagent-driven-development workflow: dispatch a spec-compliance reviewer (verify keys mirror en.yaml, all required fields present, smart quotes fixed) then a code-quality reviewer (verify user translations preserved, newly-added Albanian translations read native and not literal-machine).

---

## Task 16: Reconstruct it.yaml schema (Italian)

**Goal:** Same flow as Task 15, for Italian. Dispatch in parallel with Tasks 15 + 17 (file-isolated — one Opus subagent per yaml, all in one message).

**Pre-condition:** Tasks 1–14 done. The WIP `it.yaml` from the polish-WIP stash is in the working tree alongside `/tmp/vila-emes-yaml-wip-backup/it.yaml` as a safety backup.

**Files:**
- Modify: `src/content/site/it.yaml`

**Implementer prompt** — dispatch via the `Agent` tool with `subagent_type: "general-purpose"`, `model: "opus"`, `description: "IT yaml schema reconstruction"`:

```
You are reconstructing the schema of an Italian (locale: it) content YAML
file for a small family-run hotel marketing site. The user already pasted
Google-Translate output earlier in the project; the TONE of their existing
Italian values is acceptable. Your job is NOT to retranslate or refine
wording — it is to fix SCHEMA issues while preserving every existing
translated value as-is.

Files (absolute paths):
- Canonical schema source (English): /Users/erbandanaj/Downloads/xCode/hotel-vila-emes/src/content/site/en.yaml
- Schema definition (Zod):           /Users/erbandanaj/Downloads/xCode/hotel-vila-emes/src/content.config.ts
- Target file (Italian):             /Users/erbandanaj/Downloads/xCode/hotel-vila-emes/src/content/site/it.yaml
- WIP backup (safety reference):     /tmp/vila-emes-yaml-wip-backup/it.yaml

Steps:

1. Read all four files above.

2. Compare it.yaml's KEY structure against en.yaml. Identify:
   - Keys present in en.yaml but missing from it.yaml.
   - Keys present in it.yaml that don't exist in en.yaml (typos or
     pre-polish names — fix to match en.yaml).
   - Indentation drift (use 2 spaces, no tabs).
   - Smart quotes inside YAML string values (" " ' ' « » „" etc.) →
     ASCII straight quotes.

3. Reconstruct it.yaml using the Write tool, applying these rules:
   - **PRESERVE** every existing Italian translated value verbatim. Do
     NOT change wording, tone, idiom, or punctuation of values that
     already exist in it.yaml. Smart-quote substitution is allowed.
   - Mirror en.yaml's field ORDER exactly.
   - For numeric/enum fields in `rooms[]` (size_m2, sleeps, order, id,
     family, amenities[]) — copy from en.yaml verbatim. Only translate
     the string fields (name, sleeps_label, beds, view, outdoor,
     description).

4. ADD any of the following polish-added fields if missing. Translate
   into Italian only when adding; do NOT modify existing user values:

   Polish-added fields (en.yaml has them; it.yaml should too):
   - home.hero.tagline_stable          (e.g. "Un hotel di famiglia")
   - home.hero.tagline_rotators        (array of EXACTLY 4 strings, e.g.
                                        ["sul mare", "dal 1998",
                                         "con amore", "a 100 m dall'acqua"])
   - home.trust.quote.when             (e.g. "ha soggiornato l'estate scorsa")
   - home.trust.read_all_reviews_label (e.g. "Leggi tutte le recensioni su Booking →")
   - home.trust.read_all_reviews_url   ("https://www.booking.com/hotel/al/vila-emes.html#tab-reviews"
                                        — same URL across all locales)
   - home.gallery.captions             (object with 4 entries: keys
                                        "DSC_0123", "DSC_0145",
                                        "DSC_0169", "DSC_0204" — values
                                        translated from en.yaml's
                                        captions to natural Italian)
   - home.ready_cta                    (object with these 7 keys in
                                        order: handwritten, heading,
                                        sub, wa_text, book_label,
                                        whatsapp_label, map_label.
                                        wa_text is the WhatsApp
                                        prefilled message; e.g.
                                        "Ciao, vorrei prenotare a Vila Emes")
   - ui.buttons.book_short             (e.g. "Prenota")

5. Tone constraints (ONLY for newly-added translations):
   - Warm, family-run, slightly handwritten — avoid stiff hotel-marketing
     Italian.
   - Formality: prefer plural neutral ("vi diamo il benvenuto") over
     singular "tu" or strict "Lei". Hospitality but informal.
   - Place names: decide between "Durrës" (Albanian) and "Durazzo"
     (Italian historic) for new content. Mirror what existing it.yaml
     values use; if existing values are inconsistent, preserve as-is and
     use "Durrës" for new additions only (so the user can decide later).
   - Caveat-handwritten phrases: native idiom ("benvenuti", "dal 1998",
     "con amore").

6. Use the Write tool to overwrite src/content/site/it.yaml.

7. Run `npm run build` from /Users/erbandanaj/Downloads/xCode/hotel-vila-emes/.
   Expected: 12 pages built, no Zod errors. Fix and re-run until green.

8. Return a brief summary (<300 words): preserved-fields count,
   added-fields count + list, smart-quote / indentation fix examples,
   final build exit code.

If you cannot resolve an issue, return BLOCKED.
DO NOT add comments or extra fields beyond what en.yaml contains.
DO NOT change any value in it.yaml that already had a user translation,
unless the change is smart-quote → ASCII or schema key correction.
```

**Verification (controller-side):**

```bash
npm run build  # expect 12 pages, no errors
```

**Commit:**

```bash
git add src/content/site/it.yaml
git commit -m "i18n(it): reconstruct yaml schema preserving user translations

Mirrors en.yaml after polish-phase schema additions: tagline_stable,
tagline_rotators (4), trust.quote.when, trust.read_all_reviews_label,
trust.read_all_reviews_url, gallery.captions (4), ready_cta (7 fields
incl wa_text), ui.buttons.book_short. User's existing Italian
translations preserved verbatim; only smart-quote and indentation
fixes applied to existing values."
```

After the implementer returns DONE, dispatch spec-compliance + code-quality reviewers per subagent-driven-development.

---

## Task 17: Reconstruct de.yaml schema (German)

**Goal:** Same flow as Tasks 15 + 16, for German. Dispatch in parallel with Tasks 15 + 16 (file-isolated).

**Pre-condition:** Tasks 1–14 done. The WIP `de.yaml` from the polish-WIP stash is in the working tree alongside `/tmp/vila-emes-yaml-wip-backup/de.yaml` as a safety backup.

**Files:**
- Modify: `src/content/site/de.yaml`

**Implementer prompt** — dispatch via the `Agent` tool with `subagent_type: "general-purpose"`, `model: "opus"`, `description: "DE yaml schema reconstruction"`:

```
You are reconstructing the schema of a German (locale: de) content YAML
file for a small family-run hotel marketing site. The user already pasted
Google-Translate output earlier in the project; the TONE of their existing
German values is acceptable. Your job is NOT to retranslate or refine
wording — it is to fix SCHEMA issues while preserving every existing
translated value as-is.

Files (absolute paths):
- Canonical schema source (English): /Users/erbandanaj/Downloads/xCode/hotel-vila-emes/src/content/site/en.yaml
- Schema definition (Zod):           /Users/erbandanaj/Downloads/xCode/hotel-vila-emes/src/content.config.ts
- Target file (German):              /Users/erbandanaj/Downloads/xCode/hotel-vila-emes/src/content/site/de.yaml
- WIP backup (safety reference):     /tmp/vila-emes-yaml-wip-backup/de.yaml

Steps:

1. Read all four files above.

2. Compare de.yaml's KEY structure against en.yaml. Identify:
   - Keys present in en.yaml but missing from de.yaml.
   - Keys present in de.yaml that don't exist in en.yaml (typos or
     pre-polish names — fix to match en.yaml).
   - Indentation drift (use 2 spaces, no tabs).
   - Smart quotes inside YAML string values (" " ' ' « » „" etc.) →
     ASCII straight quotes.

3. Reconstruct de.yaml using the Write tool, applying these rules:
   - **PRESERVE** every existing German translated value verbatim. Do
     NOT change wording, tone, idiom, or punctuation of values that
     already exist in de.yaml. Smart-quote substitution is allowed.
   - Mirror en.yaml's field ORDER exactly.
   - For numeric/enum fields in `rooms[]` (size_m2, sleeps, order, id,
     family, amenities[]) — copy from en.yaml verbatim. Only translate
     the string fields (name, sleeps_label, beds, view, outdoor,
     description).

4. ADD any of the following polish-added fields if missing. Translate
   into German only when adding; do NOT modify existing user values:

   Polish-added fields (en.yaml has them; de.yaml should too):
   - home.hero.tagline_stable          (e.g. "Ein Familienhotel")
   - home.hero.tagline_rotators        (array of EXACTLY 4 strings, e.g.
                                        ["am Meer", "seit 1998",
                                         "mit Liebe", "100 m vom Wasser"])
   - home.trust.quote.when             (e.g. "übernachtete letzten Sommer")
   - home.trust.read_all_reviews_label (e.g. "Alle Bewertungen auf Booking lesen →")
   - home.trust.read_all_reviews_url   ("https://www.booking.com/hotel/al/vila-emes.html#tab-reviews"
                                        — same URL across all locales)
   - home.gallery.captions             (object with 4 entries: keys
                                        "DSC_0123", "DSC_0145",
                                        "DSC_0169", "DSC_0204" — values
                                        translated from en.yaml's
                                        captions to natural German)
   - home.ready_cta                    (object with these 7 keys in
                                        order: handwritten, heading,
                                        sub, wa_text, book_label,
                                        whatsapp_label, map_label.
                                        wa_text is the WhatsApp
                                        prefilled message; e.g.
                                        "Hallo, ich möchte im Vila Emes buchen")
   - ui.buttons.book_short             (e.g. "Buchen")

5. Tone constraints (ONLY for newly-added translations):
   - Formality: Sie (formal), not du. Hospitality requires Sie.
   - Compound nouns: ensure no awkward hyphenation
     (Familienhotel not Familien-Hotel; Pastetenladen / Konditorei /
     Bäckerei choose what fits "pastry shop" naturally).
   - Place names: mirror what existing de.yaml values use for
     "Durrës"/"Durres" consistency. If existing values are inconsistent,
     preserve as-is and use "Durrës" (with ë) for new additions only.
   - Caveat-handwritten phrases: native idiom ("willkommen", "seit 1998",
     "mit Liebe").
   - Umlauts: ä, ö, ü, ß — never replace with ae/oe/ue/ss.

6. Use the Write tool to overwrite src/content/site/de.yaml.

7. Run `npm run build` from /Users/erbandanaj/Downloads/xCode/hotel-vila-emes/.
   Expected: 12 pages built, no Zod errors. Fix and re-run until green.

8. Return a brief summary (<300 words): preserved-fields count,
   added-fields count + list, smart-quote / indentation fix examples,
   final build exit code.

If you cannot resolve an issue, return BLOCKED.
DO NOT add comments or extra fields beyond what en.yaml contains.
DO NOT change any value in de.yaml that already had a user translation,
unless the change is smart-quote → ASCII or schema key correction.
```

**Verification (controller-side):**

```bash
npm run build  # expect 12 pages, no errors
```

**Commit:**

```bash
git add src/content/site/de.yaml
git commit -m "i18n(de): reconstruct yaml schema preserving user translations

Mirrors en.yaml after polish-phase schema additions: tagline_stable,
tagline_rotators (4), trust.quote.when, trust.read_all_reviews_label,
trust.read_all_reviews_url, gallery.captions (4), ready_cta (7 fields
incl wa_text), ui.buttons.book_short. User's existing German
translations preserved verbatim; only smart-quote and indentation
fixes applied to existing values."
```

After the implementer returns DONE, dispatch spec-compliance + code-quality reviewers per subagent-driven-development.

---

## Parallel dispatch tip for Tasks 15–17

If executing these tasks in a single session, dispatch all three subagents in **one message with three tool calls** so they run concurrently. The agent type, model, description, and prompt for each are documented above. Each subagent returns independently, and corrections are applied per-locale before committing.

---

## Acceptance Criteria

(Mirrors spec §15 — paste here for the implementer's reference.)

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
12. **Translations** — AL/IT/DE versions of all visible copy match EN structure (no missing fields per Zod schema). Subagent verification reports committed.
13. **Reduced motion** — toggle "Reduce motion" in OS settings, refresh: hero stops crossfading, palms don't sway, carousel doesn't autoplay, view transitions disable.
14. **Lighthouse** — mobile scores match or exceed the current build's baseline (run before/after; report numbers in implementation summary).

---

## Verification Commands Reference

Common checks the implementer can run any time:

```bash
# Full build
npm run build

# Dev server for visual check
npm run dev

# Schema-validity (build does this; this is a faster typecheck-ish smoke)
npx astro check

# Confirm no Shaban references in EN dist
grep -ic shaban dist/index.html dist/rooms/index.html dist/contact/index.html

# Confirm new content present
grep -c "Gry" dist/index.html
grep -c "made with ❤️" dist/index.html
grep -c "ready to come" dist/index.html

# Confirm all 12 HTML pages exist
find dist -name "index.html" | sort

# Confirm no JS bundles in dist (zero-bundle pattern)
find dist -name "*.js" -not -path "*/_astro/*" | head -5
```

---

## Open follow-ups (post-polish, not in this plan)

- Real Instagram URL once user provides handle (one-line edit in `site.ts`).
- Photo curation refinement for `econ-triple` and `budget-triple` (Task 9 already gives them unique sets, but owner may want different picks).
- Custom domain swap (separate post-Cloudflare deployment task).
- Trust quote `when: "stayed last summer"` — user confirmed; if factually wrong post-launch, edit in `home.trust.quote.when` of all 4 yamls.
- Push commit `07ec34b` (the spec) and the new commits to `origin/main` when user authorizes.
