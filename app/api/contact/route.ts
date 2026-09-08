import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema, interestLabels } from "@/lib/contact-schema";
import { siteConfig } from "@/lib/site-config";

// Rate limiting basique en mémoire (par instance) — freine le spam sans
// nécessiter d'infrastructure supplémentaire pour un formulaire à faible volume.
const submissions = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function isRateLimited(ip: string) {
  const now = Date.now();
  const timestamps = (submissions.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  submissions.set(ip, timestamps);
  return timestamps.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Trop de tentatives. Merci de réessayer dans quelques minutes." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Le formulaire contient des erreurs.", issues: result.error.issues },
        { status: 400 }
      );
    }

    // Honeypot rempli → bot silencieusement ignoré (réponse de succès factice).
    if (result.data.company) {
      return NextResponse.json({ ok: true });
    }

    const { name, email, phone, interest, wantsBrochure } = result.data;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY manquante — email non envoyé.");
      return NextResponse.json(
        { error: "Le service d'envoi n'est pas configuré. Merci de réessayer plus tard." },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);
    const toAddress = process.env.CONTACT_TO_EMAIL || siteConfig.email;
    const fromAddress = process.env.CONTACT_FROM_EMAIL || "NeuroGenesis Academy <onboarding@resend.dev>";

    const { error } = await resend.emails.send({
      from: fromAddress,
      to: toAddress,
      replyTo: email,
      subject: `Nouveau contact — ${interestLabels[interest]} — ${name}${wantsBrochure ? " · brochure demandée" : ""}`,
      text: [
        `Nom : ${name}`,
        `Email : ${email}`,
        `Téléphone : ${phone || "Non renseigné"}`,
        `Intérêt : ${interestLabels[interest]}`,
        `Brochure demandée : ${wantsBrochure ? "Oui (envoyée automatiquement + relance programmée)" : "Non"}`,
      ].join("\n"),
    });

    if (error) {
      console.error("Erreur Resend :", error);
      return NextResponse.json(
        { error: "L'envoi a échoué. Merci de réessayer ou de nous écrire directement." },
        { status: 502 }
      );
    }

    // Si la personne a coché "je veux la brochure" : on la lui envoie
    // immédiatement en pièce jointe, puis on programme une relance
    // automatique quelques jours plus tard pour s'assurer qu'elle l'a bien
    // reçue et répondre à d'éventuelles questions. Ces deux envois ne
    // doivent jamais faire échouer la soumission du formulaire elle-même
    // (la notification interne ci-dessus est le seul envoi critique) : on
    // logue une erreur éventuelle sans la remonter au visiteur.
    if (wantsBrochure) {
      const brochureUrl = `${siteConfig.url}/brochure-neurogenesis-academy.pdf`;
      const firstName = name.trim().split(/\s+/)[0] || name;

      const { error: brochureError } = await resend.emails.send({
        from: fromAddress,
        to: email,
        replyTo: siteConfig.email,
        subject: "Votre brochure NeuroGenesis Academy",
        text: [
          `Bonjour ${firstName},`,
          "",
          "Merci pour votre demande ! Voici en pièce jointe la brochure complète de NeuroGenesis Academy : cursus Technicien et Praticien, dates, tarifs et modules optionnels.",
          "",
          "Nous revenons vers vous très prochainement si vous nous avez laissé une question. En attendant, n'hésitez pas à nous écrire directement pour tout complément d'information.",
          "",
          `${siteConfig.founder}`,
          "NeuroGenesis Academy",
          `${siteConfig.email} · ${siteConfig.phoneDisplay}`,
        ].join("\n"),
        attachments: [
          {
            filename: "Brochure-NeuroGenesis-Academy.pdf",
            path: brochureUrl,
          },
        ],
      });

      if (brochureError) {
        console.error("Erreur Resend (envoi brochure) :", brochureError);
      }

      const followUpDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString();

      const { error: followUpError } = await resend.emails.send({
        from: fromAddress,
        to: email,
        replyTo: siteConfig.email,
        subject: "Avez-vous bien reçu votre brochure NeuroGenesis Academy ?",
        text: [
          `Bonjour ${firstName},`,
          "",
          "Il y a quelques jours, vous nous avez contactés et avez demandé la brochure de NeuroGenesis Academy — je voulais simplement m'assurer qu'elle vous est bien parvenue.",
          "",
          "Avez-vous des questions sur le cursus Technicien, le cursus Praticien, les dates ou les modalités de paiement ? Je me ferais un plaisir d'y répondre directement.",
          "",
          `Vous pouvez me répondre à ce message, ou me joindre au ${siteConfig.phoneDisplay}.`,
          "",
          `${siteConfig.founder}`,
          "NeuroGenesis Academy",
        ].join("\n"),
        scheduledAt: followUpDate,
      });

      if (followUpError) {
        console.error("Erreur Resend (relance programmée) :", followUpError);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erreur API contact :", err);
    return NextResponse.json({ error: "Une erreur inattendue est survenue." }, { status: 500 });
  }
}
