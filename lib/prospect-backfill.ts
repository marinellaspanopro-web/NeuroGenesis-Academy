import { prospectId, readProspect, saveProspect, type ProspectRecord } from "@/lib/prospect-registry";
import { siteConfig } from "@/lib/site-config";

// Recover legacy brochure receipts into the PRIVATE review queue, never automatically approve or send.
// Pages are re-scanned idempotently, with a small daily cap to respect Resend API rate limits.
const BROCHURE_SUBJECT = "Votre brochure NeuroGenesis, à découvrir à votre rythme";
const CUTOFF = Date.parse("2026-10-27T00:00:00Z");
const CAP = 24;
type SentEmail = { id: string; subject: string; to: string[] | string; created_at: string; last_event?: string };
type Page = { data?: SentEmail[]; has_more?: boolean };
type Detail = { text?: string | null; id?: string; to?: string[] | string };
const pause = () => new Promise(resolve => setTimeout(resolve, 550));

async function resendGet<T>(apiKey: string, path: string): Promise<T> {
  const result = await fetch("https://api.resend.com" + path, {
    headers: { Authorization: "Bearer " + apiKey },
    signal: AbortSignal.timeout(12_000),
    cache: "no-store",
  });
  if (!result.ok) throw new Error("Resend read failed: " + result.status);
  return await result.json() as T;
}

export async function backfillLegacyBrochures() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Configuration Resend manquante");
  const result = { scanned: 0, recovered: 0, alreadyRegistered: 0, unmatched: 0, errors: 0, pendingOnly: true };
  let after: string | undefined;
  for (let pageNumber = 0; pageNumber < 3 && result.recovered < CAP; pageNumber++) {
    const page = await resendGet<Page>(key, "/emails?limit=100" + (after ? "&after=" + encodeURIComponent(after) : ""));
    if (!Array.isArray(page.data)) throw new Error("Resend list response unreadable");
    if (page.data.length === 0) break;
    for (const item of page.data) {
      if (item.subject !== BROCHURE_SUBJECT) continue;
      if (Date.parse(item.created_at) < CUTOFF) continue;
      result.scanned++;
      if (item.last_event !== "delivered") { result.unmatched++; continue; }
      const to = Array.isArray(item.to) ? item.to : [item.to];
      const recipient = to.length === 1 ? to[0]?.trim().toLowerCase() : undefined;
      if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient) || recipient === siteConfig.email) {
        result.unmatched++; continue;
      }
      try {
        if (await readProspect(recipient)) { result.alreadyRegistered++; continue; }
        await pause();
        const detail = await resendGet<Detail>(key, "/emails/" + encodeURIComponent(item.id));
        const firstName = detail.text?.match(/^\s*Bonjour\s+([^,\r\n]+)[,\r\n]/i)?.[1]?.trim();
        if (!firstName || firstName.length > 80 || /^test\b/i.test(firstName)) {
          result.unmatched++; continue;
        }
        const sentAt = Date.parse(item.created_at);
        if (!Number.isFinite(sentAt)) { result.unmatched++; continue; }
        const record: ProspectRecord = {
          id: prospectId(recipient), email: recipient, firstName,
          interest: "technicien", brochureSentAt: new Date(sentAt).toISOString(),
          followupDueAt: new Date(sentAt + 4 * 86_400_000).toISOString(),
          brochureEmailId: item.id, status: "pending_review",
          reason: "Historique Resend : vérifier réponses, inscriptions, RDV, exclusions, opt-out et relances précédentes",
        };
        // Check again to avoid overwriting any concurrent new request or final decision.
        if (await readProspect(recipient)) { result.alreadyRegistered++; continue; }
        await saveProspect(record);
        result.recovered++;
      } catch (error) {
        result.errors++;
        console.error("Échec import brochure historique", item.id, error);
      }
      if (result.recovered >= CAP) break;
    }
    after = page.data.at(-1)?.id;
    if (!page.has_more || !after || Date.parse(page.data.at(-1)?.created_at ?? "") < CUTOFF) break;
    await pause();
  }
  return result;
}
