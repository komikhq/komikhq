export function getBaseApiUrl(): string {
  if (typeof window !== "undefined") {
    return (
      (window as any).__PUBLIC_API_URL__ ||
      import.meta.env.PUBLIC_API_URL ||
      "http://localhost:8787"
    );
  }
  return import.meta.env.PUBLIC_API_URL || "http://localhost:8787";
}

export async function apiFetch<T = any>(
  path: string,
  options?: RequestInit,
  astroLocals?: Record<string, any>
): Promise<T> {
  const baseUrl = getBaseApiUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const fullUrl = `${baseUrl}${cleanPath}`;

  // 1. Server-Side Astro (SSR/SSG) Service Binding Execution
  const serviceBinding = astroLocals?.runtime?.env?.BACKEND;
  if (serviceBinding && typeof serviceBinding.fetch === "function") {
    const request = new Request(fullUrl, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    const response = await serviceBinding.fetch(request);
    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as any;
      throw new Error(errorData?.error || `Service Binding Request Failed (${response.status})`);
    }
    return response.json() as Promise<T>;
  }

  // 2. Client-Side Browser Hydration (Fetch over HTTP)
  const response = await fetch(fullUrl, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as any;
    throw new Error(errorData?.error || `API Fetch Failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}
