import { useState, useEffect } from "react"
import { getBaseApiUrl } from "@/lib/api-client"

export interface UseRealtimeViewersOptions {
  channelName?: string
}

function getVisitorId(): string {
  if (typeof window === "undefined") return ""
  try {
    let id = localStorage.getItem("komikhq_visitor_id")
    if (!id) {
      id = `visitor_${Date.now()}_${crypto.randomUUID()}`
      localStorage.setItem("komikhq_visitor_id", id)
    }
    return id
  } catch {
    return `visitor_${Date.now()}_${crypto.randomUUID()}`
  }
}

export function useRealtimeViewers(options: UseRealtimeViewersOptions = {}) {
  const [onlineCount, setOnlineCount] = useState<number>(1)
  const channelName = options.channelName || "global_presence"

  useEffect(() => {
    if (typeof window === "undefined") return

    let ws: WebSocket | null = null
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null
    let isMounted = true

    function connect() {
      if (!isMounted) return

      try {
        const visitorId = getVisitorId()
        const baseUrl = getBaseApiUrl()
        const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:"
        const wsHost = baseUrl.replace(/^https?:\/\//, "")
        const wsUrl = `${wsProtocol}//${wsHost}/v1/realtime/ws?channel=${encodeURIComponent(channelName)}&visitorId=${encodeURIComponent(visitorId)}`

        ws = new WebSocket(wsUrl)

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            if (data.event === "online_count" && typeof data.count === "number") {
              setOnlineCount(data.count)
            }
          } catch {
            // Ignore parse errors
          }
        }

        ws.onclose = () => {
          if (isMounted) {
            reconnectTimeout = setTimeout(connect, 5000)
          }
        }

        ws.onerror = () => {
          if (ws) {
            ws.close()
          }
        }
      } catch {
        if (isMounted) {
          reconnectTimeout = setTimeout(connect, 5000)
        }
      }
    }

    connect()

    return () => {
      isMounted = false
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout)
      }
      if (ws) {
        ws.close()
      }
    }
  }, [channelName])

  return { onlineCount }
}

