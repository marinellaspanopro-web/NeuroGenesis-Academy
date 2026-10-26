"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { hasCycleStarted } from "@/lib/cycle";

const CycleContext = createContext({ now: 0, started: false });

/** The server timestamp is reused for hydration, then refreshed in open tabs. */
export default function CycleProvider({ initialNow, children }: { initialNow: number; children: React.ReactNode }) {
  const [now, setNow] = useState(initialNow);
  useEffect(() => {
    const refresh = () => setNow(Date.now());
    const timer = setInterval(refresh, 1000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  return <CycleContext.Provider value={{ now, started: hasCycleStarted(now) }}>{children}</CycleContext.Provider>;
}

export const useCycle = () => useContext(CycleContext);
