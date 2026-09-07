import type { Metadata } from "next";
import { fontDisplay, fontBody, fontScript } from "@/lib/fonts";
import { siteConfig } from "@/lib/site-config";
import { organizationSchema } from "@/lib/schema";
import JsonLd from "@/components/shared/JsonLd";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StickyMobileCTA from "@/components/layout/StickyMobileCTA";
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Formation Hypnose & Neurosciences à Namur`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "formation hypnose Belgique",
    "hypnothérapeute Namur",
    "formation certifiante hypnose et neurosciences",
    "cursus praticien hypnose",
    "école hypnose Namur",
  ],
  authors: [{ name: siteConfig.founder }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_BE",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Formation Hypnose & Neurosciences à Namur`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Formation Hypnose & Neurosciences à Namur`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr-BE" className={`${fontDisplay.variable} ${fontBody.variable} ${fontScript.variable}`}>
      <body>
        <JsonLd data={organizationSchema()} />
        <SmoothScrollProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <StickyMobileCTA />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
