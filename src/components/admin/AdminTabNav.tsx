import React from "react";
import { Users, BookOpen, ChartBar, Gear, ShieldCheck } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export interface AdminTabNavProps {
  currentTab: "overview" | "users" | "comics" | "analytics" | "settings";
}

export function AdminTabNav({ currentTab }: AdminTabNavProps) {
  const tabs = [
    { id: "overview", label: "Ikhtisar", href: "/dashboard", icon: ShieldCheck },
    { id: "users", label: "Pengguna", href: "/dashboard/users", icon: Users },
    { id: "comics", label: "Komik", href: "/dashboard/comics", icon: BookOpen },
    { id: "analytics", label: "Analitik", href: "/dashboard/analytics", icon: ChartBar },
    { id: "settings", label: "Pengaturan Platform", href: "/dashboard/settings", icon: Gear },
  ];

  return (
    <div className="w-full border-b border-border/60 pb-2">
      <nav className="flex items-center gap-1.5 overflow-x-auto p-1 bg-muted/50 rounded-xl border border-border/40 max-w-max" aria-label="Admin Navigation Tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <a
              key={tab.id}
              href={tab.href}
              className={cn(
                "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap",
                isActive
                  ? "bg-background text-foreground shadow-xs border border-border/60"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
              <span>{tab.label}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}
