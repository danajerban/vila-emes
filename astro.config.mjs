// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://www.vilaemes.com",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "al", "it", "de"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  // Sitemap re-states the locale → BCP-47 mapping; @astrojs/sitemap does not
  // auto-reuse Astro's top-level i18n config. Mirror LOCALE_TO_LANG in
  // src/i18n/locales.ts (URL key "al" → lang tag "sq").
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en",
          al: "sq",
          it: "it",
          de: "de",
        },
      },
      // Inject x-default per URL so the sitemap matches the
      // <link rel="alternate" hreflang="x-default"> emitted in <head>.
      // @astrojs/sitemap's i18n option only emits the configured locale
      // alternates — x-default isn't supported natively.
      //
      // x-default points to the EN equivalent of each URL (mirroring
      // Seo.astro's per-page logic), not blanket-homepage. This keeps
      // head and sitemap consistent so Search Console doesn't flag a
      // discrepancy between the two signals.
      serialize(item) {
        const enUrl = item.links?.find((l) => l.lang === "en")?.url ?? item.url;
        item.links = [...(item.links ?? []), { lang: "x-default", url: enUrl }];
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: [".ngrok-free.app", ".ngrok.io", ".ngrok.app", ".trycloudflare.com"],
    },
  },
});
