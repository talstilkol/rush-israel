#!/usr/bin/env node
/** Browser fault injection against the real Vite application. No golden updates. */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { fromRoot } from './project-root.mjs';

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
    await page.screenshot({ path: `${output}/closed-route-map.png` });
    results.push({ case: 'real closed-track HUD mounts and closes minimap route', status: 'passed' });
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
