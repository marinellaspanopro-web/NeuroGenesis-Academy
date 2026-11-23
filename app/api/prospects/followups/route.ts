import { sendDueFollowups } from "@/lib/prospect-followups";
import { backfillLegacyBrochures } from "@/lib/prospect-backfill";
import { openProspectMailbox } from "@/lib/prospect-mailbox";
export const maxDuration = 60;
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== "Bearer " + secret) return new Response(null, { status: 401 });
  let mailbox: Awaited<ReturnType<typeof openProspectMailbox>> | undefined;
  try {
    // Re-open the mailbox on every run; a previous successful test cannot authorize delivery.
    mailbox = await openProspectMailbox();
  } catch {
    console.error("Test de lecture Zimbra indisponible");
  }
  try {
    const result = mailbox ? await sendDueFollowups(mailbox) :
      { mailboxVerified: false, failed: 1, sent: 0 };
    let historicalImport: Awaited<ReturnType<typeof backfillLegacyBrochures>> | { error: string };
    try {
      historicalImport = await backfillLegacyBrochures();
    } catch (error) {
      console.error("Import historique des brochures indisponible", error);
      historicalImport = { error: "Import en attente" };
    }
    console.info("Relances J+4 : bilan quotidien", { ...result, historicalImport });
    return Response.json({ ...result, historicalImport },
      { status: result.failed || "error" in historicalImport ? 503 : 200, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Relances J+4 : erreur de traitement", error);
    return Response.json({ error: "Relances indisponibles" }, { status: 503 });
  } finally {
    mailbox?.close();
  }
}
