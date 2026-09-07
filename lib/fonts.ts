import { Fraunces, Inter, Alex_Brush } from "next/font/google";

// Fraunces — serif éditoriale chaleureuse, axe italique marqué : porte
// le ton "rigueur scientifique + chaleur humaine" du positionnement.
export const fontDisplay = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

// Inter — sans-serif humaniste, très lisible pour le corps de texte
// et les interfaces (formulaire, navigation).
export const fontBody = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

// Alex Brush — script signature utilisé uniquement dans le logotype ("Neuro"),
// fidèle à la calligraphie de la marque. Jamais utilisé pour du texte courant.
export const fontScript = Alex_Brush({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
  display: "swap",
});
