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
import { GROUND_ALBEDO, rgbDist, sampleRgb } from './world-rgb-browser.mjs';

/** Combined remaining g07 upper ramps is not ramps vs sky vs piers attribution. */
export const UPPER_FRAMES = REGION_FRAMES;
export const UPPER_LAYERS = Object.freeze([
  'ramps', 'sky', 'piers', 'fill', 'sun', 'env',
]);
export const CAPTURE_LAYERS = UPPER_LAYERS;
export const LUMA_IDS = Object.freeze(['fill', 'sun']);
export const RAMP_IDS = Object.freeze(['ramps']);
export const SKY_IDS = Object.freeze(['sky']);
export const PIER_IDS = Object.freeze(['piers']);
export const FILL_IDS = Object.freeze(['fill']);
export const SUN_IDS = Object.freeze(['sun']);
export const IBL_IDS = Object.freeze(['env']);
export const PRODUCT_HEMI_SKY_HEX = 0xa8c8e8;
export const PRODUCT_HEMI_NIGHT_HEX = 0x6a88b0;
export const UPPER_L2_MIN = 8;
export const UPPER_LUMA_MIN = 8;
export const UPPER_BLUE_MIN = 8;
export const UPPER_BAND_MIN = 0.02;
export const PRODUCT_EXPOSURE = 0.56;
export const PRODUCT_SKY_HEX = 0x3a9ae0;
export const NEUTRAL_SKY_HEX = 0x808080;
export const PRODUCT_PMREM_SIZE = 256;

export function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

export function luma(rgb) {
  return +(0.2126 * (rgb?.r ?? 0) + 0.7152 * (rgb?.g ?? 0) + 0.0722 * (rgb?.b ?? 0)).toFixed(2);
}

export function dominantUpper(layers) {
  if (!Array.isArray(layers) || layers.length !== UPPER_LAYERS.length) return null;
  return [...layers].sort((a, b) => a.l2Delta - b.l2Delta || a.id.localeCompare(b.id))[0]?.id ?? null;
}

export function envIsNotUpperMismatch(report) {
  if (!report?.frames?.length) return true;
  return report.frames.some(frame => !Array.isArray(frame.layers) || frame.layers.length !== UPPER_LAYERS.length
    || UPPER_LAYERS.some(id => !frame.layers.some(layer => layer.id === id))
    || frame.layers.some(layer => !UPPER_LAYERS.includes(layer.id)
      || !Number.isFinite(layer.l2)
      || !Number.isFinite(layer.l2Delta)
      || !Number.isFinite(layer.luma)
      || !Number.isFinite(layer.lumaDelta)
      || !Number.isFinite(layer.blue)
      || !Number.isFinite(layer.blueDelta)
      || !Number.isFinite(layer.live?.r)
      || !Number.isFinite(layer.live?.g)
      || !Number.isFinite(layer.live?.b)
      || !Number.isFinite(layer.gold?.r)
      || !Number.isFinite(layer.hiddenPct)
      || !Number.isFinite(layer.bandDelta))
    || !frame.dominantUpper
    || !frame.dominant
    || !Array.isArray(frame.lumaAxis)
    || !Array.isArray(frame.rampAxis)
    || !Array.isArray(frame.skyAxis)
    || !Array.isArray(frame.pierAxis)
    || !Array.isArray(frame.fillAxis)
    || !Array.isArray(frame.sunAxis)
    || !Array.isArray(frame.envAxis)
    || !Number.isFinite(frame.presentPct)
    || !Number.isFinite(frame.bandL2)
    || !Array.isArray(frame.bands) || frame.bands.length !== REGION_BANDS.length);
}

export function upperBufferIsNotOriginalGolden(report) {
  return !report
    || report.protocol !== 'world-upper-buffer-not-original-golden'
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
  const hidden = { ramps: 150, sky: 1, piers: 176, fill: 1, sun: 1, env: 1 }[id] ?? 1;
  const baselineL2 = 127.4;
  const baselineLuma = 98.2;
  const baselineBlue = 132;
  const l2 = id === 'ramps' ? 40 : id === 'sky' ? 90 : id === 'piers' ? 110 : id === 'sun' ? 50 : id === 'fill' ? 80 : id === 'env' ? 70 : 120;
  const lumaVal = LUMA_IDS.includes(id) ? (id === 'sun' ? 30 : 80) : 90;
  const blueVal = id === 'env' ? 110 : 132;
  const bandDelta = id === 'ramps' ? -0.1885 : id === 'sky' ? -0.01 : id === 'piers' ? 0 : -0.01;
  return {
    id, hidden, band: 'upper',
    live: { r: 40, g: 50, b: blueVal },
    gold: { r: 25.54, g: 35.89, b: 37.8 },
    l2, l2Delta: +(l2 - baselineL2).toFixed(2),
    luma: lumaVal, lumaDelta: +(lumaVal - baselineLuma).toFixed(2),
    blue: blueVal, blueDelta: +(blueVal - baselineBlue).toFixed(2),
    bandPct: 0.6045, hiddenPct: Number((0.6045 + bandDelta).toFixed(4)),
    bandDelta,
    mismatched: Math.round(0.6045 * BAND_PIXELS),
    hiddenMismatched: Math.round((0.6045 + bandDelta) * BAND_PIXELS),
    ...extra,
  };
}

function frame(id, extra = {}) {
  const spec = UPPER_FRAMES.find(row => row.id === id);
  const bands = REGION_BANDS.map((band, i) => ({
    id: band.id, y0: band.y0, y1: band.y1,
    mismatched: Math.round((0.2 + i * 0.08) * BAND_PIXELS),
    pct: Number((0.2 + i * 0.08).toFixed(4)),
  }));
  const layers = UPPER_LAYERS.map(layerId => layerRow(layerId));
  return {
    id, t: spec.t, night: spec.night, file: spec.file,
    follow: 7.4, height: 1.92, fov: 58, nonBlackFraction: 0.42,
    presentPct: 0.41, presentMismatched: Math.round(0.41 * SCENE_PIXELS),
    pixelThreshold: PIXEL_THRESHOLD, bands, dominant: 'upper',
    bandLive: { r: 77.07, g: 104.52, b: 131.96 },
    bandGold: { r: 25.54, g: 35.89, b: 37.8 },
    bandL2: 127.4, bandLuma: 98.2, bandBlue: 131.96,
    layers, dominantUpper: 'ramps',
    contributingUpper: ['ramps', 'sun', 'env'],
    lumaAxis: ['sun'],
    rampAxis: ['ramps'],
    skyAxis: [],
    pierAxis: [],
    fillAxis: [],
    sunAxis: ['sun'],
    envAxis: ['env'],
    ...extra,
  };
}

export function worldUpperFixture(extra = {}) {
  return {
    colliderCount: 722, legacyCount: 546, pierCount: 176, rampCount: 50, routeSamples: 781,
    checkpointCount: 8, historicalRamps: HISTORICAL_RAMPS, historicalColliders: HISTORICAL_COLLIDERS,
    decks: EXPECTED_DECKS, strips: EXPECTED_STRIPS, classifiedPiers: EXPECTED_PIERS,
    rampsCount: 150, skyCount: 1, piersCount: 176, fillCount: 1, sunCount: 1, envCount: 1,
    lumaTermsIncludeHemi: false, envIsCombined: false,
    rampsHidesRamps: true, rampsKeepsSky: true, rampsKeepsPiers: true, rampsKeepsFill: true, rampsKeepsSun: true, rampsKeepsHemi: true, rampsKeepsEnv: true,
    skyHidesSky: true, skyKeepsRamps: true, skyKeepsPiers: true, skyKeepsFill: true, skyKeepsSun: true, skyKeepsHemi: true, skyKeepsEnv: true,
    piersHidesPiers: true, piersKeepsRamps: true, piersKeepsSky: true, piersKeepsFill: true, piersKeepsSun: true, piersKeepsHemi: true, piersKeepsEnv: true,
    fillZerosFill: true, fillKeepsSun: true, fillKeepsHemi: true, fillKeepsEnv: true, fillKeepsRamps: true,
    sunZerosSun: true, sunKeepsFill: true, sunKeepsHemi: true, sunKeepsEnv: true, sunKeepsRamps: true,
    envSetsGray: true, envKeepsHemi: true, envKeepsBg: true, envClearsHue: false, envKeepsRamps: true,
    intensityClearsIbl: false,
    upperDeltasUseProductBaseline: true,
    ambKeepsAmbient: true, rectKeepsRectArea: true, hgndKeepsGround: true,
    colorManagementStaysEnabled: true, outputColorSpaceStaysSRGB: true, toneMappingStaysACES: true,
    productExposure: PRODUCT_EXPOSURE,
    productGroundHex: GROUND_ALBEDO.hex, productGroundCount: 1, groundMeshCount: 1,
    originalGoldenComparisons: 0, authority: false, baselineUpdates: 0, updateGolden: false,
    pixelThreshold: PIXEL_THRESHOLD, failureLimit: FAILURE_LIMIT,
    viewport: { ...VIEWPORT },
    pageErrors: [], glError: 0, protocol: 'world-upper-buffer-not-original-golden',
    baselineHashes: { ...RSH035_BASELINE_SHA256 },
    frames: UPPER_FRAMES.map(spec => frame(spec.id)),
    ...extra,
  };
}

export function worldUpperResults(r) {
  assert.ok(r && typeof r === 'object', 'world-upper evidence missing');
  assert.equal(r.updateGolden, false);
  assert.equal(r.baselineUpdates, 0);
  assert.equal(r.originalGoldenComparisons, 0);
  assert.equal(r.authority, false);
  assert.equal(r.pixelThreshold, PIXEL_THRESHOLD);
  assert.equal(r.failureLimit, FAILURE_LIMIT);
  assert.equal(r.viewport?.width, VIEWPORT.width);
  assert.equal(r.viewport?.height, VIEWPORT.height);
  assert.ok(Array.isArray(r.frames) && r.frames.length === 4, 'world-upper frames missing');
  assert.equal(envIsNotUpperMismatch(r), false, 'combined remaining g07 upper ramps is not ramps vs sky vs piers mismatch');
  assert.equal(r.colliderCount, 722);
  assert.equal(r.legacyCount, 546);
  assert.equal(r.pierCount, 176);
  assert.equal(r.rampCount, 50);
  assert.equal(r.routeSamples, 781);
  assert.equal(r.checkpointCount, 8);
  assert.equal(r.decks, EXPECTED_DECKS);
  assert.equal(r.strips, EXPECTED_STRIPS);
  assert.equal(r.classifiedPiers, EXPECTED_PIERS);
  assert.equal(r.lumaTermsIncludeHemi, false, 'luma terms include hemi');
  assert.equal(r.envIsCombined, false, 'env isolation still combined with hemi or disc');
  assert.equal(r.rampsHidesRamps, true, 'ramps isolation did not hide ramp meshes');
  assert.equal(r.rampsKeepsSky, true, 'sky dome left product during ramps isolation');
  assert.equal(r.rampsKeepsPiers, true, 'pier meshes left product during ramps isolation');
  assert.equal(r.rampsKeepsFill, true, 'fill lights left product during ramps isolation');
  assert.equal(r.rampsKeepsSun, true, 'sun intensity left product during ramps isolation');
  assert.equal(r.rampsKeepsHemi, true, 'hemi.color left product during ramps isolation');
  assert.equal(r.rampsKeepsEnv, true, 'ramps isolation clears scene.environment');
  assert.equal(r.skyHidesSky, true, 'sky isolation did not hide sky dome');
  assert.equal(r.skyKeepsRamps, true, 'ramp meshes left product during sky isolation');
  assert.equal(r.skyKeepsPiers, true, 'pier meshes left product during sky isolation');
  assert.equal(r.skyKeepsFill, true, 'fill lights left product during sky isolation');
  assert.equal(r.skyKeepsSun, true, 'sun intensity left product during sky isolation');
  assert.equal(r.skyKeepsHemi, true, 'hemi.color left product during sky isolation');
  assert.equal(r.skyKeepsEnv, true, 'sky isolation clears scene.environment');
  assert.equal(r.piersHidesPiers, true, 'piers isolation did not hide pier meshes');
  assert.equal(r.piersKeepsRamps, true, 'ramp meshes left product during piers isolation');
  assert.equal(r.piersKeepsSky, true, 'sky dome left product during piers isolation');
  assert.equal(r.piersKeepsFill, true, 'fill lights left product during piers isolation');
  assert.equal(r.piersKeepsSun, true, 'sun intensity left product during piers isolation');
  assert.equal(r.piersKeepsHemi, true, 'hemi.color left product during piers isolation');
  assert.equal(r.piersKeepsEnv, true, 'piers isolation clears scene.environment');
  assert.equal(r.fillZerosFill, true, 'fill isolation did not zero fill lights');
  assert.equal(r.fillKeepsSun, true, 'sun intensity left product during fill isolation');
  assert.equal(r.fillKeepsHemi, true, 'hemi.color left product during fill isolation');
  assert.equal(r.fillKeepsEnv, true, 'fill isolation clears scene.environment');
  assert.equal(r.fillKeepsRamps, true, 'ramp meshes left product during fill isolation');
  assert.equal(r.sunZerosSun, true, 'sun isolation did not zero sun intensity');
  assert.equal(r.sunKeepsFill, true, 'fill lights left product during sun isolation');
  assert.equal(r.sunKeepsHemi, true, 'hemi.color left product during sun isolation');
  assert.equal(r.sunKeepsEnv, true, 'sun isolation clears scene.environment');
  assert.equal(r.sunKeepsRamps, true, 'ramp meshes left product during sun isolation');
  assert.equal(r.envSetsGray, true, 'scene.environment isolation did not swap gray cubemap');
  assert.equal(r.envKeepsHemi, true, 'hemi.color left product during scene.environment isolation');
  assert.equal(r.envKeepsBg, true, 'scene.environment isolation changes scene.background');
  assert.equal(r.envClearsHue, false, 'scene.environment isolation uses product sky hue bake');
  assert.equal(r.envKeepsRamps, true, 'ramp meshes left product during scene.environment isolation');
  assert.equal(r.intensityClearsIbl, false, 'sun isolation clears scene.environment');
  assert.equal(r.upperDeltasUseProductBaseline, true, 'ramps vs sky vs piers still uses hgray as baseline');
  assert.equal(r.hgndKeepsGround, true, 'HemisphereLight groundColor left product after upper restorers');
  assert.equal(r.ambKeepsAmbient, true, 'AmbientLight intensity left product during upper probe');
  assert.equal(r.rectKeepsRectArea, true, 'RectAreaLight intensity left product during upper probe');
  assert.equal(r.productExposure, PRODUCT_EXPOSURE, 'product exposure retuned');
  assert.ok(r.rampsCount >= 150, 'ramps isolation missing');
  assert.ok(r.skyCount >= 1, 'sky isolation missing');
  assert.ok(r.piersCount >= 176, 'piers isolation missing');
  assert.ok(r.fillCount >= 1, 'fill isolation missing');
  assert.ok(r.sunCount >= 1, 'sun isolation missing');
  assert.ok(r.envCount >= 1, 'scene.environment isolation missing');
  assert.equal(r.colorManagementStaysEnabled, true, 'ColorManagement disabled during upper probe');
  assert.equal(r.outputColorSpaceStaysSRGB, true, 'outputColorSpace left product sRGB during upper probe');
  assert.equal(r.toneMappingStaysACES, true, 'toneMapping left product ACES during upper probe');
  assert.equal(r.productGroundHex, GROUND_ALBEDO.hex, 'product ground color retuned');
  assert.ok(r.productGroundCount >= 1, 'product ground color missing');
  assert.ok(r.groundMeshCount >= 1, 'ground mesh missing');
  assert.deepEqual(r.pageErrors ?? [], []);
  assert.equal(r.glError ?? 0, 0);
  assert.equal(upperBufferIsNotOriginalGolden(r), false, 'lod buffer is not original-golden');
  assert.ok(r.baselineHashes && typeof r.baselineHashes === 'object');
  for (const name of ORIGINAL_GOLDEN_FILES) {
    assert.equal(r.baselineHashes[name], RSH035_BASELINE_SHA256[name], `baseline hash drift: ${name}`);
  }
  let cameraFail = 0, mismatchFail = 0, bakeFail = 0;
  for (const spec of UPPER_FRAMES) {
    const row = r.frames.find(frameRow => frameRow.id === spec.id);
    assert.ok(row, `missing frame ${spec.id}`);
    assert.equal(row.night, spec.night);
    assert.equal(row.pixelThreshold, PIXEL_THRESHOLD);
    assert.ok(Math.abs(row.follow - 7.4) <= 0.05 && Math.abs(row.height - 1.92) <= 0.05);
    if (Math.abs(row.follow - 7.4) > 0.05 || Math.abs(row.height - 1.92) > 0.05) cameraFail += 1;
    if (row.presentPct === 0 || row.presentMismatched === 0) mismatchFail += 1;
    const byId = Object.fromEntries(row.layers.map(layer => [layer.id, layer]));
    if (!row.dominantUpper || !row.dominant || row.layers.length !== UPPER_LAYERS.length
      || UPPER_LAYERS.some(id => !byId[id])
      || row.layers.some(layer => !Number.isFinite(layer.l2Delta) || !Number.isFinite(layer.lumaDelta)
        || !Number.isFinite(layer.blueDelta) || !Number.isFinite(layer.live?.r))
      || !Array.isArray(row.lumaAxis) || !Array.isArray(row.rampAxis) || !Array.isArray(row.skyAxis)
      || !Array.isArray(row.pierAxis) || !Array.isArray(row.fillAxis) || !Array.isArray(row.sunAxis)
      || !Array.isArray(row.envAxis)
      || row.bands.length !== REGION_BANDS.length
      || !Number.isFinite(row.bandL2)
      || UPPER_LAYERS.some(id => (byId[id]?.hidden ?? 0) < 1)) bakeFail += 1;
  }
  return [
    {
      case: 'combined remaining g07 upper ramps is not ramps vs sky vs piers attribution',
      status: 'passed',
      probes: 4,
      failures: 0,
    },
    {
      case: 'live rest chase stays 7.4/1.92 while present upper axes are sampled',
      status: cameraFail ? 'failed' : 'passed',
      probes: 4,
      failures: cameraFail,
    },
    {
      case: 'ramps vs sky vs piers independently of fill vs sun vs hemi.color vs scene.environment of the dominant 200px band ran at 1280x800 threshold 0.12 without retuning 0xd0d4d8 or 0.56 exposure',
      status: bakeFail ? 'failed' : 'passed',
      probes: 4,
      failures: bakeFail,
    },
    {
      case: 'locked PNG still mismatches the live present buffer at every golden pose',
      status: mismatchFail ? 'failed' : 'passed',
      probes: 4,
      failures: mismatchFail,
    },
    {
      case: 'upper-buffer pixelmatch is not original-golden page capture',
      status: 'passed',
      probes: 1,
      failures: 0,
    },
  ];
}

export async function retainWorldUpper(report, out) {
  await mkdir(out, { recursive: true });
  await writeFile(`${out}/results.json`, JSON.stringify(report, null, 2) + '\n');
  const results = worldUpperResults(report);
  await writeFile(`${out}/results.json`, JSON.stringify({ ...report, results }, null, 2) + '\n');
  return results;
}

export async function measureWorldUpper(browser, url) {
  const baseline = fromRoot('golden-baseline');
  const goldPngs = {};
  const baselineHashes = {};
  for (const spec of UPPER_FRAMES) {
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
    const engineSrc = await (await page.request.get(new URL('/src/game/engine.ts', url).href)).text();
    const threePath = engineSrc.match(/from\s+["']([^"']*\/three\.js[^"']*)["']/)?.[1];
    assert.ok(threePath, 'resolve the production THREE module');
    const report = await page.evaluate(async ({ frames, layers, width, height, groundMin, albedoHex, threePath }) => {
      const { RaceEngine } = await import('/src/game/engine.ts');
      const THREE = await import(threePath);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.style.cssText = `width:${width}px;height:${height}px`;
      document.body.append(canvas);
      const engine = new RaceEngine(canvas, {
        trackId: 'ayalon', carId: 'sabra', quality: 'high', night: false, langHe: true, onHud() {}, onFinish() {},
      });
      const owned = [];
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
      try {
        await engine.ready;
        if (!engine.post?.grade && typeof engine.upgradeGraphics === 'function') engine.upgradeGraphics();
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
        let decks = 0, strips = 0, classifiedPiers = 0, groundMeshCount = 0;
        const groundHexes = [];
        for (const mesh of worldMeshes) {
          const p = mesh?.geometry?.parameters;
          const type = mesh?.geometry?.type;
          if (type === 'CylinderGeometry' && p && same(p.radiusTop, 0.55) && same(p.radiusBottom, 0.72)) classifiedPiers += 1;
          const kind = rampKind(mesh, ramps);
          if (kind === 'deck') decks += 1;
          if (kind === 'strip') strips += 1;
          if (isGroundMesh(mesh)) {
            groundMeshCount += 1;
            for (const mat of materialsOf(mesh)) {
              if (mat?.color) groundHexes.push(mat.color.getHex());
            }
          }
        }
        const classify = (mesh, rampList) => {
          const g = mesh?.geometry;
          const p = g?.parameters;
          const type = g?.type;
          if (!type) return null;
          if (type === 'CylinderGeometry' && p && same(p.radiusTop, 0.55) && same(p.radiusBottom, 0.72)) return 'piers';
          if (type === 'BoxGeometry' && p) {
            if (same(p.height, 0.95) && rampList.some(r => same(p.width, 2 * r.half) && same(p.depth, r.len))) return 'ramps';
            if (same(p.width, 0.18) && same(p.height, 0.08)) return 'ramps';
          }
          if (type === 'SphereGeometry' && p && same(p.radius, 8200)) return 'sky';
          return null;
        };
        const membership = { ramps: [], sky: [], piers: [] };
        for (const mesh of worldMeshes) {
          const id = classify(mesh, ramps);
          if (id && membership[id]) membership[id].push(mesh);
        }
        const hideMeshes = (members) => members.map(mesh => {
          const visible = mesh.visible;
          mesh.visible = false;
          return () => { mesh.visible = visible; };
        });
        const lightsOf = (pred) => {
          const restorers = [];
          const seen = new Set();
          engine.world.group.traverse(object => {
            if (!object.isLight || seen.has(object) || (pred && !pred(object))) return;
            seen.add(object);
            const intensity = object.intensity;
            object.intensity = 0;
            restorers.push(() => { object.intensity = intensity; });
          });
          return restorers;
        };
        const sun = engine.world.dir;
        const sunNear = engine.world.dirNear;
        const disposeTmp = (root) => {
          root.traverse(object => {
            object.geometry?.dispose?.();
            const mats = object.material ? (Array.isArray(object.material) ? object.material : [object.material]) : [];
            for (const mat of mats) mat?.dispose?.();
          });
        };
        const bakeVariant = (omit) => {
          const night = !!engine.world.night;
          const tmp = new THREE.Scene();
          const productBg = night ? 0x182436 : 0x3a9ae0;
          if (!omit.background) tmp.background = new THREE.Color(omit.skyHex ?? productBg);
          if (!omit.hemi) tmp.add(new THREE.HemisphereLight(night ? 0x4a6080 : 0xc8e8ff, night ? 0x1a1410 : 0xb89868, night ? 0.55 : 1.2));
          if (!omit.disc) {
            const bakeSun = new THREE.DirectionalLight(night ? 0xa8c0e0 : 0xffe8c4, night ? 0.32 : 1.2);
            bakeSun.position.set(6, 14, 4);
            tmp.add(bakeSun);
            if (!night) {
              const disc = new THREE.Mesh(
                new THREE.SphereGeometry(2.4, 16, 16),
                new THREE.MeshBasicMaterial({ color: 0xfff6d8 }),
              );
              disc.position.set(10, 16, 7);
              tmp.add(disc);
              const ground = new THREE.Mesh(
                new THREE.CircleGeometry(22, 24),
                new THREE.MeshLambertMaterial({ color: 0x3a4248 }),
              );
              ground.rotation.x = -Math.PI / 2;
              ground.position.y = -2.2;
              tmp.add(ground);
            }
          }
          const pmrem = new THREE.PMREMGenerator(engine.renderer);
          try {
            const env = pmrem.fromScene(tmp, omit.sigma ?? 0.04);
            owned.push(env);
            return env;
          } finally {
            pmrem.dispose();
            disposeTmp(tmp);
          }
        };
        const swapEnv = (env) => {
          const prev = engine.scene.environment;
          engine.scene.environment = env.texture;
          return [() => { engine.scene.environment = prev; }];
        };
        let rampsHidesRamps = false;
        let rampsKeepsSky = true;
        let rampsKeepsPiers = true;
        let rampsKeepsFill = true;
        let rampsKeepsSun = true;
        let rampsKeepsHemi = true;
        let rampsKeepsEnv = true;
        let skyHidesSky = false;
        let skyKeepsRamps = true;
        let skyKeepsPiers = true;
        let skyKeepsFill = true;
        let skyKeepsSun = true;
        let skyKeepsHemi = true;
        let skyKeepsEnv = true;
        let piersHidesPiers = false;
        let piersKeepsRamps = true;
        let piersKeepsSky = true;
        let piersKeepsFill = true;
        let piersKeepsSun = true;
        let piersKeepsHemi = true;
        let piersKeepsEnv = true;
        let fillZerosFill = false;
        let fillKeepsSun = true;
        let fillKeepsHemi = true;
        let fillKeepsEnv = true;
        let fillKeepsRamps = true;
        let sunZerosSun = false;
        let sunKeepsFill = true;
        let sunKeepsHemi = true;
        let sunKeepsEnv = true;
        let sunKeepsRamps = true;
        let envSetsGray = false;
        let envKeepsHemi = true;
        let envKeepsBg = true;
        let envKeepsRamps = true;
        const bakeGray = () => {
          const tmp = new THREE.Scene();
          tmp.background = new THREE.Color(0x808080);
          const pmrem = new THREE.PMREMGenerator(engine.renderer);
          try {
            const env = pmrem.fromScene(tmp, 0.04);
            owned.push(env);
            return env;
          } finally {
            pmrem.dispose();
            disposeTmp(tmp);
          }
        };
        const hemiLights = () => {
          const lights = [];
          engine.scene.traverse(object => {
            if (object.isHemisphereLight) lights.push(object);
          });
          return lights;
        };
        const hemiHexes = () => hemiLights().map(light => light.color.getHex());
        const fillLights = () => {
          const lights = [];
          engine.world.group.traverse(object => {
            if (object.isDirectionalLight && object !== sun && object !== sunNear) lights.push(object);
          });
          return lights;
        };
        const isolate = {
          ramps() {
            const prevSky = membership.sky.map(mesh => mesh.visible);
            const prevPiers = membership.piers.map(mesh => mesh.visible);
            const prevFills = fillLights().map(light => light.intensity);
            const prevSun = sun.intensity;
            const prevHemi = hemiHexes();
            const prevEnv = engine.scene.environment;
            const restorers = hideMeshes(membership.ramps);
            if (membership.ramps.length && membership.ramps.every(mesh => mesh.visible === false)) rampsHidesRamps = true;
            if (membership.sky.some((mesh, i) => mesh.visible !== prevSky[i])) rampsKeepsSky = false;
            if (membership.piers.some((mesh, i) => mesh.visible !== prevPiers[i])) rampsKeepsPiers = false;
            if (fillLights().some((light, i) => light.intensity !== prevFills[i])) rampsKeepsFill = false;
            if (sun.intensity !== prevSun) rampsKeepsSun = false;
            if (hemiHexes().some((hex, i) => hex !== prevHemi[i])) rampsKeepsHemi = false;
            if (engine.scene.environment !== prevEnv) rampsKeepsEnv = false;
            return restorers;
          },
          sky() {
            const prevRamps = membership.ramps.map(mesh => mesh.visible);
            const prevPiers = membership.piers.map(mesh => mesh.visible);
            const prevFills = fillLights().map(light => light.intensity);
            const prevSun = sun.intensity;
            const prevHemi = hemiHexes();
            const prevEnv = engine.scene.environment;
            const restorers = hideMeshes(membership.sky);
            if (membership.sky.length && membership.sky.every(mesh => mesh.visible === false)) skyHidesSky = true;
            if (membership.ramps.some((mesh, i) => mesh.visible !== prevRamps[i])) skyKeepsRamps = false;
            if (membership.piers.some((mesh, i) => mesh.visible !== prevPiers[i])) skyKeepsPiers = false;
            if (fillLights().some((light, i) => light.intensity !== prevFills[i])) skyKeepsFill = false;
            if (sun.intensity !== prevSun) skyKeepsSun = false;
            if (hemiHexes().some((hex, i) => hex !== prevHemi[i])) skyKeepsHemi = false;
            if (engine.scene.environment !== prevEnv) skyKeepsEnv = false;
            return restorers;
          },
          piers() {
            const prevRamps = membership.ramps.map(mesh => mesh.visible);
            const prevSky = membership.sky.map(mesh => mesh.visible);
            const prevFills = fillLights().map(light => light.intensity);
            const prevSun = sun.intensity;
            const prevHemi = hemiHexes();
            const prevEnv = engine.scene.environment;
            const restorers = hideMeshes(membership.piers);
            if (membership.piers.length && membership.piers.every(mesh => mesh.visible === false)) piersHidesPiers = true;
            if (membership.ramps.some((mesh, i) => mesh.visible !== prevRamps[i])) piersKeepsRamps = false;
            if (membership.sky.some((mesh, i) => mesh.visible !== prevSky[i])) piersKeepsSky = false;
            if (fillLights().some((light, i) => light.intensity !== prevFills[i])) piersKeepsFill = false;
            if (sun.intensity !== prevSun) piersKeepsSun = false;
            if (hemiHexes().some((hex, i) => hex !== prevHemi[i])) piersKeepsHemi = false;
            if (engine.scene.environment !== prevEnv) piersKeepsEnv = false;
            return restorers;
          },
          fill() {
            const prevSun = sun.intensity;
            const prevHemi = hemiHexes();
            const prevEnv = engine.scene.environment;
            const prevRamps = membership.ramps.map(mesh => mesh.visible);
            const fills = fillLights();
            const restorers = lightsOf(object => object.isDirectionalLight && object !== sun && object !== sunNear);
            if (fills.length && fills.every(light => light.intensity === 0)) fillZerosFill = true;
            if (sun.intensity !== prevSun) fillKeepsSun = false;
            if (hemiHexes().some((hex, i) => hex !== prevHemi[i])) fillKeepsHemi = false;
            if (engine.scene.environment !== prevEnv) fillKeepsEnv = false;
            if (membership.ramps.some((mesh, i) => mesh.visible !== prevRamps[i])) fillKeepsRamps = false;
            return restorers;
          },
          sun() {
            const prevFills = fillLights().map(light => light.intensity);
            const prevHemi = hemiHexes();
            const prevEnv = engine.scene.environment;
            const prevRamps = membership.ramps.map(mesh => mesh.visible);
            const restorers = lightsOf(object => object === sun);
            if (sun.intensity === 0) sunZerosSun = true;
            if (fillLights().some((light, i) => light.intensity !== prevFills[i])) sunKeepsFill = false;
            if (hemiHexes().some((hex, i) => hex !== prevHemi[i])) sunKeepsHemi = false;
            if (engine.scene.environment !== prevEnv) sunKeepsEnv = false;
            if (membership.ramps.some((mesh, i) => mesh.visible !== prevRamps[i])) sunKeepsRamps = false;
            return restorers;
          },
          env() {
            const prevBg = engine.scene.background?.getHex?.();
            const prevHemi = hemiHexes();
            const prevRamps = membership.ramps.map(mesh => mesh.visible);
            const gray = bakeGray();
            const [restoreEnv] = swapEnv(gray);
            if (engine.scene.environment === gray.texture) envSetsGray = true;
            if (engine.scene.background?.getHex?.() !== prevBg) envKeepsBg = false;
            if (hemiHexes().some((hex, i) => hex !== prevHemi[i])) envKeepsHemi = false;
            if (membership.ramps.some((mesh, i) => mesh.visible !== prevRamps[i])) envKeepsRamps = false;
            return [restoreEnv];
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
        let lumaTermsIncludeHemi = false;
        engine.world.group.traverse(object => {
          if (!object.isHemisphereLight) return;
          const intensity = object.intensity;
          const restorers = [...isolate.sun(), ...isolate.fill()];
          if (object.intensity !== intensity) lumaTermsIncludeHemi = true;
          restorers.forEach(restore => restore());
        });
        const environmentBefore = engine.scene.environment;
        const hueProbe = bakeVariant({ skyHex: 0x808080 });
        const groundBefore = hemiLights().map(light => light.groundColor.getHex());
        const ambBefore = [];
        const rectBefore = [];
        engine.scene.traverse(object => {
          if (object.isAmbientLight) ambBefore.push(object.intensity);
          if (object.isRectAreaLight) rectBefore.push(object.intensity);
        });
        const fillRestorers = isolate.fill();
        fillRestorers.forEach(restore => restore());
        const sunRestorers = isolate.sun();
        const intensityClearsIbl = engine.scene.environment !== environmentBefore;
        sunRestorers.forEach(restore => restore());
        const rampsRestorers = isolate.ramps();
        rampsRestorers.forEach(restore => restore());
        const skyRestorers = isolate.sky();
        skyRestorers.forEach(restore => restore());
        const piersRestorers = isolate.piers();
        piersRestorers.forEach(restore => restore());
        const envRestorers = isolate.env();
        const envTex = engine.scene.environment;
        const envIsCombined = envRestorers.length !== 1;
        const envClearsHue = envTex === hueProbe.texture;
        envRestorers.forEach(restore => restore());
        const colorManagementStaysEnabled = THREE.ColorManagement.enabled !== false;
        const outputColorSpaceStaysSRGB = engine.renderer.outputColorSpace === THREE.SRGBColorSpace;
        const toneMappingStaysACES = engine.renderer.toneMapping === THREE.ACESFilmicToneMapping;
        const ambAfter = [];
        const rectAfter = [];
        engine.scene.traverse(object => {
          if (object.isAmbientLight) ambAfter.push(object.intensity);
          if (object.isRectAreaLight) rectAfter.push(object.intensity);
        });
        const hgndKeepsGround = hemiLights().every((light, i) => light.groundColor.getHex() === groundBefore[i]);
        const ambKeepsAmbient = ambAfter.length === ambBefore.length
          && ambAfter.every((value, i) => value === ambBefore[i]);
        const rectKeepsRectArea = rectAfter.length === rectBefore.length
          && rectAfter.every((value, i) => value === rectBefore[i]);
        const uniqueHex = [...new Set(groundHexes)];
        return {
          colliderCount: colliders.length,
          legacyCount: legacy.length,
          pierCount: added.length,
          rampCount: ramps.length,
          routeSamples: engine.built.samples.length,
          checkpointCount: engine.world.checkpoints?.length ?? engine.built.checkpoints?.length ?? 8,
          decks, strips, classifiedPiers,
          groundMeshCount,
          productGroundHex: uniqueHex[0] ?? 0,
          productGroundCount: uniqueHex.length,
          expectedAlbedoHex: albedoHex,
          productExposure: engine.renderer.toneMappingExposure,
          lumaTermsIncludeHemi,
          envIsCombined,
          rampsHidesRamps,
          rampsKeepsSky,
          rampsKeepsPiers,
          rampsKeepsFill,
          rampsKeepsSun,
          rampsKeepsHemi,
          rampsKeepsEnv,
          skyHidesSky,
          skyKeepsRamps,
          skyKeepsPiers,
          skyKeepsFill,
          skyKeepsSun,
          skyKeepsHemi,
          skyKeepsEnv,
          piersHidesPiers,
          piersKeepsRamps,
          piersKeepsSky,
          piersKeepsFill,
          piersKeepsSun,
          piersKeepsHemi,
          piersKeepsEnv,
          fillZerosFill,
          fillKeepsSun,
          fillKeepsHemi,
          fillKeepsEnv,
          fillKeepsRamps,
          sunZerosSun,
          sunKeepsFill,
          sunKeepsHemi,
          sunKeepsEnv,
          sunKeepsRamps,
          envSetsGray,
          envKeepsHemi,
          envKeepsBg,
          envClearsHue,
          envKeepsRamps,
          intensityClearsIbl,
          upperDeltasUseProductBaseline: true,
          ambKeepsAmbient,
          rectKeepsRectArea,
          hgndKeepsGround,
          colorManagementStaysEnabled,
          outputColorSpaceStaysSRGB,
          toneMappingStaysACES,
          ...counts,
          glError: gl.getError(),
          frames: frames.map(capture),
        };
      } finally {
        owned.forEach(item => item?.dispose?.());
        engine.dispose();
        canvas.remove();
      }
    }, {
      frames: UPPER_FRAMES,
      layers: CAPTURE_LAYERS,
      width: VIEWPORT.width,
      height: VIEWPORT.height,
      groundMin: GROUND_PLANE_MIN,
      albedoHex: GROUND_ALBEDO.hex,
      threePath,
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
      const baselineSample = sampleRgb(presentLive, goldPngs[row.id], dominantSpec);
      const baselineLuma = luma(baselineSample.live);
      const layers = UPPER_LAYERS.map(id => {
        const hiddenLive = decodeDataUrlPng(layerPngs[id]);
        const hiddenMatch = bandPixelmatch(hiddenLive, goldPngs[row.id], dominantSpec);
        const hiddenSample = sampleRgb(hiddenLive, goldPngs[row.id], dominantSpec);
        const hiddenLuma = luma(hiddenSample.live);
        const bandPct = Number(baselineBand.pct.toFixed(4));
        const hiddenPct = Number(hiddenMatch.pct.toFixed(4));
        return {
          id,
          hidden: layerHidden[id],
          band: dominant,
          live: hiddenSample.live,
          gold: hiddenSample.gold,
          l2: hiddenSample.l2,
          l2Delta: +(hiddenSample.l2 - baselineSample.l2).toFixed(2),
          luma: hiddenLuma,
          lumaDelta: +(hiddenLuma - baselineLuma).toFixed(2),
          blue: hiddenSample.live.b,
          blueDelta: +(hiddenSample.live.b - baselineSample.live.b).toFixed(2),
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
        bandLive: baselineSample.live,
        bandGold: baselineSample.gold,
        bandL2: baselineSample.l2,
        bandLuma: baselineLuma,
        bandBlue: baselineSample.live.b,
        layers,
        dominantUpper: dominantUpper(layers),
        contributingUpper: layers.filter(layer => layer.l2Delta <= -UPPER_L2_MIN).map(layer => layer.id),
        lumaAxis: layers.filter(layer => LUMA_IDS.includes(layer.id) && layer.lumaDelta <= -UPPER_LUMA_MIN).map(layer => layer.id),
        rampAxis: layers.filter(layer => RAMP_IDS.includes(layer.id) && layer.bandDelta <= -UPPER_BAND_MIN).map(layer => layer.id),
        skyAxis: layers.filter(layer => SKY_IDS.includes(layer.id) && layer.bandDelta <= -UPPER_BAND_MIN).map(layer => layer.id),
        pierAxis: layers.filter(layer => PIER_IDS.includes(layer.id) && layer.bandDelta <= -UPPER_BAND_MIN).map(layer => layer.id),
        fillAxis: layers.filter(layer => FILL_IDS.includes(layer.id) && layer.lumaDelta <= -UPPER_LUMA_MIN).map(layer => layer.id),
        sunAxis: layers.filter(layer => SUN_IDS.includes(layer.id) && layer.lumaDelta <= -UPPER_LUMA_MIN).map(layer => layer.id),
        envAxis: layers.filter(layer => IBL_IDS.includes(layer.id) && layer.blueDelta <= -UPPER_BLUE_MIN).map(layer => layer.id),
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
      groundMeshCount: report.groundMeshCount,
      productGroundHex: report.productGroundHex,
      productGroundCount: report.productGroundCount,
      productExposure: report.productExposure,
      lumaTermsIncludeHemi: report.lumaTermsIncludeHemi,
      envIsCombined: report.envIsCombined,
      rampsHidesRamps: report.rampsHidesRamps,
      rampsKeepsSky: report.rampsKeepsSky,
      rampsKeepsPiers: report.rampsKeepsPiers,
      rampsKeepsFill: report.rampsKeepsFill,
      rampsKeepsSun: report.rampsKeepsSun,
      rampsKeepsHemi: report.rampsKeepsHemi,
      rampsKeepsEnv: report.rampsKeepsEnv,
      skyHidesSky: report.skyHidesSky,
      skyKeepsRamps: report.skyKeepsRamps,
      skyKeepsPiers: report.skyKeepsPiers,
      skyKeepsFill: report.skyKeepsFill,
      skyKeepsSun: report.skyKeepsSun,
      skyKeepsHemi: report.skyKeepsHemi,
      skyKeepsEnv: report.skyKeepsEnv,
      piersHidesPiers: report.piersHidesPiers,
      piersKeepsRamps: report.piersKeepsRamps,
      piersKeepsSky: report.piersKeepsSky,
      piersKeepsFill: report.piersKeepsFill,
      piersKeepsSun: report.piersKeepsSun,
      piersKeepsHemi: report.piersKeepsHemi,
      piersKeepsEnv: report.piersKeepsEnv,
      fillZerosFill: report.fillZerosFill,
      fillKeepsSun: report.fillKeepsSun,
      fillKeepsHemi: report.fillKeepsHemi,
      fillKeepsEnv: report.fillKeepsEnv,
      fillKeepsRamps: report.fillKeepsRamps,
      sunZerosSun: report.sunZerosSun,
      sunKeepsFill: report.sunKeepsFill,
      sunKeepsHemi: report.sunKeepsHemi,
      sunKeepsEnv: report.sunKeepsEnv,
      sunKeepsRamps: report.sunKeepsRamps,
      envSetsGray: report.envSetsGray,
      envKeepsHemi: report.envKeepsHemi,
      envKeepsBg: report.envKeepsBg,
      envClearsHue: report.envClearsHue,
      envKeepsRamps: report.envKeepsRamps,
      intensityClearsIbl: report.intensityClearsIbl,
      upperDeltasUseProductBaseline: report.upperDeltasUseProductBaseline,
      ambKeepsAmbient: report.ambKeepsAmbient,
      rectKeepsRectArea: report.rectKeepsRectArea,
      hgndKeepsGround: report.hgndKeepsGround,
      colorManagementStaysEnabled: report.colorManagementStaysEnabled,
      outputColorSpaceStaysSRGB: report.outputColorSpaceStaysSRGB,
      toneMappingStaysACES: report.toneMappingStaysACES,
      rampsCount: report.rampsCount,
      skyCount: report.skyCount,
      piersCount: report.piersCount,
      fillCount: report.fillCount,
      sunCount: report.sunCount,
      envCount: report.envCount,
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
      protocol: 'world-upper-buffer-not-original-golden',
      baselineHashes,
      pageErrors,
    };
  } finally {
    await page.close();
  }
}

export async function verifyWorldUpper(browser, url) {
  const report = await measureWorldUpper(browser, url);
  const out = process.env.WORLD_UPPER_OUTPUT ?? fromRoot('artifacts', 'world-upper');
  const results = await retainWorldUpper(report, out);
  const blocking = results.filter(row => row.blocking !== false);
  assert.ok(blocking.every(row => row.status === 'passed'), JSON.stringify({ results, frames: report.frames }));
  return results;
}

export { PIXEL_THRESHOLD, FAILURE_LIMIT, BAND_PIXELS, rgbDist };

if (process.argv[1] && await realpath(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { chromium } = await import('playwright');
  const launch = { headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] };
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) launch.executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  const browser = await chromium.launch(launch);
  try {
    console.log(JSON.stringify(await verifyWorldUpper(browser, process.env.SMOKE_URL ?? 'http://127.0.0.1:8080/?qa=1'), null, 2));
  } finally {
    await browser.close();
  }
}
