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
  BASE_PATH,
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
  AuthenticationApi,
  RatingsApi,
  RealtimeApi,
  HealthApi,
  SitemapsApi,
} from "@komikhq/komikhq-typescript"
import { coalescingFetch } from "@/lib/coalescing-fetch"

const sdkConfig = new Configuration({
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
export const authenticationApi = new AuthenticationApi(sdkConfig)
export const bookmarksApi = new BookmarksApi(sdkConfig)
export const commentsApi = new CommentsApi(sdkConfig)
export const readingHistoryApi = new ReadingHistoryApi(sdkConfig)
export const ratingsApi = new RatingsApi(sdkConfig)
export const viewsApi = new ViewsApi(sdkConfig)
export const realtimeApi = new RealtimeApi(sdkConfig)
export const usersApi = new UsersApi(sdkConfig)

// ── Admin APIs ──────────────────────────────────────────────
export const administrationApi = new AdministrationApi(sdkConfig)
export const moderationApi = new ModerationApi(sdkConfig)

// Re-export the configuration & BASE_PATH from the SDK
export { sdkConfig }
export { BASE_PATH } from "@komikhq/komikhq-typescript"

/**
 * Resolves a WebSocket URL dynamically using the SDK's RealtimeApi endpoint definition and BASE_PATH.
 * No hardcoded paths or hosts are used.
 */
export async function getRealtimeWebSocketUrl(
  channel: string,
  extraParams?: Record<string, string>
): Promise<string> {
  const opts = await realtimeApi.connectRealtimeWebSocketRequestOpts({ channel })
  const url = new URL(opts.path, BASE_PATH)
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:"
  if (opts.query) {
    for (const [key, val] of Object.entries(opts.query)) {
      if (val != null) url.searchParams.set(key, String(val))
    }
  }
  if (extraParams) {
    for (const [key, val] of Object.entries(extraParams)) {
      if (val != null) url.searchParams.set(key, val)
    }
  }
  return url.toString()
}

