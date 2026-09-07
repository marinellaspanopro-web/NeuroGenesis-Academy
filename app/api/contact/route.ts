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

    const { name, email, phone, interest, message } = result.data;

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
      subject: `Nouveau contact — ${interestLabels[interest]} — ${name}`,
      text: [
        `Nom : ${name}`,
        `Email : ${email}`,
        `Téléphone : ${phone || "Non renseigné"}`,
        `Intérêt : ${interestLabels[interest]}`,
        "",
        "Message :",
        message,
      ].join("\n"),
    });

    if (error) {
      console.error("Erreur Resend :", error);
      return NextResponse.json(
        { error: "L'envoi a échoué. Merci de réessayer ou de nous écrire directement." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erreur API contact :", err);
    return NextResponse.json({ error: "Une erreur inattendue est survenue." }, { status: 500 });
  }
}
