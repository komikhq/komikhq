import React from "react";
import { Users, BookOpen, Eye, ShieldWarning } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function AdminStatsOverviewCard() {
  const stats = [
    { title: "Total Pengguna", value: "1,248", change: "+12% minggu ini", icon: Users, color: "text-blue-500" },
    { title: "Katalog Komik", value: "482", change: "18 komik baru", icon: BookOpen, color: "text-emerald-500" },
    { title: "Total Pembacaan (Views)", value: "85.4K", change: "+24.5% dari bulan lalu", icon: Eye, color: "text-purple-500" },
    { title: "Administrator Active", value: "3", change: "Role admin terverifikasi", icon: ShieldWarning, color: "text-amber-500" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <Card key={i} className="border-border/60 shadow-xs hover:border-primary/40 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-semibold text-muted-foreground">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
              <CardDescription className="text-[11px] text-muted-foreground pt-1">
                {stat.change}
              </CardDescription>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
