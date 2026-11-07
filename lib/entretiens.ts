const days = [
  ["2026-11-09", "10:00", 4], ["2026-11-10", "10:00", 3], ["2026-11-12", "18:00", 3],
  ["2026-11-16", "10:00", 4], ["2026-11-17", "10:00", 3], ["2026-11-18", "17:00", 3],
  ["2026-11-23", "10:00", 4], ["2026-11-24", "10:00", 3], ["2026-11-26", "17:00", 3],
  ["2026-12-01", "10:00", 3], ["2026-12-03", "18:00", 3],
] as const;

const weekday = new Intl.DateTimeFormat("fr-BE", {
  timeZone: "Europe/Brussels", weekday: "long", month: "long", day: "numeric",
});
const clock = new Intl.DateTimeFormat("fr-BE", {
  timeZone: "Europe/Brussels", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
});

export const slots = days.flatMap(([day, first, count]) =>
  Array.from({ length: count }, (_, index) => {
    // These November and December dates are all on Brussels winter time.
    const start = Date.parse(day + "T" + first + ":00+01:00") + index * 45 * 60_000;
    return { id: new Date(start).toISOString(), day: weekday.format(start),
      hours: clock.format(start) + " – " + clock.format(start + 30 * 60_000) };
  })
);
export const methods = { telephone: "Appel téléphonique", whatsapp: "Appel vidéo WhatsApp" } as const;
export type InterviewSlot = (typeof slots)[number];
