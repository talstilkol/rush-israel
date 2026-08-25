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
const title = await page.textContent("body");
if (!title?.includes("בחר מסלול") && !title?.includes("Choose track")) throw new Error("track CTA missing");

await clickText("בחר מסלול|Choose track");
await page.waitForTimeout(150);
await clickText("חוף תל אביב|Tel Aviv Beach|הירקון|Hayarkon");
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

await page.evaluate(() => {
  window.__controlsTest.resetStart?.();
  window.__controlsTest.setSteer(0);
  window.__controlsTest.setThrottle(1);
  window.__controlsTest.setKeys(["KeyW"]);
});
const p0 = await page.evaluate(() => ({
  t: window.__controlsTest.getProgress?.() ?? 0,
  x: window.__controlsTest.getX?.() ?? 0,
  z: window.__controlsTest.getZ?.() ?? 0,
}));
await page.waitForTimeout(8000);
const hold = await page.evaluate(() => ({
  on: window.__controlsTest.getOnTrack?.() ?? false,
  speed: window.__controlsTest.getSpeed?.() ?? 0,
  progress: window.__controlsTest.getProgress?.() ?? 0,
  x: window.__controlsTest.getX?.() ?? 0,
  z: window.__controlsTest.getZ?.() ?? 0,
}));
const advanced = ((hold.progress - p0.t) % 1 + 1) % 1;
const moved = Math.hypot(hold.x - p0.x, hold.z - p0.z);
if (!hold.on) throw new Error("W 8s left the asphalt");
if (hold.speed < 6) throw new Error(`W 8s stalled: ${hold.speed}`);
if (moved < 16) throw new Error(`W 8s barely moved: ${moved}`);

console.log(JSON.stringify({ ok: errors.length === 0, dA: Number(dA.toFixed(3)), dD: Number(dD.toFixed(3)), hold, advanced: Number(advanced.toFixed(3)), moved: Number(moved.toFixed(1)), errors }, null, 2));
if (errors.length) process.exit(1);
await browser.close();
