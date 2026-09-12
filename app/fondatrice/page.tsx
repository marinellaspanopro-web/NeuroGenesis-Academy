import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/shared/JsonLd";
import RevealOnScroll from "@/components/shared/RevealOnScroll";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import { personSchema, breadcrumbSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site-config";
import { pageOpenGraph, pageTwitter } from "@/lib/page-metadata";

const title = "Marinella Spano, fondatrice | NeuroGenesis Academy Namur";
const description =
  "Le parcours de Marinella Spano, fondatrice de NeuroGenesis Academy à Namur : 30 ans de relation clientèle, une vie d'étude de l'humain, et une preuve vécue de la neuroplasticité du cerveau.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/fondatrice" },
  openGraph: pageOpenGraph(title, description, "/fondatrice"),
  twitter: pageTwitter(title, description),
};

const cheminement = [
  "Plus de 30 ans consacrés à l'étude des mécanismes du cerveau et de la psychologie",
  "La psycho-morphologie pratiquée depuis l'âge de 14 ans — lire le non-verbal, comprendre sans juger",
  "Deux années de formation en transgénérationnel à Toulouse",
  "15 ans de pratique de l'hypnose, au service de ses clients",
  "Plus de 25 ans de soins énergétiques",
  "30 ans de relation clientèle — l'écoute comme métier",
] as const;

const specialites = [
  {
    n: "01",
    title: "Burn-out",
    text: "Depuis de nombreuses années, elle collabore avec des médecins spécialisés en burn-out. Elle intervient là où le suivi médical et le coaching professionnel seuls ne suffisent plus — pour reprendre les mots de l'un d'eux, pour « retirer le caillou dans la chaussure » qui empêche d'avancer.",
  },
  {
    n: "02",
    title: "Traumatismes",
    text: "Son travail de fin d'études en hypnose portait déjà sur les traumatismes. Elle y a construit un conte hypnotique, aujourd'hui en attente de publication.",
  },
  {
    n: "03",
    title: "Transgénérationnel",
    text: "Formée deux années durant à Toulouse, elle a approfondi cette matière jusqu'à en faire le sujet de son premier livre.",
  },
] as const;

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
              <Link href="/" aria-label="NeuroGenesis Academy — retour à l'accueil" className="mb-8 inline-block">
                <Logo variant="gold-on-forest" className="logo-glow h-12 w-auto sm:h-14" />
              </Link>
              <p className="text-xs uppercase tracking-wide3 text-gold/80 mb-4">
                La fondatrice
              </p>
              <h1 className="font-serif text-hero text-cream max-w-3xl text-balance">
                Marinella <em className="accent-italic">Spano</em>
              </h1>
              <p className="mt-6 max-w-xl font-serif italic text-h3 text-gold leading-snug text-balance">
                « Je n&apos;enseigne pas la reprogrammation. Je l&apos;ai vécue. »
              </p>
            </div>
            <div className="reveal-item lg:col-span-5">
              <div className="relative aspect-[4/5] max-w-sm mx-auto lg:max-w-none overflow-hidden rounded-lg border border-gold/25 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.5)]">
                <Image
                  src="/images/marinella-spano.webp"
                  alt="Portrait de Marinella Spano, fondatrice de NeuroGenesis Academy, souriante"
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
            <div className="lg:col-span-7 space-y-14">
              <div className="reveal-item">
                <h2 className="font-serif text-h2 text-forest mb-5 text-balance">
                  Une vie consacrée à <em>l&apos;humain.</em>
                </h2>
                <div className="space-y-5 text-ink/75 leading-relaxed max-w-2xl">
                  <p>
                    Pendant trente ans, Marinella a exercé dans le monde bancaire, au plus près de
                    la relation clientèle. Trente années à écouter, comprendre et accompagner des
                    personnes dans les moments décisifs de leur vie — leurs projets, leurs doutes,
                    leurs recommencements.
                  </p>
                  <p>
                    Mais la banque n&apos;était pas une fin : c&apos;était un laboratoire
                    d&apos;observation de l&apos;humain. En parallèle, année après année, Marinella
                    s&apos;est formée aux disciplines qui explorent les relations humaines et le
                    développement personnel, construisant patiemment une expertise rare : celle qui
                    relie la rigueur du monde professionnel à la profondeur de
                    l&apos;accompagnement.
                  </p>
                </div>
              </div>

              <div className="reveal-item">
                <h2 className="font-serif text-h2 text-forest mb-5 text-balance">
                  L&apos;épreuve qui a tout <em>fondé.</em>
                </h2>
                <div className="space-y-5 text-ink/75 leading-relaxed max-w-2xl">
                  <p>
                    Un jour, une salmonelle mal diagnostiquée lui a fait perdre la mémoire.
                  </p>
                  <p>
                    Là où certains s&apos;effondrent, Marinella a observé. Jour après jour, elle a
                    senti son cerveau créer de nouvelles connexions, contourner, reconstruire,
                    réapprendre. Bien avant que les neurosciences ne théorisent la neuroplasticité,
                    elle en était la preuve vivante.
                  </p>
                  <p>
                    Cette épreuve est devenue une évidence : nous ne sommes pas figés. Nos pensées
                    se reprogramment. Nos vies se transforment. C&apos;est de cette certitude —
                    vécue, pas lue — qu&apos;est née NeuroGenesis.
                  </p>
                </div>
              </div>

              <div className="reveal-item">
                <Button href="/contact" variant="forest-outline">
                  Nous contacter
                </Button>
              </div>
            </div>

            <aside className="lg:col-span-4 lg:col-start-9">
              <div className="reveal-item rounded-lg border border-line bg-cream-soft p-8">
                <p className="text-xs uppercase tracking-wide3 text-forest/60 mb-8">
                  Quarante ans de cheminement
                </p>
                <ul className="relative border-l-2 border-gold-deep/40 space-y-8 pl-6">
                  {cheminement.map((item) => (
                    <li key={item} className="relative">
                      <span
                        className="absolute -left-[27px] top-1 h-2.5 w-2.5 rounded-full bg-gold-deep"
                        aria-hidden="true"
                      />
                      <p className="text-sm text-ink/75 leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </RevealOnScroll>
        </div>
      </section>

      <section className="py-section-sm bg-cream-soft">
        <div className="container-editorial">
          <RevealOnScroll className="max-w-2xl mb-14">
            <p className="reveal-item text-xs uppercase tracking-wide3 text-forest/60 mb-4">
              Ses spécialités
            </p>
            <h2 className="reveal-item font-serif text-h2 text-forest text-balance">
              Trois terrains qu&apos;elle connaît <em>de l&apos;intérieur.</em>
            </h2>
          </RevealOnScroll>

          <RevealOnScroll className="grid gap-10 lg:grid-cols-3">
            {specialites.map((s) => (
              <div key={s.n} className="reveal-item">
                <span className="font-serif italic text-h2 text-gold-deep leading-none">
                  {s.n}
                </span>
                <h3 className="font-serif text-h3 text-forest mt-4 mb-3">{s.title}</h3>
                <p className="text-ink/70 text-sm leading-relaxed">{s.text}</p>
              </div>
            ))}
          </RevealOnScroll>
        </div>
      </section>

      <section className="py-section bg-cream">
        <div className="container-editorial">
          <RevealOnScroll className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="reveal-item lg:col-span-4">
              <div className="relative aspect-[2/3] max-w-xs mx-auto lg:max-w-none overflow-hidden rounded-lg border border-line shadow-[0_24px_60px_-24px_rgba(0,0,0,0.35)]">
                <Image
                  src="/images/livre-fr.webp"
                  alt="Couverture du livre « Quand mon petit-enfant réveille mon histoire » de Marinella Spano"
                  fill
                  sizes="(max-width: 1024px) 320px, 360px"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="reveal-item lg:col-span-8">
              <p className="text-xs uppercase tracking-wide3 text-forest/60 mb-4">Son premier livre</p>
              <h2 className="font-serif text-h2 text-forest mb-5 text-balance">
                « Quand mon petit-enfant <em>réveille mon histoire.</em> »
              </h2>
              <div className="space-y-5 text-ink/75 leading-relaxed max-w-2xl">
                <p>
                  Au-delà du rôle de grand-mère, Marinella y explore les émotions, la place dans la
                  lignée et la dynamique des relations transgénérationnelles — enrichies de son
                  expérience et d&apos;exercices pratiques pour mieux vivre cette étape.
                </p>
                <p>
                  Volontairement accessible plutôt qu&apos;académique, cet ouvrage est aussi une
                  aide pour toute mère ou toute fille désireuse de mieux comprendre ce qui se joue
                  dans les relations familiales — bien au-delà du seul rôle de grand-mère.
                  Disponible également en italien.
                </p>
              </div>

              <div className="reveal-item mt-8 flex flex-wrap gap-4">
                <Button href="https://amzn.eu/d/0aUzYQ0z" variant="gold">
                  Voir sur Amazon (FR)
                </Button>
                <Button href="https://amzn.eu/d/05NKBTZN" variant="forest-outline">
                  Vedi su Amazon (IT)
                </Button>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="py-section dark-section">
        <div className="container-editorial">
          <RevealOnScroll className="max-w-2xl mx-auto text-center">
            <p className="reveal-item text-xs uppercase tracking-wide3 text-gold/80 mb-6">
              Pourquoi NeuroGenesis ?
            </p>
            <blockquote>
              <p className="reveal-item font-serif italic text-h3 text-cream leading-snug text-balance">
                « Après tant d&apos;années à me former et à accompagner, je voulais transmettre —
                pas seulement des techniques, mais une posture. Chez NeuroGenesis, on apprend
                l&apos;hypnose avec la rigueur des neurosciences et la chaleur de la bienveillance.
                Parce qu&apos;on ne peut pas transformer les autres si l&apos;on n&apos;a pas
                d&apos;abord été transformé, et accueilli, soi-même. »
              </p>
              <footer className="reveal-item mt-6 text-sm text-gold-soft/80">
                Marinella Spano — Fondatrice, Académie NeuroGenesis, Namur
              </footer>
            </blockquote>

            <div className="reveal-item mt-12">
              <Button href="/formation-technicien" variant="gold">
                Découvrir le cursus Technicien — prochain cycle le 31 octobre 2026
              </Button>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
