import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

/**
 * OpenGraph/Twitter partagés par page — le visuel (og:image) vient de
 * app/opengraph-image.tsx et s'applique automatiquement à toutes les routes ;
 * seuls le titre et la description varient ici pour un partage social fidèle
 * à chaque page (au lieu de retomber sur ceux de la home).
 */
export function pageOpenGraph(title: string, description: string, path: string): Metadata["openGraph"] {
  return {
    type: "website",
    locale: "fr_BE",
    url: `${siteConfig.url}${path}`,
    siteName: siteConfig.name,
    title,
    description,
  };
}

export function pageTwitter(title: string, description: string): Metadata["twitter"] {
  return {
    card: "summary_large_image",
    title,
    description,
  };
}
