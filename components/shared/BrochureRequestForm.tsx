"use client";

import { useState, type FormEvent } from "react";
import { contactSchema } from "@/lib/contact-schema";
import { siteConfig } from "@/lib/site-config";

type Status = "idle" | "submitting" | "success" | "error";

type Props = {
  /** Pré-remplit l'intérêt envoyé à l'API selon la page qui affiche le formulaire. */
  interest: "technicien" | "praticien";
  /** Variante visuelle : "dark" pour un fond forêt, "light" pour un fond clair. */
  variant?: "dark" | "light";
};

const fieldClassesLight =
  "w-full rounded-sm border border-forest/25 bg-cream-soft px-4 py-3 text-ink placeholder:text-ink/40 " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest focus-visible:outline-offset-2 " +
  "transition-colors";

const fieldClassesDark =
  "w-full rounded-sm border border-cream/25 bg-cream/5 px-4 py-3 text-cream placeholder:text-cream/40 " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2 " +
  "transition-colors";

/**
 * Formulaire minimal (prénom + email) dédié à la demande de brochure PDF,
 * pensé pour s'intégrer directement dans les pages de présentation des
 * cursus. Envoie la brochure immédiatement par email et programme une
 * relance à J+4 (même logique que /api/contact, avec `wantsBrochure: true`).
 */
export default function BrochureRequestForm({ interest, variant = "light" }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const isDark = variant === "dark";
  const fieldClasses = isDark ? fieldClassesDark : fieldClassesLight;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: "",
      interest,
      wantsBrochure: true,
      company: String(formData.get("company") ?? ""), // honeypot
    };

    const result = contactSchema.safeParse(payload);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Merci de vérifier vos informations.");
      return;
    }

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
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    }
  }

  if (status === "success") {
    return (
      <p role="status" className={isDark ? "text-cream" : "text-forest"}>
        <span className="font-serif text-lg">Brochure envoyée ! </span>
        <span className={isDark ? "text-cream/70" : "text-ink/70"}>
          Vérifiez votre boîte mail (et vos courriers indésirables) d&apos;ici quelques minutes.
        </span>
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`company-${interest}`}>Ne pas remplir</label>
        <input type="text" id={`company-${interest}`} name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex-1">
        <label htmlFor={`name-${interest}`} className="sr-only">
          Prénom
        </label>
        <input
          id={`name-${interest}`}
          name="name"
          type="text"
          placeholder="Votre prénom"
          autoComplete="name"
          required
          className={fieldClasses}
        />
      </div>

      <div className="flex-1">
        <label htmlFor={`email-${interest}`} className="sr-only">
          Email
        </label>
        <input
          id={`email-${interest}`}
          name="email"
          type="email"
          placeholder="Votre email"
          autoComplete="email"
          required
          className={fieldClasses}
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className={
          "inline-flex items-center justify-center rounded-pill px-7 py-3 text-sm font-medium tracking-wide2 " +
          "transition-all duration-300 ease-out-expo disabled:opacity-60 disabled:pointer-events-none whitespace-nowrap " +
          (isDark
            ? "bg-gold text-forest hover:bg-gold-deep hover:-translate-y-0.5"
            : "bg-forest text-cream hover:bg-forest-light hover:-translate-y-0.5")
        }
      >
        {status === "submitting" ? "Envoi…" : "Recevoir la brochure"}
      </button>

      {error && (
        <p role="alert" className={"text-sm basis-full " + (isDark ? "text-gold" : "text-[oklch(55%_0.18_25)]")}>
          {error} Vous pouvez aussi nous écrire à{" "}
          <a href={`mailto:${siteConfig.email}`} className="underline">
            {siteConfig.email}
          </a>
          .
        </p>
      )}
    </form>
  );
}
