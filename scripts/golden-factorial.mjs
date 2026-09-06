#!/usr/bin/env node
/** Diagnostic factorial replay only. Never a replacement for the original golden gate. */
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
const out = 'artifacts/golden-factorial';
const historicalRoot = 'artifacts/history';
const frames = [['g01', 0.04, false], ['g05', 0.46, false], ['g07', 0.62, false], ['g08', 0.48, true]];
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const result = { schema_version: 1, authority: false, baselineUpdates: 0, originalGoldenComparisons: 0,
  baselineSource: 'b0e3e525689955e6ff944b49f08c814e49cf03fa', currentSource: process.env.FACTOR_SOURCE_SHA,
  protocol: '2 source/asset revisions x 2 measured camera matrices; direct renderer, frozen physics, no HUD; each source/frame restores and repeats its historical-camera control',
  threshold: 0.12, probes: [], captures: [], comparisons: [], status: 'incomplete' };
assert.match(result.currentSource ?? '', /^[a-f0-9]{40}$/, 'exact source SHA required');
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const pages = [];
try {
  // Keep both engines alive to use measured matrices, not hand-entered assumptions.
  for (const source of ['historical', 'current']) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
    pages.push(page);
    const errors = [], failures = [];
    page.on('pageerror', error => errors.push(String(error)));
    page.on('requestfailed', request => failures.push(request.url()));
    if (source === 'historical') await page.route(url => url.pathname.startsWith('/game/'), async route => {
      const rel = decodeURIComponent(new URL(route.request().url()).pathname);
      const root = path.resolve(historicalRoot, 'public');
      const target = path.resolve(root, `.${rel}`);
      assert.ok(target.startsWith(`${root}${path.sep}`), 'historical asset path escapes root');
      try { await route.fulfill({ status: 200, body: await readFile(target), contentType: rel.endsWith('.png') ? 'image/png' : rel.endsWith('.jpg') ? 'image/jpeg' : 'application/octet-stream' }); }
      catch { await route.fulfill({ status: 404, body: 'historical asset absent' }); }
    });
    await page.goto('http://127.0.0.1:8080/?qa=1', { waitUntil: 'networkidle', timeout: 45000 });
    const setup = await page.evaluate(async source => {
      const module = source === 'historical' ? await import('/artifacts/history/src/game/engine.ts') : await import('/src/game/engine.ts');
      const canvas = document.createElement('canvas'); canvas.id = 'factorial-canvas';
      canvas.style.cssText = 'position:fixed;inset:0;width:1280px;height:800px;z-index:100000'; document.body.append(canvas);
      const engine = new module.RaceEngine(canvas, { trackId: 'ayalon', carId: 'sabra', quality: 'high', night: false, langHe: true, onHud() {}, onFinish() {} });
      window.__factor = { engine, canvas }; await engine.ready; engine.renderer.setAnimationLoop(null);
      return { ramps: engine.world.ramps.length, colliders: engine.world.colliders.length, samples: engine.built.samples.length,
        length: engine.built.length, soft: engine.soft, pixelRatio: engine.renderer.getPixelRatio() };
    }, source);
    const poses = {};
    for (const [id, t, night] of frames) poses[id] = await page.evaluate(({ t, night }) => {
      const { engine } = window.__factor;
      engine.setNight(night); engine.player.spawn(engine.built, t, 0); engine.present(0); engine.snapCamera(true);
      return { position: [engine.player.x, engine.player.y, engine.player.z], yaw: engine.player.yaw,
        camera: { position: engine.camera.position.toArray(), quaternion: engine.camera.quaternion.toArray(), fov: engine.camera.fov } };
    }, { t, night });
    result.probes.push({ source, setup, poses, errors, failedRequests: failures });
  }
  for (const [i, source] of ['historical', 'current'].entries()) {
    const page = pages[i];
    for (const [id, t, night] of frames) {
      assert.deepEqual(result.probes[0].poses[id].position, result.probes[1].poses[id].position, `spawn differs for ${id}`);
      for (const cameraKind of ['historical', 'current', 'historical-repeat']) {
        const matrix = result.probes[cameraKind === 'current' ? 1 : 0].poses[id].camera;
        const state = await page.evaluate(({ t, night, matrix }) => {
          const { engine } = window.__factor;
          engine.renderer.setAnimationLoop(null); engine.setNight(night); engine.player.spawn(engine.built, t, 0); engine.present(0);
          engine.camera.position.fromArray(matrix.position); engine.camera.quaternion.fromArray(matrix.quaternion); engine.camera.fov = matrix.fov; engine.camera.updateProjectionMatrix(); engine.camera.updateMatrixWorld(true);
          engine.renderer.setAnimationLoop(() => engine.renderer.render(engine.scene, engine.camera));
          return { tick: engine.tickId, position: [engine.player.x, engine.player.y, engine.player.z],
            camera: { position: engine.camera.position.toArray(), quaternion: engine.camera.quaternion.toArray(), fov: engine.camera.fov } };
        }, { t, night, matrix });
        await page.waitForTimeout(500);
        const bytes = await page.locator('#factorial-canvas').screenshot();
        const finalState = await page.evaluate(() => { const { engine } = window.__factor; engine.renderer.setAnimationLoop(null); return { tick: engine.tickId, glError: engine.renderer.getContext().getError(), position: [engine.player.x, engine.player.y, engine.player.z] }; });
        assert.equal(finalState.tick, state.tick, 'physics advanced during fixed capture'); assert.deepEqual(finalState.position, state.position); assert.equal(finalState.glError, 0);
        assert.deepEqual(state.camera, matrix, 'camera override differs from measured matrix');
        const file = `${source}-${cameraKind}-${id}.png`; await writeFile(`${out}/${file}`, bytes);
        result.captures.push({ source, cameraKind, id, file, state, finalState, sha256: sha256(bytes) });
      }
    }
  }
  for (const [id] of frames) {
    const images = {};
    for (const row of result.captures.filter(row => row.id === id)) images[`${row.source}/${row.cameraKind}`] = PNG.sync.read(await readFile(`${out}/${row.file}`));
    const compare = (a, b) => {
      assert.equal(images[a].width, 1280); assert.equal(images[a].height, 800); assert.equal(images[b].width, 1280); assert.equal(images[b].height, 800);
      const count = pixelmatch(images[a].data, images[b].data, null, 1280, 800, { threshold: 0.12 });
      return { pixels: count, totalPixels: 1024000, fraction: count / 1024000 };
    };
    const hh = 'historical/historical', hc = 'historical/current', ch = 'current/historical', cc = 'current/current';
    const row = { id, combinedChange: compare(hh, cc), cameraEffectOnHistorical: compare(hh, hc), cameraEffectOnCurrent: compare(ch, cc),
      sourceAssetsEffectWithHistoricalCamera: compare(hh, ch), sourceAssetsEffectWithCurrentCamera: compare(hc, cc),
      repeatedHistorical: compare(hh, 'historical/historical-repeat'), repeatedCurrent: compare(ch, 'current/historical-repeat') };
    result.comparisons.push(row);
    assert.equal(row.repeatedHistorical.pixels, 0, `unstable historical control ${id}`); assert.equal(row.repeatedCurrent.pixels, 0, `unstable current control ${id}`);
  }
  for (const probe of result.probes) { assert.deepEqual(probe.errors, []); assert.deepEqual(probe.failedRequests, []); }
  result.status = 'controlled_diagnostic_complete_not_acceptance';
  result.limitations = ['Source/asset factor includes world, materials, lighting and other source changes together; individual components are not isolated.',
    'Pairwise pixel differences overlap and are nonlinear; they must not be summed or interpreted as percentages of original golden failures.',
    'No original baseline comparison; no HUD/post-processing parity claim; historical dependencies/runner are not reproduced.'];
} catch (error) { result.error = String(error); process.exitCode = 1; }
finally {
  for (const page of pages) { await page.evaluate(() => { window.__factor?.engine?.dispose(); window.__factor?.canvas?.remove(); }).catch(() => {}); await page.close(); }
  await browser.close(); await writeFile(`${out}/results.json`, JSON.stringify(result, null, 2) + '\n'); console.log(JSON.stringify(result));
}
