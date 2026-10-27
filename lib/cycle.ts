import { siteConfig } from "@/lib/site-config";

export function hasCycleStarted(now: number = Date.now()): boolean {
  return now >= Date.parse(siteConfig.session.isoDeadline);
}

export type EnrollmentPathway = "technicien" | "pack" | "praticien";

export function enrollmentHref(pathway: EnrollmentPathway | undefined, started: boolean): string {
  if (started && (!pathway || pathway === "technicien")) return siteConfig.session.nextHref;
  return pathway ? `/inscription?parcours=${pathway}` : "/inscription";
}

/** Keep Pack and Praticien distinct, including submissions from older open tabs. */
export function isNextCycleInterest(interest: string, started: boolean): boolean {
  return interest === "prochain-cycle" || (started && (interest === "technicien" || interest === "pack"));
}
