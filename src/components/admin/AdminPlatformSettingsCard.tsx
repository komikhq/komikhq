import React, { useState, useEffect } from "react"
import {
  Gear,
  HardDrives,
  Broom,
  CircleNotch,
  ArrowsClockwise,
  Database,
  MagnifyingGlass,
  CheckCircle,
  WarningCircle,
  ChartLineUp,
} from "@phosphor-icons/react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { API_ROUTES } from "@/constants/api-routes"
import { apiFetch } from "@/lib/api-client"

interface MaintenanceStatus {
  "cached-search-keys-count": number
  "kv-healthy": boolean
  "kv-views-healthy"?: boolean
  "ae-healthy"?: boolean
  "last-synced-at"?: string | null
  "cached-rankings-count"?: number
  "r2-healthy": boolean
  timestamp: string
}

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

interface ClearCacheResult {
  "cleared-keys": number
  timestamp: string
}

interface PurgeOrphansResult {
  "purged-count": number
  "total-size-mb": string
  timestamp: string
}

export function AdminPlatformSettingsCard() {
  const [loadingStatus, setLoadingStatus] = useState(false)
  const [status, setStatus] = useState<MaintenanceStatus | null>(null)

  const [syncingViews, setSyncingViews] = useState(false)
  const [lastSyncResult, setLastSyncResult] = useState<SyncViewsResult | null>(
    null
  )

  const [clearingCache, setClearingCache] = useState(false)
  const [lastCacheResult, setLastCacheResult] =
    useState<ClearCacheResult | null>(null)

  const [purgingOrphans, setPurgingOrphans] = useState(false)
  const [lastPurgeResult, setLastPurgeResult] =
    useState<PurgeOrphansResult | null>(null)

  const fetchStatus = async () => {
    try {
      setLoadingStatus(true)
      const res = await apiFetch<{ success: boolean; data: MaintenanceStatus }>(
        API_ROUTES.ADMIN.SYSTEM.MAINTENANCE_STATUS
      )
      if (res?.data) {
        setStatus(res.data)
      }
    } catch (err: any) {
      console.warn("Failed to fetch maintenance status:", err)
    } finally {
      setLoadingStatus(false)
    }
  }

  useEffect(() => {
    fetchStatus()
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
      const totalViewsAdded = data["total-views-added"] ?? data["synced-logs"] ?? 0
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

      toast.success(
        data.message ||
          `Successfully synchronized ${syncedChapters} chapters across ${syncedComics} comics (+${totalViewsAdded} views). Rankings refreshed.`,
        { id: toastId }
      )
      fetchStatus()
    } catch (err: any) {
      toast.error(err.message || "Failed to synchronize views delta.", {
        id: toastId,
      })
    } finally {
      setSyncingViews(false)
    }
  }

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

      toast.success(
        data.message ||
          `Search suggestion cache invalidated successfully (${clearedKeys} entries removed).`,
        { id: toastId }
      )
      fetchStatus()
    } catch (err: any) {
      toast.error(err.message || "Failed to invalidate search cache.", {
        id: toastId,
      })
    } finally {
      setClearingCache(false)
    }
  }

  const handlePurgeOrphans = async () => {
    setPurgingOrphans(true)
    const toastId = toast.loading(
      "Scanning Cloudflare R2 bucket & comparing with database..."
    )

    try {
      const data = await apiFetch<{
        success: boolean
        message?: string
        "purged-count"?: number
        "total-size-mb"?: string
        purgedCount?: number
        totalSizeMB?: string
      }>(API_ROUTES.ADMIN.SYSTEM.PURGE_ORPHANS, {
        method: "POST",
      })

      const purgedCount = data["purged-count"] ?? data.purgedCount ?? 0
      const totalSizeMB = data["total-size-mb"] ?? data.totalSizeMB ?? "0.00"
      const now = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })

      setLastPurgeResult({
        "purged-count": purgedCount,
        "total-size-mb": totalSizeMB,
        timestamp: now,
      })

      toast.success(
        data.message ||
          `Successfully purged ${purgedCount} orphan files (${totalSizeMB} MB freed).`,
        { id: toastId }
      )
    } catch (err: any) {
      toast.error(
        err.message ||
          "A network error occurred while processing storage purge.",
        { id: toastId }
      )
    } finally {
      setPurgingOrphans(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header and Live Diagnostics */}
      <Card className="border-border/60 shadow-xs">
        <CardHeader className="flex flex-col gap-4 border-b border-border/40 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Gear className="h-5 w-5 text-primary" />
              <span>Platform Maintenance & System Services</span>
            </CardTitle>
            <CardDescription className="mt-1 text-xs text-muted-foreground">
              Real-time operational maintenance for Cloudflare KV buffer queues,
              search cache, and R2 media storage.
            </CardDescription>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchStatus}
            disabled={loadingStatus}
            className="h-8 shrink-0 cursor-pointer gap-1.5 self-start text-xs sm:self-auto"
          >
            <ArrowsClockwise
              className={`h-3.5 w-3.5 ${loadingStatus ? "animate-spin text-primary" : ""}`}
            />
            <span>Refresh Diagnostics</span>
          </Button>
        </CardHeader>

        <CardContent className="pt-4 pb-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="space-y-1 rounded-lg border border-border/50 bg-muted/20 p-3">
              <span className="block text-[11px] font-medium text-muted-foreground">
                Cloudflare KV (App)
              </span>
              <div className="flex items-center gap-1.5">
                {status?.["kv-healthy"] ? (
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                ) : (
                  <WarningCircle className="h-4 w-4 text-amber-500" />
                )}
                <span className="text-xs font-semibold">
                  {status?.["kv-healthy"] ? "Operational" : "Degraded"}
                </span>
              </div>
            </div>

            <div className="space-y-1 rounded-lg border border-border/50 bg-muted/20 p-3">
              <span className="block text-[11px] font-medium text-muted-foreground">
                KV Views & Rankings
              </span>
              <div className="flex items-center gap-1.5">
                {status?.["kv-views-healthy"] ? (
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                ) : (
                  <WarningCircle className="h-4 w-4 text-amber-500" />
                )}
                <span className="text-xs font-semibold">
                  {status?.["kv-views-healthy"] ? "Operational" : "Degraded"}
                </span>
                {status?.["cached-rankings-count"] ? (
                  <span className="text-[10px] text-muted-foreground font-mono">
                    ({status["cached-rankings-count"]} cached)
                  </span>
                ) : null}
              </div>
            </div>

            <div className="space-y-1 rounded-lg border border-border/50 bg-muted/20 p-3">
              <span className="block text-[11px] font-medium text-muted-foreground">
                R2 Media Storage
              </span>
              <div className="flex items-center gap-1.5">
                {status?.["r2-healthy"] ? (
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                ) : (
                  <WarningCircle className="h-4 w-4 text-rose-500" />
                )}
                <span className="text-xs font-semibold">
                  {status?.["r2-healthy"] ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>

            <div className="space-y-1 rounded-lg border border-border/50 bg-muted/20 p-3">
              <span className="block text-[11px] font-medium text-muted-foreground">
                Cached Search Keys
              </span>
              <div className="flex items-center gap-1.5">
                <MagnifyingGlass className="h-4 w-4 text-purple-500" />
                <span className="font-mono text-xs font-semibold">
                  {status
                    ? `${status["cached-search-keys-count"]} cached`
                    : "..."}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action 1: Force Sync Views Delta & Refresh Rankings */}
      <Card className="border-border/60 shadow-xs">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl space-y-1.5">
              <div className="flex items-center gap-2">
                <ChartLineUp className="h-5 w-5 shrink-0 text-sky-500" />
                <h3 className="text-base font-bold text-foreground">
                  Force Sync Views Delta & Refresh Rankings
                </h3>
                {status?.["last-synced-at"] ? (
                  <Badge
                    variant="outline"
                    className="border-sky-500/30 bg-sky-500/10 text-[10px] text-sky-500 font-mono"
                  >
                    Last Sync: {new Date(status["last-synced-at"]).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
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
                Immediately queries view delta events from Cloudflare Analytics Engine,
                accumulates <code className="font-mono text-[11px] text-primary">totalViews</code> counters
                on PostgreSQL chapters &amp; comics, and refreshes Daily, Weekly &amp; Popular rankings
                in KV without waiting for the scheduled 6-hour cron job.
              </p>

              {lastSyncResult && !syncingViews && (
                <div className="pt-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-sky-500/40 bg-sky-500/10 p-2.5 text-xs">
                    <div className="flex items-center gap-2 font-semibold text-sky-600 dark:text-sky-400">
                      <CheckCircle className="h-4 w-4 shrink-0 text-sky-500" />
                      <span>
                        Sync Completed: {lastSyncResult["synced-chapters"] ?? 0} chapters, {lastSyncResult["synced-comics"] ?? lastSyncResult["affected-comics"] ?? 0} comics updated (+{lastSyncResult["total-views-added"] ?? lastSyncResult["synced-logs"] ?? 0} views). Rankings refreshed.
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

      {/* Action 2: Invalidate Search Autocomplete Cache */}
      <Card className="border-border/60 shadow-xs">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl space-y-1.5">
              <div className="flex items-center gap-2">
                <MagnifyingGlass className="h-5 w-5 shrink-0 text-purple-500" />
                <h3 className="text-base font-bold text-foreground">
                  Invalidate Search Autocomplete Cache
                </h3>
                {status && status["cached-search-keys-count"] > 0 && (
                  <Badge
                    variant="outline"
                    className="border-purple-500/30 bg-purple-500/10 text-[10px] text-purple-500"
                  >
                    {status["cached-search-keys-count"]} cached queries
                  </Badge>
                )}
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Clears all cached comic suggestions stored in Cloudflare KV (
                <code className="font-mono text-[11px] text-primary">
                  comic-search:suggestions:*
                </code>
                ). Useful after updating comic titles, alternative names, or
                genres so search autocomplete reflects fresh records
                immediately.
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

      {/* Action 3: Manual R2 Storage Purge (Purge Orphan Images) */}
      <Card className="border-border/60 shadow-xs">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl space-y-1.5">
              <div className="flex items-center gap-2">
                <HardDrives className="h-5 w-5 shrink-0 text-amber-500" />
                <h3 className="text-base font-bold text-foreground">
                  Manual R2 Storage Purge (Purge Orphan Images)
                </h3>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Scan Cloudflare R2 bucket (
                <code className="font-mono text-[11px] text-primary">
                  komikhq-media
                </code>
                ) and compare with registered chapter pages in the database.
                Deletes isolated/orphan image files uploaded more than 1 hour
                ago that are no longer referenced in any chapter.
              </p>

              <div className="flex flex-col gap-2 pt-1">
                {purgingOrphans && (
                  <div className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs font-medium text-amber-600 dark:text-amber-400">
                    <CircleNotch className="h-4 w-4 shrink-0 animate-spin text-amber-500" />
                    <span>
                      Scanning R2 bucket & comparing with database records...
                    </span>
                  </div>
                )}

                {!purgingOrphans && lastPurgeResult && (
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-2.5 text-xs">
                    <div className="flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="inline-block h-2 w-2 shrink-0 animate-ping rounded-full bg-emerald-500" />
                      <span>
                        Purge Completed: {lastPurgeResult["purged-count"]}{" "}
                        orphan files deleted ({lastPurgeResult["total-size-mb"]}{" "}
                        MB freed)
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      At {lastPurgeResult.timestamp}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full shrink-0 md:w-auto">
              <Button
                variant="destructive"
                size="sm"
                className="h-10 w-full shrink-0 cursor-pointer gap-2 px-4 text-xs whitespace-nowrap md:w-auto"
                disabled={purgingOrphans}
                onClick={handlePurgeOrphans}
              >
                {purgingOrphans ? (
                  <>
                    <CircleNotch className="h-4 w-4 animate-spin" />
                    <span>Scanning & Purging...</span>
                  </>
                ) : (
                  <>
                    <Broom className="h-4 w-4" />
                    <span>Purge Orphan Images</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
