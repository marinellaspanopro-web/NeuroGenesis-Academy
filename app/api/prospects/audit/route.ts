import { dueProspects } from "@/lib/prospect-registry";
export const dynamic = "force-dynamic";
/** Read-only audit endpoint. Never sends emails or changes records. */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== "Bearer " + secret) {
    return new Response(null, { status: 401 });
  }
  try {
    const due = await dueProspects();
    return Response.json({ eligibleDue: due.length, ids: due.map(row => row.id), sends: 0 },
      { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Registre inaccessible" }, { status: 503 });
  }
}
