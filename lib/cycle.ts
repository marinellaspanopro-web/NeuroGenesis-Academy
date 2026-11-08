import { siteConfig } from "@/lib/site-config";

export function hasCycleStarted(now: number = Date.now()): boolean {
  return now >= Date.parse(siteConfig.session.isoDeadline);
}

export type EnrollmentPathway = "technicien" | "praticien";

export function enrollmentHref(pathway: EnrollmentPathway | undefined, started: boolean): string {
  if (started && (!pathway || pathway === "technicien")) return siteConfig.session.nextHref;
  return pathway ? `/inscription?parcours=${pathway}` : "/inscription";
}

/** Route late Technicien requests, including submissions from older open tabs. */
export function isNextCycleInterest(interest: string, started: boolean, now: number = Date.now()): boolean {
  // Existing "prochain-cycle" links now refer to the announced January intake.
  if (interest === "pack") return now >= Date.parse("2027-01-25T00:00:00+01:00");
  return started && ["technicien", "prochain-cycle"].includes(interest);
}
