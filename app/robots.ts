import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

// Aucun blocage de crawler IA : la visibilité de la marque dans les réponses
// des moteurs conversationnels (ChatGPT, Perplexity, etc.) sert le
// positionnement de NeuroGenesis Academy, cf. docs/SEO-STRATEGY.md.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
