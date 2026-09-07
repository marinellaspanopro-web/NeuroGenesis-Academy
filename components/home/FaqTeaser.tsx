import Button from "@/components/ui/Button";
import RevealOnScroll from "@/components/shared/RevealOnScroll";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { faqItems } from "@/lib/faq-data";

export default function FaqTeaser() {
  return (
    <section className="py-section bg-cream-soft">
      <div className="container-editorial">
        <div className="grid gap-12 lg:grid-cols-12">
          <RevealOnScroll className="lg:col-span-4">
            <p className="reveal-item text-xs uppercase tracking-wide3 text-forest/60 mb-4">Questions fréquentes</p>
            <h2 className="reveal-item font-serif text-h2 text-forest text-balance mb-6">
              Tout ce qu&apos;il faut savoir <em>avant de vous lancer.</em>
            </h2>
            <Button href="/faq" variant="ghost-dark" className="px-0">
              Voir toute la FAQ →
            </Button>
          </RevealOnScroll>

          <div className="lg:col-span-8">
            <FAQAccordion items={faqItems.slice(0, 4)} />
          </div>
        </div>
      </div>
    </section>
  );
}
