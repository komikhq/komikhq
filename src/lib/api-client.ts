export function getBaseApiUrl(): string {
  const configuredUrl =
    typeof window === "undefined"
      ? import.meta.env.PUBLIC_API_URL
      : (window as any).__PUBLIC_API_URL__ ?? import.meta.env.PUBLIC_API_URL

  if (typeof configuredUrl !== "string" || configuredUrl.trim() === "") {
    const environment = typeof window === "undefined" ? "runtime" : "build"
    throw new Error(`PUBLIC_API_URL is required in the ${environment} environment`)
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
  options?: RequestInit,
  astroLocals?: Record<string, any>
): Promise<T> {
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  const serviceBinding = astroLocals?.runtime?.env?.BACKEND

  if (astroLocals) {
    if (!serviceBinding || typeof serviceBinding.fetch !== "function") {
      throw new Error("BACKEND service binding is required for server-side API requests")
    }

    const request = new Request(`https://service-binding.invalid${cleanPath}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    const response = await serviceBinding.fetch(request)
    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as any
      throw new Error(
        errorData?.error ||
          `Service Binding Request Failed (${response.status})`
      )
    }
    return response.json() as Promise<T>
  }

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
