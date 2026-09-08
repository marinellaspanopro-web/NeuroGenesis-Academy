"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import Button from "@/components/ui/Button";
import NeuralPattern from "@/components/home/NeuralPattern";
import { siteConfig } from "@/lib/site-config";
import { ensureGsap } from "@/lib/gsap";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!containerRef.current) return;
      const { gsap } = ensureGsap();
      const items = containerRef.current.querySelectorAll(".reveal");

      if (prefersReduced) {
        gsap.set(items, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(items, { opacity: 0, y: 26 });
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.12,
        delay: 0.15,
      });
    },
    { scope: containerRef }
  );

  return (
    <section className="dark-section relative overflow-hidden pt-[76px]">
      <NeuralPattern className="absolute inset-0 h-full w-full opacity-70" />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,transparent_0%,var(--color-forest)_72%)]"
        aria-hidden="true"
      />

      <div ref={containerRef} className="container-editorial relative z-10 py-section flex flex-col items-start">
        <span className="reveal inline-flex items-center gap-2 rounded-pill border border-gold/40 px-4 py-2 text-xs uppercase tracking-wide3 text-gold mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
          Prochain cycle Technicien · {siteConfig.session.startDateDisplay} · {siteConfig.session.city}
        </span>

        <h1 className="reveal font-serif text-hero text-cream max-w-4xl text-balance">
          Reprogrammez vos pensées,{" "}
          <em className="accent-italic">transformez votre vie.</em>
        </h1>

        <p className="reveal mt-7 max-w-xl text-body-lg text-gold/80 leading-relaxed">
          NeuroGenesis forme des techniciens en hypnose &amp; neurosciences d&apos;exception —
          115h d&apos;enseignement, dont 45h de pratique supervisée, dans un cadre d&apos;excellence
          et de bienveillance.
        </p>

        <div className="reveal mt-10 flex flex-col sm:flex-row gap-4">
          <Button href="/contact" variant="gold" size="lg">
            Réserver ma place — Octobre 2026
          </Button>
          <Button
            href="/brochure-neurogenesis-academy.pdf"
            variant="gold-outline"
            size="lg"
            download
          >
            Télécharger la brochure
          </Button>
        </div>

        <p className="reveal mt-10 text-sm text-gold/60 max-w-md">
          Fondée par une praticienne certifiée, 30 ans d&apos;expertise en accompagnement humain.
        </p>
      </div>
    </section>
  );
}
