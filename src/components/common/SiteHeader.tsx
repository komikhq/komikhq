import React, { useState, useEffect } from "react"
import {
  House,
  Compass,
  ListBullets,
  SignIn,
  UserCircle,
  Gear,
  SignOut,
  ShieldCheck,
  BookmarkSimple,
  ClockCounterClockwise,
  type Icon,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HEADER_NAV_ITEMS, SITE_NAME, type NavItem } from "@/constants"
import { useAuth } from "@/hooks/use-auth"
import { ThemeToggle } from "@/components/common/ThemeToggle"
import { Logo } from "@/components/common/Logo"
import { GlobalComicSearch } from "@/components/common/GlobalComicSearch"

const HEADER_NAV_ICONS: Record<string, Icon> = {
  House,
  Compass,
  ListBullets,
  BookmarkSimple,
  ClockCounterClockwise,
}

export function SiteHeader() {
  const [mounted, setMounted] = useState(false)
  const { user, isAuthenticated, handleSignOut } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between gap-4 px-4">
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

            <nav className="hidden items-center gap-4 text-sm font-medium md:flex">
              {HEADER_NAV_ITEMS.map((item: NavItem) => {
                const IconComponent = HEADER_NAV_ICONS[item.iconName]
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
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <GlobalComicSearch />

            <ThemeToggle />

            {mounted && isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hidden h-9 cursor-pointer items-center gap-2 rounded-full px-2 hover:bg-accent md:flex"
                  >
                    <Avatar className="h-7 w-7 border border-primary/40">
                      <AvatarImage
                        src={user.image || undefined}
                        alt={user.name || "User"}
                      />
                      <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                        {user.name ? user.name.slice(0, 2).toUpperCase() : "HQ"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="line-clamp-1 max-w-[110px] text-sm font-semibold">
                      {user.name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm leading-none font-semibold">
                        {user.name}
                      </p>
                      <p className="truncate text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.role === "admin" && (
                    <DropdownMenuItem
                      className="cursor-pointer font-semibold text-primary focus:bg-primary/10"
                      onClick={() => (window.location.href = "/dashboard")}
                    >
                      <ShieldCheck className="mr-2 h-4 w-4 text-primary" />
                      <span>Dashboard Admin</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => (window.location.href = "/account")}
                  >
                    <UserCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Profil Saya</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => (window.location.href = "/bookmark")}
                  >
                    <BookmarkSimple className="mr-2 h-4 w-4 text-primary" />
                    <span>Bookmark Saya</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => (window.location.href = "/history")}
                  >
                    <ClockCounterClockwise className="mr-2 h-4 w-4 text-primary" />
                    <span>Riwayat Baca</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => (window.location.href = "/account/settings")}
                  >
                    <Gear className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Pengaturan Akun</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                  >
                    <SignOut className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="hidden md:inline-flex"
                    onClick={() => (window.location.href = "/login")}
                  >
                    <SignIn className="mr-1.5 h-4 w-4" />
                    <span>Masuk</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Masuk ke akun KomikHQ
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </header>
    </TooltipProvider>
  )
}
