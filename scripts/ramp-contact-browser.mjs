import assert from 'node:assert/strict';
import { mkdir, writeFile, realpath } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

/** Real Ayalon route/recipe contact checks, not roof-clearance or art acceptance. */
export async function measureRampContact(browser, url) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 40000 });
    const report = await page.evaluate(async () => {
      const { RaceEngine } = await import('/src/game/engine.ts');
      const { ArcadeCar } = await import('/src/game/vehicle.ts');
      const canvas = document.createElement('canvas'); canvas.style.cssText = 'width:800px;height:600px'; document.body.append(canvas);
      const engine = new RaceEngine(canvas, { trackId: 'ayalon', carId: 'sabra', quality: 'low', night: false, langHe: true, onHud() {}, onFinish() {} });
      try {
        await engine.ready; engine.renderer.setAnimationLoop(null);
        const track = engine.built, ramps = engine.world.ramps;
        const input = { throttle: 0, brake: 0, steer: 0, nitro: false, drift: false };
        const height = (r, x, z) => {
          const dx = x - r.x, dz = z - r.z, along = dx * r.sx + dz * r.sz, across = dx * r.sz - dz * r.sx;
          return Math.abs(along) <= r.len / 2 && Math.abs(across) <= r.half ? r.y0 + (r.y1 - r.y0) * (along / r.len + 0.5) : null;
        };
        const route = [];
        for (let i = 0; i < track.samples.length; i++) {
          const s = track.samples[i], car = new ArcadeCar(engine.player.stats, 'underpass probe');
          car.spawn(track, s.t, 0); car.x = s.x; car.y = s.y; car.z = s.z; car.sampleIndex = i;
          const overhead = ramps.map(r => height(r, s.x, s.z)).filter(y => y !== null && y > s.y + 1.2);
          // Full actual ramp list. No stubs and no deletion of inconvenient ramps.
          car.step(1 / 120, input, track, true, engine.world.colliders, engine.world.streets, ramps);
          route.push({ index: i, fromY: s.y, toY: car.y, rise: car.y - s.y, overhead: overhead.length });
        }
        const onDeck = [];
        for (let index = 0; index < ramps.length; index++) for (const t of [0.1, 0.25, 0.5, 0.75, 0.9]) {
          const r = ramps[index], along = (t - 0.5) * r.len;
          const car = new ArcadeCar(engine.player.stats, 'supported-ramp probe'); car.spawn(track, 0.5, 0);
          car.x = r.x + r.sx * along; car.z = r.z + r.sz * along; car.y = r.y0 + (r.y1 - r.y0) * t;
          // Seed the real nearest-sample hint after teleporting; avoid an unrelated route-window correction.
          car.sampleIndex = track.samples.reduce((best, s, i, all) =>
            Math.hypot(s.x - car.x, s.z - car.z) < Math.hypot(all[best].x - car.x, all[best].z - car.z) ? i : best, 0);
          car.yaw = Math.atan2(-r.sx, -r.sz); car.speed = 10;
          // Isolate each real recipe to check attachment, including uphill/downhill motion.
          car.step(1 / 120, input, track, true, [], [], [r]);
          onDeck.push({ index, t, error: Math.abs(car.y - height(r, car.x, car.z)), airborne: car.airborne });
        }
        return { route, onDeck, rampCount: ramps.length, colliderCount: engine.world.colliders.length,
          checkpointCount: track.checkpoints.length, recipe: ramps, glError: engine.renderer.getContext().getError() };
      } finally { engine.dispose(); canvas.remove(); }
    });
    return { ...report, pageErrors: errors };
  } finally { await page.close(); }
}
export function rampContactResults(report) {
  assert.equal(report.rampCount, 50); assert.equal(report.colliderCount, 546); assert.equal(report.checkpointCount, 8);
  assert.equal(report.route.length, 781); assert.equal(report.onDeck.length, 250);
  assert.deepEqual(report.pageErrors, []); assert.equal(report.glError, 0);
  const overhead = report.route.filter(r => r.overhead > 0), captures = report.route.filter(r => r.rise > 1.2001);
  assert.ok(overhead.length > 0, 'must exercise actual overhead intersections');
  const badDeck = report.onDeck.filter(r => !Number.isFinite(r.error) || r.error > 0.0001 || r.airborne);
  return [
    { case: '781 real Ayalon route starts never capture an unreachable overhead deck', status: captures.length ? 'failed' : 'passed',
      samples: report.route.length, overheadSamples: overhead.length, invalidCaptures: captures.length, maxRise: Math.max(...report.route.map(r => r.rise)) },
    { case: 'all50 actual ramp recipes retain supported uphill/downhill contact at250 probes', status: badDeck.length ? 'failed' : 'passed',
      probes: report.onDeck.length, failures: badDeck.length, maxError: Math.max(...report.onDeck.map(r => r.error)) },
  ];
}
export async function verifyRampContact(browser, url) {
  const results = rampContactResults(await measureRampContact(browser, url));
  assert.ok(results.every(r => r.status === 'passed'), JSON.stringify(results)); return results;
}
if (process.argv[1] && await realpath(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { chromium } = await import('playwright'); const out = process.env.RAMP_CONTACT_OUTPUT ?? 'artifacts/ramp-contact';
  await mkdir(out, { recursive: true }); const browser = await chromium.launch({ headless: true });
  try {
    const report = await measureRampContact(browser, process.env.SMOKE_URL ?? 'http://127.0.0.1:8080/?qa=1');
    const results = rampContactResults(report); await writeFile(`${out}/results.json`, JSON.stringify({ ...report, results }, null, 2) + '\n');
    console.log(JSON.stringify(results));
    if (process.argv.includes('--expect-overhead-capture')) {
      assert.ok(results[0].invalidCaptures > 0, 'old source must reproduce unreachable capture');
      assert.equal(results[1].status, 'passed');
    } else assert.ok(results.every(r => r.status === 'passed'), JSON.stringify(results));
  } finally { await browser.close(); }
}
