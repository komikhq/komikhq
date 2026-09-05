// @ts-check

import tailwindcss from "@tailwindcss/vite"
import cloudflare from "@astrojs/cloudflare"
import { defineConfig } from "astro/config"
import react from "@astrojs/react"

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react()],
})

