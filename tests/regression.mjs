import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const ts = require("typescript");
const root = process.cwd();
function loader(mocks = {}) {
  const cache = new Map();
  function load(file) {
    file = path.resolve(root, file);
    if (cache.has(file)) return cache.get(file).exports;
    const compiled = { exports: {} }; cache.set(file, compiled);
    const source = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    const localRequire = (id) => {
      if (id in mocks) return mocks[id];
      if (id.startsWith("@/")) {
        const stem = id.slice(2);
        return load([stem + ".ts", stem + ".tsx"].find((p) => fs.existsSync(path.join(root, p))));
      }
      return require(id);
    };
    vm.runInThisContext(`(function(require,module,exports){${source}\n})`, { filename: file })(localRequire,compiled,compiled.exports);
    return compiled.exports;
  }
  return load;
}
const load = loader();
const { siteConfig } = load("lib/site-config.ts");
const { hasCycleStarted } = load("lib/cycle.ts");
assert.equal(hasCycleStarted(Date.parse("2026-10-31T07:59:59.999Z")), false);
assert.equal(hasCycleStarted(Date.parse("2026-10-31T08:00:00Z")), true);
assert.equal(hasCycleStarted(Date.parse("2026-11-01T08:00:00Z")), true);
assert.match(new Intl.DateTimeFormat("fr-BE", { timeZone: siteConfig.session.timeZone, hour: "2-digit", minute: "2-digit" }).format(new Date(siteConfig.session.isoDeadline)), /09:00/);
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const Provider = load("components/shared/CycleProvider.tsx").default;
const Countdown = load("components/shared/Countdown.tsx").default;
const render = (date) => renderToStaticMarkup(React.createElement(Provider,{initialNow:Date.parse(date)},React.createElement(Countdown,{target:siteConfig.session.isoDeadline})));
assert.match(render("2026-10-31T07:59:59Z"),/role="timer"/);
assert.doesNotMatch(render("2026-10-31T08:00:00Z"),/role="timer"/);
assert.match(render("2026-10-31T08:00:00Z"),/parcours=prochain-cycle/);
const EnrollmentButton = load("components/shared/EnrollmentButton.tsx").default;
const ContactForm = load("components/shared/ContactForm.tsx").default;
const renderAt = (date, component, props = {}) => renderToStaticMarkup(React.createElement(Provider,
 {initialNow:Date.parse(date)},React.createElement(component,props)));
for (const date of ["2026-10-31T07:59:59.999Z", "2026-10-31T08:00:00Z", "2026-11-01T08:00:00Z"]) {
 const started = date !== "2026-10-31T07:59:59.999Z";
 for (const pathway of [undefined,"technicien","pack","praticien"]) {
  const html = renderAt(date, EnrollmentButton, {pathway,children:"Réserver ma place"});
  const expected = started && (!pathway || pathway === "technicien") ? "/inscription?parcours=prochain-cycle" : pathway ? `/inscription?parcours=${pathway}` : "/inscription";
  assert.ok(html.includes(`href="${expected}"`));
  assert.equal(/prochain cycle/i.test(html), started && pathway !== "praticien");
 }
 for (const interest of [undefined,"technicien","pack","praticien","prochain-cycle"]) {
  const html = renderAt(date, ContactForm, {mode:"inscription",initialInterest:interest});
  const next = interest === "prochain-cycle" || (started && interest !== "praticien");
  assert.equal(html.includes(siteConfig.session.nextMessage), next);
  if (interest) assert.ok(html.includes(`<option value="${interest}" selected="">`));
  if (!interest && started) assert.ok(html.includes('<option value="prochain-cycle" selected="">'));
 }
 assert.ok(!renderAt(date, ContactForm, {mode:"renseignement",initialInterest:"pack"}).includes(siteConfig.session.nextMessage));
}
const { courseSchema } = load("lib/schema.ts");
for (const price of [1899,2750,4149]) {
 const schema=courseSchema({name:"Cursus",description:"Formation",url:siteConfig.url,price,duration:"PT115H"});
 assert.equal(schema.offers.price,price);assert.equal(schema.offers.priceCurrency,"EUR");assert.ok(!("priceValidUntil" in schema.offers));
}
const valid = {firstName:"Test",lastName:"Qualité",email:"test@example.com",interest:"pack",requestType:"inscription",company:""};
let sends = [], failAt = 0;
class MockResend { emails = { send: async (data) => { sends.push(data); return sends.length === failAt ? {error:{name:"test_failure"},data:null} : {error:null,data:{id:"test-id"}}; } }; }
const { POST } = loader({resend:{Resend:MockResend}})("app/api/contact/route.ts");
let serial = 0;
async function submit(payload, ip = `test-${serial++}`) {
 sends=[];const response=await POST(new Request("http://localhost/api/contact", {method:"POST",headers:{"content-type":"application/json","x-forwarded-for":ip},body:typeof payload === "string" ? payload : JSON.stringify(payload)}));
 return {status:response.status,body:await response.json()};
}
const oldEnv={...process.env};
const realNow = Date.now;
try {
 process.env.RESEND_API_KEY="test-key";process.env.CONTACT_FROM_EMAIL="NeuroGenesis <contact@neurogenesis.be>";process.env.CONTACT_TO_EMAIL="info@neurogenesis.be";
 for (const payload of [valid,{...valid,requestType:"renseignement",message:"Question de test conservée"},{name:"Test",email:"test@example.com",requestType:"brochure",interest:"technicien",wantsBrochure:true,company:""},{...valid,interest:"prochain-cycle",wantsBrochure:true}]) {
  const r=await submit(payload); assert.equal(r.status,200);assert.equal(r.body.ok,true);assert.ok(!r.body.warning);assert.equal(sends.length,2);assert.equal(sends[0].to,"info@neurogenesis.be");assert.equal(sends[0].replyTo,payload.email);
  if(payload.message)assert.match(sends[0].text,/Question de test conservée/);
  if(payload.wantsBrochure)assert.ok(sends[1].attachments[0].content.length>1000);
 }
 // A form opened before the deadline and submitted afterwards must reach the next cycle.
 for (const date of ["2026-10-31T07:59:59.999Z", "2026-10-31T08:00:00Z", "2026-11-01T08:00:00Z"]) {
  Date.now = () => Date.parse(date);
  for (const interest of ["technicien","pack","praticien","prochain-cycle"]) {
   assert.equal((await submit({...valid,interest})).status,200);
   const next = interest === "prochain-cycle" || (date !== "2026-10-31T07:59:59.999Z" && interest !== "praticien");
   assert.equal(sends[0].text.includes("Cycle demandé :"),next);
   assert.equal(sends[1].text.includes(siteConfig.session.nextMessage),next);
   assert.ok(sends[0].text.includes(load("lib/contact-schema.ts").interestLabels[interest]));
  }
 }
 Date.now = realNow;
 assert.equal((await submit({...valid,email:"invalid"})).status,400);assert.equal(sends.length,0);
 assert.equal((await submit("invalid json")).status,400);
 assert.equal((await submit({...valid,company:"spam"})).status,200);assert.equal(sends.length,0);
 assert.equal((await submit({...valid,contactPreference:"telephone",phone:""})).status,400);
 delete process.env.RESEND_API_KEY;assert.equal((await submit(valid)).status,503);assert.equal(sends.length,0);process.env.RESEND_API_KEY="test-key";
 failAt=1;assert.equal((await submit(valid)).status,502);assert.equal(sends.length,1);
 failAt=2;const partial=await submit(valid);assert.equal(partial.status,200);assert.match(partial.body.warning,/demande est bien reçue/);assert.match(partial.body.warning,/\+32 491 73 09 99/);
 failAt=0;
 for(let i=0;i<5;i++) assert.equal((await submit(valid,"same-ip")).status,200);
 assert.equal((await submit(valid,"same-ip")).status,429);assert.equal(sends.length,0);
} finally { Date.now = realNow; for(const key of ["RESEND_API_KEY","CONTACT_FROM_EMAIL","CONTACT_TO_EMAIL"]) {if(oldEnv[key]===undefined)delete process.env[key];else process.env[key]=oldEnv[key];} }
console.log("PASS: cycle boundary + server rendering, Course/Offer prices, form validation, all request types, attachment, notification/confirmation failures, honeypot and rate limit. No real email sent.");
