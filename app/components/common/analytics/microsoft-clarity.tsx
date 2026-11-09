import { useEffect } from "react"
import { getStoredConsent } from "@/lib/cookie-consent"

interface MicrosoftClarityProps {
  projectId?: string
}

declare global {
  interface Window {
    clarity?: (...args: any[]) => void
  }
}

export function MicrosoftClarity({ projectId }: MicrosoftClarityProps) {
  useEffect(() => {
    if (!projectId || typeof window === "undefined") return

    if (!window.clarity) {
      ;(function (c: any, l: any, a: any, r: any, i?: any, t?: any, y?: any) {
        c[a] =
          c[a] ||
          function () {
            ;(c[a].q = c[a].q || []).push(arguments)
          }
        t = l.createElement(r)
        t.async = 1
        t.src = "https://www.clarity.ms/tag/" + projectId
        y = l.getElementsByTagName(r)[0]
        y.parentNode.insertBefore(t, y)
      })(window, document, "clarity", "script")
    }

    const stored = getStoredConsent()
    const isExperienceGranted = Boolean(stored?.experience)
    window.clarity?.("consent", isExperienceGranted)
  }, [projectId])

  return null
}

