// hero.jsx — three hero variants for Vila Emes, switchable via Tweaks.

const HERO_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroVariant": "photo"
}/*EDITMODE-END*/;

function HeroPhoto() {
  // Variant 1: full-bleed real photo + warm overlay + polaroid family note
  return (
    <section id="top" className="relative w-full h-[100svh] min-h-[640px] overflow-hidden">
      {/* photo — pulled up so the building & palms read, cars cropped */}
      <div className="absolute inset-0 bg-cover"
           style={{
             backgroundImage: "url('assets/vila-emes-exterior.png')",
             backgroundPosition: "center 18%",
             filter: "saturate(1.05) contrast(1.02)"
           }} />
      {/* stronger warm overlay for legibility */}
      <div className="absolute inset-0"
           style={{
             background:
               "linear-gradient(180deg, rgba(31,26,20,0.55) 0%, rgba(31,26,20,0.25) 25%, rgba(31,26,20,0.35) 55%, rgba(31,26,20,0.78) 100%), linear-gradient(120deg, rgba(194,91,63,0.20), rgba(46,92,126,0.05) 60%, transparent)"
           }} />
      {/* extra bottom scrim under the headline block */}
      <div className="absolute inset-x-0 bottom-0 h-[55%]"
           style={{ background: "linear-gradient(180deg, rgba(31,26,20,0) 0%, rgba(31,26,20,0.55) 60%, rgba(31,26,20,0.85) 100%)" }} />

      <div className="relative z-10 h-full max-w-[1280px] mx-auto px-5 md:px-10 flex flex-col">
        <div className="flex-1 flex items-end pb-20 md:pb-28">
          <div className="max-w-[820px]" style={{ textShadow: "0 2px 24px rgba(31,26,20,0.55)" }}>
            <p className="eyebrow text-cream mb-5">Durrës · Albania · Since 1998</p>
            <h1 className="text-cream font-serif text-[44px] leading-[1.02] sm:text-[68px] md:text-[92px] lg:text-[112px]">
              <span className="handwritten italic text-[0.5em] text-cream/95 mr-3 inline-block -translate-y-2">welcome to</span>
              <br />
              Vila&nbsp;Emes
            </h1>
            <p className="mt-6 md:mt-7 text-cream max-w-[44ch] text-[15px] md:text-[17px] leading-relaxed">
              Our small family hotel, two streets back from the Adriatic.
              Three generations. Sixteen rooms. The same coffee on the terrace every morning.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto" style={{ textShadow: "none" }}>
              <a href="#" className="btn btn-primary w-full sm:w-auto">
                Book on Booking.com
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
              <a href="#location" className="btn btn-outline w-full sm:w-auto">Open in Maps</a>
            </div>
          </div>
        </div>
      </div>

      {/* Polaroid family note, desktop only */}
      <div className="hidden lg:block absolute right-12 bottom-16 z-10"
           style={{ transform: "rotate(3deg)" }}>
        <div className="bg-cream p-3 pb-10 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)]"
             style={{ width: "230px" }}>
          <div className="aspect-[4/5] w-full bg-cover bg-center"
               style={{
                 backgroundImage: "url('assets/vila-emes-exterior.png')",
                 backgroundPosition: "center 22%"
               }} />
            <p className="handwritten text-[20px] text-ink mt-3 text-center leading-tight">our little house<br/>by the sea</p>
        </div>
      </div>
    </section>
  );
}

function HeroSplit() {
  // Variant 2: split — text left on cream, sunset gradient + photo right
  return (
    <section id="top" className="relative w-full min-h-[100svh] grid md:grid-cols-2 bg-cream">
      {/* Left: text on cream */}
      <div className="relative flex items-center px-5 md:px-12 lg:px-20 pt-32 pb-16 md:py-24 order-2 md:order-1">
        {/* faint diagonal warm wash */}
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: "radial-gradient(ellipse 80% 50% at 0% 100%, rgba(194,91,63,0.07), transparent 60%)" }} />
        <div className="relative max-w-[560px]">
          <p className="eyebrow text-muted mb-6">Durrës · Albania</p>
          <h1 className="font-serif text-ink text-[48px] leading-[1.02] sm:text-[64px] md:text-[76px] lg:text-[92px]">
            A small <span className="handwritten italic text-terracotta">family</span><br/>
            hotel by<br/>
            the sea.
          </h1>
          <p className="mt-7 text-ink/80 max-w-[44ch] text-[16px] md:text-[17px] leading-relaxed">
            Vila Emes has been kept by three generations of one family
            since 1998. You'll find us in Durrës, two streets back from the Adriatic —
            with the kettle on and a room made up.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <a href="#" className="btn btn-primary w-full sm:w-auto">
              Book on Booking.com
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
            <a href="#location" className="btn btn-outline-sea w-full sm:w-auto">Open in Maps</a>
          </div>

          <div className="hairline w-16 mt-12 mb-5"></div>
          <p className="handwritten text-[24px] text-terracotta">— with love, the Emes family</p>
        </div>
      </div>

      {/* Right: sunset gradient + photo */}
      <div className="relative order-1 md:order-2 h-[60svh] md:h-auto overflow-hidden">
        {/* sunset gradient backdrop */}
        <div className="absolute inset-0"
             style={{
               background:
                 "radial-gradient(ellipse 90% 70% at 30% 110%, rgba(194,91,63,0.55), transparent 60%)," +
                 "radial-gradient(ellipse 70% 60% at 80% 0%, rgba(232,200,165,0.5), transparent 60%)," +
                 "linear-gradient(200deg,#F5D3A8 0%, #E29B72 30%, #C25B3F 60%, #6F4969 85%, #2E5C7E 100%)"
             }} />
        {/* photo, blended */}
        <div className="absolute inset-0 bg-cover bg-center"
             style={{
               backgroundImage: "url('assets/vila-emes-exterior.png')",
               backgroundPosition: "center 35%",
               mixBlendMode: "multiply",
               opacity: 0.85
             }} />
        {/* subtle warm wash on top */}
        <div className="absolute inset-0"
             style={{ background: "linear-gradient(180deg, rgba(31,26,20,0.10), rgba(31,26,20,0) 30%, rgba(31,26,20,0.25))" }} />

        {/* handwritten signature, bottom-right */}
        <div className="absolute right-6 bottom-6 md:right-10 md:bottom-10 text-cream/90 text-right">
          <p className="handwritten text-[26px] md:text-[34px] leading-tight">welcome home</p>
          <p className="eyebrow text-cream/70 mt-1">est. 1998</p>
        </div>
      </div>
    </section>
  );
}

function HeroApp() {
  const [t, setTweak] = useTweaks(HERO_DEFAULTS);

  let HeroEl;
  if (t.heroVariant === "split") HeroEl = <HeroSplit />;
  else HeroEl = <HeroPhoto />;

  // Tell the existing site-header script which variant we're in so it can
  // start solid for the cream-backed split layout (no transparent contrast).
  React.useEffect(() => {
    const header = document.getElementById('siteHeader');
    if (!header) return;
    if (t.heroVariant === "split") {
      header.dataset.heroLight = "true";
    } else {
      header.dataset.heroLight = "false";
    }
    // Re-run scroll handler if available
    if (typeof window.__updateHeader === 'function') window.__updateHeader();
  }, [t.heroVariant]);

  return (
    <>
      {HeroEl}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Hero variant" />
        <TweakRadio
          label="Style"
          value={t.heroVariant}
          options={[
            { value: "photo", label: "Photo" },
            { value: "split", label: "Split" },
          ]}
          onChange={(v) => setTweak('heroVariant', v)}
        />
        <p style={{ fontSize: 11, color: '#7a6e5d', padding: '4px 8px 8px', lineHeight: 1.4 }}>
          Photo: full-bleed exterior · polaroid note.<br/>
          Split: text on cream · sunset photo right.
        </p>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('hero-root')).render(<HeroApp />);
