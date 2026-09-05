import { getBaseApiUrl } from "./api-client";

export function sendViewBeacon(comicId: string, chapterId?: string) {
  if (typeof navigator === "undefined" || !navigator.sendBeacon) return;

  const baseUrl = getBaseApiUrl();
  const url = `${baseUrl}/v1/view`;

  const payload = JSON.stringify({
    comicId,
    chapterId,
    timestamp: Date.now(),
  });

  const blob = new Blob([payload], { type: "application/json" });
  navigator.sendBeacon(url, blob);
}
