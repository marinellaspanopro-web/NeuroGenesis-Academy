import { ImapFlow } from "imapflow";
import type { MessageEnvelopeObject } from "imapflow";
import type { ProspectRecord } from "./prospect-registry";

const account = "info@neurogenesis.be";
type Prospect = Pick<ProspectRecord, "email" | "brochureSentAt">;

async function examine(client: ImapFlow, folder: string) {
  const box = await client.mailboxOpen(folder, { readOnly: true });
  if (!box.readOnly) throw new Error("Lecture seule Zimbra non confirmée");
}

function initialRequest(envelope: MessageEnvelopeObject | undefined, prospect: Prospect, sender: string) {
  const recipient = prospect.email.trim().toLowerCase();
  const mailbox = (list: MessageEnvelopeObject["to"], address: string) =>
    list?.length === 1 && list[0].address?.toLowerCase() === address;
  // The website sends the internal request and the prospect's brochure consecutively.
  const elapsed = Date.parse(prospect.brochureSentAt) - new Date(envelope?.date ?? "").getTime();
  return !!envelope && mailbox(envelope.from, sender) && mailbox(envelope.to, account)
    && mailbox(envelope.replyTo, recipient) && !envelope.inReplyTo
    && envelope.subject?.startsWith("Demande de brochure — Cursus Technicien — ")
    && Math.abs(elapsed) <= 5 * 60_000;
}

export async function openProspectMailbox() {
  const pass = process.env.ZIMBRA_IMAP_PASSWORD;
  if (!pass) throw new Error("Identifiant IMAP de production absent");
  const client = new ImapFlow({
    host: "imap.mail.ovh.net", port: 993, secure: true, auth: { user: account, pass },
    tls: { minVersion: "TLSv1.2", rejectUnauthorized: true }, logger: false,
    disableAutoIdle: true, connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 12000,
  });
  let disconnected = false;
  client.on("error", () => { disconnected = true; client.close(); });
  try {
    await client.connect();
    const folders = (await client.list()).filter(f => !f.flags.has("\\Noselect") && !f.flags.has("\\NonExistent"));
    const inbox = folders.find(f => f.path.toUpperCase() === "INBOX");
    const sent = folders.find(f => f.specialUse === "\\Sent" || f.path.toLowerCase() === "sent");
    if (!inbox || !sent) throw new Error("Dossiers requis absents");

    // Exercise authenticated read access, including a search, even when the queue is empty.
    for (const folder of [inbox, sent]) {
      await examine(client, folder.path);
      const result = await client.search({ subject: "brochure" }, { uid: true });
      if (!Array.isArray(result)) throw new Error("Recherche Zimbra incomplète");
    }

    return {
      close: () => client.close(),
      async clears(prospect: Prospect, sender: string) {
        let initialRequests = 0;
        const email = prospect.email.trim().toLowerCase();
        for (const folder of folders) {
          await examine(client, folder.path);
          const matches = await client.search({ or: [
            { from: email }, { to: email }, { cc: email }, { bcc: email },
            { header: { "Reply-To": email } }, { text: email },
          ] }, { uid: true });
          if (!Array.isArray(matches)) throw new Error("Recherche Zimbra incomplète");
          if (!matches.length) continue;
          if (matches.length !== 1 || folder.path !== inbox.path) return false;
          const msg = await client.fetchOne(matches[0], { envelope: true }, { uid: true });
          if (!msg || !initialRequest(msg.envelope, prospect, sender)) return false;
          initialRequests++;
        }
        if (disconnected) throw new Error("Connexion Zimbra interrompue");
        return initialRequests === 1;
      },
    };
  } catch {
    client.close();
    throw new Error("Lecture Zimbra indisponible");
  }
}
