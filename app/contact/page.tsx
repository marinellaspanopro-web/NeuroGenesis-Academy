import type { Metadata } from "next";
import JsonLd from "@/components/shared/JsonLd";
import RevealOnScroll from "@/components/shared/RevealOnScroll";
import ContactForm from "@/components/shared/ContactForm";
import { organizationSchema, breadcrumbSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site-config";
import { pageOpenGraph, pageTwitter } from "@/lib/page-metadata";

const title = "Contact — NeuroGenesis Academy Namur";
const description =
  "Contactez NeuroGenesis Academy à Namur (Jambes) pour toute question sur les cursus Technicien et Praticien en hypnose et neurosciences. Réponse rapide garantie.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/contact" },
  openGraph: pageOpenGraph(title, description, "/contact"),
  twitter: pageTwitter(title, description),
};

export default function ContactPage() {
  const mapQuery = encodeURIComponent(
    `${siteConfig.address.streetAddress}, ${siteConfig.address.addressLocality}, Belgique`
  );

  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", url: siteConfig.url },
          { name: "Contact", url: `${siteConfig.url}/contact` },
        ])}
      />

      <section className="dark-section pt-[76px]">
        <div className="container-editorial py-section-sm">
          <RevealOnScroll>
            <p className="reveal-item text-xs uppercase tracking-wide3 text-gold/80 mb-4">Contact</p>
            <h1 className="reveal-item font-serif text-hero text-cream max-w-2xl text-balance">
              Parlons de votre <em className="accent-italic">projet.</em>
            </h1>
            <p className="reveal-item mt-6 max-w-xl text-body-lg text-cream/75 leading-relaxed">
              Une question sur les cursus, les modalités de paiement ou l&apos;organisation des
              sessions ? Notre équipe vous répond avec plaisir.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <section id="formulaire" className="py-section bg-cream">
        <div className="container-editorial grid gap-16 lg:grid-cols-12">
          <RevealOnScroll className="lg:col-span-7">
            <div className="reveal-item">
              <ContactForm />
            </div>
          </RevealOnScroll>

          <div className="lg:col-span-4 lg:col-start-9">
            <RevealOnScroll>
              <div className="reveal-item rounded-lg border border-line bg-cream-soft p-8 mb-8">
                <p className="text-xs uppercase tracking-wide3 text-forest/60 mb-5">Coordonnées</p>
                <ul className="space-y-4 text-ink/75">
                  <li>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="hover:text-forest font-medium transition-colors"
                    >
                      {siteConfig.email}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                      className="hover:text-forest font-medium transition-colors"
                    >
                      {siteConfig.phoneDisplay}
                    </a>
                  </li>
                  <li>
                    {siteConfig.address.streetAddress}, {siteConfig.address.addressLocality}
                    <br />
                    Belgique
                  </li>
                </ul>
              </div>

              <div className="reveal-item rounded-lg overflow-hidden border border-line aspect-[4/3]">
                <iframe
                  title={`Carte — NeuroGenesis Academy, ${siteConfig.address.addressLocality}`}
                  src={`https://maps.google.com/maps?q=${mapQuery}&z=13&output=embed`}
                  className="h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>
    </>
  );
}
