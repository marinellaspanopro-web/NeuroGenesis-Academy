import { siteConfig } from "@/lib/site-config";

/**
 * Générateurs de schema.org (JSON-LD). Types actifs uniquement (voir
 * docs/SEO-STRATEGY.md) : EducationalOrganization+LocalBusiness, Course,
 * Person, FAQPage (conservé pour l'IA générative, sans attente de rich
 * snippet Google depuis mai 2026), BreadcrumbList.
 */

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo/logo-forest.svg`,
    image: `${siteConfig.url}/logo/logo-forest.svg`,
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.streetAddress,
      addressLocality: siteConfig.address.addressLocality,
      addressRegion: siteConfig.address.addressRegion,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    founder: {
      "@type": "Person",
      name: siteConfig.founder,
    },
    sameAs: [siteConfig.social.facebook, siteConfig.social.instagram, siteConfig.social.linkedin],
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Namur, Belgique",
    },
  };
}

export function courseSchema(course: {
  name: string;
  description: string;
  url: string;
  price: number;
  duration: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: course.description,
    url: course.url,
    provider: {
      "@type": "EducationalOrganization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      sameAs: siteConfig.url,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Onsite",
      courseWorkload: course.duration,
      location: {
        "@type": "Place",
        name: "NeuroGenesis Academy",
        address: {
          "@type": "PostalAddress",
          addressLocality: siteConfig.address.addressLocality,
          addressCountry: siteConfig.address.addressCountry,
        },
      },
    },
    offers: {
      "@type": "Offer",
      price: course.price,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: course.url,
    },
  };
}

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.url}/fondatrice#person`,
    name: siteConfig.founder,
    jobTitle: "Hypnothérapeute & formatrice, fondatrice de NeuroGenesis Academy",
    worksFor: {
      "@type": "EducationalOrganization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
    },
    url: `${siteConfig.url}/fondatrice`,
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Université Libre de Bruxelles (ULB)" },
      { "@type": "EducationalOrganization", name: "American Council of Hypnotist Examiners (ACHE)" },
    ],
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
