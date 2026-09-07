import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
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
    "École de formation certifiante en hypnose et neurosciences à Namur. Cursus Technicien et Praticien fondés par Marinella Spano. Prochain cycle : octobre 2026.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
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
