"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import {
  Cookie,
  ShieldCheck,
  ChartBar,
  Eye,
  SlidersHorizontal,
  Check,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  getStoredConsent,
  saveConsent,
  type CookieConsentPreferences,
} from "@/lib/cookie-consent"

export function CookieConsent() {
  const [mounted, setMounted] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)

  // Granular preference state for Modal
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true)
  const [experienceEnabled, setExperienceEnabled] = useState(true)

  const syncPreferences = React.useCallback(
    (preferences: CookieConsentPreferences) => {
      setAnalyticsEnabled(preferences.analytics)
      setExperienceEnabled(preferences.experience)
    },
    []
  )

  useEffect(() => {
    setMounted(true)
    const stored = getStoredConsent()
    if (!stored) {
      // First visit: Show banner
      setShowBanner(true)
    } else {
      // Sync state with stored values
      syncPreferences(stored)
    }

    // Allow opening preferences from anywhere (e.g. footer link)
    const handleOpenModal = () => {
      const current = getStoredConsent()
      if (current) {
        syncPreferences(current)
      }
      setShowPreferences(true)
    }

    window.addEventListener("komikhq:open-cookie-settings", handleOpenModal)
    return () => {
      window.removeEventListener(
        "komikhq:open-cookie-settings",
        handleOpenModal
      )
    }
  }, [syncPreferences])

  const handleAcceptAll = () => {
    saveConsent({ analytics: true, experience: true })
    setAnalyticsEnabled(true)
    setExperienceEnabled(true)
    setShowBanner(false)
    setShowPreferences(false)
  }

  const handleRejectAll = () => {
    saveConsent({ analytics: false, experience: false })
    setAnalyticsEnabled(false)
    setExperienceEnabled(false)
    setShowBanner(false)
    setShowPreferences(false)
  }

  const handleSavePreferences = () => {
    saveConsent({
      analytics: analyticsEnabled,
      experience: experienceEnabled,
    })
    setShowBanner(false)
    setShowPreferences(false)
  }

  if (!mounted) return null

  return (
    <>
      {/* Floating Bottom Banner */}
      {showBanner && (
        <aside
          role="region"
          aria-label="Cookie Consent"
          className="fixed right-4 bottom-4 left-4 z-50 mx-auto max-w-2xl animate-in duration-300 fade-in-0 slide-in-from-bottom-5 sm:right-6 sm:bottom-6 sm:left-auto"
        >
          <div className="flex flex-col gap-4 rounded-3xl border border-border/80 bg-background/95 p-5 shadow-2xl ring-1 ring-foreground/5 backdrop-blur-md dark:bg-popover/95 dark:ring-foreground/10">
            <div className="flex items-start gap-3.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Cookie className="size-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading text-sm font-semibold tracking-tight text-foreground">
                  Cookie & Privacy Preferences
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  We use cookies to maintain core functionality (session &
                  theme), measure readership analytics (Google Analytics), and
                  improve reading experience (Microsoft Clarity). You can
                  customize your choices anytime.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setShowPreferences(true)}
              >
                <SlidersHorizontal className="mr-1.5 size-3.5" />
                Manage Preferences
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={handleRejectAll}
              >
                Decline All
              </Button>
              <Button
                variant="default"
                size="sm"
                className="text-xs font-medium"
                onClick={handleAcceptAll}
              >
                <Check className="mr-1 size-3.5" />
                Accept All
              </Button>
            </div>
          </div>
        </aside>
      )}

      {/* Preferences Management Dialog */}
      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary">
              <ShieldCheck className="size-5" />
              <DialogTitle className="text-base font-semibold">
                Privacy & Cookie Settings
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Choose which categories of cookies you wish to allow. Essential
              cookies are required to preserve your authentication and site
              preferences.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col divide-y divide-border/60 py-2">
            {/* 1. Strictly Necessary */}
            <div className="flex items-start justify-between gap-4 py-3.5">
              <div className="space-y-1 pr-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">
                    Strictly Necessary (Essential)
                  </span>
                  <Badge
                    variant="secondary"
                    className="px-1.5 py-0 text-[10px] font-normal"
                  >
                    Always Active
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Required for user authentication, dark/light theme
                  persistence, and CSRF protection. Cannot be disabled.
                </p>
              </div>
              <Switch
                checked={true}
                disabled
                aria-label="Strictly Necessary Cookies"
              />
            </div>

            {/* 2. Google Analytics */}
            <div className="flex items-start justify-between gap-4 py-3.5">
              <div className="space-y-1 pr-2">
                <div className="flex items-center gap-2">
                  <ChartBar className="size-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground">
                    Analytics (Google Analytics 4)
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Helps us measure readership, popular manga chapters, and web
                  performance anonymously without identifying personal details.
                </p>
              </div>
              <Switch
                checked={analyticsEnabled}
                onCheckedChange={setAnalyticsEnabled}
                aria-label="Google Analytics Cookies"
              />
            </div>

            {/* 3. Microsoft Clarity */}
            <div className="flex items-start justify-between gap-4 py-3.5">
              <div className="space-y-1 pr-2">
                <div className="flex items-center gap-2">
                  <Eye className="size-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground">
                    Experience & Heatmaps (Microsoft Clarity)
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Records anonymous scroll and tap interactions to help us
                  detect UI bugs and refine the reader interface.
                </p>
              </div>
              <Switch
                checked={experienceEnabled}
                onCheckedChange={setExperienceEnabled}
                aria-label="Microsoft Clarity Cookies"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={handleRejectAll}
            >
              Decline All
            </Button>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="text-xs"
                onClick={handleSavePreferences}
              >
                Save Preferences
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                className="text-xs font-medium"
                onClick={handleAcceptAll}
              >
                Accept All
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
