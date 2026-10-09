export function getBaseApiUrl(): string {
  const configuredUrl =
    typeof window === "undefined"
      ? import.meta.env.PUBLIC_API_URL
      : ((window as any).__PUBLIC_API_URL__ ?? import.meta.env.PUBLIC_API_URL)

  if (typeof configuredUrl !== "string" || configuredUrl.trim() === "") {
    const environment = typeof window === "undefined" ? "runtime" : "build"
    throw new Error(
      `PUBLIC_API_URL is required in the ${environment} environment`
    )
  }

  let parsedUrl: URL
  try {
    parsedUrl = new URL(configuredUrl)
  } catch {
    throw new Error("PUBLIC_API_URL must be an absolute HTTP(S) URL")
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw new Error("PUBLIC_API_URL must be an absolute HTTP(S) URL")
  }

  return configuredUrl.replace(/\/+$/, "")
}

export async function apiFetch<T = any>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  const fullUrl = `${getBaseApiUrl()}${cleanPath}`
  const response = await fetch(fullUrl, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as any
    throw new Error(errorData?.error || `API Fetch Failed (${response.status})`)
  }

  return response.json() as Promise<T>
}

export function proxyApiResponse(path: string): Promise<Response> {
  const upstreamUrl = new URL(path, getBaseApiUrl())
  return fetch(upstreamUrl, {
    headers: { Accept: "application/xml" },
  })
}
