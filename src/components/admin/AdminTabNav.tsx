import { useEffect, useRef } from "react";
import { Users, BookOpen, Tag, ChartBar, Gear, ShieldCheck, ChatDots } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export interface AdminTabNavProps {
  currentTab: "overview" | "users" | "comics" | "genres" | "moderation" | "analytics" | "settings";
}

export function AdminTabNav({ currentTab }: AdminTabNavProps) {
  const tabs = [
    { id: "overview", label: "Ikhtisar", href: "/dashboard", icon: ShieldCheck },
    { id: "users", label: "Pengguna", href: "/dashboard/users", icon: Users },
    { id: "comics", label: "Komik", href: "/dashboard/comics", icon: BookOpen },
    { id: "genres", label: "Genre", href: "/dashboard/genres", icon: Tag },
    { id: "moderation", label: "Moderasi", href: "/dashboard/moderation", icon: ChatDots },
    { id: "analytics", label: "Analitik", href: "/dashboard/analytics", icon: ChartBar },
    { id: "settings", label: "Pengaturan Platform", href: "/dashboard/settings", icon: Gear },
  ];

  const navRef = useRef<HTMLElement | null>(null);
  const activeTabRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const scrollToActive = () => {
      if (activeTabRef.current && navRef.current) {
        const nav = navRef.current;
        const activeEl = activeTabRef.current;
        const targetScrollLeft = activeEl.offsetLeft - (nav.clientWidth / 2) + (activeEl.clientWidth / 2);

        nav.scrollTo({
          left: Math.max(0, targetScrollLeft),
          behavior: "instant",
        });
      }
    };

    scrollToActive();
    const rafId = requestAnimationFrame(scrollToActive);
    return () => cancelAnimationFrame(rafId);
  }, [currentTab]);

  return (
    <div className="w-full border-b border-border/60 pb-2">
      <nav
        ref={navRef}
        className="w-full flex items-center gap-1.5 overflow-x-auto p-1 bg-muted/50 rounded-xl border border-border/40 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Admin Navigation Tabs"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <a
              key={tab.id}
              ref={isActive ? activeTabRef : null}
              href={tab.href}
              className={cn(
                "flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 lg:flex-1",
                isActive
                  ? "bg-background text-foreground shadow-xs border border-border/60"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
              <span>{tab.label}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}

