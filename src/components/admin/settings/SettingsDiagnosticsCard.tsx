import React, { useState, useEffect } from "react"
import {
  Gear,
  ArrowsClockwise,
  MagnifyingGlass,
  CheckCircle,
  WarningCircle,
} from "@phosphor-icons/react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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

export function SettingsDiagnosticsCard() {
  const [loadingStatus, setLoadingStatus] = useState(false)
  const [status, setStatus] = useState<MaintenanceStatus | null>(null)

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

  return (
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
                <span className="font-mono text-[10px] text-muted-foreground">
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
  )
}
