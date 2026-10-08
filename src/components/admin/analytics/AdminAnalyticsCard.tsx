import React from "react"
import { TrendUp, Lightning } from "@phosphor-icons/react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

export function AdminAnalyticsCard() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card className="border-border/60 shadow-xs">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <TrendUp className="h-5 w-5 text-emerald-500" />
            <span>Weekly Reading Traffic</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Views statistics visualization of comic chapters over the last 7
            days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-44 items-center justify-center rounded-xl border border-border/40 bg-muted/40 text-xs font-medium text-muted-foreground">
            [ Cloudflare Realtime Views Analytics Chart ]
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-xs">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <Lightning className="h-5 w-5 text-amber-500" />
            <span>Edge Worker Performance & Cache Hit Rate</span>
          </CardTitle>
          <CardDescription className="text-xs">
            API response time measurement and R2/KV cache hit rates.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="flex items-center justify-between rounded-lg bg-muted/30 p-2.5">
            <span>Average API Latency</span>
            <span className="font-bold text-emerald-500">18ms</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-muted/30 p-2.5">
            <span>KV Cache Hit Ratio</span>
            <span className="font-bold text-sky-500">98.4%</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-muted/30 p-2.5">
            <span>R2 Image Bandwidth (30 days)</span>
            <span className="font-bold text-purple-500">142.8 GB</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
