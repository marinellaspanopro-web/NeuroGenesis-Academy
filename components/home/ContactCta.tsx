import Button from "@/components/ui/Button";
import RevealOnScroll from "@/components/shared/RevealOnScroll";
import { siteConfig } from "@/lib/site-config";

export default function ContactCta() {
  return (
    <section className="py-section-sm bg-cream">
      <div className="container-editorial">
        <RevealOnScroll className="rounded-lg border border-line bg-cream-soft px-8 py-14 sm:px-16 sm:py-16 text-center">
          <div className="reveal-item max-w-2xl mx-auto">
            <h2 className="font-serif text-h2 text-forest text-balance mb-5">
              Une question ? <em>Parlons-en.</em>
            </h2>
            <p className="text-ink/70 leading-relaxed mb-8">
              Notre équipe vous répond avec plaisir sur le déroulement des cursus, les modalités
              de paiement ou l&apos;organisation des sessions à {siteConfig.address.addressLocality}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact" variant="gold">
                Nous écrire
              </Button>
              <Button href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} variant="forest-outline">
                {siteConfig.phoneDisplay}
              </Button>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
