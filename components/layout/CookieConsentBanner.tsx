"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

const STORAGE_KEY = "ngx-cookie-consent";

type Consent = "granted" | "denied";

function applyConsent(consent: Consent) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    ad_storage: consent,
    ad_user_data: consent,
    ad_personalization: consent,
    analytics_storage: consent,
  });
}

/**
 * Bandeau cookies minimal, requis pour activer la mesure Google Ads (voir
 * lib/gtag.ts) sur les visiteurs européens. Le choix est mémorisé en
 * localStorage et réappliqué à chaque visite tant que rien n'a expiré côté
 * navigateur (pas de bandeau si un choix existe déjà).
 */
export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }

    if (stored === "granted" || stored === "denied") {
      applyConsent(stored);
    } else {
      setVisible(true);
    }
  }, []);

  function choose(consent: Consent) {
    try {
      localStorage.setItem(STORAGE_KEY, consent);
    } catch {
      // Stockage indisponible (navigation privée, etc.) : le choix ne sera
      // simplement pas mémorisé d'une visite à l'autre.
    }
    applyConsent(consent);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Consentement aux cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-gold/20 bg-forest px-6 py-6 sm:px-10"
    >
      <div className="container-editorial flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gold/80 leading-relaxed max-w-xl">
          Ce site utilise des cookies de mesure d&apos;audience publicitaire (Google Ads) pour
          savoir si nos annonces génèrent des demandes de contact. Vous pouvez accepter ou refuser
          librement — voir notre{" "}
          <a href="/mentions-legales#cookies" className="underline underline-offset-4 hover:text-cream">
            politique en matière de cookies
          </a>
          .
        </p>
        <div className="flex gap-3 shrink-0">
          <Button variant="gold-outline" size="md" onClick={() => choose("denied")}>
            Refuser
          </Button>
          <Button variant="gold" size="md" onClick={() => choose("granted")}>
            Tout accepter
          </Button>
        </div>
      </div>
    </div>
  );
}
