import JsonLd from "@/components/shared/JsonLd";
import { courseSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site-config";
import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import ScrollingBanner from "@/components/home/ScrollingBanner";
import Pillars from "@/components/home/Pillars";
import FounderTeaser from "@/components/home/FounderTeaser";
import CursusOverview from "@/components/home/CursusOverview";
import PackOffer from "@/components/home/PackOffer";
import CampaignBanner from "@/components/home/CampaignBanner";
import FaqTeaser from "@/components/home/FaqTeaser";
import ContactCta from "@/components/home/ContactCta";

export const metadata: Metadata = {
  title: {
    absolute: "Formation Hypnose & Neurosciences à Namur | NeuroGenesis",
  },
  description:
    "École de formation en hypnose et neurosciences à Namur. Cursus Technicien et Praticien fondés par Marinella Spano. Formation en petits groupes.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={courseSchema({
        name: "Pack Technicien + Praticien",
        description: "Les deux cursus en hypnose et neurosciences à Namur, avec 500€ d’économie sur les cursus séparés.",
        url: `${siteConfig.url}/#pack`,
        price: siteConfig.pricing.pack.packPrice,
        duration: "PT315H",
      })} />
      <Hero />
      <ScrollingBanner />
      <Pillars />
      <FounderTeaser />
      <CursusOverview />
      <PackOffer />
      <CampaignBanner />
      <FaqTeaser />
      <ContactCta />
    </>
  );
}
