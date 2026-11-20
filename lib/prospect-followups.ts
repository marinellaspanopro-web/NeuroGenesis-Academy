import { get, put } from "@vercel/blob";
import { dueProspects, type ProspectRecord } from "@/lib/prospect-registry";
import { siteConfig } from "@/lib/site-config";

const RECEIPTS = "prospects/followup-receipts/v1/";
const bookingUrl = "https://neurogenesis.be/entretien";
const emailKey = (row: ProspectRecord) => "neurogenesis-j4-" + row.id;
const receiptPath = (row: ProspectRecord) => RECEIPTS + row.id + ".json";

export async function sendDueFollowups() {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !from) throw new Error("Configuration email manquante");
  const due = await dueProspects();
  const result = { due: due.length, sent: 0, alreadySent: 0, failed: 0 };
  for (const row of due) {
    // Explicit approval is mandatory: pending_review never enters this queue.
    const existing = await get(receiptPath(row), { access: "private", useCache: false });
    if (existing) { result.alreadySent++; continue; }
    const name = row.firstName.replace(/[\r\n]/g, " ").trim();
    const subject = "Votre projet de formation NeuroGenesis";
    const text = [
      "Bonjour " + name + ",",
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
      result.sent++;
    } catch (error) {
      result.failed++;
      console.error("Échec relance J+4", row.id, error);
    }
  }
  return result;
}
