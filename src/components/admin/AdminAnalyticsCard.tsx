import React from "react";
import { ChartBar, Eye, TrendUp, Users, Lightning } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function AdminAnalyticsCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-border/60 shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <TrendUp className="h-5 w-5 text-emerald-500" />
            <span>Trafik Pembacaan Mingguan</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Visualisasi statistik tayangan (views) chapter komik 7 hari terakhir.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-44 bg-muted/40 rounded-xl border border-border/40 flex items-center justify-center text-muted-foreground text-xs font-medium">
            [ Grafik Analitik Views Realtime Cloudflare ]
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Lightning className="h-5 w-5 text-amber-500" />
            <span>Performa Edge Worker & Cache Hit Rate</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Pengukuran waktu respon API dan tingkat keberhasilan cache R2/KV.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="flex justify-between items-center p-2.5 bg-muted/30 rounded-lg">
            <span>Average API Latency</span>
            <span className="font-bold text-emerald-500">18ms</span>
          </div>
          <div className="flex justify-between items-center p-2.5 bg-muted/30 rounded-lg">
            <span>KV Cache Hit Ratio</span>
            <span className="font-bold text-sky-500">98.4%</span>
          </div>
          <div className="flex justify-between items-center p-2.5 bg-muted/30 rounded-lg">
            <span>R2 Image Bandwidth (30 days)</span>
            <span className="font-bold text-purple-500">142.8 GB</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
