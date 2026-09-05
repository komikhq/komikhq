import { getBaseApiUrl } from "./api-client";
import { API_ROUTES } from "@/constants/api-routes";

export function sendViewBeacon(comicId: string, chapterId?: string) {
  if (typeof navigator === "undefined" || !navigator.sendBeacon) return;

  const baseUrl = getBaseApiUrl();
  const url = `${baseUrl}${API_ROUTES.VIEW}`;

  const payload = JSON.stringify({
    comicId,
    chapterId,
    timestamp: Date.now(),
  });

  const blob = new Blob([payload], { type: "application/json" });
  navigator.sendBeacon(url, blob);
}
