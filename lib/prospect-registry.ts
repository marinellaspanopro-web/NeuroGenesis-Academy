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
};
export const PROSPECT_PREFIX = "prospects/v1/";
const PREFIX = PROSPECT_PREFIX;
const EXCLUDED_EMAILS = new Set((process.env.PROSPECT_EXCLUSION_EMAILS || "").split(",").map(norm).filter(Boolean));
// Personal exchanges require review, but do not automatically exclude Geneviève.
const norm = (v: string) => v.trim().toLocaleLowerCase("fr-BE").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
export const prospectId = (email: string) => createHash("sha256").update(norm(email)).digest("hex");
const pathFor = (id: string) => PREFIX + id + ".json";
export async function readProspect(email: string): Promise<ProspectRecord | null> {
  const response = await get(pathFor(prospectId(email)), { access: "private", useCache: false });
  if (!response || response.statusCode !== 200) return null;
  return await new Response(response.stream).json() as ProspectRecord;
}
export async function recordBrochure(input: { firstName: string; email: string; interest: string }) {
  const existing = await readProspect(input.email);
  const excluded = EXCLUDED_EMAILS.has(norm(input.email));
  const now = new Date();
  const record: ProspectRecord = existing ? {
    ...existing,
    // Repeated brochure requests must never reset prior exclusions or a completed follow-up.
    status: existing.status,
  } : {
    id: prospectId(input.email), firstName: input.firstName.trim(), email: input.email.trim(),
    interest: input.interest, brochureSentAt: now.toISOString(),
    followupDueAt: new Date(now.getTime() + 4 * 86_400_000).toISOString(),
    status: excluded ? "excluded" : "pending_review",
    ...(excluded ? { reason: "Échange personnel préalable : exclusion automatique" } : {}),
  };
  await put(pathFor(record.id), JSON.stringify(record), {
    access: "private", addRandomSuffix: false, allowOverwrite: true,
  });
  return record;
}

export async function dueProspects() {
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
  return all.filter(row => row.status === "eligible" && Date.parse(row.followupDueAt) <= Date.now());
}
export async function saveProspect(record: ProspectRecord) {
  await put(pathFor(record.id), JSON.stringify(record), {
    access: "private", addRandomSuffix: false, allowOverwrite: true,
  });
}
