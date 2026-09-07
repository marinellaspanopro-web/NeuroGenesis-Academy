import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/shared/JsonLd";
import RevealOnScroll from "@/components/shared/RevealOnScroll";
import Button from "@/components/ui/Button";
import { courseSchema, breadcrumbSchema } from "@/lib/schema";
import { siteConfig, praticienDates } from "@/lib/site-config";
import { praticienModules, optionalModules } from "@/lib/cursus-data";
import { pageOpenGraph, pageTwitter } from "@/lib/page-metadata";

const title = "Cursus Praticien Hypnose — Formation Avancée | NeuroGenesis";
const description =
  "Cursus Praticien en hypnose à Namur : 200h (112h présentiel + 88h pratique supervisée) en 8 modules, de la gestion de la douleur à la psychopathologie.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/formation-praticien" },
  openGraph: pageOpenGraph(title, description, "/formation-praticien"),
  twitter: pageTwitter(title, description),
};

const stats = [
  { value: "200h", label: "Formation totale" },
  { value: "112h", label: "En présentiel" },
  { value: "88h", label: "Pratique supervisée" },
];

export default function FormationPraticienPage() {
  return (
    <>
      <JsonLd
        data={courseSchema({
          name: "Cursus Praticien en hypnose & neurosciences",
          description,
          url: `${siteConfig.url}/formation-praticien`,
          price: siteConfig.pricing.praticien.amount,
          duration: "200 heures — 112h présentiel et 88h de pratique supervisée, en 8 modules",
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", url: siteConfig.url },
          { name: "Cursus Praticien", url: `${siteConfig.url}/formation-praticien` },
        ])}
      />

      <section className="dark-section pt-[76px]">
        <div className="container-editorial py-section-sm">
          <RevealOnScroll>
            <p className="reveal-item text-xs uppercase tracking-wide3 text-gold/80 mb-4">
              Cursus Praticien · 8 modules
            </p>
            <h1 className="reveal-item font-serif text-hero text-cream max-w-3xl text-balance">
              La suite naturelle de votre <em className="accent-italic">parcours.</em>
            </h1>
            <p className="reveal-item mt-6 max-w-xl text-body-lg text-cream/75 leading-relaxed">
              200 heures pour affiner votre pratique clinique : de la gestion avancée de la
              douleur à la psychopathologie, en passant par la régression thérapeutique et la
              psycho-morphologie. Accréditations internationales en cours pour la Francophonie
              et l&apos;Italie.
            </p>

            <div className="reveal-item mt-12 flex flex-wrap gap-x-12 gap-y-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <span className="block font-serif text-h2 text-gold">{s.value}</span>
                  <span className="text-sm text-cream/60">{s.label}</span>
                </div>
              ))}
            </div>

            <div className="reveal-item mt-10">
              <Button href="/contact" variant="gold" size="lg">
                Me renseigner sur le Praticien
              </Button>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Modules — liste éditoriale, 8 modules de 14h chacun */}
      <section className="py-section bg-cream">
        <div className="container-editorial">
          <RevealOnScroll className="max-w-2xl mb-14">
            <p className="reveal-item text-xs uppercase tracking-wide3 text-forest/60 mb-4">Au programme</p>
            <h2 className="reveal-item font-serif text-h1 text-forest text-balance">
              Huit modules, <em>une expertise clinique affinée.</em>
            </h2>
            <p className="reveal-item mt-5 text-ink/70 leading-relaxed max-w-xl">
              14h par module (2 jours + pratique supervisée), accessibles après validation du
              cursus Technicien.
            </p>
          </RevealOnScroll>

          <div className="border-t border-line">
            {praticienModules.map((m, i) => (
              <RevealOnScroll
                key={m.n}
                as="div"
                className={`border-b border-line py-8 grid gap-4 lg:grid-cols-12 lg:items-baseline ${
                  i % 2 === 1 ? "lg:pl-16" : ""
                }`}
              >
                <div className="reveal-item lg:col-span-2">
                  <span className="font-serif italic text-h3 text-gold-deep">{m.n}</span>
                </div>
                <div className="reveal-item lg:col-span-10">
                  <h3 className="font-serif text-h3 text-forest mb-2 text-balance">{m.title}</h3>
                  <p className="text-ink/70 text-sm leading-relaxed max-w-2xl">{m.text}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Calendrier des sessions */}
      <section className="py-section-sm bg-cream-soft">
        <div className="container-editorial">
          <RevealOnScroll className="max-w-2xl mb-10">
            <p className="reveal-item text-xs uppercase tracking-wide3 text-forest/60 mb-4">Calendrier</p>
            <h2 className="reveal-item font-serif text-h2 text-forest text-balance">
              Huit week-ends, <em>de mars à septembre 2027.</em>
            </h2>
          </RevealOnScroll>

          <RevealOnScroll className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            {praticienDates.map((date, i) => (
              <div key={date} className="reveal-item border-t border-line pt-4">
                <span className="block text-xs uppercase tracking-wide3 text-gold-deep mb-1">
                  Session {i + 1}
                </span>
                <span className="font-serif text-lg text-forest">{date}</span>
              </div>
            ))}
          </RevealOnScroll>
        </div>
      </section>

      {/* Modules optionnels — pour aller plus loin au-delà des bases incluses */}
      <section className="dark-section py-section-sm">
        <div className="container-editorial">
          <RevealOnScroll className="max-w-2xl mb-12">
            <p className="reveal-item text-xs uppercase tracking-wide3 text-gold/80 mb-4">
              Aller plus loin
            </p>
            <h2 className="reveal-item font-serif text-h2 text-cream text-balance">
              Modules optionnels, <em className="accent-italic">pour approfondir votre pratique.</em>
            </h2>
            <p className="reveal-item mt-4 text-cream/70 leading-relaxed">
              Au-delà des bases incluses dans le cursus, ces modules permettent d&apos;aller plus
              loin sur des thématiques spécifiques. Non inclus dans le tarif du cursus —{" "}
              <span className="text-gold">-20% en cas de souscription simultanée à un cursus.</span>
            </p>
          </RevealOnScroll>

          <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {optionalModules.map((m) => (
              <RevealOnScroll key={m.title} as="div">
                <div
                  className={`reveal-item h-full rounded-lg border p-6 ${
                    "highlight" in m && m.highlight
                      ? "border-gold/50 bg-gold/[0.06]"
                      : "border-cream/15"
                  }`}
                >
                  <p className="font-serif text-lg text-cream mb-1 text-balance">{m.title}</p>
                  <p className="text-xs uppercase tracking-wide2 text-gold/70 mb-3">{m.duration}</p>
                  <p className="text-sm text-cream/65 leading-relaxed mb-4">{m.text}</p>
                  <p className="font-serif text-h3 text-gold">{m.price}€</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll className="mt-10">
            <p className="reveal-item text-sm text-cream/60">
              Intéressé·e par un ou plusieurs modules optionnels ?{" "}
              <Link href="/contact" className="text-gold underline underline-offset-4 hover:text-cream transition-colors">
                Parlons-en →
              </Link>
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Tarif & CTA final — même carte claire que la page Technicien */}
      <section className="py-section bg-cream">
        <div className="container-editorial">
          <RevealOnScroll className="rounded-lg border border-line bg-cream-soft p-10 sm:p-16 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="reveal-item">
              <p className="text-xs uppercase tracking-wide3 text-forest/60 mb-4">Investissement</p>
              <p className="font-serif text-hero text-forest leading-none">
                {siteConfig.pricing.praticien.amount}€
              </p>
              <p className="mt-3 text-ink/60 max-w-sm">
                Paiement en plusieurs fois sans frais, mêmes conditions que le cursus Technicien.
                Accessible après validation complète du cursus Technicien.
              </p>
              <p className="mt-4 text-sm text-ink/45 max-w-sm">
                Besoin de reprendre une année ? Le redoublement de votre niveau (Technicien ou
                Praticien) est offert l&apos;année suivante.
              </p>
              <p className="mt-4 text-sm max-w-sm">
                Vous visez les deux niveaux ?{" "}
                <Link href="/#pack" className="text-gold-deep underline underline-offset-4 hover:text-forest">
                  Découvrez le Pack Technicien + Praticien →
                </Link>
              </p>
            </div>
            <div className="reveal-item flex flex-col gap-4 sm:flex-row lg:flex-col">
              <Button href="/contact" variant="gold" size="lg">
                Réserver ma place
              </Button>
              <Button href="/formation-technicien" variant="forest-outline" size="lg">
                Voir le cursus Technicien
              </Button>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="py-section bg-cream text-center">
        <div className="container-editorial">
          <RevealOnScroll className="max-w-xl mx-auto">
            <h2 className="reveal-item font-serif text-h2 text-forest text-balance mb-8">
              Commencez par le cursus <em>Technicien.</em>
            </h2>
            <div className="reveal-item flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/formation-technicien" variant="gold">
                Découvrir le cursus Technicien
              </Button>
              <Button href="/contact" variant="forest-outline">
                Poser une question
              </Button>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
