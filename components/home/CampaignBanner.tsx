import Countdown from "@/components/shared/Countdown";
import Button from "@/components/ui/Button";
import RevealOnScroll from "@/components/shared/RevealOnScroll";
import { siteConfig } from "@/lib/site-config";

const badges = [
  { label: "Petit groupe", detail: siteConfig.session.groupSize },
  { label: "Namur", detail: "Formation en présentiel" },
  { label: "Pratique validée", detail: "45h supervisées" },
];

export default function CampaignBanner() {
  return (
    <section className="dark-section relative overflow-hidden py-section-sm">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 15% 20%, oklch(88.5% 0.066 93 / 0.12), transparent 45%), radial-gradient(circle at 85% 80%, oklch(88.5% 0.066 93 / 0.1), transparent 45%)",
        }}
        aria-hidden="true"
      />
      <div className="container-editorial relative z-10">
        <RevealOnScroll className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="reveal-item">
            <p className="text-xs uppercase tracking-wide3 text-gold/80 mb-4">
              {siteConfig.session.label}
            </p>
            <h2 className="font-serif text-h1 text-cream mb-6 text-balance">
              Les inscriptions sont <em className="accent-italic">ouvertes.</em>
            </h2>
            <p className="text-body-lg text-gold/80 max-w-lg leading-relaxed mb-8">
              Un petit groupe, un accompagnement sur-mesure, une exigence sans compromis. Les
              places sont volontairement limitées pour garantir la supervision individuelle de
              chaque stagiaire.
            </p>

            <ul className="flex flex-wrap gap-x-8 gap-y-4 mb-10">
              {badges.map((b) => (
                <li key={b.label} className="flex flex-col">
                  <span className="text-gold font-serif italic text-lg">{b.label}</span>
                  <span className="text-gold/60 text-sm">{b.detail}</span>
                </li>
              ))}
            </ul>

            <Button href="/contact" variant="gold" size="lg">
              Réserver ma place
            </Button>
          </div>

          <div className="reveal-item flex flex-col items-start lg:items-end">
            <p className="text-xs uppercase tracking-wide3 text-gold/50 mb-4">
              Avant le début du cycle
            </p>
            <Countdown target={siteConfig.session.isoDeadline} />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
