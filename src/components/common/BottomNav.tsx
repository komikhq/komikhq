import React from "react";
import {
  House,
  BookmarkSimple,
  ClockCounterClockwise,
  UserCircle,
  type Icon,
} from "@phosphor-icons/react";
import { BOTTOM_NAV_ITEMS, type NavItem } from "@/constants";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const NAV_ICONS: Record<string, Icon> = {
  House,
  BookmarkSimple,
  ClockCounterClockwise,
  UserCircle,
};

export function BottomNav() {
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "";

  if (currentPath.includes("/komik/") && currentPath.split("/").length > 3) {
    return null;
  }

  return (
    <TooltipProvider>
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex h-16 items-center justify-around px-2">
          {BOTTOM_NAV_ITEMS.map((item: NavItem) => {
            const IconComponent = NAV_ICONS[item.iconName];
            const isActive = currentPath === item.href;
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <a
                    href={item.href}
                    className={`flex flex-col items-center justify-center gap-1 w-full h-full py-1 text-xs transition-colors ${
                      isActive
                        ? "text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {IconComponent && <IconComponent className="h-5 w-5" weight={isActive ? "fill" : "regular"} />}
                    <span>{item.label}</span>
                  </a>
                </TooltipTrigger>
                <TooltipContent side="top">{item.label}</TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </nav>
    </TooltipProvider>
  );
}
