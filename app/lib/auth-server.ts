import { redirect } from "react-router"
import { BASE_PATH } from "@/lib/sdk-client"

export interface AuthSessionData {
  user: {
    id: string
    name: string
    email: string
    image?: string | null
    role?: string | null
    [key: string]: any
  }
  session: {
    id: string
    userId: string
    expiresAt: string | Date
    [key: string]: any
  }
}

/**
 * Extracts and validates the current session directly on the server (Worker SSR).
 * Forwards the browser's Cookie header to the Better Auth backend.
 */
export async function getSession(request: Request): Promise<AuthSessionData | null> {
  const cookieHeader = request.headers.get("Cookie")
  if (!cookieHeader || !cookieHeader.includes("session")) {
    return null
  }

  try {
    const res = await fetch(`${BASE_PATH}/v1/auth/get-session`, {
      headers: {
        cookie: cookieHeader,
        "Accept": "application/json",
      },
    })

    if (!res.ok) {
      return null
    }

    const data = (await res.json()) as any
    if (data && data.user && data.session) {
      return data as AuthSessionData
    }

    return null
  } catch (err) {
    console.error("[auth-server] Error fetching session:", err)
    return null
  }
}

/**
 * Guard for guest-only routes (e.g. /login, /register, /forgot-password, /reset-password).
 * If authenticated, performs an immediate HTTP 302 redirect on the server.
 */
export async function requireGuest(
  request: Request,
  redirectTo: string = "/account"
): Promise<void> {
  const session = await getSession(request)
  if (session && session.user) {
    throw redirect(redirectTo)
  }
}

/**
 * Guard for authenticated user routes (e.g. /account, /bookmark, /history).
 * If unauthenticated, performs an immediate HTTP 302 redirect on the server.
 */
export async function requireUser(
  request: Request,
  redirectTo?: string
): Promise<AuthSessionData> {
  const session = await getSession(request)
  if (!session || !session.user) {
    const currentUrl = new URL(request.url)
    const target =
      redirectTo ||
      `/login?redirectTo=${encodeURIComponent(currentUrl.pathname + currentUrl.search)}`
    throw redirect(target)
  }
  return session
}

/**
 * Guard for admin-only routes (e.g. /dashboard/*).
 * If unauthenticated or role is not admin, performs an immediate HTTP 302 redirect.
 */
export async function requireAdmin(request: Request): Promise<AuthSessionData> {
  const session = await requireUser(request)
  if (session.user.role !== "admin") {
    throw redirect("/")
  }
  return session
}

