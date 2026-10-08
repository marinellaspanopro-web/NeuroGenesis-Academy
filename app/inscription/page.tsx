import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/shared/ContactForm";
import Logo from "@/components/ui/Logo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Demande de réservation — NeuroGenesis Academy",
  description: "Effectuez votre demande de réservation pour un cursus en hypnose et neurosciences à Namur. Un entretien individuel précède la confirmation de l'inscription.",
  alternates: { canonical: "/inscription" },
};

type Pathway = "technicien" | "pack" | "praticien" | "a_determiner" | "autre";

export default async function InscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ parcours?: string }>;
}) {
  const { parcours } = await searchParams;
  const choices: Pathway[] = ["technicien", "pack", "praticien", "a_determiner", "autre"];
  const initialInterest = choices.find((choice) => choice === parcours);

  return (
    <>
      <section className="dark-section pt-[76px]">
        <div className="container-editorial py-section-sm">
          <Link href="/" aria-label="NeuroGenesis Academy — retour à l'accueil" className="mb-8 inline-block">
            <Logo variant="gold-on-forest" className="h-12 w-auto sm:h-14" />
          </Link>
          <p className="text-xs uppercase tracking-wide3 text-gold/80 mb-4">Cycle de formation</p>
          <h1 className="font-serif text-hero text-cream max-w-2xl">Réserver ma place</h1>
          <p className="mt-5 max-w-2xl text-body-lg text-gold/75">
            Votre demande de réservation sera suivie d'un échange individuel pour préciser votre parcours et les modalités d'inscription.
          </p>
        </div>
      </section>
      <section className="py-section bg-cream">
        <div className="container-editorial grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ContactForm mode="inscription" initialInterest={initialInterest} />
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="rounded-lg border border-line bg-cream-soft p-8">
              <p className="text-xs uppercase tracking-wide3 text-forest/60 mb-5">Échanger avec moi</p>
              <p className="text-ink/75 mb-4">Un entretien personnel permet de faire connaissance et de choisir les modalités adaptées à votre projet.</p>
              <p className="text-ink/75"><a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="font-medium hover:text-forest">{siteConfig.phoneDisplay}</a></p>
              <p className="text-ink/75 mt-2"><a href={`mailto:${siteConfig.email}`} className="hover:text-forest">{siteConfig.email}</a></p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
