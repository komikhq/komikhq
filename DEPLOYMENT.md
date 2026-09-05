# Cloudflare Workers Deployment Guide (`komikhq-astro`)

This document outlines the deployment workflow for the Astro SSR frontend (`komikhq-astro`) to Cloudflare Workers Assets & SSR Adapter, environment variable management (Build-time vs Runtime), Service Bindings to `komikhq-api`, and usage of `keep_vars = true`.

---

## 1. Environment Variables & Secrets Setup

### A. Build-time vs Runtime Variables
When targeting Astro to Cloudflare Workers:
1. **Build-Time Variables (`PUBLIC_*`)**:
   - Variables embedded directly into client-side browser JavaScript bundles during `pnpm run build` (e.g., `PUBLIC_API_URL`, `PUBLIC_PUSHER_KEY`).
   - Configure these in your `.env` file (see [`.env.example`](./.env.example)) or CI/CD environment before executing the build command.

2. **Runtime Variables & Secrets**:
   - Server-side variables accessed at SSR runtime via `Astro.locals` or Cloudflare Env bindings.
   - Set via terminal using `wrangler secret put <KEY>` or through the Cloudflare Dashboard.

> [!IMPORTANT]
> **Preventing Dashboard Variable Overwrites (`keep_vars = true`)**
> The `wrangler.jsonc` file in this project is configured with `"keep_vars": true`. This ensures that environment variables configured directly through the Cloudflare Dashboard will **NOT be deleted or overwritten** during CLI deployment (`wrangler deploy`).

### B. Adding Secrets (if required)
```bash
npx wrangler secret put SESSION_SECRET
```

---

## 2. Build & Deployment Commands

### Step 1: Type Checking
Ensure the project is clean of syntax or type errors:
```bash
pnpm run typecheck
```

### Step 2: Build Astro Production Bundle
Run the Astro SSR bundling process targeted for Cloudflare Workers (`@astrojs/cloudflare`):
```bash
pnpm run build
```
*This produces static assets in `./dist` and the server entrypoint for the Worker.*

### Step 3: Deploy to Cloudflare Workers
Deploy the application bundle and assets to Cloudflare Workers:
```bash
pnpm run deploy
# Or directly:
npx wrangler deploy
```

---

## 3. Configuration & Service Bindings (`wrangler.jsonc`)

- **Custom Domains**:
  - `komikhq.com`
  - `www.komikhq.com`
- **Workers Dev Domain**: `workers_dev: true` (`komikhq-astro.<your-subdomain>.workers.dev`)
- **Service Binding to Backend Hono API**:
  `komikhq-astro` connects internally to `komikhq-api` without public HTTP latency using Cloudflare Service Bindings:
  ```jsonc
  "services": [
    {
      "binding": "HONO_API",
      "service": "komikhq-api"
    }
  ]
  ```

---

## 4. Troubleshooting & Maintenance

- **Inspect Live SSR Logs**:
  ```bash
  npx wrangler tail
  ```
- **Validate Build Locally**:
  ```bash
  pnpm run preview
  ```
