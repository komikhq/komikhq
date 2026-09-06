import React from "react";
import { Layout, ShieldCheck, HardDrives, Cloud } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";

export function AdminHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/40 p-6 rounded-2xl border border-border/60 shadow-xs backdrop-blur">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 gap-1 px-2.5 py-0.5 font-medium text-xs">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>Administrator Workspace</span>
          </Badge>
          <Badge variant="secondary" className="gap-1 text-xs">
            <Cloud className="h-3.5 w-3.5 text-sky-500" />
            <span>Cloudflare Workers</span>
          </Badge>
        </div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2.5 pt-1">
          <Layout className="h-6 w-6 text-primary" />
          <span>Control Panel & Dashboard</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Kelola data pengguna, sistem komik, analitik platform, dan infrastruktur KomikHQ.
        </p>
      </div>

      <div className="flex items-center gap-3 self-start md:self-auto bg-background/80 p-2.5 rounded-xl border border-border/50 text-xs">
        <HardDrives className="h-4 w-4 text-emerald-500 animate-pulse" />
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">API Status: Online</span>
          <span className="text-muted-foreground text-[10px]">Cloudflare Edge Worker v1.0</span>
        </div>
      </div>
    </div>
  );
}
