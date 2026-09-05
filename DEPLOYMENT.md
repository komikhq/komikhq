# Cloudflare Workers Deployment Guide (`komikhq-astro`)

This document outlines the deployment workflow for the Astro SSR frontend (`komikhq-astro`) to Cloudflare Workers using the **Cloudflare Dashboard (UI Web)** & **GitHub Integration**, highlighting the distinction between **Build-Time Variables** vs **Runtime Variables/Secrets**, and setting up Service Bindings to the Backend API.

---

## 1. Key Difference: Build-Time vs Runtime Variables in Cloudflare Workers

The Cloudflare Workers CI/CD platform segregates environment variables into 2 separate dashboard locations:

1. **Build-Time Variables & Secrets (Workers CI Section)**:
   - **Dashboard Location**: Worker `komikhq-astro` > **Settings** > **Build** > **Build variables & secrets**.
   - **Purpose**: Variables prefixed with `PUBLIC_*` required by Astro's bundler during compilation (`pnpm run build`). These values are statically embedded into client-side JavaScript bundles delivered to the browser.

2. **Runtime Variables & Secrets (Runtime Section)**:
   - **Dashboard Location**: Worker `komikhq-astro` > **Settings** > **Variables and secrets**.
   - **Purpose**: Server-side variables and secrets read by Astro SSR when processing requests on the Cloudflare Worker runtime.

---

## 2. Setup Deployment via Cloudflare Dashboard (GitHub Integration)

When importing the `komikhq-astro` repository for the first time via **Cloudflare Dashboard > Workers & Pages > Create > Import from Git**:

| Dashboard Form Field | Value / Input | Description |
| --- | --- | --- |
| **Project Name** | `komikhq-astro` | Worker project name in Cloudflare Dashboard. |
| **Production Branch** | `main` | Primary branch triggering auto-deployments. |
| **Build Command** | `pnpm run build` *(or `npm run build`)* | Command to execute Astro SSR build bundling. |
| **Build Output Directory** | `dist` | Output directory generated for Cloudflare Workers. |
| **Root Directory** | `/` (or leave blank) | Path to the Astro project directory in the GitHub repository. |

---

## 3. Configuration Tables (Build-Time & Runtime)

### Table 1: Build-Time Variables & Secrets (CI Section)
> [!IMPORTANT]
> Configure these variables in **Settings > Build > Build variables & secrets** before clicking **Save and Deploy**.

| Variable Name | Dashboard Type | Category | Description / Example Value |
| --- | --- | --- | --- |
| `PUBLIC_API_URL` | **Variable** | Public (Client) | Backend API endpoint URL (e.g., `https://api.komikhq.com`) |
| `PUBLIC_PUSHER_KEY` | **Variable** | Public (Client) | Pusher Channels App Key for browser WebSocket connection |
| `PUBLIC_PUSHER_CLUSTER` | **Variable** | Public (Client) | Pusher Channels Cluster (e.g., `ap1`) |

---

### Table 2: Runtime Variables & Secrets (Runtime Section)
> [!NOTE]
> Configure these variables/secrets in **Settings > Variables and secrets**.

| Variable Name | Dashboard Type | Category | Description / Example Value |
| --- | --- | --- | --- |
| `SESSION_SECRET` | **Encrypt (Secret)** | Sensitive | Secret key for SSR cookie/authentication encryption |

> [!TIP]
> **Preventing Dashboard Overwrites (`keep_vars = true`)**
> The `wrangler.jsonc` file in this project is configured with `"keep_vars": true`. Variables configured via Cloudflare Dashboard will not be wiped when deploying from terminal (`npx wrangler deploy`).

---

## 4. Service Binding to Backend API (`komikhq-api`)

To allow `komikhq-astro` to communicate directly with `komikhq-api` over Cloudflare's internal network without public HTTP latency:

1. Go to Worker `komikhq-astro` > **Settings** > **Bindings**.
2. Click **Add > Service Binding**.
3. Configure the following:
   - **Variable Name (Binding Name)**: `HONO_API`
   - **Target Service**: `komikhq-api`
   - **Target Environment**: `production` (or default)

---

## 5. Custom Domain Setup

1. Go to Worker `komikhq-astro` > **Settings** > **Domains & Routes**.
2. Add Custom Domains:
   - `komikhq.com`
   - `www.komikhq.com`

---

## 6. Inspection & Maintenance

- **Inspect Live SSR Logs**:
  Open Worker `komikhq-astro` > **Observability** > **Logs** or run via CLI:
  ```bash
  npx wrangler tail
  ```
