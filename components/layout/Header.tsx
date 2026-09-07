"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { navLinks } from "@/lib/site-config";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-cream/95 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "shadow-[0_1px_0_0_var(--color-line)]" : "border-b border-line/60"
      }`}
    >
      {/* Header systématiquement clair (fond crème + logo/texte vert forêt), quelle que
          soit la section derrière lui (hero sombre inclus) : lisibilité garantie sur
          toutes les pages, sans dépendre de l'état de scroll. */}
      <div className="container-editorial flex h-[76px] items-center justify-between">
        <Link href="/" aria-label="NeuroGenesis Academy — retour à l'accueil" className="shrink-0">
          <Logo variant="forest" className="h-8 w-auto sm:h-9" />
        </Link>

        <nav className="hidden lg:flex items-center gap-8" aria-label="Navigation principale">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium tracking-wide2 text-forest/80 hover:text-forest transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button href="/contact" variant="forest-outline" size="md">
            Cycle Octobre 2026
          </Button>
        </div>

        <button
          type="button"
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center text-forest"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="lg:hidden bg-cream-soft border-t border-line px-6 py-6 flex flex-col gap-5"
          aria-label="Navigation mobile"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-lg font-serif text-forest"
            >
              {link.label}
            </Link>
          ))}
          <Button href="/contact" variant="gold" className="mt-2 w-full">
            Cycle Octobre 2026
          </Button>
        </nav>
      )}
    </header>
  );
}
