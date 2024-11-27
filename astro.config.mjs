// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  site: "https://crobf.vercel.app",
  integrations: [mdx(), sitemap()],

  vite: {
      css: {
          preprocessorOptions: {
              sass: {
                  api: 'modern-compiler'
              },
              scss: {
                  api: 'modern-compiler'
              }
          }
      }
  },

  i18n: {
      locales: ["es", "en"],
      defaultLocale: "en",
      routing: {
          prefixDefaultLocale: true,
          redirectToDefaultLocale: true
      },
  },

  output: "server",
  adapter: vercel()
});