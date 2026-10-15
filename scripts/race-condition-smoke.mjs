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
  await page.getByRole('button', { name: 'התחל מחדש', exact: true }).click();
  await page.waitForFunction(() => window.__controlsTest && window.__controlsTest !== window.__previousRaceControls, { timeout: 40000 });
  const restarted = await page.evaluate(() => JSON.parse(window.render_game_to_text()));
  assert.equal(restarted.assisted, false);
  assert.equal(restarted.night, changed.night);
  assert.deepEqual(errors, []);
  const report = { kind: 'real-ui-record-condition-restart', before: { night: before.night, assisted: before.assisted }, changed: { night: changed.night, assisted: changed.assisted }, reset: { assisted: reset.assisted }, restarted: { night: restarted.night, assisted: restarted.assisted }, pageErrors: errors };
  await mkdir(fromRoot('artifacts', 'race-conditions'), { recursive: true });
  await writeFile(fromRoot('artifacts', 'race-conditions', 'summary.json'), JSON.stringify(report, null, 2) + '\n');
  console.log('race-condition-smoke ok', JSON.stringify(report));
} finally { await browser.close(); }
