import type { Metadata } from "next";
import Image from "next/image";
import JsonLd from "@/components/shared/JsonLd";
import RevealOnScroll from "@/components/shared/RevealOnScroll";
import Button from "@/components/ui/Button";
import { personSchema, breadcrumbSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site-config";
import { pageOpenGraph, pageTwitter } from "@/lib/page-metadata";

const title = "Marinella Spano, fondatrice | NeuroGenesis Academy Namur";
const description =
  "Découvrez le parcours de Marinella Spano, hypnothérapeute à Namur : formation ULB, ACHE, spécialisation transgénérationnelle et vision pédagogique de NeuroGenesis Academy.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/fondatrice" },
  openGraph: pageOpenGraph(title, description, "/fondatrice"),
  twitter: pageTwitter(title, description),
};

const parcours = [
  {
    title: "Université Libre de Bruxelles (ULB)",
    detail: "Psychologie de l'enfance et analyse transgénérationnelle.",
  },
  {
    title: "American Council of Hypnotist Examiners (ACHE)",
    detail: "Curriculum complet Technicien & Praticien, aux côtés de Kevin Ramchurn.",
  },
  {
    title: "Spécialisation transgénérationnelle — Toulouse",
    detail: "Deux années de formation approfondie sur les mémoires familiales et systémiques.",
  },
  {
    title: "Libération Quantique",
    detail: "Formée auprès de Tamara Messenger.",
  },
];

export default function FondatricePage() {
  return (
    <>
      <JsonLd data={personSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", url: siteConfig.url },
          { name: "Fondatrice", url: `${siteConfig.url}/fondatrice` },
        ])}
      />

      <section className="dark-section pt-[76px]">
        <div className="container-editorial py-section-sm">
          <RevealOnScroll className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="reveal-item lg:col-span-7">
              <p className="text-xs uppercase tracking-wide3 text-gold/80 mb-4">La fondatrice</p>
              <h1 className="font-serif text-hero text-cream max-w-3xl text-balance">
                Marinella <em className="accent-italic">Spano</em>
              </h1>
              <p className="mt-6 max-w-xl text-body-lg text-cream/75 leading-relaxed">
                Hypnothérapeute et formatrice, fondatrice de l&apos;Académie NeuroGenesis — 30 ans
                d&apos;expertise en accompagnement humain, au service d&apos;une pédagogie exigeante
                et chaleureuse.
              </p>
            </div>
            <div className="reveal-item lg:col-span-5">
              <div className="relative aspect-[4/5] max-w-sm mx-auto lg:max-w-none overflow-hidden rounded-lg border border-gold/25 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.5)]">
                <Image
                  src="/images/marinella-spano.webp"
                  alt="Portrait de Marinella Spano, hypnothérapeute et fondatrice de NeuroGenesis Academy, souriante"
                  fill
                  sizes="(max-width: 1024px) 384px, 420px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="py-section bg-cream">
        <div className="container-editorial">
          <RevealOnScroll className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <blockquote className="reveal-item border-l-2 border-gold-deep pl-8 mb-14">
                <p className="font-serif italic text-h2 text-forest leading-snug text-balance">
                  « On apprend mieux ce qu&apos;on apprend avec plaisir. »
                </p>
              </blockquote>

              <div className="reveal-item space-y-6 text-ink/75 leading-relaxed max-w-2xl">
                <p>
                  Marinella Spano exerce une pratique clinique active en cabinet, aux côtés de son
                  activité de formatrice. C&apos;est cette double expérience — praticienne au
                  contact quotidien de ses patients, et pédagogue passionnée par la transmission —
                  qui a donné naissance à NeuroGenesis Academy : une école pensée pour que
                  l&apos;hypnose et les neurosciences se pratiquent avec autant de rigueur que de
                  bienveillance.
                </p>
                <p>
                  Sa conviction est simple : les sujets les plus exigeants — neurosciences,
                  psychopathologie, mémoire du trauma — ne perdent rien de leur sérieux à être
                  enseignés avec vivacité et engagement. Chaque module de NeuroGenesis Academy est
                  construit pour que la théorie se déploie dans un climat de curiosité, jamais
                  d&apos;austérité, avant de se traduire en pratique supervisée jusqu&apos;à la
                  pleine maîtrise du geste.
                </p>
                <p>
                  NeuroGenesis Academy mène aujourd&apos;hui une démarche pionnière et rigoureuse
                  de structuration de sa reconnaissance officielle en Belgique, menée en parallèle
                  d&apos;une démarche d&apos;accréditation internationale engagée auprès de
                  références du secteur — l&apos;Organisation mondiale de la santé (classification
                  CIM-11), la NGH (National Guild of Hypnotists) et la FBPH. Cette double exigence
                  reflète une conviction : bâtir une certification solide plutôt que d&apos;en
                  afficher une de façade.
                </p>
              </div>

              <div className="reveal-item mt-10">
                <Button href="/contact" variant="forest-outline">
                  Échanger avec l&apos;équipe
                </Button>
              </div>
            </div>

            <aside className="lg:col-span-4 lg:col-start-9">
              <div className="reveal-item rounded-lg border border-line bg-cream-soft p-8">
                <p className="text-xs uppercase tracking-wide3 text-forest/60 mb-5">Parcours académique</p>
                <ul className="space-y-6">
                  {parcours.map((p) => (
                    <li key={p.title}>
                      <p className="font-serif text-lg text-forest leading-snug">{p.title}</p>
                      <p className="text-sm text-ink/60 mt-1">{p.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </RevealOnScroll>
        </div>
      </section>

      <section className="py-section-sm dark-section">
        <div className="container-editorial text-center">
          <RevealOnScroll className="max-w-xl mx-auto">
            <p className="reveal-item font-serif italic text-h3 text-cream mb-8 text-balance">
              Rejoignez une formation portée par l&apos;expérience et la rigueur.
            </p>
            <Button href="/formation-technicien" variant="gold" className="reveal-item">
              Découvrir le cursus Technicien
            </Button>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
