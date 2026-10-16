/** Actual Ayalon canal: environment setters and GPU rendering, not art/device acceptance. */
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { fromRoot } from './project-root.mjs';

const output = fromRoot('artifacts', 'water-conditions');
await mkdir(output, { recursive: true });
const report = {
  kind: 'actual-Ayalon-water-environment-switches',
  scope: 'Actual canal material and GPU rendering through existing world/sky setters. No UI particle, art, performance or device acceptance.',
  passed: false, rows: [], errors: [],
};
const persist = () => writeFile(output + '/summary.json', JSON.stringify(report, null, 2) + '\n');
await persist();
let browser;
try {
  browser = await chromium.launch({ headless: process.env.WATER_NATIVE !== '1' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  page.on('pageerror', error => report.errors.push(String(error)));
  page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()); });
  await page.goto(process.env.SMOKE_URL || 'http://127.0.0.1:8080/');
  await page.locator('[data-game-ready="true"]').waitFor();
  await page.getByRole('button', { name: /בחר מסלול/ }).click();
  await page.locator('button').filter({ hasText: /^הכל$/ }).click();
  await page.locator('button').filter({ hasText: /נתיבי איילון/ }).click();
  await page.waitForFunction(() => !!window.__controlsTest?.resetStart, { timeout: 40000 });
  await page.evaluate(async () => {
    const url = performance.getEntriesByType('resource').map(entry => entry.name)
      .findLast(entry => new URL(entry).pathname.endsWith('/src/game/engine.ts'));
    if (!url) throw Error('Actual engine module missing');
    const { RaceEngine } = await import(url);
    const restart = RaceEngine.prototype.restartRace;
    RaceEngine.prototype.restartRace = function (...args) {
      window.__waterConditionsEngine = this;
      return restart.apply(this, args);
    };
    try { window.__controlsTest.resetStart(); }
    finally { RaceEngine.prototype.restartRace = restart; }
    const engine = window.__waterConditionsEngine, canals = [];
    if (engine.trackDef.id !== 'ayalon') throw Error('Expected actual Ayalon engine');
    // Ayalon's canal is in the world group; waterMesh covers separate water bodies.
    engine.world.group.traverse(mesh => {
      if (mesh.isMesh && mesh.material?.isMeshPhysicalMaterial &&
          mesh.material.ior === 1.33 && mesh.material.normalMap) canals.push(mesh);
    });
    if (canals.length !== 1) throw Error(`Expected one actual canal, got ${canals.length}`);
    window.__actualAyalonCanal = canals[0];
    engine.assisted = engine.rulesChanged = true;
  });
  const conditions = [
    { id: 'clear-day', weather: 'clear', clock: 0.5 },
    { id: 'clear-night', weather: 'clear', clock: 0.9 },
    { id: 'rain-day', weather: 'rain', clock: 0.5 },
    { id: 'storm-day', weather: 'storm', clock: 0.5 },
    { id: 'storm-night', weather: 'storm', clock: 0.9 },
    { id: 'clear-restored', weather: 'clear', clock: 0.5 },
  ];
  for (const condition of conditions) {
    await page.evaluate(condition => {
      const engine = window.__waterConditionsEngine;
      engine.weather = condition.weather;
      engine.clock = condition.clock;
      engine.world.setWeather(condition.weather);
      engine.applyClockSky(false);
      engine.applyLook();
    }, condition);
    await page.waitForTimeout(250);
    const actual = await page.evaluate(() => {
      const engine = window.__waterConditionsEngine, mesh = window.__actualAyalonCanal;
      const material = mesh.material, gl = engine.renderer.getContext();
      const extension = gl.getExtension('WEBGL_debug_renderer_info');
      engine.renderer.compile(engine.scene, engine.camera);
      engine.post.render();
      gl.finish();
      const values = {
        r: material.color.r, g: material.color.g, b: material.color.b,
        roughness: material.roughness, metalness: material.metalness,
        opacity: material.opacity, waterY: mesh.position.y,
      };
      return {
        weather: engine.weather, clock: engine.clock, values,
        finite: Object.values(values).every(Number.isFinite), glError: gl.getError(),
        renderer: gl.getParameter(extension ? extension.UNMASKED_RENDERER_WEBGL : gl.RENDERER),
      };
    });
    report.rows.push({ condition, actual });
    await persist();
    assert.equal(actual.weather, condition.weather);
    assert.equal(actual.clock, condition.clock);
    assert.equal(actual.finite, true);
    assert.equal(actual.glError, 0);
    assert.deepEqual(report.errors, []);
  }
  await page.screenshot({ path: output + '/clear-restored.png', timeout: 30000 });
  await browser.close();
  browser = undefined;
  assert.deepEqual(report.errors, []);
  report.passed = true;
  await persist();
  console.log('water-conditions-smoke ok', JSON.stringify(report));
} catch (error) {
  report.passed = false;
  report.error = String(error);
  await persist();
  throw error;
} finally { if (browser) await browser.close(); }
