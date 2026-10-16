#!/usr/bin/env node
/** Real UI condition changes must not escape their original record class. */
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { fromRoot } from './project-root.mjs';

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  await page.goto(process.env.SMOKE_URL || 'http://127.0.0.1:8080/', { waitUntil: 'networkidle' });
  await page.locator('[data-game-ready="true"]').waitFor();
  await page.getByRole('button', { name: /בחר מסלול/ }).click();
  await page.locator('button').filter({ hasText: /^הכל$/ }).click();
  await page.locator('button').filter({ hasText: /נתיבי איילון/ }).click();
  await page.waitForFunction(() => !!window.__controlsTest, { timeout: 40000 });
  await page.evaluate(() => window.__controlsTest.resetStart());
  const before = await page.evaluate(() => JSON.parse(window.render_game_to_text()));
  assert.equal(before.assisted, false);
  await page.keyboard.press('KeyN');
  await page.waitForFunction(() => JSON.parse(window.render_game_to_text()).assisted === true);
  const changed = await page.evaluate(() => JSON.parse(window.render_game_to_text()));
  assert.notEqual(changed.night, before.night);
  const reset = await page.evaluate(() => {
    window.__controlsTest.resetStart();
    window.__previousRaceControls = window.__controlsTest;
    return JSON.parse(window.render_game_to_text());
  });
  assert.equal(reset.assisted, true, 'an in-place reset must not erase changed-condition disqualification');
  await page.keyboard.press('Escape');
  // Patch the exact engine module already loaded by the actual UI. Vite may
  // attach an HMR version; importing a bare URL can observe a different class.
  await page.evaluate(async () => {
    const urls = performance.getEntriesByType('resource').map(entry => entry.name);
    const engineUrl = urls.findLast(url => new URL(url).pathname.endsWith('/src/game/engine.ts'));
    if (!engineUrl) throw new Error('Actual UI engine module was not observed');
    const { RaceEngine } = await import(engineUrl);
    const assemble = RaceEngine.prototype.assemble;
    RaceEngine.prototype.assemble = async function (...args) {
      const result = await assemble.apply(this, args);
      window.__observedConditionEngine = this;
      return result;
    };
  });
  await page.getByRole('button', { name: 'התחל מחדש', exact: true }).click();
  await page.waitForFunction(() => window.__controlsTest && window.__controlsTest !== window.__previousRaceControls, { timeout: 40000 });
  const restarted = await page.evaluate(() => JSON.parse(window.render_game_to_text()));
  assert.equal(restarted.assisted, false);
  assert.equal(restarted.night, changed.night);
  await page.waitForFunction(() => window.__observedConditionEngine && !window.__observedConditionEngine.disposed);
  const cameraViews = [];
  for (const mode of [0, 1, 2, 3, 0]) {
    if (cameraViews.length) {
      await page.keyboard.down('KeyC');
      await page.waitForFunction(mode => window.__controlsTest.getCamMode() === mode, mode);
      await page.keyboard.up('KeyC');
      await page.waitForFunction(() => !window.__observedConditionEngine.hoodEdge);
    }
    const view = await page.evaluate(() => {
      const engine = window.__observedConditionEngine;
      return { mode: engine.camMode, playerVisible: engine.visuals[0].group.visible, playerShadowVisible: engine.blobs[0].visible };
    });
    cameraViews.push(view);
    if (mode === 2) {
      await mkdir(fromRoot('artifacts', 'race-conditions'), { recursive: true });
      await page.screenshot({ path: fromRoot('artifacts', 'race-conditions', 'bumper-camera.png') });
    }
    const firstPerson = mode === 1 || mode === 2;
    assert.equal(view.playerVisible, !firstPerson, `camera ${mode}: the player's own exterior must not obstruct a first-person view`);
    assert.equal(view.playerShadowVisible, !firstPerson, `camera ${mode}: own blob visibility must follow the exterior`);
    if (firstPerson) {
      await page.keyboard.down('KeyB');
      await page.waitForFunction(() => {
        const engine = window.__observedConditionEngine;
        return engine.lookBack && engine.visuals[0].group.visible && engine.blobs[0].visible;
      });
      await page.keyboard.up('KeyB');
      await page.waitForFunction(() => {
        const engine = window.__observedConditionEngine;
        return !engine.lookBack && !engine.visuals[0].group.visible && !engine.blobs[0].visible;
      });
      view.lookBackRestoresExteriorAndShadow = true;
    }
  }
  const automaticRecovery = await page.evaluate(() => {
    const engine = window.__observedConditionEngine;
    const controls = window.__controlsTest;
    const routeSampleIndex = 30;
    const sample = engine.built.samples[routeSampleIndex];
    const lateral = -(engine.built.width / 2 + 0.4);
    // Actual Ayalon shoulder: outside the main road, before the adjacent
    // side street. The real world, colliders and traffic remain active.
    engine.player.spawn(engine.built, sample.t, lateral);
    controls.skipCountdown();
    controls.setKeys([]);
    controls.setThrottle(0);
    controls.setSteer(0);
    const beforeAssisted = JSON.parse(window.render_game_to_text()).assisted;
    let observedRecoveries = 0;
    const respawn = engine.player.respawn;
    engine.player.respawn = function (...args) {
      observedRecoveries++;
      return respawn.apply(this, args);
    };
    try {
      const startTime = engine.totalTime;
      for (let tick = 0; tick < 100 && !observedRecoveries; tick++) controls.advanceTime(50);
      return { routeSampleIndex, lateral, beforeAssisted, afterAssisted: JSON.parse(window.render_game_to_text()).assisted, observedRecoveries, seconds: engine.totalTime - startTime };
    } finally { engine.player.respawn = respawn; }
  });
  assert.equal(automaticRecovery.beforeAssisted, false);
  assert.equal(automaticRecovery.observedRecoveries, 1, 'the actual automatic rescue must occur');
  assert.ok(automaticRecovery.seconds >= 3.2 && automaticRecovery.seconds < 3.4);
  assert.equal(automaticRecovery.afterAssisted, true, 'automatic rescue must disqualify official records');
  assert.deepEqual(errors, []);
  const report = { kind: 'real-ui-record-condition-restart', before: { night: before.night, assisted: before.assisted }, changed: { night: changed.night, assisted: changed.assisted }, reset: { assisted: reset.assisted }, restarted: { night: restarted.night, assisted: restarted.assisted }, cameraViews, automaticRecovery, pageErrors: errors };
  await mkdir(fromRoot('artifacts', 'race-conditions'), { recursive: true });
  await page.getByText('השיא לא נשמר', { exact: true }).waitFor();
  await page.screenshot({ path: fromRoot('artifacts', 'race-conditions', 'automatic-recovery-disqualified.png') });
  await writeFile(fromRoot('artifacts', 'race-conditions', 'summary.json'), JSON.stringify(report, null, 2) + '\n');
  console.log('race-condition-smoke ok', JSON.stringify(report));
} finally { await browser.close(); }
