import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

export interface ApiTokenRecord {
  id: string
  name: string
  tokenPrefix: string
  scopes: string[]
  createdAt: string
  lastUsedAt?: string | null
  expiresAt?: string | null
}

const STORAGE_KEY = "komikhq_admin_mock_api_tokens"

const INITIAL_MOCK_TOKENS: ApiTokenRecord[] = [
  {
    id: "tok_1a2b3c4d5e",
    name: "Production Scraper Daemon",
    tokenPrefix: "khq_live_9a2f1b",
    scopes: ["read:comics", "write:comics"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    lastUsedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 76).toISOString(),
  },
  {
    id: "tok_6f7e8d9c0b",
    name: "CI/CD Deployment Pipeline",
    tokenPrefix: "khq_live_c4d1e2",
    scopes: ["admin:full"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    lastUsedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    expiresAt: null,
  },
  {
    id: "tok_1122334455",
    name: "External Metrics & Analytics Ingestion",
    tokenPrefix: "khq_live_f890ab",
    scopes: ["read:comics", "manage:system"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    lastUsedAt: null,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 27).toISOString(),
  },
]

function getStoredTokens(): ApiTokenRecord[] {
  if (typeof window === "undefined") return INITIAL_MOCK_TOKENS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_TOKENS))
      return INITIAL_MOCK_TOKENS
    }
    return JSON.parse(raw)
  } catch {
    return INITIAL_MOCK_TOKENS
  }
}

function saveStoredTokens(tokens: ApiTokenRecord[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))
  } catch (err) {
    console.error("Failed to persist mock tokens:", err)
  }
}

export function useAdminApiTokens() {
  const [tokens, setTokens] = useState<ApiTokenRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const fetchTokens = useCallback(async () => {
    setLoading(true)
    try {
      // Simulated network latency
      await new Promise((r) => setTimeout(r, 200))
      const data = getStoredTokens()
      setTokens(data)
    } catch {
      toast.error("Failed to load API tokens list")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTokens()
  }, [fetchTokens])

  const createToken = async (data: {
    name: string
    scopes: string[]
    expiresInDays?: number | null
  }): Promise<{ success: boolean; rawToken?: string }> => {
    if (!data.name.trim()) {
      toast.error("Token name is required.")
      return { success: false }
    }

    if (data.scopes.length === 0) {
      toast.error("Please select at least one permission scope.")
      return { success: false }
    }

    setSubmitting(true)
    try {
      await new Promise((r) => setTimeout(r, 350))

      const randomPart = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)
      const secretPart = Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12)
      const tokenPrefix = `khq_live_${randomPart.substring(0, 6)}`
      const rawToken = `${tokenPrefix}_${secretPart}`

      const expiresAt =
        data.expiresInDays && data.expiresInDays > 0
          ? new Date(Date.now() + 1000 * 60 * 60 * 24 * data.expiresInDays).toISOString()
          : null

      const newToken: ApiTokenRecord = {
        id: `tok_${Math.random().toString(36).substring(2, 12)}`,
        name: data.name.trim(),
        tokenPrefix,
        scopes: data.scopes,
        createdAt: new Date().toISOString(),
        lastUsedAt: null,
        expiresAt,
      }

      const updated = [newToken, ...getStoredTokens()]
      saveStoredTokens(updated)
      setTokens(updated)

      toast.success(`API Token "${newToken.name}" created successfully.`)
      return { success: true, rawToken }
    } catch (err: any) {
      toast.error(err.message || "Failed to generate token")
      return { success: false }
    } finally {
      setSubmitting(false)
    }
  }

  const revokeToken = async (id: string): Promise<boolean> => {
    setSubmitting(true)
    try {
      await new Promise((r) => setTimeout(r, 250))
      const current = getStoredTokens()
      const target = current.find((t) => t.id === id)
      const updated = current.filter((t) => t.id !== id)
      saveStoredTokens(updated)
      setTokens(updated)

      toast.success(`Token "${target?.name || id}" revoked successfully.`)
      return true
    } catch (err: any) {
      toast.error(err.message || "Failed to revoke token")
      return false
    } finally {
      setSubmitting(false)
    }
  }

  return {
    tokens,
    loading,
    submitting,
    createToken,
    revokeToken,
    refetch: fetchTokens,
  }
}
