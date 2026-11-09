/**
 * Coalescing Fetch — In-Flight Request Deduplication & In-Memory TTL Cache.
 *
 * For GET requests:
 *   1. If a valid cached response exists in memory → return its clone.
 *   2. If a request to the same URL is already in-flight → await the same
 *      Promise, so only 1 HTTP connection is opened even when N callers
 *      invoke it simultaneously.
 *   3. If neither → execute a new fetch, cache the response, and return it.
 *
 * For non-GET requests (POST, PUT, DELETE, etc.): bypass directly to fetch().
 */

const inFlightRequests = new Map<string, Promise<Response>>()
const memoryCache = new Map<
  string,
  { response: Response; expiresAt: number }
>()

/** Resolve the TTL (ms) based on the endpoint path. */
function resolveTtl(url: string): number {
  if (url.includes("/genres")) return 3_600_000 // 1 hour — genre data rarely changes
  if (url.includes("/trending")) return 30_000 // 30 seconds
  return 15_000 // 15 seconds — default for detail, browse, etc.
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

  // 1. Check memory cache
  const cached = memoryCache.get(urlKey)
  if (cached && cached.expiresAt > Date.now()) {
    return cached.response.clone()
  }

  // 2. Coalesce with an already in-flight request
  const pending = inFlightRequests.get(urlKey)
  if (pending) {
    const res = await pending
    return res.clone()
  }

  // 3. Execute a new request
  const executionPromise = (async () => {
    try {
      const response = await fetch(input, init)
      if (response.ok) {
        const ttl = resolveTtl(urlKey)
        memoryCache.set(urlKey, {
          response: response.clone(),
          expiresAt: Date.now() + ttl,
        })
      }
      return response
    } finally {
      inFlightRequests.delete(urlKey)
    }
  })()

  inFlightRequests.set(urlKey, executionPromise)
  const result = await executionPromise
  return result.clone()
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
