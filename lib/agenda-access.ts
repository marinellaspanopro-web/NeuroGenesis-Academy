import { createHmac } from "node:crypto";

export function calendarToken() {
  const secret = process.env.CRON_SECRET;
  if (!secret) throw new Error("Agenda non configuré");
  return createHmac("sha256", secret).update("neurogenesis/private-interviews-calendar/v1").digest("hex");
}
