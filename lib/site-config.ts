// Source unique de vérité pour les données NAP (Name, Address, Phone) et les
// informations réutilisées dans les métadonnées, le schema.org et le footer.
// Toute modification (adresse, téléphone, dates de session) se fait ici.

export const siteConfig = {
  name: "NeuroGenesis Academy",
  legalName: "Marinella Spano",
  enterpriseNumber: "0806.895.092",
  founder: "Marinella Spano",
  url: "https://neurogenesis.be",
  description:
    "École de formation en hypnose & neurosciences à Namur. Cursus Technicien et Praticien, fondé par Marinella Spano.",
  email: "info@neurogenesis.be",
  phone: "+32 491 73 09 99",
  phoneDisplay: "+32 491 73 09 99",
  address: {
    streetAddress: "Allée St Vincent 21",
    addressLocality: "Jambes",
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
  accreditation: "Engagée dans une démarche d'accréditation internationale (NGH, FBPH).",
  traumaApproach: "Exploration des approches d'accompagnement des traumatismes par l'hypnose, intégrant notamment des techniques de stimulation bilatérale inspirées de l'EMDR, dans un cadre respectueux des compétences et des limites du praticien.",
  session: {
    timeZone: "Europe/Brussels",
    beforeBadge: "Prochain cycle Technicien · 31 octobre & 1er novembre 2026 · Namur",
    afterBadge: "Cycle d'octobre 2026 en cours · Inscriptions ouvertes pour le prochain cycle",
    afterMessage: "Le cycle d'octobre a débuté avec son groupe. Réservez dès maintenant votre place pour le prochain cycle.",
    nextLabel: "Prochain cycle (liste prioritaire)",
    nextMessage: "Votre demande concerne le prochain cycle Technicien. Les dates et les modalités seront précisées lors de notre échange individuel.",
    nextHref: "/inscription?parcours=prochain-cycle",
    label: "Cycle Technicien · Octobre 2026",
    startDate: "2026-10-31",
    startDateDisplay: "31 octobre & 1er novembre 2026",
    isoDeadline: "2026-10-31T09:00:00+01:00",
    city: "Namur",
    groupSize: "6 à 8 personnes maximum",
  },
  pricing: {
    technicien: {
      amount: 1899,
      currency: "EUR",
    },
    praticien: { amount: 2750, currency: "EUR" },
    pack: {
      // Cursus Technicien + Praticien réunis.
      regularTotal: 4649, // 1899 + 2750, prix des deux cursus pris séparément
      packPrice: 4149,
    },
  },
} as const;

// Calendrier des week-ends de formation — une ligne par session (2 jours).
// Source : agenda officiel NGT / NGP (confirmé par la fondatrice).
export const technicienDates = [
  "31 octobre & 1er novembre 2026",
  "14 & 15 novembre 2026",
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
