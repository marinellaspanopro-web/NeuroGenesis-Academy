import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { compileFunction } from "node:vm";
import ts from "typescript";

function loader(dependencies) {
  return filename => {
    const source = ts.transpileModule(readFileSync(filename, "utf8"), {
      compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022},
    }).outputText;
    const exports = {};
    compileFunction(source, ["exports", "require"], { filename })(exports, name => {
      assert.ok(name in dependencies, "Unexpected module: " + name);
      return dependencies[name];
    });
    return exports;
  };
}

// J+4 must see the original request and nothing that contradicts the individual review.
{
  const account = "info@neurogenesis.be";
  const sample = { email: "prospect@example.org", brochureSentAt: "2026-11-01T11:00:00Z" };
  const envelope = { from: [{ address: account }], to: [{ address: account }],
    replyTo: [{ address: sample.email }], date: new Date(sample.brochureSentAt),
    subject: "Demande de brochure — Cursus Technicien — Exemple" };
  let folders = ["INBOX", "Sent", "Archive"];
  let matches = { INBOX: [1] };
  let example = envelope;
  class ReadonlyImap {
    constructor(options) { assert.equal(options.secure, true); assert.equal(options.tls.rejectUnauthorized, true); }
    on() {}
    connect() {}
    close() {}
    list() { return folders.map(path => ({path, flags: new Set()})); }
    mailboxOpen(path, options) { assert.deepEqual(options, {readOnly:true}); this.path = path; return {readOnly:true}; }
    search(query) { return query.subject ? [5] : (matches[this.path] ?? []); }
    fetchOne() { return {envelope:example}; }
  }
  const {openProspectMailbox} = loader({imapflow:{ImapFlow:ReadonlyImap}})("lib/prospect-mailbox.ts");
  const previous = process.env.ZIMBRA_IMAP_PASSWORD;
  try {
    delete process.env.ZIMBRA_IMAP_PASSWORD;
    await assert.rejects(openProspectMailbox);
    process.env.ZIMBRA_IMAP_PASSWORD = "fixture";
    const box = await openProspectMailbox();
    assert.equal(await box.clears(sample, account), true);
    for (const uncertain of [{}, {INBOX:[1, 2]}, {INBOX:[1], Sent:[9]}, {INBOX:[1], Archive:[4]}]) {
      matches = uncertain;
      assert.equal(await box.clears(sample, account), false);
    }
    matches = {INBOX:[1]};
    for (const subject of ["Entretien réservé", "Votre inscription", "Re: Demande de brochure", "Demande de brochure — Cursus Praticien — Exemple"]) {
      example = {...envelope, subject};
      assert.equal(await box.clears(sample, account), false);
    }
    matches = {INBOX:false};
    await assert.rejects(box.clears(sample, account));
    folders = ["INBOX"];
    await assert.rejects(openProspectMailbox);
    box.close();
  } finally {
    if (previous === undefined) delete process.env.ZIMBRA_IMAP_PASSWORD;
    else process.env.ZIMBRA_IMAP_PASSWORD = previous;
  }
}

// A denied, missing, or test-only connection must never invoke the sender.
{
  const saved = process.env.CRON_SECRET;
  process.env.CRON_SECRET = "test-only";
  let available = false;
  let sends = 0;
  const isolated = loader({
    "@/lib/prospect-mailbox": {openProspectMailbox:async () => {
      if (!available) throw new Error("fixture unavailable");
      return {close() {}};
    }},
    "@/lib/prospect-followups": {sendDueFollowups:async () => { sends++; return {failed:0}; }},
    "@/lib/prospect-backfill": {backfillLegacyBrochures:async () => ({})},
  });
  const testOnly = isolated("app/api/prospects/mailbox-test/route.ts").GET;
  const cron = isolated("app/api/prospects/followups/route.ts").GET;
  const request = new Request("https://example.org/", { headers:{Authorization:"Bearer test-only"} });
  try {
    assert.equal((await testOnly(new Request("https://example.org/"))).status, 401);
    assert.equal((await testOnly(request)).status, 503);
    assert.equal((await cron(request)).status, 503);
    available = true;
    assert.deepEqual(await (await testOnly(request)).json(), {mailboxVerified:true, sent:0});
    assert.equal(sends, 0);
  } finally {
    if (saved === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = saved;
  }
}
