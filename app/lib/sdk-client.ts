/**
 * KomikHQ Unified SDK Client
 *
 * The single initialization point for all API clients across the frontend.
 * The base URL is baked into the SDK (https://api.komikhq.com),
 * so NO manual URL configuration or environment variable is required.
 *
 * Every instance uses coalescingFetch to prevent duplicate HTTP
 * requests to the same endpoint and parameters.
 */

import {
  Configuration,
  BASE_PATH as DEFAULT_BASE_PATH,
  ComicsApi,
  ChaptersApi,
  GenresApi,
  BookmarksApi,
  CommentsApi,
  SearchApi,
  ViewsApi,
  ReadingHistoryApi,
  AdministrationApi,
  ModerationApi,
  UsersApi,
  SystemApi,
  RatingsApi,
  HealthApi,
  SitemapsApi,
} from "@komikhq/komikhq-typescript"
import { coalescingFetch } from "@/lib/coalescing-fetch"

// Dynamic API Base URL resolution: prefers env vars (SSR or Vite client) before fallback to SDK default
export const BASE_PATH =
  (typeof process !== "undefined" && (process.env.PUBLIC_API_URL || process.env.BASE_PATH)) ||
  (typeof import.meta !== "undefined" && (import.meta.env?.PUBLIC_API_URL || (import.meta.env as any)?.BASE_PATH || import.meta.env?.VITE_PUBLIC_API_URL)) ||
  DEFAULT_BASE_PATH

const sdkConfig = new Configuration({
  basePath: BASE_PATH,
  credentials: "include", // Automatically sends the komikhq.session_token cookie
  fetchApi: coalescingFetch, // Single-flight + in-memory TTL cache
})

// ── Public APIs ─────────────────────────────────────────────
export const comicsApi = new ComicsApi(sdkConfig)
export const chaptersApi = new ChaptersApi(sdkConfig)
export const genresApi = new GenresApi(sdkConfig)
export const searchApi = new SearchApi(sdkConfig)
export const healthApi = new HealthApi(sdkConfig)
export const sitemapsApi = new SitemapsApi(sdkConfig)

// ── Authenticated User APIs ─────────────────────────────────
export const bookmarksApi = new BookmarksApi(sdkConfig)
export const commentsApi = new CommentsApi(sdkConfig)
export const readingHistoryApi = new ReadingHistoryApi(sdkConfig)
export const ratingsApi = new RatingsApi(sdkConfig)
export const viewsApi = new ViewsApi(sdkConfig)
export const usersApi = new UsersApi(sdkConfig)

// ── Admin APIs ──────────────────────────────────────────────
export const administrationApi = new AdministrationApi(sdkConfig)
export const moderationApi = new ModerationApi(sdkConfig)
export const systemApi = new SystemApi(sdkConfig)

// Re-export the configuration & dynamically resolved BASE_PATH
export { sdkConfig }

/**
 * Resolves a WebSocket URL dynamically using BASE_PATH.
 */
export function getRealtimeWebSocketUrl(
  channel: string,
  extraParams?: Record<string, string>
): string {
  const url = new URL("/realtime/ws", BASE_PATH)
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:"
  url.searchParams.set("channel", channel)
  if (extraParams) {
    for (const [key, val] of Object.entries(extraParams)) {
      if (val != null) url.searchParams.set(key, val)
    }
  }
  return url.toString()
}

