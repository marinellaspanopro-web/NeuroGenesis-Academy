import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/shared/JsonLd";
import RevealOnScroll from "@/components/shared/RevealOnScroll";
import FAQAccordion from "@/components/shared/FAQAccordion";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";
import { faqItems } from "@/lib/faq-data";
import { siteConfig } from "@/lib/site-config";
import { pageOpenGraph, pageTwitter } from "@/lib/page-metadata";

const title = "FAQ — Formation Hypnose & Neurosciences | NeuroGenesis";
const description =
  "Toutes les réponses sur les cursus Technicien et Praticien de NeuroGenesis Academy : prérequis, paiement, reconnaissance, groupe, lieu de formation à Namur.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/faq" },
  openGraph: pageOpenGraph(title, description, "/faq"),
  twitter: pageTwitter(title, description),
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", url: siteConfig.url },
          { name: "FAQ", url: `${siteConfig.url}/faq` },
        ])}
      />

      <section className="dark-section pt-[76px]">
        <div className="container-editorial py-section-sm">
          <RevealOnScroll>
            <Link href="/" aria-label="NeuroGenesis Academy — retour à l'accueil" className="reveal-item mb-8 inline-block">
              <Logo variant="gold-on-forest" className="h-9 w-auto" />
            </Link>
            <p className="reveal-item text-xs uppercase tracking-wide3 text-gold/80 mb-4">Questions fréquentes</p>
            <h1 className="reveal-item font-serif text-hero text-cream max-w-2xl text-balance">
              Tout ce qu&apos;il faut savoir <em className="accent-italic">avant de vous lancer.</em>
            </h1>
          </RevealOnScroll>
        </div>
      </section>

      <section className="py-section bg-cream">
        <div className="container-editorial max-w-3xl">
          <RevealOnScroll>
            <div className="reveal-item">
              <FAQAccordion items={faqItems} />
            </div>
          </RevealOnScroll>

          <div className="mt-14 text-center">
            <p className="text-ink/70 mb-6">Une autre question ? Nous vous répondons avec plaisir.</p>
            <Button href="/contact" variant="gold">
              Nous contacter
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
