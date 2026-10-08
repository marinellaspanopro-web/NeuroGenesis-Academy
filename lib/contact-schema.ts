import { z } from "zod";

/** Validation commune au formulaire de contact et au mini-formulaire de brochure. */
export const contactSchema = z.object({
  // "name" conserve la compatibilité du mini-formulaire brochure existant.
  name: z.string().trim().optional().default(""),
  firstName: z.string().trim().optional().default(""),
  lastName: z.string().trim().optional().default(""),
  email: z.string().trim().email("Merci d'indiquer une adresse e-mail valide."),
  phone: z.string().trim().optional().default(""),
  contactPreference: z.enum(["email", "telephone", "les_deux"]).default("email"),
  interest: z.enum(["technicien", "pack", "praticien", "a_determiner", "autre"]),
  wantsBrochure: z.boolean().optional().default(false),
  message: z.string().trim().max(2000, "Votre message doit contenir au maximum 2 000 caractères.").optional().default(""),
  requestType: z.enum(["brochure", "inscription", "renseignement"]).default("inscription"),
  company: z.string().max(0).optional().or(z.literal("")),
}).superRefine((data, ctx) => {
  const add = (field: string, message: string) =>
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message });

  if (data.requestType !== "brochure") {
    if (data.firstName.length < 2) add("firstName", "Merci d'indiquer votre prénom.");
    if (data.lastName.length < 2) add("lastName", "Merci d'indiquer votre nom.");
  } else if (data.name.length < 2) {
    add("name", "Merci d'indiquer votre prénom.");
  }

  if (data.requestType !== "brochure" && data.interest === "autre" && data.message.length < 5)
    add("message", "Merci de préciser votre question.");

  if (data.phone && data.phone.length < 6) add("phone", "Merci d'indiquer un numéro valide.");
  if (data.requestType !== "brochure" && data.contactPreference !== "email" && data.phone.length < 6)
    add("phone", "Merci d'indiquer votre numéro pour être contacté(e) par téléphone.");
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const interestLabels: Record<ContactFormData["interest"], string> = {
  technicien: "Cursus Technicien",
  pack: "Pack complet Technicien + Praticien",
  praticien: "Cursus Praticien (prérequis Technicien acquis)",
  a_determiner: "Parcours à déterminer ensemble",
  autre: "Autre question",
};

export const contactPreferenceLabels: Record<ContactFormData["contactPreference"], string> = {
  email: "E-mail",
  telephone: "Téléphone",
  les_deux: "E-mail ou téléphone",
};
