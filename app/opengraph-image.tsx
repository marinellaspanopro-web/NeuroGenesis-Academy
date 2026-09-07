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
          <svg width="34" height="30" viewBox="0 0 100 88" fill="none">
            <g stroke="#e8d9a8" strokeWidth="2.4">
              <line x1="31" y1="11" x2="60" y2="9" />
              <line x1="31" y1="11" x2="34" y2="30" />
              <line x1="31" y1="11" x2="12" y2="26" />
              <line x1="60" y1="9" x2="79" y2="21" />
              <line x1="60" y1="9" x2="54" y2="28" />
              <line x1="60" y1="9" x2="34" y2="30" />
              <line x1="79" y1="21" x2="72" y2="37" />
              <line x1="79" y1="21" x2="91" y2="41" />
              <line x1="12" y1="26" x2="34" y2="30" />
              <line x1="34" y1="30" x2="54" y2="28" />
              <line x1="34" y1="30" x2="46" y2="47" />
              <line x1="54" y1="28" x2="46" y2="47" />
              <line x1="46" y1="47" x2="66" y2="54" />
              <line x1="46" y1="47" x2="45" y2="66" />
              <line x1="45" y1="66" x2="57" y2="86" />
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
            Formation certifiante en hypnose &amp; neurosciences — {siteConfig.address.addressLocality}, Belgique
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
