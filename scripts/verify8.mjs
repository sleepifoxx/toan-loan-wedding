import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://localhost:8765/index.html", { waitUntil: "networkidle" });

async function dump(label) {
  const data = await page.evaluate(() => {
    function info(sel) {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return { transform: cs.transform, opacity: cs.opacity, zIndex: cs.zIndex, top: r.top, height: r.height };
    }
    return {
      card: info(".env-card"),
      flap: info(".env-flap"),
      pocket: info(".env-pocket"),
      seal: info(".env-seal"),
      envelopeOpen: document.getElementById("envelope").classList.contains("open"),
    };
  });
  console.log(label, JSON.stringify(data));
}

await dump("t=0 (before click)");
const t0 = Date.now();
await page.click("#envelope");
for (const target of [50, 100, 150, 200, 250, 300, 400, 550, 700, 1000, 1350, 1500]) {
  const wait = target - (Date.now() - t0);
  if (wait > 0) await page.waitForTimeout(wait);
  await dump("t=" + (Date.now() - t0));
}
await browser.close();
