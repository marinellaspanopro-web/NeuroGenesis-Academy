import { dueProspects, listProspects } from "@/lib/prospect-registry";
export const dynamic = "force-dynamic";

/** Private, read-only operational audit. Never sends mail or changes records. */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== "Bearer " + secret) {
    return new Response(null, { status: 401 });
  }
  try {
    const [all, due] = await Promise.all([listProspects(), dueProspects()]);
    const now = Date.now();
    const counts = {
      totalRecords: all.length,
      pendingReview: all.filter(p => p.status === "pending_review").length,
      pendingReviewPastJ4: all.filter(p => p.status === "pending_review" && Date.parse(p.followupDueAt) <= now).length,
      approvedDue: due.length,
      excluded: all.filter(p => p.status === "excluded").length,
      sentRecorded: all.filter(p => p.status === "sent").length,
      unverifiedLegacyEligible: all.filter(p => p.status === "eligible" && !p.reviewedAt).length,
      otherEligibleNotDue: all.filter(p => p.status === "eligible" && Date.parse(p.followupDueAt) > now).length,
    };
    return Response.json({ ...counts, sends: 0, generatedAt: new Date().toISOString() },
      { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Audit registre indisponible", error);
    return Response.json({ error: "Registre inaccessible" }, { status: 503 });
  }
}
