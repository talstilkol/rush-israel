import assert from 'node:assert/strict';
import { mkdir, writeFile, realpath } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { fromRoot } from './project-root.mjs';

/** Actual Ayalon collision catalogue. Clearance observations are diagnostic, not a pass gate. */
export async function measureColliderCentres(browser, url) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error)));
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 40000 });
    const report = await page.evaluate(async () => {
      const { RaceEngine } = await import('/src/game/engine.ts');
      const { ArcadeCar } = await import('/src/game/vehicle.ts');
      const canvas = document.createElement('canvas'); canvas.style.cssText = 'width:800px;height:600px'; document.body.append(canvas);
      const engine = new RaceEngine(canvas, { trackId: 'ayalon', carId: 'sabra', quality: 'low', night: false, langHe: true, onHud() {}, onFinish() {} });
      try {
        await engine.ready; engine.renderer.setAnimationLoop(null);
        const colliders = engine.world.colliders, ramps = engine.world.ramps, rows = [];
        for (let index = 0; index < colliders.length; index++) {
          const c = colliders[index];
          if (c.role === "support-pier" || (c.hx != null && c.hz != null)) continue;
          for (const moving of [false, true]) {
            const car = new ArcadeCar(engine.player.stats, 'actual circle contact');
            Object.assign(car, { x: c.x, y: 3, z: c.z, vx: moving ? 3 : 0, vz: moving ? 4 : 0, speed: moving ? -4 : 0 });
            // Isolate one real catalogue obstacle at the contact-phase boundary.
            // This is not a whole-route or multi-obstacle clearance simulation.
            car.hitColliders([c]);
            const distance = Math.hypot(car.x - c.x, car.z - c.z);
            const nx = moving ? -0.6 : 1, nz = moving ? -0.8 : 0;
            rows.push({ index, moving, radius: c.r, kind: c.kind ?? 'barrier', distance, x: car.x, y: car.y, z: car.z,
              expectedX: c.x + nx * c.r, expectedZ: c.z + nz * c.r, velocityInto: car.vx * nx + car.vz * nz,
              lastHit: car.lastHit, finite: [car.x, car.y, car.z, car.vx, car.vz, car.damage].every(Number.isFinite) });
          }
        }
        const contains = (c, x, z) => {
          if (c.hx != null && c.hz != null) {
            const dx = x - c.x, dz = z - c.z, cy = Math.cos(c.yaw ?? 0), sy = Math.sin(c.yaw ?? 0);
            return Math.abs(dx * cy - dz * sy) < c.hx + 1.05 && Math.abs(dx * sy + dz * cy) < c.hz + 1.05;
          }
          return Math.hypot(x - c.x, z - c.z) < c.r;
        };
        const piers = engine.world.group.children.filter(o => o.geometry?.type === 'CylinderGeometry' &&
          o.geometry.parameters.radiusTop === 0.55 && o.geometry.parameters.radiusBottom === 0.72).map(o => ({
          x: o.position.x, z: o.position.z, bottom: o.position.y - o.geometry.parameters.height / 2,
          top: o.position.y + o.geometry.parameters.height / 2,
          sameCentreColliders: colliders.flatMap((c, i) => Math.hypot(c.x - o.position.x, c.z - o.position.z) < 1e-6 ? [i] : []),
          coveringColliders: colliders.flatMap((c, i) => contains(c, o.position.x, o.position.z) ? [i] : []),
        }));
        const crossings = [];
        for (let sample = 0; sample < engine.built.samples.length; sample++) {
          const s = engine.built.samples[sample];
          for (let ramp = 0; ramp < ramps.length; ramp++) {
            const r = ramps[ramp], dx = s.x - r.x, dz = s.z - r.z;
            const along = dx * r.sx + dz * r.sz, across = dx * r.sz - dz * r.sx;
            if (Math.abs(along) > r.len / 2 || Math.abs(across) > r.half) continue;
            const deckTop = r.y0 + (r.y1 - r.y0) * (along / r.len + 0.5), deckBottom = deckTop - 0.95;
            crossings.push({ sample, ramp, roadY: s.y, deckTop, deckBottom, underDeckGap: deckBottom - s.y });
          }
        }
        return { rows, circularIndices: colliders.flatMap((c, i) => c.role === "support-pier" || (c.hx != null && c.hz != null) ? [] : [i]),
          colliderCount: colliders.length, rampCount: ramps.length, routeSamples: engine.built.samples.length,
          checkpointCount: engine.built.checkpoints.length, glError: engine.renderer.getContext().getError(),
          clearance: { status: 'diagnostic_only_not_qualified', piers, crossings,
            limitations: 'Centreline point/slab heights and existing 2D collider coverage only. No roof/body envelope, vertical collider support, mesh intersection or complete driving-clearance acceptance. Ramp entries may intentionally intersect the road.' } };
      } finally { engine.dispose(); canvas.remove(); }
    });
    return { ...report, pageErrors };
  } finally { await page.close(); }
}
export function colliderCentreResults(report) {
  assert.equal(report.colliderCount, 722); assert.equal(report.rampCount, 50);
  assert.equal(report.routeSamples, 781); assert.equal(report.checkpointCount, 8);
  assert.deepEqual(report.pageErrors, []); assert.equal(report.glError, 0);
  const stationary = report.rows.filter(r => r.moving === false), moving = report.rows.filter(r => r.moving === true);
  assert.ok(stationary.length > 0 && stationary.length === moving.length);
  assert.deepEqual(stationary.map(r => r.index), report.circularIndices, 'all circular catalogue indices must be measured');
  assert.equal(new Set(stationary.map(r => r.index)).size, stationary.length, 'duplicate catalogue evidence');
  assert.deepEqual(stationary.map(r => r.index), moving.map(r => r.index), 'mismatched moving/stationary evidence');
  for (const row of report.rows) {
    assert.ok([row.radius, row.distance, row.x, row.y, row.z, row.expectedX, row.expectedZ, row.velocityInto].every(Number.isFinite));
    assert.ok(row.radius > 0 && Number.isInteger(row.index) && row.index >= 0 && row.index < report.colliderCount);
  }
  const wrong = r => !r.finite || Math.abs(r.distance - r.radius) > 1e-8 ||
    Math.abs(r.x - r.expectedX) > 1e-8 || Math.abs(r.z - r.expectedZ) > 1e-8 || r.y !== 3 ||
    (r.moving && (r.velocityInto < -1e-8 || r.lastHit !== r.kind));
  return [stationary, moving].map((rows, i) => ({
    case: `all actual Ayalon circular collider centres resolve ${i ? 'moving' : 'stationary'} overlap`,
    status: rows.some(wrong) ? 'failed' : 'passed', obstacles: rows.length, failures: rows.filter(wrong).length,
    maxRadiusError: Math.max(...rows.map(r => Math.abs(r.distance - r.radius))),
  }));
}
export async function verifyColliderCentres(browser, url) {
  const report = await measureColliderCentres(browser, url), results = colliderCentreResults(report);
  const output = process.env.COLLIDER_CENTRE_OUTPUT ?? fromRoot('artifacts', 'collider-centre');
  await mkdir(output, { recursive: true });
  await writeFile(`${output}/results.json`, JSON.stringify({ ...report, results }, null, 2) + '\n');
  assert.ok(results.every(r => r.status === 'passed'), JSON.stringify(results));
  return results;
}
if (process.argv[1] && await realpath(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ headless: true });
  try {
    const report = await measureColliderCentres(browser, process.env.SMOKE_URL ?? 'http://127.0.0.1:8080/?qa=1');
    const results = colliderCentreResults(report), output = process.env.COLLIDER_CENTRE_OUTPUT ?? fromRoot('artifacts', 'collider-centre');
    await mkdir(output, { recursive: true });
    await writeFile(`${output}/results.json`, JSON.stringify({ ...report, results }, null, 2) + '\n');
    console.log(JSON.stringify(results, null, 2));
    if (process.argv.includes('--expect-legacy-mismatch')) {
      for (const result of results) assert.equal(result.failures, result.obstacles, 'old centre overlaps must reproduce');
    } else assert.ok(results.every(r => r.status === 'passed'), 'Circular collision centres remain unresolved');
  } finally { await browser.close(); }
}
