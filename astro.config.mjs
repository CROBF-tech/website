// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";

import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
    site: "https://crobf.tech",
    integrations: [mdx(), sitemap(), react()],
    vite: {
      css: {
          preprocessorOptions: {
                sass: {
                  // @ts-ignore - valid Vite 5.4+ option not yet in types
                  api: "modern-compiler",
              },
              scss: {
                  // @ts-ignore - valid Vite 5.4+ option not yet in types
                  api: "modern-compiler",
              },
          },
      },

      plugins: [tailwindcss()],
    },
    output: "server",
    adapter: vercel(),
});