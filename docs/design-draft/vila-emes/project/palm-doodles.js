// Scatter small palm doodles across the page — decorative, behind content.
(function () {
  const SVG = `<svg viewBox="0 0 80 90" fill="none" aria-hidden="true">
    <path d="M40 90V40" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M40 40C40 28 28 18 8 18 8 28 18 38 40 40" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M40 40C40 28 52 18 72 18 72 28 62 38 40 40" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M40 38C40 26 32 12 16 4 14 16 22 30 40 38" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M40 38C40 26 48 12 64 4 66 16 58 30 40 38" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </svg>`;

  // Per-section recipe: how many, where, sizes, rotation, opacity, color
  // Skip: header, page-hero (already has palms), footer
  function plant(section, count, recipe) {
    if (!section) return;
    const cs = getComputedStyle(section);
    if (cs.position === 'static') section.style.position = 'relative';
    if (!section.style.overflow || cs.overflow === 'visible') section.style.overflow = 'hidden';
    for (let i = 0; i < count; i++) {
      const r = recipe(i);
      const el = document.createElement('div');
      el.className = 'palm-doodle';
      el.style.cssText = `top:${r.top};${r.right!==undefined?'right:'+r.right:''};${r.left!==undefined?'left:'+r.left:''};
        width:${r.size}px;height:${r.size*1.05}px;transform:rotate(${r.rot}deg);opacity:${r.op};color:${r.color||'#C25B3F'};`;
      el.innerHTML = SVG;
      section.appendChild(el);
    }
  }

  function rand(seed) { // deterministic-ish per-page jitter using a counter
    let i = seed;
    return () => { i = (i * 9301 + 49297) % 233280; return i / 233280; };
  }

  document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const r = rand(7);
    sections.forEach((s, idx) => {
      // Skip page-hero and contact-strip-style sections that already feel busy
      if (s.classList.contains('page-hero')) return;
      if (s.querySelector('.palm')) return; // homepage hero variants
      // 1–2 palms per section, alternating sides
      const count = 1 + Math.floor(r() * 2);
      plant(s, count, (i) => {
        const onLeft = (idx + i) % 2 === 0;
        const size = 60 + Math.floor(r() * 60);   // 60–120px
        const op   = 0.05 + r() * 0.05;            // 0.05–0.10
        const top  = (10 + r() * 70).toFixed(0) + '%';
        const off  = (-20 + r() * 60).toFixed(0) + 'px';
        return {
          top,
          [onLeft ? 'left' : 'right']: off,
          size,
          rot: (r() * 30 - 15).toFixed(1),
          op: op.toFixed(2),
          color: '#C25B3F',
        };
      });
    });
  });
})();
