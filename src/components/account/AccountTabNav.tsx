import React from "react";
import { UserCircle, Gear } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface AccountTabNavProps {
  currentTab: "profile" | "settings";
}

export function AccountTabNav({ currentTab }: AccountTabNavProps) {
  const tabs = [
    { id: "profile", label: "Profil", href: "/account", icon: UserCircle },
    { id: "settings", label: "Pengaturan", href: "/account/settings", icon: Gear },
  ];

  return (
    <div className="bg-muted/50 p-1 border rounded-lg flex gap-1 w-fit">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;

        return (
          <a
            key={tab.id}
            href={tab.href}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-md transition-all",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/40"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </a>
        );
      })}
    </div>
  );
}
