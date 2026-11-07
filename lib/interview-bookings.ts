import { get, list, put } from "@vercel/blob";
import { z } from "zod";
import { methods, slots } from "@/lib/entretiens";

const zimbra = "info@neurogenesis.be";
const prefix = "entretiens/2026/";
const pathFor = (id: string) => prefix + Date.parse(id) + ".json";
const name = z.string().trim().min(1).max(100).regex(/^[^\r\n]+$/);
export const bookingSchema = z.object({
  slotId: z.string().refine(id => slots.some(s => s.id === id)), requestId: z.string().uuid(),
  firstName: name, lastName: name, email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).regex(/^\+?[\d\s().-]+$/).refine(p => /^\d{7,15}$/.test(p.replace(/\D/g, ""))),
  method: z.enum(["telephone", "whatsapp"]), company: z.literal("").optional(),
});
type Booking = z.infer<typeof bookingSchema>;


async function readBooking(id: string): Promise<Booking | null> {
  const file = await get(pathFor(id), { access: "private", useCache: false });
  if (!file || file.statusCode !== 200) return null;
  return bookingSchema.parse(await new Response(file.stream).json());
}

export async function bookedIds() {
  const { blobs } = await list({ prefix });
  return new Set(blobs.map(b => new Date(Number(b.pathname.slice(prefix.length, -5))).toISOString()));
}

export async function reserve(b: Booking) {
  if (Date.parse(b.slotId) <= Date.now()) return false;
  try {
    await put(pathFor(b.slotId), JSON.stringify(b), { access: "private", addRandomSuffix: false, allowOverwrite: false });
    return true;
  } catch (error) {
    const existing = await readBooking(b.slotId);
    if (!existing) throw error;
    return JSON.stringify(existing) === JSON.stringify(b);
  }
}

export async function sendPending(slotId: string) {
  const from = process.env.CONTACT_FROM_EMAIL;
  const key = process.env.RESEND_API_KEY;
  if (!from || !key) throw new Error("Messagerie indisponible.");
  const row = await readBooking(slotId);
  const slot = slots.find(s => s.id === slotId);
  if (!slot || !row) throw new Error("Créneau inconnu.");
  const when = slot.day + " 2026, " + slot.hours + " (heure belge)";
  const method = methods[row.method];
  const details = [when, method, "Numéro à appeler : " + row.phone].join("\n");
  const receiptPrefix = "confirmations/" + Date.parse(slotId) + "/";
  const { blobs } = await list({ prefix: receiptPrefix });
  for (const recipient of ["office", "candidate"] as const) {
      const receipt = receiptPrefix + recipient;
      if (blobs.some(b => b.pathname === receipt)) continue;
      const office = recipient === "office";
      const payload = {
        from, to: office ? zimbra : row.email, reply_to: office ? row.email : zimbra,
        subject: (office ? "Entretien réservé — " : "Votre entretien offert — ") + when,
        text: office ? [row.firstName + " " + row.lastName, row.email, details].join("\n") :
          ["Bonjour " + row.firstName + ",", "Votre entretien individuel offert de 30 minutes est confirmé.",
            details, "Je vous appellerai au numéro indiqué. À bientôt,", "Marinella Spano · NeuroGenesis Academy"].join("\n\n"),
      };
      const reply = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: "Bearer " + key, "Content-Type": "application/json",
          "Idempotency-Key": row.requestId + "-" + recipient },
        body: JSON.stringify(payload), signal: AbortSignal.timeout(8000),
      });
      if (!reply.ok || !(await reply.json()).id) throw new Error("Envoi à reprendre.");
      await put(receipt, "ok", { access: "private", addRandomSuffix: false, allowOverwrite: true });
  }
}
