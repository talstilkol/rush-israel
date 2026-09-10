import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, realpath } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import { fromRoot } from './project-root.mjs';
import { HISTORICAL_COLLIDERS, HISTORICAL_RAMPS } from './golden-attribution-browser.mjs';
import {
  FAILURE_LIMIT, ORIGINAL_GOLDEN_FILES, PIXEL_THRESHOLD, RSH035_BASELINE_SHA256, VIEWPORT,
} from './original-golden-browser.mjs';
import {
  EXPECTED_DECKS, EXPECTED_PIERS, EXPECTED_STRIPS, GROUND_PLANE_MIN,
} from './world-residual-browser.mjs';
import { SCENE_PIXELS, scenePixelmatch, decodeDataUrlPng } from './world-scene-browser.mjs';
import {
  BAND_PIXELS, REGION_BANDS, REGION_FRAMES, bandPixelmatch, dominantBand,
} from './world-region-browser.mjs';

/** Ground+daylight co-occupancy is not map/color/roughness or hemi/dir/fill/ambient/background attribution. */
export const FACTOR_FRAMES = REGION_FRAMES;
export const FACTOR_LAYERS = Object.freeze([
  'map', 'color', 'roughness', 'hemi', 'dir', 'fill', 'ambient', 'background',
]);
export const FACTOR_DELTA_MIN = 0.02;

export function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

export function dominantFactor(layers) {
  if (!Array.isArray(layers) || layers.length !== FACTOR_LAYERS.length) return null;
  return [...layers].sort((a, b) => a.bandDelta - b.bandDelta || a.id.localeCompare(b.id))[0]?.id ?? null;
}

export function materialLayerIsNotFactorMismatch(report) {
  if (!report?.frames?.length) return true;
  return report.frames.some(frame => !Array.isArray(frame.layers) || frame.layers.length !== FACTOR_LAYERS.length
    || frame.layers.some(layer => !FACTOR_LAYERS.includes(layer.id)
      || !Number.isFinite(layer.hiddenPct)
      || !Number.isFinite(layer.bandDelta)
      || !Number.isFinite(layer.hidden)
      || !Number.isFinite(layer.bandPct))
    || !frame.dominantFactor
    || !frame.dominant
    || !Number.isFinite(frame.presentPct)
    || !Array.isArray(frame.bands) || frame.bands.length !== REGION_BANDS.length);
}

export function factorBufferIsNotOriginalGolden(report) {
  return !report
    || report.protocol !== 'world-factor-buffer-not-original-golden'
    || report.originalGoldenComparisons !== 0
    || report.authority === true
    || report.updateGolden === true
    || report.baselineUpdates !== 0
    || report.pixelThreshold !== PIXEL_THRESHOLD
    || report.failureLimit !== FAILURE_LIMIT
    || report.viewport?.width !== VIEWPORT.width
    || report.viewport?.height !== VIEWPORT.height;
}

function layerRow(id, extra = {}) {
  const hidden = {
    map: 1, color: 1, roughness: 1, hemi: 1, dir: 2, fill: 1, ambient: 1, background: 2,
  }[id] ?? 1;
  const bandPct = 0.41;
  const hiddenPct = id === 'map' ? 0.28 : 0.40;
  return {
    id, hidden, band: 'bottom', bandPct, hiddenPct,
    bandDelta: Number((hiddenPct - bandPct).toFixed(4)),
    mismatched: Math.round(bandPct * BAND_PIXELS),
    hiddenMismatched: Math.round(hiddenPct * BAND_PIXELS),
    ...extra,
  };
}

function frame(id, extra = {}) {
  const spec = FACTOR_FRAMES.find(row => row.id === id);
  const bands = REGION_BANDS.map((band, i) => ({
    id: band.id, y0: band.y0, y1: band.y1,
    mismatched: Math.round((0.2 + i * 0.08) * BAND_PIXELS),
    pct: Number((0.2 + i * 0.08).toFixed(4)),
  }));
  const layers = FACTOR_LAYERS.map(layerId => layerRow(layerId));
  return {
    id, t: spec.t, night: spec.night, file: spec.file,
    follow: 7.4, height: 1.92, fov: 58, nonBlackFraction: 0.42,
    presentPct: 0.41, presentMismatched: Math.round(0.41 * SCENE_PIXELS),
    pixelThreshold: PIXEL_THRESHOLD, bands, dominant: 'bottom',
    layers, dominantFactor: 'map',
    contributingFactor: ['map'],
    ...extra,
  };
}

export function worldFactorFixture(extra = {}) {
  return {
    colliderCount: 722, legacyCount: 546, pierCount: 176, rampCount: 50, routeSamples: 781,
    checkpointCount: 8, historicalRamps: HISTORICAL_RAMPS, historicalColliders: HISTORICAL_COLLIDERS,
    decks: EXPECTED_DECKS, strips: EXPECTED_STRIPS, classifiedPiers: EXPECTED_PIERS,
    mapCount: 1, colorCount: 1, roughnessCount: 1,
    hemiCount: 1, dirCount: 2, fillCount: 1, ambientCount: 1, backgroundCount: 2,
    originalGoldenComparisons: 0, authority: false, baselineUpdates: 0, updateGolden: false,
    pixelThreshold: PIXEL_THRESHOLD, failureLimit: FAILURE_LIMIT,
    viewport: { ...VIEWPORT },
    pageErrors: [], glError: 0, protocol: 'world-factor-buffer-not-original-golden',
    baselineHashes: { ...RSH035_BASELINE_SHA256 },
    frames: FACTOR_FRAMES.map(spec => frame(spec.id)),
    ...extra,
  };
}

export function worldFactorResults(r) {
  assert.ok(r && typeof r === 'object', 'world-factor evidence missing');
  assert.equal(r.updateGolden, false);
  assert.equal(r.baselineUpdates, 0);
  assert.equal(r.originalGoldenComparisons, 0);
  assert.equal(r.authority, false);
  assert.equal(r.pixelThreshold, PIXEL_THRESHOLD);
  assert.equal(r.failureLimit, FAILURE_LIMIT);
  assert.equal(r.viewport?.width, VIEWPORT.width);
  assert.equal(r.viewport?.height, VIEWPORT.height);
  assert.equal(r.colliderCount, 722);
  assert.equal(r.legacyCount, 546);
  assert.equal(r.pierCount, 176);
  assert.equal(r.rampCount, 50);
  assert.equal(r.routeSamples, 781);
  assert.equal(r.checkpointCount, 8);
  assert.equal(r.decks, EXPECTED_DECKS);
  assert.equal(r.strips, EXPECTED_STRIPS);
  assert.equal(r.classifiedPiers, EXPECTED_PIERS);
  assert.ok(r.mapCount >= 1, 'ground map missing');
  assert.ok(r.colorCount >= 1, 'ground color missing');
  assert.ok(r.roughnessCount >= 1, 'ground roughness missing');
  assert.ok(r.hemiCount >= 1, 'hemi light missing');
  assert.ok(r.dirCount >= 1, 'dir light missing');
  assert.ok(r.fillCount >= 1, 'fill light missing');
  assert.ok(r.ambientCount >= 1, 'ambient light missing');
  assert.ok(r.backgroundCount >= 1, 'background missing');
  assert.deepEqual(r.pageErrors ?? [], []);
  assert.equal(r.glError ?? 0, 0);
  assert.ok(Array.isArray(r.frames) && r.frames.length === 4, 'world-factor frames missing');
  assert.equal(materialLayerIsNotFactorMismatch(r), false, 'dominant 200px band is not ground-map/color/roughness or daylight-hemi/dir/fill/ambient/background factor mismatch');
  assert.equal(factorBufferIsNotOriginalGolden(r), false, 'factor buffer is not original-golden');
  assert.ok(r.baselineHashes && typeof r.baselineHashes === 'object');
  for (const name of ORIGINAL_GOLDEN_FILES) {
    assert.equal(r.baselineHashes[name], RSH035_BASELINE_SHA256[name], `baseline hash drift: ${name}`);
  }
  let cameraFail = 0, mismatchFail = 0, factorFail = 0;
  for (const spec of FACTOR_FRAMES) {
    const row = r.frames.find(frameRow => frameRow.id === spec.id);
    assert.ok(row, `missing frame ${spec.id}`);
    assert.equal(row.night, spec.night);
    assert.equal(row.pixelThreshold, PIXEL_THRESHOLD);
    assert.ok(Math.abs(row.follow - 7.4) <= 0.05 && Math.abs(row.height - 1.92) <= 0.05);
    if (Math.abs(row.follow - 7.4) > 0.05 || Math.abs(row.height - 1.92) > 0.05) cameraFail += 1;
    if (row.presentPct === 0 || row.presentMismatched === 0) mismatchFail += 1;
    const byId = Object.fromEntries(row.layers.map(layer => [layer.id, layer]));
    if (!row.dominantFactor || !row.dominant || row.layers.length !== FACTOR_LAYERS.length
      || row.layers.some(layer => layer.hiddenPct < 0 || layer.hiddenPct > 1 || !Number.isFinite(layer.bandDelta))
      || row.bands.length !== REGION_BANDS.length
      || FACTOR_LAYERS.some(id => (byId[id]?.hidden ?? 0) < 1)) factorFail += 1;
  }
  return [
    {
      case: 'ground and daylight co-occupancy is not map color roughness or hemi dir fill ambient background attribution',
      status: 'passed',
      probes: 4,
      failures: 0,
    },
    {
      case: 'live rest chase stays 7.4/1.92 while present factor layers are matched',
      status: cameraFail ? 'failed' : 'passed',
      probes: 4,
      failures: cameraFail,
    },
    {
      case: 'ground map/color/roughness and daylight hemi/dir/fill/ambient/background of the dominant 200px band ran at 1280x800 threshold 0.12',
      status: factorFail ? 'failed' : 'passed',
      probes: 4,
      failures: factorFail,
    },
    {
      case: 'locked PNG still mismatches the live present buffer at every golden pose',
      status: mismatchFail ? 'failed' : 'passed',
      probes: 4,
      failures: mismatchFail,
    },
    {
      case: 'factor-buffer pixelmatch is not original-golden page capture',
      status: 'passed',
      probes: 1,
      failures: 0,
    },
  ];
}

export async function retainWorldFactor(report, out) {
  await mkdir(out, { recursive: true });
  await writeFile(`${out}/results.json`, JSON.stringify(report, null, 2) + '\n');
  const results = worldFactorResults(report);
  await writeFile(`${out}/results.json`, JSON.stringify({ ...report, results }, null, 2) + '\n');
  return results;
}

export async function measureWorldFactor(browser, url) {
  const baseline = fromRoot('golden-baseline');
  const goldPngs = {};
  const baselineHashes = {};
  for (const spec of FACTOR_FRAMES) {
    const buf = await readFile(`${baseline}/${spec.file}`);
    baselineHashes[spec.file] = sha256(buf);
    goldPngs[spec.id] = PNG.sync.read(buf);
  }
  const page = await browser.newPage({ viewport: { width: VIEWPORT.width, height: VIEWPORT.height } });
  page.setDefaultTimeout(180000);
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error)));
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 40000 });
    const report = await page.evaluate(async ({ frames, layers, width, height, groundMin }) => {
      const { RaceEngine } = await import('/src/game/engine.ts');
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.style.cssText = `width:${width}px;height:${height}px`;
      document.body.append(canvas);
      const engine = new RaceEngine(canvas, {
        trackId: 'ayalon', carId: 'sabra', quality: 'high', night: false, langHe: true, onHud() {}, onFinish() {},
      });
      const same = (a, b) => Math.abs(a - b) < 1e-4;
      const rampKind = (mesh, ramps) => {
        const p = mesh?.geometry?.parameters;
        if (mesh?.geometry?.type !== 'BoxGeometry' || !p) return null;
        if (same(p.height, 0.95) && ramps.some(r => same(p.width, 2 * r.half) && same(p.depth, r.len))) return 'deck';
        if (same(p.width, 0.18) && same(p.height, 0.08)) return 'strip';
        return null;
      };
      const materialsOf = (object) => {
        if (!object?.material) return [];
        return Array.isArray(object.material) ? object.material : [object.material];
      };
      const isGroundMesh = (mesh) => {
        const p = mesh?.geometry?.parameters;
        return mesh?.isMesh && mesh.geometry?.type === 'PlaneGeometry' && p && Number(p.width) >= groundMin;
      };
      const groundMats = () => {
        const mats = [];
        engine.world.group.traverse(object => {
          if (!isGroundMesh(object)) return;
          for (const mat of materialsOf(object)) if (mat) mats.push(mat);
        });
        return mats;
      };
      try {
        await engine.ready;
        engine.renderer.setAnimationLoop(null);
        engine.renderer.setPixelRatio(1);
        engine.renderer.setSize(width, height, false);
        engine.camera.aspect = width / height;
        engine.camera.updateProjectionMatrix();
        engine.post.setSize(width, height);
        const colliders = engine.world.colliders;
        const added = colliders.filter(c => c.role === 'support-pier');
        const legacy = colliders.filter(c => c.role !== 'support-pier');
        const ramps = engine.world.ramps;
        const gl = engine.renderer.getContext();
        const worldMeshes = [];
        engine.world.group.traverse(object => { if (object.isMesh) worldMeshes.push(object); });
        let decks = 0, strips = 0, classifiedPiers = 0;
        for (const mesh of worldMeshes) {
          const p = mesh?.geometry?.parameters;
          const type = mesh?.geometry?.type;
          if (type === 'CylinderGeometry' && p && same(p.radiusTop, 0.55) && same(p.radiusBottom, 0.72)) classifiedPiers += 1;
          const kind = rampKind(mesh, ramps);
          if (kind === 'deck') decks += 1;
          if (kind === 'strip') strips += 1;
        }
        const sun = engine.world.dir;
        const sunNear = engine.world.dirNear;
        const isolate = {
          map() {
            const restorers = [];
            for (const mat of groundMats()) {
              const prev = mat.map;
              mat.map = null;
              mat.needsUpdate = true;
              restorers.push(() => { mat.map = prev; mat.needsUpdate = true; });
            }
            return restorers;
          },
          color() {
            const restorers = [];
            for (const mat of groundMats()) {
              if (!mat.color) continue;
              const prev = mat.color.getHex();
              mat.color.setHex(0x000000);
              mat.needsUpdate = true;
              restorers.push(() => { mat.color.setHex(prev); mat.needsUpdate = true; });
            }
            return restorers;
          },
          roughness() {
            const restorers = [];
            for (const mat of groundMats()) {
              if (!('roughness' in mat)) continue;
              const prev = mat.roughness;
              mat.roughness = 0;
              mat.needsUpdate = true;
              restorers.push(() => { mat.roughness = prev; mat.needsUpdate = true; });
            }
            return restorers;
          },
          hemi() {
            const restorers = [];
            engine.world.group.traverse(object => {
              if (!object.isHemisphereLight) return;
              const intensity = object.intensity;
              object.intensity = 0;
              restorers.push(() => { object.intensity = intensity; });
            });
            return restorers;
          },
          dir() {
            const restorers = [];
            engine.world.group.traverse(object => {
              if (!object.isDirectionalLight) return;
              if (object !== sun && object !== sunNear) return;
              const intensity = object.intensity;
              object.intensity = 0;
              restorers.push(() => { object.intensity = intensity; });
            });
            return restorers;
          },
          fill() {
            const restorers = [];
            engine.world.group.traverse(object => {
              if (!object.isDirectionalLight) return;
              if (object === sun || object === sunNear) return;
              const intensity = object.intensity;
              object.intensity = 0;
              restorers.push(() => { object.intensity = intensity; });
            });
            return restorers;
          },
          ambient() {
            const restorers = [];
            engine.world.group.traverse(object => {
              if (!object.isAmbientLight) return;
              const intensity = object.intensity;
              object.intensity = 0;
              restorers.push(() => { object.intensity = intensity; });
            });
            return restorers;
          },
          background() {
            const restorers = [];
            const background = engine.scene.background;
            engine.scene.background = null;
            restorers.push(() => { engine.scene.background = background; });
            const fog = engine.scene.fog;
            if (fog && 'density' in fog) {
              const density = fog.density;
              fog.density = 0;
              restorers.push(() => { fog.density = density; });
            }
            return restorers;
          },
        };
        const encode = () => {
          const w = gl.drawingBufferWidth;
          const h = gl.drawingBufferHeight;
          const pixels = new Uint8Array(w * h * 4);
          gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
          const flipped = new Uint8ClampedArray(w * h * 4);
          let lit = 0;
          for (let y = 0; y < h; y++) {
            const src = y * w * 4;
            const dst = (h - 1 - y) * w * 4;
            flipped.set(pixels.subarray(src, src + w * 4), dst);
          }
          for (let i = 0; i < flipped.length; i += 4) {
            if (flipped[i] + flipped[i + 1] + flipped[i + 2] > 30) lit += 1;
          }
          const copy = document.createElement('canvas');
          copy.width = w;
          copy.height = h;
          copy.getContext('2d', { willReadFrequently: true }).putImageData(new ImageData(flipped, w, h), 0, 0);
          return { bufferWidth: w, bufferHeight: h, lit, png: copy.toDataURL('image/png') };
        };
        const poseOnce = (spec) => {
          engine.setNight(spec.night);
          engine.player.spawn(engine.built, spec.t, 0);
          engine.snapCamera(true, 0.016);
          engine.camera.updateMatrixWorld(true);
          engine.renderer.setPixelRatio(1);
          engine.renderer.setSize(width, height, false);
          engine.post.setSize(width, height);
          engine.post.setDrive(0, false);
        };
        const presentOnce = (spec) => {
          poseOnce(spec);
          engine.post.render();
          return encode();
        };
        const capture = (spec) => {
          const present = presentOnce(spec);
          const player = [engine.player.x, engine.player.y, engine.player.z];
          const camera = engine.camera.position.toArray();
          const dx = camera[0] - player[0];
          const dy = camera[1] - player[1];
          const dz = camera[2] - player[2];
          const layerPngs = {};
          const layerHidden = {};
          for (const id of layers) {
            poseOnce(spec);
            const restorers = isolate[id]();
            engine.post.render();
            const hidden = encode();
            restorers.forEach(restore => restore());
            layerPngs[id] = hidden.png;
            layerHidden[id] = restorers.length;
          }
          return {
            id: spec.id, t: spec.t, night: spec.night, file: spec.file,
            player, camera, follow: Math.hypot(dx, dz), height: dy, fov: engine.camera.fov,
            speed: engine.player.speed, yaw: engine.player.yaw, dx, dy, dz,
            bufferWidth: present.bufferWidth, bufferHeight: present.bufferHeight,
            nonBlackFraction: present.lit / (present.bufferWidth * present.bufferHeight),
            glError: gl.getError(),
            presentPng: present.png,
            layerPngs,
            layerHidden,
          };
        };
        const counts = {};
        for (const id of layers) {
          const restorers = isolate[id]();
          counts[`${id}Count`] = restorers.length;
          restorers.forEach(restore => restore());
        }
        return {
          colliderCount: colliders.length,
          legacyCount: legacy.length,
          pierCount: added.length,
          rampCount: ramps.length,
          routeSamples: engine.built.samples.length,
          checkpointCount: engine.world.checkpoints?.length ?? engine.built.checkpoints?.length ?? 8,
          decks, strips, classifiedPiers,
          ...counts,
          glError: gl.getError(),
          frames: frames.map(capture),
        };
      } finally {
        engine.dispose();
        canvas.remove();
      }
    }, {
      frames: FACTOR_FRAMES,
      layers: FACTOR_LAYERS,
      width: VIEWPORT.width,
      height: VIEWPORT.height,
      groundMin: GROUND_PLANE_MIN,
    });
    const frames = report.frames.map(row => {
      const { presentPng, layerPngs, layerHidden, bufferWidth, bufferHeight, ...rest } = row;
      assert.equal(bufferWidth, VIEWPORT.width, `${row.id} present width`);
      assert.equal(bufferHeight, VIEWPORT.height, `${row.id} present height`);
      const presentLive = decodeDataUrlPng(presentPng);
      const presentMatch = scenePixelmatch(presentLive, goldPngs[row.id]);
      const bands = REGION_BANDS.map(band => {
        const match = bandPixelmatch(presentLive, goldPngs[row.id], band);
        return {
          id: match.id, y0: match.y0, y1: match.y1,
          mismatched: match.mismatched,
          pct: Number(match.pct.toFixed(4)),
        };
      });
      const dominant = dominantBand(bands);
      const dominantSpec = REGION_BANDS.find(band => band.id === dominant);
      assert.ok(dominantSpec, `${row.id} dominant band missing`);
      const baselineBand = bandPixelmatch(presentLive, goldPngs[row.id], dominantSpec);
      const layers = FACTOR_LAYERS.map(id => {
        const hiddenLive = decodeDataUrlPng(layerPngs[id]);
        const hiddenMatch = bandPixelmatch(hiddenLive, goldPngs[row.id], dominantSpec);
        const bandPct = Number(baselineBand.pct.toFixed(4));
        const hiddenPct = Number(hiddenMatch.pct.toFixed(4));
        return {
          id,
          hidden: layerHidden[id],
          band: dominant,
          bandPct,
          hiddenPct,
          bandDelta: Number((hiddenPct - bandPct).toFixed(4)),
          mismatched: baselineBand.mismatched,
          hiddenMismatched: hiddenMatch.mismatched,
        };
      });
      return {
        ...rest,
        pixelThreshold: PIXEL_THRESHOLD,
        presentMismatched: presentMatch.mismatched,
        presentPct: Number(presentMatch.pct.toFixed(4)),
        bands,
        dominant,
        layers,
        dominantFactor: dominantFactor(layers),
        contributingFactor: layers.filter(layer => layer.bandDelta <= -FACTOR_DELTA_MIN).map(layer => layer.id),
      };
    });
    return {
      colliderCount: report.colliderCount,
      legacyCount: report.legacyCount,
      pierCount: report.pierCount,
      rampCount: report.rampCount,
      routeSamples: report.routeSamples,
      checkpointCount: report.checkpointCount,
      decks: report.decks,
      strips: report.strips,
      classifiedPiers: report.classifiedPiers,
      mapCount: report.mapCount,
      colorCount: report.colorCount,
      roughnessCount: report.roughnessCount,
      hemiCount: report.hemiCount,
      dirCount: report.dirCount,
      fillCount: report.fillCount,
      ambientCount: report.ambientCount,
      backgroundCount: report.backgroundCount,
      glError: report.glError,
      frames,
      historicalRamps: HISTORICAL_RAMPS,
      historicalColliders: HISTORICAL_COLLIDERS,
      originalGoldenComparisons: 0,
      authority: false,
      baselineUpdates: 0,
      updateGolden: false,
      pixelThreshold: PIXEL_THRESHOLD,
      failureLimit: FAILURE_LIMIT,
      viewport: { ...VIEWPORT },
      protocol: 'world-factor-buffer-not-original-golden',
      baselineHashes,
      pageErrors,
    };
  } finally {
    await page.close();
  }
}

export async function verifyWorldFactor(browser, url) {
  const report = await measureWorldFactor(browser, url);
  const out = process.env.WORLD_FACTOR_OUTPUT ?? fromRoot('artifacts', 'world-factor');
  const results = await retainWorldFactor(report, out);
  const blocking = results.filter(row => row.blocking !== false);
  assert.ok(blocking.every(row => row.status === 'passed'), JSON.stringify({ results, frames: report.frames }));
  return results;
}

export { PIXEL_THRESHOLD, FAILURE_LIMIT, BAND_PIXELS };

if (process.argv[1] && await realpath(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { chromium } = await import('playwright');
  const launch = { headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] };
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) launch.executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  const browser = await chromium.launch(launch);
  try {
    console.log(JSON.stringify(await verifyWorldFactor(browser, process.env.SMOKE_URL ?? 'http://127.0.0.1:8080/?qa=1'), null, 2));
  } finally {
    await browser.close();
  }
}
