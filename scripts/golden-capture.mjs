/** Readiness orchestration only: never changes the camera recipe or image authority. */
import assert from 'node:assert/strict';
import { existsSync, realpathSync } from 'node:fs';
import path from 'node:path';

export function assertGoldenDirectories(baseline, output) {
  const canonical = value => {
    let current = path.resolve(value);
    const suffix = [];
    while (!existsSync(current)) { suffix.unshift(path.basename(current)); const parent = path.dirname(current);
      if (parent === current) throw new Error('unresolvable golden path'); current = parent; }
    return path.join(realpathSync(current), ...suffix);
  };
  const base = canonical(baseline), target = canonical(output);
  const within = (parent, child) => { const rel = path.relative(parent, child);
    return rel === '' || (!rel.startsWith(`..${path.sep}`) && rel !== '..' && !path.isAbsolute(rel)); };
  assert.ok(!within(base, target) && !within(target, base), 'golden output must not overlap the immutable baseline directory');
  return { baseline: base, output: target };
}

export function validateGoldenSnapshot(snapshot) {
  assert.equal(snapshot?.track, 'ayalon', 'golden capture must use the actual Ayalon engine');
  assert.equal(snapshot.quality, 'high', 'golden capture must retain default high quality');
  assert.equal(snapshot.weather, 'clear', 'golden capture must retain clear weather');
  assert.equal(snapshot.photo, false, 'golden capture must retain the original gameplay camera');
  assert.equal(snapshot.webgpuOk, false, 'golden capture must retain WebGL');
  for (const key of ['speed', 'progress']) assert.ok(Number.isFinite(snapshot[key]), `invalid golden ${key}`);
  return snapshot;
}

export async function openAyalonRace(page, { timeoutMs = 45000 } = {}) {
  assert.ok(Number.isFinite(timeoutMs) && timeoutMs > 0, 'bounded readiness timeout required');
  // Locator actionability alone does not prove hydration. The app owns this marker.
  await page.locator('[data-rush-ready="true"]:not([inert])').waitFor({ state: 'visible', timeout: timeoutMs });
  await page.getByRole('button', { name: /בחר מסלול/ }).click({ timeout: timeoutMs });
  await page.locator('[data-rush-screen="tracks"]').waitFor({ state: 'visible', timeout: timeoutMs });
  await page.getByRole('button', { name: /^הכל$/ }).click({ timeout: timeoutMs });
  await page.getByRole('button', { name: /נתיבי איילון/ }).click({ timeout: timeoutMs });
  await page.waitForFunction(() => {
    const failure = document.querySelector('[data-testid="race-load-error"]');
    if (failure) throw new Error(`race loading failed: ${failure.textContent}`);
    const root = document.querySelector('[data-rush-screen="race"][data-rush-track="ayalon"]');
    return !!root && typeof window.__controlsTest?.getTick === 'function'
      && typeof window.render_game_to_text === 'function';
  }, undefined, { timeout: timeoutMs });
  const initialTick = await page.evaluate(() => window.__controlsTest.getTick());
  assert.ok(Number.isFinite(initialTick), 'initial engine tick must be finite');
  await page.waitForFunction(tick => window.__controlsTest.getTick() > tick, initialTick, { timeout: timeoutMs });
  await page.getByTestId('race-minimap').waitFor({ state: 'visible', timeout: timeoutMs });
  return validateGoldenSnapshot(await page.evaluate(() => JSON.parse(window.render_game_to_text())));
}

export async function goldenState(page) {
  return page.evaluate(() => {
    const controls = window.__controlsTest;
    return { engine: JSON.parse(window.render_game_to_text()), tick: controls.getTick(),
      x: controls.getX(), y: controls.getY(), z: controls.getZ(), yaw: controls.getYaw(),
      camMode: controls.getCamMode(), photoLock: controls.getPhotoLock(),
      viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio },
      fonts: document.fonts?.status ?? 'unavailable' };
  });
}
