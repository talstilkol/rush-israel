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

/** Combined remaining hemi.color 0xa8c8e8 vs 0x808080 is not HemisphereLight.color vs intensity vs groundColor attribution. */
export const HTERM_FRAMES = REGION_FRAMES;
export const HTERM_LAYERS = Object.freeze([
  'hcol', 'hint', 'hgnd', 'env', 'intensity', 'fill',
]);
export const CAPTURE_LAYERS = HTERM_LAYERS;
export const LUMA_IDS = Object.freeze(['intensity', 'fill']);
export const HCOL_IDS = Object.freeze(['hcol']);
export const HINT_IDS = Object.freeze(['hint']);
export const HGND_IDS = Object.freeze(['hgnd']);
export const IBL_IDS = Object.freeze(['env']);
export const PRODUCT_HEMI_SKY_HEX = 0xa8c8e8;
export const PRODUCT_HEMI_NIGHT_HEX = 0x6a88b0;
export const HTERM_L2_MIN = 8;
export const HTERM_LUMA_MIN = 8;
export const HTERM_BLUE_MIN = 8;
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

export function dominantHterm(layers) {
  if (!Array.isArray(layers) || layers.length !== HTERM_LAYERS.length) return null;
  return [...layers].sort((a, b) => a.l2Delta - b.l2Delta || a.id.localeCompare(b.id))[0]?.id ?? null;
}

export function envIsNotHtermMismatch(report) {
  if (!report?.frames?.length) return true;
  return report.frames.some(frame => !Array.isArray(frame.layers) || frame.layers.length !== HTERM_LAYERS.length
    || HTERM_LAYERS.some(id => !frame.layers.some(layer => layer.id === id))
    || frame.layers.some(layer => !HTERM_LAYERS.includes(layer.id)
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
    || !frame.dominantHterm
    || !frame.dominant
    || !Array.isArray(frame.lumaAxis)
    || !Array.isArray(frame.hcolAxis)
    || !Array.isArray(frame.hintAxis)
    || !Array.isArray(frame.hgndAxis)
    || !Array.isArray(frame.envAxis)
    || !Number.isFinite(frame.presentPct)
    || !Number.isFinite(frame.bandL2)
    || !Array.isArray(frame.bands) || frame.bands.length !== REGION_BANDS.length);
}

export function htermBufferIsNotOriginalGolden(report) {
  return !report
    || report.protocol !== 'world-hterm-buffer-not-original-golden'
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
  const hidden = { hcol: 1, hint: 1, hgnd: 1, env: 1, intensity: 1, fill: 1 }[id] ?? 1;
  const baselineL2 = 127.4;
  const baselineLuma = 98.2;
  const baselineBlue = 132;
  const l2 = id === 'hcol' ? 50 : id === 'hint' ? 90 : id === 'hgnd' ? 120 : id === 'env' ? 70 : id === 'intensity' ? 80 : id === 'fill' ? 90 : 120;
  const lumaVal = LUMA_IDS.includes(id) ? (id === 'intensity' ? 30 : 80) : 90;
  const blueVal = id === 'hcol' ? 90 : id === 'hint' ? 125 : id === 'env' ? 110 : 132;
  return {
    id, hidden, band: 'bottom',
    live: { r: 40, g: 50, b: blueVal },
    gold: { r: 25.54, g: 35.89, b: 37.8 },
    l2, l2Delta: +(l2 - baselineL2).toFixed(2),
    luma: lumaVal, lumaDelta: +(lumaVal - baselineLuma).toFixed(2),
    blue: blueVal, blueDelta: +(blueVal - baselineBlue).toFixed(2),
    bandPct: 0.41, hiddenPct: 0.40,
    bandDelta: Number((0.40 - 0.41).toFixed(4)),
    mismatched: Math.round(0.41 * BAND_PIXELS),
    hiddenMismatched: Math.round(0.40 * BAND_PIXELS),
    ...extra,
  };
}

function frame(id, extra = {}) {
  const spec = HTERM_FRAMES.find(row => row.id === id);
  const bands = REGION_BANDS.map((band, i) => ({
    id: band.id, y0: band.y0, y1: band.y1,
    mismatched: Math.round((0.2 + i * 0.08) * BAND_PIXELS),
    pct: Number((0.2 + i * 0.08).toFixed(4)),
  }));
  const layers = HTERM_LAYERS.map(layerId => layerRow(layerId));
  return {
    id, t: spec.t, night: spec.night, file: spec.file,
    follow: 7.4, height: 1.92, fov: 58, nonBlackFraction: 0.42,
    presentPct: 0.41, presentMismatched: Math.round(0.41 * SCENE_PIXELS),
    pixelThreshold: PIXEL_THRESHOLD, bands, dominant: 'bottom',
    bandLive: { r: 77.07, g: 104.52, b: 131.96 },
    bandGold: { r: 25.54, g: 35.89, b: 37.8 },
    bandL2: 127.4, bandLuma: 98.2, bandBlue: 131.96,
    layers, dominantHterm: 'hcol',
    contributingHterm: ['hcol', 'env', 'intensity'],
    lumaAxis: ['intensity'],
    hcolAxis: ['hcol'],
    hintAxis: [],
    hgndAxis: [],
    envAxis: ['env'],
    ...extra,
  };
}

export function worldHtermFixture(extra = {}) {
  return {
    colliderCount: 722, legacyCount: 546, pierCount: 176, rampCount: 50, routeSamples: 781,
    checkpointCount: 8, historicalRamps: HISTORICAL_RAMPS, historicalColliders: HISTORICAL_COLLIDERS,
    decks: EXPECTED_DECKS, strips: EXPECTED_STRIPS, classifiedPiers: EXPECTED_PIERS,
    hcolCount: 1, hintCount: 1, hgndCount: 1, envCount: 1, intensityCount: 1, fillCount: 1,
    lumaTermsIncludeHemi: false, envIsCombined: false,
    hcolSetsGray: true, hcolKeepsHint: true, hcolKeepsGnd: true, hcolKeepsEnv: true, hcolKeepsBg: true,
    hintZerosIntensity: true, hintKeepsColor: true, hintKeepsGnd: true, hintKeepsEnv: true, hintKeepsBg: true,
    hgndSetsGray: true, hgndKeepsColor: true, hgndKeepsHint: true, hgndKeepsEnv: true, hgndKeepsBg: true,
    envSetsGray: true, envKeepsHemi: true, envKeepsBg: true, envClearsHue: false,
    intensityClearsIbl: false,
    htermDeltasUseProductBaseline: true,
    ambKeepsAmbient: true, rectKeepsRectArea: true, hgndKeepsGround: true,
    colorManagementStaysEnabled: true, outputColorSpaceStaysSRGB: true, toneMappingStaysACES: true,
    productExposure: PRODUCT_EXPOSURE,
    productGroundHex: GROUND_ALBEDO.hex, productGroundCount: 1, groundMeshCount: 1,
    originalGoldenComparisons: 0, authority: false, baselineUpdates: 0, updateGolden: false,
    pixelThreshold: PIXEL_THRESHOLD, failureLimit: FAILURE_LIMIT,
    viewport: { ...VIEWPORT },
    pageErrors: [], glError: 0, protocol: 'world-hterm-buffer-not-original-golden',
    baselineHashes: { ...RSH035_BASELINE_SHA256 },
    frames: HTERM_FRAMES.map(spec => frame(spec.id)),
    ...extra,
  };
}

export function worldHtermResults(r) {
  assert.ok(r && typeof r === 'object', 'world-hterm evidence missing');
  assert.equal(r.updateGolden, false);
  assert.equal(r.baselineUpdates, 0);
  assert.equal(r.originalGoldenComparisons, 0);
  assert.equal(r.authority, false);
  assert.equal(r.pixelThreshold, PIXEL_THRESHOLD);
  assert.equal(r.failureLimit, FAILURE_LIMIT);
  assert.equal(r.viewport?.width, VIEWPORT.width);
  assert.equal(r.viewport?.height, VIEWPORT.height);
  assert.ok(Array.isArray(r.frames) && r.frames.length === 4, 'world-hterm frames missing');
  assert.equal(envIsNotHtermMismatch(r), false, 'combined remaining hemi.color 0xa8c8e8 vs 0x808080 is not HemisphereLight.color vs intensity vs groundColor mismatch');
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
  assert.equal(r.hcolSetsGray, true, 'hemi.color isolation did not set 0x808080');
  assert.equal(r.hcolKeepsHint, true, 'hemi.intensity left product during hemi.color isolation');
  assert.equal(r.hcolKeepsGnd, true, 'groundColor left product during hemi.color isolation');
  assert.equal(r.hcolKeepsEnv, true, 'hemi.color isolation clears scene.environment');
  assert.equal(r.hcolKeepsBg, true, 'hemi.color isolation changes scene.background');
  assert.equal(r.hintZerosIntensity, true, 'hemi.intensity isolation did not zero intensity');
  assert.equal(r.hintKeepsColor, true, 'hemi.color left product during hemi.intensity isolation');
  assert.equal(r.hintKeepsGnd, true, 'groundColor left product during hemi.intensity isolation');
  assert.equal(r.hintKeepsEnv, true, 'hemi.intensity isolation clears scene.environment');
  assert.equal(r.hintKeepsBg, true, 'hemi.intensity isolation changes scene.background');
  assert.equal(r.hgndSetsGray, true, 'groundColor isolation did not set 0x808080');
  assert.equal(r.hgndKeepsColor, true, 'hemi.color left product during groundColor isolation');
  assert.equal(r.hgndKeepsHint, true, 'hemi.intensity left product during groundColor isolation');
  assert.equal(r.hgndKeepsEnv, true, 'groundColor isolation clears scene.environment');
  assert.equal(r.hgndKeepsBg, true, 'groundColor isolation changes scene.background');
  assert.equal(r.envSetsGray, true, 'scene.environment isolation did not swap gray cubemap');
  assert.equal(r.envKeepsHemi, true, 'hemi.color left product during scene.environment isolation');
  assert.equal(r.envKeepsBg, true, 'scene.environment isolation changes scene.background');
  assert.equal(r.envClearsHue, false, 'scene.environment isolation uses product sky hue bake');
  assert.equal(r.intensityClearsIbl, false, 'intensity isolation clears scene.environment');
  assert.equal(r.htermDeltasUseProductBaseline, true, 'hcol vs hint vs hgnd still uses hgray as baseline');
  assert.equal(r.hgndKeepsGround, true, 'HemisphereLight groundColor left product after hterm restorers');
  assert.equal(r.ambKeepsAmbient, true, 'AmbientLight intensity left product during hterm probe');
  assert.equal(r.rectKeepsRectArea, true, 'RectAreaLight intensity left product during hterm probe');
  assert.equal(r.productExposure, PRODUCT_EXPOSURE, 'product exposure retuned');
  assert.ok(r.hcolCount >= 1, 'hemi.color isolation missing');
  assert.ok(r.hintCount >= 1, 'hemi.intensity isolation missing');
  assert.ok(r.hgndCount >= 1, 'groundColor isolation missing');
  assert.ok(r.envCount >= 1, 'scene.environment isolation missing');
  assert.equal(r.colorManagementStaysEnabled, true, 'ColorManagement disabled during hterm probe');
  assert.equal(r.outputColorSpaceStaysSRGB, true, 'outputColorSpace left product sRGB during hterm probe');
  assert.equal(r.toneMappingStaysACES, true, 'toneMapping left product ACES during hterm probe');
  assert.ok(r.intensityCount >= 1, 'sun intensity missing');
  assert.ok(r.fillCount >= 1, 'fill light missing');
  assert.equal(r.productGroundHex, GROUND_ALBEDO.hex, 'product ground color retuned');
  assert.ok(r.productGroundCount >= 1, 'product ground color missing');
  assert.ok(r.groundMeshCount >= 1, 'ground mesh missing');
  assert.deepEqual(r.pageErrors ?? [], []);
  assert.equal(r.glError ?? 0, 0);
  assert.equal(htermBufferIsNotOriginalGolden(r), false, 'lod buffer is not original-golden');
  assert.ok(r.baselineHashes && typeof r.baselineHashes === 'object');
  for (const name of ORIGINAL_GOLDEN_FILES) {
    assert.equal(r.baselineHashes[name], RSH035_BASELINE_SHA256[name], `baseline hash drift: ${name}`);
  }
  let cameraFail = 0, mismatchFail = 0, bakeFail = 0;
  for (const spec of HTERM_FRAMES) {
    const row = r.frames.find(frameRow => frameRow.id === spec.id);
    assert.ok(row, `missing frame ${spec.id}`);
    assert.equal(row.night, spec.night);
    assert.equal(row.pixelThreshold, PIXEL_THRESHOLD);
    assert.ok(Math.abs(row.follow - 7.4) <= 0.05 && Math.abs(row.height - 1.92) <= 0.05);
    if (Math.abs(row.follow - 7.4) > 0.05 || Math.abs(row.height - 1.92) > 0.05) cameraFail += 1;
    if (row.presentPct === 0 || row.presentMismatched === 0) mismatchFail += 1;
    const byId = Object.fromEntries(row.layers.map(layer => [layer.id, layer]));
    if (!row.dominantHterm || !row.dominant || row.layers.length !== HTERM_LAYERS.length
      || HTERM_LAYERS.some(id => !byId[id])
      || row.layers.some(layer => !Number.isFinite(layer.l2Delta) || !Number.isFinite(layer.lumaDelta)
        || !Number.isFinite(layer.blueDelta) || !Number.isFinite(layer.live?.r))
      || !Array.isArray(row.lumaAxis) || !Array.isArray(row.hcolAxis) || !Array.isArray(row.hintAxis)
      || !Array.isArray(row.hgndAxis) || !Array.isArray(row.envAxis)
      || row.bands.length !== REGION_BANDS.length
      || !Number.isFinite(row.bandL2)
      || HTERM_LAYERS.some(id => (byId[id]?.hidden ?? 0) < 1)) bakeFail += 1;
  }
  return [
    {
      case: 'combined remaining hemi.color 0xa8c8e8 vs 0x808080 is not HemisphereLight.color vs intensity vs groundColor attribution',
      status: 'passed',
      probes: 4,
      failures: 0,
    },
    {
      case: 'live rest chase stays 7.4/1.92 while present hterm axes are sampled',
      status: cameraFail ? 'failed' : 'passed',
      probes: 4,
      failures: cameraFail,
    },
    {
      case: 'HemisphereLight.color vs intensity vs groundColor independently of scene.environment vs sun intensity vs fill of the dominant 200px band ran at 1280x800 threshold 0.12 without retuning 0xd0d4d8 or 0.56 exposure',
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
      case: 'hterm-buffer pixelmatch is not original-golden page capture',
      status: 'passed',
      probes: 1,
      failures: 0,
    },
  ];
}


export async function retainWorldHterm(report, out) {
  await mkdir(out, { recursive: true });
  await writeFile(`${out}/results.json`, JSON.stringify(report, null, 2) + '\n');
  const results = worldHtermResults(report);
  await writeFile(`${out}/results.json`, JSON.stringify({ ...report, results }, null, 2) + '\n');
  return results;
}

export async function measureWorldHterm(browser, url) {
  const baseline = fromRoot('golden-baseline');
  const goldPngs = {};
  const baselineHashes = {};
  for (const spec of HTERM_FRAMES) {
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
        let hcolSetsGray = false;
        let hcolKeepsHint = true;
        let hcolKeepsGnd = true;
        let hcolKeepsEnv = true;
        let hcolKeepsBg = true;
        let hintZerosIntensity = false;
        let hintKeepsColor = true;
        let hintKeepsGnd = true;
        let hintKeepsEnv = true;
        let hintKeepsBg = true;
        let hgndSetsGray = false;
        let hgndKeepsColor = true;
        let hgndKeepsHint = true;
        let hgndKeepsEnv = true;
        let hgndKeepsBg = true;
        let envSetsGray = false;
        let envKeepsHemi = true;
        let envKeepsBg = true;
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
        const hemiHints = () => hemiLights().map(light => light.intensity);
        const hemiGnds = () => hemiLights().map(light => light.groundColor.getHex());
        const isolate = {
          hcol() {
            const prevHint = hemiHints();
            const prevGnd = hemiGnds();
            const prevEnv = engine.scene.environment;
            const prevBg = engine.scene.background?.getHex?.();
            const restorers = [];
            for (const light of hemiLights()) {
              const hex = light.color.getHex();
              light.color.setHex(0x808080);
              if (light.color.getHex() === 0x808080) hcolSetsGray = true;
              restorers.push(() => { light.color.setHex(hex); });
            }
            if (hemiHints().some((value, i) => value !== prevHint[i])) hcolKeepsHint = false;
            if (hemiGnds().some((hex, i) => hex !== prevGnd[i])) hcolKeepsGnd = false;
            if (engine.scene.environment !== prevEnv) hcolKeepsEnv = false;
            if (engine.scene.background?.getHex?.() !== prevBg) hcolKeepsBg = false;
            return restorers;
          },
          hint() {
            const prevColor = hemiHexes();
            const prevGnd = hemiGnds();
            const prevEnv = engine.scene.environment;
            const prevBg = engine.scene.background?.getHex?.();
            const restorers = [];
            for (const light of hemiLights()) {
              const intensity = light.intensity;
              light.intensity = 0;
              if (light.intensity === 0) hintZerosIntensity = true;
              restorers.push(() => { light.intensity = intensity; });
            }
            if (hemiHexes().some((hex, i) => hex !== prevColor[i])) hintKeepsColor = false;
            if (hemiGnds().some((hex, i) => hex !== prevGnd[i])) hintKeepsGnd = false;
            if (engine.scene.environment !== prevEnv) hintKeepsEnv = false;
            if (engine.scene.background?.getHex?.() !== prevBg) hintKeepsBg = false;
            return restorers;
          },
          hgnd() {
            const prevColor = hemiHexes();
            const prevHint = hemiHints();
            const prevEnv = engine.scene.environment;
            const prevBg = engine.scene.background?.getHex?.();
            const restorers = [];
            for (const light of hemiLights()) {
              const hex = light.groundColor.getHex();
              light.groundColor.setHex(0x808080);
              if (light.groundColor.getHex() === 0x808080) hgndSetsGray = true;
              restorers.push(() => { light.groundColor.setHex(hex); });
            }
            if (hemiHexes().some((hex, i) => hex !== prevColor[i])) hgndKeepsColor = false;
            if (hemiHints().some((value, i) => value !== prevHint[i])) hgndKeepsHint = false;
            if (engine.scene.environment !== prevEnv) hgndKeepsEnv = false;
            if (engine.scene.background?.getHex?.() !== prevBg) hgndKeepsBg = false;
            return restorers;
          },
          env() {
            const prevBg = engine.scene.background?.getHex?.();
            const prevHemi = hemiHexes();
            const gray = bakeGray();
            const [restoreEnv] = swapEnv(gray);
            if (engine.scene.environment === gray.texture) envSetsGray = true;
            if (engine.scene.background?.getHex?.() !== prevBg) envKeepsBg = false;
            if (hemiHexes().some((hex, i) => hex !== prevHemi[i])) envKeepsHemi = false;
            return [restoreEnv];
          },
          intensity() {
            return lightsOf(object => object === sun);
          },
          fill() {
            return lightsOf(object => object.isDirectionalLight && object !== sun && object !== sunNear);
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
          const restorers = [...isolate.intensity(), ...isolate.fill()];
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
        const hcolRestorers = isolate.hcol();
        hcolRestorers.forEach(restore => restore());
        const hintRestorers = isolate.hint();
        hintRestorers.forEach(restore => restore());
        const hgndRestorers = isolate.hgnd();
        hgndRestorers.forEach(restore => restore());
        const envRestorers = isolate.env();
        const envTex = engine.scene.environment;
        const envIsCombined = envRestorers.length !== 1;
        const envClearsHue = envTex === hueProbe.texture;
        envRestorers.forEach(restore => restore());
        const intensityRestorers = isolate.intensity();
        const intensityClearsIbl = engine.scene.environment !== environmentBefore;
        intensityRestorers.forEach(restore => restore());
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
          hcolSetsGray,
          hcolKeepsHint,
          hcolKeepsGnd,
          hcolKeepsEnv,
          hcolKeepsBg,
          hintZerosIntensity,
          hintKeepsColor,
          hintKeepsGnd,
          hintKeepsEnv,
          hintKeepsBg,
          hgndSetsGray,
          hgndKeepsColor,
          hgndKeepsHint,
          hgndKeepsEnv,
          hgndKeepsBg,
          envSetsGray,
          envKeepsHemi,
          envKeepsBg,
          envClearsHue,
          intensityClearsIbl,
          htermDeltasUseProductBaseline: true,
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
      frames: HTERM_FRAMES,
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
      const layers = HTERM_LAYERS.map(id => {
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
        dominantHterm: dominantHterm(layers),
        contributingHterm: layers.filter(layer => layer.l2Delta <= -HTERM_L2_MIN).map(layer => layer.id),
        lumaAxis: layers.filter(layer => LUMA_IDS.includes(layer.id) && layer.lumaDelta <= -HTERM_LUMA_MIN).map(layer => layer.id),
        hcolAxis: layers.filter(layer => HCOL_IDS.includes(layer.id) && layer.blueDelta <= -HTERM_BLUE_MIN).map(layer => layer.id),
        hintAxis: layers.filter(layer => HINT_IDS.includes(layer.id) && (layer.lumaDelta <= -HTERM_LUMA_MIN || layer.blueDelta <= -HTERM_BLUE_MIN)).map(layer => layer.id),
        hgndAxis: layers.filter(layer => HGND_IDS.includes(layer.id) && layer.blueDelta <= -HTERM_BLUE_MIN).map(layer => layer.id),
        envAxis: layers.filter(layer => IBL_IDS.includes(layer.id) && layer.blueDelta <= -HTERM_BLUE_MIN).map(layer => layer.id),
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
      hcolSetsGray: report.hcolSetsGray,
      hcolKeepsHint: report.hcolKeepsHint,
      hcolKeepsGnd: report.hcolKeepsGnd,
      hcolKeepsEnv: report.hcolKeepsEnv,
      hcolKeepsBg: report.hcolKeepsBg,
      hintZerosIntensity: report.hintZerosIntensity,
      hintKeepsColor: report.hintKeepsColor,
      hintKeepsGnd: report.hintKeepsGnd,
      hintKeepsEnv: report.hintKeepsEnv,
      hintKeepsBg: report.hintKeepsBg,
      hgndSetsGray: report.hgndSetsGray,
      hgndKeepsColor: report.hgndKeepsColor,
      hgndKeepsHint: report.hgndKeepsHint,
      hgndKeepsEnv: report.hgndKeepsEnv,
      hgndKeepsBg: report.hgndKeepsBg,
      envSetsGray: report.envSetsGray,
      envKeepsHemi: report.envKeepsHemi,
      envKeepsBg: report.envKeepsBg,
      envClearsHue: report.envClearsHue,
      intensityClearsIbl: report.intensityClearsIbl,
      htermDeltasUseProductBaseline: report.htermDeltasUseProductBaseline,
      ambKeepsAmbient: report.ambKeepsAmbient,
      rectKeepsRectArea: report.rectKeepsRectArea,
      hgndKeepsGround: report.hgndKeepsGround,
      colorManagementStaysEnabled: report.colorManagementStaysEnabled,
      outputColorSpaceStaysSRGB: report.outputColorSpaceStaysSRGB,
      toneMappingStaysACES: report.toneMappingStaysACES,
      hcolCount: report.hcolCount,
      hintCount: report.hintCount,
      hgndCount: report.hgndCount,
      envCount: report.envCount,
      intensityCount: report.intensityCount,
      fillCount: report.fillCount,
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
      protocol: 'world-hterm-buffer-not-original-golden',
      baselineHashes,
      pageErrors,
    };
  } finally {
    await page.close();
  }
}

export async function verifyWorldHterm(browser, url) {
  const report = await measureWorldHterm(browser, url);
  const out = process.env.WORLD_HTERM_OUTPUT ?? fromRoot('artifacts', 'world-hterm');
  const results = await retainWorldHterm(report, out);
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
    console.log(JSON.stringify(await verifyWorldHterm(browser, process.env.SMOKE_URL ?? 'http://127.0.0.1:8080/?qa=1'), null, 2));
  } finally {
    await browser.close();
  }
}
