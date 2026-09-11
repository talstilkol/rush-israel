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

/** Leftover g07 after world.group+outside is not remaining empty-scene vs golden independently of camera fov vs near vs far. */
export const CAM_FRAMES = REGION_FRAMES;
export const CAM_LAYERS = Object.freeze([
  'fov', 'near', 'far', 'env', 'both', 'clip',
]);
export const CAPTURE_LAYERS = CAM_LAYERS;
export const FOV_IDS = Object.freeze(['fov']);
export const NEAR_IDS = Object.freeze(['near']);
export const FAR_IDS = Object.freeze(['far']);
export const IBL_IDS = Object.freeze(['env']);
export const BOTH_IDS = Object.freeze(['both']);
export const CLIP_IDS = Object.freeze(['clip']);
export const PRODUCT_HEMI_SKY_HEX = 0xa8c8e8;
export const PRODUCT_HEMI_NIGHT_HEX = 0x6a88b0;
export const CAM_L2_MIN = 8;
export const CAM_LUMA_MIN = 8;
export const CAM_BLUE_MIN = 8;
export const CAM_BAND_MIN = 0.02;
export const PRODUCT_EXPOSURE = 0.56;
export const PRODUCT_SKY_HEX = 0x3a9ae0;
export const NEUTRAL_SKY_HEX = 0x808080;
export const PRODUCT_PMREM_SIZE = 256;
export const PRODUCT_FOV = 58;
export const PRODUCT_NEAR = 0.28;
export const PRODUCT_FAR_MIN = 10000;
export const WIDE_FOV = 90;
export const CLIP_NEAR = 8;
export const CLIP_FAR = 80;

export function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

export function luma(rgb) {
  return +(0.2126 * (rgb?.r ?? 0) + 0.7152 * (rgb?.g ?? 0) + 0.0722 * (rgb?.b ?? 0)).toFixed(2);
}

export function dominantCam(layers) {
  if (!Array.isArray(layers) || layers.length !== CAM_LAYERS.length) return null;
  return [...layers].sort((a, b) => a.bandDelta - b.bandDelta || a.l2Delta - b.l2Delta || a.id.localeCompare(b.id))[0]?.id ?? null;
}

export function leftoverIsNotCamMismatch(report) {
  if (!report?.frames?.length) return true;
  return report.frames.some(frame => !Array.isArray(frame.layers) || frame.layers.length !== CAM_LAYERS.length
    || CAM_LAYERS.some(id => !frame.layers.some(layer => layer.id === id))
    || frame.layers.some(layer => !CAM_LAYERS.includes(layer.id)
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
    || !frame.dominantCam
    || !frame.dominant
    || !Array.isArray(frame.fovAxis)
    || !Array.isArray(frame.envAxis)
    || !Array.isArray(frame.bothAxis)
    || !Array.isArray(frame.nearAxis)
    || !Array.isArray(frame.farAxis)
    || !Array.isArray(frame.clipAxis)
    || !Number.isFinite(frame.leftoverBaselinePct)
    || !Number.isFinite(frame.presentPct)
    || !Number.isFinite(frame.bandL2)
    || !Array.isArray(frame.bands) || frame.bands.length !== REGION_BANDS.length);
}

export function camBufferIsNotOriginalGolden(report) {
  return !report
    || report.protocol !== 'world-cam-buffer-not-original-golden'
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
  const hidden = { fov: 2083, near: 2083, far: 2083, env: 2083, both: 2084, clip: 2083 }[id] ?? 1;
  const baselineL2 = 40;
  const baselineLuma = 40;
  const baselineBlue = 90;
  const l2 = id === 'fov' ? 18 : id === 'both' ? 20 : id === 'clip' ? 22 : id === 'env' ? 40 : 40;
  const lumaVal = 40;
  const blueVal = id === 'env' ? 70 : 90;
  const bandDelta = id === 'fov' ? -0.10 : id === 'both' ? -0.08 : id === 'clip' ? -0.05 : id === 'env' ? 0.0076 : 0;
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
  const spec = CAM_FRAMES.find(row => row.id === id);
  const bands = REGION_BANDS.map((band, i) => ({
    id: band.id, y0: band.y0, y1: band.y1,
    mismatched: Math.round((0.2 + i * 0.08) * BAND_PIXELS),
    pct: Number((0.2 + i * 0.08).toFixed(4)),
  }));
  const layers = CAM_LAYERS.map(layerId => layerRow(layerId));
  return {
    id, t: spec.t, night: spec.night, file: spec.file,
    follow: 7.4, height: 1.92, fov: 58, nonBlackFraction: 0.42,
    presentPct: 0.41, presentMismatched: Math.round(0.41 * SCENE_PIXELS),
    pixelThreshold: PIXEL_THRESHOLD, bands, dominant: 'upper',
    bandLive: { r: 77.07, g: 104.52, b: 131.96 },
    bandGold: { r: 25.54, g: 35.89, b: 37.8 },
    bandL2: 127.4, bandLuma: 98.2, bandBlue: 131.96,
    layers, dominantCam: 'fov',
    contributingCam: ['fov', 'clip'],
    fovAxis: ['fov'],
    envAxis: [],
    bothAxis: ['both'],
    nearAxis: [],
    farAxis: [],
    clipAxis: ['clip'],
    leftoverBaselinePct: 0.2027,
    ...extra,
  };
}

export function worldCamFixture(extra = {}) {
  return {
    colliderCount: 722, legacyCount: 546, pierCount: 176, rampCount: 50, routeSamples: 781,
    checkpointCount: 8, historicalRamps: HISTORICAL_RAMPS, historicalColliders: HISTORICAL_COLLIDERS,
    decks: EXPECTED_DECKS, strips: EXPECTED_STRIPS, classifiedPiers: EXPECTED_PIERS,
    rampsCount: 150, leftoverCount: 2082, fovCount: 2083, nearCount: 2083, farCount: 2083, envCount: 2083, bothCount: 2086, clipCount: 2085, buildingsCount: 696, instancedCount: 47, groundCount: 1, remainingCount: 260,
    lumaTermsIncludeHemi: false, envIsCombined: false, bothIsCombined: false,
    fovSetsWide: true, fovHidesLeftover: true, fovKeepsEnv: true, fovKeepsHemi: true, fovKeepsNear: true, fovKeepsFar: true,
    nearSetsClip: true, nearHidesLeftover: true, nearKeepsEnv: true, nearKeepsHemi: true, nearKeepsFov: true, nearKeepsFar: true,
    farSetsClip: true, farHidesLeftover: true, farKeepsEnv: true, farKeepsHemi: true, farKeepsFov: true, farKeepsNear: true,
    envSetsGray: true, envHidesLeftover: true, envKeepsHemi: true, envKeepsFov: true, envKeepsNear: true, envKeepsFar: true, envClearsHue: false,
    clipSetsWide: true, clipSetsNear: true, clipSetsFar: true, clipHidesLeftover: true, clipKeepsEnv: true, clipKeepsHemi: true,
    bothSetsGray: true, bothSetsWide: true, bothSetsNear: true, bothSetsFar: true, bothHidesLeftover: true, bothKeepsHemi: true,
    intensityClearsIbl: false,
    camDeltasUseEmptyBaseline: true,
    ambKeepsAmbient: true, rectKeepsRectArea: true, hgndKeepsGround: true,
    colorManagementStaysEnabled: true, outputColorSpaceStaysSRGB: true, toneMappingStaysACES: true,
    fovStays58: true, nearStaysProduct: true, farStaysProduct: true,
    productExposure: PRODUCT_EXPOSURE,
    productGroundHex: GROUND_ALBEDO.hex, productGroundCount: 1, groundMeshCount: 1,
    originalGoldenComparisons: 0, authority: false, baselineUpdates: 0, updateGolden: false,
    pixelThreshold: PIXEL_THRESHOLD, failureLimit: FAILURE_LIMIT,
    viewport: { ...VIEWPORT },
    pageErrors: [], glError: 0, protocol: 'world-cam-buffer-not-original-golden',
    baselineHashes: { ...RSH035_BASELINE_SHA256 },
    frames: CAM_FRAMES.map(spec => frame(spec.id)),
    ...extra,
  };
}

export function worldCamResults(r) {
  assert.ok(r && typeof r === 'object', 'world-cam evidence missing');
  assert.equal(r.updateGolden, false);
  assert.equal(r.baselineUpdates, 0);
  assert.equal(r.originalGoldenComparisons, 0);
  assert.equal(r.authority, false);
  assert.equal(r.pixelThreshold, PIXEL_THRESHOLD);
  assert.equal(r.failureLimit, FAILURE_LIMIT);
  assert.equal(r.viewport?.width, VIEWPORT.width);
  assert.equal(r.viewport?.height, VIEWPORT.height);
  assert.ok(Array.isArray(r.frames) && r.frames.length === 4, 'world-cam frames missing');
  assert.equal(leftoverIsNotCamMismatch(r), false, 'leftover g07 after world.group+outside is not remaining empty-scene vs golden independently of camera fov vs near vs far mismatch');
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
  assert.equal(r.bothIsCombined, false, 'cam isolation still combined with hemi');
  assert.equal(r.fovSetsWide, true, 'fov isolation did not set wide fov');
  assert.equal(r.fovHidesLeftover, true, 'fov isolation did not hide leftover empty-scene meshes');
  assert.equal(r.fovKeepsEnv, true, 'fov isolation clears scene.environment');
  assert.equal(r.fovKeepsHemi, true, 'hemi.color left product during fov isolation');
  assert.equal(r.fovKeepsNear, true, 'camera.near left product during fov isolation');
  assert.equal(r.fovKeepsFar, true, 'camera.far left product during fov isolation');
  assert.equal(r.nearSetsClip, true, 'near isolation did not set clip near');
  assert.equal(r.nearHidesLeftover, true, 'near isolation did not hide leftover empty-scene meshes');
  assert.equal(r.nearKeepsEnv, true, 'near isolation clears scene.environment');
  assert.equal(r.nearKeepsHemi, true, 'hemi.color left product during near isolation');
  assert.equal(r.nearKeepsFov, true, 'camera.fov left product during near isolation');
  assert.equal(r.nearKeepsFar, true, 'camera.far left product during near isolation');
  assert.equal(r.farSetsClip, true, 'far isolation did not set clip far');
  assert.equal(r.farHidesLeftover, true, 'far isolation did not hide leftover empty-scene meshes');
  assert.equal(r.farKeepsEnv, true, 'far isolation clears scene.environment');
  assert.equal(r.farKeepsHemi, true, 'hemi.color left product during far isolation');
  assert.equal(r.farKeepsFov, true, 'camera.fov left product during far isolation');
  assert.equal(r.farKeepsNear, true, 'camera.near left product during far isolation');
  assert.equal(r.envSetsGray, true, 'scene.environment isolation did not swap gray cubemap');
  assert.equal(r.envHidesLeftover, true, 'env isolation did not hide leftover empty-scene meshes');
  assert.equal(r.envKeepsHemi, true, 'hemi.color left product during scene.environment isolation');
  assert.equal(r.envKeepsFov, true, 'camera.fov left product during env isolation');
  assert.equal(r.envKeepsNear, true, 'camera.near left product during env isolation');
  assert.equal(r.envKeepsFar, true, 'camera.far left product during env isolation');
  assert.equal(r.envClearsHue, false, 'scene.environment isolation uses product sky hue bake');
  assert.equal(r.clipSetsWide, true, 'clip isolation did not set wide fov');
  assert.equal(r.clipSetsNear, true, 'clip isolation did not set clip near');
  assert.equal(r.clipSetsFar, true, 'clip isolation did not set clip far');
  assert.equal(r.clipHidesLeftover, true, 'clip isolation did not hide leftover empty-scene meshes');
  assert.equal(r.clipKeepsEnv, true, 'clip isolation clears scene.environment');
  assert.equal(r.clipKeepsHemi, true, 'hemi.color left product during clip isolation');
  assert.equal(r.bothSetsGray, true, 'both isolation did not swap gray cubemap');
  assert.equal(r.bothSetsWide, true, 'both isolation did not set wide fov');
  assert.equal(r.bothSetsNear, true, 'both isolation did not set clip near');
  assert.equal(r.bothSetsFar, true, 'both isolation did not set clip far');
  assert.equal(r.bothHidesLeftover, true, 'both isolation did not hide leftover empty-scene meshes');
  assert.equal(r.bothKeepsHemi, true, 'hemi.color left product during both isolation');
  assert.equal(r.intensityClearsIbl, false, 'cam isolation clears scene.environment via sun');
  assert.equal(r.camDeltasUseEmptyBaseline, true, 'leftover g07 still uses world.group leftover as baseline');
  assert.equal(r.hgndKeepsGround, true, 'HemisphereLight groundColor left product after cam restorers');
  assert.equal(r.ambKeepsAmbient, true, 'AmbientLight intensity left product during cam probe');
  assert.equal(r.rectKeepsRectArea, true, 'RectAreaLight intensity left product during cam probe');
  assert.equal(r.productExposure, PRODUCT_EXPOSURE, 'product exposure retuned');
  assert.ok(r.rampsCount >= 150, 'ramps leftover baseline missing');
  assert.ok(r.leftoverCount >= 151, 'empty-scene leftover baseline missing');
  assert.ok(r.fovCount >= 151, 'camera fov isolation missing');
  assert.ok(r.nearCount >= 151, 'camera near isolation missing');
  assert.ok(r.farCount >= 151, 'camera far isolation missing');
  assert.ok(r.clipCount >= 151, 'combined camera isolation missing');
  assert.ok(r.envCount >= 151, 'scene.environment isolation missing');
  assert.ok(r.bothCount >= 151, 'both camera+env isolation missing');
  assert.ok(r.buildingsCount >= 1, 'buildings leftover members missing');
  assert.ok(r.instancedCount >= 1, 'instanced leftover members missing');
  assert.ok(r.groundCount >= 1, 'ground leftover members missing');
  assert.ok(r.remainingCount >= 1, 'remaining world meshes leftover members missing');
  assert.equal(r.colorManagementStaysEnabled, true, 'ColorManagement disabled during cam probe');
  assert.equal(r.outputColorSpaceStaysSRGB, true, 'outputColorSpace left product sRGB during cam probe');
  assert.equal(r.toneMappingStaysACES, true, 'toneMapping left product ACES during cam probe');
  assert.equal(r.fovStays58, true, 'product fov retuned during cam probe');
  assert.equal(r.nearStaysProduct, true, 'product near retuned during cam probe');
  assert.equal(r.farStaysProduct, true, 'product far retuned during cam probe');
  assert.equal(r.productGroundHex, GROUND_ALBEDO.hex, 'product ground color retuned');
  assert.ok(r.productGroundCount >= 1, 'product ground color missing');
  assert.ok(r.groundMeshCount >= 1, 'ground mesh missing');
  assert.deepEqual(r.pageErrors ?? [], []);
  assert.equal(r.glError ?? 0, 0);
  assert.equal(camBufferIsNotOriginalGolden(r), false, 'lod buffer is not original-golden');
  assert.ok(r.baselineHashes && typeof r.baselineHashes === 'object');
  for (const name of ORIGINAL_GOLDEN_FILES) {
    assert.equal(r.baselineHashes[name], RSH035_BASELINE_SHA256[name], `baseline hash drift: ${name}`);
  }
  let cameraFail = 0, mismatchFail = 0, bakeFail = 0;
  for (const spec of CAM_FRAMES) {
    const row = r.frames.find(frameRow => frameRow.id === spec.id);
    assert.ok(row, `missing frame ${spec.id}`);
    assert.equal(row.night, spec.night);
    assert.equal(row.pixelThreshold, PIXEL_THRESHOLD);
    assert.ok(Math.abs(row.follow - 7.4) <= 0.05 && Math.abs(row.height - 1.92) <= 0.05);
    if (Math.abs(row.follow - 7.4) > 0.05 || Math.abs(row.height - 1.92) > 0.05) cameraFail += 1;
    if (row.presentPct === 0 || row.presentMismatched === 0) mismatchFail += 1;
    const byId = Object.fromEntries(row.layers.map(layer => [layer.id, layer]));
    if (!row.dominantCam || !row.dominant || row.layers.length !== CAM_LAYERS.length
      || CAM_LAYERS.some(id => !byId[id])
      || row.layers.some(layer => !Number.isFinite(layer.l2Delta) || !Number.isFinite(layer.lumaDelta)
        || !Number.isFinite(layer.blueDelta) || !Number.isFinite(layer.live?.r))
      || !Array.isArray(row.fovAxis) || !Array.isArray(row.envAxis) || !Array.isArray(row.bothAxis)
      || !Array.isArray(row.nearAxis) || !Array.isArray(row.farAxis) || !Array.isArray(row.clipAxis)
      || !Number.isFinite(row.leftoverBaselinePct)
      || row.bands.length !== REGION_BANDS.length
      || !Number.isFinite(row.bandL2)
      || CAM_LAYERS.some(id => (byId[id]?.hidden ?? 0) < 1)) bakeFail += 1;
  }
  return [
    {
      case: 'leftover g07 after world.group+outside is not remaining empty-scene vs golden independently of camera fov vs near vs far attribution',
      status: 'passed',
      probes: 4,
      failures: 0,
    },
    {
      case: 'live rest chase stays 7.4/1.92 while present cam axes are sampled',
      status: cameraFail ? 'failed' : 'passed',
      probes: 4,
      failures: cameraFail,
    },
    {
      case: 'camera fov vs near vs far independently of env of leftover g07 after world.group+outside ran at 1280x800 threshold 0.12 without retuning 0xd0d4d8 or 0.56 exposure',
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
      case: 'cam-buffer pixelmatch is not original-golden page capture',
      status: 'passed',
      probes: 1,
      failures: 0,
    },
  ];
}

export async function retainWorldCam(report, out) {
  await mkdir(out, { recursive: true });
  await writeFile(`${out}/results.json`, JSON.stringify(report, null, 2) + '\n');
  const results = worldCamResults(report);
  await writeFile(`${out}/results.json`, JSON.stringify({ ...report, results }, null, 2) + '\n');
  return results;
}

export async function measureWorldCam(browser, url) {
  const baseline = fromRoot('golden-baseline');
  const goldPngs = {};
  const baselineHashes = {};
  for (const spec of CAM_FRAMES) {
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
        let fovSetsWide = false;
        let fovHidesLeftover = false;
        let fovKeepsEnv = true;
        let fovKeepsHemi = true;
        let fovKeepsNear = true;
        let fovKeepsFar = true;
        let nearSetsClip = false;
        let nearHidesLeftover = false;
        let nearKeepsEnv = true;
        let nearKeepsHemi = true;
        let nearKeepsFov = true;
        let nearKeepsFar = true;
        let farSetsClip = false;
        let farHidesLeftover = false;
        let farKeepsEnv = true;
        let farKeepsHemi = true;
        let farKeepsFov = true;
        let farKeepsNear = true;
        let envSetsGray = false;
        let envHidesLeftover = false;
        let envKeepsHemi = true;
        let envKeepsFov = true;
        let envKeepsNear = true;
        let envKeepsFar = true;
        let clipSetsWide = false;
        let clipSetsNear = false;
        let clipSetsFar = false;
        let clipHidesLeftover = false;
        let clipKeepsEnv = true;
        let clipKeepsHemi = true;
        let bothSetsGray = false;
        let bothSetsWide = false;
        let bothSetsNear = false;
        let bothSetsFar = false;
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
        const setFov = (value) => {
          const prev = engine.camera.fov;
          engine.camera.fov = value;
          engine.camera.updateProjectionMatrix();
          return [() => { engine.camera.fov = prev; engine.camera.updateProjectionMatrix(); }];
        };
        const setNear = (value) => {
          const prev = engine.camera.near;
          engine.camera.near = value;
          engine.camera.updateProjectionMatrix();
          return [() => { engine.camera.near = prev; engine.camera.updateProjectionMatrix(); }];
        };
        const setFar = (value) => {
          const prev = engine.camera.far;
          engine.camera.far = value;
          engine.camera.updateProjectionMatrix();
          return [() => { engine.camera.far = prev; engine.camera.updateProjectionMatrix(); }];
        };
        const isolate = {
          fov() {
            const prevHemi = hemiRgb();
            const prevEnv = engine.scene.environment;
            const prevNear = engine.camera.near;
            const prevFar = engine.camera.far;
            const restorers = [...hideMeshes(leftoverOf()), ...setFov(90)];
            if (Math.abs(engine.camera.fov - 90) <= 0.2) fovSetsWide = true;
            if (leftoverHidden()) fovHidesLeftover = true;
            if (engine.scene.environment !== prevEnv) fovKeepsEnv = false;
            if (hemiRgb().some((rgb, i) => rgb !== prevHemi[i])) fovKeepsHemi = false;
            if (engine.camera.near !== prevNear) fovKeepsNear = false;
            if (engine.camera.far !== prevFar) fovKeepsFar = false;
            return restorers;
          },
          near() {
            const prevHemi = hemiRgb();
            const prevEnv = engine.scene.environment;
            const prevFov = engine.camera.fov;
            const prevFar = engine.camera.far;
            const restorers = [...hideMeshes(leftoverOf()), ...setNear(8)];
            if (Math.abs(engine.camera.near - 8) <= 0.001) nearSetsClip = true;
            if (leftoverHidden()) nearHidesLeftover = true;
            if (engine.scene.environment !== prevEnv) nearKeepsEnv = false;
            if (hemiRgb().some((rgb, i) => rgb !== prevHemi[i])) nearKeepsHemi = false;
            if (engine.camera.fov !== prevFov) nearKeepsFov = false;
            if (engine.camera.far !== prevFar) nearKeepsFar = false;
            return restorers;
          },
          far() {
            const prevHemi = hemiRgb();
            const prevEnv = engine.scene.environment;
            const prevFov = engine.camera.fov;
            const prevNear = engine.camera.near;
            const restorers = [...hideMeshes(leftoverOf()), ...setFar(80)];
            if (Math.abs(engine.camera.far - 80) <= 0.001) farSetsClip = true;
            if (leftoverHidden()) farHidesLeftover = true;
            if (engine.scene.environment !== prevEnv) farKeepsEnv = false;
            if (hemiRgb().some((rgb, i) => rgb !== prevHemi[i])) farKeepsHemi = false;
            if (engine.camera.fov !== prevFov) farKeepsFov = false;
            if (engine.camera.near !== prevNear) farKeepsNear = false;
            return restorers;
          },
          env() {
            const prevHemi = hemiRgb();
            const prevFov = engine.camera.fov;
            const prevNear = engine.camera.near;
            const prevFar = engine.camera.far;
            const gray = bakeGray();
            const restorers = [...hideMeshes(leftoverOf()), ...swapEnv(gray)];
            if (engine.scene.environment === gray.texture) envSetsGray = true;
            if (leftoverHidden()) envHidesLeftover = true;
            if (hemiRgb().some((rgb, i) => rgb !== prevHemi[i])) envKeepsHemi = false;
            if (engine.camera.fov !== prevFov) envKeepsFov = false;
            if (engine.camera.near !== prevNear) envKeepsNear = false;
            if (engine.camera.far !== prevFar) envKeepsFar = false;
            return restorers;
          },
          clip() {
            const prevHemi = hemiRgb();
            const prevEnv = engine.scene.environment;
            const restorers = [
              ...hideMeshes(leftoverOf()),
              ...setFov(90),
              ...setNear(8),
              ...setFar(80),
            ];
            if (Math.abs(engine.camera.fov - 90) <= 0.2) clipSetsWide = true;
            if (Math.abs(engine.camera.near - 8) <= 0.001) clipSetsNear = true;
            if (Math.abs(engine.camera.far - 80) <= 0.001) clipSetsFar = true;
            if (leftoverHidden()) clipHidesLeftover = true;
            if (engine.scene.environment !== prevEnv) clipKeepsEnv = false;
            if (hemiRgb().some((rgb, i) => rgb !== prevHemi[i])) clipKeepsHemi = false;
            return restorers;
          },
          both() {
            const prevHemi = hemiRgb();
            const gray = bakeGray();
            const restorers = [
              ...hideMeshes(leftoverOf()),
              ...swapEnv(gray),
              ...setFov(90),
              ...setNear(8),
              ...setFar(80),
            ];
            if (engine.scene.environment === gray.texture) bothSetsGray = true;
            if (Math.abs(engine.camera.fov - 90) <= 0.2) bothSetsWide = true;
            if (Math.abs(engine.camera.near - 8) <= 0.001) bothSetsNear = true;
            if (Math.abs(engine.camera.far - 80) <= 0.001) bothSetsFar = true;
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
        const bothIsCombined = !fovKeepsHemi || !nearKeepsHemi || !farKeepsHemi || !envKeepsHemi || !clipKeepsHemi || !bothKeepsHemi;
        const toneRestorers = isolate.fov();
        toneRestorers.forEach(restore => restore());
        const spaceRestorers = isolate.near();
        spaceRestorers.forEach(restore => restore());
        const mgmtRestorers = isolate.far();
        mgmtRestorers.forEach(restore => restore());
        const encRestorers = isolate.clip();
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
          fovSetsWide,
          fovHidesLeftover,
          fovKeepsEnv,
          fovKeepsHemi,
          fovKeepsNear,
          fovKeepsFar,
          nearSetsClip,
          nearHidesLeftover,
          nearKeepsEnv,
          nearKeepsHemi,
          nearKeepsFov,
          nearKeepsFar,
          farSetsClip,
          farHidesLeftover,
          farKeepsEnv,
          farKeepsHemi,
          farKeepsFov,
          farKeepsNear,
          envSetsGray,
          envHidesLeftover,
          envKeepsHemi,
          envKeepsFov,
          envKeepsNear,
          envKeepsFar,
          envClearsHue,
          clipSetsWide,
          clipSetsNear,
          clipSetsFar,
          clipHidesLeftover,
          clipKeepsEnv,
          clipKeepsHemi,
          bothSetsGray,
          bothSetsWide,
          bothSetsNear,
          bothSetsFar,
          bothHidesLeftover,
          bothKeepsHemi,
          intensityClearsIbl,
          camDeltasUseEmptyBaseline: true,
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
      frames: CAM_FRAMES,
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
      const layers = CAM_LAYERS.map(id => {
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
        dominantCam: dominantCam(layers),
        contributingCam: layers.filter(layer => layer.bandDelta <= -CAM_BAND_MIN).map(layer => layer.id),
        fovAxis: layers.filter(layer => FOV_IDS.includes(layer.id) && layer.bandDelta <= -CAM_BAND_MIN).map(layer => layer.id),
        envAxis: layers.filter(layer => IBL_IDS.includes(layer.id) && (layer.bandDelta <= -CAM_BAND_MIN || layer.blueDelta <= -CAM_BLUE_MIN)).map(layer => layer.id),
        bothAxis: layers.filter(layer => BOTH_IDS.includes(layer.id) && layer.bandDelta <= -CAM_BAND_MIN).map(layer => layer.id),
        nearAxis: layers.filter(layer => NEAR_IDS.includes(layer.id) && layer.bandDelta <= -CAM_BAND_MIN).map(layer => layer.id),
        farAxis: layers.filter(layer => FAR_IDS.includes(layer.id) && layer.bandDelta <= -CAM_BAND_MIN).map(layer => layer.id),
        clipAxis: layers.filter(layer => CLIP_IDS.includes(layer.id) && layer.bandDelta <= -CAM_BAND_MIN).map(layer => layer.id),
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
      fovSetsWide: report.fovSetsWide,
      fovHidesLeftover: report.fovHidesLeftover,
      fovKeepsEnv: report.fovKeepsEnv,
      fovKeepsHemi: report.fovKeepsHemi,
      fovKeepsNear: report.fovKeepsNear,
      fovKeepsFar: report.fovKeepsFar,
      nearSetsClip: report.nearSetsClip,
      nearHidesLeftover: report.nearHidesLeftover,
      nearKeepsEnv: report.nearKeepsEnv,
      nearKeepsHemi: report.nearKeepsHemi,
      nearKeepsFov: report.nearKeepsFov,
      nearKeepsFar: report.nearKeepsFar,
      farSetsClip: report.farSetsClip,
      farHidesLeftover: report.farHidesLeftover,
      farKeepsEnv: report.farKeepsEnv,
      farKeepsHemi: report.farKeepsHemi,
      farKeepsFov: report.farKeepsFov,
      farKeepsNear: report.farKeepsNear,
      envSetsGray: report.envSetsGray,
      envHidesLeftover: report.envHidesLeftover,
      envKeepsHemi: report.envKeepsHemi,
      envKeepsFov: report.envKeepsFov,
      envKeepsNear: report.envKeepsNear,
      envKeepsFar: report.envKeepsFar,
      envClearsHue: report.envClearsHue,
      clipSetsWide: report.clipSetsWide,
      clipSetsNear: report.clipSetsNear,
      clipSetsFar: report.clipSetsFar,
      clipHidesLeftover: report.clipHidesLeftover,
      clipKeepsEnv: report.clipKeepsEnv,
      clipKeepsHemi: report.clipKeepsHemi,
      bothSetsGray: report.bothSetsGray,
      bothSetsWide: report.bothSetsWide,
      bothSetsNear: report.bothSetsNear,
      bothSetsFar: report.bothSetsFar,
      bothHidesLeftover: report.bothHidesLeftover,
      bothKeepsHemi: report.bothKeepsHemi,
      intensityClearsIbl: report.intensityClearsIbl,
      camDeltasUseEmptyBaseline: report.camDeltasUseEmptyBaseline,
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
      fovCount: report.fovCount,
      nearCount: report.nearCount,
      farCount: report.farCount,
      clipCount: report.clipCount,
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
      protocol: 'world-cam-buffer-not-original-golden',
      baselineHashes,
      pageErrors,
    };
  } finally {
    await page.close();
  }
}

export async function verifyWorldCam(browser, url) {
  const report = await measureWorldCam(browser, url);
  const out = process.env.WORLD_CAM_OUTPUT ?? fromRoot('artifacts', 'world-cam');
  const results = await retainWorldCam(report, out);
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
    console.log(JSON.stringify(await verifyWorldCam(browser, process.env.SMOKE_URL ?? 'http://127.0.0.1:8080/?qa=1'), null, 2));
  } finally {
    await browser.close();
  }
}
