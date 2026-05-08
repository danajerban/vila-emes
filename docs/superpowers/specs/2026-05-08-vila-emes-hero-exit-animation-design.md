# Vila Emes — Hero Exit Animation Design

**Date:** 2026-05-08
**Status:** Spec — pending user review, then writing-plans
**Supersedes:** none — additive to `2026-05-07-vila-emes-polish-design.md`

## Context

The polish branch is now 58 commits ahead of `origin/main`. The hero is full-viewport (`min-h-[100svh]`, commit `abc1efe`) and already has internal motion: 5-photo Ken Burns crossfade, tagline rotator (now in terracotta after `b016a9c`), and a one-time polaroid wobble on enter. What it does **not** have is any response to scroll — when the user begins scrolling away from the hero, the section just slides out unchanged.

The user's ask, verbatim from the open-threads list:

> "fade out animation (or a parallax or something on all screen sizes — something simple yet beautiful)"

This spec captures the design we converged on after a Q&A pass:

1. **Feel** — copy lifts; photo holds (chosen over photo-parallax, both-fade, scrim-only)
2. **Drift** — subtle ~16px (chosen over no-drift or 40px)
3. **Tech** — JS scroll listener + CSS variable (chosen over pure-CSS `animation-timeline: scroll()` which leaves Firefox + older iOS without the effect, and over IO-threshold which is stepped instead of proportional)

## Decision

On scroll-down, the hero copy block fades out and drifts upward by 16px as the section leaves the viewport. The fade is proportional to scroll position. The photo (with its existing Ken Burns) and the polaroid (lg+ corner) hold. The bottom gradient mask holds. By the time half the hero has scrolled past the viewport top, the copy is fully gone. Symmetric on scroll-up.

## Animation Contract

A single CSS custom property carries the state:

| Property | Owner | Range | Source |
| --- | --- | --- | --- |
| `--hero-progress` | `[data-hero]` | `0..1` clamped both ends | JS, written once per scroll frame via `requestAnimationFrame` |

The mapping is linear:

```
scrolledPx = max(0, -hero.getBoundingClientRect().top)
progress   = clamp(0, scrolledPx / (heroHeight × 0.5), 1)
```

- `progress = 0` when the hero top is at (or below) the viewport top → copy at full opacity, no transform
- `progress = 1` when 50% of the hero height has scrolled past → copy at opacity 0, translateY −16px
- Beyond 50%: clamped at 1 (no further change)

The copy block reads the variable via `calc()` only — no class toggles, no JS-driven inline styles:

```css
[data-hero-copy] {
  opacity: calc(1 - var(--hero-progress, 0));
  transform: translateY(calc(var(--hero-progress, 0) * -16px));
  will-change: opacity, transform;
}
```

The 50% completion point is a single-line tunable. If implementation testing on a real device suggests it feels too aggressive, raising to 60% is a one-character change.

## What Animates / What Doesn't

| Element | Behavior |
| --- | --- |
| Copy block (eyebrow, handwritten welcome, h1, tagline/rotator, CTAs) | Fades + drifts up |
| Photo slideshow (with Ken Burns crossfade) | Holds — existing animations continue independently |
| Polaroid (lg+ only) | Holds — keeps "postcard pinned to fridge" feel |
| Top gradient mask | Holds |
| Bottom gradient mask | Holds |

Rationale for keeping the polaroid still: it reads as a separate decorative anchor, not part of the copy composition. User confirmed in a prior session: "Yes, option A (keep polaroid)."

## Implementation Outline

Three small, contained changes inside `src/components/Hero.astro`:

1. **Markup** — add `data-hero-copy` to the existing copy `<div>` at line 75. Single attribute, zero new elements.

2. **Styles** — add one rule inside the existing `<style>` block, plus a no-op inside the existing `@media (prefers-reduced-motion: reduce)` block:
   - `[data-hero-copy] { opacity: calc(1 - var(--hero-progress, 0)); transform: translateY(calc(var(--hero-progress, 0) * -16px)); will-change: opacity, transform; }`
   - Reduced-motion fallback is automatic via the `var(...)` default of `0` — copy renders at opacity 1, transform 0 when the JS never installs the listener.

3. **Script** — extend the existing IIFE in `Hero.astro:147-204`:
   - Lift the `IntersectionObserver` and scroll listener registration to **IIFE-level** (above the `init()` function), guarded by the existing `window.__heroInited` check. This guarantees they're registered exactly once, even across Astro view transitions.
   - `init()` continues to handle slideshow + rotator timers; the new code runs alongside it, not inside it.
   - `prefers-reduced-motion: reduce` → skip listener installation entirely.
   - On scroll: read `getBoundingClientRect()`, compute progress, set `--hero-progress` on `[data-hero]` via `style.setProperty`. `passive: true`, rAF-throttled.
   - IO with `threshold: 0` and a generous `rootMargin` toggles a boolean that short-circuits the scroll handler when the hero is fully off-screen (e.g., user is at the footer). Saves work without missing edges.

Estimated diff: ~30 lines of JS + 1 CSS rule + 1 attribute.

## Reduced Motion

- **JS path:** check `matchMedia('(prefers-reduced-motion: reduce)').matches` at IIFE-level. If true, skip both IO and scroll-listener installation.
- **CSS path:** `var(--hero-progress, 0)` defaults to `0` whenever the variable is unset, so `opacity = 1` and `transform = 0`. No additional reduced-motion CSS rule needed.
- The existing `@media (prefers-reduced-motion: reduce)` block in `Hero.astro:137-142` already handles the slideshow + rotator + Ken Burns; this spec adds nothing to it.

## Performance Budget

- Scroll listener registered with `{ passive: true }` → never blocks scrolling
- `requestAnimationFrame` throttle → at most 60 writes/sec
- IO short-circuit when hero offscreen → zero work below the fold
- Single `getBoundingClientRect()` read per frame, single `setProperty` write per frame, no DOM mutations to elements that paint
- `will-change: opacity, transform` on the copy block → GPU compositing

## Edge Cases

| Scenario | Behavior |
| --- | --- |
| Deep-link with scroll already past hero | Initial scroll handler runs on mount, computes progress from current `scrollY`, copy renders correctly faded |
| Mobile address-bar collapse / orientation change | `getBoundingClientRect()` re-read each frame adapts to the new hero height; no special handling |
| Astro view transitions (locale switch, page navigation) | Existing `__heroInited` guard prevents IIFE re-execution; listeners persist across transitions; `init()` re-queries the (potentially new) hero element |
| Browser back/forward with scroll restoration | First `scroll` event after restore picks up the correct progress |
| Tagline rotator cycling mid-fade | Rotator continues independently; both fade together (rotator has its own opacity transition stacked on top of the copy-block opacity) |
| User has `prefers-reduced-motion: reduce` | JS never installs listeners; copy stays static at full opacity |

## Out of Scope

- Photo parallax / zoom — explicitly rejected in favor of "photo holds"
- Mobile-specific tuning (different distance/threshold) — same code, same effect on all viewports per user ask "on all screen sizes"
- Polaroid animation — explicitly stays
- Ken Burns / crossfade / rotator — already shipped, untouched
- Other pages' heroes (`PageHero` on /rooms/ and /contact/) — out of scope; this is for `[data-hero]` only

## Acceptance Criteria

A reviewer can verify the spec is satisfied if all of the following are true:

1. **Visual proportionality** — at scroll y=0 copy is fully visible; at scroll y ≈ 50% of hero height copy is fully invisible; intermediate values render proportionally
2. **Drift correctness** — at progress=1 the copy block has translated up exactly 16px (verifiable via `getBoundingClientRect().top` delta)
3. **Photo holds** — slideshow + Ken Burns continue regardless of scroll position; no transform/opacity changes on `.hero-slide` or `.hero-img` driven by `--hero-progress`
4. **Polaroid holds** — `figure.polaroid-wobble` keeps its enter-state opacity throughout scroll
5. **Reduced motion** — with `prefers-reduced-motion: reduce`, the copy block has computed `opacity: 1` and `transform: none` at any scroll position, and DevTools shows no scroll listener bound to the window from this script
6. **Cross-browser** — works in Chrome 115+, Safari 17+, Firefox 120+ (no `animation-timeline` dependency)
7. **No double-bind** — under normal motion, after one or more Astro view transitions back to home, exactly one scroll listener bound by this script exists on the window (verifiable in DevTools event listeners panel)
8. **Build clean** — `npm run build` succeeds with 12 pages; `npx astro check` reports 0/0/0
9. **No console errors** on any of `/`, `/al/`, `/it/`, `/de/` at desktop and mobile widths

## Open Questions

None blocking. The 50% vs 60% completion threshold is the one tunable; default 50% per the design discussion, adjust during implementation if real-device feel argues for gentler.

## Related

- `2026-05-06-vila-emes-site-design.md` — original site design (Hero pattern locked in)
- `2026-05-07-vila-emes-polish-design.md` — polish phase (Hero `100svh`, Ken Burns, rotator)
- `b016a9c style(hero): rotator word in terracotta + drop fixed-width gap` — landed just before this spec; pairs with this animation visually
- `abc1efe fix(hero): full-viewport (100svh) and deeper scrim for legibility` — set up the scroll-distance budget this animation uses
