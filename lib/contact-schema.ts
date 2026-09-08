import { z } from "zod";

/** Schéma de validation partagé entre le formulaire client et l'API route. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Merci d'indiquer votre nom complet."),
  email: z.string().trim().email("Merci d'indiquer une adresse email valide."),
  phone: z
    .string()
    .trim()
    .min(6, "Merci d'indiquer un numéro de téléphone valide.")
    .optional()
    .or(z.literal("")),
  interest: z.enum(["technicien", "praticien", "autre"], {
    errorMap: () => ({ message: "Merci de préciser votre intérêt." }),
  }),
  message: z.string().trim().min(10, "Votre message doit contenir au moins 10 caractères."),
  // Case à cocher : envoi immédiat de la brochure PDF + relance automatique.
  wantsBrochure: z.boolean().optional().default(false),
  // Honeypot anti-spam — doit rester vide.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const interestLabels: Record<ContactFormData["interest"], string> = {
  technicien: "Cursus Technicien",
  praticien: "Cursus Praticien",
  autre: "Autre question",
};
