import { useState, useEffect, useRef } from "react";

const MINIMUM_DISPLAY_MS = 400;

export function useMinimumLoadingTime(isLoading: boolean): boolean {
  const [showSkeleton, setShowSkeleton] = useState(isLoading);
  const loadStartRef = useRef<number>(0);

  useEffect(() => {
    if (isLoading) {
      loadStartRef.current = Date.now();
      setShowSkeleton(true);
      return;
    }

    const elapsed = Date.now() - loadStartRef.current;
    const remaining = Math.max(0, MINIMUM_DISPLAY_MS - elapsed);

    if (remaining === 0) {
      setShowSkeleton(false);
      return;
    }

    const timer = setTimeout(() => setShowSkeleton(false), remaining);
    return () => clearTimeout(timer);
  }, [isLoading]);

  return showSkeleton;
}
