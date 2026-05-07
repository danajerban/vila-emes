# Photos shortlist — Vila Emes

> Placeholder picks made by file-name alone. **Owner reviews this list and replies with swaps**, e.g. *"swap home hero from `dji-0379` → `dji-0382`"* or *"use `dsc-0436` for `apt-1bed-terrace` hero"*. Each swap is a one-line edit in `src/views/<View>.astro` (find the `import imgX from "../assets/photos/<cat>/<basename>-1600.webp"` line, change the basename).
>
> Source originals stay outside the repo at `/Users/erbandanaj/Downloads/Emes/<folder>/`. Optimized webps live in `src/assets/photos/<category>/<basename>-{800,1600,2400}.webp` — already committed (~145 sources × 3 sizes = 435 webps, ~59 MB).

## How to swap

1. Pick a different webp basename from the relevant `src/assets/photos/<category>/` folder.
2. In the file noted below, change the import path. Astro's `<Image>` regenerates the responsive set automatically.
3. `npm run build` — confirms.

---

## Home

Used by `src/views/HomeView.astro`.

| Slot | Component | Current pick | Why | Likely swap candidates |
|---|---|---|---|---|
| Hero cover | `Hero.cover` | `main/dji-0379-2400.webp` | Drone exterior, dramatic. Spec hero is full-bleed. | `main/dji-0377`, `main/dji-0380`, `main/dji-0382`, `main/dji-0384` (all drone shots) |
| Hero polaroid (lg+ inset) | `Hero.polaroid` | `main/691204535-1600.webp` | Smaller, family-feel detail. | Any close-up exterior or balcony shot |
| About square photo | `About.photo` | `main/dji-0380-1600.webp` | Building exterior, square crop. | `main/beach`, any exterior |
| Gallery × 12 | `Gallery.photos[]` | mix of `main/`, `deluxe-rooms/dsc-0327`, `apt-1bed-terrace/dsc-0434`, `apt-2bed/dsc-0457`, `standard-rooms/dsc-0381`, `deluxe-rooms/dsc-0329` | Variety: drone + interior. | Owner picks 12 favourites mixing exterior, terrace, breakfast, walk-to-water |

## Rooms (per-room hero in `RoomsView.astro`)

Each room uses ONE `1600.webp` for its alternating-layout hero. Owner can pick any photo from the matching folder.

| Room id | Family | Current pick | Folder candidates |
|---|---|---|---|
| `apt-1bed-terrace` | apartments | `apt-1bed-terrace/dsc-0434` | 17 photos in `apt-1bed-terrace/` (`dsc-0434` … `dsc-0451`) |
| `apt-2bed` | apartments | `apt-2bed/dsc-0457` | 19 photos in `apt-2bed/` |
| `deluxe-king` | deluxe | `deluxe-rooms/dsc-0327` | 31 photos pooled across `deluxe-rooms/` (originally rooms 101/102/103 — owner can split per-room) |
| `deluxe-queen` | deluxe | `deluxe-rooms/dsc-0329` | same pool — pick a different one |
| `deluxe-balcony` | deluxe | `deluxe-rooms/dsc-0330` | same pool — ideally a balcony shot |
| `quad-sea` | family | `standard-rooms/dsc-0381` | currently sourced from `standard-rooms/` (37 photos pooled across 301-306). Recommended: ideally a sea-view shot |
| `quad-balcony` | family | `standard-rooms/dsc-0382` | same pool — city-view balcony shot ideal |
| `family-balcony` | family | `standard-rooms/dsc-0384` | same pool — family-friendly + sea-view |
| `family-standard` | standard | `standard-rooms/dsc-0385` | same pool |
| `econ-triple` | economy | `standard-rooms/dsc-0381` (dup of quad-sea) | **NEEDS unique pick** |
| `budget-triple` | economy | `standard-rooms/dsc-0382` (dup of quad-balcony) | **NEEDS unique pick** |

## Logo + decorations

| Slot | Path | Notes |
|---|---|---|
| Header palm-mark | inline SVG in `Header.astro` | 4-frond minimal; reads as a small mark next to wordmark |
| Footer logo | `src/assets/logo/vila-emes-1024.png` (built from optimized SVG) | Full hand-drawn 3-palm illustration |
| Favicon | `public/favicon.svg` | Same SVG, served at root |
| og:image | `public/og-image.png` (1024×1024 cream bg) | For Facebook/Twitter/LinkedIn shares |
| Palm doodle | `src/assets/decorations/palm-doodle.svg` | **Placeholder** — replace with a single tree extracted from `src/assets/logo/vila-emes.svg` to perfectly match logo line-quality |

## Per-folder source overview (FYI for the owner)

| Source folder | Files | Currently routed to |
|---|---|---|
| `Main/` | 41 | gallery + hero + about |
| `1+1/` | 17 | `apt-1bed-terrace` |
| `2+1/` | 19 | `apt-2bed` |
| `101/`, `102/`, `103/` | 11 + 9 + 11 = 31 | pooled into `deluxe-rooms` |
| `301/` … `306/` | 8 + 7 + 6 + 6 + 5 + 5 = 37 | pooled into `standard-rooms` (also borrowed for family/economy until split) |

## Curation suggestions

- **Highest priority:** swap `econ-triple` and `budget-triple` placeholders so they are not duplicates of other rooms.
- **Sea-view family rooms** (`quad-sea`, `family-balcony`) should use photos that visibly show sea/balcony — `standard-rooms/` may not have any genuinely sea-view shots; consider taking new photos or borrowing from `Main/` drone shots that catch the sea.
- **Hero variety** — the drone shots (`dji-*`) are dramatic; consider whether an interior or terrace shot would feel more "small family hotel" than the drone aerials.

## After curation

1. Owner edits this doc with **DECISIONS** column or comments.
2. Implementer applies the import-path swaps in `src/views/HomeView.astro` and `src/views/RoomsView.astro`.
3. `npm run build` to verify.
4. One commit per swap batch: `feat(photos): owner-curated swap for <slot>`.
