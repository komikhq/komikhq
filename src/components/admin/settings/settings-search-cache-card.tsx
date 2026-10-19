import React, { useState, useEffect } from "react"
import {
  Broom,
  CircleNotch,
  MagnifyingGlass,
  CheckCircle,
} from "@phosphor-icons/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { API_ROUTES } from "@/constants/api-routes"
import { apiFetch } from "@/lib/api-client"

interface ClearCacheResult {
  "cleared-keys": number
  timestamp: string
}

export function SettingsSearchCacheCard() {
  const [clearingCache, setClearingCache] = useState(false)
  const [lastCacheResult, setLastCacheResult] =
    useState<ClearCacheResult | null>(null)
  const [cachedKeysCount, setCachedKeysCount] = useState<number | null>(null)

  useEffect(() => {
    const fetchCacheCount = async () => {
      try {
        const res = await apiFetch<{
          success: boolean
          data: { "cached-search-keys-count": number }
        }>(API_ROUTES.ADMIN.SYSTEM.MAINTENANCE_STATUS)
        if (res?.data) {
          setCachedKeysCount(res.data["cached-search-keys-count"])
        }
      } catch {
        // silently ignore
      }
    }
    fetchCacheCount()
  }, [])

  const handleClearSearchCache = async () => {
    setClearingCache(true)
    const toastId = toast.loading(
      "Invalidating search autocomplete cache in KV..."
    )

    try {
      const data = await apiFetch<{
        success: boolean
        message?: string
        "cleared-keys"?: number
      }>(API_ROUTES.ADMIN.SYSTEM.CLEAR_SEARCH_CACHE, {
        method: "POST",
      })

      const clearedKeys = data["cleared-keys"] ?? 0
      const now = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })

      setLastCacheResult({
        "cleared-keys": clearedKeys,
        timestamp: now,
      })

      setCachedKeysCount(0)

      toast.success(
        data.message ||
          `Search suggestion cache invalidated successfully (${clearedKeys} entries removed).`,
        { id: toastId }
      )
    } catch (err: any) {
      toast.error(err.message || "Failed to invalidate search cache.", {
        id: toastId,
      })
    } finally {
      setClearingCache(false)
    }
  }

  return (
    <Card className="border-border/60 shadow-xs">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl space-y-1.5">
            <div className="flex items-center gap-2">
              <MagnifyingGlass className="h-5 w-5 shrink-0 text-purple-500" />
              <h3 className="text-base font-bold text-foreground">
                Invalidate Search Autocomplete Cache
              </h3>
              {cachedKeysCount !== null && cachedKeysCount > 0 && (
                <Badge
                  variant="outline"
                  className="border-purple-500/30 bg-purple-500/10 text-[10px] text-purple-500"
                >
                  {cachedKeysCount} cached queries
                </Badge>
              )}
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Clears all cached comic suggestions stored in Cloudflare KV (
              <code className="font-mono text-[11px] text-primary">
                comic-search:suggestions:*
              </code>
              ). Useful after updating comic titles, alternative names, or
              genres so search autocomplete reflects fresh records immediately.
            </p>

            {lastCacheResult && !clearingCache && (
              <div className="pt-2">
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-purple-500/40 bg-purple-500/10 p-2.5 text-xs">
                  <div className="flex items-center gap-2 font-semibold text-purple-600 dark:text-purple-400">
                    <CheckCircle className="h-4 w-4 shrink-0 text-purple-500" />
                    <span>
                      Cache Invalidation Completed:{" "}
                      {lastCacheResult["cleared-keys"]} query entries cleared
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    At {lastCacheResult.timestamp}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="w-full shrink-0 md:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="h-10 w-full shrink-0 cursor-pointer gap-2 border-purple-500/30 px-4 text-xs whitespace-nowrap text-purple-600 hover:bg-purple-500/10 hover:text-purple-600 md:w-auto dark:text-purple-400"
              disabled={clearingCache}
              onClick={handleClearSearchCache}
            >
              {clearingCache ? (
                <>
                  <CircleNotch className="h-4 w-4 animate-spin text-purple-500" />
                  <span>Clearing Cache...</span>
                </>
              ) : (
                <>
                  <Broom className="h-4 w-4 text-purple-500" />
                  <span>Invalidate Search Cache</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
