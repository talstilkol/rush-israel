#!/usr/bin/env node
/** Non-authority Ayalon captures plus steering smoke. Not a golden comparison or art pass. */
import assert from 'node:assert/strict';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fromRoot } from './project-root.mjs';
import { prepareGoldenOutput } from './golden-output.mjs';
import { openAyalonRace, goldenState, validateGoldenSnapshot } from './golden-capture.mjs';

export const CAPTURE_FILES = ['ayalon-day-g01.png', 'ayalon-day-g05.png', 'ayalon-day-g07.png', 'ayalon-night-g08.png'];
export async function captureAyalon({ environment = process.env, browserType,
  openRace = openAyalonRace, readState = goldenState } = {}) {
  assert.ok(!environment.GOLDEN_DIR, 'GOLDEN_DIR is not a capture destination; use GOLDEN_OUTPUT outside golden-baseline');
  const output = prepareGoldenOutput({ output: environment.GOLDEN_OUTPUT || fromRoot('artifacts', 'ayalon-capture'),
    update: environment.UPDATE_GOLDEN,
    names: [...CAPTURE_FILES, 'ayalon-dump.json', 'capture.json', 'capture-failure.png'] });
  const evidence = { status: 'pending', baselineUpdates: 0, authority: false, comparisons: 0, frames: [], errors: [], failedRequests: [] };
  let browser, page;
  try {
    const chromium = browserType ?? (await import('playwright')).chromium;
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
    page.on('pageerror', error => evidence.errors.push(String(error)));
    page.on('requestfailed', request => evidence.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
    await page.goto('http://127.0.0.1:8080/?qa=1', { waitUntil: 'domcontentloaded', timeout: 40000 });
    evidence.initial = await openRace(page);
    await page.evaluate(() => window.__controlsTest.skipCountdown());
    const capture = async (id, file, night) => {
      const moved = await page.evaluate(gid => window.__controlsTest.gotoGolden(gid), id);
      assert.equal(moved, true, `unknown golden camera ${id}`);
      await page.waitForTimeout(500);
      const state = await readState(page);
      validateGoldenSnapshot(state.engine);
      assert.equal(state.engine.night, night, 'incorrect day/night capture state');
      assert.deepEqual(evidence.errors, [], 'page errors before capture');
      output.write(file, await page.screenshot());
      evidence.frames.push({ file, ...state });
    };
    for (const id of ['g01', 'g05', 'g07']) await capture(id, `ayalon-day-${id}.png`, false);
    await page.evaluate(() => window.__controlsTest.setNight(true));
    await page.waitForTimeout(400);
    await capture('g08', 'ayalon-night-g08.png', true);
    const dump = (await readState(page)).engine;
    validateGoldenSnapshot(dump);
    assert.ok(['webgl1', 'webgl2'].includes(dump.telem?.backend), 'capture backend must be WebGL');
    output.write('ayalon-dump.json', JSON.stringify(dump, null, 2) + '\n');
    for (const name of CAPTURE_FILES) assert.ok((await stat(path.join(output.directory, name))).size >= 20000, `tiny capture ${name}`);
    await page.evaluate(() => {
      const t = window.__controlsTest;
      t.resetStart(); t.setNight(false); t.setThrottle(1); t.setSteer(0); t.setKeys(['KeyW']);
    });
    await page.waitForFunction(() => (window.__controlsTest.getSpeed() ?? 0) > 6, undefined, { timeout: 16000 });
    const y0 = await page.evaluate(() => window.__controlsTest.getYaw());
    await page.evaluate(() => window.__controlsTest.setSteer(1));
    await page.waitForTimeout(400);
    const yA = await page.evaluate(() => window.__controlsTest.getYaw());
    const turn = Math.atan2(Math.sin(yA - y0), Math.cos(yA - y0));
    assert.ok(turn > 0.03, 'steering response absent');
    assert.deepEqual(evidence.errors, [], 'page errors during capture or steering');
    evidence.steeringDelta = turn;
    evidence.status = 'captured_and_steering_checked_not_compared';
    return { ...evidence, output: output.directory };
  } catch (error) {
    evidence.status = 'capture_failed'; evidence.error = String(error);
    if (page && !page.isClosed()) await page.screenshot().then(bytes => output.write('capture-failure.png', bytes)).catch(() => {});
    throw error;
  } finally {
    try { output.write('capture.json', JSON.stringify(evidence, null, 2) + '\n'); }
    finally { await browser?.close(); }
  }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await captureAyalon();
  console.log(JSON.stringify(result, null, 2));
}
