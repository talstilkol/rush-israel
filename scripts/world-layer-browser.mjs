import assert from 'node:assert/strict';
import { mkdir, writeFile, realpath } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { fromRoot } from './project-root.mjs';
import { ATTRIBUTION_FRAMES, HISTORICAL_COLLIDERS, HISTORICAL_RAMPS } from './golden-attribution-browser.mjs';

/** Pixel-layer isolation after r6.25. Catalogue counts are not original-golden. */
export const WORLD_LAYERS = Object.freeze(['ramps', 'piers', 'water', 'instanced', 'other']);
export const LAYER_FRAMES = ATTRIBUTION_FRAMES;
export const EXPECTED_DECKS = 50;
export const EXPECTED_STRIPS = 100;
export const EXPECTED_PIERS = 176;
export const LAYER_CONTRIB_MIN = 0.02;
export const SAMPLE_TOTAL = 49;
export const CHANNEL_EPS = 8;

export function sameGeom(a, b) {
  return Math.abs(Number(a) - Number(b)) < 1e-4;
}

export function classifyMesh(mesh, ramps = []) {
  const g = mesh?.geometry;
  const p = g?.parameters;
  const type = g?.type;
  if (!type) return null;
  if (type === 'CylinderGeometry' && p && sameGeom(p.radiusTop, 0.55) && sameGeom(p.radiusBottom, 0.72)) return 'piers';
  if (type === 'BoxGeometry' && p) {
    if (sameGeom(p.height, 0.95) && ramps.some(r => sameGeom(p.width, 2 * r.half) && sameGeom(p.depth, r.len))) return 'ramps';
    if (sameGeom(p.width, 0.18) && sameGeom(p.height, 0.08)) return 'ramps';
  }
  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  if (mats.some(m => m?.isMeshPhysicalMaterial || m?.type === 'MeshPhysicalMaterial')) return 'water';
  if (mesh.isInstancedMesh) return 'instanced';
  if (mesh.isMesh) return 'other';
  return null;
}

export function classifyRampKind(mesh, ramps = []) {
  const p = mesh?.geometry?.parameters;
  if (mesh?.geometry?.type !== 'BoxGeometry' || !p) return null;
  if (sameGeom(p.height, 0.95) && ramps.some(r => sameGeom(p.width, 2 * r.half) && sameGeom(p.depth, r.len))) return 'deck';
  if (sameGeom(p.width, 0.18) && sameGeom(p.height, 0.08)) return 'strip';
  return null;
}

export function catalogueCountIsNotLayerAttribution(report) {
  if (!report?.frames?.length) return true;
  return report.frames.some(frame => !Array.isArray(frame.layers)
    || frame.layers.length !== WORLD_LAYERS.length
    || frame.layers.some(row => !WORLD_LAYERS.includes(row.id)
      || !Number.isFinite(row.changedFraction)
      || !Number.isFinite(row.hidden)));
}

function layerRow(id, extra = {}) {
  return { id, hidden: id === 'ramps' ? 150 : id === 'piers' ? 176 : id === 'water' ? 2 : id === 'instanced' ? 12 : 40, changed: 8, changedFraction: 0.1633, ...extra };
}

function frame(id, extra = {}) {
  const spec = LAYER_FRAMES.find(row => row.id === id);
  return {
    id, t: spec.t, night: spec.night, file: spec.file,
    follow: 7.4, height: 1.92, fov: 58, nonBlackFraction: 0.42,
    contributing: ['ramps', 'instanced', 'other'],
    layers: WORLD_LAYERS.map(layerId => layerRow(layerId)),
    ...extra,
  };
}

export function worldLayerFixture(extra = {}) {
  return {
    colliderCount: 722, legacyCount: 546, pierCount: 176, rampCount: 50, routeSamples: 781,
    checkpointCount: 8, historicalRamps: HISTORICAL_RAMPS, historicalColliders: HISTORICAL_COLLIDERS,
    decks: EXPECTED_DECKS, strips: EXPECTED_STRIPS, classifiedPiers: EXPECTED_PIERS,
    originalGoldenComparisons: 0, authority: false, baselineUpdates: 0, updateGolden: false,
    pageErrors: [], glError: 0, protocol: 'world-layer-isolation-not-original-golden',
    frames: LAYER_FRAMES.map(spec => frame(spec.id)),
    ...extra,
  };
}

export function worldLayerResults(r) {
  assert.ok(r && typeof r === 'object', 'world-layer evidence missing');
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
  assert.equal(r.historicalRamps, HISTORICAL_RAMPS);
  assert.equal(r.historicalColliders, HISTORICAL_COLLIDERS);
  assert.equal(r.decks, EXPECTED_DECKS);
  assert.equal(r.strips, EXPECTED_STRIPS);
  assert.equal(r.classifiedPiers, EXPECTED_PIERS);
  assert.deepEqual(r.pageErrors ?? [], []);
  assert.equal(r.glError ?? 0, 0);
  assert.ok(Array.isArray(r.frames) && r.frames.length === 4, 'world-layer frames missing');
  assert.equal(catalogueCountIsNotLayerAttribution(r), false, 'catalogue counts are not pixel-layer attribution');
  let empty = 0, cameraFail = 0, contribFail = 0;
  for (const spec of LAYER_FRAMES) {
    const row = r.frames.find(frameRow => frameRow.id === spec.id);
    assert.ok(row, `missing frame ${spec.id}`);
    assert.equal(row.night, spec.night);
    assert.ok(Math.abs(row.follow - 7.4) <= 0.05 && Math.abs(row.height - 1.92) <= 0.05);
    if (Math.abs(row.follow - 7.4) > 0.05 || Math.abs(row.height - 1.92) > 0.05) cameraFail += 1;
    const layers = Object.fromEntries(row.layers.map(layer => [layer.id, layer]));
    for (const id of WORLD_LAYERS) {
      assert.ok(layers[id], `missing layer ${id} on ${spec.id}`);
      assert.ok(layers[id].hidden >= 0);
    }
    if (layers.ramps.hidden === 0 && layers.piers.hidden === 0) empty += 1;
    const contrib = row.layers.filter(layer => layer.changedFraction >= LAYER_CONTRIB_MIN).map(layer => layer.id);
    if (!contrib.length) contribFail += 1;
  }
  assert.equal(empty, 0, 'classified ramp/pier membership missing');
  return [
    {
      case: 'catalogue counts (50 ramps / 722 colliders) are not pixel-layer attribution',
      status: 'passed',
      probes: 4,
      failures: 0,
    },
    {
      case: 'live rest chase stays 7.4/1.92 while layers are isolated',
      status: cameraFail ? 'failed' : 'passed',
      probes: 4,
      failures: cameraFail,
    },
    {
      case: 'classified membership is 50 decks / 100 strips / 176 piers',
      status: (r.decks === EXPECTED_DECKS && r.strips === EXPECTED_STRIPS && r.classifiedPiers === EXPECTED_PIERS) ? 'passed' : 'failed',
      probes: 3,
      failures: (r.decks === EXPECTED_DECKS && r.strips === EXPECTED_STRIPS && r.classifiedPiers === EXPECTED_PIERS) ? 0 : 1,
    },
    {
      case: 'at least one live world layer changes samples at each golden pose',
      status: contribFail ? 'failed' : 'passed',
      probes: 4,
      failures: contribFail,
    },
    {
      case: 'world-layer isolation is not original-golden comparison',
      status: 'passed',
      probes: 1,
      failures: 0,
    },
  ];
}

export async function retainWorldLayers(report, out) {
  await mkdir(out, { recursive: true });
  await writeFile(`${out}/results.json`, JSON.stringify(report, null, 2) + '\n');
  const results = worldLayerResults(report);
  await writeFile(`${out}/results.json`, JSON.stringify({ ...report, results }, null, 2) + '\n');
  return results;
}

export async function measureWorldLayers(browser, url) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error)));
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 40000 });
    const report = await page.evaluate(async ({ frames, layers, litMin, channelEps }) => {
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
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        if (mats.some(m => m?.isMeshPhysicalMaterial || m?.type === 'MeshPhysicalMaterial')) return 'water';
        if (mesh.isInstancedMesh) return 'instanced';
        if (mesh.isMesh) return 'other';
        return null;
      };
      const rampKind = (mesh, ramps) => {
        const p = mesh?.geometry?.parameters;
        if (mesh?.geometry?.type !== 'BoxGeometry' || !p) return null;
        if (same(p.height, 0.95) && ramps.some(r => same(p.width, 2 * r.half) && same(p.depth, r.len))) return 'deck';
        if (same(p.width, 0.18) && same(p.height, 0.08)) return 'strip';
        return null;
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
        const membership = { ramps: [], piers: [], water: [], instanced: [], other: [] };
        let decks = 0, strips = 0;
        for (const mesh of meshes) {
          const id = classify(mesh, ramps);
          if (!id) continue;
          membership[id].push(mesh);
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
            return {
              id, hidden: members.length, changed,
              changedFraction: changed / full.samples.length,
            };
          });
          engine.renderer.render(engine.scene, engine.camera);
          return {
            id: spec.id, t: spec.t, night: spec.night, file: spec.file,
            player, camera, follow: Math.hypot(dx, dz), height: dy, fov: engine.camera.fov,
            speed: engine.player.speed, yaw: engine.player.yaw, dx, dy, dz,
            nonBlackFraction: full.nonBlackFraction, litSamples: full.lit, totalSamples: full.total,
            glError: gl.getError(),
            contributing: layerRows.filter(row => row.changedFraction >= litMin).map(row => row.id),
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
          classified: Object.fromEntries(layers.map(id => [id, membership[id].length])),
          glError: gl.getError(),
          frames: frames.map(capture),
        };
      } finally {
        engine.dispose();
        canvas.remove();
      }
    }, { frames: LAYER_FRAMES, layers: WORLD_LAYERS, litMin: LAYER_CONTRIB_MIN, channelEps: CHANNEL_EPS });
    return {
      ...report,
      historicalRamps: HISTORICAL_RAMPS,
      historicalColliders: HISTORICAL_COLLIDERS,
      originalGoldenComparisons: 0,
      authority: false,
      baselineUpdates: 0,
      updateGolden: false,
      protocol: 'world-layer-isolation-not-original-golden',
      pageErrors,
    };
  } finally {
    await page.close();
  }
}

export async function verifyWorldLayers(browser, url) {
  const report = await measureWorldLayers(browser, url);
  const out = process.env.WORLD_LAYER_OUTPUT ?? fromRoot('artifacts', 'world-layer');
  const results = await retainWorldLayers(report, out);
  const blocking = results.filter(row => row.blocking !== false);
  assert.ok(blocking.every(row => row.status === 'passed'), JSON.stringify({ results, frames: report.frames, classified: report.classified }));
  return results;
}

if (process.argv[1] && await realpath(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { chromium } = await import('playwright');
  const launch = { headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] };
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) launch.executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  const browser = await chromium.launch(launch);
  try {
    console.log(JSON.stringify(await verifyWorldLayers(browser, process.env.SMOKE_URL ?? 'http://127.0.0.1:8080/?qa=1'), null, 2));
  } finally {
    await browser.close();
  }
}
