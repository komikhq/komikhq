// @ts-check

import tailwindcss from "@tailwindcss/vite"
import cloudflare from "@astrojs/cloudflare"
import { defineConfig } from "astro/config"
import react from "@astrojs/react"

// https://astro.build/config
/**
 * @reminder (Phosphor Icons & React Compiler):
 * - Phosphor Icons (@phosphor-icons/react >= 2.1.0):
 *   Currently imported using aliases `*Icon as <Name>` (e.g. `ImageIcon as Image`)
 *   to resolve deprecation warnings ts(6385) without modifying hundreds of JSX tags.
 *   TODO / ROADMAP: Refactor to direct canonical naming `<ImageIcon />`, `<CircleNotchIcon />`, etc.
 *   across all JSX templates without the `as` alias during the next scheduled icon cleanup.
 * - React Compiler:
 *   Rule `react-hooks/incompatible-library` is disabled in eslint.config.js for UI components
 *   because TanStack Table (@tanstack/react-table) returns dynamic APIs incompatible with compiler memoization.
 */
export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react()],
})
