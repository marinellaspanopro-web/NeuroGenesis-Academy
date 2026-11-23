import { openProspectMailbox } from "@/lib/prospect-mailbox";

export const dynamic = "force-dynamic";

// This endpoint never imports a sender and performs no writes.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== "Bearer " + secret) return new Response(null, { status: 401 });
  const headers = { "Cache-Control": "no-store" };
  try {
    const mailbox = await openProspectMailbox();
    mailbox.close();
    return Response.json({ mailboxVerified: true, sent: 0 }, { headers });
  } catch {
    return Response.json({ mailboxVerified: false, sent: 0 }, { status: 503, headers });
  }
}
