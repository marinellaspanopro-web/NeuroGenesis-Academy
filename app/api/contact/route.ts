import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { Resend } from "resend";
import { contactSchema, interestLabels, contactPreferenceLabels } from "@/lib/contact-schema";
import { siteConfig } from "@/lib/site-config";

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
      const signature = `${siteConfig.founder}\nFondatrice de NeuroGenesis Academy\n${siteConfig.email}`;
      const messages = {
        inscription: {
          subject: "Votre projet de formation chez NeuroGenesis",
          paragraphs: [
            "Merci de m’avoir écrit et de vous intéresser à NeuroGenesis.",
            "Choisir une formation, c’est aussi choisir une personne et un cadre dans lesquels on se sent bien pour apprendre. Je serais heureuse de découvrir ce qui vous amène vers l’hypnose, ce que vous souhaitez en faire et de répondre aux questions que vous vous posez.",
            "Je reprendrai contact avec vous selon la préférence indiquée dans votre demande. Nous pourrons prendre le temps d’échanger sur votre projet et les modalités du parcours, avant de confirmer votre inscription.",
            ...(withBrochure ? ["Vous trouverez également la brochure en pièce jointe, pour la parcourir tranquillement d’ici là."] : []),
            `Si vous préférez m’appeler, vous pouvez me joindre au ${siteConfig.phoneDisplay}.`,
            "Au plaisir de faire votre connaissance,",
          ],
        },
        renseignement: {
          subject: "Merci pour votre message — NeuroGenesis",
          paragraphs: [
            "Merci de m’avoir écrit.",
            "J’ai bien reçu votre message et je prendrai le temps de vous répondre. Que votre projet soit déjà précis ou encore en réflexion, cet échange sera l’occasion de faire connaissance et de vous aider à y voir plus clair.",
            `Je vous recontacterai selon la préférence indiquée dans votre demande. Si vous souhaitez m’en parler directement, vous pouvez aussi me joindre au ${siteConfig.phoneDisplay}.`,
            ...(withBrochure ? ["Je vous joins également la brochure que vous avez souhaité recevoir."] : []),
            "Au plaisir d’échanger avec vous,",
          ],
        },
        brochure: {
          subject: "Votre brochure NeuroGenesis, à découvrir à votre rythme",
          paragraphs: [
            "Merci de votre intérêt pour NeuroGenesis.",
            "Vous trouverez en pièce jointe la brochure de l’Académie. Elle vous permettra de découvrir les parcours Technicien et Praticien, les contenus de formation et les informations pratiques.",
            "Prenez le temps de la parcourir tranquillement, en pensant à ce que vous aimeriez apprendre et à la place que l’hypnose pourrait prendre dans votre vie ou votre activité.",
            "Si une question vous vient au fil des pages, vous pouvez simplement répondre à cet e-mail. Je serai heureuse d’en discuter avec vous et de vous aider à choisir le parcours qui vous correspond.",
            `Vous pouvez également m’appeler au ${siteConfig.phoneDisplay}.`,
            "Au plaisir de découvrir votre projet,",
          ],
        },
      };
      const selectedMessage = messages[requestType];
      const text = [
        `Bonjour ${firstName || name},`,
        ...selectedMessage.paragraphs,
        signature,
      ].join("\n\n");
      const confirmation = await resend.emails.send({
        from, to: email, replyTo: siteConfig.email,
        subject: selectedMessage.subject,
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
