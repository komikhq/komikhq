import { useEffect } from "react"
import { useLocation } from "react-router"
import { getStoredConsent } from "@/lib/cookie-consent"

interface GoogleAnalyticsProps {
  measurementId?: string
}

declare global {
  interface Window {
    dataLayer?: any[]
    gtag?: (...args: any[]) => void
  }
}

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const location = useLocation()

  // Initialize gtag once on mount
  useEffect(() => {
    if (!measurementId || typeof window === "undefined") return

    // Inject gtag script if not present
    const scriptId = "google-analytics-script"
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script")
      script.id = scriptId
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
      document.head.appendChild(script)
    }

    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) {
      window.dataLayer?.push(args)
    }
    window.gtag = gtag

    const stored = getStoredConsent()
    const isGranted = stored?.analytics ? "granted" : "denied"

    gtag("consent", "default", {
      analytics_storage: isGranted,
      ad_storage: isGranted,
      ad_user_data: isGranted,
      ad_personalization: isGranted,
      wait_for_update: 500,
    })

    gtag("js", new Date())
    gtag("config", measurementId, {
      send_page_view: false,
    })
  }, [measurementId])

  // Track page view on route changes (SPA navigation)
  useEffect(() => {
    if (!measurementId || typeof window === "undefined" || typeof window.gtag !== "function") return

    window.gtag("event", "page_view", {
      page_location: window.location.href,
      page_path: location.pathname + location.search,
      page_title: document.title,
    })
  }, [location.pathname, location.search, measurementId])

  return null
}

