#!/usr/bin/env node
/** Repeated browser-engine lifecycle diagnostic. Not a physical-device memory measurement. */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { fromRoot } from './project-root.mjs';
const CYCLES = Number(process.env.SOAK_CYCLES || 20);
if (!Number.isSafeInteger(CYCLES) || CYCLES < 1) throw new Error('SOAK_CYCLES must be positive');
const url = process.env.SOAK_URL || 'http://127.0.0.1:8080/?qa=1';
const rows = [];
const warmup = [];
let baseline = null;
const dir = fromRoot('artifacts', 'lifecycle');
await mkdir(dir, { recursive: true });
async function report(passed, error) {
  await writeFile(`${dir}/cycles.json`, `${JSON.stringify({
    kind: 'headless-allocation-counters', deviceAcceptance: false,
    expectedCycles: CYCLES, measuredCycles: rows.length,
    status: passed ? 'complete' : error ? 'failed' : 'running',
    warmup, baseline, rows, passed, ...(error ? { error } : {}),
  }, null, 2)}\n`);
}
// Replace a previous two-cycle smoke result before starting the full run.
// Even a killed process must never leave that earlier green as its verdict.
await report(false);
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 40000 });
  await page.locator('[data-game-ready="true"]').waitFor();
  async function cycle() {
    await page.getByRole('button', { name: /בחר מסלול/ }).click();
    await page.locator('button').filter({ hasText: /^הכל$/ }).click();
    await page.locator('button').filter({ hasText: /נתיבי איילון/ }).click();
    await page.waitForFunction(() => !!window.__controlsTest?.getMemory, { timeout: 40000 });
    const memory = await page.evaluate(async () => {
      // Always present the exact start pose before sampling. Do not compare
      // a pre-frame allocation count with a post-frame allocation count.
      window.__controlsTest.resetStart();
      window.advanceTime(0);
      let last = null;
      let stable = 0;
      for (let frame = 0; frame < 120; frame++) {
        await new Promise(resolve => requestAnimationFrame(resolve));
        const value = window.__controlsTest.getMemory();
        stable = last && value.textures === last.textures && value.geometries === last.geometries ? stable + 1 : 0;
        last = value;
        if (stable >= 5) return value;
      }
      throw new Error('GPU allocation counters did not stabilize at the start pose');
    });
    await page.keyboard.press('Escape');
    await page.locator('button').filter({ hasText: /מסך ראשי|Main menu/ }).click();
    await page.waitForFunction(() => !window.__controlsTest);
    if (errors.length) throw new Error(errors.join('\n'));
    return memory;
  }
  for (let i = 0; i < 2; i++) warmup.push(await cycle());
  baseline = {
    textures: Math.max(...warmup.map(row => row.textures)),
    geometries: Math.max(...warmup.map(row => row.geometries)),
  };
  for (let i = 0; i < CYCLES; i++) {
    const memory = await cycle();
    rows.push(memory);
    await report(false);
    console.log('cycle', i + 1, '/', CYCLES, 'tex', memory.textures, 'geo', memory.geometries);
    if (memory.textures > baseline.textures + 2) throw new Error(`texture leak at cycle ${i + 1}: ${memory.textures} > ${baseline.textures} + 2`);
    if (memory.geometries > baseline.geometries + 2) throw new Error(`geometry leak at cycle ${i + 1}: ${memory.geometries} > ${baseline.geometries} + 2`);
  }
  await report(true);
  console.log('soak ok', CYCLES, 'measured cycles; every cycle <= warmed baseline + 2', baseline);
} catch (error) {
  await report(false, String(error));
  throw error;
} finally { await browser.close(); }
