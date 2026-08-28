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

await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle", timeout: 30000 });
await page.getByRole("button", { name: /בחירת מסלול|Choose track/ }).click();
await page.waitForTimeout(400);

await page.getByRole("button", { name: /^יום$|^Day$/ }).click();
await page.waitForTimeout(250);
await page.screenshot({ path: `${screenshots}/tracks-day.png` });

await page.getByRole("button", { name: /^לילה$|^Night$/ }).click();
await page.waitForTimeout(250);
await page.screenshot({ path: `${screenshots}/tracks-night.png` });

await page.getByRole("button", { name: /^יום$|^Day$/ }).click();
await page.getByRole("button", { name: /עזריאלי|Azrieli/ }).first().click();
await page.getByRole("button", { name: /בחירת רכב|Choose car/ }).click();
await page.waitForTimeout(150);
await page.getByRole("button", { name: /זינוק|Start/ }).click();
await page.waitForSelector("canvas", { timeout: 20000 });
await page.waitForTimeout(4500);
await page.evaluate(() => window.__controlsTest?.skipCountdown?.());
await page.keyboard.down("KeyW");
await page.waitForTimeout(1600);
await page.screenshot({ path: `${screenshots}/race-day.png` });
await page.keyboard.up("KeyW");

await page.keyboard.press("KeyN");
await page.waitForTimeout(1200);
await page.keyboard.down("KeyW");
await page.waitForTimeout(900);
await page.screenshot({ path: `${screenshots}/race-night.png` });
await page.keyboard.up("KeyW");

await page.keyboard.press("Escape");
await page.getByRole("button", { name: /תפריט ראשי|Main menu/ }).click();
await page.waitForTimeout(300);
await page.getByRole("button", { name: /בחירת מסלול|Choose track/ }).click();
await page.getByRole("button", { name: /^לילה$|^Night$/ }).click();
await page.getByRole("button", { name: /ירושלים|Jerusalem/ }).first().click();
await page.getByRole("button", { name: /בחירת רכב|Choose car/ }).click();
await page.getByRole("button", { name: /זינוק|Start/ }).click();
await page.waitForSelector("canvas", { timeout: 20000 });
await page.waitForTimeout(4500);
await page.evaluate(() => window.__controlsTest?.skipCountdown?.());
await page.keyboard.down("KeyW");
await page.waitForTimeout(1400);
await page.screenshot({ path: `${screenshots}/jerusalem-night.png` });
await page.keyboard.up("KeyW");
await page.keyboard.press("KeyN");
await page.waitForTimeout(1100);
await page.keyboard.down("KeyW");
await page.waitForTimeout(800);
await page.screenshot({ path: `${screenshots}/jerusalem-day.png` });
await page.keyboard.up("KeyW");

console.log(JSON.stringify({ errors }, null, 2));
await browser.close();
