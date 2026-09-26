"use client";

import { useEffect, useState } from "react";

/** milliseconds since `since`, ticking while `running` is true */
export function useElapsed(since: number, running: boolean, intervalMs = 250) {
  const [now, setNow] = useState(since);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [since, running, intervalMs]);

  return Math.max(0, now - since);
}
