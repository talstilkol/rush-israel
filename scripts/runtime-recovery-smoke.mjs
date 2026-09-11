#!/usr/bin/env node
/** Browser fault injection against the real Vite application. No golden updates. */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { fromRoot } from './project-root.mjs';
import { verifyRouteClearance } from './route-clearance-browser.mjs';
import { verifyCompleteRace } from './complete-race-browser.mjs';
import { verifyMeshClearance } from './mesh-clearance-browser.mjs';
import { verifyOriginalGolden } from './original-golden-browser.mjs';
import { verifyGoldenAttribution } from './golden-attribution-browser.mjs';
import { verifyWorldLayers } from './world-layer-browser.mjs';
import { verifyWorldResidual } from './world-residual-browser.mjs';
import { verifyWorldMismatch } from './world-mismatch-browser.mjs';
import { verifyWorldBias } from './world-bias-browser.mjs';
import { verifyWorldScene } from './world-scene-browser.mjs';
import { verifyWorldRegion } from './world-region-browser.mjs';
import { verifyWorldColumn } from './world-column-browser.mjs';
import { verifyWorldSlice } from './world-slice-browser.mjs';
import { verifyWorldExtra } from './world-extra-browser.mjs';
import { verifyWorldMaterial } from './world-material-browser.mjs';
import { verifyWorldFactor } from './world-factor-browser.mjs';
import { verifyWorldRgb } from './world-rgb-browser.mjs';
import { verifyWorldShade } from './world-shade-browser.mjs';
import { verifyWorldTone } from './world-tone-browser.mjs';
import { verifyWorldTerm } from './world-term-browser.mjs';
import { verifyWorldBeam } from './world-beam-browser.mjs';
import { verifyWorldRay } from './world-ray-browser.mjs';
import { verifyWorldIbl } from './world-ibl-browser.mjs';
import { verifyWorldGain } from './world-gain-browser.mjs';
import { verifyWorldCube } from './world-cube-browser.mjs';
import { verifyWorldProbe } from './world-probe-browser.mjs';
import { verifyPierCollisions } from './pier-collision-browser.mjs';
import { verifyColliderCentres } from './collider-centre-browser.mjs';
import { verifyRampContact } from './ramp-contact-browser.mjs';
import { verifyRampSurfaces } from './ramp-surface-browser.mjs';
import { verifyRoadUniforms } from './road-uniform-browser.mjs';
import { verifyFontDependencies } from './font-dependency-browser.mjs';
import { verifyProductHead } from './rush-head-browser.mjs';
import { verifyAssetBatches } from './asset-batches-browser.mjs';
import { verifyResourceRecovery } from './resource-recovery-browser.mjs';
import { verifyWaterClock } from './water-clock-browser.mjs';
import { verifyRothschildVisibility, assertScenePixels } from './rothschild-visibility-browser.mjs';

const url = process.env.SMOKE_URL ?? 'http://127.0.0.1:8080/?qa=1';
const output = fromRoot('artifacts', 'runtime-recovery');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
let currentPage;
async function pageWithEvidence() {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  currentPage = page;
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  await page.addInitScript(() => {
    window.__routeEvidence = { draws: 0, routeClosures: 0 };
    const proto = CanvasRenderingContext2D.prototype;
    const begin = proto.beginPath, line = proto.lineTo, close = proto.closePath;
    const counts = new WeakMap();
    proto.beginPath = function (...args) { counts.set(this, 0); return begin.apply(this, args); };
    proto.lineTo = function (...args) {
      counts.set(this, (counts.get(this) ?? 0) + 1);
      if (this.canvas.dataset.testid === 'race-minimap') window.__routeEvidence.draws++;
      return line.apply(this, args);
    };
    proto.closePath = function (...args) {
      if (this.canvas.dataset.testid === 'race-minimap' && counts.get(this) > 3) window.__routeEvidence.routeClosures++;
      return close.apply(this, args);
    };
  });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 40000 });
  return { page, errors };
}
async function chooseTrack(page, name = /נתיבי איילון/) {
  await page.getByRole('button', { name: /בחר מסלול/ }).click();
  const all = page.getByRole('button', { name: /^הכל$/ });
  if (await all.count()) await all.click();
  await page.getByRole('button', { name }).click();
}
async function raceReady(page) {
  await page.waitForFunction(() => !!window.__controlsTest, { timeout: 45000 });
  await page.getByTestId('race-minimap').waitFor({ state: 'visible', timeout: 30000 });
  await page.waitForFunction(() => window.__routeEvidence.draws > 5, { timeout: 10000 });
  assert.equal(await page.getByTestId('race-load-error').count(), 0);
}
try {
  results.push(...await verifyColliderCentres(browser, url));
  results.push(...await verifyPierCollisions(browser, url));
  results.push(...await verifyRouteClearance(browser, url));
  results.push(...await verifyCompleteRace(browser, url));
  results.push(...await verifyMeshClearance(browser, url));
  results.push(...await verifyOriginalGolden(browser, url));
  results.push(...await verifyGoldenAttribution(browser, url));
  results.push(...await verifyWorldLayers(browser, url));
  results.push(...await verifyWorldResidual(browser, url));
  results.push(...await verifyWorldMismatch(browser, url));
  results.push(...await verifyWorldBias(browser, url));
  results.push(...await verifyWorldScene(browser, url));
  results.push(...await verifyWorldRegion(browser, url));
  results.push(...await verifyWorldColumn(browser, url));
  results.push(...await verifyWorldSlice(browser, url));
  results.push(...await verifyWorldExtra(browser, url));
  results.push(...await verifyWorldMaterial(browser, url));
  results.push(...await verifyWorldFactor(browser, url));
  results.push(...await verifyWorldRgb(browser, url));
  results.push(...await verifyWorldShade(browser, url));
  results.push(...await verifyWorldTone(browser, url));
  results.push(...await verifyWorldTerm(browser, url));
  results.push(...await verifyWorldBeam(browser, url));
  results.push(...await verifyWorldRay(browser, url));
  results.push(...await verifyWorldIbl(browser, url));
  results.push(...await verifyWorldGain(browser, url));
  results.push(...await verifyWorldCube(browser, url));
  results.push(...await verifyWorldProbe(browser, url));
  results.push(...await verifyRampSurfaces(browser, url));
  results.push(...await verifyRampContact(browser, url));
  results.push(...await verifyRoadUniforms(browser, url));
  results.push(...await verifyProductHead(browser, url));
  results.push(...await verifyFontDependencies(browser, url));
  results.push(...await verifyAssetBatches(browser, url));
  results.push(...await verifyResourceRecovery(browser, url));
  results.push(...await verifyWaterClock(browser, url));
  results.push(await verifyRothschildVisibility(browser, url, output));
  {
    const { page, errors } = await pageWithEvidence();
    const route = /\/src\/game\/engine\.ts(?:\?|$)/;
    let injected = 0;
    await page.route(route, request => { injected++; return request.abort('failed'); });
    await chooseTrack(page);
    await page.getByTestId('race-load-error').waitFor({ state: 'visible', timeout: 30000 });
    assert.ok(injected > 0, 'module fault must actually reach the browser');
    assert.deepEqual(errors, [], 'caught module failure must not become an unhandled page error');
    await page.screenshot({ path: `${output}/module-failure.png` });
    await page.unroute(route);
    // Native module failures can be cached by the browser: exercise a real reload, not a mock loader.
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle', timeout: 40000 }),
      page.getByRole('button', { name: /טעינת הדף מחדש|Reload page/ }).click(),
    ]);
    await chooseTrack(page);
    await raceReady(page);
    assert.deepEqual(errors, []);
    assert.equal(await page.evaluate(() => window.__routeEvidence.routeClosures), 0, 'open Ayalon must not close its route');
    await page.screenshot({ path: `${output}/module-recovered-open-map.png` });
    results.push({ case: 'module failure -> explicit page reload -> real Ayalon engine and open minimap', status: 'passed', injected });
    await page.close();
  }
  {
    const { page, errors } = await pageWithEvidence();
    const route = /\/game\/asphalt-8\.png(?:\?|$)/;
    let injected = 0;
    await page.route(route, request => { injected++; return request.abort('failed'); });
    await chooseTrack(page);
    await page.getByTestId('race-load-error').waitFor({ state: 'visible', timeout: 30000 });
    assert.ok(injected > 0, 'texture fault must actually reach the browser');
    const timeOrigin = await page.evaluate(() => performance.timeOrigin);
    await page.screenshot({ path: `${output}/texture-failure.png` });
    await page.unroute(route);
    await page.getByRole('button', { name: /ניסיון חוזר|Retry/ }).click();
    await raceReady(page);
    assert.equal(await page.evaluate(() => performance.timeOrigin), timeOrigin, 'asset retry must stay in the same document');
    assert.deepEqual(errors, []);
    results.push({ case: 'texture failure -> same-document retry -> real engine and minimap', status: 'passed', injected });
    await page.close();
  }
  {
    const { page, errors } = await pageWithEvidence();
    const storage = await page.evaluate(async () => {
      const records = await import('/src/game/records.ts');
      const descriptor = Object.getOwnPropertyDescriptor(window, 'localStorage');
      let writes = 0;
      const record = { trackId: 'ayalon', carId: 'test-car', t: 20, physicsVersion: 6, hash: '' };
      record.hash = records.hashTimedRecord(record);
      try {
        Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new DOMException('injected', 'SecurityError'); } });
        const getterLoad = records.loadTimedRecords().status;
        const getterPersist = (await records.persistTimedRecord(record)).status;
        const broken = { getItem() { throw new Error('injected read'); }, setItem() { writes++; } };
        const readPersist = (await records.persistTimedRecord(record, broken)).status;
        return { getterLoad, getterPersist, readPersist, writes };
      } finally {
        if (descriptor) Object.defineProperty(window, 'localStorage', descriptor);
        else delete window.localStorage;
      }
    });
    assert.deepEqual(storage, { getterLoad: 'read-failed', getterPersist: 'read-failed', readPersist: 'read-failed', writes: 0 });
    assert.deepEqual(errors, []);
    results.push({ case: 'browser localStorage getter/read denial without destructive writes', status: 'passed', ...storage });
    await chooseTrack(page, /שדרות רוטשילד/);
    await raceReady(page);
    assert.ok(await page.evaluate(() => window.__routeEvidence.routeClosures > 0), 'closed track must close the route');
    assert.deepEqual(errors, []);
    const scenePixels = await assertScenePixels(page, `${output}/closed-route-map.png`);
    results.push({ case: 'real closed-track HUD mounts and closes minimap route with visible 3D scene', status: 'passed', scenePixels });
    await page.close();
  }
} catch (error) {
  results.push({ case: 'runtime recovery smoke', status: 'failed', error: String(error) });
  if (currentPage && !currentPage.isClosed()) await currentPage.screenshot({ path: `${output}/failure.png` }).catch(() => {});
  process.exitCode = 1;
} finally {
  await browser.close();
  await writeFile(`${output}/results.json`, JSON.stringify({ cases: results.length, results }, null, 2) + '\n');
  console.log(JSON.stringify(results, null, 2));
}
