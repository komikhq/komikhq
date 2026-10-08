"use client"

import * as React from "react"
import { Logo } from "@/components/common/Logo"
import { SITE_NAME, SITE_TAGLINE, SITE_CONTACT_EMAIL } from "@/constants/site"
import {
  Cookie,
  EnvelopeSimple,
  ShieldCheck,
  FileText,
  Copyright,
  Compass,
  ListBullets,
  BookmarkSimple,
  ClockCounterClockwise,
} from "@phosphor-icons/react"

export function SiteFooter() {
  const currentYear = new Date().getFullYear()

  const handleOpenCookieSettings = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("komikhq:open-cookie-settings"))
    }
  }

  return (
    <footer className="mt-auto border-t border-border/80 bg-card/40 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <Logo size="compact" />
              <span className="font-heading text-lg font-bold tracking-tight text-foreground md:hidden">
                {SITE_NAME}
              </span>
            </div>

            <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
              {SITE_TAGLINE}
            </p>
            <div className="pt-2 text-xs text-muted-foreground">
              <span>Official contact: </span>
              <a
                href={`mailto:${SITE_CONTACT_EMAIL}`}
                className="font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
              >
                {SITE_CONTACT_EMAIL}
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider text-foreground uppercase">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <a
                  href="/browse"
                  className="flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <Compass className="size-3.5" />
                  <span>Browse Comics</span>
                </a>
              </li>
              <li>
                <a
                  href="/list-all"
                  className="flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <ListBullets className="size-3.5" />
                  <span>All Manga List</span>
                </a>
              </li>
              <li>
                <a
                  href="/bookmark"
                  className="flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <BookmarkSimple className="size-3.5" />
                  <span>My Bookmarks</span>
                </a>
              </li>
              <li>
                <a
                  href="/history"
                  className="flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <ClockCounterClockwise className="size-3.5" />
                  <span>Reading History</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider text-foreground uppercase">
              Legal & Privacy
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <a
                  href="/privacy"
                  className="flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <ShieldCheck className="size-3.5" />
                  <span>Privacy Policy</span>
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <FileText className="size-3.5" />
                  <span>Terms of Service</span>
                </a>
              </li>
              <li>
                <a
                  href="/dmca"
                  className="flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <Copyright className="size-3.5" />
                  <span>DMCA Policy</span>
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <EnvelopeSimple className="size-3.5" />
                  <span>Contact Us</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Privacy & Cookie Control */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider text-foreground uppercase">
              Preferences
            </h4>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Adjust cookie consent choices for analytics and user behavior
              heatmaps.
            </p>
            <button
              type="button"
              onClick={handleOpenCookieSettings}
              className="inline-flex items-center gap-2 rounded-2xl border border-border/80 bg-secondary/80 px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-all hover:bg-secondary hover:text-foreground active:scale-95"
            >
              <Cookie className="size-3.5 text-primary" />
              <span>Cookie Settings</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {currentYear} {SITE_NAME}. All rights reserved.
          </p>
          <p className="text-center text-[11px] sm:text-right">
            Non-commercial reader interface. All comic contents belong to their
            respective creators.
          </p>
        </div>
      </div>
    </footer>
  )
}
