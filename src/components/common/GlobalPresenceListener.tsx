import React from "react";
import { useRealtimeViewers } from "@/hooks/use-realtime-viewers";

export function GlobalPresenceListener() {
  // Invokes the presence WebSocket hook globally across all pages
  useRealtimeViewers();
  return null;
}
