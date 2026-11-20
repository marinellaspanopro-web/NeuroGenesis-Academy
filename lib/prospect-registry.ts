import { get, put } from "@vercel/blob";
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
};
const PREFIX = "prospects/v1/";
const EXCLUDED_EMAILS = new Set<string>(); // Add only verified addresses, not guesses.
const EXCLUDED_NAMES = new Set(["geneviève potier", "genevieve potier"]);
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
  const name = norm(input.firstName);
  const excluded = EXCLUDED_EMAILS.has(norm(input.email)) || EXCLUDED_NAMES.has(name) ||
    (name.includes("genevieve") && name.includes("potier"));
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
