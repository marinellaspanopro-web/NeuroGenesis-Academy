// Source unique de vérité pour les données NAP (Name, Address, Phone) et les
// informations réutilisées dans les métadonnées, le schema.org et le footer.
// Toute modification (adresse, téléphone, dates de session) se fait ici.

export const siteConfig = {
  name: "NeuroGenesis Academy",
  legalName: "NeuroGenesis Academy",
  founder: "Marinella Spano",
  url: "https://neurogenesis.be",
  description:
    "École de formation en hypnose & neurosciences à Namur. Cursus certifiant Technicien et Praticien, fondé par Marinella Spano.",
  email: "info@neurogenesis.be",
  phone: "+32 491 73 09 99",
  phoneDisplay: "+32 491 73 09 99",
  address: {
    streetAddress: "Jambes",
    addressLocality: "Namur",
    addressRegion: "Namur",
    postalCode: "5100",
    addressCountry: "BE",
  },
  geo: {
    latitude: 50.4547,
    longitude: 4.8676,
  },
  social: {
    facebook: "https://www.facebook.com/neurogenesisacademy",
    instagram: "https://www.instagram.com/neurogenesisacademy",
    linkedin: "https://www.linkedin.com/company/neurogenesis-academy",
  },
  session: {
    label: "Cycle Technicien · Octobre 2026",
    startDate: "2026-10-10",
    startDateDisplay: "10 & 11 octobre 2026",
    isoDeadline: "2026-10-10T09:00:00+02:00",
    city: "Namur",
    groupSize: "6 à 8 personnes maximum",
  },
  pricing: {
    technicien: { amount: 1899, currency: "EUR" },
    praticien: { amount: 2750, currency: "EUR" },
    pack: {
      // Cursus Technicien + Praticien réunis.
      regularTotal: 4649, // 1899 + 2750, prix des deux cursus pris séparément
      packPrice: 4149,
      earlyBirdPrice: 3899,
      earlyBirdDeadline: "2026-09-20",
      earlyBirdDeadlineDisplay: "20 septembre 2026",
    },
  },
} as const;

// Calendrier des week-ends de formation — une ligne par session (2 jours).
// Source : agenda officiel NGT / NGP (confirmé par la fondatrice).
export const technicienDates = [
  "10 & 11 octobre 2026",
  "7 & 8 novembre 2026",
  "28 & 29 novembre 2026",
  "9 & 10 janvier 2027",
  "6 & 7 février 2027",
] as const;

export const praticienDates = [
  "13 & 14 mars 2027",
  "10 & 11 avril 2027",
  "1er & 2 mai 2027",
  "26 & 27 juin 2027",
  "31 juillet & 1er août 2027",
  "7 & 8 août 2027",
  "21 & 22 août 2027",
  "11 & 12 septembre 2027",
] as const;

export const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/#valeurs", label: "Nos valeurs" },
  { href: "/formation-technicien", label: "Cursus Technicien" },
  { href: "/formation-praticien", label: "Cursus Praticien" },
  { href: "/supervision-accompagnement", label: "Supervision" },
  { href: "/fondatrice", label: "Fondatrice" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;
