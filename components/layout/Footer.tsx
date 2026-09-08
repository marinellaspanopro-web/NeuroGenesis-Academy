import Link from "next/link";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { navLinks, siteConfig } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="dark-section">
      <div className="container-editorial pt-section-sm pb-10">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr] lg:gap-8">
          <div>
            <Logo variant="gold-on-forest" className="logo-glow h-11 w-auto mb-6" />
            <p className="font-serif italic text-h3 text-cream/95 max-w-sm leading-snug">
              Reprogrammez vos pensées, transformez votre vie.
            </p>
            <div className="mt-6">
              <Button href="/contact" variant="gold">
                Réserver ma place — Octobre 2026
              </Button>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide3 text-gold/80 mb-4">Navigation</p>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gold/80 hover:text-gold transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide3 text-gold/80 mb-4">Contact</p>
            <ul className="space-y-3 text-sm text-gold/80">
              <li>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-gold transition-colors">
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="hover:text-gold transition-colors">
                  {siteConfig.phoneDisplay}
                </a>
              </li>
              <li>{siteConfig.address.streetAddress}, {siteConfig.address.addressLocality} — Belgique</li>
            </ul>
            <div className="flex gap-4 mt-5">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="NeuroGenesis Academy sur Instagram"
                className="text-gold/70 hover:text-gold transition-colors"
              >
                Instagram
              </a>
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="NeuroGenesis Academy sur Facebook"
                className="text-gold/70 hover:text-gold transition-colors"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-cream/10 flex flex-col sm:flex-row gap-3 justify-between text-xs text-gold/50">
          <p>© {new Date().getFullYear()} NeuroGenesis Academy — Marinella Spano. Tous droits réservés.</p>
          <div className="flex gap-4">
            <Link href="/mentions-legales" className="hover:text-gold transition-colors">
              Mentions légales
            </Link>
            <p>Namur (Jambes), Belgique</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
