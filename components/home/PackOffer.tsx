import Button from "@/components/ui/Button";
import RevealOnScroll from "@/components/shared/RevealOnScroll";
import { siteConfig } from "@/lib/site-config";

export default function PackOffer() {
  const { pack } = siteConfig.pricing;

  return (
    <section id="pack" className="py-section-sm bg-cream-soft">
      <div className="container-editorial">
        <RevealOnScroll className="rounded-lg border border-gold-deep/30 bg-cream p-8 sm:p-14 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="reveal-item">
            <p className="text-xs uppercase tracking-wide3 text-gold-deep mb-4">
              Le parcours complet
            </p>
            <h2 className="font-serif text-h1 text-forest text-balance mb-5">
              Le Pack Technicien <em>+</em> Praticien.
            </h2>
            <p className="text-ink/70 leading-relaxed max-w-lg mb-6">
              Engagez-vous dès aujourd&apos;hui sur les deux niveaux et faites des économies sur
              l&apos;ensemble de votre parcours vers la pratique certifiée.
            </p>
            <ul className="space-y-2 text-sm text-ink/60 mb-8">
              <li>— Les 5 week-ends Technicien + les 8 week-ends Praticien</li>
              <li>— Paiement en plusieurs fois sans frais</li>
              <li>— Même exigence pédagogique, un seul engagement</li>
            </ul>
            <Button href="/contact" variant="gold" size="lg">
              Réserver le Pack
            </Button>
          </div>

          <div className="reveal-item rounded-lg bg-cream-soft border border-line p-8 text-center lg:text-left">
            <p className="text-xs uppercase tracking-wide3 text-forest/50 mb-2 line-through decoration-1">
              Prix des deux cursus séparés : {pack.regularTotal}€
            </p>
            <p className="font-serif text-hero text-forest leading-none mb-2">
              {pack.packPrice}€
            </p>
            <p className="text-sm text-ink/60 mb-6">Tarif Pack, toute l&apos;année</p>

            <div className="rounded-md bg-forest/[0.04] border border-gold-deep/20 px-5 py-4">
              <p className="text-xs uppercase tracking-wide2 text-gold-deep mb-1">
                Avant le {pack.earlyBirdDeadlineDisplay}
              </p>
              <p className="font-serif text-h2 text-forest leading-none">
                {pack.earlyBirdPrice}€
              </p>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
