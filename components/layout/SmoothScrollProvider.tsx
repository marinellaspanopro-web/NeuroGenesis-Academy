"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { ensureGsap } from "@/lib/gsap";

/**
 * Smooth scroll global (Lenis) synchronisé avec GSAP ScrollTrigger.
 * Une seule librairie de scroll fluide, comme recommandé pour éviter
 * les conflits entre systèmes d'animation concurrents.
 */
export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const { gsap, ScrollTrigger } = ensureGsap();

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    function raf(time: number) {
      // gsap.ticker fournit le temps en secondes ; Lenis attend des millisecondes.
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
