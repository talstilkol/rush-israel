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
  await page.waitForTimeout(80);
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
await clickText("מרוץ חופשי|Quick race");
await page.waitForTimeout(120);
await clickText("מעגל|Circuit");
await page.waitForTimeout(200);
const body = await page.evaluate(() => document.body.innerText);
const want = ["רוטשילד", "איילון", "קיסריה", "ים המלח", "עכו"];
const missing = want.filter((n) => !body.includes(n));
if (missing.length) throw new Error(`missing tracks: ${missing.join(",")}`);
await page.screenshot({ path: "/workspace/screenshots/tracks-new.png" });

await clickText("קיסריה");
await clickText("בחירת רכב|Choose car");
await clickText("זינוק|Start");
await page.waitForSelector("canvas", { timeout: 25000 });
await page.waitForFunction(() => !!window.__controlsTest, { timeout: 20000 });
await page.evaluate(() => window.__controlsTest?.skipCountdown?.());
await page.evaluate(() => {
  window.__controlsTest?.setThrottle?.(1);
  window.__controlsTest?.setKeys?.(["KeyW"]);
});
await page.waitForFunction(() => (window.__controlsTest?.getSpeed?.() ?? 0) > 7, { timeout: 5000 });
const y0 = await page.evaluate(() => window.__controlsTest.getYaw());
await page.evaluate(() => {
  window.__controlsTest.setThrottle(1);
  window.__controlsTest.setSteer(1);
});
await page.waitForTimeout(400);
const yA = await page.evaluate(() => window.__controlsTest.getYaw());
await page.evaluate(() => {
  window.__controlsTest.setSteer(0);
  window.__controlsTest.setThrottle(1);
});
await page.waitForFunction(() => (window.__controlsTest?.getSpeed?.() ?? 0) > 6, { timeout: 5000 });
const yMid = await page.evaluate(() => window.__controlsTest.getYaw());
await page.evaluate(() => {
  window.__controlsTest.setThrottle(1);
  window.__controlsTest.setSteer(-1);
});
await page.waitForTimeout(400);
const yD = await page.evaluate(() => window.__controlsTest.getYaw());
const dA = wrap(yA - y0);
const dD = wrap(yD - yMid);
if (dA <= 0.04) throw new Error(`A did not yaw left: ${dA}`);
if (dD >= -0.04) throw new Error(`D did not yaw right: ${dD}`);
await page.screenshot({ path: "/workspace/screenshots/caesarea-driving.png" });

console.log(JSON.stringify({ ok: errors.length === 0, missing, dA: Number(dA.toFixed(3)), dD: Number(dD.toFixed(3)), errors }, null, 2));
if (errors.length) process.exit(1);
await browser.close();
