import { siteConfig } from "@/lib/site-config";

export function hasCycleStarted(now: number = Date.now()): boolean {
  return now >= Date.parse(siteConfig.session.isoDeadline);
}
