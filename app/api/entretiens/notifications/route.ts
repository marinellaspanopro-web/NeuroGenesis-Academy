import { bookedIds, sendPending } from "@/lib/interview-bookings";

export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== "Bearer " + secret) return new Response(null, { status: 401 });
  const pending = await bookedIds();
  let failures = 0;
  for (const row of pending) {
    try { await sendPending(row); } catch { failures++; }
  }
  return Response.json({ pending: failures }, { status: failures ? 503 : 200 });
}
