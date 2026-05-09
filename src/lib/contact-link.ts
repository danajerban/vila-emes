// Base64-encodes contact URLs at build time so literal `tel:` / `wa.me/`
// patterns never appear in static HTML. Pairs with the click decoder in
// Base.astro (atob → navigate). Goal: defeat mass scrapers that grep for
// those URL schemes — not a security boundary; visible text is unchanged.
export function obscureLink(url: string): string {
  return Buffer.from(url, "utf-8").toString("base64");
}
