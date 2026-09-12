// Suivi des conversions Google Ads.
// L'ID de balise (AW-...) est chargé sitewide dans app/layout.tsx ; cette
// fonction déclenche l'événement de conversion "Envoi de formulaire de lead"
// (créé dans Google Ads pour la campagne "Formation hypnose octobre 2026"),
// uniquement lorsque l'envoi du formulaire a réellement réussi.

export const GOOGLE_ADS_ID = "AW-18438642136";
const LEAD_CONVERSION_SEND_TO = "AW-18438642136/rA9nCMeA3_QcENizndhE";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackLeadFormConversion() {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", { send_to: LEAD_CONVERSION_SEND_TO });
}
