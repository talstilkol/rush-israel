#!/usr/bin/env node
/** Accelerated browser-engine races with real track colliders and AI/traffic.
 * Fixed-step QA input is assisted and cannot establish human/device/soak acceptance.
 */
import './runtime-typescript-loader.mjs';
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { fromRoot } from './project-root.mjs';
const { TRACKS, V1_TRACK_IDS } = await import('../src/game/tracks.ts');
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const track of TRACKS.filter(def => V1_TRACK_IDS.includes(def.id))) {
    const page = await browser.newPage({ viewport: { width: 960, height: 640 } });
    const errors = [];
    const navigations = [];
    page.on('framenavigated', frame => { if (frame === page.mainFrame()) navigations.push(frame.url()); });
    await page.addInitScript(() => {
      window.__qaConsoleStacks = [];
      const original = console.error;
      console.error = (...args) => { window.__qaConsoleStacks.push(new Error().stack); original(...args); };
    });
    page.on('pageerror', error => errors.push(String(error)));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    try {
      await page.goto(process.env.SMOKE_URL || 'http://127.0.0.1:8080/', { waitUntil: 'networkidle', timeout: 40000 });
      await page.locator('[data-game-ready="true"]').waitFor();
      await page.getByRole('button', { name: /בחר מסלול/ }).click();
      await page.locator('button').filter({ hasText: /^הכל$/ }).click();
      await page.locator('button').filter({ hasText: track.nameHe }).click();
      await page.waitForFunction(() => !!window.__controlsTest?.followRoad, { timeout: 40000 });
      await page.evaluate(() => { window.__controlsTest.resetStart(); window.__controlsTest.skipCountdown(); });
      let result;
      for (let batch = 0; batch < 240; batch++) {
        result = await page.evaluate(() => {
          const t = window.__controlsTest;
          let maxJump = 0;
          let maxGroundedVerticalJump = 0;
          let offRoad = 0;
          let steps = 0;
          for (; steps < 100 && !t.isFinished(); steps++) {
            const x = t.getX(), z = t.getZ(), y = t.getY(), wasAirborne = t.getAirborne();
            t.followRoad();
            t.advanceTime(50);
            // Finishing may immediately start the replay, which deliberately
            // cuts the presentation back to an earlier recorded position.
            if (t.isFinished()) break;
            maxJump = Math.max(maxJump, Math.hypot(t.getX() - x, t.getZ() - z));
            if (!wasAirborne && !t.getAirborne()) maxGroundedVerticalJump = Math.max(maxGroundedVerticalJump, Math.abs(t.getY() - y));
            if (!t.getOnTrack()) offRoad++;
          }
          return { ...JSON.parse(window.render_game_to_text()), maxJump, maxGroundedVerticalJump, offRoad, steps };
        });
        if (result.maxJump > 10) throw new Error(`position discontinuity ${result.maxJump}m in 50ms; recovery/teleport cannot count as a clean race`);
        if (result.maxGroundedVerticalJump > 1.5) throw new Error(`grounded vertical discontinuity ${result.maxGroundedVerticalJump}m in 50ms`);
        if (![result.speed, result.progress, result.totalTime, result.position.x, result.position.y, result.position.z, result.maxGroundedVerticalJump].every(Number.isFinite)) throw new Error('non-finite race state');
        if (errors.length) throw new Error(errors.join('\n'));
        if (result.finished) break;
      }
      if (!result?.finished) throw new Error(`race did not finish: ${JSON.stringify(result)}`);
      await page.evaluate(() => window.__controlsTest.skipReplay());
      await page.getByRole('dialog').getByRole('heading', { level: 2 }).waitFor();
      if (errors.length) throw new Error(errors.join('\n'));
      const glError = await page.evaluate(() => window.__controlsTest.getGlError());
      if (glError !== 0) throw new Error(`WebGL reported GPU error ${glError} during the actual race`);
      const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('rush-v1')));
      if (stored && (Object.keys(stored.rules || {}).length || Object.values(stored.career?.stars || {}).some(value => value > 0))) throw new Error('assisted QA driving wrote an official record or stars');
      const before = await page.evaluate(() => localStorage.getItem('rush-v1'));
      await page.evaluate(() => window.__controlsTest.skipReplay());
      const after = await page.evaluate(() => localStorage.getItem('rush-v1'));
      if (before !== after) throw new Error('repeated finish changed persisted race rewards');
      const row = { track: track.id, complete: true, resultUi: true, lap: result.lap, seconds: result.totalTime, damage: result.damage, assisted: result.assisted, glError };
      results.push(row);
      console.log(JSON.stringify(row));
    } catch (error) {
      const stacks = await page.evaluate(() => window.__qaConsoleStacks || []).catch(() => []);
      const row = { track: track.id, complete: false, error: String(error), navigations, consoleStacks: stacks };
      results.push(row);
      console.log(JSON.stringify(row));
      const dir = fromRoot('artifacts', 'v1-browser-races');
      await mkdir(dir, { recursive: true });
      await page.screenshot({ path: `${dir}/${track.id}-failure.png` }).catch(() => {});
    } finally { await page.close(); }
  }
} finally { await browser.close(); }
await mkdir(fromRoot('artifacts', 'v1-browser-races'), { recursive: true });
await writeFile(fromRoot('artifacts', 'v1-browser-races', 'summary.json'), `${JSON.stringify({ kind: 'accelerated-assisted-browser-engine', physicalDeviceAcceptance: false, results }, null, 2)}\n`);
if (results.some(result => !result.complete)) process.exitCode = 1;
