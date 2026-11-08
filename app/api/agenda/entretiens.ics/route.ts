import { timingSafeEqual } from "node:crypto";
import { calendarToken } from "@/lib/agenda-access";
import { bookedIds, readBooking } from "@/lib/interview-bookings";
import { methods, slots } from "@/lib/entretiens";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow", "Referrer-Policy": "no-referrer" };
const utc = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
function escapeText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\r\n|\r|\n/g, "\\n").replace(/([,;])/g, "\\$1");
}

// Fold long iCalendar lines at UTF-8 character boundaries.
function fold(value: string) {
  let result = "", bytes = 0;
  for (const char of value) {
    const size = Buffer.byteLength(char);
    if (bytes + size > 75) { result += "\r\n "; bytes = 1; }
    result += char;
    bytes += size;
  }
  return result;
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("cle") || "";
  if (!/^[a-f0-9]{64}$/.test(token) || !timingSafeEqual(Buffer.from(token), Buffer.from(calendarToken()))) {
    return new Response(null, { status: 404, headers });
  }
  try {
    const booked = await bookedIds();
    const events = await Promise.all(slots.map(async slot => {
      const booking = booked.has(slot.id) ? await readBooking(slot.id) : null;
      if (!booking && booked.has(slot.id)) throw new Error("Réservation indisponible");
      const start = new Date(slot.id);
      const title = booking ? "Réservé · " + booking.firstName + " " + booking.lastName : "Libre · Entretien offert";
      const details = booking ? [methods[booking.method], booking.phone, booking.email].join("\n") : "Créneau disponible sur le site.";
      return ["BEGIN:VEVENT", "UID:entretien-" + start.getTime() + "@neurogenesis.be",
        "DTSTAMP:" + utc(new Date()), "DTSTART:" + utc(start), "DTEND:" + utc(new Date(+start + 1800000)),
        "SEQUENCE:" + (booking ? 1 : 0), "CLASS:PRIVATE", "TRANSP:" + (booking ? "OPAQUE" : "TRANSPARENT"),
        "SUMMARY:" + escapeText(title), "DESCRIPTION:" + escapeText(details), "END:VEVENT"];
    }));
    const calendar = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//NeuroGenesis Academy//Entretiens//FR",
      "X-WR-CALNAME:Entretiens NeuroGenesis", ...events.flat(), "END:VCALENDAR"];
    return new Response(calendar.map(fold).join("\r\n") + "\r\n", {
      headers: { ...headers, "Content-Type": "text/calendar; charset=utf-8" },
    });
  } catch {
    return new Response(null, { status: 503, headers });
  }
}
