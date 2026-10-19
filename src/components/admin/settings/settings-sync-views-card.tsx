import React, { useState, useEffect } from "react"
import {
  ArrowsClockwise,
  CircleNotch,
  CheckCircle,
  ChartLineUp,
} from "@phosphor-icons/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { API_ROUTES } from "@/constants/api-routes"
import { apiFetch } from "@/lib/api-client"

interface SyncViewsResult {
  "synced-chapters"?: number
  "synced-comics"?: number
  "total-views-added"?: number
  "synced-logs"?: number
  "affected-comics"?: number
  rankings?: {
    dailyCount: number
    weeklyCount: number
    popularCount: number
  }
  timestamp: string
}

export function SettingsSyncViewsCard() {
  const [syncingViews, setSyncingViews] = useState(false)
  const [lastSyncResult, setLastSyncResult] = useState<SyncViewsResult | null>(
    null
  )
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null)

  useEffect(() => {
    const fetchLastSync = async () => {
      try {
        const res = await apiFetch<{
          success: boolean
          data: { "last-synced-at"?: string | null }
        }>(API_ROUTES.ADMIN.SYSTEM.MAINTENANCE_STATUS)
        if (res?.data?.["last-synced-at"]) {
          setLastSyncedAt(res.data["last-synced-at"])
        }
      } catch {
        // silently ignore
      }
    }
    fetchLastSync()
  }, [])

  const handleSyncViews = async () => {
    setSyncingViews(true)
    const toastId = toast.loading(
      "Syncing view deltas from Analytics Engine & refreshing rankings..."
    )

    try {
      const data = await apiFetch<{
        success: boolean
        message?: string
        "synced-chapters"?: number
        "synced-comics"?: number
        "total-views-added"?: number
        "synced-logs"?: number
        "affected-comics"?: number
        rankings?: {
          dailyCount: number
          weeklyCount: number
          popularCount: number
        }
      }>(API_ROUTES.ADMIN.SYSTEM.SYNC_VIEWS, {
        method: "POST",
      })

      const syncedChapters = data["synced-chapters"] ?? 0
      const syncedComics = data["synced-comics"] ?? data["affected-comics"] ?? 0
      const totalViewsAdded =
        data["total-views-added"] ?? data["synced-logs"] ?? 0
      const now = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })

      setLastSyncResult({
        "synced-chapters": syncedChapters,
        "synced-comics": syncedComics,
        "total-views-added": totalViewsAdded,
        "synced-logs": totalViewsAdded,
        "affected-comics": syncedComics,
        rankings: data.rankings,
        timestamp: now,
      })

      setLastSyncedAt(new Date().toISOString())

      toast.success(
        data.message ||
          `Successfully synchronized ${syncedChapters} chapters across ${syncedComics} comics (+${totalViewsAdded} views). Rankings refreshed.`,
        { id: toastId }
      )
    } catch (err: any) {
      toast.error(err.message || "Failed to synchronize views delta.", {
        id: toastId,
      })
    } finally {
      setSyncingViews(false)
    }
  }

  return (
    <Card className="border-border/60 shadow-xs">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl space-y-1.5">
            <div className="flex items-center gap-2">
              <ChartLineUp className="h-5 w-5 shrink-0 text-sky-500" />
              <h3 className="text-base font-bold text-foreground">
                Force Sync Views Delta & Refresh Rankings
              </h3>
              {lastSyncedAt ? (
                <Badge
                  variant="outline"
                  className="border-sky-500/30 bg-sky-500/10 font-mono text-[10px] text-sky-500"
                >
                  Last Sync:{" "}
                  {new Date(lastSyncedAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-500"
                >
                  AE Active
                </Badge>
              )}
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Immediately queries view delta events from Cloudflare Analytics
              Engine, accumulates{" "}
              <code className="font-mono text-[11px] text-primary">
                totalViews
              </code>{" "}
              counters on PostgreSQL chapters &amp; comics, and refreshes Daily,
              Weekly &amp; Popular rankings in KV without waiting for the
              scheduled 6-hour cron job.
            </p>

            {lastSyncResult && !syncingViews && (
              <div className="pt-2">
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-sky-500/40 bg-sky-500/10 p-2.5 text-xs">
                  <div className="flex items-center gap-2 font-semibold text-sky-600 dark:text-sky-400">
                    <CheckCircle className="h-4 w-4 shrink-0 text-sky-500" />
                    <span>
                      Sync Completed: {lastSyncResult["synced-chapters"] ?? 0}{" "}
                      chapters,{" "}
                      {lastSyncResult["synced-comics"] ??
                        lastSyncResult["affected-comics"] ??
                        0}{" "}
                      comics updated (+
                      {lastSyncResult["total-views-added"] ??
                        lastSyncResult["synced-logs"] ??
                        0}{" "}
                      views). Rankings refreshed.
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    At {lastSyncResult.timestamp}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="w-full shrink-0 md:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="h-10 w-full shrink-0 cursor-pointer gap-2 border-sky-500/30 px-4 text-xs whitespace-nowrap text-sky-600 hover:bg-sky-500/10 hover:text-sky-600 md:w-auto dark:text-sky-400"
              disabled={syncingViews}
              onClick={handleSyncViews}
            >
              {syncingViews ? (
                <>
                  <CircleNotch className="h-4 w-4 animate-spin text-sky-500" />
                  <span>Syncing &amp; Refreshing...</span>
                </>
              ) : (
                <>
                  <ArrowsClockwise className="h-4 w-4 text-sky-500" />
                  <span>Sync Views &amp; Refresh Rankings</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
