import assert from "node:assert/strict";
const origin = process.env.TEST_ORIGIN || "http://127.0.0.1:3100";
const paths = ["/", "/inscription", "/contact", "/formation-technicien", "/formation-praticien", "/fondatrice", "/faq", "/mentions-legales", "/supervision-accompagnement"];
for (const route of paths) {
 const response = await fetch(origin + route); assert.equal(response.status,200,route);
 const html=await response.text();
 const canonical=html.match(/<link rel="canonical" href="([^"]+)"/)[1];
 const og=html.match(/<meta property="og:url" content="([^"]+)"/)[1];
 assert.equal(new URL(canonical).href,new URL(route,"https://neurogenesis.be").href);assert.equal(new URL(og).href,new URL(canonical).href);
 assert.doesNotMatch(html,/<meta name="keywords"/);
 for(const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
  const schema=JSON.parse(match[1]);
  if(schema["@type"]==="Course") {
   const expected=route==="/"?4149:route==="/formation-technicien"?1899:2750;
   assert.equal(schema.offers.price,expected);assert.equal(schema.offers.priceCurrency,"EUR");assert.ok(!schema.offers.priceValidUntil);
  }
 }
 if(route==="/inscription")assert.match(html,/<title>Réserver ma place — Formation Hypnose à Namur \| NeuroGenesis<\/title>/);
 if(route==="/formation-technicien")assert.match(html,/<title>Cursus Technicien en Hypnose &amp; Neurosciences à Namur \| NeuroGenesis<\/title>/);
 console.log("PASS metadata + JSON-LD", route);
}
for(const parcours of ["pack","technicien","praticien","prochain-cycle"]) {
 const html=await (await fetch(origin+"/inscription?parcours="+parcours)).text();
 assert.match(html,new RegExp(`<option value="${parcours}" selected="">`));
}
const contact=await (await fetch(origin+"/contact?demarche=inscription")).text();assert.match(contact,/Demande de renseignements/);assert.match(contact,/name="message"/);
const pdf=await fetch(origin+"/brochure-neurogenesis-academy.pdf");assert.equal(pdf.status,200);assert.match(pdf.headers.get("content-type"),/pdf/);
console.log("PASS: 4 pathway selections, contact-only mode, brochure HTTP delivery.");
