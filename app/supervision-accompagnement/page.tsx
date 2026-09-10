import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/shared/JsonLd";
import RevealOnScroll from "@/components/shared/RevealOnScroll";
import FAQAccordion from "@/components/shared/FAQAccordion";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import { breadcrumbSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site-config";
import { pageOpenGraph, pageTwitter } from "@/lib/page-metadata";

const title = "Supervision & Accompagnement Année 1 | NeuroGenesis Academy";
const description =
  "Après la certification Praticien, poursuivez votre progression clinique avec Marinella Spano : supervision de groupe ou individuelle, à Namur ou en visio.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/supervision-accompagnement" },
  openGraph: pageOpenGraph(title, description, "/supervision-accompagnement"),
  twitter: pageTwitter(title, description),
};

const offers = [
  {
    n: "01",
    title: "Groupe « Co-Penser »",
    price: "70 à 90 €",
    unit: "/ mois",
    lead: "4 à 8 praticiens NeuroGenesis réunis régulièrement. Chacun apporte un cas réel : vous pensez ensemble.",
    details: [
      "1×/mois : 70 €/mois",
      "2×/mois : 90 €/mois (si le groupe compte 6 personnes ou plus)",
      "Cadence décidée collectivement",
    ],
    value:
      "Chaque cas équivaut à 140 € de supervision individuelle. En groupe, vous en découvrez 4 à 7 par mois — l'apprentissage est démultiplié.",
    idealFor: [
      "Vous aimez apprendre en collectif",
      "Un budget accessible, pour une valeur élevée",
      "Une communauté durable, qui continue de faire vivre l'Académie",
    ],
    note: "Engagement minimum 6 mois, puis modulable · Groupe minimum 4 personnes",
  },
  {
    n: "02",
    title: "Supervision solo · 1×/mois",
    price: "100 €",
    unit: "/ mois",
    lead: "Une séance mensuelle en tête-à-tête avec Marinella. Votre cas, votre progression.",
    details: ["1 séance par mois", "Format visio, toute l'année"],
    value: "En cabinet, une séance de supervision individuelle vaut 140 € — ici, 100 € (soit 29 % de moins).",
    idealFor: [
      "Vous pratiquez seul(e) et souhaitez un budget modéré",
      "Une relation suivie, en tête-à-tête",
      "Un ancrage clinique progressif",
    ],
    note: "Engagement minimum 6 mois",
  },
  {
    n: "03",
    title: "Supervision solo · 2×/mois",
    price: "150 €",
    unit: "/ mois",
    lead: "Deux séances mensuelles : suivi plus serré, progression accélérée, cas complexes.",
    details: ["2 séances par mois", "Format visio, toute l'année"],
    value: "En cabinet, deux séances valent 280 € (2 × 140 €) — ici, 150 € (soit 46 % de moins).",
    idealFor: [
      "Une pratique clinique dense, des cas complexes",
      "Une progression accélérée vers l'expertise",
      "Un besoin d'ancrage régulier",
    ],
    note: "Engagement minimum 6 mois",
  },
  {
    n: "04",
    title: "Communauté gratuite",
    price: "0 €",
    unit: "",
    lead: "Un groupe WhatsApp permanent réunissant les promotions et les praticiens déjà diplômés : entraide et réseau.",
    details: [],
    value: "",
    idealFor: [
      "Vous êtes autonome dans votre pratique",
      "Le réseau entre pairs vous suffit",
      "Aucun engagement",
    ],
    note: "",
  },
] as const;

const included = [
  "Groupe WhatsApp permanent (promotion en cours et anciens praticiens)",
  "Accès gratuit en cas de réinscription à un futur module",
  "Supervision en visio toute l'année, où que vous soyez",
  "Liberté de changer de formule après les 6 premiers mois, sans frais",
] as const;

const supervisionFaq = [
  {
    question: "Quand dois-je choisir ma formule ?",
    answer:
      "Pas avant la fin du cursus Praticien (11 & 12 septembre 2027 pour le cycle en cours). Deux à trois mois avant la certification, je vous recontacte pour en discuter — vous choisirez avec le recul nécessaire, pas dans l'urgence.",
  },
  {
    question: "Pourquoi le groupe coûte-t-il moins cher que le solo ?",
    answer:
      "En groupe à 70 €/mois, vous découvrez en moyenne 6 cas par mois. En solo à 100 €/mois, vous en travaillez un seul — le vôtre. Chaque cas équivaut à 140 € de supervision individuelle : le groupe n'est pas une option « moins chère », c'est un apprentissage démultiplié pour un tarif accessible.",
  },
  {
    question: "Peut-on arrêter après les 6 mois d'engagement ?",
    answer:
      "Oui. Passé ce minimum de 6 mois, vous pouvez arrêter sans pénalité, réduire la cadence, ou continuer — en toute liberté.",
  },
  {
    question: "Et si le groupe ne compte plus que 3 personnes ?",
    answer:
      "Le format groupe nécessite un minimum de 4 personnes. S'il tombe à 3, les personnes concernées basculent automatiquement vers la supervision solo à 100 €/mois, sans aucun frais de transfert.",
  },
  {
    question: "La supervision continue-t-elle même quand vous êtes en Sardaigne ?",
    answer:
      "Oui — la supervision se fait en visio toute l'année, y compris pendant mes séjours en Sardaigne (de mai à septembre). La continuité est garantie.",
  },
];

export default function SupervisionPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", url: siteConfig.url },
          { name: "Supervision & Accompagnement", url: `${siteConfig.url}/supervision-accompagnement` },
        ])}
      />

      <section className="dark-section pt-[76px]">
        <div className="container-editorial py-section-sm">
          <RevealOnScroll>
            <Link
              href="/"
              aria-label="NeuroGenesis Academy — retour à l'accueil"
              className="reveal-item mb-8 inline-block"
            >
              <Logo variant="gold-on-forest" className="logo-glow h-12 w-auto sm:h-14" />
            </Link>
            <p className="reveal-item text-xs uppercase tracking-wide3 text-gold/80 mb-4">
              Après la certification Praticien
            </p>
            <h1 className="reveal-item font-serif text-hero text-cream max-w-3xl text-balance">
              Supervision &amp; <em className="accent-italic">accompagnement</em> année 1
            </h1>
            <p className="reveal-item mt-6 max-w-xl text-body-lg text-gold/80 leading-relaxed">
              Vous êtes praticien NeuroGenesis. Vous lancez votre cabinet. Je reste à vos côtés.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Les quatre formules */}
      <section className="py-section bg-cream">
        <div className="container-editorial">
          <RevealOnScroll className="max-w-2xl mb-14">
            <p className="reveal-item text-xs uppercase tracking-wide3 text-forest/60 mb-4">Les formules</p>
            <h2 className="reveal-item font-serif text-h1 text-forest text-balance">
              Quatre façons de <em>poursuivre votre progression.</em>
            </h2>
          </RevealOnScroll>

          <RevealOnScroll className="grid gap-8 lg:grid-cols-2">
            {offers.map((o) => (
              <div
                key={o.n}
                className="reveal-item rounded-lg border border-line bg-cream-soft p-8 flex flex-col"
              >
                <span className="font-serif italic text-h3 text-gold-deep leading-none">{o.n}</span>
                <h3 className="font-serif text-h3 text-forest mt-3 mb-2">{o.title}</h3>
                <p className="font-serif text-h2 text-forest leading-none mb-4">
                  {o.price}
                  <span className="text-base font-sans text-ink/50 ml-1">{o.unit}</span>
                </p>
                <p className="text-ink/75 leading-relaxed mb-4">{o.lead}</p>

                {o.details.length > 0 && (
                  <ul className="space-y-1.5 mb-4">
                    {o.details.map((d) => (
                      <li key={d} className="text-sm text-ink/70 flex gap-2">
                        <span className="text-gold-deep" aria-hidden="true">—</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                )}

                {o.value && (
                  <p className="text-sm text-ink/60 italic leading-relaxed mb-4">{o.value}</p>
                )}

                <p className="text-xs uppercase tracking-wide2 text-forest/60 mb-2">Idéal si :</p>
                <ul className="space-y-1.5 mb-4">
                  {o.idealFor.map((d) => (
                    <li key={d} className="text-sm text-ink/70 flex gap-2">
                      <span className="text-gold-deep" aria-hidden="true">—</span>
                      {d}
                    </li>
                  ))}
                </ul>

                {o.note && (
                  <p className="text-xs text-ink/45 mt-auto pt-4 border-t border-line">{o.note}</p>
                )}
              </div>
            ))}
          </RevealOnScroll>
        </div>
      </section>

      {/* Tableau comparatif */}
      <section className="py-section-sm bg-cream-soft">
        <div className="container-editorial">
          <RevealOnScroll className="max-w-2xl mb-10">
            <p className="reveal-item text-xs uppercase tracking-wide3 text-forest/60 mb-4">En un coup d&apos;œil</p>
            <h2 className="reveal-item font-serif text-h2 text-forest text-balance">
              Tableau <em>comparatif.</em>
            </h2>
          </RevealOnScroll>

          <RevealOnScroll>
            <div className="reveal-item overflow-x-auto rounded-lg border border-line">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="bg-forest text-cream">
                    <th className="text-left font-medium px-5 py-4">Formule</th>
                    <th className="text-left font-medium px-5 py-4">Groupe 1×</th>
                    <th className="text-left font-medium px-5 py-4">Groupe 2×</th>
                    <th className="text-left font-medium px-5 py-4">Solo 1×</th>
                    <th className="text-left font-medium px-5 py-4">Solo 2×</th>
                    <th className="text-left font-medium px-5 py-4">Gratuit</th>
                  </tr>
                </thead>
                <tbody className="bg-cream-soft">
                  {[
                    ["Tarif", "70 €/mois", "90 €/mois", "100 €/mois", "150 €/mois", "0 €"],
                    ["Format", "Groupe 4-8", "Groupe 6-8+", "1:1 avec Marinella", "1:1 avec Marinella", "WhatsApp"],
                    ["Vs cabinet (140€/séance)", "-50 % + pairs", "-36 % + pairs", "-29 %", "-46 %", "—"],
                    ["Engagement minimum", "6 mois", "6 mois", "6 mois", "6 mois", "Aucun"],
                  ].map((row) => (
                    <tr key={row[0]} className="border-t border-line">
                      <td className="px-5 py-4 font-medium text-forest">{row[0]}</td>
                      {row.slice(1).map((cell, i) => (
                        <td key={i} className="px-5 py-4 text-ink/75">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Inclus partout */}
      <section className="py-section-sm dark-section">
        <div className="container-editorial">
          <RevealOnScroll className="max-w-2xl mb-10">
            <h2 className="reveal-item font-serif text-h2 text-cream text-balance">
              Inclus dans <em className="accent-italic">toutes les formules.</em>
            </h2>
          </RevealOnScroll>
          <RevealOnScroll className="grid gap-6 sm:grid-cols-2">
            {included.map((item) => (
              <p key={item} className="reveal-item text-gold-soft/85 leading-relaxed flex gap-3">
                <span className="text-gold shrink-0" aria-hidden="true">—</span>
                {item}
              </p>
            ))}
          </RevealOnScroll>
        </div>
      </section>

      {/* FAQ spécifique */}
      <section className="py-section bg-cream">
        <div className="container-editorial max-w-3xl">
          <RevealOnScroll className="mb-10">
            <p className="reveal-item text-xs uppercase tracking-wide3 text-forest/60 mb-4">Questions fréquentes</p>
            <h2 className="reveal-item font-serif text-h2 text-forest text-balance">
              Avant de <em>choisir votre formule.</em>
            </h2>
          </RevealOnScroll>
          <RevealOnScroll>
            <div className="reveal-item">
              <FAQAccordion items={supervisionFaq} />
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* CTA */}
      <section className="py-section-sm dark-section">
        <div className="container-editorial text-center">
          <RevealOnScroll className="max-w-xl mx-auto">
            <p className="reveal-item font-serif italic text-h3 text-cream mb-8 text-balance">
              Des questions avant de vous décider ?
            </p>
            <Button href="/contact" variant="gold" className="reveal-item">
              Réserver une consultation gratuite (30 min)
            </Button>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
