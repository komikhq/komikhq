import { useState, useEffect } from "react";
import Pusher from "pusher-js";
import { getBaseApiUrl } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/api-routes";

export interface UseRealtimeViewersOptions {
  pusherKey?: string;
  cluster?: string;
  channelName?: string;
}

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem("komikhq_visitor_id");
    if (!id) {
      id = `visitor_${Date.now()}_${crypto.randomUUID()}`;
      localStorage.setItem("komikhq_visitor_id", id);
    }
    return id;
  } catch {
    return `visitor_${Date.now()}_${crypto.randomUUID()}`;
  }
}

export function useRealtimeViewers(options: UseRealtimeViewersOptions = {}) {
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const key = options.pusherKey || import.meta.env.PUBLIC_PUSHER_KEY;
  const cluster = options.cluster || import.meta.env.PUBLIC_PUSHER_CLUSTER || "ap1";
  const channelName = options.channelName || "presence-global";

  useEffect(() => {
    if (typeof window === "undefined") return;

    const visitorId = getVisitorId();
    const baseUrl = getBaseApiUrl();
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsHost = baseUrl.replace(/^https?:\/\//, "");
    const wsUrl = `${wsProtocol}//${wsHost}/v1/realtime/ws?channel=global_presence&visitorId=${encodeURIComponent(visitorId)}`;

    let ws: WebSocket | null = null;
    let pusher: Pusher | null = null;

    try {
      ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.event === "online_count" && typeof data.count === "number") {
            setOnlineCount(data.count);
          }
        } catch {
          // Ignore
        }
      };

      ws.onerror = () => {
        // Fallback to Pusher on WS error
        connectPusher();
      };
    } catch {
      connectPusher();
    }

    function connectPusher() {
      if (!key) return;
      const authEndpoint = `${baseUrl}${API_ROUTES.REALTIME.AUTH}`;

      pusher = new Pusher(key, {
        cluster,
        forceTLS: true,
        userAuthentication: {
          endpoint: authEndpoint,
          transport: "ajax",
        },
        channelAuthorization: {
          endpoint: authEndpoint,
          transport: "ajax",
        },
      });

      const channel = pusher.subscribe(channelName);

      channel.bind("pusher:subscription_succeeded", (members: any) => {
        if (members && typeof members.count === "number") {
          setOnlineCount(members.count);
        }
      });

      channel.bind("pusher:member_added", () => {
        setOnlineCount((prev) => prev + 1);
      });

      channel.bind("pusher:member_removed", () => {
        setOnlineCount((prev) => Math.max(1, prev - 1));
      });
    }

    return () => {
      if (ws) {
        ws.close();
      }
      if (pusher) {
        pusher.disconnect();
      }
    };
  }, [key, cluster, channelName]);

  return { onlineCount };
}
