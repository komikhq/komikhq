import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { BASE_PATH } from "@/lib/sdk-client"

export interface ApiTokenRecord {
  id: string
  name: string
  tokenPrefix: string
  scopes: string[]
  createdAt: string
  lastUsedAt?: string | null
  expiresAt?: string | null
}

export function useAdminApiTokens() {
  const [tokens, setTokens] = useState<ApiTokenRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const fetchTokens = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BASE_PATH}/admin/api-tokens`, {
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to load API tokens list")
      const data = await res.json()
      const list = data?.tokens || data?.data || []
      setTokens(list)
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
      const res = await fetch(`${BASE_PATH}/admin/api-tokens`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.message || "Failed to generate token")
      }

      const resData = await res.json()
      const rawToken = resData.rawToken

      toast.success(`API Token "${data.name.trim()}" created successfully.`)
      fetchTokens()
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
      const res = await fetch(`${BASE_PATH}/admin/api-tokens/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!res.ok) throw new Error("Failed to revoke token")

      toast.success("Token revoked successfully.")
      fetchTokens()
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
