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
export function isNextCycleInterest(interest: string, started: boolean): boolean {
  // Existing "prochain-cycle" links now refer to the announced January intake.
  return started && ["technicien", "prochain-cycle"].includes(interest);
}
