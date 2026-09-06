import assert from 'node:assert/strict';

/** Actual WebGL program uploads, including a return to a cached program variant. */
export async function verifyRoadUniforms(browser, url) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 40000 });
    const source = await (await page.request.get(new URL('/src/game/road-assets.ts', url).href)).text();
    const threePath = source.match(/from\s+["']([^"']*\/three\.js[^"']*)["']/)?.[1];
    assert.ok(threePath, 'resolve the production THREE module');
    const variants = await page.evaluate(async threePath => {
      const THREE = await import(threePath);
      const { bindRoadCompile } = await import('/src/game/roadShader.ts');
      const canvas = document.createElement('canvas'); document.body.append(canvas);
      const renderer = new THREE.WebGLRenderer({ canvas }); renderer.setSize(96, 96);
      const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(50, 1, 0.1, 10); camera.position.z = 2;
      const texture = new THREE.DataTexture(new Uint8Array([128, 128, 128, 255]), 1, 1); texture.needsUpdate = true;
      const geometry = new THREE.PlaneGeometry(2, 2), material = new THREE.MeshPhysicalMaterial({ map: texture });
      material.userData.lanes = 8;
      const compiled = []; material.onBeforeCompile = shader => compiled.push(shader);
      bindRoadCompile(material); scene.add(new THREE.Mesh(geometry, material)); scene.add(new THREE.AmbientLight(0xffffff, 1));
      const samples = [];
      try {
        for (const [variant, desired] of [[0, 0.18], [1, 1], [0, 0.7], [1, 0.22]]) {
          if (material.userData.uWet) material.userData.uWet.value = desired;
          material.defines = { RSH036_WET_VARIANT: variant }; material.needsUpdate = true;
          renderer.render(scene, camera);
          const program = renderer.properties.get(material).currentProgram;
          const gl = renderer.getContext(), location = gl.getUniformLocation(program.program, 'uWet');
          samples.push({ variant, desired, uniformPresent: location !== null, uploaded: gl.getUniform(program.program, location),
            programId: program.id, cellValue: material.userData.uWet.value, glError: gl.getError() });
        }
        return { samples, compiled: compiled.length, sharedCell: compiled.every(s => s.uniforms.uWet === material.userData.uWet) };
      } finally { geometry.dispose(); material.dispose(); texture.dispose(); renderer.dispose(); canvas.remove(); }
    }, threePath);
    assert.equal(variants.compiled, 2); assert.equal(variants.sharedCell, true);
    for (const row of variants.samples) {
      assert.equal(row.uniformPresent, true); assert.ok(Math.abs(row.uploaded - row.desired) < 1e-6);
      assert.equal(row.cellValue, row.desired); assert.equal(row.glError, 0);
    }
    assert.equal(variants.samples[0].programId, variants.samples[2].programId, 'return to a cached program');
    assert.equal(variants.samples[1].programId, variants.samples[3].programId);
    assert.notEqual(variants.samples[0].programId, variants.samples[1].programId);
    const world = await page.evaluate(async () => {
      const { RaceEngine } = await import('/src/game/engine.ts');
      const canvas = document.createElement('canvas'); canvas.style.cssText = 'width:800px;height:600px'; document.body.append(canvas);
      const engine = new RaceEngine(canvas, { trackId: 'ayalon', carId: 'sabra', quality: 'low', night: false, langHe: true, onHud() {}, onFinish() {} });
      try {
        await engine.ready; engine.renderer.setAnimationLoop(null);
        const materials = new Set(); engine.world.group.traverse(o => { for (const m of Array.isArray(o.material) ? o.material : [o.material]) if (m?.userData.lanes) materials.add(m); });
        const rows = [];
        for (const [weather, night, expected] of [['clear', false, 0.18], ['rain', false, 1], ['rain', true, 0.7], ['clear', true, 0.22], ['clear', false, 0.18]]) {
          engine.setNight(night); engine.world.setWeather(weather);
          const cells = [...materials].map(m => m.userData.uWet);
          for (const mat of materials) { mat.defines = { ...mat.defines, RSH036_WORLD_RECOMPILE: rows.length }; mat.needsUpdate = true; }
          engine.renderer.render(engine.scene, engine.camera);
          rows.push({ weather, night, expected, materialCount: materials.size, wetness: [...materials].map(m => m.userData.uWet?.value),
            sameCells: [...materials].every((m, i) => m.userData.uWet === cells[i]), glError: engine.renderer.getContext().getError() });
        }
        return rows;
      } finally { engine.dispose(); canvas.remove(); }
    });
    assert.equal(world.length, 5);
    for (const row of world) { assert.ok(row.materialCount > 0); assert.ok(row.wetness.every(n => n === row.expected)); assert.equal(row.sameCells, true); assert.equal(row.glError, 0); }
    assert.deepEqual(errors, []);
    return [{ case: 'road wetness survives actual WebGL compilation and cached-program return', status: 'passed', ...variants },
      { case: 'real Ayalon road retains its day/night/weather look through recompilation', status: 'passed', transitions: world }];
  } finally { await page.close(); }
}
