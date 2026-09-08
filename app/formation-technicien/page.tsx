import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/shared/JsonLd";
import RevealOnScroll from "@/components/shared/RevealOnScroll";
import BrochureRequestForm from "@/components/shared/BrochureRequestForm";
import Button from "@/components/ui/Button";
import { courseSchema, breadcrumbSchema } from "@/lib/schema";
import { siteConfig, technicienDates } from "@/lib/site-config";
import { technicienModules, technicienBenefits } from "@/lib/cursus-data";
import { pageOpenGraph, pageTwitter } from "@/lib/page-metadata";

const title = "Formation Certifiante Hypnose & Neurosciences | NeuroGenesis";
const description =
  "Cursus Technicien en hypnose et neurosciences à Namur : 115h, 45h de pratique supervisée, groupe de 6 à 8 personnes. Prochain cycle dès le 10 & 11 octobre 2026.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/formation-technicien" },
  openGraph: pageOpenGraph(title, description, "/formation-technicien"),
  twitter: pageTwitter(title, description),
};

const stats = [
  { value: "115h", label: "Formation totale" },
  { value: "70h", label: "En présentiel" },
  { value: "45h", label: "Pratique supervisée" },
];

export default function FormationTechnicienPage() {
  return (
    <>
      <JsonLd
        data={courseSchema({
          name: "Cursus Technicien en hypnose & neurosciences",
          description,
          url: `${siteConfig.url}/formation-technicien`,
          price: siteConfig.pricing.technicien.amount,
          duration: "115 heures, dont 45 heures de pratique supervisée",
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", url: siteConfig.url },
          { name: "Cursus Technicien", url: `${siteConfig.url}/formation-technicien` },
        ])}
      />

      <section className="dark-section pt-[76px]">
        <div className="container-editorial py-section-sm">
          <RevealOnScroll>
            <p className="reveal-item text-xs uppercase tracking-wide3 text-gold/80 mb-4">
              Cursus Technicien · {siteConfig.session.startDateDisplay}
            </p>
            <h1 className="reveal-item font-serif text-hero text-cream max-w-3xl text-balance">
              Poser les fondations de votre <em className="accent-italic">pratique.</em>
            </h1>
            <p className="reveal-item mt-6 max-w-xl text-body-lg text-gold/75 leading-relaxed">
              5 week-ends (10 jours) à {siteConfig.address.addressLocality}, ateliers pratiques
              supervisés, et un groupe volontairement restreint pour un accompagnement réel.
            </p>

            <div className="reveal-item mt-12 flex flex-wrap gap-x-12 gap-y-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <span className="block font-serif text-h2 text-gold">{s.value}</span>
                  <span className="text-sm text-gold/60">{s.label}</span>
                </div>
              ))}
            </div>

            <div className="reveal-item mt-10">
              <Button href="/contact" variant="gold" size="lg">
                Réserver ma place — Octobre 2026
              </Button>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Modules — liste éditoriale, pas une grille de cartes identiques */}
      <section className="py-section bg-cream">
        <div className="container-editorial">
          <RevealOnScroll className="max-w-2xl mb-14">
            <p className="reveal-item text-xs uppercase tracking-wide3 text-forest/60 mb-4">Le programme</p>
            <h2 className="reveal-item font-serif text-h1 text-forest text-balance">
              Cinq modules, <em>une progression continue.</em>
            </h2>
          </RevealOnScroll>

          <div className="border-t border-line">
            {technicienModules.map((m, i) => (
              <RevealOnScroll
                key={m.n}
                as="div"
                className={`border-b border-line py-10 grid gap-6 lg:grid-cols-12 lg:items-start ${
                  i % 2 === 1 ? "lg:pl-16" : ""
                }`}
              >
                <div className="reveal-item lg:col-span-2">
                  <span className="font-serif italic text-h2 text-gold-deep">{m.n}</span>
                </div>
                <div className="reveal-item lg:col-span-10">
                  <h3 className="font-serif text-h3 text-forest mb-4">{m.title}</h3>
                  <ul className="grid gap-2 sm:grid-cols-2 max-w-2xl">
                    {m.points.map((pt) => (
                      <li key={pt} className="text-ink/70 text-sm leading-relaxed flex gap-2">
                        <span className="text-gold-deep" aria-hidden="true">
                          —
                        </span>
                        {pt}
                      </li>
                    ))}
                  </ul>
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
              Cinq week-ends, <em>d&apos;octobre 2026 à février 2027.</em>
            </h2>
          </RevealOnScroll>

          <RevealOnScroll className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-5">
            {technicienDates.map((date, i) => (
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

      {/* Bénéfices — bloc signature vert forêt, rythme le fond clair */}
      <section className="dark-section py-section-sm">
        <div className="container-editorial">
          <RevealOnScroll className="grid gap-10 lg:grid-cols-4">
            {technicienBenefits.map((b) => (
              <div key={b.title} className="reveal-item">
                <p className="font-serif italic text-h3 text-gold mb-3">{b.title}</p>
                <p className="text-gold/70 text-sm leading-relaxed">{b.text}</p>
              </div>
            ))}
          </RevealOnScroll>
        </div>
      </section>

      {/* Tarif & CTA final */}
      <section className="py-section bg-cream">
        <div className="container-editorial">
          <RevealOnScroll className="rounded-lg border border-line bg-cream-soft p-10 sm:p-16 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="reveal-item">
              <p className="text-xs uppercase tracking-wide3 text-forest/60 mb-4">Investissement</p>
              <p className="font-serif text-hero text-forest leading-none">
                {siteConfig.pricing.technicien.amount}€
              </p>
              <p className="mt-3 text-ink/60 max-w-sm">
                Paiement en plusieurs fois sans frais. Groupe limité à{" "}
                {siteConfig.session.groupSize.toLowerCase()}.
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
              <Button href="/formation-praticien" variant="forest-outline" size="lg">
                Voir le cursus Praticien
              </Button>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Demande de brochure — capture email, envoi PDF + relance automatique */}
      <section className="dark-section py-section-sm">
        <div className="container-editorial">
          <RevealOnScroll className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <p className="reveal-item text-xs uppercase tracking-wide3 text-gold/80 mb-3">
                Pour emporter avec vous
              </p>
              <h2 className="reveal-item font-serif text-h2 text-cream text-balance">
                Recevez la brochure <em className="accent-italic">complète</em> par email.
              </h2>
              <p className="reveal-item mt-4 text-gold/70 leading-relaxed max-w-sm">
                Programme, dates et tarifs des deux cursus, à consulter ou partager quand vous
                le souhaitez.
              </p>
            </div>
            <div className="reveal-item lg:col-span-7">
              <BrochureRequestForm interest="technicien" variant="dark" />
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
