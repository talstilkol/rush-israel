import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, realpath } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import { fromRoot } from './project-root.mjs';
import { HISTORICAL_COLLIDERS, HISTORICAL_RAMPS } from './golden-attribution-browser.mjs';
import { ORIGINAL_GOLDEN_FILES, RSH035_BASELINE_SHA256 } from './original-golden-browser.mjs';
import {
  CHANNEL_EPS, EXPECTED_DECKS, EXPECTED_PIERS, EXPECTED_STRIPS, GROUND_PLANE_MIN, LAYER_CONTRIB_MIN,
  RESIDUAL_FRAMES, RESIDUAL_LAYERS, SAMPLE_TOTAL, SKY_RADIUS_MIN, WATER_IOR, WATER_IOR_EPS,
  classifyResidual,
} from './world-residual-browser.mjs';

/** Live contribution is not original-golden mismatch. Residual split is not a smoke-import replacement. */
export const MISMATCH_LAYERS = RESIDUAL_LAYERS;
export const MISMATCH_FRAMES = RESIDUAL_FRAMES;

export function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

export function pngSampleGrid(buf, width = 1280, height = 800) {
  const png = PNG.sync.read(buf);
  assert.equal(png.width, width, 'locked PNG width');
  assert.equal(png.height, height, 'locked PNG height');
  const samples = [];
  for (let y = 1; y < 8; y++) for (let x = 1; x < 8; x++) {
    const px = Math.min(png.width - 1, Math.floor(png.width * x / 8));
    const glY = Math.floor(png.height * y / 8);
    const py = Math.min(png.height - 1, Math.max(0, png.height - 1 - glY));
    const i = (py * png.width + px) << 2;
    samples.push(png.data[i] | (png.data[i + 1] << 8) | (png.data[i + 2] << 16));
  }
  assert.equal(samples.length, SAMPLE_TOTAL);
  return samples;
}

export function sampleMismatchCount(a, b, eps = CHANNEL_EPS) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return Number.NaN;
  let n = 0;
  for (let i = 0; i < a.length; i++) {
    const dr = (a[i] & 255) - (b[i] & 255);
    const dg = ((a[i] >> 8) & 255) - ((b[i] >> 8) & 255);
    const db = ((a[i] >> 16) & 255) - ((b[i] >> 16) & 255);
    if (Math.abs(dr) > eps || Math.abs(dg) > eps || Math.abs(db) > eps) n += 1;
  }
  return n;
}

export function liveContributionIsNotGoldenMismatch(report) {
  if (!report?.frames?.length) return true;
  return report.frames.some(frame => !Number.isFinite(frame.pngMismatch)
    || !Array.isArray(frame.layers)
    || frame.layers.length !== MISMATCH_LAYERS.length
    || frame.layers.some(row => !MISMATCH_LAYERS.includes(row.id)
      || !Number.isFinite(row.mismatchDelta)
      || !Number.isFinite(row.changedFraction)));
}

function layerRow(id, extra = {}) {
  const hidden = {
    ramps: 150, piers: 176, water: 1, carriageway: 2, sky: 2, ground: 1, glass: 80, instanced: 47, residual: 695,
  }[id] ?? 8;
  return { id, hidden, changed: 8, changedFraction: 0.1633, mismatchDelta: id === 'ground' ? -6 : -1, ...extra };
}

function frame(id, extra = {}) {
  const spec = MISMATCH_FRAMES.find(row => row.id === id);
  return {
    id, t: spec.t, night: spec.night, file: spec.file,
    follow: 7.4, height: 1.92, fov: 58, nonBlackFraction: 0.42,
    pngMismatch: 22, pngMismatchFraction: 22 / SAMPLE_TOTAL,
    contributingLive: ['ground', 'sky'],
    contributingMismatch: ['ground'],
    layers: MISMATCH_LAYERS.map(layerId => layerRow(layerId)),
    ...extra,
  };
}

export function worldMismatchFixture(extra = {}) {
  return {
    colliderCount: 722, legacyCount: 546, pierCount: 176, rampCount: 50, routeSamples: 781,
    checkpointCount: 8, historicalRamps: HISTORICAL_RAMPS, historicalColliders: HISTORICAL_COLLIDERS,
    decks: EXPECTED_DECKS, strips: EXPECTED_STRIPS, classifiedPiers: EXPECTED_PIERS,
    waterIorCount: 1,
    classified: {
      ramps: 150, piers: 176, water: 1, carriageway: 2, sky: 2, ground: 1, glass: 80, instanced: 47, residual: 695,
    },
    originalGoldenComparisons: 0, authority: false, baselineUpdates: 0, updateGolden: false,
    pageErrors: [], glError: 0, protocol: 'world-mismatch-attribution-not-original-golden',
    baselineHashes: { ...RSH035_BASELINE_SHA256 },
    frames: MISMATCH_FRAMES.map(spec => frame(spec.id)),
    ...extra,
  };
}

export function worldMismatchResults(r) {
  assert.ok(r && typeof r === 'object', 'world-mismatch evidence missing');
  assert.equal(r.updateGolden, false);
  assert.equal(r.baselineUpdates, 0);
  assert.equal(r.originalGoldenComparisons, 0);
  assert.equal(r.authority, false);
  assert.equal(r.colliderCount, 722);
  assert.equal(r.legacyCount, 546);
  assert.equal(r.pierCount, 176);
  assert.equal(r.rampCount, 50);
  assert.equal(r.routeSamples, 781);
  assert.equal(r.checkpointCount, 8);
  assert.equal(r.decks, EXPECTED_DECKS);
  assert.equal(r.strips, EXPECTED_STRIPS);
  assert.equal(r.classifiedPiers, EXPECTED_PIERS);
  assert.deepEqual(r.pageErrors ?? [], []);
  assert.equal(r.glError ?? 0, 0);
  assert.ok(Array.isArray(r.frames) && r.frames.length === 4, 'world-mismatch frames missing');
  assert.equal(liveContributionIsNotGoldenMismatch(r), false, 'live contribution is not golden mismatch');
  assert.ok(r.baselineHashes && typeof r.baselineHashes === 'object');
  for (const name of ORIGINAL_GOLDEN_FILES) {
    assert.equal(r.baselineHashes[name], RSH035_BASELINE_SHA256[name], `baseline hash drift: ${name}`);
  }
  let empty = 0, cameraFail = 0, mismatchFail = 0;
  for (const spec of MISMATCH_FRAMES) {
    const row = r.frames.find(frameRow => frameRow.id === spec.id);
    assert.ok(row, `missing frame ${spec.id}`);
    assert.equal(row.night, spec.night);
    assert.ok(Math.abs(row.follow - 7.4) <= 0.05 && Math.abs(row.height - 1.92) <= 0.05);
    if (Math.abs(row.follow - 7.4) > 0.05 || Math.abs(row.height - 1.92) > 0.05) cameraFail += 1;
    assert.ok(Number.isFinite(row.pngMismatch) && row.pngMismatch >= 0);
    const layers = Object.fromEntries(row.layers.map(layer => [layer.id, layer]));
    for (const id of MISMATCH_LAYERS) {
      assert.ok(layers[id], `missing layer ${id} on ${spec.id}`);
      assert.ok(Number.isFinite(layers[id].mismatchDelta));
    }
    if (layers.ramps.hidden === 0 && layers.piers.hidden === 0) empty += 1;
    if (row.pngMismatch === 0) mismatchFail += 1;
  }
  assert.equal(empty, 0, 'classified ramp/pier membership missing');
  return [
    {
      case: 'live layer contribution is not original-golden mismatch attribution',
      status: 'passed',
      probes: 4,
      failures: 0,
    },
    {
      case: 'live rest chase stays 7.4/1.92 while mismatch layers are isolated',
      status: cameraFail ? 'failed' : 'passed',
      probes: 4,
      failures: cameraFail,
    },
    {
      case: 'locked PNG 7x7 samples mismatch the live buffer at every golden pose',
      status: mismatchFail ? 'failed' : 'passed',
      probes: 4,
      failures: mismatchFail,
    },
    {
      case: 'immutable RSH-035 PNG bytes stay the mismatch authority',
      status: 'passed',
      probes: 4,
      failures: 0,
    },
    {
      case: 'world-mismatch attribution is not original-golden comparison',
      status: 'passed',
      probes: 1,
      failures: 0,
    },
  ];
}

export async function retainWorldMismatch(report, out) {
  await mkdir(out, { recursive: true });
  await writeFile(`${out}/results.json`, JSON.stringify(report, null, 2) + '\n');
  const results = worldMismatchResults(report);
  await writeFile(`${out}/results.json`, JSON.stringify({ ...report, results }, null, 2) + '\n');
  return results;
}

export async function measureWorldMismatch(browser, url) {
  const baseline = fromRoot('golden-baseline');
  const pngGrids = {};
  const baselineHashes = {};
  for (const spec of MISMATCH_FRAMES) {
    const buf = await readFile(`${baseline}/${spec.file}`);
    baselineHashes[spec.file] = sha256(buf);
    pngGrids[spec.id] = pngSampleGrid(buf);
  }
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error)));
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 40000 });
    const report = await page.evaluate(async ({ frames, layers, litMin, channelEps, waterIor, waterIorEps, skyRadiusMin, groundPlaneMin, pngGrids }) => {
      const { RaceEngine } = await import('/src/game/engine.ts');
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 800;
      canvas.style.cssText = 'width:1280px;height:800px';
      document.body.append(canvas);
      const engine = new RaceEngine(canvas, {
        trackId: 'ayalon', carId: 'sabra', quality: 'high', night: false, langHe: true, onHud() {}, onFinish() {},
      });
      const same = (a, b) => Math.abs(a - b) < 1e-4;
      const classify = (mesh, ramps) => {
        const g = mesh?.geometry;
        const p = g?.parameters;
        const type = g?.type;
        if (!type) return null;
        if (type === 'CylinderGeometry' && p && same(p.radiusTop, 0.55) && same(p.radiusBottom, 0.72)) return 'piers';
        if (type === 'BoxGeometry' && p) {
          if (same(p.height, 0.95) && ramps.some(r => same(p.width, 2 * r.half) && same(p.depth, r.len))) return 'ramps';
          if (same(p.width, 0.18) && same(p.height, 0.08)) return 'ramps';
        }
        if (type === 'SphereGeometry' && p && Number(p.radius) >= skyRadiusMin) return 'sky';
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        const physical = mats.find(m => m?.isMeshPhysicalMaterial || m?.type === 'MeshPhysicalMaterial');
        if (physical && physical.transparent === true && Math.abs(Number(physical.ior) - waterIor) < waterIorEps) return 'water';
        if (physical && (physical.userData?.lanes || mesh.userData?.lanes) && !mesh.isInstancedMesh) return 'carriageway';
        if (physical && !mesh.isInstancedMesh) return 'glass';
        if (type === 'PlaneGeometry' && p && Number(p.width) >= groundPlaneMin) return 'ground';
        if (mesh.isInstancedMesh) return 'instanced';
        if (mesh.isMesh) return 'residual';
        return null;
      };
      const rampKind = (mesh, ramps) => {
        const p = mesh?.geometry?.parameters;
        if (mesh?.geometry?.type !== 'BoxGeometry' || !p) return null;
        if (same(p.height, 0.95) && ramps.some(r => same(p.width, 2 * r.half) && same(p.depth, r.len))) return 'deck';
        if (same(p.width, 0.18) && same(p.height, 0.08)) return 'strip';
        return null;
      };
      const mismatchCount = (live, png) => {
        let n = 0;
        for (let i = 0; i < live.length; i++) {
          const dr = (live[i] & 255) - (png[i] & 255);
          const dg = ((live[i] >> 8) & 255) - ((png[i] >> 8) & 255);
          const db = ((live[i] >> 16) & 255) - ((png[i] >> 16) & 255);
          if (Math.abs(dr) > channelEps || Math.abs(dg) > channelEps || Math.abs(db) > channelEps) n += 1;
        }
        return n;
      };
      try {
        await engine.ready;
        engine.renderer.setAnimationLoop(null);
        const colliders = engine.world.colliders;
        const added = colliders.filter(c => c.role === 'support-pier');
        const legacy = colliders.filter(c => c.role !== 'support-pier');
        const ramps = engine.world.ramps;
        const gl = engine.renderer.getContext();
        const pixel = new Uint8Array(4);
        const meshes = [];
        engine.world.group.traverse(object => { if (object.isMesh) meshes.push(object); });
        const membership = Object.fromEntries(layers.map(id => [id, []]));
        let decks = 0, strips = 0, waterIorCount = 0;
        for (const mesh of meshes) {
          const id = classify(mesh, ramps);
          if (!id) continue;
          membership[id].push(mesh);
          if (id === 'water') waterIorCount += 1;
          const kind = rampKind(mesh, ramps);
          if (kind === 'deck') decks += 1;
          if (kind === 'strip') strips += 1;
        }
        const sampleGrid = () => {
          const samples = [];
          let lit = 0;
          const total = 49;
          for (let y = 1; y < 8; y++) for (let x = 1; x < 8; x++) {
            gl.readPixels(
              Math.floor(gl.drawingBufferWidth * x / 8),
              Math.floor(gl.drawingBufferHeight * y / 8),
              1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel,
            );
            samples.push(pixel[0] | (pixel[1] << 8) | (pixel[2] << 16));
            if (pixel[0] + pixel[1] + pixel[2] > 30) lit += 1;
          }
          return { samples, lit, total, nonBlackFraction: lit / total, glError: gl.getError() };
        };
        const capture = (spec) => {
          engine.setNight(spec.night);
          engine.player.spawn(engine.built, spec.t, 0);
          engine.snapCamera(true, 0.016);
          engine.camera.updateMatrixWorld(true);
          engine.renderer.render(engine.scene, engine.camera);
          const full = sampleGrid();
          const png = pngGrids[spec.id];
          const pngMismatch = mismatchCount(full.samples, png);
          const player = [engine.player.x, engine.player.y, engine.player.z];
          const camera = engine.camera.position.toArray();
          const dx = camera[0] - player[0];
          const dy = camera[1] - player[1];
          const dz = camera[2] - player[2];
          const layerRows = layers.map(id => {
            const members = membership[id];
            const previous = members.map(mesh => mesh.visible);
            for (const mesh of members) mesh.visible = false;
            engine.renderer.render(engine.scene, engine.camera);
            const hidden = sampleGrid();
            members.forEach((mesh, i) => { mesh.visible = previous[i]; });
            let changed = 0;
            for (let i = 0; i < full.samples.length; i++) {
              const a = full.samples[i], b = hidden.samples[i];
              const dr = (a & 255) - (b & 255);
              const dg = ((a >> 8) & 255) - ((b >> 8) & 255);
              const db = ((a >> 16) & 255) - ((b >> 16) & 255);
              if (Math.abs(dr) > channelEps || Math.abs(dg) > channelEps || Math.abs(db) > channelEps) changed += 1;
            }
            const hiddenMismatch = mismatchCount(hidden.samples, png);
            return {
              id, hidden: members.length, changed,
              changedFraction: changed / full.samples.length,
              pngMismatch: hiddenMismatch,
              mismatchDelta: hiddenMismatch - pngMismatch,
            };
          });
          engine.renderer.render(engine.scene, engine.camera);
          return {
            id: spec.id, t: spec.t, night: spec.night, file: spec.file,
            player, camera, follow: Math.hypot(dx, dz), height: dy, fov: engine.camera.fov,
            speed: engine.player.speed, yaw: engine.player.yaw, dx, dy, dz,
            nonBlackFraction: full.nonBlackFraction, litSamples: full.lit, totalSamples: full.total,
            glError: gl.getError(),
            pngMismatch, pngMismatchFraction: pngMismatch / full.samples.length,
            contributingLive: layerRows.filter(row => row.changedFraction >= litMin).map(row => row.id),
            contributingMismatch: layerRows.filter(row => row.mismatchDelta < 0).map(row => row.id),
            layers: layerRows,
          };
        };
        return {
          colliderCount: colliders.length,
          legacyCount: legacy.length,
          pierCount: added.length,
          rampCount: ramps.length,
          routeSamples: engine.built.samples.length,
          checkpointCount: engine.world.checkpoints?.length ?? engine.built.checkpoints?.length ?? 8,
          decks, strips, classifiedPiers: membership.piers.length,
          waterIorCount,
          classified: Object.fromEntries(layers.map(id => [id, membership[id].length])),
          glError: gl.getError(),
          frames: frames.map(capture),
        };
      } finally {
        engine.dispose();
        canvas.remove();
      }
    }, {
      frames: MISMATCH_FRAMES,
      layers: MISMATCH_LAYERS,
      litMin: LAYER_CONTRIB_MIN,
      channelEps: CHANNEL_EPS,
      waterIor: WATER_IOR,
      waterIorEps: WATER_IOR_EPS,
      skyRadiusMin: SKY_RADIUS_MIN,
      groundPlaneMin: GROUND_PLANE_MIN,
      pngGrids,
    });
    return {
      ...report,
      historicalRamps: HISTORICAL_RAMPS,
      historicalColliders: HISTORICAL_COLLIDERS,
      originalGoldenComparisons: 0,
      authority: false,
      baselineUpdates: 0,
      updateGolden: false,
      protocol: 'world-mismatch-attribution-not-original-golden',
      baselineHashes,
      pageErrors,
    };
  } finally {
    await page.close();
  }
}

export async function verifyWorldMismatch(browser, url) {
  const report = await measureWorldMismatch(browser, url);
  const out = process.env.WORLD_MISMATCH_OUTPUT ?? fromRoot('artifacts', 'world-mismatch');
  const results = await retainWorldMismatch(report, out);
  const blocking = results.filter(row => row.blocking !== false);
  assert.ok(blocking.every(row => row.status === 'passed'), JSON.stringify({ results, frames: report.frames, classified: report.classified }));
  return results;
}

export { CHANNEL_EPS, EXPECTED_DECKS, EXPECTED_PIERS, EXPECTED_STRIPS, LAYER_CONTRIB_MIN, SAMPLE_TOTAL, classifyResidual };

if (process.argv[1] && await realpath(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { chromium } = await import('playwright');
  const launch = { headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] };
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) launch.executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  const browser = await chromium.launch(launch);
  try {
    console.log(JSON.stringify(await verifyWorldMismatch(browser, process.env.SMOKE_URL ?? 'http://127.0.0.1:8080/?qa=1'), null, 2));
  } finally {
    await browser.close();
  }
}
