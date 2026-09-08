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

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);

    // On capture la référence du formulaire tout de suite : après un `await`,
    // `e.currentTarget` peut redevenir `null` (React vide l'event synthétique),
    // ce qui faisait planter le `.reset()` plus bas sur certains navigateurs.
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      interest: String(formData.get("interest") ?? ""),
      message: String(formData.get("message") ?? ""),
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
        <p className="font-serif text-h3 text-forest mb-3">Message bien reçu !</p>
        <p className="text-ink/70 max-w-md mx-auto leading-relaxed">
          Merci pour votre message — nous revenons vers vous très prochainement pour échanger
          sur votre projet de formation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Honeypot — masqué visuellement, ignoré par les humains */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Ne pas remplir</label>
        <input type="text" id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClasses}>
            Nom complet <span aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={fieldClasses}
          />
          {errors.name && (
            <p id="name-error" className="mt-2 text-sm text-[oklch(55%_0.18_25)]">
              {errors.name}
            </p>
          )}
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
            Téléphone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
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
            Intérêt <span aria-hidden="true">*</span>
          </label>
          <select
            id="interest"
            name="interest"
            required
            defaultValue=""
            aria-invalid={Boolean(errors.interest)}
            aria-describedby={errors.interest ? "interest-error" : undefined}
            className={fieldClasses}
          >
            <option value="" disabled>
              Choisissez une option
            </option>
            <option value="technicien">Cursus Technicien</option>
            <option value="praticien">Cursus Praticien</option>
            <option value="autre">Autre question</option>
          </select>
          {errors.interest && (
            <p id="interest-error" className="mt-2 text-sm text-[oklch(55%_0.18_25)]">
              {errors.interest}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClasses}>
          Message <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={fieldClasses}
        />
        {errors.message && (
          <p id="message-error" className="mt-2 text-sm text-[oklch(55%_0.18_25)]">
            {errors.message}
          </p>
        )}
      </div>

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
        {status === "submitting" ? "Envoi en cours…" : "Envoyer mon message"}
      </button>
    </form>
  );
}
