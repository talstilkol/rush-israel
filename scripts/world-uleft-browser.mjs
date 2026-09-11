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

/** Leftover g07 after ramps+buildings+instanced+ground is not remaining unnamed occupancy vs env attribution. */
export const ULEFT_FRAMES = REGION_FRAMES;
export const ULEFT_LAYERS = Object.freeze([
  'unnamed', 'env', 'both', 'sky', 'piers', 'extras',
]);
export const CAPTURE_LAYERS = ULEFT_LAYERS;
export const UNNAMED_IDS = Object.freeze(['unnamed']);
export const IBL_IDS = Object.freeze(['env']);
export const BOTH_IDS = Object.freeze(['both']);
export const SKY_IDS = Object.freeze(['sky']);
export const PIER_IDS = Object.freeze(['piers']);
export const EXTRAS_IDS = Object.freeze(['extras']);
export const PRODUCT_HEMI_SKY_HEX = 0xa8c8e8;
export const PRODUCT_HEMI_NIGHT_HEX = 0x6a88b0;
export const ULEFT_L2_MIN = 8;
export const ULEFT_LUMA_MIN = 8;
export const ULEFT_BLUE_MIN = 8;
export const ULEFT_BAND_MIN = 0.02;
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

export function dominantUleft(layers) {
  if (!Array.isArray(layers) || layers.length !== ULEFT_LAYERS.length) return null;
  return [...layers].sort((a, b) => a.bandDelta - b.bandDelta || a.l2Delta - b.l2Delta || a.id.localeCompare(b.id))[0]?.id ?? null;
}

export function leftoverIsNotUleftMismatch(report) {
  if (!report?.frames?.length) return true;
  return report.frames.some(frame => !Array.isArray(frame.layers) || frame.layers.length !== ULEFT_LAYERS.length
    || ULEFT_LAYERS.some(id => !frame.layers.some(layer => layer.id === id))
    || frame.layers.some(layer => !ULEFT_LAYERS.includes(layer.id)
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
    || !frame.dominantUleft
    || !frame.dominant
    || !Array.isArray(frame.unnamedAxis)
    || !Array.isArray(frame.envAxis)
    || !Array.isArray(frame.bothAxis)
    || !Array.isArray(frame.skyAxis)
    || !Array.isArray(frame.pierAxis)
    || !Array.isArray(frame.extrasAxis)
    || !Number.isFinite(frame.leftoverBaselinePct)
    || !Number.isFinite(frame.presentPct)
    || !Number.isFinite(frame.bandL2)
    || !Array.isArray(frame.bands) || frame.bands.length !== REGION_BANDS.length);
}

export function uleftBufferIsNotOriginalGolden(report) {
  return !report
    || report.protocol !== 'world-uleft-buffer-not-original-golden'
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
  const hidden = { unnamed: 200, env: 151, both: 201, sky: 151, piers: 326, extras: 160 }[id] ?? 1;
  const baselineL2 = 40;
  const baselineLuma = 40;
  const baselineBlue = 90;
  const l2 = id === 'unnamed' ? 18 : id === 'both' ? 20 : id === 'extras' ? 28 : id === 'env' ? 40 : 40;
  const lumaVal = 40;
  const blueVal = id === 'env' ? 70 : 90;
  const bandDelta = id === 'unnamed' ? -0.10 : id === 'both' ? -0.08 : id === 'extras' ? -0.05 : id === 'env' ? 0.0076 : 0;
  return {
    id, hidden, band: 'upper',
    live: { r: 40, g: 50, b: blueVal },
    gold: { r: 25.54, g: 35.89, b: 37.8 },
    l2, l2Delta: +(l2 - baselineL2).toFixed(2),
    luma: lumaVal, lumaDelta: +(lumaVal - baselineLuma).toFixed(2),
    blue: blueVal, blueDelta: +(blueVal - baselineBlue).toFixed(2),
    bandPct: 0.2860, hiddenPct: Number((0.2860 + bandDelta).toFixed(4)),
    bandDelta,
    mismatched: Math.round(0.2860 * BAND_PIXELS),
    hiddenMismatched: Math.round((0.2860 + bandDelta) * BAND_PIXELS),
    ...extra,
  };
}

function frame(id, extra = {}) {
  const spec = ULEFT_FRAMES.find(row => row.id === id);
  const bands = REGION_BANDS.map((band, i) => ({
    id: band.id, y0: band.y0, y1: band.y1,
    mismatched: Math.round((0.2 + i * 0.08) * BAND_PIXELS),
    pct: Number((0.2 + i * 0.08).toFixed(4)),
  }));
  const layers = ULEFT_LAYERS.map(layerId => layerRow(layerId));
  return {
    id, t: spec.t, night: spec.night, file: spec.file,
    follow: 7.4, height: 1.92, fov: 58, nonBlackFraction: 0.42,
    presentPct: 0.41, presentMismatched: Math.round(0.41 * SCENE_PIXELS),
    pixelThreshold: PIXEL_THRESHOLD, bands, dominant: 'upper',
    bandLive: { r: 77.07, g: 104.52, b: 131.96 },
    bandGold: { r: 25.54, g: 35.89, b: 37.8 },
    bandL2: 127.4, bandLuma: 98.2, bandBlue: 131.96,
    layers, dominantUleft: 'unnamed',
    contributingUleft: ['unnamed', 'extras'],
    unnamedAxis: ['unnamed'],
    envAxis: [],
    bothAxis: ['both'],
    skyAxis: [],
    pierAxis: [],
    extrasAxis: ['extras'],
    leftoverBaselinePct: 0.2860,
    ...extra,
  };
}

export function worldUleftFixture(extra = {}) {
  return {
    colliderCount: 722, legacyCount: 546, pierCount: 176, rampCount: 50, routeSamples: 781,
    checkpointCount: 8, historicalRamps: HISTORICAL_RAMPS, historicalColliders: HISTORICAL_COLLIDERS,
    decks: EXPECTED_DECKS, strips: EXPECTED_STRIPS, classifiedPiers: EXPECTED_PIERS,
    rampsCount: 150, leftoverCount: 894, unnamedCount: 1100, envCount: 895, bothCount: 1101, skyCount: 895, piersCount: 1070, extrasCount: 900, buildingsCount: 696, instancedCount: 47, groundCount: 1,
    lumaTermsIncludeHemi: false, envIsCombined: false, bothIsCombined: false,
    unnamedHidesRemaining: true, unnamedHidesLeftover: true, unnamedKeepsEnv: true, unnamedKeepsHemi: true,
    envSetsGray: true, envHidesLeftover: true, envKeepsHemi: true, envKeepsBg: true, envClearsHue: false, envKeepsSky: true, envKeepsPiers: true, envKeepsExtras: true, envKeepsRemaining: true,
    bothHidesRemaining: true, bothHidesLeftover: true, bothSetsGray: true, bothKeepsHemi: true,
    skyHidesSky: true, skyHidesLeftover: true, skyKeepsPiers: true, skyKeepsExtras: true, skyKeepsEnv: true, skyKeepsHemi: true,
    piersHidesPiers: true, piersHidesLeftover: true, piersKeepsSky: true, piersKeepsExtras: true, piersKeepsEnv: true, piersKeepsHemi: true,
    extrasHidesExtras: true, extrasHidesLeftover: true, extrasKeepsSky: true, extrasKeepsPiers: true, extrasKeepsEnv: true, extrasKeepsHemi: true,
    intensityClearsIbl: false,
    uleftDeltasUseIgndBaseline: true,
    ambKeepsAmbient: true, rectKeepsRectArea: true, hgndKeepsGround: true,
    colorManagementStaysEnabled: true, outputColorSpaceStaysSRGB: true, toneMappingStaysACES: true,
    productExposure: PRODUCT_EXPOSURE,
    productGroundHex: GROUND_ALBEDO.hex, productGroundCount: 1, groundMeshCount: 1,
    originalGoldenComparisons: 0, authority: false, baselineUpdates: 0, updateGolden: false,
    pixelThreshold: PIXEL_THRESHOLD, failureLimit: FAILURE_LIMIT,
    viewport: { ...VIEWPORT },
    pageErrors: [], glError: 0, protocol: 'world-uleft-buffer-not-original-golden',
    baselineHashes: { ...RSH035_BASELINE_SHA256 },
    frames: ULEFT_FRAMES.map(spec => frame(spec.id)),
    ...extra,
  };
}

export function worldUleftResults(r) {
  assert.ok(r && typeof r === 'object', 'world-uleft evidence missing');
  assert.equal(r.updateGolden, false);
  assert.equal(r.baselineUpdates, 0);
  assert.equal(r.originalGoldenComparisons, 0);
  assert.equal(r.authority, false);
  assert.equal(r.pixelThreshold, PIXEL_THRESHOLD);
  assert.equal(r.failureLimit, FAILURE_LIMIT);
  assert.equal(r.viewport?.width, VIEWPORT.width);
  assert.equal(r.viewport?.height, VIEWPORT.height);
  assert.ok(Array.isArray(r.frames) && r.frames.length === 4, 'world-uleft frames missing');
  assert.equal(leftoverIsNotUleftMismatch(r), false, 'leftover g07 after ramps+buildings+instanced+ground is not remaining unnamed occupancy vs env mismatch');
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
  assert.equal(r.bothIsCombined, false, 'uleft isolation still combined with hemi');
  assert.equal(r.unnamedHidesRemaining, true, 'unnamed isolation did not hide remaining occupancy meshes');
  assert.equal(r.unnamedHidesLeftover, true, 'unnamed isolation did not hide leftover ramps+buildings+instanced+ground');
  assert.equal(r.unnamedKeepsEnv, true, 'unnamed isolation clears scene.environment');
  assert.equal(r.unnamedKeepsHemi, true, 'hemi.color left product during unnamed isolation');
  assert.equal(r.envSetsGray, true, 'scene.environment isolation did not swap gray cubemap');
  assert.equal(r.envHidesLeftover, true, 'env isolation did not hide leftover ramps+buildings+instanced+ground');
  assert.equal(r.envKeepsHemi, true, 'hemi.color left product during scene.environment isolation');
  assert.equal(r.envKeepsBg, true, 'scene.environment isolation changes scene.background');
  assert.equal(r.envClearsHue, false, 'scene.environment isolation uses product sky hue bake');
  assert.equal(r.envKeepsSky, true, 'sky dome left product during scene.environment isolation');
  assert.equal(r.envKeepsPiers, true, 'pier meshes left product during scene.environment isolation');
  assert.equal(r.envKeepsExtras, true, 'extras meshes left product during scene.environment isolation');
  assert.equal(r.envKeepsRemaining, true, 'remaining occupancy left product during scene.environment isolation');
  assert.equal(r.bothHidesRemaining, true, 'both isolation did not hide remaining occupancy meshes');
  assert.equal(r.bothHidesLeftover, true, 'both isolation did not hide leftover ramps+buildings+instanced+ground');
  assert.equal(r.bothSetsGray, true, 'both isolation did not swap gray cubemap');
  assert.equal(r.bothKeepsHemi, true, 'hemi.color left product during both isolation');
  assert.equal(r.skyHidesSky, true, 'sky isolation did not hide sky dome');
  assert.equal(r.skyHidesLeftover, true, 'sky isolation did not hide leftover ramps+buildings+instanced+ground');
  assert.equal(r.skyKeepsPiers, true, 'pier meshes left product during sky isolation');
  assert.equal(r.skyKeepsExtras, true, 'extras meshes left product during sky isolation');
  assert.equal(r.skyKeepsEnv, true, 'sky isolation clears scene.environment');
  assert.equal(r.skyKeepsHemi, true, 'hemi.color left product during sky isolation');
  assert.equal(r.piersHidesPiers, true, 'piers isolation did not hide pier meshes');
  assert.equal(r.piersHidesLeftover, true, 'piers isolation did not hide leftover ramps+buildings+instanced+ground');
  assert.equal(r.piersKeepsSky, true, 'sky dome left product during piers isolation');
  assert.equal(r.piersKeepsExtras, true, 'extras meshes left product during piers isolation');
  assert.equal(r.piersKeepsEnv, true, 'piers isolation clears scene.environment');
  assert.equal(r.piersKeepsHemi, true, 'hemi.color left product during piers isolation');
  assert.equal(r.extrasHidesExtras, true, 'extras isolation did not hide unclassified extras');
  assert.equal(r.extrasHidesLeftover, true, 'extras isolation did not hide leftover ramps+buildings+instanced+ground');
  assert.equal(r.extrasKeepsSky, true, 'sky dome left product during extras isolation');
  assert.equal(r.extrasKeepsPiers, true, 'pier meshes left product during extras isolation');
  assert.equal(r.extrasKeepsEnv, true, 'extras isolation clears scene.environment');
  assert.equal(r.extrasKeepsHemi, true, 'hemi.color left product during extras isolation');
  assert.equal(r.intensityClearsIbl, false, 'uleft isolation clears scene.environment via sun');
  assert.equal(r.uleftDeltasUseIgndBaseline, true, 'leftover g07 still uses ramps+buildings leftover as baseline');
  assert.equal(r.hgndKeepsGround, true, 'HemisphereLight groundColor left product after uleft restorers');
  assert.equal(r.ambKeepsAmbient, true, 'AmbientLight intensity left product during uleft probe');
  assert.equal(r.rectKeepsRectArea, true, 'RectAreaLight intensity left product during uleft probe');
  assert.equal(r.productExposure, PRODUCT_EXPOSURE, 'product exposure retuned');
  assert.ok(r.rampsCount >= 150, 'ramps leftover baseline missing');
  assert.ok(r.leftoverCount >= 151, 'ramps+buildings+instanced+ground leftover baseline missing');
  assert.ok(r.unnamedCount >= 151, 'unnamed remaining occupancy isolation missing');
  assert.ok(r.envCount >= 151, 'scene.environment isolation missing');
  assert.ok(r.bothCount >= 151, 'both unnamed+env isolation missing');
  assert.ok(r.skyCount >= 151, 'sky isolation missing');
  assert.ok(r.piersCount >= 151, 'piers isolation missing');
  assert.ok(r.extrasCount >= 151, 'extras isolation missing');
  assert.ok(r.buildingsCount >= 1, 'buildings leftover members missing');
  assert.ok(r.instancedCount >= 1, 'instanced leftover members missing');
  assert.ok(r.groundCount >= 1, 'ground leftover members missing');
  assert.equal(r.colorManagementStaysEnabled, true, 'ColorManagement disabled during uleft probe');
  assert.equal(r.outputColorSpaceStaysSRGB, true, 'outputColorSpace left product sRGB during uleft probe');
  assert.equal(r.toneMappingStaysACES, true, 'toneMapping left product ACES during uleft probe');
  assert.equal(r.productGroundHex, GROUND_ALBEDO.hex, 'product ground color retuned');
  assert.ok(r.productGroundCount >= 1, 'product ground color missing');
  assert.ok(r.groundMeshCount >= 1, 'ground mesh missing');
  assert.deepEqual(r.pageErrors ?? [], []);
  assert.equal(r.glError ?? 0, 0);
  assert.equal(uleftBufferIsNotOriginalGolden(r), false, 'lod buffer is not original-golden');
  assert.ok(r.baselineHashes && typeof r.baselineHashes === 'object');
  for (const name of ORIGINAL_GOLDEN_FILES) {
    assert.equal(r.baselineHashes[name], RSH035_BASELINE_SHA256[name], `baseline hash drift: ${name}`);
  }
  let cameraFail = 0, mismatchFail = 0, bakeFail = 0;
  for (const spec of ULEFT_FRAMES) {
    const row = r.frames.find(frameRow => frameRow.id === spec.id);
    assert.ok(row, `missing frame ${spec.id}`);
    assert.equal(row.night, spec.night);
    assert.equal(row.pixelThreshold, PIXEL_THRESHOLD);
    assert.ok(Math.abs(row.follow - 7.4) <= 0.05 && Math.abs(row.height - 1.92) <= 0.05);
    if (Math.abs(row.follow - 7.4) > 0.05 || Math.abs(row.height - 1.92) > 0.05) cameraFail += 1;
    if (row.presentPct === 0 || row.presentMismatched === 0) mismatchFail += 1;
    const byId = Object.fromEntries(row.layers.map(layer => [layer.id, layer]));
    if (!row.dominantUleft || !row.dominant || row.layers.length !== ULEFT_LAYERS.length
      || ULEFT_LAYERS.some(id => !byId[id])
      || row.layers.some(layer => !Number.isFinite(layer.l2Delta) || !Number.isFinite(layer.lumaDelta)
        || !Number.isFinite(layer.blueDelta) || !Number.isFinite(layer.live?.r))
      || !Array.isArray(row.unnamedAxis) || !Array.isArray(row.envAxis) || !Array.isArray(row.bothAxis)
      || !Array.isArray(row.skyAxis) || !Array.isArray(row.pierAxis) || !Array.isArray(row.extrasAxis)
      || !Number.isFinite(row.leftoverBaselinePct)
      || row.bands.length !== REGION_BANDS.length
      || !Number.isFinite(row.bandL2)
      || ULEFT_LAYERS.some(id => (byId[id]?.hidden ?? 0) < 1)) bakeFail += 1;
  }
  return [
    {
      case: 'leftover g07 after ramps+buildings+instanced+ground is not remaining unnamed occupancy vs env attribution',
      status: 'passed',
      probes: 4,
      failures: 0,
    },
    {
      case: 'live rest chase stays 7.4/1.92 while present uleft axes are sampled',
      status: cameraFail ? 'failed' : 'passed',
      probes: 4,
      failures: cameraFail,
    },
    {
      case: 'remaining unnamed occupancy independently of env of leftover g07 after ramps+buildings+instanced+ground ran at 1280x800 threshold 0.12 without retuning 0xd0d4d8 or 0.56 exposure',
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
      case: 'uleft-buffer pixelmatch is not original-golden page capture',
      status: 'passed',
      probes: 1,
      failures: 0,
    },
  ];
}

export async function retainWorldUleft(report, out) {
  await mkdir(out, { recursive: true });
  await writeFile(`${out}/results.json`, JSON.stringify(report, null, 2) + '\n');
  const results = worldUleftResults(report);
  await writeFile(`${out}/results.json`, JSON.stringify({ ...report, results }, null, 2) + '\n');
  return results;
}

export async function measureWorldUleft(browser, url) {
  const baseline = fromRoot('golden-baseline');
  const goldPngs = {};
  const baselineHashes = {};
  for (const spec of ULEFT_FRAMES) {
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
        const isRoadMaterial = (mat) => {
          if (!mat) return false;
          if (mat.userData?.lanes) return true;
          try {
            const key = typeof mat.customProgramCacheKey === 'function' ? String(mat.customProgramCacheKey()) : '';
            if (key.includes('rush-road')) return true;
          } catch { /* compiled key may throw before first use */ }
          return false;
        };
        const isIorWater = (mat) => {
          if (!mat || !(mat.isMeshPhysicalMaterial || mat.type === 'MeshPhysicalMaterial')) return false;
          return mat.transparent === true && Math.abs(Number(mat.ior) - 1.33) < 0.02;
        };
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
          if (isGroundMesh(mesh)) return 'ground';
          const physical = materialsOf(mesh).find(m => m?.isMeshPhysicalMaterial || m?.type === 'MeshPhysicalMaterial');
          if (physical && isIorWater(physical)) return 'water';
          if (materialsOf(mesh).some(isRoadMaterial) || mesh.userData?.lanes) return 'road';
          if (physical && !mesh.isInstancedMesh) return 'glass';
          if (mesh.isInstancedMesh) return 'instanced';
          return 'buildings';
        };
        const membership = { ramps: [], road: [], buildings: [], ground: [], sky: [], piers: [], water: [], glass: [], instanced: [], extras: [] };
        for (const mesh of worldMeshes) {
          const id = classify(mesh, ramps);
          if (id && membership[id]) membership[id].push(mesh);
          else membership.extras.push(mesh);
        };
        const leftoverOf = () => [...membership.ramps, ...membership.buildings, ...membership.instanced, ...membership.ground];
        const remainingOf = () => [...membership.water, ...membership.glass, ...membership.road, ...membership.sky, ...membership.piers, ...membership.extras];
        const hideMeshes = (members) => members.map(mesh => {
          const visible = mesh.visible;
          mesh.visible = false;
          return () => { mesh.visible = visible; };
        });
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
        let unnamedHidesRemaining = false;
        let unnamedHidesLeftover = false;
        let unnamedKeepsEnv = true;
        let unnamedKeepsHemi = true;
        let envSetsGray = false;
        let envHidesLeftover = false;
        let envKeepsHemi = true;
        let envKeepsBg = true;
        let envKeepsSky = true;
        let envKeepsPiers = true;
        let envKeepsExtras = true;
        let envKeepsRemaining = true;
        let bothHidesRemaining = false;
        let bothHidesLeftover = false;
        let bothSetsGray = false;
        let bothKeepsHemi = true;
        let skyHidesSky = false;
        let skyHidesLeftover = false;
        let skyKeepsPiers = true;
        let skyKeepsExtras = true;
        let skyKeepsEnv = true;
        let skyKeepsHemi = true;
        let piersHidesPiers = false;
        let piersHidesLeftover = false;
        let piersKeepsSky = true;
        let piersKeepsExtras = true;
        let piersKeepsEnv = true;
        let piersKeepsHemi = true;
        let extrasHidesExtras = false;
        let extrasHidesLeftover = false;
        let extrasKeepsSky = true;
        let extrasKeepsPiers = true;
        let extrasKeepsEnv = true;
        let extrasKeepsHemi = true;
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
        const leftoverHidden = () => leftoverOf().length && leftoverOf().every(mesh => mesh.visible === false);
        const remainingHidden = () => remainingOf().length && remainingOf().every(mesh => mesh.visible === false);
        const isolate = {
          unnamed() {
            const prevHemi = hemiHexes();
            const prevEnv = engine.scene.environment;
            const restorers = [...hideMeshes(leftoverOf()), ...hideMeshes(remainingOf())];
            if (remainingHidden()) unnamedHidesRemaining = true;
            if (leftoverHidden()) unnamedHidesLeftover = true;
            if (hemiHexes().some((hex, i) => hex !== prevHemi[i])) unnamedKeepsHemi = false;
            if (engine.scene.environment !== prevEnv) unnamedKeepsEnv = false;
            return restorers;
          },
          env() {
            const prevBg = engine.scene.background?.getHex?.();
            const prevHemi = hemiHexes();
            const prevSky = membership.sky.map(mesh => mesh.visible);
            const prevPiers = membership.piers.map(mesh => mesh.visible);
            const prevExtras = membership.extras.map(mesh => mesh.visible);
            const prevRemaining = remainingOf().map(mesh => mesh.visible);
            const gray = bakeGray();
            const restorers = [...hideMeshes(leftoverOf()), ...swapEnv(gray)];
            if (engine.scene.environment === gray.texture) envSetsGray = true;
            if (leftoverHidden()) envHidesLeftover = true;
            if (engine.scene.background?.getHex?.() !== prevBg) envKeepsBg = false;
            if (hemiHexes().some((hex, i) => hex !== prevHemi[i])) envKeepsHemi = false;
            if (membership.sky.some((mesh, i) => mesh.visible !== prevSky[i])) envKeepsSky = false;
            if (membership.piers.some((mesh, i) => mesh.visible !== prevPiers[i])) envKeepsPiers = false;
            if (membership.extras.some((mesh, i) => mesh.visible !== prevExtras[i])) envKeepsExtras = false;
            if (remainingOf().some((mesh, i) => mesh.visible !== prevRemaining[i])) envKeepsRemaining = false;
            return restorers;
          },
          both() {
            const prevHemi = hemiHexes();
            const gray = bakeGray();
            const restorers = [...hideMeshes(leftoverOf()), ...hideMeshes(remainingOf()), ...swapEnv(gray)];
            if (remainingHidden()) bothHidesRemaining = true;
            if (leftoverHidden()) bothHidesLeftover = true;
            if (engine.scene.environment === gray.texture) bothSetsGray = true;
            if (hemiHexes().some((hex, i) => hex !== prevHemi[i])) bothKeepsHemi = false;
            return restorers;
          },
          sky() {
            const prevPiers = membership.piers.map(mesh => mesh.visible);
            const prevExtras = membership.extras.map(mesh => mesh.visible);
            const prevHemi = hemiHexes();
            const prevEnv = engine.scene.environment;
            const restorers = [...hideMeshes(leftoverOf()), ...hideMeshes(membership.sky)];
            if (membership.sky.length && membership.sky.every(mesh => mesh.visible === false)) skyHidesSky = true;
            if (leftoverHidden()) skyHidesLeftover = true;
            if (membership.piers.some((mesh, i) => mesh.visible !== prevPiers[i])) skyKeepsPiers = false;
            if (membership.extras.some((mesh, i) => mesh.visible !== prevExtras[i])) skyKeepsExtras = false;
            if (hemiHexes().some((hex, i) => hex !== prevHemi[i])) skyKeepsHemi = false;
            if (engine.scene.environment !== prevEnv) skyKeepsEnv = false;
            return restorers;
          },
          piers() {
            const prevSky = membership.sky.map(mesh => mesh.visible);
            const prevExtras = membership.extras.map(mesh => mesh.visible);
            const prevHemi = hemiHexes();
            const prevEnv = engine.scene.environment;
            const restorers = [...hideMeshes(leftoverOf()), ...hideMeshes(membership.piers)];
            if (membership.piers.length && membership.piers.every(mesh => mesh.visible === false)) piersHidesPiers = true;
            if (leftoverHidden()) piersHidesLeftover = true;
            if (membership.sky.some((mesh, i) => mesh.visible !== prevSky[i])) piersKeepsSky = false;
            if (membership.extras.some((mesh, i) => mesh.visible !== prevExtras[i])) piersKeepsExtras = false;
            if (hemiHexes().some((hex, i) => hex !== prevHemi[i])) piersKeepsHemi = false;
            if (engine.scene.environment !== prevEnv) piersKeepsEnv = false;
            return restorers;
          },
          extras() {
            const prevSky = membership.sky.map(mesh => mesh.visible);
            const prevPiers = membership.piers.map(mesh => mesh.visible);
            const prevHemi = hemiHexes();
            const prevEnv = engine.scene.environment;
            const restorers = [...hideMeshes(leftoverOf()), ...hideMeshes(membership.extras)];
            if (!membership.extras.length || membership.extras.every(mesh => mesh.visible === false)) extrasHidesExtras = true;
            if (leftoverHidden()) extrasHidesLeftover = true;
            if (membership.sky.some((mesh, i) => mesh.visible !== prevSky[i])) extrasKeepsSky = false;
            if (membership.piers.some((mesh, i) => mesh.visible !== prevPiers[i])) extrasKeepsPiers = false;
            if (hemiHexes().some((hex, i) => hex !== prevHemi[i])) extrasKeepsHemi = false;
            if (engine.scene.environment !== prevEnv) extrasKeepsEnv = false;
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
          poseOnce(spec);
          const leftoverRestorers = hideMeshes(leftoverOf());
          engine.post.render();
          const leftover = encode();
          leftoverRestorers.forEach(restore => restore());
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
            leftoverPng: leftover.png,
            leftoverHidden: leftoverRestorers.length,
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
          const restorers = isolate.env();
          if (object.intensity !== intensity) lumaTermsIncludeHemi = true;
          restorers.forEach(restore => restore());
        });
        const hueProbe = bakeVariant({ skyHex: 0x808080 });
        const groundBefore = hemiLights().map(light => light.groundColor.getHex());
        const ambBefore = [];
        const rectBefore = [];
        engine.scene.traverse(object => {
          if (object.isAmbientLight) ambBefore.push(object.intensity);
          if (object.isRectAreaLight) rectBefore.push(object.intensity);
        });
        const leftoverRestorers = hideMeshes(leftoverOf());
        counts.leftoverCount = leftoverRestorers.length;
        leftoverRestorers.forEach(restore => restore());
        const rampsRestorers = hideMeshes(membership.ramps);
        counts.rampsCount = rampsRestorers.length;
        rampsRestorers.forEach(restore => restore());
        counts.buildingsCount = membership.buildings.length;
        counts.instancedCount = membership.instanced.length;
        counts.groundCount = membership.ground.length;
        const envRestorers = isolate.env();
        const envTex = engine.scene.environment;
        const envIsCombined = !envKeepsHemi;
        const envClearsHue = envTex === hueProbe.texture;
        const intensityClearsIbl = false;
        envRestorers.forEach(restore => restore());
        const bothIsCombined = !unnamedKeepsHemi || !envKeepsHemi || !bothKeepsHemi;
        const unnamedRestorers = isolate.unnamed();
        unnamedRestorers.forEach(restore => restore());
        const bothRestorers = isolate.both();
        bothRestorers.forEach(restore => restore());
        const skyRestorers = isolate.sky();
        skyRestorers.forEach(restore => restore());
        const piersRestorers = isolate.piers();
        piersRestorers.forEach(restore => restore());
        const extrasRestorers = isolate.extras();
        extrasRestorers.forEach(restore => restore());
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
          bothIsCombined,
          unnamedHidesRemaining,
          unnamedHidesLeftover,
          unnamedKeepsEnv,
          unnamedKeepsHemi,
          envSetsGray,
          envHidesLeftover,
          envKeepsHemi,
          envKeepsBg,
          envClearsHue,
          envKeepsSky,
          envKeepsPiers,
          envKeepsExtras,
          envKeepsRemaining,
          bothHidesRemaining,
          bothHidesLeftover,
          bothSetsGray,
          bothKeepsHemi,
          skyHidesSky,
          skyHidesLeftover,
          skyKeepsPiers,
          skyKeepsExtras,
          skyKeepsEnv,
          skyKeepsHemi,
          piersHidesPiers,
          piersHidesLeftover,
          piersKeepsSky,
          piersKeepsExtras,
          piersKeepsEnv,
          piersKeepsHemi,
          extrasHidesExtras,
          extrasHidesLeftover,
          extrasKeepsSky,
          extrasKeepsPiers,
          extrasKeepsEnv,
          extrasKeepsHemi,
          intensityClearsIbl,
          uleftDeltasUseIgndBaseline: true,
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
      frames: ULEFT_FRAMES,
      layers: CAPTURE_LAYERS,
      width: VIEWPORT.width,
      height: VIEWPORT.height,
      groundMin: GROUND_PLANE_MIN,
      albedoHex: GROUND_ALBEDO.hex,
      threePath,
    });
    const frames = report.frames.map(row => {
      const { presentPng, leftoverPng, layerPngs, layerHidden, bufferWidth, bufferHeight, leftoverHidden, ...rest } = row;
      assert.equal(bufferWidth, VIEWPORT.width, `${row.id} present width`);
      assert.equal(bufferHeight, VIEWPORT.height, `${row.id} present height`);
      const presentLive = decodeDataUrlPng(presentPng);
      const leftoverLive = decodeDataUrlPng(leftoverPng);
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
      const leftoverMatch = bandPixelmatch(leftoverLive, goldPngs[row.id], dominantSpec);
      const leftoverSample = sampleRgb(leftoverLive, goldPngs[row.id], dominantSpec);
      const leftoverLuma = luma(leftoverSample.live);
      const leftoverPct = Number(leftoverMatch.pct.toFixed(4));
      const layers = ULEFT_LAYERS.map(id => {
        const hiddenLive = decodeDataUrlPng(layerPngs[id]);
        const hiddenMatch = bandPixelmatch(hiddenLive, goldPngs[row.id], dominantSpec);
        const hiddenSample = sampleRgb(hiddenLive, goldPngs[row.id], dominantSpec);
        const hiddenLuma = luma(hiddenSample.live);
        const bandPct = leftoverPct;
        const hiddenPct = Number(hiddenMatch.pct.toFixed(4));
        return {
          id,
          hidden: layerHidden[id],
          band: dominant,
          live: hiddenSample.live,
          gold: hiddenSample.gold,
          l2: hiddenSample.l2,
          l2Delta: +(hiddenSample.l2 - leftoverSample.l2).toFixed(2),
          luma: hiddenLuma,
          lumaDelta: +(hiddenLuma - leftoverLuma).toFixed(2),
          blue: hiddenSample.live.b,
          blueDelta: +(hiddenSample.live.b - leftoverSample.live.b).toFixed(2),
          bandPct,
          hiddenPct,
          bandDelta: Number((hiddenPct - bandPct).toFixed(4)),
          mismatched: leftoverMatch.mismatched,
          hiddenMismatched: hiddenMatch.mismatched,
        };
      });
      return {
        ...rest,
        pixelThreshold: PIXEL_THRESHOLD,
        presentMismatched: presentMatch.mismatched,
        presentPct: Number(presentMatch.pct.toFixed(4)),
        leftoverBaselinePct: leftoverPct,
        leftoverHidden,
        leftoverL2: leftoverSample.l2,
        leftoverLuma,
        leftoverBlue: leftoverSample.live.b,
        bands,
        dominant,
        bandLive: leftoverSample.live,
        bandGold: leftoverSample.gold,
        bandL2: leftoverSample.l2,
        bandLuma: leftoverLuma,
        bandBlue: leftoverSample.live.b,
        layers,
        dominantUleft: dominantUleft(layers),
        contributingUleft: layers.filter(layer => layer.bandDelta <= -ULEFT_BAND_MIN).map(layer => layer.id),
        unnamedAxis: layers.filter(layer => UNNAMED_IDS.includes(layer.id) && layer.bandDelta <= -ULEFT_BAND_MIN).map(layer => layer.id),
        envAxis: layers.filter(layer => IBL_IDS.includes(layer.id) && (layer.bandDelta <= -ULEFT_BAND_MIN || layer.blueDelta <= -ULEFT_BLUE_MIN)).map(layer => layer.id),
        bothAxis: layers.filter(layer => BOTH_IDS.includes(layer.id) && layer.bandDelta <= -ULEFT_BAND_MIN).map(layer => layer.id),
        skyAxis: layers.filter(layer => SKY_IDS.includes(layer.id) && layer.bandDelta <= -ULEFT_BAND_MIN).map(layer => layer.id),
        pierAxis: layers.filter(layer => PIER_IDS.includes(layer.id) && layer.bandDelta <= -ULEFT_BAND_MIN).map(layer => layer.id),
        extrasAxis: layers.filter(layer => EXTRAS_IDS.includes(layer.id) && layer.bandDelta <= -ULEFT_BAND_MIN).map(layer => layer.id),
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
      bothIsCombined: report.bothIsCombined,
      unnamedHidesRemaining: report.unnamedHidesRemaining,
      unnamedHidesLeftover: report.unnamedHidesLeftover,
      unnamedKeepsEnv: report.unnamedKeepsEnv,
      unnamedKeepsHemi: report.unnamedKeepsHemi,
      envSetsGray: report.envSetsGray,
      envHidesLeftover: report.envHidesLeftover,
      envKeepsHemi: report.envKeepsHemi,
      envKeepsBg: report.envKeepsBg,
      envClearsHue: report.envClearsHue,
      envKeepsSky: report.envKeepsSky,
      envKeepsPiers: report.envKeepsPiers,
      envKeepsExtras: report.envKeepsExtras,
      envKeepsRemaining: report.envKeepsRemaining,
      bothHidesRemaining: report.bothHidesRemaining,
      bothHidesLeftover: report.bothHidesLeftover,
      bothSetsGray: report.bothSetsGray,
      bothKeepsHemi: report.bothKeepsHemi,
      skyHidesSky: report.skyHidesSky,
      skyHidesLeftover: report.skyHidesLeftover,
      skyKeepsPiers: report.skyKeepsPiers,
      skyKeepsExtras: report.skyKeepsExtras,
      skyKeepsEnv: report.skyKeepsEnv,
      skyKeepsHemi: report.skyKeepsHemi,
      piersHidesPiers: report.piersHidesPiers,
      piersHidesLeftover: report.piersHidesLeftover,
      piersKeepsSky: report.piersKeepsSky,
      piersKeepsExtras: report.piersKeepsExtras,
      piersKeepsEnv: report.piersKeepsEnv,
      piersKeepsHemi: report.piersKeepsHemi,
      extrasHidesExtras: report.extrasHidesExtras,
      extrasHidesLeftover: report.extrasHidesLeftover,
      extrasKeepsSky: report.extrasKeepsSky,
      extrasKeepsPiers: report.extrasKeepsPiers,
      extrasKeepsEnv: report.extrasKeepsEnv,
      extrasKeepsHemi: report.extrasKeepsHemi,
      intensityClearsIbl: report.intensityClearsIbl,
      uleftDeltasUseIgndBaseline: report.uleftDeltasUseIgndBaseline,
      ambKeepsAmbient: report.ambKeepsAmbient,
      rectKeepsRectArea: report.rectKeepsRectArea,
      hgndKeepsGround: report.hgndKeepsGround,
      colorManagementStaysEnabled: report.colorManagementStaysEnabled,
      outputColorSpaceStaysSRGB: report.outputColorSpaceStaysSRGB,
      toneMappingStaysACES: report.toneMappingStaysACES,
      rampsCount: report.rampsCount,
      leftoverCount: report.leftoverCount,
      unnamedCount: report.unnamedCount,
      envCount: report.envCount,
      bothCount: report.bothCount,
      skyCount: report.skyCount,
      piersCount: report.piersCount,
      extrasCount: report.extrasCount,
      buildingsCount: report.buildingsCount,
      instancedCount: report.instancedCount,
      groundCount: report.groundCount,
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
      protocol: 'world-uleft-buffer-not-original-golden',
      baselineHashes,
      pageErrors,
    };
  } finally {
    await page.close();
  }
}

export async function verifyWorldUleft(browser, url) {
  const report = await measureWorldUleft(browser, url);
  const out = process.env.WORLD_ULEFT_OUTPUT ?? fromRoot('artifacts', 'world-uleft');
  const results = await retainWorldUleft(report, out);
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
    console.log(JSON.stringify(await verifyWorldUleft(browser, process.env.SMOKE_URL ?? 'http://127.0.0.1:8080/?qa=1'), null, 2));
  } finally {
    await browser.close();
  }
}
