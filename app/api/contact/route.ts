import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema, interestLabels, contactPreferenceLabels } from "@/lib/contact-schema";
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

    const { name, firstName, lastName, email, phone, interest, wantsBrochure, contactPreference, requestType, message } = result.data;
    const displayName = requestType === "brochure" ? name : `${firstName} ${lastName}`.trim();

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
      subject: requestType === "brochure"
        ? `Demande de brochure — ${interestLabels[interest]} — ${displayName}`
        : requestType === "renseignement"
          ? `Demande de renseignements — ${interestLabels[interest]} — ${displayName}`
          : interest === "autre"
          ? `Question — ${displayName}`
          : `Demande d’inscription — ${interestLabels[interest]} — ${displayName}${wantsBrochure ? " · brochure souhaitée" : ""}`,
      text: [
        `Nom : ${displayName}`,
        `Prénom : ${firstName || (requestType === "brochure" ? name : "")}`,
        `Nom de famille : ${lastName || "Non renseigné"}`,
        `Type de demande : ${requestType === "inscription" ? "Demande de réservation" : requestType === "renseignement" ? "Demande de renseignements" : "Brochure seule"}`,
        `Contact souhaité : ${contactPreferenceLabels[contactPreference]}`,
        ...(interest === "autre" ? [`Question : ${message}`] : []),
        `Email : ${email}`,
        `Téléphone : ${phone || "Non renseigné"}`,
        `Intérêt : ${interestLabels[interest]}`,
        `Brochure demandée : ${wantsBrochure ? "Oui (envoyée automatiquement)" : "Non"}`,
      ].join("\n"),
    });

    if (error) {
      console.error("Erreur Resend :", error);
      return NextResponse.json(
        { error: "L'envoi a échoué. Merci de réessayer ou de nous écrire directement." },
        { status: 502 }
      );
    }

    // Le PDF est envoyé immédiatement. Aucun rappel automatisé n'est programmé :
    // le suivi de l'inscription est personnel et respecte la préférence de contact.
    if (requestType === "brochure" && wantsBrochure) {
      const brochureUrl = `${siteConfig.url}/brochure-neurogenesis-academy.pdf`;
      const brochureFirstName = requestType === "brochure" ? name : firstName;

      // La signature reprend le logo PNG déjà présent dans le dépôt.
      // URL absolue afin que le logo puisse s'afficher dans les clients e-mail.
      const logoUrl = new URL("/logo/logo.png", siteConfig.url).toString();
      const safeFirstName = brochureFirstName.replace(/[&<>"']/g, (char) => {
        const entities: Record<string, string> = {
          "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
        };
        return entities[char];
      });

      const { error: brochureError } = await resend.emails.send({
        from: fromAddress,
        to: email,
        replyTo: siteConfig.email,
        subject: "Votre brochure NeuroGenesis Academy",
        html: `
          <div style="font-family:Arial,Helvetica,sans-serif;color:#24342c;line-height:1.6;font-size:15px;">
            <p>Bonjour ${safeFirstName},</p>
            <p>Merci pour votre demande ! Voici en pièce jointe la brochure complète de NeuroGenesis Academy : cursus Technicien et Praticien, dates, tarifs et modules optionnels.</p>
            <p>N'hésitez pas à nous écrire directement si vous avez la moindre question.</p>
            <p style="margin-top:24px;">Bien chaleureusement,<br>
              <strong>Marinella Spano</strong><br>
              NeuroGenesis Academy<br>
              <a href="mailto:${siteConfig.email}" style="color:#0d2b1f;">${siteConfig.email}</a>
              &nbsp;·&nbsp;
              <a href="tel:${siteConfig.phone.replace(/\s/g, "")}" style="color:#0d2b1f;">${siteConfig.phoneDisplay}</a>
            </p>
            <p style="margin-top:14px;">
              <img src="${logoUrl}" width="165" alt="Logo officiel NeuroGenesis Academy"
                   style="display:block;width:165px;max-width:100%;height:auto;border:0;" />
            </p>
          </div>
        `,
        text: [
          `Bonjour ${brochureFirstName},`,
          "",
          "Merci pour votre demande ! Voici en pièce jointe la brochure complète de NeuroGenesis Academy : cursus Technicien et Praticien, dates, tarifs et modules optionnels.",
          "",
          "N'hésitez pas à nous écrire directement si vous avez la moindre question.",
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
    }

    // Une demande d'inscription reçoit toujours son propre accusé de réception,
    // avec le parcours choisi et les prochaines étapes. Si souhaité, le PDF est
    // inclus dans ce même message (un seul e-mail, sans relance automatique).
    if (requestType !== "brochure") {
      const isInformation = requestType === "renseignement";
      const isQuestion = interest === "autre";
      const isUndecided = interest === "a_determiner";
      const selectedPath = interestLabels[interest];
      const htmlEscape = (value: string) =>
        value.replace(/[&<>"']/g, (character) => {
          const entities: Record<string, string> = {
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
          };
          return entities[character];
        });

      const intro = isInformation
        ? "J’ai bien reçu votre demande de renseignements concernant NeuroGenesis Academy."
        : isQuestion
        ? "J'ai bien reçu votre question et je vous remercie de m'avoir écrit."
        : isUndecided
          ? "J'ai bien reçu votre demande concernant votre projet de formation en hypnose et neurosciences."
          : `J'ai bien reçu votre demande concernant le ${selectedPath} en hypnose et neurosciences de NeuroGenesis Academy.`;

      const nextStep = isInformation
        ? "Je prendrai personnellement connaissance de votre demande et reviendrai vers vous pour répondre à vos questions."
        : isQuestion
        ? "Je prendrai personnellement le temps de vous répondre et de préciser avec vous les informations dont vous avez besoin."
        : "Chez NeuroGenesis Academy, chaque demande fait l'objet d'un échange individuel avant la confirmation de l'inscription. Nous pourrons ainsi faire connaissance, préciser votre projet et aborder ensemble les modalités pratiques du parcours choisi.";

      const contactChoice = contactPreference === "telephone"
        ? "Vous avez choisi un contact par téléphone : nous pourrons échanger au numéro que vous avez indiqué."
        : contactPreference === "les_deux"
          ? "Vous avez indiqué que l'e-mail et le téléphone vous conviennent : nous pourrons choisir ensemble le moyen le plus simple."
          : "Vous avez choisi un contact par e-mail : je privilégierai donc ce moyen pour poursuivre nos échanges.";

      const invitation = isInformation || isQuestion
        ? "Si vous souhaitez également en parler de vive voix, je reste joignable au"
        : "Pour convenir de notre échange et avancer vers la confirmation de votre inscription, vous pouvez également me joindre au";

      const hours = "De 10 h à 13 h tous les jours sauf le vendredi, et de 17 h à 19 h tous les jours sauf le jeudi.";
      const brochureNote = "Comme souhaité, vous trouverez également la brochure complète en pièce jointe.";
      const confirmationSubject = isInformation
        ? "Votre demande de renseignements — NeuroGenesis Academy"
        : isQuestion
        ? "Votre question à NeuroGenesis Academy — Bien reçue"
        : `Votre demande d'inscription — ${selectedPath} — NeuroGenesis Academy`;
      const logoUrl = new URL("/logo/logo.png", siteConfig.url).toString();

      const confirmationText = [
        `Bonjour ${firstName},`,
        "",
        "Merci pour votre intérêt envers NeuroGenesis Academy.",
        intro,
        "",
        nextStep,
        "",
        contactChoice,
        `${invitation} ${siteConfig.phoneDisplay}.`,
        `Mes disponibilités : ${hours}`,
        ...(wantsBrochure ? ["", brochureNote] : []),
        "",
        "Au plaisir d'échanger avec vous,",
        "",
        "Marinella Spano",
        "Fondatrice — NeuroGenesis Academy",
        "Hypnose & Neurosciences",
        siteConfig.phoneDisplay,
        siteConfig.email,
        siteConfig.url,
      ].join("\n");

      const confirmationHtml = [
        '<div style="font-family:Arial,Helvetica,sans-serif;color:#24342c;line-height:1.65;font-size:15px;">',
        `<p>Bonjour ${htmlEscape(firstName)},</p>`,
        "<p>Merci pour votre intérêt envers NeuroGenesis Academy.</p>",
        `<p>${htmlEscape(intro)}</p>`,
        `<p>${htmlEscape(nextStep)}</p>`,
        `<p>${htmlEscape(contactChoice)}</p>`,
        `<p>${htmlEscape(invitation)} <a href="tel:+32491730999" style="color:#0d2b1f;font-weight:600;">${siteConfig.phoneDisplay}</a>.<br>${hours}</p>`,
        ...(wantsBrochure ? [`<p>${brochureNote}</p>`] : []),
        '<p style="margin-top:24px;">Au plaisir d\'échanger avec vous,<br><br>',
        '<strong>Marinella Spano</strong><br>Fondatrice — NeuroGenesis Academy<br>',
        'Hypnose &amp; Neurosciences<br>',
        `<a href="tel:+32491730999" style="color:#0d2b1f;">${siteConfig.phoneDisplay}</a><br>`,
        `<a href="mailto:${siteConfig.email}" style="color:#0d2b1f;">${siteConfig.email}</a><br>`,
        `<a href="${siteConfig.url}" style="color:#0d2b1f;">neurogenesis.be</a></p>`,
        `<p style="margin-top:14px;"><img src="${logoUrl}" alt="Logo officiel NeuroGenesis Academy" width="165" style="display:block;width:165px;max-width:100%;height:auto;border:0;"></p>`,
        "</div>",
      ].join("\n");

      const { error: confirmationError } = await resend.emails.send({
        from: fromAddress,
        to: email,
        replyTo: siteConfig.email,
        subject: confirmationSubject,
        text: confirmationText,
        html: confirmationHtml,
        ...(wantsBrochure ? {
          attachments: [{
            filename: "Brochure-NeuroGenesis-Academy.pdf",
            path: new URL("/brochure-neurogenesis-academy.pdf", siteConfig.url).toString(),
          }],
        } : {}),
      });

      if (confirmationError) {
        console.error("Erreur Resend (confirmation de demande) :", confirmationError);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erreur API contact :", err);
    return NextResponse.json({ error: "Une erreur inattendue est survenue." }, { status: 500 });
  }
}
