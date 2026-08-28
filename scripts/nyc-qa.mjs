import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { fromRoot } from "./project-root.mjs";

const screenshots = fromRoot("screenshots");
mkdirSync(screenshots, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});

const clickText = async (re) => {
  await page.waitForTimeout(200);
  const ok = await page.evaluate((pattern) => {
    const rx = new RegExp(pattern);
    const nodes = [...document.querySelectorAll("button, a, [role='button']")];
    const el = nodes.find((n) => rx.test((n.textContent || "").replace(/\s+/g, " ").trim()));
    if (!el) return false;
    el.click();
    return true;
  }, re);
  if (!ok) throw new Error(`click miss: ${re}`);
};

await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle", timeout: 30000 });
await clickText("בחירת מסלול|Choose track");
await page.waitForTimeout(400);
await clickText("^ניו יורק$|^New York$");
await page.waitForTimeout(350);
await page.screenshot({ path: `${screenshots}/tracks-nyc.png` });

const tracks = [
  { re: "סנטרל פארק|Central Park", file: "race-centralpark", night: false },
  { re: "טיימס סקוואר|Times Square", file: "race-timessquare", night: true },
  { re: "גשר ברוקלין|Brooklyn Bridge", file: "race-brooklynbridge", night: false },
  { re: "הקפת מנהטן|Manhattan Loop", file: "race-manhattan", night: false },
];

for (const tr of tracks) {
  await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle", timeout: 30000 });
  await clickText("בחירת מסלול|Choose track");
  await page.waitForTimeout(250);
  await clickText("^ניו יורק$|^New York$");
  await page.waitForTimeout(200);
  if (tr.night) await clickText("^לילה$|^Night$");
  else await clickText("^יום$|^Day$");
  await page.waitForTimeout(150);
  await clickText(tr.re);
  await clickText("בחירת רכב|Choose car");
  await page.waitForTimeout(150);
  await clickText("זינוק|Start");
  await page.waitForSelector("canvas", { timeout: 25000 });
  await page.waitForFunction(() => !!window.__controlsTest, { timeout: 20000 });
  await page.waitForTimeout(900);
  await page.evaluate(() => window.__controlsTest?.skipCountdown?.());
  await page.keyboard.down("KeyW");
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `${screenshots}/${tr.file}.png` });
  await page.keyboard.up("KeyW");
}

console.log(JSON.stringify({ errors }, null, 2));
await browser.close();
