import { z } from "zod";
import { readProspect, saveProspect } from "@/lib/prospect-registry";

export const dynamic = "force-dynamic";
const checks = z.object({
  replies: z.literal(true),
  appointments: z.literal(true),
  registrations: z.literal(true),
  exclusions: z.literal(true),
  unsubscribes: z.literal(true),
  priorFollowups: z.literal(true),
}).strict();
const schema = z.discriminatedUnion("decision", [
  z.object({
    email: z.string().email(), decision: z.literal("eligible"),
    reviewedBy: z.string().trim().min(3).max(100),
    checks, messageVariant: z.enum(["standard", "marine", "genevieve"]),
    evidence: z.string().trim().min(10).max(1000),
  }).strict(),
  z.object({
    email: z.string().email(), decision: z.literal("excluded"),
    reason: z.string().trim().min(5).max(500),
  }).strict(),
]);

/** Authenticated individual review. NEVER sends mail. */
export async function POST(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== "Bearer " + process.env.CRON_SECRET) {
    return new Response(null, { status: 401 });
  }
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Validation incorrecte" }, { status: 400 });
  const row = await readProspect(parsed.data.email);
  if (!row) return Response.json({ error: "Prospect inconnu" }, { status: 404 });
  if (row.status === "sent" || row.status === "excluded") {
    return Response.json({ error: "Statut final : aucune réactivation automatique" }, { status: 409 });
  }
  if (parsed.data.decision === "excluded") {
    await saveProspect({ ...row, status: "excluded", reason: parsed.data.reason, reviewedAt: undefined, reviewChecks: undefined });
    return Response.json({ ok: true, status: "excluded" });
  }
  if (row.interest !== "technicien" || Date.parse(row.followupDueAt) > Date.now()) {
    return Response.json({ error: "J+4 ou cursus non éligible" }, { status: 409 });
  }
  const expectedVariant = row.email.trim().toLowerCase() === "marine.losa@gmail.com" ? "marine" :
    /genevieve|geneviève/i.test(row.firstName) ? "genevieve" : "standard";
  if (parsed.data.messageVariant !== expectedVariant) {
    return Response.json({ error: "Un modèle personnalisé est nécessaire" }, { status: 409 });
  }
  await saveProspect({
    ...row, status: "eligible", reason: parsed.data.evidence,
    reviewedAt: new Date().toISOString(), reviewedBy: parsed.data.reviewedBy,
    reviewChecks: parsed.data.checks, messageVariant: parsed.data.messageVariant,
  });
  return Response.json({ ok: true, status: "eligible", reviewed: true, sends: 0 });
}
