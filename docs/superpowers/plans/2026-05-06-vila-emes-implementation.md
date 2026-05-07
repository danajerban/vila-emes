# Vila Emes Site Implementation Plan

> ⚠️ **REVISIONS APPLY (2026-05-07):** before executing any task in this file, read `2026-05-07-vila-emes-implementation-revisions.md` (sibling file). It supersedes ~20 of the 34 tasks below with new code reflecting the locked design draft (sunset palette, 11-room taxonomy, Caveat font, FAQ, trust strip, page heroes, hand-drawn map, mailto contact form, centralized `src/config/site.ts`). The revisions doc has a per-task index — for any task listed there, use the v2 version. For tasks NOT listed, use the v1 body below.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static, multilingual marketing site for Vila Emes (a small family hotel in Durrës, Albania) — three pages × four languages, optimized photos, deployed to Cloudflare Pages.

**Architecture:** Astro 5 static site. One YAML content file per locale (EN/AL/IT/DE) loaded via Astro Content Collections. Photos are pre-optimized to WebP via a one-shot Sharp script. Components are pure Astro (no client framework); minimal vanilla TS only for the gallery lightbox and language-switcher dropdown. Tailwind v4 (CSS-first config) for styling. No reservation logic — every booking CTA links to Booking.com.

**Tech Stack:** Astro 5.x, Tailwind v4 (via `@tailwindcss/vite`), Sharp 0.33+, `@fontsource-variable/cormorant-garamond` + `@fontsource-variable/inter`, TypeScript strict, GitHub + Cloudflare Pages.

**Spec:** `docs/superpowers/specs/2026-05-06-vila-emes-site-design.md`

**Testing approach:** This is a content-driven static site with no business logic. We do **not** add a unit-test framework. Verification at every checkpoint is:
1. `npm run build` — catches Zod schema errors, type errors, broken imports.
2. `npm run dev` — visit the affected URL and visually verify the section renders.
3. Final acceptance — Lighthouse + responsive checks at 360 px and 1440 px.

This is a deliberate scope decision; the spec's acceptance criteria are coverage-equivalent to a test suite for this kind of project.

---

## File Structure

```
hotel-vila-emes/
├── docs/
│   ├── superpowers/
│   │   ├── specs/2026-05-06-vila-emes-site-design.md   ← exists
│   │   └── plans/2026-05-06-vila-emes-implementation.md ← this file
│   └── photos-shortlist.md                              ← Task 31
├── scripts/
│   └── optimize-photos.mjs                              ← Task 6
├── public/
│   └── favicon.svg                                      ← from Astro template
├── src/
│   ├── assets/
│   │   ├── logo.svg                                     ← Task 7 (copy)
│   │   ├── logo-og.png                                  ← Task 7 (copy)
│   │   └── photos/
│   │       ├── main/        *.webp                     ← Task 7 (script output)
│   │       ├── deluxe/      *.webp
│   │       ├── apartment-1plus1/  *.webp
│   │       ├── apartment-2plus1/  *.webp
│   │       ├── standard/    *.webp
│   │       └── beach/       *.webp
│   ├── content/
│   │   └── site/
│   │       ├── en.yaml                                  ← Task 9
│   │       ├── al.yaml                                  ← Task 10 (copy of en)
│   │       ├── it.yaml                                  ← Task 10
│   │       └── de.yaml                                  ← Task 10
│   ├── content.config.ts                                ← Task 8
│   ├── i18n/
│   │   ├── locales.ts                                   ← Task 11 (LOCALES, LOCALE_TO_LANG)
│   │   └── content.ts                                   ← Task 11 (getSite helper)
│   ├── styles/
│   │   └── global.css                                   ← Task 3
│   ├── layouts/
│   │   └── Base.astro                                   ← Task 13
│   ├── components/
│   │   ├── LangSwitch.astro                             ← Task 14
│   │   ├── Header.astro                                 ← Task 15
│   │   ├── Footer.astro                                 ← Task 16
│   │   ├── Amenity.astro                                ← Task 17
│   │   ├── Hero.astro                                   ← Task 18
│   │   ├── About.astro                                  ← Task 19
│   │   ├── RoomCard.astro                               ← Task 20
│   │   ├── RoomDetails.astro                            ← Task 21
│   │   ├── Gallery.astro                                ← Task 22
│   │   ├── LocationMap.astro                            ← Task 23
│   │   └── ContactStrip.astro                           ← Task 24
│   ├── views/
│   │   ├── HomeView.astro                               ← Task 25
│   │   ├── RoomsView.astro                              ← Task 26
│   │   └── ContactView.astro                            ← Task 27
│   ├── pages/
│   │   ├── index.astro                                  ← Task 28 (EN, /)
│   │   ├── rooms.astro                                  ← Task 28
│   │   ├── contact.astro                                ← Task 28
│   │   ├── al/{index,rooms,contact}.astro               ← Task 29
│   │   ├── it/{index,rooms,contact}.astro               ← Task 29
│   │   └── de/{index,rooms,contact}.astro               ← Task 29
│   └── env.d.ts                                          ← from Astro template
├── astro.config.mjs                                     ← Task 12
├── package.json                                         ← Task 1
├── tsconfig.json                                        ← from template
├── .gitignore                                           ← Task 32 (polish)
└── README.md                                            ← Task 32
```

---

## Phase 1 — Bootstrap

### Task 1: Scaffold Astro project into the existing folder

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/env.d.ts`, `public/favicon.svg`, `src/pages/index.astro` (will be overwritten later).

The folder is non-empty (it already contains `docs/`). Astro's CLI will warn — pass `--yes` to accept defaults and continue.

- [ ] **Step 1: Run the Astro create command**

```bash
cd /Users/erbandanaj/Downloads/xCode/hotel-vila-emes
npm create astro@latest . -- --template minimal --typescript strict --install --no-git --yes
```

Expected: dependencies installed, `package.json`, `astro.config.mjs`, `src/pages/index.astro` (default placeholder) created. The CLI prints "Liftoff confirmed."

If the CLI refuses because the folder isn't empty, abort. Move `docs/` aside temporarily:
```bash
mv docs /tmp/vila-emes-docs-backup
npm create astro@latest . -- --template minimal --typescript strict --install --no-git --yes
mv /tmp/vila-emes-docs-backup docs
```

- [ ] **Step 2: Verify dev server starts**

```bash
npm run dev
```

Expected: server starts on `http://localhost:4321`, default Astro page renders. Stop the server (Ctrl-C).

- [ ] **Step 3: Initialize git**

```bash
git init -b main
echo "node_modules/
dist/
.astro/
.DS_Store
" > .gitignore
git add .
git commit -m "chore: scaffold astro project"
```

Expected: first commit created, `git status` shows clean tree.

---

### Task 2: Add Tailwind v4

**Files:**
- Modify: `astro.config.mjs`, `package.json`
- Create: `src/styles/global.css`

- [ ] **Step 1: Run the Astro Tailwind integration**

```bash
npx astro add tailwind --yes
```

Expected: this installs `tailwindcss` and `@tailwindcss/vite`, edits `astro.config.mjs` to register the Vite plugin, and creates `src/styles/global.css` containing `@import "tailwindcss";`.

- [ ] **Step 2: Verify**

```bash
cat astro.config.mjs
cat src/styles/global.css
```

Expected: `astro.config.mjs` shows a `vite: { plugins: [tailwindcss()] }` block. `global.css` starts with `@import "tailwindcss";`.

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "chore: add tailwind v4 via @tailwindcss/vite"
```

---

### Task 3: Define theme tokens (warm Mediterranean palette + fonts)

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Replace the contents of `src/styles/global.css`**

```css
@import "tailwindcss";
@import "@fontsource-variable/cormorant-garamond";
@import "@fontsource-variable/inter";

@theme {
  --color-cream:      #FAF6EE;
  --color-ink:        #1F1A14;
  --color-terracotta: #C25B3F;
  --color-sea-blue:   #2E5C7E;
  --color-muted:      #8C7E6A;
  --color-border:     #E8DFCF;

  --font-serif: "Cormorant Garamond Variable", Georgia, serif;
  --font-sans:  "Inter Variable", system-ui, sans-serif;
}

@layer base {
  html {
    background: var(--color-cream);
    color: var(--color-ink);
    font-family: var(--font-sans);
    font-size: 17px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4 {
    font-family: var(--font-serif);
    font-weight: 500;
    letter-spacing: -0.005em;
    line-height: 1.15;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  img {
    display: block;
    max-width: 100%;
  }
}
```

- [ ] **Step 2: Install fontsource packages**

```bash
npm install @fontsource-variable/cormorant-garamond @fontsource-variable/inter
```

Expected: both packages added to `package.json`.

- [ ] **Step 3: Smoke-test by injecting global.css into the default page**

Edit `src/pages/index.astro` to import the stylesheet (it's a placeholder that we'll replace later — this is just to verify Tailwind + fonts compile):

```astro
---
import "../styles/global.css";
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Vila Emes — bootstrap test</title>
  </head>
  <body class="bg-cream text-ink">
    <h1 class="text-5xl text-terracotta">Vila Emes</h1>
    <p class="text-muted">If you can read this in serif terracotta on cream, the theme works.</p>
  </body>
</html>
```

- [ ] **Step 4: Run dev server and verify**

```bash
npm run dev
```

Open `http://localhost:4321`. Expected: cream background, serif heading "Vila Emes" in terracotta, subline in muted taupe. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat(style): add warm-mediterranean palette and font stack"
```

---

### Task 4: Install Sharp for the photo pipeline

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install**

```bash
npm install --save-dev sharp@^0.33
```

- [ ] **Step 2: Verify**

```bash
node -e "console.log(require('sharp')().constructor.name)"
```

Expected: `Sharp` prints. (If you see a native-binary error, run `npm rebuild sharp`.)

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add sharp for photo optimization"
```

---

## Phase 2 — Photo Pipeline

### Task 5: Write the photo-optimization script

**Files:**
- Create: `scripts/optimize-photos.mjs`

The script reads from `/Users/erbandanaj/Downloads/Emes/` (outside the repo), produces three sizes (`800`, `1600`, `2400` px on the longest edge) of WebP per source image, strips EXIF, and writes to `src/assets/photos/<category>/<basename>-<size>.webp`.

Source-folder → category mapping:

| Source path | Category folder |
|---|---|
| `Main/*.{jpg,jpeg,JPG,JPEG,png}` | `main` |
| `Main/Beach.jpg` | `beach` (overrides above for that one file) |
| `101/*`, `102/*`, `103/*` | `deluxe` |
| `1+1/*` | `apartment-1plus1` |
| `2+1/*` | `apartment-2plus1` |
| `301/*` … `306/*` | `standard` |

Logo files (`Logo/Vila Emes.svg`, `Logo/Vila Emes.png`) are **not** processed by Sharp — they're copied verbatim by Task 7.

- [ ] **Step 1: Create the script**

```javascript
// scripts/optimize-photos.mjs
import sharp from "sharp";
import { mkdir, readdir, copyFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const SOURCE_ROOT = "/Users/erbandanaj/Downloads/Emes";
const OUTPUT_ROOT = path.resolve(import.meta.dirname, "../src/assets/photos");

const SIZES = [800, 1600, 2400];
const QUALITY = 82;

// source folder name → output category folder
const FOLDER_MAP = {
  "Main":  "main",
  "101":   "deluxe",
  "102":   "deluxe",
  "103":   "deluxe",
  "1+1":   "apartment-1plus1",
  "2+1":   "apartment-2plus1",
  "301":   "standard",
  "302":   "standard",
  "303":   "standard",
  "304":   "standard",
  "305":   "standard",
  "306":   "standard",
};

// special-case: this one file inside Main/ goes to its own category
const SPECIAL_FILES = {
  "Beach.jpg": "beach",
};

const IMAGE_EXT = /\.(jpe?g|png)$/i;

async function ensureDir(p) {
  await mkdir(p, { recursive: true });
}

async function processOne(srcAbs, categoryDefault) {
  const filename = path.basename(srcAbs);
  const category = SPECIAL_FILES[filename] ?? categoryDefault;
  const baseNoExt = filename.replace(IMAGE_EXT, "");
  const outDir = path.join(OUTPUT_ROOT, category);
  await ensureDir(outDir);

  // sanitize filename: replace spaces and parens with hyphens
  const safeBase = baseNoExt.replace(/[^A-Za-z0-9._-]+/g, "-");

  for (const size of SIZES) {
    const outPath = path.join(outDir, `${safeBase}-${size}.webp`);
    if (existsSync(outPath)) continue; // idempotent: skip already-done
    await sharp(srcAbs)
      .rotate()                          // honor EXIF orientation, then strip
      .resize({ width: size, height: size, fit: "inside", withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 5 })
      .toFile(outPath);
    process.stdout.write(`  → ${path.relative(OUTPUT_ROOT, outPath)}\n`);
  }
}

async function processFolder(srcFolderAbs, category) {
  const entries = await readdir(srcFolderAbs);
  const images = entries.filter((e) => IMAGE_EXT.test(e));
  console.log(`\n[${category}]  ${srcFolderAbs}  (${images.length} files)`);
  for (const name of images) {
    const abs = path.join(srcFolderAbs, name);
    const s = await stat(abs);
    if (!s.isFile()) continue;
    await processOne(abs, category);
  }
}

async function main() {
  await ensureDir(OUTPUT_ROOT);

  for (const [folderName, category] of Object.entries(FOLDER_MAP)) {
    const abs = path.join(SOURCE_ROOT, folderName);
    if (!existsSync(abs)) {
      console.warn(`(skip) source folder missing: ${abs}`);
      continue;
    }
    await processFolder(abs, category);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Add an npm script**

Edit `package.json`, add to `"scripts"`:

```json
"optimize:photos": "node scripts/optimize-photos.mjs"
```

(Keep all existing scripts intact.)

- [ ] **Step 3: Commit**

```bash
git add scripts/optimize-photos.mjs package.json
git commit -m "feat(scripts): add sharp-based photo optimizer"
```

---

### Task 6: Run the photo pipeline and copy logo

**Files:**
- Create: many `.webp` files under `src/assets/photos/<category>/`
- Create: `src/assets/logo.svg`, `src/assets/logo-og.png`

- [ ] **Step 1: Run the optimizer**

```bash
npm run optimize:photos
```

Expected: prints one line per `[category] folder` then one `→` line per output file. ~80 input images × 3 sizes = ~240 webp files. Runtime: 2–4 minutes on Apple Silicon.

- [ ] **Step 2: Verify output**

```bash
find src/assets/photos -name "*.webp" | wc -l
du -sh src/assets/photos
```

Expected: counts match the source images × 3 sizes (roughly 200–250 files); total directory size 30–60 MB.

- [ ] **Step 3: Copy the logo files**

```bash
cp "/Users/erbandanaj/Downloads/Emes/Logo/Vila Emes.svg" src/assets/logo.svg
cp "/Users/erbandanaj/Downloads/Emes/Logo/Vila Emes.png" src/assets/logo-og.png
```

Verify:
```bash
ls -la src/assets/logo.svg src/assets/logo-og.png
```

- [ ] **Step 4: Commit**

```bash
git add src/assets/
git commit -m "feat(assets): add optimized photos and logo"
```

(This commit will be ~30–60 MB — fine for one commit; the photos are now versioned.)

---

## Phase 3 — Content Layer

### Task 7: Define the content collection schema

**Files:**
- Create: `src/content.config.ts`

- [ ] **Step 1: Write the schema**

```typescript
// src/content.config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const amenityKey = z.enum([
  "air-con",
  "wifi",
  "tv",
  "private-bath",
  "sea-view",
  "balcony",
  "kitchen",
  "living-area",
  "two-bedrooms",
]);

const room = z.object({
  id: z.string(),
  name: z.string(),
  count: z.number().int().positive(),
  capacity: z.string(),
  description: z.string(),
  amenities: z.array(amenityKey),
});

const site = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/site" }),
  schema: z.object({
    hotel: z.object({
      name: z.string(),
      tagline: z.string(),
      location: z.string(),
    }),
    contact: z.object({
      phone: z.string(),
      email: z.string(),
      whatsapp: z.string(),
      address: z.string(),
      reception_hours: z.string(),
    }),
    links: z.object({
      booking_com: z.string().url(),
      instagram: z.string().url(),
      google_maps: z.string().url(),
      google_maps_embed: z.string().url(),
    }),
    home: z.object({
      hero: z.object({
        heading: z.string(),
        sub: z.string(),
        cta_primary: z.string(),
        cta_secondary: z.string(),
      }),
      about: z.object({
        heading: z.string(),
        body: z.string(),
      }),
      location_blurb: z.string(),
    }),
    rooms: z.array(room).min(1),
    ui: z.object({
      nav: z.object({ home: z.string(), rooms: z.string(), contact: z.string() }),
      buttons: z.object({
        book: z.string(),
        map: z.string(),
        details: z.string(),
        directions: z.string(),
      }),
      labels: z.object({
        sleeps: z.string(),
        rooms_count: z.string(), // template like "{n} rooms"
        amenities: z.string(),
        find_us: z.string(),
        contact: z.string(),
        gallery: z.string(),
        location: z.string(),
      }),
    }),
  }),
});

export const collections = { site };
```

- [ ] **Step 2: Verify the file is type-checked**

```bash
npx astro check
```

Expected: `0 errors, 0 warnings, 0 hints` (or "no content found" — fine, content arrives in Task 8).

- [ ] **Step 3: Commit**

```bash
git add src/content.config.ts
git commit -m "feat(content): define site collection schema"
```

---

### Task 8: Author the English content file

**Files:**
- Create: `src/content/site/en.yaml`

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p src/content/site
```

Then write `src/content/site/en.yaml`:

```yaml
hotel:
  name: "Vila Emes"
  tagline: "A small family hotel by the sea"
  location: "Durrës, Albania"

contact:
  phone: "+355 00 000 0000"
  email: "info@vilaemes.com"
  whatsapp: "+355 00 000 0000"
  address: "Durrës, Albania"
  reception_hours: "Reception 08:00 – 23:00"

links:
  booking_com: "https://www.booking.com/hotel/al/vila-emes.html"
  instagram:   "https://instagram.com/vilaemes"
  google_maps: "https://maps.app.goo.gl/PLACEHOLDER"
  google_maps_embed: "https://www.google.com/maps/embed?pb=PLACEHOLDER"

home:
  hero:
    heading: "Welcome to Vila Emes"
    sub: "A family-run hotel steps from the Adriatic, in Durrës, Albania."
    cta_primary: "Book on Booking.com"
    cta_secondary: "Open in Maps"
  about:
    heading: "About"
    body: |
      [PASTE: 'About this property' from Booking.com listing]
  location_blurb: "30 km from Tirana International Airport. 200 m to the beach."

rooms:
  - id: "deluxe"
    name: "Deluxe Room"
    count: 3
    capacity: "Sleeps 2–3"
    description: "[PASTE: deluxe room description from Booking.com]"
    amenities:
      - "air-con"
      - "sea-view"
      - "private-bath"
      - "tv"
      - "wifi"

  - id: "apartment-1plus1"
    name: "1+1 Apartment"
    count: 1
    capacity: "Sleeps 2–4"
    description: "[PASTE: 1+1 apartment description from Booking.com]"
    amenities:
      - "kitchen"
      - "living-area"
      - "air-con"
      - "wifi"
      - "balcony"

  - id: "apartment-2plus1"
    name: "2+1 Apartment"
    count: 1
    capacity: "Sleeps 4–6"
    description: "[PASTE: 2+1 apartment description from Booking.com]"
    amenities:
      - "kitchen"
      - "two-bedrooms"
      - "living-area"
      - "air-con"
      - "wifi"
      - "balcony"

  - id: "standard"
    name: "Standard Room"
    count: 12
    capacity: "Sleeps 2"
    description: "[PASTE: standard room description from Booking.com]"
    amenities:
      - "air-con"
      - "private-bath"
      - "tv"
      - "wifi"

ui:
  nav:
    home: "Home"
    rooms: "Rooms"
    contact: "Contact"
  buttons:
    book: "Book on Booking.com"
    map: "Open in Maps"
    details: "View details"
    directions: "Get directions"
  labels:
    sleeps: "Sleeps"
    rooms_count: "{n} rooms"
    amenities: "Amenities"
    find_us: "Find us"
    contact: "Contact"
    gallery: "Gallery"
    location: "Location"
```

- [ ] **Step 2: Verify schema acceptance**

```bash
npx astro check
```

Expected: `0 errors`. If Zod rejects, fix the YAML and re-run.

- [ ] **Step 3: Commit**

```bash
git add src/content/site/en.yaml
git commit -m "feat(content): add English site content with paste placeholders"
```

---

### Task 9: Seed AL/IT/DE content as copies of English

**Files:**
- Create: `src/content/site/al.yaml`, `it.yaml`, `de.yaml`

- [ ] **Step 1: Copy**

```bash
cp src/content/site/en.yaml src/content/site/al.yaml
cp src/content/site/en.yaml src/content/site/it.yaml
cp src/content/site/en.yaml src/content/site/de.yaml
```

- [ ] **Step 2: Verify all four entries load**

```bash
npx astro check
```

Expected: `0 errors`. The content collection now contains four entries: `en`, `al`, `it`, `de`.

- [ ] **Step 3: Commit**

```bash
git add src/content/site/
git commit -m "feat(content): seed al/it/de content as english copies (owner translates later)"
```

---

### Task 10: Add the i18n helpers (locales + content getter)

**Files:**
- Create: `src/i18n/locales.ts`, `src/i18n/content.ts`

- [ ] **Step 1: Locale constants**

Write `src/i18n/locales.ts`:

```typescript
// src/i18n/locales.ts
export const LOCALES = ["en", "al", "it", "de"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

// URL-prefix locale → ISO 639-1 language code for HTML lang attribute.
// "al" is a country code (intuitive URL); "sq" is the ISO language code (correct for SEO/a11y).
export const LOCALE_TO_LANG: Record<Locale, string> = {
  en: "en",
  al: "sq",
  it: "it",
  de: "de",
};

export const LOCALE_LABEL: Record<Locale, string> = {
  en: "EN",
  al: "AL",
  it: "IT",
  de: "DE",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** Returns the URL prefix for a locale, with leading slash. Default locale = "". */
export function localePrefix(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? "" : `/${locale}`;
}
```

- [ ] **Step 2: Content getter**

Write `src/i18n/content.ts`:

```typescript
// src/i18n/content.ts
import { getEntry } from "astro:content";
import type { Locale } from "./locales";

/** Returns the typed content entry for a given locale. */
export async function getSite(locale: Locale) {
  const entry = await getEntry("site", locale);
  if (!entry) {
    throw new Error(`Site content for locale "${locale}" not found`);
  }
  return entry;
}
```

- [ ] **Step 3: Verify**

```bash
npx astro check
```

Expected: `0 errors`.

- [ ] **Step 4: Commit**

```bash
git add src/i18n/
git commit -m "feat(i18n): add locale constants and site-content getter"
```

---

## Phase 4 — Astro Config

### Task 11: Configure Astro i18n routing and site URL

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1: Replace `astro.config.mjs`**

```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// TODO: replace with the real domain when purchased
const SITE = "https://vila-emes.pages.dev";

export default defineConfig({
  site: SITE,
  i18n: {
    defaultLocale: "en",
    locales: ["en", "al", "it", "de"],
  },
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    // Sharp is already a dep; Astro will use it automatically for <Image>.
    service: { entrypoint: "astro/assets/services/sharp" },
  },
});
```

- [ ] **Step 2: Verify build still works**

```bash
npm run build
```

Expected: builds the placeholder home page successfully. Output in `dist/`.

- [ ] **Step 3: Commit**

```bash
git add astro.config.mjs
git commit -m "feat: configure i18n locales and site url"
```

---

## Phase 5 — Layout & Shared Components

### Task 12: Base layout

**Files:**
- Create: `src/layouts/Base.astro`

The layout owns `<html>`, head, fonts, meta, and the page chrome (Header + Footer). Pages pass `locale` and `site` (the content entry).

- [ ] **Step 1: Write `src/layouts/Base.astro`**

```astro
---
// src/layouts/Base.astro
import "../styles/global.css";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
import { LOCALE_TO_LANG, type Locale } from "../i18n/locales";
import logoOg from "../assets/logo-og.png";

interface Props {
  locale: Locale;
  site: any;            // typed via collection schema; loose here to keep slot transparent
  title: string;        // <title>
  description?: string;
  pathname: string;     // current pathname like "/", "/rooms", "/al/contact"
}

const { locale, site, title, description, pathname } = Astro.props;
const lang = LOCALE_TO_LANG[locale];
const desc = description ?? site.data.hotel.tagline;
const canonical = new URL(pathname, Astro.site).toString();
---
<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="generator" content={Astro.generator} />
    <title>{title}</title>
    <meta name="description" content={desc} />
    <link rel="canonical" href={canonical} />

    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={desc} />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={new URL(logoOg.src, Astro.site).toString()} />

    <link rel="icon" href="/favicon.svg" />
  </head>
  <body class="min-h-screen flex flex-col">
    <Header locale={locale} site={site} pathname={pathname} />
    <main class="flex-1">
      <slot />
    </main>
    <Footer locale={locale} site={site} />
  </body>
</html>
```

- [ ] **Step 2: Verify**

```bash
npx astro check
```

Expected: `0 errors`. (We will see warnings about Header/Footer not existing yet; fine — next tasks add them. If `astro check` errors out hard on missing imports, defer this verification to after Task 14.)

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Base.astro
git commit -m "feat(layout): add base layout with og meta and canonical url"
```

---

### Task 13: LangSwitch component

**Files:**
- Create: `src/components/LangSwitch.astro`

The switcher displays four labels (EN/AL/IT/DE). Clicking a label takes the user to the same path under the target locale's prefix. Logic to compute "same path under different locale" lives here.

- [ ] **Step 1: Write `src/components/LangSwitch.astro`**

```astro
---
// src/components/LangSwitch.astro
import { LOCALES, LOCALE_LABEL, DEFAULT_LOCALE, type Locale } from "../i18n/locales";

interface Props {
  current: Locale;
  pathname: string;
}

const { current, pathname } = Astro.props;

/**
 * Strip any leading "/<locale>" segment if present.
 * "/al/rooms" → "/rooms"
 * "/rooms"    → "/rooms"
 * "/"         → "/"
 */
function stripLocale(path: string): string {
  const m = path.match(/^\/(en|al|it|de)(\/|$)/);
  if (!m) return path;
  const remainder = path.slice(m[0].length - (m[2] === "/" ? 1 : 0));
  return remainder === "" ? "/" : remainder;
}

function buildHref(target: Locale, path: string): string {
  const base = stripLocale(path);
  if (target === DEFAULT_LOCALE) return base;
  return base === "/" ? `/${target}/` : `/${target}${base}`;
}
---
<nav aria-label="Language" class="flex items-center gap-2 text-sm tracking-wide">
  {LOCALES.map((loc) => (
    <a
      href={buildHref(loc, pathname)}
      class:list={[
        "px-1 uppercase",
        loc === current
          ? "text-(--color-ink) font-medium underline underline-offset-4"
          : "text-(--color-muted) hover:text-(--color-ink)",
      ]}
      aria-current={loc === current ? "true" : undefined}
    >
      {LOCALE_LABEL[loc]}
    </a>
  ))}
</nav>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/LangSwitch.astro
git commit -m "feat(i18n): add language switcher component"
```

---

### Task 14: Header component

**Files:**
- Create: `src/components/Header.astro`

- [ ] **Step 1: Write `src/components/Header.astro`**

```astro
---
// src/components/Header.astro
import LangSwitch from "./LangSwitch.astro";
import type { Locale } from "../i18n/locales";
import { localePrefix } from "../i18n/locales";

interface Props {
  locale: Locale;
  site: any;
  pathname: string;
}

const { locale, site, pathname } = Astro.props;
const prefix = localePrefix(locale);
const nav = [
  { href: `${prefix}/`,        label: site.data.ui.nav.home },
  { href: `${prefix}/rooms`,   label: site.data.ui.nav.rooms },
  { href: `${prefix}/contact`, label: site.data.ui.nav.contact },
];
---
<header class="sticky top-0 z-30 backdrop-blur-sm bg-[color:var(--color-cream)]/85 border-b border-[color:var(--color-border)]">
  <div class="max-w-6xl mx-auto px-5 py-4 flex items-center gap-6">
    <a href={`${prefix}/`} class="font-serif text-2xl tracking-wide text-(--color-ink)">
      Vila Emes
    </a>
    <nav class="hidden md:flex items-center gap-6 text-sm tracking-wide ml-4" aria-label="Primary">
      {nav.map((item) => (
        <a
          href={item.href}
          class:list={[
            "uppercase",
            item.href === pathname
              ? "text-(--color-ink) underline underline-offset-4"
              : "text-(--color-muted) hover:text-(--color-ink)",
          ]}
        >
          {item.label}
        </a>
      ))}
    </nav>
    <div class="ml-auto">
      <LangSwitch current={locale} pathname={pathname} />
    </div>
  </div>
</header>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat(layout): add sticky header with primary nav and lang switch"
```

---

### Task 15: Footer component

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Write `src/components/Footer.astro`**

```astro
---
// src/components/Footer.astro
import LangSwitch from "./LangSwitch.astro";
import type { Locale } from "../i18n/locales";

interface Props {
  locale: Locale;
  site: any;
}
const { locale, site } = Astro.props;
const year = new Date().getFullYear();
---
<footer class="border-t border-[color:var(--color-border)] mt-24">
  <div class="max-w-6xl mx-auto px-5 py-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
    <p class="font-serif text-lg text-(--color-ink)">{site.data.hotel.name}</p>
    <p class="text-sm text-(--color-muted)">
      © {year} {site.data.hotel.name} · {site.data.hotel.location}
    </p>
    <div class="md:hidden">
      <LangSwitch current={locale} pathname={Astro.url.pathname} />
    </div>
  </div>
</footer>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat(layout): add footer with copyright and mobile lang switch"
```

---

### Task 16: Amenity component (icon + label)

**Files:**
- Create: `src/components/Amenity.astro`

- [ ] **Step 1: Write `src/components/Amenity.astro`**

```astro
---
// src/components/Amenity.astro
interface Props {
  kind:
    | "air-con"
    | "wifi"
    | "tv"
    | "private-bath"
    | "sea-view"
    | "balcony"
    | "kitchen"
    | "living-area"
    | "two-bedrooms";
  label: string;
}
const { kind, label } = Astro.props;

// Lightweight inline SVG glyphs (24×24, currentColor stroke).
const PATHS: Record<Props["kind"], string> = {
  "air-con":      "M3 7h18M3 12h18M3 17h18",
  "wifi":         "M5 12a10 10 0 0114 0M8 15.5a5 5 0 018 0M12 19h.01",
  "tv":           "M3 5h18v12H3zM8 21h8M12 17v4",
  "private-bath": "M4 11h16v3a4 4 0 01-4 4H8a4 4 0 01-4-4v-3zM7 11V6a3 3 0 016 0",
  "sea-view":     "M2 16c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2M4 8h2M9 8h2M14 8h2M19 8h1",
  "balcony":      "M4 21h16M5 21V11h14v10M9 11V7h6v4M3 21V11M21 21V11",
  "kitchen":      "M5 3h14v18H5zM5 9h14M9 5v2M15 5v2",
  "living-area":  "M3 18v-3a2 2 0 012-2h14a2 2 0 012 2v3M5 13V9a2 2 0 012-2h10a2 2 0 012 2v4M5 18v3M19 18v3",
  "two-bedrooms": "M3 18h18M3 14a2 2 0 012-2h4v6H3zM15 12h4a2 2 0 012 2v4h-6v-6z",
};
const d = PATHS[kind];
---
<span class="inline-flex items-center gap-2 text-sm text-(--color-ink)">
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
  <span>{label}</span>
</span>
```

- [ ] **Step 2: Add a translation map for amenity labels**

We need to display the label in the current locale. The amenities array in YAML is `kind`-only; the label comes from a per-locale label map.

Edit `src/content/site/en.yaml` and **append** a new top-level key (after `ui:`):

```yaml
amenities:
  air-con:       "Air conditioning"
  wifi:          "Wi-Fi"
  tv:            "TV"
  private-bath:  "Private bathroom"
  sea-view:      "Sea view"
  balcony:       "Balcony"
  kitchen:       "Kitchen"
  living-area:   "Living area"
  two-bedrooms:  "Two bedrooms"
```

Repeat the same `amenities` block in `al.yaml`, `it.yaml`, `de.yaml` (they all start as English copies — owner translates later).

- [ ] **Step 3: Update the schema in `src/content.config.ts`**

Add this block inside the `schema: z.object({ ... })` (after `ui:`):

```typescript
    amenities: z.record(amenityKey, z.string()),
```

- [ ] **Step 4: Verify**

```bash
npx astro check
```

Expected: `0 errors`.

- [ ] **Step 5: Commit**

```bash
git add src/components/Amenity.astro src/content/ src/content.config.ts
git commit -m "feat(components): add amenity icon component with i18n labels"
```

---

## Phase 6 — Section Components

### Task 17: Hero component

**Files:**
- Create: `src/components/Hero.astro`

- [ ] **Step 1: Write `src/components/Hero.astro`**

```astro
---
// src/components/Hero.astro
import { Image } from "astro:assets";
import type { ImageMetadata } from "astro";

interface Props {
  cover: ImageMetadata;
  heading: string;
  sub: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
}
const { cover, heading, sub, ctaPrimary, ctaSecondary } = Astro.props;
---
<section class="relative isolate min-h-[78vh] flex items-end overflow-hidden">
  <Image
    src={cover}
    alt=""
    width={2400}
    quality={82}
    loading="eager"
    fetchpriority="high"
    class="absolute inset-0 w-full h-full object-cover"
  />
  <div class="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" aria-hidden="true"></div>
  <div class="relative max-w-6xl mx-auto px-5 pb-16 md:pb-24 text-cream">
    <h1 class="font-serif text-5xl md:text-7xl text-[color:var(--color-cream)] max-w-3xl">{heading}</h1>
    <p class="mt-4 text-lg md:text-xl text-[color:var(--color-cream)]/90 max-w-2xl">{sub}</p>
    <div class="mt-8 flex flex-wrap gap-3">
      <a
        href={ctaPrimary.href}
        target="_blank" rel="noopener"
        class="inline-flex items-center px-6 py-3 bg-[color:var(--color-terracotta)] text-[color:var(--color-cream)] font-medium tracking-wide rounded-md hover:opacity-90 transition"
      >
        {ctaPrimary.label}
      </a>
      <a
        href={ctaSecondary.href}
        target="_blank" rel="noopener"
        class="inline-flex items-center px-6 py-3 border border-[color:var(--color-cream)]/80 text-[color:var(--color-cream)] font-medium tracking-wide rounded-md hover:bg-[color:var(--color-cream)]/10 transition"
      >
        {ctaSecondary.label}
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat(components): add hero with full-bleed image and dual ctas"
```

---

### Task 18: About component

**Files:**
- Create: `src/components/About.astro`

- [ ] **Step 1: Write `src/components/About.astro`**

```astro
---
// src/components/About.astro
import { Image } from "astro:assets";
import type { ImageMetadata } from "astro";

interface Props {
  heading: string;
  body: string;
  photo: ImageMetadata;
  photoAlt: string;
}
const { heading, body, photo, photoAlt } = Astro.props;
---
<section class="max-w-6xl mx-auto px-5 py-20 md:py-28 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
  <div>
    <h2 class="font-serif text-4xl md:text-5xl text-(--color-ink)">{heading}</h2>
    <div class="mt-6 text-(--color-ink)/85 whitespace-pre-line max-w-prose">{body}</div>
  </div>
  <Image
    src={photo}
    alt={photoAlt}
    width={1200}
    quality={82}
    class="w-full h-full max-h-[520px] object-cover rounded-md"
  />
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/About.astro
git commit -m "feat(components): add about section with side-by-side text and photo"
```

---

### Task 19: RoomCard component (home preview)

**Files:**
- Create: `src/components/RoomCard.astro`

- [ ] **Step 1: Write `src/components/RoomCard.astro`**

```astro
---
// src/components/RoomCard.astro
import { Image } from "astro:assets";
import type { ImageMetadata } from "astro";

interface Props {
  href: string;
  photo: ImageMetadata;
  name: string;
  capacity: string;
  countLabel: string;       // e.g. "3 rooms"
  detailsLabel: string;     // e.g. "View details"
}
const { href, photo, name, capacity, countLabel, detailsLabel } = Astro.props;
---
<a
  href={href}
  class="group block overflow-hidden rounded-md border border-[color:var(--color-border)] bg-white/40 hover:bg-white/70 transition"
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
    <h3 class="font-serif text-2xl text-(--color-ink)">{name}</h3>
    <p class="mt-1 text-sm text-(--color-muted)">{capacity} · {countLabel}</p>
    <p class="mt-3 text-sm text-(--color-terracotta)">{detailsLabel} →</p>
  </div>
</a>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/RoomCard.astro
git commit -m "feat(components): add room preview card"
```

---

### Task 20: RoomDetails component (rooms page section)

**Files:**
- Create: `src/components/RoomDetails.astro`

- [ ] **Step 1: Write `src/components/RoomDetails.astro`**

```astro
---
// src/components/RoomDetails.astro
import { Image } from "astro:assets";
import type { ImageMetadata } from "astro";
import Amenity from "./Amenity.astro";

type AmenityKind =
  | "air-con" | "wifi" | "tv" | "private-bath" | "sea-view"
  | "balcony" | "kitchen" | "living-area" | "two-bedrooms";

interface Props {
  id: string;
  name: string;
  capacity: string;
  countLabel: string;
  description: string;
  amenities: { kind: AmenityKind; label: string }[];
  photos: ImageMetadata[];
  bookHref: string;
  bookLabel: string;
  amenitiesLabel: string;
}
const { id, name, capacity, countLabel, description, amenities, photos, bookHref, bookLabel, amenitiesLabel } = Astro.props;
---
<section id={id} class="max-w-6xl mx-auto px-5 py-20 border-t border-[color:var(--color-border)] first:border-0">
  <div class="md:flex md:items-end md:justify-between gap-6">
    <div>
      <h2 class="font-serif text-4xl md:text-5xl text-(--color-ink)">{name}</h2>
      <p class="mt-2 text-(--color-muted)">{capacity} · {countLabel}</p>
    </div>
    <a
      href={bookHref}
      target="_blank" rel="noopener"
      class="hidden md:inline-flex mt-4 md:mt-0 px-5 py-3 bg-(--color-terracotta) text-(--color-cream) rounded-md hover:opacity-90 transition"
    >
      {bookLabel}
    </a>
  </div>

  <p class="mt-6 max-w-prose text-(--color-ink)/85 whitespace-pre-line">{description}</p>

  <div class="mt-6">
    <p class="text-sm uppercase tracking-wide text-(--color-muted) mb-3">{amenitiesLabel}</p>
    <ul class="flex flex-wrap gap-x-6 gap-y-3">
      {amenities.map((a) => (
        <li><Amenity kind={a.kind} label={a.label} /></li>
      ))}
    </ul>
  </div>

  <div class="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
    {photos.map((p) => (
      <Image
        src={p}
        alt={name}
        width={900}
        quality={82}
        class="aspect-[4/3] object-cover rounded-md w-full h-full"
      />
    ))}
  </div>

  <a
    href={bookHref}
    target="_blank" rel="noopener"
    class="md:hidden inline-flex mt-8 px-5 py-3 bg-(--color-terracotta) text-(--color-cream) rounded-md"
  >
    {bookLabel}
  </a>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/RoomDetails.astro
git commit -m "feat(components): add room-details section for rooms page"
```

---

### Task 21: Gallery component (masonry + lightbox)

**Files:**
- Create: `src/components/Gallery.astro`

- [ ] **Step 1: Write `src/components/Gallery.astro`**

```astro
---
// src/components/Gallery.astro
import { Image } from "astro:assets";
import type { ImageMetadata } from "astro";

interface Props {
  heading: string;
  photos: ImageMetadata[];
}
const { heading, photos } = Astro.props;
---
<section class="max-w-6xl mx-auto px-5 py-20">
  <h2 class="font-serif text-4xl md:text-5xl text-(--color-ink) mb-10">{heading}</h2>

  <div class="columns-2 md:columns-3 lg:columns-4 gap-3 [column-fill:_balance]">
    {photos.map((p, i) => (
      <button
        type="button"
        class="block w-full mb-3 break-inside-avoid overflow-hidden rounded-md cursor-zoom-in"
        data-lightbox-index={i}
      >
        <Image
          src={p}
          alt=""
          width={900}
          quality={82}
          class="w-full h-auto"
          loading={i < 4 ? "eager" : "lazy"}
        />
      </button>
    ))}
  </div>

  <div
    id="lightbox"
    class="fixed inset-0 bg-black/90 z-50 hidden items-center justify-center p-6"
    role="dialog" aria-modal="true" aria-label={heading}
  >
    <button
      type="button"
      id="lightbox-close"
      class="absolute top-4 right-4 text-white text-3xl"
      aria-label="Close"
    >×</button>
    <button type="button" id="lightbox-prev" class="absolute left-4 text-white text-3xl" aria-label="Previous">‹</button>
    <button type="button" id="lightbox-next" class="absolute right-4 text-white text-3xl" aria-label="Next">›</button>
    <img id="lightbox-img" src="" alt="" class="max-h-[90vh] max-w-[92vw] object-contain" />
  </div>
</section>

<script>
  const photos = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-lightbox-index]"))
    .map((btn) => {
      const img = btn.querySelector("img")!;
      // Astro <Image> renders srcset; use the largest src as the modal source.
      return img.getAttribute("src") ?? "";
    });
  const box = document.getElementById("lightbox") as HTMLElement | null;
  const imgEl = document.getElementById("lightbox-img") as HTMLImageElement | null;
  const close = document.getElementById("lightbox-close");
  const prev = document.getElementById("lightbox-prev");
  const next = document.getElementById("lightbox-next");
  let current = 0;

  function show(i: number) {
    if (!box || !imgEl) return;
    current = (i + photos.length) % photos.length;
    imgEl.src = photos[current];
    box.classList.remove("hidden");
    box.classList.add("flex");
    document.body.style.overflow = "hidden";
  }
  function hide() {
    if (!box) return;
    box.classList.add("hidden");
    box.classList.remove("flex");
    document.body.style.overflow = "";
  }
  document.querySelectorAll<HTMLButtonElement>("[data-lightbox-index]").forEach((btn) => {
    btn.addEventListener("click", () => show(Number(btn.dataset.lightboxIndex)));
  });
  close?.addEventListener("click", hide);
  prev?.addEventListener("click", () => show(current - 1));
  next?.addEventListener("click", () => show(current + 1));
  box?.addEventListener("click", (e) => { if (e.target === box) hide(); });
  document.addEventListener("keydown", (e) => {
    if (box?.classList.contains("hidden")) return;
    if (e.key === "Escape") hide();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Gallery.astro
git commit -m "feat(components): add masonry gallery with vanilla js lightbox"
```

---

### Task 22: LocationMap component

**Files:**
- Create: `src/components/LocationMap.astro`

- [ ] **Step 1: Write `src/components/LocationMap.astro`**

```astro
---
// src/components/LocationMap.astro
interface Props {
  embedSrc: string;       // google maps embed iframe URL
  mapHref: string;        // open-in-maps URL
  heading: string;
  blurb: string;
  address: string;
  ctaLabel: string;
}
const { embedSrc, mapHref, heading, blurb, address, ctaLabel } = Astro.props;
---
<section class="max-w-6xl mx-auto px-5 py-20 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
  <div>
    <h2 class="font-serif text-4xl md:text-5xl text-(--color-ink)">{heading}</h2>
    <p class="mt-4 text-(--color-ink)/85">{blurb}</p>
    <p class="mt-6 text-(--color-ink)">{address}</p>
    <a
      href={mapHref}
      target="_blank" rel="noopener"
      class="inline-flex mt-6 px-5 py-3 bg-(--color-sea-blue) text-(--color-cream) rounded-md hover:opacity-90 transition"
    >
      {ctaLabel}
    </a>
  </div>
  <div class="aspect-[4/3] overflow-hidden rounded-md border border-[color:var(--color-border)]">
    <iframe
      src={embedSrc}
      class="w-full h-full"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      title={heading}
      allowfullscreen
    ></iframe>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/LocationMap.astro
git commit -m "feat(components): add location map section with lazy iframe"
```

---

### Task 23: ContactStrip component

**Files:**
- Create: `src/components/ContactStrip.astro`

- [ ] **Step 1: Write `src/components/ContactStrip.astro`**

```astro
---
// src/components/ContactStrip.astro
interface Props {
  heading: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  bookingCom: string;
}
const { heading, phone, whatsapp, email, instagram, bookingCom } = Astro.props;

const items = [
  { label: "Phone",       sub: phone,        href: `tel:${phone.replace(/\s+/g, "")}`,                 d: "M5 4h4l2 5-2 1a11 11 0 005 5l1-2 5 2v4a2 2 0 01-2 2A17 17 0 013 6a2 2 0 012-2z" },
  { label: "WhatsApp",    sub: whatsapp,     href: `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`, d: "M21 12a9 9 0 11-3.6-7.2L21 3l-1.4 4 .9.9A9 9 0 0121 12z M8 11c.5 2 2.5 4 4.5 4.5L14 14l3 1v2a8 8 0 01-9-9h2l1 3-1 1z" },
  { label: "Email",       sub: email,        href: `mailto:${email}`,                                  d: "M3 6h18v12H3zM3 6l9 7 9-7" },
  { label: "Instagram",   sub: "@vilaemes",  href: instagram,                                          d: "M3 7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4zM12 8a4 4 0 100 8 4 4 0 000-8zM17.5 6.5h.01" },
  { label: "Booking.com", sub: "vila-emes",  href: bookingCom,                                         d: "M5 4h11l3 3v13a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1zM8 9h5M8 13h7M8 17h4" },
];
---
<section class="max-w-6xl mx-auto px-5 py-20">
  <h2 class="font-serif text-4xl md:text-5xl text-(--color-ink) mb-10">{heading}</h2>
  <ul class="grid grid-cols-2 md:grid-cols-5 gap-3">
    {items.map((it) => (
      <li>
        <a
          href={it.href}
          target={it.href.startsWith("http") ? "_blank" : undefined}
          rel={it.href.startsWith("http") ? "noopener" : undefined}
          class="flex flex-col items-center text-center gap-2 p-5 rounded-md border border-[color:var(--color-border)] bg-white/40 hover:bg-white/80 transition"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d={it.d} />
          </svg>
          <span class="text-sm font-medium text-(--color-ink)">{it.label}</span>
          <span class="text-xs text-(--color-muted) break-all">{it.sub}</span>
        </a>
      </li>
    ))}
  </ul>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ContactStrip.astro
git commit -m "feat(components): add contact strip with five iconographic links"
```

---

## Phase 7 — Views & Pages

### Task 24: Photo manifest helper

**Files:**
- Create: `src/lib/photos.ts`

A central place that imports the optimized photos and groups them by category. Pages import from here so swap-out is one place.

- [ ] **Step 1: Write `src/lib/photos.ts`**

```typescript
// src/lib/photos.ts
// Imports run at build time. Astro turns each glob entry into an ImageMetadata.
import type { ImageMetadata } from "astro";

type PhotoMap = Record<string, ImageMetadata>;

// Glob the optimized -1600 sizes from each category as the "default" representation.
// (Astro's <Image> will further transform these at build time.)
const main      = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/photos/main/*-1600.webp",      { eager: true });
const beach     = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/photos/beach/*-1600.webp",     { eager: true });
const deluxe    = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/photos/deluxe/*-1600.webp",    { eager: true });
const apt1plus1 = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/photos/apartment-1plus1/*-1600.webp", { eager: true });
const apt2plus1 = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/photos/apartment-2plus1/*-1600.webp", { eager: true });
const standard  = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/photos/standard/*-1600.webp",  { eager: true });

function flatten(g: Record<string, { default: ImageMetadata }>): PhotoMap {
  const out: PhotoMap = {};
  for (const [path, mod] of Object.entries(g)) {
    const file = path.split("/").pop()!.replace(/-1600\.webp$/, "");
    out[file] = mod.default;
  }
  return out;
}

export const photos = {
  main:       flatten(main),
  beach:      flatten(beach),
  deluxe:     flatten(deluxe),
  "apartment-1plus1": flatten(apt1plus1),
  "apartment-2plus1": flatten(apt2plus1),
  standard:   flatten(standard),
};

/** Pick first N photos from a category, sorted by filename. */
export function pick(category: keyof typeof photos, n: number): ImageMetadata[] {
  const map = photos[category];
  const keys = Object.keys(map).sort();
  return keys.slice(0, n).map((k) => map[k]);
}

/** Pick a specific filename from a category, throwing if missing. */
export function pickByName(category: keyof typeof photos, name: string): ImageMetadata {
  const map = photos[category];
  const hit = map[name];
  if (!hit) throw new Error(`photo not found: ${category}/${name}`);
  return hit;
}
```

- [ ] **Step 2: Verify**

```bash
npx astro check
```

Expected: `0 errors`. (If `astro check` complains "no matching files", first ensure Task 6 has run and `src/assets/photos/<category>/` contains `*-1600.webp` files.)

- [ ] **Step 3: Commit**

```bash
git add src/lib/photos.ts
git commit -m "feat(lib): add photo manifest helper"
```

---

### Task 25: HomeView (single-scroll home page)

**Files:**
- Create: `src/views/HomeView.astro`

- [ ] **Step 1: Write `src/views/HomeView.astro`**

```astro
---
// src/views/HomeView.astro
import Base from "../layouts/Base.astro";
import Hero from "../components/Hero.astro";
import About from "../components/About.astro";
import RoomCard from "../components/RoomCard.astro";
import Gallery from "../components/Gallery.astro";
import LocationMap from "../components/LocationMap.astro";
import ContactStrip from "../components/ContactStrip.astro";

import { getSite } from "../i18n/content";
import type { Locale } from "../i18n/locales";
import { localePrefix } from "../i18n/locales";
import { photos, pick } from "../lib/photos";

interface Props {
  locale: Locale;
}
const { locale } = Astro.props;
const site = await getSite(locale);
const prefix = localePrefix(locale);

// Photo picks (placeholder — owner swaps via shortlist)
const heroPhoto = pick("main", 1)[0];
const aboutPhoto = pick("main", 2)[1] ?? heroPhoto;
const galleryPhotos = pick("main", 15);

const roomPhotoFor: Record<string, keyof typeof photos> = {
  "deluxe": "deluxe",
  "apartment-1plus1": "apartment-1plus1",
  "apartment-2plus1": "apartment-2plus1",
  "standard": "standard",
};

const previewRooms = [
  site.data.rooms.find((r) => r.id === "deluxe")!,
  // collapse the two apartments into one preview card
  { ...site.data.rooms.find((r) => r.id === "apartment-1plus1")!,
    id: "apartments", name: "Apartments", count: 2, capacity: site.data.rooms.find((r) => r.id === "apartment-2plus1")!.capacity },
  site.data.rooms.find((r) => r.id === "standard")!,
];
---
<Base
  locale={locale}
  site={site}
  title={`${site.data.hotel.name} — ${site.data.hotel.tagline}`}
  pathname={`${prefix}/`}
>
  <Hero
    cover={heroPhoto}
    heading={site.data.home.hero.heading}
    sub={site.data.home.hero.sub}
    ctaPrimary={{ label: site.data.home.hero.cta_primary, href: site.data.links.booking_com }}
    ctaSecondary={{ label: site.data.home.hero.cta_secondary, href: site.data.links.google_maps }}
  />

  <About
    heading={site.data.home.about.heading}
    body={site.data.home.about.body}
    photo={aboutPhoto}
    photoAlt={site.data.hotel.name}
  />

  <section class="max-w-6xl mx-auto px-5 py-20">
    <h2 class="font-serif text-4xl md:text-5xl text-(--color-ink) mb-10">{site.data.ui.nav.rooms}</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      {previewRooms.map((r) => (
        <RoomCard
          href={r.id === "apartments" ? `${prefix}/rooms#apartment-1plus1` : `${prefix}/rooms#${r.id}`}
          photo={pick(roomPhotoFor[r.id === "apartments" ? "apartment-1plus1" : r.id], 1)[0]}
          name={r.name}
          capacity={`${site.data.ui.labels.sleeps} ${r.capacity.replace(/^Sleeps\s*/i, "")}`}
          countLabel={site.data.ui.labels.rooms_count.replace("{n}", String(r.count))}
          detailsLabel={site.data.ui.buttons.details}
        />
      ))}
    </div>
  </section>

  <Gallery heading={site.data.ui.labels.gallery} photos={galleryPhotos} />

  <LocationMap
    embedSrc={site.data.links.google_maps_embed}
    mapHref={site.data.links.google_maps}
    heading={site.data.ui.labels.find_us}
    blurb={site.data.home.location_blurb}
    address={site.data.contact.address}
    ctaLabel={site.data.ui.buttons.map}
  />

  <ContactStrip
    heading={site.data.ui.labels.contact}
    phone={site.data.contact.phone}
    whatsapp={site.data.contact.whatsapp}
    email={site.data.contact.email}
    instagram={site.data.links.instagram}
    bookingCom={site.data.links.booking_com}
  />
</Base>
```

- [ ] **Step 2: Commit**

```bash
git add src/views/HomeView.astro
git commit -m "feat(views): add home view composing all section components"
```

---

### Task 26: RoomsView

**Files:**
- Create: `src/views/RoomsView.astro`

- [ ] **Step 1: Write `src/views/RoomsView.astro`**

```astro
---
// src/views/RoomsView.astro
import Base from "../layouts/Base.astro";
import RoomDetails from "../components/RoomDetails.astro";

import { getSite } from "../i18n/content";
import type { Locale } from "../i18n/locales";
import { localePrefix } from "../i18n/locales";
import { photos, pick } from "../lib/photos";

interface Props { locale: Locale }
const { locale } = Astro.props;
const site = await getSite(locale);
const prefix = localePrefix(locale);

const photoCategory: Record<string, keyof typeof photos> = {
  "deluxe": "deluxe",
  "apartment-1plus1": "apartment-1plus1",
  "apartment-2plus1": "apartment-2plus1",
  "standard": "standard",
};
---
<Base
  locale={locale}
  site={site}
  title={`${site.data.ui.nav.rooms} — ${site.data.hotel.name}`}
  pathname={`${prefix}/rooms`}
>
  <header class="max-w-6xl mx-auto px-5 pt-16 pb-4">
    <h1 class="font-serif text-5xl md:text-6xl text-(--color-ink)">{site.data.ui.nav.rooms}</h1>
  </header>

  {site.data.rooms.map((room) => (
    <RoomDetails
      id={room.id}
      name={room.name}
      capacity={room.capacity}
      countLabel={site.data.ui.labels.rooms_count.replace("{n}", String(room.count))}
      description={room.description}
      amenities={room.amenities.map((kind) => ({ kind, label: site.data.amenities[kind] }))}
      photos={pick(photoCategory[room.id], 4)}
      bookHref={site.data.links.booking_com}
      bookLabel={site.data.ui.buttons.book}
      amenitiesLabel={site.data.ui.labels.amenities}
    />
  ))}
</Base>
```

- [ ] **Step 2: Commit**

```bash
git add src/views/RoomsView.astro
git commit -m "feat(views): add rooms view with one section per room category"
```

---

### Task 27: ContactView

**Files:**
- Create: `src/views/ContactView.astro`

- [ ] **Step 1: Write `src/views/ContactView.astro`**

```astro
---
// src/views/ContactView.astro
import Base from "../layouts/Base.astro";
import LocationMap from "../components/LocationMap.astro";
import ContactStrip from "../components/ContactStrip.astro";

import { getSite } from "../i18n/content";
import type { Locale } from "../i18n/locales";
import { localePrefix } from "../i18n/locales";

interface Props { locale: Locale }
const { locale } = Astro.props;
const site = await getSite(locale);
const prefix = localePrefix(locale);
---
<Base
  locale={locale}
  site={site}
  title={`${site.data.ui.nav.contact} — ${site.data.hotel.name}`}
  pathname={`${prefix}/contact`}
>
  <header class="max-w-6xl mx-auto px-5 pt-16 pb-4">
    <h1 class="font-serif text-5xl md:text-6xl text-(--color-ink)">{site.data.ui.nav.contact}</h1>
    <p class="mt-3 text-(--color-muted)">{site.data.contact.reception_hours}</p>
  </header>

  <ContactStrip
    heading={site.data.ui.labels.contact}
    phone={site.data.contact.phone}
    whatsapp={site.data.contact.whatsapp}
    email={site.data.contact.email}
    instagram={site.data.links.instagram}
    bookingCom={site.data.links.booking_com}
  />

  <LocationMap
    embedSrc={site.data.links.google_maps_embed}
    mapHref={site.data.links.google_maps}
    heading={site.data.ui.labels.find_us}
    blurb={site.data.home.location_blurb}
    address={site.data.contact.address}
    ctaLabel={site.data.ui.buttons.map}
  />
</Base>
```

- [ ] **Step 2: Commit**

```bash
git add src/views/ContactView.astro
git commit -m "feat(views): add contact view"
```

---

### Task 28: English page entries

**Files:**
- Replace: `src/pages/index.astro` (currently the bootstrap test from Task 3)
- Create: `src/pages/rooms.astro`, `src/pages/contact.astro`

- [ ] **Step 1: Replace `src/pages/index.astro`**

```astro
---
import HomeView from "../views/HomeView.astro";
---
<HomeView locale="en" />
```

- [ ] **Step 2: Create `src/pages/rooms.astro`**

```astro
---
import RoomsView from "../views/RoomsView.astro";
---
<RoomsView locale="en" />
```

- [ ] **Step 3: Create `src/pages/contact.astro`**

```astro
---
import ContactView from "../views/ContactView.astro";
---
<ContactView locale="en" />
```

- [ ] **Step 4: Run dev server**

```bash
npm run dev
```

Visit `http://localhost:4321/`, `/rooms`, `/contact`. Expected: all three pages render with the warm-Mediterranean palette, sections in order, photos visible. No console errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro src/pages/rooms.astro src/pages/contact.astro
git commit -m "feat(pages): wire english home, rooms, and contact"
```

---

### Task 29: Localized page entries (AL / IT / DE)

**Files:**
- Create: `src/pages/al/index.astro`, `src/pages/al/rooms.astro`, `src/pages/al/contact.astro`
- Create: `src/pages/it/{index,rooms,contact}.astro`
- Create: `src/pages/de/{index,rooms,contact}.astro`

- [ ] **Step 1: Create the three locale folders and 9 page files**

```bash
mkdir -p src/pages/al src/pages/it src/pages/de
```

Each file is 3 lines. Repeat for every (locale × view) pair using the matching locale.

`src/pages/al/index.astro`:
```astro
---
import HomeView from "../../views/HomeView.astro";
---
<HomeView locale="al" />
```

`src/pages/al/rooms.astro`:
```astro
---
import RoomsView from "../../views/RoomsView.astro";
---
<RoomsView locale="al" />
```

`src/pages/al/contact.astro`:
```astro
---
import ContactView from "../../views/ContactView.astro";
---
<ContactView locale="al" />
```

For `it/`, copy the three `al/` files and replace `locale="al"` with `locale="it"`. For `de/`, replace with `locale="de"`. The import paths (`../../views/...`) stay the same.

- [ ] **Step 2: Run dev server**

```bash
npm run dev
```

Visit `/al/`, `/al/rooms`, `/al/contact`, then `/it/...`, then `/de/...`. Expected: all 12 routes render. Content is in English (correct — we seeded copies). The header's lang switcher shows the current language highlighted; clicking another label moves to the same path under that locale.

- [ ] **Step 3: Commit**

```bash
git add src/pages/al src/pages/it src/pages/de
git commit -m "feat(pages): add al/it/de page entries"
```

---

## Phase 8 — Verification

### Task 30: Production build + acceptance checks

**Files:** none (runs commands)

- [ ] **Step 1: Production build**

```bash
npm run build
```

Expected: build completes with `0 errors`. `dist/` contains:
- `index.html`, `rooms/index.html`, `contact/index.html`
- `al/index.html`, `al/rooms/index.html`, `al/contact/index.html`
- `it/...`, `de/...`
- A `_astro/` folder with hashed assets.

Verify:
```bash
find dist -name "*.html" | sort
```

Expected: 12 HTML files.

- [ ] **Step 2: Inspect bundle size**

```bash
du -sh dist
du -sh dist/_astro
find dist -name "*.js" -exec du -h {} \;
```

Expected: total `dist/` ≤ 80 MB (mostly photos), JS bundles total ≤ 30 KB gzipped (one or two small chunks for the lightbox).

- [ ] **Step 3: Preview the production build**

```bash
npm run preview
```

Open `http://localhost:4321/`. Click around all three pages, all four locales. No console errors. The lightbox opens on a gallery click, closes on Esc/overlay-click, navigates with arrows.

- [ ] **Step 4: Responsive + Lighthouse**

In Chrome DevTools:
- 360 px width: header doesn't overflow; sections stack; touch targets ≥ 40 px.
- 1440 px width: gallery uses 4 columns; max-w-6xl content is centered.

Lighthouse (Mobile, Performance category) on the home page:

```
Performance     ≥ 95
Accessibility   ≥ 95
Best Practices  ≥ 95
SEO             ≥ 95
```

If any score is below the threshold, note which audit failed in commit notes — small CSS/markup tweaks usually close the gap. Do not block deploy on missing meta-tags that depend on the real domain.

- [ ] **Step 5: No commit needed (verification only)**

If any tweaks were made to fix Lighthouse issues, commit them as `chore: tighten lighthouse audits` with a one-line summary of what changed.

---

## Phase 9 — Polish & Photo Shortlist

### Task 31: Author the photo shortlist doc

**Files:**
- Create: `docs/photos-shortlist.md`

- [ ] **Step 1: List the placeholder picks**

Write `docs/photos-shortlist.md`:

```markdown
# Photo Shortlist

This document records the placeholder photos currently in use across the site.
Owner: reply with file-name swaps (e.g., "use `DJI_0379` for hero instead of `DJI_0377`")
and we'll edit `src/views/HomeView.astro` and `src/views/RoomsView.astro` accordingly.

All filenames refer to entries inside `src/assets/photos/<category>/` — the optimizer
keeps the original basename (sanitized for spaces).

## Currently used (placeholder picks)

### Hero (home)
- Source category: `main`
- Picked: first file alphabetically (whatever `pick("main", 1)` returns).

### About photo (home)
- Source category: `main`
- Picked: second file alphabetically.

### Gallery (home)
- Source category: `main`
- Picked: first 15 files alphabetically.

### Room previews (home)
- Deluxe preview:    first photo in `src/assets/photos/deluxe/`
- Apartments preview: first photo in `src/assets/photos/apartment-1plus1/`
- Standard preview:  first photo in `src/assets/photos/standard/`

### Room details (rooms page)
- Each section: first 4 photos in the matching category folder.

## How to swap

In `src/views/HomeView.astro`, replace:

```ts
const heroPhoto = pick("main", 1)[0];
```

with:

```ts
import { pickByName } from "../lib/photos";
const heroPhoto = pickByName("main", "DJI_0379");
```

(The basename has been sanitized — spaces become hyphens. Check `src/assets/photos/main/`
for the exact filename if unsure.)
```

- [ ] **Step 2: Commit**

```bash
git add docs/photos-shortlist.md
git commit -m "docs: add photo shortlist with swap instructions"
```

---

### Task 32: README and gitignore polish

**Files:**
- Create: `README.md`
- Modify: `.gitignore`

- [ ] **Step 1: Write `README.md`**

```markdown
# Vila Emes — hotel website

Static marketing site for [Vila Emes](https://vila-emes.pages.dev), a small family
hotel in Durrës, Albania.

## Stack

- Astro 5
- Tailwind v4 (CSS-first)
- Sharp (one-shot photo optimization)
- Cloudflare Pages (static deploy)

## Local development

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # static output to dist/
npm run preview      # serve dist/
```

## Photo pipeline

Source photos live **outside this repo**, under `/Users/erbandanaj/Downloads/Emes/`.
To regenerate the optimized webp set in `src/assets/photos/`:

```bash
npm run optimize:photos
```

The script is idempotent: existing `*.webp` outputs are skipped. To force a rebuild,
delete the affected category folder before running.

## Content

All copy lives in `src/content/site/<locale>.yaml`. After scaffolding, fill in:

- `home.about.body`
- `rooms[*].description`
- `contact.phone`, `contact.email`, `contact.whatsapp`, `contact.address`
- `links.booking_com`, `links.instagram`, `links.google_maps`, `links.google_maps_embed`

Translations: `al.yaml`, `it.yaml`, `de.yaml` are seeded from `en.yaml`. Translate at
your pace; routes work in the meantime.

## Deploy

Push to `main` on the `danajerban/vila-emes` GitHub repo. Cloudflare Pages auto-builds
with `npm run build` and serves `dist/`.

When the real domain is purchased, update `SITE` in `astro.config.mjs` and point DNS
at Cloudflare.
```

- [ ] **Step 2: Tighten `.gitignore`**

Replace `.gitignore` with:

```gitignore
# build output
dist/
.astro/

# deps
node_modules/

# editor / OS
.DS_Store
.vscode/
*.log

# env
.env
.env.local
```

- [ ] **Step 3: Commit**

```bash
git add README.md .gitignore
git commit -m "docs: add readme and tighten gitignore"
```

---

## Phase 10 — Deploy

### Task 33: Push to GitHub

**Files:** none (git operations)

The owner has already created the empty repo at `https://github.com/danajerban/vila-emes`.

- [ ] **Step 1: Confirm repo exists**

In a browser, visit `https://github.com/danajerban/vila-emes` and confirm it loads. If 404, ask the owner to create the empty repo (no README, no `.gitignore`, no license — completely empty) and continue.

- [ ] **Step 2: Add remote and push**

```bash
git remote add origin https://github.com/danajerban/vila-emes.git
git branch -M main
git push -u origin main
```

Expected: `git push` succeeds; the GitHub repo now has all commits from this plan visible.

If `git push` fails with `permission denied`, the user may need to authenticate via `gh auth login` first.

- [ ] **Step 3: No commit (push only)**

---

### Task 34: Cloudflare Pages connect (owner action)

**Files:** none — this is a manual step the owner performs in their browser.

- [ ] **Step 1: Provide instructions to owner**

Tell the owner:

> 1. Go to <https://dash.cloudflare.com/?to=/:account/pages> and click **Create a project → Connect to Git**.
> 2. Authorize GitHub, select the `danajerban/vila-emes` repo.
> 3. Set:
>    - **Framework preset:** Astro
>    - **Build command:** `npm run build`
>    - **Build output directory:** `dist`
>    - **Root directory:** *(leave default — repo root)*
> 4. Click **Save and Deploy**. First build takes ~1–2 minutes.
> 5. Cloudflare assigns `vila-emes.pages.dev` as the canonical URL.

- [ ] **Step 2: Verify deploy**

Visit `https://vila-emes.pages.dev`. Expected: the site loads, all four locale folders work, all photos render. No console errors.

- [ ] **Step 3: No commit (deploy verification)**

---

## Self-Review

**Spec coverage:**
- ✅ Astro 5 + Tailwind v4 (Tasks 1–3)
- ✅ Photo optimization pipeline (Tasks 5–6)
- ✅ Content collections schema + 4 YAML files (Tasks 7–9)
- ✅ i18n routing + helpers (Tasks 10–11)
- ✅ Layout + 8 components covering every page section (Tasks 12–23)
- ✅ Three views composing components (Tasks 25–27)
- ✅ 12 page entries (3 routes × 4 locales) (Tasks 28–29)
- ✅ Logo handling (SVG inline + PNG og:image) — covered by Task 6 (copy) + Task 12 (Base layout uses og:image) + design uses logo wordmark in Task 14 Header. **Note:** the Header currently renders the wordmark as text "Vila Emes" rather than inlining the SVG; if the owner wants the actual SVG mark, swap the text for `<img src={logo.src} />` or inline `<svg>` in Task 14. This is a 5-line tweak post-launch.
- ✅ Lighthouse + responsive acceptance (Task 30)
- ✅ Cloudflare Pages deploy (Tasks 33–34)
- ✅ Photo shortlist for swap workflow (Task 31)

**Placeholder scan:** No `[TODO]` / `[implement later]` / `[similar to Task N]` patterns. The `[PASTE: ...]` markers in `en.yaml` are intentional content placeholders for the owner.

**Type consistency:** `Locale` type is defined once in `i18n/locales.ts` and reused. `getSite(locale)` returns the typed entry; views access `.data.<key>`. Component props are explicit interfaces. `pick(category, n)` and `pickByName(category, name)` are the only photo lookups. Amenity `kind` enum matches between `content.config.ts`, `Amenity.astro`, and `RoomDetails.astro`.

**One known small mismatch resolved inline:** the Header uses a text wordmark instead of the SVG logo — flagged above as a 5-line post-launch tweak rather than a blocker.

---

## Execution

Plan complete and saved to `docs/superpowers/plans/2026-05-06-vila-emes-implementation.md`. Two execution options:

**1. Subagent-Driven (recommended)** — fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
