import { sendDueFollowups } from "@/lib/prospect-followups";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== "Bearer " + secret) return new Response(null, { status: 401 });
  try {
    const result = await sendDueFollowups();
    return Response.json(result, { status: result.failed ? 503 : 200, headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Relances indisponibles" }, { status: 503 });
  }
}
