"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { ensureGsap } from "@/lib/gsap";

type RevealOnScrollProps = {
  children: ReactNode;
  /** Sélecteur des enfants à révéler individuellement (stagger). Par défaut, tout le bloc. */
  stagger?: number;
  y?: number;
  className?: string;
  as?: "div" | "section";
  /** Décalage du déclenchement (pourcentage de la hauteur de viewport). */
  start?: string;
};

/**
 * Enveloppe générique de reveal au scroll. Anime les enfants directs marqués
 * `.reveal-item`, sinon anime le conteneur lui-même. Respecte prefers-reduced-motion.
 */
export default function RevealOnScroll({
  children,
  stagger = 0.1,
  y = 28,
  className,
  as = "div",
  start = "top 82%",
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!ref.current) return;

      const { gsap, ScrollTrigger } = ensureGsap();
      const items = ref.current.querySelectorAll(":scope > .reveal-item");
      const targets = items.length ? items : ref.current.children;

      if (prefersReduced) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(targets, { opacity: 0, y });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: "power4.out",
        stagger,
        scrollTrigger: {
          trigger: ref.current,
          start,
          once: true,
        },
      });

      return () => ScrollTrigger.getAll().forEach((t) => t.kill());
    },
    { scope: ref }
  );

  const Comp = as;
  return (
    <Comp ref={ref as never} className={className}>
      {children}
    </Comp>
  );
}
