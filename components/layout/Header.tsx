"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "@/components/ui/Button";
import { navLinks } from "@/lib/site-config";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // Ancre actuellement visible à l'écran (ex: "valeurs"), ou null si on est
  // au-dessus de toute section ancrée (auquel cas "Accueil" reste actif).
  const [activeHash, setActiveHash] = useState<string | null>(null);
  const pathname = usePathname();

  // Un lien est actif si sa page correspond à l'URL actuelle ET, s'il pointe
  // vers une ancre (ex: "Nos valeurs" → /#valeurs), si cette section est
  // bien celle actuellement visible à l'écran (scroll-spy ci-dessous).
  const isActive = (href: string) => {
    const [base, hash] = href.split("#");
    if ((base || "/") !== pathname) return false;
    return hash ? activeHash === hash : activeHash === null;
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy : surveille les sections correspondant aux liens en #ancre
  // (ex: #valeurs) et met à jour le lien actif au fil du défilement, plutôt
  // que de laisser "Accueil" souligné en permanence tant qu'on reste sur "/".
  useEffect(() => {
    setActiveHash(null);

    const ids = navLinks
      .map((l) => l.href.split("#")[1])
      .filter((id): id is string => Boolean(id));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) {
          setActiveHash(null);
          return;
        }
        // S'il y a plusieurs sections visibles à la fois, on retient celle
        // dont le haut est le plus proche du haut de l'écran.
        const top = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        );
        setActiveHash(top.target.id);
      },
      { rootMargin: "-90px 0px -70% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-cream/95 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "shadow-[0_1px_0_0_var(--color-line)]" : "border-b border-line/60"
      }`}
    >
      {/* Header systématiquement clair (fond crème), quelle que soit la section
          derrière lui (hero sombre inclus) : lisibilité garantie sur toutes les
          pages, sans dépendre de l'état de scroll. Le logo, lui, vit sur le fond
          vert forêt du hero de chaque page (cf. Hero.tsx et les sections
          d'ouverture des autres pages) plutôt que dans cette barre fixe. */}
      <div className="container-editorial flex h-[76px] items-center justify-between">
        <nav className="hidden lg:flex items-center gap-8" aria-label="Navigation principale">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`text-sm font-medium tracking-wide2 pb-1 border-b-2 transition-colors ${
                isActive(link.href)
                  ? "text-forest border-gold-deep"
                  : "text-forest/80 border-transparent hover:text-forest"
              }`}
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
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`text-lg font-serif flex items-center gap-3 ${
                isActive(link.href) ? "text-forest" : "text-forest/70"
              }`}
            >
              {isActive(link.href) && (
                <span className="h-1.5 w-1.5 rounded-full bg-gold-deep" aria-hidden="true" />
              )}
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
