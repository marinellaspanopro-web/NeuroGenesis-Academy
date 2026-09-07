"use client";

import { useEffect, useState } from "react";

function getRemaining(target: string) {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

/** Compte à rebours jusqu'au début du cycle. Purement basé sur la date — aucun
 * chiffre d'inscription réel n'est jamais affiché ici. */
export default function Countdown({ target }: { target: string }) {
  const [time, setTime] = useState<ReturnType<typeof getRemaining> | null>(null);

  useEffect(() => {
    setTime(getRemaining(target));
    const id = setInterval(() => setTime(getRemaining(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

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
          <span className="mt-2 text-[11px] uppercase tracking-wide3 text-cream/60">{u.label}</span>
        </div>
      ))}
    </div>
  );
}
