import Image from "next/image";
import Button from "@/components/ui/Button";
import RevealOnScroll from "@/components/shared/RevealOnScroll";

export default function FounderTeaser() {
  return (
    <section className="py-section bg-cream-soft">
      <div className="container-editorial">
        <RevealOnScroll className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="reveal-item lg:col-span-4">
            <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-gold/40 mb-6">
              <Image
                src="/images/marinella-spano.webp"
                alt="Marinella Spano, fondatrice de NeuroGenesis Academy"
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <p className="text-xs uppercase tracking-wide3 text-forest/60 mb-4">La fondatrice</p>
            <h2 className="font-serif text-h2 text-forest text-balance">Marinella Spano</h2>
            <p className="mt-4 text-ink/70 leading-relaxed">
              Hypnothérapeute, formatrice, et fondatrice de l&apos;Académie NeuroGenesis — 30 ans
              d&apos;expertise en accompagnement humain.
            </p>
            <Button href="/fondatrice" variant="ghost-dark" className="mt-6 px-0">
              Découvrir son parcours →
            </Button>
          </div>

          <div className="reveal-item lg:col-span-8 lg:col-start-5">
            <blockquote className="border-l-2 border-gold-deep pl-8">
              <p className="font-serif italic text-h2 text-forest leading-snug text-balance">
                « On apprend mieux ce qu&apos;on apprend avec plaisir. »
              </p>
              <footer className="mt-6 text-sm text-ink/60 not-italic">
                Marinella Spano, fondatrice de NeuroGenesis Academy
              </footer>
            </blockquote>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
