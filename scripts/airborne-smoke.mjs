#!/usr/bin/env node
/** Ramp contact is grounded; a 2.2-unit drop must fall and land under real physics. */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { probeAirbornePhysics } from './airborne-clock.mjs';

const url = process.env.SMOKE_URL ?? 'http://127.0.0.1:8080/?qa=1';
const report = { schemaVersion: 1, authority: false, baselineUpdates: 0,
  protocol: 'Three actual-engine trials; existing 220 ms ramp, 80 ms settle, 50 + 900 ms drop budget; exact 120 Hz tick checks',
  trials: [], pageErrors: [], ok: false };
let browser;
try {
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  page.on('pageerror', error => report.pageErrors.push(String(error)));
  await page.goto(url, { waitUntil: 'networkidle', timeout: 40000 });
  await page.getByRole('button', { name: /בחר מסלול/ }).click();
  await page.getByRole('button', { name: 'הכל', exact: true }).click();
  await page.getByRole('button', { name: /נתיבי איילון/ }).click();
  await page.waitForFunction(() => !!window.__controlsTest, null, { timeout: 35000 });
  for (let trial = 1; trial <= 3; trial++) {
    // One synchronous evaluation prevents rendering frames from advancing the
    // simulation between observations. advanceTime uses the real engine.fixed.
    const result = await page.evaluate(probeAirbornePhysics);
    report.trials.push({ trial, ...result });
    if (!result.ok) throw new Error(`airborne trial ${trial}: ${result.error}`);
  }
  if (report.pageErrors.length) throw new Error('airborne page errors: ' + report.pageErrors.join('; '));
  report.ok = true;
  console.log('airborne-smoke ok', JSON.stringify(report));
} catch (error) {
  report.error = String(error);
  process.exitCode = 1;
  console.error(report.error);
} finally {
  await browser?.close();
  await mkdir('artifacts/airborne-smoke', { recursive: true });
  await writeFile('artifacts/airborne-smoke/results.json', JSON.stringify(report, null, 2) + '\n');
}
