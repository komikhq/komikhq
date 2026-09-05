import { useState, useEffect, useCallback } from "react";

const STORAGE_PREFIX = "komikhq_email_resend_cooldown_";

export function useResendCooldown(email: string, defaultDurationSeconds: number = 60) {
  const storageKey = email ? `${STORAGE_PREFIX}${email}` : null;

  const getRemainingSeconds = useCallback(() => {
    if (!storageKey || typeof window === "undefined") return 0;
    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return 0;
      const resendAvailableAt = parseInt(stored, 10);
      if (isNaN(resendAvailableAt)) return 0;
      const diff = Math.ceil((resendAvailableAt - Date.now()) / 1000);
      return diff > 0 ? diff : 0;
    } catch {
      return 0;
    }
  }, [storageKey]);

  const [cooldownSeconds, setCooldownSeconds] = useState<number>(getRemainingSeconds);

  useEffect(() => {
    setCooldownSeconds(getRemainingSeconds());
  }, [getRemainingSeconds]);

  useEffect(() => {
    if (cooldownSeconds <= 0) return;

    const timer = setInterval(() => {
      const remaining = getRemainingSeconds();
      setCooldownSeconds(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownSeconds, getRemainingSeconds]);

  const startCooldown = useCallback(
    (seconds: number = defaultDurationSeconds) => {
      if (!storageKey || typeof window === "undefined") return;
      const resendAvailableAt = Date.now() + seconds * 1000;
      try {
        localStorage.setItem(storageKey, resendAvailableAt.toString());
      } catch (e) {
        console.error("Failed to save email resend cooldown to localStorage:", e);
      }
      setCooldownSeconds(seconds);
    },
    [storageKey, defaultDurationSeconds]
  );

  return {
    cooldownSeconds,
    isCooldownActive: cooldownSeconds > 0,
    startCooldown,
  };
}
