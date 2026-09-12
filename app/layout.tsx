import type { Metadata } from "next";
import Script from "next/script";
import { fontDisplay, fontBody, fontScript } from "@/lib/fonts";
import { siteConfig } from "@/lib/site-config";
import { organizationSchema } from "@/lib/schema";
import { GOOGLE_ADS_ID } from "@/lib/gtag";
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
        {/* Balise Google Ads — suivi des conversions pour la campagne "Formation hypnose octobre 2026". */}
        <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`} />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            // Mode Consentement : mesure désactivée par défaut tant que le visiteur
            // n'a pas donné son accord (à mettre à jour depuis un bandeau cookies).
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied'
            });
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ADS_ID}');
          `}
        </Script>
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
