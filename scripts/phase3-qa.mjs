import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

mkdirSync("/workspace/screenshots", { recursive: true });
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
await page.screenshot({ path: "/workspace/screenshots/title.png" });
const titleBits = await page.evaluate(() => document.body.innerText);
if (!/מוסך|Garage/.test(titleBits)) throw new Error("garage CTA missing");
if (!/₪/.test(titleBits)) throw new Error("cash missing");

await clickText("מוסך|Garage");
await page.waitForTimeout(350);
await page.screenshot({ path: "/workspace/screenshots/garage.png" });
const garageText = await page.evaluate(() => document.body.innerText);
if (!/מנוע|Engine/.test(garageText)) throw new Error("upgrade rows missing");

await clickText("חזרה|Back");
await page.waitForTimeout(200);
await clickText("מרוץ חופשי|Quick race");
await page.waitForTimeout(200);
await clickText("^גשם$|^Rain$");
await clickText("^לילה$|^Night$");
await clickText("טיימס סקוואר|Times Square");
await clickText("בחירת רכב|Choose car");
await page.waitForTimeout(150);
await clickText("זינוק|Start");
await page.waitForSelector("canvas", { timeout: 25000 });
await page.waitForFunction(() => !!window.__controlsTest, { timeout: 20000 });
await page.waitForTimeout(700);

const weather = await page.evaluate(() => window.__controlsTest?.getWeather?.());
if (weather !== "rain") throw new Error(`expected rain, got ${weather}`);

await page.evaluate(() => window.__controlsTest?.skipCountdown?.());
await page.evaluate(() => {
  window.__controlsTest?.setThrottle?.(1);
  window.__controlsTest?.setKeys?.(["KeyW"]);
});
await page.waitForFunction(() => (window.__controlsTest?.getSpeed?.() ?? 0) > 6, { timeout: 12000 });
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
await page.screenshot({ path: "/workspace/screenshots/rain-timessquare.png" });

await page.keyboard.press("Escape");
await page.waitForTimeout(200);
await clickText("תפריט ראשי|Main menu");
await page.waitForTimeout(250);
await clickText("מרוץ חופשי|Quick race");
await clickText("^סערה$|^Storm$");
await clickText("חוף תל אביב|Tel Aviv Beach");
await clickText("בחירת רכב|Choose car");
await clickText("זינוק|Start");
await page.waitForFunction(() => !!window.__controlsTest, { timeout: 20000 });
const storm = await page.evaluate(() => window.__controlsTest?.getWeather?.());
if (storm !== "storm") throw new Error(`expected storm, got ${storm}`);
await page.screenshot({ path: "/workspace/screenshots/storm-beach.png" });

console.log(
  JSON.stringify(
    {
      ok: errors.length === 0,
      weather,
      storm,
      dA: Number(dA.toFixed(3)),
      dD: Number(dD.toFixed(3)),
      errors,
    },
    null,
    2,
  ),
);
if (errors.length) process.exit(1);
await browser.close();
