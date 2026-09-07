"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

/**
 * CTA sticky mobile — conversion sans friction, masqué au tout début du
 * scroll (le hero a déjà son propre CTA) puis persistant.
 */
export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`lg:hidden fixed inset-x-0 bottom-0 z-40 p-3 bg-cream/95 backdrop-blur-md border-t border-line transition-transform duration-300 ease-out-expo ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <Button href="/contact" variant="gold" className="w-full">
        Réserver ma place — Octobre 2026
      </Button>
    </div>
  );
}
