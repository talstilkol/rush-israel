import assert from 'node:assert/strict';

/** Run the real engine/world clock, including procedural canal water and empty worlds. */
export async function verifyWaterClock(browser, url) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 40000 });
    const results = [];
    for (const trackId of ['ayalon', 'namal', 'rothschild']) {
      const row = await page.evaluate(async id => {
        const { RaceEngine } = await import('/src/game/engine.ts');
        const { getTrack } = await import('/src/game/tracks.ts');
        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:fixed;inset:0;width:1280px;height:800px';
        document.body.append(canvas);
        let engine;
        try {
          engine = new RaceEngine(canvas, { trackId: id, carId: 'sabra', quality: 'low', night: false,
            langHe: true, onHud() {}, onFinish() {} });
          await engine.ready;
          engine.renderer.setAnimationLoop(null);
          const materials = new Set();
          engine.world.group.traverse(object => {
            for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
              if (material?.isMeshPhysicalMaterial && material.ior === 1.33) materials.add(material);
            }
          });
          const snapshot = () => [...materials].map(m => ({ rgb: m.color.toArray(), opacity: m.opacity, roughness: m.roughness, env: m.envMapIntensity }));
          engine.setNight(false); const day = snapshot();
          engine.setNight(true); const night = snapshot();
          let stable = true, transitions = 2;
          for (let i = 0; i < 20; i++) {
            engine.setNight(false); stable &&= !engine.world.night && JSON.stringify(snapshot()) === JSON.stringify(day); transitions++;
            engine.setNight(true); stable &&= engine.world.night && JSON.stringify(snapshot()) === JSON.stringify(night); transitions++;
          }
          engine.setNight(false); transitions++;
          const definition = getTrack(id);
          const bodies = definition.waters?.length ? definition.waters : definition.water ? [definition.water] : [];
          return { trackId: id, transitions, materials: materials.size, expectedMaterials: bodies.length + Number(id === 'ayalon'), stable,
            dayRestored: JSON.stringify(snapshot()) === JSON.stringify(day), day, night };
        } finally { engine?.dispose(); canvas.remove(); }
      }, trackId);
      assert.equal(row.materials, row.expectedMaterials, `${trackId}: every water material must be exercised`);
      assert.equal(row.stable, true, `${trackId}: repeat transitions must not accumulate colour drift`);
      assert.equal(row.dayRestored, true, `${trackId}: daytime appearance must return`);
      if (trackId === 'ayalon') { assert.ok(row.materials > 0); assert.notDeepEqual(row.day, row.night); }
      results.push({ case: `real ${trackId} water clock: repeated day/night transitions`, status: 'passed', ...row });
    }
    assert.deepEqual(errors, [], 'real clock changes must not raise page errors');
    return results;
  } finally { await page.close(); }
}
