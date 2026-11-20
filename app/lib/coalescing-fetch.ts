/**
 * Coalescing Fetch — In-Flight Request Deduplication & In-Memory TTL Cache.
 *
 * For GET requests:
 *   1. If a valid cached entry exists in memory → construct and return a fresh new Response.
 *   2. If a request to the same URL is already in-flight → await the same
 *      Promise, buffer the body once, and return independent fresh Responses.
 *   3. If neither → execute a new fetch, cache serialized payload, and return a fresh Response.
 *
 * Note on Cloudflare Workers / Fetch standard:
 * Raw WHATWG `Response` objects must NEVER be stored directly in memory cache across requests
 * because their `ReadableStream` bodies become locked/disturbed once consumed. Storing serialized
 * payload (bodyText + metadata) guarantees clean, unconsumed streams for every request.
 *
 * For non-GET requests (POST, PUT, DELETE, etc.): bypass directly to fetch().
 */

interface CachedPayload {
  bodyText: string
  status: number
  statusText: string
  headers: [string, string][]
  expiresAt: number
}

const inFlightRequests = new Map<string, Promise<CachedPayload>>()
const memoryCache = new Map<string, CachedPayload>()

/** Resolve the TTL (ms) based on the endpoint path. Only public data is cached. */
function resolveTtl(url: string): number {
  // Never cache authenticated, user-specific, or administrative endpoints
  if (
    url.includes("/bookmarks") ||
    url.includes("/history") ||
    url.includes("/users") ||
    url.includes("/account") ||
    url.includes("/auth") ||
    url.includes("/admin") ||
    url.includes("/moderation") ||
    url.includes("/ratings")
  ) {
    return 0
  }

  if (url.includes("/genres")) return 3_600_000 // 1 hour — genre list rarely changes
  if (url.includes("/trending")) return 30_000 // 30 seconds
  if (url.includes("/comics") || url.includes("/chapters")) return 30_000 // 30 seconds
  return 0 // Default: do not cache in memory
}

function createFreshResponse(payload: CachedPayload): Response {
  return new Response(payload.bodyText, {
    status: payload.status,
    statusText: payload.statusText,
    headers: new Headers(payload.headers),
  })
}

/**
 * Drop-in replacement for `window.fetch` / `globalThis.fetch`.
 * Passed to `Configuration({ fetchApi: coalescingFetch })` on the SDK client.
 */
export async function coalescingFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const method = (init?.method || "GET").toUpperCase()

  // Mutations are sent directly without caching/coalescing
  if (method !== "GET") {
    return fetch(input, init)
  }

  const urlKey = typeof input === "string" ? input : input.toString()
  const ttl = resolveTtl(urlKey)

  // 1. Check memory cache (only for cacheable endpoints)
  if (ttl > 0) {
    const cached = memoryCache.get(urlKey)
    if (cached && cached.expiresAt > Date.now()) {
      return createFreshResponse(cached)
    }
  }

  // 2. Coalesce with an already in-flight request
  const pending = inFlightRequests.get(urlKey)
  if (pending) {
    const payload = await pending
    return createFreshResponse(payload)
  }

  // 3. Execute a new request
  const executionPromise = (async (): Promise<CachedPayload> => {
    try {
      const response = await fetch(input, init)
      const bodyText = await response.text()
      const headers = Array.from(response.headers.entries())

      const payload: CachedPayload = {
        bodyText,
        status: response.status,
        statusText: response.statusText,
        headers,
        expiresAt: response.ok && ttl > 0 ? Date.now() + ttl : 0,
      }

      if (payload.expiresAt > 0) {
        memoryCache.set(urlKey, payload)
      }

      return payload
    } finally {
      inFlightRequests.delete(urlKey)
    }
  })()

  inFlightRequests.set(urlKey, executionPromise)
  const result = await executionPromise
  return createFreshResponse(result)
}

/**
 * Clears all or a subset of the memory cache.
 * Useful after mutations (bookmark toggle, rating submit, etc.)
 * so the next request fetches fresh data from the server.
 */
export function invalidateCache(urlSubstring?: string): void {
  if (!urlSubstring) {
    memoryCache.clear()
    return
  }
  for (const key of memoryCache.keys()) {
    if (key.includes(urlSubstring)) {
      memoryCache.delete(key)
    }
  }
}

