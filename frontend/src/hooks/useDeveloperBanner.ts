import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "rasu-dev-banner-dismissed";
const TTL_MS = 24 * 60 * 60 * 1000;

function isDismissedWithinTTL(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;

    const dismissedAt = Number(raw);
    if (Number.isNaN(dismissedAt)) return false;

    return Date.now() - dismissedAt < TTL_MS;
  } catch {
    return false;
  }
}

export function useDeveloperBanner() {
  const [isVisible, setIsVisible] = useState(() => !isDismissedWithinTTL());

  useEffect(() => {
    if (!isDismissedWithinTTL()) {
      setIsVisible(true);
    }
  }, []);

  const dismiss = useCallback(() => {
    setIsVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      /* localStorage unavailable — graceful degradation */
    }
  }, []);

  return { isVisible, dismiss } as const;
}
