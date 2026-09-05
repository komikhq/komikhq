import React, { useState, useEffect } from "react";
import {
  MagnifyingGlass,
  House,
  Compass,
  ListBullets,
  SignIn,
  UserCircle,
  Gear,
  SignOut,
  type Icon,
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HEADER_NAV_ITEMS, SITE_NAME, type NavItem } from "@/constants";
import { useAuth } from "@/hooks/use-auth";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Logo } from "@/components/common/Logo";

const HEADER_NAV_ICONS: Record<string, Icon> = {
  House,
  Compass,
  ListBullets,
};

export function SiteHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated, handleSignOut } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

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
              <TooltipTrigger asChild>
                <a
                  href="/"
                  aria-label={SITE_NAME}
                  className="flex items-center gap-2 font-bold tracking-tight text-primary"
                >
                  <Logo size="header" />
                </a>
              </TooltipTrigger>
              <TooltipContent side="bottom">Go to Homepage</TooltipContent>
            </Tooltip>

            <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
              {HEADER_NAV_ITEMS.map((item: NavItem) => {
                const IconComponent = HEADER_NAV_ICONS[item.iconName];
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
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

          <div className="flex items-center gap-2 sm:gap-3">
            <form onSubmit={handleSearchSubmit} className="w-36 sm:w-64">
              <div className="relative">
                <MagnifyingGlass className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Cari komik..."
                  className="w-full pl-9 h-9 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            <ThemeToggle />

            {mounted && isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden md:flex items-center gap-2 px-2 h-9 rounded-full hover:bg-accent cursor-pointer">
                    <Avatar className="h-7 w-7 border border-primary/40">
                      <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                      <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                        {user.name ? user.name.slice(0, 2).toUpperCase() : "HQ"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-semibold line-clamp-1 max-w-[110px]">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => (window.location.href = "/account")}>
                    <UserCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Profil Saya</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => (window.location.href = "/account/settings")}>
                    <Gear className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Pengaturan Akun</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                    <SignOut className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="hidden md:inline-flex" onClick={() => (window.location.href = "/login")}>
                    <SignIn className="h-4 w-4 mr-1.5" />
                    <span>Masuk</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Masuk ke akun KomikHQ</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}
