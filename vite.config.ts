import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/

export default defineConfig({
  build: {
    // Off for production: the maps are 4.4MB and publish the original source.
    // Flip to true when you need to debug a deployed build.
    sourcemap: false,
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      manifest: {
        name: "CharityLife — редакційний архів",
        short_name: "CharityLife",
        description:
          "Незалежний редакційний архів про дизайн, здоровʼя, подорожі, відносини та їжу.",
        lang: "uk",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#faf9f7",
        theme_color: "#bd3900",
        icons: [
          {
            src: "/favicon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any",
          },
        ],
      },
    }),
  ],
});
