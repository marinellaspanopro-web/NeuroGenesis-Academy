"use client";

import { useState, type FormEvent } from "react";
import { contactSchema } from "@/lib/contact-schema";
import { siteConfig } from "@/lib/site-config";

type Status = "idle" | "submitting" | "success" | "error";

const fieldClasses =
  "w-full rounded-sm border border-forest/25 bg-cream-soft px-4 py-3 text-ink placeholder:text-ink/40 " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest focus-visible:outline-offset-2 " +
  "transition-colors";

const labelClasses = "block text-sm font-medium text-forest mb-2";

type ContactFormProps = { mode?: "inscription" | "renseignement"; initialInterest?: "technicien" | "pack" | "praticien" | "a_determiner" | "autre" };

export default function ContactForm({ mode = "renseignement", initialInterest }: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [contactPreference, setContactPreference] = useState("email");
  const [interest, setInterest] = useState(initialInterest ?? "");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);

    // On capture la référence du formulaire tout de suite : après un `await`,
    // `e.currentTarget` peut redevenir `null` (React vide l'event synthétique),
    // ce qui faisait planter le `.reset()` plus bas sur certains navigateurs.
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      interest: String(formData.get("interest") ?? ""),
      message: String(formData.get("message") ?? ""),
      contactPreference: String(formData.get("contactPreference") ?? "email"),
      requestType: mode,
      wantsBrochure: formData.get("wantsBrochure") === "on",
      company: String(formData.get("company") ?? ""), // honeypot
    };

    const result = contactSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Une erreur est survenue.");
      }

      setStatus("success");
      form.reset();
      setContactPreference("email");
      setInterest(initialInterest ?? "");
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Une erreur est survenue.");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-lg border border-forest/20 bg-cream-soft p-10 text-center"
      >
        <p className="font-serif text-h3 text-forest mb-3">Demande bien reçue !</p>
        <p className="text-ink/70 max-w-md mx-auto leading-relaxed">
          {mode === "inscription"
            ? "Merci pour votre demande. Un échange individuel permettra de préciser les modalités avant confirmation de votre inscription."
            : "Merci pour votre message. Nous reviendrons vers vous selon votre préférence de contact."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div>
        <h2 className="font-serif text-h3 text-forest">{mode === "inscription" ? "Demande de réservation" : "Demande de renseignements"}</h2>
        <p className="mt-2 text-sm text-ink/70">{mode === "inscription"
          ? "Votre inscription sera confirmée après un échange individuel sur votre projet et les modalités pratiques."
          : "Une question sur les formations ? Précisez le parcours qui vous intéresse ou sélectionnez « Autre question »."}</p>
      </div>
      {/* Honeypot — masqué visuellement, ignoré par les humains */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Ne pas remplir</label>
        <input type="text" id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className={labelClasses}>
            Prénom <span aria-hidden="true">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={errors.firstName ? "firstName-error" : undefined}
            className={fieldClasses}
          />
          {errors.firstName && (
            <p id="firstName-error" className="mt-2 text-sm text-[oklch(55%_0.18_25)]">
              {errors.firstName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className={labelClasses}>
            Nom <span aria-hidden="true">*</span>
          </label>
          <input id="lastName" name="lastName" type="text" autoComplete="family-name" required
            aria-invalid={Boolean(errors.lastName)} className={fieldClasses} />
          {errors.lastName && <p role="alert" className="mt-2 text-sm text-red-700">{errors.lastName}</p>}
        </div>
        <div>
          <label htmlFor="email" className={labelClasses}>
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={fieldClasses}
          />
          {errors.email && (
            <p id="email-error" className="mt-2 text-sm text-[oklch(55%_0.18_25)]">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className={labelClasses}>
            Téléphone {contactPreference !== "email" && <span aria-hidden="true">*</span>}
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required={contactPreference !== "email"}
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className={fieldClasses}
          />
          {errors.phone && (
            <p id="phone-error" className="mt-2 text-sm text-[oklch(55%_0.18_25)]">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="interest" className={labelClasses}>
            Parcours souhaité <span aria-hidden="true">*</span>
          </label>
          <select
            id="interest"
            name="interest"
            required
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            aria-invalid={Boolean(errors.interest)}
            aria-describedby={errors.interest ? "interest-error" : undefined}
            className={fieldClasses}
          >
            <option value="" disabled>
              Choisissez une option
            </option>
            <option value="technicien">Cursus Technicien</option>
            <option value="pack">Pack complet Technicien + Praticien</option>
            <option value="praticien">Praticien (Technicien déjà acquis)</option>
            <option value="a_determiner">À déterminer ensemble</option>
            <option value="autre">Autre question</option>
          </select>
          {errors.interest && (
            <p id="interest-error" className="mt-2 text-sm text-[oklch(55%_0.18_25)]">
              {errors.interest}
            </p>
          )}
        </div>
      </div>

      {interest === "autre" && (
        <div>
          <label htmlFor="message" className={labelClasses}>Votre question <span aria-hidden="true">*</span></label>
          <textarea id="message" name="message" required maxLength={2000} rows={4}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
            placeholder="Quelle question souhaitez-vous nous poser ?"
            className={fieldClasses} />
          {errors.message && <p id="message-error" role="alert" className="mt-2 text-sm text-red-700">{errors.message}</p>}
        </div>
      )}

      <div>
        <label htmlFor="contactPreference" className={labelClasses}>Comment souhaitez-vous être contacté(e) ? <span aria-hidden="true">*</span></label>
        <select id="contactPreference" name="contactPreference" required value={contactPreference}
          onChange={(e) => setContactPreference(e.target.value)} className={fieldClasses}>
          <option value="email">Par e-mail</option>
          <option value="telephone">Par téléphone</option>
          <option value="les_deux">Les deux me conviennent</option>
        </select>
        <p className="mt-1 text-xs text-ink/60">Votre téléphone est demandé uniquement pour vous recontacter au sujet de votre formation.</p>
      </div>
      <label className="flex items-center gap-3 text-sm text-ink">
        <input type="checkbox" name="wantsBrochure" className="accent-forest" />
        Je souhaite également recevoir la brochure par e-mail.
      </label>

      {serverError && (
        <p role="alert" className="text-sm text-[oklch(55%_0.18_25)]">
          {serverError} Vous pouvez aussi nous écrire directement à{" "}
          <a href={`mailto:${siteConfig.email}`} className="underline">
            {siteConfig.email}
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center rounded-pill bg-forest px-8 py-4 text-sm font-medium tracking-wide2 text-cream transition-all duration-300 ease-out-expo hover:bg-forest-light hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none"
      >
        {status === "submitting" ? "Envoi en cours…" : mode === "inscription" ? "Envoyer ma demande de réservation" : "Envoyer ma demande de renseignements"}
      </button>
    </form>
  );
}
