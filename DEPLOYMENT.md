# Cloudflare Workers Deployment Guide (`komikhq-astro`)

This document outlines the deployment workflow for the Astro SSR frontend (`komikhq-astro`) to Cloudflare Workers using the **Cloudflare Dashboard (UI Web)** & **GitHub Integration**, highlighting the distinction between **Build-Time Variables** vs **Runtime Variables/Secrets**, and infrastructure configuration via `wrangler.jsonc`.

---

## 1. Key Difference: Build-Time vs Runtime Variables in Cloudflare Workers

The Cloudflare Workers CI/CD platform segregates environment variables into 2 separate dashboard locations:

1. **Build-Time Variables & Secrets (Workers CI Section)**:
   - **Dashboard Location**: Worker `komikhq` > **Settings** > **Build** > **Build variables & secrets**.
   - **Purpose**: Variables prefixed with `PUBLIC_*` required by Astro's bundler during compilation (`pnpm run build`). These values are statically embedded into client-side JavaScript bundles delivered to the browser.

2. **Runtime Variables & Secrets (Runtime Section)**:
   - **Dashboard Location**: Worker `komikhq` > **Settings** > **Variables and secrets**.
   - **Purpose**: Server-side variables and secrets read by Astro SSR when processing requests on the Cloudflare Worker runtime.

---

## 2. Setup Deployment via Cloudflare Dashboard (GitHub Integration)

When importing the GitHub repository `komikhq/komikhq` for the Astro frontend via **Cloudflare Dashboard > Workers & Pages > Create > Import from Git**:

| Dashboard Form Field | Value / Input | Description |
| --- | --- | --- |
| **Project Name** | `komikhq` | Worker project name in Cloudflare Dashboard (matches repo name `komikhq/komikhq`). |
| **Production Branch** | `main` | Primary branch triggering auto-deployments. |
| **Build Command** | `pnpm run build` *(or `npm run build`)* | Command to execute Astro SSR build bundling. |
| **Build Output Directory** | `dist` | Output directory generated for Cloudflare Workers. |
| **Root Directory** | `/` (or leave blank) | Path to the Astro project directory in GitHub repo (`komikhq/komikhq`). |

> [!NOTE]
> Ensure the `"name"` property in `wrangler.jsonc` matches your Cloudflare Worker project name: `"name": "komikhq"`.

---

## 3. Configuration Table (Build-Time Variables)

### Build-Time Variables & Secrets (CI Section)
> [!IMPORTANT]
> Configure these variables in **Settings > Build > Build variables & secrets** before clicking **Save and Deploy**.

| Variable Name | Dashboard Type | Category | Description / Example Value |
| --- | --- | --- | --- |
| `PUBLIC_API_URL` | **Variable** | Public (Client) | Backend API endpoint URL (e.g., `https://api.komikhq.com`) |
| `PUBLIC_PUSHER_KEY` | **Variable** | Public (Client) | Pusher Channels App Key for browser WebSocket connection |
| `PUBLIC_PUSHER_CLUSTER` | **Variable** | Public (Client) | Pusher Channels Cluster (e.g., `ap1`) |

---

## 4. Service Binding & Infrastructure (`wrangler.jsonc`)

> [!IMPORTANT]
> All bindings (Service Bindings, Assets, Routes) **MUST be declared in `wrangler.jsonc`** as code. Do NOT configure bindings via the Cloudflare Dashboard UI.

To allow `komikhq` to communicate directly with `komikhq-api` over Cloudflare's internal network without public HTTP latency, the Service Binding is configured in `wrangler.jsonc`:

```jsonc
"services": [
  {
    "binding": "BACKEND",
    "service": "komikhq-api"
  }
]
```

### Custom Domains (`wrangler.jsonc`)
Custom domains are also declared directly in `wrangler.jsonc`:
```jsonc
"routes": [
  {
    "pattern": "komikhq.com",
    "custom_domain": true
  },
  {
    "pattern": "www.komikhq.com",
    "custom_domain": true
  }
]
```

---

## 5. Inspection & Maintenance

- **Inspect Live SSR Logs**:
  Open Worker `komikhq` > **Observability** > **Logs** or run via CLI:
  ```bash
  npx wrangler tail
  ```
