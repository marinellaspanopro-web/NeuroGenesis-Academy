import { get, list, put } from "@vercel/blob";
import { createHash } from "node:crypto";

export type ProspectRecord = {
  id: string;
  firstName: string;
  email: string;
  interest: string;
  brochureSentAt: string;
  followupDueAt: string;
  status: "pending_review" | "eligible" | "excluded" | "sent";
  reason?: string;
  followupSentAt?: string;
  followupEmailId?: string;
  followupClaimedAt?: string;
  brochureEmailId?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewChecks?: Record<ReviewCheck, true>;
  messageVariant?: "standard" | "marine" | "genevieve";
};
export type ReviewCheck = "replies" | "appointments" | "registrations" | "exclusions" | "unsubscribes" | "priorFollowups";
export const REQUIRED_REVIEW_CHECKS: ReviewCheck[] = ["replies", "appointments", "registrations", "exclusions", "unsubscribes", "priorFollowups"];
export const PROSPECT_PREFIX = "prospects/v1/";
const PREFIX = PROSPECT_PREFIX;
const norm = (v: string) => v.trim().toLocaleLowerCase("fr-BE").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const EXCLUDED_EMAILS = new Set((process.env.PROSPECT_EXCLUSION_EMAILS || "").split(",").map(norm).filter(Boolean));
// Explicit exclusions only: Marine Losa and Geneviève Potier must NOT be generically blacklisted.
const EXCLUDED_NAMES = new Set(["nawal talaa", "meryl pierrard", "morgane", "serge malisoux", "alexandre", "charlotte royen", "jeremiah"]);
export const prospectId = (email: string) => createHash("sha256").update(norm(email)).digest("hex");
const pathFor = (id: string) => PREFIX + id + ".json";
export async function readProspect(email: string): Promise<ProspectRecord | null> {
  const response = await get(pathFor(prospectId(email)), { access: "private", useCache: false });
  if (!response || response.statusCode !== 200) return null;
  return await new Response(response.stream).json() as ProspectRecord;
}
export async function recordBrochure(input: { firstName: string; email: string; interest: string; brochureEmailId?: string }) {
  const existing = await readProspect(input.email);
  const normalizedName = norm(input.firstName);
  const excluded = EXCLUDED_EMAILS.has(norm(input.email)) || EXCLUDED_NAMES.has(normalizedName) ||
    normalizedName.includes("nawal") || normalizedName.includes("meryl") || normalizedName.includes("morgane") || normalizedName.includes("serge");
  const now = new Date();
  const record: ProspectRecord = existing ? {
    ...existing,
    // New activity invalidates any previous approval. Never re-send after exclusion or a completed follow-up.
    status: existing.status === "eligible" ? "pending_review" : existing.status,
    ...(existing.status !== "excluded" && existing.status !== "sent" ? {
      brochureSentAt: now.toISOString(), followupDueAt: new Date(now.getTime() + 4 * 86_400_000).toISOString(),
      reviewedAt: undefined, reviewedBy: undefined, reviewChecks: undefined, messageVariant: undefined,
    } : {}),
    brochureEmailId: input.brochureEmailId || existing.brochureEmailId,
  } : {
    id: prospectId(input.email), firstName: input.firstName.trim(), email: input.email.trim(),
    interest: input.interest, brochureSentAt: now.toISOString(),
    followupDueAt: new Date(now.getTime() + 4 * 86_400_000).toISOString(),
    status: excluded ? "excluded" : "pending_review",
    ...(input.brochureEmailId ? { brochureEmailId: input.brochureEmailId } : {}),
    ...(excluded ? { reason: "Suivi individuel ou inscription préalable" } : {}),
  };
  await put(pathFor(record.id), JSON.stringify(record), {
    access: "private", addRandomSuffix: false, allowOverwrite: true,
  });
  return record;
}

export async function markProspectEngaged(email: string, reason: string) {
  const existing = await readProspect(email);
  if (!existing || existing.status === "sent" || existing.status === "excluded") return;
  await saveProspect({ ...existing, status: "excluded", reason, reviewedAt: undefined, reviewChecks: undefined });
}

export async function listProspects() {
  const all: ProspectRecord[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: PREFIX, limit: 1000, ...(cursor ? { cursor } : {}) });
    for (const blob of page.blobs) {
      const result = await get(blob.pathname, { access: "private", useCache: false });
      if (result?.statusCode === 200) all.push(await new Response(result.stream).json() as ProspectRecord);
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return all;
}

export async function dueProspects() {
  const now = Date.now();
  const all = await listProspects();
  // Fail closed on historical "eligible" entries: only a recorded, complete, recent J+4 review can authorize dispatch.
  return all.filter(row => row.status === "eligible"
    && row.interest === "technicien"
    && !EXCLUDED_EMAILS.has(norm(row.email)) && !EXCLUDED_NAMES.has(norm(row.firstName))
    && Date.parse(row.followupDueAt) <= now
    && !!row.reviewedAt && Date.parse(row.reviewedAt) >= Date.parse(row.followupDueAt)
    && Date.parse(row.reviewedAt) >= now - 48 * 3_600_000
    && REQUIRED_REVIEW_CHECKS.every(check => row.reviewChecks?.[check] === true));
}
export async function saveProspect(record: ProspectRecord) {
  await put(pathFor(record.id), JSON.stringify(record), {
    access: "private", addRandomSuffix: false, allowOverwrite: true,
  });
}
