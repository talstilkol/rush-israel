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
const title = await page.evaluate(() => document.body.innerText);
if (!/סימקייד|Simcade|120Hz/.test(title)) throw new Error("title missing simcade copy");
await page.screenshot({ path: "/workspace/screenshots/title.png" });

await clickText("בחר מסלול|Choose track");
await page.waitForTimeout(300);
await clickText("נתיבי איילון|Ayalon Highway");
await page.waitForSelector("canvas", { timeout: 25000 });
await page.waitForFunction(() => !!window.__controlsTest, { timeout: 25000 });
await page.waitForTimeout(600);
await page.screenshot({ path: "/workspace/screenshots/race-ayalon.png" });

const hz = await page.evaluate(() => window.__controlsTest?.getPhysicsHz?.());
if (hz !== 120) throw new Error(`physics Hz ${hz}`);
const handling = await page.evaluate(() => window.__controlsTest?.getHandling?.());
if (handling !== "simcade") throw new Error(`handling ${handling}`);

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
await page.waitForTimeout(700);
const yA = await page.evaluate(() => window.__controlsTest.getYaw());
await page.evaluate(() => {
  window.__controlsTest.setThrottle(1);
  window.__controlsTest.setSteer(-1);
});
await page.waitForTimeout(700);
const yD = await page.evaluate(() => window.__controlsTest.getYaw());
const dA = wrap(yA - y0);
const dD = wrap(yD - yA);
if (dA <= 0.05) throw new Error(`A did not yaw left: ${dA}`);
if (dD >= -0.05) throw new Error(`D did not yaw right: ${dD}`);

await page.evaluate(() => {
  window.__controlsTest.setSteer(0);
  window.__controlsTest.setThrottle(1);
});
await page.waitForTimeout(1200);
await page.screenshot({ path: "/workspace/screenshots/codex-ayalon-drive.png" });

const hudText = await page.evaluate(() => document.body.innerText);
if (!/ABS|TCS|ESC/.test(hudText)) throw new Error("HUD missing assists");
if (!/הקפה|Lap/.test(hudText)) throw new Error("HUD missing lap");
if (!/קמ״ש|km\/h/.test(hudText)) throw new Error("HUD missing speed");

const voided = await page.evaluate(() => window.__controlsTest?.isTimeVoided?.());
if (voided) throw new Error("simulation time was voided");

if (errors.length) throw new Error(errors.slice(0, 6).join("\n"));
console.log(JSON.stringify({ ok: true, dA, dD, hz, handling, voided }, null, 2));
await browser.close();
