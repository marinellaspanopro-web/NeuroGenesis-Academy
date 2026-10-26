"use client";

import { useCycle } from "@/components/shared/CycleProvider";
import { siteConfig } from "@/lib/site-config";
import Button from "@/components/ui/Button";

function getRemaining(target: string, now: number) {
  const diff = Math.max(0, new Date(target).getTime() - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

/** Compte à rebours jusqu'au début du cycle. Purement basé sur la date — aucun
 * chiffre d'inscription réel n'est jamais affiché ici. */
export default function Countdown({ target }: { target: string }) {
  const { now, started } = useCycle();
  const time = getRemaining(target, now);
  if (started) {
    return <div className="max-w-md text-gold/80 leading-relaxed">
      <p className="mb-6">{siteConfig.session.afterMessage}</p>
      <Button href={siteConfig.session.nextHref} variant="gold-outline">{siteConfig.session.nextLabel}</Button>
    </div>;
  }

  const units = [
    { label: "Jours", value: time?.days },
    { label: "Heures", value: time?.hours },
    { label: "Min", value: time?.minutes },
    { label: "Sec", value: time?.seconds },
  ];

  return (
    <div className="flex gap-4 sm:gap-6" role="timer" aria-live="off">
      {units.map((u) => (
        <div key={u.label} className="flex flex-col items-center">
          <span className="font-serif text-h2 text-gold tabular-nums leading-none">
            {u.value !== undefined ? String(u.value).padStart(2, "0") : "--"}
          </span>
          <span className="mt-2 text-[11px] uppercase tracking-wide3 text-gold/60">{u.label}</span>
        </div>
      ))}
    </div>
  );
}
