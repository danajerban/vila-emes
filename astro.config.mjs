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
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: [".ngrok-free.app", ".ngrok.io", ".ngrok.app", ".trycloudflare.com"],
    },
  },
});
