// Locale registry. URL prefix is the same as the locale key for AL/IT/DE.
// `<html lang="">` uses ISO 639-1 ("sq" for Albanian, not "al").

export const LOCALES = ["en", "al", "it", "de"] as const;
export type Lang = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Lang = "en";

// Locale key → BCP 47 / ISO 639-1 language tag for <html lang="">
export const LOCALE_TO_LANG: Record<Lang, string> = {
  en: "en",
  al: "sq",
  it: "it",
  de: "de",
};

// Locale key → Open Graph locale (language_TERRITORY per OG spec).
// Used in og:locale and og:locale:alternate. en_US chosen as the most
// common default for international tourist audiences; swap to en_GB if
// targeting UK-first markets.
export const LOCALE_TO_OG_LOCALE: Record<Lang, string> = {
  en: "en_US",
  al: "sq_AL",
  it: "it_IT",
  de: "de_DE",
};

// Locale key → human-readable name (used in lang switcher)
export const LOCALE_LABELS: Record<Lang, string> = {
  en: "English",
  al: "Shqip",
  it: "Italiano",
  de: "Deutsch",
};

export function isLang(value: string): value is Lang {
  return (LOCALES as readonly string[]).includes(value);
}

// Build a path with the locale prefix. EN is unprefixed; others get `/<lang>` prefix.
export function localizedPath(lang: Lang, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (lang === DEFAULT_LOCALE) return clean;
  return `/${lang}${clean === "/" ? "" : clean}`;
}

// Strip a leading locale prefix from a path. Used by LangSwitch to find
// "the same page in another locale."
export function stripLocalePrefix(path: string): string {
  const match = path.match(/^\/(en|al|it|de)(\/.*)?$/);
  if (!match) return path;
  return match[2] || "/";
}
