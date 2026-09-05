import React, { useState } from "react";
import {
  MagnifyingGlass,
  House,
  Compass,
  ListBullets,
  SignIn,
  type Icon,
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HEADER_NAV_ITEMS, SITE_NAME, type NavItem } from "@/constants";

const HEADER_NAV_ICONS: Record<string, Icon> = {
  House,
  Compass,
  ListBullets,
};

export function SiteHeader() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/browse?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between gap-4 px-4 mx-auto">
          <div className="flex items-center gap-6">
            <Tooltip>
              <TooltipTrigger>
                <a
                  href="/"
                  aria-label={SITE_NAME}
                  className="flex items-center gap-2 font-bold tracking-tight text-primary"
                >
                  <span className="flex shrink-0 items-center gap-2">
                    <img src="/logo-mark-dark.svg" alt="" width={28} height={28} className="block" />
                    <img src="/logo-wordmark-dark.svg" alt="" width={96} height={48} className="hidden md:block" />
                  </span>
                </a>
              </TooltipTrigger>
              <TooltipContent side="bottom">Go to Homepage</TooltipContent>
            </Tooltip>

            <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
              {HEADER_NAV_ITEMS.map((item: NavItem) => {
                const IconComponent = HEADER_NAV_ICONS[item.iconName];
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger>
                      <a
                        href={item.href}
                        className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {IconComponent && <IconComponent className="h-4 w-4" />}
                        <span>{item.label}</span>
                      </a>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">{item.label}</TooltipContent>
                  </Tooltip>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="w-48 sm:w-64">
              <div className="relative">
                <MagnifyingGlass className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search comics..."
                  className="w-full pl-9 h-9 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            <Tooltip>
              <TooltipTrigger>
                <Button className="hidden md:inline-flex" onClick={() => window.location.href = "/login"}>
                  <SignIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Sign in to your account</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}
