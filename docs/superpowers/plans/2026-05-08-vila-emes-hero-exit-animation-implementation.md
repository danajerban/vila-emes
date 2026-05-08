# Hero Exit Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement scroll-driven fade + 16px upward drift on the hero copy block per `2026-05-08-vila-emes-hero-exit-animation-design.md`.

**Architecture:** One CSS variable (`--hero-progress`) carries 0..1 state on `[data-hero]`. JS at IIFE level listens to `scroll` (passive, rAF-throttled), reads `getBoundingClientRect()`, computes progress from `max(0, -rect.top) / (height × 0.5)` clamped to [0,1], writes the variable. CSS on `[data-hero-copy]` reads the variable via `calc()` for opacity and translateY. IntersectionObserver short-circuits the scroll handler when the hero is offscreen. `init()` is wired to `astro:page-load` so view transitions rebind the active hero element.

**Tech Stack:** Astro 6.3 (with `ClientRouter` view-transitions enabled in `Base.astro:39`), inline `is:inline` script in `Hero.astro`, IntersectionObserver, requestAnimationFrame, CSS custom properties + `calc()`. No new dependencies.

---

## File Structure

Only one file is touched in this plan:

- **Modify:** `src/components/Hero.astro` — single attribute on the copy `<div>`, single CSS rule in the existing `<style>` block, ~30-line addition to the existing IIFE.

No new files. No other components affected.

---

## Verification Approach

The project has no test infrastructure (no Jest/Vitest/Playwright; `package.json` declares only `dev/build/preview/astro` scripts). The established verification pattern is:

1. `npm run build` — must succeed with 12 pages built
2. `npx astro check` — must report 0 errors / 0 warnings / 0 hints
3. **Chrome-mcp introspection** — load preview server in a controlled tab, use `mcp__claude-in-chrome__javascript_tool` to read computed styles, scroll the page programmatically, count event listeners, emulate reduced-motion

This plan uses that pattern. "Failing test" steps use chrome-mcp commands or `grep` against rendered output to demonstrate the assertion fails BEFORE the code change, then passes after.

**Preview server prerequisite:** `npm run preview -- --port 4322 --host 127.0.0.1` running in background. Tab ID is established by `mcp__claude-in-chrome__tabs_context_mcp` at the start of Task 1.

---

### Task 1: Mark the copy block with `data-hero-copy`

**Files:**
- Modify: `src/components/Hero.astro:75`

This task is markup-only. The attribute is dead until Task 2 adds the CSS rule that reads it.

- [ ] **Step 1: Verify the assertion fails before the change**

Run:
```bash
grep -c 'data-hero-copy' src/components/Hero.astro
```
Expected: `0` (attribute does not exist yet)

- [ ] **Step 2: Add the attribute**

Edit `src/components/Hero.astro:75`. Find:
```astro
  <div class="relative max-w-[1180px] mx-auto px-5 md:px-10 pb-20 md:pb-28 text-center text-[color:var(--color-cream)]">
```
Replace with:
```astro
  <div data-hero-copy class="relative max-w-[1180px] mx-auto px-5 md:px-10 pb-20 md:pb-28 text-center text-[color:var(--color-cream)]">
```

- [ ] **Step 3: Verify the assertion passes**

Run:
```bash
grep -c 'data-hero-copy' src/components/Hero.astro
```
Expected: `1`

- [ ] **Step 4: Build the site and confirm clean**

Run:
```bash
npm run build 2>&1 | tail -3
```
Expected output ends with `[build] 12 page(s) built` and `[build] Complete!`

- [ ] **Step 5: Type-check**

Run:
```bash
npx astro check 2>&1 | tail -3
```
Expected: `0 errors`, `0 warnings`, `0 hints`

- [ ] **Step 6: Confirm attribute reached dist HTML**

Run:
```bash
grep -o 'data-hero-copy' dist/index.html | wc -l
```
Expected: `1` (one match per home page locale → since this is the EN root, expect 1)

- [ ] **Step 7: Commit**

```bash
git add src/components/Hero.astro
git commit -m "$(cat <<'EOF'
chore(hero): add data-hero-copy hook on copy block

Marks the hero copy <div> as the bind point for the upcoming scroll-
driven exit animation. Pure markup addition — no styles or scripts
read this attribute yet, so behavior is unchanged.
EOF
)"
```

---

### Task 2: Bind `[data-hero-copy]` opacity + transform to `--hero-progress`

**Files:**
- Modify: `src/components/Hero.astro` — add a CSS rule inside the existing `<style>` block. Insertion point is between the rotator rules and the `@media (prefers-reduced-motion: reduce)` block (after line 135, before line 137).

This task adds the CSS but no JS. Since `--hero-progress` is never set, the `var(--hero-progress, 0)` default of 0 yields opacity 1 and translateY 0 — visually no change yet.

- [ ] **Step 1: Verify the rule does not exist yet**

Run:
```bash
grep -c 'data-hero-copy' src/components/Hero.astro
```
Expected: `1` (only the attribute from Task 1; rule not yet added)

- [ ] **Step 2: Insert the CSS rule**

Edit `src/components/Hero.astro`. Find:
```css
  .hero-rotator.fading > span {
    opacity: 0;
    transform: translateY(-4px);
  }

  @media (prefers-reduced-motion: reduce) {
```
Replace with:
```css
  .hero-rotator.fading > span {
    opacity: 0;
    transform: translateY(-4px);
  }

  /* Scroll-driven exit: copy lifts (-16px) and fades as --hero-progress goes 0→1.
     Default of 0 (var fallback) keeps copy fully visible when JS hasn't bound. */
  [data-hero-copy] {
    opacity: calc(1 - var(--hero-progress, 0));
    transform: translateY(calc(var(--hero-progress, 0) * -16px));
    will-change: opacity, transform;
  }

  @media (prefers-reduced-motion: reduce) {
```

- [ ] **Step 3: Build the site and confirm clean**

Run:
```bash
npm run build 2>&1 | tail -3
```
Expected: `12 page(s) built`, `Complete!`

- [ ] **Step 4: Type-check**

Run:
```bash
npx astro check 2>&1 | tail -3
```
Expected: `0 errors`, `0 warnings`, `0 hints`

- [ ] **Step 5: Verify the rule applies in the browser**

Get the current preview tab ID:
```
mcp__claude-in-chrome__tabs_context_mcp
```
Note the `tabId`. (If no tab exists, `tabs_create_mcp` then navigate to `http://127.0.0.1:4322/`.)

With `<TAB_ID>` from above, run via `mcp__claude-in-chrome__browser_batch`:
```json
[
  {"name": "navigate", "input": {"url": "http://127.0.0.1:4322/", "tabId": <TAB_ID>}},
  {"name": "javascript_tool", "input": {"action": "javascript_exec", "tabId": <TAB_ID>, "text": "(()=>{const hero=document.querySelector('[data-hero]');const copy=document.querySelector('[data-hero-copy]');const before={opacity:getComputedStyle(copy).opacity,transform:getComputedStyle(copy).transform};hero.style.setProperty('--hero-progress','0.5');const mid={opacity:getComputedStyle(copy).opacity,transform:getComputedStyle(copy).transform};hero.style.setProperty('--hero-progress','1');const end={opacity:getComputedStyle(copy).opacity,transform:getComputedStyle(copy).transform};hero.style.removeProperty('--hero-progress');return {before,mid,end};})()"}}
]
```
Expected:
- `before.opacity === "1"`, `before.transform === "matrix(1, 0, 0, 1, 0, 0)"` or `"none"`
- `mid.opacity === "0.5"`, `mid.transform === "matrix(1, 0, 0, 1, 0, -8)"` (translateY -8px)
- `end.opacity === "0"`, `end.transform === "matrix(1, 0, 0, 1, 0, -16)"` (translateY -16px)

If any assertion fails, the rule did not compile or the calc is off — STOP and reconcile before committing.

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero.astro
git commit -m "$(cat <<'EOF'
style(hero): bind copy block opacity + transform to --hero-progress

Adds a single CSS rule on [data-hero-copy] that interpolates opacity
and translateY from the --hero-progress custom property (0..1). With
no JS yet writing the variable, var() fallback of 0 means copy
renders at full opacity and zero transform — no visible change to
the page.

The rule is intentionally placed before the existing
prefers-reduced-motion @media block; the var() fallback handles
reduced motion automatically (when JS skips installing the scroll
listener, --hero-progress stays unset, opacity stays 1).
EOF
)"
```

---

### Task 3: Add IO + scroll listener + currentHero plumbing to the IIFE

**Files:**
- Modify: `src/components/Hero.astro:145-205` — replace the entire `<script is:inline>` block

This is the load-bearing task. The existing IIFE handles slideshow crossfade + tagline rotator; we add the scroll-exit animation alongside, preserving idempotent re-init via `astro:page-load`. The `reduced` flag is hoisted to IIFE level (read once at first IIFE execution) — this is a small behavioral change documented at the bottom of this task.

- [ ] **Step 1: Verify the assertion fails before the change**

Get the tab ID via `mcp__claude-in-chrome__tabs_context_mcp` if you don't already have it.

Run via `mcp__claude-in-chrome__javascript_tool` (`tabId`: `<TAB_ID>`):
```js
(() => {
  const hero = document.querySelector('[data-hero]');
  const copy = document.querySelector('[data-hero-copy]');
  // Programmatically scroll to ~50% of hero height
  const heroH = hero.getBoundingClientRect().height;
  window.scrollTo(0, heroH * 0.5);
  return {
    scrollY: window.scrollY,
    heroProgress: hero.style.getPropertyValue('--hero-progress') || '(unset)',
    copyOpacity: getComputedStyle(copy).opacity,
  };
})()
```
Expected: `heroProgress === '(unset)'` and `copyOpacity === '1'` (no JS yet writes the variable, so copy stays fully visible regardless of scroll).

After the assertion is confirmed, scroll back to top:
```js
window.scrollTo(0, 0)
```

- [ ] **Step 2: Replace the IIFE with the new structure**

Edit `src/components/Hero.astro`. Find:
```astro
<script is:inline>
  // Hero slideshow + tagline rotator. Zero-bundle: pure inline.
  (function () {
    // Outer guard: ClientRouter can re-execute inline scripts on revisit.
    // Without this, every revisit to the home page would spawn another
    // pair of intervals on top of the previously-running ones.
    if (window.__heroInited) return;
    window.__heroInited = true;

    let intervalIds = [];
    function clearTimers() {
      intervalIds.forEach(clearInterval);
      intervalIds = [];
    }

    function init() {
      // Clear any timers from a prior page render before starting fresh.
      clearTimers();

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const hero = document.querySelector("[data-hero]");
      if (!hero) return;

      // 1) Slideshow crossfade with Ken Burns
      const slides = hero.querySelectorAll(".hero-slide");
      if (!reduced && slides.length > 1) {
        let current = 0;
        intervalIds.push(setInterval(() => {
          slides[current].setAttribute("data-active", "false");
          current = (current + 1) % slides.length;
          slides[current].setAttribute("data-active", "true");
        }, 6500));
      }

      // 2) Tagline rotator
      const rotator = hero.querySelector(".hero-rotator");
      if (!reduced && rotator) {
        let phrases = [];
        try { phrases = JSON.parse(rotator.getAttribute("data-rotators") || "[]"); } catch (e) {}
        if (Array.isArray(phrases) && phrases.length >= 2) {
          let idx = 0;
          const inner = rotator.querySelector("span");
          intervalIds.push(setInterval(() => {
            rotator.classList.add("fading");
            setTimeout(() => {
              idx = (idx + 1) % phrases.length;
              if (inner) inner.textContent = phrases[idx];
              rotator.classList.remove("fading");
            }, 400);
          }, 4000));
        }
      }
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
    document.addEventListener("astro:page-load", init);
  })();
</script>
```

Replace with:
```astro
<script is:inline>
  // Hero slideshow + tagline rotator + scroll exit animation. Zero-bundle: pure inline.
  (function () {
    // Outer guard: ClientRouter can re-execute inline scripts on revisit.
    // Without this, every revisit to the home page would spawn another
    // pair of intervals on top of the previously-running ones.
    if (window.__heroInited) return;
    window.__heroInited = true;

    // Captured once at IIFE level so the scroll listener install is one-shot.
    // Trade-off: toggling prefers-reduced-motion mid-session requires a hard
    // reload to re-evaluate (acceptable — rare on a hotel marketing site).
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let intervalIds = [];
    function clearTimers() {
      intervalIds.forEach(clearInterval);
      intervalIds = [];
    }

    // ---- Scroll exit animation state (IIFE-level; survives view transitions) ----
    let currentHero = null;
    let isOnScreen = false;
    let ticking = false;

    const io = !reduced ? new IntersectionObserver(([entry]) => {
      isOnScreen = entry.isIntersecting;
    }, { threshold: 0 }) : null;

    function writeProgress() {
      if (!currentHero) return;
      const rect = currentHero.getBoundingClientRect();
      const h = rect.height;
      if (h <= 0) return;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1, scrolled / (h * 0.5));
      currentHero.style.setProperty("--hero-progress", String(progress));
    }

    function onScroll() {
      if (!isOnScreen || ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        writeProgress();
        ticking = false;
      });
    }

    if (!reduced) {
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    function init() {
      // Clear any timers from a prior page render before starting fresh.
      clearTimers();

      const hero = document.querySelector("[data-hero]");
      if (!hero) return;

      // 1) Slideshow crossfade with Ken Burns
      const slides = hero.querySelectorAll(".hero-slide");
      if (!reduced && slides.length > 1) {
        let current = 0;
        intervalIds.push(setInterval(() => {
          slides[current].setAttribute("data-active", "false");
          current = (current + 1) % slides.length;
          slides[current].setAttribute("data-active", "true");
        }, 6500));
      }

      // 2) Tagline rotator
      const rotator = hero.querySelector(".hero-rotator");
      if (!reduced && rotator) {
        let phrases = [];
        try { phrases = JSON.parse(rotator.getAttribute("data-rotators") || "[]"); } catch (e) {}
        if (Array.isArray(phrases) && phrases.length >= 2) {
          let idx = 0;
          const inner = rotator.querySelector("span");
          intervalIds.push(setInterval(() => {
            rotator.classList.add("fading");
            setTimeout(() => {
              idx = (idx + 1) % phrases.length;
              if (inner) inner.textContent = phrases[idx];
              rotator.classList.remove("fading");
            }, 400);
          }, 4000));
        }
      }

      // 3) Scroll exit animation: rebind IO to the freshly-rendered hero element
      // (Astro view transitions replace the DOM; closures pointing at the old
      // detached element would silently break getBoundingClientRect.)
      if (io) {
        if (currentHero && currentHero !== hero) io.unobserve(currentHero);
        currentHero = hero;
        io.observe(currentHero);
        // Seed initial progress in case scroll position is already > 0
        // (deep-link, scroll-restore on back/forward, or view transition mid-scroll)
        writeProgress();
      }
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
    document.addEventListener("astro:page-load", init);
  })();
</script>
```

- [ ] **Step 3: Build the site and confirm clean**

Run:
```bash
npm run build 2>&1 | tail -3
```
Expected: `12 page(s) built`, `Complete!`

- [ ] **Step 4: Type-check**

Run:
```bash
npx astro check 2>&1 | tail -3
```
Expected: `0 errors`, `0 warnings`, `0 hints`

- [ ] **Step 5: Verify the assertion now passes**

Get the tab ID via `mcp__claude-in-chrome__tabs_context_mcp`. Run via `mcp__claude-in-chrome__browser_batch` with `<TAB_ID>`:
```json
[
  {"name": "navigate", "input": {"url": "http://127.0.0.1:4322/", "tabId": <TAB_ID>}},
  {"name": "javascript_tool", "input": {"action": "javascript_exec", "tabId": <TAB_ID>, "text": "(()=>{window.scrollTo(0,0);const hero=document.querySelector('[data-hero]');const copy=document.querySelector('[data-hero-copy]');const heroH=hero.getBoundingClientRect().height;return new Promise(r=>requestAnimationFrame(()=>r({heroH,top:{progress:hero.style.getPropertyValue('--hero-progress')||'0',opacity:getComputedStyle(copy).opacity}})))})()"}},
  {"name": "javascript_tool", "input": {"action": "javascript_exec", "tabId": <TAB_ID>, "text": "(()=>{const hero=document.querySelector('[data-hero]');const copy=document.querySelector('[data-hero-copy]');const heroH=hero.getBoundingClientRect().height;window.scrollTo(0,heroH*0.5);return new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>r({scrolledTo:window.scrollY,progress:hero.style.getPropertyValue('--hero-progress'),opacity:getComputedStyle(copy).opacity,transform:getComputedStyle(copy).transform}))))})()"}},
  {"name": "javascript_tool", "input": {"action": "javascript_exec", "tabId": <TAB_ID>, "text": "(()=>{const hero=document.querySelector('[data-hero]');const copy=document.querySelector('[data-hero-copy]');const heroH=hero.getBoundingClientRect().height;window.scrollTo(0,heroH*0.25);return new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>r({scrolledTo:window.scrollY,progress:hero.style.getPropertyValue('--hero-progress'),opacity:getComputedStyle(copy).opacity}))))})()"}},
  {"name": "javascript_tool", "input": {"action": "javascript_exec", "tabId": <TAB_ID>, "text": "window.scrollTo(0,0)"}}
]
```

Expected:
- At top (scrollY=0): `progress` is `'0'` or `''` (empty/seeded zero), `opacity === '1'`
- At scrollY = 50% of hero height: `progress ≈ '1'`, `opacity ≈ '0'`, `transform` matches `matrix(1, 0, 0, 1, 0, -16)` (translateY -16px)
- At scrollY = 25% of hero height: `progress ≈ '0.5'`, `opacity ≈ '0.5'` (linear interpolation)

If progress is not monotonically increasing or doesn't reach 1 by 50% — STOP and reconcile.

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero.astro
git commit -m "$(cat <<'EOF'
feat(hero): scroll-driven copy fade + 16px lift on exit

As the user scrolls past the hero, the copy block (eyebrow, welcome,
heading, tagline/rotator, CTAs) fades to opacity 0 and translates up
16px. By the time half the hero has scrolled past the viewport top,
the copy is fully gone. Scroll-up reveals proportionally. Photo,
polaroid, and gradient masks hold.

Implementation:
- Single CSS variable --hero-progress (0..1) on [data-hero], written
  once per scroll frame via requestAnimationFrame
- IntersectionObserver with threshold:0 short-circuits the scroll
  handler when hero is offscreen
- Listeners + IO instantiated once at IIFE level (guarded by the
  existing __heroInited flag); init() updates a module-scoped
  currentHero ref and re-observes on every astro:page-load so view
  transitions don't leave closures pointing at detached elements
- Initial seed: writeProgress() called inside init() handles deep-
  link / scroll-restore scenarios where scrollY > 0 on page load

Behavioral note: prefers-reduced-motion is now captured once at IIFE
level (was per-init for slideshow + rotator). Toggling the OS
preference mid-session requires a hard reload to take effect across
all hero motion. Acceptable trade-off for a marketing site.

Verified at /, scrolling to 25%/50% of hero height yields proportional
progress (0.5/1.0) and matching computed opacity + translateY.
EOF
)"
```

---

### Task 4: Cross-locale + cross-viewport + reduced-motion validation

**Files:** None (validation only — no commit unless a regression is found)

This task verifies all 9 acceptance criteria from `2026-05-08-vila-emes-hero-exit-animation-design.md` against the implementation.

- [ ] **Step 1: Acceptance #1 + #2 — proportionality and 16px drift across all 4 locales at desktop**

Get the tab ID via `mcp__claude-in-chrome__tabs_context_mcp`. With `<TAB_ID>`, run via `mcp__claude-in-chrome__browser_batch`:
```json
[
  {"name": "resize_window", "input": {"width": 1440, "height": 900, "tabId": <TAB_ID>}},
  {"name": "navigate", "input": {"url": "http://127.0.0.1:4322/", "tabId": <TAB_ID>}},
  {"name": "javascript_tool", "input": {"action": "javascript_exec", "tabId": <TAB_ID>, "text": "(()=>{window.scrollTo(0,0);const hero=document.querySelector('[data-hero]');const copy=document.querySelector('[data-hero-copy]');const h=hero.getBoundingClientRect().height;const samples=[];for(const f of [0,0.25,0.5,0.75]){window.scrollTo(0,h*f);samples.push({frac:f,progress:Number(hero.style.getPropertyValue('--hero-progress'))||0,opacity:Number(getComputedStyle(copy).opacity),transform:getComputedStyle(copy).transform});}window.scrollTo(0,0);return {locale:'en',h,samples};})()"}},
  {"name": "navigate", "input": {"url": "http://127.0.0.1:4322/al/", "tabId": <TAB_ID>}},
  {"name": "javascript_tool", "input": {"action": "javascript_exec", "tabId": <TAB_ID>, "text": "(()=>{window.scrollTo(0,0);const hero=document.querySelector('[data-hero]');const copy=document.querySelector('[data-hero-copy]');const h=hero.getBoundingClientRect().height;const samples=[];for(const f of [0,0.5]){window.scrollTo(0,h*f);samples.push({frac:f,progress:Number(hero.style.getPropertyValue('--hero-progress'))||0,opacity:Number(getComputedStyle(copy).opacity)});}window.scrollTo(0,0);return {locale:'al',samples};})()"}},
  {"name": "navigate", "input": {"url": "http://127.0.0.1:4322/it/", "tabId": <TAB_ID>}},
  {"name": "javascript_tool", "input": {"action": "javascript_exec", "tabId": <TAB_ID>, "text": "(()=>{window.scrollTo(0,0);const hero=document.querySelector('[data-hero]');const copy=document.querySelector('[data-hero-copy]');const h=hero.getBoundingClientRect().height;const samples=[];for(const f of [0,0.5]){window.scrollTo(0,h*f);samples.push({frac:f,progress:Number(hero.style.getPropertyValue('--hero-progress'))||0,opacity:Number(getComputedStyle(copy).opacity)});}window.scrollTo(0,0);return {locale:'it',samples};})()"}},
  {"name": "navigate", "input": {"url": "http://127.0.0.1:4322/de/", "tabId": <TAB_ID>}},
  {"name": "javascript_tool", "input": {"action": "javascript_exec", "tabId": <TAB_ID>, "text": "(()=>{window.scrollTo(0,0);const hero=document.querySelector('[data-hero]');const copy=document.querySelector('[data-hero-copy]');const h=hero.getBoundingClientRect().height;const samples=[];for(const f of [0,0.5]){window.scrollTo(0,h*f);samples.push({frac:f,progress:Number(hero.style.getPropertyValue('--hero-progress'))||0,opacity:Number(getComputedStyle(copy).opacity)});}window.scrollTo(0,0);return {locale:'de',samples};})()"}}
]
```

Expected for each locale:
- At `frac: 0`: `progress: 0`, `opacity: 1`
- At `frac: 0.25` (EN only): `progress ≈ 0.5`, `opacity ≈ 0.5`
- At `frac: 0.5`: `progress: 1` (or ≥ 0.99), `opacity: 0` (or ≤ 0.01)
- At `frac: 0.75` (EN only): `progress: 1` (clamped), `opacity: 0`
- For EN: `transform` at `frac: 0.5` should be `matrix(1, 0, 0, 1, 0, -16)` confirming the 16px drift

- [ ] **Step 2: Acceptance #3 + #4 — photo and polaroid hold (EN home, desktop)**

Run via `mcp__claude-in-chrome__javascript_tool`:
```js
(() => {
  window.scrollTo(0, 0);
  const slide0 = document.querySelector('.hero-slide[data-active="true"] .hero-img');
  const polaroid = document.querySelector('figure.polaroid-wobble');
  const before = {
    slideTransform: getComputedStyle(slide0).transform,
    slideOpacity: getComputedStyle(slide0).opacity,
    polaroidOpacity: polaroid ? getComputedStyle(polaroid).opacity : '(no polaroid)',
    polaroidRect: polaroid ? polaroid.getBoundingClientRect().toJSON() : null,
  };
  const hero = document.querySelector('[data-hero]');
  const h = hero.getBoundingClientRect().height;
  window.scrollTo(0, h * 0.4); // mid-fade
  const after = {
    slideTransform: getComputedStyle(slide0).transform,
    slideOpacity: getComputedStyle(slide0).opacity,
    polaroidOpacity: polaroid ? getComputedStyle(polaroid).opacity : '(no polaroid)',
    polaroidRect: polaroid ? polaroid.getBoundingClientRect().toJSON() : null,
  };
  window.scrollTo(0, 0);
  return { before, after };
})()
```

Expected: `slideTransform`, `slideOpacity`, `polaroidOpacity` are identical before vs after. Polaroid `top` may differ by exactly the scroll delta (it stays positioned absolutely within `[data-hero]` which scrolls with the page) but its computed transform and opacity must not change.

- [ ] **Step 3: Acceptance #1 — verify on mobile viewport (EN home, 375 width)**

Run via `mcp__claude-in-chrome__browser_batch`:
```json
[
  {"name": "resize_window", "input": {"width": 375, "height": 812, "tabId": <TAB_ID>}},
  {"name": "navigate", "input": {"url": "http://127.0.0.1:4322/", "tabId": <TAB_ID>}},
  {"name": "javascript_tool", "input": {"action": "javascript_exec", "tabId": <TAB_ID>, "text": "(()=>{window.scrollTo(0,0);const hero=document.querySelector('[data-hero]');const copy=document.querySelector('[data-hero-copy]');const h=hero.getBoundingClientRect().height;const samples=[];for(const f of [0,0.5]){window.scrollTo(0,h*f);samples.push({frac:f,progress:Number(hero.style.getPropertyValue('--hero-progress'))||0,opacity:Number(getComputedStyle(copy).opacity)});}window.scrollTo(0,0);return {viewport:'mobile',h,samples};})()"}}
]
```

Expected: same proportionality as desktop — at `frac: 0` progress=0/opacity=1; at `frac: 0.5` progress≈1/opacity≈0.

- [ ] **Step 4: Acceptance #5 — reduced-motion: no scroll listener, copy stays static**

Reduced-motion must be emulated via DevTools because chrome-mcp's `javascript_tool` runs in page context and can't override the OS preference. Use Chrome DevTools Rendering panel: open DevTools, More tools → Rendering → "Emulate CSS media feature prefers-reduced-motion" → "reduce". Then run:

```js
(() => {
  // Hard reload required because prefers-reduced-motion is captured at IIFE level
  // (intentional trade-off documented in Task 3 commit message)
  return new Promise(r => {
    window.location.reload();
    setTimeout(() => {
      const hero = document.querySelector('[data-hero]');
      const copy = document.querySelector('[data-hero-copy]');
      const h = hero.getBoundingClientRect().height;
      const before = { progress: hero.style.getPropertyValue('--hero-progress'), opacity: getComputedStyle(copy).opacity };
      window.scrollTo(0, h * 0.5);
      const after = { progress: hero.style.getPropertyValue('--hero-progress'), opacity: getComputedStyle(copy).opacity };
      window.scrollTo(0, 0);
      r({ before, after });
    }, 1500);
  });
})()
```

Expected: `before.progress === ''` and `after.progress === ''` (variable never set), `before.opacity === '1'` and `after.opacity === '1'` (copy stays at default opacity regardless of scroll).

After verification, disable the emulation in DevTools.

- [ ] **Step 5: Acceptance #7 — no double-bind after view transition**

Restore desktop viewport (1440), navigate / → /rooms/ → / via clicking links (this triggers Astro view transitions). Then count scroll listeners bound by this script.

Chrome DevTools doesn't expose `window` listener inventory via JS. Use this proxy assertion instead — it verifies that the IIFE guard fired:

```js
(() => {
  return {
    iifeGuardSet: !!window.__heroInited,
    // The guard must have been set during initial home-page render and remained true
    // after navigating away and back. If it were re-running on each navigation,
    // the second run would also pass through and re-add listeners.
    currentHero: !!document.querySelector('[data-hero]'),
  };
})()
```

Expected: `iifeGuardSet: true`, `currentHero: true`.

For a stronger assertion, intercept `window.addEventListener` before the script runs (requires modifying the page, out of scope for verification). Trust the guard pattern, which is identical to the slideshow guard that has worked across prior view transitions per commit `87d2f8f`.

- [ ] **Step 6: Acceptance #9 — no console errors across all locales at both viewports**

Use `mcp__claude-in-chrome__read_console_messages` after each navigation. With `<TAB_ID>`, run via `mcp__claude-in-chrome__browser_batch`:
```json
[
  {"name": "resize_window", "input": {"width": 1440, "height": 900, "tabId": <TAB_ID>}},
  {"name": "navigate", "input": {"url": "http://127.0.0.1:4322/", "tabId": <TAB_ID>}},
  {"name": "navigate", "input": {"url": "http://127.0.0.1:4322/al/", "tabId": <TAB_ID>}},
  {"name": "navigate", "input": {"url": "http://127.0.0.1:4322/it/", "tabId": <TAB_ID>}},
  {"name": "navigate", "input": {"url": "http://127.0.0.1:4322/de/", "tabId": <TAB_ID>}}
]
```

Then call `mcp__claude-in-chrome__read_console_messages` with `pattern: "error|Error|TypeError"`.

Expected: zero matches. (Tab title may show 404s on missing favicons or font preload warnings — those are pre-existing and not introduced by this change. Filter for actual errors only.)

- [ ] **Step 7: Acceptance #8 — final build + type-check seal**

Run:
```bash
npm run build 2>&1 | tail -3 && npx astro check 2>&1 | tail -3
```
Expected: 12 pages built, 0/0/0.

- [ ] **Step 8: Decide on commit-or-nothing**

If all 7 verification steps passed: no commit needed; the implementation is sealed.

If any step revealed a regression: STOP, reconcile with the spec, fix in a follow-up commit (separate from Task 3's commit), and re-run the failed step.

---

## Self-Review

**Spec coverage:**
- Acceptance #1 (visual proportionality) → Task 4 Step 1
- Acceptance #2 (16px drift) → Task 4 Step 1 (transform check on EN)
- Acceptance #3 (photo holds) → Task 4 Step 2
- Acceptance #4 (polaroid holds) → Task 4 Step 2
- Acceptance #5 (reduced motion) → Task 4 Step 4
- Acceptance #6 (cross-browser) → not actively tested; the implementation uses only universal-evergreen features (IntersectionObserver, requestAnimationFrame, CSS custom properties, CSS calc, passive listeners), so the spec accepts this as trust-based
- Acceptance #7 (no double-bind) → Task 4 Step 5
- Acceptance #8 (build clean) → every task ends with `npm run build` + `npx astro check`; final seal in Task 4 Step 7
- Acceptance #9 (no console errors) → Task 4 Step 6

**Placeholder scan:** No "TBD"/"TODO"/"implement later" anywhere. All code blocks contain runnable code; all commands have expected output specified.

**Type/name consistency:**
- `currentHero` (module-scoped, mutable, references active `[data-hero]` element) — used consistently in Task 3
- `isOnScreen` (module-scoped boolean, IO-driven) — used consistently
- `ticking` (module-scoped boolean, rAF gate) — used consistently
- `io` (IntersectionObserver instance, null when reduced) — used consistently
- `writeProgress()` (no parameters, uses `currentHero` from closure) — used consistently
- `onScroll()` (rAF-throttled wrapper) — used consistently
- `--hero-progress` (CSS variable on `[data-hero]`) — same name in CSS rule (Task 2) and JS write (Task 3)
- `data-hero-copy` (HTML attribute) — same in markup (Task 1) and CSS selector (Task 2)

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-08-vila-emes-hero-exit-animation-implementation.md`. Two execution options:

1. **Subagent-Driven (recommended)** — fresh subagent per task, two-stage review between tasks, fast iteration
2. **Inline Execution** — execute tasks in this session using `superpowers:executing-plans`, batch execution with checkpoints for review

Which approach?
