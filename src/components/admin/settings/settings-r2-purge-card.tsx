import React, { useState } from "react"
import { HardDrives, Broom, CircleNotch } from "@phosphor-icons/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { API_ROUTES } from "@/constants/api-routes"
import { apiFetch } from "@/lib/api-client"

interface PurgeOrphansResult {
  "purged-count": number
  "total-size-mb": string
  timestamp: string
}

export function SettingsR2PurgeCard() {
  const [purgingOrphans, setPurgingOrphans] = useState(false)
  const [lastPurgeResult, setLastPurgeResult] =
    useState<PurgeOrphansResult | null>(null)

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
              Deletes isolated/orphan image files uploaded more than 1 hour ago
              that are no longer referenced in any chapter.
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
                      Purge Completed: {lastPurgeResult["purged-count"]} orphan
                      files deleted ({lastPurgeResult["total-size-mb"]} MB
                      freed)
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
  )
}
