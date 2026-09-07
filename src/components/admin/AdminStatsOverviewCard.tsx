import React, { useState, useEffect } from "react";
import { Users, BookOpen, Eye, ShieldWarning, ArrowsClockwise } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { API_BASE_URL } from "@/constants";

interface SystemStats {
  totalUsers: number;
  totalAdmins: number;
  totalComics: number;
  totalChapters: number;
  totalViews: number;
  totalComments: number;
}

export function AdminStatsOverviewCard() {
  const [statsData, setStatsData] = useState<SystemStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/v1/admin/stats`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Gagal mengambil statistik");
        const json = (await res.json()) as any;
        const data = json.data || json;
        setStatsData(data);
      } catch (e) {
        console.error("Failed to fetch admin stats:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    {
      title: "Total Pengguna",
      value: isLoading ? "..." : (statsData?.totalUsers ?? 0).toLocaleString("id-ID"),
      change: "Akun terdaftar di platform",
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Katalog Komik",
      value: isLoading ? "..." : (statsData?.totalComics ?? 0).toLocaleString("id-ID"),
      change: `${statsData?.totalChapters ?? 0} chapter dipublikasikan`,
      icon: BookOpen,
      color: "text-emerald-500",
    },
    {
      title: "Total Pembacaan (Views)",
      value: isLoading ? "..." : (statsData?.totalViews ?? 0).toLocaleString("id-ID"),
      change: "Tercatat di sistem log",
      icon: Eye,
      color: "text-purple-500",
    },
    {
      title: "Administrator Active",
      value: isLoading ? "..." : (statsData?.totalAdmins ?? 0).toLocaleString("id-ID"),
      change: "Role admin terverifikasi",
      icon: ShieldWarning,
      color: "text-amber-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <Card key={i} className="border-border/60 shadow-xs hover:border-primary/40 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-semibold text-muted-foreground">{stat.title}</CardTitle>
              {isLoading ? (
                <ArrowsClockwise className="h-4 w-4 text-muted-foreground animate-spin" />
              ) : (
                <Icon className={`h-4 w-4 ${stat.color}`} />
              )}
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
