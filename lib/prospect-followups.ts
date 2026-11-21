import { get, put } from "@vercel/blob";
import { dueProspects, readProspect, saveProspect, type ProspectRecord } from "@/lib/prospect-registry";
import { bookedEmailAddresses } from "@/lib/interview-bookings";
import { siteConfig } from "@/lib/site-config";

const RECEIPTS = "prospects/followup-receipts/v1/";
const bookingUrl = "https://neurogenesis.be/entretien";
const emailKey = (row: ProspectRecord) => "neurogenesis-j4-" + row.id;
const receiptPath = (row: ProspectRecord) => RECEIPTS + row.id + ".json";

async function resendLookup(key: string, route: string) {
  const response = await fetch("https://api.resend.com/" + route, {
    headers: { Authorization: "Bearer " + key },
    signal: AbortSignal.timeout(10000),
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Contrôle des oppositions Resend indisponible : " + response.status);
  return await response.json() as { unsubscribed?: boolean; email?: string };
}

export async function sendDueFollowups() {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !from) throw new Error("Configuration email manquante");
  const due = await dueProspects();
  const booked = await bookedEmailAddresses();
  const result = { due: due.length, sent: 0, alreadySent: 0, excluded: 0, failed: 0 };
  for (const row of due) {
    // Re-read before delivery: the prospect may have replied/registered since the queue was built.
    const current = await readProspect(row.email);
    if (!current || current.status !== "eligible" || current.reviewedAt !== row.reviewedAt) {
      result.excluded++; continue;
    }
    if (booked.has(row.email.trim().toLowerCase())) {
      await saveProspect({ ...current, status: "excluded", reason: "Entretien déjà réservé" });
      result.excluded++; continue;
    }
    // Resend suppression and audience opt-out checks MUST succeed; fail closed if unavailable.
    try {
      const suppressed = await resendLookup(key, "suppressions/" + encodeURIComponent(row.email));
      const contact = await resendLookup(key, "contacts/" + encodeURIComponent(row.email));
      if (suppressed || contact?.unsubscribed === true) {
        await saveProspect({ ...current, status: "excluded", reason: "Opposition ou suppression Resend" });
        result.excluded++; continue;
      }
    } catch (error) {
      result.failed++; console.error("Contrôle anti-sollicitation impossible", row.id, error);
      continue;
    }
    // Explicit approval is mandatory: pending_review never enters this queue.
    const existing = await get(receiptPath(row), { access: "private", useCache: false });
    if (existing) {
      result.alreadySent++;
      if (row.status !== "sent") {
        const receipt = await new Response(existing.stream).json() as { id?: string; sentAt?: string };
        await saveProspect({ ...row, status: "sent", followupEmailId: receipt.id, followupSentAt: receipt.sentAt });
      }
      continue;
    }
    const name = row.firstName.replace(/[\r\n]/g, " ").trim();
    const subject = "Votre projet de formation NeuroGenesis";
    const text = [
      "Bonjour " + name + ",",
      row.messageVariant === "genevieve" ?
        "Lors de nos échanges, vous souhaitiez prendre le temps de découvrir la brochure et d’envisager tranquillement une prochaine session. Je reviens vers vous dans cet esprit." :
      row.messageVariant === "marine" ?
        "Je reviens personnellement vers vous au sujet de votre projet de formation et de la session de janvier 2027." :
        "Je me permets de revenir vers vous quelques jours après l’envoi de notre brochure NeuroGenesis Academy.",
      "Avez-vous eu l’occasion de la parcourir ?",
      "Peut-être certaines questions ont-elles émergé concernant le programme, la pratique ou la manière dont cette formation pourrait s’intégrer dans votre parcours.",
      "Je serais ravie d’en discuter avec vous lors d’un entretien découverte offert de 30 minutes, afin de faire connaissance et d’explorer ensemble votre projet.",
      "Voici le lien pour choisir le créneau de votre entretien offert : " + bookingUrl,
      ...(Date.now() <= Date.parse("2026-12-01T23:59:59+01:00") ? ["Le tarif préférentiel de 1 549 € au lieu de 1 899 € reste accessible pour la session Technicien débutant les 23 et 24 janvier 2027, moyennant un acompte de 300 € versé au plus tard le 1er décembre 2026."] : []),
      "Au plaisir d’échanger avec vous,",
      "Chaleureusement,",
      "Marinella Spano\nNeuroGenesis Academy – Hypnose & Neurosciences\n" + siteConfig.email,
    ].join("\n\n");
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + key,
          "Content-Type": "application/json",
          "Idempotency-Key": emailKey(row),
        },
        body: JSON.stringify({ from, to: row.email, reply_to: siteConfig.email, subject, text }),
        signal: AbortSignal.timeout(15000),
      });
      const body = await response.json() as { id?: string };
      if (!response.ok || !body.id) throw new Error("Envoi refusé");
      await put(receiptPath(row), JSON.stringify({ id: body.id, sentAt: new Date().toISOString() }), {
        access: "private", addRandomSuffix: false, allowOverwrite: true,
      });
      await saveProspect({ ...row, status: "sent", followupEmailId: body.id, followupSentAt: new Date().toISOString() });
      result.sent++;
    } catch (error) {
      result.failed++;
      console.error("Échec relance J+4", row.id, error);
    }
  }
  return result;
}
