#!/usr/bin/env node
/** Actual photo camera placement; this does not accept the art or freeze it. */
import assert from 'node:assert/strict';
import {verifyVehicleVisualFeedback} from './visual-feedback-smoke.mjs';
import {verifyCarGlazing} from './car-glazing-smoke.mjs';
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { fromRoot } from './project-root.mjs';
const output = fromRoot('artifacts', 'photo-position');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(process.env.SMOKE_URL || 'http://127.0.0.1:8080/', { waitUntil: 'networkidle' });
  await page.locator('[data-game-ready="true"]').waitFor();
  await page.getByRole('button', { name: /בחר מסלול/ }).click();
  await page.locator('button').filter({ hasText: /^הכל$/ }).click();
  await page.locator('button').filter({ hasText: /נתיבי איילון/ }).click();
  await page.waitForFunction(() => !!window.__controlsTest, { timeout: 40000 });
  const shots = [];
  for (const id of ['g04', 'g05', 'g06']) {
    const result = await page.evaluate(id => {
      const controls = window.__controlsTest;
      controls.exitPhoto();
      if (!controls.gotoGolden(id)) throw Error(`missing route waypoint ${id}`);
      const position = JSON.parse(window.render_game_to_text()).position;
      controls.frameWorld(position.x, position.z, position.y + 2);
      return { camera: controls.getPhotoLock(), state: JSON.parse(window.render_game_to_text()) };
    }, id);
    assert.equal(result.state.photo, true);
    assert.equal(result.state.track, 'ayalon');
    const { px, pz, lx, lz } = result.camera;
    const horizontalDistance = Math.hypot(px - lx, pz - lz);
    // The straight Ayalon road samples are ~3m apart. A 28m back offset
    // may vary by sampling error, but must not collapse into a vertical view.
    assert.ok(Math.abs(horizontalDistance - 28) < 4, `${id}: camera back offset ${horizontalDistance}`);
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${output}/${id}.png` });
    shots.push({ id, horizontalDistance, ...result });
  }
  assert.deepEqual(errors, []);
  await writeFile(`${output}/summary.json`, JSON.stringify({ kind: 'actual-route-photo-placement', cameraSource: 'frameWorld at g04/g05/g06 route positions; not canonical golden poses', ownerApproved: false, artFreeze: false, shots, pageErrors: errors }, null, 2) + '\n');
  console.log('photo-position-smoke ok', JSON.stringify(shots.map(shot => ({ id: shot.id, horizontalDistance: shot.horizontalDistance }))));
} finally { await browser.close(); }

// Same required photo gate also checks pose and vehicle-control feedback.
await verifyVehicleVisualFeedback();

await verifyCarGlazing();
