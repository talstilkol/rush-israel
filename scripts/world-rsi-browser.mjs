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

/** Leftover g07 after world.group+outside is remaining empty-scene vs golden independently of setRenderTarget vs setScissorTest vs info.reset. */
export const RSI_FRAMES = REGION_FRAMES;
export const RSI_LAYERS = Object.freeze([
  'lights', 'debug', 'xr', 'env', 'both', 'pack',
]);
export const CAPTURE_LAYERS = RSI_LAYERS;
export const LIGHTS_IDS = Object.freeze(['lights']);
export const DEBUG_IDS = Object.freeze(['debug']);
export const XR_IDS = Object.freeze(['xr']);
export const IBL_IDS = Object.freeze(['env']);
export const BOTH_IDS = Object.freeze(['both']);
export const PACK_IDS = Object.freeze(['pack']);
export const PRODUCT_HEMI_SKY_HEX = 0xa8c8e8;
export const PRODUCT_HEMI_NIGHT_HEX = 0x6a88b0;
export const RSI_L2_MIN = 8;
export const RSI_LUMA_MIN = 8;
export const RSI_BLUE_MIN = 8;
export const RSI_BAND_MIN = 0.02;
export const PRODUCT_EXPOSURE = 0.56;
export const PRODUCT_SKY_HEX = 0x3a9ae0;
export const NEUTRAL_SKY_HEX = 0x808080;
export const PRODUCT_PMREM_SIZE = 256;
export const PRODUCT_FOV = 58;
export const PRODUCT_NEAR = 0.28;
export const PRODUCT_FAR_MIN = 10000;
export const PRODUCT_FOLLOW = 7.4;
export const PRODUCT_HEIGHT = 1.92;
export const PRODUCT_PIXEL_RATIO = 1;
export const PRODUCT_LIGHTS = true;
export const PRODUCT_DEBUG = true;
export const PRODUCT_XR = false;

export function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

export function luma(rgb) {
  return +(0.2126 * (rgb?.r ?? 0) + 0.7152 * (rgb?.g ?? 0) + 0.0722 * (rgb?.b ?? 0)).toFixed(2);
}

export function dominantRsi(layers) {
  if (!Array.isArray(layers) || layers.length !== RSI_LAYERS.length) return null;
  return [...layers].sort((a, b) => a.bandDelta - b.bandDelta || a.l2Delta - b.l2Delta || a.id.localeCompare(b.id))[0]?.id ?? null;
}

export function leftoverIsNotRsiMismatch(report) {
  if (!report?.frames?.length) return true;
  if (report.protocol !== 'world-rsi-buffer-not-original-golden') return true;
  return report.frames.some(frame => !Array.isArray(frame.layers) || frame.layers.length !== RSI_LAYERS.length
    || RSI_LAYERS.some(id => !frame.layers.some(layer => layer.id === id))
    || frame.layers.some(layer => !RSI_LAYERS.includes(layer.id)
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
    || !frame.dominantRsi
    || !frame.dominant
    || !Array.isArray(frame.lightsAxis)
    || !Array.isArray(frame.envAxis)
    || !Array.isArray(frame.bothAxis)
    || !Array.isArray(frame.debugAxis)
    || !Array.isArray(frame.xrAxis)
    || !Array.isArray(frame.packAxis)
    || !Number.isFinite(frame.leftoverBaselinePct)
    || !Number.isFinite(frame.presentPct)
    || !Number.isFinite(frame.bandL2)
    || !Array.isArray(frame.bands) || frame.bands.length !== REGION_BANDS.length);
}

export function rsiBufferIsNotOriginalGolden(report) {
  return !report
    || report.protocol !== 'world-rsi-buffer-not-original-golden'
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
  const hidden = { lights: 2083, debug: 2083, xr: 2083, env: 2083, both: 2084, pack: 2083 }[id] ?? 1;
  const baselineL2 = 40;
  const baselineLuma = 40;
  const baselineBlue = 90;
  const l2 = id === 'lights' ? 18 : id === 'both' ? 20 : id === 'pack' ? 22 : id === 'env' ? 40 : 40;
  const lumaVal = 40;
  const blueVal = id === 'env' ? 70 : 90;
  const bandDelta = id === 'lights' ? -0.10 : id === 'both' ? -0.08 : id === 'pack' ? -0.05 : id === 'env' ? 0.0076 : 0;
  return {
    id, hidden, band: 'upper',
    live: { r: 40, g: 50, b: blueVal },
    gold: { r: 25.54, g: 35.89, b: 37.8 },
    l2, l2Delta: +(l2 - baselineL2).toFixed(2),
    luma: lumaVal, lumaDelta: +(lumaVal - baselineLuma).toFixed(2),
    blue: blueVal, blueDelta: +(blueVal - baselineBlue).toFixed(2),
    bandPct: 0.2027, hiddenPct: Number((0.2027 + bandDelta).toFixed(4)),
    bandDelta,
    mismatched: Math.round(0.2027 * BAND_PIXELS),
    hiddenMismatched: Math.round((0.2027 + bandDelta) * BAND_PIXELS),
    ...extra,
  };
}

function frame(id, extra = {}) {
  const spec = RSI_FRAMES.find(row => row.id === id);
  const bands = REGION_BANDS.map((band, i) => ({
    id: band.id, y0: band.y0, y1: band.y1,
    mismatched: Math.round((0.2 + i * 0.08) * BAND_PIXELS),
    pct: Number((0.2 + i * 0.08).toFixed(4)),
  }));
  const layers = RSI_LAYERS.map(layerId => layerRow(layerId));
  return {
    id, t: spec.t, night: spec.night, file: spec.file,
    follow: 7.4, height: 1.92, fov: 58, nonBlackFraction: 0.42,
    presentPct: 0.41, presentMismatched: Math.round(0.41 * SCENE_PIXELS),
    pixelThreshold: PIXEL_THRESHOLD, bands, dominant: 'upper',
    bandLive: { r: 77.07, g: 104.52, b: 131.96 },
    bandGold: { r: 25.54, g: 35.89, b: 37.8 },
    bandL2: 127.4, bandLuma: 98.2, bandBlue: 131.96,
    layers, dominantRsi: 'lights',
    contributingRsi: ['lights', 'pack'],
    lightsAxis: ['lights'],
    envAxis: [],
    bothAxis: ['both'],
    debugAxis: [],
    xrAxis: [],
    packAxis: ['pack'],
    leftoverBaselinePct: 0.2027,
    ...extra,
  };
}

export function worldRsiFixture(extra = {}) {
  return {
    colliderCount: 722, legacyCount: 546, pierCount: 176, rampCount: 50, routeSamples: 781,
    checkpointCount: 8, historicalRamps: HISTORICAL_RAMPS, historicalColliders: HISTORICAL_COLLIDERS,
    decks: EXPECTED_DECKS, strips: EXPECTED_STRIPS, classifiedPiers: EXPECTED_PIERS,
    rampsCount: 150, leftoverCount: 2082, lightsCount: 2083, debugCount: 2083, xrCount: 2083, envCount: 2083, bothCount: 2086, packCount: 2085, buildingsCount: 696, instancedCount: 47, groundCount: 1, remainingCount: 260,
    lumaTermsIncludeHemi: false, envIsCombined: false, bothIsCombined: false,
    lightsClears: true, lightsHidesLeftover: true, lightsKeepsEnv: true, lightsKeepsHemi: true, lightsKeepsDebug: true, lightsKeepsXr: true,
    debugClears: true, debugHidesLeftover: true, debugKeepsEnv: true, debugKeepsHemi: true, debugKeepsLights: true, debugKeepsXr: true,
    xrClears: true, xrHidesLeftover: true, xrKeepsEnv: true, xrKeepsHemi: true, xrKeepsLights: true, xrKeepsDebug: true,
    envSetsGray: true, envHidesLeftover: true, envKeepsHemi: true, envKeepsLights: true, envKeepsDebug: true, envKeepsXr: true, envClearsHue: false,
    packClearsLights: true, packClearsDebug: true, packClearsXr: true, packHidesLeftover: true, packKeepsEnv: true, packKeepsHemi: true,
    bothSetsGray: true, bothClearsLights: true, bothClearsDebug: true, bothClearsXr: true, bothHidesLeftover: true, bothKeepsHemi: true,
    intensityClearsIbl: false,
    rsiDeltasUseEmptyBaseline: true,
    ambKeepsAmbient: true, rectKeepsRectArea: true, hgndKeepsGround: true,
    colorManagementStaysEnabled: true, outputColorSpaceStaysSRGB: true, toneMappingStaysACES: true,
    fovStays58: true, nearStaysProduct: true, farStaysProduct: true,
    productExposure: PRODUCT_EXPOSURE,
    productGroundHex: GROUND_ALBEDO.hex, productGroundCount: 1, groundMeshCount: 1,
    originalGoldenComparisons: 0, authority: false, baselineUpdates: 0, updateGolden: false,
    pixelThreshold: PIXEL_THRESHOLD, failureLimit: FAILURE_LIMIT,
    viewport: { ...VIEWPORT },
    pageErrors: [], glError: 0, protocol: 'world-rsi-buffer-not-original-golden',
    baselineHashes: { ...RSH035_BASELINE_SHA256 },
    frames: RSI_FRAMES.map(spec => frame(spec.id)),
    ...extra,
  };
}

export function worldRsiResults(r) {
  assert.ok(r && typeof r === 'object', 'world-rsi evidence missing');
  assert.equal(r.updateGolden, false);
  assert.equal(r.baselineUpdates, 0);
  assert.equal(r.originalGoldenComparisons, 0);
  assert.equal(r.authority, false);
  assert.equal(r.pixelThreshold, PIXEL_THRESHOLD);
  assert.equal(r.failureLimit, FAILURE_LIMIT);
  assert.equal(r.viewport?.width, VIEWPORT.width);
  assert.equal(r.viewport?.height, VIEWPORT.height);
  assert.ok(Array.isArray(r.frames) && r.frames.length === 4, 'world-rsi frames missing');
  assert.equal(leftoverIsNotRsiMismatch(r), false, 'leftover g07 after world.group+outside is not remaining empty-scene vs golden independently of setRenderTarget vs setScissorTest vs info.reset mismatch');
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
  assert.equal(r.bothIsCombined, false, 'rsi isolation still combined with hemi');
  assert.equal(r.lightsClears, true, 'renderTarget isolation did not force setRenderTarget dummy');
  assert.equal(r.lightsHidesLeftover, true, 'renderTarget isolation did not hide leftover empty-scene meshes');
  assert.equal(r.lightsKeepsEnv, true, 'renderTarget isolation clears scene.environment');
  assert.equal(r.lightsKeepsHemi, true, 'hemi.color left product during renderTarget isolation');
  assert.equal(r.lightsKeepsDebug, true, 'clearColor left product during renderTarget isolation');
  assert.equal(r.lightsKeepsXr, true, 'compile left product during renderTarget isolation');
  assert.equal(r.debugClears, true, "scissorTest isolation did not force setScissorTest true");
  assert.equal(r.debugHidesLeftover, true, 'scissorTest isolation did not hide leftover empty-scene meshes');
  assert.equal(r.debugKeepsEnv, true, 'scissorTest isolation clears scene.environment');
  assert.equal(r.debugKeepsHemi, true, 'hemi.color left product during scissorTest isolation');
  assert.equal(r.debugKeepsLights, true, 'viewport left product during scissorTest isolation');
  assert.equal(r.debugKeepsXr, true, 'compile left product during scissorTest isolation');
  assert.equal(r.xrClears, true, 'infoReset isolation did not force info.reset');
  assert.equal(r.xrHidesLeftover, true, 'infoReset isolation did not hide leftover empty-scene meshes');
  assert.equal(r.xrKeepsEnv, true, 'infoReset isolation clears scene.environment');
  assert.equal(r.xrKeepsHemi, true, 'hemi.color left product during infoReset isolation');
  assert.equal(r.xrKeepsLights, true, 'viewport left product during infoReset isolation');
  assert.equal(r.xrKeepsDebug, true, 'clearColor left product during infoReset isolation');
  assert.equal(r.envSetsGray, true, 'scene.environment isolation did not swap gray cubemap');
  assert.equal(r.envHidesLeftover, true, 'env isolation did not hide leftover empty-scene meshes');
  assert.equal(r.envKeepsHemi, true, 'hemi.color left product during scene.environment isolation');
  assert.equal(r.envKeepsLights, true, 'viewport left product during env isolation');
  assert.equal(r.envKeepsDebug, true, 'clearColor left product during env isolation');
  assert.equal(r.envKeepsXr, true, 'compile left product during env isolation');
  assert.equal(r.envClearsHue, false, 'scene.environment isolation uses product sky hue bake');
  assert.equal(r.packClearsLights, true, 'pack isolation did not force setRenderTarget dummy');
  assert.equal(r.packClearsDebug, true, "pack isolation did not force setScissorTest true");
  assert.equal(r.packClearsXr, true, 'pack isolation did not force info.reset');
  assert.equal(r.packHidesLeftover, true, 'pack isolation did not hide leftover empty-scene meshes');
  assert.equal(r.packKeepsEnv, true, 'pack isolation clears scene.environment');
  assert.equal(r.packKeepsHemi, true, 'hemi.color left product during pack isolation');
  assert.equal(r.bothSetsGray, true, 'both isolation did not swap gray cubemap');
  assert.equal(r.bothClearsLights, true, 'both isolation did not force setRenderTarget dummy');
  assert.equal(r.bothClearsDebug, true, "both isolation did not force setScissorTest true");
  assert.equal(r.bothClearsXr, true, 'both isolation did not force info.reset');
  assert.equal(r.bothHidesLeftover, true, 'both isolation did not hide leftover empty-scene meshes');
  assert.equal(r.bothKeepsHemi, true, 'hemi.color left product during both isolation');
  assert.equal(r.intensityClearsIbl, false, 'rsi isolation clears scene.environment via setRenderTarget');
  assert.equal(r.rsiDeltasUseEmptyBaseline, true, 'leftover g07 still uses world.group leftover as baseline');
  assert.equal(r.hgndKeepsGround, true, 'HemisphereLight groundColor left product after tnc restorers');
  assert.equal(r.ambKeepsAmbient, true, 'AmbientLight intensity left product during rsi probe');
  assert.equal(r.rectKeepsRectArea, true, 'RectAreaLight intensity left product during rsi probe');
  assert.equal(r.productExposure, PRODUCT_EXPOSURE, 'product exposure retuned');
  assert.ok(r.rampsCount >= 150, 'ramps leftover baseline missing');
  assert.ok(r.leftoverCount >= 151, 'empty-scene leftover baseline missing');
  assert.ok(r.lightsCount >= 151, 'lights isolation missing');
  assert.ok(r.debugCount >= 151, 'scissorTest isolation missing');
  assert.ok(r.xrCount >= 151, 'infoReset isolation missing');
  assert.ok(r.packCount >= 151, 'combined setRenderTarget-setScissorTest-info.reset isolation missing');
  assert.ok(r.envCount >= 151, 'scene.environment isolation missing');
  assert.ok(r.bothCount >= 151, 'both setRenderTarget-setScissorTest-info.reset+env isolation missing');
  assert.ok(r.buildingsCount >= 1, 'buildings leftover members missing');
  assert.ok(r.instancedCount >= 1, 'instanced leftover members missing');
  assert.ok(r.groundCount >= 1, 'ground leftover members missing');
  assert.ok(r.remainingCount >= 1, 'remaining world meshes leftover members missing');
  assert.equal(r.colorManagementStaysEnabled, true, 'ColorManagement disabled during rsi probe');
  assert.equal(r.outputColorSpaceStaysSRGB, true, 'outputColorSpace left product sRGB during rsi probe');
  assert.equal(r.toneMappingStaysACES, true, 'toneMapping left product ACES during rsi probe');
  assert.equal(r.fovStays58, true, 'product fov retuned during rsi probe');
  assert.equal(r.nearStaysProduct, true, 'product near retuned during rsi probe');
  assert.equal(r.farStaysProduct, true, 'product far retuned during rsi probe');
  assert.equal(r.productGroundHex, GROUND_ALBEDO.hex, 'product ground color retuned');
  assert.ok(r.productGroundCount >= 1, 'product ground color missing');
  assert.ok(r.groundMeshCount >= 1, 'ground mesh missing');
  assert.deepEqual(r.pageErrors ?? [], []);
  assert.equal(r.glError ?? 0, 0);
  assert.equal(rsiBufferIsNotOriginalGolden(r), false, 'rsi buffer is not original-golden');
  assert.ok(r.baselineHashes && typeof r.baselineHashes === 'object');
  for (const name of ORIGINAL_GOLDEN_FILES) {
    assert.equal(r.baselineHashes[name], RSH035_BASELINE_SHA256[name], `baseline hash drift: ${name}`);
  }
  let cameraFail = 0, mismatchFail = 0, bakeFail = 0;
  for (const spec of RSI_FRAMES) {
    const row = r.frames.find(frameRow => frameRow.id === spec.id);
    assert.ok(row, `missing frame ${spec.id}`);
    assert.equal(row.night, spec.night);
    assert.equal(row.pixelThreshold, PIXEL_THRESHOLD);
    assert.ok(Math.abs(row.follow - 7.4) <= 0.05 && Math.abs(row.height - 1.92) <= 0.05);
    if (Math.abs(row.follow - 7.4) > 0.05 || Math.abs(row.height - 1.92) > 0.05) cameraFail += 1;
    if (row.presentPct === 0 || row.presentMismatched === 0) mismatchFail += 1;
    const byId = Object.fromEntries(row.layers.map(layer => [layer.id, layer]));
    if (!row.dominantRsi || !row.dominant || row.layers.length !== RSI_LAYERS.length
      || RSI_LAYERS.some(id => !byId[id])
      || row.layers.some(layer => !Number.isFinite(layer.l2Delta) || !Number.isFinite(layer.lumaDelta)
        || !Number.isFinite(layer.blueDelta) || !Number.isFinite(layer.live?.r))
      || !Array.isArray(row.lightsAxis) || !Array.isArray(row.envAxis) || !Array.isArray(row.bothAxis)
      || !Array.isArray(row.debugAxis) || !Array.isArray(row.xrAxis) || !Array.isArray(row.packAxis)
      || !Number.isFinite(row.leftoverBaselinePct)
      || row.bands.length !== REGION_BANDS.length
      || !Number.isFinite(row.bandL2)
      || RSI_LAYERS.some(id => (byId[id]?.hidden ?? 0) < 1)) bakeFail += 1;
  }
  return [
    {
      case: 'leftover g07 after world.group+outside is not remaining empty-scene vs golden independently of setRenderTarget vs setScissorTest vs info.reset attribution',
      status: 'passed',
      probes: 4,
      failures: 0,
    },
    {
      case: 'live rest chase stays 7.4/1.92 while present rsi axes are sampled',
      status: cameraFail ? 'failed' : 'passed',
      probes: 4,
      failures: cameraFail,
    },
    {
      case: 'setRenderTarget vs setScissorTest vs info.reset independently of env of leftover g07 after world.group+outside ran at 1280x800 threshold 0.12 without retuning 0xd0d4d8 or 0.56 exposure',
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
      case: 'rsi-buffer pixelmatch is not original-golden page capture',
      status: 'passed',
      probes: 1,
      failures: 0,
    },
  ];
}

export async function retainWorldRsi(report, out) {
  await mkdir(out, { recursive: true });
  await writeFile(`${out}/results.json`, JSON.stringify(report, null, 2) + '\n');
  const results = worldRsiResults(report);
  await writeFile(`${out}/results.json`, JSON.stringify({ ...report, results }, null, 2) + '\n');
  return results;
}

export async function measureWorldRsi(browser, url) {
  const baseline = fromRoot('golden-baseline');
  const goldPngs = {};
  const baselineHashes = {};
  for (const spec of RSI_FRAMES) {
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
        const remainingOf = () => [...membership.water, ...membership.glass, ...membership.road, ...membership.sky, ...membership.piers, ...membership.extras];
        const leftoverWorld = () => [...membership.ramps, ...membership.buildings, ...membership.instanced, ...membership.ground, ...remainingOf()];
        const under = (object, root) => {
          let node = object;
          while (node) {
            if (node === root) return true;
            node = node.parent;
          }
          return false;
        };
        const inWorld = new Set();
        engine.world.group.traverse(object => inWorld.add(object));
        const heroRoot = engine.visuals?.[0]?.group ?? null;
        const blobMeshes = Array.isArray(engine.blobs) ? engine.blobs : [];
        const fxRoots = [engine.sparks, engine.gate, engine.skidMesh, engine.smokeMesh, engine.boostPts, engine.rainMesh].filter(Boolean);
        const outside = [];
        const hero = [];
        const fx = [];
        const blob = [];
        engine.scene.traverse(object => {
          if (!object.isMesh && !object.isPoints && !object.isSprite) return;
          if (inWorld.has(object)) return;
          outside.push(object);
          if (heroRoot && under(object, heroRoot)) hero.push(object);
          else if (fxRoots.some(root => object === root || under(object, root))) fx.push(object);
          else if (blobMeshes.includes(object)) blob.push(object);
        });
        const leftoverOf = () => [...leftoverWorld(), ...outside];
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
        let lightsClears = false;
        let lightsHidesLeftover = false;
        let lightsKeepsEnv = true;
        let lightsKeepsHemi = true;
        let lightsKeepsDebug = true;
        let lightsKeepsXr = true;
        let debugClears = false;
        let debugHidesLeftover = false;
        let debugKeepsEnv = true;
        let debugKeepsHemi = true;
        let debugKeepsLights = true;
        let debugKeepsXr = true;
        let xrClears = false;
        let xrHidesLeftover = false;
        let xrKeepsEnv = true;
        let xrKeepsHemi = true;
        let xrKeepsLights = true;
        let xrKeepsDebug = true;
        let envSetsGray = false;
        let envHidesLeftover = false;
        let envKeepsHemi = true;
        let envKeepsLights = true;
        let envKeepsDebug = true;
        let envKeepsXr = true;
        let packClearsLights = false;
        let packClearsDebug = false;
        let packClearsXr = false;
        let packHidesLeftover = false;
        let packKeepsEnv = true;
        let packKeepsHemi = true;
        let bothSetsGray = false;
        let bothClearsLights = false;
        let bothClearsDebug = false;
        let bothClearsXr = false;
        let bothHidesLeftover = false;
        let bothKeepsHemi = true;
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
        const hemiRgb = () => hemiLights().map(light => `${light.color.r},${light.color.g},${light.color.b}`);
        const leftoverHidden = () => leftoverOf().length && leftoverOf().every(mesh => mesh.visible === false);
        let dummyTarget = null;
        let infoResetCalled = false;
        const setLights = () => {
          const prev = engine.renderer.getRenderTarget();
          const rt = new THREE.WebGLRenderTarget(64, 64);
          owned.push(rt);
          dummyTarget = rt;
          engine.renderer.setRenderTarget(rt);
          return [() => { engine.renderer.setRenderTarget(prev); }];
        };
        const setDebug = () => {
          const prevTest = engine.renderer.getScissorTest();
          const prev = new THREE.Vector4();
          engine.renderer.getScissor(prev);
          engine.renderer.setScissorTest(true);
          engine.renderer.setScissor(0, 0, 640, 400);
          return [() => {
            engine.renderer.setScissorTest(prevTest);
            engine.renderer.setScissor(prev.x, prev.y, prev.z, prev.w);
          }];
        };
        const setXr = () => {
          engine.renderer.info.reset();
          infoResetCalled = true;
          return [() => {}];
        };
        const isolate = {
          lights() {
            const prevHemi = hemiRgb();
            const prevEnv = engine.scene.environment;
            const prevScissor = engine.renderer.getScissorTest();
            const prevReset = infoResetCalled;
            const restorers = [...hideMeshes(leftoverOf()), ...setLights()];
            lightsClears = engine.renderer.getRenderTarget() === dummyTarget;
            if (leftoverHidden()) lightsHidesLeftover = true;
            if (engine.scene.environment !== prevEnv) lightsKeepsEnv = false;
            if (hemiRgb().some((rgb, i) => rgb !== prevHemi[i])) lightsKeepsHemi = false;
            if (engine.renderer.getScissorTest() !== prevScissor) lightsKeepsDebug = false;
            if (infoResetCalled !== prevReset) lightsKeepsXr = false;
            return restorers;
          },
          debug() {
            const prevHemi = hemiRgb();
            const prevEnv = engine.scene.environment;
            const prevRt = engine.renderer.getRenderTarget();
            const prevReset = infoResetCalled;
            const restorers = [...hideMeshes(leftoverOf()), ...setDebug()];
            debugClears = engine.renderer.getScissorTest() === true;
            if (leftoverHidden()) debugHidesLeftover = true;
            if (engine.scene.environment !== prevEnv) debugKeepsEnv = false;
            if (hemiRgb().some((rgb, i) => rgb !== prevHemi[i])) debugKeepsHemi = false;
            if (engine.renderer.getRenderTarget() !== prevRt) debugKeepsLights = false;
            if (infoResetCalled !== prevReset) debugKeepsXr = false;
            return restorers;
          },
          xr() {
            const prevHemi = hemiRgb();
            const prevEnv = engine.scene.environment;
            const prevRt = engine.renderer.getRenderTarget();
            const prevScissor = engine.renderer.getScissorTest();
            const restorers = [...hideMeshes(leftoverOf()), ...setXr()];
            xrClears = infoResetCalled === true;
            if (leftoverHidden()) xrHidesLeftover = true;
            if (engine.scene.environment !== prevEnv) xrKeepsEnv = false;
            if (hemiRgb().some((rgb, i) => rgb !== prevHemi[i])) xrKeepsHemi = false;
            if (engine.renderer.getRenderTarget() !== prevRt) xrKeepsLights = false;
            if (engine.renderer.getScissorTest() !== prevScissor) xrKeepsDebug = false;
            return restorers;
          },
          env() {
            const prevHemi = hemiRgb();
            const prevRt = engine.renderer.getRenderTarget();
            const prevScissor = engine.renderer.getScissorTest();
            const prevReset = infoResetCalled;
            const gray = bakeGray();
            const restorers = [...hideMeshes(leftoverOf()), ...swapEnv(gray)];
            if (engine.scene.environment === gray.texture) envSetsGray = true;
            if (leftoverHidden()) envHidesLeftover = true;
            if (hemiRgb().some((rgb, i) => rgb !== prevHemi[i])) envKeepsHemi = false;
            if (engine.renderer.getRenderTarget() !== prevRt) envKeepsLights = false;
            if (engine.renderer.getScissorTest() !== prevScissor) envKeepsDebug = false;
            if (infoResetCalled !== prevReset) envKeepsXr = false;
            return restorers;
          },
          pack() {
            const prevHemi = hemiRgb();
            const prevEnv = engine.scene.environment;
            const restorers = [
              ...hideMeshes(leftoverOf()),
              ...setLights(),
              ...setDebug(),
              ...setXr(),
            ];
            packClearsLights = engine.renderer.getRenderTarget() === dummyTarget;
            packClearsDebug = engine.renderer.getScissorTest() === true;
            packClearsXr = infoResetCalled === true;
            if (leftoverHidden()) packHidesLeftover = true;
            if (engine.scene.environment !== prevEnv) packKeepsEnv = false;
            if (hemiRgb().some((rgb, i) => rgb !== prevHemi[i])) packKeepsHemi = false;
            return restorers;
          },
          both() {
            const prevHemi = hemiRgb();
            const gray = bakeGray();
            const restorers = [
              ...hideMeshes(leftoverOf()),
              ...swapEnv(gray),
              ...setLights(),
              ...setDebug(),
              ...setXr(),
            ];
            if (engine.scene.environment === gray.texture) bothSetsGray = true;
            bothClearsLights = engine.renderer.getRenderTarget() === dummyTarget;
            bothClearsDebug = engine.renderer.getScissorTest() === true;
            bothClearsXr = infoResetCalled === true;
            if (leftoverHidden()) bothHidesLeftover = true;
            if (hemiRgb().some((rgb, i) => rgb !== prevHemi[i])) bothKeepsHemi = false;
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
          if (w === 1280 && h === 800) {
            return { bufferWidth: w, bufferHeight: h, lit, png: copy.toDataURL('image/png') };
          }
          const out = document.createElement('canvas');
          out.width = 1280;
          out.height = 800;
          out.getContext('2d', { willReadFrequently: true }).drawImage(copy, 0, 0, 1280, 800);
          return { bufferWidth: 1280, bufferHeight: 800, nativeWidth: w, nativeHeight: h, lit, png: out.toDataURL('image/png') };
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
        const presentRender = () => {
          engine.post.render();
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
          presentRender();
          const leftover = encode();
          leftoverRestorers.forEach(restore => restore());
          const layerPngs = {};
          const layerHidden = {};
          for (const id of layers) {
            poseOnce(spec);
            const restorers = isolate[id]();
            presentRender();
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
        counts.remainingCount = remainingOf().length;
        const envRestorers = isolate.env();
        const envTex = engine.scene.environment;
        const envIsCombined = !envKeepsHemi;
        const envClearsHue = envTex === hueProbe.texture;
        const intensityClearsIbl = false;
        envRestorers.forEach(restore => restore());
        const bothIsCombined = !lightsKeepsHemi || !debugKeepsHemi || !xrKeepsHemi || !envKeepsHemi || !packKeepsHemi || !bothKeepsHemi;
        const toneRestorers = isolate.lights();
        toneRestorers.forEach(restore => restore());
        const spaceRestorers = isolate.debug();
        spaceRestorers.forEach(restore => restore());
        const mgmtRestorers = isolate.xr();
        mgmtRestorers.forEach(restore => restore());
        const encRestorers = isolate.pack();
        encRestorers.forEach(restore => restore());
        const bothRestorers = isolate.both();
        bothRestorers.forEach(restore => restore());
        const colorManagementStaysEnabled = THREE.ColorManagement.enabled !== false;
        const outputColorSpaceStaysSRGB = engine.renderer.outputColorSpace === THREE.SRGBColorSpace;
        const toneMappingStaysACES = engine.renderer.toneMapping === THREE.ACESFilmicToneMapping;
        const fovStays58 = Math.abs(engine.camera.fov - 58) <= 0.2;
        const nearStaysProduct = Math.abs(engine.camera.near - 0.28) <= 0.001;
        const farStaysProduct = engine.camera.far >= 10000;
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
          lightsClears,
          lightsHidesLeftover,
          lightsKeepsEnv,
          lightsKeepsHemi,
          lightsKeepsDebug,
          lightsKeepsXr,
          debugClears,
          debugHidesLeftover,
          debugKeepsEnv,
          debugKeepsHemi,
          debugKeepsLights,
          debugKeepsXr,
          xrClears,
          xrHidesLeftover,
          xrKeepsEnv,
          xrKeepsHemi,
          xrKeepsLights,
          xrKeepsDebug,
          envSetsGray,
          envHidesLeftover,
          envKeepsHemi,
          envKeepsLights,
          envKeepsDebug,
          envKeepsXr,
          envClearsHue,
          packClearsLights,
          packClearsDebug,
          packClearsXr,
          packHidesLeftover,
          packKeepsEnv,
          packKeepsHemi,
          bothSetsGray,
          bothClearsLights,
          bothClearsDebug,
          bothClearsXr,
          bothHidesLeftover,
          bothKeepsHemi,
          intensityClearsIbl,
          rsiDeltasUseEmptyBaseline: true,
          ambKeepsAmbient,
          rectKeepsRectArea,
          hgndKeepsGround,
          colorManagementStaysEnabled,
          outputColorSpaceStaysSRGB,
          toneMappingStaysACES,
          fovStays58,
          nearStaysProduct,
          farStaysProduct,
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
      frames: RSI_FRAMES,
      layers: ['lights', 'debug', 'xr', 'env', 'both', 'pack'],
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
      const layers = RSI_LAYERS.map(id => {
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
        dominantRsi: dominantRsi(layers),
        contributingRsi: layers.filter(layer => layer.bandDelta <= -RSI_BAND_MIN).map(layer => layer.id),
        lightsAxis: layers.filter(layer => LIGHTS_IDS.includes(layer.id) && layer.bandDelta <= -RSI_BAND_MIN).map(layer => layer.id),
        envAxis: layers.filter(layer => IBL_IDS.includes(layer.id) && (layer.bandDelta <= -RSI_BAND_MIN || layer.blueDelta <= -RSI_BLUE_MIN)).map(layer => layer.id),
        bothAxis: layers.filter(layer => BOTH_IDS.includes(layer.id) && layer.bandDelta <= -RSI_BAND_MIN).map(layer => layer.id),
        debugAxis: layers.filter(layer => DEBUG_IDS.includes(layer.id) && layer.bandDelta <= -RSI_BAND_MIN).map(layer => layer.id),
        xrAxis: layers.filter(layer => XR_IDS.includes(layer.id) && layer.bandDelta <= -RSI_BAND_MIN).map(layer => layer.id),
        packAxis: layers.filter(layer => PACK_IDS.includes(layer.id) && layer.bandDelta <= -RSI_BAND_MIN).map(layer => layer.id),
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
      lightsClears: report.lightsClears,
      lightsHidesLeftover: report.lightsHidesLeftover,
      lightsKeepsEnv: report.lightsKeepsEnv,
      lightsKeepsHemi: report.lightsKeepsHemi,
      lightsKeepsDebug: report.lightsKeepsDebug,
      lightsKeepsXr: report.lightsKeepsXr,
      debugClears: report.debugClears,
      debugHidesLeftover: report.debugHidesLeftover,
      debugKeepsEnv: report.debugKeepsEnv,
      debugKeepsHemi: report.debugKeepsHemi,
      debugKeepsLights: report.debugKeepsLights,
      debugKeepsXr: report.debugKeepsXr,
      xrClears: report.xrClears,
      xrHidesLeftover: report.xrHidesLeftover,
      xrKeepsEnv: report.xrKeepsEnv,
      xrKeepsHemi: report.xrKeepsHemi,
      xrKeepsLights: report.xrKeepsLights,
      xrKeepsDebug: report.xrKeepsDebug,
      envSetsGray: report.envSetsGray,
      envHidesLeftover: report.envHidesLeftover,
      envKeepsHemi: report.envKeepsHemi,
      envKeepsLights: report.envKeepsLights,
      envKeepsDebug: report.envKeepsDebug,
      envKeepsXr: report.envKeepsXr,
      envClearsHue: report.envClearsHue,
      packClearsLights: report.packClearsLights,
      packClearsDebug: report.packClearsDebug,
      packClearsXr: report.packClearsXr,
      packHidesLeftover: report.packHidesLeftover,
      packKeepsEnv: report.packKeepsEnv,
      packKeepsHemi: report.packKeepsHemi,
      bothSetsGray: report.bothSetsGray,
      bothClearsLights: report.bothClearsLights,
      bothClearsDebug: report.bothClearsDebug,
      bothClearsXr: report.bothClearsXr,
      bothHidesLeftover: report.bothHidesLeftover,
      bothKeepsHemi: report.bothKeepsHemi,
      intensityClearsIbl: report.intensityClearsIbl,
      rsiDeltasUseEmptyBaseline: report.rsiDeltasUseEmptyBaseline,
      ambKeepsAmbient: report.ambKeepsAmbient,
      rectKeepsRectArea: report.rectKeepsRectArea,
      hgndKeepsGround: report.hgndKeepsGround,
      colorManagementStaysEnabled: report.colorManagementStaysEnabled,
      outputColorSpaceStaysSRGB: report.outputColorSpaceStaysSRGB,
      toneMappingStaysACES: report.toneMappingStaysACES,
      fovStays58: report.fovStays58,
      nearStaysProduct: report.nearStaysProduct,
      farStaysProduct: report.farStaysProduct,
      rampsCount: report.rampsCount,
      leftoverCount: report.leftoverCount,
      lightsCount: report.lightsCount,
      debugCount: report.debugCount,
      xrCount: report.xrCount,
      packCount: report.packCount,
      envCount: report.envCount,
      bothCount: report.bothCount,
      buildingsCount: report.buildingsCount,
      instancedCount: report.instancedCount,
      groundCount: report.groundCount,
      remainingCount: report.remainingCount,
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
      protocol: 'world-rsi-buffer-not-original-golden',
      baselineHashes,
      pageErrors,
    };
  } finally {
    await page.close();
  }
}

export async function verifyWorldRsi(browser, url) {
  const report = await measureWorldRsi(browser, url);
  const out = process.env.WORLD_RSI_OUTPUT ?? fromRoot('artifacts', 'world-rsi');
  const results = await retainWorldRsi(report, out);
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
    console.log(JSON.stringify(await verifyWorldRsi(browser, process.env.SMOKE_URL ?? 'http://127.0.0.1:8080/?qa=1'), null, 2));
  } finally {
    await browser.close();
  }
}
