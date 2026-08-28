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
  await page.waitForTimeout(120);
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
await page.screenshot({ path: `${screenshots}/title.png` });
const title = await page.locator("h1").first().innerText();
if (!/RUSH/.test(title)) throw new Error(`bad title: ${title}`);

await clickText("^קריירה$|^Career$");
await page.waitForTimeout(400);
const careerEvents = await page.evaluate(() =>
  [...document.querySelectorAll("button")].filter((b) => /טיילת|Promenade|עזריאלי|Azrieli/.test(b.textContent || "")).length,
);
await page.screenshot({ path: `${screenshots}/career.png` });
if (careerEvents < 1) throw new Error("career events missing");

await clickText("טיילת הזהב|Golden promenade");
await page.waitForTimeout(250);
await clickText("זינוק|Start");
await page.waitForSelector("canvas", { timeout: 25000 });
await page.waitForFunction(() => !!window.__controlsTest, { timeout: 20000 });
await page.waitForTimeout(600);

const mode = await page.evaluate(() => window.__controlsTest?.getMode?.());
if (mode !== "circuit") throw new Error(`expected circuit, got ${mode}`);

await page.evaluate(() => window.__controlsTest?.skipCountdown?.());
await page.evaluate(() => {
  window.__controlsTest?.setThrottle?.(1);
  window.__controlsTest?.setKeys?.(["KeyW"]);
});
await page.waitForFunction(() => (window.__controlsTest?.getSpeed?.() ?? 0) > 8, { timeout: 12000 });

const y0 = await page.evaluate(() => window.__controlsTest.getYaw());
await page.evaluate(() => {
  window.__controlsTest.setThrottle(1);
  window.__controlsTest.setSteer(1);
});
await page.waitForTimeout(500);
const yA = await page.evaluate(() => window.__controlsTest.getYaw());
await page.evaluate(() => window.__controlsTest.setSteer(-1));
await page.waitForTimeout(500);
const yD = await page.evaluate(() => window.__controlsTest.getYaw());
const dA = wrap(yA - y0);
const dD = wrap(yD - yA);
if (dA <= 0.05) throw new Error(`A did not yaw left: ${dA}`);
if (dD >= -0.05) throw new Error(`D did not yaw right: ${dD}`);

await page.screenshot({ path: `${screenshots}/career-race.png` });

await page.keyboard.press("Escape");
await page.waitForTimeout(200);
await clickText("תפריט ראשי|Main menu");
await page.waitForTimeout(300);

await clickText("מרוץ חופשי|Quick race");
await page.waitForTimeout(200);
await clickText("^מרדף$|^Heat$");
await page.waitForTimeout(150);
await clickText("^לילה$|^Night$");
await clickText("טיימס סקוואר|Times Square");
await clickText("בחירת רכב|Choose car");
await page.waitForTimeout(150);
await clickText("זינוק|Start");
await page.waitForSelector("canvas", { timeout: 25000 });
await page.waitForFunction(() => !!window.__controlsTest, { timeout: 20000 });
await page.waitForTimeout(700);
const heatMode = await page.evaluate(() => window.__controlsTest?.getMode?.());
const cops = await page.evaluate(() => window.__controlsTest?.getCopCount?.() ?? 0);
const laps = await page.evaluate(() => window.__controlsTest?.getLaps?.());
if (heatMode !== "heat") throw new Error(`expected heat, got ${heatMode}`);
if (cops < 2) throw new Error(`expected cops, got ${cops}`);
if (laps !== 2) throw new Error(`heat laps ${laps}`);
await page.screenshot({ path: `${screenshots}/heat-timessquare.png` });

await page.keyboard.press("Escape");
await page.waitForTimeout(200);
await clickText("תפריט ראשי|Main menu");
await page.waitForTimeout(250);
await clickText("מרוץ חופשי|Quick race");
await clickText("^דריפט$|^Drift$");
await clickText("דרום תל אביב|Jaffa Port");
await page.waitForTimeout(150);
const jaffa = await page.evaluate(() =>
  [...document.querySelectorAll("button")].some((b) => /יפו|Jaffa/.test(b.textContent || "")),
);
if (!jaffa) throw new Error("jaffa track missing");
await clickText("בחירת רכב|Choose car");
await clickText("זינוק|Start");
await page.waitForFunction(() => !!window.__controlsTest, { timeout: 20000 });
const driftMode = await page.evaluate(() => window.__controlsTest?.getMode?.());
if (driftMode !== "drift") throw new Error(`expected drift, got ${driftMode}`);
await page.screenshot({ path: `${screenshots}/drift-jaffa.png` });

console.log(
  JSON.stringify(
    {
      ok: errors.length === 0,
      title,
      careerEvents,
      mode,
      dA: Number(dA.toFixed(3)),
      dD: Number(dD.toFixed(3)),
      heatMode,
      cops,
      driftMode,
      errors,
    },
    null,
    2,
  ),
);
if (errors.length) process.exit(1);
await browser.close();
