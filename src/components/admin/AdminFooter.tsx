import React from "react"
import { Layout, ShieldCheck, HardDrives, Cloud } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"

export function AdminFooter() {
  return (
    <footer className="mt-4 flex flex-col justify-between gap-4 rounded-2xl border border-border/60 bg-muted/40 p-6 shadow-xs backdrop-blur md:flex-row md:items-center">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="gap-1 border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>Administrator Workspace</span>
          </Badge>
          <Badge variant="secondary" className="gap-1 text-xs">
            <Cloud className="h-3.5 w-3.5 text-sky-500" />
            <span>Cloudflare Workers</span>
          </Badge>
        </div>
        <div className="flex items-center gap-2.5 pt-1 text-xl font-bold tracking-tight">
          <Layout className="h-5 w-5 text-primary" />
          <span>Control Panel & Dashboard</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Manage users, comic catalog, platform analytics, and KomikHQ
          infrastructure.
        </p>
      </div>

      <div className="flex items-center gap-3 self-start rounded-xl border border-border/50 bg-background/80 p-2.5 text-xs md:self-auto">
        <HardDrives className="h-4 w-4 animate-pulse text-emerald-500" />
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">
            API Status: Online
          </span>
          <span className="text-[10px] text-muted-foreground">
            Cloudflare Edge Worker v1.0
          </span>
        </div>
      </div>
    </footer>
  )
}
