import { calendarToken } from "@/lib/agenda-access";

export const dynamic = "force-dynamic";
function page(content: string, status = 200) {
  return new Response(`<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Agenda privé · NeuroGenesis</title>
  <style>body{background:#f6f1e7;color:#153c31;font:18px/1.5 system-ui;margin:12vh auto;padding:24px;max-width:32em}h1{font:2rem Georgia,serif}button{background:#153c31;color:white;padding:14px 24px;border:0;border-radius:30px;font:inherit}</style>
  <main><h1>Agenda privé des entretiens</h1>${content}</main></html>`, {status, headers:{
    "Content-Type":"text/html; charset=utf-8", "Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow",
  }});
}
export function GET() {
  return page('<p>Recevez le lien d’abonnement dans la boîte Zimbra de l’Académie.</p><form method="post"><button>Recevoir le lien dans Zimbra</button></form>');
}
export async function POST(request: Request) {
  if (request.headers.get("origin") !== "https://neurogenesis.be") return new Response(null, {status:403});
  try {
    const url = "https://neurogenesis.be/api/agenda/entretiens.ics?cle=" + calendarToken();
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: "Bearer " + process.env.RESEND_API_KEY,
        "Content-Type": "application/json", "Idempotency-Key": "agenda-iphone-v1-" + new Date().toISOString().slice(0,10) },
      body: JSON.stringify({from:process.env.CONTACT_FROM_EMAIL, to:"info@neurogenesis.be",
        subject:"Ton agenda privé des entretiens NeuroGenesis",
        html:`<p>Bonjour Marinella,</p><p><a href="${url.replace("https:", "webcal:")}">Ajouter les entretiens à mon calendrier iPhone</a></p><p>Si ce bouton ne s’ouvre pas, copie cette adresse dans Calendrier → Calendriers → Ajouter un calendrier avec abonnement :</p><p>${url}</p><p>Ce lien donne accès aux coordonnées des personnes inscrites. Garde-le pour toi.</p>`}),
    });
    if (!response.ok) throw new Error("Envoi indisponible");
    return page("<p>Le lien a été envoyé à info@neurogenesis.be. Ouvrez le message dans Zimbra sur votre iPhone.</p>");
  } catch {
    return page("<p>Le lien n’a pas pu être envoyé. Réessayez dans quelques minutes.</p>",503);
  }
}
