import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { fromRoot } from "./project-root.mjs";

const screenshots = fromRoot("screenshots");
mkdirSync(screenshots, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on("pageerror", (e) => errors.push(`page: ${e}`));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(`console: ${m.text()}`);
});

const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

const clickText = async (re) => {
  await page.waitForTimeout(150);
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

await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle", timeout: 40000 });
const title = await page.locator("h1").first().innerText();
await page.screenshot({ path: `${screenshots}/title.png` });

await clickText("בחירת מסלול|Choose track");
await page.waitForTimeout(250);
await clickText("^ניו יורק$|^New York$");
await page.waitForTimeout(150);
await clickText("^לילה$|^Night$");
await clickText("טיימס סקוואר|Times Square");
await clickText("בחירת רכב|Choose car");
await page.waitForTimeout(150);
await clickText("זינוק|Start");
await page.waitForSelector("canvas", { timeout: 25000 });
await page.waitForFunction(() => !!window.__controlsTest, { timeout: 20000 });
await page.waitForTimeout(700);

const hudNitro = await page.getByText(/ניטרו|Nitro/).count();
const lookBack = await page.getByText(/מבט אחורה|look back/i).count();

await page.evaluate(() => window.__controlsTest?.skipCountdown?.());
const traffic = await page.evaluate(() => window.__controlsTest?.getTrafficCount?.() ?? 0);

await page.evaluate(() => window.__controlsTest?.setThrottle?.(1));
await page.waitForTimeout(1400);
const speed = await page.evaluate(() => window.__controlsTest?.getSpeed?.() ?? 0);

const y0 = await page.evaluate(() => window.__controlsTest?.getYaw?.() ?? 0);
await page.evaluate(() => window.__controlsTest?.setSteer?.(1));
await page.waitForTimeout(500);
const yA = await page.evaluate(() => window.__controlsTest?.getYaw?.() ?? 0);
await page.evaluate(() => window.__controlsTest?.setSteer?.(0));
await page.waitForTimeout(80);
const y1 = await page.evaluate(() => window.__controlsTest?.getYaw?.() ?? 0);
await page.evaluate(() => window.__controlsTest?.setSteer?.(-1));
await page.waitForTimeout(500);
const yD = await page.evaluate(() => window.__controlsTest?.getYaw?.() ?? 0);
await page.evaluate(() => {
  window.__controlsTest?.setSteer?.(0);
  window.__controlsTest?.setKeys?.(["KeyW", "KeyE"]);
});
await page.waitForTimeout(400);
const nitro = await page.evaluate(() => window.__controlsTest?.getNitro?.() ?? -1);
await page.keyboard.down("KeyW");
await page.waitForTimeout(1600);
await page.screenshot({ path: `${screenshots}/race-timessquare.png` });
await page.keyboard.up("KeyW");
await page.evaluate(() => {
  window.__controlsTest?.setKeys?.([]);
  window.__controlsTest?.setThrottle?.(0);
});

const dA = wrap(yA - y0);
const dD = wrap(yD - y1);

const result = {
  title,
  titleOk: /RUSH/i.test(title),
  hudNitro: hudNitro > 0,
  lookBack: lookBack > 0,
  traffic,
  speed,
  nitro,
  dA,
  dD,
  aLeft: dA > 0.05,
  dRight: dD < -0.05,
  errors,
};
console.log(JSON.stringify(result, null, 2));
if (!result.titleOk || !result.aLeft || !result.dRight || result.traffic < 3 || errors.length) {
  process.exitCode = 1;
}
await browser.close();
