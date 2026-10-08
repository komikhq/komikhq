import React, { useState, useEffect, useRef } from "react"
import {
  House,
  Compass,
  ListBullets,
  DotsThree,
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
  const [visibleNavCount, setVisibleNavCount] = useState(
    HEADER_NAV_ITEMS.length
  )
  const navRef = useRef<HTMLElement>(null)
  const navMeasurementRef = useRef<HTMLDivElement>(null)
  const { user, isAuthenticated, handleSignOut } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const navElement = navRef.current
    const measurementElement = navMeasurementRef.current
    if (!navElement || !measurementElement) return

    const updateVisibleNavItems = () => {
      const navItems = Array.from(
        measurementElement.querySelectorAll<HTMLElement>(
          "[data-nav-measure-item]"
        )
      )
      const moreButton = measurementElement.querySelector<HTMLElement>(
        "[data-nav-measure-more]"
      )
      if (navItems.length !== HEADER_NAV_ITEMS.length || !moreButton) return

      const itemWidths = navItems.map(
        (item) => item.getBoundingClientRect().width
      )
      const moreWidth = moreButton.getBoundingClientRect().width
      const gap =
        Number.parseFloat(window.getComputedStyle(navElement).columnGap) || 0
      const availableWidth = navElement.clientWidth
      let usedWidth = 0
      let visibleCount = 0

      for (let index = 0; index < itemWidths.length; index += 1) {
        const nextWidth =
          usedWidth + (visibleCount > 0 ? gap : 0) + itemWidths[index]
        const hasMoreItems = index < itemWidths.length - 1
        const requiredWidth = nextWidth + (hasMoreItems ? gap + moreWidth : 0)
        if (requiredWidth > availableWidth) break

        usedWidth = nextWidth
        visibleCount += 1
      }

      setVisibleNavCount(visibleCount)
    }

    updateVisibleNavItems()
    const resizeObserver = new ResizeObserver(updateVisibleNavItems)
    resizeObserver.observe(navElement)
    resizeObserver.observe(measurementElement)

    return () => resizeObserver.disconnect()
  }, [])

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between gap-4 px-4">
          <div className="flex min-w-0 flex-1 items-center gap-6">
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

            <nav
              ref={navRef}
              aria-label="Main navigation"
              className="relative hidden min-w-0 flex-1 items-center gap-4 overflow-hidden text-sm font-medium md:flex"
            >
              {HEADER_NAV_ITEMS.slice(0, visibleNavCount).map(
                (item: NavItem) => {
                  const IconComponent = HEADER_NAV_ICONS[item.iconName]
                  return (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>
                        <a
                          href={item.href}
                          className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {IconComponent && (
                            <IconComponent className="h-4 w-4" />
                          )}
                          <span>{item.label}</span>
                        </a>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  )
                }
              )}
              {visibleNavCount < HEADER_NAV_ITEMS.length && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 shrink-0 gap-1 px-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                      <DotsThree className="h-4 w-4" />
                      <span>More</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {HEADER_NAV_ITEMS.slice(visibleNavCount).map((item) => {
                      const IconComponent = HEADER_NAV_ICONS[item.iconName]
                      return (
                        <DropdownMenuItem key={item.href} asChild>
                          <a href={item.href}>
                            {IconComponent && <IconComponent />}
                            <span>{item.label}</span>
                          </a>
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <div
                ref={navMeasurementRef}
                aria-hidden="true"
                className="pointer-events-none invisible absolute flex w-max items-center gap-4"
              >
                {HEADER_NAV_ITEMS.map((item) => {
                  const IconComponent = HEADER_NAV_ICONS[item.iconName]
                  return (
                    <span
                      key={item.href}
                      data-nav-measure-item
                      className="flex shrink-0 items-center gap-1.5 whitespace-nowrap"
                    >
                      {IconComponent && <IconComponent className="h-4 w-4" />}
                      <span>{item.label}</span>
                    </span>
                  )
                })}
                <Button
                  data-nav-measure-more
                  variant="ghost"
                  className="h-8 shrink-0 gap-1 px-2 text-sm font-medium"
                  tabIndex={-1}
                >
                  <DotsThree className="h-4 w-4" />
                  <span>More</span>
                </Button>
              </div>
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
                      <span>Admin Dashboard</span>
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
