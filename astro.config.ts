import { defineConfig, fontProviders } from "astro/config";
import node from "@astrojs/node";
import db from "@astrojs/db";

export default defineConfig({
  output: "server",

  adapter: node({
    mode: "standalone",
  }),

  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: "Nunito",
        cssVariable: "--font-nunito",
        weights: ["600", "700"]
      },
      {
        provider: fontProviders.google(),
        name: "Averia Libre",
        cssVariable: "--font-averia-libre",
        weights: ["300"]
      },
    ],
  },

  integrations: [db()],
});
