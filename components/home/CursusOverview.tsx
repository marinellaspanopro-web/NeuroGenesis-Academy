import Button from "@/components/ui/Button";
import RevealOnScroll from "@/components/shared/RevealOnScroll";
import { siteConfig } from "@/lib/site-config";

export default function CursusOverview() {
  return (
    <section className="py-section bg-cream">
      <div className="container-editorial">
        <RevealOnScroll className="max-w-2xl mb-16">
          <p className="reveal-item text-xs uppercase tracking-wide3 text-forest/60 mb-4">Les cursus</p>
          <h2 className="reveal-item font-serif text-h1 text-forest text-balance">
            Deux niveaux, <em>un même parcours d&apos;excellence.</em>
          </h2>
        </RevealOnScroll>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Technicien — bloc principal, mis en avant */}
          <RevealOnScroll
            as="div"
            className="lg:col-span-7 rounded-lg border border-line bg-cream-soft p-8 sm:p-12"
          >
            <div className="reveal-item">
              <span className="text-xs uppercase tracking-wide3 text-gold-deep">Cursus Technicien</span>
              <h3 className="font-serif text-h2 text-forest mt-3 mb-5 text-balance">
                115h pour poser des fondations solides
              </h3>
              <p className="text-ink/70 leading-relaxed max-w-md mb-6">
                5 week-ends à Namur, 45h de pratique supervisée, un groupe de{" "}
                {siteConfig.session.groupSize.toLowerCase()}. La porte d&apos;entrée vers la
                pratique de l&apos;hypnose &amp; des neurosciences appliquées.
              </p>
              <div className="flex flex-wrap gap-x-10 gap-y-3 mb-8 text-sm">
                <div>
                  <span className="block font-serif text-h3 text-forest">1899€</span>
                  <span className="text-ink/50">Paiement échelonné possible</span>
                </div>
                <div>
                  <span className="block font-serif text-h3 text-forest">5</span>
                  <span className="text-ink/50">Week-ends à Namur</span>
                </div>
              </div>
              <Button href="/formation-technicien" variant="forest-outline">
                Découvrir le cursus Technicien
              </Button>
            </div>
          </RevealOnScroll>

          {/* Praticien — suite naturelle du parcours */}
          <RevealOnScroll
            as="div"
            className="lg:col-span-5 rounded-lg dark-section p-8 sm:p-12 flex flex-col justify-between"
          >
            <div className="reveal-item">
              <span className="text-xs uppercase tracking-wide3 text-gold/80">Cursus Praticien</span>
              <h3 className="font-serif text-h3 text-cream mt-3 mb-5 text-balance">
                La suite naturelle de votre parcours
              </h3>
              <p className="text-gold-soft/70 leading-relaxed mb-8">
                200h (112h présentiel + 88h pratique supervisée) en 8 modules : de la gestion
                de la douleur à la psychopathologie, en passant par la régression thérapeutique
                et la psycho-morphologie.
              </p>
            </div>
            <div className="reveal-item">
              <p className="text-gold font-serif italic text-lg mb-6">
                Accréditations internationales en cours — Francophonie & Italie
              </p>
              <Button href="/formation-praticien" variant="gold-outline">
                Découvrir le cursus Praticien
              </Button>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
