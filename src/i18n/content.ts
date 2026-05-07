import { getEntry } from "astro:content";
import type { Lang } from "./locales";

// Loads the per-locale `site.<lang>.yaml` content collection entry.
// Each YAML file is registered as a distinct entry under the "site" collection,
// keyed by its filename (en, al, it, de).
export async function getSite(lang: Lang) {
  const entry = await getEntry("site", lang);
  if (!entry) {
    throw new Error(`No content entry for locale: ${lang}`);
  }
  return entry;
}
