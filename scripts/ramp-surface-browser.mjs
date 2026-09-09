import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, writeFile, realpath } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

/** Measure the actual builder's meshes against unchanged vehicle.probeRamp equations. */
export async function measureRampSurfaces(browser, url) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 40000 });
    const source = await (await page.request.get(new URL('/src/game/road-assets.ts', url).href)).text();
    const threePath = source.match(/from\s+["']([^"']*\/three\.js[^"']*)["']/)?.[1];
    assert.ok(threePath, 'resolve the served production THREE module');
    const report = await page.evaluate(async threePath => {
      const THREE = await import(threePath);
      const { RaceEngine } = await import('/src/game/engine.ts');
      const canvas = document.createElement('canvas'); canvas.style.cssText = 'width:800px;height:600px'; document.body.append(canvas);
      const engine = new RaceEngine(canvas, { trackId: 'ayalon', carId: 'sabra', quality: 'low', night: false, langHe: true, onHud() {}, onFinish() {} });
      try {
        await engine.ready; engine.renderer.setAnimationLoop(null); engine.scene.updateMatrixWorld(true);
        const children = engine.world.group.children;
        const rows = [], recipe = engine.world.ramps.map(r => ({ ...r }));
        const same = (a, b) => Math.abs(a - b) < 1e-6;
        for (let index = 0; index < recipe.length; index++) {
          const r = recipe[index], mid = (r.y0 + r.y1) / 2;
          const matches = children.filter(o => o.isMesh && o.geometry?.type === 'BoxGeometry' &&
            same(o.geometry.parameters.width, 2 * r.half) && same(o.geometry.parameters.height, 0.95) &&
            same(o.geometry.parameters.depth, r.len) && same(o.position.x, r.x) && same(o.position.z, r.z) && same(o.position.y, mid));
          if (matches.length !== 1) throw new Error(`Ramp ${index}: ${matches.length} matching deck meshes`);
          const deck = matches[0], pos = deck.geometry.getAttribute('position'), normals = deck.geometry.getAttribute('normal');
          const physicalY = (x, z) => mid + ((x - r.x) * r.sx + (z - r.z) * r.sz) * (r.y1 - r.y0) / r.len;
          const top = [];
          for (let i = 0; i < pos.count; i++) if (normals.getY(i) > 0.5) {
            const v = deck.localToWorld(new THREE.Vector3().fromBufferAttribute(pos, i));
            top.push({ along: (v.x - r.x) * r.sx + (v.z - r.z) * r.sz,
              across: (v.x - r.x) * r.sz - (v.z - r.z) * r.sx, error: Math.abs(v.y - physicalY(v.x, v.z)) });
          }
          if (top.length !== 4) throw new Error(`Ramp ${index}: ${top.length} top vertices`);
          const extentError = Math.max(Math.abs(Math.min(...top.map(v => v.along)) + r.len / 2), Math.abs(Math.max(...top.map(v => v.along)) - r.len / 2),
            Math.abs(Math.min(...top.map(v => v.across)) + r.half), Math.abs(Math.max(...top.map(v => v.across)) - r.half));
          let rayMisses = 0, rayError = 0, rays = 0;
          const caster = new THREE.Raycaster();
          for (const t of [0.001, 0.25, 0.5, 0.75, 0.999]) for (const lateral of [-0.75, 0, 0.75]) {
            const along = (t - 0.5) * r.len, across = lateral * r.half;
            const x = r.x + r.sx * along + r.sz * across, z = r.z + r.sz * along - r.sx * across;
            const y = physicalY(x, z); caster.set(new THREE.Vector3(x, y + 20, z), new THREE.Vector3(0, -1, 0));
            const hits = caster.intersectObject(deck, false); rays++;
            if (!hits.length) rayMisses++; else rayError = Math.max(rayError, Math.abs(hits[0].point.y - y));
          }
          // The builder appends only its piers, then two edge strips immediately after each deck.
          let next = children.indexOf(deck) + 1, piers = 0, pierProtrusion = 0;
          while (children[next]?.geometry?.type === 'CylinderGeometry') {
            const pier = children[next++], gp = pier.geometry.parameters;
            if (!same(gp.radiusTop, 0.55) || !same(gp.radiusBottom, 0.72)) throw new Error('Unexpected support sequence');
            piers++;
            const p = pier.geometry.getAttribute('position');
            for (let i = 0; i < p.count; i++) {
              const v = pier.localToWorld(new THREE.Vector3().fromBufferAttribute(p, i));
              pierProtrusion = Math.max(pierProtrusion, v.y - physicalY(v.x, v.z));
            }
          }
          const strips = [];
          for (let j = 0; j < 2; j++) {
            const line = children[next++], gp = line?.geometry?.parameters;
            if (!gp || !same(gp.width, 0.18) || !same(gp.height, 0.08) || !same(gp.depth, r.len * 0.94)) throw new Error('Missing edge strip');
            const p = line.geometry.getAttribute('position'), n = line.geometry.getAttribute('normal');
            let bottomError = 0, topError = 0;
            for (let i = 0; i < p.count; i++) if (Math.abs(n.getY(i)) > 0.5) {
              const v = line.localToWorld(new THREE.Vector3().fromBufferAttribute(p, i));
              const error = Math.abs(v.y - physicalY(v.x, v.z) - (n.getY(i) > 0 ? 0.08 : 0));
              if (n.getY(i) > 0) topError = Math.max(topError, error); else bottomError = Math.max(bottomError, error);
            }
            strips.push({ bottomError, topError });
          }
          rows.push({ index, name: r.en, length: r.len, rise: r.y1 - r.y0, topVertexError: Math.max(...top.map(v => v.error)), extentError, rays, rayMisses, rayError, strips, piers, pierProtrusion });
        }
        return { recipe, rows, colliderCount: engine.world.colliders.length, checkpointCount: engine.built.checkpoints.length,
          glError: engine.renderer.getContext().getError(), tolerance: 0.0001 };
      } finally { engine.dispose(); canvas.remove(); }
    }, threePath);
    report.pageErrors = errors;
    report.recipeSha256 = createHash('sha256').update(JSON.stringify(report.recipe)).digest('hex');
    return report;
  } finally { await page.close(); }
}

export function rampSurfaceResults(report) {
  const eps = report.tolerance;
  const surfaceBad = report.rows.filter(r => r.topVertexError > eps || r.extentError > eps || r.rayMisses || r.rayError > eps);
  const stripBad = report.rows.flatMap(r => r.strips).filter(s => s.bottomError > eps || s.topError > eps);
  const pierBad = report.rows.filter(r => r.pierProtrusion > eps);
  const common = { ramps: report.rows.length, recipeSha256: report.recipeSha256, colliderCount: report.colliderCount, checkpointCount: report.checkpointCount };
  assert.equal(report.rows.length, 50); assert.equal(report.rows.reduce((n, r) => n + r.rays, 0), 750);
  assert.equal(report.rows.flatMap(r => r.strips).length, 100);
  assert.equal(report.colliderCount, 722); assert.equal(report.checkpointCount, 8);
  assert.deepEqual(report.pageErrors, []); assert.equal(report.glError, 0);
  return [
    { case: '50 real Ayalon ramp meshes match physics height and footprint at 750 ray probes', status: surfaceBad.length ? 'failed' : 'passed', ...common,
      failedRamps: surfaceBad.length, rayMisses: report.rows.reduce((n, r) => n + r.rayMisses, 0), maxTopError: Math.max(...report.rows.map(r => r.topVertexError)),
      maxFootprintError: Math.max(...report.rows.map(r => r.extentError)), maxRayError: Math.max(...report.rows.map(r => r.rayError)) },
    { case: '100 real ramp edge strips meet the physical deck without floating or sinking', status: stripBad.length ? 'failed' : 'passed', strips: 100, failedStrips: stripBad.length },
    { case: 'real ramp supports remain beneath the drivable surface', status: pierBad.length ? 'failed' : 'passed', piers: report.rows.reduce((n, r) => n + r.piers, 0), failedRamps: pierBad.length,
      maxProtrusion: Math.max(...report.rows.map(r => r.pierProtrusion)) },
  ];
}

export async function verifyRampSurfaces(browser, url) {
  const results = rampSurfaceResults(await measureRampSurfaces(browser, url));
  assert.ok(results.every(r => r.status === 'passed'), JSON.stringify(results));
  return results;
}

if (process.argv[1] && await realpath(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { chromium } = await import('playwright');
  const out = process.env.RAMP_OUTPUT ?? 'artifacts/ramp-surface';
  await mkdir(out, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    const report = await measureRampSurfaces(browser, process.env.SMOKE_URL ?? 'http://127.0.0.1:8080/?qa=1');
    const results = rampSurfaceResults(report);
    await writeFile(`${out}/results.json`, JSON.stringify({ ...report, results }, null, 2) + '\n');
    console.log(JSON.stringify(results, null, 2));
    if (process.argv.includes('--expect-legacy-mismatch')) {
      // Negative control only; this flag is never used by normal required CI.
      assert.equal(results[0].failedRamps, 50); assert.equal(results[1].failedStrips, 100); assert.ok(results[2].failedRamps > 0);
    } else assert.ok(results.every(r => r.status === 'passed'), 'Ramp geometry does not match physics');
  } finally { await browser.close(); }
}
