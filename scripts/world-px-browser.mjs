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

/** Leftover g07 after world.group+outside is not remaining empty-scene vs golden independently of pixelRatio vs drawingBuffer vs post.setSize. */
export const PX_FRAMES = REGION_FRAMES;
export const PX_LAYERS = Object.freeze([
  'ratio', 'buffer', 'size', 'env', 'both', 'pack',
]);
export const CAPTURE_LAYERS = PX_LAYERS;
export const RATIO_IDS = Object.freeze(['ratio']);
export const BUFFER_IDS = Object.freeze(['buffer']);
export const SIZE_IDS = Object.freeze(['size']);
export const IBL_IDS = Object.freeze(['env']);
export const BOTH_IDS = Object.freeze(['both']);
export const PACK_IDS = Object.freeze(['pack']);
export const PRODUCT_HEMI_SKY_HEX = 0xa8c8e8;
export const PRODUCT_HEMI_NIGHT_HEX = 0x6a88b0;
export const PX_L2_MIN = 8;
export const PX_LUMA_MIN = 8;
export const PX_BLUE_MIN = 8;
export const PX_BAND_MIN = 0.02;
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
export const WIDE_RATIO = 2;
export const SMALL_WIDTH = 640;
export const SMALL_HEIGHT = 400;

export function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

export function luma(rgb) {
  return +(0.2126 * (rgb?.r ?? 0) + 0.7152 * (rgb?.g ?? 0) + 0.0722 * (rgb?.b ?? 0)).toFixed(2);
}

export function dominantPx(layers) {
  if (!Array.isArray(layers) || layers.length !== PX_LAYERS.length) return null;
  return [...layers].sort((a, b) => a.bandDelta - b.bandDelta || a.l2Delta - b.l2Delta || a.id.localeCompare(b.id))[0]?.id ?? null;
}

export function leftoverIsNotPxMismatch(report) {
  if (!report?.frames?.length) return true;
  return report.frames.some(frame => !Array.isArray(frame.layers) || frame.layers.length !== PX_LAYERS.length
    || PX_LAYERS.some(id => !frame.layers.some(layer => layer.id === id))
    || frame.layers.some(layer => !PX_LAYERS.includes(layer.id)
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
    || !frame.dominantPx
    || !frame.dominant
    || !Array.isArray(frame.ratioAxis)
    || !Array.isArray(frame.envAxis)
    || !Array.isArray(frame.bothAxis)
    || !Array.isArray(frame.bufferAxis)
    || !Array.isArray(frame.sizeAxis)
    || !Array.isArray(frame.packAxis)
    || !Number.isFinite(frame.leftoverBaselinePct)
    || !Number.isFinite(frame.presentPct)
    || !Number.isFinite(frame.bandL2)
    || !Array.isArray(frame.bands) || frame.bands.length !== REGION_BANDS.length);
}

export function pxBufferIsNotOriginalGolden(report) {
  return !report
    || report.protocol !== 'world-px-buffer-not-original-golden'
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
  const hidden = { ratio: 2083, buffer: 2083, size: 2083, env: 2083, both: 2084, pack: 2083 }[id] ?? 1;
  const baselineL2 = 40;
  const baselineLuma = 40;
  const baselineBlue = 90;
  const l2 = id === 'ratio' ? 18 : id === 'both' ? 20 : id === 'pack' ? 22 : id === 'env' ? 40 : 40;
  const lumaVal = 40;
  const blueVal = id === 'env' ? 70 : 90;
  const bandDelta = id === 'ratio' ? -0.10 : id === 'both' ? -0.08 : id === 'pack' ? -0.05 : id === 'env' ? 0.0076 : 0;
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
  const spec = PX_FRAMES.find(row => row.id === id);
  const bands = REGION_BANDS.map((band, i) => ({
    id: band.id, y0: band.y0, y1: band.y1,
    mismatched: Math.round((0.2 + i * 0.08) * BAND_PIXELS),
    pct: Number((0.2 + i * 0.08).toFixed(4)),
  }));
  const layers = PX_LAYERS.map(layerId => layerRow(layerId));
  return {
    id, t: spec.t, night: spec.night, file: spec.file,
    follow: 7.4, height: 1.92, fov: 58, nonBlackFraction: 0.42,
    presentPct: 0.41, presentMismatched: Math.round(0.41 * SCENE_PIXELS),
    pixelThreshold: PIXEL_THRESHOLD, bands, dominant: 'upper',
    bandLive: { r: 77.07, g: 104.52, b: 131.96 },
    bandGold: { r: 25.54, g: 35.89, b: 37.8 },
    bandL2: 127.4, bandLuma: 98.2, bandBlue: 131.96,
    layers, dominantPx: 'ratio',
    contributingPx: ['ratio', 'pack'],
    ratioAxis: ['ratio'],
    envAxis: [],
    bothAxis: ['both'],
    bufferAxis: [],
    sizeAxis: [],
    packAxis: ['pack'],
    leftoverBaselinePct: 0.2027,
    ...extra,
  };
}

export function worldPxFixture(extra = {}) {
  return {
    colliderCount: 722, legacyCount: 546, pierCount: 176, rampCount: 50, routeSamples: 781,
    checkpointCount: 8, historicalRamps: HISTORICAL_RAMPS, historicalColliders: HISTORICAL_COLLIDERS,
    decks: EXPECTED_DECKS, strips: EXPECTED_STRIPS, classifiedPiers: EXPECTED_PIERS,
    rampsCount: 150, leftoverCount: 2082, ratioCount: 2083, bufferCount: 2083, sizeCount: 2083, envCount: 2083, bothCount: 2086, packCount: 2085, buildingsCount: 696, instancedCount: 47, groundCount: 1, remainingCount: 260,
    lumaTermsIncludeHemi: false, envIsCombined: false, bothIsCombined: false,
    ratioSetsWide: true, ratioHidesLeftover: true, ratioKeepsEnv: true, ratioKeepsHemi: true, ratioKeepsBuffer: true, ratioKeepsSize: true,
    bufferSetsSmall: true, bufferHidesLeftover: true, bufferKeepsEnv: true, bufferKeepsHemi: true, bufferKeepsRatio: true, bufferKeepsSize: true,
    sizeSetsPost: true, sizeHidesLeftover: true, sizeKeepsEnv: true, sizeKeepsHemi: true, sizeKeepsRatio: true, sizeKeepsBuffer: true,
    envSetsGray: true, envHidesLeftover: true, envKeepsHemi: true, envKeepsRatio: true, envKeepsBuffer: true, envKeepsSize: true, envClearsHue: false,
    packSetsWide: true, packSetsSmall: true, packSetsPost: true, packHidesLeftover: true, packKeepsEnv: true, packKeepsHemi: true,
    bothSetsGray: true, bothSetsWide: true, bothSetsSmall: true, bothSetsPost: true, bothHidesLeftover: true, bothKeepsHemi: true,
    intensityClearsIbl: false,
    pxDeltasUseEmptyBaseline: true,
    ambKeepsAmbient: true, rectKeepsRectArea: true, hgndKeepsGround: true,
    colorManagementStaysEnabled: true, outputColorSpaceStaysSRGB: true, toneMappingStaysACES: true,
    fovStays58: true, nearStaysProduct: true, farStaysProduct: true,
    productExposure: PRODUCT_EXPOSURE,
    productGroundHex: GROUND_ALBEDO.hex, productGroundCount: 1, groundMeshCount: 1,
    originalGoldenComparisons: 0, authority: false, baselineUpdates: 0, updateGolden: false,
    pixelThreshold: PIXEL_THRESHOLD, failureLimit: FAILURE_LIMIT,
    viewport: { ...VIEWPORT },
    pageErrors: [], glError: 0, protocol: 'world-px-buffer-not-original-golden',
    baselineHashes: { ...RSH035_BASELINE_SHA256 },
    frames: PX_FRAMES.map(spec => frame(spec.id)),
    ...extra,
  };
}

export function worldPxResults(r) {
  assert.ok(r && typeof r === 'object', 'world-px evidence missing');
  assert.equal(r.updateGolden, false);
  assert.equal(r.baselineUpdates, 0);
  assert.equal(r.originalGoldenComparisons, 0);
  assert.equal(r.authority, false);
  assert.equal(r.pixelThreshold, PIXEL_THRESHOLD);
  assert.equal(r.failureLimit, FAILURE_LIMIT);
  assert.equal(r.viewport?.width, VIEWPORT.width);
  assert.equal(r.viewport?.height, VIEWPORT.height);
  assert.ok(Array.isArray(r.frames) && r.frames.length === 4, 'world-px frames missing');
  assert.equal(leftoverIsNotPxMismatch(r), false, 'leftover g07 after world.group+outside is not remaining empty-scene vs golden independently of pixelRatio vs drawingBuffer vs post.setSize mismatch');
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
  assert.equal(r.bothIsCombined, false, 'px isolation still combined with hemi');
  assert.equal(r.ratioSetsWide, true, 'ratio isolation did not set pixelRatio 2');
  assert.equal(r.ratioHidesLeftover, true, 'ratio isolation did not hide leftover empty-scene meshes');
  assert.equal(r.ratioKeepsEnv, true, 'ratio isolation clears scene.environment');
  assert.equal(r.ratioKeepsHemi, true, 'hemi.color left product during ratio isolation');
  assert.equal(r.ratioKeepsBuffer, true, 'drawingBuffer left product during ratio isolation');
  assert.equal(r.ratioKeepsSize, true, 'post.setSize left product during ratio isolation');
  assert.equal(r.bufferSetsSmall, true, 'buffer isolation did not set 640x400 drawingBuffer');
  assert.equal(r.bufferHidesLeftover, true, 'buffer isolation did not hide leftover empty-scene meshes');
  assert.equal(r.bufferKeepsEnv, true, 'buffer isolation clears scene.environment');
  assert.equal(r.bufferKeepsHemi, true, 'hemi.color left product during buffer isolation');
  assert.equal(r.bufferKeepsRatio, true, 'pixelRatio left product during buffer isolation');
  assert.equal(r.bufferKeepsSize, true, 'post.setSize left product during buffer isolation');
  assert.equal(r.sizeSetsPost, true, 'size isolation did not set post.setSize 640x400');
  assert.equal(r.sizeHidesLeftover, true, 'size isolation did not hide leftover empty-scene meshes');
  assert.equal(r.sizeKeepsEnv, true, 'size isolation clears scene.environment');
  assert.equal(r.sizeKeepsHemi, true, 'hemi.color left product during size isolation');
  assert.equal(r.sizeKeepsRatio, true, 'pixelRatio left product during size isolation');
  assert.equal(r.sizeKeepsBuffer, true, 'drawingBuffer left product during size isolation');
  assert.equal(r.envSetsGray, true, 'scene.environment isolation did not swap gray cubemap');
  assert.equal(r.envHidesLeftover, true, 'env isolation did not hide leftover empty-scene meshes');
  assert.equal(r.envKeepsHemi, true, 'hemi.color left product during scene.environment isolation');
  assert.equal(r.envKeepsRatio, true, 'pixelRatio left product during env isolation');
  assert.equal(r.envKeepsBuffer, true, 'drawingBuffer left product during env isolation');
  assert.equal(r.envKeepsSize, true, 'post.setSize left product during env isolation');
  assert.equal(r.envClearsHue, false, 'scene.environment isolation uses product sky hue bake');
  assert.equal(r.packSetsWide, true, 'pack isolation did not set pixelRatio 2');
  assert.equal(r.packSetsSmall, true, 'pack isolation did not set 640x400 drawingBuffer');
  assert.equal(r.packSetsPost, true, 'pack isolation did not set post.setSize 640x400');
  assert.equal(r.packHidesLeftover, true, 'pack isolation did not hide leftover empty-scene meshes');
  assert.equal(r.packKeepsEnv, true, 'pack isolation clears scene.environment');
  assert.equal(r.packKeepsHemi, true, 'hemi.color left product during pack isolation');
  assert.equal(r.bothSetsGray, true, 'both isolation did not swap gray cubemap');
  assert.equal(r.bothSetsWide, true, 'both isolation did not set pixelRatio 2');
  assert.equal(r.bothSetsSmall, true, 'both isolation did not set 640x400 drawingBuffer');
  assert.equal(r.bothSetsPost, true, 'both isolation did not set post.setSize 640x400');
  assert.equal(r.bothHidesLeftover, true, 'both isolation did not hide leftover empty-scene meshes');
  assert.equal(r.bothKeepsHemi, true, 'hemi.color left product during both isolation');
  assert.equal(r.intensityClearsIbl, false, 'px isolation clears scene.environment via sun');
  assert.equal(r.pxDeltasUseEmptyBaseline, true, 'leftover g07 still uses world.group leftover as baseline');
  assert.equal(r.hgndKeepsGround, true, 'HemisphereLight groundColor left product after px restorers');
  assert.equal(r.ambKeepsAmbient, true, 'AmbientLight intensity left product during px probe');
  assert.equal(r.rectKeepsRectArea, true, 'RectAreaLight intensity left product during px probe');
  assert.equal(r.productExposure, PRODUCT_EXPOSURE, 'product exposure retuned');
  assert.ok(r.rampsCount >= 150, 'ramps leftover baseline missing');
  assert.ok(r.leftoverCount >= 151, 'empty-scene leftover baseline missing');
  assert.ok(r.ratioCount >= 151, 'pixelRatio isolation missing');
  assert.ok(r.bufferCount >= 151, 'drawingBuffer isolation missing');
  assert.ok(r.sizeCount >= 151, 'post.setSize isolation missing');
  assert.ok(r.packCount >= 151, 'combined pixel-buffer-size isolation missing');
  assert.ok(r.envCount >= 151, 'scene.environment isolation missing');
  assert.ok(r.bothCount >= 151, 'both pixel-buffer-size+env isolation missing');
  assert.ok(r.buildingsCount >= 1, 'buildings leftover members missing');
  assert.ok(r.instancedCount >= 1, 'instanced leftover members missing');
  assert.ok(r.groundCount >= 1, 'ground leftover members missing');
  assert.ok(r.remainingCount >= 1, 'remaining world meshes leftover members missing');
  assert.equal(r.colorManagementStaysEnabled, true, 'ColorManagement disabled during px probe');
  assert.equal(r.outputColorSpaceStaysSRGB, true, 'outputColorSpace left product sRGB during px probe');
  assert.equal(r.toneMappingStaysACES, true, 'toneMapping left product ACES during px probe');
  assert.equal(r.fovStays58, true, 'product fov retuned during px probe');
  assert.equal(r.nearStaysProduct, true, 'product near retuned during px probe');
  assert.equal(r.farStaysProduct, true, 'product far retuned during px probe');
  assert.equal(r.productGroundHex, GROUND_ALBEDO.hex, 'product ground color retuned');
  assert.ok(r.productGroundCount >= 1, 'product ground color missing');
  assert.ok(r.groundMeshCount >= 1, 'ground mesh missing');
  assert.deepEqual(r.pageErrors ?? [], []);
  assert.equal(r.glError ?? 0, 0);
  assert.equal(pxBufferIsNotOriginalGolden(r), false, 'lod buffer is not original-golden');
  assert.ok(r.baselineHashes && typeof r.baselineHashes === 'object');
  for (const name of ORIGINAL_GOLDEN_FILES) {
    assert.equal(r.baselineHashes[name], RSH035_BASELINE_SHA256[name], `baseline hash drift: ${name}`);
  }
  let cameraFail = 0, mismatchFail = 0, bakeFail = 0;
  for (const spec of PX_FRAMES) {
    const row = r.frames.find(frameRow => frameRow.id === spec.id);
    assert.ok(row, `missing frame ${spec.id}`);
    assert.equal(row.night, spec.night);
    assert.equal(row.pixelThreshold, PIXEL_THRESHOLD);
    assert.ok(Math.abs(row.follow - 7.4) <= 0.05 && Math.abs(row.height - 1.92) <= 0.05);
    if (Math.abs(row.follow - 7.4) > 0.05 || Math.abs(row.height - 1.92) > 0.05) cameraFail += 1;
    if (row.presentPct === 0 || row.presentMismatched === 0) mismatchFail += 1;
    const byId = Object.fromEntries(row.layers.map(layer => [layer.id, layer]));
    if (!row.dominantPx || !row.dominant || row.layers.length !== PX_LAYERS.length
      || PX_LAYERS.some(id => !byId[id])
      || row.layers.some(layer => !Number.isFinite(layer.l2Delta) || !Number.isFinite(layer.lumaDelta)
        || !Number.isFinite(layer.blueDelta) || !Number.isFinite(layer.live?.r))
      || !Array.isArray(row.ratioAxis) || !Array.isArray(row.envAxis) || !Array.isArray(row.bothAxis)
      || !Array.isArray(row.bufferAxis) || !Array.isArray(row.sizeAxis) || !Array.isArray(row.packAxis)
      || !Number.isFinite(row.leftoverBaselinePct)
      || row.bands.length !== REGION_BANDS.length
      || !Number.isFinite(row.bandL2)
      || PX_LAYERS.some(id => (byId[id]?.hidden ?? 0) < 1)) bakeFail += 1;
  }
  return [
    {
      case: 'leftover g07 after world.group+outside is not remaining empty-scene vs golden independently of pixelRatio vs drawingBuffer vs post.setSize attribution',
      status: 'passed',
      probes: 4,
      failures: 0,
    },
    {
      case: 'live rest chase stays 7.4/1.92 while present px axes are sampled',
      status: cameraFail ? 'failed' : 'passed',
      probes: 4,
      failures: cameraFail,
    },
    {
      case: 'pixelRatio vs drawingBuffer vs post.setSize independently of env of leftover g07 after world.group+outside ran at 1280x800 threshold 0.12 without retuning 0xd0d4d8 or 0.56 exposure',
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
      case: 'px-buffer pixelmatch is not original-golden page capture',
      status: 'passed',
      probes: 1,
      failures: 0,
    },
  ];
}

export async function retainWorldPx(report, out) {
  await mkdir(out, { recursive: true });
  await writeFile(`${out}/results.json`, JSON.stringify(report, null, 2) + '\n');
  const results = worldPxResults(report);
  await writeFile(`${out}/results.json`, JSON.stringify({ ...report, results }, null, 2) + '\n');
  return results;
}

export async function measureWorldPx(browser, url) {
  const baseline = fromRoot('golden-baseline');
  const goldPngs = {};
  const baselineHashes = {};
  for (const spec of PX_FRAMES) {
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
        let ratioSetsWide = false;
        let ratioHidesLeftover = false;
        let ratioKeepsEnv = true;
        let ratioKeepsHemi = true;
        let ratioKeepsBuffer = true;
        let ratioKeepsSize = true;
        let bufferSetsSmall = false;
        let bufferHidesLeftover = false;
        let bufferKeepsEnv = true;
        let bufferKeepsHemi = true;
        let bufferKeepsRatio = true;
        let bufferKeepsSize = true;
        let sizeSetsPost = false;
        let sizeHidesLeftover = false;
        let sizeKeepsEnv = true;
        let sizeKeepsHemi = true;
        let sizeKeepsRatio = true;
        let sizeKeepsBuffer = true;
        let envSetsGray = false;
        let envHidesLeftover = false;
        let envKeepsHemi = true;
        let envKeepsRatio = true;
        let envKeepsBuffer = true;
        let envKeepsSize = true;
        let packSetsWide = false;
        let packSetsSmall = false;
        let packSetsPost = false;
        let packHidesLeftover = false;
        let packKeepsEnv = true;
        let packKeepsHemi = true;
        let bothSetsGray = false;
        let bothSetsWide = false;
        let bothSetsSmall = false;
        let bothSetsPost = false;
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
        const setRatio = (pr) => {
          const prev = engine.renderer.getPixelRatio();
          engine.renderer.setPixelRatio(2);
          return [() => {
            engine.renderer.setPixelRatio(prev);
            engine.renderer.setSize(1280, 800, false);
          }];
        };
        const setBuffer = (w, h) => {
          const prevPr = engine.renderer.getPixelRatio();
          engine.renderer.setSize(w, h, false);
          return [() => {
            engine.renderer.setPixelRatio(prevPr);
            engine.renderer.setSize(1280, 800, false);
          }];
        };
        const setPost = (w, h) => {
          engine.post.setSize(w, h);
          return [() => { engine.post.setSize(1280, 800); }];
        };
        const isolate = {
          ratio() {
            const prevHemi = hemiRgb();
            const prevEnv = engine.scene.environment;
            const restorers = [...hideMeshes(leftoverOf()), ...setRatio(2)];
            if (Math.abs(engine.renderer.getPixelRatio() - 2) <= 0.01) ratioSetsWide = true;
            if (leftoverHidden()) ratioHidesLeftover = true;
            if (engine.scene.environment !== prevEnv) ratioKeepsEnv = false;
            if (hemiRgb().some((rgb, i) => rgb !== prevHemi[i])) ratioKeepsHemi = false;
            if (engine.renderer.domElement.width === 640) ratioKeepsBuffer = false;
            return restorers;
          },
          buffer() {
            const prevHemi = hemiRgb();
            const prevEnv = engine.scene.environment;
            const prevPr = engine.renderer.getPixelRatio();
            const restorers = [...hideMeshes(leftoverOf()), ...setBuffer(640, 400)];
            if (engine.renderer.domElement.width === 640) bufferSetsSmall = true;
            if (leftoverHidden()) bufferHidesLeftover = true;
            if (engine.scene.environment !== prevEnv) bufferKeepsEnv = false;
            if (hemiRgb().some((rgb, i) => rgb !== prevHemi[i])) bufferKeepsHemi = false;
            if (Math.abs(engine.renderer.getPixelRatio() - prevPr) > 0.01) bufferKeepsRatio = false;
            return restorers;
          },
          size() {
            const prevHemi = hemiRgb();
            const prevEnv = engine.scene.environment;
            const prevPr = engine.renderer.getPixelRatio();
            const prevW = engine.renderer.domElement.width;
            const restorers = [...hideMeshes(leftoverOf()), ...setPost(640, 400)];
            sizeSetsPost = true;
            if (leftoverHidden()) sizeHidesLeftover = true;
            if (engine.scene.environment !== prevEnv) sizeKeepsEnv = false;
            if (hemiRgb().some((rgb, i) => rgb !== prevHemi[i])) sizeKeepsHemi = false;
            if (Math.abs(engine.renderer.getPixelRatio() - prevPr) > 0.01) sizeKeepsRatio = false;
            if (engine.renderer.domElement.width !== prevW) sizeKeepsBuffer = false;
            return restorers;
          },
          env() {
            const prevHemi = hemiRgb();
            const prevPr = engine.renderer.getPixelRatio();
            const prevW = engine.renderer.domElement.width;
            const gray = bakeGray();
            const restorers = [...hideMeshes(leftoverOf()), ...swapEnv(gray)];
            if (engine.scene.environment === gray.texture) envSetsGray = true;
            if (leftoverHidden()) envHidesLeftover = true;
            if (hemiRgb().some((rgb, i) => rgb !== prevHemi[i])) envKeepsHemi = false;
            if (Math.abs(engine.renderer.getPixelRatio() - prevPr) > 0.01) envKeepsRatio = false;
            if (engine.renderer.domElement.width !== prevW) envKeepsBuffer = false;
            return restorers;
          },
          pack() {
            const prevHemi = hemiRgb();
            const prevEnv = engine.scene.environment;
            const restorers = [
              ...hideMeshes(leftoverOf()),
              ...setRatio(2),
              ...setBuffer(640, 400),
              ...setPost(640, 400),
            ];
            if (Math.abs(engine.renderer.getPixelRatio() - 2) <= 0.01) packSetsWide = true;
            packSetsSmall = true;
            packSetsPost = true;
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
              ...setRatio(2),
              ...setBuffer(640, 400),
              ...setPost(640, 400),
            ];
            if (engine.scene.environment === gray.texture) bothSetsGray = true;
            if (Math.abs(engine.renderer.getPixelRatio() - 2) <= 0.01) bothSetsWide = true;
            bothSetsSmall = true;
            bothSetsPost = true;
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
        const bothIsCombined = !ratioKeepsHemi || !bufferKeepsHemi || !sizeKeepsHemi || !envKeepsHemi || !packKeepsHemi || !bothKeepsHemi;
        const toneRestorers = isolate.ratio();
        toneRestorers.forEach(restore => restore());
        const spaceRestorers = isolate.buffer();
        spaceRestorers.forEach(restore => restore());
        const mgmtRestorers = isolate.size();
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
          ratioSetsWide,
          ratioHidesLeftover,
          ratioKeepsEnv,
          ratioKeepsHemi,
          ratioKeepsBuffer,
          ratioKeepsSize,
          bufferSetsSmall,
          bufferHidesLeftover,
          bufferKeepsEnv,
          bufferKeepsHemi,
          bufferKeepsRatio,
          bufferKeepsSize,
          sizeSetsPost,
          sizeHidesLeftover,
          sizeKeepsEnv,
          sizeKeepsHemi,
          sizeKeepsRatio,
          sizeKeepsBuffer,
          envSetsGray,
          envHidesLeftover,
          envKeepsHemi,
          envKeepsRatio,
          envKeepsBuffer,
          envKeepsSize,
          envClearsHue,
          packSetsWide,
          packSetsSmall,
          packSetsPost,
          packHidesLeftover,
          packKeepsEnv,
          packKeepsHemi,
          bothSetsGray,
          bothSetsWide,
          bothSetsSmall,
          bothSetsPost,
          bothHidesLeftover,
          bothKeepsHemi,
          intensityClearsIbl,
          pxDeltasUseEmptyBaseline: true,
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
      frames: PX_FRAMES,
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
      const layers = PX_LAYERS.map(id => {
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
        dominantPx: dominantPx(layers),
        contributingPx: layers.filter(layer => layer.bandDelta <= -PX_BAND_MIN).map(layer => layer.id),
        ratioAxis: layers.filter(layer => RATIO_IDS.includes(layer.id) && layer.bandDelta <= -PX_BAND_MIN).map(layer => layer.id),
        envAxis: layers.filter(layer => IBL_IDS.includes(layer.id) && (layer.bandDelta <= -PX_BAND_MIN || layer.blueDelta <= -PX_BLUE_MIN)).map(layer => layer.id),
        bothAxis: layers.filter(layer => BOTH_IDS.includes(layer.id) && layer.bandDelta <= -PX_BAND_MIN).map(layer => layer.id),
        bufferAxis: layers.filter(layer => BUFFER_IDS.includes(layer.id) && layer.bandDelta <= -PX_BAND_MIN).map(layer => layer.id),
        sizeAxis: layers.filter(layer => SIZE_IDS.includes(layer.id) && layer.bandDelta <= -PX_BAND_MIN).map(layer => layer.id),
        packAxis: layers.filter(layer => PACK_IDS.includes(layer.id) && layer.bandDelta <= -PX_BAND_MIN).map(layer => layer.id),
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
      ratioSetsWide: report.ratioSetsWide,
      ratioHidesLeftover: report.ratioHidesLeftover,
      ratioKeepsEnv: report.ratioKeepsEnv,
      ratioKeepsHemi: report.ratioKeepsHemi,
      ratioKeepsBuffer: report.ratioKeepsBuffer,
      ratioKeepsSize: report.ratioKeepsSize,
      bufferSetsSmall: report.bufferSetsSmall,
      bufferHidesLeftover: report.bufferHidesLeftover,
      bufferKeepsEnv: report.bufferKeepsEnv,
      bufferKeepsHemi: report.bufferKeepsHemi,
      bufferKeepsRatio: report.bufferKeepsRatio,
      bufferKeepsSize: report.bufferKeepsSize,
      sizeSetsPost: report.sizeSetsPost,
      sizeHidesLeftover: report.sizeHidesLeftover,
      sizeKeepsEnv: report.sizeKeepsEnv,
      sizeKeepsHemi: report.sizeKeepsHemi,
      sizeKeepsRatio: report.sizeKeepsRatio,
      sizeKeepsBuffer: report.sizeKeepsBuffer,
      envSetsGray: report.envSetsGray,
      envHidesLeftover: report.envHidesLeftover,
      envKeepsHemi: report.envKeepsHemi,
      envKeepsRatio: report.envKeepsRatio,
      envKeepsBuffer: report.envKeepsBuffer,
      envKeepsSize: report.envKeepsSize,
      envClearsHue: report.envClearsHue,
      packSetsWide: report.packSetsWide,
      packSetsSmall: report.packSetsSmall,
      packSetsPost: report.packSetsPost,
      packHidesLeftover: report.packHidesLeftover,
      packKeepsEnv: report.packKeepsEnv,
      packKeepsHemi: report.packKeepsHemi,
      bothSetsGray: report.bothSetsGray,
      bothSetsWide: report.bothSetsWide,
      bothSetsSmall: report.bothSetsSmall,
      bothSetsPost: report.bothSetsPost,
      bothHidesLeftover: report.bothHidesLeftover,
      bothKeepsHemi: report.bothKeepsHemi,
      intensityClearsIbl: report.intensityClearsIbl,
      pxDeltasUseEmptyBaseline: report.pxDeltasUseEmptyBaseline,
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
      ratioCount: report.ratioCount,
      bufferCount: report.bufferCount,
      sizeCount: report.sizeCount,
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
      protocol: 'world-px-buffer-not-original-golden',
      baselineHashes,
      pageErrors,
    };
  } finally {
    await page.close();
  }
}

export async function verifyWorldPx(browser, url) {
  const report = await measureWorldPx(browser, url);
  const out = process.env.WORLD_PX_OUTPUT ?? fromRoot('artifacts', 'world-px');
  const results = await retainWorldPx(report, out);
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
    console.log(JSON.stringify(await verifyWorldPx(browser, process.env.SMOKE_URL ?? 'http://127.0.0.1:8080/?qa=1'), null, 2));
  } finally {
    await browser.close();
  }
}
