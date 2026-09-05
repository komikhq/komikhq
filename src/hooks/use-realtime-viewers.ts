import { useState, useEffect } from "react";
import Pusher from "pusher-js";
import { getBaseApiUrl } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/api-routes";

export interface UseRealtimeViewersOptions {
  pusherKey?: string;
  cluster?: string;
  channelName?: string;
}

export function useRealtimeViewers(options: UseRealtimeViewersOptions = {}) {
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const key = options.pusherKey || import.meta.env.PUBLIC_PUSHER_KEY;
  const cluster = options.cluster || import.meta.env.PUBLIC_PUSHER_CLUSTER || "ap1";
  const channelName = options.channelName || "presence-global";

  useEffect(() => {
    if (!key || typeof window === "undefined") return;

    const baseUrl = getBaseApiUrl();
    const authEndpoint = `${baseUrl}${API_ROUTES.REALTIME.AUTH}`;

    const pusher = new Pusher(key, {
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

    channel.bind("viewer_count_update", (data: { count: number }) => {
      if (typeof data.count === "number") {
        setOnlineCount(data.count);
      }
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
      pusher.disconnect();
    };
  }, [key, cluster, channelName]);

  return { onlineCount };
}
