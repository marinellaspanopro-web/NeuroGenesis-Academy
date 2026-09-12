import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: { absolute: `Mentions légales — ${siteConfig.name}` },
  description: "Mentions légales de NeuroGenesis Academy, école de formation en hypnose et neurosciences à Namur.",
  alternates: { canonical: "/mentions-legales" },
  robots: { index: false, follow: true },
};

export default function MentionsLegalesPage() {
  return (
    <>
      {/* Bande sombre sous la hauteur du header : le header transparent utilise la
          variante or/crème du logo sur toutes les pages, il lui faut un fond sombre
          derrière lui même sur cette page sans hero. */}
      <div className="dark-section h-[76px]" aria-hidden="true" />
      <section className="py-section bg-cream">
      <div className="container-editorial max-w-2xl">
        <h1 className="font-serif text-h1 text-forest mb-10">Mentions légales</h1>

        <div className="space-y-8 text-ink/75 leading-relaxed">
          <div>
            <h2 className="font-serif text-h3 text-forest mb-3">Éditeur du site</h2>
            <p>
              {siteConfig.legalName} — {siteConfig.founder}
              <br />
              {siteConfig.address.streetAddress}, {siteConfig.address.addressLocality}, Belgique
              <br />
              Email : {siteConfig.email}
              <br />
              Téléphone : {siteConfig.phoneDisplay}
            </p>
          </div>

          <div>
            <h2 className="font-serif text-h3 text-forest mb-3">Hébergement</h2>
            <p>Ce site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.</p>
          </div>

          <div>
            <h2 className="font-serif text-h3 text-forest mb-3">Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble des contenus présents sur ce site (textes, logo, mise en page) est la
              propriété de {siteConfig.legalName}, sauf mention contraire. Toute reproduction sans
              autorisation est interdite.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-h3 text-forest mb-3">Protection des données</h2>
            <p>
              Les informations transmises via le formulaire de contact sont utilisées uniquement
              pour répondre à votre demande et ne sont ni cédées ni vendues à des tiers. Vous
              pouvez demander leur suppression à tout moment en écrivant à {siteConfig.email}.
            </p>
          </div>

          <div id="cookies">
            <h2 className="font-serif text-h3 text-forest mb-3">Cookies</h2>
            <p>
              Ce site utilise un cookie de mesure publicitaire (Google Ads) qui permet de savoir
              si une visite fait suite au clic sur l&apos;une de nos annonces, afin d&apos;évaluer
              leur pertinence. Ce cookie n&apos;est déposé qu&apos;après votre accord, donné via le
              bandeau affiché lors de votre première visite. Vous pouvez à tout moment revenir sur
              votre choix en effaçant les cookies de ce site dans les réglages de votre navigateur
              — le bandeau vous sera alors proposé à nouveau.
            </p>
          </div>
        </div>
      </div>
      </section>
    </>
  );
}
