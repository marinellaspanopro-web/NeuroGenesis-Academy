import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { Resend } from "resend";
import { contactSchema, interestLabels, contactPreferenceLabels } from "@/lib/contact-schema";
import { siteConfig } from "@/lib/site-config";
import { hasCycleStarted } from "@/lib/cycle";

export const runtime = "nodejs";
const submissions = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function isRateLimited(ip: string) {
  const now = Date.now();
  for (const [key, times] of submissions) {
    if (times.every((time) => now - time >= WINDOW_MS)) submissions.delete(key);
  }
  const timestamps = (submissions.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  if (timestamps.length >= MAX_PER_WINDOW) return true;
  submissions.set(ip, [...timestamps, now]);
  return false;
}

const failure = (error: string, status: number) => NextResponse.json(
  { error: `${error} Vous pouvez nous appeler au ${siteConfig.phoneDisplay}.` }, { status }
);
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!
);

export async function POST(request: Request) {
  try {
    let body: unknown;
    try { body = await request.json(); } catch { return failure("Le formulaire est illisible.", 400); }
    // Check before validation, so a filled trap never triggers an email.
    if (body && typeof body === "object" && "company" in body && typeof body.company === "string" && body.company.trim()) {
      return NextResponse.json({ ok: true });
    }
    const result = contactSchema.safeParse(body);
    if (!result.success) return failure("Merci de vérifier les champs du formulaire.", 400);
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (isRateLimited(ip)) return failure("Trop de tentatives. Réessayez dans dix minutes.", 429);

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.CONTACT_FROM_EMAIL;
    const to = process.env.CONTACT_TO_EMAIL || siteConfig.email;
    if (!apiKey || !from || from.includes("onboarding@resend.dev")) {
      console.error("Configuration Resend manquante ou expéditeur de test.");
      return failure("Le service d'envoi est temporairement indisponible.", 503);
    }
    const { name, firstName, lastName, email, phone, interest, wantsBrochure, contactPreference, requestType, message } = result.data;
    const displayName = requestType === "brochure" ? name : `${firstName} ${lastName}`;
    const label = requestType === "brochure" ? "brochure" : requestType === "inscription" ? "inscription" : "renseignements";
    const resend = new Resend(apiKey);
    const notification = await resend.emails.send({
      from, to, replyTo: email,
      subject: `Demande de ${label} — ${interestLabels[interest]} — ${displayName}`,
      text: [
        `Nom : ${displayName}`, `Email : ${email}`, `Téléphone : ${phone || "Non renseigné"}`,
        `Type de demande : ${label}`, `Parcours : ${interestLabels[interest]}`,
        `Contact souhaité : ${contactPreferenceLabels[contactPreference]}`,
        `Message : ${message || "Non renseigné"}`,
        `Brochure souhaitée : ${wantsBrochure || requestType === "brochure" ? "Oui" : "Non"}`,
      ].join("\n"),
    });
    if (notification.error || !notification.data?.id) {
      console.error("Échec notification Resend", notification.error?.name);
      return failure("L'envoi de votre demande a échoué. Merci de réessayer.", 502);
    }

    // The request is already received. A secondary failure must not ask the
    // visitor to resubmit (which would create duplicate notifications).
    try {
      const withBrochure = wantsBrochure || requestType === "brochure";
      const attachments = withBrochure ? [{
        filename: "Brochure-NeuroGenesis-Academy.pdf",
        content: await readFile(path.join(process.cwd(), "public", "brochure-neurogenesis-academy.pdf")),
      }] : undefined;
      const intro = requestType === "brochure"
        ? "Merci pour votre demande ! Vous trouverez la brochure complète en pièce jointe."
        : requestType === "renseignement"
          ? "Votre message m'est bien parvenu. Je prendrai personnellement le temps de vous répondre."
          : `Votre demande concernant le parcours « ${interestLabels[interest]} » m'est bien parvenue. Un échange individuel permettra de préciser votre projet et les modalités avant confirmation de votre inscription.`;
      const cycleText = hasCycleStarted() ? siteConfig.session.afterMessage : siteConfig.session.beforeBadge;
      const text = [
        `Bonjour ${firstName || name},`, "", intro,
        ...(requestType === "inscription" || requestType === "brochure" ? ["", cycleText] : []),
        "", `Tarifs des cursus : Technicien ${siteConfig.pricing.technicien.amount}€ ; Praticien ${siteConfig.pricing.praticien.amount}€ ; Pack ${siteConfig.pricing.pack.packPrice}€ (500€ d'économie sur les deux cursus séparés à ${siteConfig.pricing.pack.regularTotal}€).`,
        ...(withBrochure && requestType !== "brochure" ? ["La brochure souhaitée est jointe à ce message."] : []),
        "", `Contact souhaité : ${contactPreferenceLabels[contactPreference]}.`,
        `Pour échanger : ${siteConfig.phoneDisplay}.`,
        "Mes disponibilités : de 10 h à 13 h tous les jours sauf le vendredi, et de 17 h à 19 h tous les jours sauf le jeudi.",
        "", "Bien chaleureusement,", siteConfig.founder, siteConfig.name, siteConfig.email, siteConfig.url,
      ].join("\n");
      const confirmation = await resend.emails.send({
        from, to: email, replyTo: siteConfig.email,
        subject: requestType === "brochure" ? "Votre brochure NeuroGenesis Academy" : `Votre demande de ${label} — NeuroGenesis Academy`,
        text,
        html: `<div lang="fr" style="font-family:Arial,Helvetica,sans-serif;color:#24342c;line-height:1.65;font-size:15px">${text.split("\n\n").map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll("\n", "<br>")}</p>`).join("")}<img src="${siteConfig.url}/logo/logo.png" width="165" alt="NeuroGenesis Academy"></div>`,
        attachments,
      });
      if (confirmation.error || !confirmation.data?.id) throw new Error("Confirmation non acceptée par Resend");
    } catch {
      console.error("Demande reçue, mais confirmation ou brochure non envoyée.");
      return NextResponse.json({ ok: true, warning: `Votre demande est bien reçue, mais l'e-mail de confirmation ou la brochure n'a pas pu être envoyé. Inutile de renvoyer le formulaire : contactez-nous au ${siteConfig.phoneDisplay}.` });
    }
    return NextResponse.json({ ok: true });
  } catch {
    console.error("Erreur API contact.");
    return failure("Une erreur inattendue est survenue lors de l'envoi.", 500);
  }
}
