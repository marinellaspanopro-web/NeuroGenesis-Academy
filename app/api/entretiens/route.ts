import { bookedIds, bookingSchema, reserve, sendPending } from "@/lib/interview-bookings";
import { slots } from "@/lib/entretiens";

export const dynamic = "force-dynamic";
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function GET() {
  try {
    const used = await bookedIds();
    return json({ slots: slots.filter(s => Date.parse(s.id) > Date.now() && !used.has(s.id)) });
  } catch {
    return json({ error: "Les disponibilités sont momentanément inaccessibles." }, 503);
  }
}

export async function POST(request: Request) {
  const result = bookingSchema.safeParse(await request.json().catch(() => null));
  if (!result.success) return json({ error: "Vérifiez vos coordonnées, le numéro de téléphone et le mode d’entretien." }, 400);
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_FROM_EMAIL) return json({ error: "La réservation est momentanément indisponible." }, 503);
  try {
    if (!await reserve(result.data)) return json({ error: "Ce créneau est indisponible. Veuillez en choisir un autre." }, 409);
  } catch {
    return json({ error: "La réservation n’a pas pu être vérifiée. Réessayez avec le même créneau." }, 503);
  }
  try {
    await sendPending(result.data.slotId);
    return json({ confirmed: true });
  } catch {
    console.error("Entretien enregistré, notification en attente.");
    return json({ confirmed: true, mailPending: true });
  }
}
