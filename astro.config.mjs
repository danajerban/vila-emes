// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://vila-emes.pages.dev", // TODO: replace with custom domain when purchased
  i18n: {
    defaultLocale: "en",
    locales: ["en", "al", "it", "de"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
