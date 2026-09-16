import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 90px",
          backgroundColor: "#0c2b1f",
          backgroundImage:
            "radial-gradient(circle at 82% 12%, rgba(232,217,168,0.16), transparent 42%)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Tracé complet du logo (17 nœuds, mêmes coordonnées que
              public/logo/logo-forest.svg et app/icon.svg) — l'ancienne version
              ici n'en reprenait qu'une quinzaine de branches sur ~34 et aucun
              nœud, d'où un logo tronqué sur les aperçus de partage du site. */}
          <svg width="38" height="35" viewBox="3 4 96 92" fill="none">
            <g stroke="#e8d9a8" strokeWidth="1.6" opacity={0.95}>
              <line x1="31" y1="14" x2="60" y2="12" />
              <line x1="31" y1="14" x2="34" y2="33" />
              <line x1="31" y1="14" x2="12" y2="29" />
              <line x1="60" y1="12" x2="79" y2="24" />
              <line x1="60" y1="12" x2="54" y2="31" />
              <line x1="60" y1="12" x2="34" y2="33" />
              <line x1="79" y1="24" x2="72" y2="40" />
              <line x1="79" y1="24" x2="91" y2="44" />
              <line x1="12" y1="29" x2="34" y2="33" />
              <line x1="12" y1="29" x2="10" y2="48" />
              <line x1="34" y1="33" x2="54" y2="31" />
              <line x1="34" y1="33" x2="10" y2="48" />
              <line x1="34" y1="33" x2="27" y2="55" />
              <line x1="34" y1="33" x2="46" y2="50" />
              <line x1="54" y1="31" x2="72" y2="40" />
              <line x1="54" y1="31" x2="46" y2="50" />
              <line x1="54" y1="31" x2="66" y2="57" />
              <line x1="72" y1="40" x2="91" y2="44" />
              <line x1="72" y1="40" x2="66" y2="57" />
              <line x1="91" y1="44" x2="82" y2="66" />
              <line x1="91" y1="44" x2="66" y2="57" />
              <line x1="10" y1="48" x2="27" y2="55" />
              <line x1="27" y1="55" x2="46" y2="50" />
              <line x1="27" y1="55" x2="30" y2="68" />
              <line x1="46" y1="50" x2="30" y2="68" />
              <line x1="46" y1="50" x2="45" y2="69" />
              <line x1="46" y1="50" x2="66" y2="57" />
              <line x1="66" y1="57" x2="45" y2="69" />
              <line x1="66" y1="57" x2="61" y2="75" />
              <line x1="66" y1="57" x2="82" y2="66" />
              <line x1="30" y1="68" x2="45" y2="69" />
              <line x1="45" y1="69" x2="61" y2="75" />
              <line x1="45" y1="69" x2="57" y2="89" />
              <line x1="61" y1="75" x2="82" y2="66" />
              <line x1="61" y1="75" x2="57" y2="89" />
            </g>
            <g fill="#0c2b1f" stroke="#e8d9a8" strokeWidth="1.6">
              <circle cx="31" cy="14" r="3.4" />
              <circle cx="60" cy="12" r="3.4" />
              <circle cx="79" cy="24" r="3.4" />
              <circle cx="12" cy="29" r="3.4" />
              <circle cx="34" cy="33" r="3.4" />
              <circle cx="54" cy="31" r="3.4" />
              <circle cx="72" cy="40" r="3.4" />
              <circle cx="91" cy="44" r="3.4" />
              <circle cx="10" cy="48" r="3.4" />
              <circle cx="27" cy="55" r="3.4" />
              <circle cx="46" cy="50" r="3.4" />
              <circle cx="66" cy="57" r="3.4" />
              <circle cx="30" cy="68" r="3.4" />
              <circle cx="45" cy="69" r="3.4" />
              <circle cx="61" cy="75" r="3.4" />
              <circle cx="82" cy="66" r="3.4" />
              <circle cx="57" cy="89" r="3.4" />
            </g>
          </svg>
          <span style={{ color: "#e8d9a8", fontSize: 26, letterSpacing: 4, fontFamily: "Helvetica, Arial, sans-serif" }}>
            NEUROGENESIS ACADEMY
          </span>
        </div>

        <div style={{ marginTop: 56, display: "flex", flexDirection: "column" }}>
          <span style={{ color: "#f7f2e7", fontSize: 62, lineHeight: 1.15 }}>
            Reprogrammez vos pensées,
          </span>
          <span style={{ color: "#e8d9a8", fontSize: 62, lineHeight: 1.15, fontStyle: "italic" }}>
            transformez votre vie.
          </span>
        </div>

        <div style={{ marginTop: 44, display: "flex" }}>
          <span
            style={{
              color: "#f7f2e7",
              fontSize: 26,
              fontFamily: "Helvetica, Arial, sans-serif",
              opacity: 0.75,
            }}
          >
            Formation en hypnose &amp; neurosciences — {siteConfig.address.addressLocality}, Belgique
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
