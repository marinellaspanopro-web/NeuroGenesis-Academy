import assert from "node:assert/strict";
import { spawn } from "node:child_process";

// Exercise the compiled application at the boundary without changing the machine
// clock or a deployed site's configuration. This suite performs GET requests only.
for (const instant of ["2026-10-31T07:59:59.999Z", "2026-10-31T08:00:00Z", "2026-11-01T08:00:00Z"]) {
  const started = instant !== "2026-10-31T07:59:59.999Z";
  const source = `Date.now = () => Date.parse(${JSON.stringify(instant)});
    process.argv = ['node','next','start','--hostname','127.0.0.1','--port','3110'];
    require('./node_modules/next/dist/bin/next');`;
  const server = spawn(process.execPath, ["-e", source], { stdio: ["ignore", "pipe", "pipe"] });
  let logs = "";
  server.stderr.on("data", (data) => { logs += data; });
  const exited = new Promise((resolve) => server.once("exit", resolve));
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Server start timeout: ${logs}`)), 15000);
      server.once("error", (error) => { clearTimeout(timer); reject(error); });
      server.once("exit", (code) => { clearTimeout(timer); reject(new Error(`Server exited ${code}: ${logs}`)); });
      server.stdout.on("data", (data) => { if (data.toString().includes("Ready")) { clearTimeout(timer); resolve(); } });
    });
    async function page(route) {
      const response = await fetch(`http://127.0.0.1:3110${route}`);
      assert.equal(response.status, 200, `${instant} ${route}`);
      return response.text();
    }
    for (const route of ["/", "/formation-technicien", "/formation-praticien", "/contact", "/inscription"]) {
      const html = await page(route);
      const links = [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)]
        .map((match) => ({ href: match[1], text: match[2].replace(/<[^>]*>/g, "") }))
        .filter((link) => link.href.startsWith("/inscription"));
      assert.ok(links.length > 0, route);
      if (started) {
        for (const link of links) {
          assert.ok(["/inscription?parcours=prochain-cycle", "/inscription?parcours=pack", "/inscription?parcours=praticien"].includes(link.href), `${route}: ${link.href}`);
          if (!link.href.endsWith("praticien")) assert.match(link.text, /prochain cycle/i);
        }
      } else assert.ok(links.some((link) => link.href === "/inscription"));
      if (route === "/") assert.equal(html.includes('role="timer"'), !started);
      if (route === "/formation-technicien") {
        assert.match(html, /Calendrier du cycle 2026–2027/);
        assert.equal(html.includes("Inscriptions ouvertes pour le prochain cycle"), started);
      }
    }
    for (const interest of ["", "technicien", "pack", "praticien", "prochain-cycle"]) {
      const html = await page(`/inscription${interest ? `?parcours=${interest}` : ""}`);
      const expected = interest || (started ? "prochain-cycle" : "");
      assert.ok(html.includes(`<option value="${expected}"${expected ? "" : " disabled=\"\""} selected="">`), `Selected pathway: ${interest}`);
      assert.equal(html.includes("Votre demande concerne le prochain cycle Technicien."),
        interest === "prochain-cycle" || (started && interest !== "praticien"));
    }
    console.log(`PASS compiled pages, reservation links, course calendar and pathway selection at ${instant}`);
  } finally {
    server.kill("SIGTERM");
    await exited;
  }
}
