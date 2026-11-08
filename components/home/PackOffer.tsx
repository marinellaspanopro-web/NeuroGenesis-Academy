import Button from "@/components/ui/Button";
import RevealOnScroll from "@/components/shared/RevealOnScroll";
import { siteConfig } from "@/lib/site-config";

export default function PackOffer() {
  const { pack } = siteConfig.pricing;

  return (
    <section id="pack" className="scroll-mt-20 py-section-sm bg-cream-soft">
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
              Le Pack réunit les cinq week-ends du Technicien et les huit week-ends du Praticien
              à un tarif préférentiel, avec la possibilité de payer en plusieurs fois sans frais.
            </p>
            <p className="text-ink/70 leading-relaxed max-w-lg mb-4">{siteConfig.session.packMessage}</p>
            <p className="text-sm text-ink/70 leading-relaxed mb-6">
              {siteConfig.session.packTerms}
            </p>
            <Button href="/inscription?parcours=pack" variant="gold" size="lg">Choisir le Pack à l’inscription</Button>
            <Button href={siteConfig.session.packInquiryHref} variant="ghost-dark" size="lg">
              Me renseigner sur le Pack
            </Button>
          </div>

          <div className="reveal-item rounded-lg bg-cream-soft border border-line p-8 text-center lg:text-left">
            <p className="text-xs uppercase tracking-wide3 text-forest/50 mb-2">
              Prix des deux cursus séparés : {pack.regularTotal.toLocaleString("fr-FR")} €
            </p>
            <p className="font-serif text-hero text-forest leading-none mb-2">
              {pack.packPrice.toLocaleString("fr-FR")} €
            </p>
            <p className="text-sm text-ink/60 mb-6">Tarif du Pack pour les deux cursus</p>

            <div className="rounded-md bg-forest/[0.04] border border-gold-deep/20 px-5 py-4">
              <p className="text-xs uppercase tracking-wide2 text-gold-deep mb-1">
                Économie sur les deux cursus
              </p>
              <p className="font-serif text-h2 text-forest leading-none">
                {(pack.regularTotal - pack.packPrice).toLocaleString("fr-FR")} €
              </p>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
