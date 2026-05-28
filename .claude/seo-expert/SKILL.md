---
name: seo-expert
description: Technical SEO for the Vila Emes Astro 6 hotel site — canonical URLs, hreflang, Open Graph + Twitter Cards, JSON-LD (Hotel / FAQPage / BreadcrumbList), sitemap via @astrojs/sitemap, robots.txt, and locale-aware metadata across en/al/it/de. Triggered by SEO, metadata, structured data, schema, Open Graph, sitemap, robots, hreflang, canonical, or search-ranking concerns.
---

# SEO Expert — Vila Emes (Astro 6)

## Project context

- **Stack:** Astro 6 (static SSG only — no SSR), Tailwind v4, Cloudflare Pages.
- **Domain:** `https://www.vilaemes.com`. Defined once in `astro.config.mjs` (`site`) and `src/config/site.ts` (`SITE.url`). **Treat both as the same value** — both must change together if the canonical domain ever shifts.
- **Locales:** `en` (default, **unprefixed**), `al`, `it`, `de` — subdir routing, `prefixDefaultLocale: false`.
- **URL-key vs BCP 47:** the URL key `al` maps to language tag `sq` (Albanian) via `LOCALE_TO_LANG` in `src/i18n/locales.ts`. Anywhere a real language tag is required (`<html lang>`, hreflang, `og:locale`), use the BCP 47 form, not the URL key.
- **Pages are thin:** routes in `src/pages/{,al,it,de}/{index,rooms,contact}.astro` import a `*View.astro` from `src/views/`. The `<head>` is owned by `src/layouts/Base.astro`.
- **Single source of truth:** contact, ratings, distances, external links, `og-image.png` URL → `src/config/site.ts`. Don't duplicate into YAML or per-page metadata.
- **Localized copy:** `src/content/site/{en,al,it,de}.yaml`, loaded via `getSite(lang)` from `src/i18n/content.ts`.

## When to use

- Adding canonical, hreflang, Twitter, or JSON-LD to `Base.astro` / a `<Seo>` component.
- Wiring `@astrojs/sitemap` with the i18n option (auto hreflang in the sitemap).
- Creating or auditing `public/robots.txt`.
- Per-page metadata for `/`, `/rooms`, `/contact` and their `/al/`, `/it/`, `/de/` mirrors.
- Auditing whether localized titles/descriptions exist in all four YAMLs.

**NOT for:** marketing strategy, paid ads, analytics dashboards, or copywriting beyond meta-tag length compliance.

## Current state (audit as of 2026-05-09)

| Feature | Status | File |
|---|---|---|
| `<html lang>` per locale (BCP 47 via `LOCALE_TO_LANG`) | Done | `src/layouts/Base.astro:23` |
| `<title>` + optional `<meta name="description">` | Done | `Base.astro:29-30` |
| Basic Open Graph (`og:title`, `og:description`, `og:type`, `og:image`, `og:url`) | Done | `Base.astro:32-36` |
| Favicon (`.svg` + `.ico`) | Done | `public/favicon.{svg,ico}` |
| OG image present (`/og-image.png`) | Done — 1200×630 | `public/og-image.png` |
| Canonical URL | Done | `src/components/Seo.astro:30` (per-locale, trailing-slash-mirrored) |
| `og:site_name`, `og:locale`, `og:locale:alternate` | Done | `Seo.astro:60-63` (via `astro-seo` `openGraph.optional`) |
| `og:image:width` / `:height` / `:alt`, `og:image:secure_url` | Done | `Seo.astro:66-71` (1200×630 set explicitly) |
| Twitter Card meta (`twitter:card`, `:title`, `:description`, `:image`) | Done | `Seo.astro:73-79` (`summary_large_image`) |
| `<link rel="alternate" hreflang>` per page | Done | `Seo.astro:35-41` (en/sq/it/de + `x-default`) |
| JSON-LD: `Hotel` on home (incl. `aggregateRating`, `contactPoint`, `numberOfRooms: 17`, `amenityFeature`, `petsAllowed`, `priceRange`, `checkinTime`/`checkoutTime`, `sameAs`) | Done | `src/lib/seo.ts#hotelJsonLd` + `Base.astro:33` (via `jsonLdScriptBody` helper, gated on `!noindex`) |
| JSON-LD: `HotelRoom` `@graph` on `/rooms` (one entry per layout) | Done | `src/lib/seo.ts#hotelRoomGraphJsonLd` + `RoomsView.astro:140`. Offers/priceRange deliberately omitted — bookings live on Booking.com. |
| JSON-LD: `FAQPage` | Done — home only | `src/lib/seo.ts#faqPageJsonLd` + `HomeView.astro` (FAQ section). Contact reuses the same FAQ items but no second FAQPage block — would risk Google's duplicate-rich-result penalty. |
| JSON-LD: `BreadcrumbList` on inner pages | Done | `src/lib/seo.ts#breadcrumbListJsonLd` + `RoomsView.astro` + `ContactView.astro`. Helper builds absolute URLs from path with trailing slash. |
| `@astrojs/sitemap` integration (auto hreflang) | Done | `astro.config.mjs` (`integrations: [sitemap({ i18n: { defaultLocale, locales: { al: "sq", ... } } })]`) |
| `public/robots.txt` | Done | `public/robots.txt` (Sitemap directive → www.vilaemes.com) |
| Localized `seo.title` / `seo.description` keys in all 4 YAMLs | Done | `src/content/site/{en,al,it,de}.yaml` + schema in `content.config.ts:64-68` |
| Per-page description passed to `<Base>` | Done | views forward `site.data.seo.{home,rooms,contact}.description` |

## Implementation plan (suggested order)

1. **Add a `<Seo>` component** that takes `{ lang, title, description, path, ogImage? }` and renders all the shared head tags. Mount it inside `Base.astro`'s `<head>` so views never repeat boilerplate.
2. **Add `seo.{title,description}` per page** to all four YAMLs in `src/content/site/`. Views read them and forward to `<Base>` (or to `<Seo>`).
3. **Install `@astrojs/sitemap`** with the i18n option — sitemap then carries hreflang automatically.
4. **Add `public/robots.txt`** pointing to the generated `sitemap-index.xml`.
5. **Add JSON-LD** for Hotel + FAQ + Breadcrumbs.

Each step is independently shippable.

---

## Patterns

### 1. `<Seo>` component (proposed — does not exist yet)

```astro
---
// src/components/Seo.astro
import { LOCALES, LOCALE_TO_LANG, localizedPath, type Lang } from "../i18n/locales";
import { SITE } from "../config/site";

interface Props {
  lang: Lang;
  title: string;
  description?: string;
  /** Path WITHOUT a locale prefix, e.g. "/", "/rooms", "/contact". */
  path: string;
  /** Defaults to SITE.url + /og-image.png. */
  ogImage?: string;
  ogImageAlt?: string;
}
const { lang, title, description, path, ogImage, ogImageAlt } = Astro.props;

const ogImg = ogImage ?? `${SITE.url}/og-image.png`;
const canonical = `${SITE.url}${localizedPath(lang, path)}`;
const htmlLang = LOCALE_TO_LANG[lang]; // "sq" for al, etc.

const alternates = LOCALES.map((l) => ({
  hreflang: LOCALE_TO_LANG[l],
  href: `${SITE.url}${localizedPath(l, path)}`,
}));
---
<title>{title}</title>
{description && <meta name="description" content={description} />}

<link rel="canonical" href={canonical} />
{alternates.map((a) => (
  <link rel="alternate" hreflang={a.hreflang} href={a.href} />
))}
<link rel="alternate" hreflang="x-default" href={`${SITE.url}${path === "/" ? "" : path}`} />

<meta property="og:site_name" content="Vila Emes" />
<meta property="og:type" content="website" />
<meta property="og:url" content={canonical} />
<meta property="og:title" content={title} />
{description && <meta property="og:description" content={description} />}
<meta property="og:locale" content={htmlLang.replace("-", "_")} />
{LOCALES.filter((l) => l !== lang).map((l) => (
  <meta property="og:locale:alternate" content={LOCALE_TO_LANG[l].replace("-", "_")} />
))}
<meta property="og:image" content={ogImg} />
<meta property="og:image:secure_url" content={ogImg} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
{ogImageAlt && <meta property="og:image:alt" content={ogImageAlt} />}

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
{description && <meta name="twitter:description" content={description} />}
<meta name="twitter:image" content={ogImg} />
```

**Why a component, not inline in `Base.astro`:** keeps `Base.astro` focused on layout + global init; lets per-page metadata stay near the data that drives it.

#### Alternative: the `astro-seo` package

[`astro-seo`](https://github.com/jonasmerlin/astro-seo) is a maintained component that bundles canonical, hreflang (`languageAlternates`), Open Graph, Twitter Cards, and an `extend` prop for arbitrary `<meta>`/`<link>` tags. It's the lower-effort default for most projects. The hand-rolled `<Seo>` above is only needed if a dependency is unwelcome or behaviour beyond the package's surface is required.

```bash
pnpm add astro-seo
```

```astro
---
// src/components/Seo.astro (using the package)
import { SEO } from "astro-seo";
import { LOCALES, LOCALE_TO_LANG, localizedPath, type Lang } from "../i18n/locales";
import { SITE } from "../config/site";

interface Props {
  lang: Lang;
  title: string;
  description?: string;
  /** Locale-less path: "/", "/rooms", "/contact". */
  path: string;
}
const { lang, title, description, path } = Astro.props;

const ogImg = `${SITE.url}/og-image.png`;
const canonical = `${SITE.url}${localizedPath(lang, path)}`;
const localeTag = LOCALE_TO_LANG[lang]; // "sq" for al, etc.

const languageAlternates = [
  ...LOCALES.map((l) => ({
    href: `${SITE.url}${localizedPath(l, path)}`,
    hrefLang: LOCALE_TO_LANG[l],
  })),
  { href: `${SITE.url}${path === "/" ? "" : path}`, hrefLang: "x-default" },
];
---
<SEO
  title={title}
  description={description}
  canonical={canonical}
  languageAlternates={languageAlternates}
  openGraph={{
    basic: { title, type: "website", image: ogImg, url: canonical },
    optional: {
      siteName: "Vila Emes",
      description,
      locale: localeTag.replace("-", "_"),
      localeAlternate: LOCALES.filter((l) => l !== lang).map((l) => LOCALE_TO_LANG[l].replace("-", "_")),
    },
    image: {
      secureUrl: ogImg,
      width: 1200,
      height: 630,
      alt: "Vila Emes — family-run hotel by the sea, Plazh, Durrës",
    },
  }}
  twitter={{
    card: "summary_large_image",
    title,
    description,
    image: ogImg,
  }}
/>
```

The package does **not** emit JSON-LD — keep the `set:html` JSON-LD blocks below, regardless of which approach you choose for the head meta tags.

### 2. Sitemap (auto hreflang)

```bash
pnpm exec astro add sitemap --yes
```

```js
// astro.config.mjs (excerpt)
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.vilaemes.com",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "al", "it", "de"],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en",
          al: "sq",   // URL key → BCP 47 (al ≠ sq)
          it: "it",
          de: "de",
        },
      },
      // x-default isn't emitted by the i18n option — inject it per URL
      // pointing to the EN equivalent (mirrors Seo.astro's <head> logic
      // so both signals agree).
      serialize(item) {
        const enUrl = item.links?.find((l) => l.lang === "en")?.url ?? item.url;
        item.links = [...(item.links ?? []), { lang: "x-default", url: enUrl }];
        return item;
      },
    }),
  ],
  vite: { /* ...unchanged... */ },
});
```

`@astrojs/sitemap` will then emit `dist/sitemap-index.xml` + `dist/sitemap-0.xml` with `<xhtml:link rel="alternate" hreflang="…">` for every URL (including `x-default` via the `serialize` hook) — no per-page hreflang code needed if you trust the sitemap. **Still keep per-page `<link rel="alternate" hreflang>`** for the in-page signal (search engines use both).

### 3. `public/robots.txt`

```txt
# public/robots.txt
User-agent: *
Allow: /

Sitemap: https://www.vilaemes.com/sitemap-index.xml
```

Static file, copied as-is to `dist/`. Keep this URL in lockstep with `astro.config.mjs#site` and `SITE.url` if the canonical domain ever changes.

### 4. JSON-LD — inject via `set:html` + `JSON.stringify`

Astro recommends `set:html` over `dangerouslySetInnerHTML` (which is React syntax) — `set:html` is the framework-native escape hatch.

#### Hotel / LodgingBusiness (home page)

```astro
---
// inside HomeView.astro frontmatter
import { SITE } from "../config/site";

const hotelLd = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  name: "Vila Emes",
  url: SITE.url,
  image: `${SITE.url}/og-image.png`,
  telephone: SITE.contact.phone,
  email: SITE.contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.contact.address[0],
    addressLocality: "Durrës",
    postalCode: "2001",
    addressCountry: "AL",
  },
  priceRange: "€€",
  hasMap: SITE.links.google_maps,
  // `aggregateRating` is live in `src/lib/seo.ts#hotelJsonLd` — sources from
  // `SITE.ratings.booking` + `SITE.ratings.booking_review_count` (Booking.com only,
  // single-source rule). `starRating` stays omitted: no official Albanian Ministry
  // of Tourism classification on file. See seo.ts for the production shape.
};
---
<script type="application/ld+json" set:html={JSON.stringify(hotelLd)}></script>
```

> **Caveat — mixing rating sources.** `SITE.ratings.booking` is on a 10-point scale; `SITE.ratings.google` is on a 5-point scale. Don't average them. Pick one source (Booking.com here, since it's the booking funnel) and put only that in `aggregateRating`. Document the choice in a comment so it doesn't drift.

> **Don't fabricate `reviewCount` or `starRating`.** Schema.org rich-result eligibility hinges on these being truthful — Google's review-snippet guidelines penalise made-up review counts. Leave the block commented out until the owner provides real numbers.

#### FAQPage (home FAQ block + contact FAQ)

```astro
---
const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  // Field names match src/content.config.ts → faqItem schema: { q, a }
  mainEntity: home.faq.items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};
---
<script type="application/ld+json" set:html={JSON.stringify(faqLd)}></script>
```

Place inside the section that renders the FAQ — Google associates schema with surrounding markup.

#### BreadcrumbList (inner pages)

```astro
---
import { SITE } from "../config/site";
import { localizedPath, type Lang } from "../i18n/locales";

interface Props { lang: Lang; current: { name: string; path: string } }
const { lang, current } = Astro.props;

const crumbs = [
  { name: "Home", path: "/" },
  current,
];
const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.name,
    item: `${SITE.url}${localizedPath(lang, c.path)}`,
  })),
};
---
<script type="application/ld+json" set:html={JSON.stringify(breadcrumbLd)}></script>
```

`current.name` should come from the localized YAML (e.g. `site.data.rooms.page_title`), not be hard-coded in English.

---

## Schema types by page

| Page | Schema | Notes |
|---|---|---|
| `/` (and `/al`, `/it`, `/de`) | `Hotel` (or `LodgingBusiness`) + `FAQPage` | One Hotel block per locale page; `inLanguage` field optional. |
| `/rooms` (all locales) | `BreadcrumbList` + optionally a list of `HotelRoom` | Skip `HotelRoom` until prices/availability live in structured data — placeholder values hurt more than help. |
| `/contact` (all locales) | `BreadcrumbList` + `FAQPage` | The contact-page FAQ is a small subset of the home FAQ items in YAML. |

## Meta tag length limits

| Element | Limit | Rule of thumb |
|---|---|---|
| `<title>` | 50–60 chars | "Vila Emes — Family-run hotel in Durrës" fits. Don't pad with "best …" cruft. |
| `<meta description>` | 150–160 chars | Action verb + benefit + locale signal (e.g. "Book a room at Vila Emes, a family-run beachfront hotel in Plazh, Durrës — two minutes from the sand. Check rates on Booking.com."). |
| `og:image` | 1200×630, < 1 MB (Facebook/Twitter target) | `public/og-image.png` is now 1200×630 (~440 KB). |
| H1 | 1 per page | Existing views comply. Don't add a second `<h1>` to a section. |

## Common mistakes to avoid in this codebase

| Mistake | Fix |
|---|---|
| Using URL key `al` as a language tag | Always go through `LOCALE_TO_LANG[lang]` to get `sq`. |
| Hard-coding `https://www.vilaemes.com/...` | Use `SITE.url` from `src/config/site.ts`. One change for the custom-domain switch. |
| Adding metadata only to the EN view | Every locale needs the same SEO surface. Keep view + YAML changes parallel across en/al/it/de. |
| Using `dangerouslySetInnerHTML` for JSON-LD | That's React. In Astro use `set:html={JSON.stringify(...)}`. |
| Stringifying user-supplied content into JSON-LD without escaping | YAML content is owner-controlled, so `JSON.stringify` is enough. If sources expand to user input, escape `<` as `<` (HTML entities don't work inside `<script>`): `JSON.stringify(ld).replace(/</g, "\\u003c")` — prevents `</script>` injection. |
| Putting hreflang only in the sitemap | Add per-page `<link rel="alternate" hreflang>` too — both signals reinforce each other. |
| Hreflang missing `x-default` | Add `<link rel="alternate" hreflang="x-default" href="https://www.vilaemes.com/">` so SEs can pick a fallback. |
| Forgetting the `og:image` is absolute-URL only | Already absolute via `${SITE.url}/og-image.png` — keep it that way. |
| Adding `metadataBase` | Astro doesn't have a `metadataBase` like Next.js. Always emit absolute URLs from `SITE.url` directly. |
| Building inline page titles like `${name} — ${tagline}` only | Fine for `<title>`, but pull a *separate* `seo.description` from YAML — repeating the tagline as the description hurts. |

## Key files

| File | Role |
|---|---|
| `src/layouts/Base.astro` | Owns `<head>`. Insertion point for the future `<Seo>` component. |
| `src/components/Seo.astro` | **To create** — reusable SEO head fragment (see pattern above). |
| `src/views/{Home,Rooms,Contact}View.astro` | Compute per-page title/description + JSON-LD; pass to `<Base>` / `<Seo>`. |
| `src/content/site/{en,al,it,de}.yaml` | Source of localized `seo.title` / `seo.description` (key to add). |
| `src/config/site.ts` | `SITE.url`, contact, ratings, distances — feed JSON-LD. |
| `src/i18n/locales.ts` | `LOCALE_TO_LANG`, `localizedPath` — used everywhere SEO touches a URL or language tag. |
| `astro.config.mjs` | `site` URL + `@astrojs/sitemap` integration with i18n option. |
| `public/robots.txt` | **To create.** |
| `public/og-image.png` | OG image, served from `SITE.url`. 1200×630 — `og:image:width/height` in `Seo.astro` match. |

## Validation checklist

After implementing any of the above, run all of these:

- `pnpm exec astro check` — TS + content schema clean.
- `pnpm build` — produces `dist/sitemap-index.xml` and `dist/sitemap-0.xml`. Open `sitemap-0.xml` and confirm `<xhtml:link rel="alternate" hreflang>` entries for all four locales on every URL.
- View source on `pnpm preview` for `/`, `/rooms`, `/contact` and one localized mirror (e.g. `/al/`). Check: canonical points to the page itself in its own locale; hreflang tags include `en/sq/it/de/x-default`; one JSON-LD block per intended schema; OG image is absolute.
- Paste a built page into Google's [Rich Results Test](https://search.google.com/test/rich-results) — Hotel + FAQ should validate.
- Paste a URL into a Twitter / Facebook debugger to confirm OG image renders at 1200×630.
- Confirm `dist/robots.txt` exists and points to the right sitemap URL.

## References

- Astro i18n routing: https://docs.astro.build/en/guides/internationalization/
- `@astrojs/sitemap`: https://docs.astro.build/en/guides/integrations-guide/sitemap/
- Astro `set:html` + JSON-LD: https://docs.astro.build/en/reference/directives-reference/#sethtml
- Schema.org `Hotel`: https://schema.org/Hotel
- Schema.org `FAQPage`: https://schema.org/FAQPage
- Schema.org `BreadcrumbList`: https://schema.org/BreadcrumbList
- Always cross-check via the `context7` MCP (`/withastro/docs`) before non-trivial changes — Astro's API moves.
