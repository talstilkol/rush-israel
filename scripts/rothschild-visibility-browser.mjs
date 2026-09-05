import assert from 'node:assert/strict';
import { PNG } from 'pngjs';

/** Pixel evidence is intentionally separate from HUD presence or a ready promise. */
export async function assertScenePixels(page, screenshotPath) {
  let evidence;
  for (let attempt = 0; attempt < 12; attempt++) {
    const image = PNG.sync.read(await page.screenshot({ path: screenshotPath }));
    let lit = 0, samples = 0;
    // Interior viewport excludes the HUD edges and the newly mounted minimap.
    for (let y = Math.floor(image.height * 0.25); y < image.height * 0.65; y += 4) {
      for (let x = Math.floor(image.width * 0.2); x < image.width * 0.8; x += 4) {
        const i = (y * image.width + x) * 4; samples++;
        if (image.data[i] + image.data[i + 1] + image.data[i + 2] > 30) lit++;
      }
    }
    evidence = { litSamples: lit, totalSamples: samples, nonBlackFraction: lit / samples };
    if (evidence.nonBlackFraction >= 0.15) return evidence;
    await page.waitForTimeout(250);
  }
  assert.fail(`3D viewport remains black despite mounted HUD: ${JSON.stringify(evidence)}`);
}

/** Do not alter counts, visibility, materials or shaders to make this gate pass. */
export async function verifyRothschildVisibility(browser, url, output) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 40000 });
    const evidence = await page.evaluate(async () => {
      const { RaceEngine } = await import('/src/game/engine.ts');
      const canvas = document.createElement('canvas');
      canvas.style.cssText = 'position:fixed;inset:0;width:1280px;height:800px;z-index:10000';
      document.body.append(canvas);
      let engine;
      try {
        engine = new RaceEngine(canvas, { trackId: 'rothschild', carId: 'sabra', quality: 'low', night: false,
          langHe: true, onHud() {}, onFinish() {} });
        await engine.ready;
        engine.renderer.setAnimationLoop(null);
        const instances = [];
        engine.world.group.traverse(object => {
          if (object.isInstancedMesh) instances.push({ count: object.count, capacity: object.instanceMatrix.count,
            geometry: object.geometry.type, radius: object.geometry.parameters?.radius });
        });
        const gl = engine.renderer.getContext(), pixel = new Uint8Array(4);
        const capture = label => {
          engine.renderer.render(engine.scene, engine.camera);
          let lit = 0;
          for (let y = 1; y < 8; y++) for (let x = 1; x < 8; x++) {
            gl.readPixels(Math.floor(gl.drawingBufferWidth * x / 8), Math.floor(gl.drawingBufferHeight * y / 8),
              1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
            if (pixel[0] + pixel[1] + pixel[2] > 30) lit++;
          }
          return { label, litSamples: lit, totalSamples: 49, error: gl.getError() };
        };
        const day = capture('day'); engine.setNight(true); const night = capture('night');
        engine.setNight(false); const restoredDay = capture('restored day');
        // Resume the unmodified renderer so screenshot evidence captures an actual frame.
        engine.renderer.setAnimationLoop(() => engine.renderer.render(engine.scene, engine.camera));
        window.__rothschildVisibilityTest = { engine, canvas };
        return { instances, day, night, restoredDay };
      } catch (error) { engine?.dispose(); canvas.remove(); throw error; }
    });
    assert.equal(evidence.instances.filter(row => row.count > row.capacity).length, 0, 'every live draw count must fit its buffer');
    const leaves = evidence.instances.find(row => row.geometry === 'SphereGeometry' && row.radius === 4.2);
    assert.ok(leaves, 'the intended canopy must still exist');
    assert.equal(leaves.count, 1152, 'do not hide or truncate the 96-tree canopy');
    assert.equal(leaves.capacity, 1536, 'allocate capacity for all 128 permitted trees');
    for (const row of [evidence.day, evidence.restoredDay]) assert.ok(row.litSamples >= 15, JSON.stringify(row));
    for (const row of [evidence.day, evidence.night, evidence.restoredDay]) assert.equal(row.error, 0);
    const screenshot = await assertScenePixels(page, `${output}/rothschild-visible-scene.png`);
    assert.deepEqual(errors, []);
    return { case: 'Rothschild full canopy fits its buffer and actual scene is visible before and after night', status: 'passed', ...evidence, screenshot };
  } finally {
    if (!page.isClosed()) await page.evaluate(() => {
      const test = window.__rothschildVisibilityTest;
      if (test) { test.engine.dispose(); test.canvas.remove(); delete window.__rothschildVisibilityTest; }
    }).catch(() => {});
    await page.close();
  }
}
