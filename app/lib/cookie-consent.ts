export interface CookieConsentPreferences {
  necessary: true // Always true (Session, Auth, Theme, Security)
  analytics: boolean // Google Analytics 4
  experience: boolean // Microsoft Clarity (Heatmaps & Session Recordings)
  timestamp: number
}

export const CONSENT_STORAGE_KEY = "komikhq_cookie_consent_v1"

export function getStoredConsent(): CookieConsentPreferences | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof parsed.analytics === "boolean"
    ) {
      return {
        necessary: true,
        analytics: Boolean(parsed.analytics),
        experience: Boolean(parsed.experience),
        timestamp: Number(parsed.timestamp) || Date.now(),
      }
    }
    return null
  } catch {
    return null
  }
}

export function applyConsent(prefs: CookieConsentPreferences) {
  if (typeof window === "undefined") return

  // 1. Apply to Google Consent Mode v2
  if (typeof (window as any).gtag === "function") {
    ;(window as any).gtag("consent", "update", {
      analytics_storage: prefs.analytics ? "granted" : "denied",
      ad_storage: prefs.analytics ? "granted" : "denied",
      ad_user_data: prefs.analytics ? "granted" : "denied",
      ad_personalization: prefs.analytics ? "granted" : "denied",
    })
  }

  // 2. Apply to Microsoft Clarity
  if (typeof (window as any).clarity === "function") {
    ;(window as any).clarity("consent", prefs.experience)
  }

  // 3. Dispatch Custom Event for components
  window.dispatchEvent(
    new CustomEvent("komikhq:consent-updated", {
      detail: prefs,
    })
  )
}

export function saveConsent(options: {
  analytics: boolean
  experience: boolean
}): CookieConsentPreferences {
  const prefs: CookieConsentPreferences = {
    necessary: true,
    analytics: options.analytics,
    experience: options.experience,
    timestamp: Date.now(),
  }

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(prefs))
  } catch {
    // LocalStorage write failed (e.g. incognito quota)
  }

  applyConsent(prefs)
  return prefs
}
